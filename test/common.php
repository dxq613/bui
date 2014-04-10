<?php  $title='基础测试' ?>
<?php include("./templates/header.php"); ?>
<div class="container">
  <div class="row">
		<div class="span8" id="c1"></div>
    <div class="span8" id="c2"></div>
    <div class="span8" id="c3"></div>
  </div>  
  <div class="row">
    <div class="span8" id="c4">这是一个封装的控件</div>
    <div class="span8" id="c5" name="t1" title="测试封装控件" data-value="test">
      <a href="#">这是复杂的封装控件</a>
    </div>
    <ol class="span8" id="c6">
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
    </ol>

  </div>
  <div class="row">
    <div class="span8" id="c7" data-bl-true="true" data-bl-false="false" data-num-a="123" data-num-b="a234" data-value="test">
      <a href="#">这是复杂的封装控件</a>
    </div>
  </div>
  <div class="row">
    <div class="span8" id="t1">
      
    </div>
    <div class="span8" id="l1">
      
    </div>
    <div data-loader="{url : 'data/text.json'}" class="span8" id="l2">
      
    </div>
  </div>

  <div class="row">
    <div id="l3" class="span8"></div>
    <div id="l4" class="span8"></div>
    <div id="l5" class="span8"></div>
  </div>
    
</div>
    <?php $url = 'bui/common'?>
    <?php include("./templates/script.php"); ?>
   
   <script type="text/javascript" src="specs/util-spec.js"></script>
   
     <!-- <script type="text/javascript" src="specs/tpl-spec.js"></script> -->
     <script type="text/javascript" src="specs/common-loader-spec.js"></script>
<?php include("./templates/footer.php"); ?>
