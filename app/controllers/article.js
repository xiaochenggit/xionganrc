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
 
exports.changeSave = (request, response) => {
	var _article = request.body.article;
	var id = _article.id;
	// 内容
	_article.content = request.body['editormd-html-code'];
	// markDown 
	_article.markDown = request.body['editormd-markdown-doc'];
	if (id) {
		Article.findOne({_id: id},(error,article) => {
			if (article && request.session.user._id == article.author._id) {
				article.content = _article.content;
				article.markDown = _article.markDown;
				article.desc = _article.desc;
				article.title = _article.title;
				article.updateAt = new Date().getTime();
				article.save(()=> {
					response.redirect('/article?id=' + article._id)
				})
			} else {
				response.redirect('/article/list')
			}
		})
	} else {
		response.redirect('/article/list')
	}
}

exports.change = function (request, response) {
	var id = request.query.id;
	if (id) {
		Article.findOne({_id: id},(error,article) => {
			if (article && request.session.user._id == article.author._id) {
				ArtCate.find({},(error,artcates) => {
					response.render('admin-article-change', {
						title: article.title,
						article: article,
						artcates : artcates
					})
				})
			} else {
				response.redirect('/admin/article');
			}
		})
	} else {
		response.redirect('/admin/article')
	}
}

// 文章保存
exports.save = function (request, response) {
	var _article = request.body.article;
	// 内容
	_article.content = request.body['editormd-html-code'];
	// markDown 
	_article.markDown = request.body['editormd-markdown-doc'];
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
		_article.author.userImg = request.session.user.userImg;
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
					// 判断是否浏览过
					var isBrowse = false;
					if (!article) {
						response.redirect('/');
						return;
					}
					article.browseUsers.forEach( function(element, index) {
						if (element.user._id == request.session.user._id) {
							isBrowse = true;
							return;
						}
					});
					if (!isBrowse) {
						article.browseUsers.unshift({
							user: {
								name : user.name,
								_id : user._id
							},
							time :  new Date().getTime()
						});
					}
					// 判断是否收藏
					var isCollection = false;
					article.collectionUsers.forEach( function(element, index) {
						if (element.user == request.session.user._id) {
							isCollection = true;
							return;
						}
					});
					article.save((error,article) => {
						User.findOne({_id: article.author._id })
						.exec((error,author) => {
							response.render('article',{
								article : article,
								author : author,
								isCollection: isCollection
							})
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
	var  page = parseInt(request.query.index || 0);
	const userId = request.query.id || "";
	const artCate = request.query.artCate || "";
	if (userId) {
		User.findOne({_id:userId})
		.populate('articles.article','title updateAt createAt author browseUsers desc')
		.exec((error,user)=>{
			if (error) {
				console.log(error);
			} else {
				var articles = [];
				user.articles.forEach( function(element, index) {
					articles.push(element.article)
				});
				articles = articles.sort(compare);
				var Maxpage = Math.ceil(articles.length / pageArts);
				if (page < 1) {
					page = 1
				}
				if (page > Maxpage) {
					page = Maxpage
				}
				articles = articles.splice((page - 1)*pageArts,pageArts);
				response.render('article-list',{
					title : '文章列表',
					articles : articles,
					Maxpage : Maxpage,
					page : page,
					pageArts: pageArts,
					userId : user._id,
					artCate : '',
					by: user.name
				});
			}
		})
	} else if (artCate) {
		ArtCate.findOne({name: artCate})
		.populate('articles.article','title updateAt createAt author browseUsers desc')
		.exec((error,artcate)=>{
			var articles = [];
			artcate.articles.forEach( function(element, index) {
				articles.push(element.article)
			});
			articles = articles.sort(compare);
			var Maxpage = Math.ceil(articles.length / pageArts);
			if (page < 1) {
				page = 1
			}
			if (page > Maxpage) {
				page = Maxpage
			}
			articles = articles.splice((page - 1)*pageArts,pageArts);
			response.render('article-list',{
				title : '文章列表',
				articles : articles,
				Maxpage : Maxpage,
				page : page,
				pageArts: pageArts,
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
				var Maxpage = Math.ceil(articles.length / pageArts);
				if (page < 1) {
					page = 1
				}
				if (page > Maxpage) {
					page = Maxpage
				}
				articles = articles.splice((page - 1)*pageArts,pageArts);
				response.render('article-list',{
					title : '文章列表',
					articles : articles,
					Maxpage : Maxpage,
					page:page,
					pageArts: pageArts,
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
						//收藏用户数组
						var collectionUsers = article.collectionUsers;
						collectionUsers.forEach( function(element, index) {
							User.findOne({_id: element.user}, (error, user) => {
								user.collectionArticles.forEach( function(element, index) {
									if (element.article == id) {
										user.collectionArticles.splice(index, 1);
										return;
									}
								});
								user.save(() => {
									
								});
							})
						});
					});
				})
				// 找到分类
				var categories = article.categories;
				categories.forEach( function(category, index) {
					ArtCate.findOne({name: category.name}, (error,categorysBycate) => {
						categorysBycate.articles.forEach( function(element, index) {
							if (element.article == id) {
								categorysBycate.articles.splice(index, 1);
								return;
							}
						});
						categorysBycate.save(()=>{
						});
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
/**
 * [collection 文章收藏与取消收藏]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
exports.collection = function (request, response) {
	var isAdd = request.body.isAdd;
	var articleId = request.body.id;
	var userId = request.session.user._id;
	// 必须登录
	if (userId) {
		// 添加收藏
		if (isAdd) {
			// 找到该文章收藏人数组里面添加user 、 在该user 的收藏文章数组里面添加该文章
			Article.findOne({_id: articleId}, (error, article) => {
				article.collectionUsers.unshift({ user: userId});
				article.save(()=>{
					User.findOne({_id: userId}, (error, user) => {
						user.collectionArticles.unshift({ article: articleId})
						user.save(() => {
							response.json({
								code: 200,
								collectionlength: article.collectionUsers.length,
								msg: '收藏文章成功！'
							})
						})
					})
				})
			})
		} else {
			// 取消收藏
			// 找到该文章收藏人数组刨除该user 、 在该user 的收藏文章数组里面刨除该文章
			User.findOne({_id: userId}, (error, user) => {
				user.collectionArticles.forEach( function(element, index) {
					if (element.article == articleId) {
						user.collectionArticles.splice(index, 1);
						return;
					}
				});
				user.save(() => {
				});
			})
			Article.findOne({_id: articleId}, (error, article) => {
				article.collectionUsers.forEach( function(element, index) {
					if (element.user == userId) {
						article.collectionUsers.splice(index, 1);
						return;
					}
				});
				article.save(() => {
					response.json({
						code: 200,
						collectionlength: article.collectionUsers.length,
						msg: '取消收藏文章成功!'
					})
				});
			})
		}
	} else {
		response.json({
			code: 400,
			msg: '请先登录!'
		})
	}
}