<?php  $title='切换标签页测试';$css='tab'; ?>
<?php include("./templates/header.php"); ?>

    <div class="container">
      <div class="row">
        <div class="span8">
          <div id="t1"></div>
          <div id="container" style="height:100px;width:100px"></div>
          <button id="btnAdd" class="button">添加</button>
        </div>
        <div class="span16">
          <div id="tab"></div>
          <h2>tabPanel</h2>
          <div id="tp"></div>
          <div id="tc" class="bordered">
            <p id="p1">第一个</p>
            <p id="p2">第二个</p>
            <p id="p3">第三个</p>
          </div>
          
        </div>
      </div>
      <div id="t2"></div>
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
		<script type="text/javascript" src="specs/tab-spec.js"></script>

<?php include("./templates/footer.php"); ?>