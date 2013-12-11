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
    rules: {

    },
    /**
     * 上传组件的queue对像
     * @type {BUI.Uploader.Queue}
     */
    queue: {
    }
  }

  BUI.extend(Validator, BUI.Base);

  BUI.augment(Validator, {
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