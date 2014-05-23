/**
 * @ignore
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/uploader', ['bui/common', './file', './theme', './factory', './validator'], function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    File = require('bui/uploader/file'),
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

  //设置Controller的属性
  function setControllerAttr(control, key, value) {
    if (BUI.isFunction(control.set)) {
      control.set(key, value);
    }
    else {
      control[key] = value;
    }
  }

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
    initializer: function(){
      var _self = this;
      _self._initTheme();
      _self._initType();
    },
    renderUI: function(){
      var _self = this;
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
        //uploader里面没有定义该配置，但是主题里面有定义
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
     * 初始线上传类型的实例
     * @private
     */
    _renderUploaderType: function(){
      var _self = this,
        type = _self.get('type'),
        config = _self.get('uploaderType');

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
        button = _self.get('button');
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
        queue = _self.get('queue');
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
        queue = _self.get('queue');

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
        button = _self.get('button'),
        validator = _self.get('validator');

      //渲染完了之后去设置文件状态，这个是会在添加完后触发的
      queue.on('itemrendered', function(ev){
        var item = ev.item,
          //如果文件已经存在某一状态，则不再去设置add状态
          status = queue.status(item) || 'add';

        // 说明是通过addItem直接添加进来的
        if(!item.isUploaderFile){
          item.result = BUI.cloneObject(item);
          item = File.create(item);
        }

        if(!validator.valid(item)){
          status = 'error';
        }

        queue.updateFileStatus(item, status);

        if(_self.get('autoUpload')){
          _self.upload();
        }
      });

      queue.on('itemupdated', function(ev) {
        _self.uploadFiles();
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
        BUI.mix(curUploadItem, {
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

        _self.set('curUploadItem', null);

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
        

        //重新上传其他等待的文件
        //_self.uploadFiles();
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
     * 上传所有新添加的文件
     */
    upload: function(){
      var _self = this,
        queue = _self.get('queue'),
        //所有文件只有在wait状态才可以上传
        items = queue.getItemsByStatus('add');
      BUI.each(items, function(item){
        queue.updateFileStatus(item, 'wait');
      });
    },
    /**
     * 取消正在上传的文件 
     */
    cancel: function(item){
      var _self = this;
      if(item){
        _self._cancel(item);
        return
      }
      //只对将要进行上传的文件进行取消
      BUI.each(_self.get('queue').getItemsByStatus('wait'), function(item){
        _self._cancel(item);
      });
    },
    /**
     * 取消
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    _cancel: function(item){
      var _self = this,
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType'),
        curUploadItem = _self.get('curUploadItem');

      //说明要取消项正在进行上传
      if (curUploadItem === item) {
        uploaderType.cancel();
        _self.set('curUploadItem', null);
      }

      queue.updateFileStatus(item, 'cancel');

      _self.fire('cancel', {item: item});
    },
    /**
     * 校验是否通过
     * @description 判断成功的数量和列表中的数量是否一致
     */
    isValid: function(){
      var _self = this,
        queue = _self.get('queue');
      return queue.getItemsByStatus('success').length === queue.getItems().length;
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
        value: {},
        shared: false
      },
      /**
       * 按钮的文本
       * @type {String} text
       * @default 上传文件
       */
      text: {
        setter: function(v) {
          setControllerAttr(this.get('button'), 'text', v);
          return v;
        }
      },
      /**
       * 提交文件时的name值
       * @type {String} name
       * @default fileData
       */
      name: {
        setter: function(v) {
          setControllerAttr(this.get('button'), 'name', v);
          setControllerAttr(this.get('uploaderType'), 'fileDataName', v);
          return v;
        }
      },
      /**
       * 上传组件是否可用
       * @type {Boolean} disabled
       */
      disabled: {
        value: false,
        setter: function(v) {
          setControllerAttr(this.get('button'), 'disabled', v);
          return v;
        }
      },
      /**
       * 是否支持多选
       * @type {Boolean} multiple
       */
      multiple: {
        value: true,
        setter: function(v) {
          setControllerAttr(this.get('button'), 'multiple', v);
          return v;
        }
      },
      /**
       * 文件过滤
       * @type Array
       * @default []
       * @description
       * 在使用ajax方式上传时，不同浏览器、不同操作系统这个filter表现得都不太一致
       * 所以在使用ajax方式上传不建议使用
       * 如果已经声明使用flash方式上传，则可以使用这个
       *
       * <pre><code>
       * filter: {ext:".jpg,.jpeg,.png,.gif,.bmp"}
       * </code></pre>
       *
       */
      filter: {
        setter: function(v) {
          setControllerAttr(this.get('button'), 'filter', v);
          return v;
        }
      },
      /**
       * 用来处理上传的类
       * @type {Object}
       * @readOnly
       */
      uploaderType: {
        value: {},
        shared: false
      },
      /**
       * 文件上传的url
       * @type {String} url
       */
      url: {
        setter: function(v) {
          setControllerAttr(this.get('uploaderType'), 'url', v);
          return v;
        }
      },
      /**
       * 文件上传时，附加的数据
       * @type {Object} data
       */
      data: {
        setter: function(v) {
          setControllerAttr(this.get('uploaderType'), 'data', v);
          return v;
        }
      },
      /**
       * 上传组件的上传对列
       * @type {BUI.Uploader.Queue}
       */
      queue: {
        value: {},
        shared: false
      },
      /**
       * 上传结果的模板，可根据上传状态的不同进行设置，没有时取默认的
       * @type {Object}
       * 
       * ** 默认定义的模板结构 **
       * <pre><code>
       * 
       * 'default': '<div class="default">{name}</div>',
       * 'success': '<div data-url="{url}" class="success">{name}</div>',
       * 'error': '<div class="error"><span title="{name}">{name}</span><span class="uploader-error">{msg}</span></div>',
       * 'progress': '<div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div>'
       * 
       * </code></pre>
       */
      resultTpl: {
        setter: function(v) {
          setControllerAttr(this.get('queue'), 'resultTpl', v);
          return v;
        }
      },
      /**
       * 选中文件后是否自动上传
       * @type {Boolean}
       * @default true
       */
      autoUpload: {
        value: true
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
      }
    }
  }, {
    xclass: 'uploader'
  });

  return Uploader;

});
