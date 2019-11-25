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
      related:uniquekey,
      content:content,
      isSub:false,
      onModel:commentType,
      images,
      date:new Date().toString()
  });

  comment.save(function(err){
      getComments(null, comment._id, res, uniquekey);
      User.findOne({_id:userid},(err,user)=>{
          var prevLevel = user.level;
          prevLevel += 5;
          User.updateOne({_id:userid},{$set:{level:prevLevel}},(err,result)=>{});
      })
  })

  
  
})

router.post('/addreplycomment',upload.array('images'),(req,res)=>{
    let { parentcommentid, fromUser, replyTo, uniquekey, commentType, content, isSub } = req.body;
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
    var fromSubTextarea = Boolean(isSub) ? true : false; 
    var comment = new Comment({
        fromUser:fromUser,
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
                Comment.findOne({_id:parentcommentid},{replies:1})
                    .populate({
                        path:'replies',
                        populate:[
                            {path:'fromUser', select:'userImage username'},
                            {
                                path:'replyTo',
                                select:'fromUser',
                                populate:{ path:'fromUser', select:'username'},

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
                    .then(data=>{
                        util.responseClient(res, 200, 0, 'ok', data);
                    })
            })
        })
    
  
})

function getComments( forOneComment, commentid, res, related, pageNum=1, orderBy='time'){
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
          'date':1
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
          'date':-1
        }
    };
    var filter = forOneComment
                  ?
                  {
                    _id:commentid
                  }
                  :
                  {
                    $and:[
                      {related:related},
                      {isSub:false}
                    ]
                  }
                  

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
              data.comments = comments;
              util.responseClient(res,200,0,'ok',data);             
          })
      })
}

router.get('/getcomments',(req,res)=>{
  var { uniquekey, pageNum, orderBy } = req.query;
  getComments( null, null, res, uniquekey, pageNum, orderBy );
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


function getUserComments(userid, res){
  var data = {};
  Comment.count({fromUser:userid})
      .then(count=>{
          data.count = count;
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
                    { path:'follows.user', select:'username userImage'},
                    { path:'shareBy'}
                ],
                select:'auth newstime thumbnails title type fromUser tags follows shareBy'
          
              })
              .sort({date:-1})
              .then(comments=>{
                data.comments = comments;
                util.responseClient(res, 200, 0, 'ok', data);
              })
      })  
}

router.get('/getUserComments',(req,res)=>{
    var { userid } = req.query;
    getUserComments(userid, res);
})

router.get('/delete',(req,res)=>{
    let { commentid, userid } = req.query;
    Comment.findOne({_id:commentid},(err,comment)=>{
        var parentcommentid = comment.parent;
        var replies = comment.replies;
        if (parentcommentid){
            Comment.deleteOne({_id:commentid},(err,result)=>{
                Comment.updateOne({_id:parentcommentid},{$pull:{replies:commentid}},(err)=>{
                    getUserComments(userid, res);
                })
            })
        } else {
            Comment.deleteMany({_id:{$in:replies}},(err,result)=>{
                Comment.deleteOne({_id:commentid},(err,result)=>{
                    getUserComments(userid, res);
                })
            })
        }
    }) 
})

module.exports = router;