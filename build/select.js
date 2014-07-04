/**
 * @fileOverview 选择框命名空间入口文件
 * @ignore
 */

define('bui/select',['bui/common','bui/select/select','bui/select/combox','bui/select/suggest'],function (require) {
  var BUI = require('bui/common'),
    Select = BUI.namespace('Select');

  BUI.mix(Select,{
    Select : require('bui/select/select'),
    Combox : require('bui/select/combox'),
    Suggest: require('bui/select/suggest')
  });
  return Select;
});/**
 * @fileOverview 选择控件
 * @author dxq613@gmail.com
 * @ignore
 */

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
     * 选择控件
     * xclass:'select'
     * <pre><code>
     *  BUI.use('bui/select',function(Select){
     * 
     *   var items = [
     *         {text:'选项1',value:'a'},
     *         {text:'选项2',value:'b'},
     *         {text:'选项3',value:'c'}
     *       ],
     *       select = new Select.Select({  
     *         render:'#s1',
     *         valueField:'#hide',
     *         //multipleSelect: true, //是否多选
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
      //初始化
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
      //渲染DOM以及选择器
      renderUI : function(){
        var _self = this,
          picker = _self.get('picker'),
          textEl = _self._getTextEl();
        picker.set('trigger',_self.getTrigger());
        picker.set('triggerEvent', _self.get('triggerEvent'));
        picker.set('autoSetValue', _self.get('autoSetValue'));
        picker.set('textField',textEl);

        picker.render();
        _self.set('list',picker.get('list'));
      },
      //绑定事件
      bindUI : function(){
        var _self = this,
          picker = _self.get('picker'),
          list = picker.get('list'),
          store = list.get('store');
          
        //选项发生改变时
        picker.on('selectedchange',function(ev){
          _self.fire('change',{text : ev.text,value : ev.value,item : ev.item});
        });
        list.on('itemsshow',function(){
          _self._syncValue();
        });
        picker.on('show',function(){
          if(_self.get('forceFit')){
            picker.set('width',_self.get('el').outerWidth());
          }
        });
      },
      /**
       * 是否包含元素
       * @override
       */
      containsElement : function(elem){
        var _self = this,
          picker = _self.get('picker');

        return Component.Controller.prototype.containsElement.call(this,elem) || picker.containsElement(elem);
      },
      /**
       * @protected
       * 获取触发点
       */
      getTrigger : function(){
        return this.get('el');
      },
      //设置子项
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
      //设置Form表单中的名称
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
          if(_self.get('inputForceFit')){
            var textEl = _self._getTextEl(),
            iconEl = _self.get('el').find('.x-icon'),
            appendWidth = textEl.outerWidth() - textEl.width(),
            
            width = v - iconEl.outerWidth() - appendWidth;
            textEl.width(width);
          }
          
          if(_self.get('forceFit')){
            var picker = _self.get('picker');
            picker.set('width',v);
          }
          
        }
      },
      //禁用
      _uiSetDisabled : function(v){
        var _self = this,
          picker = _self.get('picker'),
          textEl = _self._getTextEl();
        picker.set('disabled',v);
        textEl && textEl.attr('disabled',v);
      },
      _getTextEl : function(){
         var _self = this,
          el = _self.get('el');
        return el.is('input') ? el : el.find('input');
      },
      /**
       * 析构函数
       */
      destructor:function(){
        var _self = this,
          picker = _self.get('picker');
        if(picker){
          picker.destroy();
        }
      },
      //获取List控件
      _getList:function(){
        var _self = this,
          picker = _self.get('picker'),
          list = picker.get('list');
        return list;
      },
      /**
       * 获取选中项的值，如果是多选则，返回的'1,2,3'形式的字符串
       * <pre><code>
       *  var value = select.getSelectedValue();
       * </code></pre>
       * @return {String} 选中项的值
       */
      getSelectedValue:function(){
        return this.get('picker').getSelectedValue();
      },
      /**
       * 设置选中的值
       * <pre><code>
       * select.setSelectedValue('1'); //单选模式下
       * select.setSelectedValue('1,2,3'); //多选模式下
       * </code></pre>
       * @param {String} value 选中的值
       */
      setSelectedValue : function(value){
        var _self = this,
          picker = _self.get('picker');
        picker.setSelectedValue(value);
      },
      /**
       * 获取选中项的文本，如果是多选则，返回的'text1,text2,text3'形式的字符串
       * <pre><code>
       *  var value = select.getSelectedText();
       * </code></pre>
       * @return {String} 选中项的文本
       */
      getSelectedText:function(){
        return this.get('picker').getSelectedText();
      }
    },{
      ATTRS : 
      {

        /**
         * 选择器，浮动出现，供用户选择
         * @cfg {BUI.Picker.ListPicker} picker
         * <pre><code>
         * var columns = [
         *       {title : '表头1(30%)',dataIndex :'a', width:'30%'},
         *       {id: '123',title : '表头2(30%)',dataIndex :'b', width:'30%'},
         *       {title : '表头3(40%)',dataIndex : 'c',width:'40%'}
         *     ],   
         *   data = [{a:'123',b:'选择文本1'},{a:'cdd',b:'选择文本2'},{a:'1333',b:'选择文本3',c:'eee',d:2}],
         *   grid = new Grid.SimpleGrid({
         *     idField : 'a', //设置作为key 的字段，放到valueField中
         *     columns : columns,
         *     textGetter: function(item){ //返回选中的文本
         *       return item.b;
         *     }
         *   }),
         *   picker = new Picker.ListPicker({
         *     width:300,  //指定宽度
         *     children : [grid] //配置picker内的列表
         *   }),
         *   select = new Select.Select({  
         *     render:'#s1',
         *     picker : picker,
         *     forceFit:false, //不强迫列表跟选择器宽度一致
         *     valueField:'#hide',
         *     items : data
         *   });
         * select.render();
         * </code></pre>
         */
        /**
         * 选择器，浮动出现，供用户选择
         * @readOnly
         * @type {BUI.Picker.ListPicker}
         */
        picker:{

        },
        /**
         * Picker中的列表
         * <pre>
         *   var list = select.get('list');
         * </pre>
         * @readOnly
         * @type {BUI.List.SimpleList}
         */
        list : {

        },
        /**
         * 存放值得字段，一般是一个input[type='hidden'] ,用于存放选择框的值
         * @cfg {Object} valueField
         */
        /**
         * @ignore
         */
        valueField : {

        },
        /**
         * 数据缓冲类
         * <pre><code>
         *  var store = new Store({
         *    url : 'data.json',
         *    autoLoad : true
         *  });
         *  var select = new Select({
         *    render : '#s',
         *    store : store//设置了store后，不要再设置items，会进行覆盖
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
         * 是否跟valueField自动同步
         * @type {Boolean}
         */
        autoSetValue : {
          value : true
        },
        /**
         * 是否可以多选
         * @cfg {Boolean} [multipleSelect=false]
         */
        /**
         * 是否可以多选
         * @type {Boolean}
         */
        multipleSelect:{
          value:false
        },
        /**
         * 内部的input是否跟随宽度的变化而变化
         * @type {Object}
         */
        inputForceFit : {
          value : true
        },  
        /**
         * 控件的name，用于存放选中的文本，便于表单提交
         * @cfg {Object} name
         */
        /**
         * 控件的name，便于表单提交
         * @type {Object}
         */
        name:{

        },
        /**
         * 选项
         * @cfg {Array} items
         * <pre><code>
         *  BUI.use('bui/select',function(Select){
         * 
         *   var items = [
         *         {text:'选项1',value:'a'},
         *         {text:'选项2',value:'b'},
         *         {text:'选项3',value:'c'}
         *       ],
         *       select = new Select.Select({  
         *         render:'#s1',
         *         valueField:'#hide',
         *         //multipleSelect: true, //是否多选
         *         items:items
         *       });
         *   select.render();
         *   
         * });
         * </code></pre>
         */
        /**
         * 选项
         * @type {Array}
         */
        items:{
          sync:false
        },
        /**
         * 标示选择完成后，显示文本的DOM节点的样式
         * @type {String}
         * @protected
         * @default 'bui-select-input'
         */
        inputCls:{
          value:CLS_INPUT
        },
        /**
         * 是否使选择列表跟选择框同等宽度
         * <pre><code>
         *   picker = new Picker.ListPicker({
         *     width:300,  //指定宽度
         *     children : [grid] //配置picker内的列表
         *   }),
         *   select = new Select.Select({  
         *     render:'#s1',
         *     picker : picker,
         *     forceFit:false, //不强迫列表跟选择器宽度一致
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
             * 选择值发生改变时
             * @event
             * @param {Object} e 事件对象
             * @param {String} e.text 选中的文本
             * @param {String} e.value 选中的value
             * @param {Object} e.item 发生改变的选项
             */
            'change' : false
          }
        },
        /**
         * 控件的默认模版
         * @type {String}
         * @default 
         * '&lt;input type="text" readonly="readonly" class="bui-select-input"/&gt;&lt;span class="x-icon x-icon-normal"&gt;&lt;span class="bui-caret bui-caret-down"&gt;&lt;/span&gt;&lt;/span&gt;'
         */
        tpl : {
          view:true,
          value : '<input type="text" readonly="readonly" class="'+CLS_INPUT+'"/><span class="x-icon x-icon-normal"><i class="icon icon-caret icon-caret-down"></i></span>'
        },
        /**
         * 触发的事件
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

});/**
 * @fileOverview 输入、选择完毕后显示tag
 * @ignore
 */

define('bui/select/tag',['bui/common','bui/list'],function (require) {
  var BUI = require('bui/common'),
    List = require('bui/list'),
    KeyCode = BUI.KeyCode,
    WARN = 'warn';

  /**
   * @class BUI.Select.Tag
   * 显示tag的扩展
   */
  var Tag = function(){

  };

  Tag.ATTRS = {
    /**
     * 显示tag
     * @type {Boolean}
     */
    showTag : {
      value : false
    },
    /**
     * tag的模板
     * @type {String}
     */
    tagItemTpl : {
      value : '<li>{value}<button>×</button></li>'
    },
    /**
     * @private
     * tag 的列表
     * @type {Object}
     */
    tagList : {
      value : null
    },
    tagPlaceholder : {
      value : '输入标签'
    },
    /**
     * 默认的value分隔符，将值分割显示成tag
     * @type {String}
     */
    separator : {
      value : ';'
    }
  };

  BUI.augment(Tag,{

    __renderUI : function(){
      var _self = this,
        showTag = _self.get('showTag'),
        tagPlaceholder = _self.get('tagPlaceholder'),
        tagInput = _self.getTagInput();
      if(showTag && !tagInput.attr('placeholder')){
        tagInput.attr('placeholder',tagPlaceholder);
        _self.set('inputForceFit',false);
      }
    },
    __bindUI : function(){
      var _self = this,
        showTag = _self.get('showTag'),
        tagInput = _self.getTagInput();
      if(showTag){
        tagInput.on('keydown',function(ev){
          if(!tagInput.val()){
            var tagList =  _self.get('tagList'),
              last = tagList.getLastItem(),
              picker = _self.get('picker');
            if(ev.which == KeyCode.DELETE || ev.which == KeyCode.BACKSPACE){
              if(tagList.hasStatus(last,WARN)){
                _self._delTag(last);
              }else{
                tagList.setItemStatus(last,WARN,true);
              }
              picker.hide();
            }else{
              tagList.setItemStatus(last,WARN,false);
            }
          }
        });

        tagInput.on('change',function(ev){
          setTimeout(function(){
            var val = tagInput.val();
            if(val){
              _self._addTag(val);
            }
          });
          
        });
      }
    },
    __syncUI : function(){
      var _self = this,
        showTag = _self.get('showTag'),
        valueField = _self.get('valueField');
      if(showTag && valueField){
        _self._setTags($(valueField).val());
      }
    },
    //设置tags，初始化时处理
    _setTags : function(value){
      var _self = this,
        tagList = _self.get('tagList'),
        separator = _self.get('separator'),
        values = value.split(separator);
      if(!tagList){
        tagList = _self._initTagList();
      }
      if(value){
        BUI.each(values,function(val){
          tagList.addItem({value : val});
        });
      }
      

    },
    //添加tag
    _addTag : function(value){
      var _self = this,
        tagList = _self.get('tagList'),
        tagInput = _self.getTagInput(),
        preItem = tagList.getItem(value);
      if(!preItem){
        tagList.addItem({value : value});
        _self._synTagsValue();
      }else{
        _self._blurItem(tagList,preItem);
      }
      tagInput.val('');

    },
    //提示用户选项已经存在
    _blurItem : function(list,item){
      list.setItemStatus(item,'active',true);
      setTimeout(function(){
        list.setItemStatus(item,'active',false);
      },400);
    },
    //删除tag
    _delTag : function(item){
      var _self = this,
        tagList = _self.get('tagList');

      tagList.removeItem(item);
      _self._synTagsValue();
    },

    /**
     * 获取tag 列表的值
     * @return {String} 列表对应的值
     */
    getTagsValue : function(){
      var _self = this,
        tagList = _self.get('tagList'),
        items = tagList.getItems(),
        vals = [];

      BUI.each(items,function(item){
        vals.push(item.value);
      });
      return vals.join(_self.get('separator'));
    },
    //初始化tagList
    _initTagList : function(){
      var _self = this,
        tagInput = _self.getTagInput(),
        tagList = new List.SimpleList({
          elBefore : tagInput,
          itemTpl : _self.get('tagItemTpl'),
          idField : 'value'
        });
      tagList.render();
      _self._initTagEvent(tagList);
      _self.set('tagList',tagList);
      return tagList;
    },
    //初始化tag删除事件
    _initTagEvent : function(list){
      var _self = this;
      list.on('itemclick',function(ev){
        var sender = $(ev.domTarget);
        if(sender.is('button')){
          _self._delTag(ev.item);
        }
      });
    },
    /**
     * 获取输入的文本框
     * @protected
     * @return {jQuery} 输入框
     */
    getTagInput : function(){
      var _self = this,
          el = _self.get('el');
      return el.is('input') ? el : el.find('input');
    },
    _synTagsValue : function(){
      var _self = this,
        valueEl = _self.get('valueField');
       valueEl && $(valueEl).val(_self.getTagsValue());
    }
  });

  return Tag;
});
/**
 * @fileOverview 组合框可用于选择输入文本
 * @ignore
 */

define('bui/select/combox',['bui/common','bui/select/select'],function (require) {

  var BUI = require('bui/common'),
    Select = require('bui/select/select'),
    Tag = require('bui/select/tag'),
    CLS_INPUT = BUI.prefix + 'combox-input';

  /**
   * 组合框 用于提示输入
   * xclass:'combox'
   * <pre><code>
   * BUI.use('bui/select',function(Select){
   * 
   *  var select = new Select.Combox({
   *    render:'#c1',
   *    name:'combox',
   *    items:['选项1','选项2','选项3','选项4']
   *  });
   *  select.render();
   * });
   * </code></pre>
   * @class BUI.Select.Combox
   * @extends BUI.Select.Select
   */
  var combox = Select.extend([Tag],{

    renderUI : function(){
      var _self = this,
        picker = _self.get('picker');
      picker.set('autoFocused',false);

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
    },
    bindUI: function(){
      var _self = this,
        picker = _self.get('picker'),
        list = picker.get('list'),
        textField = picker.get('textField');

      //修复手动清空textField里面的值，再选时不填充的bug
      $(textField).on('keyup', function(ev){
        var item = list.getSelected();
        if(item){
          list.clearItemStatus(item);
        }
      });

      picker.on('show',function(){
        list.clearSelected();
      });

    },
    //覆写此方法
    _uiSetValueField : function(){

    },
    /**
     * @protected
     * 获取触发点
     */
    getTrigger : function(){
      return this._getTextEl();
    }
  },{
    ATTRS : 
    {
      /*focusable : {
        value : false
      },*/
      /**
       * 控件的模版
       * @type {String}
       * @default  
       * '&lt;input type="text" class="'+CLS_INPUT+'"/&gt;'
       */
      tpl:{
        view:true,
        value:'<input type="text" class="'+CLS_INPUT+'"/>'
      },
      /**
       * 显示选择回的文本DOM节点的样式
       * @type {String}
       * @protected
       * @default 'bui-combox-input'
       */
      inputCls:{
        value:CLS_INPUT
      },
      autoSetValue : {
        value : false
      }
    }
  },{
    xclass:'combox'
  });

  return combox;
});/**
 * @fileOverview 组合框可用于选择输入文本
 * @ignore
 */

define('bui/select/suggest',['bui/common','bui/select/combox'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    Combox = require('bui/select/combox'),
    TIMER_DELAY = 200,
    EMPTY = '';

  /**
   * 组合框 用于提示输入
   * xclass:'suggest'
   * ** 简单使用静态数据 **
   * <pre><code>
   * BUI.use('bui/select',function (Select) {
   *
   *  var suggest = new Select.Suggest({
   *     render:'#c2',
   *     name:'suggest', //形成输入框的name
   *     data:['1222224','234445','122','1111111']
   *   });
   *   suggest.render();
   *   
   * });
   * </code></pre>
   * ** 查询服务器数据 **
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
   * </code></pre>
   * @class BUI.Select.Suggest
   * @extends BUI.Select.Combox
   */
  var suggest = Combox.extend({
    bindUI : function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        triggerEvent = (_self.get('triggerEvent') === 'keyup') ? 'keyup' : 'keyup click';

      //监听 keyup 事件
      textEl.on(triggerEvent, function(){
        _self._start();
      });
    },
    //启动计时器，开始监听用户输入
    _start:function(){
      var _self = this;
      _self._timer = _self.later(function(){
        _self._updateContent();
       // _self._timer = _self.later(arguments.callee, TIMER_DELAY);
      }, TIMER_DELAY);
    },
    //更新提示层的数据
    _updateContent:function(){
      var _self = this,
        isStatic = _self.get('data'),
        textEl = _self.get('el').find('input'),
        text;

      //检测是否需要更新。注意：加入空格也算有变化
      if (!isStatic && (textEl.val() === _self.get('query'))) {
        return;
      }

      _self.set('query', textEl.val());
      text = textEl.val();
      //输入为空时,直接返回
      if (!isStatic && !text) {
        /*        _self.set('items',EMPTY_ARRAY);
        picker.hide();*/
        return;
      }

      //3种加载方式选择
      var cacheable = _self.get('cacheable'),
        url = _self.get('url'),
        data = _self.get('data');

      if (cacheable && url) {
        var dataCache = _self.get('dataCache');
        if (dataCache[text] !== undefined) {
          //从缓存读取
          //BUI.log('use cache');
          _self._handleResponse(dataCache[text]);
        }else{
          //请求服务器数据
          //BUI.log('no cache, data from server');
          _self._requestData();
        }
      }else if (url) {
        //从服务器获取数据
        //BUI.log('no cache, data always from server');
        _self._requestData();
      }else if (data) {
        //使用静态数据源
        //BUI.log('use static datasource');
        _self._handleResponse(data,true);
      }
    },
    //如果存在数据源
    _getStore : function(){
      var _self = this,
        picker = _self.get('picker'),
        list = picker.get('list');
      if(list){
        return list.get('store');
      }
    },
    //通过 script 元素异步加载数据
    _requestData:function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        callback = _self.get('callback'),
        store = _self.get('store'),
        param = {};

      param[textEl.attr('name')] = textEl.val();
      if(store){
        param.start = 0; //回滚到第一页
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
    //处理获取的数据
    _handleResponse:function(data,filter){
      var _self = this,
        items = filter ? _self._getFilterItems(data) : data;
      _self.set('items',items);

      if(_self.get('cacheable')){
        _self.get('dataCache')[_self.get('query')] = items;
      }
    },
    //如果列表记录是对象获取显示的文本
    _getItemText : function(item){
      var _self = this,
        picker = _self.get('picker'),
        list = picker.get('list');
      if(list){
        return list.getItemText(item);
      }
      return '';
    },
    //获取过滤的文本
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
     * 延迟执行指定函数 fn
     * @protected
     * @return {Object} 操作定时器的对象
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
    {
      /**
       * 用于显示提示的数据源
       * <pre><code>
       *   var suggest = new Select.Suggest({
       *     render:'#c2',
       *     name:'suggest', //形成输入框的name
       *     data:['1222224','234445','122','1111111']
       *   });
       * </code></pre>
       * @cfg {Array} data
       */
      /**
       * 用于显示提示的数据源
       * @type {Array}
       */
      data:{
        value : null
      },
      /**
       * 输入框的值
       * @type {String}
       * @private
       */
      query:{
        value : EMPTY
      },
      /**
       * 是否允许缓存
       * @cfg {Boolean} cacheable
       */
      /**
       * 是否允许缓存
       * @type {Boolean}
       */
      cacheable:{
        value:false
      },
      /**
       * 缓存的数据
       * @private
       */
      dataCache:{
        shared:false,
        value:{}
      },
      /**
       * 请求返回的数据格式默认为'jsonp'
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
       * 请求数据的url
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
       * 请求完数据的回调函数
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
       * 触发的事件
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
       * suggest不提供自动设置选中文本功能
       * @type {Boolean}
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