var express = require('express');
var router = express.Router();

var util = require('../util');

var Article = require('../../models/Article');
var User = require('../../models/User');

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


/*

  Article集合里添加文章文档
router.post('/addArticle',(req,res)=>{

    let { author_name, date, realtype, title, uniquekey, pagecontent } = req.body
    //console.log(uniquekey);
    Article.findOne({'articleId':uniquekey},(err,result)=>{
      if (err) throw err;
      //console.log(result);
      if( !result ) {
        //console.log(result);
        var article = new Article({
          articleId:uniquekey,
          type:realtype,
          newstime:date,
          auth:author_name,
          title:title,
          content:pagecontent,
        });

        article.save()
                  .then( articleObj=>{
                      
                  })
      } else {
        //console.log('hello');
      }
    });

    util.responseClient(res,200,0,'ok');

})

*/

router.get('/search',(req,res)=>{
  var { words, pageNum, type, orderBy, start, end } = req.query;
  //console.log(words,type);
  //console.log(start,end);
  console.log(words);
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
         //console.log('find function');
         //console.log(articles);
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

  } else {
    User.find({'username':{$regex:new RegExp(words,'g')}},{password:0},(err,users)=>{
      var result = [];
      
      if (users.length){
        if (users.length>1) {
          result = users.map(user=>{

            var data = {};
            data.userImage = user.userImage;
            data.username = user.username;
            data.userFollow = user.userFollow;
            data.userFans = user.userFans;
            data.level = user.level;
            data.description = user.description;
            data.id = user._id;
            data.isLogined = user.isLogined;
            return data;
          })
        } else {
          var data = {};
          var user = users[0];
          data.userImage = user.userImage;
          data.username = user.username;
          data.userFollow = user.userFollow;
          data.userFans = user.userFans;
          data.level = user.level;
          data.description = user.description;
          data.id = user._id;
          data.isLogined = user.isLogined;
          result.push(data);
        }
        
        
      } else {
        console.log('not found')
      }

      util.responseClient(res,200,0,'ok',result);

    })
  }
  
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
            
            var list = [];
            
            for(var i=0,len=articles.length;i<len;i++){
              //articles[i].thumbnail = selectImgByUniquekey(articles[i]);
              
              var thumbnail = selectImgByUniquekey(articles[i].content);
              if (thumbnail.length){
                if (thumbnail.length > 3) {
                  
                  thumbnail = thumbnail.slice(0,3)
                } else if (thumbnail.length = 1){
                  
                  thumbnail.push(thumbnail[0],thumbnail[0]);
                } else if (thumbnail.length =2){
                  
                  thumbnail.push(thumbnail[0])
                } 
              }

              
              
              list.push({
                uniquekey:articles[i].articleId,
                type:articles[i].type,
                newstime:articles[i].newstime,
                auth:articles[i].auth,
                title:articles[i].title,
                thumbnail:thumbnail,
                content:selectContentByUniquekey(articles[i].content)
              })
              /*
              list[i] = articles[i];
              list[i].thumbnail = selectImgByUniquekey(list[i].content)
              list[i].content = selectContentByUniquekey(list[i].content);
              */
              
            }
            //console.log(list);
            util.responseClient(res,200,0,'ok',list);

          })
})

router.get('/getArticleContent',(req,res)=>{
  let { uniquekey } = req.query;

  Article.findOne({'articleId':uniquekey})
          .exec((err,article)=>{
            if (article){
              
              var data = {};
              data.content = article.content;
              data.viewcount = article.viewcount;
              data.isCollect = article.isCollect;
              data.articleId = article.articleId;
              data.auth = article.auth;
              data.title = article.title;             
              data.thumbnail = selectImgByUniquekey(article.content)[0];
              data.newstime = article.newstime;
              data.type = article.type;
              util.responseClient(res,200,0,'ok',data);
            }
          })
})

router.get('/rateArticle',(req,res)=>{
  let { username, uniquekey, rate } = req.query;
  console.log(username,uniquekey,rate);

  Article.findOne({'articleId':uniquekey},(err,article)=>{
    let fever = article.articleFever;
    fever += rate;
    Article.updateOne({'articleId':uniquekey},{$set:{'articleFever':fever}},(err,result)=>{
      console.log(result);
      util.responseClient(res,200,0,'ok');
    })

  })
})


module.exports = router;