<?php  $title='表单字段测试' ?>
<?php include("./templates/header.php"); ?>
  <style>

  </style>
  <div class="container">
    <h2>生成表单</h2>
    <form class="form-horizontal">
      <div id="row" class="row">
        
      </div>
      <div id="row1" class="row">
        
      </div>
    </form>
  </div>
    <?php $url = 'bui/form/basefield'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/form/tips.js"></script>
    <script type="text/javascript" src="../src/form/rule.js"></script>
    <script type="text/javascript" src="../src/form/rules.js"></script>
    <script type="text/javascript" src="../src/form/remote.js"></script>
    <script type="text/javascript" src="../src/form/valid.js"></script>
    <script type="text/javascript" src="../src/form/field/base.js"></script>

    <script type="text/javascript" src="specs/form-remote-spec.js"></script>
<?php include("./templates/footer.php"); ?>