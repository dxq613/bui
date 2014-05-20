/**
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

});