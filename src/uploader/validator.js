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
      var _self = this,
        queue = _self.get('queue');
      queue.updateFileStatus(item, 'error');
      // item.error = true;
    },
    _validItem: function(item){
      var _self = this,
        rules = _self.get('rules');
      BUI.each(rules, function(rule){
        _self._validRule(item, rule);
      })
    },
    _validRule: function(item, rule){

    }
  });

  return Validator;

});