/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    type:String,
    realType:String,
    newstime:String,
    auth:String,
    title:String,
    content:String,
    thumbnails:[String],
    viewcount:{type:Number,default:100},
    articleFever:{type:Number,default:0},
    // shareBy 存储的是actionId
    shareBy:[{type:Schema.Types.ObjectId, ref:'Action'}],
    tags:[String],
    viewUsers:[{
        user:{type:Schema.Types.ObjectId, ref:'User'},
        date:String,
        score:Number
    }]

});


