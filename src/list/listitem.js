/**
 * @fileOverview 列表项
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/list/listitem',['bui/common'],function (require) {


  var BUI = require('bui/common'),
    Component = BUI.Component,
    UIBase = Component.UIBase;
    
  /**
   * @private
   * @class BUI.List.ItemView
   * @extends BUI.Component.View
   * @mixins BUI.Component.UIBase.ListItemView
   * 列表项的视图层对象
   */
  var itemView = Component.View.extend([UIBase.ListItemView],{
  });

  /**
   * 列表项
   * @private
   * @class BUI.List.ListItem
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ListItem
   */
  var item = Component.Controller.extend([UIBase.ListItem],{
    
  },{
    ATTRS : 
    {
      elTagName:{
        view:true,
        value:'li'
      },
      xview:{
        value:itemView
      },
      tpl:{
        view:true,
        value:'<span>{text}</span>'
      }
    }
  },{
    xclass:'list-item'
  });

  item.View = itemView;
  
  return item;
});