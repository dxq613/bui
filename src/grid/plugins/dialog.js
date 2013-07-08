/**
 * @fileOverview 表格跟表单联用
 * @ignore
 */

define('bui/grid/plugins/dialogediting',['bui/common'],function (require) {
  var BUI = require('bui/common'),
    TYPE_ADD = 'add',
    TYPE_EDIT = 'edit';

  /**
   * 表格的编辑插件
   * @class BUI.Grid.Plugins.DialogEditing
   */
  function Dialog(config){
     Dialog.superclass.constructor.call(this, config);
  }

  Dialog.ATTRS = {
    /**
     * 编辑的记录
     * @type {Object}
     * @readOnly
     */
    record : {

    },
    /**
     * @private
     * 编辑记录的index
     * @type {Object}
     */
    curIndex : {

    },
    /**
     * Dialog的内容，内部包含表单(form)
     * @cfg {String} contentId
     */
    /**
     * Dialog的内容，内部包含表单(form)
     * @type {String}
     */
    contentId:{

    },
    /**
     * 编辑器
     * @type {BUI.Editor.DialogEditor}
     * @readOnly
     */
    editor : {

    },
    /**
     * Dialog中的表单
     * @type {BUI.Form.Form}
     * @readOnly
     */
    form : {

    },
    events : {
      value : {
        /**
         * @event
         * 编辑的记录发生更改
         * @param {Object} e 事件对象
         * @param {Object} e.record 记录
         * @param {Object} e.editType 编辑的类型 add 或者 edit
         */
        recordchange : false
      }
    },
    editType : {

    }
  };

  BUI.extend(Dialog,BUI.Base);

  BUI.augment(Dialog,{
    /**
     * 初始化
     * @protected
     */
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);
      //延迟加载 editor模块
      BUI.use('bui/editor',function(Editor){
        _self._initEditor(Editor);
      });
    },
    bindUI : function(grid){
      var _self = this,
        triggerCls = _self.get('triggerCls');
      if(triggerCls){
        grid.on('cellclick',function(ev){
          var sender = $(ev.domTarget),
            editor = _self.get('editor');
          if(sender.hasClass(triggerCls) && editor){

            _self.edit(ev.record);
            if(grid.get('multipleSelect')){
              return false;
            }
          }
        });
      }
    },
    //初始化编辑器
    _initEditor : function(Editor){
      var _self = this,
        contentId = _self.get('contentId'),
        formNode = $('#' + contentId).find('form'),
        editor = _self.get('editor'),
        cfg = BUI.merge(editor,{
            contentId : contentId,
            form : {
              srcNode : formNode
            }
        });

      editor = new Editor.DialogEditor(cfg);
      _self._bindEditor(editor);
      _self.set('editor',editor);
      _self.set('form',editor.get('form'));
    },
    //绑定编辑器事件
    _bindEditor : function(editor){
      var _self = this;
      editor.on('accept',function(){
        var form = editor.get('form'),
          record = form.serializeToObject();
        _self.saveRecord(record);
      });
    },
    /**
     * 编辑记录
     * @param  {Object} record 记录
     */
    edit : function(record){
      var _self = this;
      _self.set('editType',TYPE_EDIT);
      _self.showEditor(record);
    },
    /**
     * 添加记录
     * @param  {Object} record 记录
     * @param {Number} [index] 添加到的位置，默认添加在最后
     */
    add : function(record,index){
      var _self = this;
      _self.set('editType',TYPE_ADD);
      _self.set('curIndex',index);
      _self.showEditor(record);
    },
    /**
     * @private
     * 保存记录
     */
    saveRecord : function(record){
      var _self = this,
        grid = _self.get('grid'),
        editType = _self.get('editType'),
        curIndex = _self.get('curIndex'),
        store = grid.get('store'),
        curRecord = _self.get('record');

      BUI.mix(curRecord,record);

      if(editType == TYPE_ADD){
        if(curIndex != null){
          store.addAt(curRecord,curIndex);
        }else{
          store.add(curRecord);
        }
      }else{
        store.update(curRecord);
      }
    },
    /**
     * @private
     * 显示编辑器
     */
    showEditor : function(record){
      var _self = this,
        editor = _self.get('editor');

      editor.show();
      editor.setValue(record);
      _self.set('record',record);
      _self.fire('recordchange',{record : record,editType : _self.get('editType')});
    },
    /**
     * 取消编辑
     */
    cancel : function(){
      var _self = this,
        editor = _self.get('editor');
      editor.cancel();
    },
    destructor : function(){
      var _self = this,
        editor = _self.get('editor');
      editor && editor.destroy();
      _self.off();
      _self.clearAttrVals();
    }

  });

  return Dialog;
});