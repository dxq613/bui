/**
 * @fileOverview  复选框表单域
 * @ignore
 */

define('bui/form/checkboxfield',['bui/form/checkfield'],function (required) {
  
  var CheckField = required('bui/form/checkfield');

   /**
   * 表单复选域
   * @class BUI.Form.Field.Checkbox
   * @extends BUI.Form.Field.Check
   */
  var CheckBoxField = CheckField.extend({

  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="checkbox"/>'
      },
       /**
       * 控件容器，如果为空直接添加在控件容器上
       * @type {String|HTMLElement}
       */
      controlContainer : {
        value : '.checkbox'
      },
      tpl : {
        value : '<label><span class="checkbox"></span>{label}</label>'
      }
    }
  },{
    xclass : 'form-field-checkbox'
  });

  return CheckBoxField;
});