<?php  $title='表单验证规则' ?>
<?php include("./templates/header.php"); ?>
  <style>

      .bui-form-field-error input[type="text"]{
         border : 1px dotted red;
      }

  </style>
  <div class="container">
    
  </div>
    <?php $url = 'bui/common,bui/form/rules'?>
    <?php include("./templates/script.php"); ?>

    <script type="text/javascript" src="../src/form/rule.js"></script>
    <script type="text/javascript" src="../src/form/rules.js"></script>

    <script type="text/javascript" src="specs/form-rules-spec.js"></script>
    <!---->
    
<?php include("./templates/footer.php"); ?>