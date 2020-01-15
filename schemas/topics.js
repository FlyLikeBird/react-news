/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    title:String,
    user:{type:Schema.Types.ObjectId, ref:'User'},
    date:String,
    description:String,
    isHot:{type:Boolean,default:false},
    view:{type:Number,default:0},
    privacy:{type:Number,default:0},
    tags:[{type:Schema.Types.ObjectId, ref:'Tag'}],
    images:[String],
    follows:[{user:{type:Schema.Types.ObjectId, ref:'User'},date:String}],
    shareBy:[{type:Schema.Types.ObjectId, ref:'Action'}],
    replies:{type:Number,default:0}   
});


