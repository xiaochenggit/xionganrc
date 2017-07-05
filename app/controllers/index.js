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
var compareWithCollections = function (x, y) {
	return y.collectionUsers.length - x.collectionUsers.length ;
}

/**
 * [index 首页]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
exports.index = function (request, response) {
	var maxNum = 5;
	ArtCate.find({})
		.populate('articles.article','title updateAt createAt author browseUsers collectionUsers desc')
		.exec((error,artcates) => {
			if ( artcates.length > maxNum ) {
				artcates.length = maxNum;
			}
			Article.find({})
			.populate()
			.exec((error,articlesTwo) => {
				let  articlesUpdateAt = articlesTwo.sort(compareWithUpdateAt);
				articlesUpdateAt = articlesUpdateAt.splice(0, maxNum)
				Article.find({})
				.populate()
				.exec((error,articlesThree) => {
					let  articlesBrowseUsers = articlesThree.sort(compareWithBrowseUsers);
					articlesBrowseUsers = articlesBrowseUsers.splice(0, maxNum);
					Article.find({})
					.populate()
					.exec((error,articlesFour) => {
						let  articlesCollections = articlesFour.sort(compareWithCollections);
						articlesCollections = articlesCollections.splice(0, maxNum);
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
							articlesCol: articlesCollections,
							maxNum : maxNum
						})
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