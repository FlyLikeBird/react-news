var express = require('express');
var router = express.Router();
var util = require('../util');
var secret = require('../../src/utils/secret');
var Article = require('../../models/Article');
var User = require('../../models/User');
var mongooseOperations = require('../mongooseOperations');

function createPattern(words){
  if (Object.prototype.toString.call(words)==='[object String]') {
     
      var pattern = '<p[^>]*>.*'+words+'.*<\/p>';
  } else {
    var resultWords = '';
    for(var i=0,len=words.length;i<len;i++){
      resultWords += '.*'+words[i] + '.*|'
    }
    resultWords = resultWords.substring(0,resultWords.length-1);
    var pattern = '<p[^>]*>'+ resultWords +'<\/p>';
    //console.log(pattern);
  }
  return new RegExp(pattern,'g')
}

function selectWords(content,words){

  if (words.match(/\s+/)) {
      
      var str = ''
      var multiWords = words.split(/\s+/);
      for(var i=0,len=multiWords.length;i<len;i++){
         str += multiWords[i] +'|'
      }
      
      words = str.substring(0,str.length-1);
      
  }
  
  // 过滤包含关键词的段落文本
   //var pattern = /<(p)[^>]*>(.*)<\/\1>/g;

   var patternStr = '<(p)[^>]*>.*(' + words+').*?<\/p>';
   //console.log(patternStr);
   var pattern = new RegExp(patternStr);

   var multiContents = '';

   var matchResult = content.match(pattern);
   if(matchResult){
      multiContents = matchResult[0];
   }
   /*
   if (matchResult){
      var matchContent = matchResult[0];
      var matchWords = matchResult[2];
      //console.log(matchContent);
      //console.log(matchResult);
      multiContents = matchContent.replace(matchWords,'<span style="color:#1890ff">'+matchWords+'</span>');
   }
   */
   return multiContents;
}

function selectContentByUniquekey(content){
  var multiContents = '';
  var result ;
  var pattern = /<(p)[^>]*>(.*)<\/\1>/g;

  result = pattern.exec(content);
  
  while ( result ){
    multiContents += result[2]
    result = pattern.exec(content);
  }
  
  return multiContents;
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



router.get('/search',(req,res)=>{
  var { words, pageNum, type, orderBy, start, end, userid } = req.query;
  var total = 0;
  //console.log(type);
  var skip = (pageNum -1) > 0 ? (pageNum-1)*20 : 0;

  let orderOption;
  //console.log(orderBy);
  switch(orderBy){
    
    case 'time':
      orderOption = {
        'newstime':1
      };
      break;
    case 'timeInvert':
      orderOption = {
        'newstime':-1
        
      };
      break;
    case 'hotInvert':
      orderOption = {
        'articleFever':1        
      }
      break;
    case 'hot':
      orderOption = {
        'articleFever':-1
      }
  }
  
  
  var _filter ;

  if (start && end){

    if (words.match(/\s+/g)){

      var multiWords = words.split(/\s+/);
      _filter = {
        $and:[
          {'newstime':{$gt:start,$lt:end}},
          {$or:[]}
        ]
      }

      for(var i=0,len=multiWords.length;i<len;i++){
        _filter['$and'][1]['$or'].push({content:{$regex:new RegExp(multiWords[i],'g')}});
      }


    } else {

      _filter = {
        $and:[
          {content:{$regex:{$regex:new RegExp(words,'g')}}},
          {'newstime':{$gt:start,$lt:end}}
        ]
      }

    }
  } else {

    if(words.match(/\s+/g)){
        var multiWords = words.split(/\s+/);
        _filter = {
          $or:[
    
          ]
        }
        for(var i=0,len=multiWords.length;i<len;i++){
          _filter['$or'].push({content:{$regex:new RegExp(multiWords[i],'g')}})
        }
        //console.log(_filter);
    } else {
      _filter = {
        content:{$regex:new RegExp(words,'g')}
      }
    }
  }
  
  if (type==='news'){
     var promise = new Promise((resolve,reject)=>{
         Article.count(_filter,(err,doc)=>{total=doc;resolve()});
     });
     promise.then(()=>{
       Article.find(_filter)
       .sort(orderOption)
       .skip(skip)
       .limit(20)
       .exec((err,articles)=>{ 
         var result = {},data=[];    
         result.total = total;
         data = articles.map(item=>{
            var obj={};
            obj.articleId = item.articleId;
            obj.title = item.title;
            obj.newstime = item.newstime;
            obj.auth = item.auth;
            obj.type = item.type;
            obj.content = selectWords(item.content,words);
            return obj;
         })
         result.data = data;
         util.responseClient(res,200,0,'ok',result);
       })
     })

  } else if (type == 'user'){
    User.find({'username':{$regex:new RegExp(words,'g')}},{password:0,message:0},(err,users)=>{
      var result = [];  
      if (!users){
          util.responseClient(res,200,0,'ok',result);
      } else {
          util.responseClient(res,200,0,'ok',users);
      }
      
    })
  } else if (type =='topic'){

  }
  
})


router.get('/getArticleTitle',(req,res)=>{
  var { type, count } = req.query;
  type = util.translateTag(type);
  //console.log(type);
  //console.log(count);
  count = Number(count);
  Article.find({'type':type})
          .limit(count)
          .exec((err,articles)=>{
              
              var data = articles.map(item=>{
                var obj = {};
                obj.uniquekey = item.articleId,
                obj.type = item.type;
                obj.newstime = item.newstime;
                obj.auth = item.auth;
                obj.title = item.title;
                return obj;
              })
             
              util.responseClient(res,200,0,'ok',data);

          })
})


router.get('/getArticleList',(req,res)=>{
  var { type, count } = req.query;
  type = util.translateTag(type);
  //console.log(type);
  //console.log(count);
  count = Number(count);
  Article.find({'type':type})
          .limit(count)
          .exec((err,articles)=>{
              
              var data = articles.map(item=>{
                var obj = {};
                obj.articleId = item.articleId,
                obj.type = item.type;
                obj.thumbnails = item.thumbnails;
                obj.newstime = item.newstime;
                obj.auth = item.auth;
                obj.title = item.title;
                obj.content = item.content;
                return obj;
              })
             
              util.responseClient(res,200,0,'ok',data);

          })
})

router.get('/getArticleContent',(req,res)=>{
  let { uniquekey } = req.query;
  Article.findOne({'articleId':uniquekey},(err,article)=>{
      if (article){             
          var data = {};
          data.content = article.content;
          data.viewcount = article.viewcount;
          data.articleId = article.articleId;
          data.auth = article.auth;
          data.title = article.title;             
          data.thumbnails = article.thumbnails;
          data.newstime = article.newstime;
          data.type = article.type;
          data.shareBy = article.shareBy;
          data.viewUsers = article.viewUsers;
          util.responseClient(res,200,0,'ok',data);
      }
  })
          
})

router.get('/rateArticle',(req,res)=>{
  let { userid, uniquekey, rate } = req.query;
  var date = new Date().toString();
  Article.findOne({'articleId':uniquekey},(err,article)=>{
    var fever = article.articleFever + Number(rate);
    var viewUsers = article.viewUsers.concat();
    viewUsers.push({
      date,
      userid,
      score:rate
    })
    var $setObj = {
      'articleFever':fever,
      'viewUsers':viewUsers
    }
    Article.updateOne({'articleId':uniquekey},{$set:$setObj},(err,result)=>{
        console.log(result);
        Article.findOne({'articleId':uniquekey},(err,article)=>{
            util.responseClient(res,200,0,'ok',article.viewUsers);
        })
    })

  })
})


module.exports = router;