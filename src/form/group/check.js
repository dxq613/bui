/**
 * @fileOverview 选择分组，包含，checkbox,radio
 * @ignore
 */

define('bui/form/group/check',['bui/form/group/base'],function (require) {
  var Group = require('bui/form/group/base');

  function getFieldName (self) {
    var firstField = self.getFieldAt(0);
    if(firstField){
      return firstField.get('name');
    }
    return '';
  }
  /**
   * @class BUI.Form.Group.Check
   * 单选，复选分组，只能包含同name的checkbox,radio
   * @extends BUI.Form.Group
   */
  var Check = Group.extend({
    bindUI : function(){
      var _self = this;
      _self.on('change',function(ev){
        var name = getFieldName(_self),
          range = _self.get('range'),
          record = _self.getRecord(),
          value = record[name],
          max = range[1];
        if(value && value.length >= max){
          _self._setFieldsEnable(name,false);
        }else{
          _self._setFieldsEnable(name,true);
        }
      });
    },
    _setFieldsEnable : function(name,enable){

      var _self = this,
        fields = _self.getFields(name);
      BUI.each(fields,function(field){
        if(enable){
          field.enable();
        }else{
          if(!field.get('checked')){
            field.disable();
          }
        }
      });
    },
    _uiSetRange : function(v){
      this.addRule('checkRange',v);
    }

  },{
    ATTRS : {
      /**
       * 需要选中的字段,
       * <ol>
       *   <li>如果 range:1，range:2 最少勾选1个，2个。</li>
       *   <li>如果 range :0,可以全部不选中。</li>
       *   <li>如果 range:[1,2],则必须选中1-2个。</li>
       * </ol>
       * @type {Array|Number}
       */
      range : {
        setter : function (v) {
          if(BUI.isString(v) || BUI.isNumber(v)){
            v = [parseInt(v,10)];
          }
          return v;
        }
      }
    }
  },{
    xclass : 'form-group-check'
  });

  return Check;

});