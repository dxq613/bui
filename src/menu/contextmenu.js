/**
 * @fileOverview 弹出菜单，一般用于右键菜单
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/memu/contextmenu',['bui/common','bui/menu/menuitem','bui/menu/popmenu'],function (require) {

  var BUI = require('bui/common'),
    MenuItem = require('bui/menu/menuitem'),
    PopMenu = require('bui/menu/popmenu'),
    PREFIX = BUI.prefix,
    CLS_Link = PREFIX + 'menu-item-link',
    CLS_ITEM_ICON =  PREFIX + 'menu-item-icon',
    Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * 上下文菜单项
   * xclass:'context-menu-item'
   * @class BUI.Menu.ContextMenuItem 
   * @extends BUI.Menu.MenuItem
   */
  var contextMenuItem = MenuItem.extend({
   
    bindUI:function(){
      var _self = this;

      _self.get('el').delegate('.' + CLS_Link,'click',function(ev){
        ev.preventDefault();
      });
    }, 
    //设置图标样式
    _uiSetIconCls : function (v,ev) {
      var _self = this,
        preCls = ev.prevVal,
        iconEl = _self.get('el').find('.'+CLS_ITEM_ICON);
      iconEl.removeClass(preCls);
      iconEl.addClass(v);
    }
  },{

    ATTRS:
    {
      /**
       * 显示的文本
       * @type {String}
       */
      text:{
        veiw:true,
        value:''
      },
      /**
       * 菜单项图标的样式
       * @type {String}
       */
      iconCls:{
        sync:false,
        value:''
      },
      tpl:{
        value:'<a class="' + CLS_Link + '" href="#">\
        <span class="' + CLS_ITEM_ICON + ' {iconCls}"></span><span class="' + PREFIX + 'menu-item-text">{text}</span></a>'
      }
    }
  },{
    xclass:'context-menu-item'
  });

  /**
   * 上下文菜单，一般用于弹出菜单
   * xclass:'context-menu'
   * @class BUI.Menu.ContextMenu
   * @extends BUI.Menu.PopMenu
   */
  var contextMenu = PopMenu.extend({

  },{
    ATTRS:{
      /**
       * 子类的默认类名，即类的 xclass
       * @type {String}
       * @override
       * @default 'menu-item'
       */
      defaultChildClass : {
        value : 'context-menu-item'
      },
      align : {
        value : null
      }
    }
  },{
    xclass:'context-menu'
  });

  contextMenu.Item = contextMenuItem;
  return contextMenu;
});
