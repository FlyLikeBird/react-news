var User = require('../models/User');
var Article = require('../models/Article');
var Comment = require('../models/Comment');
var Collect = require('../models/Collect');
var Action = require('../models/Action');
var Topic = require('../models/Topic');
var util = require('./util');

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


function getTopicContent(res, topicId, data){
    Topic.findOne({_id:topicId})
        .populate({path:'user', select:'username userImage'})
        .populate({path:'tags',select:'tag'})
        .populate({
            path:'follows.user',
            select:'username userImage'
        })
        .populate({
            path:'shareBy',
            populate:{ path:'user', select:'username userImage'},
            select:'date user value'
        })
        // 话题按生成时间排序
        .then(doc=>{
            var result ;
            if (data){
                result = data;
                result.doc = doc;
            } else {
                result = doc;
            }
            util.responseClient(res, 200, 0, 'ok', result);
        })
}

module.exports = {
    getTopicContent
}