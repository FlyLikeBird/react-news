/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({  
    toUser:{type:Schema.Types.ObjectId, ref:'User'},
    msgtype:String,
    commentid:{type:Schema.Types.ObjectId, ref:'Comment'},
    parentcommentid:{type:Schema.Types.ObjectId, ref:'Comment'},
    isRead:{type:Boolean,default:false},
    date:String,
    msgs:[{
        content:String,
        fromUser:{type:Schema.Types.ObjectId, ref:'User'},
        msgtime:String,
        isRead:{type:Boolean,default:false},
    }]
    
});


