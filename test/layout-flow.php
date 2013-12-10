<?php  $title='流布局' ?>
<?php include("./templates/header.php"); ?>
<style>
	.x-layout-item-flow{
    border : 1px solid #ddd;
    float: left;
  }

  .layout-test{
    border: 1px solid red;
    padding: 10px;
  }
</style>
<div class="container">
  <div id="J_Layout"></div>
</div>
  <?php $url = 'bui/layout/flow'?>
  <?php include("./templates/script.php"); ?>
  <script type="text/javascript" src="../src/layout/item/base.js"></script>
  <script type="text/javascript" src="../src/layout/abstract.js"></script>
  <script type="text/javascript" src="../src/layout/flow.js"></script>
  <script type="text/javascript" src="specs/layout-flow-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>   