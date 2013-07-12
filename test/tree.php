<?php $title="测试Tree"; ?>
<?php include("./templates/header.php"); ?>
<style>
  
  .bui-tree-list{
    border: 1px solid #ddd;

  }

  .bui-tree-item{
    height: 20px;
  }
  .bui-tree-item-hover{
    background-color:  #eee;
  }
  .bui-tree-item-selected{
    background-color: #dfe8f6;
  }

  .bui-tree-item-disabled{
    color: #ccc;
  }
  
  .x-tree-icon{
    display: inline-block;
    vertical-align: top;
    height: 20px;
    width: 16px;
  }
  .x-tree-elbow-expander{
    background: url('http://localhost/extjs/resources/themes/images/default/tree/arrows.gif') no-repeat -999px -999px transparent;
    background-position:  0 0;
  }

  .bui-tree-item-expanded .x-tree-elbow-expander{
    background-position:  -16px 0;
  }
  .x-tree-elbow-expander:hover{
    background-position:  -32px 0;
  }
  .bui-tree-item-expanded .x-tree-elbow-expander:hover{
    background-position:  -48px 0;
  }

  .x-tree-elbow-dir{
    margin: 2px 3px 0 0;
    background: url('http://localhost/extjs/examples/shared/icons/fam/folder_go.gif') no-repeat 0 0 transparent;
    
  }
  .x-tree-elbow-leaf{
    margin: 2px 3px 0 0;
    background: url('http://localhost/extjs/examples/shared/icons/fam/cog.gif') no-repeat 0 0 transparent;
  }

  .x-tree-show-line .x-tree-elbow{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/elbow.gif');
    background-position:  0 0;
  }
  .x-tree-show-line .x-tree-elbow-end{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/elbow-end.gif');
    background-position:  0 0;
  }

  .x-tree-show-line .x-tree-elbow-line{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/elbow-line.gif');
    background-position:  0 0;
  }

  .x-tree-show-line .x-tree-elbow-expander{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/elbow-plus.gif');
    background-position:  0 0;
  }

  .x-tree-show-line .x-tree-elbow-expander-end{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/elbow-end-plus.gif');
    background-position:  0 0;
  }

  .x-tree-show-line .x-tree-elbow-expander:hover{
    background-position:  0 0;
  }

  .x-tree-show-line .bui-tree-item-expanded .x-tree-elbow-expander{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/elbow-minus.gif');
    background-position:  0 0;
  }
  .x-tree-show-line .bui-tree-item-expanded .x-tree-elbow-expander-end{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/elbow-end-minus.gif');
    background-position:  0 0;
  }

  .x-tree-show-line .bui-tree-item-loading .x-tree-elbow-expander{
    background-image: url('http://localhost/extjs/resources/themes/images/default/tree/loading.gif');
    background-position:  0 0;
  }

  .x-tree-icon-checkbox{
    background: url('http://localhost/bui/assets/img/checkbox.gif') no-repeat 0 0 transparent;
  }

  .bui-tree-item-checked{
    font-style: italic;
  }
  .bui-tree-item-checked .x-tree-icon-checkbox{
    background-position: 0 -20px;

  }


  .bui-tree-item-partial-checked .x-tree-icon-checkbox{
    background-position: 0 -40px;
  }

  .bui-tree-item-disabled .x-tree-icon-checkbox{
    background-position: -48px 0;
  }

  .bui-tree-item-disabled.bui-tree-item-checked .x-tree-icon-checkbox{
    background-position: -48px -20px;
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
    </div>

    <div class="row">
      <div class="span8" id="t3">
        <h2>可勾选的树</h2>
      </div>
      <div class="span8" id="t4">
        <h2>store 增删改树节点</h2>
      </div>
      <div class="span8" id="t31">
        <h2>勾选树的增删改</h2>
      </div>
      
    </div>

    <div class="row">
      <div class="span8" id="t5">
        <h2>异步加载树</h2>
      </div>
    </div>
  </div>
    
    <?php $url = 'bui/tree/treelist'?>
    <?php include("./templates/script.php"); ?>

    <script type="text/javascript" src="../src/tree/treemixin.js"></script>
    <script type="text/javascript" src="../src/tree/treelist.js"></script>
   <!-- <script type="text/javascript" src="specs/tree-base-spec.js"></script>-->
    <script type="text/javascript" src="specs/tree-check-spec.js"></script>
   <!-- <script type="text/javascript" src="specs/tree-store-spec.js"></script>-->

<?php include("./templates/footer.php"); ?>