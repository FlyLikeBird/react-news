var express = require('express');
var fs = require('fs');
var path = require('path');
var config = require('../../config/config');
var router = express.Router();
var util = require('../util');
var qiniu = require('qiniu');
var userPromise = require('../userPromise');
var mongooseOperations = require('../mongooseOperations');
var User = require('../../models/User');
var Article = require('../../models/Article');
var Collect = require('../../models/Collect');
var Comment = require('../../models/Comment');
var Message = require('../../models/Message');
var secret = require('../../src/utils/secret');


function _createUser(r_userName, r_password, managerUser, res){
    var date = new Date().toString();
    var user = new User({
        username:r_userName,
        password:r_password,
        registerTime:date,
        loginTime:date
    });
    user.save()
        .then(()=>{
            //  初始化生成一条系统消息
            var message = new Message({
                toUser:managerUser._id,
                msgtype:'system',
                msgs:[{
                    fromUser:managerUser._id,
                    msgtime:date,
                    content:'欢迎使用React-News新闻平台'
                }]
            
            });
            message.save(function(err){
                if (err) throw err;
                User.updateOne({_id:user._id},{$push:{message:message._id}},(err,result)=>{});
                User.findOne({_id:user._id},(err,userInfo)=>{
                    var data = {};
                    data.username = userInfo.username;
                    data.userid = userInfo._id;
                    data.avatar = userInfo.userImage;
                    util.responseClient(res, 200, 0, 'ok', data);
                
                })
            });
        
            //  初始化默认收藏夹
            var collect = new Collect({
                tag:'默认收藏夹',
                createtime:date,
                user:user._id,
                defaultCollect:true
            });
            collect.save();         
            //  默认关注react-news这个管理用户
            User.updateOne({_id:user._id},{$push:{userFollows:managerUser._id}},(err,result)=>{});
            User.updateOne({_id:managerUser._id},{$push:{userFans:user._id}},(err,result)=>{});
        })
}

router.get('/register',(req,res)=>{
    var { r_userName, r_password } = req.query;
    var date = new Date().toString();

    User.findOne({'username':'React-News平台'},(err,manager)=>{
        if(!manager){
            var managerUser = new User({
                username:'React-News平台',
                password:secret.encrypt('1989'),
                registerTime:date,
                loginTime:date,
                userImage:'http://image.renshanhang.site/logo.png'
            });
            managerUser.save()
                .then(()=>{
                    _createUser(r_userName,r_password,managerUser,res);
                })
        } else {
            _createUser(r_userName, r_password, manager, res);
        }
    })  
    
})

router.get('/login',(req,res)=>{
    var { username, password } = req.query; 
    User.findOne({username:username},(err,userInfo)=>{
        var obj = {};
        if(!userInfo){
                util.responseClient(res,200,1,'该用户不存在!',obj);
        } else {
            if ( password === userInfo.password) {
                obj.username = userInfo.username;
                obj.userid = userInfo._id;  
                obj.avatar = userInfo.userImage;
                util.responseClient(res,200,0,'ok',obj);
            } else {
                util.responseClient(res,200,1,'密码输入错误!')
            }
        }
    })
        
})

router.get('/getChatList',(req,res)=>{
    let { userid, other } = req.query;  
    User.findOne({_id:userid},{message:1})
        .populate({
            path:'message',
            populate:[
                {path:'toUser',select:'username userImage'},
                {path:'msgs.fromUser', select:'username userImage'}
            ],
            match:{'toUser':other},
            options:{limit:1}
        })
        .then(doc=>{
            var { message } = doc;
            if ( message && message.length ) {
                util.responseClient(res, 200, 0, 'ok', message[0]);
            } else {
                util.responseClient(res,200,0,'ok');
            }
            
        })
    
})

router.get('/usercenter',(req,res)=>{

	let { userid, isSelf } = req.query;
	//mongooseOperations.addThumbnails();
	User.findOne({_id:userid},{password:0,message:0})
		.populate({path:'userFollows', select:'username level userImage userFans userFollow description'})
		.populate({path:'userFans', select:'username level userImage userFans userFollow description'})
		.populate({
			path:'userHistorys.articleId',
			select:'auth title newstime type thumbnails'
		})
		.then(data=>{
			util.responseClient(res, 200, 0, 'ok', data);
		})
    let { userid, isSelf } = req.query;
    User.findOne({_id:userid},{password:0,message:0})
        .populate({path:'userFollows', select:'username level userImage userFans userFollow description'})
        .populate({path:'userFans', select:'username level userImage userFans userFollow description'})
        .populate({
            path:'userHistorys.articleId',
            select:'auth title newstime type thumbnails'
        })
        .then(data=>{
            util.responseClient(res, 200, 0, 'ok', data);
        })
})

router.get('/getUserInfo',(req,res)=>{
    var { user } = req.query;
    //  0-未关注 1-已关注 2-互相关注
    User.findOne({'username':user},{username:1, userImage:1, userFollows:1, userFans:1, description:1, level:1},(err, userInfo)=>{      
        util.responseClient(res,200,0,'ok',userInfo);   
    })

})

router.get('/editSign',(req,res)=>{
    let { userid, description } = req.query;
    User.updateOne({_id:userid},{$set:{description}},(err,result)=>{
        if (result) {
            User.findOne({_id:userid},(err,user)=>{
                util.responseClient(res, 200, 0, 'ok', user.description);
            })
        }
    })
})

router.get('/checkusername',(req,res)=>{
    var { username } = req.query;
    User.findOne({username:username})
        .then(user=>{
            if (user) {                         
                util.responseClient(res,200,1,'用户已存在')
            } else {                
                util.responseClient(res,200,0,'该用户还未注册！请先完成注册!');
            }
            
        })  
})

router.get('/addFollow',(req,res)=>{
    let { userid, followId } = req.query;
    User.updateOne({_id:userid},{$push:{userFollows:followId}},(err,result)=>{
        User.updateOne({_id:followId},{$push:{userFans:userid}},(err,result)=>{
            util.responseClient(res,200,0,'ok');
        })
    })  
    
})

router.get('/removeFollow',(req,res)=>{
    let { userid, followId } = req.query;
    User.updateOne({_id:userid},{$pull:{userFollows:followId}},(err,result)=>{
        User.updateOne({_id:followId},{$pull:{userFans:userid}},(err,result)=>{
            util.responseClient(res,200,0,'ok');
        })
    })  

})


router.get('/pushHistory',(req,res)=>{
    let { uniquekey, userid } = req.query;
    User.findOne({_id:userid},(err,user)=>{
        if(user){
            var historys = user.userHistorys;
            var isExist = false;
            var date  = new Date().toString();
            historys.map(item=>{
                if(item.articleId==uniquekey) {
                    isExist = true;
                }
            })
            console.log(isExist);
            if(!isExist){
                User.updateOne({_id:userid},{$push:{userHistorys:{articleId:uniquekey,viewtime:date}}},(err,result)=>{})
            } else {
                User.updateOne({_id:userid,'userHistorys.articleId':uniquekey},{$set:{'userHistorys.$.viewtime':date}},(err,result)=>{
                    console.log(result);
                })
            }
            util.responseClient(res,200,0,'ok');
        }               
    })          
})

router.get('/removeHistory',(req,res)=>{
    let { userid , uniquekey } = req.query;
    User.updateOne({_id:userid},{$pull:{userHistorys:{'_id':uniquekey}}},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    })
})

router.get('/cleanHistory',(req,res)=>{
    var { userid } = req.query;
    User.updateOne({_id:userid},{$pull:{userHistorys:{}}},(err,result)=>{
        util.responseClient(res,200,0,'ok')
    })
})

router.get('/operatecomment',(req,res)=>{
    var { userid } = req.query;
    User.updateOne({_id:userid},{$inc:{level:1}},(err,result)=>{
        util.responseClient(res,200,0,'ok');
    })
})

router.get('/getUserFollows',(req,res)=>{
    var { userid } = req.query;
    User.findOne({_id:userid},{userFollows:1})
        .populate({
            path:'userFollows',
            select:'username userImage'
        })
        .then(doc=>{
            var { userFollows } = doc;
            util.responseClient(res, 200, 0, 'ok', userFollows);
        })
})

router.get('/getCommonUsers',(req,res)=>{
    var { userId, currentUserId, follow } = req.query;
    User.findOne({_id:userId},(err,localUser)=>{
        User.findOne({_id:currentUserId},(err,currentUser)=>{
            var data1,data2,result = [];
            if (follow){
                data1 = localUser.userFollows;
                data2 = currentUser.userFollows;
            } else {
                data1 = localUser.userFans;
                data2 = currentUser.userFans;
            }
            data1.map(item=>{
                if(data2.includes(item)){
                    result.push(item);
                }
            });
            User.find({_id:{$in:result}},{username:1, userImage:1, userFollows:1, userFans:1, level:1, description:1})
                .then(users=>{
                    util.responseClient(res, 200, 0, 'ok', users);
                })
        })
    })
})

router.get('/search',(req,res)=>{
    var { words } = req.query;
    var data={total:0}, _filter;
    User.find({'username':{$regex:new RegExp(words)}},{ username:1, level:1, userImage:1, description:1, userFans:1, userFollows:1},(err,users)=>{
        data.data = users;
        data.total = users.length;
        util.responseClient(res, 200, 0, 'ok', data);
    })     
})

router.get('/changeUserAvatar',(req,res)=>{
    var { url, userid } = req.query;
    var imgUrl = `http://image.renshanghang.site/${url}`;
    User.updateOne({_id:userid},{$set:{userImage:imgUrl}},(err,result)=>{
        util.responseClient(res, 200, 0, 'ok');
    })
})

module.exports = router