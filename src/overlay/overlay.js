/**
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

});