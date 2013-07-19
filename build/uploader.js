/**
 * @fileoverview 异步文件上传组件
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader', function (require) {

  var BUI = require('bui/common');

  var Component = BUI.Component;

  function Uploader(config) {
    Uploader.superclass.constructor.call(this, config);
  }

  BUI.extend(Uploader, /** @lends Uploader.prototype*/{
    render: function () {

    }

  }, {ATTRS: /** @lends Uploader.prototype*/{
    /**
     * 容器
     * @type {String|HTMLElement|Node}
     */
    render: {

    }
  }});

  //BUI.Uploader = Uploader;
  return Uploader;

});