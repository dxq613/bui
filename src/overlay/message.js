/**
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