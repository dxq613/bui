/**
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
        textField: inputEl,
        valueField: _self.get('valueField'),
        children: [multilist]
      }).render();
    },
    bindUI: function(){
      var _self = this,
        multilist = _self.get('multilist');
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
      valueField: {

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
});