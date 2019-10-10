var express = require('express');
var router = express.Router();
var util = require('../util');
var userPromise = require('../userPromise');
var Topic = require('../../models/Topic');
var Action = require('../../models/Action');
var Tag = require('../../models/Tag');
var Article = require('../../models/Article');
var User = require('../../models/User');
var Comment = require('../../models/Comment');

router.get('/share',(req,res)=>{
    //  isActionPage  字段是用来判断是否在用户中心的用户动态页面
    var { userid, text, value, contentId, contentType, actionId, commentid, parentcommentid ,isActionPage, composeAction } = req.query;
    var date = new Date().toString();
    //  判断转发的是文章/话题  还是 评论
    if (text){
        
    } else {
        text = value ? value : `转发${util.translateType(contentType)}`
    }
    
    
    
    //util.responseClient(res,200,0,'ok');
    /*
    User.updateOne({_id:userid},{$set:{userAction:[]}},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    });
    */
    
    var action = new Action({
        userid,
        contentId,
        contentType,
        date,
        text,
        value,
        composeAction:Boolean(composeAction)    
    });

    action.save()
        .then(()=>{
            User.updateOne({_id:userid},{$push:{userAction:action._id}},(err,result)=>{});
            //  如当前用户在动态页面
            if (isActionPage){
                Action.updateOne({_id:actionId},{$push:{shareBy:action._id}},(err,result)=>{
                    Action.find({userid:userid},(err,actions)=>{
                        var actionIds = actions.map(item=>item._id);
                        var promise = new Promise((resolve,reject)=>{
                            userPromise.getUserActions(actionIds,resolve);
                        });
                        //  更新后的动态列表数据和被分享的某条动态的shareBy字段
                        promise.then(actions=>{
                            util.responseClient(res,200,0,'ok',actions);
                        })
                    })
                })
            //  如在新闻页面
            } else if (commentid){
                // 转发评论
                if (parentcommentid){
                    Comment.updateOne({_id:parentcommentid,'replies._id':commentid},{$push:{'replies.$.shareBy':action._id}},(err,result)=>{
                        console.log(result);

                    })
                } else {
                    Comment.updateOne({_id:commentid},{$push:{shareBy:action._id}},(err,result)=>{
                        Comment.findOne({_id:commentid},(err,comment)=>{
                            util.responseClient(res,200,0,'ok',comment.shareBy);
                        })
                    })
                }
                //  转发话题
            }  else if (contentType=='topic') {
                Topic.updateOne({_id:uniquekey},{$push:{shareBy:action._id}},(err,result)=>{
                    Topic.findOne({_id:uniquekey},(err,topic)=>{
                        util.responseClient(res,200,0,'ok',topic.shareBy);
                    })
                })
            } else if (contentType =='news') {
            }
            
            
        })  
    
    
})

function _operateAction( action, id, isCancel, userid, res ){
    var date = new Date().toString();
    var operate = isCancel ? '$pull':'$push';
    var option = isCancel ? {userid:userid} : {userid,date};
    Action.updateOne({_id:id},{[operate]:{[action+'Users']:option}},(err,result)=>{
        console.log(result);
        Action.findOne({_id:id},(err,actionDoc)=>{
            var data = action == 'like' ? actionDoc.likeUsers : actionDoc.dislikeUsers;
            util.responseClient(res,200,0,'ok',data);
        })
         
    })
}

router.get('/operate',(req,res)=>{
    var { action, id, userid, isCancel } = req.query;   
    _operateAction(action,id,isCancel,userid, res);
    
})

router.get('/getUsersInfo',(req,res)=>{
    var { userid, actionId } = req.query;
    if (userid){
        User.find({_id:{$in:userid}},(err,users)=>{
            var data = users.map(item=>{
                var obj={};
                obj.username = item.username;
                obj.userid = item._id;
                obj.avatar = item.userImage;
                return obj;
            })
            util.responseClient(res,200,0,'ok',data);
        })
    } else {
        var promise = new Promise((resolve,reject)=>{
            userPromise.getUserActions(actionId,resolve);
        });
        promise.then(data=>{
            util.responseClient(res,200,0,'ok',data);
        })        
    }   
})

router.get('/getActionContent',(req,res)=>{
    var { contentId } = req.query;
    Action.findOne({_id:contentId},(err,action)=>{
        var userid = action.userid;
        User.findOne({_id:userid},(err,user)=>{
            var obj = {};
            obj.username = user.username;
            obj.avatar = user.userImage;
            obj.value = action.value;
            obj.text = action.text;
            obj.shareBy = action.shareBy;
            obj.likeUsers = action.likeUsers;
            obj.dislikeUsers = action.dislikeUsers;
            obj.contentId = action.contentId;
            obj.contentType = action.contentType;        
            util.responseClient(res,200,0,'ok',obj);
        })
    })
})

router.get('/delete',(req,res)=>{
    var { id } = req.query;
    Action.deleteOne({_id:id},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    })
})

module.exports = router;