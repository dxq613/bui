/**
 * @fileOverview 列表模块入口文件
 * @ignore
 */
;(function(){
var BASE = 'bui/list/';
define('bui/list',['bui/common',BASE + 'list',BASE + 'listitem',BASE + 'simplelist',BASE + 'listbox'],function (r) {
  var BUI = r('bui/common'),
    List = BUI.namespace('List');

  BUI.mix(List,{
    List : r(BASE + 'list'),
    ListItem : r(BASE + 'listitem'),
    SimpleList : r(BASE + 'simplelist'),
    Listbox : r(BASE + 'listbox')
  });

  BUI.mix(List,{
    ListItemView : List.ListItem.View,
    SimpleListView : List.SimpleList.View
  });

  return List;
});  
})();
/**
 * @fileOverview 使用DOM元素作为选项的扩展类
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/list/domlist',['bui/common'],function (require) {
  'use strict';

  var BUI = require('bui/common'),
    Selection = BUI.Component.UIBase.Selection,
    FIELD_PREFIX = 'data-',
    List = BUI.Component.UIBase.List;

  function getItemStatusCls(name ,self) {
    var _self = self,
      itemCls = _self.get('itemCls'),
      itemStatusCls = _self.get('itemStatusCls');

    if(itemStatusCls && itemStatusCls[name]){
      return itemStatusCls[name];
    }
    return itemCls + '-' + name;
  }

  /**
   * 选项是DOM的列表的视图类
   * @private
   * @class BUI.List.DomList.View
   */
  var domListView = function(){

  };

  domListView.ATTRS = {
    items : {}
  };

  domListView.prototype = {
    /**
     * @protected
     * 清除者列表项的DOM
     */
    clearControl : function(){
      var _self = this,
        listEl = _self.getItemContainer(),
        itemCls = _self.get('itemCls');
      listEl.find('.'+itemCls).remove();
    },
    /**
     * 添加选项
     * @param {Object} item  选项值
     * @param {Number} index 索引
     */
    addItem : function(item,index){
      return this._createItem(item,index);
    },
    /**
     * 获取所有的记录
     * @return {Array} 记录集合
     */
    getItems : function(){
      var _self = this,
        elements = _self.getAllElements(),
        rst = [];
      BUI.each(elements,function(elem){
        rst.push(_self.getItemByElement(elem));
      });
      return rst;
    },
    /**
     * 更新列表项
     * @param  {Object} item 选项值
     * @ignore
     */
    updateItem : function(item){
      var _self = this, 
        items = _self.getItems(),
        index = BUI.Array.indexOf(item,items),
        element = null,
        tpl;
      if(index >=0 ){
        element = _self.findElement(item);
        tpl = _self.getItemTpl(item,index);
        if(element){
          $(element).html($(tpl).html());
        }
      }
      return element;
    },
    /**
     * 移除选项
     * @param  {jQuery} element
     * @ignore
     */
    removeItem:function(item,element){
      element = element || this.findElement(item);
      $(element).remove();
    },
    /**
     * 获取列表项的容器
     * @return {jQuery} 列表项容器
     * @protected
     */
    getItemContainer : function  () {
      var container = this.get('itemContainer');
      if(container.length){
        return container;
      }
      return this.get('el');
    },
    /**
     * 获取记录的模板,itemTpl 和 数据item 合并产生的模板
     * @protected 
     */
    getItemTpl : function  (item,index) {
      var _self = this,
        render = _self.get('itemTplRender'),
        itemTpl = _self.get('itemTpl');  
      if(render){
        return render(item,index);
      }
      
      return BUI.substitute(itemTpl,item);
    },
    //创建项
    _createItem : function(item,index){
      var _self = this,
        listEl = _self.getItemContainer(),
        itemCls = _self.get('itemCls'),
        dataField = _self.get('dataField'),
        tpl = _self.getItemTpl(item,index),
        node = $(tpl);
      if(index !== undefined){
        var target = listEl.find('.'+itemCls)[index];
        if(target){
          node.insertBefore(target);
        }else{
          node.appendTo(listEl);
        }
      }else{
        node.appendTo(listEl);
      }
      node.addClass(itemCls);
      node.data(dataField,item);
      return node;
    },
    /**
     * 获取列表项对应状态的样式
     * @param  {String} name 状态名称
     * @return {String} 状态的样式
     */
    getItemStatusCls : function(name){
      return getItemStatusCls(name,this);
    },
    /**
     * 设置列表项选中
     * @protected
     * @param {*} name 状态名称
     * @param {HTMLElement} element DOM结构
     * @param {Boolean} value 设置或取消此状态
     */
    setItemStatusCls : function(name,element,value){
      var _self = this,
        cls = _self.getItemStatusCls(name),
        method = value ? 'addClass' : 'removeClass';
      if(element){
        $(element)[method](cls);
      }
    },
    /**
     * 是否有某个状态
     * @param {*} name 状态名称
     * @param {HTMLElement} element DOM结构
     * @return {Boolean} 是否具有状态
     */
    hasStatus : function(name,element){
      var _self = this,
        cls = _self.getItemStatusCls(name);
      return $(element).hasClass(cls);
    },
    /**
     * 设置列表项选中
     * @param {*} item   记录
     * @param {Boolean} selected 是否选中
     * @param {HTMLElement} element DOM结构
     */
    setItemSelected: function(item,selected,element){
      var _self = this;

      element = element || _self.findElement(item);
      _self.setItemStatusCls('selected',element,selected);
    },
    /**
     * 获取所有列表项的DOM结构
     * @return {Array} DOM列表
     */
    getAllElements : function(){
      var _self = this,
        itemCls = _self.get('itemCls'),
        el = _self.get('el');
      return el.find('.' + itemCls);
    },
    /**
     * 获取DOM结构中的数据
     * @param {HTMLElement} element DOM 结构
     * @return {Object} 该项对应的值
     */
    getItemByElement : function(element){
      var _self = this,
        dataField = _self.get('dataField');
      return $(element).data(dataField);
    },
    /**
     * 根据状态获取第一个DOM 节点
     * @param {String} name 状态名称
     * @return {HTMLElement} Dom 节点
     */
    getFirstElementByStatus : function(name){
      var _self = this,
        cls = _self.getItemStatusCls(name),
        el = _self.get('el');
      return el.find('.' + cls)[0];
    },
    /**
     * 根据状态获取DOM
     * @return {Array} DOM数组
     */
    getElementsByStatus : function(status){
      var _self = this,
        cls = _self.getItemStatusCls(status),
        el = _self.get('el');
      return el.find('.' + cls);
    },
    /**
     * 通过样式查找DOM元素
     * @param {String} css样式
     * @return {jQuery} DOM元素的数组对象
     */
    getSelectedElements : function(){
      var _self = this,
        cls = _self.getItemStatusCls('selected'),
        el = _self.get('el');
      return el.find('.' + cls);
    },
    /**
     * 查找指定的项的DOM结构
     * @param  {Object} item 
     * @return {HTMLElement} element
     */
    findElement : function(item){
      var _self = this,
        elements = _self.getAllElements(),
        result = null;

      BUI.each(elements,function(element){
        if(_self.getItemByElement(element) == item){
            result = element;
            return false;
        }
      });
      return result;
    },
    /**
     * 列表项是否选中
     * @param  {HTMLElement}  element 是否选中
     * @return {Boolean}  是否选中
     */
    isElementSelected : function(element){
      var _self = this,
        cls = _self.getItemStatusCls('selected');
      return element && $(element).hasClass(cls);
    }
  };

  //转换成Object
  function parseItem(element,self){
    var attrs = element.attributes,
      itemStatusFields = self.get('itemStatusFields'),
      item = {};

    BUI.each(attrs,function(attr){
      var name = attr.nodeName;
      if(name.indexOf(FIELD_PREFIX) !== -1){
        name = name.replace(FIELD_PREFIX,'');
        item[name] = attr.nodeValue;
      }
    });
    item.text = $(element).text();
    //获取状态对应的值
    BUI.each(itemStatusFields,function(v,k){
      var cls = getItemStatusCls(k,self);
      if($(element).hasClass(cls)){
        item[v] = true;
      }
    });
    return item;
  }

  /**
   * @class BUI.List.DomList
   * 选项是DOM结构的列表
   * @extends BUI.Component.UIBase.List
   * @mixins BUI.Component.UIBase.Selection
   */
  var domList = function(){

  };

  domList.ATTRS =BUI.merge(true,List.ATTRS,Selection.ATTRS,{

    /**
     * 在DOM节点上存储数据的字段
     * @type {String}
     * @protected
     */
    dataField : {
        view:true,
        value:'data-item'
    },
    /**
     * 选项所在容器，如果未设定，使用 el
     * @type {jQuery}
     * @protected
     */
    itemContainer : {
        view : true
    },
    /**
     * 选项状态对应的选项值
     * 
     *   - 此字段用于将选项记录的值跟显示的DOM状态相对应
     *   - 例如：下面记录中 <code> checked : true </code>，可以使得此记录对应的DOM上应用对应的状态(默认为 'list-item-checked')
     *     <pre><code>{id : '1',text : 1,checked : true}</code></pre>
     *   - 当更改DOM的状态时，记录中对应的字段属性也会跟着变化
     * <pre><code>
     *   var list = new List.SimpleList({
     *   render : '#t1',
     *   idField : 'id', //自定义样式名称
     *   itemStatusFields : {
     *     checked : 'checked',
     *     disabled : 'disabled'
     *   },
     *   items : [{id : '1',text : '1',checked : true},{id : '2',text : '2',disabled : true}]
     * });
     * list.render(); //列表渲染后，会自动带有checked,和disabled对应的样式
     *
     * var item = list.getItem('1');
     * list.hasStatus(item,'checked'); //true
     *
     * list.setItemStatus(item,'checked',false);
     * list.hasStatus(item,'checked');  //false
     * item.checked;                    //false
     * 
     * </code></pre>
     * ** 注意 **
     * 此字段跟 {@link #itemStatusCls} 一起使用效果更好，可以自定义对应状态的样式
     * @cfg {Object} itemStatusFields
     */
    itemStatusFields : {
      value : {}
    },
    /**
     * 项的样式，用来获取子项
     * @cfg {Object} itemCls
     */
    itemCls : {
      view : true
    }, 
    /**
     * 是否允许取消选中，在多选情况下默认允许取消，单选情况下不允许取消,注意此属性只有单选情况下生效
     * @type {Boolean}
     */
    cancelSelected : {
      value : false
    },   
    /**
     * 获取项的文本，默认获取显示的文本
     * @type {Object}
     * @protected
     */
    textGetter : {

    },
    /**
     * 默认的加载控件内容的配置,默认值：
     * <pre>
     *  {
     *   property : 'items',
     *   dataType : 'json'
     * }
     * </pre>
     * @type {Object}
     */
    defaultLoaderCfg  : {
      value : {
        property : 'items',
        dataType : 'json'
      }
    },
    events : {
      value : {
        /**
         * 选项对应的DOM创建完毕
         * @event
         * @param {Object} e 事件对象
         * @param {Object} e.item 渲染DOM对应的选项
         * @param {HTMLElement} e.element 渲染的DOM对象
         */
        'itemrendered' : true,
        /**
         * @event
         * 删除选项
         * @param {Object} e 事件对象
         * @param {Object} e.item 删除DOM对应的选项
         * @param {HTMLElement} e.element 删除的DOM对象
         */
        'itemremoved' : true,
        /**
         * @event
         * 更新选项
         * @param {Object} e 事件对象
         * @param {Object} e.item 更新DOM对应的选项
         * @param {HTMLElement} e.element 更新的DOM对象
         */
        'itemupdated' : true,
        /**
        * 设置记录时，所有的记录显示完毕后触发
        * @event
        */
        'itemsshow' : false,
        /**
        * 设置记录后，所有的记录显示前触发
        * @event:
        */
        'beforeitemsshow' : false,
        /**
        * 清空所有记录，DOM清理完成后
        * @event
        */
        'itemsclear' : false,
        /**
         * 双击是触发
        * @event
        * @param {Object} e 事件对象
        * @param {Object} e.item DOM对应的选项
        * @param {HTMLElement} e.element 选项的DOM对象
        * @param {HTMLElement} e.domTarget 点击的元素
        */
        'itemdblclick' : false,
        /**
        * 清空所有Dom前触发
        * @event
        */
        'beforeitemsclear' : false
         
      } 
    }
  });

  domList.PARSER = {
    items : function(el){
      var _self = this,
        rst = [],
        itemCls = _self.get('itemCls'),
        dataField = _self.get('dataField'),
        elements = el.find('.' + itemCls);
      if(!elements.length){
        elements = el.children();
        elements.addClass(itemCls);
      }
      BUI.each(elements,function(element){
        var item = parseItem(element,_self);
        rst.push(item);
        $(element).data(dataField,item);
      });
      //_self.setInternal('items',rst);
      return rst;
    }
  };

  BUI.augment(domList,List,Selection,{
     
    //设置记录
    _uiSetItems : function (items) {
      var _self = this;
      //使用srcNode 的方式，不同步
      if(_self.get('srcNode') && !_self.get('rendered')){
        return;
      }
      this.setItems(items);
    },
    __bindUI : function(){
      var _self = this,
        selectedEvent = _self.get('selectedEvent'),
        itemCls = _self.get('itemCls'),
        itemContainer = _self.get('view').getItemContainer();

      itemContainer.delegate('.'+itemCls,'click',function(ev){
        if(_self.get('disabled')){ //控件禁用后，阻止事件
          return;
        }
        var itemEl = $(ev.currentTarget),
          item = _self.getItemByElement(itemEl);
        if(_self.isItemDisabled(item,itemEl)){ //禁用状态下阻止选中
          return;
        }
        var rst = _self.fire('itemclick',{item:item,element : itemEl[0],domTarget:ev.target,domEvent : ev});
        if(rst !== false && selectedEvent == 'click' && _self.isItemSelectable(item)){
          setItemSelectedStatus(item,itemEl); 
        }
      });
      if(selectedEvent !== 'click'){ //如果选中事件不等于click，则进行监听选中
        itemContainer.delegate('.'+itemCls,selectedEvent,function(ev){
          if(_self.get('disabled')){ //控件禁用后，阻止事件
            return;
          }
          var itemEl = $(ev.currentTarget),
            item = _self.getItemByElement(itemEl);
          if(_self.isItemDisabled(item,itemEl)){ //禁用状态下阻止选中
            return;
          }
          if(_self.isItemSelectable(item)){
            setItemSelectedStatus(item,itemEl); 
          }
          
        });
      }

      itemContainer.delegate('.' + itemCls,'dblclick',function(ev){
        if(_self.get('disabled')){ //控件禁用后，阻止事件
          return;
        }
        var itemEl = $(ev.currentTarget),
          item = _self.getItemByElement(itemEl);
        if(_self.isItemDisabled(item,itemEl)){ //禁用状态下阻止选中
          return;
        }
        _self.fire('itemdblclick',{item:item,element : itemEl[0],domTarget:ev.target});
      });
      
      function setItemSelectedStatus(item,itemEl){
        var multipleSelect = _self.get('multipleSelect'),
          isSelected;
        isSelected = _self.isItemSelected(item,itemEl);
        if(!isSelected){
          if(!multipleSelect){
            _self.clearSelected();
          }
          _self.setItemSelected(item,true,itemEl);
        }else if(multipleSelect){
          _self.setItemSelected(item,false,itemEl);
        }else if(_self.get('cancelSelected')){
          _self.setSelected(null); //选中空记录
        }      
      }
      _self.on('itemrendered itemupdated',function(ev){
        var item = ev.item,
          element = ev.element;
        _self._syncItemStatus(item,element);
      });
    },
    //获取值，通过字段
    getValueByField : function(item,field){
      return item && item[field];
    }, 
    //同步选项状态
    _syncItemStatus : function(item,element){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      BUI.each(itemStatusFields,function(v,k){
        if(item[v] != null){
          _self.get('view').setItemStatusCls(k,element,item[v]);
        }
      });
    },
    /**
     * @protected
     * 获取记录中的状态值，未定义则为undefined
     * @param  {Object} item  记录
     * @param  {String} status 状态名
     * @return {Boolean|undefined}  
     */
    getStatusValue : function(item,status){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields'),
        field = itemStatusFields[status];
      return item[field];
    },
    /**
     * 获取选项数量
     * @return {Number} 选项数量
     */
    getCount : function(){
      var items = this.getItems();
      return items ? items.length : 0;
    },
    /**
     * 更改状态值对应的字段
     * @protected
     * @param  {String} status 状态名
     * @return {String} 状态对应的字段
     */
    getStatusField : function(status){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      return itemStatusFields[status];
    },
    /**
     * 设置记录状态值
     * @protected
     * @param  {Object} item  记录
     * @param  {String} status 状态名
     * @param {Boolean} value 状态值
     */
    setStatusValue : function(item,status,value){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields'),
        field = itemStatusFields[status];
      if(field){
        item[field] = value;
      }
    },
    /**
     * @ignore
     * 获取选项文本
     */
    getItemText : function(item){
      var _self = this,
          textGetter = _self.get('textGetter');
      if(!item)
      {
          return '';
      }
      if(textGetter){
        return textGetter(item);
      }else{
        return $(_self.findElement(item)).text();
      }
    },
    /**
     * 删除项
     * @param  {Object} item 选项记录
     * @ignore
     */
    removeItem : function (item) {
      var _self = this,
        items = _self.get('items'),
        element = _self.findElement(item),
        index;
      index = BUI.Array.indexOf(item,items);
      if(index !== -1){
        items.splice(index, 1);
      }
      _self.get('view').removeItem(item,element);
      _self.fire('itemremoved',{item:item,domTarget: $(element)[0],element : element});
    },
    /**
     * 在指定位置添加选项,选项值为一个对象
     * @param {Object} item 选项
     * @param {Number} index 索引
     * @ignore
     */
    addItemAt : function(item,index) {
      var _self = this,
        items = _self.get('items');
      if(index === undefined) {
          index = items.length;
      }
      items.splice(index, 0, item);
      _self.addItemToView(item,index);
      return item;
    }, 
    /**
     * @protected
     * 直接在View上显示
     * @param {Object} item 选项
     * @param {Number} index 索引
     * 
     */
    addItemToView : function(item,index){
      var _self = this,
        element = _self.get('view').addItem(item,index);
      _self.fire('itemrendered',{item:item,domTarget : $(element)[0],element : element});
      return element;
    },
    /**
     * 更新列表项
     * @param  {Object} item 选项值
     * @ignore
     */
    updateItem : function(item){
      var _self = this,
        element =  _self.get('view').updateItem(item);
      _self.fire('itemupdated',{item : item,domTarget : $(element)[0],element : element});
    },
    /**
     * 设置列表记录
     * <pre><code>
     *   list.setItems(items);
     *   //等同 
     *   list.set('items',items);
     * </code></pre>
     * @param {Array} items 列表记录
     */
    setItems : function(items){
      var _self = this;
      if(items != _self.getItems()){
        _self.setInternal('items',items);
      }
      //清理子控件
      _self.clearControl();
      _self.fire('beforeitemsshow');
      BUI.each(items,function(item,index){
        _self.addItemToView(item,index);
      });
      _self.fire('itemsshow');
    },
    /**
     * 获取所有选项
     * @return {Array} 选项集合
     * @override
     * @ignore
     */
    getItems : function () {
      
      return this.get('items');
    },
     /**
     * 获取DOM结构中的数据
     * @protected
     * @param {HTMLElement} element DOM 结构
     * @return {Object} 该项对应的值
     */
    getItemByElement : function(element){
      return this.get('view').getItemByElement(element);
    },
    /**
     * 获取选中的第一项,
     * <pre><code>
     * var item = list.getSelected(); //多选模式下第一条
     * </code></pre>
     * @return {Object} 选中的第一项或者为null
     */
    getSelected : function(){ //this.getSelection()[0] 的方式效率太低
      var _self = this,
        element = _self.get('view').getFirstElementByStatus('selected');
        return _self.getItemByElement(element) || null;
    },
    /**
     * 根据状态获取选项
     * <pre><code>
     *   //设置状态
     *   list.setItemStatus(item,'active');
     *   
     *   //获取'active'状态的选项
     *   list.getItemsByStatus('active');
     * </code></pre>
     * @param  {String} status 状态名
     * @return {Array}  选项组集合
     */
    getItemsByStatus : function(status){
      var _self = this,
        elements = _self.get('view').getElementsByStatus(status),
        rst = [];
      BUI.each(elements,function(element){
        rst.push(_self.getItemByElement(element));
      });
      return rst;
    },
    /**
     * 查找指定的项的DOM结构
     * <pre><code>
     *   var item = list.getItem('2'); //获取选项
     *   var element = list.findElement(item);
     *   $(element).addClass('xxx');
     * </code></pre>
     * @param  {Object} item 
     * @return {HTMLElement} element
     */
    findElement : function(item){
      var _self = this;
      if(BUI.isString(item)){
        item = _self.getItem(item);
      }
      return this.get('view').findElement(item);
    },
    findItemByField : function(field,value){
      var _self = this,
        items = _self.get('items'),
        result = null;
      BUI.each(items,function(item){
        if(item[field] != null && item[field] == value){//会出现false == '','0' == false的情况
            result = item;
            return false;
        }
      });

      return result;
    },
    /**
     * @override
     * @ignore
     */
    setItemSelectedStatus : function(item,selected,element){
      var _self = this;
      element = element || _self.findElement(item);
      //_self.get('view').setItemSelected(item,selected,element);
      _self.setItemStatus(item,'selected',selected,element);
      //_self.afterSelected(item,selected,element);
    },
    /**
     * 设置所有选项选中
     * @ignore
     */
    setAllSelection : function(){
      var _self = this,
        items = _self.getItems();
      _self.setSelection(items);
    },
    /**
     * 选项是否被选中
     * <pre><code>
     *   var item = list.getItem('2');
     *   if(list.isItemSelected(item)){
     *     //do something
     *   }
     * </code></pre>
     * @override
     * @param  {Object}  item 选项
     * @return {Boolean}  是否选中
     */
    isItemSelected : function(item,element){
      var _self = this;
      element = element || _self.findElement(item);

      return _self.get('view').isElementSelected(element);
    },
    /**
     * 是否选项被禁用
     * <pre><code>
     * var item = list.getItem('2');
     * if(list.isItemDisabled(item)){ //如果选项禁用
     *   //do something
     * }
     * </code></pre>
     * @param {Object} item 选项
     * @return {Boolean} 选项是否禁用
     */
    isItemDisabled : function(item,element){
      return this.hasStatus(item,'disabled',element);
    },
    /**
     * 设置选项禁用
     * <pre><code>
     * var item = list.getItem('2');
     * list.setItemDisabled(item,true);//设置选项禁用，会在DOM上添加 itemCls + 'disabled'的样式
     * list.setItemDisabled(item,false); //取消禁用，可以用{@link #itemStatusCls} 来替换样式
     * </code></pre>
     * @param {Object} item 选项
     */
    setItemDisabled : function(item,disabled){
      
      var _self = this;
      /*if(disabled){
        //清除选择
        _self.setItemSelected(item,false);
      }*/
      _self.setItemStatus(item,'disabled',disabled);
    },
    /**
     * 获取选中的项的值
     * @override
     * @return {Array} 
     * @ignore
     */
    getSelection : function(){
      var _self = this,
        elements = _self.get('view').getSelectedElements(),
        rst = [];
      BUI.each(elements,function(elem){
        rst.push(_self.getItemByElement(elem));
      });
      return rst;
    },
    /**
     * @protected
     * @override
     * 清除者列表项的DOM
     */
    clearControl : function(){
      this.fire('beforeitemsclear');
      this.get('view').clearControl();
      this.fire('itemsclear');
    },
    /**
     * 选项是否存在某种状态
     * <pre><code>
     * var item = list.getItem('2');
     * list.setItemStatus(item,'active',true);
     * list.hasStatus(item,'active'); //true
     *
     * list.setItemStatus(item,'active',false);
     * list.hasStatus(item,'false'); //true
     * </code></pre>
     * @param {*} item 选项
     * @param {String} status 状态名称，如selected,hover,open等等
     * @param {HTMLElement} [element] 选项对应的Dom，放置反复查找
     * @return {Boolean} 是否具有某种状态
     */
    hasStatus : function(item,status,element){
      if(!item){
        return false;
      }
      var _self = this,
        field = _self.getStatusField(status);
      /*if(field){
        return _self.getStatusValue(item,status);
      }*/
      element = element || _self.findElement(item);
      return _self.get('view').hasStatus(status,element);
    },
    /**
     * 设置选项状态,可以设置任何自定义状态
     * <pre><code>
     * var item = list.getItem('2');
     * list.setItemStatus(item,'active',true);
     * list.hasStatus(item,'active'); //true
     *
     * list.setItemStatus(item,'active',false);
     * list.hasStatus(item,'false'); //true
     * </code></pre>
     * @param {*} item 选项
     * @param {String} status 状态名称
     * @param {Boolean} value 状态值，true,false
     * @param {HTMLElement} [element] 选项对应的Dom，放置反复查找
     */
    setItemStatus : function(item,status,value,element){
      var _self = this;
      if(item){
        element = element || _self.findElement(item);
      }
      
      if(!_self.isItemDisabled(item,element) || status === 'disabled'){ //禁用后，阻止添加任何状态变化
        if(item){
          if(status === 'disabled' && value){ //禁用，同时清理其他状态
            _self.clearItemStatus(item);
          }
          _self.setStatusValue(item,status,value);
          _self.get('view').setItemStatusCls(status,element,value);
          _self.fire('itemstatuschange',{item : item,status : status,value : value,element : element});
        }
        
        if(status === 'selected'){ //处理选中
          _self.afterSelected(item,value,element);
        }
      }
      
    },
    /**
     * 清除所有选项状态,如果指定清除的状态名，则清除指定的，否则清除所有状态
     * @param {Object} item 选项
     */
    clearItemStatus : function(item,status,element){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      element = element || _self.findElement(item);
        
      if(status){
        _self.setItemStatus(item,status,false,element);
      }else{
        BUI.each(itemStatusFields,function(v,k){
          _self.setItemStatus(item,k,false,element);
        });
        if(!itemStatusFields['selected']){
          _self.setItemSelected(item,false);
        }
        //移除hover状态
        _self.setItemStatus(item,'hover',false);
      }
      
    }
  });

  domList.View = domListView;

  return domList;
});/**
 * @fileOverview 列表选项，使用键盘导航
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/list/keynav',['bui/common'],function (require) {
  'use strict';
  /**
   * @class BUI.List.KeyNav
   * 列表导航扩展类
   */
  var  BUI = require('bui/common'),
    KeyNav = function(){};

  KeyNav.ATTRS = {
    /**
     * 选项高亮使用的状态,有些场景下，使用selected更合适
     * @cfg {String} [highlightedStatus='hover']
     */
    highlightedStatus : {
      value : 'hover'
    }
  };

  BUI.augment(KeyNav,{

    /**
     * 设置选项高亮，默认使用 'hover' 状态
     * @param  {Object} item 选项
     * @param  {Boolean} value 状态值，true,false
     * @protected
     */
    setHighlighted : function(item,element){
      if(this.hasStatus(item,'hover',element)){
        return;
      }
      var _self = this,
        highlightedStatus = _self.get('highlightedStatus'),
        lightedElement = _self._getHighLightedElement(),
        lightedItem = lightedElement ? _self.getItemByElement(lightedElement) : null;
      if(lightedItem !== item){
        if(lightedItem){
          this.setItemStatus(lightedItem,highlightedStatus,false,lightedElement);
        }
        this.setItemStatus(item,highlightedStatus,true,element);
        _self._scrollToItem(item,element);
      }
    },
    _getHighLightedElement : function(){
      var _self = this,
        highlightedStatus = _self.get('highlightedStatus'),
        element = _self.get('view').getFirstElementByStatus(highlightedStatus);
      return element;
    },
    /**
     * 获取高亮的选项
     * @return {Object} item
     * @protected
     */
    getHighlighted : function(){
      var _self = this,
        highlightedStatus = _self.get('highlightedStatus'),
        element = _self.get('view').getFirstElementByStatus(highlightedStatus);
      return _self.getItemByElement(element) || null;
    },
    /**
     * 获取列数
     * @return {Number} 选项的列数,默认为1列
     * @protected
     */
    getColumnCount : function(){
      var _self = this,
        firstItem = _self.getFirstItem(),
        element = _self.findElement(firstItem),
        node = $(element);
      if(element){
        return parseInt(node.parent().width() / node.outerWidth(),10);
      }
      return 1;
    },
    /**
     * 获取选项的行数 ，总数/列数 = list.getCount / column
     * @protected
     * @return {Number} 选项行数
     */
    getRowCount : function(columns){
      var _self = this;
      columns = columns || _self.getColumnCount();
      return (this.getCount() + columns - 1) / columns;
    },
    _getNextItem : function(forward,skip,count){
      var _self = this,
        currentIndx = _self._getCurrentIndex(),//默认第一行
        itemCount = _self.getCount(),
        factor = forward ? 1 : -1,
        nextIndex; 
      if(currentIndx === -1){
        return forward ? _self.getFirstItem() : _self.getLastItem();
      }
      if(!forward){
        skip = skip * factor;
      }
      nextIndex = (currentIndx + skip + count) % count;
      if(nextIndex > itemCount - 1){ //如果位置超出索引位置
        if(forward){
          nextIndex = nextIndex -  (itemCount - 1);
        }else{
          nextIndex = nextIndex + skip;
        }
        
      }
      return _self.getItemAt(nextIndex);
    },
    //获取左边一项
    _getLeftItem : function(){
      var _self = this,
        count = _self.getCount(),
        column = _self.getColumnCount();
      if(!count || column <= 1){ //单列时,或者为0时
        return null;
      }
      return _self._getNextItem(false,1,count);
    },
    //获取当前项
    _getCurrentItem : function(){
      return this.getHighlighted();
    },
    //获取当前项
    _getCurrentIndex : function(){
      var _self = this,
        item = _self._getCurrentItem();
      return this.indexOfItem(item);
    },
    //获取右边一项
    _getRightItem : function(){
      var _self = this,
        count = _self.getCount(),
        column = _self.getColumnCount();
      if(!count || column <= 1){ //单列时,或者为0时
        return null;
      }
      return this._getNextItem(true,1,count);
    },
    //获取下面一项
    _getDownItem : function(){
      var _self = this,
        columns = _self.getColumnCount(),
        rows = _self.getRowCount(columns);
      if(rows <= 1){ //单行或者为0时
        return null;
      }

      return  this._getNextItem(true,columns,columns * rows);

    },
    getScrollContainer : function(){
      return this.get('el');
    },
    /**
     * @protected
     * 只处理上下滚动，不处理左右滚动
     * @return {Boolean} 是否可以上下滚动
     */
    isScrollVertical : function(){
      var _self = this,
        el = _self.get('el'),
        container = _self.get('view').getItemContainer();

      return el.height() < container.height();
    },

    _scrollToItem : function(item,element){
      var _self = this;

      if(_self.isScrollVertical()){
        element = element || _self.findElement(item);
        var container = _self.getScrollContainer(),
          top = $(element).position().top,
          ctop = container.position().top,
          cHeight = container.height(),
          distance = top - ctop,
          height = $(element).height(),
          scrollTop = container.scrollTop();

        if(distance < 0 || distance > cHeight - height){
          container.scrollTop(scrollTop + distance);
        }

      }
    },
    //获取上面一项
    _getUpperItem : function(){
      var _self = this,
        columns = _self.getColumnCount(),
        rows = _self.getRowCount(columns);
      if(rows <= 1){ //单行或者为0时
        return null;
      }
      return this._getNextItem(false,columns,columns * rows);
    },
    /**
     * 处理向上导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavUp : function (ev) {

      var _self = this,
        upperItem = _self._getUpperItem();
      _self.setHighlighted(upperItem);
    },
    /**
     * 处理向下导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavDown : function (ev) {
      
      this.setHighlighted(this._getDownItem());
    },
    /**
     * 处理向左导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavLeft : function (ev) {
      this.setHighlighted(this._getLeftItem());
    },
    
    /**
     * 处理向右导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavRight : function (ev) {
      this.setHighlighted(this._getRightItem());
    },
    /**
     * 处理确认键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEnter : function (ev) {
      var _self = this,
        current = _self._getCurrentItem(),
        element;
      if(current){
        element = _self.findElement(current);
        //_self.setSelected(current);
        $(element).trigger('click');
      }
    },
    /**
     * 处理 esc 键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEsc : function (ev) {
      this.setHighlighted(null); //移除
    },
    /**
     * 处理Tab键
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavTab : function(ev){
      this.setHighlighted(this._getRightItem());
    }

  });

  return KeyNav;
});/**
 * @fileOverview 列表排序
 * @ignore
 */

define('bui/list/sortable',['bui/common','bui/data'],function (require) {

  var BUI = require('bui/common'),
    DataSortable = require('bui/data').Sortable;

  /**
   * @class BUI.List.Sortable
   * 列表排序的扩展
   * @extends BUI.Data.Sortable
   */
  var Sortable = function(){

  };



  Sortable.ATTRS = BUI.merge(true,DataSortable.ATTRS, {

  });

  BUI.augment(Sortable,DataSortable,{
    
    /**
     * @protected
     * @override
     * @ignore
     * 覆写比较方法
     */
    compare : function(obj1,obj2,field,direction){
      var _self = this,
        dir;
      field = field || _self.get('sortField');
      direction = direction || _self.get('sortDirection');
      //如果未指定排序字段，或方向，则按照默认顺序
      if(!field || !direction){
        return 1;
      }
      dir = direction === 'ASC' ? 1 : -1;
      if(!$.isPlainObject(obj1)){
        obj1 = _self.getItemByElement(obj1);
      }
      if(!$.isPlainObject(obj2)){
        obj2 = _self.getItemByElement(obj2);
      }

      return _self.get('compareFunction')(obj1[field],obj2[field]) * dir;
    },
    /**
     * 获取排序的集合
     * @protected
     * @return {Array} 排序集合
     */
    getSortData : function(){
      return $.makeArray(this.get('view').getAllElements());
    },
    /**
     * 列表排序
     * @param  {string} field  字段名
     * @param  {string} direction 排序方向 ASC,DESC
     */
    sort : function(field,direction){
      var _self = this,
        sortedElements = _self.sortData(field,direction),
        itemContainer = _self.get('view').getItemContainer();
      if(!_self.get('store')){
        _self.sortData(field,direction,_self.get('items'));
      }
      BUI.each(sortedElements,function(el){
        $(el).appendTo(itemContainer);
      });
    }

  });

  return Sortable;
});/**
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
});/**
 * @fileOverview 可选择的列表
 * @author dengbin
 * @ignore
 */

define('bui/list/listbox',['bui/list/simplelist'],function (require) {
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
        value : '<li><span class="x-checkbox"></span>{text}</li>'
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
define('bui/list/listitem',['bui/common'],function (require) {


  var BUI = require('bui/common'),
    Component = BUI.Component,
    UIBase = Component.UIBase;
    
  /**
   * @private
   * @class BUI.List.ItemView
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
define('bui/list/list',['bui/common'],function (require) {
  
  var BUI = require('bui/common'),
    Component = BUI.Component,
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
});