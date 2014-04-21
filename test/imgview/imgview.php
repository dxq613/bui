<?php  $base='../' ?>
<?php  $title='图片视图测试' ?>
<?php include("../templates/header.php"); ?>

  <style>
    html{
      overflow-y: hidden;
    }
    .controls-wrap a{
      width: 80px;
      display: inline-block;
    }
  </style>
  <link rel="stylesheet" href="../../assets/css/imgview.css">
  <div id="img-preview-wrap"></div>
  <div class="controls-wrap">
    <a href="#" class="chgList1">换第一组数据</a>
    <a href="#" class="chgList2">换第二组数据</a>
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

  <script type="text/javascript" src="../specs/imgview/imgview-spec.js"></script>

<?php include("../templates/footer.php"); ?>
