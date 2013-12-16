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
      this._validItem(item);
    },
    _validItem: function(item){
      var _self = this,
        rules = _self.get('rules');
      BUI.each(rules, function(rule, name){
        _self._validRule(item, name, rule);
      })
    },
    _validRule: function(item, name, rule){
      // var validFn = this.getRuleFn()
      var queue = this.get('queue');
      if(name === 'maxSize'){
        if(item.size > rule * 1000){
          item.result = {msg: '文件大小不能大于' + rule + 'k'};
          queue.updateFileStatus(item, 'error');
        }
      }
    },
    testMaxSize: function(item, maxSize){
      if(item.size > rule * 1024){
        var result = {
          msg: ''
        }
        return result;
      }
    }
  });


  // function ruleMap = {};

  // Validator.addRule = function(name, fn){
  //   ruleMap[name] = fn;
  // }

  // Validator.addRule('maxSize', function(value, baseValue, formatMsg){
  //   if(value > baseValue){
  //     return formatMsg;
  //   }
  // });

  return Validator;

});