<?php $title="测试Tree 选中"; ?>
<?php include("./templates/header.php"); ?>
  <div class="container">
    <div class="row">
      <div class="span8" id="t1">
        <h2>单选</h2>
      </div>
      <div class="span8" id="t2">
        <h2>多选</h2>
      </div>
      <div class="span8" id="t3">
        <h2>异步单选</h2>
      </div>
    </div>

    <div class="row">
      <div class="span8" id="t4">
        <h2>异步多选</h2>
      </div>
    </div>

  </div>
    
    <?php $url = 'bui/tree/treelist'?>
    <?php include("./templates/script.php"); ?>

  <script type="text/javascript" src="../src/tree/treemixin.js"></script>
  <script type="text/javascript" src="../src/tree/treelist.js"></script>
<script type="text/javascript" src="specs/tree-base-spec.js"></script>
  <script type="text/javascript" src="specs/tree-check-spec.js"></script>   <!--  -->
  <script type="text/javascript" src="specs/tree-radio-spec.js"></script> 
  <script type="text/javascript" src="specs/tree-store-spec.js"></script>
  <script type="text/javascript" src="specs/tree-icon-spec.js"></script> <!---->
<?php include("./templates/footer.php"); ?>