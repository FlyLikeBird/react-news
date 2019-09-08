/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    uniquekey:String,   
    // content 需要解析 @username:hello world 
    content:String, 
    // value 是用户转发时输入的数据 
    value:String,
    date:String,
    // 标识动态信息类别，如新闻／话题／收藏夹/动态自身
    actionType:String,
    like:{type:Number,default:0},
    dislike:{type:Number,default:0},
    //  String指分享某条动态的动态ID
    shareBy:[String],
    userid:String,
    replies:[String]
});


