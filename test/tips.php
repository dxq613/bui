<?php  $title='tooltip 测试' ?>
<style>
  
  #t1{
    border:1px solid red;
  }
  .custom{
    background-color: #fff;
    border:1px solid #ddd;
    padding:10px;
    word-wrap: break-word;
  }
  
</style>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div class="span16">
        <div id="t1">提示信息</div>
        <p> 
          <code title="基于bootstrap的css样式" data-align="left">assets</code>css文件，基于bootstrap的css样式，可以自己在此基础上编译出新的版本
          <code title="js 和 css文件打包好的目录" data-align="top">build</code> : js 和 css文件打包好的目录
          <code title="js 的源文件" data-align="bottom">src</code>: js 的源文件
          <code data-title="测试" data-align="right"> test</code>: 单元测试，所有控件的单元测试都在内部，以php的方式提供
          <code title="工具">tools</code> : 文件打包，以及生成文件的工具
          <code title="{title:'源文件显示'}" data-align="top-left">docs</code> ： 源文件中未提供，但是可以自己执行 <code data-align="bottom-right" title="tools/jsduck/run.bat">tools/jsduck/run.bat</code>文件，请不要提交此文件夹
        </p>

      </div>
      <div class="span16">
        <a href="#" id="t2">显示表格</a>
        <a href="#" id="t3">显示表格</a>
      </div>
    </div>
  </div>
  <div id="tip" class="custom" style="visibility:hidden">
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>姓名</th>
          <th>别名</th>
          <th>Username</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>张三</td>
          <td>张某某</td>
          <td>@mdo</td>
        </tr>
        <tr>
          <td>2</td>
          <td>李四</td>
          <td>李证明</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td>王五</td>
          <td>王明</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </table>
  </div>
    <?php $url = 'bui/tooltip'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/tooltip/tip.js"></script>
    <script type="text/javascript" src="../src/tooltip/tips.js"></script>
    <script type="text/javascript" src="../src/tooltip/base.js"></script>
    <script type="text/javascript" src="specs/tooltip-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>