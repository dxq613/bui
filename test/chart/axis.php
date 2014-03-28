<?php  $base='../' ?>
<?php  $title='坐标轴测试' ?>
<?php include("../templates/header.php"); ?>

  <div class="container">
   	<div class="row">
   		<div id="s1" class="span12">
   			
   		</div>
   	</div>
    <div class="row">
      <div id="s2" class="span12">
        
      </div>
      <div id="s3" class="span12">
        
      </div>
    </div>
  </div>
 
  <?php $url = 'bui/toolbar'?>
  <?php include("../templates/script.php"); ?>
	
	<script type="text/javascript" src="../../src/chart/plotitem.js"></script>
  
  <script type="text/javascript" src="../../src/chart/axis/abstract.js"></script>
  <script type="text/javascript" src="../../src/chart/axis/radius.js"></script>

  <script type="text/javascript" src="../../src/chart/axis/base.js"></script>
  <script type="text/javascript" src="../../src/chart/axis/grid.js"></script>
  <script type="text/javascript" src="../../src/chart/labels.js"></script>
  <script type="text/javascript" src="../../src/chart/mixin/showlabels.js"></script>
  <script type="text/javascript" src="../../src/chart/axis/number.js"></script>
  <script type="text/javascript" src="../../src/chart/axis/category.js"></script>
  <script type="text/javascript" src="../../src/chart/axis/time.js"></script>



  <script type="text/javascript" src="../specs/chart/axis-spec.js"></script>
  <script type="text/javascript" src="../specs/chart/axis-number-spec.js"></script>
   <script type="text/javascript" src="../specs/chart/axis-category-spec.js"></script> <!---->

  <script type="text/javascript" src="../specs/chart/axis-time-spec.js"></script>
  

<?php include("../templates/footer.php"); ?>