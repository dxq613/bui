/**
 * @fileoverview 文件上传的工厂类
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/factory', function (require) {

  var BUI = require('bui/common'),
    Queue = require('bui/uploader/queue'),
    HtmlButton = require('bui/uploader/button/htmlButton'),
    SwfButton = require('bui/uploader/button/swfButton'),
    Ajax = require('bui/uploader/type/ajax'),
    Flash = require('bui/uploader/type/flash'),
    Iframe = require('bui/uploader/type/iframe');

  function Factory(){
  }
  Factory.prototype = {
    createUploadType: function(type, config){
      if (type === 'ajax') {
        return new Ajax(config);
      }
      else if(type === 'flash'){
        return new Flash(config);
      }
      else{
        return new Iframe(config);
      }
    },
    createButton: function(type, config){
      if(type === 'ajax' || type === 'iframe'){
        return new HtmlButton(config);
      }
      else{
        return new SwfButton(config);
      }
    },
    createQueue: function(config){
      return new Queue(config);
    }
  }

  return new Factory();

});