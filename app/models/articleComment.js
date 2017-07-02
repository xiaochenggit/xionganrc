var articleCommentSchema = require('../schemas/articleComment');
var mongoose = require('mongoose');
var articleCommentModel = mongoose.model('articleComment', articleCommentSchema);
module.exports = articleCommentModel;