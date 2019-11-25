/**
 * 用户的表结构
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = new mongoose.Schema({
    tag:String,
    date:String,
    content:[{type:Schema.Types.ObjectId, ref:'Topic'}]
});


