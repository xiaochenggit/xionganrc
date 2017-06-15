
const Index = require('../controllers/index');
const User = require('../controllers/user');
const UserComment = require('../controllers/userComment');
const Article = require('../controllers/article');
const ArticleCategory = require('../controllers/articleCategory');
const Note = require('../controllers/note');
const Moment = require('moment');
Moment.lang('zh-cn');
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
	app.get('/admin/user/list', User.isSignIn, User.userList);
	app.get('/user/details' , User.details);
	app.get('/user/wall' , User.wall);
	app.post('/userComment', UserComment.comment);
	app.post('/user/follows', User.isSignIn , User.follows);
	app.get('/user/secrecy', User.secrecy);
	app.post('/usermessage', User.getUserMessage);
	app.delete('/admin/user/delete', User.delete);
	app.post('/userCommentPage', UserComment.getUserCommentPage)
	app.delete('/usercomment/delete', UserComment.delete);
	// 文章发布页面
	app.get('/admin/article', Article.admin);
	app.post('/admin/article', Article.save);
	app.get('/admin/article/change', Article.change);
	app.post('/admin/article/change', Article.changeSave);
	app.get('/article', Article.article)
	app.get('/admin/article/list', Article.articleList)
	app.post('/article/collection', Article.collection) 
	app.delete('/admin/article/delete', Article.delete);

	// 文章分类页面
	app.get('/admin/articlecategory', ArticleCategory.admin);
	app.post('/admin/articlecategory', ArticleCategory.save);
	app.get('/admin/articlecategory/list', ArticleCategory.list)
	app.get('/articlecategory', ArticleCategory.articlecategory)
	app.delete('/admin/articlecategory/delete', ArticleCategory.delete);

	// note
	app.get('/user/note/new', Note.new);
	app.post('/editor/images', Note.images);

	app.get("/*",Index.error);
}
module.exports = router;