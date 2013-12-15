<?php $title="测试TreeMenu"; ?>
<?php include("./templates/header.php"); ?>
<style>
  .test-menu .x-tree-elbow-expander{
    display:inline-block;
    width: 16px;
    height: 10px;
   background: url("http://bits.wikimedia.org/static-1.22wmf14/extensions/Vector/modules/images/closed-ltr.png") left center no-repeat;
  }

  .test-menu .bui-tree-item-expanded .x-tree-elbow-expander{
    display:inline-block;
    width: 16px;
    height: 10px;
   background: url("http://bits.wikimedia.org/static-1.22wmf14/extensions/Vector/modules/images/open.png") left center no-repeat;
  }
  .test-menu .x-tree-elbow-empty{
    display:inline-block;
    width: 8px;
    height: 10px;
  }

  .bui-tree-menu .bui-menu-title s{
    background-position:0 -30px;
  }

   .bui-tree-menu .bui-menu-item-expanded .bui-menu-title s{
    background-position:0 -71px;
  }
</style>
  <div class="container">
    <div class="row">
      <div class="span8" id="t1">
        <h2>一般树型菜单</h2>
      </div>
      <div class="span8" id="t2">
        <h2>左侧菜单</h2>
      </div>
      <div class="span8" id="t4">
        <h2>模拟任意菜单</h2>
      </div>
    </div>

  </div>
    
    <?php $url = 'bui/tree/treemenu'?>
    <?php include("./templates/script.php"); ?>

  <script type="text/javascript" src="../src/tree/treemixin.js"></script>
  <script type="text/javascript" src="../src/tree/selection.js"></script>
  <script type="text/javascript" src="../src/tree/treemenu.js"></script>
  <script type="text/javascript" src="specs/tree-menu-spec.js"></script>
<?php include("./templates/footer.php"); ?>