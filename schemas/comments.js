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
    like:{type:Number,default:0},
    likeUsers:[{user:String,date:String}],
    images:[String],
    dislike:{type:Number,default:0},
    dislikeUsers:[{user:String,date:String}],
    isHot:{type:Boolean,default:false},
    shareBy:[String],
    replies:[{
        date:String,
        fromUser:String,
        avatar:String,
        images:[String],
        toUser:String,
        commentType:String,
        like:{type:Number,default:0},
        likeUsers:[{user:String,date:String}],
        dislike:{type:Number,default:0},
        dislikeUsers:[{user:String,date:String}],
        content:String,
        shareBy:[String],
        fromSubTextarea:Boolean
    }]
});


