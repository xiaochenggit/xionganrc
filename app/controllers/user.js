const User = require('../models/user');
const UserComment = require('../models/userComment');
const Article = require('../models/article');

const path = require('path');
const fs = require('fs');
exports.getSignup = function (request,response) {
	response.render('user-signup',{
		title : '用户注册页面'
	})
}
exports.postSignup = function (request,response) {
	var _user = request.body.user;
	_user.createAt = _user.updateAt  = new Date().getTime();
	_user.loadTime = new Date().getTime();
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
exports.wall = function (request,response) {
	response.render('wall',{
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
			response.json({
				code : 400,
				msg: '系统繁忙!'
			});
		} else {
			if (user) {
				if (user.password == _user.password) {
					// 然后改变登陆时间
					user.loadTime = user.updateAt = new Date().getTime();
					user.save((error,user)=>{
						request.session.user = user;
						response.json({
							code : 200,
							msg: '登录成功!'
						});
					});
				} else {
					response.json({
						code : 202,
						msg: '密码错误!'
					});
				}
			} else {
				response.json({
					code : 201,
					msg: '账号错误！'
				});
			}
		}
	})
}

var compare = function (x, y) {
    return y.updateAt - x.updateAt;
}

exports.userList = function (request, response) {
	User.find({}, (error,users) => {
		if (error) {
			console.log(error);
		} else {
			var role = request.session.user.role >= 50 ? true : false;
			users = users.sort(compare);
			response.render('user-list',{
				title : '用户列表',
				users : users,
				role : role
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
						time : new Date().getTime()
					});
					user.save((error) => {
						if (error) {
							console.log(error);
						}
					});
				}
				User.findOne({_id: id})
				.populate('browseUsers.user follows.user', 'name userImg')
				.populate('articles.article','title updateAt')
				.exec((error, user) => {
					UserComment
						.find({user: user._id})
						.populate('from', 'name userImg')
						.populate('reply.from reply.to', 'name userImg')
						.exec((error, comments)=>{
							comments.reverse();
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
		var imgName = new Date().getTime() + '.' + type;
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
			if (_user.userImg) {
				user.userImg = _user.userImg;
			}
			user.sex = _user.sex;
			user.major = _user.major;
			user.school = _user.school;
			user.hobby = _user.hobby;
			user.des = _user.des;
			user.motto = _user.motto;
			user.message = _user.message;
			user.hobby = _user.hobby;
			// 改变作者麾下所以文章作者的性别
			user.articles.forEach( function(element, index) {
				console.log(element.article);
				Article.findOne({_id:element.article},(error,article) => {
					article.author.sex = _user.sex;
					article.save(()=>{});
				})
			});
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
	/**
	 * id {string} 需要关注/取消关注 的用户 id 
	 * request.session.user {object} 当前用户
	 * de {string} 有值说明是关注 没有就是取消关注
	 */
	var id = request.query.id;
	var de = request.query.delete;
	if (id) {
		User.findOne({_id: id},(error, user) => {
			if (error) {
				console.log(error);
			} else {
				// 不知道用户有没有关注过 , 所以先遍历 , 找到就删除
				for (var i = 0 ; i < user.follows.length;) {
					if (user.follows[i].user == request.session.user._id) {
						user.follows.splice(i, 1);
						break;
					} else {
						i ++ ;
					}
				}
				if (!de) {
					user.follows.unshift({
						user : request.session.user._id,
						time : new Date().getTime()
					});
				}
				user.save((error) => {
					if (error) {
						console.log(error);
					} else {
						response.json({
							success : 1
						});
					}
				});
			}
		})
	}
}

// 用户的保密
exports.secrecy = function(request, response) {
	/**
	 * secrecy {object} 保密信息 
	 * id {string} 需要保密的用户 id
	 * response.json  {object} 返回数据
	 * descript(函数描述) 根据发送过来的保密对象和用户id 判断是否为用户自己修改,
	 * 然后修改保密对象, 返回数据。
	 */
	var secrecy = JSON.parse(request.query.secrecy);
	var id = request.query.id;
	if (id == request.session.user._id ) {
		User.findOne({_id: id}, (error, user) => {
			user.isLook = secrecy;
			user.save((error, user) => {
				if (error) {
					console.log(error);
				} else {
					response.json({
						success : 1
					});
				}
			});
		})
	};
	
}
/**
 * [getUserMessage 获取用户信息]
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[object]}          [返回用户名 id name]
 */
exports.getUserMessage = function (request, response) {
	var id = request.body.id;
	if (id) {
		User.findOne({_id: id}, (error,user) => {
			if (error) {
				response.json({
					code: 400,
					msg: '获取用户信息失败!'
				})
			} else {
				response.json({
					code: 200,
					msg: '获取用户信息成功!',
					data: {
						_id: user._id,
						name : user.name,
						userImg: user.userImg,
						sex: user.sex
					}
				})
			}
		})
	} else {
		var user = request.session.user;
		if (user) {
			response.json({
				code: 200,
				msg: '获取用户信息成功!',
				data: {
					_id: user._id,
					name : user.name,
					userImg: user.userImg,
					sex: user.sex
				}
			})
		} else {
			response.json({
				code: 200,
				msg: '获取用户信息失败! (没有用户登录)',
				data: {
				}
			})
		}
	}
}


// 删除用户
exports.delete = function (request, response) {
	/**
	 * id {string} 被删除用户的 id 
	 * response.json {object} 返回的数据
	 * 函数描述 首先判断当前用户是否有权限删除用户,删除成功返回数据
	 */
	var id = request.query.id;
	if (id && request.session.user.role >= 50) {
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
/**
 * 	判断是否用户在登录状态 
 * @param  {[type]} request  [description]
 * @param  {[type]} response [description]
 * @return {[type]}          [description]
 */
exports.isSignIn = (request, response, next) => {
	var href = request.route.path;
	// var query = request.query;
	// for (key in query) {
	// 	href += '?' + key + "=" + query[key];
	// }
	let user = request.session.user;
	if (user) {
		next()
	} else{
		response.redirect('/user/signin?href=' + href)
	}
	
}