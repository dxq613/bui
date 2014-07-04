/**
 * @fileOverview Overlay 模块的入口
 * @ignore
 */

define('bui/overlay',['bui/common','bui/overlay/overlay','bui/overlay/dialog','bui/overlay/message'],function (require) {
  var BUI = require('bui/common'),
    Overlay = BUI.namespace('Overlay');

  BUI.mix(Overlay,{
    Overlay : require('bui/overlay/overlay'),
    Dialog : require('bui/overlay/dialog'),
    Message : require('bui/overlay/message')
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

define('bui/overlay/overlay',['bui/common'],function (require) {
  var BUI = require('bui/common'),
    Component =  BUI.Component,
    CLS_ARROW = 'x-align-arrow',
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
   * ** 一般来说，overlay的子类，Dialog 、Message、ToolTip已经能够满足日常应用，但是使用overay更适合一些更加灵活的地方 **
   * ## 简单overlay
   * <pre><code>
   *   BUI.use('bui/overlay',function(Overlay){
   *     //点击#btn，显示overlay
   *     var overlay = new Overlay.Overlay({
   *       trigger : '#btn',
   *       content : '这是内容',
   *       align : {
   *         points : ['bl','tl']
   *       }, //对齐方式
   *       elCls : 'custom-cls', //自定义样式
   *       autoHide : true //点击overlay外面，overlay 会自动隐藏
   *     });
   *
   *     overlay.render();
   *   });
   * </code></pre>
   *
   * 
   * @class BUI.Overlay.Overlay
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.Position
   * @mixins BUI.Component.UIBase.Align
   * @mixins BUI.Component.UIBase.Close
   * @mixins BUI.Component.UIBase.AutoShow
   * @mixins BUI.Component.UIBase.AutoHide
   */
  var overlay = Component.Controller.extend([UIBase.Position,UIBase.Align,UIBase.Close,UIBase.AutoShow,UIBase.AutoHide],{
    renderUI : function(){
      var _self = this,
        el = _self.get('el'),
        arrowContainer = _self.get('arrowContainer'),
        container = arrowContainer ? el.one(arrowContainer) : el;
      if(_self.get('showArrow')){
        $(_self.get('arrowTpl')).appendTo(container);
      }
    },
    show : function(){
      var _self = this,
        effectCfg = _self.get('effect'),
        el = _self.get('el'),
		    visibleMode = _self.get('visibleMode'),
        effect = effectCfg.effect,
        duration = effectCfg.duration;

  	  
      //如果还未渲染，则先渲染控件
      if(!_self.get('rendered')){
        _self.set('visible',true);
        _self.render();
        _self.set('visible',false);
        el = _self.get('el');
      }

      if(visibleMode === 'visibility'){
        _self.set('visible',true);
        el.css({display : 'none'});
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
        if(visibleMode === 'visibility'){
          el.css({display : 'block'});
        }else{
          _self.set('visible',true);
        }
        if(effectCfg.callback){
          effectCfg.callback.call(_self);
        }
        //自动隐藏
        var delay = _self.get('autoHideDelay'),
          delayHandler = _self.get('delayHandler');
        if(delay){
          delayHandler && clearTimeout(delayHandler);
          delayHandler = setTimeout(function(){
            _self.hide();
            _self.set('delayHandler',null);
          },delay);
          _self.set('delayHandler',delayHandler);
        }
      }

    },
    hide : function(){
      var _self = this,
        effectCfg = _self.get('effect'),
        el = _self.get('el'),
        effect = effectCfg.effect,
        duration = effectCfg.duration;
  	  
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
        if(_self.get('visibleMode') === 'visibility'){
          el.css({display : 'block'});
        }
        _self.set('visible',false);
        if(effectCfg.callback){
          effectCfg.callback.call(_self);
        }
      }

    }
  },{
    ATTRS : 
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
       * 显示后间隔多少秒自动隐藏
       * @type {Number}
       */
      autoHideDelay : {

      },
      /**
       * whether this component can be closed.
       * @default false
       * @type {Boolean}
       * @protected
       */
      closeable:{
          value:false
      },
      /**
       * 是否显示指向箭头，跟align属性的points相关
       * @cfg {Boolean} [showArrow = false]
       */
      showArrow : {
        value : false
      },
      /**
       * 箭头放置在的位置，是一个选择器，例如 .arrow-wraper
       *     new Tip({ //可以设置整个控件的模板
       *       arrowContainer : '.arrow-wraper',
       *       tpl : '<div class="arrow-wraper"></div>'
       *     });
       *     
       * @cfg {String} arrowContainer
       */
      arrowContainer : {
        view : true
      },
      /**
       * 指向箭头的模板
       * @cfg {Object} arrowTpl
       */
      arrowTpl : {
        value : '<s class="' + CLS_ARROW + '"><s class="' + CLS_ARROW + '-inner"></s></s>'
      },
      visibleMode : {
        value : 'visibility'
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
 * @fileOverview 弹出框
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/overlay/dialog',['bui/overlay/overlay'],function (require) {
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

    /**
     * 子组件将要渲染到的节点，在 render 类上覆盖对应方法
     * @protected
     * @ignore
     */
    getContentElement: function () {
      return this.get('body');
    },

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
   * ** 普通弹出框 **
   * <pre><code>
   *  BUI.use('bui/overlay',function(Overlay){
   *      var dialog = new Overlay.Dialog({
   *        title:'非模态窗口',
   *        width:500,
   *        height:300,
   *        mask:false,  //设置是否模态
   *        buttons:[],
   *        bodyContent:'<p>这是一个非模态窗口,并且不带按钮</p>'
   *      });
   *    dialog.show();
   *    $('#btnShow').on('click',function () {
   *      dialog.show();
   *    });
   *  });
   * </code></pre>
   *
   * ** 使用现有的html结构 **
   * <pre><code>
   *  BUI.use('bui/overlay',function(Overlay){
   *      var dialog = new Overlay.Dialog({
   *        title:'配置DOM',
   *        width:500,
   *        height:250,
   *        contentId:'content',//配置DOM容器的编号
   *        success:function () {
   *          alert('确认');
   *          this.hide();
   *        }
   *      });
   *    dialog.show();
   *    $('#btnShow').on('click',function () {
   *      dialog.show();
   *    });
   *  });
   * </code></pre>
   * @class BUI.Overlay.Dialog
   * @extends BUI.Overlay.Overlay
   * @mixins BUI.Component.UIBase.StdMod
   * @mixins BUI.Component.UIBase.Mask
   * @mixins BUI.Component.UIBase.Drag
   */
  var dialog = Overlay.extend([UIBase.StdMod,UIBase.Mask,UIBase.Drag],{
    
    show:function(){
      var _self = this;
      align = _self.get('align');
      
      dialog.superclass.show.call(this);
      _self.set('align',align);
      
      
    },/**/
    //绑定事件
    bindUI : function(){
      var _self = this;
      _self.on('closeclick',function(){
        return _self.onCancel();
      });
    },
    /**
     * @protected
     * 取消
     */
    onCancel : function(){
      var _self = this,
        cancel = _self.get('cancel');
      return cancel.call(this);
    },
    //设置按钮
    _uiSetButtons:function(buttons){
      var _self = this,
        footer = _self.get('footer');

      footer.children().remove();
      BUI.each(buttons,function(conf){
        _self._createButton(conf,footer);
      });

    },
    //创建按钮
    _createButton : function(conf,parent){
      var _self = this,
        temp = '<button class="'+conf.elCls+'">'+conf.text+'</button>',
        btn = $(temp).appendTo(parent);
      btn.on('click',function(){
        conf.handler.call(_self,_self,this);
      });
    },
    destructor : function(){
      var _self = this,
        contentId = _self.get('contentId'),
        body = _self.get('body'),
        closeAction = _self.get('closeAction');
      if(closeAction == 'destroy'){
        _self.hide();
        if(contentId){
          body.children().appendTo('#'+contentId);
        }
      }
    }
  },{

    ATTRS : 
    {
      closeTpl:{
        view:true,
        value : '<a tabindex="0" href=javascript:void("关闭") role="button" class="' + PREFIX + 'ext-close" style=""><span class="' + PREFIX + 'ext-close-x x-icon x-icon-normal">×</span></a>'
      },
     /**
       * 弹出库的按钮，可以有多个,有3个参数
       * var dialog = new Overlay.Dialog({
       *     title:'自定义按钮',
       *     width:500,
       *     height:300,
       *     mask:false,
       *     buttons:[
       *       {
       *         text:'自定义',
       *         elCls : 'button button-primary',
       *         handler : function(){
       *           //do some thing
       *           this.hide();
       *         }
       *       },{
       *         text:'关闭',
       *         elCls : 'button',
       *         handler : function(){
       *           this.hide();
       *         }
       *       }
       *     ],
       *     
       *     bodyContent:'<p>这是一个自定义按钮窗口,可以配置事件和文本样式</p>'
       *   });
       *  dialog.show();
       * <ol>
       *   <li>text:按钮文本</li>
       *   <li>elCls:按钮样式</li>
       *   <li>handler:点击按钮的回调事件</li>
       * </ol>
       * @cfg {Array} buttons
       * @default '确定'、'取消'2个按钮
       * 
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
            handler : function(dialog,btn){
              if(this.onCancel() !== false){
                this.close();
              }
            }
          }
        ]
      },
      /**
       * 弹出框显示内容的DOM容器ID
       * @cfg {Object} contentId
       */
      contentId:{
        view:true
      },
  	  /**
      * 点击成功时的回调函数
      * @cfg {Function} success
      */
      success : {
        value : function(){
          this.close();
        }
      },
      /**
       * 用户取消时调用，如果return false则阻止窗口关闭
       * @cfg {Function} cancel
       */
      cancel : {
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
       * 默认的加载控件内容的配置,默认值：
       * <pre>
       *  {
       *    property : 'bodyContent',
       *    autoLoad : false,
       *    lazyLoad : {
       *      event : 'show'
       *    },
       *    loadMask : {
       *      el : _self.get('body')
       *    }
       *  }
       * </pre>
       * @type {Object}
       */
      defaultLoaderCfg  : {
        valueFn :function(){
          var _self = this;
          return {
            property : 'bodyContent',
            autoLoad : false,
            lazyLoad : {
              event : 'show'
            },
            loadMask : {
              el : _self.get('body')
            }
          }
        } 
      },
      /**
       * 弹出框标题
       * @cfg {String} title
       */
      /**
       * 弹出框标题
       * <pre><code>
       *  dialog.set('title','new title');
       * </code></pre>
       * @type {String}
       */
      title : {
        view:true,
        value : ''
      },
      align : {
        value : {
          node : window,
          points : ['cc','cc']
        }
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
      closeable:{
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

define('bui/overlay/message',['bui/overlay/dialog'],function (require) {
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
   * <pre><code>
   ** BUI.use('bui/overlay',function(overlay){
   * 
   *    BUI.Message.Alert('这只是简单的提示信息','info');
   *    BUI.Message.Alert('这只是简单的成功信息','success');
   *    BUI.Message.Alert('这只是简单的警告信息','warning');
   *    BUI.Message.Alert('这只是简单的错误信息','error');
   *    BUI.Message.Alert('这只是简单的询问信息','question');
   *
   *    //回调函数
   *    BUI.Message.Alert('点击触发回调函数',function() {
   *         alert('执行回调');
   *       },'error');
   *       
   *    //复杂的提示信息
   *    var msg = '&lt;h2&gt;上传失败，请上传10M以内的文件&lt;/h2&gt;'+
   *       '&lt;p class="auxiliary-text"&gt;如连续上传失败，请及时联系客服热线：0511-23883767834&lt;/p&gt;'+
   *       '&lt;p&gt;&lt;a href="#"&gt;返回list页面&lt;/a&gt; &lt;a href="#"&gt;查看详情&lt;/a&gt;&lt;/p&gt;';
   *     BUI.Message.Alert(msg,'error');
   *    //确认信息
   *    BUI.Message.Confirm('确认要更改么？',function(){
   *       alert('确认');
   *     },'question');
   * });
   * </code></pre>
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
            var outerWidth = body.outerWidth();
            if(BUI.UA.ie == 6){
              outerWidth = outerWidth > 350 ? 350 : outerWidth;
            }
            _self.get('header').width(outerWidth - 20);
            _self.get('footer').width(outerWidth);
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
  
  var singlelon;
      
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
      return singlelon;
    };
  }

  function showMessage(config){
    if(!singlelon){
      singlelon = new message({
          icon:'info',
          title:''
      });
    }
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
   * <pre><code>
   * BUI.Message.Confirm('确认要更改么？',function(){
   *       alert('确认');
   * },'question');
   * </code></pre>
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