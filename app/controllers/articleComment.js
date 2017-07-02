const ArticleComment = require('../models/articleComment');

exports.addComment = (request, response) => {
	let articleComment = request.body.articleComment;
	articleComment.from = request.session.user._id;
	articleComment.updateAt = articleComment.createAt = new Date().getTime();
	_ArticleComment = new ArticleComment(articleComment);

	_ArticleComment.save((error,newarticleComment) => {
		articleComment['_id'] = newarticleComment._id;
		response.json({
			code : 200,
			msg: '留言成功!',
			articleComment: articleComment
		});
	});
}