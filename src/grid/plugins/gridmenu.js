/**
 * @fileOverview Grid 菜单
 * @ignore
 */
define('bui/grid/plugins/menu',['bui/common','bui/menu'],function (require) {

  var BUI = require('bui/common'),
    Menu = require('bui/menu'),
    PREFIX = BUI.prefix,
    ID_SORT_ASC = 'sort-asc',
    ID_SORT_DESC = 'sort-desc',
    ID_COLUMNS_SET = 'column-setting',
    CLS_COLUMN_CHECKED = 'icon-check';

  /**
   * @class BUI.Grid.Plugins.GridMenu
   * @extends BUI.Base
   * 表格菜单插件
   */
  var gridMenu = function (config) {
    gridMenu.superclass.constructor.call(this,config);
  };

  BUI.extend(gridMenu,BUI.Base);

  gridMenu.ATTRS = 
  {
    /**
     * 弹出菜单
     * @type {BUI.Menu.ContextMenu}
     */
    menu : {

    },
    /**
     * @private
     */
    activedColumn : {

    },
    triggerCls : {
      value : PREFIX + 'grid-hd-menu-trigger'
    },
    /**
     * 菜单的配置项
     * @type {Array}
     */
    items : {
      value : [
        {
          id:ID_SORT_ASC,
          text:'升序',
          iconCls:'icon-arrow-up'
        },
        {
          id:ID_SORT_DESC,
          text:'降序',
          iconCls : 'icon-arrow-down'
        },
        {
          xclass:'menu-item-sparator'
        },
        {
          id : ID_COLUMNS_SET,
          text:'设置列',
          iconCls:'icon-list-alt'
        }
      ]
    }
  };

  BUI.augment(gridMenu,{
    /**
     * 初始化
     * @protected
     */
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);

    },
    /**
     * 渲染DOM
     */
    renderUI : function(grid){
      var _self = this, 
        columns = grid.get('columns');
      BUI.each(columns,function(column){
        _self._addShowMenu(column);
      });
    },
    /**
     * 绑定表格
     * @protected
     */
    bindUI : function (grid){
      var _self = this;

      grid.on('columnadd',function(ev){
        _self._addShowMenu(ev.column);
      });
      grid.on('columnclick',function (ev) {
        var sender = $(ev.domTarget),
          column = ev.column,
          menu;

        _self.set('activedColumn',column);
        
        if(sender.hasClass(_self.get('triggerCls'))){
          menu = _self.get('menu') || _self._initMenu();
          menu.set('align',{
            node: sender, // 参考元素, falsy 或 window 为可视区域, 'trigger' 为触发元素, 其他为指定元素
            points: ['bl','tl'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
            offset: [0, 0] 
          });
          menu.show();
          _self._afterShow(column,menu);
        }
      });
    },
    _addShowMenu : function(column){
      if(!column.get('fixed')){
        column.set('showMenu',true);
      }
    },
    //菜单显示后
    _afterShow : function (column,menu) {
      var _self = this,
        grid = _self.get('grid');

      menu = menu || _self.get('menu');
      _self._resetSortMenuItems(column,menu);
      _self._resetColumnsVisible(menu);
    },
    //设置菜单项是否选中
    _resetColumnsVisible : function (menu) {
      var _self = this,
        settingItem = menu.findItemById(ID_COLUMNS_SET),
        subMenu = settingItem.get('subMenu') || _self._initColumnsMenu(settingItem),
        columns = _self.get('grid').get('columns');
      subMenu.removeChildren(true);
      $.each(columns,function (index,column) {
        if(!column.get('fixed')){
          var config = {
              xclass : 'context-menu-item',
              text : column.get('title'),
              column : column,
              iconCls : 'icon'
            },
            menuItem = subMenu.addChild(config);
          if(column.get('visible')){
            menuItem.set('selected',true);
          }
        }
      });
    },
    //设置排序菜单项是否可用
    _resetSortMenuItems : function(column,menu) {
      var ascItem = menu.findItemById(ID_SORT_ASC),
        descItem = menu.findItemById(ID_SORT_DESC);
      if(column.get('sortable')){
        ascItem.set('disabled',false);
        descItem.set('disabled',false);
      }else{
        ascItem.set('disabled',true);
        descItem.set('disabled',true);
      }
    },
    //初始化菜单
    _initMenu : function () {
      var _self = this,
        menu = _self.get('menu'),
        menuItems;

      if(!menu){
        menuItems = _self.get('items');
        $.each(menuItems,function (index,item) {
          if(!item.xclass){
            item.xclass = 'context-menu-item'
          }
        });
        menu = new Menu.ContextMenu({
          children : menuItems,
          elCls : 'grid-menu'
        });
        _self._initMenuEvent(menu);
        _self.set('menu',menu)
      }
      return menu;
    },
    _initMenuEvent : function  (menu) {
      var _self = this;

      menu.on('itemclick',function(ev) {
        var item = ev.item,
          id = item.get('id'),
          activedColumn = _self.get('activedColumn');
        if(id === ID_SORT_ASC){
          activedColumn.set('sortState','ASC');
        }else if(id === ID_SORT_DESC){
          activedColumn.set('sortState','DESC');
        }
      });

      menu.on('afterVisibleChange',function (ev) {
        var visible = ev.newVal,
          activedColumn = _self.get('activedColumn');
        if(visible && activedColumn){
          activedColumn.set('open',true);
        }else{
          activedColumn.set('open',false);
        }
      });
    },
    _initColumnsMenu : function (settingItem) {
      var subMenu = new Menu.ContextMenu({
          multipleSelect : true,
          elCls : 'grid-column-menu'
        });  
      settingItem.set('subMenu',subMenu);
      subMenu.on('itemclick',function (ev) {
        var item = ev.item,
          column = item.get('column'),
          selected = item.get('selected');
        if(selected){
          column.set('visible',true);
        }else{
          column.set('visible',false);
        }
      });
      return subMenu;
    },
    destructor:function () {
      var _self = this,
        menu = _self.get('menu');
      if(menu){
        menu.destroy();
      }
      _self.off();
      _self.clearAttrVals();
    }

  });

  return gridMenu;

});