<?php  $title='菜单测试';$css="menu"; ?>
<?php include("./templates/header.php"); ?>

    <div class="container">
      <div id="m1"></div>
      <div id="m2"></div>
      <div class="well" id="content" style="width:200px;height:200px;" ></div>
      <div class="row" style="height:200px;">
        <div class="span8"><button id="btn" class="ks-button">下拉菜单</button><button id="btn1" class="ks-button">外部按钮</button></div>
        <div class="span8"><a id="link" href="#">悬浮下拉</a></div>
      </div>
      <div id="J_Category" class="category">
        <h2 class="categoryHd">
          <a>所有商品分类</a><s class="j_ExpandCat expandCat selectedCat" title="扩展视图" style="display: inline; "></s><s class="j_SimpleCat simpleCat" title="精简视图" style="display: inline; "></s>
        </h2>
        <div class="span8 ">
          <div id="bMenu" class="bs-docs-sidebar">
            
          </div>
        </div>
      </div>
    </div>
    <?php $url = 'bui/menu'?>
    <?php include("./templates/script.php"); ?>

    <script type="text/javascript" src="../src/menu/menuitem.js"></script>
		<script type="text/javascript" src="../src/menu/menu.js"></script>
    <script type="text/javascript" src="../src/menu/sidemenu.js"></script>
    <script type="text/javascript" src="../src/menu/popmenu.js"></script>
    <script type="text/javascript" src="../src/menu/contextmenu.js"></script>
    <script type="text/javascript" src="../src/menu/base.js"></script>
		<script type="text/javascript" src="specs/menu-spec.js"></script>
		
<?php include("./templates/footer.php"); ?>