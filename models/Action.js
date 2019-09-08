var mongoose = require('mongoose');
var actionSchema = require('../schemas/actions');

module.exports = mongoose.model('Action',actionSchema);