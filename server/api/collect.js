var express = require('express');
var router = express.Router();
var userPromise = require('../userPromise');
var util = require('../util');
var User = require('../../models/User');
var Collect = require('../../models/Collect');
var CollectItem = require('../../models/CollectItem');
var Article = require('../../models/Article');

function getUserOrSingleCollect(res, userid, collectId, multiCollects){
    var option = multiCollects ? {_id:{$in:multiCollects}} : collectId ? { _id:collectId} : userid ? { user:userid} : {};
    Collect.find(option)
        .populate({
            path:'collectItem',
            populate:{ 
                path:'contentId',
                populate:[
                    { path:'tags', select:'tag'},
                    { path:'follows.user', select:'username userImage'},
                    { path:'user', select:'username userImage'},
                    { path:'shareBy', populate:{path:'user', select:'username userImage'}, select:'date value user'}
                ]
            }
        })
        .populate({
            path:'shareBy',
            populate:{ path:'user', select:'username userImage'},
            select:'value date user'
        })
        .populate({ path:'followedBy.user', select:'username userImage'})
        .then(collects=>{
            util.responseClient(res, 200, 0, 'ok', collects);
        })
}

router.get('/createCollect',(req,res)=>{
    var { userid, tag, privacy } = req.query;    
    Collect.find({user:userid},(err,collects)=>{
      var tags = collects.map(item=>item.tag);
      if (!tags.includes(tag)){
          var collect = new Collect({
              user:userid,
              tag,
              createtime:new Date().toString(),
              privacy
            });
            collect.save(function(err){
                getUserOrSingleCollect(res, userid);
            })
      } else {
          util.responseClient(res,200, 1,'已存在同名的收藏夹!');
      }
    })
})

router.get('/getUserCollect',(req,res)=>{
    var { userid } = req.query;
    getUserOrSingleCollect(res, userid);
})


router.get('/addIntoCollect',(req,res)=>{
    var { contentId, collectId, onModel } = req.query;
    var date = new Date().toString();
    var collectItem = new CollectItem({
        addtime:date,
        contentId,
        onModel
    });

    collectItem.save(function(err){
        Collect.updateOne({_id:collectId},{$push:{collectItem:collectItem._id}},(err,result)=>{
            getUserOrSingleCollect(res, null, collectId);
        })
    })  
})

router.get('/followCollect',(req,res)=>{
    var { userid, collectId, unFollow } = req.query;
    var date = new Date().toString();
    var operation = unFollow ? '$pull' : '$push';
    var option = unFollow ? {user:userid} : { user:userid, date};
    User.updateOne({_id:userid},{[operation]:{userCollects:collectId}},(err,result)=>{
        Collect.updateOne({_id:collectId},{[operation]:{followedBy:option}},(err,result)=>{
            console.log(result);
            getUserOrSingleCollect(res, null, collectId); 
        })
    })
})

router.get('/getFollowedCollect',(req,res)=>{
    var { userid } = req.query;
    User.findOne({_id:userid},(err,user)=>{
        var userCollects = user.userCollects;
        getUserOrSingleCollect(res, null, null, userCollects);
    });
})

router.get('/removeCollect',(req,res)=>{
  var { userid , id } = req.query; 
  Collect.deleteOne({'_id':id},(err,result)=>{
      util.responseClient(res,200,0,'ok')
  })
  
})

router.get('/removeCollectContent',(req,res)=>{
    var { collectId, contentId } = req.query;
    Collect.findOne({_id:collectId})
        .populate({ path:'collectItem'})
        .then(doc=>{
            var { collectItem } = doc;
            var deleteId = '';
            collectItem.map((item, index)=>{
                if (item.contentId == contentId){
                    deleteId = item._id;
                }
            });
            CollectItem.deleteOne({_id:deleteId},(err,result)=>{
                Collect.updateOne({_id:collectId}, {$pull:{collectItem:deleteId}},(err,result)=>{
                    getUserOrSingleCollect(res, null, collectId);
                })
            })
        })
})

module.exports = router;