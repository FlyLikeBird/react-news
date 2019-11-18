/**
 * 评论的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    fromUser:{type:Schema.Types.ObjectId, ref:'User'},
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


