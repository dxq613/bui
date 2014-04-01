/**
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
        
        if(valueField){
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
      if(v != null && v !== ''){ //if(v)问题太多
        _self.setSelectedValue($(v).val());
      }
    },
    _getTextField : function(){
      var _self = this;
      return _self.get('textField') || _self.get('curTrigger');
    }
  }

  return Mixin;
});