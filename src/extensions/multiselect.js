/**
 * list左右选择
 * @fileOverview
 * @ignore
 */
define('bui/extensions/multiselect/multilist', ['bui/common', 'bui/list'], function(require){
  var BUI = require('bui/common'),
    Component = BUI.Component,
    List = require('bui/list');

  //设置Controller的属性
  function setControllerAttr(control, key, value) {
    if (BUI.isFunction(control.set)) {
      control.set(key, value);
    }
    else {
      control[key] = value;
    }
  }

  var PREFIX = BUI.prefix,
    CLS_SOURCE = PREFIX + 'multilist-source',
    CLS_TARGET = PREFIX + 'multilist-target',
    CLS_BUTTON_RIGHT = PREFIX + 'multilist-btn-right',
    CLS_BUTTON_LEFT = PREFIX + 'multilist-btn-left';

  var MultiList = Component.Controller.extend({
    renderUI: function(){
      var _self = this,
        source = _self.get('source'),
        target = _self.get('target');

      source = _self._initControl(source, CLS_SOURCE);
      target = _self._initControl(target, CLS_TARGET);

      
      source.render();
      target.render();

      _self.set('source', source);
      _self.set('target', target);
    },
    _initControl: function(control, renderCls){
      var _self = this,
        el = _self.get('el');

      //如果已经是一个控件了，则直接返回
      if(control.isController){
        control.set('render', el.find('.' + renderCls));
        return control;
      }
      control.render = el.find('.' + renderCls);
      return _self._createControl(control);
    },
    _createControl: function(config){
      if(config.isController){
        return config;
      }
      var multipleSelect = config.multipleSelect || this.get('multipleSelect'),
        //如果已经传了xclass则优先使用xclass
        xclass = config.xclass || multipleSelect ? 'listbox' : 'simple-list';
      config.xclass = xclass;
      return Component.create(config, this);
    },
    bindUI: function(){
      var _self = this,
        el = _self.get('el'),
        source = _self.get('source'),
        target = _self.get('target'),
        buttonRight = el.find('.' + CLS_BUTTON_RIGHT),
        buttonLeft = el.find('.' + CLS_BUTTON_LEFT);

      /*source.on('itemsshow', function(){
        _self.syncSourceItems();
      })*/

      buttonRight.on('click', function(ev){
        var selection = source.getSelection();
        if(_self.fire('selected', {items: selection}) !== false){
          source.removeItems(selection);
          target.addItems(selection);
        }
      });
      buttonLeft.on('click', function(ev){
        var selection = target.getSelection();
        if(_self.fire('unselected', {items: selection}) !== false){
          target.removeItems(selection);
          source.addItems(selection);
        }
      });
      source.on('dblclick',function(ev){
        var element = $(ev.domTarget).closest('li'),
          item = source.getItemByElement(element);
        if(_self.fire('selected', {items: [item]}) !== false){
          source.removeItem(item);
          target.addItem(item);
        }
      });
      target.on('dblclick',function(ev){
        var element = $(ev.domTarget).closest('li'),
          item = target.getItemByElement(element);
        if(_self.fire('unselected', {items: [item]}) !== false){
          target.removeItem(item);
          source.addItem(item);
        }
      });
    },
    //设置store时直接过滤选项
    _uiSetStore: function(store){
      var _self = this,
        target = _self.get('target'),
        idField = target.get('idField');
      store.filter(function(item){
        var items = target.getItems(),
          flag = true;
        BUI.each(items, function(i){
          if(i[idField] === item[idField]){
            flag = false;
            return false;
          }
        });
        return flag;
      })
    }
  }, {
    ATTRS: {
      source:{
        value: {
          elCls:'bui-select-list'
        },
        shared: false
      },
      target: {
        value: {
          elCls:'bui-select-list'
        },
        shared: false
      },
      store: {
        setter: function(v){
          setControllerAttr(this.get('source'), 'store', v);
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
      url: {
        setter: function(v){
          if(!v){
            return;
          }
          var store = new BUI.Data.Store({
            url: v,
            autoLoad: true
          });
          this.set('store', store);
          return v;
        }
      },
      tpl: {
        value: '<div class="row">' +
                '<div class="span5 ' + CLS_SOURCE + '"></div>' + 
                '<div class="span2 bui-multilist-action centered">' + 
                '<p><button  class="button button-small ' + CLS_BUTTON_RIGHT + '" type="button">&gt;&gt;</button></p>' + 
                '<p><button  class="button button-small ' + CLS_BUTTON_LEFT + '" type="button">&lt;&lt;</button></p>' + 
                '</div>' + 
                '<div class="span5 ' + CLS_TARGET + '"></div>' + 
              '</div>'
      }
    }
  }, {
    xclass: 'multilist'
  });

  return MultiList;
});/**
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
});/**
 * list左右选择
 * @fileOverview
 * @ignore
 */
define('bui/extensions/multiselect/multiselect',['bui/common', 'bui/extensions/multiselect/multilist', 'bui/extensions/multiselect/multilistpicker', 'bui/extensions/search'], function(require){
  var BUI = require('bui/common'),
    Component = BUI.Component,
    MultiList = require('bui/extensions/multiselect/multilist'),
    MultiListPicker = require('bui/extensions/multiselect/multilistpicker'),
    Search = require('bui/extensions/search');

  var CLS_INPUT = BUI.prefix + 'select-input';


  var MultiSelect = Component.Controller.extend({
    initializer: function(){
      var _self = this,
        search = _self.get('search'),
        searchTpl = _self.get('searchTpl'),
        searchCfg = {},
        plugins;
      if(search){
        if(searchTpl){
          searchCfg.tpl = searchTpl;
        }
        search = new Search(searchCfg);
        plugins = [search];
      }

      var multilist = new MultiList({
        items: _self.get('items'),
        url: _self.get('url'),
        plugins: plugins
      });

      _self.set('multilist', multilist);
    },
    renderUI: function(){
      var _self = this,
        el = _self.get('el'),
        inputEl = el.find('.' + CLS_INPUT),
        multilist = _self.get('multilist');

      var picker = new MultiListPicker({
        trigger: inputEl,
        autoRender: true,
        textField: inputEl,
        valueField: _self.get('valueField'),
        children: [multilist]
      });
      _self.set('picker', picker);
      _self.set('textField', inputEl);
    },
    bindUI: function(){
      var _self = this,
        multilist = _self.get('multilist');

      multilist.on('selected', function(ev){
        var items = ev.items;
        return _self.fire('selected', {items: items});
      });
      multilist.on('unselected', function(ev){
        var items = ev.items;
        return _self.fire('unselected', {items: items});
      })
    }
  }, {
    ATTRS: {
      elCls: {
        value: 'bui-select'
      },
      searchTpl: {

      },
      search: {

      },
      url: {

      },
      items: {

      },
      source: {
        getter: function(){
          return this.get('multilist').get('source');
        }
      },
      target: {
        getter: function(){
          return this.get('multilist').get('target');
        }
      },
      valueField: {
        setter: function(v){
          return $(v);
        }
      },
      textField: {

      },
      tpl : {
        view:true,
        value : '<input type="text" readonly="readonly" class="'+CLS_INPUT+'"/><span class="x-icon x-icon-normal"><i class="icon icon-caret icon-caret-down"></i></span>'
      }
    }
  }, {
    xclass: 'multiselect'
  });

  return MultiSelect;
});/**
 * @fileOverview 选择框命名空间入口文件
 * @ignore
 */

define('bui/extensions/multiselect', ['bui/common', 'bui/extensions/multiselect/multilist', 'bui/extensions/multiselect/multilistpicker','bui/extensions/multiselect/multiselect', 'bui/extensions/search'], function (require) {

  var BUI = require('bui/common'),
    multiselect = require('bui/extensions/multiselect/multiselect');
  return multiselect;
});