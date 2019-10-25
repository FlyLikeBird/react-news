var Article = require('../models/Article');

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

module.exports = {
    changeArticlesContents
}