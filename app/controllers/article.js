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
		_article.author.sex = request.session.user.sex;
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
		.populate('browseUsers.user','name userImg sex')
		.populate('collectionUsers.user','name userImg sex')
		.exec((error,article) => {
			if (error) {
				console.log(error);
			} else {
				if (!request.session.user) {
					User.findOne({_id: article.author._id })
					.exec((error,author) => {
						response.render('article',{
							article : article,
							author : author,
							isCollection: false
						})
					})
				} else {
					User.findOne({_id:request.session.user._id},(error,user) => {
					
					if (!article) {
						response.redirect('/');
						return;
					}
					// 判断是否浏览过
					article.browseUsers.forEach( function(element, index) {
						if (element.user._id == request.session.user._id) {
							article.browseUsers.splice(index, 1)
							return;
						}
					});
					article.browseUsers.unshift({
						user : request.session.user._id,
						time :  new Date().getTime()
					});
					// 判断是否收藏
					var isCollection = false;
					article.collectionUsers.forEach( function(element, index) {
						if (element.user._id == request.session.user._id) {
							isCollection = true;
							return;
						}
					});
					article.save((error,article) => {
						User.findOne({_id: article.author._id })
						.exec((error,author) => {
						Article.findOne({_id: id})
							.populate('browseUsers.user','name userImg sex')
							.populate('collectionUsers.user','name userImg sex')
							.exec((error,article) => {
								response.render('article',{
									article : article,
									author : author,
									isCollection: isCollection
								})
							});
						})
					});
				})
				}
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
 * 文章搜索
 */

exports.Search = (request, response) => {
	const search = request.body.search;
	console.log(search);
	const reg = new RegExp(search, 'g');
	const pageArts = 2;
	var  page = parseInt(request.query.index || 0);
	Article.find({})
	.populate('articles.article','title updateAt createAt author browseUsers desc')
	.exec((error, articles) => {

		articles = articles.filter((article) => {
			return reg.test(article.title);
		})
		articles = articles.sort(compare);
		var Maxpage = Math.ceil(articles.length / pageArts);
		if (page < 1) {
			page = 1
		}
		if (page > Maxpage) {
			page = Maxpage
		}
		articles = articles.splice((page - 1)*pageArts,pageArts);
		if (articles.length < 0) {
			// response.json({
			// 	code : 400,
			// 	msg: '没有搜索到任何文章!'
			// })
		} else {
			// response.json({
			// 	code : 200,
			// 	data: {
			// 		articles: articles
			// 	},
			// 	msg: '搜索文章成功！'
			// });
			// response.redirect('/user/signin?href=' + href)
			response.render('article-list',{
				title : '文章列表',
				articles : articles,
				Maxpage : Maxpage,
				page:page,
				pageArts: pageArts,
				userId : '',
				artCate : '',
				by : `search(${search})`
			});
		}
	});
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
				article.collectionUsers.unshift({ 
					user: userId,
					time: new Date().getTime()
				});
				article.save(()=>{
					User.findOne({_id: userId})
					.populate('user','name userImg sex collectionArticles')
					.exec((error, user) => {
						user.collectionArticles.unshift({ article: articleId})
						user.save(() => {
							response.json({
								code: 200,
								data: {
									collectionlength: article.collectionUsers.length,
									user: {
										_id: user._id,
										userImg: user.userImg,
										sex: user.sex,
										name: user.name
									},
									time: new Date().getTime()
								},
								msg: '收藏文章成功！'
							})
						})
					})
				})
			})
		} else {
			// 取消收藏
			// 找到该文章收藏人数组刨除该user 、 在该user 的收藏文章数组里面刨除该文章
			User.findOne({_id: userId})
				.populate('user','name userImg sex collectionArticles')
				.exec((error, user) => {

					user.collectionArticles.forEach( function(element, index) {
						if (element.article == articleId) {
							user.collectionArticles.splice(index, 1);
							return;
						}
					});

					user.save(() => {
					});

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
								data: {
									collectionlength: article.collectionUsers.length,
									user: {
										_id: user._id,
										userImg: user.userImg,
										sex: user.sex,
										name: user.name
									}
								},
								msg: '取消收藏文章成功!'
							})
						});
					})

				});
		}
	} else {
		response.json({
			code: 400,
			msg: '请先登录!'
		})
	}
}
/**
 * 	获取文章的 markdown 数据
 */
exports.getArticleMarkdown = (request, response) => {
	var id = request.body.id;
	if (id) {
		Article.findOne({_id: id}, (error, article) => {
			if (article) {
				response.json({
					code : 200,
					markDown: article.markDown
				})
			}
		})
	}
}

/**
 * 缓冲加载文章浏览者信息
 * pageNow 当前页
 * pageMax 最大页
 * pageNum 每次条数
 */

exports.getBUsers = (request,response) => {
	var id = request.body.id ;
	var pageNow = request.body.pageNow || 2;
	const pageNum = 10;
	var isBtn = true;
	if (id) {
		Article.findOne({_id: id})
		.populate('browseUsers.user','name userImg sex')
		.exec((error,article) => {
			if (!article) {
				response.json({
					code: 400,
					msg: '该文章不存在,请浏览其他文章'
				})
			} else {
				const pageMax = Math.ceil(article.browseUsers.length / pageNum);
				if ( pageNow < 1) {
					pageNow = 1;
				} 
				if (pageNow >= pageMax) {
					pageNow = pageMax;
					isBtn = false;
				}
				var browseUsers = article.browseUsers.splice((pageNow - 1) * pageNum, pageNum );
				response.json({
					code: 200,
					data: {
						browseUsers: browseUsers,
						isBtn: isBtn
					},
					msg:'获得文章浏览者信息成功!'
				})
			}
		})
	} else {
		response.json({
			code: 400,
			msg : '获取文章浏览者信息失败 文章id参数错误'
		})
	}
}
/**
 * 同上
 */
exports.getCUsers = (request,response) => {
	var id = request.body.id ;
	var pageNow = request.body.pageNow || 2;
	const pageNum = 10;
	var isBtn = true;
	if (id) {
		Article.findOne({_id: id})
		.populate('collectionUsers.user','name userImg sex')
		.exec((error,article) => {
			if (!article) {
				response.json({
					code: 400,
					msg: '该文章不存在,请浏览其他文章'
				})
			} else {
				const pageMax = Math.ceil(article.collectionUsers.length / pageNum);
				if ( pageNow < 1) {
					pageNow = 1;
				} 
				if (pageNow >= pageMax) {
					pageNow = pageMax;
					isBtn = false;
				}
				var collectionUsers = article.collectionUsers.splice((pageNow - 1) * pageNum, pageNum );
				response.json({
					code: 200,
					data: {
						collectionUsers: collectionUsers,
						isBtn: isBtn
					},
					msg:'获得文章收藏者信息成功!'
				})
			}
		})
	} else {
		response.json({
			code: 400,
			msg : '获得文章收藏者信息成功 文章id参数错误'
		})
	}
}