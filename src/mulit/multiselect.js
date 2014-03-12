/**
 * list左右选择
 * @fileOverview
 * @ignore
 */
 define('multiselect', function(require){
  var BUI = require('bui/common'),
    Component = BUI.Component,
    MultiList = require('multilist'),
    Overlay = require('bui/overlay');

  var CLS_INPUT = BUI.prefix + 'multiselect-text'

  var MultiSelect = Component.Controller.extend({
    initializer: function(){
      var _self = this,
        dialog = _self.get('dialog');

      if(!dialog.isController){
        dialog.success = function(){
          if(_self.fire('beforesuccess') === false){
            return;
          }
          _self._setTextField();
          this.close();
          _self.fire('aftersuccess');
        }
        dialog = new Overlay.Dialog(dialog);
        _self.set('dialog', dialog);
      }
      _self._initMultiList();
    },
    _initMultiList: function(){
      var _self = this, 
        source = _self.get('source'),
        target = _self.get('target'),
        multilist = _self.get('multilist');
      if(!multilist.isController){
        multilist = new MultiList(multilist);
        _self.set('multilist', multilist);
      }
    },
    renderUI: function(){
      var _self = this;
    },
    bindUI: function(){
      var _self = this,
        textField = _self.get('textField'),
        triggerEvent = _self.get('triggerEvent'),
        dialog = _self.get('dialog'),
        multilist = _self.get('multilist');

      dialog.on('show', function(ev){
        if(!multilist.get('rendered')){
          multilist.set('render', dialog.get('body'));
          multilist.render();
        }
      });

      textField.on(triggerEvent, function(){
        dialog.show();
      });
    },
    _setTextField: function(){
      var _self = this,
        target = _self.get('multilist').get('target'),
        textField = _self.get('textField'),
        valueField = _self.get('valueField');
        itemsText = _self._getItemsText(target, target.getItems()),
        itemsValue = _self._getItemsValue(target, target.getItems());
      textField.val(itemsText.join(','));
      valueField.val(itemsValue.join(','));
    },
    _getItemsText: function(list, items){
      return $.map(items,function(item){
          return list.getItemText(item);
      });
    },
    _getItemsValue: function(list, items){
      var field = list.get('idField')
          return $.map(items,function(item){
              return list.getValueByField(item, field);
          });

    }
  }, {
    ATTRS: {
      source: {

      },
      target: {

      },
      /**
       * textField的class
       * @type {String}
       * @protected
       */
      inputCls: {
        value: CLS_INPUT
      },
      textField: {
        getter: function(){
          return this.get('el').find('.' + CLS_INPUT);
        }
      },
      valueField: {
        getter: function(v){
          return $(v);
        }
      },
      dialog: {
        value: {}
      },
      triggerEvent: {
        value: 'click'
      },
      tpl : {
        view:true,
        value : '<input type="text" readonly="readonly" class="' + CLS_INPUT + '"/><span class="x-icon x-icon-normal"><i class="icon icon-caret icon-caret-down"></i></span>'
      }
    }
  }, {
    xclass: 'multiselect'
  });

  return MultiSelect;
});