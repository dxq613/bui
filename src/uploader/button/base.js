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
