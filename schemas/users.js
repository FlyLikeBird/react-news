/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username:String,
    password:String,
    userFollow:[String],
    userFans:[String],
    addCollect:[String],
    userAction:[String],
    userHistory:[{articleId:String,viewtime:String}],
    userTopic:[String],
    message:[
        {
            fromUser:String,
            toUser:String,
            msgtype:String,
            msgtime:String,
            //  指@消息时的内容Id, articleId,topicId,actionId
            uniquekey:String,
            isRead:{type:Boolean,default:false},
            content:String
            
        }
    ],
    description:{type:String,default:'还未设置签名～'},
    level:{type:Number,default:0},
    userImage:{type:String,default:"https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",trim:true},
    registerTime:{type:String,default:''},
    loginTime:{type:String,default:''},
    lastLoginTime:{type:String,default:''},
    sex:{type:Number,default:0,min:0,max:2},
    email:{type:String,default:'',trim:true},
    phonenum:{type:Number,default:0},
    website:{type:String},
    address:{type:String,default:''}
});


