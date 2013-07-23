/**
 * @fileoverview 文件上传按钮的基类
 * @author: 索丘 zengyue.yezy@alibaba-inc.com
 **/
define('bui/uploader/button/base', function(require) {

  var PREFIX = BUI.prefix,
    CLS_UPLOADER = PREFIX + 'uploader',
    CLS_UPLOADER_BUTTON = CLS_UPLOADER + '-button',
    CLS_UPLOADER_BUTTON_TEXT = CLS_UPLOADER_BUTTON + '-text';

  /**
   * 获取文件名称（从表单域的值中提取）
   * @param {String} path 文件路径
   * @return {String}
   */
  function getFileName (path) {
    return path.replace(/.*(\/|\\)/, "");
  }
  /**
   * @name Base
   * @class 文件上传按钮，ajax和iframe上传方式使用
   * @constructor
   * @extends BUI.Base
   * @param {Object} config 配置对象
   * @param {String} config.name  *，隐藏的表单上传域的name值
   * @param {Boolean} config.disabled 是否禁用按钮
   * @param {Boolean} config.multiple 是否开启多选支持
   */
  function Base(config) {
    var _self = this;
    //超类初始化
    Base.superclass.constructor.call(_self, config);
  }


  BUI.extend(Base, BUI.Base, /** @lends Base.prototype*/{
    /**
     * 运行
     * @return {Button} Button的实例
     */
    render : function() {
    },
    /**
     * 显示按钮
     */
    show : function() {
      var _self = this,
        el = _self.get('el');
      _self.fire('beforeshow');
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
      _self.fire('beforeshow');
      el.hide();
      _self.fire('afterhide');
    },
    /**
     * 重置按钮
     * @return {Button} Button的实例
     */
    reset : function() {
      var _self = this,
        el = _self.get('el');
      //移除表单上传域容器
      $(el).remove();
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
      
    },
    _setButtonCls: function(v){
      var _self = this,
        buttonCls = _self.get('buttonCls'),
        el = _self.get('el');
      buttonEl.addClass(buttonCls);
    },
    _setText: function(v) {
      var _self = this,
        textEl = _self.get('el').find('.' + CLS_UPLOADER_BUTTON_TEXT);
      textEl.text(v);
    },
    _setTextCls: function(v){
      var _self = this,
        textEl = _self.get('el').find('.' + CLS_UPLOADER_BUTTON_TEXT);
      textEl.addClass(v);
    },
    /**
     * 设置按钮的状态
     * @param {String} name 状态的名称
     * @param {String} value 状态对应的值
     */
    _setStatus: function(name, value){
      var _self = this;
    },
    /**
     * 获取按钮的状态
     * @param {String} name 状态的名称
     * @return {String} value 状态对应的值
     */
    _getStatus: function(name){
      return '';
    }
  }, {
    ATTRS : /** @lends Base.prototype */{
      /**
       * 按钮渲染的容器
       * @type Node
       * @default null
       */
      render: {
      },
      /**
       * 文件上传域容器
       * @type KISSY.Node
       * @default ""
       */
      el: {
      },
      buttonCls: {
      },
      textCls: {
        setter: function(v){
          this._setTextCls(v);
          return v;
        }
      },
      text: {
        value: '上传文件',
        setter: function(v){
          this._setText(v);
          return v;
        }
      },
      tpl: {
        value: '<a href="javascript:void(0);" class="' + CLS_UPLOADER_BUTTON + '  {buttonCls}"><span class="' + CLS_UPLOADER_BUTTON_TEXT + ' {textCls}">{text}</span>{buttonTpl}</a>'
      },
      /**
       * 隐藏的表单上传域的name值
       * @type String
       * @default "fileInput"
       */
      name: {
        value : 'fileInput'
      },
      filter: {
      },
      /**
       * 按钮当前的状态
       * @type Object
       * @default  { disabled : 'disabled' }
       */
      status : {
        value : {
          disabled : 'disabled',
          multiple: 'multiple'
        }
      },
      /**
       * 按钮当前的状态对应的class
       * @type Object
       * @default  { disabled : 'disabled' }
       */
      statusCls : {
        value : {
          disabled : 'disabled',
          multiple: 'multiple'
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

  return Base;

});
