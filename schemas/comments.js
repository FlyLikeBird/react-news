/**
 * 评论的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new Schema({
    fromUser:{type:Schema.Types.ObjectId, ref:'User'},
    replyTo:{type:Schema.Types.ObjectId, ref:'Comment'},
    parent:{type:Schema.Types.ObjectId, ref:'Comment'},
    date:String,
    //  评论针对的内容id ，如articleId/topicId/actionId
    related:{type:Schema.Types.ObjectId,required:true,refPath:'onModel'},
    onModel:{
        type:String,
        required:true,
        enum:['Article','Topic','Action']
    },
    isSub:Boolean,
    content:String,
    fromSubTextarea:{type:Boolean, default:false},
    likeUsers:[{user:{type:Schema.Types.ObjectId, ref:'User'},date:String}],
    images:[String],
    dislikeUsers:[{user:{type:Schema.Types.ObjectId, ref:'User'},date:String}],
    isHot:{type:Boolean,default:false},
    //  shareBy 存储的是actionId
    shareBy:[{type:Schema.Types.ObjectId, ref:'Action'}],
    replies:[{type:Schema.Types.ObjectId, ref:'Comment'}]
});


