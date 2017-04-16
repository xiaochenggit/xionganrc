$(function (){
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
})