/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
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
   * \u9009\u9879\u662fDOM\u7684\u5217\u8868\u7684\u89c6\u56fe\u7c7b
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
     * \u6e05\u9664\u8005\u5217\u8868\u9879\u7684DOM
     */
    clearControl : function(){
      var _self = this,
        listEl = _self.getItemContainer(),
        itemCls = _self.get('itemCls');
      listEl.find('.'+itemCls).remove();
    },
    /**
     * \u6dfb\u52a0\u9009\u9879
     * @param {Object} item  \u9009\u9879\u503c
     * @param {Number} index \u7d22\u5f15
     */
    addItem : function(item,index){
      return this._createItem(item,index);
    },
    /**
     * \u83b7\u53d6\u6240\u6709\u7684\u8bb0\u5f55
     * @return {Array} \u8bb0\u5f55\u96c6\u5408
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
     * \u66f4\u65b0\u5217\u8868\u9879
     * @param  {Object} item \u9009\u9879\u503c
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
     * \u79fb\u9664\u9009\u9879
     * @param  {jQuery} element
     * @ignore
     */
    removeItem:function(item,element){
      element = element || this.findElement(item);
      $(element).remove();
    },
    /**
     * \u83b7\u53d6\u5217\u8868\u9879\u7684\u5bb9\u5668
     * @return {jQuery} \u5217\u8868\u9879\u5bb9\u5668
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
     * \u83b7\u53d6\u8bb0\u5f55\u7684\u6a21\u677f,itemTpl \u548c \u6570\u636eitem \u5408\u5e76\u4ea7\u751f\u7684\u6a21\u677f
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
    //\u521b\u5efa\u9879
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
     * \u83b7\u53d6\u5217\u8868\u9879\u5bf9\u5e94\u72b6\u6001\u7684\u6837\u5f0f
     * @param  {String} name \u72b6\u6001\u540d\u79f0
     * @return {String} \u72b6\u6001\u7684\u6837\u5f0f
     */
    getItemStatusCls : function(name){
      return getItemStatusCls(name,this);
    },
    /**
     * \u8bbe\u7f6e\u5217\u8868\u9879\u9009\u4e2d
     * @protected
     * @param {*} name \u72b6\u6001\u540d\u79f0
     * @param {HTMLElement} element DOM\u7ed3\u6784
     * @param {Boolean} value \u8bbe\u7f6e\u6216\u53d6\u6d88\u6b64\u72b6\u6001
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
     * \u662f\u5426\u6709\u67d0\u4e2a\u72b6\u6001
     * @param {*} name \u72b6\u6001\u540d\u79f0
     * @param {HTMLElement} element DOM\u7ed3\u6784
     * @return {Boolean} \u662f\u5426\u5177\u6709\u72b6\u6001
     */
    hasStatus : function(name,element){
      var _self = this,
        cls = _self.getItemStatusCls(name);
      return $(element).hasClass(cls);
    },
    /**
     * \u8bbe\u7f6e\u5217\u8868\u9879\u9009\u4e2d
     * @param {*} item   \u8bb0\u5f55
     * @param {Boolean} selected \u662f\u5426\u9009\u4e2d
     * @param {HTMLElement} element DOM\u7ed3\u6784
     */
    setItemSelected: function(item,selected,element){
      var _self = this;

      element = element || _self.findElement(item);
      _self.setItemStatusCls('selected',element,selected);
    },
    /**
     * \u83b7\u53d6\u6240\u6709\u5217\u8868\u9879\u7684DOM\u7ed3\u6784
     * @return {Array} DOM\u5217\u8868
     */
    getAllElements : function(){
      var _self = this,
        itemCls = _self.get('itemCls'),
        el = _self.get('el');
      return el.find('.' + itemCls);
    },
    /**
     * \u83b7\u53d6DOM\u7ed3\u6784\u4e2d\u7684\u6570\u636e
     * @param {HTMLElement} element DOM \u7ed3\u6784
     * @return {Object} \u8be5\u9879\u5bf9\u5e94\u7684\u503c
     */
    getItemByElement : function(element){
      var _self = this,
        dataField = _self.get('dataField');
      return $(element).data(dataField);
    },
    /**
     * \u6839\u636e\u72b6\u6001\u83b7\u53d6\u7b2c\u4e00\u4e2aDOM \u8282\u70b9
     * @param {String} name \u72b6\u6001\u540d\u79f0
     * @return {HTMLElement} Dom \u8282\u70b9
     */
    getFirstElementByStatus : function(name){
      var _self = this,
        cls = _self.getItemStatusCls(name),
        el = _self.get('el');
      return el.find('.' + cls)[0];
    },
    /**
     * \u6839\u636e\u72b6\u6001\u83b7\u53d6DOM
     * @return {Array} DOM\u6570\u7ec4
     */
    getElementsByStatus : function(status){
      var _self = this,
        cls = _self.getItemStatusCls(status),
        el = _self.get('el');
      return el.find('.' + cls);
    },
    /**
     * \u901a\u8fc7\u6837\u5f0f\u67e5\u627eDOM\u5143\u7d20
     * @param {String} css\u6837\u5f0f
     * @return {jQuery} DOM\u5143\u7d20\u7684\u6570\u7ec4\u5bf9\u8c61
     */
    getSelectedElements : function(){
      var _self = this,
        cls = _self.getItemStatusCls('selected'),
        el = _self.get('el');
      return el.find('.' + cls);
    },
    /**
     * \u67e5\u627e\u6307\u5b9a\u7684\u9879\u7684DOM\u7ed3\u6784
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
     * \u5217\u8868\u9879\u662f\u5426\u9009\u4e2d
     * @param  {HTMLElement}  element \u662f\u5426\u9009\u4e2d
     * @return {Boolean}  \u662f\u5426\u9009\u4e2d
     */
    isElementSelected : function(element){
      var _self = this,
        cls = _self.getItemStatusCls('selected');
      return element && $(element).hasClass(cls);
    }
  };

  //\u8f6c\u6362\u6210Object
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
    //\u83b7\u53d6\u72b6\u6001\u5bf9\u5e94\u7684\u503c
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
   * \u9009\u9879\u662fDOM\u7ed3\u6784\u7684\u5217\u8868
   * @extends BUI.Component.UIBase.List
   * @mixins BUI.Component.UIBase.Selection
   */
  var domList = function(){

  };

  domList.ATTRS =BUI.merge(true,List.ATTRS,Selection.ATTRS,{

    /**
     * \u5728DOM\u8282\u70b9\u4e0a\u5b58\u50a8\u6570\u636e\u7684\u5b57\u6bb5
     * @type {String}
     * @protected
     */
    dataField : {
        view:true,
        value:'data-item'
    },
    /**
     * \u9009\u9879\u6240\u5728\u5bb9\u5668\uff0c\u5982\u679c\u672a\u8bbe\u5b9a\uff0c\u4f7f\u7528 el
     * @type {jQuery}
     * @protected
     */
    itemContainer : {
        view : true
    },
    /**
     * \u9009\u9879\u72b6\u6001\u5bf9\u5e94\u7684\u9009\u9879\u503c
     * 
     *   - \u6b64\u5b57\u6bb5\u7528\u4e8e\u5c06\u9009\u9879\u8bb0\u5f55\u7684\u503c\u8ddf\u663e\u793a\u7684DOM\u72b6\u6001\u76f8\u5bf9\u5e94
     *   - \u4f8b\u5982\uff1a\u4e0b\u9762\u8bb0\u5f55\u4e2d <code> checked : true </code>\uff0c\u53ef\u4ee5\u4f7f\u5f97\u6b64\u8bb0\u5f55\u5bf9\u5e94\u7684DOM\u4e0a\u5e94\u7528\u5bf9\u5e94\u7684\u72b6\u6001(\u9ed8\u8ba4\u4e3a 'list-item-checked')
     *     <pre><code>{id : '1',text : 1,checked : true}</code></pre>
     *   - \u5f53\u66f4\u6539DOM\u7684\u72b6\u6001\u65f6\uff0c\u8bb0\u5f55\u4e2d\u5bf9\u5e94\u7684\u5b57\u6bb5\u5c5e\u6027\u4e5f\u4f1a\u8ddf\u7740\u53d8\u5316
     * <pre><code>
     *   var list = new List.SimpleList({
     *   render : '#t1',
     *   idField : 'id', //\u81ea\u5b9a\u4e49\u6837\u5f0f\u540d\u79f0
     *   itemStatusFields : {
     *     checked : 'checked',
     *     disabled : 'disabled'
     *   },
     *   items : [{id : '1',text : '1',checked : true},{id : '2',text : '2',disabled : true}]
     * });
     * list.render(); //\u5217\u8868\u6e32\u67d3\u540e\uff0c\u4f1a\u81ea\u52a8\u5e26\u6709checked,\u548cdisabled\u5bf9\u5e94\u7684\u6837\u5f0f
     *
     * var item = list.getItem('1');
     * list.hasStatus(item,'checked'); //true
     *
     * list.setItemStatus(item,'checked',false);
     * list.hasStatus(item,'checked');  //false
     * item.checked;                    //false
     * 
     * </code></pre>
     * ** \u6ce8\u610f **
     * \u6b64\u5b57\u6bb5\u8ddf {@link #itemStatusCls} \u4e00\u8d77\u4f7f\u7528\u6548\u679c\u66f4\u597d\uff0c\u53ef\u4ee5\u81ea\u5b9a\u4e49\u5bf9\u5e94\u72b6\u6001\u7684\u6837\u5f0f
     * @cfg {Object} itemStatusFields
     */
    itemStatusFields : {
      value : {}
    },
    /**
     * \u9879\u7684\u6837\u5f0f\uff0c\u7528\u6765\u83b7\u53d6\u5b50\u9879
     * @cfg {Object} itemCls
     */
    itemCls : {
      view : true
    },        
    /**
     * \u83b7\u53d6\u9879\u7684\u6587\u672c\uff0c\u9ed8\u8ba4\u83b7\u53d6\u663e\u793a\u7684\u6587\u672c
     * @type {Object}
     * @protected
     */
    textGetter : {

    },
    /**
     * \u9ed8\u8ba4\u7684\u52a0\u8f7d\u63a7\u4ef6\u5185\u5bb9\u7684\u914d\u7f6e,\u9ed8\u8ba4\u503c\uff1a
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
         * \u9009\u9879\u5bf9\u5e94\u7684DOM\u521b\u5efa\u5b8c\u6bd5
         * @event
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.item \u6e32\u67d3DOM\u5bf9\u5e94\u7684\u9009\u9879
         * @param {HTMLElement} e.element \u6e32\u67d3\u7684DOM\u5bf9\u8c61
         */
        'itemrendered' : true,
        /**
         * @event
         * \u5220\u9664\u9009\u9879
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.item \u5220\u9664DOM\u5bf9\u5e94\u7684\u9009\u9879
         * @param {HTMLElement} e.element \u5220\u9664\u7684DOM\u5bf9\u8c61
         */
        'itemremoved' : true,
        /**
         * @event
         * \u66f4\u65b0\u9009\u9879
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.item \u66f4\u65b0DOM\u5bf9\u5e94\u7684\u9009\u9879
         * @param {HTMLElement} e.element \u66f4\u65b0\u7684DOM\u5bf9\u8c61
         */
        'itemupdated' : true,
        /**
        * \u8bbe\u7f6e\u8bb0\u5f55\u65f6\uff0c\u6240\u6709\u7684\u8bb0\u5f55\u663e\u793a\u5b8c\u6bd5\u540e\u89e6\u53d1
        * @event
        */
        'itemsshow' : false,
        /**
        * \u8bbe\u7f6e\u8bb0\u5f55\u540e\uff0c\u6240\u6709\u7684\u8bb0\u5f55\u663e\u793a\u524d\u89e6\u53d1
        * @event:
        */
        'beforeitemsshow' : false,
        /**
        * \u6e05\u7a7a\u6240\u6709\u8bb0\u5f55\uff0cDOM\u6e05\u7406\u5b8c\u6210\u540e
        * @event
        */
        'itemsclear' : false,
        /**
         * \u53cc\u51fb\u662f\u89e6\u53d1
        * @event
        * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.item DOM\u5bf9\u5e94\u7684\u9009\u9879
        * @param {HTMLElement} e.element \u9009\u9879\u7684DOM\u5bf9\u8c61
        * @param {HTMLElement} e.domTarget \u70b9\u51fb\u7684\u5143\u7d20
        */
        'itemdblclick' : false,
        /**
        * \u6e05\u7a7a\u6240\u6709Dom\u524d\u89e6\u53d1
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
     
    //\u8bbe\u7f6e\u8bb0\u5f55
    _uiSetItems : function (items) {
      var _self = this;
      //\u4f7f\u7528srcNode \u7684\u65b9\u5f0f\uff0c\u4e0d\u540c\u6b65
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
        if(_self.get('disabled')){ //\u63a7\u4ef6\u7981\u7528\u540e\uff0c\u963b\u6b62\u4e8b\u4ef6
          return;
        }
        var itemEl = $(ev.currentTarget),
          item = _self.getItemByElement(itemEl);
        if(_self.isItemDisabled(item,itemEl)){ //\u7981\u7528\u72b6\u6001\u4e0b\u963b\u6b62\u9009\u4e2d
          return;
        }
        var rst = _self.fire('itemclick',{item:item,element : itemEl[0],domTarget:ev.target});
        if(rst !== false && selectedEvent == 'click' && _self.isItemSelectable(item)){
          setItemSelectedStatus(item,itemEl); 
        }
      });
      if(selectedEvent !== 'click'){ //\u5982\u679c\u9009\u4e2d\u4e8b\u4ef6\u4e0d\u7b49\u4e8eclick\uff0c\u5219\u8fdb\u884c\u76d1\u542c\u9009\u4e2d
        itemContainer.delegate('.'+itemCls,selectedEvent,function(ev){
          if(_self.get('disabled')){ //\u63a7\u4ef6\u7981\u7528\u540e\uff0c\u963b\u6b62\u4e8b\u4ef6
            return;
          }
          var itemEl = $(ev.currentTarget),
            item = _self.getItemByElement(itemEl);
          if(_self.isItemDisabled(item,itemEl)){ //\u7981\u7528\u72b6\u6001\u4e0b\u963b\u6b62\u9009\u4e2d
            return;
          }
          if(_self.isItemSelectable(item)){
            setItemSelectedStatus(item,itemEl); 
          }
          
        });
      }

      itemContainer.delegate('.' + itemCls,'dblclick',function(ev){
        if(_self.get('disabled')){ //\u63a7\u4ef6\u7981\u7528\u540e\uff0c\u963b\u6b62\u4e8b\u4ef6
          return;
        }
        var itemEl = $(ev.currentTarget),
          item = _self.getItemByElement(itemEl);
        if(_self.isItemDisabled(item,itemEl)){ //\u7981\u7528\u72b6\u6001\u4e0b\u963b\u6b62\u9009\u4e2d
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
        }           
      }
      _self.on('itemrendered itemupdated',function(ev){
        var item = ev.item,
          element = ev.element;
        _self._syncItemStatus(item,element);
      });
    },
    //\u83b7\u53d6\u503c\uff0c\u901a\u8fc7\u5b57\u6bb5
    getValueByField : function(item,field){
      return item && item[field];
    }, 
    //\u540c\u6b65\u9009\u9879\u72b6\u6001
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
     * \u83b7\u53d6\u8bb0\u5f55\u4e2d\u7684\u72b6\u6001\u503c\uff0c\u672a\u5b9a\u4e49\u5219\u4e3aundefined
     * @param  {Object} item  \u8bb0\u5f55
     * @param  {String} status \u72b6\u6001\u540d
     * @return {Boolean|undefined}  
     */
    getStatusValue : function(item,status){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields'),
        field = itemStatusFields[status];
      return item[field];
    },
    /**
     * \u83b7\u53d6\u9009\u9879\u6570\u91cf
     * @return {Number} \u9009\u9879\u6570\u91cf
     */
    getCount : function(){
      var items = this.getItems();
      return items ? items.length : 0;
    },
    /**
     * \u66f4\u6539\u72b6\u6001\u503c\u5bf9\u5e94\u7684\u5b57\u6bb5
     * @protected
     * @param  {String} status \u72b6\u6001\u540d
     * @return {String} \u72b6\u6001\u5bf9\u5e94\u7684\u5b57\u6bb5
     */
    getStatusField : function(status){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      return itemStatusFields[status];
    },
    /**
     * \u8bbe\u7f6e\u8bb0\u5f55\u72b6\u6001\u503c
     * @protected
     * @param  {Object} item  \u8bb0\u5f55
     * @param  {String} status \u72b6\u6001\u540d
     * @param {Boolean} value \u72b6\u6001\u503c
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
     * \u83b7\u53d6\u9009\u9879\u6587\u672c
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
     * \u5220\u9664\u9879
     * @param  {Object} item \u9009\u9879\u8bb0\u5f55
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
     * \u5728\u6307\u5b9a\u4f4d\u7f6e\u6dfb\u52a0\u9009\u9879,\u9009\u9879\u503c\u4e3a\u4e00\u4e2a\u5bf9\u8c61
     * @param {Object} item \u9009\u9879
     * @param {Number} index \u7d22\u5f15
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
     * \u76f4\u63a5\u5728View\u4e0a\u663e\u793a
     * @param {Object} item \u9009\u9879
     * @param {Number} index \u7d22\u5f15
     * 
     */
    addItemToView : function(item,index){
      var _self = this,
        element = _self.get('view').addItem(item,index);
      _self.fire('itemrendered',{item:item,domTarget : $(element)[0],element : element});
      return element;
    },
    /**
     * \u66f4\u65b0\u5217\u8868\u9879
     * @param  {Object} item \u9009\u9879\u503c
     * @ignore
     */
    updateItem : function(item){
      var _self = this,
        element =  _self.get('view').updateItem(item);
      _self.fire('itemupdated',{item : item,domTarget : $(element)[0],element : element});
    },
    /**
     * \u8bbe\u7f6e\u5217\u8868\u8bb0\u5f55
     * <pre><code>
     *   list.setItems(items);
     *   //\u7b49\u540c 
     *   list.set('items',items);
     * </code></pre>
     * @param {Array} items \u5217\u8868\u8bb0\u5f55
     */
    setItems : function(items){
      var _self = this;
      if(items != _self.getItems()){
        _self.setInternal('items',items);
      }
      //\u6e05\u7406\u5b50\u63a7\u4ef6
      _self.clearControl();
      _self.fire('beforeitemsshow');
      BUI.each(items,function(item,index){
        _self.addItemToView(item,index);
      });
      _self.fire('itemsshow');
    },
    /**
     * \u83b7\u53d6\u6240\u6709\u9009\u9879
     * @return {Array} \u9009\u9879\u96c6\u5408
     * @override
     * @ignore
     */
    getItems : function () {
      
      return this.get('items');
    },
     /**
     * \u83b7\u53d6DOM\u7ed3\u6784\u4e2d\u7684\u6570\u636e
     * @protected
     * @param {HTMLElement} element DOM \u7ed3\u6784
     * @return {Object} \u8be5\u9879\u5bf9\u5e94\u7684\u503c
     */
    getItemByElement : function(element){
      return this.get('view').getItemByElement(element);
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u7684\u7b2c\u4e00\u9879,
     * <pre><code>
     * var item = list.getSelected(); //\u591a\u9009\u6a21\u5f0f\u4e0b\u7b2c\u4e00\u6761
     * </code></pre>
     * @return {Object} \u9009\u4e2d\u7684\u7b2c\u4e00\u9879\u6216\u8005\u4e3anull
     */
    getSelected : function(){ //this.getSelection()[0] \u7684\u65b9\u5f0f\u6548\u7387\u592a\u4f4e
      var _self = this,
        element = _self.get('view').getFirstElementByStatus('selected');
        return _self.getItemByElement(element) || null;
    },
    /**
     * \u6839\u636e\u72b6\u6001\u83b7\u53d6\u9009\u9879
     * <pre><code>
     *   //\u8bbe\u7f6e\u72b6\u6001
     *   list.setItemStatus(item,'active');
     *   
     *   //\u83b7\u53d6'active'\u72b6\u6001\u7684\u9009\u9879
     *   list.getItemsByStatus('active');
     * </code></pre>
     * @param  {String} status \u72b6\u6001\u540d
     * @return {Array}  \u9009\u9879\u7ec4\u96c6\u5408
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
     * \u67e5\u627e\u6307\u5b9a\u7684\u9879\u7684DOM\u7ed3\u6784
     * <pre><code>
     *   var item = list.getItem('2'); //\u83b7\u53d6\u9009\u9879
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
        if(item[field] === value){
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
     * \u8bbe\u7f6e\u6240\u6709\u9009\u9879\u9009\u4e2d
     * @ignore
     */
    setAllSelection : function(){
      var _self = this,
        items = _self.getItems();
      _self.setSelection(items);
    },
    /**
     * \u9009\u9879\u662f\u5426\u88ab\u9009\u4e2d
     * <pre><code>
     *   var item = list.getItem('2');
     *   if(list.isItemSelected(item)){
     *     //do something
     *   }
     * </code></pre>
     * @override
     * @param  {Object}  item \u9009\u9879
     * @return {Boolean}  \u662f\u5426\u9009\u4e2d
     */
    isItemSelected : function(item,element){
      var _self = this;
      element = element || _self.findElement(item);

      return _self.get('view').isElementSelected(element);
    },
    /**
     * \u662f\u5426\u9009\u9879\u88ab\u7981\u7528
     * <pre><code>
     * var item = list.getItem('2');
     * if(list.isItemDisabled(item)){ //\u5982\u679c\u9009\u9879\u7981\u7528
     *   //do something
     * }
     * </code></pre>
     * @param {Object} item \u9009\u9879
     * @return {Boolean} \u9009\u9879\u662f\u5426\u7981\u7528
     */
    isItemDisabled : function(item,element){
      return this.hasStatus(item,'disabled',element);
    },
    /**
     * \u8bbe\u7f6e\u9009\u9879\u7981\u7528
     * <pre><code>
     * var item = list.getItem('2');
     * list.setItemDisabled(item,true);//\u8bbe\u7f6e\u9009\u9879\u7981\u7528\uff0c\u4f1a\u5728DOM\u4e0a\u6dfb\u52a0 itemCls + 'disabled'\u7684\u6837\u5f0f
     * list.setItemDisabled(item,false); //\u53d6\u6d88\u7981\u7528\uff0c\u53ef\u4ee5\u7528{@link #itemStatusCls} \u6765\u66ff\u6362\u6837\u5f0f
     * </code></pre>
     * @param {Object} item \u9009\u9879
     */
    setItemDisabled : function(item,disabled){
      
      var _self = this;
      /*if(disabled){
        //\u6e05\u9664\u9009\u62e9
        _self.setItemSelected(item,false);
      }*/
      _self.setItemStatus(item,'disabled',disabled);
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u7684\u9879\u7684\u503c
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
     * \u6e05\u9664\u8005\u5217\u8868\u9879\u7684DOM
     */
    clearControl : function(){
      this.fire('beforeitemsclear');
      this.get('view').clearControl();
      this.fire('itemsclear');
    },
    /**
     * \u9009\u9879\u662f\u5426\u5b58\u5728\u67d0\u79cd\u72b6\u6001
     * <pre><code>
     * var item = list.getItem('2');
     * list.setItemStatus(item,'active',true);
     * list.hasStatus(item,'active'); //true
     *
     * list.setItemStatus(item,'active',false);
     * list.hasStatus(item,'false'); //true
     * </code></pre>
     * @param {*} item \u9009\u9879
     * @param {String} status \u72b6\u6001\u540d\u79f0\uff0c\u5982selected,hover,open\u7b49\u7b49
     * @param {HTMLElement} [element] \u9009\u9879\u5bf9\u5e94\u7684Dom\uff0c\u653e\u7f6e\u53cd\u590d\u67e5\u627e
     * @return {Boolean} \u662f\u5426\u5177\u6709\u67d0\u79cd\u72b6\u6001
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
     * \u8bbe\u7f6e\u9009\u9879\u72b6\u6001,\u53ef\u4ee5\u8bbe\u7f6e\u4efb\u4f55\u81ea\u5b9a\u4e49\u72b6\u6001
     * <pre><code>
     * var item = list.getItem('2');
     * list.setItemStatus(item,'active',true);
     * list.hasStatus(item,'active'); //true
     *
     * list.setItemStatus(item,'active',false);
     * list.hasStatus(item,'false'); //true
     * </code></pre>
     * @param {*} item \u9009\u9879
     * @param {String} status \u72b6\u6001\u540d\u79f0
     * @param {Boolean} value \u72b6\u6001\u503c\uff0ctrue,false
     * @param {HTMLElement} [element] \u9009\u9879\u5bf9\u5e94\u7684Dom\uff0c\u653e\u7f6e\u53cd\u590d\u67e5\u627e
     */
    setItemStatus : function(item,status,value,element){
      var _self = this;
      if(item){
        element = element || _self.findElement(item);
      }
      
      if(!_self.isItemDisabled(item,element) || status === 'disabled'){ //\u7981\u7528\u540e\uff0c\u963b\u6b62\u6dfb\u52a0\u4efb\u4f55\u72b6\u6001\u53d8\u5316
        if(item){
          if(status === 'disabled' && value){ //\u7981\u7528\uff0c\u540c\u65f6\u6e05\u7406\u5176\u4ed6\u72b6\u6001
            _self.clearItemStatus(item);
          }
          _self.setStatusValue(item,status,value);
          _self.get('view').setItemStatusCls(status,element,value);
          _self.fire('itemstatuschange',{item : item,status : status,value : value,element : element});
        }
        
        if(status === 'selected'){ //\u5904\u7406\u9009\u4e2d
          _self.afterSelected(item,value,element);
        }
      }
      
    },
    /**
     * \u6e05\u9664\u6240\u6709\u9009\u9879\u72b6\u6001,\u5982\u679c\u6307\u5b9a\u6e05\u9664\u7684\u72b6\u6001\u540d\uff0c\u5219\u6e05\u9664\u6307\u5b9a\u7684\uff0c\u5426\u5219\u6e05\u9664\u6240\u6709\u72b6\u6001
     * @param {Object} item \u9009\u9879
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
        //\u79fb\u9664hover\u72b6\u6001
        _self.setItemStatus(item,'hover',false);
      }
      
    }
  });

  domList.View = domListView;

  return domList;
});
define('bui/list/keynav',function () {
  'use strict';
  /**
   * @class BUI.List.KeyNav
   * \u5217\u8868\u5bfc\u822a\u6269\u5c55\u7c7b
   */
  var  KeyNav = function(){};

  KeyNav.ATTRS = {
    /**
     * \u9009\u9879\u9ad8\u4eae\u4f7f\u7528\u7684\u72b6\u6001,\u6709\u4e9b\u573a\u666f\u4e0b\uff0c\u4f7f\u7528selected\u66f4\u5408\u9002
     * @cfg {String} [highlightedStatus='hover']
     */
    highlightedStatus : {
      value : 'hover'
    }
  };

  BUI.augment(KeyNav,{

    /**
     * \u8bbe\u7f6e\u9009\u9879\u9ad8\u4eae\uff0c\u9ed8\u8ba4\u4f7f\u7528 'hover' \u72b6\u6001
     * @param  {Object} item \u9009\u9879
     * @param  {Boolean} value \u72b6\u6001\u503c\uff0ctrue,false
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
      }
    },
    _getHighLightedElement : function(){
      var _self = this,
        highlightedStatus = _self.get('highlightedStatus'),
        element = _self.get('view').getFirstElementByStatus(highlightedStatus);
      return element;
    },
    /**
     * \u83b7\u53d6\u9ad8\u4eae\u7684\u9009\u9879
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
     * \u83b7\u53d6\u5217\u6570
     * @return {Number} \u9009\u9879\u7684\u5217\u6570,\u9ed8\u8ba4\u4e3a1\u5217
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
     * \u83b7\u53d6\u9009\u9879\u7684\u884c\u6570 \uff0c\u603b\u6570/\u5217\u6570 = list.getCount / column
     * @protected
     * @return {Number} \u9009\u9879\u884c\u6570
     */
    getRowCount : function(columns){
      var _self = this;
      columns = columns || _self.getColumnCount();
      return (this.getCount() + columns - 1) / columns;
    },
    _getNextItem : function(forward,skip,count){
      var _self = this,
        currentIndx = _self._getCurrentIndex(),//\u9ed8\u8ba4\u7b2c\u4e00\u884c
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
      if(nextIndex > itemCount - 1){ //\u5982\u679c\u4f4d\u7f6e\u8d85\u51fa\u7d22\u5f15\u4f4d\u7f6e
        if(forward){
          nextIndex = nextIndex -  (itemCount - 1);
        }else{
          nextIndex = nextIndex + skip;
        }
        
      }
      return _self.getItemAt(nextIndex);
    },
    //\u83b7\u53d6\u5de6\u8fb9\u4e00\u9879
    _getLeftItem : function(){
      var _self = this,
        count = _self.getCount(),
        column = _self.getColumnCount();
      if(!count || column <= 1){ //\u5355\u5217\u65f6,\u6216\u8005\u4e3a0\u65f6
        return null;
      }
      return _self._getNextItem(false,1,count);
    },
    //\u83b7\u53d6\u5f53\u524d\u9879
    _getCurrentItem : function(){
      return this.getHighlighted();
    },
    //\u83b7\u53d6\u5f53\u524d\u9879
    _getCurrentIndex : function(){
      var _self = this,
        item = _self._getCurrentItem();
      return this.indexOfItem(item);
    },
    //\u83b7\u53d6\u53f3\u8fb9\u4e00\u9879
    _getRightItem : function(){
      var _self = this,
        count = _self.getCount(),
        column = _self.getColumnCount();
      if(!count || column <= 1){ //\u5355\u5217\u65f6,\u6216\u8005\u4e3a0\u65f6
        return null;
      }
      return this._getNextItem(true,1,count);
    },
    //\u83b7\u53d6\u4e0b\u9762\u4e00\u9879
    _getDownItem : function(){
      var _self = this,
        columns = _self.getColumnCount(),
        rows = _self.getRowCount(columns);
      if(rows <= 1){ //\u5355\u884c\u6216\u8005\u4e3a0\u65f6
        return null;
      }
      return  this._getNextItem(true,columns,columns * rows);

    },
    //\u83b7\u53d6\u4e0a\u9762\u4e00\u9879
    _getUpperItem : function(){
      var _self = this,
        columns = _self.getColumnCount(),
        rows = _self.getRowCount(columns);
      if(rows <= 1){ //\u5355\u884c\u6216\u8005\u4e3a0\u65f6
        return null;
      }
      return this._getNextItem(false,columns,columns * rows);
    },
    /**
     * \u5904\u7406\u5411\u4e0a\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavUp : function (ev) {

      var _self = this,
        upperItem = _self._getUpperItem();
      _self.setHighlighted(upperItem);
    },
    /**
     * \u5904\u7406\u5411\u4e0b\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavDown : function (ev) {
      
      this.setHighlighted(this._getDownItem());
    },
    /**
     * \u5904\u7406\u5411\u5de6\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavLeft : function (ev) {
      this.setHighlighted(this._getLeftItem());
    },
    
    /**
     * \u5904\u7406\u5411\u53f3\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavRight : function (ev) {
      this.setHighlighted(this._getRightItem());
    },
    /**
     * \u5904\u7406\u786e\u8ba4\u952e
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
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
     * \u5904\u7406 esc \u952e
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavEsc : function (ev) {
      this.setHighlighted(null); //\u79fb\u9664
    },
    /**
     * \u5904\u7406Tab\u952e
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavTab : function(ev){
      this.setHighlighted(this._getRightItem());
    }

  });

  return KeyNav;
});
define('bui/list/simplelist',['bui/common','bui/list/domlist','bui/list/keynav','bui/list/sortable'],function (require) {

  /**
   * @name BUI.List
   * @namespace \u5217\u8868\u547d\u540d\u7a7a\u95f4
   * @ignore
   */
  var BUI = require('bui/common'),
    UIBase = BUI.Component.UIBase,
    DomList = require('bui/list/domlist'),
    KeyNav = require('bui/list/keynav'),
    Sortable = require('bui/list/sortable'),
    CLS_ITEM = BUI.prefix + 'list-item';
  
  /**
   * @class BUI.List.SimpleListView
   * \u7b80\u5355\u5217\u8868\u89c6\u56fe\u7c7b
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
   * \u7b80\u5355\u5217\u8868\uff0c\u7528\u4e8e\u663e\u793a\u7b80\u5355\u6570\u636e
   * <p>
   * <img src="../assets/img/class-list.jpg"/>
   * </p>
   * xclass:'simple-list'
   * ## \u663e\u793a\u9759\u6001\u6570\u7ec4\u7684\u6570\u636e
   * 
   * ** \u6700\u7b80\u5355\u7684\u5217\u8868 **
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
   * ** \u81ea\u5b9a\u4e49\u6a21\u677f\u7684\u5217\u8868 **
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
        itemContainer = _self.get('view').getItemContainer();

      itemContainer.delegate('.'+itemCls,'mouseover',function(ev){
        if(_self.get('disabled')){ //\u63a7\u4ef6\u7981\u7528\u540e\uff0c\u963b\u6b62\u4e8b\u4ef6
          return;
        }
        var element = ev.currentTarget,
          item = _self.getItemByElement(element);
        if(_self.isItemDisabled(ev.item,ev.currentTarget)){ //\u5982\u679c\u7981\u7528
          return;
        }
        
        if(_self.get('highlightedStatus') === 'hover'){
          _self.setHighlighted(item,element)
        }else{
          _self.setItemStatus(item,'hover',true,element);
        }
      }).delegate('.'+itemCls,'mouseout',function(ev){
        if(_self.get('disabled')){ //\u63a7\u4ef6\u7981\u7528\u540e\uff0c\u963b\u6b62\u4e8b\u4ef6
          return;
        }
        var sender = $(ev.currentTarget);
        _self.get('view').setElementHover(sender,false);
      });
    },
    /**
     * \u6dfb\u52a0
     * @protected
     */
    onAdd : function(e){
      var _self = this,
        store = _self.get('store'),
        item = e.record;
      if(_self.getCount() == 0){ //\u521d\u59cb\u4e3a\u7a7a\u65f6\uff0c\u5217\u8868\u8ddfStore\u4e0d\u540c\u6b65
        _self.setItems(store.getResult());
      }else{
        _self.addItemToView(item,e.index);
      }
      
    },
    /**
     * \u5220\u9664
    * @protected
    */
    onRemove : function(e){
      var _self = this,
        item = e.record;
      _self.removeItem(item);
    },
    /**
     * \u66f4\u65b0
    * @protected
    */
    onUpdate : function(e){
      this.updateItem(e.record);
    },
    /**
    * \u672c\u5730\u6392\u5e8f
    * @protected
    */
    onLocalSort : function(e){
      //this.onLoad(e);
      this.sort(e.field ,e.direction);
    },
    /**
     * \u52a0\u8f7d\u6570\u636e
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
       * \u9009\u9879\u96c6\u5408
       * @protected
       * @type {Array}
       */
      items : {
        view:true,
        value : []
      },
      /**
       * \u9009\u9879\u7684\u6837\u5f0f\uff0c\u7528\u6765\u83b7\u53d6\u5b50\u9879
       * <pre><code>
       * var list = new List.SimpleList({
       *   render : '#t1',
       *   itemCls : 'my-item', //\u81ea\u5b9a\u4e49\u6837\u5f0f\u540d\u79f0
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
       * \u9009\u9879\u7684\u9ed8\u8ba4id\u5b57\u6bb5
       * <pre><code>
       * var list = new List.SimpleList({
       *   render : '#t1',
       *   idField : 'id', //\u81ea\u5b9a\u4e49\u9009\u9879 id \u5b57\u6bb5
       *   items : [{id : '1',text : '1',type : '0'},{id : '2',text : '2',type : '1'}]
       * });
       * list.render();
       *
       * list.getItem('1'); //\u4f7f\u7528idField\u6307\u5b9a\u7684\u5b57\u6bb5\u8fdb\u884c\u67e5\u627e
       * </code></pre>
       * @cfg {String} [idField = 'value']
       */
      idField : {
        value : 'value'
      },
      /**
       * \u5217\u8868\u7684\u9009\u62e9\u5668\uff0c\u5c06\u5217\u8868\u9879\u9644\u52a0\u5230\u6b64\u8282\u70b9
       * @protected
       * @type {Object}
       */
      listSelector:{
        view:true,
        value:'ul'
      },
      /**
       * \u5217\u8868\u9879\u7684\u9ed8\u8ba4\u6a21\u677f\u3002
       *<pre><code>
       * var list = new List.SimpleList({
       *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;', //\u5217\u8868\u9879\u7684\u6a21\u677f
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
define('bui/list/listbox',['bui/list/simplelist'],function (require) {
  var SimpleList = require('bui/list/simplelist');
  /**
   * \u5217\u8868\u9009\u62e9\u6846
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
       * \u9009\u9879\u6a21\u677f
       * @override
       * @type {String}
       */
      itemTpl : {
        value : '<li><span class="x-checkbox"></span>{text}</li>'
      },
      /**
       * \u9009\u9879\u6a21\u677f
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
});
define('bui/list/listitem',function ($) {


  var Component = BUI.Component,
    UIBase = Component.UIBase;
    
  /**
   * @private
   * @class BUI.List.ItemView
   * @extends BUI.Component.View
   * @extends BUI.Component.View
   * @mixins BUI.Component.UIBase.ListItemView
   * \u5217\u8868\u9879\u7684\u89c6\u56fe\u5c42\u5bf9\u8c61
   */
  var itemView = Component.View.extend([UIBase.ListItemView],{
  });

  /**
   * \u5217\u8868\u9879
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
});
define('bui/list/list',function (require) {
  
  var Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * \u5217\u8868
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
       * \u5b50\u7c7b\u7684\u9ed8\u8ba4\u7c7b\u540d\uff0c\u5373\u7c7b\u7684 xclass
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