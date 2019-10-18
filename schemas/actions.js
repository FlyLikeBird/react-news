/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({    
    // content 需要解析 @username:hello world 
    text:String, 
    // value 是用户转发时输入的数据 
    value:String,
    date:String,
    // 标识动态嵌入的内容类别，如新闻／话题／收藏夹/动态自身
    contentType:String,
    contentId:String,
    images:[String],
    innerAction:String,
    //  composeAction字段标识转发动态之间的数据关系
    composeAction:{type:Boolean,default:false},
    likeUsers:[{userid:String,date:String}],
    dislikeUsers:[{userid:String,date:String}],
    //  String指分享某条动态的动态ID
    shareBy:[String],
    userid:String,
    // 标识是创建还是转发生成的动态
    isCreated:{type:Boolean,default:false}
});


