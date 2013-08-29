/**
 * @fileOverview  Base UI控件的管理类
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */



//控件类的管理器
define('bui/component/manage',function(require){

    var uis = {
        // 不带前缀 prefixCls
        /*
         "menu" :{
         priority:0,
         constructor:Menu
         }
         */
    };

    function getConstructorByXClass(cls) {
        var cs = cls.split(/\s+/), 
            p = -1, 
            t, 
            ui = null;
        for (var i = 0; i < cs.length; i++) {
            var uic = uis[cs[i]];
            if (uic && (t = uic.priority) > p) {
                p = t;
                ui = uic.constructor;
            }
        }
        return ui;
    }

    function getXClassByConstructor(constructor) {
        for (var u in uis) {
            var ui = uis[u];
            if (ui.constructor == constructor) {
                return u;
            }
        }
        return 0;
    }

    function setConstructorByXClass(cls, uic) {
        if (BUI.isFunction(uic)) {
            uis[cls] = {
                constructor:uic,
                priority:0
            };
        } else {
            uic.priority = uic.priority || 0;
            uis[cls] = uic;
        }
    }


    function getCssClassWithPrefix(cls) {
        var cs = $.trim(cls).split(/\s+/);
        for (var i = 0; i < cs.length; i++) {
            if (cs[i]) {
                cs[i] = this.get('prefixCls') + cs[i];
            }
        }
        return cs.join(' ');
    }



    var componentInstances = {};

    /**
     * Manage component metadata.
     * @class BUI.Component.Manager
     * @singleton
     */
    var Manager ={

        __instances:componentInstances,
        /**
         * 每实例化一个控件，就注册到管理器上
         * @param {String} id  控件 id
         * @param {BUI.Component.Controller} component 控件对象
         */
        addComponent:function (id, component) {
            componentInstances[id] = component;
        },
        /**
         * 移除注册的控件
         * @param  {String} id 控件 id
         */
        removeComponent:function (id) {
            delete componentInstances[id];
        },
        /**
         * 遍历所有的控件
         * @param  {Function} fn 遍历函数
         */
        eachComponent : function(fn){
            BUI.each(componentInstances,fn);
        },
        /**
         * 根据Id获取控件
         * @param  {String} id 编号
         * @return {BUI.Component.UIBase}   继承 UIBase的类对象
         */
        getComponent:function (id) {
            return componentInstances[id];
        },

        getCssClassWithPrefix:getCssClassWithPrefix,
        /**
         * 通过构造函数获取xclass.
         * @param {Function} constructor 控件的构造函数.
         * @type {Function}
         * @return {String}
         * @method
         */
        getXClassByConstructor:getXClassByConstructor,
        /**
         * 通过xclass获取控件的构造函数
         * @param {String} classNames Class names separated by space.
         * @type {Function}
         * @return {Function}
         * @method
         */
        getConstructorByXClass:getConstructorByXClass,
        /**
         * 将 xclass 同构造函数相关联.
         * @type {Function}
         * @param {String} className 控件的xclass名称.
         * @param {Function} componentConstructor 构造函数
         * @method
         */
        setConstructorByXClass:setConstructorByXClass
    };

    return Manager;
});