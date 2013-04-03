<?php  $title='简单表格测试' ?>
<?php include("./templates/header.php"); ?>

    <div class="container">
      <div id="J_Grid"></div>
    </div>
    <div id="J_Header"></div>

    <?php $url = 'bui/grid/simplegrid'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/grid/simplegrid.js"></script>
    <script type="text/javascript" src="specs/simple-grid-spec.js"></script><!---->

<?php include("./templates/footer.php"); ?>    