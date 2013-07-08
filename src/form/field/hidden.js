/**
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

});