const Article = require('../models/article');
const User = require('../models/user');
const ArtCate = require('../models/articleCategory');

// 文章发布页面
exports.admin = function (request, response) {
	// 找到文章分类数组 
	ArtCate.find({},(error,artcates) => {
		response.render('admin-article',{
			title : '文章发布',
			artcates : artcates
		})
	})
}
// 文章保存
exports.save = function (request, response) {
	var _article = request.body.article;
	// 关键词
	_article.keyword = _article.keyword.split(';');
	// 找出对应的分类
	_artCates = _article.categories;
	_article.categories = [];
	ArtCate.find({},(error,artcates) => {
		_artCates.forEach( function(element, index) {
		var element = parseInt(element);
		// 文章的 分类 提取
		_article.categories.push({articlecategory:artcates[element]._id});
		});
		// 保存文章
		var article = new Article(_article);
		article.save((error,article) => {
			if (error) {
				console.log(error);
			} else {
				// 添加文章到 分类
				_artCates.forEach( function(element, index) {
				var element = parseInt(element);
					artcates[element].articles.unshift({
						article : article._id
					})
					artcates[element].save();
				});
				// 添加文章到作者
				User.findOne({_id:request.session.user._id},(error,user) => {
					user.articles.unshift({
						article : article._id
					});
					user.save();
				})
				response.redirect('/article?id=' + article._id);
			}
		})
	});
}
// 文章内容页面
exports.article = function (request, response) {
	var id = request.query.id;
	console.log(id);
	if (id) {
		Article.findOne({_id: id})
		.populate('author', 'name')
		.exec((error,article) => {
			console.log(article);
			if (error) {
				console.log(error);
			} else {
				response.render('article',{
					article : article
				})
			}
		})
	}
}
// 文章列表
exports.articleList = function (request, response) {
	Article.find({})
	.populate('author', 'name')
	.exec((error,articles) => {
		if (error) {
			console.log(error);
		} else {
			response.render('article-list',{
				title : '文章列表',
				articles : articles
			})
		}
	})
}
// 删除文章
exports.delete = function (request, response) {
	var id = request.query.id;
	if (id) {
		Article.remove({_id: id},(error) => {
			if (error) {
				console.log(error);
			} else {
				response.json({
					success : 1
				})
			}
		})
	}
}