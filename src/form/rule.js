/**
 * @fileOverview 验证规则
 * @ignore
 */

define('bui/form/rule',['bui/common'],function (require) {

  var BUI = require('bui/common');
  /**
   * @class BUI.Form.Rule
   * 验证规则
   * @extends BUI.Base
   */
  var Rule = function (config){
    Rule.superclass.constructor.call(this,config);
  }

  BUI.extend(Rule,BUI.Base);

  Rule.ATTRS = {
    /**
     * 规则名称
     * @type {String}
     */
    name : {

    },
    /**
     * 验证失败信息
     * @type {String}
     */
    msg : {

    },
    /**
     * 验证函数
     * @type {Function}
     */
    validator : {
      value : function(value,baseValue,formatedMsg,control){

      }
    }
  }

  //是否通过验证
  function valid(self,value,baseValue,msg,control){
    if(BUI.isArray(baseValue) && BUI.isString(baseValue[1])){
      if(baseValue[1]){
        msg = baseValue[1];
      }
      baseValue = baseValue[0];
    }
    var _self = self,
      validator = _self.get('validator'),
      formatedMsg = formatError(self,baseValue,msg),
      valid = true;
    value = value == null ? '' : value;
    return validator.call(_self,value,baseValue,formatedMsg,control);
  }

  function parseParams(values){

    if(values == null){
      return {};
    }

    if($.isPlainObject(values)){
      return values;
    }

    var ars = values,
        rst = {};
    if(BUI.isArray(values)){

      for(var i = 0; i < ars.length; i++){
        rst[i] = ars[i];
      }
      return rst;
    }

    return {'0' : values};
  }

  function formatError(self,values,msg){
    var ars = parseParams(values); 
    msg = msg || self.get('msg');
    return BUI.substitute(msg,ars);
  }

  BUI.augment(Rule,{

    /**
     * 是否通过验证，该函数可以接收多个参数
     * @param  {*}  [value] 验证的值
     * @param  {*} [baseValue] 跟传入值相比较的值
     * @param {String} [msg] 验证失败后的错误信息，显示的错误中可以显示 baseValue中的信息
     * @param {BUI.Form.Field|BUI.Form.Group} [control] 发生验证的控件
     * @return {String}   通过验证返回 null ,未通过验证返回错误信息
     * 
     *         var msg = '输入数据必须在{0}和{1}之间！',
     *           rangeRule = new Rule({
     *             name : 'range',
     *             msg : msg,
     *             validator :function(value,range,msg){
     *               var min = range[0], //此处我们把range定义为数组，也可以定义为{min:0,max:200},那么在传入校验时跟此处一致即可
     *                 max = range[1];   //在错误信息中，使用用 '输入数据必须在{min}和{max}之间！',验证函数中的字符串已经进行格式化
     *               if(value < min || value > max){
     *                 return false;
     *               }
     *               return true;
     *             }
     *           });
     *         var range = [0,200],
     *           val = 100,
     *           error = rangeRule.valid(val,range);//msg可以在此处重新传入
     *         
     */
    valid : function(value,baseValue,msg,control){
      var _self = this;
      return valid(_self,value,baseValue,msg,control);
    }
  });

  return Rule;


});