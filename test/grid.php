<?php  $title='表格测试';$css='grid'; ?>
<?php include("./templates/header.php"); ?>

<div class="container">
    <div id="J_Grid"></div>
    <hr>
    <div id="J_Grid1"></div>
    <hr>
    <div id="J_Grid2"></div>
    <hr>
    <div id="J_Grid4"></div>
    <hr>
</div>
    <?php $url = 'bui/grid/grid'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/grid/column.js"></script>
    <script type="text/javascript" src="../src/grid/header.js"></script>
    <script type="text/javascript" src="../src/grid/grid.js"></script>
    <script type="text/javascript" src="../src/grid/util.js"></script>
    <script type="text/javascript" src="specs/grid-spec.js"></script>

 <?php include("./templates/footer.php"); ?> 