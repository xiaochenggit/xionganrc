const UserComent = require('../models/userComment');

exports.comment = function (request, response) {
	var userComment = request.body.userComment;
	// 是否是创建一个新的回复还是回复其他的人留言 tid 来判断
	if (userComment.tid) {
		UserComent.findOne({_id: userComment.pid}, (error,comment) => {
			comment.reply.push({
				from : userComment.from,
				to : userComment.tid,
				content : userComment.content,
				createAt : Date.now(),
				updateAt : Date.now()
			});
			comment.save((error, comment) => {
				if (error) {
					console.log(error);
				} else {
					response.json({
						code : 200,
						msg: '回复成功!'
					});
				}
			});
		})
	} else {
		if (userComment.user) {
			userComment.createAt = userComment.updateAt = Date.now();
			_UserComent = new UserComent(userComment);
			_UserComent.save((error, comment) => {
				if (error) {
					console.log(error);
				} else {
					response.json({
						code : 200,
						msg: '留言成功!'
					});
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
				// 判断是不是此用户的留言
				if (request.session.user._id == comment.reply[index].from || 
					request.session.user._id == comment.user
					) {
					comment.reply.splice(index, 1);
					comment.save((error) => {
						if (error) {
							console.log(error)
						} else {
							response.json({
								success : 1
							})
						}
					});
				}
			})
		}
	} else {
		if (id) {
			UserComent.findOne({_id: id}, (error, comment) => {
				// 判断是不是此用户的留言
				if (request.session.user._id == comment.from || 
					request.session.user._id == comment.user 
					) {
					UserComent.remove({_id: id},(error) => {
						if (error) {
							console.log(error);
						} else {
							response.json({
								success : 1
							})
						}
					});
				}
			});
		}
	}
}