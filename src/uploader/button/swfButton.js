/**
 * @ignore
 * @fileoverview flash上传按钮
 * @author: zengyue.yezy
 **/
define('bui/uploader/button/swfButton',['bui/common', './base','./swfButton/ajbridge'], function (require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
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


  var SwfButtonView = Component.View.extend([ButtonBase.View], {
  },{
    ATTRS: {
    }
  });

  /**
   * 文件上传按钮，flash上传方式使用,使用的是flash
   * @class BUI.Uploader.Button.SwfButton
   * @extends BUI.Component.Controller
   * @mixins BUI.Uploader.Button
   */
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
      flashUrl:{
        value: baseUrl + 'uploader/uploader.swf'
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
        },
        shared: false
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