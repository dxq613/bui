/**
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
});