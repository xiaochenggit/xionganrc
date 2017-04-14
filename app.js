// 主文件
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// 用于用户在线体验
const session = require('express-session');
const mongoSotre = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

const port = 8080;
// 实例化
const  app = express();
// 连接数据库
mongoose.connect('mongodb://localhost:27017/xionganrc');

// 设置模板目录 与引擎模板
app.set('views',"./app/views/pages/");
app.set('view engine','ejs');

// 设置静态资源目录
app.use(express.static(path.join(__dirname, 'static')));

// 格式化表单数据
app.use(bodyParser.urlencoded({ extended: true }));

// 用户储存
app.use(cookieParser());
app.use(session({
	secret: 'xionganrc',
	// 配置
	store : new mongoSotre({
		url: 'mongodb://localhost:27017/xionganrc',
		collection: 'session'
	})
}));

// 启动路由
const router = require('./app/config/router');
router(app);
app.listen(port);