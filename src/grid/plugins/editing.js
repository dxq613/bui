/**
 * @fileOverview 表格编辑插件
 * @ignore
 */

define('bui/grid/plugins/editing',function (require) {

  var CLS_CELL_INNER = BUI.prefix + 'grid-cell-inner',
    CLS_CELL_ERROR = BUI.prefix + 'grid-cell-error';
  /**
   * 表格的编辑插件
   * @class BUI.Grid.Plugins.Editing
   */
  function Editing(config){
    Editing.superclass.constructor.call(this, config);
  }

  BUI.extend(Editing,BUI.Base);

  Editing.ATTRS = {
    /**
     * @protected
     * 编辑器的对齐设置
     * @type {Object}
     */
    align : {
      value : {
        points: ['cl','cl']
      }
    },
    /**
     * 是否直接在表格上显示错误信息
     * @type {Boolean}
     */
    showError : {
      value : true
    },
    errorTpl : {
      value : '<span class="x-icon ' + CLS_CELL_ERROR + ' x-icon-mini x-icon-error" title="{error}">!</span>'
    },
    /**
     * 是否初始化过编辑器
     * @protected
     * @type {Boolean}
     */
    isInitEditors : {
      value : false
    },
    /**
     * 正在编辑的记录
     * @type {Object}
     */
    record : {

    },
    /**
     * 当前编辑的编辑器
     * @type {Object}
     */
    curEditor : {

    },
    /**
     * 是否发生过验证
     * @type {Boolean}
     */
    hasValid : {

    },
    /**
     * 编辑器
     * @protected
     * @type {Object}
     */
    editors : {
      shared:false,
      value : []
    },
    /**
     * 触发编辑样式，为空时默认点击整行都会触发编辑
     * @type {String}
     */
    triggerCls : {

    },
    /**
     * 进行编辑时是否触发选中
     * @type {Boolean}
     */
    triggerSelected : {
      value : true
    }
    /**
     * @event accept 
     * 确认编辑
     * @param {Object} ev 事件对象
     * @param {Object} ev.record 编辑的数据
     * @param {BUI.Editor.Editor} ev.editor 编辑器
     */
    
    /**
     * @event cancel 
     * 取消编辑
     * @param {Object} ev 事件对象
     * @param {Object} ev.record 编辑的数据
     * @param {BUI.Editor.Editor} ev.editor 编辑器
     */
    
    /**
     * @event editorshow 
     * editor 显示
     * @param {Object} ev 事件对象
     * @param {Object} ev.record 编辑的数据
     * @param {BUI.Editor.Editor} ev.editor 编辑器
     */
    
    /**
     * @event editorready
     * editor 创建完成，因为editor延迟创建，所以创建完成grid，等待editor创建成功
     */
    

  };

  BUI.augment(Editing,{
    /**
     * 初始化
     * @protected
     */
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);
      _self.initEditing(grid);
      
    },
    renderUI : function(){
      var _self = this,
        grid = _self.get('grid');
      //延迟加载 editor模块
      BUI.use('bui/editor',function(Editor){
        _self.initEditors(Editor);
        _self._initGridEvent(grid);
        _self.set('isInitEditors',true);
        _self.fire('editorready');
      });
    },
    /**
     * 初始化插件
     * @protected
     */
    initEditing : function(grid){

    },
    _getCurEditor : function(){
      return this.get('curEditor');
    },
    _initGridEvent : function(grid){
      var _self = this,
        header = grid.get('header');

      grid.on('cellclick',function(ev){

        var editor = null,
          domTarget = ev.domTarget,
          triggerCls = _self.get('triggerCls'),
          curEditor = _self._getCurEditor();
        if(curEditor && curEditor.get('acceptEvent')){
          curEditor.accept();
          curEditor.hide();
        }else{
          curEditor && curEditor.cancel();
        }

        //if(ev.field){
          editor = _self.getEditor(ev.field);
        //}
        if(editor && $(domTarget).closest('.' + triggerCls).length){
          _self.showEditor(editor,ev);
          //if(curEditor && curEditor.get('acceptEvent')){
          if(!_self.get('triggerSelected')){
            return false; //此时不触发选中事件
          }
            
          //}
        }
      });

      grid.on('rowcreated',function(ev){
        validRow(ev.record,ev.row);
      });

      grid.on('rowremoved',function(ev){
        if(_self.get('record') == ev.record){
          _self.cancel();
        }
      });

      grid.on('rowupdated',function(ev){
        validRow(ev.record,ev.row);
      });

      grid.on('scroll',function(ev){
        var editor = _self._getCurEditor();
        if(editor){

          var align = editor.get('align'),
            node = align.node,
            pos = node.position();
          if(pos.top < 0 || pos.top > ev.bodyHeight){
            editor.hide();
          }else{
            editor.set('align',align);
            editor.show();
          }
          
        }
      });

      header.on('afterVisibleChange',function(ev){
        if(ev.target && ev.target != header){
          var column = ev.target;
          _self.onColumnVisibleChange(column);
        }
      });

      function validRow(record,row){
        if(_self.get('hasValid')){
          _self.validRecord(record,_self.getFields(),$(row));
        }
      }

    },
    /**
     * 初始化所有
     * @protected
     */
    initEditors : function(Editor){
      var _self = this,
        grid = _self.get('grid'),
        fields = [],
        columns = grid.get('columns');
      BUI.each(columns,function(column){
        var field = _self.getFieldConfig(column);
        if(field){
          field.name = column.get('dataIndex');
          field.id = column.get('id');
          if(field.validator){
            field.validator = _self.wrapValidator(field.validator);
          }
          fields.push(field);
        }
      });
      var cfgs = _self.getEditorCfgs(fields);
      BUI.each(cfgs,function(cfg){
        _self.initEidtor(cfg,Editor);
      });
    },
    /**
     * @protected
     * 获取列定义中的字段定义信息
     * @param  {BUI.Grid.Column} column 列定义
     * @return {Object}  字段定义
     */
    getFieldConfig : function(column){
      return column.get('editor');
    },
    /**
     * 封装验证方法
     * @protected
     */
    wrapValidator : function(validator){
      var _self = this;
      return function(value){
        var record = _self.get('record');
        return validator(value,record);
      };
    },
    /**
     * @protected
     * 列显示隐藏时
     */
    onColumnVisibleChange : function(column){

    },
    /**
     * @protected
     * 获取编辑器的配置
     * @template
     * @param  {Array} fields 字段配置
     * @return {Array} 编辑器的配置项
     */
    getEditorCfgs : function(fields){

    },
    /**
     * 获取编辑器的构造函数
     * @param  {Object} Editor 命名空间
     * @return {Function}       构造函数
     */
    getEditorConstructor : function(Editor){
      return Editor.Editor;
    },
    /**
     * 初始化编辑器
     * @private
     */
    initEidtor : function(cfg,Editor){
      var _self = this,
        con = _self.getEditorConstructor(Editor),
        editor = new con(cfg);
      editor.render();
      _self.get('editors').push(editor);
      _self.bindEidtor(editor);
      return editor;
    },
    /**
     * @protected
     * 绑定编辑器事件
     * @param  {BUI.Editor.Editor} editor 编辑器
     */
    bindEidtor : function(editor){
      var _self = this,
        grid = _self.get('grid'),
        store = grid.get('store');
      editor.on('accept',function(){
        var record = _self.get('record');
        _self.updateRecord(store,record,editor);
        _self.fire('accept',{editor : editor,record : record});
        _self.set('curEditor',null);

      });

      editor.on('cancel',function(){
        _self.fire('cancel',{editor : editor,record : _self.get('record')});
        _self.set('curEditor',null);
      });
    },
    /**
     * 获取编辑器
     * @protected
     * @param  {String} field 字段值
     * @return {BUI.Editor.Editor}  编辑器
     */
    getEditor : function(options){

    },
    /**
     * @protected
     * 获取对齐的节点
     * @template
     * @param  {Object} options 点击单元格的事件对象
     * @return {jQuery} 
     */
    getAlignNode : function(options){

    },
    /**
     * @protected
     * 获取编辑的值
     * @param  {Object} options 点击单元格的事件对象
     * @return {*}   编辑的值
     */
    getEditValue : function(options){

    },
    /**
     * 显示编辑器
     * @protected
     * @param  {BUI.Editor.Editor} editor 
     */
    showEditor : function(editor,options){
      var _self = this,
        value = _self.getEditValue(options),
        alignNode = _self.getAlignNode(options);

      _self.beforeShowEditor(editor,options);
      _self.set('record',options.record);
      editor.setValue(value);
      if(alignNode){
        var align = _self.get('align');
        align.node = alignNode;
        editor.set('align',align);
      }

      editor.show();
      _self.focusEditor(editor,options.field);
      _self.set('curEditor',editor);
      _self.fire('editorshow',{editor : editor});
    },
    /**
     * @protected
     * 编辑器字段定位
     */
    focusEditor : function(editor,field){
      editor.focus();
    },
    /**
     * 显示编辑器前
     * @protected
     * @template
     * @param  {BUI.Editor.Editor} editor 
     * @param  {Object} options
     */
    beforeShowEditor : function(editor,options){

    },
    //创建编辑的配置项
    _createEditOptions : function(record,field){
      var _self = this,
        grid = _self.get('grid'),
        rowEl = grid.findRow(record),
        column = grid.findColumnByField(field),
        cellEl = grid.findCell(column.get('id'),rowEl);
      return {
        record : record,
        field : field,
        cell : cellEl[0],
        row : rowEl[0]
      };
    },
    /**
     * 验证表格是否通过验证
     */
    valid : function(){
      var _self = this,
        grid = _self.get('grid'),
        store = grid.get('store');

      if(store){
        var records = store.getResult();
        BUI.each(records,function(record){
          _self.validRecord(record,_self.getFields());
        });
      }
      _self.set('hasValid',true);
    },
    isValid : function(){
      var _self = this,
        grid = _self.get('grid');
      if(!_self.get('hasValid')){
        _self.valid();
      }
      return !grid.get('el').find('.' + CLS_CELL_ERROR).length;
    },
    /**
     * 清理错误
     */
    clearErrors : function(){
      var _self = this,
        grid = _self.get('grid');
      grid.get('el').find('.' + CLS_CELL_ERROR).remove();
    },
    /**
     * 获取编辑的字段
     * @protected
     * @param  {Array} editors 编辑器
     * @return {Array}  字段集合
     */
    getFields : function(editors){
      
    },
    /**
     * 校验记录
     * @protected
     * @param  {Object} record 校验的记录
     * @param  {Array} fields 字段的集合
     */
    validRecord : function(record,fields,row){
      var _self = this,
        errors = [];
      _self.setInternal('record',record);
      fields = fields || _self.getFields();
      BUI.each(fields,function(field){
        var name = field.get('name'),
          value = record[name] || '',
          error = field.getValidError(value);
        if(error){
          errors.push({name : name,error : error,id : field.get('id')});
        }
      });
      _self.showRecordError(record,errors,row);
    },
    showRecordError : function(record,errors,row){
      var _self = this,
        grid = _self.get('grid');
      row = row || grid.findRow(record);
      if(row){
        _self._clearRowError(row);
        BUI.each(errors,function(item){
          var cell = grid.findCell(item.id,row);
          _self._showCellError(cell,item.error);
        });
      }
    },
    /**
     * 更新数据
     * @protected
     * @param  {Object} record 编辑的数据
     * @param  {*} value  编辑值
     */
    updateRecord : function(store,record,editor){
     
    },
    _clearRowError : function(row){
      row.find('.' + CLS_CELL_ERROR).remove();
    },
    _showCellError : function(cell,error){
      var _self = this,
        errorTpl = BUI.substitute(_self.get('errorTpl'),{error : error}),
        innerEl = cell.find('.' + CLS_CELL_INNER);
      $(errorTpl).appendTo(innerEl);
    },
    /**
     * 编辑记录
     * @param  {Object} record 需要编辑的记录
     * @param  {String} field 编辑的字段
     */
    edit : function(record,field){
      var _self = this,
        options = _self._createEditOptions(record,field),
        editor = _self.getEditor(field);
      _self.showEditor(editor,options);
    },
    /**
     * 取消编辑
     */
    cancel : function(){
      var _self = this,
        editors = _self.get('editors');
      BUI.each(editors,function(editor){
        if(editor.get('visible')){
          editor.cancel();
        }
      });
      _self.set('curEditor',null);
      _self.set('record',null);
    },  
    /**
     * 析构函数
     * @protected
     */
    destructor:function () {
      var _self = this,
        editors = _self.get('editors');
      
      BUI.each(editors,function(editor){
        editor.destroy || editor.destroy();
      });
      _self.off();
      _self.clearAttrVals();
    }

  });

  return Editing;
});