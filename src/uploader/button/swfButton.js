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

  var SwfButtonView = Component.View.extend({
  },{
    ATTRS: {
    }
  });

  var SwfButton = Component.Controller.extend([ButtonBase], {
    renderUI: function(){
      var _self = this,
        el = _self.get('el');

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
        el = _self.get('el'),
        flashCfg = _self.get('flash'),
        swfUploader;

      BUI.mix(flashCfg, {
        render: el
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
        swfUploader = _self.get('swfUploader');
      swfUploader && swfUploader.filter(v);
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