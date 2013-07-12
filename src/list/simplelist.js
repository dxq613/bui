/**
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
   * @mixins BUI.Component.UIBase.Bindable
   */
  var  simpleList = BUI.Component.Controller.extend([UIBase.DomList,UIBase.Bindable],
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
        if(_self.isItemDisabled(ev.item,ev.currentTarget)){ //如果禁用
          return;
        }
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
});