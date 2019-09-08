var mongoose = require('mongoose');
var topicSchema = require('../schemas/topics');

module.exports = mongoose.model('Topic',topicSchema);