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
	_artCate.createAt = _artCate.updateAt = new Date().getTime();
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
			artCates.reverse();
			console.log(artCates)
			response.render('articleCategory-list',{
				title : '文章分类列表页面',
				artCates : artCates
			})
		}
	})
}
exports.articlecategory = function (request, response) {
	var id = request.query.id;
	if (id) {
		artCate.findOne({_id:id})
		.populate('articles.article','author createAt updateAt title browseUsers')
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
/**
 * [delete 删除文章分类]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
exports.delete = function(request, response) {
	var id = request.query.id;
	// if (id && request.session.user.role >= 50) {
	if (id) {
		artCate.remove({_id: id},(error) => {
			if (error) {
				console.log(error);
				response.json({
					code : 400,
					msg: '删除文章分类失败'
				})
			} else {
				response.json({
					code : 200,
					msg: '删除文章分类成功'
				})
			}
		})
	} else {
		response.json({
			code : 400,
			msg: '删除文章分类失败'
		})
	}
}