/**
 * @fileOverview Mask的入口文件
 * @ignore
 */

define('bui/mask',['bui/common','bui/mask/mask','bui/mask/loadmask'],function (require) {
  var BUI = require('bui/common'),
    Mask = require('bui/mask/mask');
  Mask.LoadMask = require('bui/mask/loadmask');
  return Mask;
});/**
 * @fileOverview Mask屏蔽层
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/mask/mask',['bui/common'],function (require) {

    var BUI = require('bui/common'),
      Mask = BUI.namespace('Mask'),
      UA = BUI.UA,
      CLS_MASK = BUI.prefix + 'ext-mask',
      CLS_MASK_MSG = CLS_MASK + '-msg';

    BUI.mix(Mask,
    /**
    * 屏蔽层
    * <pre><code>
    * BUI.use('bui/mask',function(Mask){
    *   Mask.maskElement('#domId'); //屏蔽dom
    *   Mask.unmaskElement('#domId'); //解除DOM屏蔽
    * });
    * </code></pre>
    * @class BUI.Mask
    * @singleton
    */
    {
        /**
         * @description 屏蔽指定元素
         * @param {String|HTMLElement} element 被屏蔽的元素
         * @param {String} [msg] 屏蔽元素时显示的文本
         * @param {String} [msgCls] 显示文本应用的样式
         * <pre><code>
         *   BUI.Mask.maskElement('#domId');
         *   BUI.Mask.maskElement('body'); //屏蔽整个窗口
         * </code></pre>
         */
        maskElement:function (element, msg, msgCls) {
            var maskedEl = $(element),
                maskDiv = maskedEl.children('.' + CLS_MASK),
                tpl = null,
                msgDiv = null,
                top = null,
                left = null;
            if (!maskDiv.length) {
                maskDiv = $('<div class="' + CLS_MASK + '"></div>').appendTo(maskedEl);
                maskedEl.addClass('x-masked-relative x-masked');
                //屏蔽整个窗口
                if(element == 'body'){
                  if(UA.ie == 6){
                    maskDiv.height(BUI.docHeight());
                  }else{
                    maskDiv.css('position','fixed');
                  }
                }else{
                  if (UA.ie === 6) {
                      maskDiv.height(maskedEl.height());
                  }
                }
               
                if (msg) {
                    tpl = ['<div class="' + CLS_MASK_MSG + '"><div>', msg, '</div></div>'].join('');
                    msgDiv = $(tpl).appendTo(maskedEl);
                    if (msgCls) {
                        msgDiv.addClass(msgCls);
                    }

                  try {
                    //屏蔽整个窗口
                    if(element == 'body' && UA.ie != 6){
                      top = '50%',
                      left = '50%';
                      msgDiv.css('position','fixed');
                    }else{
                      top = (maskDiv.height() - msgDiv.height()) / 2;
                      left = (maskDiv.width() - msgDiv.width()) / 2;                      
                    }
                    msgDiv.css({ left:left, top:top });

                  } catch (ex) {
                    BUI.log('mask error occurred');
                  }
                    
                }
            }
            return maskDiv;
        },
        /**
         * @description 解除元素的屏蔽
         * @param {String|HTMLElement} element 屏蔽的元素
         * <pre><code>
         * BUI.Mask.unmaskElement('#domId');
         * </code></pre>
         */
        unmaskElement:function (element) {
            var maskedEl = $(element),
                msgEl = maskedEl.children('.' + CLS_MASK_MSG),
                maskDiv = maskedEl.children('.' + CLS_MASK);
            if (msgEl) {
                msgEl.remove();
            }
            if (maskDiv) {
                maskDiv.remove();
            }
            maskedEl.removeClass('x-masked-relative x-masked');

        }
    });
    
    return Mask;
});
/**
 * @fileOverview 加载数据时屏蔽层
 * @ignore
 */

define('bui/mask/loadmask',['bui/mask/mask'],function (require) {
  
  var Mask = require('bui/mask/mask');

   /**
     * 屏蔽指定元素，并显示加载信息
     * <pre><code>
     * BUI.use('bui/mask',function(Mask){
     *    var loadMask = new Mask.LoadMask({
     *        el : '#domId',
     *        msg : 'loading ....'
     *    });
     *
     *    $('#btn').on('click',function(){
     *        loadMask.show();
     *    });
     *
     *    $('#btn1').on('click',function(){
     *        loadMask.hide();
     *    });
     * });
     * </code></pre>
     * @class BUI.Mask.LoadMask
     * @extends BUI.Base
     */
    function LoadMask(config) {
        var _self = this;
        LoadMask.superclass.constructor.call(_self, config);
    }

    BUI.extend(LoadMask, BUI.Base);

    LoadMask.ATTRS = {
        /**
         * 屏蔽的元素
         * <pre><code>
         *    var loadMask = new Mask.LoadMask({
         *        el : '#domId'
         *    });
         * </code></pre>
         * @cfg {jQuery} el
         */
        el : {

        },
        /**
         * 加载时显示的加载信息
         * <pre><code>
         *    var loadMask = new Mask.LoadMask({
         *        el : '#domId',
         *        msg : '正在加载，请稍后。。。'
         *    });
         * </code></pre>
         * @cfg {String} msg [msg = 'Loading...']
         */
        msg:{
            value : 'Loading...'
        },
        /**
         * 加载时显示的加载信息的样式
         * <pre><code>
         *    var loadMask = new Mask.LoadMask({
         *        el : '#domId',
         *        msgCls : 'custom-cls'
         *    });
         * </code></pre>
         * @cfg {String} [msgCls = 'x-mask-loading']
         */
        msgCls:{
            value : 'x-mask-loading'
        },
        /**
         * 加载控件是否禁用
         * @type {Boolean}
         * @field
         * @default false
         * @ignore
         */
        disabled:{
           value : false
        }
    };

    //对象原型
    BUI.augment(LoadMask,
    {
        
        /**
         * 设置控件不可用
         */
        disable:function () {
            this.set('disabled',true);
        },
        /**
         * @private 加载已经完毕，解除屏蔽
         */
        onLoad:function () {
            Mask.unmaskElement(this.get('el'));
        },
        /**
         * @private 开始加载，屏蔽当前元素
         */
        onBeforeLoad:function () {
            var _self = this;
            if (!_self.get('disabled')) {
                Mask.maskElement(_self.get('el'), _self.get('msg'), this.get('msgCls'));
            }
        },
        /**
         * 显示加载条，并遮盖元素
         */
        show:function () {
            this.onBeforeLoad();
        },

        /**
         * 隐藏加载条，并解除遮盖元素
         */
        hide:function () {
            this.onLoad();
        },

        /*
         * 清理资源
         */
        destroy:function () {
            this.hide();
            this.clearAttrVals();
            this.off();
        }
    });

    return LoadMask;
});