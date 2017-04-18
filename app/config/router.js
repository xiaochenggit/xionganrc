
const Index = require('../controllers/index');
const User = require('../controllers/user');
const UserComment = require('../controllers/userComment');
const Moment = require('moment')
let router = function (app) {
	app.use((request, response, next) => {
		var user = request.session.user;
		app.locals.moment = Moment;
		app.locals.sex = {
			'man' : '男',
			'woMan' : '女',
			'renYao' : '人妖',
			'noFind' : '未知'
		}
		app.locals.hobby = {
			'option0' : '聊天',
			'option1' : '放屁',
			'option2' : '唱歌',
			'option3' : '喝酒',
			'option4' : '跳舞',
			'option5' : '跑步'
		};
		if (user) {
			app.locals.user = user;
		} else {
			app.locals.user = '';
		}
		next();
	})
	app.get('/', Index.index);
	app.get('/user/signup', User.getSignup);
	app.post('/user/signup', User.saveImg, User.postSignup);
	app.post('/user/change', User.saveImg, User.change);
	app.get('/user/signin', User.getSignin);
	app.get('/user/logout', User.logout);
	app.post('/user/signin', User.postSignin);
	app.get('/admin/user/list', User.userList);
	app.get('/user/details' , User.details);
	app.post('/userComment', UserComment.comment);
	app.delete('/admin/user/delete', User.delete);
	app.delete('/usercomment/delete', UserComment.delete);
}
module.exports = router;