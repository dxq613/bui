<?php  $title='文件上传测试' ?>
<?php include("./templates/header.php"); ?>

<link rel="stylesheet" href="http://g.tbcdn.cn/fi/bui/css/dpl-min.css"/>
<link rel="stylesheet" href="../src/uploader/css/style.css"/>


  <div class="container">
    <div class="row">
      <div class="span24" id="J_Uploader"></div>
      <div class="span24" id="J_UploaderQueue"></div>
    </div>
  </div>
  
    <?php $url = 'bui/uploader'?>
    <?php include("./templates/script.php"); ?>
    <script src="../src/swf/src/swf.js"></script>
    <script src="../src/swf/src/swf/ua.js"></script>

    <script src="../src/uploader/base.js"></script>
    <script src="../src/uploader/uploader.js"></script>
    <script src="../src/uploader/queue.js"></script>
    <script src="../src/uploader/button/base.js"></script>
    <script src="../src/uploader/button/htmlButton.js"></script>
    <script src="../src/uploader/button/swfButton.js"></script>
    <script src="../src/uploader/type/base.js"></script>
    <script src="../src/uploader/type/ajax.js"></script>
    <!-- // <script src="../src/uploader/type/iframe.js"></script> -->
    <script src="../src/uploader/type/flash.js"></script>
    <script src="../src/uploader/type/flash.js"></script>
    <script src="../src/uploader/plugins/ajbridge/ajbridge.js"></script>

    <script type="text/javascript" src="specs/uploader-spec.js"></script>

<?php include("./templates/footer.php"); ?>
