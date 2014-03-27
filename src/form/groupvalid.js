/**
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
});