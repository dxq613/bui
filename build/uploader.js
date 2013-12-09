/*
Copyright 2011, KISSY UI Library v1.1.5
MIT Licensed
build time: Sep 11 10:29
*/
/**
 * AJBridge Class
 * @author kingfo oicuicu@gmail.com
 */
define('bui/uploader/button/swfButton/ajbridge', function(require){
  var BUI = require('bui/common'),
    SWF = require('bui/swf');


  var instances = {};

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
     * @param {Class} C
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
 */
define('bui/uploader/button/filter', function(require){

  var BUI = require('bui/common');

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
});/**
 * @fileoverview 文件上传按钮的基类
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/

define('bui/uploader/button/base', function(require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    Filter = require('bui/uploader/button/filter'),
    PREFIX = BUI.prefix,
    CLS_UPLOADER = PREFIX + 'uploader',
    CLS_UPLOADER_BUTTON = CLS_UPLOADER + '-button',
    CLS_UPLOADER_BUTTON_TEXT = CLS_UPLOADER_BUTTON + '-text';

  /**
   * 获取文件名称
   * @param {String} path 文件路径
   * @return {String}
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
  }

  /**
   * 获取文件扩展名
   * @param {String} filename 文件名
   * @return {String}
   */
  function getFileExtName(filename){
    var result = /\.[^\.]+/.exec(filename) || [];
    return result.join('');
  }

  /**
   * 转换文件大小字节数
   * @param {Number} bytes 文件大小字节数
   * @return {String} 文件大小
   */
  function convertByteSize(bytes) {
    var i = -1;
    do {
      bytes = bytes / 1024;
      i++;
    } while (bytes > 99);
    return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
  }

  function getFileId (file) {
    return file.id || BUI.guid('bui-uploader-file');
  }


  function baseView() {
  }

  baseView.ATTRS = /** @lends Base.prototype */{
  }

  baseView.prototype = {
    _uiSetText: function (v) {
      var _self = this,
        text = _self.get('text'),
        textCls = _self.get('textCls'),
        textEl = _self.get('el').find('.' + textCls);
      textEl.text(text);
    }
  }


  function base(){

  }

  base.ATTRS = {
    buttonCls: {
      value: CLS_UPLOADER_BUTTON + '-wrap',
      view: true
    },
    textCls: {
      value: CLS_UPLOADER_BUTTON_TEXT,
      view: true
    },
    text: {
      view: true,
      value: '上传文件'
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
      value : false,
      setter : function(v) {
        this.setDisabled(v);
        return v;
      }
    },
    /**
     * 是否开启多选支持
     * @type Boolean
     * @default true
     */
    multiple : {
      value : true,
      setter : function(v){
        this.setMultiple(v);
        return v;
      }
    },
    /**
     * 文件过滤
     * @type Array
     * @default []
     */
    filter : {
      value : [],
      setter : function(v){
        this.setFilter(v);
        return v;
      }
    }
  };

  base.prototype = {
    //设置文件的扩展信息
    getExtFileData: function(file){
      var filename = getFileName(file.name),
        textSize = convertByteSize(file.size || 0),
        extName = getFileExtName(file.name),
        fileAttrs = {
          name: filename,
          size: file.size,
          type: file.type,
          textSize: textSize,
          ext: extName,
          id: getFileId(file)
        };
      return fileAttrs;
    },
    _getFile: function(file){
      var _self = this,
        fileAttrs = _self.getExtFileData(file);
      BUI.mix(file, fileAttrs);
      file.result = fileAttrs;

      return file;
    },
    setMultiple: function(v){
    },
    setDisabled: function(v){
    },
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
    },
    setFilter: function(v){
    }
  }

  base.View = baseView

  return base;

});
/**
 * @fileoverview 文件上传按钮,使用input[type=file]
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/


define('bui/uploader/button/htmlButton', function(require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    ButtonBase = require('bui/uploader/button/base'),
    UA = BUI.UA;

  

  var HtmlButtonView = Component.View.extend([ButtonBase.View], {

  },{
    ATTRS: {
    }
  });

  /**
   * @name HtmlButton
   * @class 文件上传按钮，ajax和iframe上传方式使用
   * @constructor
   */
  var HtmlButton = Component.Controller.extend([ButtonBase], {
    renderUI: function(){
      var _self = this;
      _self._createInput();
    },
    bindUI: function(){

    },
    /**
     * 创建隐藏的表单上传域
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

      _self.setMultiple(_self.get('multiple'));
      _self.setDisabled(_self.get('disabled'));
      _self.setFilter(_self.get('filter'));
    },

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
            files.push(_self._getFile({'name': v.name, 'type': v.type, 'size': v.size, file:v, input: fileInput}));
          });
        }else{
          files.push(_self._getFile({'name': value, input: fileInput}));
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
     * @param {Boolean} multiple 是否禁用
     * @return {Boolean}
     */
    setMultiple : function(multiple){
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
    setDisabled: function(v){
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
     * @param {[type]} filter 可上传文件的类型
     */
    setFilter: function(v){
      var _self = this,
        fileInput = _self.get('fileInput'),
        filter = _self.getFilter(v);
      if(!fileInput || !fileInput.length){
        return false;
      };
      //accept是html5的属性，所以ie8以下是不支持的
      filter.type && fileInput.attr('accept', filter.type);
      return filter;
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
       * @type KISSY.Node
       * @default ""
       */
      fileInput: {
      },
      /**
       * 隐藏的表单上传域的name值
       * @type String
       * @default "Filedata"
       */
      name : {
        view: true,
        value : 'Filedata',
        setter : function(v) {
            v && this.get('fileInput') && $(this.get('fileInput')).attr('name', v);
          return v;
        }
      },
      xview: {
        value: HtmlButtonView
      }
    }
  }, {
    xclass: 'uploader-htmlButton'
  });

  return HtmlButton;

});
/**
 * @fileoverview flash上传按钮
 * @author: zengyue.yezy
 **/
define('bui/uploader/button/swfButton', function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    ButtonBase = require('bui/uploader/button/base'),
    SwfUploader = require('bui/uploader/type/flash'),
    baseUrl = seajs.pluginSDK ? seajs.pluginSDK.util.loaderDir : seajs.data.base,
    SWF = require('bui/uploader/button/swfButton/ajbridge');


  var SwfButtonView = Component.View.extend([ButtonBase.View], {
  },{
    ATTRS: {
    }
  });

  var SwfButton = Component.Controller.extend([ButtonBase], {
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
            files.push(_self._getFile(file));
          });
          _self.fire('change', {files: files});
        });

        _self.setMultiple(_self.get('multiple'));
        _self.setFilter(_self.get('filter'));
      });
    },
    _initSwfUploader: function(){
      var _self = this,
        buttonCls = _self.get('buttonCls'),
        buttonEl = _self.get('el').find('.' + buttonCls),
        flashCfg = _self.get('flash'),
        flashUrl = _self.get('flashUrl'),
        swfTpl = _self.get('swfTpl'),
        swfEl = $(swfTpl),
        swfUploader;
      BUI.mix(flashCfg, {
        render: swfEl.appendTo(buttonEl),
        src: flashUrl
      });
      swfUploader = new SWF(flashCfg);
      _self.set('swfEl', swfEl);
      _self.set('swfUploader', swfUploader);
    },
    setMultiple: function(v){
      var _self = this,
        swfUploader = _self.get('swfUploader');
      swfUploader && swfUploader.multifile(v);
    },
    setDisabled: function(v){
      var _self = this,
        swfEl = _self.get('swfEl');
      if(v){
        swfEl.hide();
      }
      else{
         swfEl.show();
      }
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
    setFilter: function(v){
      var _self = this,
        swfUploader = _self.get('swfUploader'),
        filter = _self._convertFilter(_self.getFilter(v));
      //flash里需要一个数组
      swfUploader && swfUploader.filter([filter]);
      return v;
    }
  },{
    ATTRS: {
      swfUploader:{
      },
      flashUrl:{
        value: seajs.pluginSDK.config.base + 'uploader/uploader.swf'
      },
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
              jsEntry: 'BUI.AJBridge.eventHandler'
            }
          }
        }
      },
      swfTpl:{
        view: true,
        value: '<div class="uploader-button-swf"></div>'
      },
      xview: {
        value: SwfButtonView
      }
    }
  }, {
    xclass: 'uploader-swfButton'
  });

  return SwfButton;
});/**
 * @fileoverview 上传方式类的基类
 * @author 剑平（明河）<minghe36@126.com>,紫英<daxingplay@gmail.com>
 **/
define('bui/uploader/type/base',function(require) {
  /**
   * @name UploadType
   * @class 上传方式类的基类，定义通用的事件和方法，一般不直接监听此类的事件
   * @constructor
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
    }
  }

  BUI.mix(UploadType, /** @lends UploadType*/{
    /**
     * 事件列表
     */
    event : {
      //开始上传后触发
      START : 'start',
      //停止上传后触发
      CANCEL : 'cancel',
      //成功请求
      SUCCESS : 'success',
      //上传失败后触发
      ERROR : 'error'
    }
  });

  /**
   * @name UploadType#start
   * @desc  开始上传后触发
   * @event
   */
  /**
   * @name UploadType#stop
   * @desc  停止上传后触发
   * @event
   */
  /**
   * @name UploadType#success
   * @desc  上传成功后触发
   * @event
   */
  /**
   * @name UploadType#error
   * @desc  上传失败后触发
   * @event
   */
  //继承于Base，属性getter和setter委托于Base处理
  BUI.extend(UploadType, BUI.Base, /** @lends UploadType.prototype*/{
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
});/**
 * @fileoverview ajax方案上传
 * @author 剑平（明河）<minghe36@126.com>,紫英<daxingplay@gmail.com>
 **/
define('bui/uploader/type/ajax',function(require) {
    var EMPTY = '', LOG_PREFIX = '[uploader-AjaxType]:',
        win = window,
        doc = document;

    var UploadType = require('bui/uploader/type/base');

    function isSubDomain(hostname){
        return win.location.host === doc.domain;
    }

    function endsWith (str, suffix) {
        var ind = str.length - suffix.length;
        return ind >= 0 && str.indexOf(suffix, ind) == ind;
    }

    /**
     * @name AjaxType
     * @class ajax方案上传
     * @constructor
     * @requires UploadType
     */
    function AjaxType(config) {
        var self = this;
        //调用父类构造函数
        AjaxType.superclass.constructor.call(self, config);
    }

    BUI.mix(AjaxType, /** @lends AjaxType.prototype*/{
        /**
         * 事件列表
         */
        event : BUI.merge(UploadType.event, {
            PROGRESS : 'progress'
        })
    });
    //继承于Base，属性getter和setter委托于Base处理
    BUI.extend(AjaxType, UploadType, /** @lends AjaxType.prototype*/{
        /**
         * 上传文件
         * @param {Object} File
         * @return {AjaxType}
         */
        upload : function(file) {
            //不存在文件信息集合直接退出
            if (!file || !file.file) {
                BUI.log(LOG_PREFIX + 'upload()，fileData参数有误！');
                return false;
            }
            var self = this;
            self.set('file', file);
            self.fire(UploadType.event.START, {file: file});
            self._setFormData();
            self._addFileData(file.file);
            self.send();
            return self;
        },
        /**
         * 停止上传
         * @return {AjaxType}
         */
        cancel : function() {
            var self = this,
                xhr = self.get('xhr'),
                file = self.get('file');
            //中止ajax请求，会触发error事件
            if(xhr){
                xhr.abort();
                self.fire(AjaxType.event.CANCEL, {file: file});
            }
            self.set('file', null);
            return self;
        },
        /**
         * 发送ajax请求
         * @return {AjaxType}
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
                self.fire(AjaxType.event.PROGRESS, { 'loaded': ev.loaded, 'total': ev.total });
            });
            xhr.onload = function(ev){
                var result = self._processResponse(xhr.responseText);
                self.fire('complete', {result: result, file: file});
            };
            xhr.onerror = function(ev){
                self.fire(AjaxType.event.ERROR, {file: file});
            }
            xhr.open("POST", url, true);
            data.append("type", "ajax");
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
    }, {ATTRS : /** @lends AjaxType*/{
        /**
         * 表单数据对象
         */
        formData: {
        },
        data: {
        },
        xhr: {
        }//,
        // subDomain: {
        //     value: {
        //         proxy: '/sub_domain_proxy.html'
        //     }
        // }
    }
    });
    return AjaxType;
});/**
 * @fileoverview flash上传方案，基于龙藏写的ajbridge内的uploader
 * @author 剑平（明河）<minghe36@126.com>
 **/
define('bui/uploader/type/flash', function (require) {
    var LOG_PREFIX = '[uploader-FlashType]:';

    var UploadType = require('bui/uploader/type/base');

    /**
     * @name FlashType
     * @class flash上传方案，基于龙藏写的ajbridge内的uploader
     * @constructor
     * @extends UploadType
     * @requires Node
     */
    function FlashType(config) {
        var _self = this;
        //调用父类构造函数
        FlashType.superclass.constructor.call(_self, config);
        _self.isHasCrossdomain();
    }

    BUI.mix(FlashType, /** @lends FlashType.prototype*/{
        /**
         * 事件列表
         */
        event:BUI.merge(UploadType.event, {
            //swf文件已经准备就绪
            SWF_READY: 'swfReady',
            //正在上传
            PROGRESS:'progress'
        })
    });

    BUI.extend(FlashType, UploadType, /** @lends FlashType.prototype*/{
        /**
         * 初始化
         */
        _initSwfUploader:function () {
            var _self = this, swfUploader = _self.get('swfUploader');
            if(!swfUploader){
                BUI.log(LOG_PREFIX + 'swfUploader对象为空！');
                return false;
            }
            //SWF 内容准备就绪
            swfUploader.on('contentReady', function(ev){
                _self.fire(FlashType.event.SWF_READY);
            });
            //监听开始上传事件
            swfUploader.on('uploadStart', function(ev){
                var file = _self.get('file');
                _self.fire(UploadType.event.START, {file: file});
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
                _self.fire(FlashType.event.PROGRESS, { 'loaded':ev.loaded, 'total':ev.total });
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
                _self.fire(FlashType.event.ERROR, {file: file});
                _self.set('file', null);
            });
        },
        /**
         * 上传文件
         * @param {String} id 文件id
         * @return {FlashType}
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
         * @return {FlashType}
         */
        cancel: function () {
            var _self = this,
                swfUploader = _self.get('swfUploader'),
                file = _self.get('file');
            if(file){
                swfUploader.cancel(file.id);
                _self.fire(FlashType.event.CANCEL, {file: file});
                _self.set('file', null);
            }
            return _self;
        },
        reset: function(){

        },
        /**
         * 应用是否有flash跨域策略文件
         */
        isHasCrossdomain:function(){
            var domain = location.hostname;
             $.ajax({
                 url:'http://' + domain + '/crossdomain.xml',
                 dataType:"xml",
                 error:function(){
                     BUI.log('缺少crossdomain.xml文件或该文件不合法！');
                 }
             });
        }
    }, {ATTRS:/** @lends FlashType*/{
        uploader: {
            setter: function(v){
                var _self = this;
                if(v){
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
            getter:function(v){
                var reg = /^http/;
                //不是绝对路径拼接成绝对路径
                if(!reg.test(v)){
                     var href = location.href,uris = href.split('/'),newUris;
                    newUris  = BUI.Array.filter(uris,function(item,i){
                        return i < uris.length - 1;
                    });
                    v = newUris.join('/') + '/' + v;
                }
                return v;
            }
        },
        fileDataName: {
            value: 'Filedata'
        },
        /**
         * ajbridge的uploader组件的实例，必须参数
         */
        swfUploader:{},
        /**
         * 正在上传的文件id
         */
        uploadingId : {}
    }});
    return FlashType;
});/**
 * @fileoverview iframe方案上传
 * @author 剑平（明河）<minghe36@126.com>,紫英<daxingplay@gmail.com>
 **/
define('bui/uploader/type/iframe',function(require) {
    var ID_PREFIX = 'bui-uploader-iframe-';

    var UploadType = require('bui/uploader/type/base');
    /**
     * @name IframeType
     * @class iframe方案上传，全浏览器支持
     * @constructor
     * @extends UploadType
     * @param {Object} config 组件配置（下面的参数为配置项，配置会写入属性，详细的配置说明请看属性部分）
     *
     */
    function IframeType(config) {
        var _self = this;
        //调用父类构造函数
        IframeType.superclass.constructor.call(_self, config);
    }

    BUI.mix(IframeType, /**@lends IframeType*/ {
        /**
         * 会用到的html模板
         */
        tpl : {
            IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
            FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}" style="visibility: hidden;">{hiddenInputs}</form>',
            HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
        },
        /**
         * 事件列表
         */
        event : BUI.mix(UploadType.event,{
            //创建iframe和form后触发
            CREATE : 'create',
            //删除form后触发
            REMOVE : 'remove'
        })
    });

    //继承于Base，属性getter和setter委托于Base处理
    BUI.extend(IframeType, UploadType, /** @lends IframeType.prototype*/{
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
            _self.fire(IframeType.event.START, {file: file});
            _self.set('file', file);
            _self.set('fileInput', input);
            //创建iframe和form
            _self._create();
            form = _self.get('form');
            //提交表单到iframe内
            form && form[0].submit();
        },
        /**
         * 停止上传
         * @return {IframeType}
         */
        stop : function() {
            var self = this,iframe = self.get('iframe');
            iframe.attr('src', 'javascript:"<html></html>";');
            self.reset();
            self.fire(IframeType.event.STOP);
            self.fire(IframeType.event.ERROR, {status : 'abort',msg : '上传失败，原因：abort'});
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
                tpl = self.get('tpl'),hiddenTpl = tpl.HIDDEN_INPUT;
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
                errorEvent = IframeType.event.ERROR,
                doc = iframe.contentDocument || window.frames[iframe.id].document,
                result;
            if (!doc || !doc.body) {
                self.fire(errorEvent, {msg : '服务器端返回数据有问题！'});
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

            _self.fire(IframeType.event.CREATE, {iframe : iframe,form : form});
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
            self.fire(IframeType.event.REMOVE, {form : form});
        },
        reset: function(){
            var _self = this;
            _self._remove();
            _self.set('file', null);
        }
    }, {ATTRS : /** @lends IframeType.prototype*/{
        /**
         * iframe方案会用到的html模板，一般不需要修改
         * @type {}
         * @default
         * {
         IFRAME : '<iframe src="javascript:false;" name="{id}" id="{id}" border="no" width="1" height="1" style="display: none;" />',
         FORM : '<form method="post" enctype="multipart/form-data" action="{action}" target="{target}">{hiddenInputs}</form>',
         HIDDEN_INPUT : '<input type="hidden" name="{name}" value="{value}" />'
         }
         */
        tpl : {value : IframeType.tpl},
        /**
         * 只读，创建的iframeid,id为组件自动创建
         * @type String
         * @default  'ks-uploader-iframe-' +随机id
         */
        id : {value : ID_PREFIX + BUI.guid()},
        /**
         * iframe
         */
        iframe : {value : {}},
        form : {},
        fileInput : {}
    }});

    return IframeType;
});/**
 * @fileoverview 文件上传队列列表显示和处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/queue', ['bui/list'], function (require) {

  var BUI = require('bui/common'),
    SimpleList = require('bui/list/simplelist');

  var CLS_QUEUE = BUI.prefix + 'queue',
    CLS_QUEUE_ITEM = CLS_QUEUE + '-item';
  
  var Queue = SimpleList.extend({
    bindUI: function () {
      var _self = this,
        el = _self.get('el'),
        delCls = _self.get('delCls');

      el.delegate('.' + delCls, 'click', function (ev) {
        var itemContainer = $(ev.target).parents('.bui-queue-item'),
          uploader = _self.get('uploader'),
          item = _self.getItemByElement(itemContainer);
        uploader && uploader.cancel && uploader.cancel(item);
        _self.removeItem(item);
      });
    },
    /**
     * 由于一个文件只能处理一种状态，所以在更新状态前要把所有的文件状态去掉
     * @param  {[type]} item    [description]
     * @param  {[type]} status  [description]
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    updateFileStatus: function(item, status, element){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      element = element || _self.findElement(item);
        
      BUI.each(itemStatusFields, function(v,k){
        _self.setItemStatus(item,k,false,element);
      });

      _self.setItemStatus(item,status,true,element);
      _self.updateItem(item);
    }
  }, {
    ATTRS: {
      itemTpl: {
        value: '<li><span data-url="{url}" class="filename">{name}</span><div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div><div class="action"><span class="' + CLS_QUEUE_ITEM + '-del">删除</span><span>{msg}</span></div></li>'
      },
      resultTpl: {
        value: '',
      },
      itemCls: {
        value: CLS_QUEUE_ITEM
      },
      delCls: {
        value: CLS_QUEUE_ITEM + '-del'
      },
      itemStatusFields: {
        value: {
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

});/**
 * @fileoverview 文件上传主题的处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/theme', function (require) {

  var BUI = require('bui/common');

  var themes = {};

  var Theme = {
    addTheme: function(name, config){
      themes[name] = config;
    },
    getTheme: function(name){
      //不能覆盖主题设置的
      return BUI.cloneObject(themes[name]);
    }
  };

  Theme.addTheme('default', {
    button: {
      elCls: 'defaultTheme-button'
    },
    queue: {
      elCls: 'defaultTheme-queue'
    }
  });

  return Theme;

});/**
 * @fileoverview 文件上传的工厂类
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/factory', function (require) {

  var BUI = require('bui/common'),
    Queue = require('bui/uploader/queue'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton'),
    Ajax = require('bui/uploader/type/ajax'),
    Flash = require('bui/uploader/type/flash'),
    Iframe = require('bui/uploader/type/iframe');

  function Factory(){
  }
  Factory.prototype = {
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
    createButton: function(type, config){
      if(type === 'ajax' || type === 'iframe'){
        return new HtmlButton(config);
      }
      else{
        return new SwfButton(config);
      }
    },
    createQueue: function(config){
      return new Queue(config);
    }
  }

  return new Factory();

});/**
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/uploader', function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    Theme = require('bui/uploader/theme'),
    Factory = require('bui/uploader/factory');//,
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
    renderUI: function(){
      var _self = this;
      _self._initTheme();
      _self._initType();
      _self._renderButton();
      _self._renderUploaderType();
      _self._renderQueue();
    },
    bindUI: function () {
      var _self = this;
      _self._bindButton();
      _self._bindUploaderCore();
      _self._bindQueue();
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
        type = _self.get('type')
      //没有设置时按最优处理，有则按设定的处理
      if(!type){
        if(_self.isSupportAjax()){
          type = types.AJAX;
        }
        else if(_self.isSupportFlash()){
          type = types.FLASH;
        }
        else{
          type = types.IFRAME;
        }
      }
      _self.set('type', type);
    },
    /**
     * 获取用户的配置信息
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
     * @return {[type]} [description]
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
     * @return {[type]} [description]
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
    _bindButton: function () {
      var _self = this,
        button = _self.get('button'),
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType');
      button.on('change', function(ev) {
        var files = ev.files;
        //对添加的文件添加等待状态
        BUI.each(files, function(file){
          file.wait = true;
        });
        _self.fire('beforechange', {items: files});
        queue.addItems(files);
        _self.fire('change', {items: files});
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

        BUI.mix(curUploadItem, {
          loaded: loaded,
          total: total,
          loadedPercent: loaded * 100 / total
        });

        //设置当前正处于的状态
        queue.updateFileStatus(curUploadItem, 'progress');

        _self.fire('progress', {item: curUploadItem, total: total, loaded: loaded});
      });

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

      uploaderType.on('complete', function(ev){
        var curUploadItem = _self.get('curUploadItem'),
          result = ev.result,
          isSuccess= _self.get('isSuccess'),
          successFn = _self.get('success'),
          errorFn = _self.get('error'),
          completeFn = _self.get('complete');

        BUI.mix(curUploadItem.result, result);

        if(isSuccess.call(_self, result)){
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
    },
    cancel: function(){
      var _self = this,
        uploaderType = _self.get('uploaderType'),
        curUploadItem = _self.get('curUploadItem');

      _self.fire('cancel', {item: curUploadItem});
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
      button: {
        setter: function(v){
          var disabled = this.get('disabled');
          if(v && v.isController){
            v.set('disabled', disabled);
          }
          return v;
        }
      },
      disabled: {
        value: false,
        setter: function(v){
          var _self = this,
            button = _self.get('button');
          button && button.isController && button.set('disabled', true);
        }
      },
      queue: {
      },
      /**
       * 当前上传的状
       * @type {Object}
       */
      uploadStatus: {
      },
      /**
       * 判断上传是否已经成功
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
      success: {
      },
      error: {
      },
      complete: {
      },
      xview: {
        value: UploaderView
      }
    }
  }, {
    xclass: 'uploader'
  });

  return Uploader;

});/**
 * @fileoverview 异步文件上传组件入口文件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader', function (require) {

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