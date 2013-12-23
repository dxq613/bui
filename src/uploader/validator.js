/**
 * @ignore
 * @fileoverview 异步文件上传的验证器
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/validator', function (require) {

  var BUI = require('bui/common');


  /**
   * 异步文件上传的验证器
   * @class BUI.Uploader.Validator
   * @extend BUI.Base
   */
  function Validator(config){
    Validator.superclass.constructor.call(this, config);
  }

  Validator.ATTRS = {
    /**
     * 上传组件的校验规则
     * @type {Object}
     */
    rules: {

    },
    queue: {

    }
  }

  BUI.extend(Validator, BUI.Base);

  BUI.augment(Validator, {
    /**
     * 校验文件是否符合规则，并设置文件的状态
     * @param  {Object} item
     * @return {[type]}      [description]
     */
    valid: function(item){
      return this._validItem(item);
    },
    _validItem: function(item){
      var _self = this,
        rules = _self.get('rules'),
        isValid = true;

      BUI.each(rules, function(rule, name){
        isValid = isValid && _self._validRule(item, name, rule);
        return isValid;
      })
      return isValid;
    },
    _validRule: function(item, name, rule, msg){
      if(BUI.isArray(rule)){
        msg = BUI.substitute(rule[1], rule);
        rule = rule[0];
      }
      var ruleFn = Validator.getRule(name),
        validMsg = ruleFn && ruleFn.call(this, item, rule, msg),
        result = this._getResult(validMsg);

      if(result){
        item.result = result;
        return false;
      }
      return true;
    },
    /**
     * 获取校验的结果
     * @param  {String} msg
     */
    _getResult: function(msg){
      if(msg){
        return {
          msg: msg
        }
      }
    }
  });


  var ruleMap = {};

  Validator.addRule = function(name, fn){
    ruleMap[name] = fn;
  }

  Validator.getRule = function(name){
    return ruleMap[name];
  }

  //文件最大值
  Validator.addRule('maxSize', function(item, baseValue, formatMsg){
    if(item.size > baseValue * 1024){
      return formatMsg;
    }
  });

  //文件最小值
  Validator.addRule('minSize', function(item, baseValue, formatMsg){
    if(item.size < baseValue * 1024){
      return formatMsg;
    }
  });

  //上传文件的最大个数
  Validator.addRule('max', function(item, baseValue, formatMsg){
    var count = this.get('queue').getCount();
    if(count > baseValue){
      return formatMsg;
    }
  });

  //上传文件的最小个数
  Validator.addRule('min', function(item, baseValue, formatMsg){
    var count = this.get('queue').getCount();
    if(count < baseValue){
      return formatMsg;
    }
  });

  //上传文件的文件类型
  Validator.addRule('ext', function(item, baseValue, formatMsg){
    var ext = item.ext,
      baseValue = baseValue.split(',');
    if($.inArray(ext, baseValue) === -1){
      return formatMsg;
    }
  });

  return Validator;

});