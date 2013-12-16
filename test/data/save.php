<?php 
	$type = $_POST['saveType'];
	if($type == 'add'){
?>
{"hasError" : false,"id" : "addd"}
<?php }else if(isset($_POST['error'])){?>
{"hasError" : true,"error" : "错误信息"}
<?php }else {?>
{"hasError" : false,"success" : true}
<?php }?>