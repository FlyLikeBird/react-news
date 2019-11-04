var Article = require('../models/Article');
var Comment = require('../models/Comment');

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

module.exports = {
    changeArticlesContents,
    createComments
}