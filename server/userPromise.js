var User = require('../models/User');
var Article = require('../models/Article');
var Comment = require('../models/Comment');
var Collect = require('../models/Collect');
var Action = require('../models/Action');
var Topic = require('../models/Topic');

function sort(arr,prop){
  arr.sort((a,b)=>{
    var time1 = Date.parse(a[prop]);
    var time2 = Date.parse(b[prop]);
    return time2 - time1
  })
  return arr; 
}

function selectImgByUniquekey(content){
  var pattern = /<img[^>]*src=([^\s]*)\s[^>]*>/g;
  var result;
  var multiImg = [];
  result = pattern.exec(content);
  
  while (result) {
    multiImg.push(result[1].substring(1,result[1].length-1));
    result = pattern.exec(content);
  }
  //console.log(multiImg);
  return multiImg;
}

function translateUserCollect(collect,resolve){    
    var obj = {};
    obj.tag = collect.tag;
    obj.createtime = collect.createtime;
    obj.userid = collect.userid;
    obj.defaultCollect = collect.defaultCollect;
    obj.privacy = collect.privacy;
    obj.followedBy = collect.followedBy;
    obj.shareBy = collect.shareBy;
    obj.id = collect._id;

    var contentIds = collect.content.map(item=>item.id);
    var contents = collect.content.map(item=>{var obj={};obj.id=item._id;obj.articleId=item.id;return obj});

    Article.find({articleId:{$in:contentIds}},(err,articles)=>{
        
        contents = contents.map(item=>{

            for(var i=0,len=articles.length;i<len;i++){
              var article = articles[i];
              if (item.articleId === article.articleId){

                item.articleId = article.articleId;
                item.title = article.title;
                item.newstime = article.newstime;
                item.thumbnails = article.thumbnails;
                item.auth = article.auth;
                item.type = article.type;
                
                break;
              }
            }
            return item;
        })
        obj.content = contents;
        resolve(obj);
    })
}


function getUserFollows(ids,resolve){
    User.find({_id:{$in:ids}},(err,users)=>{
        var data = users.map(item=>{
            var obj = {};
            obj.username = item.username;
            obj.level = item.level;
            obj.userFans = item.userFans.length;
            obj.userFollow = item.userFollow.length;
            obj.id = item._id;
            obj.description = item.description;
            return obj;
        })
        resolve(data);
    })    
}

function _translateAction(action,resolve){
    console.log(action);
    var promise = new Promise((resolve,reject)=>{
        User.findOne({_id:action.userid},(err,user)=>{
            var obj = {};
            obj.username = user.username;
            obj.avatar = user.userImage;
            obj.userLevel = user.level;
            obj.contentType = action.contentType;
            obj.contentId = action.contentId;
            obj.composeAction = action.composeAction;
            obj.isCreated = action.isCreated;
            obj.date = action.date;
            obj.text = action.text;
            obj.images = action.images;
            obj.value = action.value;
            obj.userid = action.userid;
            obj.id = action._id;
            obj.innerAction = action.innerAction;
            obj.likeUsers = action.likeUsers;
            obj.dislikeUsers = action.dislikeUsers;
            obj.shareBy = action.shareBy;
            resolve(obj);
        })
    });
    promise.then(action=>{
        Comment.find({uniquekey:action.id},(err,comments)=>{
            action.comments = comments.length;
            resolve(action);
        })
    })
    
}

function getActionsInfo(actions,resolve){
    var allPromises = [];
    for(var i=0,len=actions.length;i<len;i++){
      (function(i){
          var promise = new Promise((resolve,reject)=>{
              _translateAction(actions[i],resolve);
          });
          allPromises.push(promise);
      })(i)
    }
    Promise.all(allPromises)
      .then(data=>{
          resolve(sort(data,'date'));
      })   
}

function getUserActions(userid,resolve){    
    Action.find({userid:userid},(err,actions)=>{
        getActionsInfo(actions,resolve);  
    })
}

function getUserComments(username,resolve){

  var _filter = {
        $or:[
          {'username':username},
          {'replies.fromUser':username}
        ]
      };

    Comment.find(_filter,(err,comments)=>{
      var data = [];
      var ids = comments.map(item=>item.uniquekey);

      data = comments.map(item=>{
        //  判断是否是一级父评论
        var obj = {};
        if(item.username === username) {
          
          obj['date'] = item.date;
          obj['avatar'] = item.avatar;
          obj['username'] = item.username;
          obj['content'] = item.content;
          obj['commentType'] = item.commentType;
          obj['uniquekey'] = item.uniquekey;
          obj['_id'] = item._id;
          obj['like'] = item.like;
          obj['dislike'] = item.dislike;
          obj['replies'] = item.replies.length;

        } else {
          //  二级子评论
          var replies = item.replies;
          for(var i=0,len=replies.length;i<len;i++){
            var reply = replies[i];
            if(reply.fromUser === username ) {
              obj['fromSubTextarea'] = true;
              obj['date'] = reply.date;
              obj['like'] = reply.like;
              obj['dislike'] = reply.dislike;
              obj['fromUser'] = reply.fromUser;
              obj['toUser'] = reply.toUser;
              obj['avatar'] = reply.avatar;
              obj['commentType'] = reply.commentType;
              obj['content'] = reply.content;
              obj['uniquekey'] = item.uniquekey;
              obj['_id'] = reply._id;
              obj['fathercommentid'] = item._id;
              break;
            }
          }

        }
        return obj        
      })
      resolve(data);
      
    })
}

function getUserHistory(userid,resolve){

    User.findOne({_id:userid},(err,user)=>{
        var data = [];
        
        var ids = user.userHistory.map(item=>{
            var obj = {};
            obj.viewtime = item.viewtime;
            obj.articleId = item.articleId;
            data.push(obj);
            return item.articleId
        })
        
        Article.find({'articleId':{$in:ids}},(err,articles)=>{           
            data = data.map(item=>{
                articles.map(article=>{

                    if(item.articleId === article.articleId){
                        item.articleId = article.articleId;
                        item.auth = article.auth;
                        item.title = article.title;             
                        item.thumbnails = article.thumbnails;
                        item.newstime = article.newstime;
                        item.type = article.type;
                    }
                })                
                return item;               
            })
            
            resolve(sort(data,'viewtime'));
        })
    })
}

function getUserCollect(userid,resolve){
    Collect.find({userid:userid},(err,collects)=>{
        var allPromise = [];
        for(var i=0,len=collects.length;i<len;i++){
          (function(i){
              var collect = collects[i];
              var promise = new Promise((resolve,reject)=>{
                  translateUserCollect(collect,resolve);
              });
              allPromise.push(promise)
          })(i)
        }
        Promise.all(allPromise)
              .then(data=>{
                  resolve(data);
              })      
    })
}

function getUserActionMsg(msgDoc,resolve){
    var obj = {},commentid = msgDoc.commentid;
    obj.username = msgDoc.fromUser;
    obj._id = msgDoc._id;
    obj.date = msgDoc.msgtime;
    obj.isRead = msgDoc.isRead;
    resolve(obj);
    

}

module.exports = {
    getUserFollows,
    getUserActions,
    getUserComments,
    getUserHistory,
    getUserCollect,
    getUserActionMsg,
    getActionsInfo
}