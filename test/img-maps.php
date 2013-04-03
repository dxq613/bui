<?php  $title='测试' ?>
<?php include("./templates/header.php"); ?>
<style>
#J_ImgMaps, #J_Map{
  width: 200px;
  height: 200px;
  background-color:#eee; 
  margin-bottom: 20px;
}
.bui-img-maps,.img-maps-inner{
  height: 100%;
  width: 100%;
  position: relative;
  cursor: crosshair;
}
.bui-map-item{
  border : 1px dotted #333;
  font-weight: bold;
  position: absolute;
  cursor : default;
  height: 30px;
  width: 50px;
  background-color: #999;
}
.bui-map-item .bui-map-item-close{
  position: absolute;
  right: 0;
  top: 0;
}
.bui-map-item-resize{
  width: 10px;
  height: 10px;
  position: absolute;
  bottom:0;
  right: 0;
  cursor: nw-resize;
  background-color: #000;
}
.resize{
  position: absolute;
  right: 0;
  bottom:0;
  cursor: se-resize;
  z-index: 99;
}
.bui-maps-item-close{
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9;
}
</style>
    <div class="container">
      <div class="row">
        <div class="span8">
          <h2>图片热区</h2>
          <div id="J_ImgMaps">

          </div>
          <div id="J_Map"></div>
        </div>
      </div>
    </div>
  <?php $url = 'bui/imgmaps/resize'?>
  <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/imgmaps/resize.js"></script>
     <script type="text/javascript" src="../src/imgmaps/map.js"></script>
     <script type="text/javascript" src="../src/imgmaps/img-maps.js"></script>
     
      <script type="text/javascript" src="specs/img-maps-spec.js"></script>
<?php include("./templates/footer.php"); ?>