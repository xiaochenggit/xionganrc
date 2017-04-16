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