/**
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
});