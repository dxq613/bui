/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/select',['bui/common','bui/select/select','bui/select/combox','bui/select/suggest'],function (require) {
  var BUI = require('bui/common'),
    Select = BUI.namespace('Select');

  BUI.mix(Select,{
    Select : require('bui/select/select'),
    Combox : require('bui/select/combox'),
    Suggest: require('bui/select/suggest')
  });
  return Select;
});
define('bui/select/select',['bui/common','bui/picker'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    ListPicker = require('bui/picker').ListPicker,
    PREFIX = BUI.prefix;

  function formatItems(items){
   
    if($.isPlainObject(items)){
      var tmp = [];
      BUI.each(items,function(v,n){
        tmp.push({value : n,text : v});
      });
      return tmp;
    }
    var rst = [];
    BUI.each(items,function(item,index){
      if(BUI.isString(item)){
        rst.push({value : item,text:item});
      }else{
        rst.push(item);
      }
    });
    return rst;
  }

  var Component = BUI.Component,
    Picker = ListPicker,
    CLS_INPUT = PREFIX + 'select-input',
    /**
     * \u9009\u62e9\u63a7\u4ef6
     * xclass:'select'
     * <pre><code>
     *  BUI.use('bui/select',function(Select){
     * 
     *   var items = [
     *         {text:'\u9009\u98791',value:'a'},
     *         {text:'\u9009\u98792',value:'b'},
     *         {text:'\u9009\u98793',value:'c'}
     *       ],
     *       select = new Select.Select({  
     *         render:'#s1',
     *         valueField:'#hide',
     *         //multipleSelect: true, //\u662f\u5426\u591a\u9009
     *         items:items
     *       });
     *   select.render();
     *   select.on('change', function(ev){
     *     //ev.text,ev.value,ev.item
     *   });
     *   
     * });
     * </code></pre>
     * @class BUI.Select.Select
     * @extends BUI.Component.Controller
     */
    select = Component.Controller.extend({
      //\u521d\u59cb\u5316
      initializer:function(){
        var _self = this,
          multipleSelect = _self.get('multipleSelect'),
          xclass,
          picker = _self.get('picker');
        if(!picker){
          xclass = multipleSelect ? 'listbox' : 'simple-list';
          picker = new Picker({
            children:[
              {
                xclass : xclass,
                elCls:PREFIX + 'select-list',
                store : _self.get('store'),
                items : formatItems(_self.get('items'))/**/
              }
            ],
            valueField : _self.get('valueField')
          });
          
          _self.set('picker',picker);
        }else{
          if(_self.get('valueField')){
            picker.set('valueField',_self.get('valueField'));
          }
        }
        if(multipleSelect){
          picker.set('hideEvent','');
        }
        
      },
      //\u6e32\u67d3DOM\u4ee5\u53ca\u9009\u62e9\u5668
      renderUI : function(){
        var _self = this,
          picker = _self.get('picker'),
          el = _self.get('el'),
          textEl = el.find('.' + _self.get('inputCls'));
        picker.set('trigger',el);
        picker.set('triggerEvent', _self.get('triggerEvent'));
        picker.set('autoSetValue', _self.get('autoSetValue'));
        picker.set('textField',textEl);
        if(_self.get('forceFit')){
          picker.set('width',el.outerWidth());
        }
        
        picker.render();
      },
      //\u7ed1\u5b9a\u4e8b\u4ef6
      bindUI : function(){
        var _self = this,
          picker = _self.get('picker'),
          list = picker.get('list'),
          store = list.get('store');
          
        //\u9009\u9879\u53d1\u751f\u6539\u53d8\u65f6
        picker.on('selectedchange',function(ev){
          _self.fire('change',{text : ev.text,value : ev.value,item : ev.item});
        });
        list.on('itemsshow',function(){
          _self._syncValue();
        });
      },
      /**
       * \u662f\u5426\u5305\u542b\u5143\u7d20
       * @override
       */
      containsElement : function(elem){
        var _self = this,
          picker = _self.get('picker');

        return Component.Controller.prototype.containsElement.call(this,elem) || picker.containsElement(elem);
      },

      //\u8bbe\u7f6e\u5b50\u9879
      _uiSetItems : function(items){
        if(!items){
          return;
        }
        var _self = this,
          picker = _self.get('picker'),
          list = picker.get('list');
        list.set('items',formatItems(items));
        _self._syncValue();
      },
      _syncValue : function(){
        var _self = this,
          picker = _self.get('picker'),
          valueField = _self.get('valueField');
        if(valueField){
          picker.setSelectedValue($(valueField).val());
        }
      },
      //\u8bbe\u7f6eForm\u8868\u5355\u4e2d\u7684\u540d\u79f0
      _uiSetName:function(v){
        var _self = this,
          textEl = _self._getTextEl();
        if(v){
          textEl.attr('name',v);
        }
      },
      _uiSetWidth : function(v){
        var _self = this;
        if(v != null){
          var textEl = _self._getTextEl(),
            iconEl = _self.get('el').find('.x-icon'),
            appendWidth = textEl.outerWidth() - textEl.width(),
            picker = _self.get('picker'),
            width = v - iconEl.outerWidth() - appendWidth;
          textEl.width(width);
          if(_self.get('forceFit')){
            picker.set('width',v);
          }
          
        }
      },
      _getTextEl : function(){
         var _self = this,
          el = _self.get('el');
        return el.find('.' + _self.get('inputCls'));
      },
      /**
       * \u6790\u6784\u51fd\u6570
       */
      destructor:function(){
        var _self = this,
          picker = _self.get('picker');
        if(picker){
          picker.destroy();
        }
      },
      //\u83b7\u53d6List\u63a7\u4ef6
      _getList:function(){
        var _self = this,
          picker = _self.get('picker'),
          list = picker.get('list');
        return list;
      },
      /**
       * \u83b7\u53d6\u9009\u4e2d\u9879\u7684\u503c\uff0c\u5982\u679c\u662f\u591a\u9009\u5219\uff0c\u8fd4\u56de\u7684'1,2,3'\u5f62\u5f0f\u7684\u5b57\u7b26\u4e32
       * <pre><code>
       *  var value = select.getSelectedValue();
       * </code></pre>
       * @return {String} \u9009\u4e2d\u9879\u7684\u503c
       */
      getSelectedValue:function(){
        return this.get('picker').getSelectedValue();
      },
      /**
       * \u8bbe\u7f6e\u9009\u4e2d\u7684\u503c
       * <pre><code>
       * select.setSelectedValue('1'); //\u5355\u9009\u6a21\u5f0f\u4e0b
       * select.setSelectedValue('1,2,3'); //\u591a\u9009\u6a21\u5f0f\u4e0b
       * </code></pre>
       * @param {String} value \u9009\u4e2d\u7684\u503c
       */
      setSelectedValue : function(value){
        var _self = this,
          picker = _self.get('picker');
        picker.setSelectedValue(value);
      },
      /**
       * \u83b7\u53d6\u9009\u4e2d\u9879\u7684\u6587\u672c\uff0c\u5982\u679c\u662f\u591a\u9009\u5219\uff0c\u8fd4\u56de\u7684'text1,text2,text3'\u5f62\u5f0f\u7684\u5b57\u7b26\u4e32
       * <pre><code>
       *  var value = select.getSelectedText();
       * </code></pre>
       * @return {String} \u9009\u4e2d\u9879\u7684\u6587\u672c
       */
      getSelectedText:function(){
        return this.get('picker').getSelectedText();
      }
    },{
      ATTRS : 
      /**
       * @lends BUI.Select.Select#
       * @ignore
       */
      {

        /**
         * \u9009\u62e9\u5668\uff0c\u6d6e\u52a8\u51fa\u73b0\uff0c\u4f9b\u7528\u6237\u9009\u62e9
         * @cfg {BUI.Picker.ListPicker} picker
         * <pre><code>
         * var columns = [
         *       {title : '\u8868\u59341(30%)',dataIndex :'a', width:'30%'},
         *       {id: '123',title : '\u8868\u59342(30%)',dataIndex :'b', width:'30%'},
         *       {title : '\u8868\u59343(40%)',dataIndex : 'c',width:'40%'}
         *     ],   
         *   data = [{a:'123',b:'\u9009\u62e9\u6587\u672c1'},{a:'cdd',b:'\u9009\u62e9\u6587\u672c2'},{a:'1333',b:'\u9009\u62e9\u6587\u672c3',c:'eee',d:2}],
         *   grid = new Grid.SimpleGrid({
         *     idField : 'a', //\u8bbe\u7f6e\u4f5c\u4e3akey \u7684\u5b57\u6bb5\uff0c\u653e\u5230valueField\u4e2d
         *     columns : columns,
         *     textGetter: function(item){ //\u8fd4\u56de\u9009\u4e2d\u7684\u6587\u672c
         *       return item.b;
         *     }
         *   }),
         *   picker = new Picker.ListPicker({
         *     width:300,  //\u6307\u5b9a\u5bbd\u5ea6
         *     children : [grid] //\u914d\u7f6epicker\u5185\u7684\u5217\u8868
         *   }),
         *   select = new Select.Select({  
         *     render:'#s1',
         *     picker : picker,
         *     forceFit:false, //\u4e0d\u5f3a\u8feb\u5217\u8868\u8ddf\u9009\u62e9\u5668\u5bbd\u5ea6\u4e00\u81f4
         *     valueField:'#hide',
         *     items : data
         *   });
         * select.render();
         * </code></pre>
         */
        /**
         * \u9009\u62e9\u5668\uff0c\u6d6e\u52a8\u51fa\u73b0\uff0c\u4f9b\u7528\u6237\u9009\u62e9
         * @readOnly
         * @type {BUI.Picker.ListPicker}
         */
        picker:{

        },
        /**
         * \u5b58\u653e\u503c\u5f97\u5b57\u6bb5\uff0c\u4e00\u822c\u662f\u4e00\u4e2ainput[type='hidden'] ,\u7528\u4e8e\u5b58\u653e\u9009\u62e9\u6846\u7684\u503c
         * @cfg {Object} valueField
         */
        /**
         * @ignore
         */
        valueField : {

        },
        /**
         * \u6570\u636e\u7f13\u51b2\u7c7b
         * <pre><code>
         *  var store = new Store({
         *    url : 'data.json',
         *    autoLoad : true
         *  });
         *  var select = new Select({
         *    render : '#s',
         *    store : store//\u8bbe\u7f6e\u4e86store\u540e\uff0c\u4e0d\u8981\u518d\u8bbe\u7f6eitems\uff0c\u4f1a\u8fdb\u884c\u8986\u76d6
         *  });
         *  select.render();
         * </code></pre>
         * @cfg {BUI.Data.Store} Store
         */
        store : {

        },
        focusable:{
          value:true
        },
        /**
         * \u662f\u5426\u53ef\u4ee5\u591a\u9009
         * @cfg {Boolean} [multipleSelect=false]
         */
        /**
         * \u662f\u5426\u53ef\u4ee5\u591a\u9009
         * @type {Boolean}
         */
        multipleSelect:{
          value:false
        },
        /**
         * \u63a7\u4ef6\u7684name\uff0c\u7528\u4e8e\u5b58\u653e\u9009\u4e2d\u7684\u6587\u672c\uff0c\u4fbf\u4e8e\u8868\u5355\u63d0\u4ea4
         * @cfg {Object} name
         */
        /**
         * \u63a7\u4ef6\u7684name\uff0c\u4fbf\u4e8e\u8868\u5355\u63d0\u4ea4
         * @type {Object}
         */
        name:{

        },
        /**
         * \u9009\u9879
         * @cfg {Array} items
         * <pre><code>
         *  BUI.use('bui/select',function(Select){
         * 
         *   var items = [
         *         {text:'\u9009\u98791',value:'a'},
         *         {text:'\u9009\u98792',value:'b'},
         *         {text:'\u9009\u98793',value:'c'}
         *       ],
         *       select = new Select.Select({  
         *         render:'#s1',
         *         valueField:'#hide',
         *         //multipleSelect: true, //\u662f\u5426\u591a\u9009
         *         items:items
         *       });
         *   select.render();
         *   
         * });
         * </code></pre>
         */
        /**
         * \u9009\u9879
         * @type {Array}
         */
        items:{
          sync:false
        },
        /**
         * \u6807\u793a\u9009\u62e9\u5b8c\u6210\u540e\uff0c\u663e\u793a\u6587\u672c\u7684DOM\u8282\u70b9\u7684\u6837\u5f0f
         * @type {String}
         * @protected
         * @default 'bui-select-input'
         */
        inputCls:{
          value:CLS_INPUT
        },
        /**
         * \u662f\u5426\u4f7f\u9009\u62e9\u5217\u8868\u8ddf\u9009\u62e9\u6846\u540c\u7b49\u5bbd\u5ea6
         * <pre><code>
         *   picker = new Picker.ListPicker({
         *     width:300,  //\u6307\u5b9a\u5bbd\u5ea6
         *     children : [grid] //\u914d\u7f6epicker\u5185\u7684\u5217\u8868
         *   }),
         *   select = new Select.Select({  
         *     render:'#s1',
         *     picker : picker,
         *     forceFit:false, //\u4e0d\u5f3a\u8feb\u5217\u8868\u8ddf\u9009\u62e9\u5668\u5bbd\u5ea6\u4e00\u81f4
         *     valueField:'#hide',
         *     items : data
         *   });
         * select.render();
         * </code></pre>
         * @cfg {Boolean} [forceFit=true]
         */
        forceFit : {
          value : true
        },
        events : {
          value : {
            /**
             * \u9009\u62e9\u503c\u53d1\u751f\u6539\u53d8\u65f6
             * @event
             * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
             * @param {String} e.text \u9009\u4e2d\u7684\u6587\u672c
             * @param {String} e.value \u9009\u4e2d\u7684value
             * @param {Object} e.item \u53d1\u751f\u6539\u53d8\u7684\u9009\u9879
             */
            'change' : false
          }
        },
        /**
         * \u63a7\u4ef6\u7684\u9ed8\u8ba4\u6a21\u7248
         * @type {String}
         * @default 
         * '&lt;input type="text" readonly="readonly" class="bui-select-input"/&gt;&lt;span class="x-icon x-icon-normal"&gt;&lt;span class="bui-caret bui-caret-down"&gt;&lt;/span&gt;&lt;/span&gt;'
         */
        tpl : {
          view:true,
          value : '<input type="text" readonly="readonly" class="'+CLS_INPUT+'"/><span class="x-icon x-icon-normal"><i class="icon icon-caret icon-caret-down"></i></span>'
        },
        /**
         * \u89e6\u53d1\u7684\u4e8b\u4ef6
         * @cfg {String} triggerEvent
         * @default 'click'
         */
        triggerEvent:{
          value:'click'
        }  
      }
    },{
      xclass : 'select'
    });

  return select;

});
define('bui/select/combox',['bui/common','bui/select/select'],function (require) {

  var BUI = require('bui/common'),
    Select = require('bui/select/select'),
    CLS_INPUT = BUI.prefix + 'combox-input';

  function getFunction(textField,valueField,picker){
    var list = picker.get('list'),
      text = picker.getSelectedText();
    if(text){
      $(textField).val(text);
    }
  }

  /**
   * \u7ec4\u5408\u6846 \u7528\u4e8e\u63d0\u793a\u8f93\u5165
   * xclass:'combox'
   * <pre><code>
   * BUI.use('bui/select',function(Select){
   * 
   *  var select = new Select.Combox({
   *    render:'#c1',
   *    name:'combox',
   *    items:['\u9009\u98791','\u9009\u98792','\u9009\u98793','\u9009\u98794']
   *  });
   *  select.render();
   * });
   * </code></pre>
   * @class BUI.Select.Combox
   * @extends BUI.Select.Select
   */
  var combox = Select.extend({

    renderUI : function(){
      var _self = this,
        picker = _self.get('picker');
      picker.set('autoFocused',false);
      picker.set('getFunction',getFunction);
    },
    _uiSetItems : function(v){
      var _self = this;

      for(var i = 0 ; i < v.length ; i++){
        var item = v[i];
        if(BUI.isString(item)){
          v[i] = {value:item,text:item};
        }
      }
      combox.superclass._uiSetItems.call(_self,v);
    }

  },{
    ATTRS : 
    /**
     * @lends BUI.Select.Combox#
     * @ignore
     */
    {
      /**
       * \u63a7\u4ef6\u7684\u6a21\u7248
       * @type {String}
       * @default  
       * '&lt;input type="text" class="'+CLS_INPUT+'"/&gt;'
       */
      tpl:{
        view:true,
        value:'<input type="text" class="'+CLS_INPUT+'"/>'
      },
      /**
       * \u663e\u793a\u9009\u62e9\u56de\u7684\u6587\u672cDOM\u8282\u70b9\u7684\u6837\u5f0f
       * @type {String}
       * @protected
       * @default 'bui-combox-input'
       */
      inputCls:{
        value:CLS_INPUT
      }
    }
  },{
    xclass:'combox'
  });

  return combox;
});
define('bui/select/suggest',['bui/common','bui/select/combox'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    Combox = require('bui/select/combox'),
    TIMER_DELAY = 200,
    EMPTY = '';

  /**
   * \u7ec4\u5408\u6846 \u7528\u4e8e\u63d0\u793a\u8f93\u5165
   * xclass:'suggest'
   * ** \u7b80\u5355\u4f7f\u7528\u9759\u6001\u6570\u636e **
   * <pre><code>
   * BUI.use('bui/select',function (Select) {
   *
   *  var suggest = new Select.Suggest({
   *     render:'#c2',
   *     name:'suggest', //\u5f62\u6210\u8f93\u5165\u6846\u7684name
   *     data:['1222224','234445','122','1111111']
   *   });
   *   suggest.render();
   *   
   * });
   * </code></pre>
   * ** \u67e5\u8be2\u670d\u52a1\u5668\u6570\u636e **
   * <pre><code>
   * BUI.use('bui/select',function(Select){
   *
   *  var suggest = new Select.Suggest({
   *    render:'#s1',
   *    name:'suggest', 
   *    url:'server-data.php'
   *  });
   *  suggest.render();
   *
   * });
   * <code></pre>
   * @class BUI.Select.Suggest
   * @extends BUI.Select.Combox
   */
  var suggest = Combox.extend({
    bindUI : function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        triggerEvent = (_self.get('triggerEvent') === 'keyup') ? 'keyup' : 'keyup click';

      //\u76d1\u542c keyup \u4e8b\u4ef6
      textEl.on(triggerEvent, function(){
        _self._start();
      });
    },
    //\u542f\u52a8\u8ba1\u65f6\u5668\uff0c\u5f00\u59cb\u76d1\u542c\u7528\u6237\u8f93\u5165
    _start:function(){
      var _self = this;
      _self._timer = _self.later(function(){
        _self._updateContent();
       // _self._timer = _self.later(arguments.callee, TIMER_DELAY);
      }, TIMER_DELAY);
    },
    //\u66f4\u65b0\u63d0\u793a\u5c42\u7684\u6570\u636e
    _updateContent:function(){
      var _self = this,
        isStatic = _self.get('data'),
        textEl = _self.get('el').find('input'),
        text;

      //\u68c0\u6d4b\u662f\u5426\u9700\u8981\u66f4\u65b0\u3002\u6ce8\u610f\uff1a\u52a0\u5165\u7a7a\u683c\u4e5f\u7b97\u6709\u53d8\u5316
      if (!isStatic && (textEl.val() === _self.get('query'))) {
        return;
      }

      _self.set('query', textEl.val());
      text = textEl.val();
      //\u8f93\u5165\u4e3a\u7a7a\u65f6,\u76f4\u63a5\u8fd4\u56de
      if (!isStatic && !text) {
        /*        _self.set('items',EMPTY_ARRAY);
        picker.hide();*/
        return;
      }

      //3\u79cd\u52a0\u8f7d\u65b9\u5f0f\u9009\u62e9
      var cacheable = _self.get('cacheable'),
        url = _self.get('url'),
        data = _self.get('data');

      if (cacheable && url) {
        var dataCache = _self.get('dataCache');
        if (dataCache[text] !== undefined) {
          //\u4ece\u7f13\u5b58\u8bfb\u53d6
          //BUI.log('use cache');
          _self._handleResponse(dataCache[text]);
        }else{
          //\u8bf7\u6c42\u670d\u52a1\u5668\u6570\u636e
          //BUI.log('no cache, data from server');
          _self._requestData();
        }
      }else if (url) {
        //\u4ece\u670d\u52a1\u5668\u83b7\u53d6\u6570\u636e
        //BUI.log('no cache, data always from server');
        _self._requestData();
      }else if (data) {
        //\u4f7f\u7528\u9759\u6001\u6570\u636e\u6e90
        //BUI.log('use static datasource');
        _self._handleResponse(data,true);
      }
    },
    //\u5982\u679c\u5b58\u5728\u6570\u636e\u6e90
    _getStore : function(){
      var _self = this,
        picker = _self.get('picker'),
        list = picker.get('list');
      if(list){
        return list.get('store');
      }
    },
    //\u901a\u8fc7 script \u5143\u7d20\u5f02\u6b65\u52a0\u8f7d\u6570\u636e
    _requestData:function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        callback = _self.get('callback'),
        store = _self.get('store'),
        param = {};

      param[textEl.attr('name')] = textEl.val();
      if(store){
        param.start = 0; //\u56de\u6eda\u5230\u7b2c\u4e00\u9875
        store.load(param,callback);
      }else{
        $.ajax({
          url:_self.get('url'),
          type:'post',
          dataType:_self.get('dataType'),
          data:param,
          success:function(data){
            _self._handleResponse(data);
            if(callback){
              callback(data);
            }
          }
        });
      }
      
    },
    //\u5904\u7406\u83b7\u53d6\u7684\u6570\u636e
    _handleResponse:function(data,filter){
      var _self = this,
        items = filter ? _self._getFilterItems(data) : data;
      _self.set('items',items);

      if(_self.get('cacheable')){
        _self.get('dataCache')[_self.get('query')] = items;
      }
    },
    //\u5982\u679c\u5217\u8868\u8bb0\u5f55\u662f\u5bf9\u8c61\u83b7\u53d6\u663e\u793a\u7684\u6587\u672c
    _getItemText : function(item){
      var _self = this,
        picker = _self.get('picker'),
        list = picker.get('list');
      if(list){
        return list.getItemText(item);
      }
      return '';
    },
    //\u83b7\u53d6\u8fc7\u6ee4\u7684\u6587\u672c
    _getFilterItems:function(data){
      var _self = this,
        result = [],
        textEl = _self.get('el').find('input'),
        text = textEl.val(),
        isStatic = _self.get('data');
      data = data || [];
      /**
       * @private
       * @ignore
       */
      function push(str,item){
        if(BUI.isString(item)){
          result.push(str);
        }else{
          result.push(item);
        }
      }
      BUI.each(data, function(item){
        var str = BUI.isString(item) ? item : _self._getItemText(item);
        if(isStatic){
          if(str.indexOf($.trim(text)) !== -1){
            push(str,item);
          }
        }else{
          push(str,item);
        }
      });
      
      return result;
    },
    /**
     * \u5ef6\u8fdf\u6267\u884c\u6307\u5b9a\u51fd\u6570 fn
     * @protected
     * @return {Object} \u64cd\u4f5c\u5b9a\u65f6\u5668\u7684\u5bf9\u8c61
     */
    later:function (fn, when, periodic) {
      when = when || 0;
      var r = periodic ? setInterval(fn, when) : setTimeout(fn, when);

      return {
        id:r,
        interval:periodic,
        cancel:function () {
          if (this.interval) {
            clearInterval(r);
          } else {
            clearTimeout(r);
          }
        }
      };
    }
  },{
    ATTRS : 
    /**
     * @lends BUI.Select.Suggest#
     * @ignore
     */
    {
      /**
       * \u7528\u4e8e\u663e\u793a\u63d0\u793a\u7684\u6570\u636e\u6e90
       * <pre><code>
       *   var suggest = new Select.Suggest({
       *     render:'#c2',
       *     name:'suggest', //\u5f62\u6210\u8f93\u5165\u6846\u7684name
       *     data:['1222224','234445','122','1111111']
       *   });
       * </code></pre>
       * @cfg {Array} data
       */
      /**
       * \u7528\u4e8e\u663e\u793a\u63d0\u793a\u7684\u6570\u636e\u6e90
       * @type {Array}
       * @ignore
       */
      data:{
        value : null
      },
      /**
       * \u8f93\u5165\u6846\u7684\u503c
       * @type {String}
       * @private
       */
      query:{
        value : EMPTY
      },
      /**
       * \u662f\u5426\u5141\u8bb8\u7f13\u5b58
       * @cfg {Boolean} cacheable
       * @default false
       */
      /**
       * \u662f\u5426\u5141\u8bb8\u7f13\u5b58
       * @type {Boolean}
       * @default false
       */
      cacheable:{
        value:false
      },
      /**
       * \u7f13\u5b58\u7684\u6570\u636e
       * @private
       */
      dataCache:{
        value:{}
      },
      /**
       * \u8bf7\u6c42\u8fd4\u56de\u7684\u6570\u636e\u683c\u5f0f\u9ed8\u8ba4\u4e3a'jsonp'
       * <pre><code>
       *  var suggest = new Select.Suggest({
       *    render:'#s1',
       *    name:'suggest', 
       *    dataType : 'json',
       *    url:'server-data.php'
       *  }); 
       * </code></pre>
       * @cfg {Object} [dataType = 'jsonp']
       */
      dataType : {
        value : 'jsonp'
      },
      /**
       * \u8bf7\u6c42\u6570\u636e\u7684url
       * <pre><code>
       *  var suggest = new Select.Suggest({
       *    render:'#s1',
       *    name:'suggest', 
       *    dataType : 'json',
       *    url:'server-data.php'
       *  }); 
       * </code></pre>
       * @cfg {String} url
       */
      url : {

      },
      /**
       * \u8bf7\u6c42\u5b8c\u6570\u636e\u7684\u56de\u8c03\u51fd\u6570
       * <pre><code>
       *  var suggest = new Select.Suggest({
       *    render:'#s1',
       *    name:'suggest', 
       *    dataType : 'json',
       *    callback : function(data){
       *      //do something
       *    },
       *    url:'server-data.php'
       *  }); 
       * </code></pre>
       * @type {Function}
       */
      callback : {

      },
      /**
       * \u89e6\u53d1\u7684\u4e8b\u4ef6
       * @cfg {String} triggerEvent
       * @default 'click'
       */
      triggerEvent:{
        valueFn:function(){
          if(this.get('data')){
            return 'click';
          }
          return 'keyup';
        }
      },
      /**
       * suggest\u4e0d\u63d0\u4f9b\u81ea\u52a8\u8bbe\u7f6e\u9009\u4e2d\u6587\u672c\u529f\u80fd
       * @type {Boolean}
       * @default true
       */
      autoSetValue:{
        value:false
      }
    }
  },{
    xclass:'suggest'
  });

  return suggest;
});