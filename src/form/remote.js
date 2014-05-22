/**
 * @fileOverview 表单异步请求，异步校验、远程获取数据
 * @ignore
 */

define('bui/form/remote',['bui/common'],function(require) {
  var BUI = require('bui/common');

  /**
   * @class BUI.Form.RemoteView
   * @private
   * 表单异步请求类的视图类
   */
  var RemoteView = function () {
    // body...
  };

  RemoteView.ATTRS = {
    isLoading : {},
    loadingEl : {}
  };

  RemoteView.prototype = {

    /**
     * 获取显示加载状态的容器
     * @protected
     * @template
     * @return {jQuery} 加载状态的容器
     */
    getLoadingContainer : function () {
      // body...
    },
    _setLoading : function () {
      var _self = this,
        loadingEl = _self.get('loadingEl'),
        loadingTpl = _self.get('loadingTpl');
      if(loadingTpl && !loadingEl){
        loadingEl = $(loadingTpl).appendTo(_self.getLoadingContainer());
        _self.setInternal('loadingEl',loadingEl);
      }
    },
    _clearLoading : function () {
      var _self = this,
        loadingEl = _self.get('loadingEl');
      if(loadingEl){
        loadingEl.remove();
        _self.setInternal('loadingEl',null);
      }
    },
    _uiSetIsLoading : function (v) {
      var _self = this;
      if(v){
        _self._setLoading();
      }else{
        _self._clearLoading();
      }
    }
  };

  /**
   * @class  BUI.Form.Remote
   * 表单异步请求，所有需要实现异步校验、异步请求的类可以使用。
   */
  var Remote = function(){

  };

  Remote.ATTRS = {

    /**
     * 默认的异步请求配置项：
     * method : 'GET',
     * cache : true,
     * dataType : 'text'
     * @protected
     * @type {Object}
     */
    defaultRemote : {
      value : {
        method : 'GET',
        cache : true,
        callback : function (data) {
          return data;
        }
      }
    },
    /**
     * 异步请求延迟的时间，当字段验证通过后，不马上进行异步请求，等待继续输入，
     * 300（默认）毫秒后，发送请求，在这个过程中，继续输入，则取消异步请求。
     * @type {Object}
     */
    remoteDaly : {
      value : 500
    },
    /**
     * @private
     * 缓存验证结果，如果验证过对应的值，则直接返回
     * @type {Object}
     */
    cacheMap : {
      value : {

      }
    },
    /**
     * 加载的模板
     * @type {String}
     */
    loadingTpl : {
      view : true,
      value : '<img src="http://img02.taobaocdn.com/tps/i2/T1NU8nXCVcXXaHNz_X-16-16.gif" alt="loading"/>'
    },
    /**
     * 是否正在等待异步请求结果
     * @type {Boolean}
     */
    isLoading : {
      view : true,
      value : false
    },
    /**
     * 异步请求的配置项，参考jQuery的 ajax配置项，如果为字符串则为 url。
     * 请不要覆盖success属性，如果需要回调则使用 callback 属性
     *
     *        {
     *          remote : {
     *            url : 'test.php',
     *            dataType:'json',//默认为字符串
     *            callback : function(data){
     *              if(data.success){ //data为默认返回的值
     *                return ''  //返回值为空时，验证成功
     *              }else{
     *                return '验证失败，XX错误！' //显示返回的字符串为错误
     *              }
     *            }
     *          }
     *        }
     * @type {String|Object}
     */
    remote : {
      setter : function  (v) {
        if(BUI.isString(v)){
          v = {url : v}
        }
        return v;
      }
    },
    /**
     * 异步请求的函数指针，仅内部使用
     * @private
     * @type {Number}
     */
    remoteHandler : {

    },
    events : {
      value : {
        /**
         * 异步请求结束
         * @event
         * @param {Object} e 事件对象
         * @param {*} e.error 是否验证成功
         */
        remotecomplete : false,
        /**
         * 异步请求开始
         * @event
         * @param {Object} e 事件对象
         * @param {Object} e.data 发送的对象，是一个键值对，可以修改此对象，附加信息
         */
        remotestart : false
      }
    }
  };

  Remote.prototype = {

    __bindUI : function(){
      var _self = this;

      _self.on('valid',function (ev) {
        if(_self.get('remote') && _self.isValid() && !_self.get('pauseValid')){
          var value = _self.getControlValue(),
            data = _self.getRemoteParams();
          _self._startRemote(data,value);
        }
      });

      _self.on('error',function (ev) {
        if(_self.get('remote')){
          _self._cancelRemote();
        }
      });

    },
    //开始异步请求
    _startRemote : function(data,value){
      var _self = this,
        remoteHandler = _self.get('remoteHandler'),
        cacheMap = _self.get('cacheMap'),
        remoteDaly = _self.get('remoteDaly');
      if(remoteHandler){
        //如果前面已经发送过异步请求，取消掉
        _self._cancelRemote(remoteHandler);
      }
      if(cacheMap[value] != null){
        _self._validResult(_self._getCallback(),cacheMap[value]);
        return;
      }
      //使用闭包进行异步请求
      function dalayFunc(){
        _self._remoteValid(data,remoteHandler,value);
        _self.set('isLoading',true);
      }
      remoteHandler = setTimeout(dalayFunc,remoteDaly);
      _self.setInternal('remoteHandler',remoteHandler);
      
    },
    _validResult : function(callback,data){
      var _self = this,
        error = callback(data);
      _self.onRemoteComplete(error,data);
    },
    onRemoteComplete : function(error,data,remoteHandler){
      var _self = this;
      //确认当前返回的错误是当前请求的结果，防止覆盖后面的请求
      if(remoteHandler == _self.get('remoteHandler')){
          _self.fire('remotecomplete',{error : error,data : data});
          _self.set('isLoading',false);
          _self.setInternal('remoteHandler',null);
      } 
    },
    _getOptions : function(data){
      var _self = this,
        remote = _self.get('remote'),
        defaultRemote = _self.get('defaultRemote'),
        options = BUI.merge(defaultRemote,remote,{data : data});
      return options;
    },
    _getCallback : function(){
      return this._getOptions().callback;
    },
    //异步请求
    _remoteValid : function(data,remoteHandler,value){
      var _self = this,
        cacheMap = _self.get('cacheMap'),
        options = _self._getOptions(data);
      options.success = function (data) {
        var callback = options.callback,
          error = callback(data);
        cacheMap[value] = data; //缓存异步结果
        _self.onRemoteComplete(error,data,remoteHandler);
      };

      options.error = function (jqXHR, textStatus,errorThrown){
        _self.onRemoteComplete(errorThrown,null,remoteHandler);
      };

      _self.fire('remotestart',{data : data});
      $.ajax(options);
    },
    /**
     * 获取异步请求的键值对
     * @template
     * @protected
     * @return {Object} 远程验证的参数，键值对
     */
    getRemoteParams : function() {

    },
    /**
     * 清楚异步验证的缓存
     */
    clearCache : function(){
      this.set('cacheMap',{});
    },
    //取消异步请求
    _cancelRemote : function(remoteHandler){
      var _self = this;

      remoteHandler = remoteHandler || _self.get('remoteHandler');
      if(remoteHandler){
        clearTimeout(remoteHandler);
        _self.setInternal('remoteHandler',null);
      }
      _self.set('isLoading',false);
    }

  };

  Remote.View = RemoteView;
  return Remote;
});