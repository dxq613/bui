
/**
 * @class BUI
 * 控件库的工具方法，这些工具方法直接绑定到BUI对象上
 * <pre><code>
 *     BUI.isString(str);
 *
 *     BUI.extend(A,B);
 *
 *     BUI.mix(A,{a:'a'});
 * </code></pre>
 * @singleton
 */
window.BUI = window.BUI || {};

if(!BUI.use && window.seajs){
    BUI.use = seajs.use;
    BUI.config = seajs.config;
}

define('bui/util',function(require){

    //兼容jquery 1.6以下
    (function($){
        if($.fn){
            $.fn.on = $.fn.on || $.fn.bind;
            $.fn.off = $.fn.off || $.fn.unbind;
        }

    })(jQuery);
    /**
     * @ignore
     * 处于效率的目的，复制属性
     */
    function mixAttrs(to,from){

        for(var c in from){
            if(from.hasOwnProperty(c)){
                to[c] = to[c] || {};
                mixAttr(to[c],from[c]);
            }
        }

    }
    //合并属性
    function mixAttr(attr,attrConfig){
        for (var p in attrConfig) {
            if(attrConfig.hasOwnProperty(p)){
                if(p == 'value'){
                    if(BUI.isObject(attrConfig[p])){
                        attr[p] = attr[p] || {};
                        BUI.mix(/*true,*/attr[p], attrConfig[p]);
                    }else if(BUI.isArray(attrConfig[p])){
                        attr[p] = attr[p] || [];
                        //BUI.mix(/*true,*/attr[p], attrConfig[p]);
                        attr[p] = attr[p].concat(attrConfig[p]);
                    }else{
                        attr[p] = attrConfig[p];
                    }
                }else{
                    attr[p] = attrConfig[p];
                }
            }
        };
    }

    var win = window,
        doc = document,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        BODY = 'body',
        DOC_ELEMENT = 'documentElement',
        SCROLL = 'scroll',
        SCROLL_WIDTH = SCROLL + 'Width',
        SCROLL_HEIGHT = SCROLL + 'Height',
        ATTRS = 'ATTRS',
        PARSER = 'PARSER',
        GUID_DEFAULT = 'guid';

    $.extend(BUI,
        {
            /**
             * 版本号
             * @memberOf BUI
             * @type {Number}
             */
            version:1.0,

            /**
             * 子版本号
             * @type {Number}
             */
            subVersion : 91,

            /**
             * 是否为函数
             * @param  {*} fn 对象
             * @return {Boolean}  是否函数
             */
            isFunction : function(fn){
                return typeof(fn) === 'function';
            },
            /**
             * 是否数组
             * @method
             * @param  {*}  obj 是否数组
             * @return {Boolean}  是否数组
             */
            isArray : ('isArray' in Array) ? Array.isArray : function(value) {
                return toString.call(value) === '[object Array]';
            },
            /**
             * 是否日期
             * @param  {*}  value 对象
             * @return {Boolean}  是否日期
             */
            isDate: function(value) {
                return toString.call(value) === '[object Date]';
            },
            /**
             * 是否是javascript对象
             * @param {Object} value The value to test
             * @return {Boolean}
             * @method
             */
            isObject: (toString.call(null) === '[object Object]') ?
                function(value) {
                    // check ownerDocument here as well to exclude DOM nodes
                    return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
                } :
                function(value) {
                    return toString.call(value) === '[object Object]';
                },
            /**
             * 是否是数字或者数字字符串
             * @param  {String}  value 数字字符串
             * @return {Boolean}  是否是数字或者数字字符串
             */
            isNumeric: function(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            },
            /**
             * 将指定的方法或属性放到构造函数的原型链上，
             * 函数支持多于2个变量，后面的变量同s1一样将其成员复制到构造函数的原型链上。
             * @param  {Function} r  构造函数
             * @param  {Object} s1 将s1 的成员复制到构造函数的原型链上
             *          @example
             *          BUI.augment(class1,{
     *              method1: function(){
     *   
     *              }
     *          });
             */
            augment : function(r,s1){
                if(!BUI.isFunction(r))
                {
                    return r;
                }
                for (var i = 1; i < arguments.length; i++) {
                    BUI.mix(r.prototype,arguments[i].prototype || arguments[i]);
                };
                return r;
            },
            /**
             * 拷贝对象
             * @param  {Object} obj 要拷贝的对象
             * @return {Object} 拷贝生成的对象
             */
            cloneObject : function(obj){
                var result = BUI.isArray(obj) ? [] : {};

                return BUI.mix(true,result,obj);
            },
            /**
             * 抛出错误
             */
            error : function(msg){
                if(BUI.debug){
                    throw msg;
                }
            },
            
            /**
             * 实现类的继承，通过父类生成子类
             * @param  {Function} subclass
             * @param  {Function} superclass 父类构造函数
             * @param  {Object} overrides  子类的属性或者方法
             * @return {Function} 返回的子类构造函数
             * 示例:
             *      @example
             *      //父类
             *      function base(){
             *  
             *      }
             *
             *      function sub(){
             * 
             *      }
             *      //子类
             *      BUI.extend(sub,base,{
             *          method : function(){
             *    
             *          }
             *      });
             *
             *      //或者
             *      var sub = BUI.extend(base,{});
             */
            extend : function(subclass,superclass,overrides, staticOverrides){
                //如果只提供父类构造函数，则自动生成子类构造函数
                if(!BUI.isFunction(superclass))
                {

                    overrides = superclass;
                    superclass = subclass;
                    subclass =  function(){};
                }

                var create = Object.create ?
                    function (proto, c) {
                        return Object.create(proto, {
                            constructor: {
                                value: c
                            }
                        });
                    } :
                    function (proto, c) {
                        function F() {
                        }

                        F.prototype = proto;

                        var o = new F();
                        o.constructor = c;
                        return o;
                    };
                var superObj = create(superclass.prototype,subclass);//new superclass(),//实例化父类作为子类的prototype
                subclass.prototype = BUI.mix(superObj,subclass.prototype);     //指定子类的prototype
                subclass.superclass = create(superclass.prototype,superclass);
                BUI.mix(superObj,overrides);
                BUI.mix(subclass,staticOverrides);
                return subclass;
            },
            /**
             * 生成唯一的Id
             * @method
             * @param {String} prefix 前缀
             * @default 'bui-guid'
             * @return {String} 唯一的编号
             */
            guid : (function(){
                var map = {};
                return function(prefix){
                    prefix = prefix || BUI.prefix + GUID_DEFAULT;
                    if(!map[prefix]){
                        map[prefix] = 1;
                    }else{
                        map[prefix] += 1;
                    }
                    return prefix + map[prefix];
                };
            })(),
            /**
             * 判断是否是字符串
             * @return {Boolean} 是否是字符串
             */
            isString : function(value){
                return typeof value === 'string';
            },
            /**
             * 判断是否数字，由于$.isNumberic方法会把 '123'认为数字
             * @return {Boolean} 是否数字
             */
            isNumber : function(value){
                return typeof value === 'number';
            },
            /**
             * 是否是布尔类型
             *
             * @param {Object} value 测试的值
             * @return {Boolean}
             */
            isBoolean: function(value) {
                return typeof value === 'boolean';
            },
            /**
             * 控制台输出日志
             * @param  {Object} obj 输出的数据
             */
            log : function(obj){
                if(BUI.debug && win.console && win.console.log){
                    win.console.log(obj);
                }
            },
            /**
             * 将多个对象的属性复制到一个新的对象
             */
            merge : function(){
                var args = $.makeArray(arguments),
                    first = args[0];
                if(BUI.isBoolean(first)){
                    args.shift();
                    args.unshift({});
                    args.unshift(first);
                }else{
                    args.unshift({});
                }

                return BUI.mix.apply(null,args);

            },
            /**
             * 封装 jQuery.extend 方法，将多个对象的属性merge到第一个对象中
             * @return {Object}
             */
            mix : function(){
                return $.extend.apply(null,arguments);
            },
            /**
             * 创造顶层的命名空间，附加到window对象上,
             * 包含namespace方法
             */
            app : function(name){
                if(!window[name]){
                    window[name] = {
                        namespace :function(nsName){
                            return BUI.namespace(nsName,window[name]);
                        }
                    };
                }
                return window[name];
            },

            mixAttrs : mixAttrs,

            mixAttr : mixAttr,

            /**
             * 将其他类作为mixin集成到指定类上面
             * @param {Function} c 构造函数
             * @param {Array} mixins 扩展类
             * @param {Array} attrs 扩展的静态属性，默认为['ATTRS']
             * @return {Function} 传入的构造函数
             */
            mixin : function(c,mixins,attrs){
                attrs = attrs || [ATTRS,PARSER];
                var extensions = mixins;
                if (extensions) {
                    c.mixins = extensions;

                    var desc = {
                        // ATTRS:
                        // HTML_PARSER:
                    }, constructors = extensions['concat'](c);

                    // [ex1,ex2]，扩展类后面的优先，ex2 定义的覆盖 ex1 定义的
                    // 主类最优先
                    BUI.each(constructors, function (ext) {
                        if (ext) {
                            // 合并 ATTRS/HTML_PARSER 到主类
                            BUI.each(attrs, function (K) {
                                if (ext[K]) {
                                    desc[K] = desc[K] || {};
                                    // 不覆盖主类上的定义，因为继承层次上扩展类比主类层次高
                                    // 但是值是对象的话会深度合并
                                    // 注意：最好值是简单对象，自定义 new 出来的对象就会有问题(用 function return 出来)!
                                    if(K == 'ATTRS'){
                                        //BUI.mix(true,desc[K], ext[K]);
                                        mixAttrs(desc[K],ext[K]);
                                    }else{
                                        BUI.mix(desc[K], ext[K]);
                                    }

                                }
                            });
                        }
                    });

                    BUI.each(desc, function (v,k) {
                        c[k] = v;
                    });

                    var prototype = {};

                    // 主类最优先
                    BUI.each(constructors, function (ext) {
                        if (ext) {
                            var proto = ext.prototype;
                            // 合并功能代码到主类，不覆盖
                            for (var p in proto) {
                                // 不覆盖主类，但是主类的父类还是覆盖吧
                                if (proto.hasOwnProperty(p)) {
                                    prototype[p] = proto[p];
                                }
                            }
                        }
                    });

                    BUI.each(prototype, function (v,k) {
                        c.prototype[k] = v;
                    });
                }
                return c;
            },
            /**
             * 生成命名空间
             * @param  {String} name 命名空间的名称
             * @param  {Object} baseNS 在已有的命名空间上创建命名空间，默认“BUI”
             * @return {Object} 返回的命名空间对象
             *      @example
             *      BUI.namespace("Grid"); // BUI.Grid
             */
            namespace : function(name,baseNS){
                baseNS = baseNS || BUI;
                if(!name){
                    return baseNS;
                }
                var list = name.split('.'),
                //firstNS = win[list[0]],
                    curNS = baseNS;

                for (var i = 0; i < list.length; i++) {
                    var nsName = list[i];
                    if(!curNS[nsName]){
                        curNS[nsName] = {};
                    }
                    curNS = curNS[nsName];
                };
                return curNS;
            },
            /**
             * BUI 控件的公用前缀
             * @type {String}
             */
            prefix : 'bui-',
            /**
             * 替换字符串中的字段.
             * @param {String} str 模版字符串
             * @param {Object} o json data
             * @param {RegExp} [regexp] 匹配字符串的正则表达式
             */
            substitute: function (str, o, regexp) {
                if (!BUI.isString(str)
                    || (!BUI.isObject(o)) && !BUI.isArray(o)) {
                    return str;
                }

                return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
                    if (match.charAt(0) === '\\') {
                        return match.slice(1);
                    }
                    return (o[name] === undefined) ? '' : o[name];
                });
            },
            /**
             * 使第一个字母变成大写
             * @param  {String} s 字符串
             * @return {String} 首字母大写后的字符串
             */
            ucfirst : function(s){
                s += '';
                return s.charAt(0).toUpperCase() + s.substring(1);
            },
            /**
             * 页面上的一点是否在用户的视图内
             * @param {Object} offset 坐标，left,top
             * @return {Boolean} 是否在视图内
             */
            isInView : function(offset){
                var left = offset.left,
                    top = offset.top,
                    viewWidth = BUI.viewportWidth(),
                    wiewHeight = BUI.viewportHeight(),
                    scrollTop = BUI.scrollTop(),
                    scrollLeft = BUI.scrollLeft();
                //判断横坐标
                if(left < scrollLeft ||left > scrollLeft + viewWidth){
                    return false;
                }
                //判断纵坐标
                if(top < scrollTop || top > scrollTop + wiewHeight){
                    return false;
                }
                return true;
            },
            /**
             * 页面上的一点纵向坐标是否在用户的视图内
             * @param {Object} top  纵坐标
             * @return {Boolean} 是否在视图内
             */
            isInVerticalView : function(top){
                var wiewHeight = BUI.viewportHeight(),
                    scrollTop = BUI.scrollTop();

                //判断纵坐标
                if(top < scrollTop || top > scrollTop + wiewHeight){
                    return false;
                }
                return true;
            },
            /**
             * 页面上的一点横向坐标是否在用户的视图内
             * @param {Object} left 横坐标
             * @return {Boolean} 是否在视图内
             */
            isInHorizontalView : function(left){
                var viewWidth = BUI.viewportWidth(),
                    scrollLeft = BUI.scrollLeft();
                //判断横坐标
                if(left < scrollLeft ||left > scrollLeft + viewWidth){
                    return false;
                }
                return true;
            },
            /**
             * 获取窗口可视范围宽度
             * @return {Number} 可视区宽度
             */
            viewportWidth : function(){
                return $(window).width();
            },
            /**
             * 获取窗口可视范围高度
             * @return {Number} 可视区高度
             */
            viewportHeight:function(){
                return $(window).height();
            },
            /**
             * 滚动到窗口的left位置
             */
            scrollLeft : function(){
                return $(window).scrollLeft();
            },
            /**
             * 滚动到横向位置
             */
            scrollTop : function(){
                return $(window).scrollTop();
            },
            /**
             * 窗口宽度
             * @return {Number} 窗口宽度
             */
            docWidth : function(){
                return Math.max(this.viewportWidth(), doc[DOC_ELEMENT][SCROLL_WIDTH], doc[BODY][SCROLL_WIDTH]);
            },
            /**
             * 窗口高度
             * @return {Number} 窗口高度
             */
            docHeight : function(){
                return Math.max(this.viewportHeight(), doc[DOC_ELEMENT][SCROLL_HEIGHT], doc[BODY][SCROLL_HEIGHT]);
            },
            /**
             * 遍历数组或者对象
             * @param {Object|Array} element/Object 数组中的元素或者对象的值
             * @param {Function} func 遍历的函数 function(elememt,index){} 或者 function(value,key){}
             */
            each : function (elements,func) {
                if(!elements){
                    return;
                }
                $.each(elements,function(k,v){
                    return func(v,k);
                });
            },
            /**
             * 封装事件，便于使用上下文this,和便于解除事件时使用
             * @protected
             * @param  {Object} self   对象
             * @param  {String} action 事件名称
             */
            wrapBehavior : function(self, action) {
                return self['__bui_wrap_' + action] = function (e) {
                    if (!self.get('disabled')) {
                        self[action](e);
                    }
                };
            },
            /**
             * 获取封装的事件
             * @protected
             * @param  {Object} self   对象
             * @param  {String} action 事件名称
             */
            getWrapBehavior : function(self, action) {
                return self['__bui_wrap_' + action];
            },
            /**
             * 获取页面上使用了此id的控件
             * @param  {String} id 控件id
             * @return {BUI.Component.Controller}    查找的控件
             */
            getControl : function(id){
                return BUI.Component.Manager.getComponent(id);
            }

        });

    /**
     * 表单帮助类，序列化、反序列化，设置值
     * @class BUI.FormHelper
     * @singleton
     */
    var formHelper = BUI.FormHelper = {
        /**
         * 将表单格式化成键值对形式
         * @param {HTMLElement} form 表单
         * @return {Object} 键值对的对象
         */
        serializeToObject:function(form){
            var array = $(form).serializeArray(),
                result = {};
            BUI.each(array,function(item){
                var name = item.name;
                if(!result[name]){ //如果是单个值，直接赋值
                    result[name] = item.value;
                }else{ //多值使用数组
                    if(!BUI.isArray(result[name])){
                        result[name] = [result[name]];
                    }
                    result[name].push(item.value);
                }
            });
            return result;
        },
        /**
         * 设置表单的值
         * @param {HTMLElement} form 表单
         * @param {Object} obj  键值对
         */
        setFields : function(form,obj){
            for(var name in obj){
                if(obj.hasOwnProperty(name)){
                    BUI.FormHelper.setField(form,name,obj[name]);
                }
            }
        },
        /**
         * 清空表单
         * @param  {HTMLElement} form 表单元素
         */
        clear : function(form){
            var elements = $.makeArray(form.elements);

            BUI.each(elements,function(element){
                if(element.type === 'checkbox' || element.type === 'radio' ){
                    $(element).attr('checked',false);
                }else{
                    $(element).val('');
                }
                $(element).change();
            });
        },
        /**
         * 设置表单字段
         * @param {HTMLElement} form 表单元素
         * @param {string} field 字段名
         * @param {string} value 字段值
         */
        setField:function(form,fieldName,value){
            var fields = form.elements[fieldName];
            if(fields && fields.type){
                formHelper._setFieldValue(fields,value);
            }else if(BUI.isArray(fields) || (fields && fields.length)){
                BUI.each(fields,function(field){
                    formHelper._setFieldValue(field,value);
                });
            }
        },
        //设置字段的值
        _setFieldValue : function(field,value){
            if(field.type === 'checkbox'){
                if(field.value == ''+ value ||(BUI.isArray(value) && BUI.Array.indexOf(field.value,value) !== -1)) {
                    $(field).attr('checked',true);
                }else{
                    $(field).attr('checked',false);
                }
            }else if(field.type === 'radio'){
                if(field.value == ''+  value){
                    $(field).attr('checked',true);
                }else{
                    $(field).attr('checked',false);
                }
            }else{
                $(field).val(value);
            }
        },
        /**
         * 获取表单字段值
         * @param {HTMLElement} form 表单元素
         * @param {string} field 字段名
         * @return {String}   字段值
         */
        getField : function(form,fieldName){
            return BUI.FormHelper.serializeToObject(form)[fieldName];
        }
    };

    return BUI;
});
