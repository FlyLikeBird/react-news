/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({    
    // content 需要解析 @username:hello world 
    text:String, 
    // value 是用户转发时输入的数据 
    value:String,
    date:String,
    // 标识动态嵌入的内容类别，如新闻／话题／收藏夹/动态自身
    contentId:{type:Schema.Types.ObjectId,refPath:'onModel'},
    onModel:{
        type:String,
        enum:['Article','Topic','Action','Collect']
    },
    images:[String],
    innerAction:{type:Schema.Types.ObjectId,ref:'Action'},
    //  composeAction字段标识转发动态之间的数据关系
    composeAction:{type:Boolean,default:false},
    likeUsers:[{user:{type:Schema.Types.ObjectId,ref:'User'},date:String}],
    dislikeUsers:[{user:{type:Schema.Types.ObjectId,ref:'User'},date:String}],
    //  String指分享某条动态的动态ID
    shareBy:[{type:Schema.Types.ObjectId,ref:'Action'}],
    user:{type:Schema.Types.ObjectId,ref:'User'},
    // 标识是创建还是转发生成的动态
    isCreated:{type:Boolean,default:false},
    replies:[{type:Schema.Types.ObjectId ,ref:'Comment'}]
});


