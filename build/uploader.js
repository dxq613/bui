/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
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
     * \u5904\u7406\u6765\u81ea AJBridge \u5df2\u5b9a\u4e49\u7684\u4e8b\u4ef6
     * @param {String} id            swf\u4f20\u51fa\u7684\u81ea\u8eabID
     * @param {Object} event        swf\u4f20\u51fa\u7684\u4e8b\u4ef6
     */
    eventHandler: function(id, event) {
      var instance = instances[id];
      if (instance) {
        instance.__eventHandler(id, event);
      }
    },
    /**
     * \u6279\u91cf\u6ce8\u518c SWF \u516c\u5f00\u7684\u65b9\u6cd5
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
          } catch(e) { // \u5f53 swf \u5f02\u5e38\u65f6\uff0c\u8fdb\u4e00\u6b65\u6355\u83b7\u4fe1\u606f
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
    
      event.id = id;   // \u5f25\u8865\u540e\u671f id \u4f7f\u7528
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

  // \u4e3a\u9759\u6001\u65b9\u6cd5\u52a8\u6001\u6ce8\u518c
  // \u6ce8\u610f\uff0c\u53ea\u6709\u5728 S.ready() \u540e\u8fdb\u884c AJBridge \u6ce8\u518c\u624d\u6709\u6548\u3002
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

  //flash\u91cc\u9762\u8981\u8c03\u7528\u5168\u5c40\u65b9\u6cd5BUI.AJBridge.eventHandler,\u6240\u4ee5\u6302\u5728BUI\u4e0b\u9762
  BUI.AJBridge = AJBridge;

  return AJBridge;
});
/**
 * NOTES:
 * 20130904 \u4ecekissy ajbridge\u6a21\u5757\u79fb\u690d\u6210bui\u7684\u6a21\u5757\uff08\u7d22\u4e18\u4fee\u6539\uff09
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
 * @fileoverview \u6587\u4ef6\u4e0a\u4f20\u6309\u94ae\u7684\u57fa\u7c7b
 * @author: \u7d22\u4e18 zengyue.yezy@alibaba-inc.com
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
   * \u83b7\u53d6\u6587\u4ef6\u540d\u79f0
   * @param {String} path \u6587\u4ef6\u8def\u5f84
   * @return {String}
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
  }

  /**
   * \u83b7\u53d6\u6587\u4ef6\u6269\u5c55\u540d
   * @param {String} filename \u6587\u4ef6\u540d
   * @return {String}
   */
  function getFileExtName(filename){
    var result = /\.[^\.]+/.exec(filename) || [];
    return result.join('');
  }

  /**
   * \u8f6c\u6362\u6587\u4ef6\u5927\u5c0f\u5b57\u8282\u6570
   * @param {Number} bytes \u6587\u4ef6\u5927\u5c0f\u5b57\u8282\u6570
   * @return {String} \u6587\u4ef6\u5927\u5c0f
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
      value: '\u4e0a\u4f20\u6587\u4ef6'
    },
    tpl: {
      view: true,
      value: '<a href="javascript:void(0);" class="' + CLS_UPLOADER_BUTTON + '-wrap' + '"><span class="' + CLS_UPLOADER_BUTTON_TEXT + '">{text}</span></a>'
    },
    /**
     * \u662f\u5426\u53ef\u7528,false\u4e3a\u53ef\u7528
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
     * \u662f\u5426\u5f00\u542f\u591a\u9009\u652f\u6301
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
     * \u6587\u4ef6\u8fc7\u6ee4
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
    //\u8bbe\u7f6e\u6587\u4ef6\u7684\u6269\u5c55\u4fe1\u606f
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
   * @class \u6587\u4ef6\u4e0a\u4f20\u6309\u94ae\uff0cajax\u548ciframe\u4e0a\u4f20\u65b9\u5f0f\u4f7f\u7528
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
     * \u521b\u5efa\u9690\u85cf\u7684\u8868\u5355\u4e0a\u4f20\u57df
     * @return {HTMLElement} \u6587\u4ef6\u4e0a\u4f20\u57df\u5bb9\u5668
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

      //TODO:IE6\u4e0b\u53ea\u6709\u901a\u8fc7\u811a\u672c\u548c\u5185\u8054\u6837\u5f0f\u624d\u80fd\u63a7\u5236\u6309\u94ae\u5927\u5c0f
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
      //\u4e0a\u4f20\u6846\u7684\u503c\u6539\u53d8\u540e\u89e6\u53d1
      $(fileInput).on('change', function(ev){
        var value = $(this).val(),
          oFiles = ev.target.files,
          files = [];
          
        //IE\u53d6\u4e0d\u5230files
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

      //\u79fb\u9664\u8868\u5355\u4e0a\u4f20\u57df\u5bb9\u5668
      fileInput.parent().remove();
      _self.set('fileInput', null);
      //\u91cd\u65b0\u521b\u5efa\u8868\u5355\u4e0a\u4f20\u57df
      _self._createInput();
      return _self;
    },
    /**
     * \u8bbe\u7f6e\u4e0a\u4f20\u7ec4\u4ef6\u7684\u7981\u7528
     * @param {Boolean} multiple \u662f\u5426\u7981\u7528
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
     * \u8bbe\u7f6e\u4e0a\u4f20\u6587\u4ef6\u7684\u7c7b\u578b
     * @param {[type]} filter \u53ef\u4e0a\u4f20\u6587\u4ef6\u7684\u7c7b\u578b
     */
    setFilter: function(v){
      var _self = this,
        fileInput = _self.get('fileInput'),
        filter = _self.getFilter(v);
      if(!fileInput || !fileInput.length){
        return false;
      };
      //accept\u662fhtml5\u7684\u5c5e\u6027\uff0c\u6240\u4ee5ie8\u4ee5\u4e0b\u662f\u4e0d\u652f\u6301\u7684
      filter.type && fileInput.attr('accept', filter.type);
      return filter;
    }
  },{
    ATTRS: {
      /**
       * \u9690\u85cf\u7684\u8868\u5355\u4e0a\u4f20\u57df\u7684\u6a21\u677f
       * @type String
       */
      inputTpl: {
        view: true,
        value: '<div class="file-input-wrapper"><input type="file" name="{name}" hidefocus="true" class="file-input" /></div>'
      },
      /**
       * \u5bf9\u5e94\u7684\u8868\u5355\u4e0a\u4f20\u57df
       * @type KISSY.Node
       * @default ""
       */
      fileInput: {
      },
      /**
       * \u9690\u85cf\u7684\u8868\u5355\u4e0a\u4f20\u57df\u7684name\u503c
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

define('bui/uploader/button/swfButton', function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    ButtonBase = require('bui/uploader/button/base'),
    SwfUploader = require('bui/uploader/type/flash'),
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
        buttonCls = _self.get('buttonCls'),
        buttonEl = _self.get('el').find('.' + buttonCls),
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
      //flash\u91cc\u9700\u8981\u4e00\u4e2a\u6570\u7ec4
      swfUploader && swfUploader.filter([v]);
      return v;
    }
  },{
    ATTRS: {
      swfUploader:{
      },
      flash:{
        value:{
          src:seajs.pluginSDK.config.base + 'uploader/uploader.swf',
          params:{
            allowscriptaccess: 'always',
            bgcolor:"#fff",
            wmode:"transparent",
            flashvars: {
              //\u624b\u578b
              hand:true,
              //\u542f\u7528\u6309\u94ae\u6a21\u5f0f,\u6fc0\u53d1\u9f20\u6807\u4e8b\u4ef6
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
});
define('bui/uploader/type/base',function(require) {
  /**
   * @name UploadType
   * @class \u4e0a\u4f20\u65b9\u5f0f\u7c7b\u7684\u57fa\u7c7b\uff0c\u5b9a\u4e49\u901a\u7528\u7684\u4e8b\u4ef6\u548c\u65b9\u6cd5\uff0c\u4e00\u822c\u4e0d\u76f4\u63a5\u76d1\u542c\u6b64\u7c7b\u7684\u4e8b\u4ef6
   * @constructor
   */
  function UploadType(config) {
    var _self = this;
    //\u8c03\u7528\u7236\u7c7b\u6784\u9020\u51fd\u6570
    UploadType.superclass.constructor.call(_self, config);
  }

  UploadType.ATTRS = {
    /**
     * \u5f53\u524d\u5904\u7406\u7684\u6587\u4ef6
     * @type {Object}
     */
    file: {
    },
    /**
     * \u670d\u52a1\u5668\u7aef\u8def\u5f84
     * @type String
     * @default ""
     */
    url: {
    },
    /**
     * \u4f20\u9001\u7ed9\u670d\u52a1\u5668\u7aef\u7684\u53c2\u6570\u96c6\u5408\uff08\u4f1a\u88ab\u8f6c\u6210hidden\u5143\u7d20post\u5230\u670d\u52a1\u5668\u7aef\uff09
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
     * \u4e8b\u4ef6\u5217\u8868
     */
    event : {
      //\u5f00\u59cb\u4e0a\u4f20\u540e\u89e6\u53d1
      START : 'start',
      //\u505c\u6b62\u4e0a\u4f20\u540e\u89e6\u53d1
      CANCEL : 'cancel',
      //\u6210\u529f\u8bf7\u6c42
      SUCCESS : 'success',
      //\u4e0a\u4f20\u5931\u8d25\u540e\u89e6\u53d1
      ERROR : 'error'
    }
  });

  /**
   * @name UploadType#start
   * @desc  \u5f00\u59cb\u4e0a\u4f20\u540e\u89e6\u53d1
   * @event
   */
  /**
   * @name UploadType#stop
   * @desc  \u505c\u6b62\u4e0a\u4f20\u540e\u89e6\u53d1
   * @event
   */
  /**
   * @name UploadType#success
   * @desc  \u4e0a\u4f20\u6210\u529f\u540e\u89e6\u53d1
   * @event
   */
  /**
   * @name UploadType#error
   * @desc  \u4e0a\u4f20\u5931\u8d25\u540e\u89e6\u53d1
   * @event
   */
  //\u7ee7\u627f\u4e8eBase\uff0c\u5c5e\u6027getter\u548csetter\u59d4\u6258\u4e8eBase\u5904\u7406
  BUI.extend(UploadType, BUI.Base, /** @lends UploadType.prototype*/{
    /**
     * \u4e0a\u4f20\u6587\u4ef6
     * @param {Object} File \u6570\u636e\u5bf9\u50cf
     * @description
     * \u56e0\u4e3a\u6bcf\u79cd\u4e0a\u4f20\u7c7b\u578b\u9700\u8981\u7684\u6570\u636e\u90fd\u4e0d\u4e00\u6837\uff0c
     * Ajax\u9700\u8981File\u5bf9\u50cf\uff0c
     * Iframe\u9700\u8981input[type=file]\u5bf9\u50cf
     * \u6240\u4ee5\u4e3a\u4e86\u4fdd\u6301\u63a5\u53e3\u7684\u4e00\u81f4\u6027\uff0c\u8fd9\u91cc\u7684File\u5bf9\u50cf\u4e0d\u662f\u6d4f\u89c8\u5668\u539f\u751f\u7684File\u5bf9\u50cf\uff0c\u800c\u662f\u5305\u542bFile\u548cinput\u7684\u5bf9\u50cf
     * \u7c7b\u4f3c{name: 'test.jpg', size: 1024, textSize: '1K', input: {}, file: File}
     */
    upload: function(File) {
    },
    /** 
     * \u505c\u6b62\u4e0a\u4f20
     */
    cancel: function(){
    },
    /**
     * \u5904\u7406\u670d\u52a1\u5668\u7aef\u8fd4\u56de\u7684\u7ed3\u679c\u96c6
     * @private
     */
    _processResponse: function(responseText){
      var _self = this,
        file = _self.get('file'),
        result;
      //\u683c\u5f0f\u5316\u6210json\u6570\u636e
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
      BUI.log('\u670d\u52a1\u5668\u7aef\u8f93\u51fa\uff1a' + BUI.JSON.stringify(result));
      return result;
    },
    /**
     * \u5c06unicode\u7684\u4e2d\u6587\u8f6c\u6362\u6210\u6b63\u5e38\u663e\u793a\u7684\u6587\u5b57\uff0c\uff08\u4e3a\u4e86\u4fee\u590dflash\u7684\u4e2d\u6587\u4e71\u7801\u95ee\u9898\uff09
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
    clear: function(){
    }
  });

  return UploadType;
});
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
     * @class ajax\u65b9\u6848\u4e0a\u4f20
     * @constructor
     * @requires UploadType
     */
    function AjaxType(config) {
        var self = this;
        //\u8c03\u7528\u7236\u7c7b\u6784\u9020\u51fd\u6570
        AjaxType.superclass.constructor.call(self, config);
    }

    BUI.mix(AjaxType, /** @lends AjaxType.prototype*/{
        /**
         * \u4e8b\u4ef6\u5217\u8868
         */
        event : BUI.merge(UploadType.event, {
            PROGRESS : 'progress'
        })
    });
    //\u7ee7\u627f\u4e8eBase\uff0c\u5c5e\u6027getter\u548csetter\u59d4\u6258\u4e8eBase\u5904\u7406
    BUI.extend(AjaxType, UploadType, /** @lends AjaxType.prototype*/{
        /**
         * \u4e0a\u4f20\u6587\u4ef6
         * @param {Object} File
         * @return {AjaxType}
         */
        upload : function(file) {
            //\u4e0d\u5b58\u5728\u6587\u4ef6\u4fe1\u606f\u96c6\u5408\u76f4\u63a5\u9000\u51fa
            if (!file || !file.file) {
                BUI.log(LOG_PREFIX + 'upload()\uff0cfileData\u53c2\u6570\u6709\u8bef\uff01');
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
         * \u505c\u6b62\u4e0a\u4f20
         * @return {AjaxType}
         */
        cancel : function() {
            var self = this,
                xhr = self.get('xhr'),
                file = self.get('file');
            //\u4e2d\u6b62ajax\u8bf7\u6c42\uff0c\u4f1a\u89e6\u53d1error\u4e8b\u4ef6
            if(xhr){
                xhr.abort();
                self.fire(AjaxType.event.CANCEL, {file: file});
            }
            self.set('file', null);
            return self;
        },
        /**
         * \u53d1\u9001ajax\u8bf7\u6c42
         * @return {AjaxType}
         */
        send : function() {
            var self = this,
                //\u670d\u52a1\u5668\u7aef\u5904\u7406\u6587\u4ef6\u4e0a\u4f20\u7684\u8def\u5f84
                url = self.get('url'),
                data = self.get('formData'),
                file = self.get('file');
            var xhr = new XMLHttpRequest();
            //TODO:\u5982\u679c\u4f7f\u7528onProgress\u5b58\u5728\u7b2c\u4e8c\u6b21\u4e0a\u4f20\u4e0d\u89e6\u53d1progress\u4e8b\u4ef6\u7684\u95ee\u9898
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
            // \u91cd\u7f6eFormData
            self._setFormData();
            self.set('xhr',xhr);
            return self;
        },
        clear: function(){
        },
        /**
         * \u8bbe\u7f6eFormData\u6570\u636e
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
         * \u5904\u7406\u4f20\u9012\u7ed9\u670d\u52a1\u5668\u7aef\u7684\u53c2\u6570
         */
        _processData : function() {
            var self = this,data = self.get('data'),
                formData = self.get('formData');
            //\u5c06\u53c2\u6570\u6dfb\u52a0\u5230FormData\u7684\u5b9e\u4f8b\u5185
            BUI.each(data, function(val, key) {
                formData.append(key, val);
            });
            self.set('formData', formData);
        },
        /**
         * \u5c06\u6587\u4ef6\u4fe1\u606f\u6dfb\u52a0\u5230FormData\u5185
         * @param {Object} file \u6587\u4ef6\u4fe1\u606f
         */
        _addFileData : function(file) {
            if (!file) {
                BUI.log(LOG_PREFIX + '_addFileData()\uff0cfile\u53c2\u6570\u6709\u8bef\uff01');
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
         * \u8868\u5355\u6570\u636e\u5bf9\u8c61
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
});
define('bui/uploader/type/flash', function (require) {
    var LOG_PREFIX = '[uploader-FlashType]:';

    var UploadType = require('bui/uploader/type/base');

    /**
     * @name FlashType
     * @class flash\u4e0a\u4f20\u65b9\u6848\uff0c\u57fa\u4e8e\u9f99\u85cf\u5199\u7684ajbridge\u5185\u7684uploader
     * @constructor
     * @extends UploadType
     * @requires Node
     */
    function FlashType(config) {
        var _self = this;
        //\u8c03\u7528\u7236\u7c7b\u6784\u9020\u51fd\u6570
        FlashType.superclass.constructor.call(_self, config);
        _self.isHasCrossdomain();
    }

    BUI.mix(FlashType, /** @lends FlashType.prototype*/{
        /**
         * \u4e8b\u4ef6\u5217\u8868
         */
        event:BUI.merge(UploadType.event, {
            //swf\u6587\u4ef6\u5df2\u7ecf\u51c6\u5907\u5c31\u7eea
            SWF_READY: 'swfReady',
            //\u6b63\u5728\u4e0a\u4f20
            PROGRESS:'progress'
        })
    });

    BUI.extend(FlashType, UploadType, /** @lends FlashType.prototype*/{
        /**
         * \u521d\u59cb\u5316
         */
        _initSwfUploader:function () {
            var _self = this, swfUploader = _self.get('swfUploader');
            if(!swfUploader){
                BUI.log(LOG_PREFIX + 'swfUploader\u5bf9\u8c61\u4e3a\u7a7a\uff01');
                return false;
            }
            //SWF \u5185\u5bb9\u51c6\u5907\u5c31\u7eea
            swfUploader.on('contentReady', function(ev){
                _self.fire(FlashType.event.SWF_READY);
            });
            //\u76d1\u542c\u5f00\u59cb\u4e0a\u4f20\u4e8b\u4ef6
            swfUploader.on('uploadStart', function(ev){
                var file = _self.get('file');
                _self.fire(UploadType.event.START, {file: file});
            });
            //\u76d1\u542c\u6587\u4ef6\u6b63\u5728\u4e0a\u4f20\u4e8b\u4ef6
            swfUploader.on('uploadProgress', function(ev){
                BUI.mix(ev, {
                    //\u5df2\u7ecf\u8bfb\u53d6\u7684\u6587\u4ef6\u5b57\u8282\u6570
                    loaded:ev.bytesLoaded,
                    //\u6587\u4ef6\u603b\u5171\u5b57\u8282\u6570
                    total : ev.bytesTotal
                });
                BUI.log(LOG_PREFIX + '\u5df2\u7ecf\u4e0a\u4f20\u5b57\u8282\u6570\u4e3a\uff1a' + ev.bytesLoaded);
                _self.fire(FlashType.event.PROGRESS, { 'loaded':ev.loaded, 'total':ev.total });
            });
            //\u76d1\u542c\u6587\u4ef6\u4e0a\u4f20\u5b8c\u6210\u4e8b\u4ef6
            swfUploader.on('uploadCompleteData', function(ev){
                var file = _self.get('file'),
                    result = _self._processResponse(ev.data);
                _self.fire('complete', {result: result, file: file});
                _self.set('file', null);
            });
            //\u76d1\u542c\u6587\u4ef6\u5931\u8d25\u4e8b\u4ef6
            swfUploader.on('uploadError',function(){
                var file = _self.get('file');
                _self.fire(FlashType.event.ERROR, {file: file});
                _self.set('file', null);
            });
        },
        /**
         * \u4e0a\u4f20\u6587\u4ef6
         * @param {String} id \u6587\u4ef6id
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
         * \u505c\u6b62\u4e0a\u4f20\u6587\u4ef6
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
        clear: function(){

        },
        /**
         * \u5e94\u7528\u662f\u5426\u6709flash\u8de8\u57df\u7b56\u7565\u6587\u4ef6
         */
        isHasCrossdomain:function(){
            var domain = location.hostname;
             $.ajax({
                 url:'http://' + domain + '/crossdomain.xml',
                 dataType:"xml",
                 error:function(){
                     BUI.log('\u7f3a\u5c11crossdomain.xml\u6587\u4ef6\u6216\u8be5\u6587\u4ef6\u4e0d\u5408\u6cd5\uff01');
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
         * \u670d\u52a1\u5668\u7aef\u8def\u5f84\uff0c\u7559\u610fflash\u5fc5\u987b\u662f\u7edd\u5bf9\u8def\u5f84
         */
        url:{
            getter:function(v){
                var reg = /^http/;
                //\u4e0d\u662f\u7edd\u5bf9\u8def\u5f84\u62fc\u63a5\u6210\u7edd\u5bf9\u8def\u5f84
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
         * ajbridge\u7684uploader\u7ec4\u4ef6\u7684\u5b9e\u4f8b\uff0c\u5fc5\u987b\u53c2\u6570
         */
        swfUploader:{},
        /**
         * \u6b63\u5728\u4e0a\u4f20\u7684\u6587\u4ef6id
         */
        uploadingId : {}
    }});
    return FlashType;
});
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
        var itemContainer = $(ev.target).parent(),
          uploader = _self.get('uploader'),
          item = _self.getItemByElement(itemContainer);
        uploader && uploader.cancel && uploader.cancel(item);
        _self.removeItem(item);
      });
    },
    /**
     * \u7531\u4e8e\u4e00\u4e2a\u6587\u4ef6\u53ea\u80fd\u5904\u7406\u4e00\u79cd\u72b6\u6001\uff0c\u6240\u4ee5\u5728\u66f4\u65b0\u72b6\u6001\u524d\u8981\u628a\u6240\u6709\u7684\u6587\u4ef6\u72b6\u6001\u53bb\u6389
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
        value: '<li><span data-url="{url}">{name}</span><div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div><div class="' + CLS_QUEUE_ITEM + '-del">\u5220\u9664</div></li>'
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

});
define('bui/uploader/theme', function (require) {

  var BUI = require('bui/common');

  var themes = {};

  var Theme = {
    addTheme: function(name, config){
      themes[name] = config;
    },
    getTheme: function(name){
      //\u4e0d\u80fd\u8986\u76d6\u4e3b\u9898\u8bbe\u7f6e\u7684
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

});
define('bui/uploader/factory', function (require) {

  var BUI = require('bui/common'),
    Queue = require('bui/uploader/queue'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton'),
    Ajax = require('bui/uploader/type/ajax'),
    Flash = require('bui/uploader/type/flash');

  function Factory(){
  }

  Factory.prototype = {
    createUploadType: function(type, config){
      if (type === 'ajax') {
        return new Ajax(config);
      }
      else{
        return new Flash(config);
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

});
define('bui/uploader/uploader', function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    Theme = require('bui/uploader/theme'),
    Factory = require('bui/uploader/factory');//,
    // Iframe = require('bui/uploader/type/iframe');


  var win = window;

  /**
   * Uploader\u7684\u89c6\u56fe\u5c42
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
     * \u68c0\u6d4b\u6d4f\u89c8\u5668\u662f\u5426\u652f\u6301ajax\u7c7b\u578b\u4e0a\u4f20\u65b9\u5f0f
     * @return {Boolean}
     */
    isSupportAjax: function(){
      return !!win['FormData'];
    },
    /**
     * \u68c0\u6d4b\u6d4f\u89c8\u5668\u662f\u5426\u652f\u6301flash\u7c7b\u578b\u4e0a\u4f20\u65b9\u5f0f
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
        else if(BUI.isObject(value)){
          BUI.mix(value, attrVals[name]);
          _self.set(name, value);
        }
      });
    },
    /**
     * \u521d\u59cb\u5316\u4e0a\u4f20\u7c7b\u578b
     * @private
     * @description \u9ed8\u8ba4\u6309\u6700\u4f18\u5904\u7406
     */
    _initType: function(){
      var _self = this,
        types = _self.get('types'),
        type = _self.get('type')
      //\u6ca1\u6709\u8bbe\u7f6e\u65f6\u6309\u6700\u4f18\u5904\u7406\uff0c\u6709\u5219\u6309\u8bbe\u5b9a\u7684\u5904\u7406
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
     * \u83b7\u53d6\u7528\u6237\u7684\u914d\u7f6e\u4fe1\u606f
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
     * \u521d\u59cb\u5316Button
     * @return {[type]} [description]
     */
    _renderButton: function(){
      var _self = this,
        type = _self.get('type'),
        el = _self.get('el'),
        button = _self.get('button') || {};
      if(!(button instanceof Component.Controller)){
        button.render = el;
        button.autoRender = true;
        button = Factory.createButton(type, button);
        _self.set('button', button);
      }
      button.set('uploader', _self);
    },
    /**
     * \u521d\u59cb\u5316\u4e0a\u4f20\u7684\u5bf9\u5217
     * @return {[type]} [description]
     */
    _renderQueue: function(){
      var _self = this,
        el = _self.get('el'),
        queue = _self.get('queue') || {};
      if (!(queue instanceof Component.Controller)) {
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

        //\u5bf9\u6dfb\u52a0\u7684\u6587\u4ef6\u6dfb\u52a0\u7b49\u5f85\u72b6\u6001
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

        //\u5982\u679c\u6709\u7b49\u5f85\u7684\u6587\u4ef6\u5219\u4e0a\u4f20\u7b2c1\u4e2a
        if (items && items.length) {
          _self.uploadFile(items[0]);
          //\u5982\u679c\u6587\u4ef6\u88ab\u7f6e\u4e3a\u7b49\u7b49\u72b6\u6001\uff0c\u5219\u8981\u8fdb\u884c\u91cd\u65b0\u4e0a\u4f20
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

        //\u8bbe\u7f6e\u5f53\u524d\u6b63\u5904\u4e8e\u7684\u72b6\u6001
        queue.updateFileStatus(curUploadItem, 'progress');

        _self.fire('progress', {item: curUploadItem, total: total, loaded: loaded});
      });

      uploaderType.on('error', function(ev){
        var curUploadItem = _self.get('curUploadItem'),
          errorFn = _self.get('error'),
          completeFn = _self.get('complete');
        //\u8bbe\u7f6e\u5bf9\u5217\u4e2d\u5b8c\u6210\u7684\u6587\u4ef6
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

        curUploadItem.result = result;

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

        //\u91cd\u65b0\u4e0a\u4f20\u5176\u4ed6\u7b49\u5f85\u7684\u6587\u4ef6
        _self.uploadFiles();
      });
    },
    uploadFile: function (item) {
      var _self = this,
        queue = _self.get('queue'),
        uploaderType = _self.get('uploaderType'),
        curUploadItem = _self.get('curUploadItem');

      //\u5982\u679c\u6709\u6587\u4ef6\u6b63\u7b49\u4f8d\u4e0a\u4f20\uff0c\u800c\u4e14\u4e0a\u4f20\u7ec4\u4ef6\u5f53\u524d\u5904\u7406\u7a7a\u95f2\u72b6\u6001\uff0c\u624d\u8fdb\u884c\u4e0a\u4f20
      if (item && !curUploadItem) {
        //\u8bbe\u7f6e\u6b63\u5728\u4e0a\u4f20\u7684\u72b6\u6001
        _self.set('curUploadItem', item);
        //\u66f4\u65b0\u6587\u4ef6\u7684\u72b6\u6001
        queue.updateFileStatus(item, 'start');
        uploaderType.upload(item);
      }
    },
    /**
     * \u4e0a\u4f20\u6587\u4ef6\uff0c\u53ea\u5bf9\u5bf9\u5217\u4e2d\u6240\u6709wait\u72b6\u6001\u7684\u6587\u4ef6
     * @return {[type]} [description]
     */
    uploadFiles: function () {
      var _self = this,
        queue = _self.get('queue'),
        //\u6240\u6709\u6587\u4ef6\u53ea\u6709\u5728wait\u72b6\u6001\u624d\u53ef\u4ee5\u4e0a\u4f20
        items = queue.getItemsByStatus('wait');

      if (items && items.length) {
        //\u5f00\u59cb\u8fdb\u884c\u5bf9\u5217\u4e2d\u7684\u4e0a\u4f20
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
    }
  }, {
    ATTRS: /** @lends Uploader.prototype*/{
      /**
       * \u4e0a\u4f20\u7684\u7c7b\u578b\uff0c\u6709ajax,flash,iframe\u56db\u79cd
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
       * \u5f53\u524d\u4f7f\u7528\u7684\u4e0a\u4f20\u7c7b\u578b
       * @type {String}
       */
      type: {
      },
      theme: {
        value: 'default'
      },
      button: {
      },
      queue: {
      },
      /**
       * \u5f53\u524d\u4e0a\u4f20\u7684\u72b6
       * @type {Object}
       */
      uploadStatus: {
      },
      /**
       * \u5224\u65ad\u4e0a\u4f20\u662f\u5426\u5df2\u7ecf\u6210\u529f
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

});
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