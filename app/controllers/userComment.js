const UserComent = require('../models/userComment');

exports.comment = function (request, response) {
	var userComment = request.body.userComment;
	// 是否是创建一个新的回复还是回复其他的人留言 tid 来判断
	if (userComment.tid) {
		console.log(userComment);
		UserComent.findOne({_id: userComment.pid}, (error,comment) => {
			console.log(comment);
			comment.reply.push({
				from : userComment.from,
				to : userComment.tid,
				content : userComment.content
			});
			comment.save((error, comment) => {
				if (error) {
					console.log(error);
				} else {
					response.redirect('/user/details?id=' + userComment.user)
				}
			});
		})
	} else {
		if (userComment.user) {
			_UserComent = new UserComent(userComment);
			_UserComent.save((error, comment) => {
				if (error) {
					console.log(error);
				} else {
					response.redirect('/user/details?id=' + userComment.user)
				}
			})
		}
	}
}
// 留言删除
exports.delete = function (request, response) {
	var id = request.query.id;
	var index = request.query.index;
	// 判断是一级的留言，还是留言内的回复
	if (index) {
		if (id) {
			UserComent.findOne({_id: id}, (error, comment) => {
				comment.reply.splice(index, 1);
				comment.save((error) => {
					if (error) {
						console.log(error)
					} else {
						response.json({
							success : 1
						})
					}
				})
			})
		}
	} else {
		if (id) {
			UserComent.remove({_id: id},(error) => {
				if (error) {
					console.log(error);
				} else {
					response.json({
						success : 1
					})
				}
			})
		}
	}
}