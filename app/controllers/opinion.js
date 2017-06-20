const Opinion = require('../models/opinion');
const User = require('../models/user');
const pageNum = 5;
exports.main = (request, response) => {
	let isBtn = false;
	Opinion.find({})
	.populate('user')
	.exec((error,opinions)=>{
		opinions = opinions.reverse();
		if (opinions.length > pageNum) {
			opinions.length = pageNum;
			isBtn = true;
		}
		response.render('opinion',{
			title : '意见反馈',
			opinions: opinions,
			isBtn: isBtn
		})
	})	
}

exports.getOpinions = (request, response) => {
	let nowPage = request.body.page;
	let isBtn = false;
	if (nowPage) {
		Opinion.find({})
		.populate('user','name userImg')
		.exec((error,opinions)=>{
			opinions = opinions.reverse();
			let maxPage = Math.ceil(opinions.length / pageNum);
			if (nowPage < 1) {
				nowPage = 1;
			} else if (nowPage > maxPage) {
				nowPage = maxPage;
			}
			console.log(nowPage + '-' ,maxPage)
			if (nowPage == maxPage) {
				isBtn = true;
			}
			opinions = opinions.splice((nowPage - 1) * pageNum, pageNum);
			response.json({
				code: 200,
				data: {
					opinions: opinions,
					isBtn: isBtn
				},
				msg: '获取第' + nowPage + '页意见成功!' 
			})
		})	
	} else {
		response.json({
			code: 400,
			msg: '没有页码!'
		})
	}
	 
}

/**
 * [保存传过来的意见反馈信息]
 */
exports.save = (request, response) => {
	const _opinion = request.body.opinion;
	if (_opinion.user == request.session.user._id) {
		_opinion.createAt = new Date().getTime();
		const opinion = new Opinion(_opinion);
		opinion.save((error, opinionM) => {
			Opinion.findOne({_id: opinionM._id})
			.populate('user','name userImg')
			.exec((error, opinionMessage) => {
				response.json({
					code : 200,
					data: {
						opinion: opinionMessage
					},
					msg: '反馈成功！'
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