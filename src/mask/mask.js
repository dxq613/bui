/**
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
         *   
         * </code></pre>
         */
        maskElement:function (element, msg, msgCls) {
            var maskedEl = $(element),
                maskDiv = $('.' + CLS_MASK, maskedEl),
                tpl = null,
                msgDiv = null,
                top = null,
                left = null;
            if (!maskDiv.length) {
                maskDiv = $('<div class="' + CLS_MASK + '"></div>').appendTo(maskedEl);
                maskedEl.addClass('x-masked-relative x-masked');
                if (UA.ie === 6) {
                    maskDiv.height(maskedEl.height());
                }
                if (msg) {
                    tpl = ['<div class="' + CLS_MASK_MSG + '"><div>', msg, '</div></div>'].join('');
                    msgDiv = $(tpl).appendTo(maskedEl);
                    if (msgCls) {
                        msgDiv.addClass(msgCls);
                    }
                    try {
                        top = (maskedEl.height() - msgDiv.height()) / 2;
                        left = (maskedEl.width() - msgDiv.width()) / 2;

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