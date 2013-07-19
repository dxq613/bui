/**
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/uploader', function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    PREFIX = BUI.prefix,
    CLS_UPLOADER = PREFIX + 'uploader',
    CLS_UPLOADER_BUTTON = CLS_UPLOADER + '-button',
    CLS_UPLOADER_BUTTON_TEXT = CLS_UPLOADER_BUTTON + '-text';

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
      //this.set('text', this.get('text'));
      console.log(this.get('view').get('el'));
    }
  }, {
    ATTRS: /** @lends Uploader.prototype*/{
      buttonCls: {
      },
      textCls: {
      },
      text: {
        value: '上传文件'
      },
      tpl: {
        view: true,
        value: '<a href="javascript:void(0);" class="' + CLS_UPLOADER_BUTTON + '  {buttonCls}"><span class="' + CLS_UPLOADER_BUTTON_TEXT + ' {textCls}">{text}</span></a>'
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