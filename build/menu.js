/**
 * @fileOverview 菜单命名空间入口文件
 * @ignore
 */

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
});/**
 * @fileOverview 菜单项
 * @ignore
 */
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
   * @mixins BUI.Component.UIBase.CollapsableView
   * 菜单项的视图类
   */
  var menuItemView = Component.View.extend([UIBase.ListItemView,UIBase.CollapsableView],{

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
   * 菜单项
   * @class BUI.Menu.MenuItem
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ListItem
   */
  var menuItem = Component.Controller.extend([UIBase.ListItem,UIBase.Collapsable],{
    /**
     * 渲染
     * @protected
     */
    renderUI : function(){
      var _self = this,
        el = _self.get('el'),
        id = _self.get('id'),
        temp = null;
      //未设置id时自动生成
      if(!id){
        id = BUI.guid('menu-item');
        _self.set('id',id);
      }
      el.attr(DATA_ID,id);   
    },
     /**
     * 处理鼠标移入
     * @protected
     */
    handleMouseEnter : function (ev) {
      var _self = this;

      if(this.get('subMenu') && this.get('openable')){
        this.set('open',true);
      }
      menuItem.superclass.handleMouseEnter.call(this,ev);
    },
    /**
     * 处理鼠标移出
     * @protected
     */
    handleMouseLeave :function (ev) {
      if(this.get('openable')){
        var _self = this,
          subMenu = _self.get('subMenu'),
          toElement = ev.toElement || ev.relatedTarget;;
        if(toElement && subMenu && subMenu.containsElement(toElement)){
          _self.set('open',true);
        }else{
          _self.set('open',false);
        }
      }
      menuItem.superclass.handleMouseLeave.call(this,ev);
    },
    /**
     * 自己和子菜单是否包含
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
    //设置打开子菜单 
    _uiSetOpen : function (v) {
      if(this.get('openable')){
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
            //防止子菜单被公用时
            if(!menuAlign || menuAlign.node == _self.get('el')){
              subMenu.hide();
            }
            
          }
        }
      }
    },
    //设置下级菜单
    _uiSetSubMenu : function (subMenu) {
      if(subMenu){
        var _self = this,
          el = _self.get('el'),
          parent = _self.get('parent');
        //设置菜单项所属的菜单为上一级菜单
        if(!subMenu.get('parentMenu')){
          subMenu.set('parentMenu',parent);
          if(parent.get('autoHide')){
            if(parent.get('autoHideType') == 'click'){
              subMenu.set('autoHide',false);
            }else{
              subMenu.set('autoHideType','leave');
            }
            
          } /**/
        }
        $(_self.get('arrowTpl')).appendTo(el);
      }
    },
    /** 
     * 析构函数
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
    {
      /**
       * 默认的Html 标签
       * @type {String}
       */
      elTagName : {
          value: 'li'
      },
      xview : {
        value : menuItemView
      },
      /**
       * 菜单项是否展开，显示子菜单
       * @cfg {Boolean} [open=false]
       */
      /**
       * 菜单项是否展开，显示子菜单
       * @type {Boolean}
       * @default false
       */
      open :{
        view : true,
        value : false
      },
      /**
       * 是否可以展开
       * @type {Boolean}
       */
      openable : {
        value : true
      },
      /**
       * 下级菜单
       * @cfg {BUI.Menu.Menu} subMenu
       */
      /**
       * 下级菜单
       * @type {BUI.Menu.Menu}
       */
      subMenu : {
        view : true
      },
       /**
       * 下级菜单和菜单项的对齐方式
       * @type {Object}
       * @default 默认在下面显示
       */
      subMenuAlign : {
        valueFn : function (argument) {
          return {
             //node: this.get('el'), // 参考元素, falsy 或 window 为可视区域, 'trigger' 为触发元素, 其他为指定元素
             points: ['tr','tl'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
             offset: [-5, 0]      // 有效值为 [n, m]
          }
        }
      },
      /**
       * 当存在子菜单时的箭头模版
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
      },
      subMenuType : {
        value : 'pop-menu'
      }
    },
    PARSER : {
      subMenu : function(el){
        var 
          subList = el.find('ul'),
          type = this.get('subMenuType'),
          sub;
        if(subList && subList.length){
          sub = BUI.Component.create({
            srcNode : subList,
            xclass : type
          });
          if(type == 'pop-menu'){
            subList.appendTo('body');
            sub.setInternal({
              autoHide : true,
              autoHideType : 'leave'
            });
          }else{
            this.get('children').push(sub);
          }
        }
        return sub;
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
});/**
 * @fileOverview 菜单基类
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/menu/menu',['bui/common'],function(require){

  var BUI = require('bui/common'),
    Component =  BUI.Component,
    UIBase = Component.UIBase;

  /**
   * 菜单
   * xclass:'menu'
   * <img src="../assets/img/class-menu.jpg"/>
   * @class BUI.Menu.Menu
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ChildList
   */
  var Menu = Component.Controller.extend([UIBase.ChildList],{
	  /**
     * 绑定事件
     * @protected
     */
	  bindUI:function(){
      var _self = this;

      _self.on('click',function(e){
        var item = e.target,
          multipleSelect = _self.get('multipleSelect');
        if(_self != item){
          //单选情况下，允许自动隐藏，且没有子菜单的情况下，菜单隐藏
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
   
    //点击自动隐藏时
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
    //清除菜单项的激活状态
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
     * 根据ID查找菜单项
     * @param  {String} id 编号
     * @return {BUI.Menu.MenuItem} 菜单项
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
       * 是否根据DOM生成子控件
       * @type {Boolean}
       */
      isDecorateChild : {
        value : true
      },
      /**
       * 子类的默认类名，即类的 xclass
       * @type {String}
       * @default 'menu-item'
       */
      defaultChildClass : {
        value : 'menu-item'
      },
      /**
       * 选中的菜单项
       * @type {Object}
       */
      selectedItem : {

      },
      /**
       * 上一级菜单
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
});/**
 * @fileOverview 下拉菜单，一般用于下拉显示菜单
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/menu/popmenu',['bui/common','bui/menu/menu'],function (require) {

  var BUI = require('bui/common'),
    UIBase = BUI.Component.UIBase,
    Menu = require('bui/menu/menu');

  var popMenuView =  BUI.Component.View.extend([UIBase.PositionView],{
    
  });

   /**
   * @class BUI.Menu.PopMenu
   * 上下文菜单，一般用于弹出菜单
   * xclass:'pop-menu'
   * @extends BUI.Menu.Menu
   * @mixins BUI.Component.UIBase.AutoShow
   * @mixins BUI.Component.UIBase.Position
   * @mixins BUI.Component.UIBase.Align
   * @mixins BUI.Component.UIBase.AutoHide
   */
  var popMenu =  Menu.extend([UIBase.Position,UIBase.Align,UIBase.AutoShow,UIBase.AutoHide],{

  },{
    ATTRS:{
       /** 点击菜单项，如果菜单不是多选，菜单隐藏
       * @type {Boolean} 
       * @default true
       */
      clickHide : {
        value : true
      },
      align : {
        value : {
           points: ['bl','tl'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
           offset: [0, 0]      // 有效值为 [n, m]
        }
      },
      visibleMode : {
        value : 'visibility'
      },
      /**
       * 点击菜单外面，菜单隐藏
       * 点击菜单项，如果菜单不是多选，菜单隐藏
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

});/**
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