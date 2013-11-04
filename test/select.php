<?php  $title='选择框测试';$css='select'; ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div class="span8">
        <h2>组合框</h2>
        <div id="c1"></div>
        <h2>suggest</h2>
        <div id="c2"></div>
        <h2>复杂suggest</h2>
        <div id="c3"></div>
        <h2>异步接口</h2>
        <div id="s5"><input id="v_s5" type="text" name="a" value="3"/></div>
      </div>
       <div class="span8">
        <h2>Select</h2>
        <div id="s1">
          <input type="hidden" id="hide" value="a" name="hide"/>
        </div>
        <h2>多选</h2>
         <div id="s2">
          <input type="hidden" id="hide1" value="a,b" name="hide1"/>
        </div>
      </div>
    </div>
  </div>
  
    <?php $url = 'bui/select'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/select/select.js"></script>
    <script type="text/javascript" src="../src/select/combox.js"></script>
    <script type="text/javascript" src="../src/select/suggest.js"></script>
    <script type="text/javascript" src="../src/select/base.js"></script>
    <script type="text/javascript" src="specs/select-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>