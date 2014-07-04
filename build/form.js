/**
 * @fileOverview form 命名空间入口
 * @ignore
 */
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
/**
 * @fileOverview 输入提示信息
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/tips',['bui/common','bui/overlay'],function (require) {

  var BUI = require('bui/common'),
    prefix = BUI.prefix,
    Overlay = require('bui/overlay').Overlay,
    FIELD_TIP = 'data-tip',
    CLS_TIP_CONTAINER = prefix + 'form-tip-container';

  /**
   * 表单提示信息类
   * xclass:'form-tip'
   * @class BUI.Form.TipItem
   * @extends BUI.Overlay.Overlay
   */
  var tipItem = Overlay.extend(

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
     * 重置是否显示
     */
    resetVisible : function(){
      var _self = this,
        triggerEl = $(_self.get('trigger'));

      if(triggerEl.val()){//如果默认有文本则不显示，否则显示
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
    {
      /**
       * 提示的输入框 
       * @cfg {String|HTMLElement|jQuery} trigger
       */
      /**
       * 提示的输入框
       * @type {String|HTMLElement|jQuery}
       */
      trigger:{

      },
      /**
       * 提示文本
       * @cfg {String} text
       */
      /**
       * 提示文本
       * @type {String}
       */
      text : {

      },
      /**
       * 提示文本上显示的icon样式
       * @cfg {String} iconCls
       *     iconCls : icon-ok
       */
      /**
       * 提示文本上显示的icon样式
       * @type {String}
       *     iconCls : icon-ok
       */
      iconCls:{

      },
      /**
       * 默认的模版
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
   * 表单提示信息的管理类
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
  {

    /**
     * 表单的选择器
     * @cfg {String|HTMLElement|jQuery} form
     */
    /**
     * 表单的选择器
     * @type {String|HTMLElement|jQuery}
     */
    form : {

    },
    /**
     * 表单提示项对象 {@link BUI.Form.TipItem}
     * @readOnly
     * @type {Array} 
     */
    items : {
      valueFn:function(){
        return [];
      }
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
     * 获取提示项
     * @param {String} name 字段的名称
     * @return {BUI.Form.TipItem} 提示项
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
     * 重置所有提示的可视状态
     */
    resetVisible : function(){
      var _self = this,
        items = _self.get('items');

      BUI.each(items,function(item){
        item.resetVisible();
      });
    },
    /**
     * 生成 表单提示
     */
    render:function(){
       var _self = this,
        items = _self.get('items');
      BUI.each(items,function(item){
        item.render();
      });
    },
    /**
     * 删除所有提示
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

});/**
 * @fileOverview 表单元素
 * @ignore
 */

define('bui/form/basefield',['bui/common','bui/form/tips','bui/form/valid','bui/form/remote'],function (require){

  var BUI = require('bui/common'),
    Component = BUI.Component,
    TipItem = require('bui/form/tips').Item,
    Valid = require('bui/form/valid'),
    Remote = require('bui/form/remote'),
    CLS_FIELD_ERROR = BUI.prefix + 'form-field-error',
    CLS_TIP_CONTAINER = 'bui-form-tip-container',
    DATA_ERROR = 'data-error';

  /**
   * 字段视图类
   * @class BUI.Form.FieldView
   * @private
   */
  var fieldView = Component.View.extend([Remote.View,Valid.View],{
    //渲染DOM
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
     * 清理显示的错误信息
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
     * 显示错误信息
     * @param {String} msg 错误信息
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
     * @internal 获取控件的容器
     * @return {jQuery} 控件容器
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
     * 获取显示加载状态的容器
     * @protected
     * @override
     * @return {jQuery} 加载状态的容器
     */
    getLoadingContainer : function () {
      return this.getControlContainer();
    },
    //设置名称
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
   * 表单字段基类
   * @class BUI.Form.Field
   * @mixins BUI.Form.Remote
   * @mixins BUI.Form.Valid
   * @extends BUI.Component.Controller
   */
  var field = Component.Controller.extend([Remote,Valid],{
    isField : true,
    initializer : function(){
      var _self = this;
      _self.on('afterRenderUI',function(){
        var tip = _self.get('tip');
        if(tip){
          var trigger = _self.getTipTigger();
          trigger && trigger.parent().addClass(CLS_TIP_CONTAINER);
          tip.trigger = trigger;
          tip.autoRender = true;
          tip = new TipItem(tip);
          _self.set('tip',tip);
        }
      });
    },
    //绑定事件
    bindUI : function(){
      var _self = this,
        validEvent = _self.get('validEvent'),
        changeEvent = _self.get('changeEvent'),
        firstValidEvent = _self.get('firstValidEvent'),
        innerControl = _self.getInnerControl();

      //选择框只使用 select事件
      if(innerControl.is('select')){
        validEvent = 'change';
      }
      //验证事件
      innerControl.on(validEvent,function(){
        var value = _self.getControlValue(innerControl);
        _self.validControl(value);
      });
      if(firstValidEvent){
        //未发生验证时，首次获取焦点/丢失焦点/点击，进行验证
        innerControl.on(firstValidEvent,function(){
          if(!_self.get('hasValid')){
            var value = _self.getControlValue(innerControl);
            _self.validControl(value);
          }
        });
      }
      

      //本来是监听控件的change事件，但是，如果控件还未触发change,但是通过get('value')来取值，则会出现错误，
      //所以当通过验证时，即触发改变事件
      _self.on(changeEvent,function(){
        _self.onValid();
      });

      _self.on('remotecomplete',function (ev) {
        _self._setError(ev.error);
      });

    },
    /**
     * 验证成功后执行的操作
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
     * 是否当前值，主要用于日期等特殊值的比较，不能用 == 进行比较
     * @param  {*}  value 进行比较的值
     * @return {Boolean}  是否当前值
     */
    isCurrentValue : function (value) {
      return value == this.get('value');
    },
    //清理错误信息
    _clearError : function(){
      this.set('error',null);
      this.get('view').clearErrors();
    },
    //设置错误信息
    _setError : function(msg){
      this.set('error',msg);
      this.showErrors();
    },

    /**
     * 获取内部表单元素的值
     * @protected
     * @param  {jQuery} [innerControl] 内部表单元素
     * @return {String|Boolean} 表单元素的值,checkbox，radio的返回值为 true,false
     */
    getControlValue : function(innerControl){
      var _self = this;
      innerControl = innerControl || _self.getInnerControl();
      return innerControl.val();
    },
    /**
     * @protected
     * 获取内部控件的容器
     */
    getControlContainer : function(){
      return this.get('view').getControlContainer();
    },
    /**
     * 获取异步验证的参数，对于表单字段域而言，是{[name] : [value]}
     * @protected
     * @override
     * @return {Object} 参数键值对
     */
    getRemoteParams : function  () {
      var _self = this,
        rst = {};
      rst[_self.get('name')] = _self.getControlValue();
      return rst;
    },
    /**
     * 设置字段的值
     * @protected
     * @param {*} value 字段值
     */
    setControlValue : function(value){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.val(value);
    },
    /**
     * 将字符串等格式转换成
     * @protected
     * @param  {String} value 原始数据
     * @return {*}  该字段指定的类型
     */
    parseValue : function(value){
      return value;
    },
    valid : function(){
      var _self = this;
      _self.validControl();
    },
    /**
     * 验证控件内容
     * @return {Boolean} 是否通过验证
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
          if(preError !== errorMsg){//验证错误信息改变，说明验证改变
            _self.fire('validchange',{ valid : false });
          }
      } else {
          _self._clearError();
          _self.fire('valid');
          if(preError){//如果以前存在错误，那么验证结果改变
            _self.fire('validchange',{ valid : true });
          }
      }
      
      return !errorMsg;
    },
    /**
     * 字段获得焦点
     */
    focus : function(){
      this.getInnerControl().focus();
    },
    /**
     * 字段发生改变
     */
    change : function(){
      var control = this.getInnerControl();
      control.change();
    },
    /**
     * 字段丢失焦点
     */
    blur : function(){
      this.getInnerControl().blur();
    },

    /**
     * 是否通过验证,如果未发生过校验，则进行校验，否则不进行校验，直接根据已校验的结果判断。
     * @return {Boolean} 是否通过验证
     */
    isValid : function(){
      var _self = this;
      if(!_self.get('hasValid')){
        _self.validControl();
      }
      return !_self.get('error');
    },
    /**
     * 获取验证出错信息
     * @return {String} 出错信息
     */
    getError : function(){
      return this.get('error');
    },
    /**
     * 获取验证出错信息集合
     * @return {Array} 出错信息集合
     */
    getErrors : function(){
      var error = this.getError();
      if(error){
        return [error];
      }
      return [];
    },
    /**
     * 清理出错信息，回滚到未出错状态
     * @param {Boolean} reset 清除错误时，是否回滚上次正确的值
     */
    clearErrors : function(reset){
      var _self = this;
      _self._clearError();
      if(reset && _self.getControlValue()!= _self.get('value')){
        _self.setControlValue(_self.get('value'));
      }
    },
    /**
     * 获取内部的表单元素或者内部控件
     * @protected
     * @return {jQuery|BUI.Component.Controller} 
     */
    getInnerControl : function(){
      return this.get('view').get('control');
    },
    /**
     * 提示信息按照此元素对齐
     * @protected
     * @return {HTMLElement}
     */
    getTipTigger : function(){
      return this.getInnerControl();
    },
    //析构函数
    destructor : function(){
      var _self = this,
        tip = _self.get('tip');
      if(tip && tip.destroy){
        tip.destroy();
      }
    },
    /**
     * @protected
     * 设置内部元素宽度
     */
    setInnerWidth : function(width){
      var _self = this,
        innerControl = _self.getInnerControl(),
        siblings = innerControl.siblings(),
        appendWidth = innerControl.outerWidth() - innerControl.width();

      BUI.each(siblings,function(dom){
        appendWidth += $(dom).outerWidth();
      });
      
      innerControl.width(width - appendWidth);
    },
    //重置 提示信息是否可见
    _resetTip :function(){
      var _self = this,
        tip = _self.get('tip');
      if(tip){
        tip.resetVisible();
      }
    },
    /**
     * 重置显示提示信息
     * field.resetTip();
     */
    resetTip : function(){
      this._resetTip();
    },
    //设置值
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
    //禁用控件
    _uiSetDisabled : function(v){
      var _self = this,
        innerControl = _self.getInnerControl(),
        children = _self.get('children');
      innerControl.attr('disabled',v);
      if(_self.get('rendered')){
        if(v){//控件不可用，清除错误
          _self.clearErrors();
        }
        if(!v){//控件可用，执行重新验证
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
       * 是否发生过校验，初始值为空时，未进行赋值，不进行校验
       * @type {Boolean}
       */
      hasValid : {
        value : false
      },
      /**
       * 内部元素是否根据控件宽度调整宽度
       * @type {Boolean}
       */
      forceFit : {
        value : false
      },
      /**
       * 是否显示提示信息
       * @type {Object}
       */
      tip : {

      },
      /**
       * 表单元素或者控件内容改变的事件
       * @type {String}
       */
      changeEvent : {
        value : 'valid'
      },
      /**
       * 未发生验证时，首次获取/丢失焦点，进行验证
       */
      firstValidEvent : {
        value : 'blur'
      },
      /**
       * 表单元素或者控件触发此事件时，触发验证
       * @type {String}
       */
      validEvent : {
        value : 'keyup change'
      },
      /**
       * 字段的name值
       * @type {Object}
       */
      name : {
        view :true
      },
      /**
       * 是否显示错误
       * @type {Boolean}
       */
      showError : {
        view : true,
        value : true
      },
      /**
       * 字段的值,类型根据字段类型决定
       * @cfg {*} value
       */
      value : {
        view : true
      },
      /**
       * 标题
       * @type {String}
       */
      label : {

      },
      /**
       * 控件容器，如果为空直接添加在控件容器上
       * @type {String|HTMLElement}
       */
      controlContainer : {
        view : true
      },
      /**
       * 内部表单元素的控件
       * @protected
       * @type {jQuery}
       */
      control : {
        view : true
      },
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="text"/>'
      },
      events: {
        value : {
          /**
           * 未通过验证
           * @event
           */
          error : false,
          /**
           * 通过验证
           * @event
           */
          valid : false,
          /**
           * @event
           * 值改变，仅当通过验证时触发
           */
          change : true,

          /**
           * @event
           * 验证改变
           * @param {Object} e 事件对象
           * @param {Object} e.target 触发事件的对象
           * @param {Boolean} e.valid 是否通过验证
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

});/**
 * @fileOverview 表单文本域
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/textfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');

  /**
   * 表单文本域
   * @class BUI.Form.Field.Text
   * @extends BUI.Form.Field
   */
  var textField = Field.extend({

  },{
    xclass : 'form-field-text'
  });

  return textField;
});/**
 * @fileOverview 表单文本域
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/textareafield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');

  /**
   * 表单文本域
   * @class BUI.Form.Field.TextArea
   * @extends BUI.Form.Field
   */
  var TextAreaField = Field.extend({
    //设置行
    _uiSetRows : function(v){
      var _self = this,
        innerControl = _self.getInnerControl();
      if(v){
        innerControl.attr('rows',v);
      }
    },
    //设置列
    _uiSetCols : function(v){
      var _self = this,
        innerControl = _self.getInnerControl();
      if(v){
        innerControl.attr('cols',v);
      }
    }
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<textarea></textarea>'
      },
      /**
       * 行
       * @type {Number}
       */
      rows : {

      },
      /**
       * 列
       * @type {Number}
       */
      cols : {

      },
      decorateCfgFields : {
        value : {
          'rows' : true,
          'cols' : true
        }
      }
    }
  },{
    xclass : 'form-field-textarea'
  });

  return TextAreaField;
});/**
 * @fileOverview 表单文本域
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/numberfield',['bui/form/basefield'],function (require) {

  /**
   * 表单数字域
   * @class BUI.Form.Field.Number
   * @extends BUI.Form.Field
   */
  var Field = require('bui/form/basefield'),
    numberField = Field.extend({

     /**
     * 将字符串等格式转换成数字
     * @protected
     * @param  {String} value 原始数据
     * @return {Number}  该字段指定的类型
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
       * 最大值
       * @type {Number}
       */
      max : {

      },
      /**
       * 最小值
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
       * 表单元素或者控件触发此事件时，触发验证
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
       * 是否允许小数，如果不允许，则最终结果转换成整数
       * @type {Boolean}
       */
      allowDecimals : {
        value : true
      },
      /**
       * 允许小数时的，小数位
       * @type {Number}
       */
      decimalPrecision : {
        value : 2
      },
      /**
       * 对数字进行微调时，每次增加或减小的数字
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
});/**
* @fileOverview 隐藏字段
* @ignore
* @author dxq613@gmail.com
*/

define('bui/form/hiddenfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');
  /**
   * 表单隐藏域
   * @class BUI.Form.Field.Hidden
   * @extends BUI.Form.Field
   */
  var hiddenField = Field.extend({

  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
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

});/**
* @fileOverview 只读字段
* @ignore
* @author dxq613@gmail.com
*/

define('bui/form/readonlyfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');
  /**
   * 表单隐藏域
   * @class BUI.Form.Field.ReadOnly
   * @extends BUI.Form.Field
   */
  var readonlyField = Field.extend({

  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
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

});/**
 * @fileOverview 模拟选择框在表单中
 * @ignore
 */

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
    // var str = '<option value="' + value +'">'+text+'</option>'
    // $(str).appendTo(select);
    
    // 上面那种写法在ie6下会报一个奇怪的错误，使用new Option则不会有这个问题
    var option = new Option(text, value),
      options = select[0].options;
    options[options.length] = option;
  }
  /**
   * 表单选择域
   * @class BUI.Form.Field.Select
   * @extends BUI.Form.Field
   */
  var selectField = Field.extend({
    //生成select
    renderUI : function(){
      var _self = this,
        innerControl = _self.getInnerControl(),
        select = _self.get('select');
      if(_self.get('srcNode') && innerControl.is('select')){ //如果使用现有DOM生成，不使用自定义选择框控件
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
     * 重新设置选项集合
     * @param {Array} items 选项集合
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
     * 设置字段的值
     * @protected
     * @param {*} value 字段值
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
     * 获取选中的文本
     * @return {String} 选中的文本
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
     * 获取tip显示对应的元素
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
    //设置选项
    _uiSetItems : function(v){
      if(v){
        this.setItems(v);
      }
    },
    /**
     * @protected
     * 设置内部元素宽度
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
       * 选项
       * @type {Array}
       */
      items : {

      },
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * 是否显示为空的文本
       * @type {Boolean}
       */
      showBlank : {
        value : true
      },
      /**
       * 选择为空时的文本
       * @type {String}
       */
      emptyText : {
        value : '请选择'
      },
      /**
       * 内部的Select控件的配置项
       * @cfg {Object} select
       */
      /**
       * 内部的Select控件
       * @type {BUI.Select.Select}
       */
      select : {
        shared : false,
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
/**
 * @fileOverview 表单日历域
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/datefield',['bui/common','bui/form/basefield','bui/calendar'],function (require) {

  var BUI = require('bui/common'),
    Field = require('bui/form/basefield'),
    DateUtil = BUI.Date;/*,
    DatePicker = require('bui/calendar').DatePicker*/

  /**
   * 表单文本域
   * @class BUI.Form.Field.Date
   * @extends BUI.Form.Field
   */
  var dateField = Field.extend({
    //生成日期控件
    renderUI : function(){
      
      var _self = this,
        datePicker = _self.get('datePicker');
      if($.isPlainObject(datePicker)){
        _self.initDatePicker(datePicker);
      }
      if((datePicker.get && datePicker.get('showTime'))|| datePicker.showTime){
        _self.getInnerControl().addClass('calendar-time');
      }

    },
    //初始化日历控件
    initDatePicker : function(datePicker){
      var _self = this;

      BUI.use('bui/calendar',function(Calendar){
        datePicker.trigger = _self.getInnerControl();
        datePicker.autoRender = true;
        datePicker = new Calendar.DatePicker(datePicker);
        _self.set('datePicker',datePicker);
        _self.set('isCreatePicker',true);
        _self.get('children').push(datePicker);
      });
    },
    /**
     * 设置字段的值
     * @protected
     * @param {Date} value 字段值
     */
    setControlValue : function(value){
      var _self = this,
        innerControl = _self.getInnerControl();
      if(BUI.isDate(value)){
        value = DateUtil.format(value,_self._getFormatMask());
      }
      innerControl.val(value);
    },
    //获取格式化函数
    _getFormatMask : function(){
      var _self = this,
        datePicker = _self.get('datePicker');

      if(datePicker.showTime || (datePicker.get && datePicker.get('showTime'))){
        return 'yyyy-mm-dd HH:MM:ss';
      }
      return 'yyyy-mm-dd';
    },
     /**
     * 将字符串等格式转换成日期
     * @protected
     * @override
     * @param  {String} value 原始数据
     * @return {Date}  该字段指定的类型
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
     * 是否当前值
     */
    isCurrentValue : function (value) {
      return DateUtil.isEquals(value,this.get('value'));
    },
    //设置最大值
    _uiSetMax : function(v){
      this.addRule('max',v);
      var _self = this,
        datePicker = _self.get('datePicker');
      if(datePicker){
        if(datePicker.set){
          datePicker.set('maxDate',v);
        }else{
          datePicker.maxDate = v;
        }
        
      }
    },
    //设置最小值
    _uiSetMin : function(v){
      this.addRule('min',v);
      var _self = this,
        datePicker = _self.get('datePicker');
      if(datePicker){
        if(datePicker.set){
          datePicker.set('minDate',v);
        }else{
          datePicker.minDate = v;
        }
      }
    }
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
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
       * 最大值
       * @type {Date|String}
       */
      max : {

      },
      /**
       * 最小值
       * @type {Date|String}
       */
      min : {

      },
      value : {
        setter : function(v){
          if(BUI.isNumber(v)){//将数字转换成日期类型
            return new Date(v);
          }
          return v;
        }
      },
      /**
       * 时间选择控件
       * @type {Object|BUI.Calendar.DatePicker}
       */
      datePicker : {
        shared : false,
        value : {
          
        }
      },
      /**
       * 时间选择器是否是由此控件创建
       * @type {Boolean}
       * @readOnly
       */
      isCreatePicker : {
        value : true
      }
    },
    PARSER : {
      datePicker : function(el){
        var _self = this,
          cfg = _self.get('datePicker') || {};
        if(el.hasClass('calendar-time')){
          BUI.mix(cfg,{
            showTime : true
          }) ;
        }
        return cfg;
      }
    }
  },{
    xclass : 'form-field-date'
  });

  return dateField;
});/**
 * @fileOverview  可勾选字段
 * @ignore
 */

define('bui/form/checkfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');

  /**
   * 可选中菜单域
   * @class BUI.Form.Field.Check
   * @extends BUI.Form.Field
   */
  var checkField = Field.extend({
    /**
     * 验证成功后执行的操作
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
    //设置是否勾选
    _setControlChecked : function(checked){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.attr('checked',!!checked);
    },
    //获取是否勾选
    _getControlChecked : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return !!innerControl.attr('checked');
    },
    //覆盖 设置值的方法
    _uiSetValue : function(v){
      this.setControlValue(v);
    },
    //覆盖不设置宽度
    _uiSetWidth : function(v){

    },
    //设置是否勾选
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
       * 触发验证事件，进而引起change事件
       * @override
       * @type {String}
       */
      validEvent : {
        value : 'click'
      },
      /**
       * 是否选中
       * @cfg {String} checked
       */
      /**
       * 是否选中
       * @type {String}
       */
      checked : {
        value : false
      },
      events : {
        value : {
          /**
           * @event
           * 选中事件
           */
          'checked' : false,
          /**
           * @event
           * 取消选中事件
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
});/**
 * @fileOverview  复选框表单域
 * @ignore
 */

define('bui/form/checkboxfield',['bui/form/checkfield'],function (required) {
  
  var CheckField = required('bui/form/checkfield');

   /**
   * 表单复选域
   * @class BUI.Form.Field.Checkbox
   * @extends BUI.Form.Field.Check
   */
  var CheckBoxField = CheckField.extend({

  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="checkbox"/>'
      },
       /**
       * 控件容器，如果为空直接添加在控件容器上
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
});/**
 * @fileOverview  单选框表单域
 * @ignore
 */

define('bui/form/radiofield',['bui/form/checkfield'],function (required) {
  
  var CheckField = required('bui/form/checkfield');

  /**
   * 表单单选域
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
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="radio"/>'
      },
      /**
       * 控件容器，如果为空直接添加在控件容器上
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
});/**
 * @fileOverview 仅仅用于显示文本，不能编辑的字段
 * @ignore
 */

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
   * 表单文本域，不能编辑
   * @class BUI.Form.Field.Plain
   * @extends BUI.Form.Field
   */
  var PlainField = Field.extend({
 
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * 显示文本的模板
       * @type {String}
       */
      textTpl : {
        view : true,
        value : '<span class="x-form-text">{text}</span>'
      },
      /**
       * 将字段的值格式化输出
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
});/**
 * @fileOverview 表单中的列表，每个列表后有个隐藏域用来存储数据
 * @ignore
 */

define('bui/form/listfield',['bui/common','bui/form/basefield','bui/list'],function (require) {
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Field = require('bui/form/basefield');

  function parseItems(items){
    var rst = items;
    if($.isPlainObject(items)){
      rst = [];
      BUI.each(items,function(v,k){
        rst.push({text : v,value : k});
      });
    }
    return rst;
  }

  /**
   * @class BUI.Form.Field.List
   * 表单中的列表
   * @extends BUI.Form.Field
   */
  var List = Field.extend({

    initializer : function(){
      var _self = this;
      //if(!_self.get('srcNode')){
        _self._initList();
      //}
    },
    _getList : function(){
      var _self = this,
        children = _self.get('children');
      return children[0];
    },
    bindUI : function(){
      var _self = this,
        list = _self._getList();
      if(list){
        list.on('selectedchange',function(){
          var value = _self._getListValue(list);
          _self.set('value',value);
        });
      }
    },
    //获取列表值
    _getListValue : function(list){
      var _self = this;
      list = list || _self._getList();
      return list.getSelectionValues().join(',');
    },
    /**
     * 设置字段的值
     * @protected
     * @param {*} value 字段值
     */
    setControlValue : function(value){
      var _self = this,
        innerControl = _self.getInnerControl(),
        list = _self._getList();
      innerControl.val(value);
      if(_self._getListValue(list) !== value && list.getCount()){
        if(list.get('multipleSelect')){
          list.clearSelection();
        }
        list.setSelectionByField(value.split(','));
      }
    },
    //同步数据
    syncUI : function(){
       this.set('list',this._getList());
    },
    //初始化列表
    _initList : function(){
      var _self = this,
        defaultListCfg = _self.get('defaultListCfg'),
        children = _self.get('children'),
        list = _self.get('list') || {};
      if(children[0]){
        return;
      }
      if($.isPlainObject(list)){
        BUI.mix(list,defaultListCfg);
      }
      children.push(list);
    },
    /**
     * 设置选项
     * @param {Array} items 选项记录
     */
    setItems : function(items){
      var _self = this,
        value = _self.get('value'),
        list = _self._getList();
      list.set('items',parseItems(items));
      list.setSelectionByField(value.split(','));
    },
    //设置选项集合
    _uiSetItems : function(v){
      if(v){
        this.setItems(v);
      }
    }
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * @protected
       * 默认的列表配置
       * @type {Object}
       */
      defaultListCfg : {
        value : {
          xclass : 'simple-list'
        }
      },
      /**
       * 选项
       * @type {Array}
       */
      items : {
        setter : function(v){
          if($.isPlainObject(v)){
            var rst = [];
            BUI.each(v,function(v,k){
              rst.push({value : k,text :v});
            });
            v = rst;
          }
          return v;
        }
      },
      /**
       * 列表
       * @type {BUI.List.SimpleList}
       */
      list : {

      }
    },
    PARSER : {
      list : function(el){
        var listEl = el.find('.bui-simple-list');
        if(listEl.length){
          return {
            srcNode : listEl
          };
        }
      }
    }
  },{
    xclass : 'form-field-list'
  });

  return List;
});/**
 * @fileOverview 模拟选择框在表单中
 * @ignore
 */

define('bui/form/uploaderfield',['bui/common','bui/form/basefield','bui/form/rules'],function (require) {

  var BUI = require('bui/common'),
    JSON = BUI.JSON,
    Field = require('bui/form/basefield'),
    Rules = require('bui/form/rules');

  /**
   * 表单上传域
   * @class BUI.Form.Field.Upload
   * @extends BUI.Form.Field
   */
  var uploaderField = Field.extend({
    //生成upload
    renderUI : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      if(_self.get('srcNode') && innerControl.get(0).type === 'file'){ //如果使用现有DOM生成，不使用上传组件
        return;
      }
      _self._initControlValue();
      _self._initUpload();
    },
    _initUpload: function(){
      var _self = this,
        children = _self.get('children'),
        uploader = _self.get('uploader') || {};

      BUI.use('bui/uploader', function(Uploader){
        uploader.render = _self.getControlContainer();
        uploader.autoRender = true;
        uploader = new Uploader.Uploader(uploader);
        _self.set('uploader', uploader);
        _self.set('isCreate',true);
        _self.get('children').push(uploader);

        
        _self._initQueue(uploader.get('queue'));
        
        uploader.on('success', function(ev){
          var result = _self._getUploaderResult();
          _self.setControlValue(result);
        });
        uploader.get('queue').on('itemremoved', function(){
          var result = _self._getUploaderResult();
          _self.setControlValue(result);
        })
      });
    },
    _getUploaderResult: function(){
      var _self = this,
        uploader = _self.get('uploader'),
        queue = uploader.get('queue'),
        items = queue.getItems(),
        result = [];

      BUI.each(items, function(item){
        item.result && result.push(item.result);
      });
      return result;
    },
    setControlValue: function(items){
      var _self = this,
        innerControl = _self.getInnerControl();
      // _self.fire('change');
      innerControl.val(JSON.stringify(items));
    },
    _initControlValue: function(){
      var _self = this,
        textValue = _self.getControlValue(),
        value;
      if(textValue){
        value = BUI.JSON.parse(textValue);
        _self.set('value', value);
      }
    },
    _initQueue: function(queue){
      var _self = this,
        value = _self.get('value'),
        result = [];
      //初始化对列默认成功
      BUI.each(value, function(item){
        var newItem = BUI.cloneObject(item);
        newItem.success = true;
        newItem.result = item;
        result.push(newItem);
      });
      queue && queue.setItems(result);
    }//,
    // valid: function(){
    //   var _self = this,
    //     uploader = _self.get('uploader');
    //   uploaderField.superclass.valid.call(_self);
    //   uploader.valid();
    // }
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      uploader: {
        setter: function(v){
          var disabled = this.get('disabled');
          v && v.isController && v.set('disabled', disabled);
          return v;
        }
      },

      disabled: {
        setter: function(v){
          var _self = this,
            uploader = _self.get('uploader');
          uploader && uploader.isController && uploader.set('disabled', v);
        }
      },
      value:{
        shared : false,
        value: []
      },
      defaultRules: function(){
        uploader: true
      }
    }
  },{
    xclass : 'form-field-uploader'
  });

  
  Rules.add({
    name : 'uploader',  //规则名称
    msg : '上传文件选择有误！',//默认显示的错误信息
    validator : function(value, baseValue, formatMsg, field){ //验证函数，验证值、基准值、格式化后的错误信息
      var uploader = field.get('uploader');
      if(uploader && !uploader.isValid()){
        return formatMsg;
      }
    }
  }); 

  return uploaderField;
});/**
 * @fileOverview 可勾选的列表，模拟多个checkbox
 * @ignore
 */

define('bui/form/checklistfield',['bui/common','bui/form/listfield'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    ListField = require('bui/form/listfield');

  /**
   * @class BUI.Form.Field.CheckList
   * 可勾选的列表，模拟多个checkbox
   * @extends BUI.Form.Field.List
   */
  var CheckList = ListField.extend({

  },{
    ATTRS : {
      /**
       * @protected
       * 默认的列表配置
       * @type {Object}
       */
      defaultListCfg : {
        value : {
          itemTpl : '<li><span class="x-checkbox"></span>{text}</li>',
          multipleSelect : true,
          allowTextSelection : false
        }
      }
    }
  },{
    xclass : 'form-field-checklist'
  });

  return CheckList;

});/**
 * @fileOverview 可勾选的列表，模拟多个radio
 * @ignore
 */

define('bui/form/radiolistfield',['bui/common','bui/form/listfield'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    ListField = require('bui/form/listfield');

  /**
   * @class BUI.Form.Field.RadioList
   * 可勾选的列表，模拟多个radio
   * @extends BUI.Form.Field.List
   */
  var RadioList = ListField.extend({

  },{
    ATTRS : {
      /**
       * @protected
       * 默认的列表配置
       * @type {Object}
       */
      defaultListCfg : {
        value : {
          itemTpl : '<li><span class="x-radio"></span>{text}</li>',
          allowTextSelection : false
        }
      }
    }
  },{
    xclass : 'form-field-radiolist'
  });

  return RadioList;

});/**
 * @fileOverview 表单域的入口文件
 * @ignore
 */
;(function(){
var BASE = 'bui/form/';
define(BASE + 'field',['bui/common',BASE + 'textfield',BASE + 'datefield',BASE + 'selectfield',BASE + 'hiddenfield',
  BASE + 'numberfield',BASE + 'checkfield',BASE + 'radiofield',BASE + 'checkboxfield',BASE + 'plainfield',BASE + 'listfield',BASE + 'uploaderfield',
  BASE + 'checklistfield',BASE + 'radiolistfield', BASE + 'textareafield'],function (require) {
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
    TextArea : require(BASE + 'textareafield'),
    Uploader : require(BASE + 'uploaderfield'),
    CheckList : require(BASE + 'checklistfield'),
    RadioList : require(BASE + 'radiolistfield')
  });

  return Field;
});

})();
/**
 * @fileOverview 表单验证
 * @ignore
 */

define('bui/form/valid',['bui/common','bui/form/rules'],function (require) {

  var BUI = require('bui/common'),
    Rules = require('bui/form/rules');

  /**
   * @class BUI.Form.ValidView
   * @private
   * 对控件内的字段域进行验证的视图
   */
  var ValidView = function(){

  };

  ValidView.prototype = {
    /**
     * 获取错误信息的容器
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
     * 显示错误
     */
    showErrors : function(errors){
      var _self = this,
        errorsContainer = _self.getErrorsContainer(),
        errorTpl = _self.get('errorTpl');     
      _self.clearErrors(); 

      if(!_self.get('showError')){
        return ;
      }
      //如果仅显示第一条错误记录
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
     * 显示一条错误
     * @protected
     * @template
     * @param  {String} msg 错误信息
     */
    showError : function(msg,errorTpl,container){

    },
    /**
     * @protected
     * @template
     * 清除错误
     */
    clearErrors : function(){

    }
  };
  /**
   * 对控件内的字段域进行验证
   * @class  BUI.Form.Valid
   */
  var Valid = function(){

  };

  Valid.ATTRS = {

    /**
     * 控件固有的验证规则，例如，日期字段域，有的date类型的验证
     * @protected
     * @type {Object}
     */
    defaultRules : {
      value : {}
    },
    /**
     * 控件固有的验证出错信息，例如，日期字段域，不是有效日期的验证字段
     * @protected
     * @type {Object}
     */
    defaultMessages : {
      value : {}
    },
    /**
     * 验证规则
     * @type {Object}
     */
    rules : {
      shared : false,
      value : {}
    },
    /**
     * 验证信息集合
     * @type {Object}
     */
    messages : {
      shared : false,
      value : {}
    },
    /**
     * 验证器 验证容器内的表单字段是否通过验证
     * @type {Function}
     */
    validator : {

    },
    /**
     * 存放错误信息容器的选择器，如果未提供则默认显示在控件中
     * @private
     * @type {String}
     */
    errorContainer : {
      view : true
    },
    /**
     * 显示错误信息的模板
     * @type {Object}
     */
    errorTpl : {
      view : true,
      value : '<span class="x-field-error"><span class="x-icon x-icon-mini x-icon-error">!</span><label class="x-field-error-text">{error}</label></span>'
    },
    /**
     * 显示错误
     * @type {Boolean}
     */
    showError : {
      view : true,
      value : true
    },
    /**
     * 是否仅显示一个错误
     * @type {Boolean}
     */
    showOneError: {

    },
    /**
     * 错误信息，这个验证错误不包含子控件的验证错误
     * @type {String}
     */
    error : {

    },
    /**
     * 暂停验证
     * <pre><code>
     *   field.set('pauseValid',true); //可以调用field.clearErrors()
     *   field.set('pauseValid',false); //可以同时调用field.valid()
     * </code></pre>
     * @type {Boolean}
     */
    pauseValid : {
      value : false
    }
  };

  Valid.prototype = {

    __bindUI : function(){
      var _self = this;
      //监听是否禁用
      _self.on('afterDisabledChange',function(ev){
        
          var disabled = ev.newVal;
          if(disabled){
            _self.clearErrors(false,false);
          }else{
            _self.valid();
          }
      });
    },
    /**
     * 是否通过验证
     * @template
     * @return {Boolean} 是否通过验证
     */
    isValid : function(){

    },
    /**
     * 进行验证
     */
    valid : function(){

    },
    /**
     * @protected
     * @template
     * 验证自身的规则和验证器
     */
    validControl : function(){

    },
    //验证规则
    validRules : function(rules,value){
      if(!rules){
        return null;
      }
      if(this.get('pauseValid')){
        return null;
      }
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
    //获取验证错误信息
    _getValidMessages : function(){
      var _self = this,
        defaultMessages = _self.get('defaultMessages'),
        messages = _self.get('messages');
      return BUI.merge(defaultMessages,messages);
    },
    /**
     * @template
     * @protected
     * 控件本身是否通过验证，不考虑子控件
     * @return {String} 验证的错误
     */
    getValidError : function(value){
      var _self = this,
        validator = _self.get('validator'),
        error = null;

      error = _self.validRules(_self.get('defaultRules'),value) || _self.validRules(_self.get('rules'),value);

      if(!error && !this.get('pauseValid')){
        if(_self.parseValue){
          value = _self.parseValue(value);
        }
        error = validator ? validator.call(this,value) : '';
      }

      return error;
    },
    /**
     * 获取验证出错信息，包括自身和子控件的验证错误信息
     * @return {Array} 出错信息
     */
    getErrors : function(){

    },
    /**
     * 显示错误
     * @param {Array} errors 显示错误
     */
    showErrors : function(errors){
      var _self = this,
        errors = errors || _self.getErrors();
      _self.get('view').showErrors(errors);
    },
    /**
     * 清除错误
     * @param {Boolean} reset 清除错误时是否重置
     * @param {Boolean} [deep = true] 是否清理子控件的错误 
     */
    clearErrors : function(reset,deep){
      deep = deep == null ? true : deep;
      var _self = this,
        children = _self.get('children');
      if(deep){
        BUI.each(children,function(item){
          if(item.clearErrors){
            if(item.field){
              item.clearErrors(reset);
            }else{
              item.clearErrors(reset,deep);
            }
          }
        });
      }
      
      _self.set('error',null);
      _self.get('view').clearErrors();
    },
    /**
     * 添加验证规则
     * @param {String} name 规则名称
     * @param {*} [value] 规则进行校验的进行对比的值，如max : 10 
     * @param {String} [message] 出错信息,可以使模板
     * <ol>
     *   <li>如果 value 是单个值，例如最大值 value = 10,那么模板可以写成： '输入值不能大于{0}!'</li>
     *   <li>如果 value 是个复杂对象，数组时，按照索引，对象时按照 key 阻止。如：value= {max:10,min:5} ，则'输入值不能大于{max},不能小于{min}'</li>
     * </ol>
     *         var field = form.getField('name');
     *         field.addRule('required',true);
     *
     *         field.addRule('max',10,'不能大于{0}');
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
     * 添加多个验证规则
     * @param {Object} rules 多个验证规则
     * @param {Object} [messages] 验证规则的出错信息
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
     * 移除指定名称的验证规则
     * @param  {String} name 验证规则名称
     *         var field = form.getField('name');
     *         field.remove('required');   
     */
    removeRule : function(name){
      var _self = this,
        rules = _self.get('rules');
      delete rules[name];
    },
    /**
     * 清理验证规则
     */
    clearRules : function(){
      var _self = this;
      _self.set('rules',{});
    }
  };

  Valid.View = ValidView;
  return Valid;
});/**
 * @fileOverview 表单分组验证
 * @ignore
 */

define('bui/form/groupvalid',['bui/form/valid'],function (require) {
  
  var CLS_ERROR = 'x-form-error',
    Valid = require('bui/form/valid');

   /**
   * @class BUI.Form.GroupValidView
   * @private
   * 表单分组验证视图
   * @extends BUI.Form.ValidView
   */
  function GroupValidView(){

  }

  BUI.augment(GroupValidView,Valid.View,{
    /**
     * 显示一条错误
     * @private
     * @param  {String} msg 错误信息
     */
    showError : function(msg,errorTpl,container){
      var errorMsg = BUI.substitute(errorTpl,{error : msg}),
           el = $(errorMsg);
        el.appendTo(container);
        el.addClass(CLS_ERROR);
    },
    /**
     * 清除错误
     */
    clearErrors : function(){
      var _self = this,
        errorContainer = _self.getErrorsContainer();
      errorContainer.children('.' + CLS_ERROR).remove();
    }
  });

  /**
   * @class BUI.Form.GroupValid
   * 表单分组验证
   * @extends BUI.Form.Valid
   */
  function GroupValid(){

  }

  GroupValid.ATTRS = ATTRS =BUI.merge(true,Valid.ATTRS,{
    events: {
      value : {
        /**
         * @event
         * 验证结果发生改变，从true变成false或者相反
         * @param {Object} ev 事件对象
         * @param {Object} ev.target 触发事件的子控件
         * @param {Boolean} ev.valid 是否通过验证
         */
        validchange : true,
        /**
         * @event
         * 值改变，仅当通过验证时触发
         * @param {Object} ev 事件对象
         * @param {Object} ev.target 触发事件的子控件
         */
        change : true
      }
    }
  });

  BUI.augment(GroupValid,Valid,{
    __bindUI : function(){
      var _self = this,
        validEvent =  'validchange change';

      //当不需要显示子控件错误时，仅需要监听'change'事件即可
      _self.on(validEvent,function(ev){
        var sender = ev.target;
        if(sender != this && _self.get('showError')){

          var valid = sender.isValid();
          //是否所有的子节点都进行过验证
          if(_self._hasAllChildrenValid()){
            valid = valid && _self.isChildrenValid();
            if(valid){
              _self.validControl(_self.getRecord());
              valid = _self.isSelfValid();
            }
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
     * 是否通过验证
     */
    isValid : function(){
      if(this.get('disabled')){ //如果被禁用，则不进行验证，并且认为true
        return true;
      }
      var _self = this,
        isValid = _self.isChildrenValid();
      return isValid && _self.isSelfValid();
    },
    /**
     * 进行验证
     */
    valid : function(){
      var _self = this,
        children = _self.get('children');
      if(_self.get('disabled')){ //禁用时不进行验证
        return;
      }
      BUI.each(children,function(item){
        if(!item.get('disabled')){
          item.valid();
        }
      });
    },
    /**
     * 是否所有的子节点进行过校验,如果子节点
     * @private
     */
    _hasAllChildrenValid : function(){
      var _self = this,
        children = _self.get('children'),
        rst = true;
      BUI.each(children,function(item){
        if(!item.get('disabled') && item.get('hasValid') === false){
          rst = false;
          return false;
        }
      });  
      return rst;
    },
    /**
     * 所有子控件是否通过验证
     * @protected
     * @return {Boolean} 所有子控件是否通过验证
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
     * 验证控件内容
     * @protected
     * @return {Boolean} 是否通过验证
     */
    validControl : function (record) {
      var _self = this,
        error = _self.getValidError(record);
      _self.set('error',error);
    },
    /**
     * 获取验证出错信息，包括自身和子控件的验证错误信息
     * @return {Array} 出错信息
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
      //如果所有子控件通过验证，才显示自己的错误
      if(_self._hasAllChildrenValid() && _self.isChildrenValid()){
        validError = _self.get('error');
        if(validError){
          rst.push(validError);
        }
      }
      
      return rst;
    },  
    //设置错误模板时，覆盖子控件设置的错误模板
    _uiSetErrorTpl : function(v){
      var _self = this,
        children = _self.get('children');

      BUI.each(children,function(item){
        if(!item.get('userConfig')['errorTpl']){ //未定义错误模板时
          item.set('errorTpl',v);
        }
      });
    }
  });

  GroupValid.View = GroupValidView;

  return GroupValid;
});/**
 * @fileOverview 表单字段的容器扩展
 * @ignore
 */
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
   * 获取节点需要封装的子节点
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
   * 表单字段容器的扩展类
   * @class BUI.Form.FieldContainer
   * @extends BUI.Component.Controller
   * @mixins BUI.Form.GroupValid
   */
  var container = BUI.Component.Controller.extend([GroupValid],
    {
      //同步数据
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
          //按照ID查找
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
       * 获取封装的子控件节点
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
       * 根据子节点获取对应的子控件 xclass
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
       * 获取表单编辑的对象
       * @return {Object} 编辑的对象
       */
      getRecord : function(){
        var _self = this,
          rst = {},
          fields = _self.getFields();
        BUI.each(fields,function(field){
          var name = field.get('name'),
            value = _self._getFieldValue(field);

          if(!rst[name]){//没有值，直接赋值
            rst[name] = value;
          }else if(BUI.isArray(rst[name]) && value != null){//已经存在值，并且是数组，加入数组
            rst[name].push(value);
          }else if(value != null){          //否则封装成数组，并加入数组
            var arr = [rst[name]]
            arr.push(value);
            rst[name] = arr; 
          }
        });
        return rst;
      },
      /**
       * 获取表单字段
       * @return {Array} 表单字段
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
       * 根据name 获取表单字段
       * @param  {String} name 字段名
       * @return {BUI.Form.Field}  表单字段或者 null
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
       * 根据索引获取字段的name
       * @param  {Number} index 字段的索引
       * @return {String}   字段名称
       */
      getFieldAt : function (index) {
        return this.getFields()[index];
      },
      /**
       * 根据字段名
       * @param {String} name 字段名
       * @param {*} value 字段值
       */
      setFieldValue : function(name,value){
        var _self = this,
          fields = _self.getFields(name);
          BUI.each(fields,function(field){
            _self._setFieldValue(field,value);
          });
      },
      //设置字段域的值
      _setFieldValue : function(field,value){
        //如果字段不可用，则不能设置值
        if(field.get('disabled')){
          return;
        }
        //如果是可勾选的
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
          field.clearErrors(true);//清理错误
          field.set('value',value);
        }
      },
      /**
       * 获取字段值,不存在字段时返回null,多个同名字段时，checkbox返回一个数组
       * @param  {String} name 字段名
       * @return {*}  字段值
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
      //获取字段域的值
      _getFieldValue : function(field){
        if(!(field instanceof Field.Check) || field.get('checked')){
          return field.get('value');
        }
        return null;
      },
      /**
       * 清除所有表单域的值
       */
      clearFields : function(){
        this.clearErrors(true);
        this.setRecord({})
      },
      /**
       * 设置表单编辑的对象
       * @param {Object} record 编辑的对象
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
       * 更新表单编辑的对象
       * @param  {Object} record 编辑的对象
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
       * 设置控件获取焦点，设置第一个子控件获取焦点
       */
      focus : function(){
        var _self = this,
          fields = _self.getFields(),
          firstField = fields[0];
        if(firstField){
          firstField.focus();
        }
      },
      //禁用控件
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
         * 表单的数据记录，以键值对的形式存在
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
         * 内部元素的验证函数，可以使用2中选择器
         * <ol>
         *   <li>id: 使用以'#'为前缀的选择器，可以查找字段或者分组，添加联合校验</li>
         *   <li>name: 不使用任何前缀，没查找表单字段</li>
         * </ol>
         * @type {Object}
         */
        validators : {
          value : {

          }
        },
        /**
         * 默认的加载控件内容的配置,默认值：
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
  
});/**
 * @fileOverview 表单文本域组，可以包含一个至多个字段
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/group/base',['bui/common','bui/form/fieldcontainer'],function (require) {
  var BUI = require('bui/common'),
    FieldContainer = require('bui/form/fieldcontainer');

  /**
   * @class BUI.Form.Group
   * 表单字段分组
   * @extends BUI.Form.FieldContainer
   */
  var Group = FieldContainer.extend({
    
  },{
    ATTRS : {
      /**
       * 标题
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
});/**
 * @fileOverview 范围的字段组，比如日期范围等
 * @ignore
 */

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
   * 字段范围分组，用于日期范围，数字范围等场景
   * @extends BUI.Form.Group
   */
  var Range = Group.extend({

  },{
    ATTRS : {
      /**
       * 默认的验证函数失败后显示的文本。
       * @type {Object}
       */
      rangeText : {
        value : '开始不能大于结束！'
      },
      /**
       * 是否允许前后相等
       * @type {Boolean}
       */
      allowEqual : {
        value : true
      },
      /**
       * 验证器
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
});/**
 * @fileOverview 选择分组，包含，checkbox,radio
 * @ignore
 */

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
   * 单选，复选分组，只能包含同name的checkbox,radio
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
       * 需要选中的字段,
       * <ol>
       *   <li>如果 range:1，range:2 最少勾选1个，2个。</li>
       *   <li>如果 range :0,可以全部不选中。</li>
       *   <li>如果 range:[1,2],则必须选中1-2个。</li>
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

});/**
 * @fileOverview 选择框分组
 * @ignore
 */

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
   * 级联选择框分组
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
      }
      _self.set('store',store);
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
    //获取store的配置项
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
    //获取字段的索引位置
    _getFieldIndex : function (field) {
      var _self = this,
        fields = _self.getFields();
      return  BUI.Array.indexOf(field,fields);
    }
  },{
    ATTRS : {
      /**
       * 级联选择框的类型,目前仅内置了 'city'一个类型，用于选择省、市、县,
       * 可以自定义添加类型
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
   * 添加一个类型的级联选择框，目前仅内置了 'city'一个类型，用于选择省、市、县
   * @static
   * @param {String} name 类型名称
   * @param {Object} cfg  配置项，详细信息请参看： @see{BUI.Data.TreeStore}
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
});/**
 * @fileOverview 表单文本域组，可以包含一个至多个字段
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/fieldgroup',['bui/common','bui/form/group/base','bui/form/group/range','bui/form/group/check','bui/form/group/select'],function (require) {
  var BUI = require('bui/common'),
    Group = require('bui/form/group/base');

  BUI.mix(Group,{
    Range : require('bui/form/group/range'),
    Check : require('bui/form/group/check'),
    Select : require('bui/form/group/select')
  });
  return Group;
});/**
 * @fileOverview 创建表单
 * @ignore
 */

define('bui/form/form',['bui/common','bui/form/fieldcontainer'],function (require) {
  
  var BUI = require('bui/common'),
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
   * 表单控件,表单相关的类图：
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
        _self._initButtonBar(cfg);
      }
      _self._initSubmitMask();
    },
    _initButtonBar : function(cfg){
      var _self = this;
      BUI.use('bui/toolbar',function(Toolbar){
        buttonBar = new Toolbar.Bar(cfg);
        _self.set('buttonBar',buttonBar);
      });
    },
    bindUI : function(){
      var _self = this,
        formEl = _self.get('el');

      formEl.on('submit',function(ev){
        _self.valid();
        if(!_self.isValid() || _self.onBeforeSubmit() === false){
          ev.preventDefault();
          _self.focusError();
          return;
        }
        if(_self.isValid() && _self.get('submitType') === TYPE_SUBMIT.AJAX){
          ev.preventDefault();
          _self.ajaxSubmit();
        }

      });
    },
    /**
     * 获取按钮栏默认的配置项
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
     * 将焦点定位到第一个错误字段
     */
    focusError : function(){
      var _self = this,
        fields = _self.getFields();
      
      BUI.each(fields,function(field){
        if(field.get('visible') && !field.get('disabled') && !field.isValid()){
          try{
            field.focus();
          }catch(e){
            BUI.log(e);
          }
          
          return false;
        }
      });
    },
    /**
     * 表单提交，如果未通过验证，则阻止提交
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
      }else{
        _self.focusError();
      }
    },
    /**
     * 异步提交表单
     */
    ajaxSubmit : function(options){
      var _self = this,
        method = _self.get('method'),
        action = _self.get('action'),
        callback = _self.get('callback'),
        submitMask = _self.get('submitMask'),
        data = _self.serializeToObject(), //获取表单数据
        success,
        ajaxParams = BUI.merge(true,{ //合并请求参数
          url : action,
          type : method,
          dataType : 'json',
          data : data
        },options);

      if(options && options.success){
        success = options.success;
      }
      ajaxParams.success = function(data){ //封装success方法
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
    //获取提交的屏蔽层
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
     * 序列化表单成对象，所有的键值都是字符串
     * @return {Object} 序列化成对象
     */
    serializeToObject : function(){
      return BUI.FormHelper.serializeToObject(this.get('el')[0]);
    },
    /**
     * serializeToObject 的缩写，所有的键值都是字符串
     * @return {Object} 序列化成对象
     */
    toObject : function(){
      return this.serializeToObject();
    },
    /**
     * 表单提交前
     * @protected
     * @return {Boolean} 是否取消提交
     */
    onBeforeSubmit : function(){
      return this.fire('beforesubmit');
    },
    /**
     * 表单恢复初始值
     */
    reset : function(){
      var _self = this,
        initRecord = _self.get('initRecord');
      _self.setRecord(initRecord);
    },
    /**
     * 重置提示信息，因为在表单隐藏状态下，提示信息定位错误
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
    //设置表单的初始数据
    _uiSetInitRecord : function(v){
      //if(v){
        this.setRecord(v);
      //}
      
    }
  },{
    ATTRS : {
      /**
       * 提交的路径
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
           * 表单提交前触发，如果返回false会阻止表单提交
           */
          beforesubmit : false
        }
      },
      /**
       * 提交的方式
       * @type {String}
       */
      method : {
        view : true,
        value : 'get'
      },
      /**
       * 默认的loader配置
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
       * 异步提交表单时的屏蔽
       * @type {BUI.Mask.LoadMask|Object}
       */
      submitMask : {
        value : {
          msg : '正在提交。。。'
        }
      },
      /**
       * 提交表单的方式
       *
       *  - normal 普通方式，直接提交表单
       *  - ajax 异步提交方式，在submit指定参数
       *  - iframe 使用iframe提交,开发中。。。
       * @cfg {String} [submitType='normal']
       */
      submitType : {
        value : 'normal'
      },
      /**
       * 表单提交前，如果存在错误，是否将焦点定位到第一个错误
       * @type {Object}
       */
      focusError : {
        value : true
      },
      /**
       * 表单提交成功后的回调函数，普通提交方式 submitType = 'normal'，不会调用
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
       * 默认的子控件时文本域
       * @type {String}
       */
      defaultChildClass : {
        value : 'form-field'
      },
      /**
       * 使用的标签，为form
       * @type {String}
       */
      elTagName : {
        value : 'form'
      },
      /**
       * 表单按钮
       * @type {Array}
       */
      buttons : {

      },
      /**
       * 按钮栏
       * @type {BUI.Toolbar.Bar}
       */
      buttonBar : {
        shared : false,
        value : {}
      },
      childContainer : {
        value : '.x-form-fields'
      },
      /**
       * 表单初始化的数据，用于初始化或者表单回滚
       * @type {Object}
       */
      initRecord : {

      },
      /**
       * 表单默认不显示错误，不影响表单分组和表单字段
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
});/**
 * @fileOverview 垂直表单
 * @ignore
 */

define('bui/form/horizontal',['bui/common','bui/form/form'],function (require) {
  var BUI = require('bui/common'),
    Form = require('bui/form/form');

  /**
   * @class BUI.Form.HForm
   * 水平表单，字段水平排列
   * @extends BUI.Form.Form
   * 
   */
  var Horizontal = Form.extend({
    /**
     * 获取按钮栏默认的配置项
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
});/**
 * @fileOverview 表单里的一行元素
 * @ignore
 */

define('bui/form/row',['bui/common','bui/form/fieldcontainer'],function (require) {
  var BUI = require('bui/common'),
    FieldContainer = require('bui/form/fieldcontainer');

  /**
   * @class BUI.Form.Row
   * 表单行
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
});/**
 * @fileOverview 验证规则
 * @ignore
 */

define('bui/form/rule',['bui/common'],function (require) {

  var BUI = require('bui/common');
  /**
   * @class BUI.Form.Rule
   * 验证规则
   * @extends BUI.Base
   */
  var Rule = function (config){
    Rule.superclass.constructor.call(this,config);
  }

  BUI.extend(Rule,BUI.Base);

  Rule.ATTRS = {
    /**
     * 规则名称
     * @type {String}
     */
    name : {

    },
    /**
     * 验证失败信息
     * @type {String}
     */
    msg : {

    },
    /**
     * 验证函数
     * @type {Function}
     */
    validator : {
      value : function(value,baseValue,formatedMsg,control){

      }
    }
  }

  //是否通过验证
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
     * 是否通过验证，该函数可以接收多个参数
     * @param  {*}  [value] 验证的值
     * @param  {*} [baseValue] 跟传入值相比较的值
     * @param {String} [msg] 验证失败后的错误信息，显示的错误中可以显示 baseValue中的信息
     * @param {BUI.Form.Field|BUI.Form.Group} [control] 发生验证的控件
     * @return {String}   通过验证返回 null ,未通过验证返回错误信息
     * 
     *         var msg = '输入数据必须在{0}和{1}之间！',
     *           rangeRule = new Rule({
     *             name : 'range',
     *             msg : msg,
     *             validator :function(value,range,msg){
     *               var min = range[0], //此处我们把range定义为数组，也可以定义为{min:0,max:200},那么在传入校验时跟此处一致即可
     *                 max = range[1];   //在错误信息中，使用用 '输入数据必须在{min}和{max}之间！',验证函数中的字符串已经进行格式化
     *               if(value < min || value > max){
     *                 return false;
     *               }
     *               return true;
     *             }
     *           });
     *         var range = [0,200],
     *           val = 100,
     *           error = rangeRule.valid(val,range);//msg可以在此处重新传入
     *         
     */
    valid : function(value,baseValue,msg,control){
      var _self = this;
      return valid(_self,value,baseValue,msg,control);
    }
  });

  return Rule;


});/**
 * @fileOverview 验证集合
 * @ignore
 */

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
   * 表单验证的验证规则管理器
   */
  var rules = {
    /**
     * 添加验证规则
     * @param {Object|BUI.Form.Rule} rule 验证规则配置项或者验证规则对象
     * @param  {String} name 规则名称
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
     * 删除验证规则
     * @param  {String} name 规则名称
     */
    remove : function(name){
      delete ruleMap[name];
    },
    /**
     * 获取验证规则
     * @param  {String} name 规则名称
     * @return {BUI.Form.Rule}  验证规则
     */
    get : function(name){
      return ruleMap[name];
    },
    /**
     * 验证指定的规则
     * @param  {String} name 规则类型
     * @param  {*} value 验证值
     * @param  {*} [baseValue] 用于验证的基础值
     * @param  {String} [msg] 显示错误的模板
     * @param  {BUI.Form.Field|BUI.Form.Group} [control] 显示错误的模板
     * @return {String} 通过验证返回 null,否则返回错误信息
     */
    valid : function(name,value,baseValue,msg,control){
      var rule = rules.get(name);
      if(rule){
        return rule.valid(value,baseValue,msg,control);
      }
      return null;
    },
    /**
     * 验证指定的规则
     * @param  {String} name 规则类型
     * @param  {*} values 验证值
     * @param  {*} [baseValue] 用于验证的基础值
     * @param  {BUI.Form.Field|BUI.Form.Group} [control] 显示错误的模板
     * @return {Boolean} 是否通过验证
     */
    isValid : function(name,value,baseValue,control){
      return rules.valid(name,value,baseValue,control) == null;
    }
  };
  
  /**
   * 非空验证,会对值去除空格
   * <ol>
   *  <li>name: required</li>
   *  <li>msg: 不能为空！</li>
   *  <li>required: boolean 类型</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var required = rules.add({
    name : 'required',
    msg : '不能为空！',
    validator : function(value,required,formatedMsg){
      if(required !== false && /^\s*$/.test(value)){
        return formatedMsg;
      }
    }
  });

  /**
   * 相等验证
   * <ol>
   *  <li>name: equalTo</li>
   *  <li>msg: 两次输入不一致！</li>
   *  <li>equalTo: 一个字符串，id（#id_name) 或者 name</li>
   * </ol>
   *         {
   *           equalTo : '#password'
   *         }
   *         //或者
   *         {
   *           equalTo : 'password'
   *         } 
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var equalTo = rules.add({
    name : 'equalTo',
    msg : '两次输入不一致！',
    validator : function(value,equalTo,formatedMsg){
      var el = $(equalTo);
      if(el.length){
        equalTo = el.val();
      } 
      return value === equalTo ? undefined : formatedMsg;
    }
  });


  /**
   * 不小于验证
   * <ol>
   *  <li>name: min</li>
   *  <li>msg: 输入值不能小于{0}！</li>
   *  <li>min: 数字，字符串</li>
   * </ol>
   *         {
   *           min : 5
   *         }
   *         //字符串
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var min = rules.add({
    name : 'min',
    msg : '输入值不能小于{0}！',
    validator : function(value,min,formatedMsg){
      if(BUI.isString(value)){
        value = value.replace(/\,/g,'');
      }
      if(value !== '' && toNumber(value) < toNumber(min)){
        return formatedMsg;
      }
    }
  });

  /**
   * 不小于验证,用于数值比较
   * <ol>
   *  <li>name: max</li>
   *  <li>msg: 输入值不能大于{0}！</li>
   *  <li>max: 数字、字符串</li>
   * </ol>
   *         {
   *           max : 100
   *         }
   *         //字符串
   *         {
   *           max : '100'
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var max = rules.add({
    name : 'max',
    msg : '输入值不能大于{0}！',
    validator : function(value,max,formatedMsg){
      if(BUI.isString(value)){
        value = value.replace(/\,/g,'');
      }
      if(value !== '' && toNumber(value) > toNumber(max)){
        return formatedMsg;
      }
    }
  });

  /**
   * 输入长度验证，必须是指定的长度
   * <ol>
   *  <li>name: length</li>
   *  <li>msg: 输入值长度为{0}！</li>
   *  <li>length: 数字</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var length = rules.add({
    name : 'length',
    msg : '输入值长度为{0}！',
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
   * 最短长度验证,会对值去除空格
   * <ol>
   *  <li>name: minlength</li>
   *  <li>msg: 输入值长度不小于{0}！</li>
   *  <li>minlength: 数字</li>
   * </ol>
   *         {
   *           minlength : 5
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var minlength = rules.add({
    name : 'minlength',
    msg : '输入值长度不小于{0}！',
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
   * 最短长度验证,会对值去除空格
   * <ol>
   *  <li>name: maxlength</li>
   *  <li>msg: 输入值长度不大于{0}！</li>
   *  <li>maxlength: 数字</li>
   * </ol>
   *         {
   *           maxlength : 10
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var maxlength = rules.add({
    name : 'maxlength',
    msg : '输入值长度不大于{0}！',
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
   * 正则表达式验证,如果正则表达式为空，则不进行校验
   * <ol>
   *  <li>name: regexp</li>
   *  <li>msg: 输入值不符合{0}！</li>
   *  <li>regexp: 正则表达式</li>
   * </ol> 
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var regexp = rules.add({
    name : 'regexp',
    msg : '输入值不符合{0}！',
    validator : function(value,regexp,formatedMsg){
      if(regexp){
        return regexp.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * 邮箱验证,会对值去除空格，无数据不进行校验
   * <ol>
   *  <li>name: email</li>
   *  <li>msg: 不是有效的邮箱地址！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var email = rules.add({
    name : 'email',
    msg : '不是有效的邮箱地址！',
    validator : function(value,baseValue,formatedMsg){
      value = $.trim(value);
      if(value){
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * 日期验证，会对值去除空格，无数据不进行校验，
   * 如果传入的值不是字符串，而是数字，则认为是有效值
   * <ol>
   *  <li>name: date</li>
   *  <li>msg: 不是有效的日期！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var date = rules.add({
    name : 'date',
    msg : '不是有效的日期！',
    validator : function(value,baseValue,formatedMsg){
      if(BUI.isNumber(value)){ //数字认为是日期
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
   * 不小于验证
   * <ol>
   *  <li>name: minDate</li>
   *  <li>msg: 输入日期不能小于{0}！</li>
   *  <li>minDate: 日期，字符串</li>
   * </ol>
   *         {
   *           minDate : '2001-01-01';
   *         }
   *         //字符串
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var minDate = rules.add({
    name : 'minDate',
    msg : '输入日期不能小于{0}！',
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
   * 不小于验证,用于数值比较
   * <ol>
   *  <li>name: maxDate</li>
   *  <li>msg: 输入值不能大于{0}！</li>
   *  <li>maxDate: 日期、字符串</li>
   * </ol>
   *         {
   *           maxDate : '2001-01-01';
   *         }
   *         //或日期
   *         {
   *           maxDate : new Date('2001-01-01');
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var maxDate = rules.add({
    name : 'maxDate',
    msg : '输入日期不能大于{0}！',
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
   * 手机验证，11位手机数字
   * <ol>
   *  <li>name: mobile</li>
   *  <li>msg: 不是有效的手机号码！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var mobile = rules.add({
    name : 'mobile',
    msg : '不是有效的手机号码！',
    validator : function(value,baseValue,formatedMsg){
      value = $.trim(value);
      if(value){
        return /^\d{11}$/.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * 数字验证，会对值去除空格，无数据不进行校验
   * 允许千分符，例如： 12,000,000的格式
   * <ol>
   *  <li>name: number</li>
   *  <li>msg: 不是有效的数字！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var number = rules.add({
    name : 'number',
    msg : '不是有效的数字！',
    validator : function(value,baseValue,formatedMsg){
      if(BUI.isNumber(value)){
        return;
      }
      value = value.replace(/\,/g,'');
      return !isNaN(value) ? undefined : formatedMsg;
    }
  });

  //测试范围
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
  //测试是否后面的数据大于前面的
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
   * 起始结束日期验证，前面的日期不能大于后面的日期
   * <ol>
   *  <li>name: dateRange</li>
   *  <li>msg: 起始日期不能大于结束日期！</li>
   *  <li>dateRange: 可以使true或者{equals : fasle}，标示是否允许相等</li>
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
    msg : '结束日期不能小于起始日期！',
    validator : rangeValid
  });

  /**
   * 数字范围
   * <ol>
   *  <li>name: numberRange</li>
   *  <li>msg: 起始数字不能大于结束数字！</li>
   *  <li>numberRange: 可以使true或者{equals : fasle}，标示是否允许相等</li>
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
    msg : '结束数字不能小于开始数字！',
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
    //不存在值
    if(!value || !range.length){
      return false;
    }
    var len = !value ? 0 : !BUI.isArray(value) ? 1 : value.length;
    //如果只有一个限定值
    if(range.length == 1){
      var number = range [0];
      if(!number){//range = [0],则不必选
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
   * 勾选的范围
   * <ol>
   *  <li>name: checkRange</li>
   *  <li>msg: 必须选中{0}项！</li>
   *  <li>checkRange: 勾选的项范围</li>
   * </ol>
   *         //至少勾选一项
   *         {
   *           checkRange : 1
   *         }
   *         //只能勾选两项
   *         {
   *           checkRange : [2,2]
   *         }
   *         //可以勾选2-4项
   *         {
   *           checkRange : [2,4
   *           ]
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var checkRange = rules.add({
    name : 'checkRange',
    msg : '必须选中{0}项！',
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
});/**
 * @fileOverview 表单异步请求，异步校验、远程获取数据
 * @ignore
 */

define('bui/form/remote',['bui/common'],function(require) {
  var BUI = require('bui/common');

  /**
   * @class BUI.Form.RemoteView
   * @private
   * 表单异步请求类的视图类
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
     * 获取显示加载状态的容器
     * @protected
     * @template
     * @return {jQuery} 加载状态的容器
     */
    getLoadingContainer : function () {
      // body...
    },
    _setLoading : function () {
      var _self = this,
        loadingEl = _self.get('loadingEl'),
        loadingTpl = _self.get('loadingTpl');
      if(loadingTpl && !loadingEl){
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
   * 表单异步请求，所有需要实现异步校验、异步请求的类可以使用。
   */
  var Remote = function(){

  };

  Remote.ATTRS = {

    /**
     * 默认的异步请求配置项：
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
     * 异步请求延迟的时间，当字段验证通过后，不马上进行异步请求，等待继续输入，
     * 300（默认）毫秒后，发送请求，在这个过程中，继续输入，则取消异步请求。
     * @type {Object}
     */
    remoteDaly : {
      value : 500
    },
    /**
     * @private
     * 缓存验证结果，如果验证过对应的值，则直接返回
     * @type {Object}
     */
    cacheMap : {
      value : {

      }
    },
    /**
     * 加载的模板
     * @type {String}
     */
    loadingTpl : {
      view : true,
      value : '<img src="http://img02.taobaocdn.com/tps/i2/T1NU8nXCVcXXaHNz_X-16-16.gif" alt="loading"/>'
    },
    /**
     * 是否正在等待异步请求结果
     * @type {Boolean}
     */
    isLoading : {
      view : true,
      value : false
    },
    /**
     * 异步请求的配置项，参考jQuery的 ajax配置项，如果为字符串则为 url。
     * 请不要覆盖success属性，如果需要回调则使用 callback 属性
     *
     *        {
     *          remote : {
     *            url : 'test.php',
     *            dataType:'json',//默认为字符串
     *            callback : function(data){
     *              if(data.success){ //data为默认返回的值
     *                return ''  //返回值为空时，验证成功
     *              }else{
     *                return '验证失败，XX错误！' //显示返回的字符串为错误
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
     * 异步请求的函数指针，仅内部使用
     * @private
     * @type {Number}
     */
    remoteHandler : {

    },
    events : {
      value : {
        /**
         * 异步请求结束
         * @event
         * @param {Object} e 事件对象
         * @param {*} e.error 是否验证成功
         */
        remotecomplete : false,
        /**
         * 异步请求开始
         * @event
         * @param {Object} e 事件对象
         * @param {Object} e.data 发送的对象，是一个键值对，可以修改此对象，附加信息
         */
        remotestart : false
      }
    }
  };

  Remote.prototype = {

    __bindUI : function(){
      var _self = this;

      _self.on('valid',function (ev) {
        if(_self.get('remote') && _self.isValid() && !_self.get('pauseValid')){
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
    //开始异步请求
    _startRemote : function(data,value){
      var _self = this,
        remoteHandler = _self.get('remoteHandler'),
        cacheMap = _self.get('cacheMap'),
        remoteDaly = _self.get('remoteDaly');
      if(remoteHandler){
        //如果前面已经发送过异步请求，取消掉
        _self._cancelRemote(remoteHandler);
      }
      if(cacheMap[value] != null){
        _self._validResult(_self._getCallback(),cacheMap[value]);
        return;
      }
      //使用闭包进行异步请求
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
      //确认当前返回的错误是当前请求的结果，防止覆盖后面的请求
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
    //异步请求
    _remoteValid : function(data,remoteHandler,value){
      var _self = this,
        cacheMap = _self.get('cacheMap'),
        options = _self._getOptions(data);
      options.success = function (data) {
        var callback = options.callback,
          error = callback(data);
        cacheMap[value] = data; //缓存异步结果
        _self.onRemoteComplete(error,data,remoteHandler);
      };

      options.error = function (jqXHR, textStatus,errorThrown){
        _self.onRemoteComplete(errorThrown,null,remoteHandler);
      };

      _self.fire('remotestart',{data : data});
      $.ajax(options);
    },
    /**
     * 获取异步请求的键值对
     * @template
     * @protected
     * @return {Object} 远程验证的参数，键值对
     */
    getRemoteParams : function() {

    },
    /**
     * 清楚异步验证的缓存
     */
    clearCache : function(){
      this.set('cacheMap',{});
    },
    //取消异步请求
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