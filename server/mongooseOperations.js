var Article = require('../models/Article');
var Comment = require('../models/Comment');
var User = require('../models/User');
var config = require('../config/config.js');
var secret = require('../src/utils/secret');
var config = require('../config/config');

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

/*

  数据库初始化逻辑
*/
function reset(){
    Article.updateMany({},{$set:{shareBy:[],viewUsers:[]}},(err,result)=>{
      console.log(result);
    });
    Topic.updateMany({},{$set:{shareBy:[],follows:[],replies:0}},(err,result)=>{
      console.log(result);
    })
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
        var filename = 'http://image.renshanhang.site/img'+Math.floor(Math.random()*168)+'.jpeg';
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

/*
  生成测试数据
*/
function _createUser(i, managerId, resolve){
    var date = new Date().toString();
    var user = new User({
        username:`测试用户0${i<10?`0${i}`:i}`,
        password:secret.encrypt('123'),
        registerTime:date,
        userFollows:[managerId]
    });
    user.save(()=>{
        resolve(user);
    })
}
//  生成20个测试用户
function createTestUsers(num, resolve){
    var afterUsersCreated = [];
    var createManager = new Promise((resolve, reject)=>{
        var manager = new User({
            username:'React-News平台',
            password:secret.encrypt('1989'),
            registerTime:new Date().toString(),
            userImage:config.uploadPath + '/logo.png'
        });
        manager.save(function(err){
            resolve(manager);
        })
    });

    createManager.then(manager=>{
        for(var i=1;i<=num;i++){        
            var promise = new Promise((resolve,reject)=>{
                _createUser(i, manager._id, resolve);
            });
            afterUsersCreated.push(promise);      
        }

        Promise.all(afterUsersCreated)
          .then(users=>{
              var userIds = users.map(item=>item._id);
              User.updateOne({_id:manager._id},{$push:{userFans:userIds}},(err,result)=>{
                  resolve(users);
              })
          })
    })  
}


function createComment(user, articleId, resolve){
    var date = new Date().toString();
    var comment = new Comment({
        fromUser:user._id,
        onModel:'Article',
        date,
        related:articleId,
        content:`测试内容test---${user.username}`,
    });
    comment.save(()=>{
        resolve();
    })
}

function writeToArticle(users, articleId, resolve){
    var afterCommentCreated = [];
    for(var i=0,len=users.length;i<len;i++){      
        var user = users[i];
        var promise = new Promise((resolve, reject)=>{
            createComment(user, articleId, resolve);
        });
        afterCommentCreated.push(promise);       
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
                var articleId = articles[i]._id;
                var promise = new Promise((resolve,reject)=>{
                    writeToArticle(users, articleId, resolve);
                });
                afterWriteToArticles.push(promise);           
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
    createTestData,
    reset
}