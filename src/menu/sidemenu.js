/**
 * @fileOverview 侧边栏菜单
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/menu/sidemenu',function(require){

  var BUI = require('bui/common'),
    Menu = require('bui/menu/menu'),
    Component =  BUI.Component,
    CLS_MENU_TITLE = BUI.prefix + 'menu-title',
    CLS_MENU_LEAF = 'menu-leaf';
    
  /**
   * 侧边栏菜单
   * xclass:'side-menu'
   * @class BUI.Menu.SideMenu
   * @extends BUI.Menu.Menu
   */
  var sideMenu = Menu.extend(
  /**
   * @lends BUI.Menu.SideMenu.prototype
   * @ignore
   */
  {
    //初始化配置项
    initializer : function(){
      var _self = this,
        items = _self.get('items'),
        children = _self.get('children');

      BUI.each(items,function(item){
        var menuCfg = _self._initMenuCfg(item);
        children.push(menuCfg);
      });
    },
    bindUI : function(){
      var _self = this,
        children = _self.get('children');
      BUI.each(children,function(item){
        var menu = item.get('children')[0];
        if(menu){
          menu.publish('click',{
            bubbles:1
          });
        }
      });
      //防止链接跳转
      _self.get('el').delegate('a','click',function(ev){
        ev.preventDefault();
      });
      //处理点击事件，展开、折叠、选中
      _self.on('itemclick',function(ev){
        var item = ev.item,
          titleEl = $(ev.domTarget).closest('.' + CLS_MENU_TITLE);
        if(titleEl.length){
          var collapsed = item.get('collapsed');
            item.set('collapsed',!collapsed);
        }else if(item.get('el').hasClass(CLS_MENU_LEAF)){
          _self.fire('menuclick',{item:item});
          _self.clearSelection();
          _self.setSelected(item);
        }
      });
    },
    /**
     * @protected
     * @ignore
     */
    getItems:function(){
      var _self = this,
        items = [],
        children = _self.get('children');
      BUI.each(children,function(item){
        var menu = item.get('children')[0];
        items = items.concat(menu.get('children'));
      }); 
      return items;
    },
    //初始化菜单配置项
    _initMenuCfg : function(item){
      var _self = this,
        items = item.items,
        subItems = [],
        cfg = {
          xclass : 'menu-item',
          elCls : 'menu-second',
          collapsed : item.collapsed,
          selectable: false,
          children : [{
            xclass : 'menu',
            children : subItems
          }],
          content: '<div class="'+CLS_MENU_TITLE+'"><s></s><span class="'+CLS_MENU_TITLE+'-text">'+item.text+'</span></div>'
        };
      BUI.each(items,function(subItem){
        var subItemCfg = _self._initSubMenuCfg(subItem);
        subItems.push(subItemCfg);
      });

      return cfg;

    },
    //初始化二级菜单
    _initSubMenuCfg : function(subItem){
      var _self = this,
        cfg = {
          id : subItem.id,
          xclass : 'menu-item',
          elCls : 'menu-leaf',
          tpl : '<a href="{href}"><em>{text}</em></a>',
          href : subItem.href,
          text : subItem.text
        };
      return cfg;
    }
  },{

    ATTRS : 
    /**
     * @lends BUI.Menu.SideMenu.prototype
     * @ignore
     */
    {
      
      /**
       * 配置的items 项是在初始化时作为children
       * @protected
       * @type {Boolean}
       */
      autoInitItems : {
          value : false
      },
      events : {
        value : {
          /**
           * 点击菜单项
		       * @name BUI.Menu.SideMenu#menuclick
           * @event 
           * @param {Object} e 事件对象
           * @param {Object} e.item 当前选中的项
           */
          'menuclick' : false
        }
      }
    }
  },{
    xclass :'side-menu'
  });

  return sideMenu;
});