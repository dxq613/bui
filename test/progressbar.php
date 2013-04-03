<?php  $title='测试' ?>
<?php include("./templates/header.php"); ?>

    <div class="container">
      <div class="row">
        <div class="span8">
          <h2>进度条</h2>
          <div id="progressbar">

          </div>
        </div>
        <div class="span8">
          <h2>多值进度条</h2>
          <div id="progressbar1">

          </div>
        </div>
         <div class="span8">
          <h2>加载进度条</h2>
          <div id="progressbar3">

          </div>
        </div>
      </div>
    </div>
  <?php $url = 'bui/progressbar/load'?>
  <?php include("./templates/script.php"); ?>

     <script type="text/javascript" src="../src/progressbar/progressbar.js"></script>
     <script type="text/javascript" src="../src/progressbar/loadprogressbar.js"></script>
      <script type="text/javascript" src="specs/progress-bar-spec.js"></script>
<?php include("./templates/footer.php"); ?>