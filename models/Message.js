var mongoose = require('mongoose');
var messageSchema = require('../schemas/messages');

module.exports = mongoose.model('Message',messageSchema);