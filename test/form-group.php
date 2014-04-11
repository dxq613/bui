<?php  $title='表单分组测试' ?>
<?php include("./templates/header.php"); ?>
  <div class="container">
   
    <div class="row">
      <div class="span12">
        <h2>日期范围分组</h2>
        <div id="g1">
          <label>日期范围：</label>
          <input name="start" type="text" class="calendar"/> - <input name="end" type="text" class="calendar"/>
        </div>
      </div>
      <div class="span12">
        <h2>年龄范围</h2>
        <div id="g2">
          <label>适用年龄：</label>
          <input name="start" type="number" min="2" class="input-small"/> - <input name="end" type="number" class="input-small"/>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="span12">
        <h2>至少勾选1个</h2>
        <div id="g3" data-rules="{checkRange : 1}">
          <label><input name="ck" type="checkbox" value="1" />一</label>
          <label><input name="ck" type="checkbox" value="2" />二</label>
          <label><input name="ck" type="checkbox" value="3" />三</label>
          <label><input name="ck" type="checkbox" value="4" />四</label>
          <label><input name="ck" type="checkbox" value="5" />五</label>
        </div>
      </div>
      <div class="span12">
        <h2>勾选等于1个</h2>
        <div id="g4" data-rules="{checkRange : [1,1]}">
          <label><input name="ck" type="checkbox" value="1" />一</label>
          <label><input name="ck" type="checkbox" value="2" />二</label>
          <label><input name="ck" type="checkbox" value="3" />三</label>
          <label><input name="ck" type="checkbox" value="4" />四</label>
          <label><input name="ck" type="checkbox" value="5" />五</label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="span12">
        <h2>勾选2个</h2>
        <div id="g5" data-rules="{checkRange:[2,2]}" data-messages="{checkRange:'只能选择2个'}">
          <label><input name="ck" type="checkbox" value="1" />一</label>
          <label><input name="ck" type="checkbox" value="2" />二</label>
          <label><input name="ck" type="checkbox" value="3" />三</label>
          <label><input name="ck" type="checkbox" value="4" />四</label>
          <label><input name="ck" type="checkbox" value="5" />五</label>
        </div>
      </div>
      <div class="span12">
        <h2>勾选2-4个</h2>
        <div id="g6" data-rules="{checkRange:[2,4]}" data-messages="{checkRange:'可以勾选{0}-{1}个选项！'}">
          <label><input name="ck" type="checkbox" value="1" />一</label>
          <label><input name="ck" type="checkbox" value="2" />二</label>
          <label><input name="ck" type="checkbox" value="3" />三</label>
          <label><input name="ck" type="checkbox" value="4" />四</label>
          <label><input name="ck" type="checkbox" value="5" />五</label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="span12">
        <h2>勾选1-2个</h2>
        <div id="g61" data-range="[1,2]" data-messages="{checkRange:'勾选{0}-{1}项'}">
          <label><input name="ck" type="checkbox" value="1" />一</label>
          <label><input name="ck" type="checkbox" value="2" />二</label>
          <label><input name="ck" type="checkbox" value="3" />三</label>
          <label><input name="ck" type="checkbox" value="4" />四</label>
          <label><input name="ck" type="checkbox" value="5" />五</label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="span12">
        <h2>必选</h2>
        <div id="g7" data-rules="{checkRange:1}">
          <label><input name="ck" type="radio" value="1" />一</label>
          <label><input name="ck" type="radio" value="2" />二</label>
          <label><input name="ck" type="radio" value="3" />三</label>
          <label><input name="ck" type="radio" value="4" />四</label>
          <label><input name="ck" type="radio" value="5" />五</label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="span12">
        <h2>级联选择框</h2>
        <div id="g8" data-url="data/city.json">
          <label>省市联动：</label>
          <select class="input-small" name="province" value="1">
            <option>请选择省</option>
          </select>
          <select class="input-small"  name="city" value="12"><option>请选择市</option></select>
          <select class="input-small"  name="county" value="121"><option>请选择县/区</option></select>
        </div>
        <hr>
        <div id="g10" data-type="test">
          <label>省市联动：</label>
          <select class="input-small" name="province" value="1">
            <option>请选择省</option>
          </select>
          <select class="input-small"  name="city" value="12"><option>请选择市</option></select>
          <select class="input-small"  name="county" value="121"><option>请选择县/区</option></select>
        </div>
      </div>
      <div class="span12">
        <h2>级联选择框 jsonp</h2>
        <div id="g9" data-type="city">
          <label>省市联动：</label>
          <select  class="input-small" name="province" value="山东省">
            <option>请选择省</option>
          </select>
          <select class="input-small"  name="city" value="12"><option>请选择市</option></select>
          <select class="input-small"  name="county" value="121"><option>请选择县/区</option></select>
        </div>
      </div>
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

    <script type="text/javascript" src="specs/form-group-spec.js"></script>
    <!---->
    
<?php include("./templates/footer.php"); ?>