define('bui/uploader/button/filter', function(require){

  var BUI = require('bui/common');

  var filter =  {
    msexcel: {
      type: "application/msexcel",
      ext: '.xls,.xlsx'
    },
    msword: {
      type: "application/msword",
      ext: '.doc,.docx'
    },
    // {type: "application/pdf"},
    // {type: "application/poscript"},
    // {type: "application/rtf"},
    // {type: "application/x-zip-compressed"},
    // {type: "audio/basic"},
    // {type: "audio/x-aiff"},
    // {type: "audio/x-mpeg"},
    // {type: "audio/x-pn/},realaudio"
    // {type: "audio/x-waw"},
    gif: {
      type: "image/gif",
      ext: '.gif'
    },
    jpeg: {
      type: "image/jpeg",
      ext: '.jpg'
    },
    // {type: "image/tiff"},
    bmp: {
      type: "image/x-ms-bmp",
      ext: '.bmp'
    },
    //{type: "image/x-photo-cd"},
    png: {
      type: "image/x-png",
      ext: '.png'
    }
    // {type: "image/x-portablebitmap"},
    // {type: "image/x-portable-greymap"},
    // {type: "image/x-portable-pixmap"},
    // {type: "image/x-rgb"},
    // {type: "text/html"},
    // {type: "text/plain"},
    // {type: "video/quicktime"},
    // {type: "video/x-mpeg2"},
    // {type: "video/x-msvideo"}
  }

  return {
    _getValueByDesc: function(desc, key){
      var value = [];
      if(BUI.isString(desc)){
        desc = desc.split(',');
      }
      if(BUI.isArray(desc)){
        BUI.each(desc, function(v, k){
          var item = filter[v];
          item && item[key] && value.push(item[key]);
        });
      }
      return value.join(',');
    },
    getTypeByDesc: function(desc){
      return this._getValueByDesc(desc, 'type');
    },
    getExtByDesc: function(desc){
      return this._getValueByDesc(desc, 'ext');
    },
    getTypeByExt: function(ext){
      var type = [];
      if(BUI.isString(ext){
        ext = ext.split(',');
      });
      if(BUI.isArray(ext){
        BUI.each(ext, function(e){
          BUI.each(filter, function(item, desc){
            if(BUI.Array.indexOf(e, item.ext.split(',')) > -1){
              type.push(item.type);
            }
          });
        });
      });
      return type.join(',');
    }
  }
});

/**
 * @fileoverview 文件上传按钮的基类
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/

define('bui/uploader/button/base', function(require) {

  var BUI = require('bui/common');

  /**
   * 获取文件名称
   * @param {String} path 文件路径
   * @return {String}
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
  }

  /**
   * 获取文件扩展名
   * @param {String} filename 文件名
   * @return {String}
   */
  function getFileExtName(filename){
    var result = /\.[^\.]+/.exec(filename) || [];
    return result.join('');
  }

  /**
   * 转换文件大小字节数
   * @param {Number} bytes 文件大小字节数
   * @return {String} 文件大小
   */
  function convertByteSize(bytes) {
    var i = -1;
    do {
      bytes = bytes / 1024;
      i++;
    } while (bytes > 99);
    return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
  }

  function getFileId (file) {
    return file.id || BUI.guid('bui-uploader-file');
  }

  function baseView() {
  }

  baseView.ATTRS = /** @lends Base.prototype */{
  }

  baseView.prototype = {

  }


  function base(){

  }

  base.ATTRS = {
    /**
     * 是否可用,false为可用
     * @type Boolean
     * @default false
     */
    disabled : {
      value : false,
      setter : function(v) {
        this.setDisabled(v);
        return v;
      }
    },
    /**
     * 是否开启多选支持
     * @type Boolean
     * @default true
     */
    multiple : {
      value : true,
      setter : function(v){
        this.setMultiple(v);
        return v;
      }
    },
    /**
     * 文件过滤
     * @type Array
     * @default []
     */
    filter : {
      value : [],
      setter : function(v){
        this.setFilter(v);
        return v;
      }
    },
  };

  base.prototype = {
    //设置文件的扩展信息
    getExtFileData: function(file){
      var filename = getFileName(file.name),
        textSize = convertByteSize(file.size || 0),
        extName = getFileExtName(file.name);
      BUI.mix(file, {
        name: filename,
        textSize: textSize,
        ext: extName,
        id: getFileId(file)
      });
      return file;
    },
    setMultiple: function(){
    },
    setDisabled: function(){
    },
    setFilter: function(){
    }
  }

  base.View = baseView

  return base;

});
