<?php  $title='切换标签页测试';$css='tab'; ?>
<?php include("./templates/header.php"); ?>

    <div class="container">
      <div class="row">
        <div class="span8">
          <div id="p1"></div>
        </div>
        <div class="span16">
          <h2>tabPanel</h2>
          <div id="p2">
            <ul>
              <li class="bui-tab-panel-item active">标签一</li>
              <li class="bui-tab-panel-item">标签二</li>
              <li class="bui-tab-panel-item">标签三</li>
            </ul>
          </div>
          <div id="tc" class="bordered">
            <p id="p1">第一个</p>
            <p id="p2">第二个</p>
            <p id="p3">第三个</p>
          </div>
          
        </div>
      </div>
      <div id="p3"></div>
    </div>
    
    <?php $url = 'bui/tab'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/tab/tabitem.js"></script>
    <script type="text/javascript" src="../src/tab/tab.js"></script>
    <script type="text/javascript" src="../src/tab/panels.js"></script>
    <script type="text/javascript" src="../src/tab/panelitem.js"></script>
    <script type="text/javascript" src="../src/tab/navtabitem.js"></script>
    <script type="text/javascript" src="../src/tab/navtab.js"></script>
    <script type="text/javascript" src="../src/tab/tabpanelitem.js"></script>
    <script type="text/javascript" src="../src/tab/tabpanel.js"></script>
    <script type="text/javascript" src="../src/tab/base.js"></script>
    <script type="text/javascript" src="specs/tab-panel-spec.js"></script>

<?php include("./templates/footer.php"); ?>