/**
 * @fileOverview 
 * @ignore
 */

define('bui/tab/tabpanelitem',['bui/common','bui/tab/tabitem','bui/tab/panelitem'],function (require) {
  

  var BUI = require('bui/common'),
    TabItem = require('bui/tab/tabitem'),
    PanelItem = require('bui/tab/panelitem'),
    Component = BUI.Component;

  /**
   * @private
   * @class BUI.Tab.TabPanelItemView
   * @extends BUI.Tab.TabItemView
   * 存在面板的标签项视图层对象
   */
  var itemView = TabItem.View.extend([Component.UIBase.Close.View],{
  },{
    xclass:'tab-panel-item-view'
  });


  /**
   * 标签项
   * @class BUI.Tab.TabPanelItem
   * @extends BUI.Tab.TabItem
   * @mixins BUI.Tab.PanelItem
   * @mixins BUI.Component.UIBase.Close
   */
  var item = TabItem.extend([PanelItem,Component.UIBase.Close],{
    
  },{
    ATTRS : 
    {
      /**
       * 关闭时直接销毁标签项，执行remove方法
       * @type {String}
       */
      closeAction : {
        value : 'remove'
      },
      events : {
        value : {
          beforeclosed : true
        }
      },
      xview:{
        value:itemView
      }
    }
  },{
    xclass:'tab-panel-item'
  });
  
  item.View = itemView;
  return item;

});