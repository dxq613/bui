<?php $id= $_GET['id'];
  if($id == '0'){
?>
[{"id" : "1","text" : "1","leaf" : false},{"id" : "2","text" : "2"},{"id" : "3","text" : "3","leaf" : false},{"id" : "4","text" : "4"},{"id" : "5","text" : "5"}]
<?php }else{ sleep(1); ?>
[
  <?php for ($i=1; $i<=5; $i++)
  { 
    $leaf = ($i % 2 == 0) ? 'true' : 'false';
    echo '{"id" : "'.$id.$i.'","text" : "'.$id.$i.'","leaf" : '.$leaf.'},';
  }?>

   <?php
  
    echo '{"id" : "'.$id.'6","text" : "'.$id.'6"}';
  ?>
]
<?php } ?>
