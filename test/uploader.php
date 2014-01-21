<?php  $title='文件上传测试' ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div class="span12">
        <div id="J_HtmlButton"></div>
      </div>
      <div class="span12">
        <div id="J_SwfButton"></div>
      </div>
    </div>
    <div class="row">
      <div class="span8">
        <div id="J_Uploader"></div>
        <div id="J_UploaderQueue"></div>
      </div>
      <div class="span8">
        <div id="J_UploaderFlash"></div>
        <div id="J_UploaderQueueFlash"></div>
      </div>
      <div class="span8">
        <div id="J_UploaderIframe"></div>
      </div>
    </div>

  </div>
  
    <?php $url = 'bui/uploader'?>
    <?php include("./templates/script.php"); ?>
    <script src="../src/swf/src/swf.js"></script>
    <script src="../src/swf/src/swf/ua.js"></script>
    <script src="../src/uploader/base.js"></script>
    <script src="../src/uploader/uploader.js"></script>
    <script src="../src/uploader/factory.js"></script>
    <script src="../src/uploader/queue.js"></script>
    <script src="../src/uploader/theme.js"></script>
    <script src="../src/uploader/validator.js"></script>
    <script src="../src/uploader/button/filter.js"></script>
    <script src="../src/uploader/button/base.js"></script>
    <script src="../src/uploader/button/htmlButton.js"></script>
    <script src="../src/uploader/button/swfButton.js"></script>
    <script src="../src/uploader/type/base.js"></script>
    <script src="../src/uploader/type/ajax.js"></script>
    <script src="../src/uploader/type/iframe.js"></script>
    <script src="../src/uploader/type/flash.js"></script>
    <script src="../src/uploader/type/flash.js"></script>
    <script src="../src/uploader/button/ajbridge.js"></script>

    <script type="text/javascript" src="specs/uploader-spec.js"></script>
    <script>
    BUI.use('bui/uploader/factory');
    </script>
  
<?php include("./templates/footer.php"); ?>
