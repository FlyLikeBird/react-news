/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


module.exports = new mongoose.Schema({
    addtime:String,
    contentId:{type:Schema.Types.ObjectId, required:true, refPath:'onModel'},
    onModel:{
        type:String,
        required:true,
        enum:['Article','Topic']
    }
});


