// 主文件
const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const ueditor = require('ueditor');
const mongoose = require('mongoose');
// 用于用户在线体验
const session = require('express-session');
const mongoSotre = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');

const port = 80;
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
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'static'), function (req, res, next) {
    //客户端上传文件设置
    var imgDir = '/imgage/ueditor/'
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = imgDir;
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json');
    }
}));
// file 表单提交
app.use(require('connect-multiparty')());

// 启动路由
const router = require('./app/config/router');
router(app);
app.listen(port);