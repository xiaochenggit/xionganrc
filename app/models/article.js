var articleSchema = require('../schemas/article');
var mongoose = require('mongoose');
var articleModel = mongoose.model('Article', articleSchema);
module.exports = articleModel;