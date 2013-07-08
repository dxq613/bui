/**
 * @fileOverview 表单日历域
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/datefield',['bui/common','bui/form/basefield','bui/calendar'],function (require) {

  var BUI = require('bui/common'),
    Field = require('bui/form/basefield'),
    DateUtil = BUI.Date,
    DatePicker = require('bui/calendar').DatePicker;

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
      datePicker.on('selectedchange',function(ev){
        var curTrigger = ev.curTrigger;
        if(curTrigger[0] == _self.getInnerControl()[0]){
          _self.set('value',ev.value);
        }
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

      if(datePicker.get('showTime')){
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
      if(datePicker && datePicker.set){
        datePicker.set('maxDate',v);
      }
    },
    //设置最小值
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