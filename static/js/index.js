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
		$('#content').val('');
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
    craeteHTML.init(); 
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
		var self = this;
		var user,toUser;
		console.log(userComment);
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
				var time = public.getTimeAgo(userComment.createAt);
				var tpl = 
		`<div class="media userCommentOne">
	        <div class="media-left">
	          <a href="#content" class="addComment" data-pid="${userComment._id}" data-tid="${user._id}">
	            <img class="media-object" src="/userImg/${user.userImg}" data-holder-rendered="true"></a>
	        </div>
	        <div class="media-body">
	          <h4 class="media-heading">
	            <p>
	              <a href="/user/details?id=${user._id}">${user.name}
	              </a> 
	              说 : 
	              <span class="pull-right timeSpan" time="${userComment.createAt}">${time}</span>
	            </p>
	          </h4>
	          <p>${userComment.content}</p>
	          <p><a class="deleteUserComment" data-id="${userComment._id}">删除</a></p>
	        </div>
	    </div>`;
	       		$("#userComment").prepend(tpl);
			} else {
				var time = public.getTimeAgo(userComment.createAt);
				var tpl = 
		`<div class="media userCommentTwo">
	        <div class="media-left">
	          <a href="#content" class="addComment" data-pid="${userComment._id}" data-tid="${user._id}">
	            <img class="media-object" src="/userImg/${user.userImg}" data-holder-rendered="true">
	          </a>
	        </div>
	        <div class="media-body">
	          <h4 class="media-heading">
	            <a href="/user/details?id=${user._id}">${user.name}</a> 回复：
	            <a href="/user/details?id=${toUser._id}">${toUser.name}</a>
	            <p class="pull-right timeSpan" time="${userComment.createAt}">${time}</p>
	          </h4>
	          <p>${userComment.content}</p>
	          <p><a class="deleteUserComment" data-id="${userComment._id}" data-index="0">删除</a></p>
	        </div>
        </div>`;
	       		$("#userComment .userCommentOne").eq(self.addCommentIndex).find('.media-body').eq(0).append(tpl);
			}
		}
	},
	/**
	 * [commentTime 留言时间的自动更新]
	 * @return {[type]} [description]
	 */
	commentTime: function () {
		setInterval(() => {
			$(".timeSpan").each((index, item) => {
				$(item).html(public.getTimeAgo($(item).attr('time') * 1));
			})
		},5000);
	},
	deleteComment: function () {
		$(document).on('click','.deleteUserComment',function(event){
			var id = $(this).attr('data-id');
			var index = $(this).parents('.media').find('.deleteUserComment').index(this);
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
	},
	addUserComment: function() {
		var self = this;
		// 用户浏览版回复
		$('#userComment').on('click','.addComment',function(event) {
			var tic = $(this).attr('data-tid');
			var pid = $(this).attr('data-pid')
			var index = $("#userComment").find('.userCommentOne').index($(this).parents('.userCommentOne').get(0));
			self.addCommentIndex = index;
			var name = $(this).parent().siblings('.media-body').find('a').eq(0).text();
			$("#userCommentForm .reName span").html(name);
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
	},
	/**
	 * [deleteCommentTo 用户详情留言回复类型切换]
	 * @return {[type]} [description]
	 */
	deleteCommentTo: function () {
		$("#userCommentForm").on('click', '.reName', function () {
			$(this).find('span').remove();
			$("#commentPid, #commentTo").remove();
		})
	},
	/**
	 * [init 开始就会执行的函数]
	 * @return {[type]} [description]
	 */
	init: function () {
		this.commentTime();
		this.deleteComment();
		this.deleteCommentTo();
		this.addUserComment();
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
		var self = this;
		$id.html(this.getTime(new Date()));
		setInterval( function(){
			$id.html(self.getTime(new Date()));
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
				console.log(result)
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
    },
    /**
     * [getTime 获得当前时间]
     * @param  {[date]} date [当前时间]
     * @return {[string]}      [返回时间字符串 例 中午01:30:59]
     */
    getTime : function (date) {
    	var dateDesArray = ['凌晨','清晨','上午','中午','下午','傍晚','夜晚','深夜'];
    	var h = date.getHours();
    	var dateDes = '';
    	switch (h) {
    		case 0:
    		case 1:
    		case 2:
    		case 3:
    		case 4:
    		case 5:
    		dateDes = dateDesArray[0]
    			break;
    		case 6:
    		case 7:
    		dateDes = dateDesArray[1]
    			break;
    		case 8:
    		case 9:
    		case 10:
    		case 11:
    		dateDes = dateDesArray[2]
    			break;
    		case 12:
    		case 13:
    		dateDes = dateDesArray[3]
    			break;
    		case 14:
    		case 15:
    		case 16:
    		case 17:
    		dateDes = dateDesArray[4]
    			break;
    		case 18:
    		case 19:
    			dateDes = dateDesArray[5]
    			break;
    		case 20:
    		case 21:
    		case 22:
    			dateDes = dateDesArray[6]
    			break;
    		case 23:
    			dateDes = dateDesArray[7]
    			break;
    		default:
    			// statements_def
    			break;
    	}
    	if (h > 12) {
    		h = h - 12;
    	}
    	// 最少两位
    	h = ('0' + h).slice(-2);
    	var m = ('0' + date.getMinutes()).slice(-2);
    	var s = ('0' + date.getSeconds()).slice(-2);
    	return dateDes + h + ':' + m + ':' + s;
    },
    /**
     * [getTimeAgo 返回几分钟前]
     * @param  {[number]} date [时间戳]
     * @return {[string]}      [几分钟ago 列 刚刚 2分钟前 1小时前 1一天前 一个月前]
     */
    getTimeAgo: function(date) {
    	moment.lang('zh-cn');
    	return moment(date).fromNow()
    }
}