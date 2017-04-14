$(function (){
	console.log('载入文件成功');
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
	})
})