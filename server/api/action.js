var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var config = require('../../config/config');
var util = require('../util');
var userPromise = require('../userPromise');
var Topic = require('../../models/Topic');
var Action = require('../../models/Action');
var Tag = require('../../models/Tag');
var Article = require('../../models/Article');
var User = require('../../models/User');
var Comment = require('../../models/Comment');
var Collect = require('../../models/Collect');

function getShareBy(Collect, contentId, actionId, res){
    Collect.updateOne({_id:contentId},{$push:{shareBy:actionId}},(err,result)=>{
        Collect.findOne({_id:contentId})
            .populate({
                path:'shareBy',
                populate:{ path:'user', select:'username userImage'},
                select:'user value date'
            })
            .populate({
                path:'collectItem',
                populate:{
                    path:'contentId'
                }
            })
            .then(doc=>{
                util.responseClient(res, 200, 0, 'ok', doc);
            })
    })
}


router.get('/share',(req,res)=>{
    //  isActionPage  字段是用来判断是否在用户中心的用户动态页面
    var { userid, text, value, contentId, actionId, onModel, commentid, composeAction, isActionPage  } = req.query;
    var date = new Date().toString();
    //  如果text存在，说明转发的是评论，如果为空，说明直接转发的文章或话题
    if (!value){
        value = `转发${util.translateType(onModel)}`
    }     
    //util.responseClient(res,200,0,'ok');   
    var action = new Action({
        user:userid,
        contentId,
        onModel,
        date,
        text,
        value,
        composeAction:Boolean(composeAction)   
    });

    action.save()
        .then(()=>{
            if ( isActionPage ){
                Action.updateOne({_id:actionId},{$push:{shareBy:action._id}},(err, result)=>{
                    getUserOrSingleActions( res, userid);
                })
            } else if ( commentid ) {
            //  如是转发的评论则更新该条评论的shareBy字段
                getShareBy(Comment, commentid, action._id, res);
                //  如转发话题更新该话题的shareBy
            }  else if ( onModel =='Topic') {
                Topic.updateOne({_id:contentId},{$push:{shareBy:action._id}},(err,result)=>{
                    userPromise.getTopicContent(res, contentId);
                })               
                //  如转发新闻更新该新闻的shareBy
            }   else if ( onModel == 'Article') {
                getShareBy(Article, contentId, action._id, res);
            } else if ( onModel =='Action') {
                getShareBy(Action, contentId, action._id, res);
            } else if ( onModel == 'Collect') {
                Collect.updateOne({_id:contentId},{$push:{shareBy:action._id}},(err,result)=>{
                    userPromise.getCollectContent(res, contentId);
                })
            }
            
        })        
})



function getUserOrSingleActions( res, userid, actionId){
    var option = actionId ? { _id:actionId} : userid ? { user:userid} : null;
    if (!option) return;
    Action.find(option)
        .populate({ path:'likeUsers.user', select:'username userImage'})
        .populate({ path:'dislikeUsers.user', select:'username userImage'})
        .populate({
            path:'shareBy',
            populate:{path:'user',select:'username userImage'},
            select:'value date user'
        })
        .populate({path:'user', select:'username userImage'})
        .populate({
            path:'contentId',
            populate:[
                { path:'fromUser',select:'username userImage'},
                { path:'tags',select:'tag'},
                { path:'follows.user', select:'username userImage'},
                { path:'user', select:'username userImage'},
                { path:'followedBy.user', select:'username userImage'},
                {
                    path:'collectItem',
                    populate:{ 
                        path:'contentId',
                        populate:[
                            { path:'follows.user', select:'username userImage'},
                            { path:'shareBy', populate:{ path:'user', select:'username userImage'}, select:'value date user'},
                            { path:'user', select:'username userImage'},
                            { path:'tags', select:'tag'}

                        ]
                    }
                },
                {
                    path:'shareBy',
                    populate:{path:'user', select:'username userImage'},
                    select:'value date user'
                },
                //  填充内部动态的所需的字段
                {
                    path:'contentId',
                    populate:[
                        { path:'user', select:'username userImage'},
                        { path:'tags', select:'tag'},
                        { path:'follows.user', select:'username userImage'},
                        { path:'followedBy.user', select:'username userImage'},
                        { path:'shareBy', populate:{ path:'user', select:'username userImage'}, select:'value date user'},
                        {
                            path:'collectItem',
                            populate:{ 
                                path:'contentId',
                                populate:[
                                    { path:'follows.user', select:'username userImage'},
                                    { path:'shareBy', populate:{ path:'user', select:'username userImage'}, select:'value date user'},
                                    { path:'user', select:'username userImage'},
                                    { path:'tags', select:'tag'}
        
                                ]
                            }
                        },
                    ]
                }
            ]
                 
        })
        .then(actions=>{
            console.log(actions);
            util.responseClient(res, 200, 0, 'ok', actions);
        })
}

router.get('/create',(req,res)=>{
    var { description, privacy, userid, images } = req.query;
    var date = new Date().toString();
    var action = new Action({
        date,
        value:description,
        images,
        user:userid,
        isCreated:true
    });
    action.save()
        .then(()=>{
            console.log(userid);
            getUserOrSingleActions( res, userid);
        })
})


router.get('/getUserActions',(req,res)=>{
    var { userid } = req.query;
    getUserOrSingleActions( res, userid);
})

function _operateAction( action, id, isCancel, userid, res ){
    var date = new Date().toString();
    var operate = isCancel ? '$pull':'$push';
    var option = isCancel ? {user:userid} : {user:userid,date};
    Action.updateOne({_id:id},{[operate]:{[action+'Users']:option}},(err,result)=>{
        getUserOrSingleActions(res, null, id);         
    })
}

router.get('/operate',(req,res)=>{
    var { action, id, userid, isCancel } = req.query; 
    _operateAction(action,id,isCancel,userid, res);
})


router.get('/getActionContent',(req,res)=>{
    var { contentId } = req.query;
    getUserOrSingleActions(res, null, contentId);
})

router.get('/delete',(req,res)=>{
    var { id } = req.query;
    Action.findOne({_id:id},(err,doc)=>{
        var { onModel, contentId } = doc;
        Action.deleteOne({_id:id},(err,result)=>{
            if ( onModel ==='Article') {
                Article.updateOne({_id:contentId},{$pull:{shareBy:id}},(err,result)=>{
                    util.responseClient(res, 200, 0, 'ok');
                })
            } else if ( onModel === 'Topic') {
                Topic.updateOne({_id:contentId},{$pull:{shareBy:id}},(err, result)=>{
                    util.responseClient(res, 200, 0, 'ok');
                })
            } else if ( onModel === 'Action') {
                Action.updateOne({_id:contentId},{$pull:{shareBy:id}},(err, result)=>{
                    util.responseClient(res, 200, 0, 'ok');
                })
            } else {
                util.responseClient(res, 200, 0, 'ok');
            }
        })
        
    })
    
})

module.exports = router;