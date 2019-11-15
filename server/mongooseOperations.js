var Article = require('../models/Article');
var Comment = require('../models/Comment');
var config = require('../config/config.js');
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

/*
   生成20条测试评论数据
*/

function _makeComment(i){
    var date = new Date().toString();
    var comment = new Comment({
        username:'001',
        commentType:'news',
        avatar:'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
        date,
        content:`测试数据${i}`,
        uniquekey:'161028202106247'

    });
    comment.save()
      .then(()=>{
        
      })
}

function createComments(length){
  for(var i=0;i<length;i++){
      _makeComment(i)
  }
}

function _singleArticleDoc(id){
    var arr = [];
    var filename = config.uploadPath+'/thumbnails/img'+Math.floor(Math.random()*168)+'.jpeg';
    arr.push(filename);
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
module.exports = {
    changeArticlesContents,
    createComments,
    addThumbnails,
    resetArticles
}