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
	var editorValue = request.body.editorValue;
	_article.content = editorValue;
	
	if( typeof(_article.categories) == "string" ) {
		var _artCates = [];
		_artCates.push(_article.categories);
	} else {
		var _artCates = _article.categories;
	}

	// 找出对应的分类
	_article.categories = [];
	ArtCate.find({},(error,artcates) => {
		_artCates.forEach( function(element, index) {
			var element = parseInt(element);
			// 文章的 分类 提取
			_article.categories.push({
				_id: artcates[element]._id,
				name: artcates[element].name
			});
		});
		// 保存文章
		_article.createAt = _article.updateAt = new Date().getTime();
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
	if (id) {
		Article.findOne({_id: id})
		// .populate('author', 'name')
		.exec((error,article) => {
			if (error) {
				console.log(error);
			} else {
				User.findOne({_id:request.session.user._id},(error,user) => {
					for (var i = 0 ; i< article.browseUsers.length; ) {
						if (article.browseUsers[i].user._id == request.session.user._id) {
							article.browseUsers.splice(i, 1);
						} else {
							i ++;
						}
					}
					article.browseUsers.unshift({
						user: {
							name : user.name,
							_id : user._id
						},
						time :  new Date().getTime()
					});
					article.save((error,article) => {
						response.render('article',{
							article : article
						})
					});
				})
			}
		})
	}
}
var compare = function (x, y) {
    if (x.updateAt < y.updateAt) {
        return 1;
    } else if (x.updateAt > y.updateAt) {
        return -1;
    } else {
        return 0;
    }
}
// 文章列表
exports.articleList = function (request, response) {
	const pageArts = 2;
	const page = parseInt(request.query.index || 0);
	const userId = request.query.id || "";
	const artCate = request.query.artCate || "";
	if (userId) {
		User.findOne({_id:userId})
		.populate('articles.article','title updateAt createAt author browseUsers')
		.exec((error,user)=>{
			if (error) {
				console.log(error);
			} else {
				var articles = [];
				user.articles.forEach( function(element, index) {
					articles.push(element.article)
				});
				articles = articles.sort(compare);
				var Maxpage = Math.ceil(articles.length/pageArts)
				if (page >= Maxpage) {
					articles = articles.splice((Maxpage-1)*pageArts,pageArts);
				} else {
					articles = articles.splice(page*pageArts,pageArts);
				}
				response.render('article-list',{
					title : '文章列表',
					articles : articles,
					Maxpage : Maxpage,
					page : page,
					userId : user._id,
					artCate : '',
					by: user.name
				});
			}
		})
	} else if (artCate) {
		ArtCate.findOne({name: artCate})
		.populate('articles.article','title updateAt createAt author browseUsers')
		.exec((error,artcate)=>{
			var articles = [];
			artcate.articles.forEach( function(element, index) {
				articles.push(element.article)
			});
			articles = articles.sort(compare);
			var Maxpage = Math.ceil(articles.length/pageArts);
			if (page >= Maxpage) {
				articles = articles.splice((Maxpage-1)*pageArts,pageArts);
			} else {
				articles = articles.splice(page*pageArts,pageArts);
			}
			response.render('article-list',{
				title : '文章列表',
				articles : articles,
				Maxpage : Maxpage,
				page : page,
				userId : '',
				artCate : artCate,
				by: artCate
			});
		})
	} else {
		Article.find({})
		.exec((error,articles) => {
			if (error) {
				console.log(error);
			} else {
				articles = articles.sort(compare);
				var Maxpage = Math.ceil(articles.length/pageArts);
				if (page >= Maxpage) {
					articles = articles.splice((Maxpage-1)*pageArts,pageArts);
				} else {
					articles = articles.splice(page*pageArts,pageArts);
				}
				response.render('article-list',{
					title : '文章列表',
					articles : articles,
					Maxpage : Maxpage,
					page:page,
					userId : '',
					artCate : '',
					by : '所有文章'
				})
			}
		})
	}
}
/**
 * [delete 找到该文章删除,并且找到作者在其文章列表中删除它,文章所属分类列表中也需要删除]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
exports.delete = function (request, response) {
	var id = request.query.id;
	if (id) {
		Article.findOne({_id: id}, (error, article) => {
			if (error) {
				console.log(error);
			} else {
				// 找到作者的文章
				const userId = article.author._id;
				User.findOne({_id: userId}, (error, user) => {
					user.articles.forEach( function(element, index) {
						if (element.article == id) {
							user.articles.splice(index, 1);
							return;
						}
					});
					user.save(() => {
					});
				})
				// 找到分类
				var categories = article.categories;
				categories.forEach( function(category, index) {
					ArtCate.findOne({_id: category.articlecategory}, (error,categorysBycate) => {
						categorysBycate.articles.forEach( function(element, index) {
							if (element.article == id) {
								categorysBycate.articles.splice(index, 1);
								return;
							}
						});
						categorysBycate.save( () => {
						})
					});
				});
				Article.remove({_id: id},(error) => {
					if (error) {
						console.log(error);
					} else {
						console.log('文章本身删除成功');
						response.json({
							success : 1
						});
					}
				})
			}
		});
	}
}