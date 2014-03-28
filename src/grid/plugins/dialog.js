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
     * 是否自动保存数据到数据源，通过store的save方法实现
     * @cfg {Object} [autoSave=false]
     */
    autoSave : {
      value : false
    },
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

         /**
         * @event accept 
         * 确认编辑
         * @param {Object} ev 事件对象
         * @param {Object} ev.record 编辑的数据
         * @param {BUI.Form.Form} form 表单
         * @param {BUI.Editor.Editor} ev.editor 编辑器
         */
        
        /**
         * @event cancel 
         * 取消编辑
         * @param {Object} ev 事件对象
         * @param {Object} ev.record 编辑的数据
         * @param {BUI.Form.Form} form 表单
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
        _self.fire('editorready');
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
        _self.fire('accept',{editor : editor,record : _self.get('record'),form : form});
      });

      editor.on('cancel',function(){
        _self.fire('cancel',{editor : editor,record : _self.get('record'),form : editor.get('form')});
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
      if(_self.get('autoSave')){
        store.save(curRecord);
      }
    },
    /**
     * @private
     * 显示编辑器
     */
    showEditor : function(record){
      var _self = this,
        editor = _self.get('editor');
        
      _self.set('record',record);
      editor.show();
      editor.setValue(record,true); //设置值，并且隐藏错误
      
      _self.fire('recordchange',{record : record,editType : _self.get('editType')});
      _self.fire('editorshow',{eidtor : editor,editType : _self.get('editType')});
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