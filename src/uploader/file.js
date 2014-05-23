/**
 * @fileoverview 异步文件上传组件的文件对像
 * @author 索丘 zengyue.yezy@alibaba-inc.com
 * @ignore
 **/
define('bui/uploader/file', ['bui/common'], function (require) {

  var BUI = require('bui/common');

  /**
   * 获取文件的id
   */
  function getFileId (file) {
    return file.id || BUI.guid('bui-uploader-file');
  }

  /**
   * 获取文件名称
   * @param {String} path 文件路径
   * @return {String}
   * @ignore
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
  }

  /**
   * 获取文件扩展名
   * @param {String} filename 文件名
   * @return {String}
   * @private
   * @ignore
   */
  function getFileExtName(filename){
    var result = /\.[^\.]+$/.exec(filename) || [];
    return result.join('').toLowerCase();
  }

  /**
   * 转换文件大小字节数
   * @param {Number} bytes 文件大小字节数
   * @return {String} 文件大小
   * @private
   * @ignore
   */
  function convertByteSize(bytes) {
    var i = -1;
    do {
      bytes = bytes / 1024;
      i++;
    } while (bytes > 99);
    return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
  }

  return {
    // /**
    //  * 创建一个上传对列里面的内容对象
    //  */
    // getFileAttr: function(file){
    //   return {
    //     name: file.name,
    //     size: file.size,
    //     type: file.type,
    //     textSize: file.textSize,
    //     ext: file.extName,
    //     id: file.id
    //   }
    // },
    create: function(file){
      file.id = file.id || BUI.guid('bui-uploader-file');
      // 去掉文件的前面的路径，获取一个纯粹的文件名
      file.name = getFileName(file.name);
      file.ext = getFileExtName(file.name);
      file.textSize = convertByteSize(file.size);
      
      file.isUploaderFile = true;

      //file.attr = this.getFileAttr(file);

      return file;
    }
  };

});
