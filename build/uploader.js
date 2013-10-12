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
});

/**
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
  }


  function base(){

  }

  base.ATTRS = {
    elCls: {
      value: CLS_UPLOADER_BUTTON
    },
    buttonCls:{
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
      value: '<a href="javascript:void(0);" class="' + CLS_UPLOADER_BUTTON + '-wrap' + '  {buttonCls}"><span class="' + CLS_UPLOADER_BUTTON_TEXT + ' {textCls}">{text}</span></a>'
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
    },
  };

  base.prototype = {
    //设置文件的扩展信息
    getExtFileData: function(file){
      var filename = getFileName(file.name),
        textSize = convertByteSize(file.size || 0),
        extName = getFileExtName(file.name);
      BUI.mix(file, {
        name: filename,
        textSize: textSize,
        ext: extName,
        id: getFileId(file)
      });
      return file;
    },
    setMultiple: function(){
    },
    setDisabled: function(){
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
        buttonEl = _self.get('el').find('.bui-uploader-button-wrap'),
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
      _self.setFilter(_self.get('filter'));
      //_self._setDisabled(_self.get('disabled'));
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
            files.push(_self.getExtFileData({'name': v.name, 'type': v.type, 'size': v.size, file:v, input: fileInput[0]}));
          });
        }else{
          files.push(_self.getExtFileData({'name': value, input: fileInput[0]}));
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
    SWF = require('bui/uploader/button/swfButton/ajbridge');

  var SWF_WRAPPER_ID_PREVFIX = 'bui-swf-uploader-wrapper-';

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
            files.push(_self.getExtFileData(file));
          });
          _self.fire('change', {files: files});
        });

        _self.setMultiple(_self.get('multiple'));
        _self.setFilter(_self.get('filter'));
      });
    },
    _initSwfUploader: function(){
      var _self = this,
        buttonEl = _self.get('el').find('.bui-uploader-button-wrap'),
        flashCfg = _self.get('flash'),
        swfTpl = _self.get('swfTpl'),
        swfUploader;

      BUI.mix(flashCfg, {
        render: $(swfTpl).appendTo(buttonEl)
      });
      swfUploader = new SWF(flashCfg);
      _self.set('swfUploader', swfUploader);
    },
    setMultiple: function(v){
      var _self = this,
        swfUploader = _self.get('swfUploader');
      swfUploader && swfUploader.multifile(v);
    },
    setFilter: function(v){
      var _self = this,
        swfUploader = _self.get('swfUploader'),
        filter = _self.getFilter(v);
      //flash里需要一个数组
      swfUploader && swfUploader.filter([v]);
      return v;
    }
  },{
    ATTRS: {
      swfUploader:{
      },
      flash:{
        value:{
          src:'http://a.tbcdn.cn/s/kissy/gallery/uploader/1.4/plugins/ajbridge/uploader.swf',
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
    stop: function(){
        
    },
    /**
     * 处理服务器端返回的结果集
     * @private
     */
    _processResponse: function(responseText){
      var _self = this,
        result = {};
      //格式化成json数据
      if(BUI.isString(responseText)){
        try{
          result = BUI.JSON.parse(responseText);
          // result = _self._fromUnicode(result);
        }catch(e){
          var msg = responseText + '，返回结果集responseText格式不合法！';
          BUI.log(msg);
          _self.fire('error',{status:-1, result:{msg:msg}});
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
    }
  });

  return UploadType;
});/**
 * @fileoverview ajax方案上传
 * @author 剑平（明河）<minghe36@126.com>,紫英<daxingplay@gmail.com>
 **/
define('bui/uploader/type/ajax',function(require) {
    var EMPTY = '', LOG_PREFIX = '[uploader-AjaxType]:';

    var UploadType = require('bui/uploader/type/base');

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
            if (!BUI.isObject(xhr)) {
                BUI.log(LOG_PREFIX + 'cancel()，io值错误！');
                return false;
            }
            //中止ajax请求，会触发error事件
            xhr.abort();
            self.fire(AjaxType.event.CANCEL, {file: file});
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
                if(result && result.status === 1){
                    self.fire(AjaxType.event.SUCCESS, {result : result, file: file});
                }
                else{
                    self.fire(AjaxType.event.ERROR, {result : result, file: file});
                }
            };
            xhr.open("POST", url, true);
            data.append("type", "ajax");
            xhr.send(data);
            // 重置FormData
            self._setFormData();
            self.set('xhr',xhr);
            return self;
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
        }
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
        var self = this;
        //调用父类构造函数
        FlashType.superclass.constructor.call(self, config);
        self.isHasCrossdomain();
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
                var result = _self._processResponse(ev.data);
                _self.fire('complete', {result: result});
                if(result && result.status === 1){
                    _self.fire(FlashType.event.SUCCESS, {result: result});
                }
                else{
                    _self.fire(FlashType.event.ERROR, {result: result});
                }
                _self.set('file', null);
            });
            //监听文件失败事件
            swfUploader.on('uploadError',function(){
                _self.set('file', file);
                _self.fire(FlashType.event.ERROR, {msg : ev.msg});
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
        var itemContainer = $(ev.target).parent();
        _self.removeItem(_self.getItemByElement(itemContainer));
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
      itemCls: {
        value: CLS_QUEUE
      },
      itemTpl: {
        value: '<li><span data-url="{url}">{name}</span><div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div><div class="' + CLS_QUEUE_ITEM + '-del">删除</div></li>'
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

  var BUI = require('bui/common'),
    Queue = require('bui/uploader/queue'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton');

  var themes = {};

  var Theme = {
    /**
     * 根据上传的类型获取实例化button的类
     * @private
     * @param  {String} type 上传的类型
     * @return {Class}
     */
    _getButtonClass: function(type) {
      var _self = this;
      if(type === 'ajax' || type === 'iframe'){
        return HtmlButton;
      }
      else{
        return SwfButton;
      }
    },
    createButton: function(themeName, config, type){
      var _self = this,
        theme = _self.getTheme(themeName) || {},
        buttonCfg = theme.button || {},
        buttonClass = _self._getButtonClass(theme.type || type);
      buttonCfg = BUI.mix(buttonCfg, config);
      return new buttonClass(buttonCfg);
    },
    createQueue: function(themeName, config){
      var _self = this,
        theme = _self.getTheme(themeName) || {},
        queueCfg = theme.queue || {};
      queueCfg = BUI.mix(queueCfg, config);
      return new Queue(queueCfg);
    },
    addTheme: function(name, config){
      themes[name] = config;
    },
    getTheme: function(name){
      return themes[name];
    }
  };

  return Theme;

});/**
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
      var _self = this;
      _self.get('button').render();
      _self.get('queue').render();
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
    Theme: require('bui/uploader/theme')
  });

  return Uploader;

});