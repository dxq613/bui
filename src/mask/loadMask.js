/**
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