<?php  $title='表单字段测试' ?>
<?php include("./templates/header.php"); ?>
  <style>

  </style>
  <div class="container">
    <h2>生成表单</h2>
    <form class="form-horizontal">
      <div id="row" class="row">
        
      </div>
      <div id="row1" class="row">
        
      </div>
      <div class="row">
        <div class="span8">
          <label class="control-label">选择框</label>
          <div class="controls">
            <select id="s1" name="sel" value="3">
              <option value="">请选择</option>
              <option value="1">选项一</option>
              <option value="2">选项二</option>
              <option value="3">选项三</option>
            </select>
          </div>
        </div> 
        <div class="span8">
          <label class="control-label">选择框</label>
          <div id="lf" class="controls control-row-auto">
            <ul class="bui-simple-list">
              <li data-value="1">选项一</li>
              <li data-value="2">选项二</li>
              <li data-value="3">选项三</li>
              <li data-value="4">选项四</li>
            </ul>
            <input type="hidden" name="list"> 
          </div>
          
        </div>
      </div>

      <div id="upload">
        <input type="hidden" value=''>
      </div>
    </form>

  </div>
    <?php $url = 'bui/form/field'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/form/tips.js"></script>
    <script type="text/javascript" src="../src/form/rule.js"></script>
    <script type="text/javascript" src="../src/form/rules.js"></script>
    <script type="text/javascript" src="../src/form/remote.js"></script>
    <script type="text/javascript" src="../src/form/valid.js"></script>
    <script type="text/javascript" src="../src/form/field/base.js"></script>
    <script type="text/javascript" src="../src/form/field/text.js"></script>
    <script type="text/javascript" src="../src/form/field/number.js"></script>
    <script type="text/javascript" src="../src/form/field/select.js"></script>
    <script type="text/javascript" src="../src/form/field/date.js"></script>
    <script type="text/javascript" src="../src/form/field/hidden.js"></script>
    <script type="text/javascript" src="../src/form/field/check.js"></script>
    <script type="text/javascript" src="../src/form/field/checkbox.js"></script>
    <script type="text/javascript" src="../src/form/field/radio.js"></script>
    <script type="text/javascript" src="../src/form/field/plain.js"></script>
    <script type="text/javascript" src="../src/form/field/list.js"></script>
    <script type="text/javascript" src="../src/form/field/textarea.js"></script>
    <script type="text/javascript" src="../src/form/field/uploader.js"></script>
    <script type="text/javascript" src="../src/form/field/checklist.js"></script>
    <script type="text/javascript" src="../src/form/field/radiolist.js"></script>
    <script type="text/javascript" src="../src/form/field.js"></script>

    <script type="text/javascript" src="specs/form-field-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>