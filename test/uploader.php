<?php  $title='文件上传测试' ?>
<?php include("./templates/header.php"); ?>



  <div class="container">
    <div class="row">
      <div class="span24" id="J_Uploader"></div>
    </div>
  </div>
  
    <?php $url = 'bui/uploader'?>
    <?php include("./templates/script.php"); ?>
    <script src="../src/uploader/base.js"></script>
    <script src="../src/uploader/uploader.js"></script>

    <script type="text/javascript" src="specs/uploader-spec.js"></script>

<?php include("./templates/footer.php"); ?>
