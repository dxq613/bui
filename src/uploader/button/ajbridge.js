/*
Copyright 2011, KISSY UI Library v1.1.5
MIT Licensed
build time: Sep 11 10:29
*/
define('bui/uploader/button/swfButton/ajbridge',['bui/common','bui/swf'], function(require){
  var BUI = require('bui/common'),
    SWF = require('bui/swf');


  var instances = {};

  /**
   * @ignore
   * @class  BUI.Uploader.AJBridge
   * @private
   * @author kingfo oicuicu@gmail.com
   */
  function AJBridge(config){
    AJBridge.superclass.constructor.call(this, config);
  }

  BUI.mix(AJBridge, {
    /**
     * 处理来自 AJBridge 已定义的事件
     * @param {String} id            swf传出的自身ID
     * @param {Object} event        swf传出的事件
     */
    eventHandler: function(id, event) {
      var instance = instances[id];
      if (instance) {
        instance.__eventHandler(id, event);
      }
    },
    /**
     * 批量注册 SWF 公开的方法
     * @param {Function} C 构造函数
     * @param {String|Array} methods
     */
    augment: function (C, methods) {
      if (BUI.isString(methods)) {
        methods = [methods];
      }
      if (!BUI.isArray(methods)){
        return;
      }
      BUI.each(methods, function(methodName) {
        C.prototype[methodName] = function() {
          try {
            return this.callSWF(methodName, Array.prototype.slice.call(arguments, 0));
          } catch(e) { // 当 swf 异常时，进一步捕获信息
            this.fire('error', { message: e });
          }
        }
      });
    }
  })

  BUI.extend(AJBridge, SWF);

  BUI.augment(AJBridge, {
    initializer: function(){
      AJBridge.superclass.initializer.call(this);
      var _self = this,
        attrs = _self.get('attrs'),
        id = attrs.id;

      instances[id] = _self;

      _self.set('id', id);
    },
    __eventHandler: function(id, event){
      var _self = this,
        type = event.type;
    
      event.id = id;   // 弥补后期 id 使用
      switch(type){
        case "log":
          BUI.log(event.message);
          break;
        default:
          _self.fire(type, event);
      }
    },
    destroy: function(){
      AJBridge.superclass.destroy.call(this);
      var id = this.get('id');
      instances[id] && delete instances[id];
    }
  });

  // 为静态方法动态注册
  // 注意，只有在 S.ready() 后进行 AJBridge 注册才有效。
  AJBridge.augment(AJBridge, [
    'activate',
    'getReady',
    'getCoreVersion',
    'setFileFilters',
    'filter',
    'setAllowMultipleFiles',
    'multifile',
    'browse',
    'upload',
    'uploadAll',
    'cancel',
    'getFile',
    'removeFile',
    'lock',
    'unlock',
    'setBtnMode',
    'useHand',
    'clear'
  ]);

  //flash里面要调用全局方法BUI.AJBridge.eventHandler,所以挂在BUI下面
  BUI.AJBridge = AJBridge;

  return AJBridge;
});
/**
 * NOTES:
 * 20130904 从kissy ajbridge模块移植成bui的模块（索丘修改）
 * @ignore
 */
