/**
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
        trigger = _self.get('curTrigger');
      return trigger.text();
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
      defaultChildClass : {
        value : 'form-field'
      },
      align : {
        value : {
          points: ['tl','tl']
        }
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
});