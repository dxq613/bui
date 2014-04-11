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

      dialog.superclass.show.call(this);
      _self.center();
    },
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
  
});