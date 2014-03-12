/**
 * list左右选择
 * @fileOverview
 * @ignore
 */
define('multilist', function(require){
  var BUI = require('bui/common'),
    Component = BUI.Component;

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
      var multipleSelect = config.multipleSelect,
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
    }/*,
    syncUI: function(){
      this.syncSourceItems();
    },
    syncSourceItems: function(){
      var _self = this,
        target = _self.get('target'),
        source = _self.get('source'),
        idField = source.get('idField'),
        targetItems = target.getItems(),
        sourceItems = source.getItems();

      BUI.each(sourceItems, function(sourceItem){
        var flag = true;
        BUI.each(targetItems, function(item){
          if(item[idField] === sourceItem[idField]){
            flag = false;
            source.removeItem(sourceItem);
            return false;
          }
        })
        return flag;
      });
    }*/
  }, {
    ATTRS: {
      source:{
      },
      target: {
      },
      tpl: {
        value: '<div class="row">' +
                '<div class="span5 ' + CLS_SOURCE + '"></div>' + 
                '<div class="span2 bui-multilist-action">' + 
                  '<button  class="button button-small ' + CLS_BUTTON_RIGHT + '" type="button">>></button>' + 
                  '<button  class="button button-small ' + CLS_BUTTON_LEFT + '" type="button"><<</button>' + 
                '</div>' + 
                '<div class="span5 ' + CLS_TARGET + '"></div>' + 
              '</div>'
      }
    }
  }, {
    xclass: 'multilist'
  });

  return MultiList;
});