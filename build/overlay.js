/**
 * @fileOverview Overlay 模块的入口
 * @ignore
 */

define('bui/overlay',function (require) {
  var BUI = require('bui/common'),
    Overlay = BUI.namespace('Overlay');

  BUI.mix(Overlay,{
    Overlay : require('bui/overlay/overlay'),
    Dialog : require('bui/overlay/dialog'),
    Message : require('bui/overlay/message'),
    Picker : require('bui/overlay/picker')
  });

  BUI.mix(Overlay,{
    OverlayView : Overlay.Overlay.View,
    DialogView : Overlay.Dialog.View
  });

  BUI.Message = BUI.Overlay.Message;
  return Overlay;

});/**
 * @fileOverview 悬浮层
 * @ignore
 */

define('bui/overlay/overlay',function (require) {
  var BUI = require('bui/common'),
    Component =  BUI.Component,
    UIBase = Component.UIBase;

  /**
   * 悬浮层的视图类
   * @class BUI.Overlay.OverlayView
   * @extends BUI.Component.View
   * @mixins BUI.Component.UIBase.PositionView
   * @mixins BUI.Component.UIBase.CloseView
   * @private
   */
  var overlayView = Component.View.extend([
      UIBase.PositionView,
      UIBase.CloseView
    ]);

  /**
   * 悬浮层，显示悬浮信息，Message、Dialog的基类
   * <p>
   * <img src="../assets/img/class-overlay.jpg"/>
   * </p>
   * xclass : 'overlay'
   * @class BUI.Overlay.Overlay
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.Position
   * @mixins BUI.Component.UIBase.Align
   * @mixins BUI.Component.UIBase.Close
   * @mixins BUI.Component.UIBase.AutoShow
   * @mixins BUI.Component.UIBase.AutoHide
   */
  var overlay = Component.Controller.extend([UIBase.Position,UIBase.Align,UIBase.Close,UIBase.AutoShow,UIBase.AutoHide],{
    
    show : function(){
      var _self = this,
        effectCfg = _self.get('effect'),
        el = _self.get('el'),
		    visibleMode = _self.get('visibleMode'),
        effect = effectCfg.effect,
        duration = effectCfg.duration;

  	  if(visibleMode === 'visibility'){
    		overlay.superclass.show.call(_self);
    		if(effectCfg.callback){
              effectCfg.callback.call(_self);
        }
    		return;
  	  }
      //如果还未渲染，则先渲染控件
      if(!_self.get('rendered')){
        _self.set('visible',true);
        _self.render();
        _self.set('visible',false);
        el = _self.get('el');
      }
      
      switch(effect){
        case  'linear' :
          el.show(duration,callback);
          break;
        case  'fade' :
          el.fadeIn(duration,callback);
          break;
        case  'slide' :
          el.slideDown(duration,callback);
          break;
        default:
          callback();
        break;
      }

      function callback(){
        _self.set('visible',true);
        if(effectCfg.callback){
          effectCfg.callback.call(_self);
        }
      }

    },
    hide : function(){
      var _self = this,
        effectCfg = _self.get('effect'),
        el = _self.get('el'),
        effect = effectCfg.effect,
        duration = effectCfg.duration;
  	  if(_self.get('visibleMode') === 'visibility'){
  		  callback();
  		  return;
  	  }
      switch(effect){
        case 'linear':
          el.hide(duration,callback);
          break;
        case  'fade' :
          el.fadeOut(duration,callback);
          break;
        case  'slide' :
          el.slideUp(duration,callback);
          break;
        default:
          callback();
        break;
      }
      function callback(){
        _self.set('visible',false);
        if(effectCfg.callback){
          effectCfg.callback.call(_self);
        }
      }

    }
  },{
    ATTRS : 
	/**
	* @lends BUI.Overlay.Overlay#
  * @ignore 
	**/	
	{
      /**
       * {Object} - 可选, 显示或隐藏时的特效支持, 对象包含以下配置
       * <ol>
       * <li>effect:特效效果，'none(默认无特效)','linear(线性)',fade(渐变)','slide(滑动出现)'</li>
       * <li>duration:时间间隔 </li>
       * </ol>
       * @type {Object}
       */
      effect:{
        value : {
          effect : 'none',
          duration : 0,
          callback : null
        }
      },
      /**
       * whether this component can be closed.
       * @default false
       * @type {Boolean}
       * @protected
       */
      closable:{
          value:false
      },
      visible :{
        value:false
      },
      xview : {
        value : overlayView
      }
    }
  },{
    xclass:'overlay'
  });

  overlay.View = overlayView;
  return overlay;

});/**
 * @fileOverview 选择器
 * @ignore
 */

define('bui/overlay/picker',function (require) {
  
  var Overlay = require('bui/overlay/overlay');
  /**
   * 选择器控件，弹出一个层来选择数据
   * @class BUI.Overlay.Picker
   * @extends BUI.Overlay.Overlay
   */
  var picker = Overlay.extend({
    
      bindUI : function(){
        var _self = this,
          innerControl = _self.get('innerControl'),
          hideEvent = _self.get('hideEvent'),
          trigger = $(_self.get('trigger'));

        trigger.on(_self.get('triggerEvent'),function(e){
          if(_self.get('autoSetValue')){
            var valueField = _self.get('valueField') || _self.get('textField') || this,
              val = $(valueField).val();
            _self.setSelectedValue(val);
          }
        });

        innerControl.on(_self.get('changeEvent'),function(e){
          var curTrigger = _self.get('curTrigger'),
            textField = _self.get('textField') || curTrigger,
            valueField = _self.get('valueField'),
            selValue = _self.getSelectedValue(),
            isChange = false;

          if(textField){
            var selText = _self.getSelectedText(),
              preText = $(textField).val();
            if(selText != preText){
              $(textField).val(selText);
              isChange = true;
            }
          }
          
          if(valueField){
            var preValue = $(valueField).val();  
            if(valueField != preValue){
              $(valueField).val(selValue);
              isChange = true;
            }
          }
          if(isChange){
            _self.fire('selectedchange',{value : selValue,curTrigger : curTrigger});
          }
          
        });
        if(hideEvent){
          innerControl.on(_self.get('hideEvent'),function(){
            _self.hide();
          });
        }
      },
      /**
       * 设置选中的值
       * @param {String} val 设置值
       */
      setSelectedValue : function(val){
        
      },
      /**
       * 获取选中的值，多选状态下，值以','分割
       * @return {String} 选中的值
       */
      getSelectedValue : function(){
        
      },
      /**
       * 获取选中项的文本，多选状态下，文本以','分割
       * @return {String} 选中的文本
       */
      getSelectedText : function(){

      },
      _uiSetValueField : function(v){
        var _self = this;
        if(v){
          _self.setSelectedValue($(v).val());
        }
      },
      _getTextField : function(){
        var _self = this;
        return _self.get('textField') || _self.get('curTrigger');
      }
  },{
    ATTRS : {
      
      /**
       * 用于选择的控件，默认为第一个子元素,此控件实现 @see {BUI.Component.UIBase.Selection} 接口
       * @protected
       * @type {Object|BUI.Component.Controller}
       */
      innerControl : {
        getter:function(){
          return this.get('children')[0];
        }
      },
      /**
       * 显示选择器的事件
       * @cfg {String} [triggerEvent='click']
       */
      /**
       * 显示选择器的事件
       * @type {String}
       * @default 'click'
       */
      triggerEvent:{
        value:'click'
      },
      /**
       * 选择器选中的项，是否随着触发器改变
       * @cfg {Boolean} [autoSetValue=true]
       */
      /**
       * 选择器选中的项，是否随着触发器改变
       * @type {Boolean}
       */
      autoSetValue : {
        value : true
      },
      /**
       * 选择发生改变的事件
       * @cfg {String} [changeEvent='selectedchange']
       */
      /**
       * 选择发生改变的事件
       * @type {String}
       */
      changeEvent : {
        value:'selectedchange'
      },
      /**
       * 自动隐藏
       * @type {Boolean}
       * @override
       */
      autoHide:{
        value : true
      },
      /**
       * 隐藏选择器的事件
       * @protected
       * @type {String}
       */
      hideEvent:{
        value:'itemclick'
      },
      /**
       * 返回的文本放在的DOM，一般是input
       * @cfg {String|HTMLElement|jQuery} textField
       */
      /**
       * 返回的文本放在的DOM，一般是input
       * @type {String|HTMLElement|jQuery}
       */
      textField : {

      },
      align : {
        value : {
           points: ['bl','tl'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
           offset: [0, 0]      // 有效值为 [n, m]
        }
      },
      /**
       * 返回的值放置DOM ,一般是input
       * @cfg {String|HTMLElement|jQuery} valueField
       */
      /**
       * 返回的值放置DOM ,一般是input
       * @type {String|HTMLElement|jQuery}
       */
      valueField:{

      }
    }
  },{
    xclass:'picker'
  });

  return picker;
});/**
 * @fileOverview 弹出框
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/overlay/dialog',function (require) {
  var Overlay = require('bui/overlay/overlay'),
    UIBase = BUI.Component.UIBase,
  	CLS_TITLE = 'header-title',
  	PREFIX = BUI.prefix,
    HEIGHT_PADDING = 20;

  /**
   * dialog的视图类
   * @class BUI.Overlay.DialogView
   * @extends BUI.Overlay.OverlayView
   * @mixins BUI.Component.UIBase.StdModView
   * @mixins BUI.Component.UIBase.MaskView
   * @private
   */
  var dialogView = Overlay.View.extend([UIBase.StdModView,UIBase.MaskView],{

    _uiSetTitle:function(v){
      var _self = this,
        el = _self.get('el');

      el.find('.' + CLS_TITLE).html(v);

    },
    _uiSetContentId : function(v){
      var _self = this,
        body = _self.get('body'),
        children = $('#'+v).children();

      children.appendTo(body);
    },
    _uiSetHeight : function(v){
      var _self = this,
        bodyHeight = v,
        header = _self.get('header'),
        body = _self.get('body'),
        footer = _self.get('footer');

      bodyHeight -= header.outerHeight()+footer.outerHeight();
      bodyHeight -=HEIGHT_PADDING * 2;
      body.height(bodyHeight);
    },
    _removeContent : function(){
      var _self = this,
        body = _self.get('body'),
        contentId = _self.get('contentId');
      if(contentId){
        body.children().appendTo($('#'+contentId));
      }else {
        body.children().remove();
      }
    }

  },{
    xclass:'dialog-view'
  });

  /**
   * 弹出框 xclass:'dialog'
   * <p>
   * <img src="../assets/img/class-overlay.jpg"/>
   * </p>
   * 
   * @class BUI.Overlay.Dialog
   * @extends BUI.Overlay.Overlay
   * @mixins BUI.Component.UIBase.StdMod
   * @mixins BUI.Component.UIBase.Mask
   * @mixins BUI.Component.UIBase.Drag
   */
  var dialog = Overlay.extend([UIBase.StdMod,UIBase.Mask,UIBase.Drag],{
    
    show:function(){
      var _self = this;

      dialog.superclass.show.call(this);
      _self.center();
    },
    _uiSetButtons:function(buttons){
      var _self = this,
        footer = _self.get('footer');

      footer.children().remove();
      BUI.each(buttons,function(conf){
        _self._createButton(conf,footer);
      });

    },
    _createButton : function(conf,parent){
      var _self = this,
        temp = '<button class="'+conf.elCls+'">'+conf.text+'</button>',
        btn = $(temp).appendTo(parent);
      btn.on('click',function(){
        conf.handler.call(_self);
      });
    }
  },{

    ATTRS : 
  	/**
  	* @lends BUI.Overlay.Dialog#
    * @ignore 
  	*/
    {
      closeTpl:{
        view:true,
        value : '<a tabindex="0" href=javascript:void("关闭") role="button" class="' + PREFIX + 'ext-close" style=""><span class="' + PREFIX + 'ext-close-x x-icon x-icon-normal">×</span></a>'
      },
     /**
       * 弹出库的按钮，可以有多个,有3个参数
       * <ol>
       *   <li>text:按钮文本</li>
       *   <li>elCls:按钮样式</li>
       *   <li>handler:点击按钮的回调事件</li>
       * </ol>
       * @cfg {Array} buttons
       * @default '确定'、'取消'2个按钮
       * 
       */
      /**
       * 弹出库的按钮，可以有多个,有3个参数
       * <ol>
       *   <li>text:按钮文本</li>
       *   <li>elCls:按钮样式</li>
       *   <li>handler:点击按钮的回调事件</li>
       * </ol>
       * @type {Array}
       * @default '确定'、'取消'2个按钮
       */
      buttons:{
        value:[
          {
            text:'确定',
            elCls : 'button button-primary',
            handler : function(){
              var _self = this,
                success = _self.get('success');
              if(success){
                success.call(_self);
              }
            }
          },{
            text:'取消',
            elCls : 'button button-primary',
            handler : function(){
              this.hide();
            }
          }
        ]
      },
      /**
       * 弹出框显示内容的DOM容器ID
       * @cfg {Object} contentId
       */
      /**
       * 弹出框显示内容的DOM容器ID
       * @type {Object}
       */
      contentId:{
        view:true
      },
  	  /**
      * 点击成功时的回调函数
      * @cfg {Function} success
      */
      /**
      * 点击成功时的回调函数
      * @type {Function}
      */
      success : {
        value : function(){

        }
      },
      dragNode : {
        /**
         * @private
         */
        valueFn : function(){
          return this.get('header');
        }
      },
      /**
       * 弹出框标题
       * @cfg {String} title
       */
      /**
       * 弹出框标题
       * @type {String}
       */
      title : {
        view:true,
        value : ''
      },
      mask : {
        value:true
      },
      maskShared:{
        value:false
      },
      headerContent:{
        value:'<div class="' + CLS_TITLE + '">标题</div>'
      },
      footerContent:{

      },
      closable:{
        value : true
      },
      xview:{
        value:dialogView
      }
    }
  },{
    xclass : 'dialog'
  });
  
  dialog.View = dialogView;
  return dialog;
  
});/**
 * @fileOverview 消息框，警告、确认
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/overlay/message',function (require) {
  var Dialog = require('bui/overlay/dialog'),
	  PREFIX = BUI.prefix,
    iconText ={
        info : 'i',
        error : '×',
        success : '<i class="icon-ok icon-white"></i>',
        question : '?',
        warning: '!'
    };

  /**
   * 消息框类，一般不直接创建对象，而是调用其Alert和Confirm方法
   * @class BUI.Overlay.Message
   * @private
   * @extends BUI.Overlay.Dialog
   */
  var message = Dialog.extend({

    /**
     * @protected
     * @ignore
     */
    renderUI : function(){
      this._setContent();
    },
    bindUI : function(){
      var _self = this,
        body = _self.get('body');
      _self.on('afterVisibleChange',function(ev){
        if(ev.newVal){
          if(BUI.UA.ie < 8){
           /**
           * fix ie6,7 bug
           * @ignore
           */
            _self.get('header').width(body.outerWidth() - 20);
            _self.get('footer').width(body.outerWidth());
          }
        }
      });
    },
    //根据模版设置内容
    _setContent : function(){
      var _self = this,
        body = _self.get('body'),
        contentTpl = BUI.substitute(_self.get('contentTpl'),{
          msg : _self.get('msg'),
          iconTpl : _self.get('iconTpl')
        });
      body.empty();

      $(contentTpl).appendTo(body);
    },
    //设置类型
    _uiSetIcon : function(v){
       if (!this.get('rendered')) {
            return;
        }
        this._setContent();
    },
    //设置文本
    _uiSetMsg : function(v){
       if (!this.get('rendered')) {
            return;
        }
        this._setContent();
    }

  },{
    ATTRS : 
    {
      /**
       * 图标类型
       * <ol>
       * <li>提示信息，类型参数<code>info</code></li>
       * <li>成功信息，类型参数<code>success</code></li>
       * <li>警告信息，类型参数<code>warning</code></li>
       * <li>错误信息，类型参数<code>error</code></li>
       * <li>确认信息，类型参数<code>question</code></li>
       * </ol>
       * @type {String}
       */
      icon : {

      },
      /**
       * 提示消息，可以是文本或者html
       * @cfg {String} msg
       */
      /**
       * 提示消息，可以是文本或者html
       * @type {String}
       */
      msg : {

      },
      /**
       * @private
       */
      iconTpl : {
        /**
         * @private
         */
        getter:function(){
          var _self = this,
            type = _self.get('icon');
          return '<div class="x-icon x-icon-' + type + '">' + iconText[type] + '</div>';
        }
      },
      /**
       * 内容的模版
       * @type {String}
       * @protected
       */
      contentTpl : {
        value : '{iconTpl}<div class="' + PREFIX + 'message-content">{msg}</div>'
      }
    }
  },{
    xclass : 'message',
    priority : 0
  });
  
  var singlelon = new message({
      icon:'info',
      title:''
  });
      
  function messageFun(buttons,defaultIcon){
   
    return function (msg,callback,icon){

      if(BUI.isString(callback)){
        icon = callback;
        callback = null;
      }
      icon = icon || defaultIcon;
      callback = callback || hide;
      showMessage({
        'buttons': buttons,
        'icon':icon,
        'msg':msg,
        'success' : callback
      });
    };
  }

  function showMessage(config){
    singlelon.set(config);
      
    singlelon.show();
  }

  function success(){
   var _self = this,
      success = _self.get('success');
    if(success){
      success.call(_self);
      _self.hide();
    }
  }

  function hide(){
     this.hide();
  }

  
  var Alert = messageFun([{
          text:'确定',
          elCls : 'button button-primary',
          handler : success
        }
      ],'info'),
    Confirm = messageFun([{
          text:'确定',
          elCls : 'button button-primary',
          handler : success
        },{
            text:'取消',
            elCls : 'button button-primary',
            handler : hide
          }
      ],'question');

  /**
   * 提示框静态类
   * @class BUI.Message
   */

  /**
   * 显示提示信息框
   * @static
   * @method
   * @member BUI.Message
   * @param  {String}   msg      提示信息
   * @param  {Function} callback 确定的回调函数
   * @param  {String}   icon     图标，提供以下几种图标：info,error,success,question,warning
   */
  message.Alert = Alert;

  /**
   * 显示确认框
   * @static
   * @method
   * @member BUI.Message
   * @param  {String}   msg      提示信息
   * @param  {Function} callback 确定的回调函数
   * @param  {String}   icon     图标，提供以下几种图标：info,error,success,question,warning
   */
  message.Confirm = Confirm;

  /**
   * 自定义消息框，传入配置信息 {@link BUI.Overlay.Dialog} 和 {@link BUI.Overlay.Message}
   * @static
   * @method
   * @member BUI.Message
   * @param  {Object}   config  配置信息
   */
  message.Show = showMessage;

  return message;
});