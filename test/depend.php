<?php  $title='控件依赖测试' ?>
<?php include("./templates/header.php"); ?>
  <div class="row">
    <div id="c1" class="well span8">控件测试一</div>
    <div id="c2" class="well span8">控件测试二,点击显示控件三</div>
    <div id="c3" class="well span8">控件测试三</div>
  </div>
    
    <button id="btn1" class="button">隐藏</button>
    <button id="btn2" class="button">显示</button>
    <button id="btn3" class="button">切换</button>
    <button id="btn4" class="button">禁用</button>
    <?php $url = 'bui/common'?>
    <?php include("./templates/script.php"); ?>
    
    <script type="text/javascript" src="specs/depend-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>
