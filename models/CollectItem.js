var mongoose = require('mongoose');
var collectItemSchema = require('../schemas/collectItems');

module.exports = mongoose.model('CollectItem',collectItemSchema);