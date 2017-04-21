// 文章分类
// artcleCategory简称 artCate
const artCate = require('../models/articleCategory');

exports.admin = function (request, response) {
	response.render('admin-articleCategory',{
		title : '文章分类录入页面'
	})
}
exports.save = function (request, response) {
	_artCate = request.body.artCate;
	newArtCate = new artCate(_artCate);
	newArtCate.save((error,artCate) => {
		if (error) {
			console.log(error);
		} else {
			response.redirect('/admin/articlecategory/list');
		}
	})
}
exports.list = function (request, response) {
	artCate.find({},(error,artCates) => {
		if (error) {
			console.log(error);
		} else {
			response.render('articleCategory-list',{
				title : '文章分类列表页面',
				artCates : artCates
			})
		}
	})
}
exports.articlecategory = function (request, response) {
	var id = request.query.id ;
	console.log(id);
	if (id) {
		artCate.findOne({_id:id})
		.populate('articles.article','author createAt updateAt title')
		.exec((error,artcate)=>{
			if (error) {
				console.log(error);
			} else {
				console.log(artcate);
				response.render('articlecategory',{
					title : '文章分類',
					artcate : artcate
				})
			}
		})
	}
}