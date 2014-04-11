<?php  $title='菜单测试';$css="menu"; ?>
<?php include("./templates/header.php"); ?>
  <style>
   .bui-side-menu  .bui-menu-item-collapsed .bui-menu{
      height: 0;
      display: block;
      -webkit-transform: translate(0,-100%);
      -webkit-transition: all 2s;
    }
  </style>
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
      <div class="row">
        <ul id="m15" class="span6 test-menu">
          <li><span class="title">1 <i class="icon icon-arrow-down"></i></span>
            <ul>
              <li>11</li>
              <li>22</li>
              <li>33</li>
              <li>44</li>
            </ul>
          </li>
          <li><span class="title">2</span>
          <ul>
              <li>211</li>
              <li>2222</li>
              <li>33</li>
              <li>244</li>
            </ul>
          </li>
          <li><span class="title">3</span>
            <ul>
              <li>311</li>
              <li>322</li>
              <li>333</li>
              <li>344</li>
            </ul>
          </li>
          <li><span class="title">4</span>
            <ul>
              <li>411</li>
              <li>422</li>
              <li>433</li>
              <li>444</li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="row">
        <ul id="m20" class="span6">
          <li>1
            <ul class="invisible">
              <li>11</li>
              <li>22</li>
              <li>33</li>
              <li>44</li>
            </ul>
          </li>
          <li>2</li>
          <li>3</li>
          <li>4</li>
        </ul>
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