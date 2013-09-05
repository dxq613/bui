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
