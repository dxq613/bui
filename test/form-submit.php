<?php  $title='表单测试' ?>
<?php include("./templates/header.php"); ?>
  <div class="container">
    <div class="row">
      <form id="form" action="data/submit.php" method="post" class="form-horizontal">
       
        <div class="row">
          <div class="control-group span8">
            <label class="control-label"><s>*</s>供应商编码：</label>
            <div class="controls">
              <input name="id"  type="text" data-rules="{required:true,length:5}" class="input-normal control-text">
            </div>
          </div>
          <div class="control-group span8">
            <label class="control-label"><s>*</s>单选</label>
            <div class="controls bui-form-field-select" data-items="{'1':'1','2':'2','3':'3'}">
              <input name="select"  type="hidden" class="input-normal control-text" value="2">
            </div>
          </div>
          <div class="control-group span8">
            <label class="control-label">供应商类型：</label>
            <div class="controls">
              <select  data-rules="{required:true}" value="large"  name="type" class="input-normal"> 
                <option value="">请选择</option>
                <option value="saler">淘宝卖家</option>
                <option value="large">大厂直供</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row form-actions actions-bar">
            <div class="span13 offset3 ">
              <button type="submit" class="button button-primary">保存</button>
              <button type="reset" class="button">重置</button>
            </div>
        </div>
    </form>
    </div>
  </div>
    <?php $url = 'bui/form'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/form/rule.js"></script>
    <script type="text/javascript" src="../src/form/rules.js"></script>
    <script type="text/javascript" src="../src/form/remote.js"></script>
    <script type="text/javascript" src="../src/form/valid.js"></script>
    <script type="text/javascript" src="../src/form/groupvalid.js"></script>
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
    <script type="text/javascript" src="../src/form/field/radiolist.js"></script>
    <script type="text/javascript" src="../src/form/field/checklist.js"></script>
    <script type="text/javascript" src="../src/form/field/textarea.js"></script>
    <script type="text/javascript" src="../src/form/field/uploader.js"></script>


    <script type="text/javascript" src="../src/form/field.js"></script>
    <script type="text/javascript" src="../src/form/row.js"></script>
    <script type="text/javascript" src="../src/form/tips.js"></script>
    <script type="text/javascript" src="../src/form/fieldcontainer.js"></script>
    <script type="text/javascript" src="../src/form/group/base.js"></script>
    <script type="text/javascript" src="../src/form/group/range.js"></script>
    <script type="text/javascript" src="../src/form/group/check.js"></script>
    <script type="text/javascript" src="../src/form/group/select.js"></script>
    <script type="text/javascript" src="../src/form/fieldgroup.js"></script>
    <script type="text/javascript" src="../src/form/form.js"></script>
    <script type="text/javascript" src="../src/form/hform.js"></script>
    <script type="text/javascript" src="../src/form/base.js"></script>
    <script type="text/javascript" src="specs/form-submit-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>