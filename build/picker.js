/**
 * @fileOverview Picker的入口
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/picker',['bui/common','bui/picker/mixin','bui/picker/picker','bui/picker/listpicker'],function (require) {
  var BUI = require('bui/common'),
    Picker = BUI.namespace('Picker');

  BUI.mix(Picker,{
    Mixin : require('bui/picker/mixin'),
    Picker : require('bui/picker/picker'),
    ListPicker : require('bui/picker/listpicker')
  });

  return Picker;
});/**
 * @fileOverview picker的扩展
 * @ignore
 */

define('bui/picker/mixin', function (require) {
  

  /**
   * @class BUI.Picker.Mixin
   */
  var Mixin = function () {
  };

  Mixin.ATTRS = {
    /**
     * 用于选择的控件，默认为第一个子元素,此控件实现 @see {BUI.Component.UIBase.Selection} 接口
     * @protected
     * @type {Object|BUI.Component.Controller}
     */
    innerControl : {
      getter:function(){
        return this.get('children')[0];
      }
    },
    /**
     * 显示选择器的事件
     * @cfg {String} [triggerEvent='click']
     */
    /**
     * 显示选择器的事件
     * @type {String}
     * @default 'click'
     */
    triggerEvent:{
      value:'click'
    },
    /**
     * 选择器选中的项，是否随着触发器改变
     * @cfg {Boolean} [autoSetValue=true]
     */
    /**
     * 选择器选中的项，是否随着触发器改变
     * @type {Boolean}
     */
    autoSetValue : {
      value : true
    },
    /**
     * 选择发生改变的事件
     * @cfg {String} [changeEvent='selectedchange']
     */
    /**
     * 选择发生改变的事件
     * @type {String}
     */
    changeEvent : {
      value:'selectedchange'
    },
    /**
     * 自动隐藏
     * @type {Boolean}
     * @override
     */
    autoHide:{
      value : true
    },
    /**
     * 隐藏选择器的事件
     * @protected
     * @type {String}
     */
    hideEvent:{
      value:'itemclick'
    },
    /**
     * 返回的文本放在的DOM，一般是input
     * @cfg {String|HTMLElement|jQuery} textField
     */
    /**
     * 返回的文本放在的DOM，一般是input
     * @type {String|HTMLElement|jQuery}
     */
    textField : {

    },
    align : {
      value : {
         points: ['bl','tl'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
         offset: [0, 0]      // 有效值为 [n, m]
      }
    },
    /**
     * 返回的值放置DOM ,一般是input
     * @cfg {String|HTMLElement|jQuery} valueField
     */
    /**
     * 返回的值放置DOM ,一般是input
     * @type {String|HTMLElement|jQuery}
     */
    valueField:{

    }
    /**
     * @event selectedchange
     * 选中值改变事件
     * @param {Object} e 事件对象
     * @param {String} text 选中的文本
     * @param {string} value 选中的值
     * @param {jQuery} curTrigger 当前触发picker的元素
     */
  }

  Mixin.prototype = {

    __bindUI : function(){
      var _self = this,
        //innerControl = _self.get('innerControl'),
        hideEvent = _self.get('hideEvent'),
        trigger = $(_self.get('trigger'));

      _self.on('show',function(ev){
      //trigger.on(_self.get('triggerEvent'),function(e){
        if(!_self.get('isInit')){
          _self._initControl();
        }
        if(_self.get('autoSetValue')){
          var valueField = _self.get('valueField') || _self.get('textField') || _self.get('curTrigger'),
            val = $(valueField).val();
          _self.setSelectedValue(val);
        }
      });

      //_self.initControlEvent();
    },
    _initControl : function(){
      var _self = this;
      if(_self.get('isInit')){ //已经初始化过
        return ;
      }
      if(!_self.get('innerControl')){
        var control = _self.createControl();
        _self.get('children').push(control);
      }
      _self.initControlEvent();
      _self.set('isInit',true);
    },
    /**
     * 初始化内部控件，绑定事件
     */
    initControl : function(){
      this._initControl();
    },  
    /**
     * @protected
     * 初始化内部控件
     */
    createControl : function(){
      
    },
    //初始化内部控件的事件
    initControlEvent : function(){
      var _self = this,
        innerControl = _self.get('innerControl'),
        trigger = $(_self.get('trigger')),
        hideEvent = _self.get('hideEvent');

      innerControl.on(_self.get('changeEvent'),function(e){
        var curTrigger = _self.get('curTrigger'),
          textField = _self.get('textField') || curTrigger || trigger,
          valueField = _self.get('valueField'),
          selValue = _self.getSelectedValue(),
          isChange = false;

        if(textField){
          var selText = _self.getSelectedText(),
            preText = $(textField).val();
          if(selText != preText){
            $(textField).val(selText);
            isChange = true;
            $(textField).trigger('change');
          }
        }
        
        if(valueField && _self.get('autoSetValue')){
          var preValue = $(valueField).val();  
          if(valueField != preValue){
            $(valueField).val(selValue);
            isChange = true;
            $(valueField).trigger('change');
          }
        }
        if(isChange){
          _self.onChange(selText,selValue,e);
        }
      });
      
      if(hideEvent){
        innerControl.on(_self.get('hideEvent'),function(){
          var curTrigger = _self.get('curTrigger');
          try{ //隐藏时，在ie6,7下会报错
            if(curTrigger){
              curTrigger.focus();
            }
          }catch(e){
            BUI.log(e);
          }
          _self.hide();
        });
      }
    },
    /**
     * 设置选中的值
     * @template
     * @protected
     * @param {String} val 设置值
     */
    setSelectedValue : function(val){
      
    },
    /**
     * 获取选中的值，多选状态下，值以','分割
     * @template
     * @protected
     * @return {String} 选中的值
     */
    getSelectedValue : function(){
      
    },
    /**
     * 获取选中项的文本，多选状态下，文本以','分割
     * @template
     * @protected
     * @return {String} 选中的文本
     */
    getSelectedText : function(){

    },
    /**
     * 选择器获取焦点时，默认选中内部控件
     */
    focus : function(){
      this.get('innerControl').focus();
    },
    /**
     * @protected
     * 发生改变
     */
    onChange : function(selText,selValue,ev){
      var _self = this,
        curTrigger = _self.get('curTrigger');
      //curTrigger && curTrigger.trigger('change'); //触发改变事件
      _self.fire('selectedchange',{value : selValue,text : selText,curTrigger : curTrigger});
    },
    /**
     * 处理 esc 键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEsc : function (ev) {
      this.hide();
    },
    _uiSetValueField : function(v){
      var _self = this;
      if(v != null && v !== '' && _self.get('autoSetValue')){ //if(v)问题太多
        _self.setSelectedValue($(v).val());
      }
    },
    _getTextField : function(){
      var _self = this;
      return _self.get('textField') || _self.get('curTrigger');
    }
  }

  return Mixin;
});/**
 * @fileOverview 选择器
 * @ignore
 */

define('bui/picker/picker',['bui/overlay', 'bui/picker/mixin'],function (require) {
  
  var Overlay = require('bui/overlay').Overlay,
    Mixin = require('bui/picker/mixin');

  /**
   * 选择器控件的基类，弹出一个层来选择数据，不要使用此类创建控件，仅用于继承实现控件
   * xclass : 'picker'
   * <pre><code>
   * BUI.use(['bui/picker','bui/list'],function(Picker,List){
   *
   * var items = [
   *       {text:'选项1',value:'a'},
   *       {text:'选项2',value:'b'},
   *      {text:'选项3',value:'c'}
   *     ],
   *   list = new List.SimpleList({
   *     elCls:'bui-select-list',
   *     items : items
   *   }),
   *   picker = new Picker.ListPicker({
   *     trigger : '#show',  
   *     valueField : '#hide', //如果需要列表返回的value，放在隐藏域，那么指定隐藏域
   *     width:100,  //指定宽度
   *     children : [list] //配置picker内的列表
   *   });
   * picker.render();
   * });
   * </code></pre>
   * @abstract
   * @class BUI.Picker.Picker
   * @mixins BUI.Picker.Mixin
   * @extends BUI.Overlay.Overlay
   */
  var picker = Overlay.extend([Mixin], {
    
  },{
    ATTRS : {

    }
  },{
    xclass:'picker'
  });

  return picker;
});/**
 * @fileOverview 列表项的选择器
 * @ignore
 */

define('bui/picker/listpicker',['bui/picker/picker','bui/list'],function (require) {

  var List = require('bui/list'),
    Picker = require('bui/picker/picker'),
    /**
     * 列表选择器,xclass = 'list-picker'
     * <pre><code>
     * BUI.use(['bui/picker'],function(Picker){
     *
     * var items = [
     *       {text:'选项1',value:'a'},
     *       {text:'选项2',value:'b'},
     *      {text:'选项3',value:'c'}
     *     ],
     *   picker = new Picker.ListPicker({
     *     trigger : '#show',  
     *     valueField : '#hide', //如果需要列表返回的value，放在隐藏域，那么指定隐藏域
     *     width:100,  //指定宽度
     *     children : [{
     *        elCls:'bui-select-list',
     *        items : items
     *     }] //配置picker内的列表
     *   });
     * picker.render();
     * });
     * </code></pre>
     * @class BUI.Picker.ListPicker
     * @extends BUI.Picker.Picker
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
       * @override
       * @param {String} val 设置值
       */
      setSelectedValue : function(val){
        val = val ? val.toString() : '';
        if(!this.get('isInit')){
          this._initControl();
        }
        var _self = this,
          list = _self.get('list'),
          selectedValue = _self.getSelectedValue();
        if(val !== selectedValue && list.getCount()){
          if(list.get('multipleSelect')){
            list.clearSelection();
          }
          list.setSelectionByField(val.split(','));
        }   
      },
      /**
       * @protected
       * @ignore
       */
      onChange : function(selText,selValue,ev){
        var _self = this,
          curTrigger = _self.get('curTrigger');
        //curTrigger && curTrigger.trigger('change'); //触发改变事件
        _self.fire('selectedchange',{value : selValue,text : selText,curTrigger : curTrigger,item : ev.item});
      },
      /**
       * 获取选中的值，多选状态下，值以','分割
       * @return {String} 选中的值
       */
      getSelectedValue : function(){
        if(!this.get('isInit')){
          this._initControl();
        }
        return this.get('list').getSelectionValues().join(',');
      },
      /**
       * 获取选中项的文本，多选状态下，文本以','分割
       * @return {String} 选中的文本
       */
      getSelectedText : function(){
        if(!this.get('isInit')){
          this._initControl();
        }
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
         * <pre><code>
         *  var list = picker.get('list');
         *  list.getSelected();
         * </code></pre>
         * @type {BUI.List.SimpleList}
         * @readOnly
         */
        list : {
          getter:function(){
            return this.get('children')[0];
          }
        }
        /**
         * @event selectedchange
         * 选择发生改变事件
         * @param {Object} e 事件对象
         * @param {String} e.text 选中的文本
         * @param {string} e.value 选中的值
         * @param {Object} e.item 发生改变的选项
         * @param {jQuery} e.curTrigger 当前触发picker的元素
         */
      }
    },{
      xclass : 'list-picker'
    });

  return listPicker;
});