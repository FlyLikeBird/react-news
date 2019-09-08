/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    fromUser:String,
    toUser:String,
    msgtype:String,

    message:[{content:String,fromUser:String,msgtime:String,isRead:{type:Boolean,default:false}}], 
    
    avatar:{type:String,default:'http://localhost:8080/logo.png'}   
});


