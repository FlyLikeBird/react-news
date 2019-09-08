/**
 * 评论的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username:String,
    avatar:String,
    date:String,
    uniquekey:String,
    content:String,
    like:{type:Number,default:0},
    images:[String],
    dislike:{type:Number,default:0},
    isHot:{type:Boolean,default:false},
    replies:[{date:String,fromUser:String,avatar:String,images:[String],toUser:String,like:{type:Number,default:0},dislike:{type:Number,default:0},content:String,fromSubTextarea:Boolean}]
});


