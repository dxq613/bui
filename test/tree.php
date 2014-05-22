<?php $title="测试Tree"; ?>
<?php include("./templates/header.php"); ?>
  <style>
    .bui-tree-height{
      overflow: auto;
    }
    .icon-pkg,.icon-example,.task,.task-folder{
      background: url('http://img04.taobaocdn.com/tps/i4/T12.xMFiNXXXanXMzg-20-680.gif') no-repeat -999px -999px;
    }

    .icon-pkg{
      background-position: 0 0;
    }

    .icon-example{
      background-position: 0 -440px;
    }
    .bui-tree-item .task-folder{
      background-position: 0 -200px;
    }

    .bui-tree-item .task{
      background-position: 0 -640px;
    }


  </style>
  <div class="container">
    <div class="row">
      <div class="span8" id="t1">
        <h2>一般树</h2>
      </div>
      <div class="span8" id="t2">
        <h2>带有连接线的树</h2>
      </div>
      <div class="span8" id="t4">
        <h2>store 增删改树节点</h2>
      </div>
    </div>

    <div class="row">
      <div class="span8" id="t3">
        <h2>可勾选的树</h2>
      </div>
      
      <div class="span8" id="t31">
        <h2>勾选树的增删改</h2>
      </div>
      <div class="span8" id="t32">
        <h2>勾选方式</h2>
      </div>
    </div>

    <div class="row">
      <div class="span8" id="t5">
        <h2>异步加载树</h2>
      </div>
      <div class="span8" id="t6">
        <h2>自定义图标</h2>
      </div>
      <div class="span8" id="t7">
        <h2>使用 pid</h2>
      </div>
    </div>

    <div class="row">
      <div class="span8" id="t8">
        <h2>手风琴式展开</h2>
        
      </div>
      <div class="span8" id="t9">
        <h2>单选</h2>
        
      </div>
    </div>

  </div>
    
    <?php $url = 'bui/tree/treelist'?>
    <?php include("./templates/script.php"); ?>

  <script type="text/javascript" src="../src/tree/treemixin.js"></script>
  <script type="text/javascript" src="../src/tree/selection.js"></script>
  <script type="text/javascript" src="../src/tree/treelist.js"></script>
 <script type="text/javascript" src="specs/tree-base-spec.js"></script><!-- -->
  <script type="text/javascript" src="specs/tree-check-spec.js"></script>   
  <script type="text/javascript" src="specs/tree-radio-spec.js"></script> 
 <script type="text/javascript" src="specs/tree-store-spec.js"></script>
  <script type="text/javascript" src="specs/tree-icon-spec.js"></script><!--  -->
<?php include("./templates/footer.php"); ?>