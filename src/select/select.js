/**
 * @fileOverview 选择控件
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/select/select',['bui/common','bui/picker'],function (require) {

  var BUI = require('bui/common'),
    ListPicker = require('bui/picker').ListPicker,
    PREFIX = BUI.prefix;

  function getItemTpl(multiple){
    var text = multiple ? '<span class="checkbox"><input type="checkbox" />{text}</span>' : '{text}';
    return '<li role="option" class="' + PREFIX + 'list-item" data-value="{value}">' + text + '</li>';
  }

  var Component = BUI.Component,
    Picker = ListPicker,
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
          picker = _self.get('picker');
        if(!picker){
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
          
          //children.push(picker);
          _self.set('picker',picker);
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
         * @type {BUI.Picker.ListPicker}
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

});