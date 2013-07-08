/**
 * @fileOverview 表单里的一行元素
 * @ignore
 */

define('bui/form/row',['bui/common','bui/form/fieldcontainer'],function (require) {
  var BUI = require('bui/common'),
    FieldContainer = require('bui/form/fieldcontainer');

  /**
   * @class BUI.Form.Row
   * 表单行
   * @extends BUI.Form.FieldContainer
   */
  var Row = FieldContainer.extend({

  },{
    ATTRS : {
      elCls : {
        value : 'row'
      },
      defaultChildCfg:{
        value : {
          tpl : ' <label class="control-label">{label}</label>\
                <div class="controls">\
                </div>',
          childContainer : '.controls',
          showOneError : true,
          controlContainer : '.controls',
          elCls : 'control-group span8',
          errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>'
        }
        
      },
      defaultChildClass : {
        value : 'form-field-text'
      }
    }
  },{
    xclass:'form-row'
  });

  return Row;
});