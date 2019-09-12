/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    
    fromUser:String,
    toUser:String,
    msgtype:String,
    msgtime:String,
    //  指@消息时的内容Id, articleId,topicId,actionId
    uniquekey:String,
    isRead:{type:Boolean,default:false},
    content:String
            
        
});


