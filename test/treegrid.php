<?php $title="测试TreeGrid"; ?>
<?php include("./templates/header.php"); ?>
  <div class="container">
    <div class="row">
      <div class="span8" id="t1">
        <h2>单选</h2>

      </div>
      <div class="span8" id="t2">
        <h2>多选</h2>
        
      </div>
    </div>

  </div>
    
    <?php $url = 'bui/extensions/treegrid'?>
    <?php include("./templates/script.php"); ?>

  <script type="text/javascript" src="../src/extensions/treegrid.js"></script>
  <script type="text/javascript" src="specs/tree-grid-spec.js"></script>
<?php include("./templates/footer.php"); ?>