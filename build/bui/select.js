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

define('bui/select/select',['bui/common','bui/list'],function (require) {

  var BUI = require('bui/common'),
    List = require('bui/list'),
    PREFIX = BUI.prefix;

  function getItemTpl(multiple){
    var text = multiple ? '<span class="checkbox"><input type="checkbox" />{text}</span>' : '{text}';
    return '<li role="option" class="' + PREFIX + 'list-item" data-value="{value}">' + text + '</li>';
  }

  var Component = BUI.Component,
    Picker = List.Picker,
    CLS_INPUT = PREFIX + 'select-input',
    /**
     * 选择控件
     * xclass:'select'
     * @class BUI.Select.Select
     * @extends BUI.Component.Controller
     */
    select = Component.Controller.extend({
      //初始化
      initializer:function(){
        var _self = this,
          children = _self.get('children'),
          multipleSelect = _self.get('multipleSelect'),
          picker = new Picker({
            children:[
              {
                elCls:PREFIX + 'select-list',
                items:_self.get('items'),
                itemTpl : getItemTpl(multipleSelect),
                multipleSelect : multipleSelect
              }
            ],
            valueField : _self.get('valueField')
          });
        if(multipleSelect){
          picker.set('hideEvent','');
        }
        //children.push(picker);
        _self.set('picker',picker);
      },
      //渲染DOM以及选择器
      renderUI : function(){
        var _self = this,
          picker = _self.get('picker'),
          el = _self.get('el'),
          textEl = el.find('.' + _self.get('inputCls'));
        picker.set('trigger',el);
        picker.set('triggerEvent', _self.get('triggerEvent'));
        picker.set('autoSetValue', _self.get('autoSetValue'));
        picker.set('textField',textEl);
        picker.set('width',el.outerWidth());
        picker.render();
      },
      //绑定事件
      bindUI : function(){
        var _self = this,
          multipleSelect = _self.get('multipleSelect'),
          list = _self._getList();

          //选项发生改变时
          list.on('selectedchange',function(ev){
            if(multipleSelect){
              var sender = $(ev.domTarget),
                checkbox = sender.find('input');
              checkbox.attr('checked',ev.selected);
            }
            _self.fire('change',{item : ev.item});
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
      //设置子项
      _uiSetItems : function(items){
        var _self = this,
          picker = _self.get('picker'),
          list = picker.get('list'),
          valueField = _self.get('valueField');
        list.set('items',items);
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
          var textEl = _self._getTextEl(),
            iconEl = _self.get('el').find('.x-icon'),
            appendWidth = textEl.outerWidth() - textEl.width(),
            picker = _self.get('picker'),
            width = v - iconEl.outerWidth() - appendWidth;
          textEl.width(width);
          picker.set('width',v);
        }
      },
      _getTextEl : function(){
         var _self = this,
          el = _self.get('el');
        return el.find('.' + _self.get('inputCls'));
      },
      /**
       * 析构函数
       */
      destructor:function(){
        var _self = this,
          picker = _self.get('picker');
        picker && picker.destroy();
      },
      //获取List控件
      _getList:function(){
        var _self = this,
          picker = _self.get('picker'),
          list = picker.get('list');
        return list;
      },
      /**
       * 获取选中项的值
       * @return {String} 选中项的值
       */
      getSelectedValue:function(){
        var _self = this,
          list = _self._getList(),
          selection = list.getSelection(),
          result = [];
        for (var i = 0; i < selection.length; i++) {
          result.push(selection[i]['value']);
        };
        return result.join(',');
      },
      /**
       * 设置选中的值
       * @param {String} value 选中的值
       */
      setSelectedValue : function(value){
        var _self = this,
          picker = _self.get('picker');
        picker.setSelectedValue(value);
      },
      /**
       * 获取选中项的文本
       * @return {String} 选中项的文本
       */
      getSelectedText:function(){
        var _self = this,
          list = _self._getList(),
          selection = list.getSelection(),
          result = [];
        for (var i = 0; i < selection.length; i++) {
          result.push(selection[i]['text']);
        };
        return result.join(',');
      }
    },{
      ATTRS : 
      /**
       * @lends BUI.Select.Select#
       * @ignore
       */
      {
        /**
         * 选择器，浮动出现，供用户选择
         * @readOnly
         * @type {BUI.Overlay.Picker}
         */
        picker:{

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
        focusable:{
          value:true
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
         * 控件的name，便于表单提交
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
         */
        /**
         * 选项
         * @type {Array}
         */
        items:{
         value:[]
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
        events : {
          value : {
            /**
             * 选择值发生改变时
             * @event
             * @param {Object} e 事件对象
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
          value : '<input type="text" readonly="readonly" class="'+CLS_INPUT+'"/><span class="x-icon x-icon-normal"><span class="x-caret x-caret-down"></span></span>'
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
 * @fileOverview 组合框可用于选择输入文本
 * @ignore
 */

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
   * 组合框 用于提示输入
   * xclass:'combox'
   * @class BUI.Select.Combox
   * @extends BUI.Select.Select
   */
  var combox = Select.extend({

    renderUI : function(){
      var _self = this,
        picker = _self.get('picker');

      picker.get('getFunction',getFunction);
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

  var BUI = require('bui/common'),
    Combox = require('bui/select/combox'),
    /*CODE_ENTER = BUI.KeyCode.ENTER,
    CODE_TAB = 9,
    CODE_EXPCEPT = [CODE_ENTER,CODE_TAB],
    */
    TIMER_DELAY = 200,
    EMPTY = '',
    EMPTY_ARRAY = [];
    
    //浏览器版本
    ie = BUI.UA['ie'];


  /**
   * 组合框 用于提示输入
   * xclass:'suggest'
   * @class BUI.Select.Suggest
   * @extends BUI.Select.Combox
   */
  var suggest = Combox.extend({
    renderUI:function(){
      var _self = this;
        picker = _self.get('picker');
      if (_self.get('itemTpl')) {
        var picker = _self.get('picker'),
          list = picker.get('list');
        list.set('itemTpl', _self.get('itemTpl'));
      }
    },
    bindUI : function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        picker = _self.get('picker'),
        list = picker.get('list'),
        triggerEvent = (_self.get('triggerEvent') === 'keyup') ? 'keyup' : 'keyup click';

      //监听 keyup 事件
      textEl.on(triggerEvent, function(ev){
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
        text,
        picker = _self.get('picker');

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
        _self._handleResponse(data);
      }
    },
    
    //通过 script 元素异步加载数据
    _requestData:function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        param = {};
        param[textEl.attr('name')] = textEl.val();
      $.ajax({
        url:_self.get('url'),
        type:'post',
        dataType:'jsonp',
        data:param,
        success:function(data){
          _self._handleResponse(data);
        },
        error:function(){
          //BUI.log('server error');
        }
      });
    },
    //处理获取的数据
    _handleResponse:function(data){
      var _self = this,
        items = _self._getFilterItems(data),
        picker = _self.get('picker');
        _self.set('items',items);

      if(_self.get('cacheable')){
        _self.get('dataCache')[_self.get('query')] = items;
      }
    },
    //获取过滤的文本
    _getFilterItems:function(data){
      var _self = this,
        result = [],
        textEl = _self.get('el').find('input'),
        text = textEl.val(),
        isStatic = _self.get('data');
      data = data ? data : [];
      $.each(data, function(index, item){
        var str = BUI.isString(item) ? item : item['text'];
        if(isStatic){
          if(str.indexOf($.trim(text)) !== -1){
            result.push(str);
          }
        }else{
          result.push(str);
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
      var r = (periodic) ? setInterval(fn, when) : setTimeout(fn, when);

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
       * 用于显示提示的数据源
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
       */
      query:{
        value : EMPTY
      },
      /**
       * 是否允许缓存
       * @cfg {Boolean} cacheable
       * @default false
       */
      /**
       * 是否允许缓存
       * @type {Boolean}
       * @default false
       */
      cacheable:{
        value:false
      },
      /**
       * 缓存的数据
       * @private
       */
      dataCache:{
        value:{}
      },
      /**
       * 列表项的模板
       * @cfg {String} itemTpl
       */
      itemTpl:{
        value:EMPTY
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