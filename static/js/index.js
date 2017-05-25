$(function (){
	// 导航时间
	public.showTime("showTime");
	// 版权时间
	public.setMachineTime();
	// 用户保密
	$("#userSignin").submit(function(event) {
		event.preventDefault();
		var username = $("#userName").val();
		var password = $("#password").val();
		public.userSigninFunc(username, password);
	});
	$('#userCommentForm').submit(function(event) {
		event.preventDefault();
		var jsonData = $(this).serializeObject();
		public.postCommentForm(jsonData);
	})
	$('.is-look').click(function(){
		if ($(this).text() == '保密') {
			$(this).text('公开').removeClass('btn-danger').addClass('btn-primary'); 
		} else {
			$(this).text('保密').addClass('btn-danger').removeClass('btn-primary');
		}
		public.userSecrecyFunc();
	})
	console.log('载入文件成功');
	// 用户删除的代码
	$(".deleteUser").click(function (){
		var id = $(this).attr('data-id');
		var $this = $(this);
		$.ajax({
			type : 'delete',
			url : '/admin/user/delete?id=' + id
		}).done(function (result) {
			if (result.success == 1) {
				$this.parents('tr').remove();
			}
		})
	});
	// 用户删除的代码
	$(".deleteActicle").click(function (){
		var id = $(this).attr('data-id');
		var $this = $(this);
		$.ajax({
			type : 'delete',
			url : '/admin/article/delete?id=' + id
		}).done(function (result) {
			if (result.success == 1) {
				$this.parents('tr').remove();
			}
		})
	});
	// 用户留言删除
	$(document).on('click','.deleteUserComment',function(event){
		var id = $(this).attr('data-id');
		var index = $(this).attr('data-index');
		var url = '';
		if (index) {
			url = '/usercomment/delete?id=' + id + '&index=' + index;
		} else {
			url = '/usercomment/delete?id=' + id;
		}
		var $this = $(this);
		$.ajax({
			type : 'delete',
			url : url
		}).done(function (result){
			if (result.success == 1) {
				$this.parents('.media').eq(0).remove();
			}
		});
	})
	// 关注用户
	$("#userfollow .glyphicon-heart").click(function(event) {
		var id = $(this).attr('data-id');
		var url = '';
		var isActive = $(this).hasClass('active');
		if (isActive) {
			url = '/user/follows?id=' + id + '&delete=true';
		} else {
			url = '/user/follows?id=' + id;
		}
		var $this = $(this);
		var number = $this.siblings('.number');
		$.ajax({
			url: url,
			type: 'post'
		})
		.done(function(result) {
			if (result.success == 1) {
				if (isActive) {
					$this.removeClass('active');
					number.text(parseInt(number.text())-1);
				} else {
					$this.addClass('active');
					number.text(parseInt(number.text())+1);
				}
			}
		})
	});
	// 用户浏览版回复
	$('.addComment').click(function(event) {
		var tic = $(this).attr('data-tid');
		var pid = $(this).attr('data-pid');
		if ($("#commentTo").length <= 0) {
			var commentTo = $("<input></input>");
			commentTo.attr({
				name: 'userComment[tid]',
				value: tic,
				type : 'hidden',
				id : 'commentTo'
			});
			var commentPid = $("<input></input>");
			commentPid.attr({
				name: 'userComment[pid]',
				value: pid,
				type : 'hidden',
				id : 'commentPid'
			});
			$("#userCommentForm").append(commentTo);
			$("#userCommentForm").append(commentPid);
		}else {
			$("#commentTo").attr({
				value: tic,
			});
			$("#commentPid").attr({
				value: pid,
			});
		}
	});
	// 添加上登录表单验证
	xc.signupValidate();

	//将表单序列化为JSON对象   
	$.fn.serializeObject = function() {  
        var o = {};  
        var a = this.serializeArray();  
        $.each(a, function() {  
            if (o[this.name]) {  
                if (!o[this.name].push) {  
                    o[this.name] = [ o[this.name] ];  
                }  
                o[this.name].push(this.value || '');  
            } else {  
                o[this.name] = this.value || '';  
            }  
        });  
        return o;  
    }  
});

xc = {
	signupValidate : function () {
		// 初始化验证设定错误,选项都正确才可以提交
		var isUser = isPassWrod = isPassWrodTwo = isEmail = false;
		$("#userSignup input[name='user[name]']").focus(function (){
			if (!$(this).val().trim()) {
				xc.signupAddP($(this),'alert-info','请填写用户名');
			}
		}).blur(function (){
			var $val = $(this).val().trim();
			if (!$val) {
				xc.signupAddP($(this),'alert-info','请填写用户名');
				isUser = false;
			}  else {
				var ret = /^[A-Za-z0-9_\u4e00-\u9fa5]{5,16}$/;
				if (ret.test($val)) {
					xc.signupAddP($(this),'alert-success','用户名填写正确');
					isUser = true;
				} else {
					isUser = false;
					xc.signupAddP($(this),'alert-danger','5-16个字符之间的汉子数字字母下划线');
				}
			}
		});
		$("#userSignup input[name='user[password]']").focus(function (){
			if (!$(this).val().trim()) {
				xc.signupAddP($(this),'alert-info','请填写密码');
			}
		}).blur(function (){
			var $val = $(this).val().trim();
			if (!$val) {
				xc.signupAddP($(this),'alert-info','请填写密码');
				isPassWrod = false;
			}  else {
				var ret = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;
				if (ret.test($val)) {
					xc.signupAddP($(this),'alert-success','密码填写正确');
					isPassWrod = true;
				} else {
					xc.signupAddP($(this),'alert-danger','6-22个字符之间');
					isPassWrod = false;
				}
			}
		});
		$("#userSignup input#passwordTwo").focus(function (){
			if (!$(this).val().trim()) {
				xc.signupAddP($(this),'alert-info','请再次输入密码');
			}
		}).blur(function (){
			var $val = $(this).val().trim();
			if (!$val) {
				xc.signupAddP($(this),'alert-info','请再次输入密码');
				isPassWrodTwo = false;
			}  else {
				if ($val== $("#userSignup input[name='user[password]']").val()) {
					xc.signupAddP($(this),'alert-success','两次密码输入相同');
					isPassWrodTwo = true;
				} else {
					xc.signupAddP($(this),'alert-danger','两次密码不匹配');
					isPassWrodTwo = false;
				}
			}
		});
		$("#userSignup input[name='user[email]']").focus(function (){
			if (!$(this).val().trim()) {
				xc.signupAddP($(this),'alert-info','请填写邮箱');
			}
		}).blur(function (){
			var $val = $(this).val().trim();
			if (!$val) {
				xc.signupAddP($(this),'alert-info','请填写邮箱');
				isEmail = false;
			}  else {
				var ret = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/;
				if (ret.test($val)) {
					xc.signupAddP($(this),'alert-success','邮箱填写正确');
					isEmail = true;
				} else {
					xc.signupAddP($(this),'alert-danger','邮箱格式不正确');
					isEmail = false;
				}
			}
		});
		$("#signupSubmit").click(function (){
			var $form = $("#userSignup");
			var required = $form.find(".required input");
			required.each(function (index, element) {
				if (!$(element).val().trim()) {
					xc.signupAddP($(this),'alert-danger','此选项必须填写');
					signError = false;
				}
			});
			// 用户名验证
			if (isUser && isPassWrod && isPassWrodTwo && isEmail) {
				$form.submit();
			}
		})
	},
	signupAddP : function (element,classname,info) {
		if (element.siblings('.alert').length > 0) {
			element.siblings('.alert').attr('class',classname).addClass('alert')
			.html(info);
		} else {
			var classname = classname;
			element.parent().append($("<div class="+classname+">"+info+"</div>").addClass('alert'));
		}
	}
}
// 关于创建 html 结构
var craeteHTML = {
	/**
	 * [comment 创建评论]
	 * @param  {[Object]} userComment [评论数据]
	 * @return {[type]}             [description]
	 */
	comment: function(userComment) {
		var user,toUser;
		public.getUserMessage(userComment.from, function(usermsg){
			user = usermsg;
			if (userComment.tid) {
				public.getUserMessage(userComment.tid, function(tousermsg){
					toUser = tousermsg;
					create(user,tousermsg,userComment.content)
				})
			} else {
				create(user,'',userComment.content)
			}
		})
		function create(user,toUser,context){
			if (!toUser) {
				if ($('#userComment .userCommentOne').length == 0) {
					window.location.reload();
				} else {
					console.log('1');
					var pid = $(".userCommentOne .addComment").eq(0).attr('data-pid');
					var tpl = 
		`<div class="media userCommentOne">
	        <div class="media-left">
	          <a href="#content" class="addComment" data-pid="${pid}" data-tid="${user._id}">
	            <img class="media-object" src="/userImg/${user.userImg}" data-holder-rendered="true"></a>
	        </div>
	        <div class="media-body">
	          <h4 class="media-heading">
	            <p>
	              <a href="/user/details?id=${user._id}">xiaocheng
	              </a> 
	              说 : 
	              <span class="pull-right">刚刚</span>
	            </p>
	          </h4>
	          <p>${userComment.content}</p>
	          <p><a class="deleteUserComment" data-id="${userComment._id}">删除</a></p>
	        </div>
	    </div>`;
	    console.log(tpl);
	       $("#userComment").append(tpl);
				}
			}
		}
	}
}
var public = {
	userSecrecy: '/user/secrecy', // 用户保密保密地址
	usercomment: '/userComment', // 用户评论提交
	userSignin: '/user/signin',  // 用户登录
	userMessage: '/usermessage', // 获得用户信息
	userList: "/admin/user/list",
	// 展示时间
	showTime : function (id){
		$id = $('#'+id);
		$id.html(new Date().toLocaleTimeString());
		setInterval( function(){
			var time = new Date().toLocaleTimeString();
			$id.html(time);
		},1000)
	},
	/**
	 * [userSigninFunc 用户登录]
	 * @param  {[string]} username [账号]
	 * @param  {[string]} password [密码]
	 * @return {[type]}          [description]
	 */
	userSigninFunc: function(username,password) {
		var self = this;
		$.ajax({
			url: self.userSignin,
			type: 'POST',
			data: {
				user: {
					name: username,
					password: password
				}
			},
			dataType: 'json'
		}).done( function(result) {
			if (result.code != 200) {
				alert(result.msg);
			} else {
				window.location.href = self.userList; 
			}
		})
	},
	/**
	 * [getUserMessage 获得用户信息]
	 * @param  {[string]}   id       [用户id]
	 * @param  {Function} callback [成功回调函数]
	 * @return {[type]}            [description]
	 */
	getUserMessage: function (id,callback) {
		console.log(id);
		var self = this;
		$.ajax({
			url: self.userMessage,
			type: 'POST',
			data: {
				id: id
			},
			dataType: 'json'
		}).done(function(result) {
			if (result.code == 200) {
				callback&&callback(result.data);
			} else {
				alert(result.msg);
			}
		})
	},
	/**
	 * [postCommentForm 用户留言提交]
	 * @param  {[string]} form [表单数据]
	 * @return {[type]}      [description]
	 */
	postCommentForm: function (data) {
		var self = this;
		$.ajax({
			url: self.usercomment,
			type: 'POST',
			data: data,
			dataType: 'json'
		}).done( function(result) {
			if (result.code != 200) {
				alert(result.msg);
			} else {
				 craeteHTML.comment(result.userComment);
			}
		})
	},
	// 用户页面 保密切换
	userSecrecyFunc: function () {
		var secrecyObj = {};
		var $isLook = $(".is-look");
		$isLook.each( function(index, item) {
			if ($(item).text() == '保密') {
				secrecyObj[$(item).attr('data-id')] = true;
			}else {
				secrecyObj[$(item).attr('data-id')] = false;
			}
		})
		// secrecyObj 为保密信息的对象
		var url = public.userSecrecy + '?secrecy=' + JSON.stringify(secrecyObj) + 
		'&id=' + public.getUrlParam(window.location, 'id');
		$.ajax({
			type: 'GET',
			url : url
		}).done( function(result) {
			if (result.success == 1) {
				console.log('保存信息状态成功');
			};
		})
	},
	// 获得地址上的参数
	getUrlParam : function(url,name){
        var pattern = new RegExp("[?&]" + name +"\=([^&]+)","g");
        var matcher = pattern.exec(url);
        var items = null;
        if(matcher != null){
            try{
                items = decodeURIComponent(decodeURIComponent(matcher[1]));   
            }catch(e){
                try{
                    items = decodeURIComponent(matcher[1]);
                }catch(e){
                    items = matcher[1];
                }
            }
        }
        return items;
    },
   	/**
   	 * [setMachineTime 设置页面下面的版权时间]
   	 * @type {[type]}
   	 */
    setMachineTime : function() {
    	$('#machine-time').text(new Date().getFullYear());
    }
}