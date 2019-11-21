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

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = path.resolve('./src'+'/images/comment');
createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        //console.log(file);
        let type = file.mimetype;
         
        cb(null, file.fieldname + '-' + Date.now() +  '.'+type.slice(6,type.length) );  
    }
});
var upload = multer({storage});

function sortList(arr){
  arr.sort((a,b)=>{
    var time1 = Date.parse(a.date);
    var time2 = Date.parse(b.date);
    return time2 - time1
  })
  return arr;
}


router.post('/addcomment',upload.array('images'),(req,res)=>{
  var { userid, uniquekey, content, commentType } = req.body;
  var images = [];
  if(req.files){
        req.files.forEach(item=>{
            var imgUrl = config.uploadPath + '/comment/'+item.filename;
            images.push(imgUrl);
        });
  }
  var comment = new Comment({
      fromUser:userid,
      uniquekey:uniquekey,
      content:content,
      commentType,
      images,
      isSub:false,
      date:new Date().toString()
  });

  comment.save(function(err){
      getComments(comment._id, res, uniquekey);
      User.findOne({_id:userid},(err,user)=>{
          var prevLevel = user.level;
          prevLevel += 5;
          User.updateOne({_id:userid},{$set:{level:prevLevel}},(err,result)=>{});
      })
  })

  
  
})

router.post('/addreplycomment',upload.array('images'),(req,res)=>{
    let { commentid, parentcommentid, fromUser, toUser, uniquekey, commentType, content, isSub } = req.body;
    var images = [];
    var date = new Date().toString();
    if(req.files){
          req.files.forEach(item=>{
              var imgUrl = config.uploadPath + '/comment/'+item.filename;
              images.push(imgUrl);
          });
    }
    // 判断是父评论还是子评论
    commentid = Boolean(parentcommentid) ? parentcommentid : commentid;
    //console.log(commentid);
    var fromSubTextarea = Boolean(isSub) ? true : false; 
    var comment = new Comment({
        fromUser:fromUser,
        toUser:toUser,
        content,
        isSub:true,
        commentType,
        images,
        date,
        uniquekey,
        fromSubTextarea
    });
    comment.save(function(err){
        Comment.updateOne({_id:commentid},{$push:{replies:comment._id}},(err,result)=>{
            Comment.findOne({_id:commentid},{replies:1})
                .populate({
                    path:'replies',
                    populate:[
                        {path:'fromUser', select:'userImage username'},
                        {path:'toUser', select:'userImage username'},
                        {path:'likeUsers.user', select:'userImage username'},
                        {path:'dislikeUsers.user', select:'userImage username'},
                        {
                            path:'shareBy',
                            populate:{path:'user',select:'userImage username'},
                            select:'value date user'
                        }
                    ]
                }) 
                .then(data=>{
                    util.responseClient(res, 200, 0, 'ok', data);
                })
        })
    })

  
})

function getComments( commentid, res, uniquekey, pageNum=1, orderBy='time'){
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
    var filter = {
        $and:[
          {uniquekey:uniquekey},
          {isSub:false}
        ]
    }
    Comment.count(filter)
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
                  {path:'toUser', select:'userImage username'},
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
              data.comments = comments;
              util.responseClient(res,200,0,'ok',data);             
          })
      })
}

router.get('/getcomments',(req,res)=>{
  var { uniquekey, pageNum, orderBy } = req.query;
  getComments( null, res, uniquekey, pageNum, orderBy );
})

router.get('/getOneComment',(req,res)=>{
    var { commentid } = req.query;
    Comment.findOne({_id:commentid},(err,comment)=>{
      comment.replies = sortList(comment.replies);
      util.responseClient(res,200,0,'ok',[comment]);
    })
})

router.get('/getCommentPagenum',(req,res)=>{
  var { commentid, parentcommentid, uniquekey } = req.query;
  var index = 0,pageNum = 0;
  if (parentcommentid){

  } else {
      Comment.find({uniquekey},(err,comments)=>{
          sortList(comments);
          for(var i=0,len=comments.length;i<len;i++){
              if (comments[i]._id == commentid){
                  index = i;
                  break;
              }
          }
          // 判断该评论的页码数
          index += 1;
          if (index>10) {
            pageNum = Math.floor(index / 10) + 1;
          } else {
            pageNum = 1;
          }
          util.responseClient(res,200,0,'ok',pageNum);
      })
  }
  
})

router.get('/getCommentInfo',(req,res)=>{
    var { commentid, parentcommentid } = req.query;
    var data = '';
    if(!parentcommentid){
        Comment.findOne({_id:commentid})
            .populate({path:'fromUser',select:'username'})
            .then(comment=>{
                data = `@${comment.fromUser.username}:${comment.content}`;
                util.responseClient(res, 200, 0, 'ok', data);
            })
    } else {
        Comment.findOne({_id:parentcommentid})
            .populate({path:'fromUser',select:'username'})
            .then(parentcomment=>{
                Comment.findOne({_id:commentid})
                  .populate({path:'fromUser',select:'username'})
                  .populate({path:'toUser',select:'username'})
                  .then(comment=>{
                      data = `@${comment.fromUser.username}:回复@${comment.toUser.username}:${comment.content}//@${parentcomment.fromUser.username}:${parentcomment.content}`;
                      util.responseClient(res, 200, 0, 'ok', data);
                  })
        })
    }
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


router.get('/delete',(req,res)=>{
  let { commentid, parentcommentid } = req.query;
  if (parentcommentid){
      Comment.updateOne({_id:parentcommentid},{$pull:{replies:{_id:commentid}}},(err)=>{
          util.responseClient(res,200,1,'ok');
      });
  } else {
      Comment.deleteOne({_id:commentid},(err)=>{
          util.responseClient(res,200,1,'ok');
      })
  }   
})

module.exports = router;