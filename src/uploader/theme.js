/**
 * @fileoverview 文件上传主题的处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/theme', function (require) {

  var BUI = require('bui/common');

  var themes = {};

  var Theme = {
    addTheme: function(name, config){
      themes[name] = config;
    },
    getTheme: function(name){
      //不能覆盖主题设置的
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