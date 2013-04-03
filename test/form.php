<?php  $title='表单测试' ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
     <form class="form-horizontal">
      <h3>基本信息</h3>
      <div class="row">
        <div class="control-group span12">
          <label class="control-label"><s>*</s>学生姓名：</label>
          <div class="controls">
            <input id="J_Name" type="text" name="a" class="control-text">
          </div>
        </div>
        <div class="control-group span12">
          <label class="control-label">性别：</label>
          <div class="controls" id="J_Sex">
            <input type="hidden" name="sex" id="sex-hidden"/>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="control-group span12">
          <label class="control-label">不同长度输入框：</label>
          <div class="controls">
            <input type="text" name="b" data-tip='{"text":"请填写数据"}' class="span5 span-width control-text">
          </div>
        </div>
        <div class="control-group12 span12">
          <label class="control-label">学生姓名：</label>
          <div class="controls">
            <input type="text" name="c"  id="J_Name1" value="ceshi" class="control-text">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="control-group span12">
          <label class="control-label"><s>*</s>学生姓名：</label>
          <div class="controls">
            <input type="text" name="d" class=" control-text">
          </div>
        </div>
        <div class="control-group span12">
          <label class="control-label">学生姓名：</label>
          <div class="controls">
            <input type="text" name="e" class=" control-text">
          </div>
        </div>
      </div>
      <hr/>
      <div class="row">
        <div class="form-actions offset3">
          <button type="submit" class="ks-button ks-button-primary">保存</button>
          <button type="reset" class="ks-button">重置</button>
        </div>
      </div>
    </form>
  </div>

    <?php $url = 'bui/form/tips'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/form/tips.js"></script>

    <script type="text/javascript" src="specs/form-spec.js"></script>
<?php include("./templates/footer.php"); ?>