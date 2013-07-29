/**
 * @fileOverview 表格行编辑
 * @ignore
 */

define('bui/grid/plugins/rowediting',['bui/common','bui/grid/plugins/editing'],function (require) {
   var BUI = require('bui/common'),
    Editing = require('bui/grid/plugins/editing'),
    CLS_ROW = BUI.prefix + 'grid-row';

  /**
   * @class BUI.Grid.Plugins.RowEditing
   * @extends BUI.Grid.Plugins.Editing
   * 单元格编辑插件
   */
  var RowEditing = function(config){
    RowEditing.superclass.constructor.call(this, config);
  };

  RowEditing.ATTRS = {
     /**
     * @protected
     * 编辑器的对齐设置
     * @type {Object}
     */
    align : {
      value : {
        points: ['tl','tl'],
        offset : [-2,0]
      }
    },
    /**
     * 触发编辑样式，为空时默认点击整行都会触发编辑
     * @cfg {String} [triggerCls = 'bui-grid-row']
     */
    triggerCls : {
      value : CLS_ROW
    }
  };

  BUI.extend(RowEditing,Editing);

  BUI.augment(RowEditing,{

    /**
     * @protected
     * 获取编辑器的配置项
     * @param  {Array} fields 字段配置
     */ 
    getEditorCfgs : function(fields){
      var rst = [];
      rst.push({
        changeSourceEvent : null,
        autoUpdate : false,
        form : {
          children : fields,
          buttonBar : {
            elCls : 'centered toolbar'
          }
        }
      });
      return rst;
    },
    /**
     * 封装验证方法
     * @protected
     */
    wrapValidator : function(validator){
      var _self = this;
      return function(value){
        var editor = _self.get('curEditor'),
          record = editor ? editor.getValue() : _self.get('record');
        if(record){
          return validator(value,record);
        }
      };
    },
    /**
     * @protected
     * 编辑器字段定位
     */
    focusEditor : function(editor,field){
      var form = editor.get('form'),
        control = form.getField(field);
      if(control){
        control.focus();
      }
    },
    /**
     * @protected
     * 获取列定义中的字段定义信息
     * @param  {BUI.Grid.Column} column 列定义
     * @return {Object}  字段定义
     */
    getFieldConfig : function(column){
      var editor = column.get('editor');
      if(editor){
        return editor;
      }
      var cfg = {xtype : 'plain'};
      if(column.get('dataIndex') && column.get('renderer')){
        cfg.renderer = column.get('renderer');
        //cfg.id = column.get('id');
      }
      return cfg;
    },
    /**
     * 更新数据
     * @protected
     * @param  {Object} record 编辑的数据
     * @param  {*} value  编辑值
     */
    updateRecord : function(store,record,editor){
      var _self = this,
          value = editor.getValue();
        BUI.each(value,function(v,k){
          if(BUI.isDate(v)){
            value[k] = v.getTime();
          }
        });
        BUI.mix(record,value);
        
        store.update(record);
    },
     /**
     * 获取编辑此单元格的编辑器
     * @protected
     * @param  {String} field 点击单元格的字段
     * @return {BUI.Editor.Editor}  编辑器
     */
    getEditor : function(field){
      var _self = this,
        editors = _self.get('editors');
      return editors[0];
    },
    /**
     * @override
     * 列发生改变
     */
    onColumnVisibleChange : function(column){
      var _self = this,
        id = column.get('id'),
        editor = _self.getEditor(),
        field = editor.getChild(id,true);
      if(field){
        field.set('visible',column.get('visible'));
      }
    },
    /**
     * 显示编辑器前
     * @protected
     * @template
     * @param  {BUI.Editor.Editor} editor 
     * @param  {Object} options
     */
    beforeShowEditor : function(editor,options){
      var _self = this,
        grid = _self.get('grid'),
        columns = grid.get('columns'),
        form = editor.get('form'),
        row = $(options.row);
      editor.set('width',row.width());
      BUI.each(columns,function(column){
        if(!column.get('visible')){
          field.set('visible',false);
        }else{
          var fieldName = column.get('dataIndex'),
            field = form.getField(fieldName),
            width = column.get('el').outerWidth() - field.getAppendWidth();
          field.set('width',width);
        }
      });
    },
    /**
     * @protected
     * 获取要编辑的值
     * @param  {Object} options 点击单元格的事件对象
     * @return {*}   编辑的值
     */
    getEditValue : function(options){
      return options.record;
    },
    /**
     * 获取编辑器的构造函数
     * @param  {Object} Editor 命名空间
     * @return {Function}       构造函数
     */
    getEditorConstructor : function(Editor){
      return Editor.RecordEditor;
    },
     /**
     * @protected
     * 获取对齐的节点
     * @override
     * @param  {Object} options 点击单元格的事件对象
     * @return {jQuery} 
     */
    getAlignNode : function(options){
      return $(options.row);
    },
    /**
     * 获取编辑的字段
     * @protected
     * @return {Array}  字段集合
     */
    getFields : function(){
      var _self = this,
        editors = _self.get('editors');
      return editors[0].get('form').get('children');
    }
  });
  return RowEditing;
});