/**
 * @fileOverview 表单中的列表，每个列表后有个隐藏域用来存储数据
 * @ignore
 */

define('bui/form/listfield',['bui/common','bui/form/basefield','bui/list'],function (require) {
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Field = require('bui/form/basefield');

  /**
   * @class BUI.Form.Field.List
   * 表单中的列表
   * @extends BUI.Form.Field
   */
  var List = Field.extend({

    initializer : function(){
      var _self = this;
      //if(!_self.get('srcNode')){
        _self._initList();
      //}
    },
    _getList : function(){
      var _self = this,
        children = _self.get('children');
      return children[0];
    },
    bindUI : function(){
      var _self = this,
        list = _self._getList();
      if(list){
        list.on('selectedchange',function(){
          var value = _self._getListValue(list);
          _self.set('value',value);
        });
      }
    },
    //获取列表值
    _getListValue : function(list){
      var _self = this;
      list = list || _self._getList();
      return list.getSelectionValues().join(',');
    },
    /**
     * 设置字段的值
     * @protected
     * @param {*} value 字段值
     */
    setControlValue : function(value){
      var _self = this,
        innerControl = _self.getInnerControl(),
        list = _self._getList();
      innerControl.val(value);
      if(_self._getListValue(list) !== value && list.getCount()){
        if(list.get('multipleSelect')){
          list.clearSelection();
        }
        list.setSelectionByField(value.split(','));
      }
    },
    //同步数据
    syncUI : function(){
       this.set('list',this._getList());
    },
    //初始化列表
    _initList : function(){
      var _self = this,
        children = _self.get('children'),
        list = _self.get('list') || {};
      if(children[0]){
        return;
      }
      if($.isPlainObject(list)){
        list.xclass = list.xclass || 'simple-list';
      }
      children.push(list);
    },
    /**
     * 设置选项
     * @param {Array} items 选项记录
     */
    setItems : function(items){
      var _self = this,
        value = _self.get('value'),
        list = _self._getList();
      list.set('items',items);
      list.setSelectionByField(value.split(','));
    },
    //设置选项集合
    _uiSetItems : function(v){
      if(v){
        this.setItems(v);
      }
    }
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * 选项
       * @type {Array}
       */
      items : {
        setter : function(v){
          if($.isPlainObject(v)){
            var rst = [];
            BUI.each(v,function(v,k){
              rst.push({value : k,text :v});
            });
            v = rst;
          }
          return v;
        }
      },
      /**
       * 列表
       * @type {BUI.List.SimpleList}
       */
      list : {

      }
    }
  },{
    xclass : 'form-field-list'
  });

  return List;
});