/**
 * 意见反馈模型
 */
var opinionSchema = require('../schemas/opinion');
var mongoose = require('mongoose');
var opinionModel = mongoose.model('Opinion', opinionSchema);
module.exports = opinionModel;