var express = require('express');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var config = require('../../config/config');
var router = express.Router();
var util = require('../util');
var userPromise = require('../userPromise');
var User = require('../../models/User');
var Article = require('../../models/Article');
var Collect = require('../../models/Collect');

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = path.resolve('./src'+'/images/userAvatar');

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


router.get('/register',(req,res)=>{

	var { r_userName, r_password } = req.query;
	
	
	var date = new Date().toString();
	let user = new User({
		username:r_userName,
		password:util.md5(r_password),
		registerTime:date,
		loginTime:date

	});
	user.save()
		.then(()=>{
			User.findOne({_id:user._id},(err,userInfo)=>{
				var data = {};
				data.username = userInfo.username;
				data.userid = userInfo._id;
				data.avatar = userInfo.userImage;
				User.updateOne({'username':r_userName},{$push:{message:{
					fromUser:'React-News平台',
					toUser:r_userName,
					msgtype:'system',
					content:'欢迎使用React-News新闻平台',
					msgtime:date
				}}},(err,result)=>{
					util.responseClient(res,200,0,'ok',data);
				})
			})
			
			var collect = new Collect({
				tag:'默认收藏夹',
				createtime:date,
				userid:user._id,
				defaultCollect:true
			});

			collect.save();
		})
	
})

router.get('/login',(req,res)=>{
	var { username, password } = req.query;	
	User.findOne({username:username},(err,userInfo)=>{
		var obj = {};
		if(!userInfo){
				util.responseClient(res,200,1,'该用户不存在!',obj);
		} else {
			if (userInfo.password === util.md5(password)) {
				obj.username = userInfo.username;
				obj.userid = userInfo._id;	
				obj.avatar = 
				util.responseClient(res,200,0,'',obj);
			} else {
				util.responseClient(res,200,1,'密码输入错误!')
			}
		}
	})
		
})

router.get('/getChatList',(req,res)=>{
	let { username, other } = req.query;	
	User.findOne({'username':username},(err,user)=>{
		var data = [];
		var msgs = user.message;
		
		User.findOne({'username':other},(err,otherUser)=>{

			data = msgs.filter(item=>{

				return item.fromUser === other || item.toUser === other
			})
	
		
			util.responseClient(res,200,0,'ok',data);
		})
		
	})	
})

router.get('/getUserAvatar',(req,res)=>{
	var { user, other } = req.query;

	User.findOne({'username':other},(err,otherUser)=>{
		var avatar = {};
		if (!user){
			if(!otherUser){
				avatar.otherAvatar = "http://localhost:8080/logo.png";
			} else {
				avatar.otherAvatar = otherUser.userImage;
			}			
			util.responseClient(res,200,0,'ok',avatar);
			return ;
		}
		User.findOne({'username':user},(err,selfUser)=>{

			if(!otherUser){
				avatar.otherAvatar = "http://localhost:8080/logo.png";
			} else {
				avatar.otherAvatar = otherUser.userImage;
			}
			
			avatar.selfAvatar = selfUser.userImage;
			util.responseClient(res,200,0,'ok',avatar);			
		})
		
	})
})

router.get('/usercenter',(req,res)=>{
	let { userid } = req.query;
	User.findOne({_id:userid},{password:0})
		.then(user=>{

			var data = {};
			data.description = user.description;
			data.level = user.level;
			data.registertime = user.registerTime;
			data.username = user.username;
			data.userImage = user.userImage;
			var promise1 = new Promise((resolve,reject)=>{
				userPromise.getUserFollows(user.userFollow,resolve);
			});
			var promise2 = new Promise((resolve,reject)=>{
				userPromise.getUserFollows(user.userFans,resolve);
			});
			var promise3 = new Promise((resolve,reject)=>{
				userPromise.getUserActions(user._id,resolve)
			});
			var promise4 = new Promise((resolve,reject)=>{
				userPromise.getUserComments(user.username,resolve)
			});
			var promise5 = new Promise((resolve,reject)=>{
				userPromise.getUserHistory(userid,resolve);
			});
			var promise6 = new Promise((resolve,reject)=>{
				userPromise.getUserCollect(userid,resolve);
			});
			
			Promise.all([promise1,promise2,promise3,promise4,promise5,promise6])
				.then(([follows,fans,actions,comments,userHistory,userCollect])=>{
					data.userFollow = follows;
					data.userFans = fans;
					data.userAction = actions;
					data.userHistory = userHistory;
					data.userCollect = userCollect;
			
					data.comments = comments;
					util.responseClient(res,200,0,'ok',data);

				})			
		})		
})

router.get('/getUserInfo',(req,res)=>{
	var { user, localUser } = req.query;
	//  0-未关注 1-已关注 2-互相关注
	User.findOne({'username':localUser},(err,localUser)=>{
		var follows = localUser.userFollow.map(item=>item.id);
		var fans = localUser.userFans.map(item=>item.id);
		User.findOne({'username':user},(err,user)=>{
			var obj = {};
			if(user){
				var userid = user._id;				
				var status = 0;
				if (follows.includes(userid)) {
					if ( fans.includes(userid)){
						status = 2;
					} else {
						status = 1;
					}
				}
				obj.userFollow = user.userFollow;
				obj.userFans = user.userFans;
				obj.description = user.description;
				obj.level = user.level;
				obj.username = user.username;
				obj.userImage = user.userImage;
				obj.id = user._id;
				obj.status = status;					
			}
			util.responseClient(res,200,0,'ok',obj);

		})
	})
})

router.get('/editSign',(req,res)=>{
	let { user, description } = req.query;

	User.updateOne({username:user},{$set:{description}},(err,result)=>{
		if (result) {
			User.findOne({username:user})
				.then(user=>{
					var data={};
					data.description = user.description;
					util.responseClient(res,200,0,'',data);
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
	let { username, follow } = req.query;
	
	User.findOne({'username':username},(err,user)=>{
		if (user){
			var userId = user._id;
			User.updateOne({'username':username},{$push:{userFollow:follow}},(err,result)=>{
				//console.log(result);
				User.updateOne({_id:follow},{$push:{userFans:userId}},(err,result)=>{
					//console.log(result);
			})

			util.responseClient(res,200,0,'');

			})
		}
	})	
	
})


router.get('/removeFollow',(req,res)=>{
	let { username, follow } = req.query;

	User.updateOne({'username':username},{$pull:{userFollow:follow}},(err,result)=>{
		//console.log(result);
		User.findOne({'username':username},(err,user)=>{
			User.updateOne({_id:follow},{$pull:{userFans:user._id}},(err,result)=>{
				//console.log(result);
			});

			util.responseClient(res,200,0,'ok');
		})
		
	})

})

router.post('/upload',upload.single('file'),(req,res)=>{
	
	var { username } = req.body;
	var imgUrl = config.uploadPath+'/userAvatar/'+req.file.filename;

	User.updateOne({username},{$set:{userImage:imgUrl}},(err,result)=>{
		if (err) throw err;
		
		User.findOne({username})
			.then(user=>{
				if (!user) {

				} else {

					var data = {
						message:'success',
						imgUrl:user.userImage
					};
					util.responseClient(res,200,0,'ok',data);
				}

			})	
	})
	
})

router.get('/pushHistory',(req,res)=>{
	let { uniquekey, userid } = req.query;
	
	User.findOne({_id:userid},(err,user)=>{
		if(user){
			var historys = user.userHistory;
			var isExist = false;
			var date  = new Date().toString();
			historys.map(item=>{
				if(item.articleId===uniquekey) {
					isExist = true;
				}
			})
			
			if(!isExist){
				User.updateOne({_id:userid},{$push:{userHistory:{articleId:uniquekey,viewtime:date}}},(err,result)=>{
					//console.log(result);
				})
			} else {
				User.updateOne({_id:userid,'userHistory.articleId':uniquekey},{$set:{'userHistory.$.viewtime':date}},(err,result)=>{
					
				})
			}
	
			util.responseClient(res,200,0,'ok');
		}
				
	})
			
})


router.get('/removeHistory',(req,res)=>{
	let { userid , uniquekey } = req.query;

	User.updateOne({_id:userid},{$pull:{userHistory:{'articleId':uniquekey}}},(err,result)=>{
		util.responseClient(res,200,0,'ok');
	})
})

router.get('/cleanHistory',(req,res)=>{
	var { userid } = req.query;
	User.updateOne({_id:userid},{$pull:{userHistory:{}}},(err,result)=>{
		util.responseClient(res,200,0,'ok')
	})
})

router.get('/operatecomment',(req,res)=>{
	var { user } = req.query;

	User.updateOne({'username':user},{$inc:{level:1}},(err,result)=>{
	
		console.log(result);
		util.responseClient(res,200,0,'ok');
	})
})

router.get('/getUserFollows',(req,res)=>{
	var { userid } = req.query;
	User.findOne({_id:userid},(err,user)=>{
		var follows = user.userFollow;
		User.find({'_id':{$in:follows}},(err,users)=>{
			var users = users.map(item=>{
				var obj = {};
				obj.id = item._id;
				obj.username = item.username;
				return obj;
			})
			
			util.responseClient(res,200,0,'ok',users);
		})
	})
})

router.get('/removeActionMsg',(req,res)=>{
	var { userid, msgId } = req.query;
	User.updateOne({'_id':userid},{$pull:{message:{'_id':msgId}}},(err,result)=>{
		console.log(result);
		util.responseClient(res,200,0,'ok');
	})
})
module.exports = router