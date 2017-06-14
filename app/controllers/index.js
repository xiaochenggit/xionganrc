const ArtCate = require('../models/articleCategory');
const Article = require('../models/article');
const User = require('../models/user');

/**
 * [compareWithUpdateAt 排序（根据更新时间 、浏览人数）]
 * @param  {[object]} x [文章對象]
 * @param  {[object]} y [文章對象]
 * @return {[type]}   [description]
 */
var compareWithUpdateAt = function (x, y) {
    return y.updateAt - x.updateAt;
}
var compareWithBrowseUsers = function (x, y) {
	return y.browseUsers.length - x.browseUsers.length ;
}

/**
 * [index 首页]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
exports.index = function (request, response) {
	ArtCate.find({})
		.populate('articles.article','title updateAt createAt author browseUsers collectionUsers desc')
		.exec((error,artcates) => {
			if ( artcates.length > 5 ) {
				artcates.length = 5;
			}
			Article.find({})
			.populate()
			.exec((error,articlesTwo) => {
				var maxNum = 5;
				var  articlesUpdateAt = articlesTwo.sort(compareWithUpdateAt);
				Article.find({})
				.populate()
				.exec((error,articlesThree) => {
					var  articlesBrowseUsers = articlesThree.sort(compareWithBrowseUsers);
					if ( articlesBrowseUsers.length > 5 ) {
						articlesBrowseUsers.length = articlesUpdateAt.length = 5;
					}
					/**
					 * [返回数据]
					 * @param  {[Array]} artcates  [文章分类数组]
					 * @param  {[Array]} articlesDate  [文章数组(根据时间排序)]
					 * @param  {[Array]} articlesHot  [文章数组(根据浏览量排序)]
					 * @param {[Number]} maxNum [最大条目]
					 */
					response.render('index',{
						title : '首页',
						artcates: artcates,
						articlesDate : articlesUpdateAt,
						articlesHot: articlesBrowseUsers,
						maxNum : maxNum
					})
				})
				
			})
		})
}
exports.error = (request, response) =>{
	response.render('404',{
		title: '404'
	})
}