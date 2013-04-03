<?php  $title='表格测试' ?>
<?php include("./templates/header.php"); ?>

    <div id="J_Header"></div>
    <div id="J_Body"></div>
    <div id="J_Header1"></div>
    <div id="J_Body1"></div>

    <?php $url = 'bui/grid/body'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../assets/js/build/common.js"></script>
    <script type="text/javascript" src="../src/grid/column.js"></script>
    <script type="text/javascript" src="../src/grid/header.js"></script>
    <script type="text/javascript" src="../assets/js/build/data.js"></script>
    <script type="text/javascript" src="../src/grid/body.js"></script>
    <script type="text/javascript" src="specs/body-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>