var userCommentSchema = require('../schemas/userComment');
var mongoose = require('mongoose');
var userCommentModel = mongoose.model('userComment', userCommentSchema);
module.exports = userCommentModel;