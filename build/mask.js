/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/mask',['bui/common','bui/mask/mask','bui/mask/loadmask'],function (require) {
  var BUI = require('bui/common'),
    Mask = require('bui/mask/mask');
  Mask.LoadMask = require('bui/mask/loadmask');
  return Mask;
});
define('bui/mask/mask',['bui/common'],function (require) {

    var BUI = require('bui/common'),
      Mask = BUI.namespace('Mask'),
      UA = BUI.UA,
      CLS_MASK = BUI.prefix + 'ext-mask',
      CLS_MASK_MSG = CLS_MASK + '-msg';

    BUI.mix(Mask,
    /**
    * \u5c4f\u853d\u5c42
    * <pre><code>
    * BUI.use('bui/mask',function(Mask){
    *   Mask.maskElement('#domId'); //\u5c4f\u853ddom
    *   Mask.unmaskElement('#domId'); //\u89e3\u9664DOM\u5c4f\u853d
    * });
    * </code></pre>
    * @class BUI.Mask
    * @singleton
    */
    {
        /**
         * @description \u5c4f\u853d\u6307\u5b9a\u5143\u7d20
         * @param {String|HTMLElement} element \u88ab\u5c4f\u853d\u7684\u5143\u7d20
         * @param {String} [msg] \u5c4f\u853d\u5143\u7d20\u65f6\u663e\u793a\u7684\u6587\u672c
         * @param {String} [msgCls] \u663e\u793a\u6587\u672c\u5e94\u7528\u7684\u6837\u5f0f
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
         * @description \u89e3\u9664\u5143\u7d20\u7684\u5c4f\u853d
         * @param {String|HTMLElement} \u5c4f\u853d\u7684\u5143\u7d20
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
define('bui/mask/loadmask',['bui/mask/mask'],function (require) {
  
  var Mask = require('bui/mask/mask');

   /**
     * \u5c4f\u853d\u6307\u5b9a\u5143\u7d20\uff0c\u5e76\u663e\u793a\u52a0\u8f7d\u4fe1\u606f
     * <pre></code>
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
         * \u5c4f\u853d\u7684\u5143\u7d20
         * <pre></code>
         *    var loadMask = new Mask.LoadMask({
         *        el : '#domId'
         *    });
         * </code></pre>
         * @cfg {jQuery} el
         */
        el : {

        },
        /**
         * \u52a0\u8f7d\u65f6\u663e\u793a\u7684\u52a0\u8f7d\u4fe1\u606f
         * <pre></code>
         *    var loadMask = new Mask.LoadMask({
         *        el : '#domId',
         *        msg : '\u6b63\u5728\u52a0\u8f7d\uff0c\u8bf7\u7a0d\u540e\u3002\u3002\u3002'
         *    });
         * </code></pre>
         * @cfg {String} msg [msg = 'Loading...']
         */
        msg:{
            value : 'Loading...'
        },
        /**
         * \u52a0\u8f7d\u65f6\u663e\u793a\u7684\u52a0\u8f7d\u4fe1\u606f\u7684\u6837\u5f0f
         * <pre></code>
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
         * \u52a0\u8f7d\u63a7\u4ef6\u662f\u5426\u7981\u7528
         * @type {Boolean}
         * @field
         * @default false
         * @ignore
         */
        disabled:{
           value : false
        }
    };

    //\u5bf9\u8c61\u539f\u578b
    BUI.augment(LoadMask,
    /** 
    * @lends BUI.Mask.LoadMask.prototype 
    * @ignore
    */
    {
        
        /**
         * \u8bbe\u7f6e\u63a7\u4ef6\u4e0d\u53ef\u7528
         */
        disable:function () {
            this.set('disabled',true);
        },
        /**
         * @private \u52a0\u8f7d\u5df2\u7ecf\u5b8c\u6bd5\uff0c\u89e3\u9664\u5c4f\u853d
         */
        onLoad:function () {
            Mask.unmaskElement(this.get('el'));
        },
        /**
         * @private \u5f00\u59cb\u52a0\u8f7d\uff0c\u5c4f\u853d\u5f53\u524d\u5143\u7d20
         */
        onBeforeLoad:function () {
            var _self = this;
            if (!_self.get('disabled')) {
                Mask.maskElement(_self.get('el'), _self.get('msg'), this.get('msgCls'));
            }
        },
        /**
         * \u663e\u793a\u52a0\u8f7d\u6761\uff0c\u5e76\u906e\u76d6\u5143\u7d20
         */
        show:function () {
            this.onBeforeLoad();
        },

        /**
         * \u9690\u85cf\u52a0\u8f7d\u6761\uff0c\u5e76\u89e3\u9664\u906e\u76d6\u5143\u7d20
         */
        hide:function () {
            this.onLoad();
        },

        /*
         * \u6e05\u7406\u8d44\u6e90
         */
        destroy:function () {
            this.hide();
            this.clearAttrVals();
            this.off();
        }
    });

    return LoadMask;
});