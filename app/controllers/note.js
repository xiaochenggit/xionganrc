
const path = require('path');
const fs = require('fs');

exports.new = (request, response) => {
	response.render('note',{
		title:'添加笔记'
	})
}

exports.images = (request, response) => {
	var saveImg = request.files['editormd-image-file'];
	if (saveImg.originalFilename) {
		var oldPath = saveImg.path;
		var type = saveImg.type.split('/')[1];
		var imgName = new Date().getTime() + '.' + type;
		var newPath = path.join(__dirname,'../../','/static/userImg/editormd/' + imgName);
		fs.readFile(oldPath,(error, data) => {
			if (error) {
			   response.json({
				    success :  1,           // 0 表示上传失败，1 表示上传成功
				    message : "上传失败",
				    url     : ""        // 上传成功时才返回
			   })
			}
			fs.writeFile(newPath, data, () => {
			   // request.body.user.userImg = imgName;	
			   // next();
			   response.json({
				    success :  1,           // 0 表示上传失败，1 表示上传成功
				    message : "上传成功",
				    url     : "/userImg/editormd/" + imgName        // 上传成功时才返回
			   })
			})
		})
	} 
}