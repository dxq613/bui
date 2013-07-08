/**
 * @fileOverview  单选框表单域
 * @ignore
 */

define('bui/form/radiofield',['bui/form/checkfield'],function (required) {
  
  var CheckField = required('bui/form/checkfield');

  /**
   * 表单单选域
   * @class BUI.Form.Field.Radio
   * @extends BUI.Form.Field.Check
   */
  var RadioField = CheckField.extend({
    bindUI : function(){
      var _self = this,
        parent = _self.get('parent'),
        name = _self.get('name');

      if(parent){
        _self.getInnerControl().on('click',function(ev){
          var fields = parent.getFields(name);
          BUI.each(fields,function(field){
            if(field != _self){
              field.set('checked',false);
            }
          });
        });
      }
    }
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        view : true,
        value : '<input type="radio"/>'
      },
      /**
       * 控件容器，如果为空直接添加在控件容器上
       * @type {String|HTMLElement}
       */
      controlContainer : {
        value : '.radio'
      },
      tpl : {
        value : '<label><span class="radio"></span>{label}</label>'
      }
    }
  },{
    xclass : 'form-field-radio'
  });

  return RadioField;
});