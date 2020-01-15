/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    username:String,
    password:String,
    userFollows:[{type:Schema.Types.ObjectId,ref:'User'}],
    userFans:[{type:Schema.Types.ObjectId,ref:'User'}],
    userCollects:[{type:Schema.Types.ObjectId,ref:'Collect'}],
    userActions:[{type:Schema.Types.ObjectId,ref:'Action'}],
    userHistorys:[{articleId:{type:Schema.Types.ObjectId, ref:'Article'},viewtime:String}],
    userTopics:[{type:Schema.Types.ObjectId,ref:'Topic'}],
    //  String指的是Message表的 ObjectId
    message:[{type:Schema.Types.ObjectId, ref:'Message'}],
    description:{type:String,default:'还未设置签名～'},
    level:{type:Number,default:0},
    userImage:{type:String,default:'http://image.renshanhang.site/defaultAvatar.jpg'},
    registerTime:{type:String,default:''},
    loginTime:{type:String,default:''},
    lastLoginTime:{type:String,default:''},
    sex:{type:Number,default:0,min:0,max:2},
    email:{type:String,default:'',trim:true},
    phonenum:{type:Number,default:0},
    website:{type:String},
    address:{type:String,default:''}
});


