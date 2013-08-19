/**
 * @fileOverview 仅仅用于显示文本，不能编辑的字段
 * @ignore
 */

define('bui/form/plainfield',['bui/form/basefield'],function (require) {
  var Field = require('bui/form/basefield');


  var PlainFieldView = Field.View.extend({

    _uiSetValue : function(v){
      var _self = this,
        textEl = _self.get('textEl'),
        container = _self.getControlContainer(),
        renderer = _self.get('renderer'), 
        text = renderer ? renderer(v) : v,
        width = _self.get('width'),
        appendWidth = 0,
        textTpl;
      if(textEl){
        
        textEl.remove();
      }
      text = text || '&nbsp;';
      textTpl = BUI.substitute(_self.get('textTpl'),{text : text});
      textEl = $(textTpl).appendTo(container);
      appendWidth = textEl.outerWidth() - textEl.width();
      textEl.width(width - appendWidth);
      _self.set('textEl',textEl);
    }

  },{
    ATTRS : {
      textEl : {},
      value : {}
    }
  },{
    xclass : 'form-field-plain-view'
  });

  /**
   * 表单文本域，不能编辑
   * @class BUI.Form.Field.Plain
   * @extends BUI.Form.Field
   */
  var PlainField = Field.extend({
 
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * 显示文本的模板
       * @type {String}
       */
      textTpl : {
        view : true,
        value : '<span class="x-form-text">{text}</span>'
      },
      /**
       * 将字段的值格式化输出
       * @type {Function}
       */
      renderer : {
        view : true,
        value : function(value){
          return value;
        }
      },
      tpl : {
        value : ''
      },
      xview : {
        value : PlainFieldView
      }
    }
  },{
    xclass : 'form-field-plain'
  });

  return PlainField;
});