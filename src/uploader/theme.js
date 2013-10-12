/**
 * @fileoverview 文件上传主题的处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/theme', function (require) {

  var BUI = require('bui/common'),
    Queue = require('bui/uploader/queue'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton');

  var themes = {
    'default': {
      button: {
        elCls: 'defaultTheme-button'
      },
      queue: {
        elCls: 'defaultTheme-queue'
      }
    }
  };

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

});