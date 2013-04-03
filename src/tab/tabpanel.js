/**
 * @fileOverview 每个标签对应一个面板
 * @ignore
 */

define('bui/tab/tabpanel',function (require) {
  
  var BUI = require('bui/common'),
    Tab = require('bui/tab/tab');

  /**
   * 带有面板的切换标签
   * @class BUI.Tab.TabPanel
   * @extends BUI.Tab.Tab
   */
  var tabPanel = Tab.extend({
    initializer : function(){
      var _self = this,
        children = _self.get('children'),
        panelContainer = $(_self.get('panelContainer')),
        panelCls = _self.get('panelCls'),
        panels = panelCls ? panelContainer.find('.' + panels) : panelContainer.children();

      BUI.each(children,function(item,index){
        if(item.set){
          item.set('panel',panels[index]);
        }else{
          item.panel = panels[index];
        }
      });
    }
  },{
    ATTRS : {

      /**
       * 默认子控件的xclass
       * @type {String}
       */
      defaultChildClass:{
        value : 'tab-panel-item'
      },
      /**
       * 面板的容器
       * @type {String|HTMLElement|jQuery}
       */
      panelContainer : {
        
      },
      /**
       * panel 面板使用的样式，如果初始化时，容器内已经存在有该样式的DOM，则作为面板使用
       * 对应同一个位置的标签项,如果为空，默认取面板容器的子元素
       * @type {String}
       */
      panelCls : {

      }
    }
  },{
    xclass : 'tab-panel'
  });

  return tabPanel;
});