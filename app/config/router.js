
const Index = require('../controllers/index');
const User = require('../controllers/user');
const UserComment = require('../controllers/userComment');
const Moment = require('moment')
let router = function (app) {
	app.use((request, response, next) => {
		var user = request.session.user;
		app.locals.moment = Moment;
		if (user) {
			app.locals.user = user;
		} else {
			app.locals.user = '';
		}
		next();
	})
	app.get('/', Index.index);
	app.get('/user/signup', User.getSignup);
	app.post('/user/signup', User.postSignup)
	app.get('/user/signin', User.getSignin);
	app.get('/user/logout', User.logout);
	app.post('/user/signin', User.postSignin);
	app.get('/admin/user/list', User.userList);
	app.get('/user/details' , User.details);
	app.post('/userComment', UserComment.comment);
	app.delete('/admin/user/delete', User.delete);
}
module.exports = router;