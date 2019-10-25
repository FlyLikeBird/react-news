/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    type:String,
    articleId:String,
    realType:String,
    newstime:String,
    auth:String,
    title:String,
    content:String,
    thumbnails:[String],
    viewcount:{type:Number,default:100},
    articleFever:{type:Number,default:0},
    // shareBy 存储的是actionId
    shareBy:[String],
    tags:[String],
    viewUsers:[{
        userid:String,
        date:String,
        score:Number
    }]

});


