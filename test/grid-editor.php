<?php  $title='表格插件测试' ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div id="J_Grid"></div>
    <hr>
    <button id="btn" class="button button-primary">点击</button>
    <button id="btnValid" class="button button-primary">验证</button>
    <hr>
    <div id="J_Grid1"></div>

    <hr>
    <div id="J_Grid2"></div>

    <div id="J_Grid5"></div>
    <div id="content" class="hide">
      <form class="form-horizontal">
        <div class="row">
          <div class="control-group span8">
            <label class="control-label"><s>*</s>字段二：</label>
            <div class="controls">
              <input name="b" type="text" data-rules="{required:true}" class="input-normal control-text">
            </div>
          </div>
          <div class="control-group span8">
            <label class="control-label"><s>*</s>选择：</label>
            <div class="controls">
              <select  data-rules="{required:true}"  name="d" class="input-normal"> 
                <option value="">请选择</option>
                <option value="1">选项一</option>
                <option value="2">选项二</option>
              </select>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="control-group span15 ">
            <label class="control-label">字段三：</label>
            <div id="range" class="controls">
              <input name="c" class="calendar" type="text">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="control-group span15">
            <label class="control-label">备注：</label>
            <div class="controls control-row4">
              <textarea name="e" class="input-large" type="text"></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
   
 </div>

    <?php $url = 'bui/grid/grid,bui/grid/plugins'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/grid/column.js"></script>
    <script type="text/javascript" src="../src/grid/header.js"></script>
    <script type="text/javascript" src="../src/grid/grid.js"></script>
    <script type="text/javascript" src="../src/grid/util.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/selection.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/cascade.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/gridmenu.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/summary.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/editing.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/cellediting.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/rowediting.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/dialog.js"></script>
    <script type="text/javascript" src="../src/grid/plugins/base.js"></script>
  
    <script type="text/javascript" src="specs/plugin-editor-spec.js"></script> 
    <script type="text/javascript" src="specs/plugin-editor-record-spec.js"></script> 
      
    <script type="text/javascript" src="specs/plugin-editor-dialog-spec.js"></script> 
   <!-- -->
<?php include("./templates/footer.php"); ?>       