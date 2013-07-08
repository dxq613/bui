/**
 * @fileOverview 范围的字段组，比如日期范围等
 * @ignore
 */

define('bui/form/group/range',['bui/form/group/base'],function (require) {
  var Group = require('bui/form/group/base');

  function testRange (self,curVal,prevVal) {
    var allowEqual = self.get('allowEqual');

    if(allowEqual){
      return prevVal <= curVal;
    }

    return prevVal < curVal;
  }
  /**
   * @class BUI.Form.Group.Range
   * 字段范围分组，用于日期范围，数字范围等场景
   * @extends BUI.Form.Group
   */
  var Range = Group.extend({

  },{
    ATTRS : {
      /**
       * 默认的验证函数失败后显示的文本。
       * @type {Object}
       */
      rangeText : {
        value : '开始不能大于结束！'
      },
      /**
       * 是否允许前后相等
       * @type {Boolean}
       */
      allowEqual : {
        value : true
      },
      /**
       * 验证器
       * @override
       * @type {Function}
       */
      validator : {
        value : function (record) {
          var _self = this,
            fields = _self.getFields(),
            valid = true;
          for(var i = 1; i < fields.length ; i ++){
            var cur = fields[i],
              prev = fields[i-1],
              curVal,
              prevVal;
            if(cur && prev){
              curVal = cur.get('value');
              prevVal = prev.get('value');
              if(!testRange(_self,curVal,prevVal)){
                valid = false;
                break;
              }
            }
          }
          if(!valid){
            return _self.get('rangeText');
          }
          return null;
        }
      }
    }
  },{
    xclass : 'form-group-range'
  });

  return Range;
});