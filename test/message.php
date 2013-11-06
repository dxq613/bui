<?php  $title='弹出框';$css="overlay"; ?>
<?php include("./templates/header.php"); ?>

    <div class="container">
      <div class="well">
        <button id="J_MsgInfo" class="button button-primary">提示信息</button>
        <button id="J_MsgSuccess" class="button button-primary">成功信息</button>
        <button id="J_MsgAlert" class="button button-primary">警告信息</button>
        <button id="J_MsgError" class="button button-primary">错误信息</button>
        <button id="J_MsgConfirm" class="button button-primary">确认信息</button>
      </div>

      <div class="well">
        <button id="J_Confirm" class="button button-primary">确认</button>
      </div>
    </div>
  
    <?php $url = 'bui/overlay'?>
    <?php include("./templates/script.php"); ?>

    <script type="text/javascript" src="specs/message-spec.js"></script>

<?php include("./templates/footer.php"); ?>