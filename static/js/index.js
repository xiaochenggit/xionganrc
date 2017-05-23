$(function (){
	// 导航时间
	public.showTime("showTime");
	// 用户保密
	$("#userSignin").submit(function(event) {
		event.preventDefault();
		var username = $("#userName").val();
		var password = $("#password").val();
		public.userSigninFunc(username, password);
	});
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
	$('.deleteUserComment').click(function(event) {
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
	});
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

var public = {
	// 用户保密保密地址
	userSecrecy: '/user/secrecy',
	userSignin: '/user/signin',
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
	userSigninFunc: function(username,password) {
		var self = this;
		console.log(username,password);
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
    }
}