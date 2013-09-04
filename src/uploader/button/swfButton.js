/**
 * @fileoverview flash上传按钮
 * @author: zengyue.yezy
 **/
define('bui/uploader/button/swfButton', function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    ButtonBase = require('bui/uploader/button/base'),
    SwfUploader = require('bui/uploader/type/flash'),
    SWF = require('bui/swf');

  var SWF_WRAPPER_ID_PREVFIX = 'bui-swf-uploader-wrapper-';

  var SwfButtonView = Component.View.extend({
  },{
    ATTRS: {
    }
  });

  var SwfButton = Component.Controller.extend({
    renderUI: function(){
      var _self = this,
        el = _self.get('el');

      _self._initSwfUploader();
    },
    _initSwfUploader: function(){
      var _self = this,
        el = _self.get('el'),
        flashCfg = _self.get('flash'),
        swfUploader;

      BUI.mix(flashCfg, {
        render: el
      });

      swfUploader = new SWF(flashCfg);
     _self.set('swfUploader', swfUploader);
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
              btn:true
            }
          }
        }
      },
      /**
       * flash容器模板
       * @type String
       */
      tpl:{
        view: true,
        value:''
      },
      elCls: {
        view: true,
        value: 'uploader-button-swf'
      },
      xview: {
        value: SwfButtonView
      }
    }
  });

  return SwfButton;
});