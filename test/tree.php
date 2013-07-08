<?php $title="测试Tree"; ?>
<?php include("./templates/header.php"); ?>
<style>
  
  .bui-tree-list{
    border: 1px solid #ddd;
    padding:10px;
  }
  .bui-tree-item-hover{
    background-color:  #eee;
  }
  .bui-tree-item-selected{
    background-color: #dfe8f6;
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

</style>
  <div class="container">
    <div class="row">
      <div class="span8" id="t1"></div>
    </div>
  </div>
    
    <?php $url = 'bui/tree/treelist'?>
    <?php include("./templates/script.php"); ?>

    <script type="text/javascript" src="../src/tree/treemixin.js"></script>
    <script type="text/javascript" src="../src/tree/treelist.js"></script>
    <script type="text/javascript" src="specs/tree-base-spec.js"></script>
    <script type="text/javascript" src="specs/tree-store-spec.js"></script>

<?php include("./templates/footer.php"); ?>