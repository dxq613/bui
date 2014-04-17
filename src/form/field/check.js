/**
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
});