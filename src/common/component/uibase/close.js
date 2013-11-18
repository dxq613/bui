/**
 * @fileOverview close 关闭或隐藏控件
 * @author yiminghe@gmail.com
 * copied and modified by dxq613@gmail.com
 * @ignore
 */

define('bui/component/uibase/close',function () {
  
  var CLS_PREFIX = BUI.prefix + 'ext-';

  function getCloseRenderBtn(self) {
      return $(self.get('closeTpl'));
  }

  /**
  * 关闭按钮的视图类
  * @class BUI.Component.UIBase.CloseView
  * @private
  */
  function CloseView() {
  }

  CloseView.ATTRS = {
    closeTpl : {
      value : '<a ' +
            'tabindex="0" ' +
            "href='javascript:void(\"关闭\")' " +
            'role="button" ' +
            'class="' + CLS_PREFIX + 'close' + '">' +
            '<span class="' +
            CLS_PREFIX + 'close-x' +
            '">关闭<' + '/span>' +
            '<' + '/a>'
    },
    closeable:{
        value:true
    },
    closeBtn:{
    }
  };

  CloseView.prototype = {
      _uiSetCloseable:function (v) {
          var self = this,
              btn = self.get('closeBtn');
          if (v) {
              if (!btn) {
                  self.setInternal('closeBtn', btn = getCloseRenderBtn(self));
              }
              btn.appendTo(self.get('el'), undefined);
          } else {
              if (btn) {
                  btn.remove();
              }
          }
      }
  };

   /**
   * @class BUI.Component.UIBase.Close
   * Close extension class.
   * Represent a close button.
   */
  function Close() {
  }

  var HIDE = 'hide';
  Close.ATTRS =
  {
      /**
      * 关闭按钮的默认模版
      * <pre><code>
      *   var overlay = new Overlay({
      *     closeTpl : '<a href="#" title="close">x</a>',
      *     closeable : true,
      *     trigger : '#t1'
      *   });
      *   overlay.render();
      * </code></pre>
      * @cfg {String} closeTpl
      */
      /**
      * 关闭按钮的默认模版
      * @type {String}
      * @protected
      */
      closeTpl:{
        view : true
      },
      /**
       * 是否出现关闭按钮
       * @cfg {Boolean} [closeable = false]
       */
      /**
       * 是否出现关闭按钮
       * @type {Boolean}
       */
      closeable:{
          view:1
      },

      /**
       * 关闭按钮.
       * @protected
       * @type {jQuery}
       */
      closeBtn:{
          view:1
      },
      /**
       * 关闭时隐藏还是移除DOM结构<br/>
       * 
       *  - "hide" : default 隐藏. 
       *  - "destroy"：当点击关闭按钮时移除（destroy)控件
       *  - 'remove' : 当存在父控件时使用remove，同时从父元素中删除
       * @cfg {String} [closeAction = 'hide']
       */
      /**
       * 关闭时隐藏还是移除DOM结构
       * default "hide".可以设置 "destroy" ，当点击关闭按钮时移除（destroy)控件
       * @type {String}
       * @protected
       */
      closeAction:{
        value:HIDE
      }

      /**
       * @event closing
       * 正在关闭，可以通过return false 阻止关闭事件
       * @param {Object} e 关闭事件
       * @param {String} e.action 关闭执行的行为，hide,destroy,remove
       */
      
      /**
       * @event beforeclosed
       * 关闭前，发生在closing后，closed前，用于处理关闭前的一些工作
       * @param {Object} e 关闭事件
       * @param {String} e.action 关闭执行的行为，hide,destroy,remove
       */

      /**
       * @event closed
       * 已经关闭
       * @param {Object} e 关闭事件
       * @param {String} e.action 关闭执行的行为，hide,destroy,remove
       */
      
      /**
       * @event closeclick
       * 触发点击关闭按钮的事件,return false 阻止关闭
       * @param {Object} e 关闭事件
       * @param {String} e.domTarget 点击的关闭按钮节点
       */
  };

  var actions = {
      hide:HIDE,
      destroy:'destroy',
      remove : 'remove'
  };

  Close.prototype = {
      _uiSetCloseable:function (v) {
          var self = this;
          if (v && !self.__bindCloseEvent) {
              self.__bindCloseEvent = 1;
              self.get('closeBtn').on('click', function (ev) {
                if(self.fire('closeclick',{domTarget : ev.target}) !== false){
                  self.close();
                }
                ev.preventDefault();
              });
          }
      },
      __destructor:function () {
          var btn = this.get('closeBtn');
          btn && btn.detach();
      },
      /**
       * 关闭弹出框，如果closeAction = 'hide'那么就是隐藏，如果 closeAction = 'destroy'那么就是释放,'remove'从父控件中删除，并释放
       */
      close : function(){
        var self = this,
          action = actions[self.get('closeAction') || HIDE];
        if(self.fire('closing',{action : action}) !== false){
          self.fire('beforeclosed',{action : action});
          if(action == 'remove'){ //移除时同时destroy
            self[action](true);
          }else{
            self[action]();
          }
          self.fire('closed',{action : action});
        }
      }
  };

  Close.View = CloseView;

  return Close;
});
