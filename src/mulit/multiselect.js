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

  //设置Controller的属性
  function setControllerAttr(control, key, value) {
    if (BUI.isFunction(control.set)) {
      control.set(key, value);
    }
    else {
      control[key] = value;
    }
  }

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
    //初始化左右选择列表
    _initMultiList: function(){
      var _self = this, 
        source = _self.get('source'),
        target = _self.get('target'),
        multilist = _self.get('multilist');
      if(!multilist || !multilist.isController){
        multilist = new MultiList({
          source: source,
          target: target,
          multipleSelect: _self.get('multipleSelect')
        });
        _self.set('multilist', multilist);
        
      }
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
          // _self.set('source', source);
          // _self.set('target', target);
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
    },
    _uiSetStore: function(store){
      var _self = this;
      store.on('load', function(ev){
        var result = store.filter(function(item){
          
        })
      });
    },
    syncUI: function(){
      var _self = this,
        store = _self.get('store'),
        valueField = _self.get('valueField'),
        value = $(valueField).val();

      function sysText(){
        _self._syncText(store, value);
        store.off(sysText);
      }
      
      if(value){
        if(store.get('url')){
          store.on('load', sysText);
        }
        else{
          _self._syncText(store, value);
        }
        
      }
    },
    _syncText: function(store, val){
      var _self = this,
        store = _self.get('store'),
        idField = _self.get('idField'),
        arr = val.split(','),
        source = [],
        result = [];
      store.filter(function(item){
        if($.inArray(item[idField], arr) !== -1){
          result.push(item);
        }
        else{
          source.push(item);
        }
      });
      store.setResult(source);
      setControllerAttr(_self.get('target'), 'items', result);
    }
  }, {
    ATTRS: {
      source: {
        value: {
          elCls:'bui-select-list'
        }
      },
      target: {
        value: {
          elCls:'bui-select-list'
        }
      },
      multilist: {
      },
      multipleSelect: {
        value: false
      },
      store: {
        setter: function(v){
          setControllerAttr(this.get('source'), 'store', v);
          return v;
        }
      },
      url: {
        setter: function(v){
          var store = new BUI.Data.Store({
            url: v,
            autoLoad: true
          });
          this.set('store', store);
          return v;
        }
      },
      items: {
        setter: function(v){
          var store = new BUI.Data.Store({
            data: v
          });
          this.set('store', store);
          return v;
        }
      },
      dialog: {
        value: {},
        shared: false
      },
      title: {
        setter: function(v){
          setControllerAttr(this.get('dialog'), 'title', v);
          return v;
        }
      },
      /**
       * textField的class
       * @type {String}
       * @protected
       */
      inputCls: {
        value: CLS_INPUT
      },
      idField: {
        value: 'value'
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