var express = require('express');
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var router = express.Router();
var util = require('../util');
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
    document.save()
        .then(()=>{
            resolve(document._id)
        })
}

function checkIsNewTags(tags,resolve){
    var newTags = [],existTags=[],allPromise = [];
    Tag.find({},(err,allTags)=>{
        tags.map(item=>{                    
            for(var i=0,len=allTags.length;i<len;i++){
                if (item == allTags[i]._id){
                    existTags.push(item);
                    return ;
                } 
            }
            newTags.push(item);
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
                var allTagsId = existTags.concat(data);
                resolve(allTagsId);
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


function handleFollowTopic( userid, topicId, isCancel, res){
    var operate = isCancel ? '$pull' : '$push';
    var option = isCancel ? { userid : userid } : { userid :userid ,date:new Date().toString()};  
     
    User.updateOne({_id:userid},{[operate]:{userTopic:topicId}},(err,result)=>{
            Topic.updateOne({_id:topicId},{[operate]:{follows:option}},(err,result)=>{ 
                Topic.findOne({_id:topicId},(err,topic)=>{                    
                    util.responseClient(res,200,0,'ok',topic.follows)
                })                              
            })            
        })
    
    /*
    User.updateOne({_id:userid},{$pull:{userTopic:{}}},(err,result)=>{
        Topic.updateOne({_id:topicId},{$pull:{follows:{}}},(err,result)=>{
            console.log(result);
            util.responseClient(res,200,0,'ok')
        })
    })
    */
    
}

function changeIdsToTags(ids,resolve){   
    Tag.find({_id:{$in:ids}},(err,tags)=>{
        resolve(tags); 
    })
}

function changeIdsToFollows(follows,resolve){
    var ids = follows.map(item=>item.userid);
    User.find({_id:{$in:ids}},(err,users)=>{
        var data = follows.map(item=>{
            var obj = {};
            obj.date = item.date;
            for(var i=0,len=users.length;i<len;i++){
                if (item.userid == users[i]._id){
                    obj.username = users[i].username;
                    obj.avatar = users[i].userImage;
                    break;
                }
            }
            return obj;
        })
        resolve(data);
    })
}

function changeIdsToShareBy(ids,resolve){
    Action.find({_id:{$in:ids}},(err,actions)=>{
        resolve(actions);
    })
}

function getTopic(topic,resolve){   
    var promise1 = new Promise((resolve,reject)=>{
        changeIdsToTags(topic.tag,resolve)
    });
    
    Promise.all([promise1])
        .then(([tags])=>{
            var obj = {};                
            obj.tag = tags.map(item=>item.tag);
            obj.follows = topic.follows;
            obj.shareBy = topic.shareBy;
            obj.title = topic.title;
            obj.sponsor = topic.sponsor;
            obj.date = topic.date;
            obj.description = topic.description;
            obj.isHot = topic.isHot;
            obj.view = topic.view;
            obj.privacy = topic.privacy;
            obj.images = topic.images;
            obj._id = topic._id;
            resolve(obj);
        })
    
}

function getUserTopic(userid,res){
    Topic.find({userid:userid},(err,topics)=>{
        var allPromises = [];
        if (topics.length){
            for(var i=0,len=topics.length;i<len;i++){
                (function(i){                    
                    var topic = topics[i];
                    var promise = new Promise((resolve,reject)=>{
                        getTopic(topic,resolve);
                    });
                    allPromises.push(promise)
                })(i)
            }

            Promise.all(allPromises)
            .then(data=>{

                util.responseClient(res,200,0,'ok',sort(data));
            })
        } else {
            util.responseClient(res,200,0,'ok',[])
        }        
    })
}


function getAllTopics(topics,res){
    var promises = [];
    for(var i=0,len=topics.length;i<len;i++){
        (function(i){
            var topic = topics[i];
            var tagIds = topic.tag;
            var promise = new Promise((resolve,reject)=>{
                Tag.find({_id:{$in:tagIds}},(err,tags)=>{
                    topic.tag = tags.map(item=>item.tag)
                    resolve(topic)
                })
            });
            promises.push(promise);
        })(i)
    }

    Promise.all(promises)
        .then(data=>{
            util.responseClient(res,200,0,'ok',data);
        })
}

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
    if (!tags) {
        tags = [];
    } else {
        if (!tags.map){
            tags = [tags]
        } 
    }
    if(req.files){
        
        req.files.forEach(item=>{
            var obj = {};
            obj.filename  = 'http://localhost:8080/topic/'+item.filename;
            obj.originalname = item.originalname;
            obj.originalpath = item.destination;
            images.push(obj);
        });
    }    
     //  判断用户是否添加了新标签
    var promise = new Promise((resolve,reject)=>{
        checkIsNewTags(tags,resolve);
    });
    
    promise.then(tagIds=>{
        var topic = new Topic({
            title,
            description,
            date,
            userid,
            privacy,
            images,
            tag:tagIds    
        });
        topic.save()
            .then(()=>{
                Tag.updateMany({_id:{$in:tagIds}},{$push:{content:topic._id}},(err,result)=>{});
                getUserTopic(userid,res);
            })
    })
})

router.get('/getUserTopic',(req,res)=>{
    var { userid } = req.query;
    getUserTopic(userid,res);
})

router.get('/getAllTopics',(req,res)=>{
    Topic.find({privacy:0},(err,topics)=>{
        getAllTopics(topics,res)
    })
})


router.get('/getTopicsByTag',(req,res)=>{
    var { id } = req.query;
    Tag.findOne({_id:id},(err,tag)=>{
        var topicIds = tag.content;
        Topic.find({_id:{$in:topicIds}},(err,topics)=>{
            getAllTopics(topics,res);
        })
    })
})

router.get('/checkTopicIsFollowed',(req,res)=>{
    var { userid, topicId } = req.query;
    User.findOne({_id:userid},(err,user)=>{
        if (user){
            var topicIds = user.userTopic;
            if(topicIds.includes(topicId)){
                util.responseClient(res,200,0,'ok');
            } else {
                util.responseClient(res,200,1,'ok');
            }
        } else {
            util.responseClient(res,200,1,'ok');
        }

    })
})

router.get('/getTopicDetail',(req,res)=>{
    var { topicId } = req.query;
    Topic.findOne({_id:topicId},(err,topic)=>{
        if ( topic ){
            var promise = new Promise((resolve,reject)=>{
                getTopic(topic,resolve);
            });
            promise.then(data=>{
                util.responseClient(res,200,0,'ok',data)
            })
        } else {
            util.responseClient(res,200,0,'ok')
        }        
    })
})

router.get('/followTopic',(req,res)=>{
    var { userid, topicId, isCancel } = req.query;  
    handleFollowTopic(userid, topicId, isCancel, res);   
})

router.get('/removeTopic',(req,res)=>{
    var { topicId } = req.query;
    Topic.deleteOne({_id:topicId},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    })
})

router.post('/edit',upload.array('images'),(req,res)=>{
    var { title, description, tags, privacy, deleteImage, userid, topicId } = req.body;
    var images = [];
    if (!tags){
        tags = [];
    } else if (!tags.map){
        tags = [tags]
    }
    if (!deleteImage){
        deleteImage = [];
    } 
    if(req.files){        
        req.files.forEach(item=>{
            var obj = {};
            obj.filename  = 'http://localhost:8080/topic/'+item.filename;
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
                tag:tags,
                images:finalImages       
            };
            Topic.updateOne({_id:topicId},{$set:updateObj},(err,result)=>{
                getUserTopic(userid,res);
            })
        })
})

router.get('/getUserFollowTopic',(req,res)=>{
    var { userid } = req.query;
    User.findOne({_id:userid},(err,user)=>{
        var followTopic = user.userTopic.map(item=>item.topicId);
        Topic.find({_id:{$in:followTopic}},(err,topics)=>{
            var allPromises = [];
            for(var i=0,len=topics.length;i<len;i++){
                (function(i){                    
                    var topic = topics[i];
                    var promise = new Promise((resolve,reject)=>{
                        getTopic(topic,resolve);
                    });
                    allPromises.push(promise)
                })(i)
            }

            Promise.all(allPromises)
            .then(data=>{
                util.responseClient(res,200,0,'ok',sort(data));
            })
        })
    })
})

module.exports = router;