/**
 * @fileoverview 异步文件上传组件入口文件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 * @ignore
 **/
define('bui/uploader', ['bui/common', 'bui/uploader/uploader', 'bui/uploader/queue', 'bui/uploader/theme', 'bui/uploader/factory'], function (require) {

  var BUI = require('bui/common'),
    Uploader = BUI.namespace('Uploader');

  BUI.mix(Uploader, {
    Uploader: require('bui/uploader/uploader'),
    Queue: require('bui/uploader/queue'),
    Theme: require('bui/uploader/theme'),
    Factory: require('bui/uploader/factory')
  });

  return Uploader;

});
