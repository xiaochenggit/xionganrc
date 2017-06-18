const Opinion = require('../models/opinion');
const User = require('../models/user');
exports.main = (request, response) => {
	Opinion.find({})
	.populate('user')
	.exec((error,opinions)=>{
		opinions = opinions.reverse();
		response.render('opinion',{
			title : '意见反馈',
			opinions: opinions
		})
	})	
}
/**
 * [保存传过来的意见反馈信息]
 */
exports.save = (request, response) => {
	const _opinion = request.body.opinion;
	if (_opinion.user == request.session.user._id) {
		_opinion.createAt = new Date().getTime();
		const opinion = new Opinion(_opinion);
		opinion.save((error, opinionMessage) => {
			User.findOne({_id: opinionMessage.user })
			.exec((error,user) => {
				response.json({
					code : 200,
					data: {
						opinionMessage : opinionMessage,
						user : {
							_id: user._id,
							name: user.name,
							userImg: user.userImg
						}
					},
					msg: '反馈失败'
				})
			})
		})
	} else {
		response.json({
			code : 202,
			msg: '反馈失败'
		})
	}
}

/**
 * 意见反馈删除
 */

exports.delete = (request, response) => {
	const id = request.body.id;
	if (id) {
		Opinion.findOne({_id: id}, (error, opinion) => {
			if (opinion) {
				if (request.session.user._id == opinion.user || 
					request.session.user.role >= 10) {
					Opinion.remove({_id: id}, () => {
						response.json({
							code: 200,
							msg:'删除反馈成功！'
						})
					})
				} else {
					response.json({
						code: 202,
						msg:'没有权限删除反馈！'
					})
				}
			} else {
				response.json({
					code: 200,
					msg:'模拟删除！'
				})
			}
		})
	}
}