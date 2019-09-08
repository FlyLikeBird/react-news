/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    tag:String,
    content:[{id:String,addtime:String}],
    createtime:String,
    userid:String,
    defaultCollect:{type:Boolean,default:false},
    // 0 公开的 1 关注的人可见 2 私密,仅自己可见  
    privacy:{type:Number,default:0},
    followedBy:[String],
    shareBy:[String]
   
});


