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

router.get('/share',(req,res)=>{
    //  isActionPage  字段是用来判断是否在用户中心的用户动态页面
    var { userid, text, value, contentId, contentType, actionId, innerAction, commentid, parentcommentid ,isActionPage, composeAction } = req.query;
    var date = new Date().toString();
    //  如果text存在，说明转发的是评论，如果为空，说明直接转发的文章或话题

    if (!value){
        value = `转发${util.translateType(contentType)}`
    } 
    //console.log(userid,text,value,contentId,contentType,actionId);
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
        innerAction,
        date,
        text,
        value,
        composeAction:Boolean(composeAction)    
    });

    action.save()
        .then(()=>{
            
            //  如当前用户在动态列表页面
            if (isActionPage){
                Action.updateOne({_id:actionId},{$push:{shareBy:action._id}},(err,result)=>{
                    
                        var promise = new Promise((resolve,reject)=>{
                            userPromise.getUserActions(userid,resolve);
                        });
                        //  更新后的动态列表数据和被分享的某条动态的shareBy字段
                        promise.then(actions=>{
                            util.responseClient(res,200,0,'ok',actions);
                        })
                
                })
            //  如是转发的评论则更新该条评论的shareBy字段
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
                //  如转发话题更新该话题的shareBy
            }  else if (contentType=='topic') {
                Topic.updateOne({_id:contentId},{$push:{shareBy:action._id}},(err,result)=>{
                    Topic.findOne({_id:contentId},(err,topic)=>{
                        util.responseClient(res,200,0,'ok',topic.shareBy);
                    })
                })
                //  如转发新闻更新该新闻的shareBy
            } else if (contentType =='news') {
                
                Article.updateOne({articleId:contentId},{$push:{shareBy:action._id}},(err,result)=>{
                    Article.findOne({articleId:contentId},(err,article)=>{
                        util.responseClient(res,200,0,'ok',article.shareBy);
                    })
                })
                //  在动态详情页
            } else if (contentType=='action'){
                Action.updateOne({_id:actionId},{$push:{shareBy:action._id}},(err,result)=>{
                    Action.findOne({_id:actionId},(err,action)=>{
                        util.responseClient(res,200,0,'ok',action.shareBy);
                    })
                })
            }
            
            
        })  
    
    
})

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
        contentType:'action',
        contentId:'',
        userid,
        isCreated:true
    });
    action.save()
        .then(()=>{
            var promise = new Promise((resolve,reject)=>{
                userPromise.getUserActions(userid,resolve);
            });
            promise.then(actions=>{
                util.responseClient(res,200,0,'ok',actions);
            })
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
            var allUsers = userid;
            var data = allUsers.map(item=>{
                var obj = {};
                for(var i=0,len=users.length;i<len;i++){
                    if (item == users[i]._id){
                        obj.username = users[i].username;
                        obj.userid = users[i]._id;
                        obj.avatar = users[i].userImage;
                        return obj;
                    }
                }
                
            });
            util.responseClient(res,200,0,'ok',data);
        })
    } else {
        var promise = new Promise((resolve,reject)=>{
            Action.find({_id:{$in:actionId}},(err,actions)=>{
                userPromise.getActionsInfo(actions,resolve);
            })           
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
    Action.deleteOne({_id:id},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    })
})

module.exports = router;