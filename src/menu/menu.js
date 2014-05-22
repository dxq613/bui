/**
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
});