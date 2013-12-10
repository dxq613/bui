<?php  $title='窗口视图' ?>
<?php include("./templates/header.php"); ?>
<link rel="stylesheet" href="../assets/css/layout.css">
  <style>
    .test-view{
      background: #3892d3;
      padding:10px;
    }
  </style>
  <?php $url = 'bui/layout/viewport'?>
  <?php include("./templates/script.php"); ?>
  <script type="text/javascript" src="../src/layout/viewport.js"></script>
  <script type="text/javascript" src="../src/layout/item/base.js"></script>
  <script type="text/javascript" src="../src/layout/item/border.js"></script>
  <script type="text/javascript" src="../src/layout/abstract.js"></script>
  <script type="text/javascript" src="../src/layout/collapsable.js"></script>
  <script type="text/javascript" src="../src/layout/border.js"></script>
  <script type="text/javascript" src="specs/viewport-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>   