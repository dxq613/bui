/**
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
          el = _self.get('el'),
          textEl = el.find('.' + _self.get('inputCls'));
        picker.set('trigger',el);
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
        return el.find('.' + _self.get('inputCls'));
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

});