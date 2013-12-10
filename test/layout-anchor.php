<?php  $title='锚定布局' ?>
<?php include("./templates/header.php"); ?>
<style>
	.x-layout-item{
    border : 1px solid #ddd;
  }

  .layout-test{
    border: 1px solid red;
    padding: 10px;
  }
</style>
<div class="container">
  <div id="J_Layout"></div>
</div>
  <?php $url = 'bui/layout/anchor'?>
  <?php include("./templates/script.php"); ?>
  <script type="text/javascript" src="../src/layout/item/base.js"></script>
  <script type="text/javascript" src="../src/layout/item/anchor.js"></script>
  <script type="text/javascript" src="../src/layout/abstract.js"></script>
  <script type="text/javascript" src="../src/layout/anchor.js"></script>
  <script type="text/javascript" src="specs/layout-anchor-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>   