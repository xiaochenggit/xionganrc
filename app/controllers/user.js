const User = require('../models/user');
exports.getSignup = function (request,response) {
	response.render('user-signup',{
		title : '用户注册页面'
	})
}
exports.postSignup = function (request,response) {
	var _user = request.body.user;
	console.log(_user);
	// 如果有这个 user 就返回登录页面
	User.findOne({name : _user.name}, (error, user) => {
		if (error) {
			console.log(error)
		} else {
			if (user) {
				response.redirect('/user/signin');
			} else {
				var newUser = new User(_user);
				newUser.save((error, user) => {
					if (error) {
						console.log(error)
					} else {
						request.session.user = user;
						response.redirect('/admin/user/list');
					}
				})
			}
		}
	})
}

exports.getSignin = function (request,response) {
	response.render('user-signin',{
		title : '用户登录'
	})
}
exports.logout = function (request , response) {
	request.session.user = '';
	response.redirect('/');
}
exports.postSignin = function (request, response) {
	var _user = request.body.user;
	console.log(_user.name)
	User.findOne({name: _user.name}, (error,user) => {
		if (error) {
			console.log(error);
		} else {
			if (user.password = _user.password) {
				request.session.user = user;
				response.redirect('/admin/user/list')
			} else {
				response.redirect('/user/signin')
			}
		}
	})
}
exports.userList = function (request, response) {
	User.find({}, (error,users) => {
		if (error) {
			console.log(error);
		} else {
			response.render('user-list',{
				title : '用户列表',
				users : users
			})
		}
	})
}
// 删除用户
exports.delete = function (request, response) {
	var id = request.query.id;
	if (id) {
		User.remove({_id: id},(error) => {
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