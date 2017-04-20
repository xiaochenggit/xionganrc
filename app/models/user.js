// 人物模式
var userSchema = require('../schemas/user');
var mongoose = require('mongoose');
var userModel = mongoose.model('User', userSchema);
module.exports = userModel;