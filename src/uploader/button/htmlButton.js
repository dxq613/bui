/**
 * @fileoverview 文件上传按钮,使用input[type=file]
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/button/htmlButton', function(require) {

  var Base = require('bui/uploader/button/base');

  var LOG_PREFIX = '[Uploader-Button] ';

  var UA = BUI.UA;

  /**
   * 获取文件名称（从表单域的值中提取）
   * @param {String} path 文件路径
   * @return {String}
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
  }
  /**
   * @name Button
   * @class 文件上传按钮，ajax和iframe上传方式使用
   * @constructor
   * @extends Base
   * @param {Object} config 配置对象
   * @param {String} config.name  *，隐藏的表单上传域的name值
   * @param {Boolean} config.disabled 是否禁用按钮
   * @param {Boolean} config.multiple 是否开启多选支持
   */
  function Button(config) {
    var _self = this;
    //超类初始化
    Button.superclass.constructor.call(_self, config);
  }


  BUI.extend(Button, Base, /** @lends Button.prototype*/{
    /**
     * 运行
     * @return {Button} Button的实例
     */
    render : function() {
      console.log(this);
      var _self = this,
        render = _self.get('render'),
        isRender = _self.fire('beforerender');
      if (isRender === false) {
        BUI.log(LOG_PREFIX + 'button render was prevented.');
        return false;
      } else {
        if (render == null) {
          BUI.log(LOG_PREFIX + 'Cannot find render!');
          return false;
        }
        _self._createInput();
        _self.fire('afterrender');
        return _self;
      }
    },
    /**
     * 显示按钮
     */
    show : function() {
      var _self = this,
        el = _self.get('el');
      el.show();
      _self.fire('aftershow');
    },
    /**
     * 隐藏按钮
     * @return {Button} Button的实例
     */
    hide : function() {
      var _self = this,
        el = _self.get('el');
      el.hide();
      _self.fire('afterhide');
    },
    /**
     * 重置按钮
     * @return {Button} Button的实例
     */
    reset : function() {
      var _self = this,
        render = _self.get('render');
      //移除表单上传域容器
      $(render).empty();
      _self.set('el', null);
      _self.set('fileInput', null);
      //重新创建表单上传域
      _self._createInput();
      return _self;
    },
    /**
     * 创建隐藏的表单上传域
     * @return {HTMLElement} 文件上传域容器
     */
    _createInput : function() {
      var _self = this,
        render = _self.get('render'),
        name = _self.get('name'),
        tpl = _self.get('tpl'),
        html,
        inputContainer,
        fileInput;
      if (!BUI.isString(name) || !BUI.isString(tpl)) {
        BUI.log(LOG_PREFIX + 'No name or tpl specified.');
        return false;
      }
      html = BUI.substitute(tpl, {
        'name' : name
      });
      // TODO: inputContainer = DOM.create(html);
      inputContainer = $(html);
      //向body添加表单文件上传域
      $(inputContainer).appendTo(render);
      fileInput = $(inputContainer).children('input');
      //TODO:IE6下只有通过脚本和内联样式才能控制按钮大小
      if(UA.ie == 6){
        fileInput.css('fontSize','400px');
      }
      //TODO:firefox的fontSize不占宽度，必须额外设置left
      //if(S.UA.firefox)  fileInput.css('left','-1200px');
      //上传框的值改变后触发
      $(fileInput).on('change', _self._changeHandler, _self);
      _self.set('fileInput', fileInput);
      _self.set('el', inputContainer);
      //禁用按钮
      _self._setDisabled(_self.get('disabled'));
      //控制多选
      _self._setMultiple(_self.get('multiple'));
      return inputContainer;
    },
    /**
     * 文件上传域的值改变时触发
     * @param {Object} ev 事件对象
     */
    _changeHandler : function(ev) {
      var _self = this,
        fileInput = _self.get('fileInput'),
        value = $(fileInput).val(),
        //IE取不到files
        oFiles = ev.target.files,files = [];
      if (value == EMPTY) {
        BUI.log(LOG_PREFIX + 'No file selected.');
        return false;
      }
      if(oFiles){
        BUI.each(oFiles,function(v){
          if(S.isObject(v)){
            files.push({'name' : v.name,'type' : v.type,'size' : v.size,data:v});
          }
        });
      }else{
        files.push({'name': getFileName(value)});
      }
      _self.fire(Button.event.CHANGE, {
        files: files,
        input: fileInput.getDOMNode()
      });
      _self.reset();
    },
    /**
     * 设置上传组件的禁用
     * @param {Boolean} disabled 是否禁用
     * @return {Boolean}
     */
    _setDisabled : function(disabled){
      var _self = this,
        cls = _self.get('cls'),
        disabledCls = cls.disabled,
        $target = _self.get('target'),
        input = _self.get('fileInput');
      if(!$target.length || !S.isBoolean(disabled)) return false;
      if(!disabled){
        $target.removeClass(disabledCls);
        $(input).show();
      }else{
        $target.addClass(disabledCls);
        $(input).hide();
      }
      return disabled;
    },
    /**
     * 设置上传组件的禁用
     * @param {Boolean} multiple 是否禁用
     * @return {Boolean}
     */
    _setMultiple : function(multiple){
      var _self = this,fileInput = _self.get('fileInput');
      if(!fileInput.length) return false;
      multiple && fileInput.attr('multiple','multiple') || fileInput.removeAttr('multiple');
      return multiple;
    }
  }, {
    ATTRS : /** @lends Button.prototype */{
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
      // tpl : {
      //   value : '<div class="file-input-wrapper" style="overflow: hidden;"><input type="file" name="{name}" hidefocus="true" class="file-input" /></div>'
      // },
      /**
       * 隐藏的表单上传域的name值
       * @type String
       * @default "fileInput"
       */
      name : {
        value : 'fileInput',
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
          this._setMultiple(v);
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
    }
  });

  return Button;

});
