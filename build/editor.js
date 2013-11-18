/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
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
});
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
   * \u7f16\u8f91\u5668\u6269\u5c55\u7c7b
   */
  var Mixin = function () {
    initEditor(this);
  };

  Mixin.ATTRS = {
    /**
     * \u63a5\u53d7\u66f4\u6539\u7684\u4e8b\u4ef6
     * @protected
     * @type {String}
     */
    acceptEvent : {
      value : 'autohide'
    },
    /**
     * \u5f53\u53d1\u751f\u9519\u8bef\u65f6\u662f\u5426\u963b\u6b62\u7f16\u8f91\u5668\u6d88\u5931
     * @type {Boolean}
     */
    preventHide : {
      value : true
    },
    /**
     * \u91cd\u7f6e\u6570\u636e\u65f6\u7684\u4e8b\u4ef6
     * @type {String}
     */
    changeSourceEvent : {
      value : 'show triggerchange'
    },
    /**
     * \u662f\u5426\u5ffd\u7565\u6389\u8f93\u5165\u6846\u4e4b\u7c7b\u7684\u952e\u76d8\u4e8b\u4ef6
     * @protected
     * @type {Boolean}
     */
    ignoreInputFields: {
      value :true
    },
    /**
     * \u5185\u90e8\u63a7\u4ef6\u7684\u4ee3\u8868Value\u7684\u5b57\u6bb5
     * @protected
     * @type {String}
     */
    innerValueField : {

    },
    /**
     * \u7a7a\u503c\u7684\u6570\u636e\uff0c\u6e05\u7a7a\u7f16\u8f91\u5668\u65f6\u4f7f\u7528
     * @protected
     * @type {*}
     */
    emptyValue : {

    },
    /**
     * \u5185\u90e8\u63a7\u4ef6\u914d\u7f6e\u9879\u7684\u5b57\u6bb5
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
         * \u63a5\u53d7\u66f4\u6539
         */
        accept : false,
        /**
         * @event
         * \u53d6\u6d88\u66f4\u6539
         */
        cancel : false
      }
    }
  };

  Mixin.prototype = {
    //\u7ed1\u5b9a\u4e8b\u4ef6
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
     * \u83b7\u53d6\u7f16\u8f91\u5668\u7684\u5185\u90e8\u63a7\u4ef6
     * @return {BUI.Component.Controller} \u7528\u4e8e\u7f16\u8f91\u6570\u636e\u7684\u5185\u90e8\u6570\u636e
     */
    getInnerControl : function(){
      var _self = this,
        children = _self.get('children');
      return children[0];
    },
    /**
     * \u8bbe\u7f6e\u503c\uff0c\u503c\u7684\u7c7b\u578b\u53d6\u51b3\u4e8e\u7f16\u8f91\u5668\u7f16\u8f91\u7684\u6570\u636e
     * @param {String|Object} value \u7f16\u8f91\u5668\u663e\u793a\u7684\u503c
     * @param {Boolean} [hideError=false] \u8bbe\u7f6e\u503c\u65f6\u662f\u5426\u9690\u85cf\u9519\u8bef
     */
    setValue : function(value,hideError){
      var _self = this,
        innerControl = _self.getInnerControl();
      _self.set('editValue',value);
      _self.clearControlValue();
      innerControl.set(_self.get('innerValueField'),value);
      if(!value){//\u7f16\u8f91\u7684\u503c\u7b49\u4e8e\u7a7a\uff0c\u5219\u53ef\u80fd\u4e0d\u4f1a\u89e6\u53d1\u9a8c\u8bc1
        _self.valid();
      }
      if(hideError){
        _self.clearErrors();
      }
    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u5668\u7684\u503c
     * @return {String|Object} \u7f16\u8f91\u5668\u7684\u503c
     */
    getValue :function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.get(_self.get('innerValueField'));
    },
    /**
     * \u7f16\u8f91\u7684\u5185\u5bb9\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     * @return {Boolean} \u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    isValid : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.isValid ? innerControl.isValid() : true;
    },
    /**
     * \u9a8c\u8bc1\u5185\u5bb9\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    valid : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.valid && innerControl.valid();
    },
    /**
     * \u83b7\u53d6\u9519\u8bef\u4fe1\u606f
     * @return {Array} \u9519\u8bef\u4fe1\u606f
     */
    getErrors : function(){
       var _self = this,
        innerControl = _self.getInnerControl();
      return innerControl.getErrors ? innerControl.getErrors() : [];
    },
    /**
     * \u7f16\u8f91\u7684\u5185\u5bb9\u662f\u5426\u53d1\u751f\u6539\u53d8
     * @return {Boolean}
     */
    isChange : function(){
      var _self = this,
        editValue = _self.get('editValue'),
        value = _self.getValue();
      return editValue !== value;
    },
    /**
     * \u6e05\u9664\u7f16\u8f91\u7684\u503c
     */
    clearValue : function(){
      this.clearControlValue();
      this.clearErrors();
    },
    /**
     * \u6e05\u9664\u7f16\u8f91\u7684\u63a7\u4ef6\u7684\u503c
     * @protected
     * @template
     */
    clearControlValue : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.set(_self.get('innerValueField'),_self.get('emptyValue'));
    },
    /**
     * \u6e05\u9664\u9519\u8bef
     */
    clearErrors : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.clearErrors();
    },
    /**
     * @protected
     * @template
     * \u83b7\u53d6\u7f16\u8f91\u7684\u6e90\u6570\u636e
     */
    getSourceValue : function(){

    },
    /**
     * @protected
     * @template
     * \u66f4\u65b0\u7f16\u8f91\u7684\u6e90\u6570\u636e
     */
    updateSource : function(){

    },
    /**
     * @protected
     * @override
     * \u5904\u7406esc\u952e
     */
    handleNavEsc : function(){
      this.cancel();
    },
    /**
     * @protected
     * @override
     * \u5904\u7406enter\u952e
     */
    handleNavEnter : function(ev){
      var sender = ev.target;
      if(sender.tagName === 'TEXTAREA'){ //\u6587\u672c\u8f93\u5165\u6846\uff0c\u4e0d\u786e\u5b9a\u9690\u85cf
        return;
      }
      if(sender.tagName === 'BUTTON'){
        $(sender).trigger('click');
      }
      this.accept();
    },
    /**
     * \u8bbe\u7f6e\u83b7\u53d6\u7126\u70b9
     */
    focus : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      innerControl.focus && innerControl.focus()
    },
    /**
     * \u63a5\u53d7\u7f16\u8f91\u5668\u7684\u7f16\u8f91\u7ed3\u679c
     * @return {Boolean} \u662f\u5426\u6210\u529f\u63a5\u53d7\u7f16\u8f91
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
     * \u53d6\u6d88\u7f16\u8f91
     */
    cancel : function(){
      this.fire('cancel');
      this.clearValue();
      this.close();
    }
  };

  return Mixin;
});
define('bui/editor/editor',['bui/common','bui/overlay','bui/editor/mixin'],function (require) {
  var BUI = require('bui/common'),
    Overlay = require('bui/overlay').Overlay
    CLS_TIPS = 'x-editor-tips',
    Mixin = require('bui/editor/mixin');

  /**
   * @class BUI.Editor.Editor
   * @extends BUI.Overlay.Overlay
   * @mixins BUI.Editor.Mixin
   * \u7f16\u8f91\u5668
   * <p>
   * <img src="../assets/img/class-editor.jpg"/>
   * </p>
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
        overlay = new Overlay({
          children : [{
            xclass : 'simple-list',
            itemTpl : '<li><span class="x-icon x-icon-mini x-icon-error" title="{error}">!</span>&nbsp;<span>{error}</span></li>'
          }],
          elCls : CLS_TIPS,
          autoRender : true
        });
      _self.set('overlay',overlay);
      return overlay;
    },
    //\u83b7\u53d6\u663e\u793a\u9519\u8bef\u5217\u8868
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
    //\u9690\u85cf\u9519\u8bef
    _hideError : function(){
      var _self = this,
        overlay = _self.get('overlay');
      overlay && overlay.hide();
    },
    /**
     * @protected
     * @override
     * \u83b7\u53d6\u7f16\u8f91\u7684\u6e90\u6570\u636e
     * @return {String} \u8fd4\u56de\u9700\u8981\u7f16\u8f91\u7684\u6587\u672c
     */
    getSourceValue : function(){
      var _self = this,
        trigger = _self.get('curTrigger');
      return trigger.text();
    },
    /**
     * @protected
     * \u66f4\u65b0\u6587\u672c
     * @param  {String} text \u7f16\u8f91\u5668\u7684\u503c
     */
    updateSource : function(text){
      var _self = this,
        trigger = _self.get('curTrigger');
      if(trigger && trigger.length){
        trigger.text(text);
      }
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
       * \u5185\u90e8\u63a7\u4ef6\u7684\u4ee3\u8868Value\u7684\u5b57\u6bb5
       * @protected
       * @override
       * @type {String}
       */
      innerValueField : {
        value : 'value'
      },
      /**
       * \u7a7a\u503c\u7684\u6570\u636e\uff0c\u6e05\u7a7a\u7f16\u8f91\u5668\u65f6\u4f7f\u7528
       * @protected
       * @type {*}
       */
      emptyValue : {
        value : ''
      },
      /**
       * \u662f\u5426\u81ea\u52a8\u9690\u85cf
       * @override
       * @type {Boolean}
       */
      autoHide : {
        value : true
      },
      /**
       * \u5185\u90e8\u63a7\u4ef6\u914d\u7f6e\u9879\u7684\u5b57\u6bb5
       * @protected
       * @type {String}
       */
      controlCfgField : {
        value : 'field'
      },
      /**
       * \u9ed8\u8ba4\u7684\u5b57\u6bb5\u57df\u914d\u7f6e\u9879
       * @type {Object}
       */
      defaultChildCfg : {
        value : {
          tpl : '',
          forceFit : true,
          errorTpl : ''//
        }
      },
      defaultChildClass : {
        value : 'form-field'
      },
      align : {
        value : {
          points: ['tl','tl']
        }
      },
      /**
       * \u9519\u8bef\u4fe1\u606f\u7684\u5bf9\u9f50\u65b9\u5f0f
       * @type {Object}
       */
      errorAlign : {
        value : {
          points: ['bl','tl'],
          offset : [0,10]
        }
      },
      /**
       * \u663e\u793a\u9519\u8bef\u7684\u5f39\u51fa\u5c42
       * @type {BUI.Overlay.Overlay}
       */
      overlay : {

      },
      /**
       * \u7f16\u8f91\u5668\u4e2d\u9ed8\u8ba4\u4f7f\u7528\u6587\u672c\u5b57\u6bb5\u57df\u6765\u7f16\u8f91\u6570\u636e
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
});
define('bui/editor/record',['bui/common','bui/editor/editor'],function (require) {
  var BUI = require('bui/common'),
    Editor = require('bui/editor/editor');

  /**
   * @class BUI.Editor.RecordEditor
   * @extends BUI.Editor.Editor
   * \u7f16\u8f91\u5668
   */
  var editor = Editor.extend({
    /**
     * @protected
     * @override
     * \u83b7\u53d6\u7f16\u8f91\u7684\u6e90\u6570\u636e
     * @return {String} \u8fd4\u56de\u9700\u8981\u7f16\u8f91\u7684\u6587\u672c
     */
    getSourceValue : function(){
      return this.get('record');
    },
    /**
     * @protected
     * \u66f4\u65b0\u6587\u672c
     * @param  {Object} value \u7f16\u8f91\u5668\u7684\u503c
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
       * \u5185\u90e8\u63a7\u4ef6\u7684\u4ee3\u8868Value\u7684\u5b57\u6bb5
       * @protected
       * @override
       * @type {String}
       */
      innerValueField : {
        value : 'record'
      },
      /**
       * \u63a5\u53d7\u66f4\u6539\u7684\u4e8b\u4ef6
       * @type {String}
       */
      acceptEvent : {
        value : ''
      },
      /**
       * \u7a7a\u503c\u7684\u6570\u636e\uff0c\u6e05\u7a7a\u7f16\u8f91\u5668\u65f6\u4f7f\u7528
       * @protected
       * @type {*}
       */
      emptyValue : {
        value : {}
      },
      /**
       * \u662f\u5426\u81ea\u52a8\u9690\u85cf
       * @override
       * @type {Boolean}
       */
      autoHide : {
        value : false
      },
      /**
       * \u7f16\u8f91\u7684\u8bb0\u5f55
       * @type {Object}
       */
      record : {
        value : {}
      },
      /**
       * \u5185\u90e8\u63a7\u4ef6\u914d\u7f6e\u9879\u7684\u5b57\u6bb5
       * @protected
       * @type {String}
       */
      controlCfgField : {
        value : 'form'
      },
      /**
       * \u7f16\u8f91\u5668\u5185\u8868\u5355\u7684\u914d\u7f6e\u9879
       * @type {Object}
       */
      form : {
        value : {}
      },
      /**
       * \u9519\u8bef\u4fe1\u606f\u7684\u5bf9\u9f50\u65b9\u5f0f
       * @type {Object}
       */
      errorAlign : {
        value : {
          points: ['tr','tl'],
          offset : [10,0]
        }
      },
      /**
       * \u9ed8\u8ba4\u7684\u5b57\u6bb5\u57df\u914d\u7f6e\u9879
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
              text : '\u786e\u5b9a',
              handler : function(){
                _self.accept();
              }
            },
            {
              btnCls : 'button',
              text : '\u53d6\u6d88',
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
});
define('bui/editor/dialog',['bui/overlay','bui/editor/mixin'],function (require) {
  var Dialog = require('bui/overlay').Dialog,
    Mixin = require('bui/editor/mixin');

   /**
   * @class BUI.Editor.DialogEditor
   * @extends BUI.Overlay.Dialog
   * @mixins BUI.Editor.Mixin
   * \u7f16\u8f91\u5668
   */
  var editor = Dialog.extend([Mixin],{
    /**
     * @protected
     * @override
     * \u83b7\u53d6\u7f16\u8f91\u7684\u6e90\u6570\u636e
     * @return {String} \u8fd4\u56de\u9700\u8981\u7f16\u8f91\u7684\u6587\u672c
     */
    getSourceValue : function(){
      return this.get('record');
    },
    /**
     * @protected
     * @override
     * \u5904\u7406enter\u952e
     */
    handleNavEnter : function(ev){
      var _self = this,
        success = _self.get('success'),
        sender = ev.target;
      if(sender.tagName === 'TEXTAREA'){ //\u6587\u672c\u8f93\u5165\u6846\uff0c\u4e0d\u786e\u5b9a\u9690\u85cf
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
     * \u53d6\u6d88\u7f16\u8f91
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
     * \u66f4\u65b0\u6587\u672c
     * @param  {Object} value \u7f16\u8f91\u5668\u7684\u503c
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
       * \u5185\u90e8\u63a7\u4ef6\u7684\u4ee3\u8868Value\u7684\u5b57\u6bb5
       * @protected
       * @override
       * @type {String}
       */
      innerValueField : {
        value : 'record'
      },
      /**
       * \u63a5\u53d7\u66f4\u6539\u7684\u4e8b\u4ef6
       * @type {String}
       */
      acceptEvent : {
        value : ''
      },
      /**
       * \u7f16\u8f91\u7684\u8bb0\u5f55
       * @type {Object}
       */
      record : {
        value : {}
      },
      /**
       * \u7a7a\u503c\u7684\u6570\u636e\uff0c\u6e05\u7a7a\u7f16\u8f91\u5668\u65f6\u4f7f\u7528
       * @protected
       * @type {*}
       */
      emptyValue : {
        value : {}
      },
      /**
       * \u5185\u90e8\u63a7\u4ef6\u914d\u7f6e\u9879\u7684\u5b57\u6bb5
       * @protected
       * @type {String}
       */
      controlCfgField : {
        value : 'form'
      },
      /**
       * dialog \u7f16\u8f91\u5668\u4e00\u822c\u7531\u6309\u94ae\u89e6\u53d1\uff0c\u5728\u89e6\u53d1\u65f6\u8bbe\u7f6e\u6570\u636e\u6e90
       * @override
       * @type {String}
       */
      changeSourceEvent : {
        value : ''
      },
      /**
       * \u9ed8\u8ba4\u7684\u5b57\u6bb5\u57df\u914d\u7f6e\u9879
       * @type {Object}
       */
      defaultChildCfg : {
        value : {
          xclass : 'form-horizontal'
        }
      },
      /**
       * \u8bbe\u7f6e\u53ef\u4ee5\u83b7\u53d6\u4ea4\u5355
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
       * \u7f16\u8f91\u5668\u5185\u8868\u5355\u7684\u914d\u7f6e\u9879
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