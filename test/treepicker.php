<?php $title="测试TreeMenu"; ?>
<?php include("./templates/header.php"); ?>
  <div class="container">
    <div class="row">
      <div class="span8" id="t1">
        <h2>单选</h2>
        <input type="text" id="J_T1">
        <input type="text" id="J_V1" value="22">
      </div>
      <div class="span8" id="t2">
        <h2>多选</h2>
        <input type="text" id="J_T2">
        <input type="text" id="J_V2" value="22">
      </div>
    </div>

  </div>
    
    <?php $url = 'bui/extensions/treepicker'?>
    <?php include("./templates/script.php"); ?>

  <script type="text/javascript" src="../src/extensions/treepicker.js"></script>
  <script type="text/javascript" src="specs/tree-picker-spec.js"></script>
<?php include("./templates/footer.php"); ?>