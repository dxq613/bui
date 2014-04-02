/**
 * @fileOverview 选择器
 * @ignore
 */

define('bui/extensions/multiselect/multilistpicker', ['bui/overlay', 'bui/picker'], function (require) {
  
  var Dialog = require('bui/overlay').Dialog,
    Mixin = require('bui/picker').Mixin;

  var MultilistPicker = Dialog.extend([Mixin], {
    /**
     * 设置选中的值
     * @template
     * @protected
     * @param {String} val 设置值
     */
    setSelectedValue : function(val){
      var _self = this,
        innerControl = _self.get('innerControl'),
        store = innerControl.get('store');

      if(!this.get('isInit') && val){
        val = val.split(',');

        function syncValue(){
          _self._syncValue(val);
          store.off('load', syncValue);
        }

        if(store.get('url')){
          store.on('load', syncValue);
        }
        else{
          _self._syncValue(val);
        }
      }
    },
    _syncValue: function(val){
      var _self = this,
        innerControl = _self.get('innerControl'),
        textField = _self._getTextField(),
        idField = innerControl.get('source').get('idField'),
        store = innerControl.get('store'),
        result = store.getResult(),
        target = [],
        text = [];

      BUI.each(result, function(item){
        if($.inArray(item[idField], val) !== -1){
          target.push(item);
          text.push(item['text']);
        }
      });
      $(textField).val(text.join(','));
      //store.setResult(source);
      BUI.each(target, function(item){
        store.remove(item);
      })
      innerControl.get('target').setItems(target);
    },
    /**
     * 获取选中的值，多选状态下，值以','分割
     * @template
     * @protected
     * @return {String} 选中的值
     */
    getSelectedValue : function(){
      var _self = this, 
        innerControl = _self.get('innerControl'),
        target = innerControl.get('target');
      return _self._getItemsValue(target);
    },
    /**
     * 获取选中项的文本，多选状态下，文本以','分割
     * @template
     * @protected
     * @return {String} 选中的文本
     */
    getSelectedText : function(){
      var _self = this, 
        innerControl = _self.get('innerControl'),
        target = innerControl.get('target');
      return _self._getItemsText(target);
    },
    _getItemsText: function(list, items){
      if(!items){
        items = list.get('items');
      }
      return $.map(items, function(item){
          return list.getItemText(item);
      });
    },
    _getItemsValue: function(list, items){
      var field = list.get('idField');
      if(!items){
        items = list.get('items');
      }
      return $.map(items,function(item){
        return list.getValueByField(item, field);
      });
    }
  },{
    ATTRS : {
      /**
      * 点击成功时的回调函数
      * @cfg {Function} success
      */
      success : {
        value : function(){
          var _self = this;
          _self.get('innerControl').fire(_self.get('changeEvent'));
          this.close();
        }
      }
    }
  },{
    xclass:'multilist-picker'
  });

  return MultilistPicker;
});