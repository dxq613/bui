/**
 * @fileoverview 上传方式类的基类
 * @ignore
 **/
define('bui/uploader/type/base',['bui/common'], function(require) {

  var BUI = require('bui/common');
  /**
   * @class BUI.Uploader.UploadType
   *  上传方式类的基类，定义通用的事件和方法，一般不直接监听此类的事件
   * @extends BUI.Base
   */
  function UploadType(config) {
    var _self = this;
    //调用父类构造函数
    UploadType.superclass.constructor.call(_self, config);
  }

  UploadType.ATTRS = {
    /**
     * 当前处理的文件
     * @type {Object}
     */
    file: {
    },
    /**
     * 服务器端路径
     * @type String
     * @default ""
     */
    url: {
    },
    /**
     * 传送给服务器端的参数集合（会被转成hidden元素post到服务器端）
     * @type Object
     * @default {}
     */
    data: {
    },
    fileDataName: {
      value: 'Filedata'
    },
    events: {
      value: {
        /**
         * 开始上传后触发
         * @event
         * @param {Object} e 事件对象
         */
        start: false,
        /**
         * 停止上传后触发
         * @event
         * @param {Object} e 事件对象
         */
        cancel: false,
        /**
         * 上传成功后触发
         * @event
         * @param {Object} e 事件对象
         */
        success: false,
        /**
         * 上传失败后触发
         * @event
         * @param {Object} e 事件对象
         */
        error: false
      }
    }
  }

  
  //继承于Base，属性getter和setter委托于Base处理
  BUI.extend(UploadType, BUI.Base, {
    /**
     * 上传文件
     * @param {Object} File 数据对像
     * @description
     * 因为每种上传类型需要的数据都不一样，
     * Ajax需要File对像，
     * Iframe需要input[type=file]对像
     * 所以为了保持接口的一致性，这里的File对像不是浏览器原生的File对像，而是包含File和input的对像
     * 类似{name: 'test.jpg', size: 1024, textSize: '1K', input: {}, file: File}
     */
    upload: function(File) {
    },
    /** 
     * 停止上传
     */
    cancel: function(){
    },
    /**
     * 处理服务器端返回的结果集
     * @private
     */
    _processResponse: function(responseText){
      var _self = this,
        file = _self.get('file'),
        result;
      //格式化成json数据
      if(BUI.isString(responseText)){
        try{
          result = BUI.JSON.parse(responseText);
          // result = _self._fromUnicode(result);
        }catch(e){
          result = responseText;
        }
      }else if(BUI.isObject(responseText)){
        result = _self._fromUnicode(responseText);
      }
      BUI.log('服务器端输出：' + BUI.JSON.stringify(result));
      return result;
    },
    /**
     * 将unicode的中文转换成正常显示的文字，（为了修复flash的中文乱码问题）
     * @private
     */
    _fromUnicode:function(data){
        if(!BUI.isObject(data)) return data;
        _each(data);
        function _each(data){
            BUI.each(data,function(v,k){
                if(BUI.isObject(data[k])){
                    _each(data[k]);
                }else{
                    data[k] = BUI.isString(v) && BUI.fromUnicode(v) || v;
                }
            });
        }
        return data;
    },
    reset: function(){
    }
  });

  return UploadType;
});
