<?php  $title='列模式布局' ?>
<?php include("./templates/header.php"); ?>
<style>
	.x-layout-column{
    border : 1px solid #ddd;
    height: 100%;
    padding:0px 10px;
    float: left;
  }

  .x-layout-item-column{
    border: 1px solid blue;
    margin: 10px 0;
    padding: 20px;
  }

  .x-layout-columns{
    height: 100%;
  }

  .layout-test{
    border: 1px solid red;
    padding: 10px;
  }

  
</style>
<div class="container">
  <div id="J_Layout"></div>
</div>
  <?php $url = 'bui/layout/columns'?>
  <?php include("./templates/script.php"); ?>
  <script type="text/javascript" src="../src/layout/item/base.js"></script>
  <script type="text/javascript" src="../src/layout/abstract.js"></script>
  <script type="text/javascript" src="../src/layout/columns.js"></script>
  <script type="text/javascript" src="specs/layout-columns-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>   