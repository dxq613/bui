<?php  $base='../' ?>
<?php  $title='自动计算坐标点测试' ?>
<?php include("../templates/header.php"); ?>


  <div class="container">
    <h2>数据坐标</h2>
   	<div class="row">
   		<div id="s1" class="span24">
   			
   		</div>
   	</div>

    <div class="row">
      <h2>时间坐标测试</h2>
      <div id="s2" class="span24">
        
      </div>
    </div>
    
  </div>
 
  <?php $url = 'bui/toolbar'?>
  <?php include("../templates/script.php"); ?>
	
	
  <script type="text/javascript" src="../../src/chart/axis/auto.js"></script>

 <script type="text/javascript" src="../specs/chart/axis-auto-spec.js"></script> 
   <script type="text/javascript" src="../specs/chart/axis-auto-time-spec.js"></script><!---->
  
<?php include("../templates/footer.php"); ?>