/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    articleId:String,
    type:String,
    realtype:String,
    newstime:String,
    auth:String,
    title:String,
    content:String,
    viewcount:{type:Number,default:100},
    articleFever:{type:Number,default:0},
    // shareBy 存储的是actionId
    shareBy:[String],
    viewUsers:[{
        userid:String,
        date:String,
        score:Number
    }]

});


