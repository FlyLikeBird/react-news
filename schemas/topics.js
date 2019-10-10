/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    title:String,
    userid:String,
    username:String,
    date:String,
    description:String,
    isHot:{type:Boolean,default:false},
    view:{type:Number,default:0},
    privacy:{type:Number,default:0},
    tag:[String],
    images:[{
        filename:String,
        originalname:String,
        originalpath:String
    }],
    follows:[{userid:String,date:String}],
    shareBy:[String]   
});


