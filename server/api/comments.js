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
  let { username, uniquekey, content } = req.body;
  var images = [];
  if(req.files){
        req.files.forEach(item=>{
            var imgUrl = 'http://localhost:8080/comment/'+item.filename;
            images.push(imgUrl);
        });
  }

  User.findOne({'username':username},(err,user)=>{

    let comment = new Comment({
      username:username,
      uniquekey:uniquekey,
      content:content,
      avatar:user.userImage,
      images,
      date:new Date().toString()
    })

    comment.save()
      .then(()=>{
  
        Comment.find({'uniquekey':uniquekey},(err,comments)=>{
            comments.sort((a,b)=>{
                var time1 = Date.parse(a.date);
                var time2 = Date.parse(b.date);
                return time2 - time1;
            })
            util.responseClient(res,200,1,'ok',comments);
        })
        
        User.findOne({'username':username},(err,user)=>{
          var level = user.level;
          level += 5;
          User.updateOne({'username':username},{$set:{level:level}},(err,result)=>{
            
          })
        })
        
      })
  })
})

router.post('/addreplycomment',upload.array('images'),(req,res)=>{
  let { commentid, fromUser, toUser, content, parentcommentid, isSub } = req.body;
  //console.log(commentid,fromUser,toUser, content);
  var images = [];
  if(req.files){
        req.files.forEach(item=>{
            var imgUrl = 'http://localhost:8080/comment/'+item.filename;
            images.push(imgUrl);
        });
  }
  // 判断是父评论还是子评论
  commentid = Boolean(parentcommentid) ? parentcommentid : commentid;
  //console.log(commentid);
  fromSubTextarea = Boolean(isSub) ? true : false;
  //console.log(parentcommentid,commentid);
  User.findOne({'username':fromUser},(err,user)=>{

      Comment.updateOne({_id:commentid},{$push:{replies:{
          fromUser,
          toUser,
          avatar:user.userImage,
          images,
          date:new Date().toString(),
          content,
          fromSubTextarea
  
      }}},(err,result)=>{ 
        if (result) {  
          Comment.findOne({_id:commentid},(err,comment)=>{            
              util.responseClient(res,200,1,'ok',sortList(comment.replies));
          })
            
        }
  
      })
  })
})

router.get('/getcomments',(req,res)=>{
  var { uniquekey, pageNum, orderBy, commentid } = req.query;

  var skip = (Number(pageNum) -1 ) < 0 ? 0 : (Number(pageNum) -1) * 10;
  
  var data = {
    total:0,
    comments:[]
  };
  var orderOption;
  //console.log(orderBy);
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
  }

  Comment.count({uniquekey})
    .then(count=>{
      data.total = count;

      Comment.find({uniquekey})
        .sort(orderOption)
        .skip(skip)
        .limit(10)
        .then(collection=>{
            data.comments = collection;
            util.responseClient(res,200,0,'ok',data);
        })
    })
})

router.get('/getOneComment',(req,res)=>{
    var { commentid } = req.query;
    Comment.findOne({_id:commentid},(err,comment)=>{
      var data = [comment];
      util.responseClient(res,200,0,'ok',data);
    })
})

router.get('/getCommentPagenum',(req,res)=>{
  var { commentid, uniquekey } = req.query;
  util.responseClient(res,200,0,'ok');
})

router.get('/getCommentInfo',(req,res)=>{
    var { commentid, parentcommentid } = req.query;
    var data = '';
    if(!parentcommentid){
        Comment.findOne({_id:commentid},(errr,comment)=>{
          data = `@${comment.username}:${comment.content}`;
          util.responseClient(res,200,0,'ok',data);
        })
    } else {
      Comment.findOne({_id:parentcommentid},(err,comment)=>{
        var replies = comment.replies;
        for(var i=0,len=replies.length;i<len;i++){
          var reply = replies[i];
          if (reply._id == commentid) {     
              data = `@${reply.fromUser}:回复@${reply.toUser}:${reply.content}//@${comment.username}:${comment.content}`;            
              break;
          }
        }
        
        util.responseClient(res,200,0,'ok',data);
      })
    }
})

router.get('/operatecomment',(req,res)=>{
  var { action, commentid, isCancel, parentcommentid } = req.query;
 
  let operate ;
  if (Boolean(isCancel)) {
    operate = -1;
  } else {
     operate = 1;
  }
  
  if (Boolean(parentcommentid)) {
    
    var action = `replies.$.${action}`;
    //console.log(action);
    Comment.updateOne({'_id':parentcommentid,'replies._id':commentid},{$inc:{[action]:operate}},(err,result)=>{
      if (err) throw err;
      if (result){
        
        Comment.findOne({'_id':parentcommentid},(err,comment)=>{
          
          comment.replies.map(reply=>{

            if (reply._id == commentid) {
              var data = {};
              data.like = reply.like;
              data.dislike = reply.dislike;
             
              util.responseClient(res,200,1,'',data); 
            }
          }) ;                
        })
      }      
    })

  } else {

      Comment.updateOne({_id:commentid},{$inc:{[action]:operate}})
       .then(result=>{
         
         if (result) {


           Comment.findOne({_id:commentid})
             .then(comment=>{
               var data = {};
               data.like = comment.like;
               data.dislike = comment.dislike;
               data.replies = comment.replies;
               util.responseClient(res,200,1,'',data);
             })
         }
      
    })
  }    
})

router.get('/delete',(req,res)=>{
  let { commentid, parentcommentid, user } = req.query;
  if (parentcommentid){

      Comment.updateOne({_id:parentcommentid},{$pull:{replies:{_id:commentid}}},err=>{      
          getUserComments(user,res);
      })
  } else {
      Comment.deleteOne({_id:commentid},(err,result)=>{
          getUserComments(user,res);
      })
  }  
})

router.get('/deleteReply',(req,res)=>{
    let { commentid, parentcommentid } = req.query;
    Comment.updateOne({_id:parentcommentid},{$pull:{replies:{_id:commentid}}},(err,result)=>{
        Comment.findOne({_id:parentcommentid},(err,comment)=>{
          util.responseClient(res,200,0,'ok',sortList(comment.replies));
        })
    })
})


module.exports = router;