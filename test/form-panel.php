<?php  $title='表单测试' ?>
<?php include("./templates/header.php"); ?>
  <div class="container">
    <div class="row">
      <div class="span8">
        <h2>生成表单</h2>
        <div id="f1">
          
        </div>
        
       
      </div>
      <div class="span16">
         <h2>生成横向表单</h2>
        <div id="f2">
          
        </div>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="span16">
        <h2>现有的DOM <button id="btn" class="button button-small">展开/折叠</button></h2>
        <form id="f3" method="post" data-depends="{'#btn:click':['toggle']}">
          <div>
            <label><input id="r1" name="c" type="radio" value="0"/>单选1</label> 
            <label><input id="r2" name="c" type="radio" value="1"/>单选2</label>
          </div>
          <div>
            <label><input id="chk" name="c1" type="checkbox" value="0"/>显示</label> 
          </div>
          <div id="g1" class="bui-form-group" data-depends="{'#chk:checked':['show'],'#chk:unchecked':['hide'],'#r1:checked':['enable'],'#r2:checked':['clearFields','disable']}">
            <div class="bui-form-field" data-tip="{text:'请输入'}" data-rules="{required:true,regexp : /^\d+$/}" name="a">
              <label>文本1：</label><input type="text">
            </div>
            <div>
              <label>文本2：</label><input id="g2" name="b" type="text">
            </div>
          </div>
          <div class="control-group">
              <label class="control-label">上架时间：</label>    
              <div class="controls control-row-auto">
                <label class="radio">
                  <input type="radio" name="uptime" value="now" checked="checked">立刻
                </label>
                <label  class="radio">
                  <input id="upn" type="radio" name="uptime" disabled value="set">设定  
                </label>
                <label class="radio">
                  <input type="radio" name="uptime" value="inputc">放入仓库
                </label>
                <div class="bui-form-group" style="display:none" data-cfg="{datePicker:{minDate : '2012-0-01'}}"  data-depends="{'#upn:checked':['show','enable'],'#upn:unchecked':['hide','disable']}">
                  <input type="text" class="calendar ks-select-calendar calendar-time">
                  <span class="auxiliary-text">您可以设定宝贝正式销售时间</span>   
                  <label class="valid-text" style="height: 18px;"><span class="estate error"><em class="label">此项为必填项。</em></span></label>
                </div>         
              </div>
            </div>
          <div>
            <label>日期：</label><input type="text" name="c2" class="calendar calendar-time" data-tip="{text : '请输入日期'}"/>
          </div>
          <div class="bui-bar">
            <button type="submit">提交</button>
            <button type="reset">重置</button>
          </div>
        </form>
      </div>
    </div>
    <div class="row">
      <form id="J_Form" class="form-horizontal">
       
        <div class="row">
          <div class="control-group span8">
            <label class="control-label"><s>*</s>供应商编码：</label>
            <div class="controls">
              <input name="a"  type="text" data-rules="{required:true,minlength:5}" data-remote='data/remote.php' class="input-normal control-text">
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
        <div class="row">
          <div class="control-group span15">
            <label class="control-label">所在地：</label>
            <div class="controls bui-form-group-select"  data-type="city">
              <select  class="input-small" name="province" value="山东省">
                <option>请选择省</option>
              </select>
              <select class="input-small"  name="city" value="淄博市"><option>请选择市</option></select>
              <select class="input-small"  name="county" value="淄川区"><option>请选择县/区</option></select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="control-group span8">
            <label class="control-label"><s>*</s>多选</label>
            <div class="controls bui-form-field-select" data-select="{multipleSelect:true,items : [{text : '1',value:'1'},{text : '2',value:'2'},{text : '3',value:'3'}]}">
              <input name="m_select"  type="hidden" class="input-normal control-text" value="2,3">
            </div>
          </div>
          <div class="control-group span15">
            <label class="control-label">起始日期：</label>
            <div class="controls bui-form-group" data-rules="{dateRange : true}">
              <input name="start" class="calendar" type="text"><label>&nbsp;-&nbsp;</label><input name="end" class="calendar" type="text">
            </div>
          </div>
        </div>
         <!---->
        <div class="row">
          <div class="control-group span8">
            <label class="control-label"><s>*</s>单选</label>
            <div class="controls bui-form-field-select" data-items="[{value : '1',text:'1'},{value : '2',text:'2'}]">
              <input name="select0"  type="hidden" class="input-normal control-text" value="2">
            </div>
          </div>
          <div class="control-group span15">
            <label class="control-label">备注：</label>
            <div class="controls control-row4">
              <textarea name="memo"  data-rules="{required:true}" class="input-large" type="text"></textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="control-group span15">
            <label class="control-label">列表</label>
            <div class="controls control-row-auto bui-form-field-list" data-items="{'1':'1','2':'二'}">
              <input type="hidden" name="l1" value="1">
              <ul class="bui-simple-list"></ul>
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
    
    <script type="text/javascript" src="specs/form-base-spec.js"></script>
    <script type="text/javascript" src="specs/form-horizontal-spec.js"></script>
        <!---->
    
    <script type="text/javascript" src="specs/form-decorate-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>