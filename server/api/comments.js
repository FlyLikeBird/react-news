var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var util = require('../util');
var Comment = require('../../models/Comment');
var User = require('../../models/User');
var Article = require('../../models/Article');
var Topic = require('../../models/Topic');
var Action  = require('../../models/Action');
var config = require('../../config/config');
var userPromise = require('../userPromise');

function sortList(arr){
  arr.sort((a,b)=>{
    var time1 = Date.parse(a.date);
    var time2 = Date.parse(b.date);
    return time2 - time1
  })
  return arr;
}


router.get('/addcomment', (req,res)=>{
  var { userid, uniquekey, content, images, commentType } = req.query;
  images = images ? images : [];
  var comment = new Comment({
      fromUser:userid,
      related:uniquekey,
      content:content,
      isSub:false,
      onModel:commentType,
      images,
      date:new Date().toString()
  });

  comment.save(function(err){   
      var onModel = comment.onModel;
      getComments(null, comment._id, res, onModel, uniquekey);
      User.findOne({_id:userid},(err,user)=>{
          var prevLevel = user.level;
          prevLevel += 5;
          User.updateOne({_id:userid},{$set:{level:prevLevel}},(err,result)=>{});
      })
  })

})

router.get('/addreplycomment',(req,res)=>{
    var { parentcommentid, userid, replyTo, uniquekey, images, commentType, content, isSub } = req.query;
    images = images ? images : [];
    var date = new Date().toString();
    // 判断是父评论还是子评论
    var fromSubTextarea = Boolean(isSub) ? true : false; 
    var comment = new Comment({
        fromUser:userid,
        replyTo,
        content,        
        onModel:commentType,
        parent:parentcommentid,
        images,
        isSub:true,
        date,
        related:uniquekey,
        fromSubTextarea
    });

    comment.save()
        .then(()=>{
            Comment.updateOne({_id:parentcommentid},{$push:{replies:comment._id}},(err,result)=>{                              
                var onModel = comment.onModel;
                getComments(true, parentcommentid, res, onModel, uniquekey);              
            })
        })
    
  
})

function getComments( forOneComment, commentid, res, onModel, related, pageNum=1, orderBy='time'){
    var skip = (Number(pageNum) -1 ) < 0 ? 0 : (Number(pageNum) -1) * 10; 
    var data = {
        total:0,
        commentid,
        comments:[]
    };
    var orderOption;
    switch(orderBy){     
      case 'timeInvert':
        orderOption = {
          '_id':1
        };
        break;
      case 'hot':
        orderOption = {
          'like':-1
          
        };
        break;
      case 'hotInvert':
        orderOption = {
          'like':1
        }
        break;
      default:
        orderOption = {
          '_id':-1
        }
    };
    var filter = forOneComment ? { _id:commentid} : { $and:[{related:related},{isSub:false}]};
    Comment.count({related})
      .then(count=>{
        data.total = count;
        Comment.find(filter)
          .populate('fromUser','userImage username')
          .populate({path:'likeUsers.user',select:'userImage username'})
          .populate({path:'dislikeUsers.user',select:'userImage username'})
          .populate({
              path:'shareBy',
              populate:{path:'user',select:'userImage username'},
              select:'value user date'
          })
          .populate({
              path:'replies',
              populate:[
                  {path:'fromUser', select:'userImage username'},
                  {
                      path:'replyTo',
                      select:'fromUser',
                      populate:{ path:'fromUser', select:'username'}
                  },
                  {path:'likeUsers.user', select:'userImage username'},
                  {path:'dislikeUsers.user', select:'userImage username'},
                  {
                      path:'shareBy',
                      populate:{path:'user',select:'userImage username'},
                      select:'value date user'
                  }
              ]
          })   
          .sort(orderOption)
          .skip(skip)
          .limit(10)
          .then(comments=>{ 
              console.log(comments);          
              data.comments = comments;
              if (!onModel || onModel =='Article') {
                 util.responseClient(res,200,0,'ok',data);
              } else if ( onModel=='Topic' ) {
                  Topic.updateOne({_id:related},{$inc:{replies:1}},(err,result)=>{
                      userPromise.getTopicContent(res, related, data);
                  });                
              } else if ( onModel=='Action') {
                 Action.updateOne({_id:related},{$inc:{replies:1}},(err,result)=>{
                      userPromise.getActionContent(res, related, data);
                 })
              }
                        
          })
      })
}

router.get('/getcomments',(req,res)=>{
  var { uniquekey, pageNum, orderBy } = req.query;
  getComments( null, null, res, null, uniquekey, pageNum, orderBy );
})

router.get('/getOneComment',(req,res)=>{
    var { commentid } = req.query;
    getComments(true, commentid, res);
})

router.get('/getCommentPagenum',(req,res)=>{
  var { commentid, parentcommentid, uniquekey } = req.query;
  var position = 0,pageNum = 0;
  commentid = parentcommentid ? parentcommentid : commentid ; 
  Comment.find({'related':uniquekey})
      .sort({date:-1})
      .then(comments=>{
          comments.map((item, index)=>{
            if (item._id == commentid){
                position=index;
            }
          });
          position += 1;
          if (position>10) {
            pageNum = Math.floor(index / 10) + 1;
          } else {
            pageNum = 1;
          }
          util.responseClient(res,200,0,'ok',pageNum);
      })
  
})

router.get('/getCommentInfo',(req,res)=>{
    var { commentid } = req.query;
    var data = '';
    Comment.findOne({_id:commentid})
        .populate({ path:'fromUser', select:'username'})
        .populate({
            path:'parent',
            populate:{ path:'fromUser', select:'username'}
        })
        .populate({
            path:'replyTo',
            populate:{ path:'fromUser', select:'username' }
        })
        .then(comment=>{
            if ( comment.parent ){
                data = `@${comment.fromUser.username}:回复@${comment.replyTo.fromUser.username}:${comment.content}//@${comment.parent.fromUser.username}:${comment.parent.content}`
            } else {
                data = `@${comment.fromUser.username}:${comment.content}`;
            }
            util.responseClient(res, 200, 0, 'ok', data);
        })
})

router.get('/operatecomment',(req,res)=>{
    var { action, commentid, isCancel, userid } = req.query;
    var date = new Date().toString();
    var operation = action == 'like' ? 'likeUsers' : 'dislikeUsers'
    if(isCancel){
        Comment.updateOne({_id:commentid},{$pull:{[operation]:{user:userid}}},(err,result)=>{
            Comment.findOne({_id:commentid},{[operation]:1})
              .populate({
                  path:`${operation}.user`,
                  select:'userImage username'
              })
              .then(data=>{
                  util.responseClient(res, 200, 0, 'ok', data);
              })
        })
    } else {
        Comment.updateOne({_id:commentid},{$push:{[operation]:{user:userid,date}}},(err,result)=>{
            Comment.findOne({_id:commentid},{[operation]:1})
                .populate({
                    path:`${operation}.user`,
                    select:'userImage username'
                })
                .then(data=>{
                    util.responseClient(res, 200, 0, 'ok', data);
                })
        })
    }
})


function getUserComments(userid, res){  
    Comment.find({fromUser:userid})
        .populate({path:'fromUser',select:'username userImage'})
        .populate({
            path:'replyTo',
            select:'fromUser',
            populate:{ path:'fromUser', select:'username'}
        })
        .populate({
          path:'related',
          populate:[
              { path:'fromUser',select:'username userImage'},
              { path:'tags',select:'tag'},
              { path:'user', select:'username userImage'},
              { path:'likeUsers.user', select:'username userImage'},
              { path:'dislikeUsers.user', select:'username userImage'},
              { path:'follows.user', select:'username userImage'},
              { path:'shareBy',populate:{path:'user',select:'username userImage'}, select:'user date value'},
              {
                  path:'contentId',
                  populate:[
                      {path:'follows.user', select:'username userImage'},
                      {path:'shareBy', populate:{path:'user', select:'username userImage'}, select:'user date value' },
                      {path:'tags', select:'tag'},
                      {
                          path:'contentId',
                          populate:[
                              { path:'user', select:'username userImage'},
                              { path:'tags', select:'tag'},
                              { path:'follows.user', select:'username userImage'},
                              { path:'shareBy', populate:{ path:'user', select:'username userImage'}, select:'value date user'}
                          ]
                      }
                  ]
              }
          ]                 
        })
        .sort({date:-1})
        .then(comments=>{
          util.responseClient(res, 200, 0, 'ok', comments);
        })   
}

router.get('/getUserComments',(req,res)=>{
    var { userid } = req.query;
    getUserComments(userid, res);
})

function deleteCommmentRelated(onModel, related, num){
    if(onModel=='Topic') {
        Topic.updateOne({_id:related},{$inc:{replies:num}},(err,result)=>{});
    } else if (onModel=='Action'){
        Action.updateOne({_id:related},{$inc:{replies:num}},(err,result)=>{});
    }
}

router.get('/delete',(req,res)=>{
    let { commentid, userid } = req.query;
    Comment.findOne({_id:commentid},(err,comment)=>{
        var { parentcommentid, replies, related, onModel } = comment;
        if (parentcommentid){
            Comment.deleteOne({_id:commentid},(err,result)=>{
                Comment.updateOne({_id:parentcommentid},{$pull:{replies:commentid}},(err)=>{
                    getUserComments(userid, res);
                })
            });
            deleteCommmentRelated(onModel, related, -1);
        } else {
            var num = -(replies.length + 1);
            Comment.deleteMany({_id:{$in:replies}},(err,result)=>{
                Comment.deleteOne({_id:commentid},(err,result)=>{
                    getUserComments(userid, res);
                })
            });
            deleteCommmentRelated(onModel, related, num);
        }
        
    }) 
})

module.exports = router;