var express = require('express');
var router = express.Router();
var multer = require('multer');
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

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};
var uploadFolder = path.resolve('./src'+'/images/action');
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


function getShareBy(Collect, contentId, actionId, res){
    Collect.updateOne({_id:contentId},{$push:{shareBy:actionId}},(err,result)=>{
        Collect.findOne({_id:contentId},{shareBy:1})
            .populate({
                path:'shareBy',
                populate:{ path:'user', select:'username userImage'},
                select:'user value date'
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
    //console.log(userid,text,value,contentId,contentType,actionId);
    //util.responseClient(res,200,0,'ok');
    /*
    User.updateOne({_id:userid},{$set:{userAction:[]}},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    });
    */
    
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
                    getUserActions(userid, res);
                })
            } else if ( commentid ) {
            //  如是转发的评论则更新该条评论的shareBy字段
                
                //  如转发话题更新该话题的shareBy
            }  else if ( onModel =='Topic') {
                getShareBy(Topic, contentId, action._id, res);
                //  如转发新闻更新该新闻的shareBy
            }   else if ( onModel == 'Article') {
                getShareBy(Article, contentId, action._id, res);
            } else if ( onModel =='Action') {
                getShareBy(Action, contentId, action._id, res);
            }
            
        })        
})



function getUserActions(userid, res){
    Action.find({user:userid})
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
                { path:'contentId'}
            ]
                 
        })
        .sort({_id:-1})
        .then(actions=>{
            util.responseClient(res, 200, 0, 'ok', actions);
        })
}

router.post('/create',upload.array('images'),(req,res)=>{
    var { description, privacy, userid } = req.body;
    var date = new Date().toString(),images = [];
    if(req.files){
        images = req.files.map(item=>config.uploadPath+'/action/'+item.filename)   
    }  
    var action = new Action({
        date,
        value:description,
        images,
        user:userid,
        isCreated:true
    });
    action.save()
        .then(()=>{
            getUserActions(userid, res);
        })
})


router.get('/getUserActions',(req,res)=>{
    var { userid } = req.query;
    getUserActions(userid, res);
})

function _operateAction( action, id, isCancel, userid, res ){
    var date = new Date().toString();
    var operate = isCancel ? '$pull':'$push';
    var option = isCancel ? {user:userid} : {user:userid,date};
    Action.updateOne({_id:id},{[operate]:{[action+'Users']:option}},(err,result)=>{
        Action.findOne({_id:id},{likeUsers:1, dislikeUsers:1})
            .populate({ path:'likeUsers.user', select:'username userImage'})
            .populate({ path:'dislikeUsers.user', select:'username userImage'})
            .then(doc=>{
                util.responseClient(res, 200, 0, 'ok', doc);
            })
         
    })
}

router.get('/operate',(req,res)=>{
    var { action, id, userid, isCancel } = req.query; 
    _operateAction(action,id,isCancel,userid, res);
    
})


router.get('/getActionContent',(req,res)=>{
    var { contentId } = req.query;
    Action.findOne({_id:contentId},(err,action)=>{
        var userid = action.userid;
        User.findOne({_id:userid},(err,user)=>{
            var obj = {};
            obj.username = user.username;
            obj.avatar = user.userImage;
            obj.id = action.id;
            obj.value = action.value;
            obj.text = action.text;
            obj.shareBy = action.shareBy;
            obj.likeUsers = action.likeUsers;
            obj.dislikeUsers = action.dislikeUsers;
            obj.contentId = action.contentId;
            obj.contentType = action.contentType;
            obj.innerAction = action.innerAction;
            obj.composeAction = action.composeAction;
            obj.images = action.images;
            obj.isCreated = action.isCreated;       
            util.responseClient(res,200,0,'ok',obj);
        })
    })
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
            }
        })
        
    })
    
})

module.exports = router;