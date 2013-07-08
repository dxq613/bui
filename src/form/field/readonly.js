/**
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

});