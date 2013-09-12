<?php  $title='表格插件测试' ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div id="J_Grid"></div>
    <hr>
    <div id="J_Grid1"></div>
    <hr>
    <div id="J_Grid2"></div>
    <hr>
    <div id="J_Grid3"></div>
	<hr>
    <div id="J_Grid4"></div>
    <hr>
    <h2>汇总</h2>
    <div id="J_Grid5"></div>
    <h2>本页汇总</h2>
    <div id="J_Grid6"></div>
 </div>
<div id="J_Auto">
    
</div>
    <?php $url = 'bui/grid/grid,bui/grid/plugins'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/grid/column.js"></script>
    <script type="text/javascript" src="../src/grid/header.js"></script>
    <script type="text/javascript" src="../src/grid/grid.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/selection.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/cascade.js"></script>
	  <script type="text/javascript" src="../src/grid/plugins/gridmenu.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/summary.js"></script>
    
    <script type="text/javascript" src="../src/grid/plugins/editing.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/rowediting.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/dialog.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/cellediting.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/autofit.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/base.js"></script>
    
    <script type="text/javascript" src="specs/plugin-check-spec.js"></script>
   <script type="text/javascript" src="specs/plugin-radio-spec.js"></script>
    <script type="text/javascript" src="specs/plugin-cascade-spec.js"></script>
	  <script type="text/javascript" src="specs/plugin-menu-spec.js"></script>  
    <script type="text/javascript" src="specs/plugin-summary-spec.js"></script> <!--  -->
    <script type="text/javascript" src="specs/plugin-auto-spec.js"></script>
<?php include("./templates/footer.php"); ?>       