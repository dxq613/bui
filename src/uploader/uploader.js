/**
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/uploader', function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    Theme = require('bui/uploader/theme'),
    Ajax = require('bui/uploader/type/ajax'),
    Flash = require('bui/uploader/type/flash');//,
    // Iframe = require('bui/uploader/type/iframe');


  var win = window;

  /**
   * Uploader的视图层
   * @type {[type]}
   */
  var UploaderView = Component.View.extend({
    }, {
    ATTRS: {
         
    }
  });


  var Uploader = Component.Controller.extend(/** @lends Uploader.prototype*/{
    initializer: function(){
      var _self = this;
      //初始化上传类型
      _self._initType();
      //初始化上传的button
      _self._initButton();
      //初始化文件对列
      _self._initQueue();
      //初始化进行上传的类
      _self._initUploaderType();
    },
    
    /**
     * 获取上传的类
     * @return {[type]} [description]
     */
    _getUploaderType: function(type){
      var _self = this,
        types = _self.get('types'),
        uploaderType;
      switch (type){
        case types.AJAX:
          uploaderType = Ajax;
          break;
        case types.FLASH:
          uploaderType = Flash;
          break;
        case types.IFRAME:
          uploaderType = Iframe;
          break;
        default:
          break;
      }
      return uploaderType;
    },
    /**
     * 获取用户的配置信息
     */
    _getUserConfig: function(keys){
      var userConfig = this.get('userConfig'),
        config = {};
      BUI.each(keys, function(key){
        var value = userConfig[key];
        if(value !== undefined){
          config[key] = value;
        }
      });
      return config;
    },
    /**
     * 初始化Button
     * @return {[type]} [description]
     */
    _initButton: function(){
      var _self = this,
        theme = _self.get('theme'),
        type = _self.get('type'),
        config = _self._getUserConfig(['render', 'text', 'buttonCls', 'name', 'multiple', 'filter']),
        button = Theme.createButton(theme, config, type);
      _self.set('button', button);
    },
    /**
     * 初始化上传的对列
     * @return {[type]} [description]
     */
    _initQueue: function(){
      var _self = this,
        queue = _self.get('queue'),
        theme = _self.get('theme');
      if (!queue) {
        queue = Theme.createQueue(theme, _self._getUserConfig(['render']));
        _self.set('queue', queue);
      };
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
        if(_self.isSupportAjax()){
          _self.set('type', types.AJAX);
        }
        else if(_self.isSupportFlash()){
          _self.set('type', types.FLASH);
        }
        else{
          _self.set('type', types.IFRAME);
        }
      }
    },
    _initUploaderType: function(){
      var _self = this,
        type = _self.get('type'),
        UploaderType = _self._getUploaderType(type),
        uploaderType = new UploaderType(_self._getUserConfig(['url', 'data']));
        uploaderType.set('uploader', _self);
      _self.set('uploaderType', uploaderType);
    },
    _bindButton: function () {
      var _self = this,
        button = _self.get('button'),
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType');
      button.on('change', function(ev) {

        //对添加的文件添加等待状态
        BUI.each(ev.files, function(file){
          BUI.mix(file, {
            wait: true
          });
        });
        queue.addItems(ev.files);
      });
    },
    _bindQueue: function () {
      var _self = this,
        queue = _self.get('queue');
      queue.on('itemrendered itemupdated', function(ev) {
        var items = queue.getItemsByStatus('wait');

        //如果有等待的文件则上传第1个
        if (items && items.length) {
          _self.uploadFile(items[0]);
          //如果文件被置为等等状态，则要进行重新上传
        }
      });
    },
    /**
     * 
     * @return {[type]} [description]
     */
    _bindUploaderCore: function () {
      var _self = this,
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType');

      uploaderType.on('start', function(ev){
        _self.fire('start', {item: ev.file});
      });

      uploaderType.on('progress', function(ev){

        var curUploadItem = _self.get('curUploadItem'),
          loaded = ev.loaded,
          total = ev.total;

        //设置当前正处于的状态
        queue.updateFileStatus(curUploadItem, 'progress');

        BUI.mix(curUploadItem, {
          loaded: loaded,
          total: total,
          loadedPercent: loaded * 100 / total
        });

        //queue.updateItem(curUploadItem);

        _self.fire('progress', {item: curUploadItem, total: total, loaded: loaded});
      });

      uploaderType.on('cancel', function(ev){
        var curUploadItem = _self.get('curUploadItem');
        queue.updateFileStatus(curUploadItem, 'cancel');
        _self.set('curUploadItem', null);
        _self.fire('cancel', {curUploadItem: curUploadItem});
      });

      uploaderType.on('complete', function(ev){
        _self.fire('complete');
      })

      uploaderType.on('success', function(ev){
        var result = ev.result;
        var waitFiles = queue.getItemsByStatus('wait'),
          curUploadItem = _self.get('curUploadItem');

        BUI.mix(curUploadItem, {
          url: result.url
        });
        //设置对列中完成的文件
        queue.updateFileStatus(curUploadItem, 'success');
        //queue.updateItem(curUploadItem);

        _self.set('curUploadItem', null);
        _self.fire('success', {item: curUploadItem});

        //上传完了之后，如是对列中还有未上传的文件，则继续进行上传
        _self.uploadFiles();
      });

      uploaderType.on('error', function(ev){
        var curUploadItem = _self.get('curUploadItem');
        //设置对列中完成的文件
        queue.updateFileStatus(curUploadItem, 'error');
        _self.set('curUploadItem', null);
        _self.fire('error', {item: curUploadItem});
      });
    },
    /**
     * 检测浏览器是否支持ajax类型上传方式
     * @return {Boolean}
     */
    isSupportAjax: function(){
      return !!win['FormData'];
    },
    /**
     * 检测浏览器是否支持flash类型上传方式
     * @return {Boolean}
     */
    isSupportFlash: function(){
      return true;
    },
    renderUI: function(){
      var _self = this,
        el = _self.get('el'),
        button = _self.get('button'),
        queue = _self.get('queue');
      button.set('render', el);
      queue.set('render', el);
      button.render();
      queue.render();
    },
    bindUI: function () {
      var _self = this;
      _self._bindButton();
      _self._bindQueue();
      _self._bindUploaderCore();
    },
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
     * @return {[type]} [description]
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
    }
  }, {
    ATTRS: /** @lends Uploader.prototype*/{
      /**
       * 上传的类型，有ajax,flash,iframe四种
       * @type {String}
       */
      types: {
        value: {
          AJAX: 'ajax',
          FLASH: 'flash',
          IFRAME: 'iframe'
        }
      },
      /**
       * 当前使用的上传类型
       * @type {String}
       */
      type: {
      },
      theme: {
        value: 'default'
      },
      /**
       * 当前上传的状
       * @type {Object}
       */
      uploadStatus: {
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