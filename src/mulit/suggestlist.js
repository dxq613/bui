/**
 * 输入过滤的list
 * @fileOverview
 * @ignore
 */
define('suggestlist', function(require) {
  var BUI = require('bui/common'),
    Component = BUI.Component,
    SimpleList = require('bui/list'),
    Form = require('bui/form');

  var PREFIX = BUI.prefix,
    CLS_INPUT = PREFIX + 'suggest-input',
    TPL_ITEM = '<li><span class="x-checkbox"></span>{text}</li>';

    var SuggestList = Component.Controller.extend({
      initializer: function(){
        var _self = this,
          multipleSelect = _self.get('multipleSelect'),
          xclass = multipleSelect ? 'listbox' : 'simple-list';
      },
      renderUI: function(){
        var _self = this,
          el = _self.get('el'),
          inputEl = el.find('.' + CLS_INPUT);
        _self.set('inputEl', inputEl);
      },
      bindUI: function(){
        var _self = this,
          triggerEvent = _self.get('triggerEvent'),
          inputEl = _self.get('inputEl'),
          name = _self.get('name'),
          store = _self.get('store');
        inputEl.on(triggerEvent, function(ev){
          var param = {};
          param.start = 0;
          param[name] = inputEl.val();
          store.load(param);
          //_self.clearSelection();
        });
      }
    }, {
      ATTRS: {
        tpl: {
          value: '<div><button class="button button-mini">确定</button></div>'
        },
        url: {
        },
        store: {
        },
        multipleSelect: {
          value: false
        }
      }
    }, {
      xclass: 'suggest-list'
    });
  return SuggestList;
});