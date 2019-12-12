var Article = require('../models/Article');
var Comment = require('../models/Comment');
var User = require('../models/User');
var config = require('../config/config.js');
var secret = require('../src/utils/secret');

/*

  数据库初始化逻辑
*/
function reset(){
    Article.updateMany({},{$set:{shareBy:[],viewUsers:[]}},(err,result)=>{

    });

}
/*
    去掉文章里过期的图片资源
*/
function deleteArticleImg(content){
  var pattern = /<img.*?>/g;
  var result = '';
  if (content && content.replace){
    result  = content.replace(pattern,'');
  }
  return result;
}

function _updateContent(doc){
    var prevContent = doc.content;
    var newContent = deleteArticleImg(prevContent);
    Article.updateOne({articleId:doc.articleId},{$set:{content:newContent}},(err,result)=>{
        console.log(result);
    })
}

function changeArticlesContents(){
    Article.find({},(err,articles)=>{
        for(var i=0,len=articles.length;i<len;i++){
            (function(i){
                var article = articles[i];
                _updateContent(article);
            })(i)
        }
    })
}


function _singleArticleDoc(id){
    var arr = [];
    for(var i=0;i<3;i++){
        var filename = config.uploadPath+'/thumbnails/img'+Math.floor(Math.random()*168)+'.jpeg';
        arr.push(filename);
    }    
    Article.updateOne({_id:id},{$set:{thumbnails:arr}},(err,result)=>{
      //console.log(result);
    })

}

function addThumbnails(){ 
  Article.find({},(err,articles)=>{
      for(var i=0,len=articles.length;i<len;i++){
          _singleArticleDoc(articles[i]._id);
      }
  }) 
}

function resetArticles(){
    Article.updateMany({},{$set:{shareBy:[],viewUsers:[]}},(err,result)=>{
      console.log(result);
    })
}

function _createUser(i, resolve){
    var date = new Date().toString();
    var user = new User({
        username:`测试用户0${i<10?0+i:i}`,
        password:secret.encrypt('123'),
        registerTime:date
    });
    user.save()
      .then(()=>{
          resolve(user);
      })
}
//  生成20个测试用户
function createTestUsers(num, resolve){
    var afterUsersCreated = [];
    for(var i=0;i<num;i++){
        (function(i){
            var promise = new Promise((resolve,reject)=>{
                _createUser(i, resolve);
            });
            afterUsersCreated.push(promise);
        })(i)     
    }
    Promise.all(afterUsersCreated)
      .then(users=>{
          resolve(users);
      })
}


function createComment(user, articleId, resolve){
    var { username, userImage } = user;
    var date = new Date().toString();
    var comment = new Comment({
        username:username,
        avatar:userImage,
        commentType:'news',
        date,
        content:`测试内容test---${username}`,
        uniquekey:articleId
    });
    comment.save()
      .then(()=>{
          resolve()
      })
}

function writeToArticle(users, articleId, resolve){
    var afterCommentCreated = [];
    for(var i=0,len=users.length;i<len;i++){
        (function(i){
            var user = users[i];
            var promise = new Promise((resolve, reject)=>{
                createComment(user, articleId, resolve);
            });
            afterCommentCreated.push(promise);
        })(i)
    }
    Promise.all(afterCommentCreated)
      .then(()=>{
          resolve();
      })
}

function createTestData(num){
    var promise = new Promise((resolve,reject)=>{
        createTestUsers(num, resolve);
    });

    promise.then(users=>{
        Article.find({},(err,articles)=>{
            var afterWriteToArticles = [];
            for(var i=0,len=articles.length;i<len;i++){
                (function(i){
                    var articleId = articles[i].articleId;
                    var promise = new Promise((resolve,reject)=>{
                        writeToArticle(users, articleId, resolve);
                    });
                    afterWriteToArticles.push(promise);
                })(i)
            }
            Promise.all(afterWriteToArticles)
              .then(()=>{
                  console.log('testData is finished!');
              })
            
        })
    })

}

module.exports = {
    changeArticlesContents,
    addThumbnails,
    resetArticles,
    createTestData,
    reset
}