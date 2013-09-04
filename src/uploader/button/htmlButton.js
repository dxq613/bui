/**
 * @fileoverview 文件上传按钮,使用input[type=file]
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/button/htmlButton', function(require) {

  var BUI = require('bui/common'),
    Component = BUI.Component,
    ButtonBase = require('bui/uploader/button/base'),
    UA = BUI.UA;

  

  var HtmlButtonView = Component.View.extend({

  },{
    ATTRS: {
    }
  });

  /**
   * @name HtmlButton
   * @class 文件上传按钮，ajax和iframe上传方式使用
   * @constructor
   */
  var HtmlButton = Component.Controller.extend([ButtonBase], {
    renderUI: function(){
      var _self = this;
      _self._createInput();
    },
    bindUI: function(){

    },
    /**
     * 创建隐藏的表单上传域
     * @return {HTMLElement} 文件上传域容器
     */
    _createInput: function() {
      var _self = this,
        el = _self.get('el'),
        inputTpl = _self.get('inputTpl'),
        name = _self.get('name'),
        fileInput;

      inputTpl = BUI.substitute(inputTpl, {
        name: name
      });

      fileInput = $(inputTpl);
      fileInput.appendTo(el);

      //TODO:IE6下只有通过脚本和内联样式才能控制按钮大小
      if(UA.ie == 6){
        fileInput.css('fontSize','400px');
      }
      _self._bindChangeHandler(fileInput);

      _self.set('fileInput', fileInput);

      _self.setMultiple(_self.get('multiple'));
      _self.setFilter(_self.get('filter'));
      //_self._setDisabled(_self.get('disabled'));
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
            files.push(_self.getExtFileData({'name': v.name, 'type': v.type, 'size': v.size, file:v, input: fileInput[0]}));
          });
        }else{
          files.push(_self.getExtFileData({'name': value, input: fileInput[0]}));
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
      fileInput.remove();
      _self.set('fileInput', null);
      //重新创建表单上传域
      _self._createInput();
      return _self;
    },
    /**
     * 设置上传组件的禁用
     * @param {Boolean} multiple 是否禁用
     * @return {Boolean}
     */
    setMultiple : function(multiple){
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
     * 设置上传文件的类型
     * @param {[type]} filter 可上传文件的类型
     */
    setFilter: function(filter){
      var _self = this,
        fileInput = _self.get('fileInput');
      if(!fileInput || !fileInput.length){
        return false;
      };
      filter && fileInput
      return filter;
    }
  },{
    ATTRS: {
      elCls: {
        value: 'file-input-wrapper'
      },
      /**
       * 隐藏的表单上传域的模板
       * @type String
       */
      inputTpl: {
        view: true,
        value: '<input type="file" name="{name}" hidefocus="true" class="file-input" />'
      },
      /**
       * 对应的表单上传域
       * @type KISSY.Node
       * @default ""
       */
      fileInput: {
      },
      /**
       * 隐藏的表单上传域的name值
       * @type String
       * @default "Filedata"
       */
      name : {
        view: true,
        value : 'Filedata',
        setter : function(v) {
            v && this.get('fileInput') && $(this.get('fileInput')).attr('name', v);
          return v;
        }
      },
      xview: {
        value: HtmlButtonView
      }
    }
  });

  return HtmlButton;

});
