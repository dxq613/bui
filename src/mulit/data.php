<?php if($_GET['key'] == '1') {?>
{"rows": [{"text":"选项1","value":"a"}]}
<?php 
  } 
  elseif($_GET['key'] == '2') { ?>
{"rows": [{"text":"选项1","value":"a"},{"text":"选项2","value":"b"}]}
<?php } 
  else {
  ?>
  {"rows": [{"text":"选项1","value":"a"},{"text":"选项2","value":"b"},{"text":"选项3","value":"c"}]}
  <?php
  }
?>