/**
 * @fileOverview 侧边栏菜单
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/menu/sidemenu',['bui/common','bui/menu/menu'],function(require){

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
          titleEl = $(ev.domTarget).closest('.' + _self.get('collapsedCls'));
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
          selectable: false,
          children : [{
            xclass : 'menu',
            children : subItems
          }]
        };

      BUI.mix(cfg,{
        xclass : 'menu-item',
        elCls : 'menu-second'
      },item);

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
          xclass : 'menu-item',
          elCls : 'menu-leaf',
          tpl : _self.get('subMenuItemTpl')
        };
      return BUI.mix(cfg,subItem);
    }
  },{

    ATTRS : 
    {
      defaultChildCfg : {
        value : {
          subMenuType : 'menu',
          openable : false,
          arrowTpl : ''
        }
      },
      
      /**
       * 配置的items 项是在初始化时作为children
       * @protected
       * @type {Boolean}
       */
      autoInitItems : {
          value : false
      },
      /**
       * 菜单项的模板
       * @type {String}
       */
      itemTpl : {
        value : '<div class="'+CLS_MENU_TITLE+'"><s></s><span class="'+CLS_MENU_TITLE+'-text">{text}</span></div>'
      },
      /**
       * 子菜单的选项模板
       * @cfg {String} subMenuTpl
       */
      subMenuItemTpl : {
        value : '<a href="{href}"><em>{text}</em></a>'
      },
      /**
       * 展开收缩的样式，用来触发展开折叠事件,默认是 'bui-menu-title'
       * @type {String} 
       */
      collapsedCls : {
        value : CLS_MENU_TITLE
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