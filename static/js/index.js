$(function (){
	// 添加文章
	$("#articleForm").submit(function(event) {
		$title = $("#title");
		if (!$title.val().trim()) {
			alert('文章标题不能为空！');
			return false;
		}
		$keyword = $("#keyword");
		if (!$keyword.val().trim()) {
			alert('文章描述不能为空！');
			return false;
		}
		if (!$('#articleId').length > 0 ) {
			var artcates = $("#articleForm input[type='checkbox']:checked");
			if (!artcates.length) {
				alert("请选择分类")
				return false;
			}
		}
		var $content = $(".editormd-markdown-textarea").val();
		if (!$content.trim()) {
			alert("文章内容不能为空")
			return false;
		}
	});
	// 导航时间
	public.showTime("showTime");
	// 版权时间
	public.setMachineTime();
	// 用户保密
	$("#userSignin").submit(function(event) {
		event.preventDefault();
		var username = $("#userName").val();
		var password = $("#password").val();
		var href = window.location.href;
		// 如果要是在登录页面
		if (href.indexOf('signin') > 0) {
			href = public.getUrlParam(window.location,'href') || '/';
		}
		public.userSigninFunc(username, password,href);
	});
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
	$(".deleteArticleCategory").click(function (){
		var id = $(this).attr('data-id');
		var $this = $(this);
		public.deleteArticleCategoryFun(id ,function(){
			$this.parents('tr').remove();
		})
	})
	// 删除文章
	$(".deleteActicle").click(function (){
		var id = $(this).attr('data-id');
		var $this = $(this);
		$.ajax({
			type : 'delete',
			url : '/admin/article/delete?id=' + id
		}).done(function (result) {
			if (result.success == 1) {
				$this.parents('.media').remove();
			}
		})
	});
	// 关注用户
	$("body #follow").click(function(event) {
		if(!craeteHTML.user.name) {
			$('#signinModal').modal('show')
			return false;
		}
		var id = $(this).attr('data-id');
		var url = '';
		var isActive = $(this).hasClass('active');
		if (isActive) {
			url = '/user/follows?id=' + id + '&delete=true';
		} else {
			url = '/user/follows?id=' + id;
		}
		var $this = $(this);
		var number = $('.followNumber');
		$.ajax({
			url: url,
			type: 'post'
		})
		.done(function(result) {
			if (result.code == 200) {
				if (isActive) {
					$this.removeClass('active');
					number.each(function(index, el) {
						$(el).text(parseInt($(el).text()) - 1)
					});
					$("#userFollows ul li a").each(function(index, el) {
						if ($(el).attr('href').indexOf(result.data.user._id)) {
							$(el).parent().remove();
						}
					});
				} else {
					$this.addClass('active');
					number.each(function(index, el) {
						$(el).text(parseInt($(el).text()) + 1)
					});
					$("#userFollows ul").prepend(craeteHTML.addBUsers(result.data));
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
	user: {},
	commentMessage: {},
	opinionPage: 1,
	getBUsersPage: 2,
	isGetBUsers: true,
	getCUsersPage: 2,
	isGetCUsers: true,
	getUserFollowsPage: 2,
	isGetUserFollow: true,
	getUserBrowseUsersPage: 2,
	isGetUserBrowseUsers: true,
	getArticleCommentPage: 2,
	isArticleComment: true,
	/**
	 * [comment 创建评论]
	 * @param  {[Object]} userComment [评论数据]
	 * @return {[type]}             [description]
	 */
	comment: function(userComment) {
		var self = this;
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
				var time = public.getTimeAgo(userComment.createAt);
				if($("#userComment .media").length == 0) {
					$("#userComment").text("");
				}
				var tpl = 
		`<div class="media userCommentOne">
	        <div class="media-left">
	          <a href="#content" class="addComment" data-pid="${userComment._id}" data-tid="${user._id}" data-name="${user.name}">
	            <img class="media-object" src="/userImg/${user.userImg}" data-holder-rendered="true"></a>
	        </div>
	        <div class="media-body">
	          <h4 class="media-heading">
	            <p>
	              <a href="/user/details?id=${user._id}">${user.name}
	              <span class='iconfont icon-${user.sex}'>
				  </span>
	              </a> 
	              说 : 
	              <span class="pull-right timeSpan" time="${userComment.createAt}">${time}</span>
	            </p>
	          </h4>
	          <p class='context'>${context}</p>
	          <p class="re"><a href="#content" class="addComment" data-pid="${userComment._id}" data-tid="${user._id}" data-name="${user.name}">回复</a><a class="deleteUserComment" data-id="${userComment._id}">删除</a></p>
	        </div>
	    </div>`;
	       		$("#userComment").prepend(tpl);
			} else {
				var time = public.getTimeAgo(userComment.createAt);
				var tpl = 
		`<div class="media userCommentTwo">
	        <div class="media-left">
	          <a href="#content" class="addComment" data-pid="${userComment._id}" data-tid="${user._id}" data-name="${user.name}">
	            <img class="media-object" src="/userImg/${user.userImg}" data-holder-rendered="true">
	          </a>
	        </div>
	        <div class="media-body">
	          <h4 class="media-heading">
	            <a href="/user/details?id=${user._id}">${user.name}
				  <span class='iconfont icon-${user.sex}'>
				  </span>
	            </a> 回复：
	            <a href="/user/details?id=${toUser._id}">${toUser.name}
				  <span class='iconfont icon-${toUser.sex}'>
				  </span>
	            </a>
	            <p class="pull-right timeSpan" time="${userComment.createAt}">${time}</p>
	          </h4>
	          <p class="context">${context}</p>
	          <p class="re"><a href="#content" class="addComment" data-pid="${userComment._id}" data-tid="${user._id}" data-name="${user.name}">回复</a>
	          <a class="deleteUserComment" data-id="${userComment._id}" re-id="${userComment._reid}">删除</a>
	          </p>
	        </div>
        </div>`;
	       		$("#userComment .userCommentOne").eq(self.addCommentIndex).find('.media-body').eq(0).append(tpl);
			}
		}
	},
	/**
	 * [commentTime 倒计时时间自动更新]
	 * @return {[type]} [description]
	 */
	commentTime: function () {
		setInterval(() => {
			$(".timeSpan").each((index, item) => {
				$(item).html(public.getTimeAgo($(item).attr('time') * 1));
			})
		},60000);
	},
	/**
	 * [deleteComment 删除评论的按钮点击 , 根据 reId 判断是不是删除二级留言 , 通过 id 查找主留言,]
	 * reId 查找二级留言 , 留言删除成功之后删除那个评论 media, 加一些判断, 回复变为默认回复 user
	 * @return {[type]} [description]
	 */
	deleteComment: function () {
		var self = this;
		$(document).on('click','.deleteUserComment',function(event){
			var id = $(this).attr('data-id');
			var reId = $(this).attr('re-id');
			if (reId) {
				url = '/usercomment/delete?id=' + id + '&reId=' + reId;
			} else {
				url = '/usercomment/delete?id=' + id;
			}
			var $this = $(this);
			$.ajax({
				type : 'delete',
				url : url
			}).done(function (result){
				if (result.code == 200) {
					$this.parents('.media').eq(0).remove();
					if (!$("#userComment .media").length) {
						self.loadGetUserCommentPage(self.commentMessage.page);
						// $("#userComment").text('还没有人留言快点为此用户增加人气吧');
						$("#userCommentForm .alert .close").click();
					}
				}
			});
		})
	},
	/**
	 * [addUserComment 点击添加二级留言回复, 为 form 表单添加 pid(留言主id) tid(被回复人的id) 字段]
	 *  index 为判断是那个二级回复里面的确切位置 为以后回复成功添加留言做准备
	 *  name 回复的 userName 添加到表单上方并显示关闭按钮, 点击关闭按钮可以切换回复状态(变成回复该空间用户)
	 */
	addUserComment: function() {
		var self = this;
		// 用户浏览版回复
		$('#userComment').on('click','.addComment',function(event) {
			var tic = $(this).attr('data-tid');
			var pid = $(this).attr('data-pid');
			var index = $("#userComment").find('.userCommentOne').index($(this).parents('.userCommentOne').get(0));
			self.addCommentIndex = index;
			var name = $(this).attr('data-name');
			$("#userCommentForm .alert").find('label').html(`回复 ${name}`).parent().
			find('.close').show();
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
	 * 点击关闭按钮 , 内容变成为用户留言, form 表单添加字段移出 
	 * @return {[type]} [description]
	 */
	deleteCommentTo: function () {
		$("#userCommentForm .alert").on('click', '.close', function (event) {
			$(this).hide().siblings('label').html('为用户留言');
			$("#commentPid, #commentTo").remove();
			event.preventDefault();
			return false;
		})
	},
	/**
	 * [drawUserComment 绘制留言板doom]
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	drawUserComment: function (data) {
		var self = craeteHTML;
		self.commentMessage = data;
		var $userComment = $("#userComment");
		$userComment.html("");
		var comments = data.comments;
		// 添加留言板
		var tpl = '';
		if (comments && comments.length > 0) { 
        	comments.forEach(function (comment,index) {
          		tpl += `<div class="media userCommentOne">
			            <div class="media-left">
			              <a href="#content" class="addComment" data-pid='${ comment._id }' data-tid='${comment.from._id }' data-name="${comment.from.name}">
			                <img class="media-object" src="/userImg/${ comment.from.userImg }" data-holder-rendered="true"></a>
			            </div>
			            <div class="media-body">
			              <h4 class="media-heading">
			                <p>
			                  <a href="/user/details?id=${ comment.from._id }">${ comment.from.name }
			                  	<span class='iconfont icon-${ comment.from.sex }'>
							    </span>
			                  </a> 
			                  说 : 
			                  <span class="pull-right timeSpan" time="${comment.createAt }">${ moment(comment.createAt).fromNow()  }</span>
			                </p>
			              </h4>
			              <p class="context">${ comment.content }</p><p class="re"><a href="#content" class="addComment" data-pid='${ comment._id }' data-tid='${comment.from._id }' data-name="${ comment.from.name }">回复</a>`;
				if (self.seeUserId == self.user._id || comment.from._id == self.user._id) { 
	             	tpl += `<a class='deleteUserComment' data-id='${comment._id}'>删除</a>`;
	            }
	            tpl += '</p>'
	            if (comment.reply && comment.reply.length > 0) { 
                	comment.reply.forEach( function (item,index) { 
		            tpl += `<div class="media userCommentTwo">
			                    <div class="media-left">
			                      <a href="#content" class="addComment" data-pid='${comment._id }' data-tid='${item.from._id }' data-name="${item.from.name}">
			                        <img class="media-object" src="/userImg/${ item.from.userImg }" data-holder-rendered="true" >
			                      </a>
			                    </div>
			                    <div class="media-body">
			                      <h4 class="media-heading">
			                        <a href="/user/details?id=${item.from._id }">${ item.from.name }
										<span class='iconfont icon-${ item.from.sex }'>
							    		</span>
			                        </a> 回复：
			                        <a href="/user/details?id=${item.to._id }">${ item.to.name }
										<span class='iconfont icon-${ item.to.sex }'>
							    		</span>
			                        </a>
			                        <p class="pull-right timeSpan" time="${item.createAt }" >
			                          ${ moment(item.createAt).fromNow()  }
			                        </p>
			                      </h4>
			                      <p class="context">${ item.content }</p><p class="re"><a href="#content" class="addComment" data-pid='${comment._id }' data-tid='${item.from._id }' data-name="${item.from.name}">回复</a>`;
		            if (self.seeUserId == self.user._id || item.from._id == self.user._id) {
                		tpl += `<a class='deleteUserComment' data-id='${ comment._id }' re-id="${ item._id }">删除</a>`;
               		} 
               		tpl += "</p></div></div>";
	           		}) 
	         	}
	         	tpl += "</div></div>"; 
      		}) 
    	} else { 
      		tpl += "还没有人留言快点为此用户增加人气吧";
    	} 
    	$userComment.append(tpl);
		// 添加分页
		var pageHTML = $("#page");
		pageHTML.html("");
		var page = data.page;
		var maxPage = data.maxPage;
		var pageNum = data.pageNum;
		var pageTpl = '';
		if (data.maxPage > 0) {
			pageTpl +=  `<nav aria-label="Page navigation">
					        <ul class="pagination">
					          <li>
					              <span aria-hidden="true">第${ page + 1 }/${ maxPage + 1 }页 每页${ pageNum }条</span>
					          </li>
					          <li><a href="#" page="0" >首页</a></li>
					          <li>
					            <a href="#" aria-label="Previous" page="${page - 1}">
					              <span aria-hidden="true">&laquo;</span>
					            </a>
					          </li>`;
			if (page - 2 >= 0 ) {
				pageTpl += ` <li><a href="#" page="${page - 2}">${page -1 }</a></li>`;
			}
			if (page - 1 >= 0 ) {
				pageTpl += ` <li><a href="#" page="${page - 1}">${page}</a></li>`;
			}
				pageTpl += ` <li class='active' page="${page}"><a href="#">${page + 1 }</a></li>`;
			if (page + 1 <= maxPage ) {
				pageTpl += ` <li><a href="#" page="${page + 1}">${page + 2}</a></li>`;
			}
			if (page + 2 <= maxPage ) {
				pageTpl += ` <li><a href="#" page="${page + 2}">${page + 3 }</a></li>`;
			}
			pageTpl += 		 `<li>
            			 		<a href="#" aria-label="Next" page="${page + 1}">
              					<span aria-hidden="true">&raquo;</span>
            					</a>
          					  </li>
          					  <li><a href="#" page="${maxPage}">尾页</a></li>
        				    </ul>`;
        	pageHTML.append(pageTpl);
		}
	},
	/**
	 * [clickGetUserCommentPage 点击切换用户留言]
	 * @return {[type]} [description]
	 */
	clickGetUserCommentPage: function() {
		var self = this;
		$("#page").on("click", "a", function(event){
			var page = parseInt($(this).attr("page"));
			self.loadGetUserCommentPage(page);
			event.preventDefault();
		})
	},
	/**
	 * [loadGetUserCommentPage 加载完 doom 获得 用户留言信息]
	 * @param  {[type]}   page     [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	loadGetUserCommentPage: function(page) {
		var self = this;
		var id = $("#seeUserId").val();
		this.seeUserId = id;
		var page = page || 0;
		public.getUserCommentPage(id, page, self.drawUserComment);
	},
	addCommentSubmitEvent: function () {
		$('#userCommentForm').submit(function(event) {
			event.preventDefault();
			var jsonData = $(this).serializeObject();
			if (jsonData['userComment[content]'].trim() == '') {
				alert("留言不能为空!");
				return;
			}
			$('#content').val('');
			public.postCommentForm(jsonData);
		})
	},
	/**
	 * index 右侧 li 标签滑动切换
	 * @return {[type]} [description]
	 */
	indexRightLiMove: function (){
		$("#index-right-box .article-box li").mousemove(function() {
			$(this).addClass('active').siblings().removeClass('active');
		});
	},
	/**
	 * [BodyScroll side-bar 滚动返回顶部渐显, 返回顶部点击动画实现]
	 */
	BodyScroll: function (){
		$(window).scroll(function(event) {
			var $top = $(this).scrollTop()
			var $returnTop = $("#returnTop");
			if ($top > 600) {
				$returnTop.show(200);
			} else {
				$returnTop.hide(200);
			}
		});
		// 注 火狐好像不支持body 所以加上了HTML
		$("#returnTop").click(function(){
			$('body,html').animate({'scrollTop': 0},500);
		})
	},
	/**
	 * 	文章收藏
	 * @return {[type]} [description]
	 */
	articleCollection: function(){
		const self = this;
		$(".articel-cont .lick").click(function() {
			if(!craeteHTML.user.name) {
				$('#signinModal').modal('show')
				return false;
			}
			var $this = $(this);
			var articleId = $(this).attr('article-id');
			if ($this.hasClass('collectioned')) {
				public.addArticleCollection('', articleId, function(data){
					$this.removeClass('collectioned');
					$(".lickNum").html(data.collectionlength);
					$("#MoreCollectionUsers ul li a").each(function(index, el) {
						if ($(el).attr('href').indexOf(data.user._id)) {
							$(el).parent().remove();
						}
					});
				})
			} else {
				public.addArticleCollection(true, articleId, function(data){
					$this.addClass('collectioned');
					$(".lickNum").html(data.collectionlength);
					$("#MoreCollectionUsers ul").prepend(self.addBUsers(data));
				})
			}
		});
	},
	/**
	 * opinion 意见反馈表单提交
	 */
	opinionBtnClick : function () {
		var self = this;
		$("#opinionBtn").click(function(event) {
			event.preventDefault();
			var opinionForm = $("#opinionForm");
			if (!$("#opinionContent").val().trim()) {
				alert('请输入反馈内容');
				return false;
			}
			var data = opinionForm.serializeObject();
			public.ajax('/opinion', 'POST', data, function(data){
				$("#opinion .opinionGroup").prepend(self.appOpinion(data.opinion));
				$("#opinionContent").val('').focus();
			})
		});
	},
	/**
	 * [appOpinion 添加意见反馈]
	 * @param  {[type]} data [意见反馈成功返回数据]
	 */
	appOpinion: function(data) {
		var opinionHTML = 
		`<div class="opinion">
			<div class="opinionUser">
				<a href="/user/details?id=${data.user._id}">
					<img src="/userImg/${data.user.userImg}">
				</a>
				<div class="opinionUserDes">
					<p class="opinionUserName">
						<a href="/user/details?id=${data.user._id}">
							${data.user.name}
							<span class='iconfont icon-${data.user.sex}'>
					    	</span>
						</a>
					</p>
					<p class="opinionCreateTime">
						${moment(data.createAt).format('YYYY.MM.DD HH:mm:ss')}
					</p>
					<button class="btn btn-danger deleteOpinion" data-id=${data._id}>
						删除
					</button>
				</div>
			</div>
			<div class="opinionContent">
				<p>${data.content}</p>
			</div>
		</div>`;
		return opinionHTML;
	},
	/**
	 * [deleteOpinion 删除意见反馈]
	 * @return {[type]} [description]
	 */
	deleteOpinion: function(){
		$(document).on('click', '.deleteOpinion', function(){
			const $this = $(this);
			const id = $this.attr('data-id');
			public.ajax('/opinion/delete', 'POST', {id: id}, function(){
				$this.parents('.opinion').remove();
				if ($(".opinion").length === 0) {
					$("#opinionMore").click();
				}
			});
		});
	},
	/**
	 * [getOpinions 获得更多意见反馈]
	 * @return {[type]} [description]
	 */
	getOpinions: function() {
		var self = this;
		$("#opinionMore").click(function(event) {
			self.opinionPage += 1;
			public.ajax('/getOpinions', 'POST', {page: self.opinionPage}, function(data){
				if (data.isBtn) {
					$("#opinionMore").remove();
				}
				data.opinions.forEach( function(element, index) {
					$("#opinion .opinionGroup").append(self.appOpinion(element));
				});
			});
		});
	},
	/**
	 * [getBUsers 滑动加载更多的文章浏览者的信息]
	 * @ajax [url post {id:id, pageNow: pageNow} func] 
	 * @return {[type]} [description]
	 */
	getBUsers: function () {
		const self = this;
		$("#articleBrowseUsers").scroll(function(event) {
			var pageNow = self.getBUsersPage;
			const $this = $(this);
			const id = $this.attr('data-id');
			// 判断是否到底部 且 允许获得信息
			var nDivHight = $this.height();
			var nScrollHight = $this[0].scrollHeight;
		    var nScrollTop = $this[0].scrollTop;
		    if(nScrollTop + nDivHight >= nScrollHight && self.isGetBUsers) {
		        public.ajax('/article/getBUsers', 'POST', {id:id, pageNow: pageNow },function(data){
					self.getBUsersPage += 1;
					self.isGetBUsers = data.isBtn;
					data.browseUsers.forEach( function(element, index) {
						$("#articleBrowseUsers ul").append(self.addBUsers(element));
					});
				})
		    }
		});
		
	},
	// 同上
	getCUsers: function () {
		const self = this;
		$("#articleCollectionUsers").scroll(function(event) {
			var pageNow = self.getCUsersPage;
			const $this = $(this);
			const id = $this.attr('data-id');
			var nDivHight = $this.height();
			var nScrollHight = $this[0].scrollHeight;
		    var nScrollTop = $this[0].scrollTop;
		    if(nScrollTop + nDivHight >= nScrollHight && self.isGetCUsers) {
		        public.ajax('/article/getCUsers', 'POST', {id:id, pageNow: pageNow },function(data){
					self.getCUsersPage += 1;
					self.isGetCUsers = data.isBtn;
					data.collectionUsers.forEach( function(element, index) {
						$("#articleCollectionUsers ul").append(self.addBUsers(element));
					});
				})
		    }
		});
	},
	// 同上
	getUserFollows: function () {
		const self = this;
		$("#userFollows").scroll(function(event) {
			var pageNow = self.getUserFollowsPage;
			const $this = $(this);
			const id = $this.attr('data-id');
			var nDivHight = $this.height();
			var nScrollHight = $this[0].scrollHeight;
		    var nScrollTop = $this[0].scrollTop;
		    if(nScrollTop + nDivHight >= nScrollHight && self.isGetUserFollow) {
		        public.ajax('/user/getfollows', 'POST', {id:id, pageNow: pageNow },function(data){
					self.getUserFollowsPage += 1;
					self.isGetUserFollow = data.isBtn;
					data.follows.forEach( function(element, index) {
						$("#userFollows ul").append(self.addBUsers(element));
					});
				})
		    }
		});
	},
	// 同上
	getUserBrowseUsers: function () {
		const self = this;
		$("#userBrowseUsers").scroll(function(event) {
			var pageNow = self.getUserBrowseUsersPage;
			const $this = $(this);
			const id = $this.attr('data-id');
			var nDivHight = $this.height();
			var nScrollHight = $this[0].scrollHeight;
		    var nScrollTop = $this[0].scrollTop;
		    if(nScrollTop + nDivHight >= nScrollHight && self.isGetUserBrowseUsers) {
		        public.ajax('/user/getBrowseUsers', 'POST', {id:id, pageNow: pageNow },function(data){
					self.getUserBrowseUsersPage += 1;
					self.isGetUserBrowseUsers = data.isBtn;
					data.browseUsers.forEach( function(element, index) {
						$("#userBrowseUsers ul").append(self.addBUsers(element));
					});
				})
		    }
		});
	},
	/**
	 * [getArticleComment 获得更多文章评论]
	 */
	getArticleComment: function () {
		if ($('.articleComments').length <= 0) {
			return false;
		}
		const self = this;
		$(window).scroll(function(event) {
			var pageNow = self.getArticleCommentPage;
			const $this = $(this);
			const id = public.getUrlParam(window.location, 'id');
			// 判断是否到底部 且 允许获得信息
			var nDivHight = $this.innerHeight();
			var nScrollHight = document.body.scrollHeight;
		    var nScrollTop = $this.scrollTop();
		    if(nScrollTop + nDivHight >= nScrollHight && self.isArticleComment) {
		    public.ajax('/article/getMoreComment', 'POST', {id:id, pageNow: pageNow },function(data){
					self.getArticleCommentPage += 1;
					self.isArticleComment = data.isBtn;
					$("#articleComments").append(self.addMoreArticleComment(data.articleComments));
					self.articleCommentSort();
				})
		    }
		});
	},
	addMoreArticleComment:function(articleComments){
		let tpl = '';
		if (articleComments && articleComments.length > 0 ) { 
			  articleComments.forEach(function(item, index){ 
			tpl +=`<div class="articleComment">
							<div class="articleCommentFrom">
								<div class="left">
									<a href="/user/details?id=${item.from._id}" target="_blank">
										<img src="/userImg/${item.from.userImg }" alt="${item.from.name}">
									</a>
								</div>
								<div class="right">
									<p class="name">
										<a href="/user/details?id=${item.from._id}" target="_blank">
											${item.from.name}
											<span class='iconfont icon-${ item.from.sex }'>
			  							</span>
										</a>
									</p>
									<p class="des">
										<span class='number'>${index + 1 }</span> · 楼
										<span class='time'>
											${ moment(item.createAt).format('YYYY.MM.DD HH:mm') }
										</span>
									</p>
								</div>
							</div>
							<div class="articleCommentContent">
								${item.content}
								<div class="operation">
									<span class='reply' artId="${item._id}" toId="${item.from._id}">
										<i class='iconfont icon-huifu'></i>回复
			  					</span>`;
									if (craeteHTML.user._id == item.from._id ){ 
									tpl += `<span class="deleteArticleComment pull-right" data-id="${item._id}">删除</span>`;
									} 
						tpl +=`</div>
							</div>
							<div class="commentlist">
								<div class="div">`;
								if (item.reply &&　item.reply.length > 0) { 
								item.reply.forEach(function(element){ 
							tpl += `<div class="articleCommentTwoGroup">
										<div class="articleCommentTwo">
											<div class="left">
												<a href="/user/details?id=${element.from._id}" target="_blank">
													<img src="/userImg/${element.from.userImg }" alt="${element.from.name}">
												</a>
											</div>
											<div class="right">
												<p class="name">
													<a href="/user/details?id=${element.from._id}" target="_blank">
														${element.from.name}
														<span class='iconfont icon-${ element.from.sex }'>
						  							</span>
													</a>
												</p>
												<p class="des">
													<span class='time'>
														${ moment(element.createAt).format('YYYY.MM.DD HH:mm') }
													</span>
												</p>
											</div>
										</div>
										<div class="articleCommentContent">
											<a href="/user/details?id=${element.to._id}">@${element.to.name}</a> ${element.content}
											<div class="operation">
												<span class='reply' artid="${item._id}" toid="${element.from._id}">
													<i class='iconfont icon-huifu'></i>回复
						  					</span>`;
												 if (craeteHTML.user._id == element.from._id ){
												tpl+= `<span class="deleteArticleCommentTwo pull-right two" data-id="${element._id}" data-art='${item._id }'>删除</span>`;
												 } 
											tpl+=`</div>
										</div>
									</div>`;
								 }) 
								} 
							tpl+=`</div>
							</div>
						</div>`;
			})
		} 
		return tpl;
	},
	// 添加信息
	addBUsers: function (item) {
		var tpl =   `<li>
						<a href="/user/details?id=${ item.user._id }">
							<img src="/userImg/${ item.user.userImg }">
							${ item.user.name}
							<span class='iconfont icon-${item.user.sex }'>
						  </span>
						</a>
						<span time="${ item.time }" class="pull-right timeSpan">
							${ moment(item.time).fromNow() }
			    		</span>
				    </li>`;
		return tpl;
	},
	// 点击修改用户信息，添加返回链接 到 from 表单中
	changUserMessClick: function(){
		$("#changUserMess").click(function(){
			$("#userReturnHref").val(window.location.href);
		});
	},
	/**
	 * 文章标题搜索
	 */
	articleSearch: function(){
		$("#articleSearch").submit(function(event) {
			event.preventDefault();
			var search = $("input[name='search']").val().trim();
			if (!search) {
				alert('请填写要搜索的文章名!')
				return false;
			}
			// 发送搜索请求,没有搜索到文章直接弹出提示,搜索到之后 直接跳转到文章列表页面
			// 在进行筛选。
			public.ajax('/article/search','POST',{search: search},function(data){
				window.location.href = '/admin/article/list?search=' + data.search;
			});
		});
	},
	/**
	 * [addArticleComment 添加文章评论]
	 */
	addArticleComment: function(){
		var self = this;
		$("#articleCommentForm").submit(function(event) {
			event.preventDefault();
			const data = $(this).serializeObject();
			if (!data['articleComment[content]'].trim()) {
				alert('评论不能为空!');
				return false;
			}
			public.ajax('/article/addComment','POST',data,function(data){
				$("#articleComments").prepend(self.articleCommentTpl(data.articleComment));
				self.articleCommentSort();
				self.addArticleCommentTwo();
				$("#articleCommentForm textarea").val('').focus();
			});
		});
	},
	// 删除文章评论 根据class 区分是否是一级评论
	deleteArticleComment: function() {
		const self = this;
		$('#articleComments').on('click','.deleteArticleComment,.deleteArticleCommentTwo',function(){
			const $this = $(this);
			const id = $this.attr('data-id');
			const art = $this.attr('data-art');
			if (!$this.hasClass('two')) {
				public.ajax('/article/deletearticlecomment','POST',{id: id}, function(){
					$this.parents('.articleComment').remove();
					self.articleCommentSort();
				});
			} else {
				public.ajax('/article/deletearticlecomment','POST',{id: id,two:true,art:art}, function(){
					$this.parents('.articleCommentTwoGroup').remove();
				});
			}
		})
	},
	// 文章一级评论tpl
	articleCommentTpl: function(item){
		let tpl = '';
		tpl += `<div class="articleComment">
					<div class="articleCommentFrom">
						<div class="left">
							<a href="/user/details?id=${ item.from._id }" target="_blank">
								<img src="/userImg/${item.from.userImg}" alt="${ item.from.name }">
							</a>
						</div>
						<div class="right">
							<p class="name">
								<a href="/user/details?id=${ item.from._id }" target="_blank">
									${ item.from.name }
									<span class='iconfont icon-${  item.from.sex  }'>
									</span>
								</a>
							</p>
							<p class="des">
								<span class='number'>1</span> · 楼
								<span class='time'>
									${  moment(item.createAt).format('YYYY.MM.DD HH:mm')  }
								</span>
							</p>
						</div>
					</div>
					<div class="articleCommentContent">
						${ item.content }
						<div class="operation">
							<span class='reply' artId="${item._id}" toId="${item.from._id}">
								<i class='iconfont icon-huifu'></i>回复
							</span>
							<span class="deleteArticleComment pull-right" data-id="${ item._id }">删除</span>
						</div>
					</div>
					<div class="commentlist">
						<div class="div">
						</div>
					</div>
				</div>`;
		return tpl;
	},
	// 文章评论排序
	articleCommentSort: function() {
		$('#articleComments .articleComment').each(function(index,el){
			$(el).find('.number').text(index + 1);
		})
	},
	// 二级回复请求
	addArticleCommentTwo: function() {
		const self = this;
		$(".articleCommentTwoFrom form").submit(function(event){
			event.preventDefault();
			const $this = $(this);
			const data = $this.serializeObject();
			if (!data['articleComment[content]'].trim()) {
				alert('评论不能为空!');
				return false;
			}
			public.ajax('/article/addComment','POST',data,function(data){
				$this.parents('.commentlist').find('.div').append(self.addArticleCommentTwoTpl(data.articleCommentTwo,data.parentArt));
				$this.find('textarea').val('').focus();
			});
		})
	},
	// 文章二级评论 tpl
	addArticleCommentTwoTpl: function(element,parentArt) {
		let tpl = "";
		tpl += `<div class="articleCommentTwoGroup"><div class="articleCommentTwo">
					<div class="left">
						<a href="/user/details?id=${element.from._id}" target="_blank">
							<img src="/userImg/${element.from.userImg }" alt="${element.from.name}">
						</a>
					</div>
					<div class="right">
						<p class="name">
							<a href="/user/details?id=${element.from._id}" target="_blank">
								${element.from.name}
								<span class='iconfont icon-${ element.from.sex }'>
  							</span>
							</a>
						</p>
						<p class="des">
							<span class='time'>
								${ moment(element.createAt).format('YYYY.MM.DD HH:mm') }
							</span>
						</p>
					</div>
				</div>
				<div class="articleCommentContent">
					<a href="/user/details?id=${element.to._id }">@${element.to.name}</a>
					 ${element.content}
					<div class="operation">
						<span class='reply' artid="${parentArt}" toid="${element.from._id}">
							<i class='iconfont icon-huifu'></i>回复
  					</span>
						<span class="deleteArticleCommentTwo pull-right two" data-id="${element._id}" data-art="${parentArt}">删除</span>
						<% } }
					</div>
				</div>
			</div></div>`;
		return tpl;
	},
	/**
	 * [addArticleCommentTwoForm 添加二级回复表单 tpl]
	 */
	addArticleCommentTwoForm: function(artId,toId){
		let tpl = `<div class="articleCommentTwoFrom">
						<form>
							<input type="hidden" name="articleComment[_id]" value="${artId}">
							<input type="hidden" name="articleComment[toId]" value="${toId}">
							<textarea placeholder="写下你的评论..." name="articleComment[content]"></textarea>
							<button class="btn btn-info addCommentReply" type="submit">提交</button>
						</form>
					</div>`;
		return tpl;
	},
	// 文章评论,添加回复表单
	addArticleCommentReply: function(){
		const self = this;
		$("#articleComments").on('click','.reply',function(){
			if(!craeteHTML.user.name) {
				$('#signinModal').modal('show')
				return false;
			}
			const $this = $(this);
			const artId = $this.attr('artid');
			const toId = $this.attr('toid');  
			$('.articleCommentTwoFrom').remove();
			$this.parents('.articleComment').find('.commentlist').append(self.addArticleCommentTwoForm(artId,toId));
			self.addArticleCommentTwo();
		})
	},
	/**
	 * [init 开始就会执行的函数]
	 * @return {[type]} [description]
	 */
	init: function () {
		var self = this;
		public.getUserMessage('',function(data){
			self.user = data;
			self.loadGetUserCommentPage(0);
		});
		this.addCommentSubmitEvent();
		this.commentTime();
		this.deleteComment();
		this.deleteCommentTo();
		this.addUserComment();
		this.clickGetUserCommentPage();
		this.indexRightLiMove();
		this.BodyScroll();
		this.articleCollection();
		this.opinionBtnClick();
		this.deleteOpinion();
		this.getOpinions();
		this.getBUsers();
		this.getCUsers();
		this.getUserFollows();
		this.getUserBrowseUsers();
		this.changUserMessClick();
		this.articleSearch();
		this.addArticleComment();
		this.deleteArticleComment();
		this.articleCommentSort();
		this.addArticleCommentTwo();
		this.addArticleCommentReply();
		this.getArticleComment();
	}
}
var public = {
	userSecrecy: '/user/secrecy', // 用户保密保密地址
	usercomment: '/userComment', // 用户评论提交
	userCommentPage: '/userCommentPage', // 获得用户留言分页信息
	userSignin: '/user/signin',  // 用户登录
	userMessage: '/usermessage', // 获得用户信息
	userList: "/admin/user/list",
	deleteArticleCategory: "/admin/articlecategory/delete?id=", // 删除文章分页
	articleCollection: '/article/collection',
	/**
	 * [ajax 公共ajax方法]
	 * @param  {[type]}   url      [请求地址]
	 * @param  {[type]}   data     [数据]
	 * @param  {Function} callback [成功回调]
	 * @return {[type]}            [description]
	 */
	ajax : function(url, type, data , callback) {
		$.ajax({
			url: url,
			type: type,
			data: data,
			dataType:'json',
		}).done(function (result) {
			if (result.code == 200) {
				callback&& callback(result.data);
			} else {
				alert(result.msg);
			}
		});
	},
	/**
	 * [showTime 展示时间]
	 * @param  {[string]} id [dom ID]
	 * @return {[type]}    [description]
	 */
	showTime : function (id){
		$id = $('#'+id);
		var self = this;
		$id.html(this.getTime(new Date()));
		setInterval( function(){
			$id.html(self.getTime(new Date()));
		},1000)
	},
	/**
	 * [deleteArticleCategoryFun description]
	 * @param  {[type]}   id       [description]
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	deleteArticleCategoryFun: function(id, callback) {
		var self = this;
		$.ajax({
			url: self.deleteArticleCategory + id,
			type: 'delete'
		}).done(function(result) {
			if (result.code == 200) {
				callback && callback();
			} else {
				alert(result.msg)
			}
		})
	},
	addArticleCollection: function(isAdd,id, callback) {
		var self = this;
		$.ajax({
			url: self.articleCollection,
			type: 'POST',
			data: {
				isAdd: isAdd,
				id: id
			},
			dataType: 'json'
		}).done(function(result) {
			if (result.code == 200) {
				callback && callback(result.data);
			} else {
				alert(result.msg)
			}
		})	
	},
	/**
	 * [getUserCommentPage 获得用户留言分页信息]
	 * @param  {[string]} id [用户id]
	 * @param  {[number]} page [页码]
	 * @return {[type]}      [description]
	 */
	getUserCommentPage: function(id, page, callback) {
		var self = this;
		$.ajax({
			url: this.userCommentPage,
			type: 'POST',
			data: {
				id : id,
				page : page
			},
			dataType: 'json'
		}).done(function(result){
			if (result.code == 200) {
				callback && callback(result.data);
			}
		})
	},
	/**
	 * [userSigninFunc 用户登录]
	 * @param  {[string]} username [账号]
	 * @param  {[string]} password [密码]
	 * 登录成功跳入 用户列表页面
	 * @return {[type]}          [description]
	 */
	userSigninFunc: function(username,password,href) {
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
				window.location.href = href; 
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
	 * 提交成功创建留言 , 失败弹出失败信息 , 然后回复类型切换 当前留言删除
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
				$("#userCommentForm .alert .close").click();
				$("#userComment .userCommentOne").eq(craeteHTML.addCommentIndex).remove();
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
	/**
	 * [getUrlParam 获取地址参数]
	 * @param  {[string]} url  [地址]
	 * @param  {[string]} name [参数名字]
	 * @return {[string]}      [参数值]
	 */
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
     * @param  {[string]} date [时间戳]
     * @return {[string]}      [几分钟ago 列 刚刚 2分钟前 1小时前 1一天前 一个月前]
     */
    getTimeAgo: function(date) {
    	moment.lang('zh-cn');
    	return moment(date).fromNow()
    }
}