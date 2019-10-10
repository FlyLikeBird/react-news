/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

var MenSchema = new mongoose.Schema({
    user:String,
    score:{type:Number,default:0}
});

var ItemsSchema = new mongoose.Schema({
    name:String,
    men:[MenSchema]
});

var ListsSchema = new mongoose.Schema({
    title:{type:String,required:true},
    item:[ItemsSchema]
});

var Men = mongoose.model('Men',MenSchema);
var Item = mongoose.model('Item',ItemsSchema);
var List = mongoose.model('List',ListsSchema);







