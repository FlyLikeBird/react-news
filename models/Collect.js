var mongoose = require('mongoose');
var collectSchema = require('../schemas/collects');

module.exports = mongoose.model('Collect',collectSchema);