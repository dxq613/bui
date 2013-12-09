 <?php 
   if(!isset($base)){
     $base = '';
   } 
 ?>
 <script type="text/javascript" src="<?php echo $base;?>../src/jquery-1.8.1.min.js"></script>
 <script type="text/javascript" src="<?php echo $base;?>assets/perform.js"></script>
 <script>
  Perform.start('bui load');
 </script>
 <!--<script type="text/javascript"  src="http://g.tbcdn.cn/fi/bui/bui-min.js"></script>-->
 <script type="text/javascript" data-auto-use="false"  src="<?php echo $base;?>../build/seed.js"></script>
 <!--<script type="text/javascript"  src="<?php echo $base;?>../bui1.js"></script>-->
  <script>
  Perform.end('bui load');
  Perform.log('bui load');
 </script>
 
 

  <script type="text/javascript">
   BUI.setDebug(true);
   
  </script>
