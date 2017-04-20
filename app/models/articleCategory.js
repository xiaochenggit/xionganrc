// 文章分类模式
var articleCategorySchema = require('../schemas/articleCategory');
var mongoose = require('mongoose');
var articleCategoryModel = mongoose.model('articleCategory', articleCategorySchema);
module.exports = articleCategoryModel;