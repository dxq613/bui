/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
;(function(){
var BASE = 'bui/form/';
define('bui/form',['bui/common',BASE + 'fieldcontainer',BASE + 'form',BASE + 'row',BASE + 'fieldgroup',BASE + 'horizontal',BASE + 'rules',BASE + 'field',BASE + 'fieldgroup'],function (r) {
  var BUI = r('bui/common'),
    Form = BUI.namespace('Form'),
    Tips = r(BASE + 'tips');

  BUI.mix(Form,{
    Tips : Tips,
    TipItem : Tips.Item,
    FieldContainer : r(BASE + 'fieldcontainer'),
    Form : r(BASE + 'form'),
    Row : r(BASE + 'row'),
    Group : r(BASE + 'fieldgroup'),
    HForm : r(BASE + 'horizontal'),
    Rules : r(BASE + 'rules'),
    Field : r(BASE + 'field'),
    FieldGroup : r(BASE + 'fieldgroup')
  });
  return Form;
});
})();

define('bui/form/tips',['bui/common','bui/overlay'],function (require) {

  var BUI = require('bui/common'),
    prefix = BUI.prefix,
    Overlay = require('bui/overlay').Overlay,
    FIELD_TIP = 'data-tip',
    CLS_TIP_CONTAINER = prefix + 'form-tip-container';

  /**
   * \u8868\u5355\u63d0\u793a\u4fe1\u606f\u7c7b
   * xclass:'form-tip'
   * @class BUI.Form.TipItem
   * @extends BUI.Overlay.Overlay
   */
  var tipItem = Overlay.extend(
  /**
   * @lends BUI.Form.TipItem.prototype
   * @ignore
   */
  {
    initializer : function(){
      var _self = this,
        render = _self.get('render');
      if(!render){
        var parent = $(_self.get('trigger')).parent();
        _self.set('render',parent);
      }
    },
    renderUI : function(){
      var _self = this;

      _self.resetVisible();
      
    },
    /**
     * \u91cd\u7f6e\u662f\u5426\u663e\u793a
     */
    resetVisible : function(){
      var _self = this,
        triggerEl = $(_self.get('trigger'));

      if(triggerEl.val()){//\u5982\u679c\u9ed8\u8ba4\u6709\u6587\u672c\u5219\u4e0d\u663e\u793a\uff0c\u5426\u5219\u663e\u793a
        _self.set('visible',false);
      }else{
        _self.set('align',{
          node:$(_self.get('trigger')),
          points: ['cl','cl']
        });
        _self.set('visible',true);
      }
    },
    bindUI : function(){
      var _self = this,
        triggerEl = $(_self.get('trigger'));

      _self.get('el').on('click',function(){
        _self.hide();
        triggerEl.focus();
      });
      triggerEl.on('click focus',function(){
        _self.hide();
      });

      triggerEl.on('blur',function(){
        _self.resetVisible();
      });
    }
  },{
    ATTRS : 
    /**
     * @lends BUI.Form.TipItem#
     * @ignore
     */
    {
      /**
       * \u63d0\u793a\u7684\u8f93\u5165\u6846 
       * @cfg {String|HTMLElement|jQuery} trigger
       */
      /**
       * \u63d0\u793a\u7684\u8f93\u5165\u6846
       * @type {String|HTMLElement|jQuery}
       */
      trigger:{

      },
      /**
       * \u63d0\u793a\u6587\u672c
       * @cfg {String} text
       */
      /**
       * \u63d0\u793a\u6587\u672c
       * @type {String}
       */
      text : {

      },
      /**
       * \u63d0\u793a\u6587\u672c\u4e0a\u663e\u793a\u7684icon\u6837\u5f0f
       * @cfg {String} iconCls
       *     iconCls : icon-ok
       */
      /**
       * \u63d0\u793a\u6587\u672c\u4e0a\u663e\u793a\u7684icon\u6837\u5f0f
       * @type {String}
       *     iconCls : icon-ok
       */
      iconCls:{

      },
      /**
       * \u9ed8\u8ba4\u7684\u6a21\u7248
       * @type {String}
       * @default '<span class="{iconCls}"></span><span class="tip-text">{text}</span>'
       */
      tpl:{
        value:'<span class="{iconCls}"></span><span class="tip-text">{text}</span>'
      }
    }
  },{
    xclass : 'form-tip'
  });

  /**
   * \u8868\u5355\u63d0\u793a\u4fe1\u606f\u7684\u7ba1\u7406\u7c7b
   * @class BUI.Form.Tips
   * @extends BUI.Base
   */
  var Tips = function(config){
    if (this.constructor !== Tips){
      return new Tips(config);
    }

    Tips.superclass.constructor.call(this,config);
    this._init();
  };

  Tips.ATTRS = 
  /**
   * @lends BUI.Form.Tips
   * @ignore
   */
  {

    /**
     * \u8868\u5355\u7684\u9009\u62e9\u5668
     * @cfg {String|HTMLElement|jQuery} form
     */
    /**
     * \u8868\u5355\u7684\u9009\u62e9\u5668
     * @type {String|HTMLElement|jQuery}
     */
    form : {

    },
    /**
     * \u8868\u5355\u63d0\u793a\u9879\u5bf9\u8c61 {@link BUI.Form.TipItem}
     * @readOnly
     * @type {Array} 
     */
    items : {
      value:[]
    }
  };

  BUI.extend(Tips,BUI.Base);

  BUI.augment(Tips,{
    _init : function(){
      var _self = this,
        form = $(_self.get('form'));
      if(form.length){
        BUI.each($.makeArray(form[0].elements),function(elem){
          var tipConfig = $(elem).attr(FIELD_TIP);
          if(tipConfig){
            _self._initFormElement(elem,$.parseJSON(tipConfig));
          }
        });
        form.addClass(CLS_TIP_CONTAINER);
      }
    },
    _initFormElement : function(element,config){
      if(config){
        config.trigger = element;
        //config.render = this.get('form');
      }
      var _self = this,
        items = _self.get('items'),
        item = new tipItem(config);
      items.push(item);
    },
    /**
     * \u83b7\u53d6\u63d0\u793a\u9879
     * @param {String} name \u5b57\u6bb5\u7684\u540d\u79f0
     * @return {BUI.Form.TipItem} \u63d0\u793a\u9879
     */
    getItem : function(name){
      var _self = this,
        items = _self.get('items'),
        result = null;
      BUI.each(items,function(item){

        if($(item.get('trigger')).attr('name') === name){
          result = item;
          return false;
        }

      });

      return result;
    },
    /**
     * \u91cd\u7f6e\u6240\u6709\u63d0\u793a\u7684\u53ef\u89c6\u72b6\u6001
     */
    resetVisible : function(){
      var _self = this,
        items = _self.get('items');

      BUI.each(items,function(item){
        item.resetVisible();
      });
    },
    /**
     * \u751f\u6210 \u8868\u5355\u63d0\u793a
     */
    render:function(){
       var _self = this,
        items = _self.get('items');
      BUI.each(items,function(item){
        item.render();
      });
    },
    /**
     * \u5220\u9664\u6240\u6709\u63d0\u793a
     */
    destroy:function(){
      var _self = this,
        items = _self.get(items);

      BUI.each(items,function(item){
        item.destroy();
      });
    }
  });
  
  Tips.Item = tipItem;
  return Tips;

});
define('bui/form/basefield',['bui/common','bui/form/tips','bui/form/valid','bui/form/remote'],function (require){

  var BUI = require('bui/common'),
    Component = BUI.Component,
    TipItem = require('bui/form/tips').Item,
    Valid = require('bui/form/valid'),
    Remote = require('bui/form/remote'),
    CLS_FIELD_ERROR = BUI.prefix + 'form-field-error',
    DATA_ERROR = 'data-error';

  /**
   * \u5b57\u6bb5\u89c6\u56fe\u7c7b
   * @class BUI.Form.FieldView
   * @private
   */
  var fieldView = Component.View.extend([Remote.View,Valid.View],{
    //\u6e32\u67d3DOM
    renderUI : function(){
      var _self = this,
        control = _self.get('control');

      if(!control){
        var controlTpl = _self.get('controlTpl'),
          container = _self.getControlContainer();
          
        if(controlTpl){
          var control = $(controlTpl).appendTo(container);
          _self.set('control',control);
        }
      }else{
        //var controlContainer = control.parent();
        _self.set('controlContainer',control.parent());
      }
    },
    /**
     * \u6e05\u7406\u663e\u793a\u7684\u9519\u8bef\u4fe1\u606f
     * @protected
     */
    clearErrors : function(){
      var _self = this,
        msgEl = _self.get('msgEl');
      if(msgEl){
        msgEl.remove();
        _self.set('msgEl',null);
      }
      _self.get('el').removeClass(CLS_FIELD_ERROR);
    },
    /**
     * \u663e\u793a\u9519\u8bef\u4fe1\u606f
     * @param {String} msg \u9519\u8bef\u4fe1\u606f
     * @protected
     */
    showError : function(msg,errorTpl){
      var _self = this,
        control = _self.get('control'),
        errorMsg = BUI.substitute(errorTpl,{error : msg}),
        el = $(errorMsg);
      //_self.clearErrorMsg();
      
      el.appendTo(control.parent());
      _self.set('msgEl',el);
      _self.get('el').addClass(CLS_FIELD_ERROR);
    },
    /**
     * @internal \u83b7\u53d6\u63a7\u4ef6\u7684\u5bb9\u5668
     * @return {jQuery} \u63a7\u4ef6\u5bb9\u5668
     */
    getControlContainer : function(){
      var _self = this,
        el = _self.get('el'),
        controlContainer = _self.get('controlContainer');
      if(controlContainer){
        if(BUI.isString(controlContainer)){
          controlContainer = el.find(controlContainer);
        }
      }
      return (controlContainer && controlContainer.length) ? controlContainer : el;
    },
    /**
     * \u83b7\u53d6\u663e\u793a\u52a0\u8f7d\u72b6\u6001\u7684\u5bb9\u5668
     * @protected
     * @override
     * @return {jQuery} \u52a0\u8f7d\u72b6\u6001\u7684\u5bb9\u5668
     */
    getLoadingContainer : function () {
      return this.getControlContainer();
    },
    //\u8bbe\u7f6e\u540d\u79f0
    _uiSetName : function(v){
      var _self = this;
      _self.get('control').attr('name',v);
    }
  },
  {
    ATTRS : {
      error:{},
      controlContainer : {},
      msgEl: {},
      control : {}
    }
  });

  /**
   * \u8868\u5355\u5b57\u6bb5\u57fa\u7c7b
   * @class BUI.Form.Field
   * @mixins BUI.Form.Remote
   * @extends BUI.Component.Controller
   */
  var field = Component.Controller.extend([Remote,Valid],{

    initializer : function(){
      var _self = this;
      _self.on('afterRenderUI',function(){
        var tip = _self.get('tip');
        if(tip){
          tip.trigger = _self.getTipTigger();
          tip.autoRender = true;
          tip = new TipItem(tip);
          _self.set('tip',tip);
        }
      });
    },
    //\u7ed1\u5b9a\u4e8b\u4ef6
    bindUI : function(){
      var _self = this,
        validEvent = _self.get('validEvent'),
        changeEvent = _self.get('changeEvent'),
        firstValidEvent = _self.get('firstValidEvent'),
        innerControl = _self.getInnerControl();

      //\u9009\u62e9\u6846\u53ea\u4f7f\u7528 select\u4e8b\u4ef6
      if(innerControl.is('select')){
        validEvent = 'change';
      }
      //\u9a8c\u8bc1\u4e8b\u4ef6
      innerControl.on(validEvent,function(){
        var value = _self.getControlValue(innerControl);
        _self.validControl(value);
      });
      if(firstValidEvent){
        //\u672a\u53d1\u751f\u9a8c\u8bc1\u65f6\uff0c\u9996\u6b21\u83b7\u53d6\u7126\u70b9/\u4e22\u5931\u7126\u70b9/\u70b9\u51fb\uff0c\u8fdb\u884c\u9a8c\u8bc1
        innerControl.on(firstValidEvent,function(){
          if(!_self.get('hasValid')){
            var value = _self.getControlValue(innerControl);
            _self.validControl(value);
          }
        });
      }
      

      //\u672c\u6765\u662f\u76d1\u542c\u63a7\u4ef6\u7684change\u4e8b\u4ef6\uff0c\u4f46\u662f\uff0c\u5982\u679c\u63a7\u4ef6\u8fd8\u672a\u89e6\u53d1change,\u4f46\u662f\u901a\u8fc7get('value')\u6765\u53d6\u503c\uff0c\u5219\u4f1a\u51fa\u73b0\u9519\u8bef\uff0c
      //\u6240\u4ee5\u5f53\u901a\u8fc7\u9a8c\u8bc1\u65f6\uff0c\u5373\u89e6\u53d1\u6539\u53d8\u4e8b\u4ef6
      _self.on(changeEvent,function(){
        _self.onValid();
      });

      _self.on('remotecomplete',function (ev) {
        _self._setError(ev.error);
      });

    },
    /**
     * \u9a8c\u8bc1\u6210\u529f\u540e\u6267\u884c\u7684\u64cd\u4f5c
     * @protected
     */
    onValid : function(){
      var _self = this,
        value =  _self.getControlValue();

      value = _self.parseValue(value);
      if(!_self.isCurrentValue(value)){
        _self.setInternal('value',value);
        _self.onChange();
      }
    },
    onChange : function () {
      this.fire('change');
    },
    /**
     * @protected
     * \u662f\u5426\u5f53\u524d\u503c\uff0c\u4e3b\u8981\u7528\u4e8e\u65e5\u671f\u7b49\u7279\u6b8a\u503c\u7684\u6bd4\u8f83\uff0c\u4e0d\u80fd\u7528 == \u8fdb\u884c\u6bd4\u8f83
     * @param  {*}  value \u8fdb\u884c\u6bd4\u8f83\u7684\u503c
     * @return {Boolean}  \u662f\u5426\u5f53\u524d\u503c
     */
    isCurrentValue : function (value) {
      return value == this.get('value');
    },
    //\u6e05\u7406\u9519\u8bef\u4fe1\u606f
    _clearError : function(){
      this.set('error',null);
      this.get('view').clearErrors();
    },
    //\u8bbe\u7f6e\u9519\u8bef\u4fe1\u606f
    _setError : function(msg){
      this.set('error',msg);
      this.showErrors();
    },

    /**
     * \u83b7\u53d6\u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u503c
     * @protected
     * @param  {jQuery} [innerControl] \u5185\u90e8\u8868\u5355\u5143\u7d20
     * @return {String|Boolean} \u8868\u5355\u5143\u7d20\u7684\u503c,checkbox\uff0cradio\u7684\u8fd4\u56de\u503c\u4e3a true,false
     */
    getControlValue : function(innerControl){
      var _self = this;
      innerControl = innerControl || _self.getInnerControl();
      return innerControl.val();
    },
    /**
     * @protected
     * \u83b7\u53d6\u5185\u90e8\u63a7\u4ef6\u7684\u5bb9\u5668
     */
    getControlContainer : function(){
      return this.get('view').getControlContainer();
    },
    /**
     * \u83b7\u53d6\u5f02\u6b65\u9a8c\u8bc1\u7684\u53c2\u6570\uff0c\u5bf9\u4e8e\u8868\u5355\u5b57\u6bb5\u57df\u800c\u8a00\uff0c\u662f{[name] : [value]}
     * @protected
     * @override
     * @return {Object} \u53c2\u6570\u952e\u503c\u5bf9
     */
    getRemoteParams : function  () {
      var _self = this,
        rst = {};
      rst[_self.get('name')] = _self.getControlValue();
      return rst;
    },
    /**
     * \u8bbe\u7f6e\u5b57\u6bb5\u7684\u503c
     * @protected
     * @param {*} value \u5b57\u6bb5\u503c
     */
    setControlValue : function(value){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.val(value);
    },
    /**
     * \u5c06\u5b57\u7b26\u4e32\u7b49\u683c\u5f0f\u8f6c\u6362\u6210
     * @protected
     * @param  {String} value \u539f\u59cb\u6570\u636e
     * @return {*}  \u8be5\u5b57\u6bb5\u6307\u5b9a\u7684\u7c7b\u578b
     */
    parseValue : function(value){
      return value;
    },
    valid : function(){
      var _self = this;
      _self.validControl();
    },
    /**
     * \u9a8c\u8bc1\u63a7\u4ef6\u5185\u5bb9
     * @return {Boolean} \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    validControl : function(value){
      var _self = this, 
        errorMsg;
        value = value || _self.getControlValue(),
        preError = _self.get('error');
      errorMsg = _self.getValidError(value);
      _self.setInternal('hasValid',true);
      if (errorMsg) {
          _self._setError(errorMsg);
          _self.fire('error', {msg:errorMsg, value:value});
          if(preError !== errorMsg){//\u9a8c\u8bc1\u9519\u8bef\u4fe1\u606f\u6539\u53d8\uff0c\u8bf4\u660e\u9a8c\u8bc1\u6539\u53d8
            _self.fire('validchange',{ valid : false });
          }
      } else {
          _self._clearError();
          _self.fire('valid');
          if(preError){//\u5982\u679c\u4ee5\u524d\u5b58\u5728\u9519\u8bef\uff0c\u90a3\u4e48\u9a8c\u8bc1\u7ed3\u679c\u6539\u53d8
            _self.fire('validchange',{ valid : true });
          }
      }
      
      return !errorMsg;
    },
    /**
     * \u5b57\u6bb5\u83b7\u5f97\u7126\u70b9
     */
    focus : function(){
      this.getInnerControl().focus();
    },
    /**
     * \u5b57\u6bb5\u53d1\u751f\u6539\u53d8
     */
    change : function(){
      var control = this.getInnerControl();
      control.change();
    },
    /**
     * \u5b57\u6bb5\u4e22\u5931\u7126\u70b9
     */
    blur : function(){
      this.getInnerControl().blur();
    },

    /**
     * \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1,\u5982\u679c\u672a\u53d1\u751f\u8fc7\u6821\u9a8c\uff0c\u5219\u8fdb\u884c\u6821\u9a8c\uff0c\u5426\u5219\u4e0d\u8fdb\u884c\u6821\u9a8c\uff0c\u76f4\u63a5\u6839\u636e\u5df2\u6821\u9a8c\u7684\u7ed3\u679c\u5224\u65ad\u3002
     * @return {Boolean} \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    isValid : function(){
      var _self = this;
      if(!_self.get('hasValid')){
        _self.validControl();
      }
      return !_self.get('error');
    },
    /**
     * \u83b7\u53d6\u9a8c\u8bc1\u51fa\u9519\u4fe1\u606f
     * @return {String} \u51fa\u9519\u4fe1\u606f
     */
    getError : function(){
      return this.get('error');
    },
    /**
     * \u83b7\u53d6\u9a8c\u8bc1\u51fa\u9519\u4fe1\u606f\u96c6\u5408
     * @return {Array} \u51fa\u9519\u4fe1\u606f\u96c6\u5408
     */
    getErrors : function(){
      var error = this.getError();
      if(error){
        return [error];
      }
      return [];
    },
    /**
     * \u6e05\u7406\u51fa\u9519\u4fe1\u606f\uff0c\u56de\u6eda\u5230\u672a\u51fa\u9519\u72b6\u6001
     * @param {Boolean} reset \u6e05\u9664\u9519\u8bef\u65f6\uff0c\u662f\u5426\u56de\u6eda\u4e0a\u6b21\u6b63\u786e\u7684\u503c
     */
    clearErrors : function(reset){
      var _self = this;
      _self._clearError();
      if(reset && _self.getControlValue()!= _self.get('value')){
        _self.setControlValue(_self.get('value'));
      }
    },
    /**
     * \u83b7\u53d6\u5185\u90e8\u7684\u8868\u5355\u5143\u7d20\u6216\u8005\u5185\u90e8\u63a7\u4ef6
     * @protected
     * @return {jQuery|BUI.Component.Controller} 
     */
    getInnerControl : function(){
      return this.get('view').get('control');
    },
    /**
     * \u63d0\u793a\u4fe1\u606f\u6309\u7167\u6b64\u5143\u7d20\u5bf9\u9f50
     * @protected
     * @return {HTMLElement}
     */
    getTipTigger : function(){
      return this.getInnerControl();
    },
    //\u6790\u6784\u51fd\u6570
    destructor : function(){
      var _self = this,
        tip = _self.get('tip');
      if(tip && tip.destroy){
        tip.destroy();
      }
    },
    /**
     * @protected
     * \u8bbe\u7f6e\u5185\u90e8\u5143\u7d20\u5bbd\u5ea6
     */
    setInnerWidth : function(width){
      var _self = this,
        innerControl = _self.getInnerControl(),
        appendWidth = innerControl.outerWidth() - innerControl.width();
      innerControl.width(width - appendWidth);
    },
    //\u91cd\u7f6e \u63d0\u793a\u4fe1\u606f\u662f\u5426\u53ef\u89c1
    _resetTip :function(){
      var _self = this,
        tip = _self.get('tip');
      if(tip){
        tip.resetVisible();
      }
    },
    /**
     * \u91cd\u7f6e\u663e\u793a\u63d0\u793a\u4fe1\u606f
     * field.resetTip();
     */
    resetTip : function(){
      this._resetTip();
    },
    //\u8bbe\u7f6e\u503c
    _uiSetValue : function(v){
      var _self = this;
      //v = v ? v.toString() : '';
      _self.setControlValue(v);
      if(_self.get('rendered')){
        _self.validControl();
        _self.onChange();
      } 
      _self._resetTip();
    },
    //\u7981\u7528\u63a7\u4ef6
    _uiSetDisabled : function(v){
      var _self = this,
        innerControl = _self.getInnerControl(),
        children = _self.get('children');
      innerControl.attr('disabled',v);
      if(_self.get('rendered')){
        if(v){//\u63a7\u4ef6\u4e0d\u53ef\u7528\uff0c\u6e05\u9664\u9519\u8bef
          _self.clearErrors();
        }
        if(!v){//\u63a7\u4ef6\u53ef\u7528\uff0c\u6267\u884c\u91cd\u65b0\u9a8c\u8bc1
          _self.valid();
        }
      }

      BUI.each(children,function(child){
        child.set('disabled',v);
      });

    },
    _uiSetWidth : function(v){
      var _self = this;
      if(v != null && _self.get('forceFit')){
        _self.setInnerWidth(v);
      }
    }
  },{
    ATTRS : {
      /**
       * \u662f\u5426\u53d1\u751f\u8fc7\u6821\u9a8c\uff0c\u521d\u59cb\u503c\u4e3a\u7a7a\u65f6\uff0c\u672a\u8fdb\u884c\u8d4b\u503c\uff0c\u4e0d\u8fdb\u884c\u6821\u9a8c
       * @type {Boolean}
       */
      hasValid : {
        value : false
      },
      /**
       * \u5185\u90e8\u5143\u7d20\u662f\u5426\u6839\u636e\u63a7\u4ef6\u5bbd\u5ea6\u8c03\u6574\u5bbd\u5ea6
       * @type {Boolean}
       */
      forceFit : {
        value : false
      },
      /**
       * \u662f\u5426\u663e\u793a\u63d0\u793a\u4fe1\u606f
       * @type {Object}
       */
      tip : {

      },
      /**
       * \u8868\u5355\u5143\u7d20\u6216\u8005\u63a7\u4ef6\u5185\u5bb9\u6539\u53d8\u7684\u4e8b\u4ef6
       * @type {String}
       */
      changeEvent : {
        value : 'valid'
      },
      /**
       * \u672a\u53d1\u751f\u9a8c\u8bc1\u65f6\uff0c\u9996\u6b21\u83b7\u53d6/\u4e22\u5931\u7126\u70b9\uff0c\u8fdb\u884c\u9a8c\u8bc1
       */
      firstValidEvent : {
        value : 'blur'
      },
      /**
       * \u8868\u5355\u5143\u7d20\u6216\u8005\u63a7\u4ef6\u89e6\u53d1\u6b64\u4e8b\u4ef6\u65f6\uff0c\u89e6\u53d1\u9a8c\u8bc1
       * @type {String}
       */
      validEvent : {
        value : 'keyup change'
      },
      /**
       * \u5b57\u6bb5\u7684name\u503c
       * @type {Object}
       */
      name : {
        view :true
      },
      /**
       * \u662f\u5426\u663e\u793a\u9519\u8bef
       * @type {Boolean}
       */
      showError : {
        view : true,
        value : true
      },
      /**
       * \u5b57\u6bb5\u7684\u503c,\u7c7b\u578b\u6839\u636e\u5b57\u6bb5\u7c7b\u578b\u51b3\u5b9a
       * @cfg {*} value
       */
      value : {
        view : true
      },
      /**
       * \u6807\u9898
       * @type {String}
       */
      label : {

      },
      /**
       * \u63a7\u4ef6\u5bb9\u5668\uff0c\u5982\u679c\u4e3a\u7a7a\u76f4\u63a5\u6dfb\u52a0\u5728\u63a7\u4ef6\u5bb9\u5668\u4e0a
       * @type {String|HTMLElement}
       */
      controlContainer : {
        view : true
      },
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u63a7\u4ef6
       * @protected
       * @type {jQuery}
       */
      control : {
        view : true
      },
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="text"/>'
      },
      events: {
        value : {
          /**
           * \u672a\u901a\u8fc7\u9a8c\u8bc1
           * @event
           */
          error : false,
          /**
           * \u901a\u8fc7\u9a8c\u8bc1
           * @event
           */
          valid : false,
          /**
           * @event
           * \u503c\u6539\u53d8\uff0c\u4ec5\u5f53\u901a\u8fc7\u9a8c\u8bc1\u65f6\u89e6\u53d1
           */
          change : true,

          /**
           * @event
           * \u9a8c\u8bc1\u6539\u53d8
           * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
           * @param {Boolean} e.valid \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
           */
          validchange : true
        }  
      },
      tpl: {
        value : '<label>{label}</label>'
      },
      xview : {
        value : fieldView 
      }
    },
    PARSER : {
      control : function(el){
        var control = el.find('input,select,textarea');
        if(control.length){
          return control;
        }
        return el;
      },
      disabled : function(el){
        return !!el.attr('disabled');
      },
      value : function(el){
        var _self = this,
          selector = 'select,input,textarea',
          value = _self.get('value');
        if(!value){
          if(el.is(selector)){
            value = el.val();
            if(!value && el.is('select')){
              value = el.attr('value');
            }
          }else{
            value = el.find(selector).val(); 
          }
          
        }
        return  value;
      },
      name : function(el){
        var _self = this,
          selector = 'select,input,textarea',
          name = _self.get('name');
        if(!name){
          if(el.is(selector)){
            name = el.attr('name');
          }else{
            name = el.find(selector).attr('name'); 
          }
          
        }
        return  name;
      }
      
    }
  },{
    xclass:'form-field'
  });

  field.View = fieldView;
  
  return field;

});
define('bui/form/textfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');

  /**
   * \u8868\u5355\u6587\u672c\u57df
   * @class BUI.Form.Field.Text
   * @extends BUI.Form.Field
   */
  var textField = Field.extend({

  },{
    xclass : 'form-field-text'
  });

  return textField;
});
define('bui/form/numberfield',['bui/form/basefield'],function (require) {

  /**
   * \u8868\u5355\u6570\u5b57\u57df
   * @class BUI.Form.Field.Number
   * @extends BUI.Form.Field
   */
  var Field = require('bui/form/basefield'),
    numberField = Field.extend({

     /**
     * \u5c06\u5b57\u7b26\u4e32\u7b49\u683c\u5f0f\u8f6c\u6362\u6210\u6570\u5b57
     * @protected
     * @param  {String} value \u539f\u59cb\u6570\u636e
     * @return {Number}  \u8be5\u5b57\u6bb5\u6307\u5b9a\u7684\u7c7b\u578b
     */
    parseValue : function(value){
      if(value == '' || value == null){
        return null;
      }
      if(BUI.isNumber(value)){
        return value;
      }
      var _self = this,
        allowDecimals = _self.get('allowDecimals');
      value = value.replace(/\,/g,'');
      if(!allowDecimals){
        return parseInt(value,10);
      }
      return parseFloat(parseFloat(value).toFixed(_self.get('decimalPrecision')));
    },
    _uiSetMax : function(v){
      this.addRule('max',v);
    },
    _uiSetMin : function(v){
      this.addRule('min',v);
    }
  },{
    ATTRS : {
      /**
       * \u6700\u5927\u503c
       * @type {Number}
       */
      max : {

      },
      /**
       * \u6700\u5c0f\u503c
       * @type {Number}
       */
      min : {

      },
      decorateCfgFields : {
        value : {
          min : true,
          max : true
        }
      },
      /**
       * \u8868\u5355\u5143\u7d20\u6216\u8005\u63a7\u4ef6\u89e6\u53d1\u6b64\u4e8b\u4ef6\u65f6\uff0c\u89e6\u53d1\u9a8c\u8bc1
       * @type {String}
       */
      validEvent : {
        value : 'keyup change'
      },
      defaultRules : {
        value : {
          number : true
        }
      },
      /**
       * \u662f\u5426\u5141\u8bb8\u5c0f\u6570\uff0c\u5982\u679c\u4e0d\u5141\u8bb8\uff0c\u5219\u6700\u7ec8\u7ed3\u679c\u8f6c\u6362\u6210\u6574\u6570
       * @type {Boolean}
       */
      allowDecimals : {
        value : true
      },
      /**
       * \u5141\u8bb8\u5c0f\u6570\u65f6\u7684\uff0c\u5c0f\u6570\u4f4d
       * @type {Number}
       */
      decimalPrecision : {
        value : 2
      },
      /**
       * \u5bf9\u6570\u5b57\u8fdb\u884c\u5fae\u8c03\u65f6\uff0c\u6bcf\u6b21\u589e\u52a0\u6216\u51cf\u5c0f\u7684\u6570\u5b57
       * @type {Object}
       */
      step : {
        value : 1
      }
    }
  },{
    xclass : 'form-field-number'
  });

  return numberField;
});
define('bui/form/hiddenfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');
  /**
   * \u8868\u5355\u9690\u85cf\u57df
   * @class BUI.Form.Field.Hidden
   * @extends BUI.Form.Field
   */
  var hiddenField = Field.extend({

  },{
    ATTRS : {
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      tpl : {
        value : ''
      }
    }
  },{
    xclass : 'form-field-hidden'
  });

  return hiddenField;

});
define('bui/form/readonlyfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');
  /**
   * \u8868\u5355\u9690\u85cf\u57df
   * @class BUI.Form.Field.ReadOnly
   * @extends BUI.Form.Field
   */
  var readonlyField = Field.extend({

  },{
    ATTRS : {
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        value : '<input type="text" readonly="readonly"/>'
      }
    }
  },{
    xclass : 'form-field-readonly'
  });

  return readonlyField;

});
define('bui/form/selectfield',['bui/common','bui/form/basefield'],function (require) {

  var BUI = require('bui/common'),
    Field = require('bui/form/basefield');

  function resetOptions (select,options,self) {
    select.children().remove();
    var emptyText = self.get('emptyText');
    if(emptyText && self.get('showBlank')){
      appendItem('',emptyText,select);
    }
    BUI.each(options,function (option) {
      appendItem(option.value,option.text,select);
    });
  }

  function appendItem(value,text,select){
     var str = '<option value="' + value +'">'+text+'</option>'
    $(str).appendTo(select);
  }
  /**
   * \u8868\u5355\u9009\u62e9\u57df
   * @class BUI.Form.Field.Select
   * @extends BUI.Form.Field
   */
  var selectField = Field.extend({
    //\u751f\u6210select
    renderUI : function(){
      var _self = this,
        innerControl = _self.getInnerControl(),
        select = _self.get('select');
      if(_self.get('srcNode') && innerControl.is('select')){ //\u5982\u679c\u4f7f\u7528\u73b0\u6709DOM\u751f\u6210\uff0c\u4e0d\u4f7f\u7528\u81ea\u5b9a\u4e49\u9009\u62e9\u6846\u63a7\u4ef6
        return;
      }
      //select = select || {};
      if($.isPlainObject(select)){
        _self._initSelect(select);
      }
    },
    _initSelect : function(select){
      var _self = this,
        items = _self.get('items');
      BUI.use('bui/select',function(Select){
        select.render = _self.getControlContainer();
        select.valueField = _self.getInnerControl();
        select.autoRender = true;
       /* if(items){
          select.items = items;
        }*/
        select = new Select.Select(select);
        _self.set('select',select);
        _self.set('isCreate',true);
        _self.get('children').push(select);
        select.on('change',function(ev){
          var val = select.getSelectedValue();
          _self.set('value',val);
        });
      })
    },
    /**
     * \u91cd\u65b0\u8bbe\u7f6e\u9009\u9879\u96c6\u5408
     * @param {Array} items \u9009\u9879\u96c6\u5408
     */
    setItems : function (items) {
      var _self = this,
        select = _self.get('select');

      if($.isPlainObject(items)){
        var tmp = [];
        BUI.each(items,function(v,n){
          tmp.push({value : n,text : v});
        });
        items = tmp;
      }

      var control = _self.getInnerControl();
      if(control.is('select')){
        resetOptions(control,items,_self);
        _self.setControlValue(_self.get('value'));
        if(!_self.getControlValue()){
          _self.setInternal('value','');
        }
      }

      if(select){
        if(select.set){
          select.set('items',items);
        }else{
          select.items = items;
        }
      }
    },
    /**
     * \u8bbe\u7f6e\u5b57\u6bb5\u7684\u503c
     * @protected
     * @param {*} value \u5b57\u6bb5\u503c
     */
    setControlValue : function(value){
      var _self = this,
        select = _self.get('select'),
        innerControl = _self.getInnerControl();
      innerControl.val(value);
      if(select && select.set &&  select.getSelectedValue() !== value){
        select.setSelectedValue(value);
      }
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u7684\u6587\u672c
     * @return {String} \u9009\u4e2d\u7684\u6587\u672c
     */
    getSelectedText : function(){
      var _self = this,
        select = _self.get('select'),
        innerControl = _self.getInnerControl();
      if(innerControl.is('select')){
        var dom = innerControl[0],
          item = dom.options[dom.selectedIndex];
        return item ? item.text : '';
      }else{
        return select.getSelectedText();
      }
    },
    /**
     * \u83b7\u53d6tip\u663e\u793a\u5bf9\u5e94\u7684\u5143\u7d20
     * @protected
     * @override
     * @return {HTMLElement} 
     */
    getTipTigger : function(){
      var _self = this,
        select = _self.get('select');
      if(select && select.rendered){
        return select.get('el').find('input');
      }
      return _self.get('el');
    },
    //\u8bbe\u7f6e\u9009\u9879
    _uiSetItems : function(v){
      if(v){
        this.setItems(v);
      }
    },
    /**
     * @protected
     * \u8bbe\u7f6e\u5185\u90e8\u5143\u7d20\u5bbd\u5ea6
     */
    setInnerWidth : function(width){
      var _self = this,
        innerControl = _self.getInnerControl(),
        select = _self.get('select'),
        appendWidth = innerControl.outerWidth() - innerControl.width();
      innerControl.width(width - appendWidth);
      if(select && select.set){
        select.set('width',width);
      }
    }
  },{
    ATTRS : {
      /**
       * \u9009\u9879
       * @type {Array}
       */
      items : {

      },
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * \u662f\u5426\u663e\u793a\u4e3a\u7a7a\u7684\u6587\u672c
       * @type {Boolean}
       */
      showBlank : {
        value : true
      },
      /**
       * \u9009\u62e9\u4e3a\u7a7a\u65f6\u7684\u6587\u672c
       * @type {String}
       */
      emptyText : {
        value : '\u8bf7\u9009\u62e9'
      },
      select : {
        value : {}
      }
    },
    PARSER : {
      emptyText : function(el){
        if(!this.get('showBlank')){
          return '';
        }
        var options = el.find('option'),
          rst = this.get('emptyText');
        if(options.length){
          rst = $(options[0]).text();
        }
        return rst;
      }
    }
  },{
    xclass : 'form-field-select'
  });

  return selectField;
});
define('bui/form/datefield',['bui/common','bui/form/basefield','bui/calendar'],function (require) {

  var BUI = require('bui/common'),
    Field = require('bui/form/basefield'),
    DateUtil = BUI.Date,
    DatePicker = require('bui/calendar').DatePicker;

  /**
   * \u8868\u5355\u6587\u672c\u57df
   * @class BUI.Form.Field.Date
   * @extends BUI.Form.Field
   */
  var dateField = Field.extend({
    //\u751f\u6210\u65e5\u671f\u63a7\u4ef6
    renderUI : function(){
      
      var _self = this,
        datePicker = _self.get('datePicker');
      if($.isPlainObject(datePicker)){
        datePicker.trigger = _self.getInnerControl();
        datePicker.autoRender = true;
        datePicker = new DatePicker(datePicker);
        _self.set('datePicker',datePicker);
        _self.set('isCreatePicker',true);
        _self.get('children').push(datePicker);
      }
      if(datePicker.get('showTime')){
        _self.getInnerControl().addClass('calendar-time');
      }

    },
    bindUI : function(){
      var _self = this,
        datePicker = _self.get('datePicker');
      /*datePicker.on('selectedchange',function(ev){
        var curTrigger = ev.curTrigger;
        if(curTrigger[0] == _self.getInnerControl()[0]){
          _self.set('value',ev.value);
        }
      });*/
    },
    /**
     * \u8bbe\u7f6e\u5b57\u6bb5\u7684\u503c
     * @protected
     * @param {Date} value \u5b57\u6bb5\u503c
     */
    setControlValue : function(value){
      var _self = this,
        innerControl = _self.getInnerControl();
      if(BUI.isDate(value)){
        value = DateUtil.format(value,_self._getFormatMask());
      }
      innerControl.val(value);
    },
    //\u83b7\u53d6\u683c\u5f0f\u5316\u51fd\u6570
    _getFormatMask : function(){
      var _self = this,
        datePicker = _self.get('datePicker');

      if(datePicker.get('showTime')){
        return 'yyyy-mm-dd HH:MM:ss';
      }
      return 'yyyy-mm-dd';
    },
     /**
     * \u5c06\u5b57\u7b26\u4e32\u7b49\u683c\u5f0f\u8f6c\u6362\u6210\u65e5\u671f
     * @protected
     * @override
     * @param  {String} value \u539f\u59cb\u6570\u636e
     * @return {Date}  \u8be5\u5b57\u6bb5\u6307\u5b9a\u7684\u7c7b\u578b
     */
    parseValue : function(value){
      if(BUI.isNumber(value)){
        return new Date(value);
      }
      return DateUtil.parse(value);
    },
    /**
     * @override
     * @protected
     * \u662f\u5426\u5f53\u524d\u503c
     */
    isCurrentValue : function (value) {
      return DateUtil.isEquals(value,this.get('value'));
    },
    //\u8bbe\u7f6e\u6700\u5927\u503c
    _uiSetMax : function(v){
      this.addRule('max',v);
      var _self = this,
        datePicker = _self.get('datePicker');
      if(datePicker && datePicker.set){
        datePicker.set('maxDate',v);
      }
    },
    //\u8bbe\u7f6e\u6700\u5c0f\u503c
    _uiSetMin : function(v){
      this.addRule('min',v);
      var _self = this,
        datePicker = _self.get('datePicker');
      if(datePicker && datePicker.set){
        datePicker.set('minDate',v);
      }
    }
  },{
    ATTRS : {
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        value : '<input type="text" class="calendar"/>'
      },
      defaultRules : {
        value : {
          date : true
        }
      },
      /**
       * \u6700\u5927\u503c
       * @type {Date|String}
       */
      max : {

      },
      /**
       * \u6700\u5c0f\u503c
       * @type {Date|String}
       */
      min : {

      },
      value : {
        setter : function(v){
          if(BUI.isNumber(v)){//\u5c06\u6570\u5b57\u8f6c\u6362\u6210\u65e5\u671f\u7c7b\u578b
            return new Date(v);
          }
          return v;
        }
      },
      /**
       * \u65f6\u95f4\u9009\u62e9\u63a7\u4ef6
       * @type {Object|BUI.Calendar.DatePicker}
       */
      datePicker : {
        value : {
          
        }
      },
      /**
       * \u65f6\u95f4\u9009\u62e9\u5668\u662f\u5426\u662f\u7531\u6b64\u63a7\u4ef6\u521b\u5efa
       * @type {Boolean}
       * @readOnly
       */
      isCreatePicker : {
        value : true
      }
    },
    PARSER : {
      datePicker : function(el){
        if(el.hasClass('calendar-time')){
          return {
            showTime : true
          }
        }
        return {};
      }
    }
  },{
    xclass : 'form-field-date'
  });

  return dateField;
});
define('bui/form/checkfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');

  /**
   * \u53ef\u9009\u4e2d\u83dc\u5355\u57df
   * @class BUI.Form.Field.Check
   * @extends BUI.Form.Field
   */
  var checkField = Field.extend({
    /**
     * \u9a8c\u8bc1\u6210\u529f\u540e\u6267\u884c\u7684\u64cd\u4f5c
     * @protected
     */
    onValid : function(){
      var _self = this,
        checked = _self._getControlChecked();
      _self.setInternal('checked',checked);
      _self.fire('change');
      if(checked){
        _self.fire('checked');
      }else{
        _self.fire('unchecked');
      }
    },
    //\u8bbe\u7f6e\u662f\u5426\u52fe\u9009
    _setControlChecked : function(checked){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.attr('checked',!!checked);
    },
    //\u83b7\u53d6\u662f\u5426\u52fe\u9009
    _getControlChecked : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return !!innerControl.attr('checked');
    },
    //\u8986\u76d6 \u8bbe\u7f6e\u503c\u7684\u65b9\u6cd5
    _uiSetValue : function(v){

    },
    //\u8986\u76d6\u4e0d\u8bbe\u7f6e\u5bbd\u5ea6
    _uiSetWidth : function(v){

    },
    //\u8bbe\u7f6e\u662f\u5426\u52fe\u9009
    _uiSetChecked : function(v){
      var _self = this;
      _self._setControlChecked(v);
      if(_self.get('rendered')){
        _self.onValid();
      }
    }
  },{
    ATTRS : {
      /**
       * \u89e6\u53d1\u9a8c\u8bc1\u4e8b\u4ef6\uff0c\u8fdb\u800c\u5f15\u8d77change\u4e8b\u4ef6
       * @override
       * @type {String}
       */
      validEvent : {
        value : 'click'
      },
      /**
       * \u662f\u5426\u9009\u4e2d
       * @cfg {String} checked
       */
      /**
       * \u662f\u5426\u9009\u4e2d
       * @type {String}
       */
      checked : {
        value : false
      },
      events : {
        value : {
          /**
           * @event
           * \u9009\u4e2d\u4e8b\u4ef6
           */
          'checked' : false,
          /**
           * @event
           * \u53d6\u6d88\u9009\u4e2d\u4e8b\u4ef6
           */
          'unchecked' : false
        }
      }
    },
    PARSER : {
      checked : function(el){
        return !!el.attr('checked');
      }
    }
  },{
    xclass : 'form-check-field'
  });

  return checkField;
});
define('bui/form/checkboxfield',['bui/form/checkfield'],function (required) {
  
  var CheckField = required('bui/form/checkfield');

   /**
   * \u8868\u5355\u590d\u9009\u57df
   * @class BUI.Form.Field.Checkbox
   * @extends BUI.Form.Field.Check
   */
  var CheckBoxField = CheckField.extend({

  },{
    ATTRS : {
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="checkbox"/>'
      },
       /**
       * \u63a7\u4ef6\u5bb9\u5668\uff0c\u5982\u679c\u4e3a\u7a7a\u76f4\u63a5\u6dfb\u52a0\u5728\u63a7\u4ef6\u5bb9\u5668\u4e0a
       * @type {String|HTMLElement}
       */
      controlContainer : {
        value : '.checkbox'
      },
      tpl : {
        value : '<label><span class="checkbox"></span>{label}</label>'
      }
    }
  },{
    xclass : 'form-field-checkbox'
  });

  return CheckBoxField;
});
define('bui/form/radiofield',['bui/form/checkfield'],function (required) {
  
  var CheckField = required('bui/form/checkfield');

  /**
   * \u8868\u5355\u5355\u9009\u57df
   * @class BUI.Form.Field.Radio
   * @extends BUI.Form.Field.Check
   */
  var RadioField = CheckField.extend({
    bindUI : function(){
      var _self = this,
        parent = _self.get('parent'),
        name = _self.get('name');

      if(parent){
        _self.getInnerControl().on('click',function(ev){
          var fields = parent.getFields(name);
          BUI.each(fields,function(field){
            if(field != _self){
              field.set('checked',false);
            }
          });
        });
      }
    }
  },{
    ATTRS : {
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="radio"/>'
      },
      /**
       * \u63a7\u4ef6\u5bb9\u5668\uff0c\u5982\u679c\u4e3a\u7a7a\u76f4\u63a5\u6dfb\u52a0\u5728\u63a7\u4ef6\u5bb9\u5668\u4e0a
       * @type {String|HTMLElement}
       */
      controlContainer : {
        value : '.radio'
      },
      tpl : {
        value : '<label><span class="radio"></span>{label}</label>'
      }
    }
  },{
    xclass : 'form-field-radio'
  });

  return RadioField;
});
define('bui/form/plainfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');


  var PlainFieldView = Field.View.extend({

    _uiSetValue : function(v){
      var _self = this,
        textEl = _self.get('textEl'),
        container = _self.getControlContainer(),
        renderer = _self.get('renderer'), 
        text = renderer ? renderer(v) : v,
        width = _self.get('width'),
        appendWidth = 0,
        textTpl;
      if(textEl){
        
        textEl.remove();
      }
      text = text || '&nbsp;';
      textTpl = BUI.substitute(_self.get('textTpl'),{text : text});
      textEl = $(textTpl).appendTo(container);
      appendWidth = textEl.outerWidth() - textEl.width();
      textEl.width(width - appendWidth);
      _self.set('textEl',textEl);
    }

  },{
    ATTRS : {
      textEl : {},
      value : {}
    }
  },{
    xclass : 'form-field-plain-view'
  });

  /**
   * \u8868\u5355\u6587\u672c\u57df\uff0c\u4e0d\u80fd\u7f16\u8f91
   * @class BUI.Form.Field.Plain
   * @extends BUI.Form.Field
   */
  var PlainField = Field.extend({
 
  },{
    ATTRS : {
      /**
       * \u5185\u90e8\u8868\u5355\u5143\u7d20\u7684\u5bb9\u5668
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * \u663e\u793a\u6587\u672c\u7684\u6a21\u677f
       * @type {String}
       */
      textTpl : {
        view : true,
        value : '<span class="x-form-text">{text}</span>'
      },
      /**
       * \u5c06\u5b57\u6bb5\u7684\u503c\u683c\u5f0f\u5316\u8f93\u51fa
       * @type {Function}
       */
      renderer : {
        view : true,
        value : function(value){
          return value;
        }
      },
      tpl : {
        value : ''
      },
      xview : {
        value : PlainFieldView
      }
    }
  },{
    xclass : 'form-field-plain'
  });

  return PlainField;
});
;(function(){
var BASE = 'bui/form/';
define(BASE + 'field',['bui/common',BASE + 'textfield',BASE + 'datefield',BASE + 'selectfield',BASE + 'hiddenfield',
  BASE + 'numberfield',BASE + 'checkfield',BASE + 'radiofield',BASE + 'checkboxfield',BASE + 'plainfield',BASE + 'listfield',
  BASE + 'checklistfield',BASE + 'radiolistfield'],function (require) {
  var BUI = require('bui/common'),
    Field = require(BASE + 'basefield');

  BUI.mix(Field,{
    Text : require(BASE + 'textfield'),
    Date : require(BASE + 'datefield'),
    Select : require(BASE + 'selectfield'),
    Hidden : require(BASE + 'hiddenfield'),
    Number : require(BASE + 'numberfield'),
    Check : require(BASE + 'checkfield'),
    Radio : require(BASE + 'radiofield'),
    Checkbox : require(BASE + 'checkboxfield'),
    Plain : require(BASE + 'plainfield'),
    List : require(BASE + 'listfield'),
    Uploader : require(BASE + 'uploaderfield'),
    CheckList : require(BASE + 'checklistfield'),
    RadioList : require(BASE + 'radiolistfield')
  });

  return Field;
});

})();

define('bui/form/valid',['bui/common','bui/form/rules'],function (require) {

  var BUI = require('bui/common'),
    Rules = require('bui/form/rules');

  /**
   * @class BUI.Form.ValidView
   * @private
   * \u5bf9\u63a7\u4ef6\u5185\u7684\u5b57\u6bb5\u57df\u8fdb\u884c\u9a8c\u8bc1\u7684\u89c6\u56fe
   */
  var ValidView = function(){

  };

  ValidView.prototype = {
    /**
     * \u83b7\u53d6\u9519\u8bef\u4fe1\u606f\u7684\u5bb9\u5668
     * @protected
     * @return {jQuery} 
     */
    getErrorsContainer : function(){
      var _self = this,
        errorContainer = _self.get('errorContainer');
      if(errorContainer){
        if(BUI.isString(errorContainer)){
          return _self.get('el').find(errorContainer);
        }
        return errorContainer;
      }
      return _self.getContentElement();
    },
    /**
     * \u663e\u793a\u9519\u8bef
     */
    showErrors : function(errors){
      var _self = this,
        errorsContainer = _self.getErrorsContainer(),
        errorTpl = _self.get('errorTpl');     
      _self.clearErrors(); 

      if(!_self.get('showError')){
        return ;
      }
      //\u5982\u679c\u4ec5\u663e\u793a\u7b2c\u4e00\u6761\u9519\u8bef\u8bb0\u5f55
      if(_self.get('showOneError')){
        if(errors && errors.length){
          _self.showError(errors[0],errorTpl,errorsContainer);
        }
        return ;
      }

      BUI.each(errors,function(error){
        if(error){
          _self.showError(error,errorTpl,errorsContainer);
        }
      });
    },
    /**
     * \u663e\u793a\u4e00\u6761\u9519\u8bef
     * @protected
     * @template
     * @param  {String} msg \u9519\u8bef\u4fe1\u606f
     */
    showError : function(msg,errorTpl,container){

    },
    /**
     * @protected
     * @template
     * \u6e05\u9664\u9519\u8bef
     */
    clearErrors : function(){

    }
  };
  /**
   * \u5bf9\u63a7\u4ef6\u5185\u7684\u5b57\u6bb5\u57df\u8fdb\u884c\u9a8c\u8bc1
   * @class  BUI.Form.Valid
   */
  var Valid = function(){

  };

  Valid.ATTRS = {

    /**
     * \u63a7\u4ef6\u56fa\u6709\u7684\u9a8c\u8bc1\u89c4\u5219\uff0c\u4f8b\u5982\uff0c\u65e5\u671f\u5b57\u6bb5\u57df\uff0c\u6709\u7684date\u7c7b\u578b\u7684\u9a8c\u8bc1
     * @protected
     * @type {Object}
     */
    defaultRules : {
      value : {}
    },
    /**
     * \u63a7\u4ef6\u56fa\u6709\u7684\u9a8c\u8bc1\u51fa\u9519\u4fe1\u606f\uff0c\u4f8b\u5982\uff0c\u65e5\u671f\u5b57\u6bb5\u57df\uff0c\u4e0d\u662f\u6709\u6548\u65e5\u671f\u7684\u9a8c\u8bc1\u5b57\u6bb5
     * @protected
     * @type {Object}
     */
    defaultMessages : {
      value : {}
    },
    /**
     * \u9a8c\u8bc1\u89c4\u5219
     * @type {Object}
     */
    rules : {
      value : {}
    },
    /**
     * \u9a8c\u8bc1\u4fe1\u606f\u96c6\u5408
     * @type {Object}
     */
    messages : {
      value : {}
    },
    /**
     * \u9a8c\u8bc1\u5668 \u9a8c\u8bc1\u5bb9\u5668\u5185\u7684\u8868\u5355\u5b57\u6bb5\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     * @type {Function}
     */
    validator : {

    },
    /**
     * \u5b58\u653e\u9519\u8bef\u4fe1\u606f\u5bb9\u5668\u7684\u9009\u62e9\u5668\uff0c\u5982\u679c\u672a\u63d0\u4f9b\u5219\u9ed8\u8ba4\u663e\u793a\u5728\u63a7\u4ef6\u4e2d
     * @private
     * @type {String}
     */
    errorContainer : {
      view : true
    },
    /**
     * \u663e\u793a\u9519\u8bef\u4fe1\u606f\u7684\u6a21\u677f
     * @type {Object}
     */
    errorTpl : {
      view : true,
      value : '<span class="x-field-error"><span class="x-icon x-icon-mini x-icon-error">!</span><label class="x-field-error-text">{error}</label></span>'
    },
    /**
     * \u663e\u793a\u9519\u8bef
     * @type {Boolean}
     */
    showError : {
      view : true,
      value : true
    },
    /**
     * \u662f\u5426\u4ec5\u663e\u793a\u4e00\u4e2a\u9519\u8bef
     * @type {Boolean}
     */
    showOneError: {

    },
    /**
     * \u9519\u8bef\u4fe1\u606f\uff0c\u8fd9\u4e2a\u9a8c\u8bc1\u9519\u8bef\u4e0d\u5305\u542b\u5b50\u63a7\u4ef6\u7684\u9a8c\u8bc1\u9519\u8bef
     * @type {String}
     */
    error : {

    }
  };

  Valid.prototype = {

    __bindUI : function(){
      var _self = this;
      //\u76d1\u542c\u662f\u5426\u7981\u7528
      _self.on('afterDisabledChange',function(ev){
        var disabled = ev.newVal;
        if(disabled){
          _self.clearErrors(false);
        }else{
          _self.valid();
        }
      });
    },
    /**
     * \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     * @template
     * @return {Boolean} \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    isValid : function(){

    },
    /**
     * \u8fdb\u884c\u9a8c\u8bc1
     */
    valid : function(){

    },
    /**
     * @protected
     * @template
     * \u9a8c\u8bc1\u81ea\u8eab\u7684\u89c4\u5219\u548c\u9a8c\u8bc1\u5668
     */
    validControl : function(){

    },
    //\u9a8c\u8bc1\u89c4\u5219
    validRules : function(rules,value){
      var _self = this,
        messages = _self._getValidMessages(),
        error = null;

      for(var name in rules){
        if(rules.hasOwnProperty(name)){
          var baseValue = rules[name];
          error = Rules.valid(name,value,baseValue,messages[name],_self);
          if(error){
            break;
          }
        }
      }
      return error;
    },
    //\u83b7\u53d6\u9a8c\u8bc1\u9519\u8bef\u4fe1\u606f
    _getValidMessages : function(){
      var _self = this,
        defaultMessages = _self.get('defaultMessages'),
        messages = _self.get('messages');
      return BUI.merge(defaultMessages,messages);
    },
    /**
     * @template
     * @protected
     * \u63a7\u4ef6\u672c\u8eab\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1\uff0c\u4e0d\u8003\u8651\u5b50\u63a7\u4ef6
     * @return {String} \u9a8c\u8bc1\u7684\u9519\u8bef
     */
    getValidError : function(value){
      var _self = this,
        validator = _self.get('validator'),
        error = null;

      error = _self.validRules(_self.get('defaultRules'),value) || _self.validRules(_self.get('rules'),value);

      if(!error){
        if(_self.parseValue){
          value = _self.parseValue(value);
        }
        error = validator ? validator.call(this,value) : '';
      }

      return error;
    },
    /**
     * \u83b7\u53d6\u9a8c\u8bc1\u51fa\u9519\u4fe1\u606f\uff0c\u5305\u62ec\u81ea\u8eab\u548c\u5b50\u63a7\u4ef6\u7684\u9a8c\u8bc1\u9519\u8bef\u4fe1\u606f
     * @return {Array} \u51fa\u9519\u4fe1\u606f
     */
    getErrors : function(){

    },
    /**
     * \u663e\u793a\u9519\u8bef
     * @param {Array} \u663e\u793a\u9519\u8bef
     */
    showErrors : function(errors){
      var _self = this,
        errors = errors || _self.getErrors();
      _self.get('view').showErrors(errors);
    },
    /**
     * \u6e05\u9664\u9519\u8bef
     */
    clearErrors : function(deep){
      deep = deep == null ? true : deep;
      var _self = this,
        children = _self.get('children');
      if(deep){
        BUI.each(children,function(item){
          item.clearErrors && item.clearErrors();
        });
      }
      
      _self.set('error',null);
      _self.get('view').clearErrors();
    },
    /**
     * \u6dfb\u52a0\u9a8c\u8bc1\u89c4\u5219
     * @param {String} name \u89c4\u5219\u540d\u79f0
     * @param {*} [value] \u89c4\u5219\u8fdb\u884c\u6821\u9a8c\u7684\u8fdb\u884c\u5bf9\u6bd4\u7684\u503c\uff0c\u5982max : 10 
     * @param {String} [message] \u51fa\u9519\u4fe1\u606f,\u53ef\u4ee5\u4f7f\u6a21\u677f
     * <ol>
     *   <li>\u5982\u679c value \u662f\u5355\u4e2a\u503c\uff0c\u4f8b\u5982\u6700\u5927\u503c value = 10,\u90a3\u4e48\u6a21\u677f\u53ef\u4ee5\u5199\u6210\uff1a '\u8f93\u5165\u503c\u4e0d\u80fd\u5927\u4e8e{0}!'</li>
     *   <li>\u5982\u679c value \u662f\u4e2a\u590d\u6742\u5bf9\u8c61\uff0c\u6570\u7ec4\u65f6\uff0c\u6309\u7167\u7d22\u5f15\uff0c\u5bf9\u8c61\u65f6\u6309\u7167 key \u963b\u6b62\u3002\u5982\uff1avalue= {max:10,min:5} \uff0c\u5219'\u8f93\u5165\u503c\u4e0d\u80fd\u5927\u4e8e{max},\u4e0d\u80fd\u5c0f\u4e8e{min}'</li>
     * </ol>
     *         var field = form.getField('name');
     *         field.addRule('required',true);
     *
     *         field.addRule('max',10,'\u4e0d\u80fd\u5927\u4e8e{0}');
     */
    addRule : function(name,value,message){
      var _self = this,
        rules = _self.get('rules'),
        messages = _self.get('messages');
      rules[name] = value;
      if(message){
        messages[name] = message;
      }
      
    },
    /**
     * \u6dfb\u52a0\u591a\u4e2a\u9a8c\u8bc1\u89c4\u5219
     * @param {Object} rules \u591a\u4e2a\u9a8c\u8bc1\u89c4\u5219
     * @param {Object} [messages] \u9a8c\u8bc1\u89c4\u5219\u7684\u51fa\u9519\u4fe1\u606f
     *         var field = form.getField('name');
     *         field.addRules({
     *           required : true,
     *           max : 10
     *         });
     */
    addRules : function(rules,messages){
      var _self = this;

      BUI.each(rules,function(value,name){
        var msg = messages ? messages[name] : null;
        _self.addRule(name,value,msg);
      });
    },
    /**
     * \u79fb\u9664\u6307\u5b9a\u540d\u79f0\u7684\u9a8c\u8bc1\u89c4\u5219
     * @param  {String} name \u9a8c\u8bc1\u89c4\u5219\u540d\u79f0
     *         var field = form.getField('name');
     *         field.remove('required');   
     */
    removeRule : function(name){
      var _self = this,
        rules = _self.get('rules');
      delete rules[name];
    },
    /**
     * \u6e05\u7406\u9a8c\u8bc1\u89c4\u5219
     */
    clearRules : function(){
      var _self = this;
      _self.set('rules',{});
    }
  };

  Valid.View = ValidView;
  return Valid;
});
define('bui/form/groupvalid',['bui/form/valid'],function (require) {
  
  var CLS_ERROR = 'x-form-error',
    Valid = require('bui/form/valid');

   /**
   * @class BUI.Form.GroupValidView
   * @private
   * \u8868\u5355\u5206\u7ec4\u9a8c\u8bc1\u89c6\u56fe
   * @extends BUI.Form.ValidView
   */
  function GroupValidView(){

  }

  BUI.augment(GroupValidView,Valid.View,{
    /**
     * \u663e\u793a\u4e00\u6761\u9519\u8bef
     * @private
     * @param  {String} msg \u9519\u8bef\u4fe1\u606f
     */
    showError : function(msg,errorTpl,container){
      var errorMsg = BUI.substitute(errorTpl,{error : msg}),
           el = $(errorMsg);
        el.appendTo(container);
        el.addClass(CLS_ERROR);
    },
    /**
     * \u6e05\u9664\u9519\u8bef
     */
    clearErrors : function(){
      var _self = this,
        errorContainer = _self.getErrorsContainer();
      errorContainer.children('.' + CLS_ERROR).remove();
    }
  });

  /**
   * @class BUI.Form.GroupValid
   * \u8868\u5355\u5206\u7ec4\u9a8c\u8bc1
   * @extends BUI.Form.Valid
   */
  function GroupValid(){

  }

  GroupValid.ATTRS = ATTRS =BUI.merge(true,Valid.ATTRS,{
    events: {
      value : {
        validchange : true,
        change : true
      }
    }
  });

  BUI.augment(GroupValid,Valid,{
    __bindUI : function(){
      var _self = this,
        validEvent =  'validchange change';

      //\u5f53\u4e0d\u9700\u8981\u663e\u793a\u5b50\u63a7\u4ef6\u9519\u8bef\u65f6\uff0c\u4ec5\u9700\u8981\u76d1\u542c'change'\u4e8b\u4ef6\u5373\u53ef
      _self.on(validEvent,function(ev){
        var sender = ev.target;
        if(sender != this && _self.get('showError')){
          var valid = _self.isChildrenValid();
          if(valid){
            _self.validControl(_self.getRecord());
            valid = _self.isSelfValid();
          }
          if(!valid){
            _self.showErrors();
          }else{
            _self.clearErrors();
          }
        }
      });
    },
    /**
     * \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    isValid : function(){
      if(this.get('disabled')){ //\u5982\u679c\u88ab\u7981\u7528\uff0c\u5219\u4e0d\u8fdb\u884c\u9a8c\u8bc1\uff0c\u5e76\u4e14\u8ba4\u4e3atrue
        return true;
      }
      var _self = this,
        isValid = _self.isChildrenValid();
      return isValid && _self.isSelfValid();
    },
    /**
     * \u8fdb\u884c\u9a8c\u8bc1
     */
    valid : function(){
      var _self = this,
        children = _self.get('children');
      if(_self.get('disabled')){ //\u7981\u7528\u65f6\u4e0d\u8fdb\u884c\u9a8c\u8bc1
        return;
      }
      BUI.each(children,function(item){
        if(!item.get('disabled')){
          item.valid();
        }
      });
    },
    /**
     * \u6240\u6709\u5b50\u63a7\u4ef6\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     * @protected
     * @return {Boolean} \u6240\u6709\u5b50\u63a7\u4ef6\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    isChildrenValid : function(){
      var _self = this,
        children = _self.get('children'),
        isValid = true;

      BUI.each(children,function(item){
        if(!item.get('disabled') && !item.isValid()){
          isValid = false;
          return false;
        }
      });
      return isValid;
    },
    isSelfValid : function () {
      return !this.get('error');
    },
    /**
     * \u9a8c\u8bc1\u63a7\u4ef6\u5185\u5bb9
     * @protected
     * @return {Boolean} \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    validControl : function (record) {
      var _self = this,
        error = _self.getValidError(record);
      _self.set('error',error);
    },
    /**
     * \u83b7\u53d6\u9a8c\u8bc1\u51fa\u9519\u4fe1\u606f\uff0c\u5305\u62ec\u81ea\u8eab\u548c\u5b50\u63a7\u4ef6\u7684\u9a8c\u8bc1\u9519\u8bef\u4fe1\u606f
     * @return {Array} \u51fa\u9519\u4fe1\u606f
     */
    getErrors : function(){
      var _self = this,
        children = _self.get('children'),
        showChildError = _self.get('showChildError'),
        validError = null,
        rst = [];
      if(showChildError){
        BUI.each(children,function(child){
          if(child.getErrors){
            rst = rst.concat(child.getErrors());
          }
        });
      }
      //\u5982\u679c\u6240\u6709\u5b50\u63a7\u4ef6\u901a\u8fc7\u9a8c\u8bc1\uff0c\u624d\u663e\u793a\u81ea\u5df1\u7684\u9519\u8bef
      if(_self.isChildrenValid()){
        validError = _self.get('error');
        if(validError){
          rst.push(validError);
        }
      }
      
      return rst;
    },  
    //\u8bbe\u7f6e\u9519\u8bef\u6a21\u677f\u65f6\uff0c\u8986\u76d6\u5b50\u63a7\u4ef6\u8bbe\u7f6e\u7684\u9519\u8bef\u6a21\u677f
    _uiSetErrorTpl : function(v){
      var _self = this,
        children = _self.get('children');

      BUI.each(children,function(item){
        item.set('errorTpl',v);
      });
    }
  });

  GroupValid.View = GroupValidView;

  return GroupValid;
});
define('bui/form/fieldcontainer',['bui/common','bui/form/field','bui/form/groupvalid'],function (require) {
  var BUI = require('bui/common'),
    Field = require('bui/form/field'),
    GroupValid = require('bui/form/groupvalid'),
    PREFIX = BUI.prefix;

  var FIELD_XCLASS = 'form-field',
    CLS_FIELD = PREFIX + FIELD_XCLASS,
    CLS_GROUP = PREFIX + 'form-group',
    FIELD_TAGS = 'input,select,textarea';

  function isField(node){
    return node.is(FIELD_TAGS);
  }
  /**
   * \u83b7\u53d6\u8282\u70b9\u9700\u8981\u5c01\u88c5\u7684\u5b50\u8282\u70b9
   * @ignore
   */
  function getDecorateChilds(node,srcNode){

    if(node != srcNode){

      if(isField(node)){
        return [node];
      }
      var cls = node.attr('class');
      if(cls && (cls.indexOf(CLS_GROUP) !== -1 || cls.indexOf(CLS_FIELD) !== -1)){
        return [node];
      }
    }
    var rst = [],
      children = node.children();
    BUI.each(children,function(subNode){
      rst = rst.concat(getDecorateChilds($(subNode),srcNode));
    });
    return rst;
  }

  var containerView = BUI.Component.View.extend([GroupValid.View]);

  /**
   * \u8868\u5355\u5b57\u6bb5\u5bb9\u5668\u7684\u6269\u5c55\u7c7b
   * @class BUI.Form.FieldContainer
   * @extends BUI.Component.Controller
   * @mixins BUI.Form.GroupValid
   */
  var container = BUI.Component.Controller.extend([GroupValid],
    {
      //\u540c\u6b65\u6570\u636e
      syncUI : function(){
        var _self = this,
          fields = _self.getFields(),
          validators = _self.get('validators');

        BUI.each(fields,function(field){
          var name = field.get('name');
          if(validators[name]){
            field.set('validator',validators[name]);
          }
        });
        BUI.each(validators,function(item,key){
          //\u6309\u7167ID\u67e5\u627e
          if(key.indexOf('#') == 0){
            var id = key.replace('#',''),
              child = _self.getChild(id,true);
            if(child){
              child.set('validator',item);
            }
          }
        });
      },
      /**
       * \u83b7\u53d6\u5c01\u88c5\u7684\u5b50\u63a7\u4ef6\u8282\u70b9
       * @protected
       * @override
       */
      getDecorateElments : function(){
        var _self = this,
          el = _self.get('el');
        var items = getDecorateChilds(el,el);
        return items;
      },
      /**
       * \u6839\u636e\u5b50\u8282\u70b9\u83b7\u53d6\u5bf9\u5e94\u7684\u5b50\u63a7\u4ef6 xclass
       * @protected
       * @override
       */
      findXClassByNode : function(childNode, ignoreError){


        if(childNode.attr('type') === 'checkbox'){
          return FIELD_XCLASS + '-checkbox';
        }

        if(childNode.attr('type') === 'radio'){
          return FIELD_XCLASS + '-radio';
        }

        if(childNode.attr('type') === 'number'){
          return FIELD_XCLASS + '-number';
        }

        if(childNode.hasClass('calendar')){
          return FIELD_XCLASS + '-date';
        }

        if(childNode[0].tagName == "SELECT"){
          return FIELD_XCLASS + '-select';
        }

        if(isField(childNode)){
          return FIELD_XCLASS;
        }

        return BUI.Component.Controller.prototype.findXClassByNode.call(this,childNode, ignoreError);
      },
      /**
       * \u83b7\u53d6\u8868\u5355\u7f16\u8f91\u7684\u5bf9\u8c61
       * @return {Object} \u7f16\u8f91\u7684\u5bf9\u8c61
       */
      getRecord : function(){
        var _self = this,
          rst = {},
          fields = _self.getFields();
        BUI.each(fields,function(field){
          var name = field.get('name'),
            value = _self._getFieldValue(field);

          if(!rst[name]){//\u6ca1\u6709\u503c\uff0c\u76f4\u63a5\u8d4b\u503c
            rst[name] = value;
          }else if(BUI.isArray(rst[name]) && value != null){//\u5df2\u7ecf\u5b58\u5728\u503c\uff0c\u5e76\u4e14\u662f\u6570\u7ec4\uff0c\u52a0\u5165\u6570\u7ec4
            rst[name].push(value);
          }else if(value != null){          //\u5426\u5219\u5c01\u88c5\u6210\u6570\u7ec4\uff0c\u5e76\u52a0\u5165\u6570\u7ec4
            var arr = [rst[name]]
            arr.push(value);
            rst[name] = arr; 
          }
        });
        return rst;
      },
      /**
       * \u83b7\u53d6\u8868\u5355\u5b57\u6bb5
       * @return {Array} \u8868\u5355\u5b57\u6bb5
       */
      getFields : function(name){
        var _self = this,
          rst = [],
          children = _self.get('children');
        BUI.each(children,function(item){
          if(item instanceof Field){
            if(!name || item.get('name') == name){
              rst.push(item);
            }
          }else if(item.getFields){
            rst = rst.concat(item.getFields(name));
          }
        });
        return rst;
      },
      /**
       * \u6839\u636ename \u83b7\u53d6\u8868\u5355\u5b57\u6bb5
       * @param  {String} name \u5b57\u6bb5\u540d
       * @return {BUI.Form.Field}  \u8868\u5355\u5b57\u6bb5\u6216\u8005 null
       */
      getField : function(name){
        var _self = this,
          fields = _self.getFields(),
          rst = null;

        BUI.each(fields,function(field){
          if(field.get('name') === name){
            rst = field;
            return false;
          }
        });
        return rst;
      },
      /**
       * \u6839\u636e\u7d22\u5f15\u83b7\u53d6\u5b57\u6bb5\u7684name
       * @param  {Number} index \u5b57\u6bb5\u7684\u7d22\u5f15
       * @return {String}   \u5b57\u6bb5\u540d\u79f0
       */
      getFieldAt : function (index) {
        return this.getFields()[index];
      },
      /**
       * \u6839\u636e\u5b57\u6bb5\u540d
       * @param {String} name \u5b57\u6bb5\u540d
       * @param {*} value \u5b57\u6bb5\u503c
       */
      setFieldValue : function(name,value){
        var _self = this,
          fields = _self.getFields(name);
          BUI.each(fields,function(field){
            _self._setFieldValue(field,value);
          });
      },
      //\u8bbe\u7f6e\u5b57\u6bb5\u57df\u7684\u503c
      _setFieldValue : function(field,value){
        //\u5982\u679c\u5b57\u6bb5\u4e0d\u53ef\u7528\uff0c\u5219\u4e0d\u80fd\u8bbe\u7f6e\u503c
        if(field.get('disabled')){
          return;
        }
        //\u5982\u679c\u662f\u53ef\u52fe\u9009\u7684
        if(field instanceof Field.Check){
          var fieldValue = field.get('value');
          if(value && (fieldValue === value || (BUI.isArray(value) && BUI.Array.contains(fieldValue,value)))){
            field.set('checked',true);
          }else{
            field.set('checked',false);
          }
        }else{
          if(value == null){
            value = '';
          }
          field.set('value',value);
        }
      },
      /**
       * \u83b7\u53d6\u5b57\u6bb5\u503c,\u4e0d\u5b58\u5728\u5b57\u6bb5\u65f6\u8fd4\u56denull,\u591a\u4e2a\u540c\u540d\u5b57\u6bb5\u65f6\uff0ccheckbox\u8fd4\u56de\u4e00\u4e2a\u6570\u7ec4
       * @param  {String} name \u5b57\u6bb5\u540d
       * @return {*}  \u5b57\u6bb5\u503c
       */
      getFieldValue : function(name){
        var _self = this,
          fields = _self.getFields(name),
          rst = [];

        BUI.each(fields,function(field){
          var value = _self._getFieldValue(field);
          if(value){
            rst.push(value);
          }
        });
        if(rst.length === 0){
          return null;
        }
        if(rst.length === 1){
          return rst[0]
        }
        return rst;
      },
      //\u83b7\u53d6\u5b57\u6bb5\u57df\u7684\u503c
      _getFieldValue : function(field){
        if(!(field instanceof Field.Check) || field.get('checked')){
          return field.get('value');
        }
        return null;
      },
      /**
       * \u6e05\u9664\u6240\u6709\u8868\u5355\u57df\u7684\u503c
       */
      clearFields : function(){
        this.clearErrors();
        this.setRecord({})
      },
      /**
       * \u8bbe\u7f6e\u8868\u5355\u7f16\u8f91\u7684\u5bf9\u8c61
       * @param {Object} record \u7f16\u8f91\u7684\u5bf9\u8c61
       */
      setRecord : function(record){
        var _self = this,
          fields = _self.getFields();

        BUI.each(fields,function(field){
          var name = field.get('name');
          _self._setFieldValue(field,record[name]);
        });
      },
      /**
       * \u66f4\u65b0\u8868\u5355\u7f16\u8f91\u7684\u5bf9\u8c61
       * @param  {Object} record \u7f16\u8f91\u7684\u5bf9\u8c61
       */
      updateRecord : function(record){
        var _self = this,
          fields = _self.getFields();

        BUI.each(fields,function(field){
          var name = field.get('name');
          if(record.hasOwnProperty(name)){
            _self._setFieldValue(field,record[name]);
          }
        });
      },
      /**
       * \u8bbe\u7f6e\u63a7\u4ef6\u83b7\u53d6\u7126\u70b9\uff0c\u8bbe\u7f6e\u7b2c\u4e00\u4e2a\u5b50\u63a7\u4ef6\u83b7\u53d6\u7126\u70b9
       */
      focus : function(){
        var _self = this,
          fields = _self.getFields(),
          firstField = fields[0];
        if(firstField){
          firstField.focus();
        }
      },
      //\u7981\u7528\u63a7\u4ef6
      _uiSetDisabled : function(v){
        var _self = this,
          children = _self.get('children');

        BUI.each(children,function(item){
          item.set('disabled',v);
        });
      }
    },
    {
      ATTRS : {
        /**
         * \u8868\u5355\u7684\u6570\u636e\u8bb0\u5f55\uff0c\u4ee5\u952e\u503c\u5bf9\u7684\u5f62\u5f0f\u5b58\u5728
         * @type {Object}
         */
        record : {
          setter : function(v){
            this.setRecord(v);
          },
          getter : function(){
            return this.getRecord();
          }
        },
        /**
         * \u5185\u90e8\u5143\u7d20\u7684\u9a8c\u8bc1\u51fd\u6570\uff0c\u53ef\u4ee5\u4f7f\u75282\u4e2d\u9009\u62e9\u5668
         * <ol>
         *   <li>id: \u4f7f\u7528\u4ee5'#'\u4e3a\u524d\u7f00\u7684\u9009\u62e9\u5668\uff0c\u53ef\u4ee5\u67e5\u627e\u5b57\u6bb5\u6216\u8005\u5206\u7ec4\uff0c\u6dfb\u52a0\u8054\u5408\u6821\u9a8c</li>
         *   <li>name: \u4e0d\u4f7f\u7528\u4efb\u4f55\u524d\u7f00\uff0c\u6ca1\u67e5\u627e\u8868\u5355\u5b57\u6bb5</li>
         * </ol>
         * @type {Object}
         */
        validators : {
          value : {

          }
        },
        /**
         * \u9ed8\u8ba4\u7684\u52a0\u8f7d\u63a7\u4ef6\u5185\u5bb9\u7684\u914d\u7f6e,\u9ed8\u8ba4\u503c\uff1a
         * <pre>
         *  {
         *   property : 'children',
         *   dataType : 'json'
         * }
         * </pre>
         * @type {Object}
         */
        defaultLoaderCfg  : {
          value : {
            property : 'children',
            dataType : 'json'
          }
        },
        disabled : {
          sync : false
        },
        isDecorateChild : {
          value : true
        },
        xview : {
          value : containerView
        }
      }
    },{
      xclass : 'form-field-container'
    }
  ); 
  container.View = containerView;
  return container;
  
});
define('bui/form/group/base',['bui/common','bui/form/fieldcontainer'],function (require) {
  var BUI = require('bui/common'),
    FieldContainer = require('bui/form/fieldcontainer');

  /**
   * @class BUI.Form.Group
   * \u8868\u5355\u5b57\u6bb5\u5206\u7ec4
   * @extends BUI.Form.FieldContainer
   */
  var Group = FieldContainer.extend({
    
  },{
    ATTRS : {
      /**
       * \u6807\u9898
       * @type {String}
       */
      label : {
        view : true
      },
      defaultChildClass : {
        value : 'form-field'
      }
    }
  },{
    xclass:'form-group'
  });

  return Group;
});
define('bui/form/group/range',['bui/form/group/base'],function (require) {
  var Group = require('bui/form/group/base');

  function testRange (self,curVal,prevVal) {
    var allowEqual = self.get('allowEqual');

    if(allowEqual){
      return prevVal <= curVal;
    }

    return prevVal < curVal;
  }
  /**
   * @class BUI.Form.Group.Range
   * \u5b57\u6bb5\u8303\u56f4\u5206\u7ec4\uff0c\u7528\u4e8e\u65e5\u671f\u8303\u56f4\uff0c\u6570\u5b57\u8303\u56f4\u7b49\u573a\u666f
   * @extends BUI.Form.Group
   */
  var Range = Group.extend({

  },{
    ATTRS : {
      /**
       * \u9ed8\u8ba4\u7684\u9a8c\u8bc1\u51fd\u6570\u5931\u8d25\u540e\u663e\u793a\u7684\u6587\u672c\u3002
       * @type {Object}
       */
      rangeText : {
        value : '\u5f00\u59cb\u4e0d\u80fd\u5927\u4e8e\u7ed3\u675f\uff01'
      },
      /**
       * \u662f\u5426\u5141\u8bb8\u524d\u540e\u76f8\u7b49
       * @type {Boolean}
       */
      allowEqual : {
        value : true
      },
      /**
       * \u9a8c\u8bc1\u5668
       * @override
       * @type {Function}
       */
      validator : {
        value : function (record) {
          var _self = this,
            fields = _self.getFields(),
            valid = true;
          for(var i = 1; i < fields.length ; i ++){
            var cur = fields[i],
              prev = fields[i-1],
              curVal,
              prevVal;
            if(cur && prev){
              curVal = cur.get('value');
              prevVal = prev.get('value');
              if(!testRange(_self,curVal,prevVal)){
                valid = false;
                break;
              }
            }
          }
          if(!valid){
            return _self.get('rangeText');
          }
          return null;
        }
      }
    }
  },{
    xclass : 'form-group-range'
  });

  return Range;
});
define('bui/form/group/check',['bui/form/group/base'],function (require) {
  var Group = require('bui/form/group/base');

  function getFieldName (self) {
    var firstField = self.getFieldAt(0);
    if(firstField){
      return firstField.get('name');
    }
    return '';
  }
  /**
   * @class BUI.Form.Group.Check
   * \u5355\u9009\uff0c\u590d\u9009\u5206\u7ec4\uff0c\u53ea\u80fd\u5305\u542b\u540cname\u7684checkbox,radio
   * @extends BUI.Form.Group
   */
  var Check = Group.extend({
    bindUI : function(){
      var _self = this;
      _self.on('change',function(ev){
        var name = getFieldName(_self),
          range = _self.get('range'),
          record = _self.getRecord(),
          value = record[name],
          max = range[1];
        if(value && value.length >= max){
          _self._setFieldsEnable(name,false);
        }else{
          _self._setFieldsEnable(name,true);
        }
      });
    },
    _setFieldsEnable : function(name,enable){

      var _self = this,
        fields = _self.getFields(name);
      BUI.each(fields,function(field){
        if(enable){
          field.enable();
        }else{
          if(!field.get('checked')){
            field.disable();
          }
        }
      });
    },
    _uiSetRange : function(v){
      this.addRule('checkRange',v);
    }

  },{
    ATTRS : {
      /**
       * \u9700\u8981\u9009\u4e2d\u7684\u5b57\u6bb5,
       * <ol>
       *   <li>\u5982\u679c range:1\uff0crange:2 \u6700\u5c11\u52fe\u90091\u4e2a\uff0c2\u4e2a\u3002</li>
       *   <li>\u5982\u679c range :0,\u53ef\u4ee5\u5168\u90e8\u4e0d\u9009\u4e2d\u3002</li>
       *   <li>\u5982\u679c range:[1,2],\u5219\u5fc5\u987b\u9009\u4e2d1-2\u4e2a\u3002</li>
       * </ol>
       * @type {Array|Number}
       */
      range : {
        setter : function (v) {
          if(BUI.isString(v) || BUI.isNumber(v)){
            v = [parseInt(v,10)];
          }
          return v;
        }
      }
    }
  },{
    xclass : 'form-group-check'
  });

  return Check;

});
define('bui/form/group/select',['bui/form/group/base','bui/data'],function (require) {
  var Group = require('bui/form/group/base'),
    Data = require('bui/data'),
    Bindable = BUI.Component.UIBase.Bindable;
  
  function getItems(nodes){
    var items = [];
    BUI.each(nodes,function(node){
      items.push({
        text : node.text,
        value : node.id
      });
    });
    return items;
  }

  /**
   * @class BUI.Form.Group.Select
   * \u7ea7\u8054\u9009\u62e9\u6846\u5206\u7ec4
   * @extends BUI.Form.Group
   * @mixins BUI.Component.UIBase.Bindable
   */
  var Select = Group.extend([Bindable],{
    initializer : function(){
      var _self = this,
        url = _self.get('url'),
        store = _self.get('store') || _self._getStore();
      if(!store.isStore){
        store.autoLoad = true;
        if(url){
          store.url = url;
        }
        store = new Data.TreeStore(store);
        _self.set('store',store);
      }
    },
    bindUI : function  () {
      var _self = this;
      _self.on('change',function (ev) {
        var target = ev.target;
        if(target != _self){
          var field = target,
            value = field.get('value'),
            level = _self._getFieldIndex(field) + 1;
          _self._valueChange(value,level);
        }
      });
    },
    onLoad : function(e){
      var _self = this,
        node = e ? e.node : _self.get('store').get('root');
      _self._setFieldItems(node.level,node.children); 
    },
    //\u83b7\u53d6store\u7684\u914d\u7f6e\u9879
    _getStore : function(){
      var _self = this,
        type = _self.get('type');
      if(type && TypeMap[type]){
        return TypeMap[type];
      }
      return {};
    },
    _valueChange : function(value,level){
      var _self = this,
        store = _self.get('store');
      if(value){
        var node = store.findNode(value);
        if(!node){
          return;
        }
        if(store.isLoaded(node)){
          _self._setFieldItems(level,node.children);
        }else{
          store.loadNode(node);
        }
      }else{
        _self._setFieldItems(level,[]);
      }
    },
    _setFieldItems : function(level,nodes){
      var _self = this,
        field = _self.getFieldAt(level),
        items = getItems(nodes);
      if(field){
        field.setItems(items);
        _self._valueChange(field.get('value'),level + 1);
      }
    },
    //\u83b7\u53d6\u5b57\u6bb5\u7684\u7d22\u5f15\u4f4d\u7f6e
    _getFieldIndex : function (field) {
      var _self = this,
        fields = _self.getFields();
      return  BUI.Array.indexOf(field,fields);
    }
  },{
    ATTRS : {
      /**
       * \u7ea7\u8054\u9009\u62e9\u6846\u7684\u7c7b\u578b,\u76ee\u524d\u4ec5\u5185\u7f6e\u4e86 'city'\u4e00\u4e2a\u7c7b\u578b\uff0c\u7528\u4e8e\u9009\u62e9\u7701\u3001\u5e02\u3001\u53bf,
       * \u53ef\u4ee5\u81ea\u5b9a\u4e49\u6dfb\u52a0\u7c7b\u578b
       *         Select.addType('city',{
       *           proxy : {
       *             url : 'http://lp.taobao.com/go/rgn/citydistrictdata.php',
       *             dataType : 'jsonp'
       *           },
       *           map : {
       *             isleaf : 'leaf',
       *             value : 'text'
       *           }
       *         });
       * @type {String}
       */
      type : {

      },
      store : {

      }
    }
  },{
    xclass : 'form-group-select'
  });

  var TypeMap = {};

  /**
   * \u6dfb\u52a0\u4e00\u4e2a\u7c7b\u578b\u7684\u7ea7\u8054\u9009\u62e9\u6846\uff0c\u76ee\u524d\u4ec5\u5185\u7f6e\u4e86 'city'\u4e00\u4e2a\u7c7b\u578b\uff0c\u7528\u4e8e\u9009\u62e9\u7701\u3001\u5e02\u3001\u53bf
   * @static
   * @param {String} name \u7c7b\u578b\u540d\u79f0
   * @param {Object} cfg  \u914d\u7f6e\u9879\uff0c\u8be6\u7ec6\u4fe1\u606f\u8bf7\u53c2\u770b\uff1a @see{BUI.Data.TreeStore}
   */
  Select.addType = function(name,cfg){
    TypeMap[name] = cfg;
  };

  Select.addType('city',{
    proxy : {
      url : 'http://lp.taobao.com/go/rgn/citydistrictdata.php',
      dataType : 'jsonp'
    },
    map : {
      isleaf : 'leaf',
      value : 'text'
    }
  });


  return Select;
});
define('bui/form/fieldgroup',['bui/common','bui/form/group/base','bui/form/group/range','bui/form/group/check','bui/form/group/select'],function (require) {
  var BUI = require('bui/common'),
    Group = require('bui/form/group/base');

  BUI.mix(Group,{
    Range : require('bui/form/group/range'),
    Check : require('bui/form/group/check'),
    Select : require('bui/form/group/select')
  });
  return Group;
});
define('bui/form/form',['bui/common','bui/toolbar','bui/form/fieldcontainer'],function (require) {
  
  var BUI = require('bui/common'),
    Bar = require('bui/toolbar').Bar,
    TYPE_SUBMIT = {
      NORMAL : 'normal',
      AJAX : 'ajax',
      IFRAME : 'iframe'
    },
    FieldContainer = require('bui/form/fieldcontainer'),
    Component = BUI.Component;

  var FormView = FieldContainer.View.extend({
    _uiSetMethod : function(v){
      this.get('el').attr('method',v);
    },
    _uiSetAction : function(v){
      this.get('el').attr('action',v);
    }
  },{
    ATTRS : {
      method : {},
      action : {}
    }
  },{
    xclass: 'form-view'
  });

  /**
   * @class BUI.Form.Form
   * \u8868\u5355\u63a7\u4ef6,\u8868\u5355\u76f8\u5173\u7684\u7c7b\u56fe\uff1a
   * <img src="../assets/img/class-form.jpg"/>
   * @extends BUI.Form.FieldContainer
   */
  var Form = FieldContainer.extend({
    renderUI : function(){
      var _self = this,
        buttonBar = _self.get('buttonBar'),
        cfg;
      if($.isPlainObject(buttonBar) && _self.get('buttons')){
        cfg = BUI.merge(_self.getDefaultButtonBarCfg(),buttonBar);
        buttonBar = new Bar(cfg);
        _self.set('buttonBar',buttonBar);
      }
      _self._initSubmitMask();
    },
    bindUI : function(){
      var _self = this,
        formEl = _self.get('el');

      formEl.on('submit',function(ev){
        _self.valid();
        if(!_self.isValid() || _self.onBeforeSubmit() === false){
          ev.preventDefault();
          return;
        }
        if(_self.isValid() && _self.get('submitType') === TYPE_SUBMIT.AJAX){
          ev.preventDefault();
          _self.ajaxSubmit();
        }

      });
    },
    /**
     * \u83b7\u53d6\u6309\u94ae\u680f\u9ed8\u8ba4\u7684\u914d\u7f6e\u9879
     * @protected
     * @return {Object} 
     */
    getDefaultButtonBarCfg : function(){
      var _self = this,
        buttons = _self.get('buttons');
      return {
        autoRender : true,
        elCls :'toolbar',
        render : _self.get('el'),
        items : buttons,
        defaultChildClass : 'bar-item-button'
      };
    },
    /**
     * \u8868\u5355\u63d0\u4ea4\uff0c\u5982\u679c\u672a\u901a\u8fc7\u9a8c\u8bc1\uff0c\u5219\u963b\u6b62\u63d0\u4ea4
     */
    submit : function(options){
      var _self = this,
        submitType = _self.get('submitType');
      _self.valid();
      if(_self.isValid()){
        if(_self.onBeforeSubmit() == false){
          return;
        }
        if(submitType === TYPE_SUBMIT.NORMAL){
          _self.get('el')[0].submit();
        }else if(submitType === TYPE_SUBMIT.AJAX){
          _self.ajaxSubmit(options);
        }
      }
    },
    /**
     * \u5f02\u6b65\u63d0\u4ea4\u8868\u5355
     */
    ajaxSubmit : function(options){
      var _self = this,
        method = _self.get('method'),
        action = _self.get('action'),
        callback = _self.get('callback'),
        submitMask = _self.get('submitMask'),
        data = _self.serializeToObject(), //\u83b7\u53d6\u8868\u5355\u6570\u636e
        success,
        ajaxParams = BUI.merge(true,{ //\u5408\u5e76\u8bf7\u6c42\u53c2\u6570
          url : action,
          type : method,
          dataType : 'json',
          data : data
        },options);

      if(options && options.success){
        success = options.success;
      }
      ajaxParams.success = function(data){ //\u5c01\u88c5success\u65b9\u6cd5
        if(submitMask && submitMask.hide){
          submitMask.hide();
        }
        if(success){
          success(data);
        }
        callback && callback.call(_self,data);
      } 
      if(submitMask && submitMask.show){
        submitMask.show();
      }
      $.ajax(ajaxParams); 
    },
    //\u83b7\u53d6\u63d0\u4ea4\u7684\u5c4f\u853d\u5c42
    _initSubmitMask : function(){
      var _self = this,
        submitType = _self.get('submitType'),
        submitMask = _self.get('submitMask');
      if(submitType === TYPE_SUBMIT.AJAX && submitMask){
        BUI.use('bui/mask',function(Mask){
          var cfg = $.isPlainObject(submitMask) ? submitMask : {};
          submitMask = new Mask.LoadMask(BUI.mix({el : _self.get('el')},cfg));
          _self.set('submitMask',submitMask);
        });
      }
    },
    /**
     * \u5e8f\u5217\u5316\u8868\u5355\u6210\u5bf9\u8c61
     * @return {Object} \u5e8f\u5217\u5316\u6210\u5bf9\u8c61
     */
    serializeToObject : function(){
      return BUI.FormHelper.serializeToObject(this.get('el')[0]);
    },
    /**
     * \u8868\u5355\u63d0\u4ea4\u524d
     * @protected
     * @return {Boolean} \u662f\u5426\u53d6\u6d88\u63d0\u4ea4
     */
    onBeforeSubmit : function(){
      return this.fire('beforesubmit');
    },
    /**
     * \u8868\u5355\u6062\u590d\u521d\u59cb\u503c
     */
    reset : function(){
      var _self = this,
        initRecord = _self.get('initRecord');
      _self.setRecord(initRecord);
    },
    /**
     * \u91cd\u7f6e\u63d0\u793a\u4fe1\u606f\uff0c\u56e0\u4e3a\u5728\u8868\u5355\u9690\u85cf\u72b6\u6001\u4e0b\uff0c\u63d0\u793a\u4fe1\u606f\u5b9a\u4f4d\u9519\u8bef
     * <pre><code>
     * dialog.on('show',function(){
     *   form.resetTips();
     * });
     *   
     * </code></pre>
     */
    resetTips : function(){
      var _self = this,
        fields = _self.getFields();
      BUI.each(fields,function(field){
        field.resetTip();
      });
    },
    /**
     * @protected
     * @ignore
     */
    destructor : function(){
      var _self = this,
        buttonBar = _self.get('buttonBar'),
        submitMask = _self.get('submitMask');
      if(buttonBar && buttonBar.destroy){
        buttonBar.destroy();
      }
      if(submitMask && submitMask.destroy){
        submitMask.destroy();
      }
    },
    //\u8bbe\u7f6e\u8868\u5355\u7684\u521d\u59cb\u6570\u636e
    _uiSetInitRecord : function(v){
      //if(v){
        this.setRecord(v);
      //}
      
    }
  },{
    ATTRS : {
      /**
       * \u63d0\u4ea4\u7684\u8def\u5f84
       * @type {String}
       */
      action : {
        view : true,
        value : ''
      },
      allowTextSelection:{
        value : true
      },
      events : {
        value : {
          /**
           * @event
           * \u8868\u5355\u63d0\u4ea4\u524d\u89e6\u53d1\uff0c\u5982\u679c\u8fd4\u56defalse\u4f1a\u963b\u6b62\u8868\u5355\u63d0\u4ea4
           */
          beforesubmit : false
        }
      },
      /**
       * \u63d0\u4ea4\u7684\u65b9\u5f0f
       * @type {String}
       */
      method : {
        view : true,
        value : 'get'
      },
      /**
       * \u9ed8\u8ba4\u7684loader\u914d\u7f6e
       * <pre>
       * {
       *   autoLoad : true,
       *   property : 'record',
       *   dataType : 'json'
       * }
       * </pre>
       * @type {Object}
       */
      defaultLoaderCfg : {
        value : {
          autoLoad : true,
          property : 'record',
          dataType : 'json'
        }
      },
      /**
       * \u5f02\u6b65\u63d0\u4ea4\u8868\u5355\u65f6\u7684\u5c4f\u853d
       * @type {BUI.Mask.LoadMask|Object}
       */
      submitMask : {
        value : {
          msg : '\u6b63\u5728\u63d0\u4ea4\u3002\u3002\u3002'
        }
      },
      /**
       * \u63d0\u4ea4\u8868\u5355\u7684\u65b9\u5f0f
       *
       *  - normal \u666e\u901a\u65b9\u5f0f\uff0c\u76f4\u63a5\u63d0\u4ea4\u8868\u5355
       *  - ajax \u5f02\u6b65\u63d0\u4ea4\u65b9\u5f0f\uff0c\u5728submit\u6307\u5b9a\u53c2\u6570
       *  - iframe \u4f7f\u7528iframe\u63d0\u4ea4,\u5f00\u53d1\u4e2d\u3002\u3002\u3002
       * @cfg {String} [submitType='normal']
       */
      submitType : {
        value : 'normal'
      },
      /**
       * \u8868\u5355\u63d0\u4ea4\u6210\u529f\u540e\u7684\u56de\u8c03\u51fd\u6570\uff0c\u666e\u901a\u63d0\u4ea4\u65b9\u5f0f submitType = 'normal'\uff0c\u4e0d\u4f1a\u8c03\u7528
       * @type {Object}
       */
      callback : {

      },
      decorateCfgFields : {
        value : {
          'method' : true,
          'action' : true
        }
      },
      /**
       * \u9ed8\u8ba4\u7684\u5b50\u63a7\u4ef6\u65f6\u6587\u672c\u57df
       * @type {String}
       */
      defaultChildClass : {
        value : 'form-field'
      },
      /**
       * \u4f7f\u7528\u7684\u6807\u7b7e\uff0c\u4e3aform
       * @type {String}
       */
      elTagName : {
        value : 'form'
      },
      /**
       * \u8868\u5355\u6309\u94ae
       * @type {Array}
       */
      buttons : {

      },
      /**
       * \u6309\u94ae\u680f
       * @type {BUI.Toolbar.Bar}
       */
      buttonBar : {
        value : {

        }
      },
      childContainer : {
        value : '.x-form-fields'
      },
      /**
       * \u8868\u5355\u521d\u59cb\u5316\u7684\u6570\u636e\uff0c\u7528\u4e8e\u521d\u59cb\u5316\u6216\u8005\u8868\u5355\u56de\u6eda
       * @type {Object}
       */
      initRecord : {

      },
      /**
       * \u8868\u5355\u9ed8\u8ba4\u4e0d\u663e\u793a\u9519\u8bef\uff0c\u4e0d\u5f71\u54cd\u8868\u5355\u5206\u7ec4\u548c\u8868\u5355\u5b57\u6bb5
       * @type {Boolean}
       */
      showError : {
        value : false
      },
      xview : {
        value : FormView
      },
      tpl : {
        value : '<div class="x-form-fields"></div>'
      }
    }
  },{
    xclass : 'form'
  });
  
  Form.View = FormView;
  return Form;
});
define('bui/form/horizontal',['bui/common','bui/form/form'],function (require) {
  var BUI = require('bui/common'),
    Form = require('bui/form/form');

  /**
   * @class BUI.Form.Horizontal
   * \u6c34\u5e73\u8868\u5355\uff0c\u5b57\u6bb5\u6c34\u5e73\u6392\u5217
   * @extends BUI.Form.Form
   * 
   */
  var Horizontal = Form.extend({
    /**
     * \u83b7\u53d6\u6309\u94ae\u680f\u9ed8\u8ba4\u7684\u914d\u7f6e\u9879
     * @protected
     * @return {Object} 
     */
    getDefaultButtonBarCfg : function(){
      var _self = this,
        buttons = _self.get('buttons');
      return {
        autoRender : true,
        elCls : 'actions-bar toolbar row',
        tpl : '<div class="form-actions span21 offset3"></div>',
        childContainer : '.form-actions',
        render : _self.get('el'),
        items : buttons,
        defaultChildClass : 'bar-item-button'
      };
    }
  },{
    ATTRS : {
      defaultChildClass : {
        value : 'form-row'
      },
      errorTpl : {
        value : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>'
      },
      elCls : {
        value : 'form-horizontal'
      }
    },
    PARSER : {
      
    }
  },{
    xclass : 'form-horizontal'
  });
  return Horizontal;
});
define('bui/form/row',['bui/common','bui/form/fieldcontainer'],function (require) {
  var BUI = require('bui/common'),
    FieldContainer = require('bui/form/fieldcontainer');

  /**
   * @class BUI.Form.Row
   * \u8868\u5355\u884c
   * @extends BUI.Form.FieldContainer
   */
  var Row = FieldContainer.extend({

  },{
    ATTRS : {
      elCls : {
        value : 'row'
      },
      defaultChildCfg:{
        value : {
          tpl : ' <label class="control-label">{label}</label>\
                <div class="controls">\
                </div>',
          childContainer : '.controls',
          showOneError : true,
          controlContainer : '.controls',
          elCls : 'control-group span8',
          errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>'
        }
        
      },
      defaultChildClass : {
        value : 'form-field-text'
      }
    }
  },{
    xclass:'form-row'
  });

  return Row;
});
define('bui/form/rule',['bui/common'],function (require) {

  var BUI = require('bui/common');
  /**
   * @class BUI.Form.Rule
   * \u9a8c\u8bc1\u89c4\u5219
   * @extends BUI.Base
   */
  var Rule = function (config){
    Rule.superclass.constructor.call(this,config);
  }

  BUI.extend(Rule,BUI.Base);

  Rule.ATTRS = {
    /**
     * \u89c4\u5219\u540d\u79f0
     * @type {String}
     */
    name : {

    },
    /**
     * \u9a8c\u8bc1\u5931\u8d25\u4fe1\u606f
     * @type {String}
     */
    msg : {

    },
    /**
     * \u9a8c\u8bc1\u51fd\u6570
     * @type {Function}
     */
    validator : {
      value : function(value,baseValue,formatedMsg,control){

      }
    }
  }

  //\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
  function valid(self,value,baseValue,msg,control){
    if(BUI.isArray(baseValue) && BUI.isString(baseValue[1])){
      if(baseValue[1]){
        msg = baseValue[1];
      }
      baseValue = baseValue[0];
    }
    var _self = self,
      validator = _self.get('validator'),
      formatedMsg = formatError(self,baseValue,msg),
      valid = true;
    value = value == null ? '' : value;
    return validator.call(_self,value,baseValue,formatedMsg,control);
  }

  function parseParams(values){

    if(values == null){
      return {};
    }

    if($.isPlainObject(values)){
      return values;
    }

    var ars = values,
        rst = {};
    if(BUI.isArray(values)){

      for(var i = 0; i < ars.length; i++){
        rst[i] = ars[i];
      }
      return rst;
    }

    return {'0' : values};
  }

  function formatError(self,values,msg){
    var ars = parseParams(values); 
    msg = msg || self.get('msg');
    return BUI.substitute(msg,ars);
  }

  BUI.augment(Rule,{

    /**
     * \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1\uff0c\u8be5\u51fd\u6570\u53ef\u4ee5\u63a5\u6536\u591a\u4e2a\u53c2\u6570
     * @param  {*}  [value] \u9a8c\u8bc1\u7684\u503c
     * @param  {*} [baseValue] \u8ddf\u4f20\u5165\u503c\u76f8\u6bd4\u8f83\u7684\u503c
     * @param {String} [msg] \u9a8c\u8bc1\u5931\u8d25\u540e\u7684\u9519\u8bef\u4fe1\u606f\uff0c\u663e\u793a\u7684\u9519\u8bef\u4e2d\u53ef\u4ee5\u663e\u793a baseValue\u4e2d\u7684\u4fe1\u606f
     * @param {BUI.Form.Field|BUI.Form.Group} [control] \u53d1\u751f\u9a8c\u8bc1\u7684\u63a7\u4ef6
     * @return {String}   \u901a\u8fc7\u9a8c\u8bc1\u8fd4\u56de null ,\u672a\u901a\u8fc7\u9a8c\u8bc1\u8fd4\u56de\u9519\u8bef\u4fe1\u606f
     * 
     *         var msg = '\u8f93\u5165\u6570\u636e\u5fc5\u987b\u5728{0}\u548c{1}\u4e4b\u95f4\uff01',
     *           rangeRule = new Rule({
     *             name : 'range',
     *             msg : msg,
     *             validator :function(value,range,msg){
     *               var min = range[0], //\u6b64\u5904\u6211\u4eec\u628arange\u5b9a\u4e49\u4e3a\u6570\u7ec4\uff0c\u4e5f\u53ef\u4ee5\u5b9a\u4e49\u4e3a{min:0,max:200},\u90a3\u4e48\u5728\u4f20\u5165\u6821\u9a8c\u65f6\u8ddf\u6b64\u5904\u4e00\u81f4\u5373\u53ef
     *                 max = range[1];   //\u5728\u9519\u8bef\u4fe1\u606f\u4e2d\uff0c\u4f7f\u7528\u7528 '\u8f93\u5165\u6570\u636e\u5fc5\u987b\u5728{min}\u548c{max}\u4e4b\u95f4\uff01',\u9a8c\u8bc1\u51fd\u6570\u4e2d\u7684\u5b57\u7b26\u4e32\u5df2\u7ecf\u8fdb\u884c\u683c\u5f0f\u5316
     *               if(value < min || value > max){
     *                 return false;
     *               }
     *               return true;
     *             }
     *           });
     *         var range = [0,200],
     *           val = 100,
     *           error = rangeRule.valid(val,range);//msg\u53ef\u4ee5\u5728\u6b64\u5904\u91cd\u65b0\u4f20\u5165
     *         
     */
    valid : function(value,baseValue,msg,control){
      var _self = this;
      return valid(_self,value,baseValue,msg,control);
    }
  });

  return Rule;


});
define('bui/form/rules',['bui/form/rule'],function (require) {

  var Rule = require('bui/form/rule');

  function toNumber(value){
    return parseFloat(value);
  }

  function toDate(value){
    return BUI.Date.parse(value);
  }

  var ruleMap = {

  };

  /**
   * @class BUI.Form.Rules
   * @singleton
   * \u8868\u5355\u9a8c\u8bc1\u7684\u9a8c\u8bc1\u89c4\u5219\u7ba1\u7406\u5668
   */
  var rules = {
    /**
     * \u6dfb\u52a0\u9a8c\u8bc1\u89c4\u5219
     * @param {Object|BUI.Form.Rule} rule \u9a8c\u8bc1\u89c4\u5219\u914d\u7f6e\u9879\u6216\u8005\u9a8c\u8bc1\u89c4\u5219\u5bf9\u8c61
     * @param  {String} name \u89c4\u5219\u540d\u79f0
     */
    add : function(rule){
      var name;
      if($.isPlainObject(rule)){
        name = rule.name;
        ruleMap[name] = new Rule(rule);        
      }else if(rule.get){
        name = rule.get('name'); 
        ruleMap[name] = rule;
      }
      return ruleMap[name];
    },
    /**
     * \u5220\u9664\u9a8c\u8bc1\u89c4\u5219
     * @param  {String} name \u89c4\u5219\u540d\u79f0
     */
    remove : function(name){
      delete ruleMap[name];
    },
    /**
     * \u83b7\u53d6\u9a8c\u8bc1\u89c4\u5219
     * @param  {String} name \u89c4\u5219\u540d\u79f0
     * @return {BUI.Form.Rule}  \u9a8c\u8bc1\u89c4\u5219
     */
    get : function(name){
      return ruleMap[name];
    },
    /**
     * \u9a8c\u8bc1\u6307\u5b9a\u7684\u89c4\u5219
     * @param  {String} name \u89c4\u5219\u7c7b\u578b
     * @param  {*} value \u9a8c\u8bc1\u503c
     * @param  {*} [baseValue] \u7528\u4e8e\u9a8c\u8bc1\u7684\u57fa\u7840\u503c
     * @param  {String} [msg] \u663e\u793a\u9519\u8bef\u7684\u6a21\u677f
     * @param  {BUI.Form.Field|BUI.Form.Group} [control] \u663e\u793a\u9519\u8bef\u7684\u6a21\u677f
     * @return {String} \u901a\u8fc7\u9a8c\u8bc1\u8fd4\u56de null,\u5426\u5219\u8fd4\u56de\u9519\u8bef\u4fe1\u606f
     */
    valid : function(name,value,baseValue,msg,control){
      var rule = rules.get(name);
      if(rule){
        return rule.valid(value,baseValue,msg,control);
      }
      return null;
    },
    /**
     * \u9a8c\u8bc1\u6307\u5b9a\u7684\u89c4\u5219
     * @param  {String} name \u89c4\u5219\u7c7b\u578b
     * @param  {*} values \u9a8c\u8bc1\u503c
     * @param  {*} [baseValue] \u7528\u4e8e\u9a8c\u8bc1\u7684\u57fa\u7840\u503c
     * @param  {BUI.Form.Field|BUI.Form.Group} [control] \u663e\u793a\u9519\u8bef\u7684\u6a21\u677f
     * @return {Boolean} \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    isValid : function(name,value,baseValue,control){
      return rules.valid(name,value,baseValue,control) == null;
    }
  };
  
  /**
   * \u975e\u7a7a\u9a8c\u8bc1,\u4f1a\u5bf9\u503c\u53bb\u9664\u7a7a\u683c
   * <ol>
   *  <li>name: required</li>
   *  <li>msg: \u4e0d\u80fd\u4e3a\u7a7a\uff01</li>
   *  <li>required: boolean \u7c7b\u578b</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var required = rules.add({
    name : 'required',
    msg : '\u4e0d\u80fd\u4e3a\u7a7a\uff01',
    validator : function(value,required,formatedMsg){
      if(required !== false && /^\s*$/.test(value)){
        return formatedMsg;
      }
    }
  });

  /**
   * \u76f8\u7b49\u9a8c\u8bc1
   * <ol>
   *  <li>name: equalTo</li>
   *  <li>msg: \u4e24\u6b21\u8f93\u5165\u4e0d\u4e00\u81f4\uff01</li>
   *  <li>equalTo: \u4e00\u4e2a\u5b57\u7b26\u4e32\uff0cid\uff08#id_name) \u6216\u8005 name</li>
   * </ol>
   *         {
   *           equalTo : '#password'
   *         }
   *         //\u6216\u8005
   *         {
   *           equalTo : 'password'
   *         } 
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var equalTo = rules.add({
    name : 'equalTo',
    msg : '\u4e24\u6b21\u8f93\u5165\u4e0d\u4e00\u81f4\uff01',
    validator : function(value,equalTo,formatedMsg){
      var el = $(equalTo);
      if(el.length){
        equalTo = el.val();
      } 
      return value === equalTo ? undefined : formatedMsg;
    }
  });


  /**
   * \u4e0d\u5c0f\u4e8e\u9a8c\u8bc1
   * <ol>
   *  <li>name: min</li>
   *  <li>msg: \u8f93\u5165\u503c\u4e0d\u80fd\u5c0f\u4e8e{0}\uff01</li>
   *  <li>min: \u6570\u5b57\uff0c\u5b57\u7b26\u4e32</li>
   * </ol>
   *         {
   *           min : 5
   *         }
   *         //\u5b57\u7b26\u4e32
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var min = rules.add({
    name : 'min',
    msg : '\u8f93\u5165\u503c\u4e0d\u80fd\u5c0f\u4e8e{0}\uff01',
    validator : function(value,min,formatedMsg){
      if(value !== '' && toNumber(value) < toNumber(min)){
        return formatedMsg;
      }
    }
  });

  /**
   * \u4e0d\u5c0f\u4e8e\u9a8c\u8bc1,\u7528\u4e8e\u6570\u503c\u6bd4\u8f83
   * <ol>
   *  <li>name: max</li>
   *  <li>msg: \u8f93\u5165\u503c\u4e0d\u80fd\u5927\u4e8e{0}\uff01</li>
   *  <li>max: \u6570\u5b57\u3001\u5b57\u7b26\u4e32</li>
   * </ol>
   *         {
   *           max : 100
   *         }
   *         //\u5b57\u7b26\u4e32
   *         {
   *           max : '100'
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var max = rules.add({
    name : 'max',
    msg : '\u8f93\u5165\u503c\u4e0d\u80fd\u5927\u4e8e{0}\uff01',
    validator : function(value,max,formatedMsg){
      if(value !== '' && toNumber(value) > toNumber(max)){
        return formatedMsg;
      }
    }
  });

  /**
   * \u8f93\u5165\u957f\u5ea6\u9a8c\u8bc1\uff0c\u5fc5\u987b\u662f\u6307\u5b9a\u7684\u957f\u5ea6
   * <ol>
   *  <li>name: length</li>
   *  <li>msg: \u8f93\u5165\u503c\u957f\u5ea6\u4e3a{0}\uff01</li>
   *  <li>length: \u6570\u5b57</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var length = rules.add({
    name : 'length',
    msg : '\u8f93\u5165\u503c\u957f\u5ea6\u4e3a{0}\uff01',
    validator : function(value,len,formatedMsg){
      if(value != null){
        value = $.trim(value.toString());
        if(len != value.length){
          return formatedMsg;
        }
      }
    }
  });
  /**
   * \u6700\u77ed\u957f\u5ea6\u9a8c\u8bc1,\u4f1a\u5bf9\u503c\u53bb\u9664\u7a7a\u683c
   * <ol>
   *  <li>name: minlength</li>
   *  <li>msg: \u8f93\u5165\u503c\u957f\u5ea6\u4e0d\u5c0f\u4e8e{0}\uff01</li>
   *  <li>minlength: \u6570\u5b57</li>
   * </ol>
   *         {
   *           minlength : 5
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var minlength = rules.add({
    name : 'minlength',
    msg : '\u8f93\u5165\u503c\u957f\u5ea6\u4e0d\u5c0f\u4e8e{0}\uff01',
    validator : function(value,min,formatedMsg){
      if(value != null){
        value = $.trim(value.toString());
        var len = value.length;
        if(len < min){
          return formatedMsg;
        }
      }
    }
  });

  /**
   * \u6700\u77ed\u957f\u5ea6\u9a8c\u8bc1,\u4f1a\u5bf9\u503c\u53bb\u9664\u7a7a\u683c
   * <ol>
   *  <li>name: maxlength</li>
   *  <li>msg: \u8f93\u5165\u503c\u957f\u5ea6\u4e0d\u5927\u4e8e{0}\uff01</li>
   *  <li>maxlength: \u6570\u5b57</li>
   * </ol>
   *         {
   *           maxlength : 10
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var maxlength = rules.add({
    name : 'maxlength',
    msg : '\u8f93\u5165\u503c\u957f\u5ea6\u4e0d\u5927\u4e8e{0}\uff01',
    validator : function(value,max,formatedMsg){
      if(value){
        value = $.trim(value.toString());
        var len = value.length;
        if(len > max){
          return formatedMsg;
        }
      }
    }
  });

  /**
   * \u6b63\u5219\u8868\u8fbe\u5f0f\u9a8c\u8bc1,\u5982\u679c\u6b63\u5219\u8868\u8fbe\u5f0f\u4e3a\u7a7a\uff0c\u5219\u4e0d\u8fdb\u884c\u6821\u9a8c
   * <ol>
   *  <li>name: regexp</li>
   *  <li>msg: \u8f93\u5165\u503c\u4e0d\u7b26\u5408{0}\uff01</li>
   *  <li>regexp: \u6b63\u5219\u8868\u8fbe\u5f0f</li>
   * </ol> 
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var regexp = rules.add({
    name : 'regexp',
    msg : '\u8f93\u5165\u503c\u4e0d\u7b26\u5408{0}\uff01',
    validator : function(value,regexp,formatedMsg){
      if(regexp){
        return regexp.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * \u90ae\u7bb1\u9a8c\u8bc1,\u4f1a\u5bf9\u503c\u53bb\u9664\u7a7a\u683c\uff0c\u65e0\u6570\u636e\u4e0d\u8fdb\u884c\u6821\u9a8c
   * <ol>
   *  <li>name: email</li>
   *  <li>msg: \u4e0d\u662f\u6709\u6548\u7684\u90ae\u7bb1\u5730\u5740\uff01</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var email = rules.add({
    name : 'email',
    msg : '\u4e0d\u662f\u6709\u6548\u7684\u90ae\u7bb1\u5730\u5740\uff01',
    validator : function(value,baseValue,formatedMsg){
      value = $.trim(value);
      if(value){
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * \u65e5\u671f\u9a8c\u8bc1\uff0c\u4f1a\u5bf9\u503c\u53bb\u9664\u7a7a\u683c\uff0c\u65e0\u6570\u636e\u4e0d\u8fdb\u884c\u6821\u9a8c\uff0c
   * \u5982\u679c\u4f20\u5165\u7684\u503c\u4e0d\u662f\u5b57\u7b26\u4e32\uff0c\u800c\u662f\u6570\u5b57\uff0c\u5219\u8ba4\u4e3a\u662f\u6709\u6548\u503c
   * <ol>
   *  <li>name: date</li>
   *  <li>msg: \u4e0d\u662f\u6709\u6548\u7684\u65e5\u671f\uff01</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var date = rules.add({
    name : 'date',
    msg : '\u4e0d\u662f\u6709\u6548\u7684\u65e5\u671f\uff01',
    validator : function(value,baseValue,formatedMsg){
      if(BUI.isNumber(value)){ //\u6570\u5b57\u8ba4\u4e3a\u662f\u65e5\u671f
        return;
      }
      if(BUI.isDate(value)){
        return;
      }
      value = $.trim(value);
      if(value){
        return BUI.Date.isDateString(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * \u4e0d\u5c0f\u4e8e\u9a8c\u8bc1
   * <ol>
   *  <li>name: minDate</li>
   *  <li>msg: \u8f93\u5165\u65e5\u671f\u4e0d\u80fd\u5c0f\u4e8e{0}\uff01</li>
   *  <li>minDate: \u65e5\u671f\uff0c\u5b57\u7b26\u4e32</li>
   * </ol>
   *         {
   *           minDate : '2001-01-01';
   *         }
   *         //\u5b57\u7b26\u4e32
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var minDate = rules.add({
    name : 'minDate',
    msg : '\u8f93\u5165\u65e5\u671f\u4e0d\u80fd\u5c0f\u4e8e{0}\uff01',
    validator : function(value,minDate,formatedMsg){
      if(value){
        var date = toDate(value);
        if(date && date < toDate(minDate)){
           return formatedMsg;
        }
      }
    }
  });

  /**
   * \u4e0d\u5c0f\u4e8e\u9a8c\u8bc1,\u7528\u4e8e\u6570\u503c\u6bd4\u8f83
   * <ol>
   *  <li>name: maxDate</li>
   *  <li>msg: \u8f93\u5165\u503c\u4e0d\u80fd\u5927\u4e8e{0}\uff01</li>
   *  <li>maxDate: \u65e5\u671f\u3001\u5b57\u7b26\u4e32</li>
   * </ol>
   *         {
   *           maxDate : '2001-01-01';
   *         }
   *         //\u6216\u65e5\u671f
   *         {
   *           maxDate : new Date('2001-01-01');
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var maxDate = rules.add({
    name : 'maxDate',
    msg : '\u8f93\u5165\u65e5\u671f\u4e0d\u80fd\u5927\u4e8e{0}\uff01',
    validator : function(value,maxDate,formatedMsg){
      if(value){
        var date = toDate(value);
        if(date && date > toDate(maxDate)){
           return formatedMsg;
        }
      }
    }
  });
  /**
   * \u6570\u5b57\u9a8c\u8bc1\uff0c\u4f1a\u5bf9\u503c\u53bb\u9664\u7a7a\u683c\uff0c\u65e0\u6570\u636e\u4e0d\u8fdb\u884c\u6821\u9a8c
   * \u5141\u8bb8\u5343\u5206\u7b26\uff0c\u4f8b\u5982\uff1a 12,000,000\u7684\u683c\u5f0f
   * <ol>
   *  <li>name: number</li>
   *  <li>msg: \u4e0d\u662f\u6709\u6548\u7684\u6570\u5b57\uff01</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var number = rules.add({
    name : 'number',
    msg : '\u4e0d\u662f\u6709\u6548\u7684\u6570\u5b57\uff01',
    validator : function(value,baseValue,formatedMsg){
      if(BUI.isNumber(value)){
        return;
      }
      value = value.replace(/\,/g,'');
      return !isNaN(value) ? undefined : formatedMsg;
    }
  });

  //\u6d4b\u8bd5\u8303\u56f4
  function testRange (baseValue,curVal,prevVal) {
    var allowEqual = baseValue && (baseValue.equals !== false);

    if(allowEqual){
      return prevVal <= curVal;
    }

    return prevVal < curVal;
  }
  function isEmpty(value){
    return value == '' || value == null;
  }
  //\u6d4b\u8bd5\u662f\u5426\u540e\u9762\u7684\u6570\u636e\u5927\u4e8e\u524d\u9762\u7684
  function rangeValid(value,baseValue,formatedMsg,group){
    var fields = group.getFields(),
      valid = true;
    for(var i = 1; i < fields.length ; i ++){
      var cur = fields[i],
        prev = fields[i-1],
        curVal,
        prevVal;
      if(cur && prev){
        curVal = cur.get('value');
        prevVal = prev.get('value');
        if(!isEmpty(curVal) && !isEmpty(prevVal) && !testRange(baseValue,curVal,prevVal)){
          valid = false;
          break;
        }
      }
    }
    if(!valid){
      return formatedMsg;
    }
    return null;
  }
  /**
   * \u8d77\u59cb\u7ed3\u675f\u65e5\u671f\u9a8c\u8bc1\uff0c\u524d\u9762\u7684\u65e5\u671f\u4e0d\u80fd\u5927\u4e8e\u540e\u9762\u7684\u65e5\u671f
   * <ol>
   *  <li>name: dateRange</li>
   *  <li>msg: \u8d77\u59cb\u65e5\u671f\u4e0d\u80fd\u5927\u4e8e\u7ed3\u675f\u65e5\u671f\uff01</li>
   *  <li>dateRange: \u53ef\u4ee5\u4f7ftrue\u6216\u8005{equals : fasle}\uff0c\u6807\u793a\u662f\u5426\u5141\u8bb8\u76f8\u7b49</li>
   * </ol>
   *         {
   *           dateRange : true
   *         }
   *         {
   *           dateRange : {equals : false}
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var dateRange = rules.add({
    name : 'dateRange',
    msg : '\u7ed3\u675f\u65e5\u671f\u4e0d\u80fd\u5c0f\u4e8e\u8d77\u59cb\u65e5\u671f\uff01',
    validator : rangeValid
  });

  /**
   * \u6570\u5b57\u8303\u56f4
   * <ol>
   *  <li>name: numberRange</li>
   *  <li>msg: \u8d77\u59cb\u6570\u5b57\u4e0d\u80fd\u5927\u4e8e\u7ed3\u675f\u6570\u5b57\uff01</li>
   *  <li>numberRange: \u53ef\u4ee5\u4f7ftrue\u6216\u8005{equals : fasle}\uff0c\u6807\u793a\u662f\u5426\u5141\u8bb8\u76f8\u7b49</li>
   * </ol>
   *         {
   *           numberRange : true
   *         }
   *         {
   *           numberRange : {equals : false}
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var numberRange = rules.add({
    name : 'numberRange',
    msg : '\u7ed3\u675f\u6570\u5b57\u4e0d\u80fd\u5c0f\u4e8e\u5f00\u59cb\u6570\u5b57\uff01',
    validator : rangeValid
  });

  function getFieldName (self) {
    var firstField = self.getFieldAt(0);
    if(firstField){
      return firstField.get('name');
    }
    return '';
  }

  function testCheckRange(value,range){
    if(!BUI.isArray(range)){
      range = [range];
    }
    //\u4e0d\u5b58\u5728\u503c
    if(!value || !range.length){
      return false;
    }
    var len = !value ? 0 : !BUI.isArray(value) ? 1 : value.length;
    //\u5982\u679c\u53ea\u6709\u4e00\u4e2a\u9650\u5b9a\u503c
    if(range.length == 1){
      var number = range [0];
      if(!number){//range = [0],\u5219\u4e0d\u5fc5\u9009
        return true;
      }
      if(number > len){
        return false;
      }
    }else{
      var min = range [0],
        max = range[1];
      if(min > len || max < len){
        return false;
      }
    }
    return true;
  }

  /**
   * \u52fe\u9009\u7684\u8303\u56f4
   * <ol>
   *  <li>name: checkRange</li>
   *  <li>msg: \u5fc5\u987b\u9009\u4e2d{0}\u9879\uff01</li>
   *  <li>checkRange: \u52fe\u9009\u7684\u9879\u8303\u56f4</li>
   * </ol>
   *         //\u81f3\u5c11\u52fe\u9009\u4e00\u9879
   *         {
   *           checkRange : 1
   *         }
   *         //\u53ea\u80fd\u52fe\u9009\u4e24\u9879
   *         {
   *           checkRange : [2,2]
   *         }
   *         //\u53ef\u4ee5\u52fe\u90092-4\u9879
   *         {
   *           checkRange : [2,4
   *           ]
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var checkRange = rules.add({
    name : 'checkRange',
    msg : '\u5fc5\u987b\u9009\u4e2d{0}\u9879\uff01',
    validator : function(record,baseValue,formatedMsg,group){
      var name = getFieldName(group),
        value,
        range = baseValue;
        
      if(name && range){
        value = record[name];
        if(!testCheckRange(value,range)){
          return formatedMsg;
        }
      }
      return null;
    }
  });
  

  return rules;
});
define('bui/form/remote',['bui/common'],function(require) {
  var BUI = require('bui/common');

  /**
   * @class BUI.Form.RemoteView
   * @private
   * \u8868\u5355\u5f02\u6b65\u8bf7\u6c42\u7c7b\u7684\u89c6\u56fe\u7c7b
   */
  var RemoteView = function () {
    // body...
  };

  RemoteView.ATTRS = {
    isLoading : {},
    loadingEl : {}
  };

  RemoteView.prototype = {

    /**
     * \u83b7\u53d6\u663e\u793a\u52a0\u8f7d\u72b6\u6001\u7684\u5bb9\u5668
     * @protected
     * @template
     * @return {jQuery} \u52a0\u8f7d\u72b6\u6001\u7684\u5bb9\u5668
     */
    getLoadingContainer : function () {
      // body...
    },
    _setLoading : function () {
      var _self = this,
        loadingEl = _self.get('loadingEl'),
        loadingTpl = _self.get('loadingTpl');
      if(!loadingEl){
        loadingEl = $(loadingTpl).appendTo(_self.getLoadingContainer());
        _self.setInternal('loadingEl',loadingEl);
      }
    },
    _clearLoading : function () {
      var _self = this,
        loadingEl = _self.get('loadingEl');
      if(loadingEl){
        loadingEl.remove();
        _self.setInternal('loadingEl',null);
      }
    },
    _uiSetIsLoading : function (v) {
      var _self = this;
      if(v){
        _self._setLoading();
      }else{
        _self._clearLoading();
      }
    }
  };

  /**
   * @class  BUI.Form.Remote
   * \u8868\u5355\u5f02\u6b65\u8bf7\u6c42\uff0c\u6240\u6709\u9700\u8981\u5b9e\u73b0\u5f02\u6b65\u6821\u9a8c\u3001\u5f02\u6b65\u8bf7\u6c42\u7684\u7c7b\u53ef\u4ee5\u4f7f\u7528\u3002
   */
  var Remote = function(){

  };

  Remote.ATTRS = {

    /**
     * \u9ed8\u8ba4\u7684\u5f02\u6b65\u8bf7\u6c42\u914d\u7f6e\u9879\uff1a
     * method : 'GET',
     * cache : true,
     * dataType : 'text'
     * @protected
     * @type {Object}
     */
    defaultRemote : {
      value : {
        method : 'GET',
        cache : true,
        callback : function (data) {
          return data;
        }
      }
    },
    /**
     * \u5f02\u6b65\u8bf7\u6c42\u5ef6\u8fdf\u7684\u65f6\u95f4\uff0c\u5f53\u5b57\u6bb5\u9a8c\u8bc1\u901a\u8fc7\u540e\uff0c\u4e0d\u9a6c\u4e0a\u8fdb\u884c\u5f02\u6b65\u8bf7\u6c42\uff0c\u7b49\u5f85\u7ee7\u7eed\u8f93\u5165\uff0c
     * 300\uff08\u9ed8\u8ba4\uff09\u6beb\u79d2\u540e\uff0c\u53d1\u9001\u8bf7\u6c42\uff0c\u5728\u8fd9\u4e2a\u8fc7\u7a0b\u4e2d\uff0c\u7ee7\u7eed\u8f93\u5165\uff0c\u5219\u53d6\u6d88\u5f02\u6b65\u8bf7\u6c42\u3002
     * @type {Object}
     */
    remoteDaly : {
      value : 500
    },
    /**
     * @private
     * \u7f13\u5b58\u9a8c\u8bc1\u7ed3\u679c\uff0c\u5982\u679c\u9a8c\u8bc1\u8fc7\u5bf9\u5e94\u7684\u503c\uff0c\u5219\u76f4\u63a5\u8fd4\u56de
     * @type {Object}
     */
    cacheMap : {
      value : {

      }
    },
    /**
     * \u52a0\u8f7d\u7684\u6a21\u677f
     * @type {String}
     */
    loadingTpl : {
      view : true,
      value : '<img src="http://img02.taobaocdn.com/tps/i2/T1NU8nXCVcXXaHNz_X-16-16.gif" alt="loading"/>'
    },
    /**
     * \u662f\u5426\u6b63\u5728\u7b49\u5f85\u5f02\u6b65\u8bf7\u6c42\u7ed3\u679c
     * @type {Boolean}
     */
    isLoading : {
      view : true,
      value : false
    },
    /**
     * \u5f02\u6b65\u8bf7\u6c42\u7684\u914d\u7f6e\u9879\uff0c\u53c2\u8003jQuery\u7684 ajax\u914d\u7f6e\u9879\uff0c\u5982\u679c\u4e3a\u5b57\u7b26\u4e32\u5219\u4e3a url\u3002
     * \u8bf7\u4e0d\u8981\u8986\u76d6success\u5c5e\u6027\uff0c\u5982\u679c\u9700\u8981\u56de\u8c03\u5219\u4f7f\u7528 callback \u5c5e\u6027
     *
     *        {
     *          remote : {
     *            url : 'test.php',
     *            dataType:'json',//\u9ed8\u8ba4\u4e3a\u5b57\u7b26\u4e32
     *            callback : function(data){
     *              if(data.success){ //data\u4e3a\u9ed8\u8ba4\u8fd4\u56de\u7684\u503c
     *                return ''  //\u8fd4\u56de\u503c\u4e3a\u7a7a\u65f6\uff0c\u9a8c\u8bc1\u6210\u529f
     *              }else{
     *                return '\u9a8c\u8bc1\u5931\u8d25\uff0cXX\u9519\u8bef\uff01' //\u663e\u793a\u8fd4\u56de\u7684\u5b57\u7b26\u4e32\u4e3a\u9519\u8bef
     *              }
     *            }
     *          }
     *        }
     * @type {String|Object}
     */
    remote : {
      setter : function  (v) {
        if(BUI.isString(v)){
          v = {url : v}
        }
        return v;
      }
    },
    /**
     * \u5f02\u6b65\u8bf7\u6c42\u7684\u51fd\u6570\u6307\u9488\uff0c\u4ec5\u5185\u90e8\u4f7f\u7528
     * @private
     * @type {Number}
     */
    remoteHandler : {

    },
    events : {
      value : {
        /**
         * \u5f02\u6b65\u8bf7\u6c42\u7ed3\u675f
         * @event
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {*} e.error \u662f\u5426\u9a8c\u8bc1\u6210\u529f
         */
        remotecomplete : false,
        /**
         * \u5f02\u6b65\u8bf7\u6c42\u5f00\u59cb
         * @event
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.data \u53d1\u9001\u7684\u5bf9\u8c61\uff0c\u662f\u4e00\u4e2a\u952e\u503c\u5bf9\uff0c\u53ef\u4ee5\u4fee\u6539\u6b64\u5bf9\u8c61\uff0c\u9644\u52a0\u4fe1\u606f
         */
        remotestart : false
      }
    }
  };

  Remote.prototype = {

    __bindUI : function(){
      var _self = this;

      _self.on('valid',function (ev) {
        if(_self.get('remote') && _self.isValid()){
          var value = _self.getControlValue(),
            data = _self.getRemoteParams();
          _self._startRemote(data,value);
        }
      });

      _self.on('error',function (ev) {
        if(_self.get('remote')){
          _self._cancelRemote();
        }
      });

    },
    //\u5f00\u59cb\u5f02\u6b65\u8bf7\u6c42
    _startRemote : function(data,value){
      var _self = this,
        remoteHandler = _self.get('remoteHandler'),
        cacheMap = _self.get('cacheMap'),
        remoteDaly = _self.get('remoteDaly');
      if(remoteHandler){
        //\u5982\u679c\u524d\u9762\u5df2\u7ecf\u53d1\u9001\u8fc7\u5f02\u6b65\u8bf7\u6c42\uff0c\u53d6\u6d88\u6389
        _self._cancelRemote(remoteHandler);
      }
      if(cacheMap[value] != null){
        _self._validResult(_self._getCallback(),cacheMap[value]);
        return;
      }
      //\u4f7f\u7528\u95ed\u5305\u8fdb\u884c\u5f02\u6b65\u8bf7\u6c42
      function dalayFunc(){
        _self._remoteValid(data,remoteHandler,value);
        _self.set('isLoading',true);
      }
      remoteHandler = setTimeout(dalayFunc,remoteDaly);
      _self.setInternal('remoteHandler',remoteHandler);
      
    },
    _validResult : function(callback,data){
      var _self = this,
        error = callback(data);
      _self.onRemoteComplete(error,data);
    },
    onRemoteComplete : function(error,data,remoteHandler){
      var _self = this;
      //\u786e\u8ba4\u5f53\u524d\u8fd4\u56de\u7684\u9519\u8bef\u662f\u5f53\u524d\u8bf7\u6c42\u7684\u7ed3\u679c\uff0c\u9632\u6b62\u8986\u76d6\u540e\u9762\u7684\u8bf7\u6c42
      if(remoteHandler == _self.get('remoteHandler')){
          _self.fire('remotecomplete',{error : error,data : data});
          _self.set('isLoading',false);
          _self.setInternal('remoteHandler',null);
      } 
    },
    _getOptions : function(data){
      var _self = this,
        remote = _self.get('remote'),
        defaultRemote = _self.get('defaultRemote'),
        options = BUI.merge(defaultRemote,remote,{data : data});
      return options;
    },
    _getCallback : function(){
      return this._getOptions().callback;
    },
    //\u5f02\u6b65\u8bf7\u6c42
    _remoteValid : function(data,remoteHandler,value){
      var _self = this,
        cacheMap = _self.get('cacheMap'),
        options = _self._getOptions(data);
      options.success = function (data) {
        var callback = options.callback,
          error = callback(data);
        cacheMap[value] = data; //\u7f13\u5b58\u5f02\u6b65\u7ed3\u679c
        _self.onRemoteComplete(error,data,remoteHandler);
      };

      options.error = function (jqXHR, textStatus,errorThrown){
        _self.onRemoteComplete(errorThrown,null,remoteHandler);
      };

      _self.fire('remotestart',{data : data});
      $.ajax(options);
    },
    /**
     * \u83b7\u53d6\u5f02\u6b65\u8bf7\u6c42\u7684\u952e\u503c\u5bf9
     * @template
     * @protected
     * @return {Object} \u8fdc\u7a0b\u9a8c\u8bc1\u7684\u53c2\u6570\uff0c\u952e\u503c\u5bf9
     */
    getRemoteParams : function() {

    },
    //\u53d6\u6d88\u5f02\u6b65\u8bf7\u6c42
    _cancelRemote : function(remoteHandler){
      var _self = this;

      remoteHandler = remoteHandler || _self.get('remoteHandler');
      if(remoteHandler){
        clearTimeout(remoteHandler);
        _self.setInternal('remoteHandler',null);
      }
      _self.set('isLoading',false);
    }

  };

  Remote.View = RemoteView;
  return Remote;
});