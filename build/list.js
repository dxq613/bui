/**
 * @fileOverview 列表模块入口文件
 * @ignore
 */

define('bui/list',function (require) {
  var BUI = require('bui/common'),
    List = BUI.namespace('List');

  BUI.mix(List,{
    List : require('bui/list/list'),
    ListItem : require('bui/list/listitem'),
    SimpleList : require('bui/list/simplelist'),
    Listbox : require('bui/list/listbox'),
    Picker : require('bui/list/listpicker')
  });

  BUI.mix(List,{
    ListItemView : List.ListItem.View,
    SimpleListView : List.SimpleList.View
  });

  return List;
});/**
 * @fileOverview 简单列表，直接使用DOM作为列表项
 * @ignore
 */

define('bui/list/simplelist',function (require) {
  /**
   * @name BUI.List
   * @namespace 列表命名空间
   * @ignore
   */
  var UIBase = BUI.Component.UIBase,
    Data = require('bui/data'),
    CLS_ITEM = BUI.prefix + 'list-item';
  
  /**
   * @class BUI.List.SimpleListView
   * 简单列表视图类
   * @extends BUI.Component.View
   */
  var simpleListView = BUI.Component.View.extend([UIBase.DomListView],{

    setElementHover : function(element,hover){
      var _self = this;

      _self.setItemStatusCls('hover',element,hover);
    }

  },{
    ATTRS : {
      itemContainer : {
        valueFn : function(){
          return this.get('el').children(this.get('listSelector'));
        }
      }
    }
  },{
    xclass:'simple-list-view'
  });

  /**
   * 简单列表，用于显示简单数据
   * <p>
   * <img src="../assets/img/class-list.jpg"/>
   * </p>
   * xclass:'simple-list'
   * @class BUI.List.SimpleList
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.DomList
   * @mixins BUI.Data.Bindable
   */
  var  simpleList = BUI.Component.Controller.extend([UIBase.DomList,Data.Bindable],
  /**
   * @lends BUI.List.SimpleList.prototype
   * @ignore
   */
  {
    /**
     * @protected
     * @ignore
     */
    bindUI : function(){
      var _self = this,
        itemCls = _self.get('itemCls'),
        hoverCls = itemCls + '-hover',
        itemContainer = _self.get('view').getItemContainer();

      itemContainer.delegate('.'+itemCls,'mouseover',function(ev){
        var sender = $(ev.currentTarget);
        _self.get('view').setElementHover(sender,true);
      }).delegate('.'+itemCls,'mouseout',function(ev){
        var sender = $(ev.currentTarget);
        _self.get('view').setElementHover(sender,false);
      });
    },
    /**
     * 添加
     * @protected
     */
    onAdd : function(e){
      var _self = this,
        item = e.record;
      _self.addItemToView(item,e.index);
    },
    /**
     * 删除
    * @protected
    */
    onRemove : function(e){
      var _self = this,
        item = e.record;
      _self.removeItem(item);
    },
    /**
     * 更新
    * @protected
    */
    onUpdate : function(e){
      this.updateItem(e.record);
    },
    /**
    * 本地排序
    * @protected
    */
    onLocalSort : function(e){
      this.onLoad(e);
    },
    /**
     * 加载数据
     * @protected
     */
    onLoad:function(){
      var _self = this,
        store = _self.get('store'),
        items = store.getResult();
      _self.set('items',items);
    }
  },{
    ATTRS : 
    /**
     * @lends BUI.List.SimpleList#
     * @ignore
     */
    {
      /**
       * 选项集合
       * @protected
       * @type {Array}
       */
      items : {
        view:true,
        value : []
      },
      /**
       * 列表项应用的css
       * @type {String}
       */
      itemCls : {
        view:true,
        value : CLS_ITEM
      },
      
      idField : {
        value : 'value'
      },
      /**
       * 列表的选择器，将列表项附加到此节点
       * @protected
       * @type {Object}
       */
      listSelector:{
        view:true,
        value:'ul'
      },
      /**
       * 列表项的模版
       * @cfg {String} itemTpl
       */
      /**
       * 列表项的模版
       * @default '&lt;li role="option" class="bui-list-item" data-value="{value}"&gt;{text}&lt;/li&gt;'
       * @type {String}
       */
      itemTpl :{
        view : true,
        value : '<li role="option" class="' + CLS_ITEM + '">{text}</li>'
      },
      tpl : {
        value:'<ul></ul>'
      },
      xview:{
        value : simpleListView
      }
    }
  },{
    xclass : 'simple-list',
    prority : 0
  });

  simpleList.View = simpleListView;
  return simpleList;
});/**
 * @fileOverview 可选择的列表
 * @author dengbin
 * @ignore
 */

define('bui/list/listbox',function (require) {
  var SimpleList = require('bui/list/simplelist');
  /**
   * 列表选择框
   * @extends BUI.List.SimpleList
   * @class BUI.List.Listbox
   */
  var listbox = SimpleList.extend({
    bindUI : function(){
    	var _self = this;
      
    	_self.on('selectedchange',function(e){
    		var item = e.item,
    			sender = $(e.domTarget),
    			checkbox =sender.find('input');
    		if(item){
    			checkbox.attr('checked',e.selected);
    		}
    	});
    }
  },{
    ATTRS : {
      /**
       * 选项模板
       * @override
       * @type {String}
       */
      itemTpl : {
        value : '<li><span class="checkbox"><input type="checkbox" />{text}</span></li>'
      },
      /**
       * 选项模板
       * @override
       * @type {Boolean}
       */
      multipleSelect : {
        value : true
      }
    }
  },{
    xclass: 'listbox'
  });

  return listbox;
});/**
 * @fileOverview 列表项
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/list/listitem',function ($) {


  var Component = BUI.Component,
    UIBase = Component.UIBase;
    
  /**
   * @private
   * @class BUI.List.ItemView
   * @extends BUI.Component.View
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
    /**
     * @lends BUI.List.Item#
     * @ignore
     */
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
});/**
 * @fileOverview 列表
 * @ignore
 */
define('bui/list/list',function (require) {
  
  var Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * 列表
   * <p>
   * <img src="../assets/img/class-list.jpg"/>
   * </p>
   * xclass:'list'
   * @class BUI.List.List
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ChildList
   */
  var list = Component.Controller.extend([UIBase.ChildList],{
    
  },{
    ATTRS : 
    /**
     * @lends BUI.List.List#
     * @ignore
     */
    {
      elTagName:{
        view:true,
        value:'ul'
      },
      idField:{
        value:'id'
      },
      /**
       * 子类的默认类名，即类的 xclass
       * @type {String}
       * @override
       * @default 'list-item'
       */
      defaultChildClass : {
        value : 'list-item'
      }
    }
  },{
    xclass:'list'
  });

  return list;
});/**
 * @fileOverview 列表项的选择器
 * @ignore
 */

define('bui/list/listpicker',function (require) {

  var Picker = require('bui/overlay').Picker,
    /**
     * 列表选择器
     * @class BUI.List.Picker
     * @extends BUI.Overlay.Picker
     */
    listPicker = Picker.extend({
      initializer : function(){
        var _self = this,
          children = _self.get('children'),
          list = _self.get('list');
        if(!list){
          children.push({

          });
        }
      },
      /**
       * 设置选中的值
       * @param {String} val 设置值
       */
      setSelectedValue : function(val){
        val = val ? val.toString() : '';
        var _self = this,
          list = _self.get('list'),
          selectedValue = _self.getSelectedValue();
        if(val !== selectedValue){
          if(list.get('multipleSelect')){
            list.clearSelection();
          }
          list.setSelectionByField(val.split(','));
        }   
      },
      /**
       * 获取选中的值，多选状态下，值以','分割
       * @return {String} 选中的值
       */
      getSelectedValue : function(){
        return this.get('list').getSelectionValues().join(',');
      },
      /**
       * 获取选中项的文本，多选状态下，文本以','分割
       * @return {String} 选中的文本
       */
      getSelectedText : function(){
        return this.get('list').getSelectionText().join(',');
      }
    },{
      ATTRS : {
        /**
         * 默认子控件的样式,默认为'simple-list'
         * @type {String}
         * @override
         */
        defaultChildClass:{
          value : 'simple-list'
        },
        /**
         * 选择的列表
         * @type {BUI.List.SimpleList}
         * @readOnly
         */
        list : {
          getter:function(){
            return this.get('children')[0];
          }
        }
      }
    },{
      xclass : 'list-picker'
    });

  return listPicker;
});