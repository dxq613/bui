/**
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
});