/**
 * @fileOverview 编辑器扩展类，引入这个扩展，控件可以支持编辑器功能。
 * @ignore
 */

define('bui/editor/mixin',function (require) {

  function initEditor (self) {
   var _self = self,
      controlCfgField = _self.get('controlCfgField'),
      control = _self.get(controlCfgField),
      c = _self.addChild(control);
    _self.setInternal(controlCfgField,c);
  }

  /**
   * @class BUI.Editor.Mixin
   * 编辑器扩展类
   */
  var Mixin = function () {
    initEditor(this);
  };

  Mixin.ATTRS = {
    /**
     * 接受更改的事件
     * @protected
     * @type {String}
     */
    acceptEvent : {
      value : 'autohide'
    },
    /**
     * 当发生错误时是否阻止编辑器消失
     * @type {Boolean}
     */
    preventHide : {
      value : true
    },
    /**
     * 重置数据时的事件
     * @type {String}
     */
    changeSourceEvent : {
      value : 'show triggerchange'
    },
    /**
     * 是否忽略掉输入框之类的键盘事件
     * @protected
     * @type {Boolean}
     */
    ignoreInputFields: {
      value :false
    },
    /**
     * 内部控件的代表Value的字段
     * @protected
     * @type {String}
     */
    innerValueField : {

    },
    /**
     * 空值的数据，清空编辑器时使用
     * @protected
     * @type {*}
     */
    emptyValue : {

    },
    /**
     * 内部控件配置项的字段
     * @protected
     * @type {String}
     */
    controlCfgField : {

    },
    focusable : {
      value : true
    },
    autoUpdate : {
      value : true
    },
    events : {
      value : {
        /**
         * @event
         * 接受更改
         */
        accept : false,
        /**
         * @event
         * 取消更改
         */
        cancel : false
      }
    }
  };

  Mixin.prototype = {
    //绑定事件
    __bindUI : function(){
      var _self = this,
      acceptEvent = _self.get('acceptEvent'),
      changeSourceEvent = _self.get('changeSourceEvent');

      if(acceptEvent){
        _self.on(acceptEvent,function(){
          if(_self.accept()){
            return ;
          }else if(_self.get('preventHide')){
            return false;
          }else{
            _self.cancel();
          }
        });
      }
      if(changeSourceEvent){
        _self.on(changeSourceEvent,function(){
          _self.setValue(_self.getSourceValue());
          if(_self.get('visible')){
            _self.focus();
          }
        });
      }
    },
    /**
     * @protected
     * 获取编辑器的内部控件
     * @return {BUI.Component.Controller} 用于编辑数据的内部数据
     */
    getInnerControl : function(){
      var _self = this,
        children = _self.get('children');
      return children[0];
    },
    /**
     * 设置值，值的类型取决于编辑器编辑的数据
     * @param {String|Object} value 编辑器显示的值
     * @param {Boolean} [hideError=false] 设置值时是否隐藏错误
     */
    setValue : function(value,hideError){
      var _self = this,
        innerControl = _self.getInnerControl();
      _self.set('editValue',value);
      _self.clearControlValue();
      innerControl.set(_self.get('innerValueField'),value);
      if(!value){//编辑的值等于空，则可能不会触发验证
        _self.valid();
      }
      if(hideError){
        _self.clearErrors();
      }
    },
    /**
     * 获取编辑器的值
     * @return {String|Object} 编辑器的值
     */
    getValue :function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.get(_self.get('innerValueField'));
    },
    /**
     * 编辑的内容是否通过验证
     * @return {Boolean} 是否通过验证
     */
    isValid : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.isValid ? innerControl.isValid() : true;
    },
    /**
     * 验证内容是否通过验证
     */
    valid : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.valid && innerControl.valid();
    },
    /**
     * 获取错误信息
     * @return {Array} 错误信息
     */
    getErrors : function(){
       var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.getErrors ? innerControl.getErrors() : [];
    },
    /**
     * 编辑的内容是否发生改变
     * @return {Boolean}
     */
    isChange : function(){
      var _self = this,
        editValue = _self.get('editValue'),
        value = _self.getValue();
      return editValue !== value;
    },
    /**
     * 清除编辑的值
     */
    clearValue : function(){
      this.clearControlValue();
      this.clearErrors();
    },
    /**
     * 清除编辑的控件的值
     * @protected
     * @template
     */
    clearControlValue : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.set(_self.get('innerValueField'),_self.get('emptyValue'));
    },
    /**
     * 清除错误
     */
    clearErrors : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.clearErrors();
    },
    /**
     * @protected
     * @template
     * 获取编辑的源数据
     */
    getSourceValue : function(){

    },
    /**
     * @protected
     * @template
     * 更新编辑的源数据
     */
    updateSource : function(){

    },
    /**
     * @protected
     * @override
     * 处理esc键
     */
    handleNavEsc : function(){
      this.cancel();
    },
    /**
     * @protected
     * @override
     * 处理enter键
     */
    handleNavEnter : function(ev){
      var sender = ev.target;
      if(sender.tagName === 'TEXTAREA'){ //文本输入框，不确定隐藏
        return;
      }
      if(sender.tagName === 'BUTTON'){
        $(sender).trigger('click');
      }
      this.accept();
    },
    /**
     * 设置获取焦点
     */
    focus : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.focus && innerControl.focus()
    },
    /**
     * 接受编辑器的编辑结果
     * @return {Boolean} 是否成功接受编辑
     */
    accept : function(){
      var _self = this,
        value;
      _self.valid();
      if(!_self.isValid()){
        return false;
      }
      value = _self.getValue();

      if(_self.get('autoUpdate')){
        _self.updateSource(value);
      }
      if(_self.fire('beforeaccept',{value :value}) == false){
        return;
      }
      _self.fire('accept',{value :value,editValue : _self.get('editValue')});/**/
      _self.hide();
      return true;
    },
    /**
     * 取消编辑
     */
    cancel : function(){
      this.fire('cancel');
      this.clearValue();
      this.close();
    }
  };

  return Mixin;
});