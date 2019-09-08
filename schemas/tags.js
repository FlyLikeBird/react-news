/**
 * 用户的表结构
 */

var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    tag:String,
    date:String,
    content:[String]
});


