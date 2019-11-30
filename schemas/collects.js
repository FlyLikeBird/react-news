/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    tag:String,
    content:[{
        addtime:String,
        contentId:{type:Schema.Types.ObjectId, refPath:'onModel'},
        onModel:{
            type:String,
            required:true,
            enum:['Article','Topic']
        }
    }],
    createtime:String,
    user:{type:Schema.Types.ObjectId, ref:'User'},
    defaultCollect:{type:Boolean,default:false},
    // 0 公开的 1 关注的人可见 2 私密,仅自己可见  
    privacy:{type:Number,default:0},
    followedBy:[{user:{type:Schema.Types.ObjectId, ref:'User'},addtime:String}],
    shareBy:[{type:Schema.Types.ObjectId, ref:'Action'}]
   
});


