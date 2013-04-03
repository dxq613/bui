<?php 
	if($_GET["id"] >= 0)
	{
		$data = $_GET["id"];
		echo '{"percent": '.$data.'}';
	}
?>
