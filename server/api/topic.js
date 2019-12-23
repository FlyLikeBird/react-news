var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var util = require('../util');
var config = require('../../config/config');
var Topic = require('../../models/Topic');
var Tag = require('../../models/Tag');
var Article = require('../../models/Article');
var Comment = require('../../models/Comment');
var User = require('../../models/User');
var Action = require('../../models/Action');

function sort(arr){
  arr.sort((a,b)=>{
    var time1 = Date.parse(a.date);
    var time2 = Date.parse(b.date);
    return time2 - time1
  })
  return arr; 
}

function createNewTag(tag,resolve){
    var document = new Tag({
        tag,
        date:new Date().toString()
    })
    document.save(function(err){
        resolve(document._id);
    })
}

function checkIsNewTags(tags,resolve){
    var newTags = [],existTags=[], allPromise = [];
    Tag.find({},(err,allTags)=>{
        var allTags = allTags.map(item=>item._id.toString());      
        tags.map(item=>{  
            if(!allTags.includes(item)){
                newTags.push(item);
            } else {
                existTags.push(item);
            }
        });

        for(var i=0,len=newTags.length;i<len;i++){
            (function(i){
                var promise = new Promise((resolve,reject)=>{
                    createNewTag(newTags[i],resolve);
                });
                allPromise.push(promise);
            })(i)
        }
        Promise.all(allPromise)
            .then(([...data])=>{              
                var finalTags = existTags.concat(data);
                resolve(finalTags);
            })
        
    })
}

function checkDeleteNewImg(deleteImage,topicId,resolve){
    Topic.updateOne({_id:topicId},{$pull:{images:{_id:{$in:deleteImage}}}},(err,result)=>{
        Topic.findOne({_id:topicId},(err,topic)=>{
            resolve(topic.images)
        })
    })
}

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};
var uploadFolder = path.resolve('./src'+'/images/topic');
createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        //console.log(file);
        let type = file.mimetype;
         
        cb(null, file.fieldname + '-' + Date.now() +  '.'+type.slice(6,type.length) );  
    }
});
var upload = multer({storage});

/*

[ { fieldname: 'images',
    originalname: '64063918-4583e8921863379.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: '/Users/ninsankou/Documents/NodeJs项目/react-news/src/images/topic',
    filename: 'images-1565070568159.jpeg',
    path: '/Users/ninsankou/Documents/NodeJs项目/react-news/src/images/topic/images-1565070568159.jpeg',
    size: 57304 } ]

*/
router.post('/upload',upload.array('images'),(req,res)=>{
    var { title, description, tags, privacy, userid } = req.body;     
    var date = new Date().toString(), images = [];  
    if(req.files){
        req.files.forEach(item=>{
            var obj = {};
            obj.filename  = '/static/topic/'+item.filename;
            obj.originalname = item.originalname;
            obj.originalpath = item.destination;
            images.push(obj);
        });
    }    
     //  判断用户是否添加了新标签
    tags = tags ? tags.map ? tags : [tags] : [];
    var promise = new Promise((resolve,reject)=>{
        checkIsNewTags(tags,resolve);
    });
    
    promise.then(tags=>{  
        var topic = new Topic({
            title,
            description,
            date,
            user:userid,
            privacy,
            images, 
            tags  
            });

        topic.save(function(err){
            Tag.updateMany({_id:{$in:tags}},{$push:{content:topic._id}},(err,result)=>{});
            getAllOrUserTopics(res, userid);
        })
            
    })  
})

function getAllOrUserTopics(res, userid, topicId, someTopics, resolve){
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
            if (resolve && !res) {
                resolve(topics);
            } else {
                util.responseClient(res, 200, 0, 'ok', topics);
            }                           
        })
}

router.get('/getUserTopic',(req,res)=>{
    var { userid } = req.query;
    getAllOrUserTopics(res, userid);
})

router.get('/getAllTopics',(req,res)=>{
    getAllOrUserTopics(res);
})

router.get('/getTopicsByTag',(req,res)=>{
    var { id } = req.query;
    Tag.findOne({_id:id})
        .then(doc=>{
            var topicIds = doc.content;
            getAllOrUserTopics(res, null, null, topicIds);
        })

})

router.get('/getTopicDetail',(req,res)=>{
    var { topicId } = req.query;
    Topic.updateOne({_id:topicId},{$inc:{view:1}},(err,result)=>{
        getAllOrUserTopics(res, null, topicId);
    })  
})

router.get('/getTopicList',(req,res)=>{
    var { count } = req.query;
    count = Number(count);
    Topic.find({},{title:1})
        .limit(count)
        .then(topics=>{
            util.responseClient(res, 200, 0, 'ok', topics);
        })
})

router.get('/followTopic',(req,res)=>{
    var { userid, topicId, isCancel } = req.query; 
    var date = new Date().toString(); 
    var operation = isCancel ? '$pull' : '$push';
    var option = isCancel ? {user:userid} : { user:userid, date};
    User.updateOne({_id:userid},{[operation]:{userTopics:topicId}},(err,result)=>{
        Topic.updateOne({_id:topicId},{[operation]:{follows:option}},(err,result)=>{
            //console.log(result);
            getAllOrUserTopics(res, null, topicId);
        })
    })
})

router.get('/removeTopic',(req,res)=>{
    var { topicId } = req.query;
    Topic.findOne({_id:topicId},(err,topic)=>{
        var tags = topic.tags;
        Tag.updateMany({_id:{$in:tags}},{$pull:{content:topicId}},(err,result)=>{
            Topic.deleteOne({_id:topicId},(err,result)=>{
                util.responseClient(res, 200, 0, 'ok');
            })
        })
    })
})

router.post('/edit',upload.array('images'),(req,res)=>{
    var { title, description, tags, privacy, deleteImage, userid, topicId } = req.body;
    var images = [];
    tags = tags ? tags.map ? tags : [tags] : [];
    if (!deleteImage){
        deleteImage = [];
    } 
    if(req.files){        
        req.files.forEach(item=>{
            var obj = {};
            obj.filename  = '/static/topic/'+item.filename;
            obj.originalname = item.originalname;
            obj.originalpath = item.destination;
            images.push(obj);
        });
    }    
     //  判断用户是否添加了新标签
    var promise1 = new Promise((resolve,reject)=>{
        checkIsNewTags(tags,resolve);
    });
    //  判断用户对配图的操作，是否添加了新配图/是否删除之前的配图
    var promise2 = new Promise((resolve,reject)=>{
        checkDeleteNewImg(deleteImage,topicId,resolve);
    })

    Promise.all([promise1,promise2])
        .then(([tags,prevImages])=>{
            var finalImages = images.concat(prevImages);
            var updateObj = {
                title,
                description,
                privacy,
                tags,
                images:finalImages       
            };
            Topic.updateOne({_id:topicId},{$set:updateObj},(err,result)=>{
                getAllOrUserTopics(res, null, topicId);
            })
        })
})

router.get('/getUserFollowTopic',(req,res)=>{
    var { userid } = req.query;
    User.findOne({_id:userid},(err,user)=>{
        var followTopics = user.userTopics;
        getAllOrUserTopics(res, null, null, followTopics);
    })
})

router.get('/search',(req,res)=>{
    var { words, pageNum, orderBy, start, end } = req.query;
    var data={total:0}, _filter;
    var skip = (pageNum -1) > 0 ? (pageNum-1)*20 : 0;
    var orderOption;
    switch(orderBy){   
        case 'time':
          orderOption = { date:1}
          break;
        case 'timeInvert':
          orderOption = { date:-1}
          break;
        case 'hotInvert':
          orderOption = { view:1}
          break;
        case 'hot':
          orderOption = { view:-1}
    } 

  if (start && end){
    if (words.match(/\s+/g)){
      var multiWords = words.split(/\s+/);
      _filter = {
        $and:[
          {'date':{$gt:start,$lt:end}},
          {$or:[]}
        ]
      };
      for(var i=0,len=multiWords.length;i<len;i++){
        _filter['$and'][1]['$or'].push({description:{$regex:new RegExp(multiWords[i],'g')}});
      }

    } else {

      _filter = {
        $and:[
          {description:{$regex:{$regex:new RegExp(words,'g')}}},
          {'date':{$gt:start,$lt:end}}
        ]
      }

    }
  } else {
    if(words.match(/\s+/g)){
        var multiWords = words.split(/\s+/);
        _filter = { $or:[]};
        for(var i=0,len=multiWords.length;i<len;i++){
          _filter['$or'].push({description:{$regex:new RegExp(multiWords[i],'g')}})
        }
    } else {
        _filter = { description:{$regex:new RegExp(words,'g')} }
    }
  }
  Topic.count(_filter)
      .then(count=>{
          data.total = count;
          Topic.find(_filter)
              .sort(orderOption)
              .skip(skip)
              .limit(20)
              .exec((err, topics)=>{ 
                  var topicIds = topics.map(item=>item._id);
                  var promise = new Promise((resolve, reject)=>{
                        getAllOrUserTopics(null, null, null, topicIds, resolve);
                  });
                  promise.then(topics=>{
                        data.data = topics;
                        util.responseClient(res,200,0,'ok',data);
                  })                  
              })
      })
})
module.exports = router;