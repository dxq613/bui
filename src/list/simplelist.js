/**
 * @fileOverview 简单列表，直接使用DOM作为列表项
 * @ignore
 */

define('bui/list/simplelist',['bui/common','bui/list/domlist','bui/list/keynav','bui/list/sortable'],function (require) {

  /**
   * @name BUI.List
   * @namespace 列表命名空间
   * @ignore
   */
  var BUI = require('bui/common'),
    UIBase = BUI.Component.UIBase,
    UA = BUI.UA,
    DomList = require('bui/list/domlist'),
    KeyNav = require('bui/list/keynav'),
    Sortable = require('bui/list/sortable'),
    CLS_ITEM = BUI.prefix + 'list-item';
  
  /**
   * @class BUI.List.SimpleListView
   * 简单列表视图类
   * @extends BUI.Component.View
   */
  var simpleListView = BUI.Component.View.extend([DomList.View],{

    setElementHover : function(element,hover){
      var _self = this;

      _self.setItemStatusCls('hover',element,hover);
    }

  },{
    ATTRS : {
      itemContainer : {
        valueFn : function(){
          return this.get('el').find(this.get('listSelector'));
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
   * ## 显示静态数组的数据
   * 
   * ** 最简单的列表 **
   * <pre><code>
   * 
   * BUI.use('bui/list',function(List){
   *   var list = new List.SimpleList({
   *     render : '#t1',
   *     items : [{value : '1',text : '1'},{value : '2',text : '2'}]
   *   });
   *   list.render();
   * });
   * 
   * </code></pre>
   *
   * ** 自定义模板的列表 **
   *<pre><code>
   * 
   * BUI.use('bui/list',function(List){
   *   var list = new List.SimpleList({
   *     render : '#t1',
   *     items : [{value : '1',text : '1'},{value : '2',text : '2'}]
   *   });
   *   list.render();
   * });
   * 
   * </code></pre>
   * 
   * @class BUI.List.SimpleList
   * @extends BUI.Component.Controller
   * @mixins BUI.List.DomList
   * @mixins BUI.List.KeyNav
   * @mixins BUI.Component.UIBase.Bindable
   */
  var  simpleList = BUI.Component.Controller.extend([DomList,UIBase.Bindable,KeyNav,Sortable],
  {
    /**
     * @protected
     * @ignore
     */
    bindUI : function(){
      var _self = this,
        itemCls = _self.get('itemCls'),
        itemContainer = _self.get('view').getItemContainer();

      itemContainer.delegate('.'+itemCls,'mouseover',function(ev){
        if(_self.get('disabled')){ //控件禁用后，阻止事件
          return;
        }
        var element = ev.currentTarget,
          item = _self.getItemByElement(element);
        if(_self.isItemDisabled(ev.item,ev.currentTarget)){ //如果禁用
          return;
        }
        
        if(!(UA.ie && UA.ie < 8) && _self.get('focusable') && _self.get('highlightedStatus') === 'hover'){
          _self.setHighlighted(item,element)
        }else{
          _self.setItemStatus(item,'hover',true,element);
        }
        /*_self.get('view').setElementHover(element,true);*/

      }).delegate('.'+itemCls,'mouseout',function(ev){
        if(_self.get('disabled')){ //控件禁用后，阻止事件
          return;
        }
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
        store = _self.get('store'),
        item = e.record;
      if(_self.getCount() == 0){ //初始为空时，列表跟Store不同步
        _self.setItems(store.getResult());
      }else{
        _self.addItemToView(item,e.index);
      }
      
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
      if(this.get('frontSortable')){
        this.sort(e.field ,e.direction);
      }else{
        this.onLoad(e);
      }
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
    },
    /**
     * 过滤数据
     * @protected
     */
    onFiltered: function(e){
      var _self = this,
        items = e.data;
      _self.set('items', items);
    }
  },{
    ATTRS : 

    {

      /**
       * 排序的时候是否直接进行DOM的排序，不重新生成DOM，<br>
       * 在可展开的表格插件，TreeGrid等控件中不要使用此属性
       * @type {Boolean}
       * cfg {Boolean} frontSortable
       */
      frontSortable : {
        value : false
      },
      focusable : {
        value : false
      },
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
       * 选项的样式，用来获取子项
       * <pre><code>
       * var list = new List.SimpleList({
       *   render : '#t1',
       *   itemCls : 'my-item', //自定义样式名称
       *   items : [{id : '1',text : '1',type : '0'},{id : '2',text : '2',type : '1'}]
       * });
       * list.render();
       * </code></pre>
       * @cfg {Object} [itemCl='list-item']
       */
      itemCls : {
        view:true,
        value : CLS_ITEM
      },
      /**
       * 选项的默认id字段
       * <pre><code>
       * var list = new List.SimpleList({
       *   render : '#t1',
       *   idField : 'id', //自定义选项 id 字段
       *   items : [{id : '1',text : '1',type : '0'},{id : '2',text : '2',type : '1'}]
       * });
       * list.render();
       *
       * list.getItem('1'); //使用idField指定的字段进行查找
       * </code></pre>
       * @cfg {String} [idField = 'value']
       */
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
       * 列表项的默认模板。
       *<pre><code>
       * var list = new List.SimpleList({
       *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;', //列表项的模板
       *   idField : 'value',
       *   render : '#t1',
       *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
       * });
       * list.render();
       * </code></pre>
       * @cfg {String} [itemTpl ='&lt;li role="option" class="bui-list-item" data-value="{value}"&gt;{text}&lt;/li&gt;']
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