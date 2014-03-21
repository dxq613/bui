<?php  $title='编辑器测试' ?>
<?php include("./templates/header.php"); ?>
  <div class="container">
    <div class="row">
      <div class="span8">
        <h2>编辑器</h2>
        <div>
          <div id="e1" class="edit-text">文本1</div>
          <div id="e2" class="edit-text">文本2</div>
          <div id="e3" class="edit-text">文本3</div>
        </div>
        <div id="outer" class="bordered well" style="width:100px;height:100px"></div>
      </div>
      <div class="span8">
        <h2>选择框</h2>
        <div>
          <div id="s1" class="edit-sel">通过</div>
          <div id="s2" class="edit-sel">不通过</div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="span8">
        <h2>记录编辑器</h2>
        <div id="log" class="well">
          
        </div>
        <button class="button" id="btnRecord">编辑</button>
      </div>
    </div>
    <h2>利用Dialog编辑数据</h2>
    <div class="row">
      <div class="span8">

        <div id="log1" class="well">
          {id:'124',type:'saler',start:'2011-01-02'}
        </div>
        <button class="button dialog" id="btnDialog1">编辑</button>

      </div>
      <div class="span8">
        <div id="log2" class="well">
          {id:'125',type:'large'}
        </div>
        <button class="button  dialog" id="btnDialog2">编辑</button>
      </div>
      <div class="span3">
        <button id="btn">弹出</button>
      </div>
    </div>
    <div id="content">
     
    </div> 
    <div id="c1">
      <form id="J_Form" class="form-horizontal">
        <div class="row">
          <div class="control-group span8">
            <label class="control-label"><s>*</s>供应商编码：</label>
            <div class="controls">
              <input name="id" type="text" data-rules="{required:true}" class="input-normal control-text">
            </div>
          </div>
          <div class="control-group span8">
            <label class="control-label"><s>*</s>供应商类型：</label>
            <div class="controls">
              <select  data-rules="{required:true}"  name="type" class="input-normal"> 
                <option value="">请选择</option>
                <option value="saler">淘宝卖家</option>
                <option value="large">大厂直供</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="control-group span15 ">
            <label class="control-label">起始日期：</label>
            <div id="range" class="controls bui-form-group">
              <input name="start" class="calendar" type="text"><label>&nbsp;-&nbsp;</label><input name="end" class="calendar" type="text">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="control-group span15">
            <label class="control-label">备注：</label>
            <div class="controls control-row4">
              <textarea name="memo" class="input-large" type="text"></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
    <?php $url = 'bui/editor'?>
    <?php include("./templates/script.php"); ?>
    
    
    <script type="text/javascript" src="../src/editor/mixin.js"></script>
    <script type="text/javascript" src="../src/editor/editor.js"></script>
    <script type="text/javascript" src="../src/editor/record.js"></script>
    <script type="text/javascript" src="../src/editor/dialog.js"></script>
    <script type="text/javascript" src="../src/editor/base.js"></script>
    <script type="text/javascript" src="specs/editor-spec.js"></script> 
   <script type="text/javascript" src="specs/record-editor-spec.js"></script>
    <script type="text/javascript" src="specs/editor-dialog-spec.js"></script><!-- -->
<?php include("./templates/footer.php"); ?>