/**
 * @ignore
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/uploader', ['bui/common', './theme', './factory', './validator'], function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    Theme = require('bui/uploader/theme'),
    Factory = require('bui/uploader/factory'),
    Validator = require('bui/uploader/validator');

  //上传类型的检测函数定义
  var supportMap = {
    ajax: function(){
      return !!window.FormData;
    },
    //flash上传类型默认所有浏览器都支持
    flash: function(){
      return true;
    },
    iframe: function(){
      return true;
    }
  }

  //是否支持该上传类型
  function isSupport(type){
    return supportMap[type] && supportMap[type]();
  }

  /**
   * Uploader的视图层
   * @class BUI.Uploader.UploaderView
   * @private
   */
  var UploaderView = Component.View.extend({
    }, {
    ATTRS: {
         
    }
  });

  /**
   * 文件上传组组件
   * @class BUI.Uploader.Uploader
   * @extends BUI.Component.Controller
   * 
   * <pre><code>
   *
   * BUI.use('bui/uploader', function(Uploader){
   *   var uploader = new Uploader.Uploader({
   *     url: '../upload.php'
   *   }).render();
   *
   *  uploader.on('success', function(ev){
   *    //获取上传返回的结果
   *    var result = ev.result;
   *  })
   * });
   * 
   * </code></pre>
   */
  var Uploader = Component.Controller.extend({
    renderUI: function(){
      var _self = this;
      _self._initTheme();
      _self._initType();
      
      _self._renderButton();
      _self._renderUploaderType();
      _self._renderQueue();
      _self._initValidator();
    },
    bindUI: function () {
      var _self = this;
      _self._bindButton();
      _self._bindUploaderCore();
      _self._bindQueue();
    },
    /**
     * @private
     * 初始化使用的主题
     */
    _initTheme: function(){
      var _self = this,
        theme = Theme.getTheme(_self.get('theme')),
        attrVals = _self.getAttrVals();
      BUI.each(theme, function(value, name){
        if(attrVals[name] === undefined){
          _self.set(name, value);
        }
        else if($.isPlainObject(value)){
          BUI.mix(value, attrVals[name]);
          _self.set(name, value);
        }
      });
    },
    /**
     * 初始化上传类型
     * @private
     * @description 默认按最优处理
     */
    _initType: function(){
      var _self = this,
        types = _self.get('types'),
        type = _self.get('type');
      //没有设置时按最优处理，有则按设定的处理
      if(!type){
        BUI.each(types, function(item){
          if(isSupport(item)){
            type = item;
            return false;
          }
        })
      }
      _self.set('type', type);
    },
    /**
     * 初始化验证器
     * @private
     */
    _initValidator: function(){
      var _self = this,
        validator = _self.get('validator');
      if(!validator){
        validator = new Validator({
          queue: _self.get('queue'),
          rules: _self.get('rules')
        });
        _self.set('validator', validator);
      }
    },
    /**
     * 获取用户的配置信息
     * @private
     */
    _getUserConfig: function(keys){
      var attrVals = this.getAttrVals(),
        config = {};
      BUI.each(keys, function(key){
        var value = attrVals[key];
        if(value !== undefined){
          config[key] = value;
        }
      });
      return config;
    },
    /**
     * 初始线上传类型的实例
     * @private
     */
    _renderUploaderType: function(){
      var _self = this,
        type = _self.get('type'),
        config = _self._getUserConfig(['url', 'data']);
      var uploaderType = Factory.createUploadType(type, config);
      uploaderType.set('uploader', _self);
      _self.set('uploaderType', uploaderType);
    },
    /**
     * 初始化Button
     * @private
     */
    _renderButton: function(){
      var _self = this,
        type = _self.get('type'),
        el = _self.get('el'),
        button = _self.get('button') || {};
      if(!button.isController){
        button.render = el;
        button.autoRender = true;
        button = Factory.createButton(type, button);
        _self.set('button', button);
      }
      button.set('uploader', _self);
    },
    /**
     * 初始化上传的对列
     * @private
     */
    _renderQueue: function(){
      var _self = this,
        el = _self.get('el'),
        queue = _self.get('queue') || {};
      if (!queue.isController) {
        queue.render = el;
        queue.autoRender = true;
        //queue.uploader = _self;
        queue = Factory.createQueue(queue);
        _self.set('queue', queue);
      }
      queue.set('uploader', _self);
    },
    /**
     * 绑定button的事件
     * @private
     */
    _bindButton: function () {
      var _self = this,
        button = _self.get('button'),
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType');
      button.on('change', function(ev) {
        var files = ev.files;
        //对添加的文件添加状态
        queue.addItems(files);
        _self.fire('change', {items: files});
      });
    },
    /**
     * 绑定上传的对列
     * @private
     */
    _bindQueue: function () {
      var _self = this,
        queue = _self.get('queue'),
        validator = _self.get('validator');

      //渲染完了之后去设置文件状态
      queue.on('itemrendered', function(ev){
        var item = ev.item,
          status = 'wait';
        if(!validator.valid(item)){
          status = 'error';
        }
        queue.updateFileStatus(item, status);
      });

      queue.on('itemupdated', function(ev) {
        var items = queue.getItemsByStatus('wait');
        //如果有等待的文件则上传第1个
        if (items && items.length) {
          _self.uploadFile(items[0]);
          //如果文件被置为等等状态，则要进行重新上传
        }
      });
    },
    /**
     * 文件上传的处理函数
     * @private
     */
    _bindUploaderCore: function () {
      var _self = this,
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType');

      //start事件
      uploaderType.on('start', function(ev){
        var item = ev.file;
        delete item.result;
        _self.fire('start', {item: item});
      });
      //上传的progress事件
      uploaderType.on('progress', function(ev){

        var curUploadItem = _self.get('curUploadItem'),
          loaded = ev.loaded,
          total = ev.total;
        BUI.mix(curUploadItem.attr, {
          //文件总大小, 这里的单位是byte
          total: total,
          //已经上传的大小
          loaded: loaded,
          //已经上传的百分比
          loadedPercent: loaded * 100 / total
        });

        //设置当前正处于的状态
        queue.updateFileStatus(curUploadItem, 'progress');

        _self.fire('progress', {item: curUploadItem, total: total, loaded: loaded});
      });
      //上传过程中的error事件
      //一般是当校验出错时和上传接口异常时触发的
      uploaderType.on('error', function(ev){
        var curUploadItem = _self.get('curUploadItem'),
          errorFn = _self.get('error'),
          completeFn = _self.get('complete');
        //设置对列中完成的文件
        queue.updateFileStatus(curUploadItem, 'error');

        errorFn && BUI.isFunction(errorFn) && errorFn.call(_self);
        _self.fire('error', {item: curUploadItem});

        completeFn && BUI.isFunction(completeFn) && completeFn.call(_self);
        _self.fire('complete', {item: curUploadItem});

        _self.set('curUploadItem', null);
      });

      //上传完成的事件
      uploaderType.on('complete', function(ev){
        var curUploadItem = _self.get('curUploadItem'),
          result = ev.result,
          isSuccess= _self.get('isSuccess'),
          successFn = _self.get('success'),
          errorFn = _self.get('error'),
          completeFn = _self.get('complete');

        // BUI.mix(curUploadItem.result, result);
        curUploadItem.result = result;

        if(isSuccess.call(_self, result)){
          //为了兼容原来只设置了itemTpl的情况
          BUI.mix(curUploadItem, result);
          queue.updateFileStatus(curUploadItem, 'success');
          successFn && BUI.isFunction(successFn) && successFn.call(_self, result);
          _self.fire('success', {item: curUploadItem, result: result});
        }
        else{
          queue.updateFileStatus(curUploadItem, 'error');
          errorFn && BUI.isFunction(errorFn) && errorFn.call(_self, result);
          _self.fire('error', {item: curUploadItem, result: result});
        }

        completeFn && BUI.isFunction(completeFn) && completeFn.call(_self, result);
        _self.fire('complete', {item: curUploadItem, result: result});
        _self.set('curUploadItem', null);

        //重新上传其他等待的文件
        _self.uploadFiles();
      });
    },
    /**
     * 开始进行上传
     * @param  {Object} item
     */
    uploadFile: function (item) {
      var _self = this,
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType'),
        curUploadItem = _self.get('curUploadItem');

      //如果有文件正等侍上传，而且上传组件当前处理空闲状态，才进行上传
      if (item && !curUploadItem) {
        //设置正在上传的状态
        _self.set('curUploadItem', item);
        //更新文件的状态
        queue.updateFileStatus(item, 'start');
        uploaderType.upload(item);
      }
    },
    /**
     * 上传文件，只对对列中所有wait状态的文件
     */
    uploadFiles: function () {
      var _self = this,
        queue = _self.get('queue'),
        //所有文件只有在wait状态才可以上传
        items = queue.getItemsByStatus('wait');

      if (items && items.length) {
        //开始进行对列中的上传
        _self.uploadFile(items[0]);
      }
    },
    /**
     * 取消正在上传的文件 
     */
    cancel: function(item){
      var _self = this,
        uploaderType = _self.get('uploaderType');
      item = item || _self.get('curUploadItem');

      _self.fire('cancel', {item: item});
      uploaderType.cancel();
      _self.set('curUploadItem', null);
    },
    /**
     * 校验是否通过
     * @description 判断成功的数量和列表中的数量是否一致
     */
    isValid: function(){
      var _self = this,
        queue = _self.get('queue');
      return queue.getItemsByStatus('success').length === queue.getItems().length;
    },
    _uiSetUrl: function(v){
      var _self = this,
        uploaderType = _self.get('uploaderType');
      uploaderType && uploaderType.set && uploaderType.set('url', v);
    },
    /**
     * 设置是否disabled
     * @private
     */
    _uiSetDisabled: function(v){
      var _self = this,
        button = _self.get('button');
      button && button.isController && button.set('disabled', v);
    },
    _uiSetMultiple: function(v){
      var _self = this,
        button = _self.get('button');
      button && button.isController && button.set('multiple', v);
    }
  }, {
    ATTRS: {
      /**
       * 上传的类型，会依次按这个顺序来检测，并选择第一个可用的
       * @type {Array} 上传类型
       * @default ['ajax', 'flash', 'iframe']
       */
      types: {
        value: ['ajax', 'flash', 'iframe']
      },
      /**
       * 上传的类型，有ajax,flash,iframe四种
       * @type {String}
       */
      type: {
      },
      /**
       * 主题
       * @type {BUI.Uploader.Theme}
       */
      theme: {
        value: 'default'
      },
      /**
       * 上传组件的button对像
       * @type {BUI.Uploader.Button}
       */
      button: {
      },
      /**
       * 上传组件是否可用
       * @type {Boolean} disabled
       */
      disabled: {
        value: false
      },
      /**
       * 是否支持多选
       * @type {Boolean} multiple
       */
      multiple: {
        value: true
      },
      /**
       * 上传组件的上传对列
       * @type {BUI.Uploader.Queue}
       */
      queue: {
      },
      /**
       * 当前上传的状态
       * @type {String}
       */
      uploadStatus: {
      },
      /**
       * 判断上传是否已经成功，默认判断有返回，且返回的json中存在url这个字段
       * @type {Function}
       */
      isSuccess: {
        value: function(result){
          if(result && result.url){
            return true;
          }
          return false;
        }
      },
      /**
       * uploader的验证器
       * @type {BUI.Uploader.Validator}
       */
      validator: {
      },
      events : {
        value : {
          /**
           * 选中文件时
           * @event
           * @param {Object} e 事件对象
           * @param {Array} e.items 选中的文件项
           */
          'change': false,
          /**
           * 文件开始上传时
           * @event
           * @param {Object} e 事件对象
           * @param {Object} e.item 当前上传的项
           */
          'start': false,
          /**
           * 文件正在上传时
           * @event
           * @param {Object} e 事件对象
           * @param {Object} e.item 当前上传的项
           * @param {Number} e.total 文件的总大小
           * @param {Object} e.loaded 已经上传的大小
           */
          'progress': false,
          /**
           * 文件上传成功时
           * @event
           * @param {Object} e 事件对象
           * @param {Object} e.item 当前上传的项
           * @param {Object} e.result 服务端返回的结果
           */
          'success': false,
          /**
           * 文件上传失败时
           * @event
           * @param {Object} e 事件对象
           * @param {Object} e.item 当前上传的项
           * @param {Object} e.result 服务端返回的结果
           */
          'error': false,
          /**
           * 文件完成时，不管成功失败都会触发
           * @event
           * @param {Object} e 事件对象
           * @param {Object} e.item 当前上传的项
           * @param {Object} e.result 服务端返回的结果
           */
          'complete': false,
          /**
           * 取消上传时
           * @event
           * @param {Object} e 事件对象
           * @param {Object} e.item 当前取消的项
           */
          'cancel': false
        }
      },
      xview: {
        value: UploaderView
      }
    }
  }, {
    xclass: 'uploader'
  });

  return Uploader;

});