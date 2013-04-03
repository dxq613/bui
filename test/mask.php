<?php  $title='Mask 测试' ?>
<?php include("./templates/header.php"); ?>

    <div id="t1" style="width:500px;height:500px;background-color:red;"></div>

    <button id="btnShow" class="ks-button ks-button-primary">显示</button>
    <button id="btnHide" class="ks-button ks-button-primary">隐藏</button>
    <?php $url = 'bui/overlay'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/mask/mask.js"></script>
    <script type="text/javascript" src="../src/mask/loadmask.js"></script>
    <script type="text/javascript" src="../src/mask/base.js"></script>
    <script type="text/javascript" src="specs/mask-spec.js"></script>
<?php include("./templates/footer.php"); ?>