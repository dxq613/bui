/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/menu',['bui/common','bui/menu/menu','bui/menu/menuitem','bui/memu/contextmenu','bui/menu/popmenu','bui/menu/sidemenu'],function (require) {
  
  var BUI = require('bui/common'),
    Menu = BUI.namespace('Menu');
  BUI.mix(Menu,{
    Menu : require('bui/menu/menu'),
    MenuItem : require('bui/menu/menuitem'),
    ContextMenu : require('bui/memu/contextmenu'),
    PopMenu : require('bui/menu/popmenu'),
    SideMenu : require('bui/menu/sidemenu')
  });

  Menu.ContextMenuItem = Menu.ContextMenu.Item;
  return Menu;
});
define('bui/menu/menuitem',['bui/common'],function(require){

  var BUI = require('bui/common'),
      Component =  BUI.Component,
      UIBase = Component.UIBase,
      PREFIX = BUI.prefix,
      CLS_OPEN = PREFIX + 'menu-item-open',
      CLS_CARET = 'x-caret',
      CLS_COLLAPSE = PREFIX + 'menu-item-collapsed',
      DATA_ID = 'data-id';

  /**
   * @private
   * @class BUI.Menu.MenuItemView
   * @mixins BUI.Component.UIBase.ListItemView
   * @mixins BUI.Component.UIBase.CollapseableView
   * \u83dc\u5355\u9879\u7684\u89c6\u56fe\u7c7b
   */
  var menuItemView = Component.View.extend([UIBase.ListItemView,UIBase.CollapseableView],{

    _uiSetOpen : function (v) {
      var _self = this,
        cls = _self.getStatusCls('open');
      if(v){
        _self.get('el').addClass(cls);
      }else{
        _self.get('el').removeClass(cls);
      }
    }
  },{
    ATTRS : {
    }
  },{
    xclass:'menu-item-view'
  });

  /**
   * \u83dc\u5355\u9879
   * @class BUI.Menu.MenuItem
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ListItem
   */
  var menuItem = Component.Controller.extend([UIBase.ListItem,UIBase.Collapseable],{
    /**
     * \u6e32\u67d3
     * @protected
     */
    renderUI : function(){
      var _self = this,
        el = _self.get('el'),
        id = _self.get('id'),
        temp = null;
      //\u672a\u8bbe\u7f6eid\u65f6\u81ea\u52a8\u751f\u6210
      if(!id){
        id = BUI.guid('menu-item');
        _self.set('id',id);
      }
      el.attr(DATA_ID,id);   
    },
     /**
     * \u5904\u7406\u9f20\u6807\u79fb\u5165
     * @protected
     */
    handleMouseEnter : function (ev) {
      var _self = this;
      if(this.get('subMenu')){
        this.set('open',true);
      }
      menuItem.superclass.handleMouseEnter.call(this,ev);
    },
    /**
     * \u5904\u7406\u9f20\u6807\u79fb\u51fa
     * @protected
     */
    handleMouseLeave :function (ev) {
      var _self = this,
        subMenu = _self.get('subMenu'),
        toElement = ev.toElement;
      if(toElement && subMenu && subMenu.containsElement(toElement)){
        _self.set('open',true);
      }else{
        _self.set('open',false);
      }
      menuItem.superclass.handleMouseLeave.call(this,ev);
    },
    /**
     * \u81ea\u5df1\u548c\u5b50\u83dc\u5355\u662f\u5426\u5305\u542b
     * @override
     */
    containsElement:function (elem) {
      var _self = this,
        subMenu,
        contains = menuItem.superclass.containsElement.call(_self,elem);
      if(!contains){
        subMenu = _self.get('subMenu');
        contains = subMenu && subMenu.containsElement(elem);
      }
      return contains;
    }, 
    //\u8bbe\u7f6e\u6253\u5f00\u5b50\u83dc\u5355 
    _uiSetOpen : function (v) {
      var _self = this,
        subMenu = _self.get('subMenu'),
        subMenuAlign = _self.get('subMenuAlign');
      if(subMenu){
        if(v){
          subMenuAlign.node = _self.get('el');
          subMenu.set('align',subMenuAlign);
          subMenu.show();
        }else{
          var menuAlign = subMenu.get('align');
          //\u9632\u6b62\u5b50\u83dc\u5355\u88ab\u516c\u7528\u65f6
          if(!menuAlign || menuAlign.node == _self.get('el')){
            subMenu.hide();
          }
          
        }
      }
    },
    //\u8bbe\u7f6e\u4e0b\u7ea7\u83dc\u5355
    _uiSetSubMenu : function (subMenu) {
      if(subMenu){
        var _self = this,
          el = _self.get('el'),
          parent = _self.get('parent');
        //\u8bbe\u7f6e\u83dc\u5355\u9879\u6240\u5c5e\u7684\u83dc\u5355\u4e3a\u4e0a\u4e00\u7ea7\u83dc\u5355
        if(!subMenu.get('parentMenu')){
          subMenu.set('parentMenu',parent);
          if(parent.get('autoHide')){
            subMenu.set('autoHide',false);
          } 
        }
        $(_self.get('arrowTpl')).appendTo(el);
      }
    },
    /** 
     * \u6790\u6784\u51fd\u6570
     * @protected
     */
    destructor : function () {
      var _self = this,
        subMenu = _self.get('subMenu');
      if(subMenu){
        subMenu.destroy();
      }
    }

  },{
    ATTRS : 
    /**
     * @lends BUI.Menu.MenuItem#
     * @ignore
     */
    {
      /**
       * \u9ed8\u8ba4\u7684Html \u6807\u7b7e
       * @type {String}
       */
      elTagName : {
          value: 'li'
      },
      xview : {
        value : menuItemView
      },
      /**
       * \u83dc\u5355\u9879\u662f\u5426\u5c55\u5f00\uff0c\u663e\u793a\u5b50\u83dc\u5355
       * @cfg {Boolean} [open=false]
       */
      /**
       * \u83dc\u5355\u9879\u662f\u5426\u5c55\u5f00\uff0c\u663e\u793a\u5b50\u83dc\u5355
       * @type {Boolean}
       * @default false
       */
      open :{
        view : true,
        value : false
      },
      /**
       * \u4e0b\u7ea7\u83dc\u5355
       * @cfg {BUI.Menu.Menu} subMenu
       */
      /**
       * \u4e0b\u7ea7\u83dc\u5355
       * @type {BUI.Menu.Menu}
       */
      subMenu : {
        view : true
      },
       /**
       * \u4e0b\u7ea7\u83dc\u5355\u548c\u83dc\u5355\u9879\u7684\u5bf9\u9f50\u65b9\u5f0f
       * @type {Object}
       * @protected
       * @default \u9ed8\u8ba4\u5728\u4e0b\u9762\u663e\u793a
       */
      subMenuAlign : {
        valueFn : function (argument) {
          return {
             //node: this.get('el'), // \u53c2\u8003\u5143\u7d20, falsy \u6216 window \u4e3a\u53ef\u89c6\u533a\u57df, 'trigger' \u4e3a\u89e6\u53d1\u5143\u7d20, \u5176\u4ed6\u4e3a\u6307\u5b9a\u5143\u7d20
             points: ['tr','tl'], // ['tr', 'tl'] \u8868\u793a overlay \u7684 tl \u4e0e\u53c2\u8003\u8282\u70b9\u7684 tr \u5bf9\u9f50
             offset: [-5, 0]      // \u6709\u6548\u503c\u4e3a [n, m]
          }
        }
      },
      /**
       * \u5f53\u5b58\u5728\u5b50\u83dc\u5355\u65f6\u7684\u7bad\u5934\u6a21\u7248
       * @protected
       * @type {String}
       */
      arrowTpl : {
        value : '<span class="' + CLS_CARET + ' ' + CLS_CARET + '-left"></span>'
      },
      events : {
        value : {
          'afterOpenChange' : true
        }
      }
    }
  },{
    xclass : 'menu-item',
    priority : 0
  });

  var separator = menuItem.extend({

  },{
    ATTRS : {
      focusable : {
        value : false
      },
      selectable:{
        value : false
      },
      handleMouseEvents:{
        value:false
      }
    }
  },{
    xclass:'menu-item-sparator'
  });

  menuItem.View = menuItemView;
  menuItem.Separator = separator;
  
  return menuItem;
});
define('bui/menu/menu',['bui/common'],function(require){

  var BUI = require('bui/common'),
    Component =  BUI.Component,
    UIBase = Component.UIBase;

  /**
   * \u83dc\u5355
   * xclass:'menu'
   * <img src="../assets/img/class-menu.jpg"/>
   * @class BUI.Menu.Menu
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ChildList
   */
  var Menu = Component.Controller.extend([UIBase.ChildList],{
	  /**
     * \u7ed1\u5b9a\u4e8b\u4ef6
     * @protected
     */
	  bindUI:function(){
      var _self = this;

      _self.on('click',function(e){
        var item = e.target,
          multipleSelect = _self.get('multipleSelect');
        if(_self != item){
          //\u5355\u9009\u60c5\u51b5\u4e0b\uff0c\u5141\u8bb8\u81ea\u52a8\u9690\u85cf\uff0c\u4e14\u6ca1\u6709\u5b50\u83dc\u5355\u7684\u60c5\u51b5\u4e0b\uff0c\u83dc\u5355\u9690\u85cf
          if(!multipleSelect && _self.get('clickHide') && !item.get('subMenu')){
            _self.getTopAutoHideMenu().hide();
          }
        }
      });

      _self.on('afterOpenChange',function (ev) {
        var target = ev.target,
          opened = ev.newVal,
          children = _self.get('children');
        if(opened){
          BUI.each(children,function(item) {
            if(item !== target && item.get('open')){
              item.set('open',false);
            }
          });
        }
      });

      _self.on('afterVisibleChange',function (ev) {
        var visible = ev.newVal,
          parent = _self.get('parentMenu');
        _self._clearOpen();
      });
    },
   
    //\u70b9\u51fb\u81ea\u52a8\u9690\u85cf\u65f6
    getTopAutoHideMenu : function() {
      var _self = this,
        parentMenu = _self.get('parentMenu'),
        topHideMenu;
      if(parentMenu && parentMenu.get('autoHide')){
        return parentMenu.getTopAutoHideMenu();
      }
      if(_self.get('autoHide')){
        return _self;
      }
      return null;
    },
    //\u6e05\u9664\u83dc\u5355\u9879\u7684\u6fc0\u6d3b\u72b6\u6001
    _clearOpen : function () {
      var _self = this,
        children = _self.get('children');
      BUI.each(children,function (item) {
        if(item.set){
          item.set('open',false);
        }
      });
    },
    /**
     * \u6839\u636eID\u67e5\u627e\u83dc\u5355\u9879
     * @param  {String} id \u7f16\u53f7
     * @return {BUI.Menu.MenuItem} \u83dc\u5355\u9879
     */
    findItemById : function(id){ 

      return this.findItemByField('id',id);
    },
    _uiSetSelectedItem : function(item){
      if(item){
        _self.setSelected(item);
      }
    }
  },{
    ATTRS:
    /**
     * @lends BUI.Menu.Menu#
     * @ignore
     */
    {

      elTagName:{
        view : true,
        value : 'ul'
      },
		  idField:{
        value:'id'
      },
      /**
       * @protected
       * \u662f\u5426\u6839\u636eDOM\u751f\u6210\u5b50\u63a7\u4ef6
       * @type {Boolean}
       */
      isDecorateChild : {
        value : true
      },
      /**
       * \u5b50\u7c7b\u7684\u9ed8\u8ba4\u7c7b\u540d\uff0c\u5373\u7c7b\u7684 xclass
       * @type {String}
       * @default 'menu-item'
       */
      defaultChildClass : {
        value : 'menu-item'
      },
      /**
       * \u9009\u4e2d\u7684\u83dc\u5355\u9879
       * @type {Object}
       */
      selectedItem : {

      },
      /**
       * \u4e0a\u4e00\u7ea7\u83dc\u5355
       * @type {BUI.Menu.Menu}
       * @readOnly
       */
      parentMenu : {

      }
    }
    
  },{
    xclass : 'menu',
    priority : 0
  });

  return Menu;
});
define('bui/menu/popmenu',['bui/common','bui/menu/menu'],function (require) {

  var BUI = require('bui/common'),
    UIBase = BUI.Component.UIBase,
    Menu = require('bui/menu/menu');

  var popMenuView =  BUI.Component.View.extend([UIBase.PositionView],{
    
  });

   /**
   * @class BUI.Menu.PopMenu
   * \u4e0a\u4e0b\u6587\u83dc\u5355\uff0c\u4e00\u822c\u7528\u4e8e\u5f39\u51fa\u83dc\u5355
   * xclass:'pop-menu'
   * @extends BUI.Menu.Menu
   * @mixins BUI.Component.UIBase.AutoShow
   * @mixins BUI.Component.UIBase.Position
   * @mixins BUI.Component.UIBase.Align
   * @mixins BUI.Component.UIBase.AutoHide
   */
  var popMenu =  Menu.extend([UIBase.Position,UIBase.Align,UIBase.AutoShow,,UIBase.AutoHide],{

  },{
    ATTRS:{
       /** \u70b9\u51fb\u83dc\u5355\u9879\uff0c\u5982\u679c\u83dc\u5355\u4e0d\u662f\u591a\u9009\uff0c\u83dc\u5355\u9690\u85cf
       * @type {Boolean} 
       * @default true
       */
      clickHide : {
        value : true
      },
      align : {
        value : {
           points: ['bl','tl'], // ['tr', 'tl'] \u8868\u793a overlay \u7684 tl \u4e0e\u53c2\u8003\u8282\u70b9\u7684 tr \u5bf9\u9f50
           offset: [0, 0]      // \u6709\u6548\u503c\u4e3a [n, m]
        }
      },
      visibleMode : {
        value : 'visibility'
      },
      /**
       * \u70b9\u51fb\u83dc\u5355\u5916\u9762\uff0c\u83dc\u5355\u9690\u85cf
       * \u70b9\u51fb\u83dc\u5355\u9879\uff0c\u5982\u679c\u83dc\u5355\u4e0d\u662f\u591a\u9009\uff0c\u83dc\u5355\u9690\u85cf
       * @type {Boolean} 
       * @default true
       */
      autoHide : {
        value : true
      },
      visible : {
        value : false
      },
      xview:{
        value : popMenuView
      }
    }
  },{
    xclass:'pop-menu'
  });
  
  return popMenu;

});
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
   * \u4e0a\u4e0b\u6587\u83dc\u5355\u9879
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
    //\u8bbe\u7f6e\u56fe\u6807\u6837\u5f0f
    _uiSetIconCls : function (v,ev) {
      var _self = this,
        preCls = ev.prevVal,
        iconEl = _self.get('el').find('.'+CLS_ITEM_ICON);
      iconEl.removeClass(preCls);
      iconEl.addClass(v);
    }
  },{

    ATTRS:
    /**
     * @lends BUI.Menu.MenuItem#
     * @ignore
     */
    {
      /**
       * \u663e\u793a\u7684\u6587\u672c
       * @type {String}
       */
      text:{
        veiw:true,
        value:''
      },
      /**
       * \u83dc\u5355\u9879\u56fe\u6807\u7684\u6837\u5f0f
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
   * \u4e0a\u4e0b\u6587\u83dc\u5355\uff0c\u4e00\u822c\u7528\u4e8e\u5f39\u51fa\u83dc\u5355
   * xclass:'context-menu'
   * @class BUI.Menu.ContextMenu
   * @extends BUI.Menu.PopMenu
   */
  var contextMenu = PopMenu.extend({

  },{
    ATTRS:{
      /**
       * \u5b50\u7c7b\u7684\u9ed8\u8ba4\u7c7b\u540d\uff0c\u5373\u7c7b\u7684 xclass
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

define('bui/menu/sidemenu',['bui/common','bui/menu/menu'],function(require){

  var BUI = require('bui/common'),
    Menu = require('bui/menu/menu'),
    Component =  BUI.Component,
    CLS_MENU_TITLE = BUI.prefix + 'menu-title',
    CLS_MENU_LEAF = 'menu-leaf';
    
  /**
   * \u4fa7\u8fb9\u680f\u83dc\u5355
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
    //\u521d\u59cb\u5316\u914d\u7f6e\u9879
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
      //\u9632\u6b62\u94fe\u63a5\u8df3\u8f6c
      _self.get('el').delegate('a','click',function(ev){
        ev.preventDefault();
      });
      //\u5904\u7406\u70b9\u51fb\u4e8b\u4ef6\uff0c\u5c55\u5f00\u3001\u6298\u53e0\u3001\u9009\u4e2d
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
    //\u521d\u59cb\u5316\u83dc\u5355\u914d\u7f6e\u9879
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
    //\u521d\u59cb\u5316\u4e8c\u7ea7\u83dc\u5355
    _initSubMenuCfg : function(subItem){
      var _self = this,
        cfg = {
          xclass : 'menu-item',
          elCls : 'menu-leaf',
          tpl : '<a href="{href}"><em>{text}</em></a>'
        };
      return BUI.mix(cfg,subItem);
    }
  },{

    ATTRS : 
    /**
     * @lends BUI.Menu.SideMenu.prototype
     * @ignore
     */
    {
      
      /**
       * \u914d\u7f6e\u7684items \u9879\u662f\u5728\u521d\u59cb\u5316\u65f6\u4f5c\u4e3achildren
       * @protected
       * @type {Boolean}
       */
      autoInitItems : {
          value : false
      },
      events : {
        value : {
          /**
           * \u70b9\u51fb\u83dc\u5355\u9879
		       * @name BUI.Menu.SideMenu#menuclick
           * @event 
           * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.item \u5f53\u524d\u9009\u4e2d\u7684\u9879
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