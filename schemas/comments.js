/**
 * 评论的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username:String,
    avatar:String,
    date:String,
    //  评论针对的内容id ，如articleId/topicId/actionId
    uniquekey:String,
    content:String,
    commentType:String,
    likeUsers:[{userid:String,date:String}],
    images:[String],
    dislikeUsers:[{userid:String,date:String}],
    isHot:{type:Boolean,default:false},
    //  shareBy 存储的是actionId
    shareBy:[String],
    replies:[{
        date:String,
        fromUser:String,
        avatar:String,
        images:[String],
        toUser:String,
        commentType:String,
        likeUsers:[{userid:String,date:String}],
        dislikeUsers:[{userid:String,date:String}],
        content:String,
        shareBy:[String],
        fromSubTextarea:Boolean
    }]
});


