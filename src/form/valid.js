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
});