/**
 * @ignore
 * @fileoverview 文件上传按钮,使用input[type=file]
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/button/htmlButton', ['bui/uploader/file', 'bui/uploader/button/base'], function(require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    File = require('bui/uploader/file'),
    ButtonBase = require('bui/uploader/button/base'),
    UA = BUI.UA;

  /**
   * 文件上传按钮，ajax和iframe上传方式使用,使用的是input[type=file]
   * @class BUI.Uploader.Button.HtmlButton
   * @extends BUI.Uploader.Button
   */
  var HtmlButton = ButtonBase.extend({
    renderUI: function(){
      var _self = this;
      _self._createInput();
    },
    /**
     * 创建隐藏的表单上传域
     * @private
     * @return {HTMLElement} 文件上传域容器
     */
    _createInput: function() {
      var _self = this,
        buttonCls = _self.get('buttonCls'),
        buttonEl = _self.get('el').find('.' + buttonCls),
        inputTpl = _self.get('inputTpl'),
        name = _self.get('name'),
        fileInput;

      inputTpl = BUI.substitute(inputTpl, {
        name: name
      });

      buttonEl.append(inputTpl);

      fileInput = buttonEl.find('input');

      //TODO:IE6下只有通过脚本和内联样式才能控制按钮大小
      if(UA.ie == 6){
        fileInput.css('fontSize','400px');
      }
      _self._bindChangeHandler(fileInput);

      _self.set('fileInput', fileInput);

      //因为每选中一次文件后，input[type=file]都会重新生成一遍，所以需要重新设置这些属性
      _self._uiSetMultiple(_self.get('multiple'));
      _self._uiSetDisabled(_self.get('disabled'));
      _self._uiSetFilter(_self.get('filter'));
    },
    /**
     * 绑定input[type=file]的文件选中事件
     */
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
            files.push(File.create({'name': v.name, 'type': v.type, 'size': v.size, file:v, input: fileInput}));
          });
        }else{
          files.push(File.create({'name': value, input: fileInput}));
        }
        _self.fire('change', {
          files: files,
          input: this
        });
        _self.reset();
      });
    },
    reset: function () {
      var _self = this,
        fileInput = _self.get('fileInput');

      //移除表单上传域容器
      fileInput.parent().remove();
      _self.set('fileInput', null);
      //重新创建表单上传域
      _self._createInput();
      return _self;
    },
    /**
     * 设置上传组件的禁用
     * @ignore
     * @param {Boolean} multiple 是否禁用
     * @return {Boolean}
     */
    _uiSetMultiple : function(multiple){
      var _self = this,
        fileInput = _self.get('fileInput');

      if(!fileInput || !fileInput.length){
        return false;
      };
      if(multiple){
        fileInput.attr('multiple', 'multiple');
      }
      else{
        fileInput.removeAttr('multiple');
      }
      return multiple;
    },
    /**
     * @protected
     * @ignore
     */
    _uiSetDisabled: function(v){
      var _self = this,
        fileInput = _self.get('fileInput');
      if (v) {
        fileInput.hide();
      }
      else{
        fileInput.show();
      }
    },
    /**
     * 设置上传文件的类型
     * @ignore
     * @protected
     * @param {*} filter 可上传文件的类型
     */
    _uiSetFilter: function(v){
      var _self = this,
        fileInput = _self.get('fileInput'),
        filter = _self.getFilter(v);
      if(!fileInput || !fileInput.length){
        return false;
      };
      //accept是html5的属性，所以ie8以下是不支持的
      filter.type && fileInput.attr('accept', filter.type);
      return filter;
    },
    _uiSetName: function(v){
      $(this.get('fileInput')).attr('name', v)
    }
  },{
    ATTRS: {
      /**
       * 隐藏的表单上传域的模板
       * @type String
       */
      inputTpl: {
        view: true,
        value: '<div class="file-input-wrapper"><input type="file" name="{name}" hidefocus="true" class="file-input" /></div>'
      },
      /**
       * 对应的表单上传域
       * @type {jQuery}
       */
      fileInput: {
      }
    }
  }, {
    xclass: 'uploader-htmlButton'
  });

  return HtmlButton;

});
