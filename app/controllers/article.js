const Acticle = require('../models/article');

// 文章发布页面
exports.admin = function (request, response) {
	response.render('admin-article',{
		title : '文章发布'
	})
}
// 文章保存
exports.save = function (request, response) {
	var _article = request.body.article;
	_article.keyword = _article.keyword.split(';');
	var article = new Acticle(_article);
	article.save((error,article) => {
		if (error) {
			console.log(error);
		} else {
			response.redirect('/article?id=' + article._id);
		}
	})
}
// 文章内容页面
exports.article = function (request, response) {
	var id = request.query.id;
	console.log(id);
	if (id) {
		Acticle.findOne({_id: id})
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
	Acticle.find({})
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
		Acticle.remove({_id: id},(error) => {
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