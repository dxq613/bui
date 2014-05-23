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
define('bui/uploader/button/filter',['bui/common'], function(require){

  var BUI = require('bui/common');

  /**
   * @ignore
   * @class  BUI.Uploader.Filter
   * @private
   */

  var filter =  {
    msexcel: {
      type: "application/msexcel",
      ext: '.xls,.xlsx'
    },
    msword: {
      type: "application/msword",
      ext: '.doc,.docx'
    },
    // {type: "application/pdf"},
    // {type: "application/poscript"},
    // {type: "application/rtf"},
    // {type: "application/x-zip-compressed"},
    // {type: "audio/basic"},
    // {type: "audio/x-aiff"},
    // {type: "audio/x-mpeg"},
    // {type: "audio/x-pn/},realaudio"
    // {type: "audio/x-waw"},
    // image: {
    //   type: "image/*",
    //   ext: '.gif,.jpg,.png,.bmp'
    // },
    gif: {
      type: "image/gif",
      ext: '.gif'
    },
    jpeg: {
      type: "image/jpeg",
      ext: '.jpg'
    },
    // {type: "image/tiff"},
    bmp: {
      type: "image/x-ms-bmp",
      ext: '.bmp'
    },
    //{type: "image/x-photo-cd"},
    png: {
      type: "image/png",
      ext: '.png'
    }
    // {type: "image/x-portablebitmap"},
    // {type: "image/x-portable-greymap"},
    // {type: "image/x-portable-pixmap"},
    // {type: "image/x-rgb"},
    // {type: "text/html"},
    // {type: "text/plain"},
    // {type: "video/quicktime"},
    // {type: "video/x-mpeg2"},
    // {type: "video/x-msvideo"}
  }

  return {
    _getValueByDesc: function(desc, key){
      var value = [];
      if(BUI.isString(desc)){
        desc = desc.split(',');
      }
      if(BUI.isArray(desc)){
        BUI.each(desc, function(v, k){
          var item = filter[v];
          item && item[key] && value.push(item[key]);
        });
      }
      return value.join(',');
    },
    getTypeByDesc: function(desc){
      return this._getValueByDesc(desc, 'type');
    },
    getExtByDesc: function(desc){
      return this._getValueByDesc(desc, 'ext');
    },
    getTypeByExt: function(ext){
      var type = [];
      if(BUI.isString(ext)){
        ext = ext.split(',');
      };
      if(BUI.isArray(ext)){
        BUI.each(ext, function(e){
          BUI.each(filter, function(item, desc){
            if(BUI.Array.indexOf(e, item.ext.split(',')) > -1){
              type.push(item.type);
            }
          });
        });
      };
      return type.join(',');
    }
  }
});
/**
 * @ignore
 * @fileoverview 文件上传按钮的基类
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/

define('bui/uploader/button/base', ['bui/common', './filter'], function(require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    Filter = require('bui/uploader/button/filter'),
    PREFIX = BUI.prefix,
    CLS_UPLOADER = PREFIX + 'uploader',
    CLS_UPLOADER_BUTTON = CLS_UPLOADER + '-button',
    CLS_UPLOADER_BUTTON_TEXT = CLS_UPLOADER_BUTTON + '-text';


  var ButtonView = Component.View.extend({
    _uiSetText: function (v) {
      var _self = this,
        text = _self.get('text'),
        textCls = _self.get('textCls'),
        textEl = _self.get('el').find('.' + textCls);
      textEl.text(text);
    }
  },{
    ATTRS: {
    }
  },{
    xclass: 'uploader-button-view'
  });


  /**
   * 文件上传按钮的基类
   * @class BUI.Uploader.Button
   * @extends BUI.Component.Controller
   */
  var Button = Component.Controller.extend({
    
    getFilter: function(v){
      if(v){
        var desc = [],
          ext = [],
          type = [];
        if(v.desc){
          desc.push(v.desc);
          ext.push(Filter.getExtByDesc(v.desc));
          type.push(Filter.getTypeByDesc(v.desc));
        }
        if(v.ext){
          ext.push(v.ext);
          type.push(Filter.getTypeByExt(v.ext));
        }
        if(v.type){

        }
        return {
          desc: desc.join(','),
          ext: ext.join(','),
          type: type.join(',')
        }
      }
    }
  },{
    ATTRS: {
      /**
       * 按钮的样式
       * @protected
       * @type {String}
       */
      buttonCls: {
        value: CLS_UPLOADER_BUTTON + '-wrap',
        view: true
      },
      /**
       * 文本的样式
       * @protected
       * @type {String}
       */
      textCls: {
        value: CLS_UPLOADER_BUTTON_TEXT,
        view: true
      },
      /**
       * 显示的文本
       * @type {String}
       */
      text: {
        view: true,
        value: '上传文件'
      },
      /**
       * 上传时，提交文件的name值
       * @type String
       * @default "Filedata"
       */
      name: {
        value: 'fileData'
      },
      tpl: {
        view: true,
        value: '<a href="javascript:void(0);" class="' + CLS_UPLOADER_BUTTON + '-wrap' + '"><span class="' + CLS_UPLOADER_BUTTON_TEXT + '">{text}</span></a>'
      },
      /**
       * 是否可用,false为可用
       * @type Boolean
       * @default false
       */
      disabled : {
        value : false
      },
      /**
       * 是否开启多选支持
       * @type Boolean
       * @default true
       */
      multiple : {
        value : true
      },
      /**
       * 文件过滤
       * @type Array
       * @default []
       */
      filter : {
        shared : false,
        value : []
      },
      events: {
        value: {
          /**
           * 选中文件时
           * @event
           * @param {Object} e 事件对象
           * @param {Array} e.files 选中的文件
           */
          'change': false
        }
      },
      xview: {
        value: ButtonView
      }
    }
  },{
    xclass: 'uploader-button'
  });

  Button.View = ButtonView;

  return Button;
});
/**
 * @ignore
 * @fileoverview 文件上传按钮,使用input[type=file]
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/button/htmlButton', ['bui/uploader/file', 'bui/uploader/button/base'], function(require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    File = require('bui/uploader/file'),
    ButtonBase = require('bui/uploader/button/base'),
    UA = BUI.UA;

  /**
   * 文件上传按钮，ajax和iframe上传方式使用,使用的是input[type=file]
   * @class BUI.Uploader.Button.HtmlButton
   * @extends BUI.Uploader.Button
   */
  var HtmlButton = ButtonBase.extend({
    renderUI: function(){
      var _self = this;
      _self._createInput();
    },
    /**
     * 创建隐藏的表单上传域
     * @private
     * @return {HTMLElement} 文件上传域容器
     */
    _createInput: function() {
      var _self = this,
        buttonCls = _self.get('buttonCls'),
        buttonEl = _self.get('el').find('.' + buttonCls),
        inputTpl = _self.get('inputTpl'),
        name = _self.get('name'),
        fileInput;

      inputTpl = BUI.substitute(inputTpl, {
        name: name
      });

      buttonEl.append(inputTpl);

      fileInput = buttonEl.find('input');

      //TODO:IE6下只有通过脚本和内联样式才能控制按钮大小
      if(UA.ie == 6){
        fileInput.css('fontSize','400px');
      }
      _self._bindChangeHandler(fileInput);

      _self.set('fileInput', fileInput);

      //因为每选中一次文件后，input[type=file]都会重新生成一遍，所以需要重新设置这些属性
      _self._uiSetMultiple(_self.get('multiple'));
      _self._uiSetDisabled(_self.get('disabled'));
      _self._uiSetFilter(_self.get('filter'));
    },
    /**
     * 绑定input[type=file]的文件选中事件
     */
    _bindChangeHandler: function(fileInput) {
      var _self = this;
      //上传框的值改变后触发
      $(fileInput).on('change', function(ev){
        var value = $(this).val(),
          oFiles = ev.target.files,
          files = [];
          
        //IE取不到files
        if(oFiles){
          BUI.each(oFiles, function(v){
            files.push(File.create({'name': v.name, 'type': v.type, 'size': v.size, file:v, input: fileInput}));
          });
        }else{
          files.push(File.create({'name': value, input: fileInput}));
        }
        _self.fire('change', {
          files: files,
          input: this
        });
        _self.reset();
      });
    },
    reset: function () {
      var _self = this,
        fileInput = _self.get('fileInput');

      //移除表单上传域容器
      fileInput.parent().remove();
      _self.set('fileInput', null);
      //重新创建表单上传域
      _self._createInput();
      return _self;
    },
    /**
     * 设置上传组件的禁用
     * @ignore
     * @param {Boolean} multiple 是否禁用
     * @return {Boolean}
     */
    _uiSetMultiple : function(multiple){
      var _self = this,
        fileInput = _self.get('fileInput');

      if(!fileInput || !fileInput.length){
        return false;
      };
      if(multiple){
        fileInput.attr('multiple', 'multiple');
      }
      else{
        fileInput.removeAttr('multiple');
      }
      return multiple;
    },
    /**
     * @protected
     * @ignore
     */
    _uiSetDisabled: function(v){
      var _self = this,
        fileInput = _self.get('fileInput');
      if (v) {
        fileInput.hide();
      }
      else{
        fileInput.show();
      }
    },
    /**
     * 设置上传文件的类型
     * @ignore
     * @protected
     * @param {*} filter 可上传文件的类型
     */
    _uiSetFilter: function(v){
      var _self = this,
        fileInput = _self.get('fileInput'),
        filter = _self.getFilter(v);
      if(!fileInput || !fileInput.length){
        return false;
      };
      //accept是html5的属性，所以ie8以下是不支持的
      filter.type && fileInput.attr('accept', filter.type);
      return filter;
    },
    _uiSetName: function(v){
      $(this.get('fileInput')).attr('name', v)
    }
  },{
    ATTRS: {
      /**
       * 隐藏的表单上传域的模板
       * @type String
       */
      inputTpl: {
        view: true,
        value: '<div class="file-input-wrapper"><input type="file" name="{name}" hidefocus="true" class="file-input" /></div>'
      },
      /**
       * 对应的表单上传域
       * @type {jQuery}
       */
      fileInput: {
      }
    }
  }, {
    xclass: 'uploader-htmlButton'
  });

  return HtmlButton;

});
/**
 * @ignore
 * @fileoverview flash上传按钮
 * @author: zengyue.yezy
 **/
define('bui/uploader/button/swfButton',['bui/common', 'bui/uploader/file', './base','./swfButton/ajbridge'], function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    File = require('bui/uploader/file'),
    ButtonBase = require('bui/uploader/button/base'),
    baseUrl = getBaseUrl(),
    SWF = require('bui/uploader/button/swfButton/ajbridge');

  function getBaseUrl(){
    if(window.seajs){
      return seajs.pluginSDK ? seajs.pluginSDK.util.loaderDir : seajs.data.base;
    }
    else if(window.KISSY){
      return KISSY.Config.packages['bui'].base;
    }
  }

  /**
   * 文件上传按钮，flash上传方式使用,使用的是flash
   * @class BUI.Uploader.Button.SwfButton
   * @extends BUI.Uploader.Button
   */
  var SwfButton = ButtonBase.extend({
    renderUI: function(){
      var _self = this;
      _self._initSwfUploader();
    },
    bindUI: function(){
      var _self = this,
        swfUploader = _self.get('swfUploader');

      swfUploader.on('contentReady', function(ev){
        _self.fire('swfReady', {swfUploader: swfUploader});
        swfUploader.on('fileSelect', function(ev){
          var fileList = ev.fileList,
            files = [];
          BUI.each(fileList, function(file){
            files.push(File.create(file));
          });
          _self.fire('change', {files: files});
        });

      });
    },
    syncUI: function(){
      var _self = this,
        swfUploader = _self.get('swfUploader');
      //因为swf加载是个异步的过程，所以加载完后要同步下属性
      swfUploader.on('contentReady', function(ev){
        _self._uiSetMultiple(_self.get('multiple'));
        _self._uiSetFilter(_self.get('filter'));
      });
    },
    _initSwfUploader: function(){
      var _self = this,
        buttonCls = _self.get('buttonCls'),
        buttonEl = _self.get('el').find('.' + buttonCls),
        flashCfg = _self.get('flash'),
        flashUrl = _self.get('flashUrl'),
        swfTpl = _self.get('swfTpl'),
        swfEl = $(swfTpl).appendTo(buttonEl),
        swfUploader;
      BUI.mix(flashCfg, {
        render: swfEl,
        src: flashUrl
      });
      swfUploader = new SWF(flashCfg);
      _self.set('swfEl', swfEl);
      _self.set('swfUploader', swfUploader);
    },
    _uiSetMultiple: function(v){
      var _self = this,
        swfUploader = _self.get('swfUploader');
      swfUploader && swfUploader.multifile(v);
      return v;
    },
    _uiSetDisabled: function(v){
      var _self = this,
        swfEl = _self.get('swfEl');
      if(v){
        swfEl.hide();
      }
      else{
         swfEl.show();
      }
      return v;
    },
    _convertFilter: function(v){
      var desc = v.desc,
        ext = [];
      BUI.each(v.ext.split(','), function(item){
        item && ext.push('*' + item);
      });
      v.ext = ext.join(';');
      return v;
    },
    _uiSetFilter: function(v){
      var _self = this,
        swfUploader = _self.get('swfUploader'),
        filter = _self._convertFilter(_self.getFilter(v));
      //flash里需要一个数组
      // console.log(BUI.JSON.stringify(filter));
      swfUploader && swfUploader.filter([filter]);
      return v;
    }
  },{
    ATTRS: {
      swfEl:{
      },
      swfUploader:{
      },
      /**
       * 上传uploader.swf的路径，默认为bui/uploader/uploader.swf
       * @type {String} url
       */
      flashUrl:{
        value: baseUrl + 'uploader/uploader.swf'
      },
      /**
       * flash的配置参数，一般不需要修改
       * @type {Object}
       */
      flash:{
        value:{
          params:{
            allowscriptaccess: 'always',
            bgcolor:"#fff",
            wmode:"transparent",
            flashvars: {
              //手型
              hand:true,
              //启用按钮模式,激发鼠标事件
              btn:true,
              //这里flash全局的回调函数
              jsEntry: 'BUI.AJBridge.eventHandler'
            }
          }
        },
        shared: false
      },
      swfTpl:{
        view: true,
        value: '<div class="uploader-button-swf"></div>'
      }
    }
  }, {
    xclass: 'uploader-swfButton'
  });

  return SwfButton;
});
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
/**
 * @fileoverview ajax方案上传
 * @author
 * @ignore
 **/
define('bui/uploader/type/ajax', ['./base'], function(require) {
    var EMPTY = '', LOG_PREFIX = '[uploader-Ajax]:';

    var UploadType = require('bui/uploader/type/base');

    
    /*function isSubDomain(hostname){
        return win.location.host === doc.domain;
    }

    function endsWith (str, suffix) {
        var ind = str.length - suffix.length;
        return ind >= 0 && str.indexOf(suffix, ind) == ind;
    }*/

    /**
     * @class BUI.Uploader.UploadType.Ajax
     * ajax方案上传
     * @extends BUI.Uploader.UploadType
     */
    function AjaxType(config) {
        var self = this;
        //调用父类构造函数
        AjaxType.superclass.constructor.call(self, config);
    }

    //继承于Base，属性getter和setter委托于Base处理
    BUI.extend(AjaxType, UploadType,{
        /**
         * 上传文件
         * @param {Object} File
         * @return {BUI.Uploader.UploadType.Ajax}
         * @chainable
         */
        upload : function(file) {
            //不存在文件信息集合直接退出
            if (!file || !file.file) {
                BUI.log(LOG_PREFIX + 'upload()，fileData参数有误！');
                return false;
            }
            var self = this;
            self.set('file', file);
            self.fire('start', {file: file});
            self._setFormData();
            self._addFileData(file.file);
            self.send();
            return self;
        },
        /**
         * 停止上传
         * @return {BUI.Uploader.UploadType.Ajax}
         * @chainable
         */
        cancel : function() {
            var self = this,
                xhr = self.get('xhr'),
                file = self.get('file');
            //中止ajax请求，会触发error事件
            if(xhr){
                xhr.abort();
                self.fire('cancel', {file: file});
            }
            self.set('file', null);
            return self;
        },
        /**
         * 发送ajax请求
         * @return {BUI.Uploader.UploadType.Ajax}
         * @chainable
         */
        send : function() {
            var self = this,
                //服务器端处理文件上传的路径
                url = self.get('url'),
                data = self.get('formData'),
                file = self.get('file');
            var xhr = new XMLHttpRequest();
            //TODO:如果使用onProgress存在第二次上传不触发progress事件的问题
            xhr.upload.addEventListener('progress',function(ev){
                self.fire('progress', { 'loaded': ev.loaded, 'total': ev.total });
            });
            xhr.onload = function(ev){
                var result = self._processResponse(xhr.responseText);
                self.fire('complete', {result: result, file: file});
            };
            xhr.onerror = function(ev){
                self.fire('error', {file: file});
            }
            xhr.open("POST", url, true);
            xhr.send(data);
            // 重置FormData
            self._setFormData();
            self.set('xhr',xhr);
            return self;
        },
        reset: function(){
        },
        /**
         * 设置FormData数据
         * @private
         */
        _setFormData:function(){
            var self = this;
            try{
            	self.set('formData', new FormData());
                self._processData();
            }catch(e){
            	BUI.log(LOG_PREFIX + 'something error when reset FormData.');
            	BUI.log(e, 'dir');
           }
        },
        /**
         * 处理传递给服务器端的参数
         */
        _processData : function() {
            var self = this,data = self.get('data'),
                formData = self.get('formData');
            //将参数添加到FormData的实例内
            BUI.each(data, function(val, key) {
                formData.append(key, val);
            });
            self.set('formData', formData);
        },
        /**
         * 将文件信息添加到FormData内
         * @param {Object} file 文件信息
         */
        _addFileData : function(file) {
            if (!file) {
                BUI.log(LOG_PREFIX + '_addFileData()，file参数有误！');
                return false;
            }
            var self = this,
                formData = self.get('formData'),
                fileDataName = self.get('fileDataName');
            formData.append(fileDataName, file);
            self.set('formData', formData);
        }
    }, {ATTRS :{
        /**
         * 表单数据对象
         */
        formData: {
        },
        xhr: {
        },
        events: {
            value: {
                /**
                 * 上传正在上传时
                 * @event
                 * @param {Object} e 事件对象
                 * @param {Number} total 文件的总大小
                 * @param {Number} loaded 已经上传的大小
                 */
                progress: false
            }
        }//,
        // subDomain: {
        //     value: {
        //         proxy: '/sub_domain_proxy.html'
        //     }
        // }
    }
    });
    return AjaxType;
});
/**
 * @ignore
 * @fileoverview flash上传方案
 * @author 
 **/
define('bui/uploader/type/flash',['./base'], function (require) {
    var LOG_PREFIX = '[uploader-Flash]:';

    var UploadType = require('bui/uploader/type/base');

    //获取链接绝对路径正则
    var URI_SPLIT_REG = new RegExp('^([^?#]+)?(?:\\?([^#]*))?(?:#(.*))?$'),
        HOSTNAME_SPLIT_REG = new RegExp('^(?:([\\w\\d+.-]+):)?(?://([\\w\\d\\-\\u0100-\\uffff.+%]*))?.*$');

    /**
     * @class BUI.Uploader.UploadType.Flash
     * flash上传方案
     * 使用时要确认flash与提交的url是否跨越，如果跨越则需要设置crossdomain.xml
     * @extends BUI.Uploader.UploadType
     */
    function FlashType(config) {
        var _self = this;
        //调用父类构造函数
        FlashType.superclass.constructor.call(_self, config);
    }

    BUI.extend(FlashType, UploadType, {
        /**
         * 初始化
         */
        _initSwfUploader:function () {
            var _self = this, swfUploader = _self.get('swfUploader');
            if(!swfUploader){
                BUI.log(LOG_PREFIX + 'swfUploader对象为空！');
                return false;
            }
            //初始化swf时swf已经ready，所以这里直接fire swfReady事件
            _self.fire('swfReady');

            //测试是否存在crossdomain.xml
            _self._hasCrossdomain();

            //监听开始上传事件
            swfUploader.on('uploadStart', function(ev){
                var file = _self.get('file');
                _self.fire('start', {file: file});
            });
            //监听文件正在上传事件
            swfUploader.on('uploadProgress', function(ev){
                BUI.mix(ev, {
                    //已经读取的文件字节数
                    loaded:ev.bytesLoaded,
                    //文件总共字节数
                    total : ev.bytesTotal
                });
                BUI.log(LOG_PREFIX + '已经上传字节数为：' + ev.bytesLoaded);
                _self.fire('progress', { 'loaded':ev.loaded, 'total':ev.total });
            });
            //监听文件上传完成事件
            swfUploader.on('uploadCompleteData', function(ev){
                var file = _self.get('file'),
                    result = _self._processResponse(ev.data);
                _self.fire('complete', {result: result, file: file});
                _self.set('file', null);
            });
            //监听文件失败事件
            swfUploader.on('uploadError',function(){
                var file = _self.get('file');
                _self.fire('error', {file: file});
                _self.set('file', null);
            });
        },
        /**
         * 上传文件
         * @param {String} id 文件id
         * @return {BUI.Uploader.UploadType.Flash}
         * @chainable
         */
        upload:function (file) {
            var _self = this,
                swfUploader = _self.get('swfUploader'),
                url = _self.get('url'),
                method = 'POST',
                data = _self.get('data'),
                name = _self.get('fileDataName');
            if(!file){
                return;
            }
            _self.set('file', file);
            swfUploader.upload(file.id, url, method, data, name);
            return _self;
        },
        /**
         * 停止上传文件
         * @return {BUI.Uploader.UploadType.Flash}
         * @chainable
         */
        cancel: function () {
            var _self = this,
                swfUploader = _self.get('swfUploader'),
                file = _self.get('file');
            if(file){
                swfUploader.cancel(file.id);
                _self.fire('cancel', {file: file});
                _self.set('file', null);
            }
            return _self;
        },
        /**
         * 应用是否有flash跨域策略文件
         * @private
         * 2014-01-13 应该判断swf的路径上提交上传接口的路径是否同域
         */
        _hasCrossdomain: function(){
            var _self = this,

                // http://g.tbcdn.cn/fi/bui/upload.php => ['http://g.tbcdn.cn/fi/bui/upload.php', 'http', 'g.tbcdn.cn']
                url = _self.get('url').match(HOSTNAME_SPLIT_REG) || [],
                flashUrl = _self.get('swfUploader').get('src').match(HOSTNAME_SPLIT_REG) || [],
                urlDomain = url[2],
                flashUrlDomain = flashUrl[2];

            //不同域时才去校验crossdomain
            if(urlDomain && flashUrlDomain && urlDomain !== flashUrlDomain){
                $.ajax({
                    url: url[1] + '://' + urlDomain + '/crossdomain.xml',
                    dataType:"xml",
                    error:function(){
                       BUI.log('缺少crossdomain.xml文件或该文件不合法！');
                    }
                });
            }
        }
    }, {ATTRS:{
        uploader: {
            setter: function(v){
                var _self = this;
                if(v && v.isController){
                    //因为flash上传需要依赖swfButton，所以是要等flash加载完成后才可以初始化的
                    var swfButton = v.get('button');
                    swfButton.on('swfReady', function(ev){
                        _self.set('swfUploader', ev.swfUploader);
                        _self._initSwfUploader();
                    });
                }
            }
        },
        /**
         * 服务器端路径，留意flash必须是绝对路径
         */
        url:{
            setter: function(v){
                var reg = /^http/;
                //不是绝对路径拼接成绝对路径
                if(!reg.test(v)){
                    //获取前面url部份
                    //修复下如下链接问题：http://a.b.com/a.html?a=a/b/c#d/e/f => http://a.b.com/a.html
                    var href = location.href.match(URI_SPLIT_REG) || [],
                        path = href[1] || '',
                        uris = path.split('/'),
                        newUris;
                    newUris  = BUI.Array.filter(uris,function(item,i){
                        return i < uris.length - 1;
                    });
                    v = newUris.join('/') + '/' + v;
                }
                return v;
            }
        },
        /**
         * ajbridge的uploader组件的实例，必须参数
         */
        swfUploader:{},
        /**
         * 正在上传的文件id
         */
        uploadingId : {},
        /**
         * 事件列表
         */
        events:{
            value: {
                //swf文件已经准备就绪
                swfReady: false,
                /**
                 * 上传正在上传时
                 * @event
                 * @param {Object} e 事件对象
                 * @param {Number} total 文件的总大小
                 * @param {Number} loaded 已经上传的大小
                 */
                progress: false
            }
        }
    }});
    return FlashType;
});
/**
 * @fileoverview iframe方案上传
 * @ignore
 **/
define('bui/uploader/type/iframe',['./base'], function(require) {
    var ID_PREFIX = 'bui-uploader-iframe-';

    var UploadType = require('bui/uploader/type/base');
    /**
     * @class BUI.Uploader.UploadType.Iframe
     * iframe方案上传，全浏览器支持
     * @extends BUI.Uploader.UploadType
     *
     */
    function IframeType(config) {
        var _self = this;
        //调用父类构造函数
        IframeType.superclass.constructor.call(_self, config);
    }

    //继承于Base，属性getter和setter委托于Base处理
    BUI.extend(IframeType, UploadType,{
        /**
         * 上传文件
         * @param {HTMLElement} fileInput 文件input
         */
        upload : function(file) {
            var _self = this,
                input = file.input,
                form;
            if (!file){
                return false
            };
            _self.fire('start', {file: file});
            _self.set('file', file);
            _self.set('fileInput', input);
            //创建iframe和form
            _self._create();
            form = _self.get('form');
            //提交表单到iframe内
            form && form[0].submit();
        },
        /**
         * 取消上传
         * @return {BUI.Uploader.UploadType.Iframe}
         */
        cancel : function() {
            var self = this,iframe = self.get('iframe');
            //iframe.attr('src', 'javascript:"<html></html>";');
            self.reset();
            self.fire('cancel');
            // self.fire('error', {status : 'abort',msg : '上传失败，原因：abort'});
            return self;
        },
        /**
         * 将参数数据转换成hidden元素
         * @param {Object} data 对象数据
         * @return {String} hiddenInputHtml hidden元素html片段
         */
        dataToHidden : function(data) {
            if (!$.isPlainObject(data) || $.isEmptyObject(data)) return '';
            var self = this,
                hiddenInputHtml = [],
                //hidden元素模板
                tpl = self.get('tpl'),
                hiddenTpl = tpl.HIDDEN_INPUT;
            if (!BUI.isString(hiddenTpl)) return '';
            for (var k in data) {
                hiddenInputHtml.push(BUI.substitute(hiddenTpl, {'name' : k,'value' : data[k]}));
            }
            return hiddenInputHtml.join();
        },
        /**
         * 创建一个空的iframe，用于文件上传表单提交后返回服务器端数据
         * @return {NodeList}
         */
        _createIframe : function() {
            var self = this,
                //iframe的id
                id = ID_PREFIX + BUI.guid(),
                //iframe模板
                tpl = self.get('tpl'),
                iframeTpl = tpl.IFRAME,
                existIframe = self.get('iframe'),
                iframe;
            //先判断是否已经存在iframe，存在直接返回iframe
            if (!$.isEmptyObject(existIframe)) return existIframe;

            //创建处理上传的iframe
            iframe = $(BUI.substitute(tpl.IFRAME, { 'id' : id }));
            //监听iframe的load事件
            $('body').append(iframe);
            iframe.on('load', function(ev){
                self._iframeLoadHandler(ev);
            });
            self.set('id',id);
            self.set('iframe', iframe);
            return iframe;
        },
        /**
         * iframe加载完成后触发（文件上传结束后）
         */
        _iframeLoadHandler : function(ev) {
            var self = this,iframe = ev.target,
                doc = iframe.contentDocument || window.frames[iframe.id].document,
                result;
            if (!doc || !doc.body) {
                self.fire('error', {msg : '服务器端返回数据有问题！'});
                return false;
            }
            var response = doc.body.innerHTML;
            //输出为直接退出
            if(response == ''){
                self.fire('error');
                return;
            };
            result = self._processResponse(response);

            self.fire('complete', {result: result, file: self.get('file')});
            self.reset();
        },
        /**
         * 创建文件上传表单
         * @return {NodeList}
         */
        _createForm : function() {
            var self = this,
                //iframe的id
                id = self.get('id'),
                //form模板
                tpl = self.get('tpl'),formTpl = tpl.FORM,
                //想要传送给服务器端的数据
                data = self.get('data'),
                //服务器端处理文件上传的路径
                action = self.get('url'),
                fileInput = self.get('fileInput'),
                hiddens,
                form;
            if (!BUI.isString(formTpl)) {
                return false;
            }
            if (!BUI.isString(action)) {
                return false;
            }
            hiddens = self.dataToHidden(data);
            hiddens += self.dataToHidden({"type":"iframe"});
            form = BUI.substitute(formTpl, {'action' : action,'target' : id,'hiddenInputs' : hiddens});
            //克隆文件域，并添加到form中
            form = $(form).append(fileInput);
            $('body').append(form);
            self.set('form', form);
            return form;
        },
        /**
         * 创建iframe和form
         */
        _create : function() {
            var _self = this,
                iframe = _self._createIframe(),
                form = _self._createForm();

            _self.fire('create', {iframe : iframe,form : form});
        },
        /**
         * 移除表单
         */
        _remove : function() {
            var self = this,form = self.get('form');
            if(!form)return false;
            //移除表单
            form.remove();
            //重置form属性
            self.set('form', null);
            self.fire('remove', {form : form});
        },
        reset: function(){
            var _self = this;
            _self._remove();
            _self.set('file', null);
        }
    }, {ATTRS : {
        /**
         * iframe方案会用到的html模板，一般不需要修改
         * @type {String}
         * @default
         * {
         *   IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
         *   FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}">{hiddenInputs}</form>',
         *   HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
         * }
         */
        tpl: {
            value: {
                IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
                FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}" style="visibility: hidden;">{hiddenInputs}</form>',
                HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
            }
        },
        /**
         * 只读，创建的iframeid,id为组件自动创建
         * @type {String}
         * @default  'ks-uploader-iframe-' +随机id
         */
        id: {value : ID_PREFIX + BUI.guid()},
        /**
         * iframe
         */
        iframe: {value : {}},
        form: {},
        fileInput: {},
        events: {
            value: {
                /**
                 * 创建iframe和form后触发
                 * @event
                 * @param {Object} e 事件对象
                 */
                create: false,
                /**
                 * 删除form后触发
                 * @event
                 * @param {Object} e 事件对象
                 */
                remove: false
            }
        }
    }});

    return IframeType;
});
/**
 * @fileoverview 异步文件上传组件的文件对像
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 * @ignore
 **/
define('bui/uploader/file', ['bui/common'], function (require) {

  var BUI = require('bui/common');

  /**
   * 获取文件的id
   */
  function getFileId (file) {
    return file.id || BUI.guid('bui-uploader-file');
  }

  /**
   * 获取文件名称
   * @param {String} path 文件路径
   * @return {String}
   * @ignore
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
  }

  /**
   * 获取文件扩展名
   * @param {String} filename 文件名
   * @return {String}
   * @private
   * @ignore
   */
  function getFileExtName(filename){
    var result = /\.[^\.]+$/.exec(filename) || [];
    return result.join('').toLowerCase();
  }

  /**
   * 转换文件大小字节数
   * @param {Number} bytes 文件大小字节数
   * @return {String} 文件大小
   * @private
   * @ignore
   */
  function convertByteSize(bytes) {
    var i = -1;
    do {
      bytes = bytes / 1024;
      i++;
    } while (bytes > 99);
    return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
  }

  return {
    // /**
    //  * 创建一个上传对列里面的内容对象
    //  */
    // getFileAttr: function(file){
    //   return {
    //     name: file.name,
    //     size: file.size,
    //     type: file.type,
    //     textSize: file.textSize,
    //     ext: file.extName,
    //     id: file.id
    //   }
    // },
    create: function(file){
      file.id = file.id || BUI.guid('bui-uploader-file');
      // 去掉文件的前面的路径，获取一个纯粹的文件名
      file.name = getFileName(file.name);
      file.ext = getFileExtName(file.name);
      file.textSize = convertByteSize(file.size);
      
      file.isUploaderFile = true;

      //file.attr = this.getFileAttr(file);

      return file;
    }
  };

});
/**
 * @ignore
 * @fileoverview 文件上传队列列表显示和处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/queue', ['bui/common', 'bui/list'], function (require) {

  var BUI = require('bui/common'),
    SimpleList = require('bui/list/simplelist');

  var CLS_QUEUE = BUI.prefix + 'queue',
    CLS_QUEUE_ITEM = CLS_QUEUE + '-item';
  
  /**
   * 上传文件的显示队列
   * @class BUI.Uploader.Queue
   * @extends BUI.List.SimpleList
   * <pre><code>
   *
   * BUI.use('bui/uploader', function(Uploader){
   * });
   * 
   * </code></pre>
   */
  var Queue = SimpleList.extend({
    bindUI: function () {
      var _self = this,
        el = _self.get('el'),
        delCls = _self.get('delCls');

      el.delegate('.' + delCls, 'click', function (ev) {
          var itemContainer = $(ev.target).parents('.bui-queue-item'),
            item = _self.getItemByElement(itemContainer);

        if(_self.fire('beforeremove', {item: item}) !== false) {
          _self.removeItem(item);
        }
      });
    },
    /**
     * 从队列中删除一项
     * @param  {Object} item
     */
    removeItem: function(item){
      var _self = this,
        uploader = _self.get('uploader');

      uploader && uploader.cancel && uploader.cancel(item);
      Queue.superclass.removeItem.call(_self, item);
    },
    /**
     * 更新文件上传的状态
     * @param  {Object} item
     * @param  {String} status  上传的状态
     * @param  {HTMLElement} element 这一项对应的dom元素
     */
    updateFileStatus: function(item, status, element){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      element = element || _self.findElement(item);
        
      BUI.each(itemStatusFields, function(v,k){
        _self.setItemStatus(item,k,false,element);
      });

      _self.setItemStatus(item,status,true,element);
      _self._setResultTpl(item, status);
      _self.updateItem(item);
    },
    /**
     * 根据上传的状态设置上传列表的模板
     * @private
     * @param {Object} item
     * @param {String} status 状态名称
     */
    _setResultTpl: function(item, status){
      var _self = this,
        resultTpl = _self.get('resultTpl'),
        itemTpl = resultTpl[status] || resultTpl['default'],
        tplData = BUI.mix(item, item.result);
      item.resultTpl = BUI.substitute(itemTpl, tplData);
    },
    /**
     * 获取文件的当前状态
     * @param {Object} item
     * @return {String} status 状态名称
     */
    status: function(item){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields'),
        status;

      BUI.each(itemStatusFields, function(v, k){
        if (item[v]) {
          status = v;
          return false;
        }
      });
      return status;
    }
  }, {
    ATTRS: {
      itemTpl: {
        value: '<li>{resultTpl} <span class="action"><span class="' + CLS_QUEUE_ITEM + '-del">删除</span></span></li>'
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
      resultTpl:{
        value: {
          'default': '<div class="default">{name}</div>',
          'success': '<div data-url="{url}" class="success">{name}</div>',
          'error': '<div class="error"><span title="{name}">{name}</span><span class="uploader-error">{msg}</span></div>',
          'progress': '<div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div>'
        },
        setter: function(v){
          return BUI.mix({}, this.get('resultTpl'), v);
        }
      },
      /**
       * 列表项的cls
       * @type {String}
       */
      itemCls: {
        value: CLS_QUEUE_ITEM
      },
      /**
       * 删除的cls
       * @protected
       * @type {String}
       */
      delCls: {
        value: CLS_QUEUE_ITEM + '-del'
      },
      /**
       * 列表项的状态
       * @protected
       * @type {Object}
       */
      itemStatusFields: {
        value: {
          add: 'add',
          wait: 'wait',
          start: 'start',
          progress: 'progress',
          success: 'success',
          cancel: 'cancel',
          error: 'error'
        }
      }
    }
  }, { 
    xclass: 'queue'
  });
  return Queue;

});
/**
 * @ignore
 * @fileoverview 文件上传主题的处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/theme',['bui/common'], function (require) {

  var BUI = require('bui/common');

  var themes = {};

  /**
   * 文件上传的主题设置
   * @class BUI.Uploader.Theme
   * @static
   *
   * <pre><code>
   * 默认自带的题有
   * 
   * //这个是默认的
   * theme: 'defaultTheme'
   *
   * //这个带图片预览的
   * theme: 'imageView'
   * </code></pre>
   */
  var Theme = {
    /**
     * 添加一个主题
     * @param {String} name   主题名称
     * @param {Object} config 主题的配置
     * 
     * <pre><code>
     * @example
     * // 添加一个主题模板
     * Theme.addTheme('imageView', {
     *  elCls: 'imageViewTheme',
     *  queue:{
     *    resultTpl: {
     *      'default': '&lt;div class="default"&gt;{name}&lt;/div&gt;',
     *      'success': '&lt;div class="success"&gt;&lt;img src="{url}" /&gt;&lt;/div&gt;'
     *      'error': '&lt;div class="error"&gt;&lt;span title="{name}"&gt;{name}&lt;/span&gt;&lt;span class="uploader-error"&gt;{msg}&lt;/span&gt;&lt;/div&gt;',
     *      'progress': '&lt;div class="progress"&gt;&lt;div class="bar" style="width:{loadedPercent}%"&gt;&lt;/div&gt;&lt;/div&gt;'
     *    }
     *  }
     *});
     * </code></pre>
     */
    addTheme: function(name, config){
      themes[name] = config;
    },
    /**
     * 获取一个主题
     * @param  {String} name [description]
     * @return {BUI.Uploader.Theme} 主题的配置
     */
    getTheme: function(name){
      //不能覆盖主题设置的
      return BUI.cloneObject(themes[name]);
    }
  };

  //这个默认的主题
  Theme.addTheme('default', {
    elCls: 'defaultTheme'
  });


  //带图片预览的主题
  Theme.addTheme('imageView', {
    elCls: 'imageViewTheme',
    queue:{
      resultTpl: {
        'success': '<div class="success"><img src="{url}" /></div>'
      }
    }
  });

  return Theme;

});
/**
 * @ignore
 * @fileoverview 异步文件上传的验证器
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/validator',['bui/common'], function (require) {

  var BUI = require('bui/common');


  /**
   * 异步文件上传的验证器
   * @class BUI.Uploader.Validator
   * @extend BUI.Base
   *
   * <pre><code>
   * //默认已经定义的一些规则
   * rules: {
   *   maxSize: [1024, '文件最大不能超过1M!'],
   *   minSize: [1, '文件最小不能小于1k!'],
   *   max: [5, '文件最多不能超过{0}个！'],
   *   min: [1, '文件最少不能少于{0}个!'],
   *   ext: ['.png','文件类型只能为{0}']
   * }
   * </code></pre>
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
     * @return {Boolean} 校验结果
     */
    valid: function(item){
      return this._validItem(item);
    },
    _validItem: function(item){
      var _self = this,
        rules = _self.get('rules'),
        isValid = true;

      BUI.each(rules, function(rule, name){
        isValid = isValid && _self._validRule(item, name, rule);
        return isValid;
      })
      return isValid;
    },
    _validRule: function(item, name, rule, msg){
      if(BUI.isArray(rule)){
        msg = BUI.substitute(rule[1], rule);
        rule = rule[0];
      }
      var ruleFn = Validator.getRule(name),
        validMsg = ruleFn && ruleFn.call(this, item, rule, msg),
        result = this._getResult(validMsg);

      if(result){
        item.result = result;
        return false;
      }
      return true;
    },
    /**
     * 获取校验的结果
     * @param  {String} msg
     */
    _getResult: function(msg){
      if(msg){
        return {
          msg: msg
        }
      }
    }
  });


  var ruleMap = {};

  Validator.addRule = function(name, fn){
    ruleMap[name] = fn;
  }

  Validator.getRule = function(name){
    return ruleMap[name];
  }

  //文件最大值
  Validator.addRule('maxSize', function(item, baseValue, formatMsg){
    if(item.size > baseValue * 1024){
      return formatMsg;
    }
  });

  //文件最小值
  Validator.addRule('minSize', function(item, baseValue, formatMsg){
    if(item.size < baseValue * 1024){
      return formatMsg;
    }
  });

  //上传文件的最大个数
  Validator.addRule('max', function(item, baseValue, formatMsg){
    var count = this.get('queue').getCount();
    if(count > baseValue){
      return formatMsg;
    }
  });

  //上传文件的最小个数
  Validator.addRule('min', function(item, baseValue, formatMsg){
    var count = this.get('queue').getCount();
    if(count < baseValue){
      return formatMsg;
    }
  });

  //上传文件的文件类型
  Validator.addRule('ext', function(item, baseValue, formatMsg){
    var ext = item.ext,
      baseValue = baseValue.split(',');
    if($.inArray(ext, baseValue) === -1){
      return formatMsg;
    }
  });

  return Validator;

});
/**
 * @fileoverview 文件上传的工厂类
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 * @ignore
 **/
define('bui/uploader/factory',['bui/common', './queue', './button/htmlButton', './button/swfButton', './type/ajax', './type/flash', './type/iframe'], function (require) {

  var BUI = require('bui/common'),
    Queue = require('bui/uploader/queue'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton'),
    Ajax = require('bui/uploader/type/ajax'),
    Flash = require('bui/uploader/type/flash'),
    Iframe = require('bui/uploader/type/iframe');

  /**
   * @BUI.Uploader.Factory
   * 创建上传控件的工厂类
   */
  function Factory(){

  }
  Factory.prototype = {
    /**
     * 创建上传的类型
     * @param  {String} type   上传类型
     * @param  {Object} config 配置项
     * @return {BUI.Uploader.UploadType} 类型的实例
     */
    createUploadType: function(type, config){
      if (type === 'ajax') {
        return new Ajax(config);
      }
      else if(type === 'flash'){
        return new Flash(config);
      }
      else{
        return new Iframe(config);
      }
    },
    /**
     * 创建button
     * @param  {String} type   上传类型
     * @param  {Object} config button的配置项
     * @return {BUI.Uploader.Button} button的实例
     */
    createButton: function(type, config){
      if(type === 'ajax' || type === 'iframe'){
        return new HtmlButton(config);
      }
      else{
        return new SwfButton(config);
      }
    },
    /**
     * 创建上传的对队
     * @param  {Object} config 配置项
     * @return {BUI.Uploader.Queue} 队列的实例
     */
    createQueue: function(config){
      return new Queue(config);
    }
  }

  return new Factory();

});
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
/**
 * @fileoverview 异步文件上传组件入口文件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 * @ignore
 **/
define('bui/uploader', ['bui/common', 'bui/uploader/uploader', 'bui/uploader/queue', 'bui/uploader/theme', 'bui/uploader/factory'], function (require) {

  var BUI = require('bui/common'),
    Uploader = BUI.namespace('Uploader');

  BUI.mix(Uploader, {
    Uploader: require('bui/uploader/uploader'),
    Queue: require('bui/uploader/queue'),
    Theme: require('bui/uploader/theme'),
    Factory: require('bui/uploader/factory')
  });

  return Uploader;

});
