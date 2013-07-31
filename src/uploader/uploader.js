/**
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/uploader', function (require) {

  var BUI = require('bui/common'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton'),
    Queue = require('bui/uploader/queue'),
    Ajax = require('bui/uploader/type/ajax'),
    Flash = require('bui/uploader/type/flash'),
    Iframe = require('bui/uploader/type/iframe');


  var Component = BUI.Component,
    PREFIX = BUI.prefix,
    CLS_UPLOADER = PREFIX + 'uploader',
    CLS_UPLOADER_BUTTON = CLS_UPLOADER + '-button',
    CLS_UPLOADER_BUTTON_TEXT = CLS_UPLOADER_BUTTON + '-text';

  var win = window;

  /**
   * Uploader的视图层
   * @type {[type]}
   */
  var UploaderView = Component.View.extend({
    _uiSetButtonCls: function (v) {
      var _self = this,
        buttonCls = _self.get('buttonCls'),
        buttonEl = _self.get('el').find('.' + CLS_UPLOADER_BUTTON);
      buttonEl.addClass(buttonCls);
    },
    _uiSetText: function (v) {
      var _self = this,
        text = _self.get('text'),
        textEl = _self.get('el').find('.' + CLS_UPLOADER_BUTTON_TEXT);
      textEl.text(text);
    }
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
     * 根据上传的类型获取实例化button的类
     * @private
     * @param  {String} type 上传的类型
     * @return {Class}
     */
    _getButtonClass: function(type) {
      var _self = this,
        types = _self.get('types');
      if(type === types.AJAX || type === types.IFRAME){
        return HtmlButton;
      }
      else{
        return SwfButton;
      }
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
     * 初始化Button
     * @return {[type]} [description]
     */
    _initButton: function(){
      var _self = this,
        type = _self.get('type'),
        ButtonClass = _self._getButtonClass(type),
        name = _self.get('name'),
        multiple = _self.get('multiple'),
        filter = _self.get('filter'),
        button = new ButtonClass({
          //name: name,
          multiple: multiple,
          filter: filter
        });
      _self.set('button', button);
    },
    /**
     * 初始化上传的对列
     * @return {[type]} [description]
     */
    _initQueue: function(){
      var _self = this,
        queue = _self.get('queue'),
        render = _self.get('render');
      if (!queue) {
        queue = new Queue({
          render: render
        });
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
        uploaderType = new UploaderType({
          action: _self.get('url'),
          data: _self.get('data')
        });
      _self.set('uploaderType', uploaderType);
    },
    /**
     * 渲染button, ajax和iframe用原生的input[type=file], flash的需要加载flash组件
     * @private
     */
    _renderButton: function(){
      var _self = this,
        buttonEl = _self.get('view').get('el').find('.' + CLS_UPLOADER_BUTTON),
        button = _self.get('button');
      button.set('render', buttonEl);
      button.render();
    },
    _bindButton: function () {
      var _self = this,
        button = _self.get('button'),
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType');

      button.on('change', function(ev) {
        queue.addItems(ev.files);
      });
    },
    _bindQueue: function () {
      var _self = this,
        queue = _self.get('queue');
      queue.on('itemrendered itemupdated', function(ev) {
        var items = queue.getItemsByStatus('waiting');

        //如果有等待的文件则进行上传
        if (items.length) {
          _self.uploadFiles();
          //如果文件被置为等等状态，则要进行重新上传
        }
      });

      // queue.on('itemupdated', function(ev){
      //   var item = ev.item,
      //     element = ev.domTarget,
      //     url = item.url;
      //   if (url) {
      //     $(element).attr('data-url', url);
      //   }
      // });
    },
    /**
     * 
     * @return {[type]} [description]
     */
    _bindUploaderCore: function () {
      var _self = this,
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType');

      _self._bindButton();
      _self._bindQueue();

      //已经处理过了
      //uploaderType.on('start', function(ev){});

      uploaderType.on('progress', function(ev){

        var curUploadItem = _self.get('curUploadItem'),
          loaded = ev.loaded,
          total = ev.total;

        //设置当前正处于的状态
        queue.clearItemStatus(curUploadItem);
        queue.setItemStatus(curUploadItem, 'progress', true);

        BUI.mix(curUploadItem, {
          loaded: loaded,
          total: total,
          loadedPercent: loaded * 100 / total
        });

        // console.log(curUploadItem);
        queue.updateItem(curUploadItem);

        _self.fire('progress', {item: curUploadItem, total: total, loaded: loaded});
      });

      uploaderType.on('stop', function(ev){
        var curUploadItem = _self.get('curUploadItem');

        queue.clearItemStatus(curUploadItem);
        queue.setItemStatus(curUploadItem, 'cancel', true);

        _self.set('curUploadItem', null);

        _self.fire('stop', {curUploadItem: curUploadItem});
      });

      uploaderType.on('success', function(ev){

        var result = ev.result;

        var waitFiles = queue.getItemsByStatus('waiting'),
          curUploadItem = _self.get('curUploadItem');

        curUploadItem.url = result.url;
        BUI.mix(curUploadItem, {
          url: result.url
        });

        //设置对列中完成的文件
        queue.clearItemStatus(curUploadItem);
        queue.setItemStatus(curUploadItem, 'success', true);
        queue.updateItem(curUploadItem);

        //queue.setItemStatus(curUploadItem, 'success', 'success');

        _self.set('curUploadItem', null);

        //上传完了之后，如是对列中还有未上传的文件，则继续进行上传
        if (waitFiles.length){
          _self.uploadFile(waitFiles[0]);
        }
        else {
          //如果没有可上传的文件，则触发结束事件
          _self.fire('end');
        }

        _self.fire('success', {item: curUploadItem});
      });
      uploaderType.on('error', function(ev){
        _self.fire('error');
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
      var _self = this;
      _self._renderButton();
      _self.get('queue').render();
    },
    bindUI: function () {
      var _self = this;
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
        //清除当前的状态
        queue.clearItemStatus(item);
        //设置对列中的文件处理开始上传状态
        queue.setItemStatus(item, 'start', true);

        _self.fire('itemstart', {item: item});
        uploaderType.upload(item);
      }
    },
    /**
     * 上传文件，只对对列中所有waiting状态的文件
     * @return {[type]} [description]
     */
    uploadFiles: function () {
      var _self = this,
        queue = _self.get('queue'),
        //所有文件只有在waiting状态才可以上传
        items = queue.getItemsByStatus('waiting'),
        curUploadItem = _self.get('curUploadItem');

      if (items.length && !curUploadItem) {
        //开始进行对列中的上传
        _self.fire('start');
        _self.uploadFile(items[0]);
      }
    }
  }, {
    ATTRS: /** @lends Uploader.prototype*/{
      buttonCls: {
        view: true
      },
      textCls: {
        view: true
      },
      text: {
        view: true,
        value: '上传文件'
      },
      tpl: {
        view: true,
        value: '<a href="javascript:void(0);" class="' + CLS_UPLOADER_BUTTON + '  {buttonCls}"><span class="' + CLS_UPLOADER_BUTTON_TEXT + ' {textCls}">{text}</span></a>'
      },
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