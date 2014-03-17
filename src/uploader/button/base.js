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

  function getFileId (file) {
    return file.id || BUI.guid('bui-uploader-file');
  }


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


  var Button = Component.Controller.extend({
    /**
     * 获取文件的扩展信息
     * @param  {Object} file 文件对象
     * @return {Object} 返回文件扩展信息
     */
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
    /**
     * @protected
     * 不知道含义，貌似是给file附加信息，命名有问题，无法见到名字想到含义
     * formatFile或许更合适
     * @ignore
     */
    _getFile: function(file){
      var _self = this,
        fileAttrs = _self.getExtFileData(file);
      BUI.mix(file, fileAttrs);

      //因为在结果模板构建的时候很有可能会使用文件本身的属性，如name，size之类的
      //所以将这些属性放到一个变量里，在渲染模板的时候和result mix一下
      file.attr = fileAttrs;
      return file;
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
