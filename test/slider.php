<?php  $title='列表测试';$css='slider'; ?>
<?php include("./templates/header.php"); ?>
  <style>
    /*.bui-slider{
      position: relative;
      height: 20px;
      border:1px solid #efefef;
    }

    .x-slider-back{
      background-color: red;
      height: 100%;
      width: 100%;
      position: absolute;
    }

    .x-slider-handle{
      display: inline-block;
      width: 20px;
      height: 20px;
      z-index: 1;
      background-color: #eee;
      border:1px solid #ddd;
      border-radius: 3px;
      position: absolute;
    }*/
  </style>
  <div class="container">
    <div class="row">
      <div id="s1" class="span8">
        
      </div>
      <div id="s2" class="span8">
        
      </div>
      <div id="s3" class="span8">
        
      </div>
    </div>
    <div class="row">
      <div id="s4" class="span8">
        
      </div>
      <div id="s5" class="span8">
        
      </div>
    </div>
  </div>
    <?php $url = 'bui/slider/slider'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/slider/slider.js"></script>
    
    <script type="text/javascript" src="specs/slider-spec.js"></script><!---->
 <?php include("./templates/footer.php"); ?>   