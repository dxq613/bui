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
});