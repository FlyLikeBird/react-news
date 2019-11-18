/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    
    fromUser:String,
    toUser:String,
    msgtype:String,
    msgtime:String,
    //  指@消息对应的评论id
    commentid:String,
    parentcommentid:String,
    //  标识评论针对的内容类型，如新闻/话题/动态
    isRead:{type:Boolean,default:false},
    content:String
       
});


