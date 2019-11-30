var express = require('express');
var router = express.Router();
var userPromise = require('../userPromise');
var util = require('../util');
var User = require('../../models/User');
var Collect = require('../../models/Collect');
var Article = require('../../models/Article');

function getUserCollect(userid, res){
    Collect.find({user:userid})
        .populate({
            path:'content'
        })
        .then(collects=>{
            util.responseClient(res, 200, 0, 'ok', collects);
        })
}

router.get('/createCollect',(req,res)=>{
    var { userid, tag, privacy } = req.query;    
    Collect.find({userid:userid},(err,collects)=>{
      var tags = collects.map(item=>item.tag);
      if (!tags.includes(tag)){
          var collect = new Collect({
              user:userid,
              tag,
              createtime:new Date().toString(),
              privacy
            });
            collect.save(function(err){
                getUserCollect(userid, res);
            })
      } else {
          util.responseClient(res,200, 1,'已存在同名的收藏夹!');
      }
    })
})

router.get('/getUserCollect',(req,res)=>{
    var { userid } = req.query;
    getUserCollect(userid, res);
})


router.get('/checkContentExist',(req,res)=>{
  var { uniquekey, userid } = req.query;
  Collect.findOne({_id:id},(err,collect)=>{
    var contentIds = collect.content.map(item=>item.id);

    if (contentIds.includes(uniquekey)){
        util.responseClient(res,200,0,'收藏夹已经收藏该内容!');
    } else {
        util.responseClient(res,200,1,'');
    }

  })
})

router.get('/addIntoCollect',(req,res)=>{
    var { contentId, collectId, onModel } = req.query;
    var date = new Date().toString();
    var content = {
        addtime:date,
        contentId,
        onModel
    };
    
    Collect.updateOne({_id:collectId},{$push:{content:content}},(err,result)=>{
        Collect.findOne({_id:collectId})
            .then(doc=>{
                var { content } = doc;
                util.responseClient(res, 200, 0, 'ok', content);
            })
    })
})

router.get('/followCollect',(req,res)=>{
    var { userid, collectId, unFollow } = req.query;
    var date = new Date().toString();
    var operation = '$push';
    var option = {
        userid,
        addtime:date
    }
    if (unFollow){
      operation = '$pull';
      option = {userid}
    }

    /*
    Collect.updateOne({_id:collectId},{$set:{followedBy:[]}},(err,result)=>{
      console.log(result);
      User.updateOne({_id:userid},{$set:{userCollect:[]}},(err,result)=>{
          Collect.findOne({_id:collectId},(err,collect)=>{
                util.responseClient(res,200,0,'ok',collect.followedBy);           
            }) 
      })
    })
    */
    
    User.updateOne({_id:userid},{[operation]:{userCollect:collectId}},(err,result)=>{
        Collect.updateOne({_id:collectId},{[operation]:{followedBy:option}},(err,result)=>{
            Collect.findOne({_id:collectId},(err,collect)=>{
                util.responseClient(res,200,0,'ok',collect.followedBy);           
            }) 
        })
    })
  
    
})

router.get('/getFollowedCollect',(req,res)=>{
    var { userid } = req.query;
    var promise = new Promise((resolve,reject)=>{
        userPromise.getFollowedCollect(userid, resolve)
    });
    promise.then(data=>{

        util.responseClient(res,200,0,'ok',data);
    })
})

router.get('/removeCollect',(req,res)=>{
  var { userid , id } = req.query; 
  Collect.deleteOne({'_id':id},(err,result)=>{
      util.responseClient(res,200,0,'ok')
  })
  
})

router.get('/removeCollectContent',(req,res)=>{
  var { collectId, contentId } = req.query;
  Collect.updateOne({'_id':collectId},{$pull:{content:{id:contentId}}},(err,result)=>{
      Collect.findOne({_id:collectId},(err,collect)=>{
            var promise = new Promise((resolve,reject)=>{
                userPromise.translateUserCollect(collect,resolve);
            });
            promise.then(data=>{
                util.responseClient(res,200,0,'ok',data);
            })
            
        }) 
  })
})

module.exports = router;