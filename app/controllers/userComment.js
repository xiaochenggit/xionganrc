const UserComent = require('../models/userComment');

exports.comment = function (request, response) {
	var userComment = request.body.userComment;
	// 是否是创建一个新的回复还是回复其他的人留言 tid 来判断
	if (userComment.tid) {
		UserComent.findOne({_id: userComment.pid}, (error,comment) => {
			if (!comment) {
				response.json({
					code : 400,
					msg: '回复失败,留言已删除!',
				});
				return;
			}
			comment.reply.push({
				from : userComment.from,
				to : userComment.tid,
				content : userComment.content,
				createAt : new Date().getTime(),
				updateAt : new Date().getTime()
			});
			comment.save((error, comment) => {
				if (error) {
					console.log(error);
				} else {
					userComment.updateAt = userComment.createAt = new Date().getTime();
					userComment._id = comment._id;
					userComment._reid = comment.reply[comment.reply.length -1 ]._id
					response.json({
						code : 200,
						msg: '回复成功!',
						userComment: userComment
					});
				}
			});
		})
	} else {
		if (userComment.user) {
			userComment.updateAt = userComment.createAt = new Date().getTime();
			_UserComent = new UserComent(userComment);
			_UserComent.save((error, comment) => {
				if (error) {
					console.log(error);
				} else {
					userComment._id = comment._id;
					response.json({
						code : 200,
						msg: '留言成功!',
						userComment: userComment
					});
				}
			})
		}
	}
}
// 留言删除
exports.delete = function (request, response) {
	var id = request.query.id;
	var reId = request.query.reId;
	// 判断是一级的留言，还是留言内的回复
	if (reId) {
		if (id) {
			UserComent.findOne({_id: id}, (error, comment) => {
				// 判断是不是此用户的留言
				var index;
				if (!comment) {
					response.json({
						code : 200,
						msg: '删除留言成功(主留言已经删除)'
					})
					return ;
				}
				comment.reply.forEach( function(element, number) {
					if (element._id == reId) {
						return index = number + '';
					}
				});
				if (index) {
					if (request.session.user._id == comment.reply[index].from || 
						request.session.user._id == comment.user
						) {
						comment.reply.splice(index, 1);
						comment.save((error) => {
							if (error) {
								console.log(error);
							} else {
								response.json({
									code : 200,
									msg: '删除留言成功'
								})
							}
						});
					} else{
						response.json({
							code : 400,
							msg: '留言删除失败'
						})
					}
				} else {
					response.json({
						code : 200,
						msg: '留言删除成功(有人先一步删除)'
					})
				}
			})
		}
	} else {
		if (id) {
			UserComent.findOne({_id: id}, (error, comment) => {
				// 判断是不是此用户的留言
				if (comment) {
					if (request.session.user._id == comment.from || 
						request.session.user._id == comment.user 
						) {
						UserComent.remove({_id: id},(error) => {
							if (error) {
								console.log(error);
							} else {
								response.json({
									code : 200,
									msg: '删除留言成功'
								})
							}
						});
					} else {
						response.json({
							code : 400,
							msg: '删除留言失败'
						})
					}
				} else {
					response.json({
						code : 200,
						msg: '留言删除成功(有人先一步删除)'
					})
				}
			});
		}
	}
}