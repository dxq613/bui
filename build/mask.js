/**
 * @fileOverview Mask的入口文件
 * @ignore
 */

define('bui/mask',function (require) {
  var BUI = require('bui/common'),
    Mask = require('bui/mask/mask');
  Mask.LoadMask = require('bui/mask/loadmask');
  return Mask;
});/**
 * @fileOverview Mask屏蔽层
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/mask/mask',function (require) {

    var BUI = require('bui/common'),
      Mask = BUI.namespace('Mask'),
      UA = BUI.UA,
      CLS_MASK = BUI.prefix + 'ext-mask',
      CLS_MASK_MSG = CLS_MASK + '-msg';
    BUI.mix(Mask,
    /**
    * 屏蔽层
    * @class BUI.Mask
    * @singleton
    */
    {
        /**
         * @description 屏蔽指定元素
         * @param {String|HTMLElement} element 被屏蔽的元素
         * @param {String} [msg] 屏蔽元素时显示的文本
         * @param {String} [msgCls] 显示文本应用的样式
         *    BUI.Mask.maskElement('#domId');
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
         * @param {String|HTMLElement} 屏蔽的元素
         *    BUI.Mask.unmaskElement('#domId');
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
});/**
 * @fileOverview 加载数据时屏蔽层
 * @ignore
 */

define('bui/mask/loadmask',function (require) {
  
  var Mask = require('bui/mask/mask');

   /**
     * 屏蔽指定元素，并显示加载信息
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
         * @type {jQuery}
         */
        el : {

        },
        /**
         * 加载时显示的加载信息
         * @field
         * @default Loading...
         */
        msg:{
            value : 'Loading...'
        },
        /**
         * 加载时显示的加载信息的样式
         * @field
         * @default x-mask-loading
         */
        msgCls:{
            value : 'x-mask-loading'
        },
        /**
         * 加载控件是否禁用
         * @type {Boolean}
         * @field
         * @default false
         */
        disabled:{
           value : false
        }
    };

    //对象原型
    BUI.augment(LoadMask,
    /** 
    * @lends BUI.Mask.LoadMask.prototype 
    * @ignore
    */
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