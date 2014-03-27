/**
 * @fileOverview 编辑器命名空间入口
 * @ignore
 */

define('bui/editor',['bui/common','bui/form','bui/editor/editor','bui/editor/record','bui/editor/dialog'],function (require) {
  var BUI = require('bui/common'),
    Form = require('bui/form'),
    Editor = BUI.namespace('Editor');

  BUI.mix(Editor,{
    Editor : require('bui/editor/editor'),
    RecordEditor : require('bui/editor/record'),
    DialogEditor : require('bui/editor/dialog')
  });
  return Editor;
});/**
 * @fileOverview 编辑器扩展类，引入这个扩展，控件可以支持编辑器功能。
 * @ignore
 */

define('bui/editor/mixin',function (require) {

  function initEditor (self) {
   var _self = self,
      controlCfgField = _self.get('controlCfgField'),
      control = _self.get(controlCfgField),
      c = _self.addChild(control);
    _self.setInternal(controlCfgField,c);
  }

  /**
   * @class BUI.Editor.Mixin
   * 编辑器扩展类
   */
  var Mixin = function () {
    initEditor(this);
  };

  Mixin.ATTRS = {
    /**
     * 接受更改的事件
     * @protected
     * @type {String}
     */
    acceptEvent : {
      value : 'autohide'
    },
    /**
     * 当发生错误时是否阻止编辑器消失
     * @type {Boolean}
     */
    preventHide : {
      value : true
    },
    /**
     * 重置数据时的事件
     * @type {String}
     */
    changeSourceEvent : {
      value : 'show triggerchange'
    },
    /**
     * 是否忽略掉输入框之类的键盘事件
     * @protected
     * @type {Boolean}
     */
    ignoreInputFields: {
      value :false
    },
    /**
     * 内部控件的代表Value的字段
     * @protected
     * @type {String}
     */
    innerValueField : {

    },
    /**
     * 空值的数据，清空编辑器时使用
     * @protected
     * @type {*}
     */
    emptyValue : {

    },
    /**
     * 内部控件配置项的字段
     * @protected
     * @type {String}
     */
    controlCfgField : {

    },
    focusable : {
      value : true
    },
    autoUpdate : {
      value : true
    },
    events : {
      value : {
        /**
         * @event
         * 接受更改
         */
        accept : false,
        /**
         * @event
         * 取消更改
         */
        cancel : false
      }
    }
  };

  Mixin.prototype = {
    //绑定事件
    __bindUI : function(){
      var _self = this,
      acceptEvent = _self.get('acceptEvent'),
      changeSourceEvent = _self.get('changeSourceEvent');

      if(acceptEvent){
        _self.on(acceptEvent,function(){
          if(_self.accept()){
            return ;
          }else if(_self.get('preventHide')){
            return false;
          }else{
            _self.cancel();
          }
        });
      }
      if(changeSourceEvent){
        _self.on(changeSourceEvent,function(){
          _self.setValue(_self.getSourceValue());
          if(_self.get('visible')){
            _self.focus();
          }
        });
      }
    },
    /**
     * @protected
     * 获取编辑器的内部控件
     * @return {BUI.Component.Controller} 用于编辑数据的内部数据
     */
    getInnerControl : function(){
      var _self = this,
        children = _self.get('children');
      return children[0];
    },
    /**
     * 设置值，值的类型取决于编辑器编辑的数据
     * @param {String|Object} value 编辑器显示的值
     * @param {Boolean} [hideError=false] 设置值时是否隐藏错误
     */
    setValue : function(value,hideError){
      var _self = this,
        innerControl = _self.getInnerControl();
      _self.set('editValue',value);
      _self.clearControlValue();
      innerControl.set(_self.get('innerValueField'),value);
      if(!value){//编辑的值等于空，则可能不会触发验证
        _self.valid();
      }
      if(hideError){
        _self.clearErrors();
      }
    },
    /**
     * 获取编辑器的值
     * @return {String|Object} 编辑器的值
     */
    getValue :function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.get(_self.get('innerValueField'));
    },
    /**
     * 编辑的内容是否通过验证
     * @return {Boolean} 是否通过验证
     */
    isValid : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.isValid ? innerControl.isValid() : true;
    },
    /**
     * 验证内容是否通过验证
     */
    valid : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.valid && innerControl.valid();
    },
    /**
     * 获取错误信息
     * @return {Array} 错误信息
     */
    getErrors : function(){
       var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.getErrors ? innerControl.getErrors() : [];
    },
    /**
     * 编辑的内容是否发生改变
     * @return {Boolean}
     */
    isChange : function(){
      var _self = this,
        editValue = _self.get('editValue'),
        value = _self.getValue();
      return editValue !== value;
    },
    /**
     * 清除编辑的值
     */
    clearValue : function(){
      this.clearControlValue();
      this.clearErrors();
    },
    /**
     * 清除编辑的控件的值
     * @protected
     * @template
     */
    clearControlValue : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.set(_self.get('innerValueField'),_self.get('emptyValue'));
    },
    /**
     * 清除错误
     */
    clearErrors : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.clearErrors();
    },
    /**
     * @protected
     * @template
     * 获取编辑的源数据
     */
    getSourceValue : function(){

    },
    /**
     * @protected
     * @template
     * 更新编辑的源数据
     */
    updateSource : function(){

    },
    /**
     * @protected
     * @override
     * 处理esc键
     */
    handleNavEsc : function(){
      this.cancel();
    },
    /**
     * @protected
     * @override
     * 处理enter键
     */
    handleNavEnter : function(ev){
      var sender = ev.target;
      if(sender.tagName === 'TEXTAREA'){ //文本输入框，不确定隐藏
        return;
      }
      if(sender.tagName === 'BUTTON'){
        $(sender).trigger('click');
      }
      this.accept();
    },
    /**
     * 设置获取焦点
     */
    focus : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.focus && innerControl.focus()
    },
    /**
     * 接受编辑器的编辑结果
     * @return {Boolean} 是否成功接受编辑
     */
    accept : function(){
      var _self = this,
        value;
      _self.valid();
      if(!_self.isValid()){
        return false;
      }
      value = _self.getValue();

      if(_self.get('autoUpdate')){
        _self.updateSource(value);
      }
      if(_self.fire('beforeaccept',{value :value}) == false){
        return;
      }
      _self.fire('accept',{value :value,editValue : _self.get('editValue')});/**/
      _self.hide();
      return true;
    },
    /**
     * 取消编辑
     */
    cancel : function(){
      this.fire('cancel');
      this.clearValue();
      this.close();
    }
  };

  return Mixin;
});/**
 * @ignore
 * @fileOverview 编辑器
 * @author dxq613@gmail.com
 */

define('bui/editor/editor',['bui/common','bui/overlay','bui/editor/mixin'],function (require) {
  var BUI = require('bui/common'),
    Overlay = require('bui/overlay').Overlay
    CLS_TIPS = 'x-editor-tips',
    Mixin = require('bui/editor/mixin');

  /**
   * @class BUI.Editor.Editor
   * @extends BUI.Overlay.Overlay
   * @mixins BUI.Editor.Mixin
   * 编辑器
   * <p>
   * <img src="../assets/img/class-editor.jpg"/>
   * </p>
   * <pre><code>
   * var editor = new Editor.Editor({
   *   trigger : '.edit-text',
   *   field : {
   *     rules : {
   *       required : true
   *     }
   *   }
   * });
   * </code></pre>
   */
  var editor = Overlay.extend([Mixin],{
    bindUI : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      _self.on('validchange',function(ev){
        if(!_self.isValid() && _self.get('visible')){
          _self._showError(_self.getErrors());
        }else{
          _self._hideError();
        }
      });
      _self.on('hide',function(){
        _self._hideError();
      });

      _self.on('show',function(){
        if(!_self.isValid()){
          _self._showError(_self.getErrors());
        }
      });
    },
    _initOverlay : function(){
      var _self = this,
        tooltip = _self.get('tooltip'),
        overlay = new Overlay(tooltip);
      overlay.render();
      _self.set('overlay',overlay);
      return overlay;
    },
    //获取显示错误列表
    _getErrorList : function(){
      var _self = this,
        overlay = _self.get('overlay');
      return overlay && overlay.get('children')[0];
    },
    _showError : function(errors){
      var _self = this,
        overlay = _self.get('overlay') || _self._initOverlay(),
        list = _self._getErrorList(),
        align = _self.get('errorAlign'),
        items = BUI.Array.map(errors,function(text){
          return {error : text};
        });
      list.set('items',items);
      align.node = _self.get('el');
      overlay.set('align',align);
      overlay.show();
    },
    //隐藏错误
    _hideError : function(){
      var _self = this,
        overlay = _self.get('overlay');
      overlay && overlay.hide();
    },
    /**
     * @protected
     * @override
     * 获取编辑的源数据
     * @return {String} 返回需要编辑的文本
     */
    getSourceValue : function(){
      var _self = this,
        trigger = _self.get('curTrigger'),
        parser = _self.get('parser'),
        text = trigger.text();
      if(parser){
        text = parser.call(this,text,trigger);
      }
      return text;
    },
    /**
     * @protected
     * 更新文本
     * @param  {String} text 编辑器的值
     */
    updateSource : function(text){
      var _self = this,
        trigger = _self.get('curTrigger');
      if(trigger && trigger.length){
        text = _self._formatText(text);
        trigger.text(text);
      }
    },
    //格式化文本
    _formatText : function(text){
      var _self = this,
        formatter = _self.get('formatter');
      if(formatter){
        text = formatter.call(_self,text);
      }
      return text;
    },
    _uiSetWidth : function(v){
      var _self = this;
      if(v != null){
        var innerControl = _self.getInnerControl();
        if(innerControl.set){
          innerControl.set('width',v);
        }
      }
    }
  },{
    ATTRS : {
      /**
       * 内部控件的代表Value的字段
       * @protected
       * @override
       * @type {String}
       */
      innerValueField : {
        value : 'value'
      },
      /**
       * 空值的数据，清空编辑器时使用
       * @protected
       * @type {*}
       */
      emptyValue : {
        value : ''
      },
      /**
       * 是否自动隐藏
       * @override
       * @type {Boolean}
       */
      autoHide : {
        value : true
      },
      /**
       * 内部控件配置项的字段
       * @protected
       * @type {String}
       */
      controlCfgField : {
        value : 'field'
      },
      /**
       * 默认的字段域配置项
       * @type {Object}
       */
      defaultChildCfg : {
        value : {
          tpl : '',
          forceFit : true,
          errorTpl : ''//
        }
      },
      /**
       * 错误提示信息的配置信息
       * @cfg {Object} tooltip
       */
      tooltip : {
        valueFn : function(){
          return  {
            children : [{
              xclass : 'simple-list',
              itemTpl : '<li><span class="x-icon x-icon-mini x-icon-error" title="{error}">!</span>&nbsp;<span>{error}</span></li>'
            }],
            elCls : CLS_TIPS
          };
        }
      },
      defaultChildClass : {
        value : 'form-field'
      },
      /**
       * 编辑器跟所编辑内容的对齐方式
       * @type {Object}
       */
      align : {
        value : {
          points: ['tl','tl']
        }
      },
      /**
       * 将编辑的文本转换成编辑器需要的格式,<br>
       * 函数原型：
       * function(text,trigger){}
       *
       * - text 编辑的文本
       * - trigger 编辑的DOM，有时候trigger.text()不等同于编辑的内容，可以在此处修改
       * 
       * @cfg {Function} parser
       */
      parser : {

      },
      /**
       * 返回数据的格式化函数
       * @cfg {Object} formatter
       */
      formatter : {

      },
      /**
       * 错误信息的对齐方式
       * @type {Object}
       */
      errorAlign : {
        value : {
          points: ['bl','tl'],
          offset : [0,10]
        }
      },
      /**
       * 显示错误的弹出层
       * @type {BUI.Overlay.Overlay}
       */
      overlay : {

      },
      /**
       * 编辑器中默认使用文本字段域来编辑数据
       * @type {Array}
       */
      field : {
        value : {}
      }
    }
  },{
    xclass : 'editor'
  });

  return editor;
});/**
 * @fileOverview 对象编辑器
 * @ignore
 */

define('bui/editor/record',['bui/common','bui/editor/editor'],function (require) {
  var BUI = require('bui/common'),
    Editor = require('bui/editor/editor');

  /**
   * @class BUI.Editor.RecordEditor
   * @extends BUI.Editor.Editor
   * 编辑器
   */
  var editor = Editor.extend({
    /**
     * @protected
     * @override
     * 获取编辑的源数据
     * @return {String} 返回需要编辑的文本
     */
    getSourceValue : function(){
      return this.get('record');
    },
    /**
     * @protected
     * 更新文本
     * @param  {Object} value 编辑器的值
     */
    updateSource : function(value){
      var _self = this,
        record = _self.get('record');
      BUI.mix(record,value);
    },
    _uiSetRecord : function(v){
      this.setValue(v);
    }
  },{
    ATTRS : {

      /**
       * 内部控件的代表Value的字段
       * @protected
       * @override
       * @type {String}
       */
      innerValueField : {
        value : 'record'
      },
      /**
       * 接受更改的事件
       * @type {String}
       */
      acceptEvent : {
        value : ''
      },
      /**
       * 空值的数据，清空编辑器时使用
       * @protected
       * @type {*}
       */
      emptyValue : {
        value : {}
      },
      /**
       * 是否自动隐藏
       * @override
       * @type {Boolean}
       */
      autoHide : {
        value : false
      },
      /**
       * 编辑的记录
       * @type {Object}
       */
      record : {
        value : {}
      },
      /**
       * 内部控件配置项的字段
       * @protected
       * @type {String}
       */
      controlCfgField : {
        value : 'form'
      },
      /**
       * 编辑器内表单的配置项
       * @type {Object}
       */
      form : {
        value : {}
      },
      /**
       * 错误信息的对齐方式
       * @type {Object}
       */
      errorAlign : {
        value : {
          points: ['tr','tl'],
          offset : [10,0]
        }
      },
      /**
       * 默认的字段域配置项
       * @type {Object}
       */
      defaultChildCfg : {
        valueFn : function(){
          var _self = this;
          return {
            xclass : 'form',
            errorTpl : '',
            showError : true,
            showChildError : true,
            defaultChildCfg : {
              elCls : 'bui-inline-block',
              tpl : '',
              forceFit : true
            },
            buttons : [
            {
              btnCls : 'button button-primary',
              text : '确定',
              handler : function(){
                _self.accept();
              }
            },
            {
              btnCls : 'button',
              text : '取消',
              handler : function(){
                _self.cancel();
              }
            }]
          }
        }
      }
    }
  },{
    xclass : 'record-editor'
  });

  return editor;
});/**
 * @fileOverview 使用弹出框作为编辑器
 * @ignore
 */

define('bui/editor/dialog',['bui/overlay','bui/editor/mixin'],function (require) {
  var Dialog = require('bui/overlay').Dialog,
    Mixin = require('bui/editor/mixin');

   /**
   * @class BUI.Editor.DialogEditor
   * @extends BUI.Overlay.Dialog
   * @mixins BUI.Editor.Mixin
   * 编辑器
   */
  var editor = Dialog.extend([Mixin],{
    /**
     * @protected
     * @override
     * 获取编辑的源数据
     * @return {String} 返回需要编辑的文本
     */
    getSourceValue : function(){
      return this.get('record');
    },
    /**
     * @protected
     * @override
     * 处理enter键
     */
    handleNavEnter : function(ev){
      var _self = this,
        success = _self.get('success'),
        sender = ev.target;
      if(sender.tagName === 'TEXTAREA'){ //文本输入框，不确定隐藏
        return;
      }
      if(sender.tagName === 'BUTTON'){
        $(sender).trigger('click');
      }
      if(success){
        success.call(_self);
      }else{
        this.accept();
      }
    },
    /**
     * 取消编辑
     */
    cancel : function(){
      //if(this.onCancel()!== false){
        this.fire('cancel');
        this.clearValue();
        this.close();
      //} 
    },
    /**
     * @protected
     * 更新文本
     * @param  {Object} value 编辑器的值
     */
    updateSource : function(value){
      var _self = this,
        record = _self.get('record');
      BUI.mix(record,value);
    },
    _uiSetRecord : function(v){
      this.setValue(v);
    }
  },{
    ATTRS : {
      /*autoHide : {
        value : false
      },*/
      /**
       * 内部控件的代表Value的字段
       * @protected
       * @override
       * @type {String}
       */
      innerValueField : {
        value : 'record'
      },
      /**
       * 接受更改的事件
       * @type {String}
       */
      acceptEvent : {
        value : ''
      },
      /**
       * 编辑的记录
       * @type {Object}
       */
      record : {
        value : {}
      },
      /**
       * 空值的数据，清空编辑器时使用
       * @protected
       * @type {*}
       */
      emptyValue : {
        shared : false,
        value : {}
      },
      /**
       * 内部控件配置项的字段
       * @protected
       * @type {String}
       */
      controlCfgField : {
        value : 'form'
      },
      /**
       * dialog 编辑器一般由按钮触发，在触发时设置数据源
       * @override
       * @type {String}
       */
      changeSourceEvent : {
        value : ''
      },
      /**
       * 默认的字段域配置项
       * @type {Object}
       */
      defaultChildCfg : {
        value : {
          xclass : 'form-horizontal'
        }
      },
      /**
       * 设置可以获取交单
       * @type {Boolean}
       */
      focusable : {
        value : false
      },
      success : {
        value : function () {
          this.accept();
        }
      },
      cancel : {
        value : function(){
          this.cancel();
        }
      },
      /**
       * 编辑器内表单的配置项
       * @type {Object}
       */
      form : {
        value : {}
      }
    }
  },{
    xclass : 'dialog-editor'
  });

  return editor;
});