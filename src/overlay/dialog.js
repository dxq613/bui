/**
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
  
});