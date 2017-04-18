const User = require('../models/user');
const UserComment = require('../models/userComment');

const path = require('path');
const fs = require('fs');
exports.getSignup = function (request,response) {
	response.render('user-signup',{
		title : '用户注册页面'
	})
}
exports.postSignup = function (request,response) {
	var _user = request.body.user;
	_user.createAt = _user.updateAt = _user.loadTime = Date.now();
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
						response.redirect('/user/details?id=' + user._id);
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
	User.findOne({name: _user.name}, (error,user) => {
		if (error) {
			console.log(error);
		} else {
			if (user.password = _user.password) {
				// 然后改变登陆时间
				user.loadTime = Date.now();
				user.save((error,user)=>{
					request.session.user = user;
					response.redirect('/admin/user/list');
				});
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

// 用户详情
exports.details = function (request, response) {
	var id = request.query.id;
	if (id) {
		User.findOne({_id: id}, (error, user) => {
			if (error) {
				console.log(error)
			} else {
				// 浏览过来添加 用户浏览统计 只有登录的时候才添加
				if (request.session.user && request.session.user._id != user._id) {
					for (var i = 0 ; i < user.browseUsers.length;) {
						if (user.browseUsers[i].user == request.session.user._id) {
							user.browseUsers.splice(i, 1);
						} else {
							i ++ ;
						}
					}
					user.browseUsers.unshift({
						user : request.session.user._id,
						time : Date.now()
					});
					user.save((error) => {
						if (error) {
							console.log(error);
						}
					});
				}
				User.findOne({_id: id})
				.populate('browseUsers.user follows.user', 'name userImg')
				.exec((error, user) => {
					UserComment
					.find({user: user._id})
					.populate('from', 'name userImg')
					.populate('reply.from reply.to', 'name userImg')
					.exec((error, comments)=>{
						response.render('user-details',{
							title : '用户详情',
							seeUser : user,
							comments : comments
						});
					});
				})
			}
		})
	}
}
// 储存头像
exports.saveImg = function (request, response, next){
	var saveImg = request.files.userImg;
	if (saveImg.originalFilename) {
		var oldPath = saveImg.path;
		var type = saveImg.type.split('/')[1];
		var imgName = Date.now() + '.' + type;
		var newPath = path.join(__dirname,'../../','/static/userImg/' + imgName);
		fs.readFile(oldPath,(error, data) => {
			fs.writeFile(newPath, data, () => {
			   request.body.user.userImg = imgName;	
			   next();
			})
		})
	} else {
		next();
	}
}
// 改变资料
exports.change = function (request , response) {
	var _user = request.body.user;
	var _id = _user._id;
	if (_id == request.session.user._id) {
		User.findOne({_id: _id}, (error, user) => {
			user.sex = _user.sex;
			user.major = _user.major;
			user.school = _user.school;
			user.hobby = _user.hobby;
			user.des = _user.des;
			user.motto = _user.motto;
			user.message = _user.message;
			user.hobby = _user.hobby;
			user.userImg = _user.userImg;
			user.save((error,user) => {
				if (error) {
					console.log(error);
				} else {
					request.session.user = user;
					response.redirect('/user/details?id=' + user._id);
				}
			})
		})
	}
}
// 添加关注、取消关注
exports.follows = function (request, response) {
	var id = request.query.id;
	var de = request.query.delete;
	if (id) {
		User.findOne({_id: id},(error, user) => {
			if (error) {
				console.log(error);
			} else {
				for (var i = 0 ; i < user.follows.length;) {
					if (user.follows[i].user == request.session.user._id) {
						user.follows.splice(i, 1);
					} else {
						i ++ ;
					}
				}
				if (!de) {
					user.follows.unshift({
						user : request.session.user._id,
						time : Date.now()
					});
				}
				user.save((error) => {
					if (error) {
						console.log(error);
					} else {
						console.log('2');
						response.json({
							success : 1
						});
					}
				});
			}
		})
	}
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