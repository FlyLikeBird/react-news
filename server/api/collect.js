var express = require('express');
var router = express.Router();
var userPromise = require('../userPromise');
var util = require('../util');
var User = require('../../models/User');
var Collect = require('../../models/Collect');
var Article = require('../../models/Article');

function getUserCollect(userid, uniquekey, res){
    var promise = new Promise((resolve,reject)=>{
      userPromise.getUserCollect(userid,resolve,true);
    })
    promise.then(data=>{
      // 判断某篇文章是否已存在于收藏夹中
      data = data.map(item=>{
          var content = item.content;
          for(var i=0,len=content.length;i<len;i++){
            if ( content[i].articleId === uniquekey){
                item['isCollected'] = true;
                break;
            }
          }
          return item;
      })
      util.responseClient(res,200,1,'ok',data)
    })
}

router.get('/createCollect',(req,res)=>{
    var { userid, tag, privacy } = req.query;    
    Collect.find({userid:userid},(err,collects)=>{
      var tags = collects.map(item=>item.tag);

      if (!tags.includes(tag)){

          var collect = new Collect({
              userid,
              tag,
              createtime:new Date().toString(),
              privacy
            });

            collect.save()
              .then(()=>{
                  
                  var promise = new Promise((resolve,reject)=>{
                      userPromise.getUserCollect(userid,resolve,true)
                  });
                  promise.then(data=>{                      
                    util.responseClient(res,200,1,'ok',data);
                  })
                                
              })
      } else {
          util.responseClient(res,200,0,'已存在同名的收藏夹!');
      }
    })
})

router.get('/getUserCollect',(req,res)=>{
    var { userid, uniquekey } = req.query;
    getUserCollect(userid,uniquekey,res);
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
    var { contentId, collectId } = req.query;
    Collect.updateOne({'_id':collectId},{$push:{content:{id:contentId,addtime:new Date().toString()}}},(err,result)=>{      
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