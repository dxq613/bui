<?php  $base='../' ?>
<?php  $title='图片视图测试' ?>
<?php include("../templates/header.php"); ?>

  <style>
    html{
      overflow-y: scroll;
    }
    .controls-wrap a{
      width: 80px;
      display: inline-block;
    }
  </style>
  <div class="container">
    <div class="controls-wrap">
      <a href="#" class="chgImg1">换第一张图</a>
      <a href="#" class="chgImg2">换第二张图</a>
      <br>
      <a href="#" class="resize1">resize恢复</a>
      <a href="#" class="resize2">resize一半</a>
      <br>
      <a href="#" class="drag1">禁用drag</a>
      <a href="#" class="drag2">开启drag</a>
      <a href="#" class="dragToggle">dragToggle</a>
      <br>
      <a href="#" class="reset">重置</a>
      <a href="#" class="resume">原始大小</a>
      <a href="#" class="fit">适合大小</a>
      <a href="#" class="zoom">放大</a>
      <a href="#" class="micrify">缩小</a>
      <a href="#" class="leftHand">左旋</a>
      <a href="#" class="rightHand">右旋</a>
      <a href="#" class="viewImg">查看原图</a>
    </div>
    <div id="img-preview-wrap" style="background-color:#666;width:900px;height:600px;"></div>
  </div>

  <?php $url = 'bui/toolbar'?>
  <?php include("../templates/script.php"); ?>

  <script type="text/javascript" src="../../src/graphic/raphael/eve.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/core.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/svg.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/vml.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael/group.js"></script>
  <script type="text/javascript" src="../../src/graphic/raphael.js"></script>

  <script type="text/javascript" src="../../src/graphic/util.js"></script>
  <script type="text/javascript" src="../../src/graphic/base.js"></script>
  <script type="text/javascript" src="../../src/graphic/canvasitem.js"></script>
  <script type="text/javascript" src="../../src/graphic/shape.js"></script>
  <script type="text/javascript" src="../../src/graphic/container.js"></script>
  <script type="text/javascript" src="../../src/graphic/group.js"></script>
  <script type="text/javascript" src="../../src/graphic/canvas.js"></script>


  <script type="text/javascript" src="../../src/imgview/base.js"></script>
  <script type="text/javascript" src="../../src/imgview/imgview.js"></script>
  <script type="text/javascript" src="../../src/imgview/previewlist.js"></script>
  <script type="text/javascript" src="../../src/imgview/viewcontent.js"></script>

  <script type="text/javascript" src="../specs/imgview/viewcontent-spec.js"></script>

<?php include("../templates/footer.php"); ?>
