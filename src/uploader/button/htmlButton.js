/**
 * @fileoverview 文件上传按钮,使用input[type=file]
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/button/htmlButton', function(require) {

  var ButtonBase = require('bui/uploader/button/base'),
    UA = BUI.UA;

  /**
   * 获取文件名称（从表单域的值中提取）
   * @param {String} path 文件路径
   * @return {String}
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
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
    return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
  }

  function getFileId () {
    return BUI.guid('bui-uploader-file');
  }
  /**
   * @name Button
   * @class 文件上传按钮，ajax和iframe上传方式使用
   * @constructor
   */
  function Button(config) {
    var _self = this;
    Button.superclass.constructor.call(_self, config);
  }

  Button.ATTRS = /** @lends Button.prototype */{
    /**
     * 按钮渲染的容器
     * @type Node
     * @default null
     */
    render: {
    },
    /**
     * 对应的表单上传域
     * @type KISSY.Node
     * @default ""
     */
    fileInput: {
    },
    /**
     * 文件上传域容器
     * @type KISSY.Node
     * @default ""
     */
    el: {
    },
    /**
     * 隐藏的表单上传域的模板
     * @type String
     */
    tpl : {
      value : '<div class="file-input-wrapper" style="overflow: hidden;"><input type="file" name="{name}" hidefocus="true" class="file-input" /></div>'
    },
    /**
     * 隐藏的表单上传域的name值
     * @type String
     * @default "Filedata"
     */
    name : {
      value : 'Filedata',
      setter : function(v) {
        if (this.get('fileInput')) {
          $(this.get('fileInput')).attr('name', v);
        }
        return v;
      }
    },
    /**
     * 是否可用,false为可用
     * @type Boolean
     * @default false
     */
    disabled : {
      value : false,
      setter : function(v) {
        this._setDisabled(v);
        return v;
      }
    },
    /**
     * 是否开启多选支持，多选目前有兼容性问题，建议禁用
     * @type Boolean
     * @default true
     */
    multiple : {
      value : true,
      setter : function(v){
        //this._setMultiple(v);
        return v;
      }
    },
    /**
     * 样式
     * @type Object
     * @default  { disabled : 'uploader-button-disabled' }
     */
    cls : {
      value : {
        disabled : 'uploader-button-disabled'
      }
    },
    /**
     * 事件
     * @type {Object}
     */
    events : {
      'beforeshow': 'beforeshow',
      'aftershow': 'aftershow',
      'beforehide': 'beforehide',
      'afterhide': 'afterhide',
      'beforerender' : 'beforerender',
      'afterrender' : 'afterrender',
      'change' : 'change'
    }
  };


  BUI.extend(Button, ButtonBase, /** @lends Button.prototype*/{
    /**
     * 运行
     * @return {Button} Button的实例
     */
    render : function() {
      var _self = this;

      _self.fire('beforerender');
      _self._createInput();
      _self.fire('afterrender');
      return _self;
    },
    /**
     * 创建隐藏的表单上传域
     * @return {HTMLElement} 文件上传域容器
     */
    _createInput: function() {
      var _self = this,
        render = _self.get('render'),
        name = _self.get('name'),
        tpl = _self.get('tpl'),
        html,
        inputContainer,
        fileInput;

      html = BUI.substitute(tpl, {
        'name': name
      });
      inputContainer = $(html);
      //向body添加表单文件上传域
      $(inputContainer).appendTo(render);
      fileInput = $(inputContainer).children('input');
      //TODO:IE6下只有通过脚本和内联样式才能控制按钮大小
      if(UA.ie == 6){
        fileInput.css('fontSize','400px');
      }
      _self._bindChangeHandler(fileInput);
      _self.set('fileInput', fileInput);
      _self.set('el', inputContainer);
      return inputContainer;
    },
    _bindChangeHandler: function(fileInput) {
      var _self = this;
      //上传框的值改变后触发
      $(fileInput).on('change', function(ev){
        var value = $(this).val(),
          oFiles = ev.target.files,
          files = [];
          
        //IE取不到files
        if(oFiles){
          BUI.each(oFiles, function(v){
            files.push(_self._getFileExtData({'name': v.name, 'type': v.type, 'size': v.size, file:v, input: fileInput[0]}));
          });
        }else{
          files.push(_self._getFileExtData({'name': getFileName(value), input: fileInput[0]}));
        }
        _self.fire('change', {
          files: files,
          input: this
        });
        _self.reset();
      });
    },
    //设置文件的扩展信息
    _getFileExtData: function(file){
      var textSize;
      if (file.size) {
        textSize = convertByteSize(file.size);
      }
      BUI.mix(file, {
        waiting: true,
        textSize: textSize,
        id: getFileId()
      });
      return file;
    },
    reset: function () {
      var _self = this,
        el = _self.get('el');
      //移除表单上传域容器
      $(el).remove();
      _self.set('el', null);
      _self.set('fileInput', null);
      //重新创建表单上传域
      _self._createInput();
      return _self;
    }
  });

  return Button;

});
