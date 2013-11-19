<?php  $title='列表测试' ?>
<?php include("./templates/header.php"); ?>
  <style>
      .column-3{
        height: 200px;
        width:200px;
      }
      .column-3 .bui-list-item{
        float: left;
        width: 50px;
      }
  </style>
  <div class="container">
    <div class="row">
      <div class="span8">
        <h2>简单列表</h2>
        <div class="panel panel-head-borded">
          <div class="panel-header">列表</div>
          <div id="list1"></div>
        </div>
        

        <h2>选择列表</h2>
        <div id="lp" style="height:200px;position:relative">
        </div>
      </div>
      <div class="span8">
        <h2>扩展列表</h2>
        <div id="listCheck"></div>
      </div>

    </div>
    <div class="row">
      <div class="span8">
        <h2>列表,设置数据</h2>
        <div id="list2">
          <input type="hidden" id="hide" value="a" name="hide"/>
        </div>
      </div>
      <div class="span8">
        <h2>列表，使用store</h2>
        <div id="list3"></div>
      </div>
      <div class="span8">
        <h2>列表选择框</h2>
        <button class="button" id="clear">清理</button>
        <div id="lb1"></div>
      </div>
    </div>
    <div class="row">
      <div class="span8">
        <h2>测试禁用</h2>
        <div id="l4"></div>
      </div>
      <div class="span8">
        <h2>测试自定义状态</h2>
        <div id="l5"></div>
      </div>
    </div>
    <div class="row">
      <div id="l6" class="span8"></div>
      <div  id="l7"  class="span8"></div>
      <div id="l8" class="span8"></div>
    </div>
    <div class="row">
      <div id="ls1" class="span8"></div>
      <div  id="ls2"  class="span8"></div>
      <div id="ls3" class="span8"></div>
    </div>
  </div>
    <?php $url = 'bui/list'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/list/domlist.js"></script>
    <script type="text/javascript" src="../src/list/keynav.js"></script>
    <script type="text/javascript" src="../src/list/sortable.js"></script>
    <script type="text/javascript" src="../src/list/simplelist.js"></script>
    <script type="text/javascript" src="../src/list/listitem.js"></script>
    <script type="text/javascript" src="../src/list/list.js"></script>
    <script type="text/javascript" src="../src/list/listbox.js"></script>
    <script type="text/javascript" src="../src/list/base.js"></script>
   <script type="text/javascript" src="specs/list-spec.js"></script>
    <script type="text/javascript" src="specs/list-nav-spec.js"></script>
    <script type="text/javascript" src="specs/list-status-spec.js"></script>
    <script type="text/javascript" src="specs/list-loader-spec.js"></script>

    <script type="text/javascript" src="specs/list-sort-spec.js"></script> <!---->
 <?php include("./templates/footer.php"); ?>   