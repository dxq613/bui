<?php  $title='tooltip 测试' ?>
<style>
  
  #t1{
    border:1px solid red;
  }

  
</style>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div id="t1">提示信息</div>
      <p> 
<code title="基于bootstrap的css样式" data-align="left">assets</code>css文件，基于bootstrap的css样式，可以自己在此基础上编译出新的版本
<code title="js 和 css文件打包好的目录" data-align="top">build</code> : js 和 css文件打包好的目录
<code title="js 的源文件" data-align="bottom">src</code>: js 的源文件
<code data-title="测试" data-align="right"> test</code>: 单元测试，所有控件的单元测试都在内部，以php的方式提供
<code title="工具">tools</code> : 文件打包，以及生成文件的工具
<code title="源文件中文档" data-align="top-left">docs</code> ： 源文件中未提供，但是可以自己执行 <code data-align="bottom-right" title="tools/jsduck/run.bat">tools/jsduck/run.bat</code>文件，请不要提交此文件夹
      </p>
    </div>
  </div>
  
    <?php $url = 'bui/tooltip'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/tooltip/tip.js"></script>
    <script type="text/javascript" src="../src/tooltip/tips.js"></script>
    <script type="text/javascript" src="../src/tooltip/base.js"></script>
    <script type="text/javascript" src="specs/tooltip-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>