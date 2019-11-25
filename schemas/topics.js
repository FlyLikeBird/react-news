/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    title:String,
    fromUser:{type:Schema.Types.ObjectId, ref:'User'},
    date:String,
    description:String,
    isHot:{type:Boolean,default:false},
    view:{type:Number,default:0},
    privacy:{type:Number,default:0},
    tags:[{type:Schema.Types.ObjectId, ref:'Tag'}],
    images:[{
        filename:String,
        originalname:String,
        originalpath:String
    }],
    follows:[{user:{type:Schema.Types.ObjectId},date:String}],
    shareBy:[{type:Schema.Types.ObjectId, ref:'Action'}],
    replies:{type:Number, default:0}   
});


