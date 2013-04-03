<?php  $title='基础测试' ?>
<?php include("./templates/header.php"); ?>
		<div id="c1"></div>
    <div id="c2"></div>
    <div id="c3"></div>
    

    <div id="c4">这是一个封装的控件</div>
    <div id="c5" name="t1",title="测试封装控件" data-value="test">
      <a href="#">这是复杂的封装控件</a>
    </div>
    <ol id="c6">
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </ol>
    <div id="t1">
      
    </div>
    <?php $url = 'bui/common'?>
    <?php include("./templates/script.php"); ?>
   
    <script type="text/javascript" src="specs/util-spec.js"></script>
 
    <!-- <script type="text/javascript" src="specs/tpl-spec.js"></script> -->
<?php include("./templates/footer.php"); ?>
