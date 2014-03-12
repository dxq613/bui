/**
 * 输入过滤的list
 * @fileOverview
 * @ignore
 */
define('suggestlist', function(require) {
  var BUI = require('bui/common'),
    SimpleList = require('bui/list').SimpleList;

  var PREFIX = BUI.prefix,
    CLS_INPUT = PREFIX + 'suggest-input',
    TPL_ITEM = '<li><span class="x-checkbox"></span>{text}</li>';

    var SuggestList = SimpleList.extend({
      initializer: function(){
        var _self = this,
          multipleSelect = _self.get('multipleSelect');
        if(multipleSelect){
          _self.set('itemTpl', TPL_ITEM);
        }
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
      },
      _uiSetName: function(v){
        this.get('inputEl').attr('name', v);
      }
    }, {
      ATTRS: {
        name: {
          value: 'key'
        },
        tpl: {
          value: '<input type="text" class="' + CLS_INPUT + '"/><ul></ul>'
        },
        triggerEvent: {
          value: 'change keyup'
        }
      }
    }, {
      xclass: 'suggest-list'
    });
  return SuggestList;
});