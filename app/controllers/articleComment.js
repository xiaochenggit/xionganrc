const ArticleComment = require('../models/articleComment');

exports.addComment = (request, response) => {
	let articleComment = request.body.articleComment;
	articleComment.from = request.session.user._id;
	const toId = articleComment.toId;
	// 一级回复
	if (!toId) {
		articleComment.updateAt = articleComment.createAt = new Date().getTime();
		_ArticleComment = new ArticleComment(articleComment);
		_ArticleComment.save((error,newarticleComment) => {
			ArticleComment.findOne({_id: newarticleComment._id})
				.populate('from', 'name userImg sex')
				.exec((error,newarticleComment) => {
					response.json({
						code : 200,
						msg: '留言成功!',
						data:{
							articleComment: newarticleComment
						}
					});
				});
		});
	} else {
		// 二级回复
		let articleCommentId = articleComment._id;
		ArticleComment.findOne({_id: articleCommentId})
		.exec((error, newarticleComment) => {
			if (!newarticleComment) {
				response.json({
					code: 400,
					msg:'评论已经删除,请刷新'
				})
			} else {
				newarticleComment.reply.push({
					from : articleComment.from,
					to : toId,
					content : articleComment.content,
					createAt : new Date().getTime(),
					updateAt : new Date().getTime()
				});
				newarticleComment.save((error,newarticleComment) => {
					response.json({
						code: 200,
						msg:'二级评论成功!'
					})
				})
			}
		})
	}
	
}

exports.delete = (request, response) => {
	let id = request.body.id;
	const user = request.session.user;
	ArticleComment.findOne({_id:id}, (error,articleComment) => {
		if (articleComment) {
			if (articleComment.from == user._id || user.role >= 10) {
				ArticleComment.remove({_id:id},(error) => {
					response.json({
						code:200,
						msg:'删除评论成功！'
					})
				})
			} else {
				response.json({
					code:400,
					msg:'你没有权限删除该评论！'
				})
			}
		} else {
			response.json({
				code:200,
				msg:'没有该评论,直接删除'
			})
		}
	})
}