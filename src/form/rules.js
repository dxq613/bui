/**
 * @fileOverview 验证集合
 * @ignore
 */

define('bui/form/rules',['bui/form/rule'],function (require) {

  var Rule = require('bui/form/rule');

  function toNumber(value){
    return parseFloat(value);
  }

  function toDate(value){
    return BUI.Date.parse(value);
  }

  var ruleMap = {

  };

  /**
   * @class BUI.Form.Rules
   * @singleton
   * 表单验证的验证规则管理器
   */
  var rules = {
    /**
     * 添加验证规则
     * @param {Object|BUI.Form.Rule} rule 验证规则配置项或者验证规则对象
     * @param  {String} name 规则名称
     */
    add : function(rule){
      var name;
      if($.isPlainObject(rule)){
        name = rule.name;
        ruleMap[name] = new Rule(rule);        
      }else if(rule.get){
        name = rule.get('name'); 
        ruleMap[name] = rule;
      }
      return ruleMap[name];
    },
    /**
     * 删除验证规则
     * @param  {String} name 规则名称
     */
    remove : function(name){
      delete ruleMap[name];
    },
    /**
     * 获取验证规则
     * @param  {String} name 规则名称
     * @return {BUI.Form.Rule}  验证规则
     */
    get : function(name){
      return ruleMap[name];
    },
    /**
     * 验证指定的规则
     * @param  {String} name 规则类型
     * @param  {*} value 验证值
     * @param  {*} [baseValue] 用于验证的基础值
     * @param  {String} [msg] 显示错误的模板
     * @param  {BUI.Form.Field|BUI.Form.Group} [control] 显示错误的模板
     * @return {String} 通过验证返回 null,否则返回错误信息
     */
    valid : function(name,value,baseValue,msg,control){
      var rule = rules.get(name);
      if(rule){
        return rule.valid(value,baseValue,msg,control);
      }
      return null;
    },
    /**
     * 验证指定的规则
     * @param  {String} name 规则类型
     * @param  {*} values 验证值
     * @param  {*} [baseValue] 用于验证的基础值
     * @param  {BUI.Form.Field|BUI.Form.Group} [control] 显示错误的模板
     * @return {Boolean} 是否通过验证
     */
    isValid : function(name,value,baseValue,control){
      return rules.valid(name,value,baseValue,control) == null;
    }
  };
  
  /**
   * 非空验证,会对值去除空格
   * <ol>
   *  <li>name: required</li>
   *  <li>msg: 不能为空！</li>
   *  <li>required: boolean 类型</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var required = rules.add({
    name : 'required',
    msg : '不能为空！',
    validator : function(value,required,formatedMsg){
      if(required !== false && /^\s*$/.test(value)){
        return formatedMsg;
      }
    }
  });

  /**
   * 相等验证
   * <ol>
   *  <li>name: equalTo</li>
   *  <li>msg: 两次输入不一致！</li>
   *  <li>equalTo: 一个字符串，id（#id_name) 或者 name</li>
   * </ol>
   *         {
   *           equalTo : '#password'
   *         }
   *         //或者
   *         {
   *           equalTo : 'password'
   *         } 
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var equalTo = rules.add({
    name : 'equalTo',
    msg : '两次输入不一致！',
    validator : function(value,equalTo,formatedMsg){
      var el = $(equalTo);
      if(el.length){
        equalTo = el.val();
      } 
      return value === equalTo ? undefined : formatedMsg;
    }
  });


  /**
   * 不小于验证
   * <ol>
   *  <li>name: min</li>
   *  <li>msg: 输入值不能小于{0}！</li>
   *  <li>min: 数字，字符串</li>
   * </ol>
   *         {
   *           min : 5
   *         }
   *         //字符串
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var min = rules.add({
    name : 'min',
    msg : '输入值不能小于{0}！',
    validator : function(value,min,formatedMsg){
      if(BUI.isString(value)){
        value = value.replace(/\,/g,'');
      }
      if(value !== '' && toNumber(value) < toNumber(min)){
        return formatedMsg;
      }
    }
  });

  /**
   * 不小于验证,用于数值比较
   * <ol>
   *  <li>name: max</li>
   *  <li>msg: 输入值不能大于{0}！</li>
   *  <li>max: 数字、字符串</li>
   * </ol>
   *         {
   *           max : 100
   *         }
   *         //字符串
   *         {
   *           max : '100'
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var max = rules.add({
    name : 'max',
    msg : '输入值不能大于{0}！',
    validator : function(value,max,formatedMsg){
      if(BUI.isString(value)){
        value = value.replace(/\,/g,'');
      }
      if(value !== '' && toNumber(value) > toNumber(max)){
        return formatedMsg;
      }
    }
  });

  /**
   * 输入长度验证，必须是指定的长度
   * <ol>
   *  <li>name: length</li>
   *  <li>msg: 输入值长度为{0}！</li>
   *  <li>length: 数字</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var length = rules.add({
    name : 'length',
    msg : '输入值长度为{0}！',
    validator : function(value,len,formatedMsg){
      if(value != null){
        value = $.trim(value.toString());
        if(len != value.length){
          return formatedMsg;
        }
      }
    }
  });
  /**
   * 最短长度验证,会对值去除空格
   * <ol>
   *  <li>name: minlength</li>
   *  <li>msg: 输入值长度不小于{0}！</li>
   *  <li>minlength: 数字</li>
   * </ol>
   *         {
   *           minlength : 5
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var minlength = rules.add({
    name : 'minlength',
    msg : '输入值长度不小于{0}！',
    validator : function(value,min,formatedMsg){
      if(value != null){
        value = $.trim(value.toString());
        var len = value.length;
        if(len < min){
          return formatedMsg;
        }
      }
    }
  });

  /**
   * 最短长度验证,会对值去除空格
   * <ol>
   *  <li>name: maxlength</li>
   *  <li>msg: 输入值长度不大于{0}！</li>
   *  <li>maxlength: 数字</li>
   * </ol>
   *         {
   *           maxlength : 10
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var maxlength = rules.add({
    name : 'maxlength',
    msg : '输入值长度不大于{0}！',
    validator : function(value,max,formatedMsg){
      if(value){
        value = $.trim(value.toString());
        var len = value.length;
        if(len > max){
          return formatedMsg;
        }
      }
    }
  });

  /**
   * 正则表达式验证,如果正则表达式为空，则不进行校验
   * <ol>
   *  <li>name: regexp</li>
   *  <li>msg: 输入值不符合{0}！</li>
   *  <li>regexp: 正则表达式</li>
   * </ol> 
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var regexp = rules.add({
    name : 'regexp',
    msg : '输入值不符合{0}！',
    validator : function(value,regexp,formatedMsg){
      if(regexp){
        return regexp.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * 邮箱验证,会对值去除空格，无数据不进行校验
   * <ol>
   *  <li>name: email</li>
   *  <li>msg: 不是有效的邮箱地址！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var email = rules.add({
    name : 'email',
    msg : '不是有效的邮箱地址！',
    validator : function(value,baseValue,formatedMsg){
      value = $.trim(value);
      if(value){
        return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * 日期验证，会对值去除空格，无数据不进行校验，
   * 如果传入的值不是字符串，而是数字，则认为是有效值
   * <ol>
   *  <li>name: date</li>
   *  <li>msg: 不是有效的日期！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var date = rules.add({
    name : 'date',
    msg : '不是有效的日期！',
    validator : function(value,baseValue,formatedMsg){
      if(BUI.isNumber(value)){ //数字认为是日期
        return;
      }
      if(BUI.isDate(value)){
        return;
      }
      value = $.trim(value);
      if(value){
        return BUI.Date.isDateString(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * 不小于验证
   * <ol>
   *  <li>name: minDate</li>
   *  <li>msg: 输入日期不能小于{0}！</li>
   *  <li>minDate: 日期，字符串</li>
   * </ol>
   *         {
   *           minDate : '2001-01-01';
   *         }
   *         //字符串
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var minDate = rules.add({
    name : 'minDate',
    msg : '输入日期不能小于{0}！',
    validator : function(value,minDate,formatedMsg){
      if(value){
        var date = toDate(value);
        if(date && date < toDate(minDate)){
           return formatedMsg;
        }
      }
    }
  });

  /**
   * 不小于验证,用于数值比较
   * <ol>
   *  <li>name: maxDate</li>
   *  <li>msg: 输入值不能大于{0}！</li>
   *  <li>maxDate: 日期、字符串</li>
   * </ol>
   *         {
   *           maxDate : '2001-01-01';
   *         }
   *         //或日期
   *         {
   *           maxDate : new Date('2001-01-01');
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var maxDate = rules.add({
    name : 'maxDate',
    msg : '输入日期不能大于{0}！',
    validator : function(value,maxDate,formatedMsg){
      if(value){
        var date = toDate(value);
        if(date && date > toDate(maxDate)){
           return formatedMsg;
        }
      }
    }
  });

  /**
   * 手机验证，11位手机数字
   * <ol>
   *  <li>name: mobile</li>
   *  <li>msg: 不是有效的手机号码！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var mobile = rules.add({
    name : 'mobile',
    msg : '不是有效的手机号码！',
    validator : function(value,baseValue,formatedMsg){
      value = $.trim(value);
      if(value){
        return /^\d{11}$/.test(value) ? undefined : formatedMsg;
      }
    }
  });

  /**
   * 数字验证，会对值去除空格，无数据不进行校验
   * 允许千分符，例如： 12,000,000的格式
   * <ol>
   *  <li>name: number</li>
   *  <li>msg: 不是有效的数字！</li>
   * </ol>
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}
   */
  var number = rules.add({
    name : 'number',
    msg : '不是有效的数字！',
    validator : function(value,baseValue,formatedMsg){
      if(BUI.isNumber(value)){
        return;
      }
      value = value.replace(/\,/g,'');
      return !isNaN(value) ? undefined : formatedMsg;
    }
  });

  //测试范围
  function testRange (baseValue,curVal,prevVal) {
    var allowEqual = baseValue && (baseValue.equals !== false);

    if(allowEqual){
      return prevVal <= curVal;
    }

    return prevVal < curVal;
  }
  function isEmpty(value){
    return value == '' || value == null;
  }
  //测试是否后面的数据大于前面的
  function rangeValid(value,baseValue,formatedMsg,group){
    var fields = group.getFields(),
      valid = true;
    for(var i = 1; i < fields.length ; i ++){
      var cur = fields[i],
        prev = fields[i-1],
        curVal,
        prevVal;
      if(cur && prev){
        curVal = cur.get('value');
        prevVal = prev.get('value');
        if(!isEmpty(curVal) && !isEmpty(prevVal) && !testRange(baseValue,curVal,prevVal)){
          valid = false;
          break;
        }
      }
    }
    if(!valid){
      return formatedMsg;
    }
    return null;
  }
  /**
   * 起始结束日期验证，前面的日期不能大于后面的日期
   * <ol>
   *  <li>name: dateRange</li>
   *  <li>msg: 起始日期不能大于结束日期！</li>
   *  <li>dateRange: 可以使true或者{equals : fasle}，标示是否允许相等</li>
   * </ol>
   *         {
   *           dateRange : true
   *         }
   *         {
   *           dateRange : {equals : false}
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var dateRange = rules.add({
    name : 'dateRange',
    msg : '结束日期不能小于起始日期！',
    validator : rangeValid
  });

  /**
   * 数字范围
   * <ol>
   *  <li>name: numberRange</li>
   *  <li>msg: 起始数字不能大于结束数字！</li>
   *  <li>numberRange: 可以使true或者{equals : fasle}，标示是否允许相等</li>
   * </ol>
   *         {
   *           numberRange : true
   *         }
   *         {
   *           numberRange : {equals : false}
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var numberRange = rules.add({
    name : 'numberRange',
    msg : '结束数字不能小于开始数字！',
    validator : rangeValid
  });

  function getFieldName (self) {
    var firstField = self.getFieldAt(0);
    if(firstField){
      return firstField.get('name');
    }
    return '';
  }

  function testCheckRange(value,range){
    if(!BUI.isArray(range)){
      range = [range];
    }
    //不存在值
    if(!value || !range.length){
      return false;
    }
    var len = !value ? 0 : !BUI.isArray(value) ? 1 : value.length;
    //如果只有一个限定值
    if(range.length == 1){
      var number = range [0];
      if(!number){//range = [0],则不必选
        return true;
      }
      if(number > len){
        return false;
      }
    }else{
      var min = range [0],
        max = range[1];
      if(min > len || max < len){
        return false;
      }
    }
    return true;
  }

  /**
   * 勾选的范围
   * <ol>
   *  <li>name: checkRange</li>
   *  <li>msg: 必须选中{0}项！</li>
   *  <li>checkRange: 勾选的项范围</li>
   * </ol>
   *         //至少勾选一项
   *         {
   *           checkRange : 1
   *         }
   *         //只能勾选两项
   *         {
   *           checkRange : [2,2]
   *         }
   *         //可以勾选2-4项
   *         {
   *           checkRange : [2,4
   *           ]
   *         }
   * @member BUI.Form.Rules
   * @type {BUI.Form.Rule}   
   */
  var checkRange = rules.add({
    name : 'checkRange',
    msg : '必须选中{0}项！',
    validator : function(record,baseValue,formatedMsg,group){
      var name = getFieldName(group),
        value,
        range = baseValue;
        
      if(name && range){
        value = record[name];
        if(!testCheckRange(value,range)){
          return formatedMsg;
        }
      }
      return null;
    }
  });
  

  return rules;
});