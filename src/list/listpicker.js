/**
 * @fileOverview 列表项的选择器
 * @ignore
 */

define('bui/list/listpicker',function (require) {

  var Picker = require('bui/overlay').Picker,
    /**
     * 列表选择器
     * @class BUI.List.Picker
     * @extends BUI.Overlay.Picker
     */
    listPicker = Picker.extend({
      initializer : function(){
        var _self = this,
          children = _self.get('children'),
          list = _self.get('list');
        if(!list){
          children.push({

          });
        }
      },
      /**
       * 设置选中的值
       * @param {String} val 设置值
       */
      setSelectedValue : function(val){
        val = val ? val.toString() : '';
        var _self = this,
          list = _self.get('list'),
          selectedValue = _self.getSelectedValue();
        if(val !== selectedValue){
          if(list.get('multipleSelect')){
            list.clearSelection();
          }
          list.setSelectionByField(val.split(','));
        }   
      },
      /**
       * 获取选中的值，多选状态下，值以','分割
       * @return {String} 选中的值
       */
      getSelectedValue : function(){
        return this.get('list').getSelectionValues().join(',');
      },
      /**
       * 获取选中项的文本，多选状态下，文本以','分割
       * @return {String} 选中的文本
       */
      getSelectedText : function(){
        return this.get('list').getSelectionText().join(',');
      }
    },{
      ATTRS : {
        /**
         * 默认子控件的样式,默认为'simple-list'
         * @type {String}
         * @override
         */
        defaultChildClass:{
          value : 'simple-list'
        },
        /**
         * 选择的列表
         * @type {BUI.List.SimpleList}
         * @readOnly
         */
        list : {
          getter:function(){
            return this.get('children')[0];
          }
        }
      }
    },{
      xclass : 'list-picker'
    });

  return listPicker;
});