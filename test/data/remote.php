<?php 
  $a = $_GET["a"];
  if($a && strlen($a) < 10){
    echo '';
  }else{
    sleep(3);
    echo '长度不能超出10';
  }
?>