var express = require('express');
var router = express.Router();
var util = require('../util');
var userPromise = require('../userPromise');
var Topic = require('../../models/Topic');
var Action = require('../../models/Action');
var Tag = require('../../models/Tag');
var Article = require('../../models/Article');
var User = require('../../models/User');


router.get('/share',(req,res)=>{
    //  forUserAction  字段是用来判断是否在用户中心的用户动态页面
    var { userid, content, value, uniquekey, actionType, forUserAction } = req.query;
    var date = new Date().toString();
    //  判断转发的是文章/话题  还是 评论
    if ( content ){
        value = value + '//'
    } else {
        content = value ? value : `转发${util.translateType(actionType)}`
    }
    
    var action = new Action({
        userid,
        uniquekey,
        actionType,
        date,
        content,
        value
    });

    action.save()
        .then(()=>{
            if (actionType === 'news'){
                Article.updateOne({articleId:uniquekey},{$push:{shareBy:action._id}},(err,result)=>{});
            } else if ( actionType === 'topic') {

            }

            User.updateOne({_id:userid},{$push:{userAction:action._id}},(err,result)=>{
                if(forUserAction){
                    User.findOne({_id:userid},(err,user)=>{
                        var promise = new Promise((resolve,reject)=>{
                            userPromise.getUserActions(user.userAction,resolve)
                        });

                        promise.then(data=>{
                            util.responseClient(res,200,0,'ok',data)
                        })
                    })
                } else {
                    util.responseClient(res,200,0,'ok');
                }
            })        
            
            
        }) 
    
})

router.get('/operate',(req,res)=>{
    var { action, id , isCancel } = req.query;
    var operate ;
    if (Boolean(isCancel)) {
      operate = -1;
    } else {
       operate = 1;
    }  
    Action.updateOne({_id:id},{$inc:{[action]:operate}},(err,result)=>{
        //console.log(result);
        util.responseClient(res,200,0,'ok');
    })
})

router.get('/delete',(req,res)=>{
    var { id } = req.query;
    Action.deleteOne({_id:id},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    })
})

module.exports = router;