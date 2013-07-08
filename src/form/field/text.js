/**
 * @fileOverview 表单文本域
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/form/textfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');

  /**
   * 表单文本域
   * @class BUI.Form.Field.Text
   * @extends BUI.Form.Field
   */
  var textField = Field.extend({

  },{
    xclass : 'form-field-text'
  });

  return textField;
});