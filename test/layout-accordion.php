<?php  $title='收缩布局' ?>
<?php include("./templates/header.php"); ?>
<style>
	.x-accordion-title{
    background: #dfeaf2;
    border-top: 2px solid white;
    padding: 8px 10px;
  }
  .x-collapsed .x-accordion-body{
    height: 0;
    overflow: hidden;
  }

  .layout-test{
    border: 1px solid red;
    padding: 10px;
  }
</style>
<div class="container">
  <div id="J_Layout"></div>
</div>
  <?php $url = 'bui/layout/accordion'?>
  <?php include("./templates/script.php"); ?>
  <script type="text/javascript" src="../src/layout/item/base.js"></script>
  <script type="text/javascript" src="../src/layout/item/tab.js"></script>
  <script type="text/javascript" src="../src/layout/abstract.js"></script>
  <script type="text/javascript" src="../src/layout/collapsable.js"></script>
  <script type="text/javascript" src="../src/layout/accordion.js"></script>
  <script type="text/javascript" src="specs/layout-accordion-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>   