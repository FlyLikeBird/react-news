var User = require('../models/User');
var Article = require('../models/Article');
var Comment = require('../models/Comment');
var Collect = require('../models/Collect');
var Action = require('../models/Action');
var Topic = require('../models/Topic');
var util = require('./util');

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

function getTopicComments(topic, resolve){
    Comment.find({'uniquekey':topic._id},(err,comments)=>{
        topic.replies = comments.length;
        resolve(topic);
    })
}

function getAllOrUserTopics(res, userid, topicId, someTopics){
    var option = someTopics ? { _id:{$in:someTopics}} : topicId ? {_id:topicId} : userid ? {user:userid} : {privacy:0};
    Topic.find(option)
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
        .sort({_id:-1})
        .then(topics=>{
            var allPromises = [];
            topics.map(item=>{
                var promise = new Promise((resolve,reject)=>{
                    getTopicComments(item,resolve);
                });
                allPromises.push(promise);
            });
            Promise.all(allPromises)
                .then(topics=>{
                    util.responseClient(res, 200, 0, 'ok', topics);
                })
        })
}

module.exports = {
    getAllOrUserTopics
}