<?php  $title='绝对定位布局' ?>
<?php include("./templates/header.php"); ?>
<style>
	.layout-test{
		border : 1px solid red;
	}
	.north,.east,.weast,.south,.center{
		border : 1px solid #ddd;
	}
  .x-layout-item-absolute{
    position: absolute;
  }

  .x-layout-relative{
    position: relative;
  }
</style>
<div class="container">
  <div id="J_Layout"></div>
</div>
  <?php $url = 'bui/layout/absolute'?>
  <?php include("./templates/script.php"); ?>
  <script type="text/javascript" src="../src/layout/item/base.js"></script>
  <script type="text/javascript" src="../src/layout/item/absolute.js"></script>
  <script type="text/javascript" src="../src/layout/abstract.js"></script>
  <script type="text/javascript" src="../src/layout/absolute.js"></script>
  <script type="text/javascript" src="specs/layout-absolute-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>   