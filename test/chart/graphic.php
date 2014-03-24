<?php  $base='../' ?>
<?php  $title='图形测试测试' ?>
<?php include("../templates/header.php"); ?>

  <div class="container">
   	<div class="row">
   		<div id="s1" class="span12">
   			
   		</div>
   	</div>
  </div>
 
  <?php $url = 'bui/graphic/canvas,bui/graphic/util'?>
  <?php include("../templates/script.php"); ?>
	<!---->
  <script type="text/javascript" src="../../src/graphic/raphael/eve.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/core.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/svg.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/vml.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/group.js"></script>
	<script type="text/javascript" src="../../src/graphic/raphael.js"></script>
	
	<script type="text/javascript" src="../../src/graphic/util.js"></script>
  <script type="text/javascript" src="../../src/graphic/base.js"></script>
  <script type="text/javascript" src="../../src/graphic/canvasitem.js"></script>
  <script type="text/javascript" src="../../src/graphic/shape.js"></script>
	<script type="text/javascript" src="../../src/graphic/container.js"></script>
	<script type="text/javascript" src="../../src/graphic/group.js"></script>
  <script type="text/javascript" src="../../src/graphic/canvas.js"></script>

  <script type="text/javascript" src="../specs/chart/graphic-spec.js"></script>
<!---->
<?php include("../templates/footer.php"); ?>