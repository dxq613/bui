/**
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/uploader', function (require) {

  var BUI = require('bui/common'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton');


  var Component = BUI.Component,
    PREFIX = BUI.prefix,
    CLS_UPLOADER = PREFIX + 'uploader',
    CLS_UPLOADER_BUTTON = CLS_UPLOADER + '-button',
    CLS_UPLOADER_BUTTON_TEXT = CLS_UPLOADER_BUTTON + '-text';

  var win = window;

  /**
   * Uploader的视图层
   * @type {[type]}
   */
  var UploaderView = Component.View.extend({
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
  }, {
    ATTRS: {
         
    }
  });


  var Uploader = Component.Controller.extend(/** @lends Uploader.prototype*/{
    initializer: function(){
      var _self = this;

      _self._initType();

      console.log(this);
    },
    /**
     * 根据上传的类型获取实例化button的类
     * @private
     * @param  {String} type 上传的类型
     * @return {Class}
     */
    _getButtonClass: function(type) {
      var _self = this,
        types = _self.get('types');
      if(type === types.AJAX || type === types.IFRAME){
        return HtmlButton;
      }
      else{
        return SwfButton;
      }
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
    /**
     * 渲染button, ajax和iframe用原生的input[type=file], flash的需要加载flash组件
     * @private
     */
    _renderButton: function(){
      var _self = this,
        type = _self.get('type'),
        buttonEl = _self.get('view').get('el').find('.' + CLS_UPLOADER_BUTTON),
        ButtonClass = _self._getButtonClass(type),
        button = new ButtonClass({
          render: buttonEl
        });
      button.render();
      _self.set('button', button);
    },
    /**
     * 设置上传类型，只有是types里面的才能设置进去
     * @param  {[type]} v [description]
     * @return {[type]}   [description]
     */
    _uiSetType: function(v) {
      var _self = this,
        types = _self.get('types');
      BUI.each(types, function(type){
        if(v === type) {
          _self.set('type', v);
        }
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

      _self._renderButton();
    }
  }, {
    ATTRS: /** @lends Uploader.prototype*/{
      buttonCls: {
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
        value: '<a href="javascript:void(0);" class="' + CLS_UPLOADER_BUTTON + '  {buttonCls}"><span class="' + CLS_UPLOADER_BUTTON_TEXT + ' {textCls}">{text}</span></a>'
      },
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
      xview: {
        value: UploaderView
      }
    }
  }, {
    xclass: 'uploader'
  });

  return Uploader;

});