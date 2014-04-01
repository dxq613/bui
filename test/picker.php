<?php  $title='选择器测试' ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div class="span8">
        <div id="l1"></div>
      </div>
       <div class="span8">
        <h2>一般选择器</h2>
        <input type="text" id="c1" />
        <input type="text" id="r2" />
      </div>
    </div>
    <div class="row">
      <div class="span8">
        <div id="lp"></div>
      </div>
      <div class="span8">
        <div id="l4">
          <input type="text" id="c3" class="a-picker" />
          <input type="text" id="c4" class="a-picker"/>
        </div>
      </div>
    </div>
  </div>
  
  <?php $url = 'bui/picker'?>
  <?php include("./templates/script.php"); ?>
  <script type="text/javascript" src="../src/picker/mixin.js"></script>
  <script type="text/javascript" src="../src/picker/picker.js"></script>
  <script type="text/javascript" src="../src/picker/listpicker.js"></script>
  <script type="text/javascript" src="../src/picker/base.js"></script>
  <script type="text/javascript" src="specs/picker-spec.js"></script>

<?php include("./templates/footer.php"); ?>
