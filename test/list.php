<?php  $title='列表测试' ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div class="span8">
        <h2>简单列表</h2>
        <div id="list1"></div>

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
  </div>
    <?php $url = 'bui/list'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/list/simplelist.js"></script>
    <script type="text/javascript" src="../src/list/listitem.js"></script>
    <script type="text/javascript" src="../src/list/list.js"></script>
    <script type="text/javascript" src="../src/list/listbox.js"></script>
    <script type="text/javascript" src="../src/list/listpicker.js"></script>
    <script type="text/javascript" src="../src/list/base.js"></script>
    <script type="text/javascript" src="specs/list-spec.js"></script><!---->
    <script type="text/javascript" src="specs/list-status-spec.js"></script>
 <?php include("./templates/footer.php"); ?>   