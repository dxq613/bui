/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */

define('bui/common',['bui/ua','bui/json','bui/date','bui/array','bui/keycode','bui/observable','bui/base','bui/component'],function(require){

  var BUI = require('bui/util');

  BUI.mix(BUI,{
    UA : require('bui/ua'),
    JSON : require('bui/json'),
    Date : require('bui/date'),
    Array : require('bui/array'),
    KeyCode : require('bui/keycode'),
    Observable : require('bui/observable'),
    Base : require('bui/base'),
    Component : require('bui/component')
  });
  return BUI;
});
var BUI = BUI || {};
if(!BUI.use && seajs){
    BUI.use = seajs.use;
    BUI.config = seajs.config;
}

define('bui/util',function(){
  
    //\u517c\u5bb9jquery 1.6\u4ee5\u4e0b
    (function($){
      if($.fn){
        $.fn.on = $.fn.on || $.fn.bind;
        $.fn.off = $.fn.off || $.fn.unbind;
      }
     
    })(jQuery);
  /**
   * @ignore
   * \u5904\u4e8e\u6548\u7387\u7684\u76ee\u7684\uff0c\u590d\u5236\u5c5e\u6027
   */
  function mixAttrs(to,from){

    for(var c in from){
        if(from.hasOwnProperty(c)){
            to[c] = to[c] || {};
            mixAttr(to[c],from[c]);
        }
    }
    
  }
  //\u5408\u5e76\u5c5e\u6027
  function mixAttr(attr,attrConfig){
    for (var p in attrConfig) {
      if(attrConfig.hasOwnProperty(p)){
        if(p == 'value'){
          if(BUI.isObject(attrConfig[p])){
            attr[p] = attr[p] || {};
            BUI.mix(/*true,*/attr[p], attrConfig[p]); 
          }else if(BUI.isArray(attrConfig[p])){
            attr[p] = attr[p] || [];
            BUI.mix(/*true,*/attr[p], attrConfig[p]); 
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
    ATTRS = 'ATTRS',
    PARSER = 'PARSER',
    GUID_DEFAULT = 'guid';

  $.extend(BUI,
  {
    /**
     * \u7248\u672c\u53f7
     * @memberOf BUI
     * @type {Number}
     */
    version:1.0,

    /**
     * \u5b50\u7248\u672c\u53f7
     * @type {String}
     */
    subVersion : 2,

    /**
     * \u662f\u5426\u4e3a\u51fd\u6570
     * @param  {*} fn \u5bf9\u8c61
     * @return {Boolean}  \u662f\u5426\u51fd\u6570
     */
    isFunction : function(fn){
      return typeof(fn) === 'function';
    },
    /**
     * \u662f\u5426\u6570\u7ec4
     * @method 
     * @param  {*}  obj \u662f\u5426\u6570\u7ec4
     * @return {Boolean}  \u662f\u5426\u6570\u7ec4
     */
    isArray : ('isArray' in Array) ? Array.isArray : function(value) {
        return toString.call(value) === '[object Array]';
    },
    /**
     * \u662f\u5426\u65e5\u671f
     * @param  {*}  value \u5bf9\u8c61
     * @return {Boolean}  \u662f\u5426\u65e5\u671f
     */
    isDate: function(value) {
        return toString.call(value) === '[object Date]';
    },
    /**
     * \u662f\u5426\u662fjavascript\u5bf9\u8c61
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
     * \u5c06\u6307\u5b9a\u7684\u65b9\u6cd5\u6216\u5c5e\u6027\u653e\u5230\u6784\u9020\u51fd\u6570\u7684\u539f\u578b\u94fe\u4e0a\uff0c
     * \u51fd\u6570\u652f\u6301\u591a\u4e8e2\u4e2a\u53d8\u91cf\uff0c\u540e\u9762\u7684\u53d8\u91cf\u540cs1\u4e00\u6837\u5c06\u5176\u6210\u5458\u590d\u5236\u5230\u6784\u9020\u51fd\u6570\u7684\u539f\u578b\u94fe\u4e0a\u3002
     * @param  {Function} r  \u6784\u9020\u51fd\u6570
     * @param  {Object} s1 \u5c06s1 \u7684\u6210\u5458\u590d\u5236\u5230\u6784\u9020\u51fd\u6570\u7684\u539f\u578b\u94fe\u4e0a
     *			@example
     *			BUI.augment(class1,{
     *				method1: function(){
     *   
     *				}
     *			});
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
     * \u62f7\u8d1d\u5bf9\u8c61
     * @param  {Object} obj \u8981\u62f7\u8d1d\u7684\u5bf9\u8c61
     * @return {Object} \u62f7\u8d1d\u751f\u6210\u7684\u5bf9\u8c61
     */
    cloneObject : function(obj){
            var result = BUI.isArray(obj) ? [] : {};
            
      return BUI.mix(true,result,obj);
    },
    /**
    * \u629b\u51fa\u9519\u8bef
    */
    error : function(msg){
        if(BUI.debug){
            throw msg;
        }
    },
    /**
     * \u5b9e\u73b0\u7c7b\u7684\u7ee7\u627f\uff0c\u901a\u8fc7\u7236\u7c7b\u751f\u6210\u5b50\u7c7b
     * @param  {Function} subclass
     * @param  {Function} superclass \u7236\u7c7b\u6784\u9020\u51fd\u6570
     * @param  {Object} overrides  \u5b50\u7c7b\u7684\u5c5e\u6027\u6216\u8005\u65b9\u6cd5
     * @return {Function} \u8fd4\u56de\u7684\u5b50\u7c7b\u6784\u9020\u51fd\u6570
		 * \u793a\u4f8b:
     *		@example
     *		//\u7236\u7c7b
     *		function base(){
     * 
     *		}
     *
     *		function sub(){
     * 
     *		}
     *		//\u5b50\u7c7b
     *		BUI.extend(sub,base,{
     *			method : function(){
     *    
     *			}
     *		});
     *
     *		//\u6216\u8005
     *		var sub = BUI.extend(base,{});
     */
    extend : function(subclass,superclass,overrides, staticOverrides){
      //\u5982\u679c\u53ea\u63d0\u4f9b\u7236\u7c7b\u6784\u9020\u51fd\u6570\uff0c\u5219\u81ea\u52a8\u751f\u6210\u5b50\u7c7b\u6784\u9020\u51fd\u6570
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
      var superObj = create(superclass.prototype,subclass);//new superclass(),//\u5b9e\u4f8b\u5316\u7236\u7c7b\u4f5c\u4e3a\u5b50\u7c7b\u7684prototype
      subclass.prototype = BUI.mix(superObj,subclass.prototype);     //\u6307\u5b9a\u5b50\u7c7b\u7684prototype
      subclass.superclass = create(superclass.prototype,superclass);  
      BUI.mix(superObj,overrides);
      BUI.mix(subclass,staticOverrides);
      return subclass;
    },
    /**
     * \u751f\u6210\u552f\u4e00\u7684Id
     * @method
     * @param {String} prefix \u524d\u7f00
     * @default 'bui-guid'
     * @return {String} \u552f\u4e00\u7684\u7f16\u53f7
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
     * \u5224\u65ad\u662f\u5426\u662f\u5b57\u7b26\u4e32
     * @return {Boolean} \u662f\u5426\u662f\u5b57\u7b26\u4e32
     */
    isString : function(value){
      return typeof value === 'string';
    },
    /**
     * \u5224\u65ad\u662f\u5426\u6570\u5b57\uff0c\u7531\u4e8e$.isNumberic\u65b9\u6cd5\u4f1a\u628a '123'\u8ba4\u4e3a\u6570\u5b57
     * @return {Boolean} \u662f\u5426\u6570\u5b57
     */
    isNumber : function(value){
      return typeof value === 'number';
    },
    /**
     * \u63a7\u5236\u53f0\u8f93\u51fa\u65e5\u5fd7
     * @param  {Object} obj \u8f93\u51fa\u7684\u6570\u636e
     */
    log : function(obj){
      if(BUI.debug && win.console && win.console.log){
        win.console.log(obj);
      }
    },
    /**
    * \u5c06\u591a\u4e2a\u5bf9\u8c61\u7684\u5c5e\u6027\u590d\u5236\u5230\u4e00\u4e2a\u65b0\u7684\u5bf9\u8c61
    */
    merge : function(){
      var args = $.makeArray(arguments);
      args.unshift({});
      return BUI.mix.apply(null,args);

    },
    /**
     * \u5c01\u88c5 jQuery.extend \u65b9\u6cd5\uff0c\u5c06\u591a\u4e2a\u5bf9\u8c61\u7684\u5c5e\u6027merge\u5230\u7b2c\u4e00\u4e2a\u5bf9\u8c61\u4e2d
     * @return {Object} 
     */
    mix : function(){
      return $.extend.apply(null,arguments);
    },
    /**
    * \u521b\u9020\u9876\u5c42\u7684\u547d\u540d\u7a7a\u95f4\uff0c\u9644\u52a0\u5230window\u5bf9\u8c61\u4e0a,
    * \u5305\u542bnamespace\u65b9\u6cd5
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
    /**
     * \u5c06\u5176\u4ed6\u7c7b\u4f5c\u4e3amixin\u96c6\u6210\u5230\u6307\u5b9a\u7c7b\u4e0a\u9762
     * @param {Function} c \u6784\u9020\u51fd\u6570
     * @param {Array} mixins \u6269\u5c55\u7c7b
     * @param {Array} attrs \u6269\u5c55\u7684\u9759\u6001\u5c5e\u6027\uff0c\u9ed8\u8ba4\u4e3a['ATTRS']
     * @return {Function} \u4f20\u5165\u7684\u6784\u9020\u51fd\u6570
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

            // [ex1,ex2]\uff0c\u6269\u5c55\u7c7b\u540e\u9762\u7684\u4f18\u5148\uff0cex2 \u5b9a\u4e49\u7684\u8986\u76d6 ex1 \u5b9a\u4e49\u7684
            // \u4e3b\u7c7b\u6700\u4f18\u5148
            BUI.each(constructors, function (ext) {
                if (ext) {
                    // \u5408\u5e76 ATTRS/HTML_PARSER \u5230\u4e3b\u7c7b
                    BUI.each(attrs, function (K) {
                        if (ext[K]) {
                            desc[K] = desc[K] || {};
                            // \u4e0d\u8986\u76d6\u4e3b\u7c7b\u4e0a\u7684\u5b9a\u4e49\uff0c\u56e0\u4e3a\u7ee7\u627f\u5c42\u6b21\u4e0a\u6269\u5c55\u7c7b\u6bd4\u4e3b\u7c7b\u5c42\u6b21\u9ad8
                            // \u4f46\u662f\u503c\u662f\u5bf9\u8c61\u7684\u8bdd\u4f1a\u6df1\u5ea6\u5408\u5e76
                            // \u6ce8\u610f\uff1a\u6700\u597d\u503c\u662f\u7b80\u5355\u5bf9\u8c61\uff0c\u81ea\u5b9a\u4e49 new \u51fa\u6765\u7684\u5bf9\u8c61\u5c31\u4f1a\u6709\u95ee\u9898(\u7528 function return \u51fa\u6765)!
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

            // \u4e3b\u7c7b\u6700\u4f18\u5148
            BUI.each(constructors, function (ext) {
                if (ext) {
                    var proto = ext.prototype;
                    // \u5408\u5e76\u529f\u80fd\u4ee3\u7801\u5230\u4e3b\u7c7b\uff0c\u4e0d\u8986\u76d6
                    for (var p in proto) {
                        // \u4e0d\u8986\u76d6\u4e3b\u7c7b\uff0c\u4f46\u662f\u4e3b\u7c7b\u7684\u7236\u7c7b\u8fd8\u662f\u8986\u76d6\u5427
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
     * \u751f\u6210\u547d\u540d\u7a7a\u95f4
     * @param  {String} name \u547d\u540d\u7a7a\u95f4\u7684\u540d\u79f0
     * @param  {Object} baseNS \u5728\u5df2\u6709\u7684\u547d\u540d\u7a7a\u95f4\u4e0a\u521b\u5efa\u547d\u540d\u7a7a\u95f4\uff0c\u9ed8\u8ba4\u201cBUI\u201d
     * @return {Object} \u8fd4\u56de\u7684\u547d\u540d\u7a7a\u95f4\u5bf9\u8c61
     *		@example
     *		BUI.namespace("Grid"); // BUI.Grid
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
     * BUI \u63a7\u4ef6\u7684\u516c\u7528\u524d\u7f00
     * @type {String}
     */
    prefix : 'bui-',
    /**
     * \u66ff\u6362\u5b57\u7b26\u4e32\u4e2d\u7684\u5b57\u6bb5.
     * @param {String} str \u6a21\u7248\u5b57\u7b26\u4e32
     * @param {Object} o json data
     * @param {RegExp} [regexp] \u5339\u914d\u5b57\u7b26\u4e32\u7684\u6b63\u5219\u8868\u8fbe\u5f0f
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
     * \u4f7f\u7b2c\u4e00\u4e2a\u5b57\u6bcd\u53d8\u6210\u5927\u5199
     * @param  {String} s \u5b57\u7b26\u4e32
     * @return {String} \u9996\u5b57\u6bcd\u5927\u5199\u540e\u7684\u5b57\u7b26\u4e32
     */
    ucfirst : function(s){
      s += '';
            return s.charAt(0).toUpperCase() + s.substring(1);
    },
    /**
     * \u9875\u9762\u4e0a\u7684\u4e00\u70b9\u662f\u5426\u5728\u7528\u6237\u7684\u89c6\u56fe\u5185
     * @param {Object} offset \u5750\u6807\uff0cleft,top
     * @return {Boolean} \u662f\u5426\u5728\u89c6\u56fe\u5185
     */
    isInView : function(offset){
      var left = offset.left,
        top = offset.top,
        viewWidth = BUI.viewportWidth(),
        wiewHeight = BUI.viewportHeight(),
        scrollTop = BUI.scrollTop(),
        scrollLeft = BUI.scrollLeft();
      //\u5224\u65ad\u6a2a\u5750\u6807
      if(left < scrollLeft ||left > scrollLeft + viewWidth){
        return false;
      }
      //\u5224\u65ad\u7eb5\u5750\u6807
      if(top < scrollTop || top > scrollTop + wiewHeight){
        return false;
      }
      return true;
    },
    /**
     * \u9875\u9762\u4e0a\u7684\u4e00\u70b9\u7eb5\u5411\u5750\u6807\u662f\u5426\u5728\u7528\u6237\u7684\u89c6\u56fe\u5185
     * @param {Object} top  \u7eb5\u5750\u6807
     * @return {Boolean} \u662f\u5426\u5728\u89c6\u56fe\u5185
     */
    isInVerticalView : function(top){
      var wiewHeight = BUI.viewportHeight(),
        scrollTop = BUI.scrollTop();
      
      //\u5224\u65ad\u7eb5\u5750\u6807
      if(top < scrollTop || top > scrollTop + wiewHeight){
        return false;
      }
      return true;
    },
    /**
     * \u9875\u9762\u4e0a\u7684\u4e00\u70b9\u6a2a\u5411\u5750\u6807\u662f\u5426\u5728\u7528\u6237\u7684\u89c6\u56fe\u5185
     * @param {Object} left \u6a2a\u5750\u6807
     * @return {Boolean} \u662f\u5426\u5728\u89c6\u56fe\u5185
     */
    isInHorizontalView : function(left){
      var viewWidth = BUI.viewportWidth(),     
        scrollLeft = BUI.scrollLeft();
      //\u5224\u65ad\u6a2a\u5750\u6807
      if(left < scrollLeft ||left > scrollLeft + viewWidth){
        return false;
      }
      return true;
    },
    /**
     * \u83b7\u53d6\u7a97\u53e3\u53ef\u89c6\u8303\u56f4\u5bbd\u5ea6
     * @return {Number} \u53ef\u89c6\u533a\u5bbd\u5ea6
     */
    viewportWidth : function(){
        return $(window).width();
    },
    /**
     * \u83b7\u53d6\u7a97\u53e3\u53ef\u89c6\u8303\u56f4\u9ad8\u5ea6
     * @return {Number} \u53ef\u89c6\u533a\u9ad8\u5ea6
     */
    viewportHeight:function(){
         return $(window).height();
    },
    /**
     * \u6eda\u52a8\u5230\u7a97\u53e3\u7684left\u4f4d\u7f6e
     */
    scrollLeft : function(){
        return $(window).scrollLeft();
    },
    /**
     * \u6eda\u52a8\u5230\u6a2a\u5411\u4f4d\u7f6e
     */
    scrollTop : function(){
        return $(window).scrollTop();
    },
    /**
     * \u7a97\u53e3\u5bbd\u5ea6
     * @return {Number} \u7a97\u53e3\u5bbd\u5ea6
     */
    docWidth : function(){
        var body = document.documentElement || document.body;
        return $(body).width();
    },
    /**
     * \u7a97\u53e3\u9ad8\u5ea6
     * @return {Number} \u7a97\u53e3\u9ad8\u5ea6
     */
    docHeight : function(){
        var body = document.documentElement || document.body;
        return $(body).height();
    },
    /**
     * \u904d\u5386\u6570\u7ec4\u6216\u8005\u5bf9\u8c61
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){}
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
     * \u5c01\u88c5\u4e8b\u4ef6\uff0c\u4fbf\u4e8e\u4f7f\u7528\u4e0a\u4e0b\u6587this,\u548c\u4fbf\u4e8e\u89e3\u9664\u4e8b\u4ef6\u65f6\u4f7f\u7528
     * @protected
     * @param  {Object} self   \u5bf9\u8c61
     * @param  {String} action \u4e8b\u4ef6\u540d\u79f0
     */
    wrapBehavior : function(self, action) {
      return self['__bui_wrap_' + action] = function (e) {
        if (!self.get('disabled')) {
            self[action](e);
        }
      };
    },
    /**
     * \u83b7\u53d6\u5c01\u88c5\u7684\u4e8b\u4ef6
     * @protected
     * @param  {Object} self   \u5bf9\u8c61
     * @param  {String} action \u4e8b\u4ef6\u540d\u79f0
     */
    getWrapBehavior : function(self, action) {
        return self['__bui_wrap_' + action];
    }

  });

  /**
  * \u8868\u5355\u5e2e\u52a9\u7c7b\uff0c\u5e8f\u5217\u5316\u3001\u53cd\u5e8f\u5217\u5316\uff0c\u8bbe\u7f6e\u503c
  * @class BUI.FormHelper
  * @singleton
  */
  var formHelper = BUI.FormHelper = {
    /**
    * \u5c06\u8868\u5355\u683c\u5f0f\u5316\u6210\u952e\u503c\u5bf9\u5f62\u5f0f
    * @param {HTMLElement} form \u8868\u5355
    * @return {Object} \u952e\u503c\u5bf9\u7684\u5bf9\u8c61
    */
    serializeToObject:function(form){
      var array = $(form).serializeArray(),
        result = {};
      BUI.each(array,function(item){
        var name = item.name;
        if(!result[name]){ //\u5982\u679c\u662f\u5355\u4e2a\u503c\uff0c\u76f4\u63a5\u8d4b\u503c
          result[name] = item.value;  
        }else{ //\u591a\u503c\u4f7f\u7528\u6570\u7ec4
          if(!BUI.isArray(result[name])){
            result[name] = [result[name]];
          }
          result[name].push(item.value);
        }
      });
      return result;
    },
    /**
     * \u8bbe\u7f6e\u8868\u5355\u7684\u503c
     * @param {HTMLElement} form \u8868\u5355
     * @param {Object} obj  \u952e\u503c\u5bf9
     */
    setFields : function(form,obj){
      for(var name in obj){
        if(obj.hasOwnProperty(name)){
          BUI.FormHelper.setField(form,name,obj[name]);
        }
      }
    },
    /**
     * \u6e05\u7a7a\u8868\u5355
     * @param  {HTMLElement} form \u8868\u5355\u5143\u7d20
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
    * \u8bbe\u7f6e\u8868\u5355\u5b57\u6bb5
    * @param {HTMLElement} form \u8868\u5355\u5143\u7d20
    * @param {string} field \u5b57\u6bb5\u540d 
    * @param {string} value \u5b57\u6bb5\u503c
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
    //\u8bbe\u7f6e\u5b57\u6bb5\u7684\u503c
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
     * \u83b7\u53d6\u8868\u5355\u5b57\u6bb5\u503c
     * @param {HTMLElement} form \u8868\u5355\u5143\u7d20
     * @param {string} field \u5b57\u6bb5\u540d 
     * @return {String}   \u5b57\u6bb5\u503c
     */
    getField : function(form,fieldName){
      return BUI.FormHelper.serializeToObject(form)[fieldName];
    }
  };

  return BUI;
});
/**
 * @class BUI
 * \u63a7\u4ef6\u5e93\u7684\u57fa\u7840\u547d\u540d\u7a7a\u95f4
 * @singleton
 */

define('bui/array',['bui/util'],function (r) {
  
  var BUI = r('bui/util');
  /**
   * @class BUI.Array
   * \u6570\u7ec4\u5e2e\u52a9\u7c7b
   */
  BUI.Array ={
    /**
     * \u8fd4\u56de\u6570\u7ec4\u7684\u6700\u540e\u4e00\u4e2a\u5bf9\u8c61
     * @param {Array} array \u6570\u7ec4\u6216\u8005\u7c7b\u4f3c\u4e8e\u6570\u7ec4\u7684\u5bf9\u8c61.
     * @return {*} \u6570\u7ec4\u7684\u6700\u540e\u4e00\u9879.
     */
    peek : function(array) {
      return array[array.length - 1];
    },
    /**
     * \u67e5\u627e\u8bb0\u5f55\u6240\u5728\u7684\u4f4d\u7f6e
     * @param  {*} value \u503c
     * @param  {Array} array \u6570\u7ec4\u6216\u8005\u7c7b\u4f3c\u4e8e\u6570\u7ec4\u7684\u5bf9\u8c61
     * @param  {Number} [fromIndex=0] \u8d77\u59cb\u9879\uff0c\u9ed8\u8ba4\u4e3a0
     * @return {Number} \u4f4d\u7f6e\uff0c\u5982\u679c\u4e3a -1\u5219\u4e0d\u5728\u6570\u7ec4\u5185
     */
    indexOf : function(value, array,opt_fromIndex){
       var fromIndex = opt_fromIndex == null ?
          0 : (opt_fromIndex < 0 ?
               Math.max(0, array.length + opt_fromIndex) : opt_fromIndex);

      for (var i = fromIndex; i < array.length; i++) {
        if (i in array && array[i] === value)
          return i;
      }
      return -1;
    },
    /**
     * \u6570\u7ec4\u662f\u5426\u5b58\u5728\u6307\u5b9a\u503c
     * @param  {*} value \u503c
     * @param  {Array} array \u6570\u7ec4\u6216\u8005\u7c7b\u4f3c\u4e8e\u6570\u7ec4\u7684\u5bf9\u8c61
     * @return {Boolean} \u662f\u5426\u5b58\u5728\u4e8e\u6570\u7ec4\u4e2d
     */
    contains : function(value,array){
      return BUI.Array.indexOf(value,array) >=0;
    },
    /**
     * \u904d\u5386\u6570\u7ec4\u6216\u8005\u5bf9\u8c61
     * @method 
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){}
     */
    each : BUI.each,
    /**
     * 2\u4e2a\u6570\u7ec4\u5185\u90e8\u7684\u503c\u662f\u5426\u76f8\u7b49
     * @param  {Array} a1 \u6570\u7ec41
     * @param  {Array} a2 \u6570\u7ec42
     * @return {Boolean} 2\u4e2a\u6570\u7ec4\u76f8\u7b49\u6216\u8005\u5185\u90e8\u5143\u7d20\u662f\u5426\u76f8\u7b49
     */
    equals : function(a1,a2){
      if(a1 == a2){
        return true;
      }
      if(!a1 || !a2){
        return false;
      }

      if(a1.length != a2.length){
        return false;
      }
      var rst = true;
      for(var i = 0 ;i < a1.length; i++){
        if(a1[i] !== a2[i]){
          rst = false;
          break;
        }
      }
      return rst;
    },

    /**
     * \u8fc7\u6ee4\u6570\u7ec4
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){},\u5982\u679c\u8fd4\u56detrue\u5219\u6dfb\u52a0\u5230\u7ed3\u679c\u96c6
     * @return {Array} \u8fc7\u6ee4\u7684\u7ed3\u679c\u96c6
     */
    filter : function(array,func){
      var result = [];
      BUI.Array.each(array,function(value,index){
        if(func(value,index)){
          result.push(value);
        }
      });
      return result;
    },
    /**
     * \u8f6c\u6362\u6570\u7ec4\u6570\u7ec4
     * @param {Object|Array} element/Object \u6570\u7ec4\u4e2d\u7684\u5143\u7d20\u6216\u8005\u5bf9\u8c61\u7684\u503c 
     * @param {Function} func \u904d\u5386\u7684\u51fd\u6570 function(elememt,index){} \u6216\u8005 function(value,key){},\u5c06\u8fd4\u56de\u7684\u7ed3\u679c\u6dfb\u52a0\u5230\u7ed3\u679c\u96c6
     * @return {Array} \u8fc7\u6ee4\u7684\u7ed3\u679c\u96c6
     */
    map : function(array,func){
      var result = [];
      BUI.Array.each(array,function(value,index){
        result.push(func(value,index));
      });
      return result;
    },
    /**
     * \u83b7\u53d6\u7b2c\u4e00\u4e2a\u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e
     * @param  {Array} array \u6570\u7ec4
     * @param  {Function} func  \u5339\u914d\u51fd\u6570
     * @return {*}  \u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e
     */
    find : function(array,func){
      var i = BUI.Array.findIndex(array, func);
      return i < 0 ? null : array[i];
    },
    /**
     * \u83b7\u53d6\u7b2c\u4e00\u4e2a\u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e\u7684\u7d22\u5f15\u503c
    * @param  {Array} array \u6570\u7ec4
     * @param  {Function} func  \u5339\u914d\u51fd\u6570
     * @return {Number} \u7b26\u5408\u6761\u4ef6\u7684\u6570\u636e\u7684\u7d22\u5f15\u503c
     */
    findIndex : function(array,func){
      var result = -1;
      BUI.Array.each(array,function(value,index){
        if(func(value,index)){
          result = index;
          return false;
        }
      });
      return result;
    },
    /**
     * \u6570\u7ec4\u662f\u5426\u4e3a\u7a7a
     * @param  {Array}  array \u6570\u7ec4
     * @return {Boolean}  \u662f\u5426\u4e3a\u7a7a
     */
    isEmpty : function(array){
      return array.length == 0;
    },
    /**
     * \u63d2\u5165\u6570\u7ec4
     * @param  {Array} array \u6570\u7ec4
     * @param  {Number} index \u4f4d\u7f6e
     * @param {*} value \u63d2\u5165\u7684\u6570\u636e
     */
    add : function(array,value){
      array.push(value);
    },
    /**
     * \u5c06\u6570\u636e\u63d2\u5165\u6570\u7ec4\u6307\u5b9a\u7684\u4f4d\u7f6e
     * @param  {Array} array \u6570\u7ec4
     * @param {*} value \u63d2\u5165\u7684\u6570\u636e
     * @param  {Number} index \u4f4d\u7f6e
     */
    addAt : function(array,value,index){
      BUI.Array.splice(array, index, 0, value);
    },
    /**
     * \u6e05\u7a7a\u6570\u7ec4
     * @param  {Array} array \u6570\u7ec4
     * @return {Array}  \u6e05\u7a7a\u540e\u7684\u6570\u7ec4
     */
    empty : function(array){
      if(!(array instanceof(Array))){
        for (var i = array.length - 1; i >= 0; i--) {
          delete array[i];
        }
      }
      array.length = 0;
    },
    /**
     * \u79fb\u9664\u8bb0\u5f55
     * @param  {Array} array \u6570\u7ec4
     * @param  {*} value \u8bb0\u5f55
     * @return {Boolean}   \u662f\u5426\u79fb\u9664\u6210\u529f
     */
    remove : function(array,value){
      var i = BUI.Array.indexOf(value, array);
      var rv;
      if ((rv = i >= 0)) {
        BUI.Array.removeAt(array, i);
      }
      return rv;
    },
    /**
     * \u79fb\u9664\u6307\u5b9a\u4f4d\u7f6e\u7684\u8bb0\u5f55
     * @param  {Array} array \u6570\u7ec4
     * @param  {Number} index \u7d22\u5f15\u503c
     * @return {Boolean}   \u662f\u5426\u79fb\u9664\u6210\u529f
     */
    removeAt : function(array,index){
      return BUI.Array.splice(array, index, 1).length == 1;
    },
    /**
     * @private
     */
    slice : function(arr, start, opt_end){
      if (arguments.length <= 2) {
        return Array.prototype.slice.call(arr, start);
      } else {
        return Array.prototype.slice.call(arr, start, opt_end);
      }
    },
    /**
     * @private
     */
    splice : function(arr, index, howMany, var_args){
      return Array.prototype.splice.apply(arr, BUI.Array.slice(arguments, 1))
    }

  };
  return BUI.Array;
});
define('bui/observable',['bui/util'],function (r) {
  
  var BUI = r('bui/util');
  /**
   * @private
   * @class BUI.Observable.Callbacks
   * jquery 1.7 \u65f6\u5b58\u5728 $.Callbacks,\u4f46\u662ffireWith\u7684\u8fd4\u56de\u7ed3\u679c\u662f$.Callbacks \u5bf9\u8c61\uff0c
   * \u800c\u6211\u4eec\u60f3\u8981\u7684\u6548\u679c\u662f\uff1a\u5f53\u5176\u4e2d\u6709\u4e00\u4e2a\u51fd\u6570\u8fd4\u56de\u4e3afalse\u65f6\uff0c\u963b\u6b62\u540e\u9762\u7684\u6267\u884c\uff0c\u5e76\u8fd4\u56defalse
   */
  var Callbacks = function(){
    this._init();
  };

  BUI.augment(Callbacks,{

    _functions : null,

    _init : function(){
      var _self = this;

      _self._functions = [];
    },
    /**
     * \u6dfb\u52a0\u56de\u8c03\u51fd\u6570
     * @param {Function} fn \u56de\u8c03\u51fd\u6570
     */
    add:function(fn){
      this._functions.push(fn);
    },
    /**
     * \u79fb\u9664\u56de\u8c03\u51fd\u6570
     * @param  {Function} fn \u56de\u8c03\u51fd\u6570
     */
    remove : function(fn){
      var functions = this._functions;
        index = BUI.Array.indexOf(fn,functions);
      if(index>=0){
        functions.splice(index,1);
      }
    },
    empty : function(){
      var length = this._functions.length; //ie6,7\u4e0b\uff0c\u5fc5\u987b\u6307\u5b9a\u9700\u8981\u5220\u9664\u7684\u6570\u91cf
      this._functions.splice(0,length);
    },
    /**
     * \u89e6\u53d1\u56de\u8c03
     * @param  {Object} scope \u4e0a\u4e0b\u6587
     * @param  {Array} args  \u56de\u8c03\u51fd\u6570\u7684\u53c2\u6570
     * @return {Boolean|undefined} \u5f53\u5176\u4e2d\u6709\u4e00\u4e2a\u51fd\u6570\u8fd4\u56de\u4e3afalse\u65f6\uff0c\u963b\u6b62\u540e\u9762\u7684\u6267\u884c\uff0c\u5e76\u8fd4\u56defalse
     */
    fireWith : function(scope,args){
      var _self = this,
        rst;

      BUI.each(_self._functions,function(fn){
        rst = fn.apply(scope,args);
        if(rst === false){
          return false;
        }
      });
      return rst;
    }
  });

  function getCallbacks(){
    return new Callbacks();
  }
  /**
   * \u652f\u6301\u4e8b\u4ef6\u7684\u5bf9\u8c61\uff0c\u53c2\u8003\u89c2\u5bdf\u8005\u6a21\u5f0f
   *  - \u6b64\u7c7b\u63d0\u4f9b\u4e8b\u4ef6\u7ed1\u5b9a
   *  - \u63d0\u4f9b\u4e8b\u4ef6\u5192\u6ce1\u673a\u5236
   *
   * <pre><code>
   *   var control = new Control();
   *   control.on('click',function(ev){
   *   
   *   });
   *
   *   control.off();  //\u79fb\u9664\u6240\u6709\u4e8b\u4ef6
   * </code></pre>
   * @class BUI.Observable
   * @abstract
   * @param {Object} config \u914d\u7f6e\u9879\u952e\u503c\u5bf9
   */
  var Observable = function(config){
        this._events = [];
        this._eventMap = {};
        this._bubblesEvents = [];
    this._initEvents(config);
  };

  BUI.augment(Observable,
  {

    /**
     * @cfg {Object} listeners 
     *  \u521d\u59cb\u5316\u4e8b\u4ef6,\u5feb\u901f\u6ce8\u518c\u4e8b\u4ef6
     *  <pre><code>
     *    var list = new BUI.List.SimpleList({
     *      listeners : {
     *        itemclick : function(ev){},
     *        itemrendered : function(ev){}
     *      },
     *      items : []
     *    });
     *    list.render();
     *  </code></pre>
     */
    
    /**
     * @cfg {Function} handler
     * \u70b9\u51fb\u4e8b\u4ef6\u7684\u5904\u7406\u51fd\u6570\uff0c\u5feb\u901f\u914d\u7f6e\u70b9\u51fb\u4e8b\u4ef6\u800c\u4e0d\u9700\u8981\u5199listeners\u5c5e\u6027
     * <pre><code>
     *    var list = new BUI.List.SimpleList({
     *      handler : function(ev){} //click \u4e8b\u4ef6
     *    });
     *    list.render();
     *  </code></pre>
     */
    
    /**
     * \u652f\u6301\u7684\u4e8b\u4ef6\u540d\u5217\u8868
     * @private
     */
    _events:[],

    /**
     * \u7ed1\u5b9a\u7684\u4e8b\u4ef6
     * @private
     */
    _eventMap : {},

    _bubblesEvents : [],

    _bubbleTarget : null,

    //\u83b7\u53d6\u56de\u8c03\u96c6\u5408
    _getCallbacks : function(eventType){
      var _self = this,
        eventMap = _self._eventMap;
      return eventMap[eventType];
    },
    //\u521d\u59cb\u5316\u4e8b\u4ef6\u5217\u8868
    _initEvents : function(config){
      var _self = this,
        listeners = null; 

      if(!config){
        return;
      }
      listeners = config.listeners || {};
      if(config.handler){
        listeners.click = config.handler;
      }
      if(listeners){
        for (var name in listeners) {
          if(listeners.hasOwnProperty(name)){
            _self.on(name,listeners[name]);
          }
        };
      }
    },
    //\u4e8b\u4ef6\u662f\u5426\u652f\u6301\u5192\u6ce1
    _isBubbles : function (eventType) {
        return BUI.Array.indexOf(eventType,this._bubblesEvents) >= 0;
    },
    /**
     * \u6dfb\u52a0\u5192\u6ce1\u7684\u5bf9\u8c61
     * @protected
     * @param {Object} target  \u5192\u6ce1\u7684\u4e8b\u4ef6\u6e90
     */
    addTarget : function(target) {
        this._bubbleTarget = target;
    },
    /**
     * \u6dfb\u52a0\u652f\u6301\u7684\u4e8b\u4ef6
     * @protected
     * @param {String|String[]} events \u4e8b\u4ef6
     */
    addEvents : function(events){
      var _self = this,
        existEvents = _self._events,
        eventMap = _self._eventMap;

      function addEvent(eventType){
        if(BUI.Array.indexOf(eventType,existEvents) === -1){
          eventMap[eventType] = getCallbacks();
          existEvents.push(eventType);
        }
      }
      if(BUI.isArray(events)){
        $.each(events,function(index,eventType){
          addEvent(eventType);
        });
      }else{
        addEvent(events);
      }
    },
    /**
     * \u79fb\u9664\u6240\u6709\u7ed1\u5b9a\u7684\u4e8b\u4ef6
     * @protected
     */
    clearListeners : function(){
      var _self = this,
        eventMap = _self._eventMap;
      for(var name in eventMap){
        if(eventMap.hasOwnProperty(name)){
          eventMap[name].empty();
        }
      }
    },
    /**
     * \u89e6\u53d1\u4e8b\u4ef6
     * <pre><code>
     *   //\u7ed1\u5b9a\u4e8b\u4ef6
     *   list.on('itemclick',function(ev){
     *     alert('21');
     *   });
     *   //\u89e6\u53d1\u4e8b\u4ef6
     *   list.fire('itemclick');
     * </code></pre>
     * @param  {String} eventType \u4e8b\u4ef6\u7c7b\u578b
     * @param  {Object} eventData \u4e8b\u4ef6\u89e6\u53d1\u65f6\u4f20\u9012\u7684\u6570\u636e
     * @return {Boolean|undefined}  \u5982\u679c\u5176\u4e2d\u4e00\u4e2a\u4e8b\u4ef6\u5904\u7406\u5668\u8fd4\u56de false , \u5219\u8fd4\u56de false, \u5426\u5219\u8fd4\u56de\u6700\u540e\u4e00\u4e2a\u4e8b\u4ef6\u5904\u7406\u5668\u7684\u8fd4\u56de\u503c
     */
    fire : function(eventType,eventData){
      var _self = this,
        callbacks = _self._getCallbacks(eventType),
        args = $.makeArray(arguments),
        result;
      if(!eventData){
        eventData = {};
        args.push(eventData);
      }
      if(!eventData.target){
        eventData.target = _self;
      }
      if(callbacks){
        result = callbacks.fireWith(_self,Array.prototype.slice.call(args,1));
      }
      if(_self._isBubbles(eventType)){
          var bubbleTarget = _self._bubbleTarget;
          if(bubbleTarget && bubbleTarget.fire){
              bubbleTarget.fire(eventType,eventData);
          }
      }
      return result;
    },
    /**
     * \u6dfb\u52a0\u7ed1\u5b9a\u4e8b\u4ef6
     * <pre><code>
     *   //\u7ed1\u5b9a\u5355\u4e2a\u4e8b\u4ef6
     *   list.on('itemclick',function(ev){
     *     alert('21');
     *   });
     *   //\u7ed1\u5b9a\u591a\u4e2a\u4e8b\u4ef6
     *   list.on('itemrendered itemupdated',function(){
     *     //\u5217\u8868\u9879\u521b\u5efa\u3001\u66f4\u65b0\u65f6\u89e6\u53d1\u64cd\u4f5c
     *   });
     * </code></pre>
     * @param  {String}   eventType \u4e8b\u4ef6\u7c7b\u578b
     * @param  {Function} fn        \u56de\u8c03\u51fd\u6570
     */
    on : function(eventType,fn){
      //\u4e00\u6b21\u76d1\u542c\u591a\u4e2a\u4e8b\u4ef6
      var arr = eventType.split(' '),
        _self = this,
        callbacks =null;
      if(arr.length > 1){
        BUI.each(arr,function(name){
          _self.on(name,fn);
        });
      }else{
        callbacks = _self._getCallbacks(eventType);
        if(callbacks){
          callbacks.add(fn);
        }else{
          _self.addEvents(eventType);
          _self.on(eventType,fn);
        }
      }
      return _self;
    },
    /**
     * \u79fb\u9664\u7ed1\u5b9a\u7684\u4e8b\u4ef6
     * <pre><code>
     *  //\u79fb\u9664\u6240\u6709\u4e8b\u4ef6
     *  list.off();
     *  
     *  //\u79fb\u9664\u7279\u5b9a\u4e8b\u4ef6
     *  function callback(ev){}
     *  list.on('click',callback);
     *
     *  list.off('click',callback);//\u9700\u8981\u4fdd\u5b58\u56de\u8c03\u51fd\u6570\u7684\u5f15\u7528
     * 
     * </code></pre>
     * @param  {String}   eventType \u4e8b\u4ef6\u7c7b\u578b
     * @param  {Function} fn        \u56de\u8c03\u51fd\u6570
     */
    off : function(eventType,fn){
      if(!eventType && !fn){
        this.clearListeners();
        return this;
      }
      var _self = this,
        callbacks = _self._getCallbacks(eventType);
      if(callbacks){
        callbacks.remove(fn);
      }
      return _self;
    },
    /**
     * \u914d\u7f6e\u4e8b\u4ef6\u662f\u5426\u5141\u8bb8\u5192\u6ce1
     * @protected
     * @param  {String} eventType \u652f\u6301\u5192\u6ce1\u7684\u4e8b\u4ef6
     * @param  {Object} cfg \u914d\u7f6e\u9879
     * @param {Boolean} cfg.bubbles \u662f\u5426\u652f\u6301\u5192\u6ce1
     */
    publish : function(eventType, cfg){
      var _self = this,
          bubblesEvents = _self._bubblesEvents;

      if(cfg.bubbles){
          if(BUI.Array.indexOf(eventType,bubblesEvents) === -1){
              bubblesEvents.push(eventType);
          }
      }else{
          var index = BUI.Array.indexOf(eventType,bubblesEvents);
          if(index !== -1){
              bubblesEvents.splice(index,1);
          }
      }
    }
  });

  return Observable;
});
define('bui/ua', function () {

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    };

    function uaMatch(s) {
        s = s.toLowerCase();
        var r = /(chrome)[ \/]([\w.]+)/.exec(s) || /(webkit)[ \/]([\w.]+)/.exec(s) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(s) || /(msie) ([\w.]+)/.exec(s) || s.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(s) || [],
            a = {
                browser: r[1] || "",
                version: r[2] || "0"
            },
            b = {};
        a.browser && (b[a.browser] = !0, b.version = a.version),
            b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0);
        return b;
    }

    var UA = $.UA || (function () {
        var browser = $.browser || uaMatch(navigator.userAgent),
            versionNumber = numberify(browser.version),
            /**
             * \u6d4f\u89c8\u5668\u7248\u672c\u68c0\u6d4b
             * @class BUI.UA
             * @singleton
             */
                ua =
            {
                /**
                 * ie \u7248\u672c
                 * @type {Number}
                 */
                ie: browser.msie && versionNumber,

                /**
                 * webkit \u7248\u672c
                 * @type {Number}
                 */
                webkit: browser.webkit && versionNumber,
                /**
                 * opera \u7248\u672c
                 * @type {Number}
                 */
                opera: browser.opera && versionNumber,
                /**
                 * mozilla \u706b\u72d0\u7248\u672c
                 * @type {Number}
                 */
                mozilla: browser.mozilla && versionNumber
            };
        return ua;
    })();

    return UA;
});
define('bui/json',['bui/ua'],function (require) {

  var win = window,
    UA = require('bui/ua'),
    JSON = win.JSON;

  // ie 8.0.7600.16315@win7 json \u6709\u95ee\u9898
  if (!JSON || UA['ie'] < 9) {
      JSON = win.JSON = {};
  }

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {

      Date.prototype.toJSON = function (key) {

          return isFinite(this.valueOf()) ?
              this.getUTCFullYear() + '-' +
                  f(this.getUTCMonth() + 1) + '-' +
                  f(this.getUTCDate()) + 'T' +
                  f(this.getUTCHours()) + ':' +
                  f(this.getUTCMinutes()) + ':' +
                  f(this.getUTCSeconds()) + 'Z' : null;
      };

      String.prototype.toJSON =
          Number.prototype.toJSON =
              Boolean.prototype.toJSON = function (key) {
                  return this.valueOf();
              };
  }


  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

    function quote(string) {

      // If the string contains no control characters, no quote characters, and no
      // backslash characters, then we can safely slap some quotes around it.
      // Otherwise we must also replace the offending characters with safe escape
      // sequences.

      escapable['lastIndex'] = 0;
      return escapable.test(string) ?
          '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string' ? c :
                  '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' :
          '"' + string + '"';
    }

    function str(key, holder) {

      // Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

      // If the value has a toJSON method, call it to obtain a replacement value.

      if (value && typeof value === 'object' &&
          typeof value.toJSON === 'function') {
          value = value.toJSON(key);
      }

      // If we were called with a replacer function, then call the replacer to
      // obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

      // What happens next depends on the value's type.

      switch (typeof value) {
          case 'string':
              return quote(value);

          case 'number':

      // JSON numbers must be finite. Encode non-finite numbers as null.

              return isFinite(value) ? String(value) : 'null';

          case 'boolean':
          case 'null':

      // If the value is a boolean or null, convert it to a string. Note:
      // typeof null does not produce 'null'. The case is included here in
      // the remote chance that this gets fixed someday.

              return String(value);

      // If the type is 'object', we might be dealing with an object or an array or
      // null.

          case 'object':

      // Due to a specification blunder in ECMAScript, typeof null is 'object',
      // so watch out for that case.

              if (!value) {
                  return 'null';
              }

      // Make an array to hold the partial results of stringifying this object value.

              gap += indent;
              partial = [];

      // Is the value an array?

              if (Object.prototype.toString.apply(value) === '[object Array]') {

      // The value is an array. Stringify every element. Use null as a placeholder
      // for non-JSON values.

                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                      partial[i] = str(i, value) || 'null';
                  }

      // Join all of the elements together, separated with commas, and wrap them in
      // brackets.

                  v = partial.length === 0 ? '[]' :
                      gap ? '[\n' + gap +
                          partial.join(',\n' + gap) + '\n' +
                          mind + ']' :
                          '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
              }

      // If the replacer is an array, use it to select the members to be stringified.

              if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                      k = rep[i];
                      if (typeof k === 'string') {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              } else {

      // Otherwise, iterate through all of the keys in the object.

                  for (k in value) {
                      if (Object.hasOwnProperty.call(value, k)) {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              }

      // Join all of the member texts together, separated with commas,
      // and wrap them in braces.

              v = partial.length === 0 ? '{}' :
                  gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                      mind + '}' : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
      }
  }

  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

      // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
          (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.

      return str('', {'': value});
      };
    }

  function looseParse(data){
    try{
      return new Function('return ' + data + ';')();
    }catch(e){
      throw 'Json parse error!';
    }
  }
 /**
	* JSON \u683c\u5f0f\u5316
  * @class BUI.JSON
	* @singleton
  */
  var JSON = {
    /**
     * \u8f6c\u6210json \u7b49\u540c\u4e8e$.parseJSON
     * @method
     * @param {String} jsonstring \u5408\u6cd5\u7684json \u5b57\u7b26\u4e32
     */
    parse : $.parseJSON,
    /**
     * \u4e1a\u52a1\u4e2d\u6709\u4e9b\u5b57\u7b26\u4e32\u7ec4\u6210\u7684json\u6570\u636e\u4e0d\u662f\u4e25\u683c\u7684json\u6570\u636e\uff0c\u5982\u4f7f\u7528\u5355\u5f15\u53f7\uff0c\u6216\u8005\u5c5e\u6027\u540d\u4e0d\u662f\u5b57\u7b26\u4e32
     * \u5982 \uff1a {a:'abc'}
     * @method 
     * @param {String} jsonstring
     */
    looseParse : looseParse,
    /**
     * \u5c06Json\u8f6c\u6210\u5b57\u7b26\u4e32
     * @method 
     * @param {Object} json json \u5bf9\u8c61
     */
    stringify : JSON.stringify
  }

  return JSON;
});
define('bui/keycode',function () {
  
  /**
   * \u952e\u76d8\u6309\u952e\u5bf9\u5e94\u7684\u6570\u5b57\u503c
   * @class BUI.KeyCode
   * @singleton
   */
  var keyCode = {
    /** Key constant @type Number */
    BACKSPACE: 8,
    /** Key constant @type Number */
    TAB: 9,
    /** Key constant @type Number */
    NUM_CENTER: 12,
    /** Key constant @type Number */
    ENTER: 13,
    /** Key constant @type Number */
    RETURN: 13,
    /** Key constant @type Number */
    SHIFT: 16,
    /** Key constant @type Number */
    CTRL: 17,
    /** Key constant @type Number */
    ALT: 18,
    /** Key constant @type Number */
    PAUSE: 19,
    /** Key constant @type Number */
    CAPS_LOCK: 20,
    /** Key constant @type Number */
    ESC: 27,
    /** Key constant @type Number */
    SPACE: 32,
    /** Key constant @type Number */
    PAGE_UP: 33,
    /** Key constant @type Number */
    PAGE_DOWN: 34,
    /** Key constant @type Number */
    END: 35,
    /** Key constant @type Number */
    HOME: 36,
    /** Key constant @type Number */
    LEFT: 37,
    /** Key constant @type Number */
    UP: 38,
    /** Key constant @type Number */
    RIGHT: 39,
    /** Key constant @type Number */
    DOWN: 40,
    /** Key constant @type Number */
    PRINT_SCREEN: 44,
    /** Key constant @type Number */
    INSERT: 45,
    /** Key constant @type Number */
    DELETE: 46,
    /** Key constant @type Number */
    ZERO: 48,
    /** Key constant @type Number */
    ONE: 49,
    /** Key constant @type Number */
    TWO: 50,
    /** Key constant @type Number */
    THREE: 51,
    /** Key constant @type Number */
    FOUR: 52,
    /** Key constant @type Number */
    FIVE: 53,
    /** Key constant @type Number */
    SIX: 54,
    /** Key constant @type Number */
    SEVEN: 55,
    /** Key constant @type Number */
    EIGHT: 56,
    /** Key constant @type Number */
    NINE: 57,
    /** Key constant @type Number */
    A: 65,
    /** Key constant @type Number */
    B: 66,
    /** Key constant @type Number */
    C: 67,
    /** Key constant @type Number */
    D: 68,
    /** Key constant @type Number */
    E: 69,
    /** Key constant @type Number */
    F: 70,
    /** Key constant @type Number */
    G: 71,
    /** Key constant @type Number */
    H: 72,
    /** Key constant @type Number */
    I: 73,
    /** Key constant @type Number */
    J: 74,
    /** Key constant @type Number */
    K: 75,
    /** Key constant @type Number */
    L: 76,
    /** Key constant @type Number */
    M: 77,
    /** Key constant @type Number */
    N: 78,
    /** Key constant @type Number */
    O: 79,
    /** Key constant @type Number */
    P: 80,
    /** Key constant @type Number */
    Q: 81,
    /** Key constant @type Number */
    R: 82,
    /** Key constant @type Number */
    S: 83,
    /** Key constant @type Number */
    T: 84,
    /** Key constant @type Number */
    U: 85,
    /** Key constant @type Number */
    V: 86,
    /** Key constant @type Number */
    W: 87,
    /** Key constant @type Number */
    X: 88,
    /** Key constant @type Number */
    Y: 89,
    /** Key constant @type Number */
    Z: 90,
    /** Key constant @type Number */
    CONTEXT_MENU: 93,
    /** Key constant @type Number */
    NUM_ZERO: 96,
    /** Key constant @type Number */
    NUM_ONE: 97,
    /** Key constant @type Number */
    NUM_TWO: 98,
    /** Key constant @type Number */
    NUM_THREE: 99,
    /** Key constant @type Number */
    NUM_FOUR: 100,
    /** Key constant @type Number */
    NUM_FIVE: 101,
    /** Key constant @type Number */
    NUM_SIX: 102,
    /** Key constant @type Number */
    NUM_SEVEN: 103,
    /** Key constant @type Number */
    NUM_EIGHT: 104,
    /** Key constant @type Number */
    NUM_NINE: 105,
    /** Key constant @type Number */
    NUM_MULTIPLY: 106,
    /** Key constant @type Number */
    NUM_PLUS: 107,
    /** Key constant @type Number */
    NUM_MINUS: 109,
    /** Key constant @type Number */
    NUM_PERIOD: 110,
    /** Key constant @type Number */
    NUM_DIVISION: 111,
    /** Key constant @type Number */
    F1: 112,
    /** Key constant @type Number */
    F2: 113,
    /** Key constant @type Number */
    F3: 114,
    /** Key constant @type Number */
    F4: 115,
    /** Key constant @type Number */
    F5: 116,
    /** Key constant @type Number */
    F6: 117,
    /** Key constant @type Number */
    F7: 118,
    /** Key constant @type Number */
    F8: 119,
    /** Key constant @type Number */
    F9: 120,
    /** Key constant @type Number */
    F10: 121,
    /** Key constant @type Number */
    F11: 122,
    /** Key constant @type Number */
    F12: 123
  };

  return keyCode;
});
define('bui/date', function () {

    var dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;

    function dateParse(val, format) {
		if(val instanceof Date){
			return val;
		}
		if (typeof(format)=="undefined" || format==null || format=="") {
			var checkList=new Array('y-m-d','yyyy-mm-dd','yyyy-mm-dd HH:MM:ss','H:M:s');
			for (var i=0; i<checkList.length; i++) {
					var d=dateParse(val,checkList[i]);
					if (d!=null) { 
						return d; 
					}
			}
			return null;
		};
        val = val + "";
        var i_val = 0;
        var i_format = 0;
        var c = "";
        var token = "";
        var x, y;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = 00;
        var mm = 00;
        var ss = 00;
        this.isInteger = function(val) {
            return /^\d*$/.test(val);
		};
		this.getInt = function(str,i,minlength,maxlength) {
			for (var x=maxlength; x>=minlength; x--) {
				var token=str.substring(i,i+x);
				if (token.length < minlength) { 
					return null; 
				}
				if (this.isInteger(token)) { 
					return token; 
				}
			}
		return null;
		};

        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (token=="yyyy" || token=="yy" || token=="y") {
				if (token=="yyyy") { 
					x=4;y=4; 
				}
				if (token=="yy") { 
					x=2;y=2; 
				}
				if (token=="y") { 
					x=2;y=4; 
				}
				year=this.getInt(val,i_val,x,y);
				if (year==null) { 
					return null; 
				}
				i_val += year.length;
				if (year.length==2) {
                    year = year>70?1900+(year-0):2000+(year-0);
				}
			}
            else if (token=="mm"||token=="m") {
				month=this.getInt(val,i_val,token.length,2);
				if(month==null||(month<1)||(month>12)){
					return null;
				}
				i_val+=month.length;
			}
			else if (token=="dd"||token=="d") {
				date=this.getInt(val,i_val,token.length,2);
				if(date==null||(date<1)||(date>31)){
					return null;
				}
				i_val+=date.length;
			}
			else if (token=="hh"||token=="h") {
				hh=this.getInt(val,i_val,token.length,2);
				if(hh==null||(hh<1)||(hh>12)){
					return null;
				}
				i_val+=hh.length;
			}
			else if (token=="HH"||token=="H") {
				hh=this.getInt(val,i_val,token.length,2);
				if(hh==null||(hh<0)||(hh>23)){
					return null;
				}
				i_val+=hh.length;
			}
			else if (token=="MM"||token=="M") {
				mm=this.getInt(val,i_val,token.length,2);
				if(mm==null||(mm<0)||(mm>59)){
					return null;
				}
				i_val+=mm.length;
			}
			else if (token=="ss"||token=="s") {
				ss=this.getInt(val,i_val,token.length,2);
				if(ss==null||(ss<0)||(ss>59)){
					return null;
				}
				i_val+=ss.length;
			}
			else {
				if (val.substring(i_val,i_val+token.length)!=token) {
					return null;
				}
				else {
					i_val+=token.length;
				}
			}
		}
		if (i_val != val.length) { 
			return null; 
		}
		if (month==2) {
			if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
				if (date > 29){ 
					return null; 
				}
			}
			else { 
				if (date > 28) { 
					return null; 
				} 
			}
		}
		if ((month==4)||(month==6)||(month==9)||(month==11)) {
			if (date > 30) { 
				return null; 
			}
		}
		return new Date(year,month-1,date,hh,mm,ss);
    }

    function DateAdd(strInterval, NumDay, dtDate) {
        var dtTmp = new Date(dtDate);
        if (isNaN(dtTmp)) {
            dtTmp = new Date();
        }
        NumDay = parseInt(NumDay,10);
        switch (strInterval) {
            case   's':
                dtTmp = new Date(dtTmp.getTime() + (1000 * NumDay));
                break;
            case   'n':
                dtTmp = new Date(dtTmp.getTime() + (60000 * NumDay));
                break;
            case   'h':
                dtTmp = new Date(dtTmp.getTime() + (3600000 * NumDay));
                break;
            case   'd':
                dtTmp = new Date(dtTmp.getTime() + (86400000 * NumDay));
                break;
            case   'w':
                dtTmp = new Date(dtTmp.getTime() + ((86400000 * 7) * NumDay));
                break;
            case   'm':
                dtTmp = new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + NumDay, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                break;
            case   'y':
                //alert(dtTmp.getFullYear());
                dtTmp = new Date(dtTmp.getFullYear() + NumDay, dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                //alert(dtTmp);
                break;
        }
        return dtTmp;
    }

    var dateFormat = function () {
        var token = /w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = '0' + val;
                }
                return val;
            },
            // Some common format strings
            masks = {
                'default':'ddd mmm dd yyyy HH:MM:ss',
                shortDate:'m/d/yy',
                //mediumDate:     'mmm d, yyyy',
                longDate:'mmmm d, yyyy',
                fullDate:'dddd, mmmm d, yyyy',
                shortTime:'h:MM TT',
                //mediumTime:     'h:MM:ss TT',
                longTime:'h:MM:ss TT Z',
                isoDate:'yyyy-mm-dd',
                isoTime:'HH:MM:ss',
                isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",
                isoUTCDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",

                //added by jayli
                localShortDate:'yy\u5e74mm\u6708dd\u65e5',
                localShortDateTime:'yy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT',
                localLongDate:'yyyy\u5e74mm\u6708dd\u65e5',
                localLongDateTime:'yyyy\u5e74mm\u6708dd\u65e5 hh:MM:ss TT',
                localFullDate:'yyyy\u5e74mm\u6708dd\u65e5 w',
                localFullDateTime:'yyyy\u5e74mm\u6708dd\u65e5 w hh:MM:ss TT'

            },

            // Internationalization strings
            i18n = {
                dayNames:[
                    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
                    '\u661f\u671f\u65e5', '\u661f\u671f\u4e00', '\u661f\u671f\u4e8c', '\u661f\u671f\u4e09', '\u661f\u671f\u56db', '\u661f\u671f\u4e94', '\u661f\u671f\u516d'
                ],
                monthNames:[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ]
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                throw SyntaxError('invalid date');
            }

            mask = String(masks[mask] || mask || masks['default']);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) === 'UTC:') {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? 'getUTC' : 'get',
                d = date[_ + 'Date'](),
                D = date[_ + 'Day'](),
                m = date[_ + 'Month'](),
                y = date[_ + 'FullYear'](),
                H = date[_ + 'Hours'](),
                M = date[_ + 'Minutes'](),
                s = date[_ + 'Seconds'](),
                L = date[_ + 'Milliseconds'](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:d,
                    dd:pad(d, undefined),
                    ddd:i18n.dayNames[D],
                    dddd:i18n.dayNames[D + 7],
                    w:i18n.dayNames[D + 14],
                    m:m + 1,
                    mm:pad(m + 1, undefined),
                    mmm:i18n.monthNames[m],
                    mmmm:i18n.monthNames[m + 12],
                    yy:String(y).slice(2),
                    yyyy:y,
                    h:H % 12 || 12,
                    hh:pad(H % 12 || 12, undefined),
                    H:H,
                    HH:pad(H, undefined),
                    M:M,
                    MM:pad(M, undefined),
                    s:s,
                    ss:pad(s, undefined),
                    l:pad(L, 3),
                    L:pad(L > 99 ? Math.round(L / 10) : L, undefined),
                    t:H < 12 ? 'a' : 'p',
                    tt:H < 12 ? 'am' : 'pm',
                    T:H < 12 ? 'A' : 'P',
                    TT:H < 12 ? 'AM' : 'PM',
                    Z:utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                    o:(o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    /**
     * \u65e5\u671f\u7684\u5de5\u5177\u65b9\u6cd5
     * @class BUI.Date
     */
    var DateUtil = {
        /**
         * \u65e5\u671f\u52a0\u6cd5
         * @param {String} strInterval \u52a0\u6cd5\u7684\u7c7b\u578b\uff0cs(\u79d2),n(\u5206),h(\u65f6),d(\u5929),w(\u5468),m(\u6708),y(\u5e74)
         * @param {Number} Num         \u6570\u91cf\uff0c\u5982\u679c\u4e3a\u8d1f\u6570\uff0c\u5219\u4e3a\u51cf\u6cd5
         * @param {Date} dtDate      \u8d77\u59cb\u65e5\u671f\uff0c\u9ed8\u8ba4\u4e3a\u6b64\u65f6
         */
        add: function (strInterval, Num, dtDate) {
            return DateAdd(strInterval, Num, dtDate);
        },
        /**
         * \u5c0f\u65f6\u7684\u52a0\u6cd5
         * @param {Number} hours \u5c0f\u65f6
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addHour: function (hours, date) {
            return DateAdd('h', hours, date);
        },
        /**
         * \u5206\u7684\u52a0\u6cd5
         * @param {Number} minutes \u5206
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addMinute: function (minutes, date) {
            return DateAdd('n', minutes, date);
        },
        /**
         * \u79d2\u7684\u52a0\u6cd5
         * @param {Number} seconds \u79d2
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addSecond: function (seconds, date) {
            return DateAdd('s', seconds, date);
        },
        /**
         * \u5929\u7684\u52a0\u6cd5
         * @param {Number} days \u5929\u6570
         * @param {Date} date \u8d77\u59cb\u65e5\u671f
         */
        addDay: function (days, date) {
            return DateAdd('d', days, date);
        },
        /**
         * \u589e\u52a0\u5468
         * @param {Number} weeks \u5468\u6570
         * @param {Date} date  \u8d77\u59cb\u65e5\u671f
         */
        addWeek: function (weeks, date) {
            return DateAdd('w', weeks, date);
        },
        /**
         * \u589e\u52a0\u6708
         * @param {Number} months \u6708\u6570
         * @param {Date} date  \u8d77\u59cb\u65e5\u671f
         */
        addMonths: function (months, date) {
            return DateAdd('m', months, date);
        },
        /**
         * \u589e\u52a0\u5e74
         * @param {Number} years \u5e74\u6570
         * @param {Date} date  \u8d77\u59cb\u65e5\u671f
         */
        addYear: function (years, date) {
            return DateAdd('y', years, date);
        },
        /**
         * \u65e5\u671f\u662f\u5426\u76f8\u7b49\uff0c\u5ffd\u7565\u65f6\u95f4
         * @param  {Date}  d1 \u65e5\u671f\u5bf9\u8c61
         * @param  {Date}  d2 \u65e5\u671f\u5bf9\u8c61
         * @return {Boolean}    \u662f\u5426\u76f8\u7b49
         */
        isDateEquals: function (d1, d2) {

            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        },
        /**
         * \u65e5\u671f\u65f6\u95f4\u662f\u5426\u76f8\u7b49\uff0c\u5305\u542b\u65f6\u95f4
         * @param  {Date}  d1 \u65e5\u671f\u5bf9\u8c61
         * @param  {Date}  d2 \u65e5\u671f\u5bf9\u8c61
         * @return {Boolean}    \u662f\u5426\u76f8\u7b49
         */
        isEquals: function (d1, d2) {
            if (d1 == d2) {
                return true;
            }
            if (!d1 || !d2) {
                return false;
            }
            if (!d1.getTime || !d2.getTime) {
                return false;
            }
            return d1.getTime() == d2.getTime();
        },
        /**
         * \u5b57\u7b26\u4e32\u662f\u5426\u662f\u6709\u6548\u7684\u65e5\u671f\u7c7b\u578b
         * @param {String} str \u5b57\u7b26\u4e32
         * @return \u5b57\u7b26\u4e32\u662f\u5426\u80fd\u8f6c\u6362\u6210\u65e5\u671f
         */
        isDateString: function (str) {
            return dateRegex.test(str);
        },
        /**
         * \u5c06\u65e5\u671f\u683c\u5f0f\u5316\u6210\u5b57\u7b26\u4e32
         * @param  {Date} date \u65e5\u671f
         * @param  {String} mask \u683c\u5f0f\u5316\u65b9\u5f0f
         * @param  {Date} utc  \u662f\u5426utc\u65f6\u95f4
         * @return {String}      \u65e5\u671f\u7684\u5b57\u7b26\u4e32
         */
        format: function (date, mask, utc) {
            return dateFormat(date, mask, utc);
        },
        /**
         * \u8f6c\u6362\u6210\u65e5\u671f
         * @param  {String|Date} date \u5b57\u7b26\u4e32\u6216\u8005\u65e5\u671f
         * @param  {String} dateMask  \u65e5\u671f\u7684\u683c\u5f0f,\u5982:yyyy-MM-dd
         * @return {Date}      \u65e5\u671f\u5bf9\u8c61
         */
        parse: function (date, s) {
            return dateParse(date, s);
        },
        /**
         * \u5f53\u524d\u5929
         * @return {Date} \u5f53\u524d\u5929 00:00:00
         */
        today: function () {
            var now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        },
        /**
         * \u8fd4\u56de\u5f53\u524d\u65e5\u671f
         * @return {Date} \u65e5\u671f\u7684 00:00:00
         */
        getDate: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
    };

    return DateUtil;
});
define('bui/base',['bui/observable'],function(require){

  var INVALID = {},
    Observable = require('bui/observable');

  function ensureNonEmpty(obj, name, create) {
        var ret = obj[name] || {};
        if (create) {
            obj[name] = ret;
        }
        return ret;
  }

  function normalFn(host, method) {
      if (BUI.isString(method)) {
          return host[method];
      }
      return method;
  }

  function __fireAttrChange(self, when, name, prevVal, newVal) {
      var attrName = name;
      return self.fire(when + BUI.ucfirst(name) + 'Change', {
          attrName: attrName,
          prevVal: prevVal,
          newVal: newVal
      });
  }

  function setInternal(self, name, value, opts, attrs) {
      opts = opts || {};

      var ret,
          subVal,
          prevVal;

      prevVal = self.get(name);

      //\u5982\u679c\u672a\u6539\u53d8\u503c\u4e0d\u8fdb\u884c\u4fee\u6539
      if(!$.isPlainObject(value) && !BUI.isArray(value) && prevVal === value){
        return undefined;
      }
      // check before event
      if (!opts['silent']) {
          if (false === __fireAttrChange(self, 'before', name, prevVal, value)) {
              return false;
          }
      }
      // set it
      ret = self._set(name, value, opts);

      if (ret === false) {
          return ret;
      }

      // fire after event
      if (!opts['silent']) {
          value = self.__attrVals[name];
          __fireAttrChange(self, 'after', name, prevVal, value);
      }
      return self;
  }

  /**
   * \u57fa\u7840\u7c7b\uff0c\u6b64\u7c7b\u63d0\u4f9b\u4ee5\u4e0b\u529f\u80fd
   *  - \u63d0\u4f9b\u8bbe\u7f6e\u83b7\u53d6\u5c5e\u6027
   *  - \u63d0\u4f9b\u4e8b\u4ef6\u652f\u6301
   *  - \u5c5e\u6027\u53d8\u5316\u65f6\u4f1a\u89e6\u53d1\u5bf9\u5e94\u7684\u4e8b\u4ef6
   *  - \u5c06\u914d\u7f6e\u9879\u81ea\u52a8\u8f6c\u6362\u6210\u5c5e\u6027
   *
   * ** \u521b\u5efa\u7c7b\uff0c\u7ee7\u627fBUI.Base\u7c7b **
   * <pre><code>
   *   var Control = function(cfg){
   *     Control.superclass.constructor.call(this,cfg); //\u8c03\u7528BUI.Base\u7684\u6784\u9020\u65b9\u6cd5\uff0c\u5c06\u914d\u7f6e\u9879\u53d8\u6210\u5c5e\u6027
   *   };
   *
   *   BUI.extend(Control,BUI.Base);
   * </code></pre>
   *
   * ** \u58f0\u660e\u9ed8\u8ba4\u5c5e\u6027 ** 
   * <pre><code>
   *   Control.ATTRS = {
   *     id : {
   *       value : 'id' //value \u662f\u6b64\u5c5e\u6027\u7684\u9ed8\u8ba4\u503c
   *     },
   *     renderTo : {
   *      
   *     },
   *     el : {
   *       valueFn : function(){                 //\u7b2c\u4e00\u6b21\u8c03\u7528\u7684\u65f6\u5019\u5c06renderTo\u7684DOM\u8f6c\u6362\u6210el\u5c5e\u6027
   *         return $(this.get('renderTo'));
   *       }
   *     },
   *     text : {
   *       getter : function(){ //getter \u7528\u4e8e\u83b7\u53d6\u503c\uff0c\u800c\u4e0d\u662f\u8bbe\u7f6e\u7684\u503c
   *         return this.get('el').val();
   *       },
   *       setter : function(v){ //\u4e0d\u4ec5\u4ec5\u662f\u8bbe\u7f6e\u503c\uff0c\u53ef\u4ee5\u8fdb\u884c\u76f8\u5e94\u7684\u64cd\u4f5c
   *         this.get('el').val(v);
   *       }
   *     }
   *   };
   * </code></pre>
   *
   * ** \u58f0\u660e\u7c7b\u7684\u65b9\u6cd5 ** 
   * <pre><code>
   *   BUI.augment(Control,{
   *     getText : function(){
   *       return this.get('text');   //\u53ef\u4ee5\u7528get\u65b9\u6cd5\u83b7\u53d6\u5c5e\u6027\u503c
   *     },
   *     setText : function(txt){
   *       this.set('text',txt);      //\u4f7f\u7528set \u8bbe\u7f6e\u5c5e\u6027\u503c
   *     }
   *   });
   * </code></pre>
   *
   * ** \u521b\u5efa\u5bf9\u8c61 ** 
   * <pre><code>
   *   var c = new Control({
   *     id : 'oldId',
   *     text : '\u6d4b\u8bd5\u6587\u672c',
   *     renderTo : '#t1'
   *   });
   *
   *   var el = c.get(el); //$(#t1);
   *   el.val(); //text\u7684\u503c \uff1a '\u6d4b\u8bd5\u6587\u672c'
   *   c.set('text','\u4fee\u6539\u7684\u503c');
   *   el.val();  //'\u4fee\u6539\u7684\u503c'
   *
   *   c.set('id','newId') //\u4f1a\u89e6\u53d12\u4e2a\u4e8b\u4ef6\uff1a beforeIdChange,afterIdChange 2\u4e2a\u4e8b\u4ef6 ev.newVal \u548cev.prevVal\u6807\u793a\u65b0\u65e7\u503c
   * </code></pre>
   * @class BUI.Base
   * @abstract
   * @extends BUI.Observable
   * @param {Object} config \u914d\u7f6e\u9879
   */
  var Base = function(config){
    var _self = this,
            c = _self.constructor,
            constructors = [];
        this.__attrs = {};
        this.__attrVals = {};
        Observable.apply(this,arguments);
        // define
        while (c) {
            constructors.push(c);
            if(c.extensions){ //\u5ef6\u8fdf\u6267\u884cmixin
              BUI.mixin(c,c.extensions);
              delete c.extensions;
            }
            //_self.addAttrs(c['ATTRS']);
            c = c.superclass ? c.superclass.constructor : null;
        }
        //\u4ee5\u5f53\u524d\u5bf9\u8c61\u7684\u5c5e\u6027\u6700\u7ec8\u6dfb\u52a0\u5230\u5c5e\u6027\u4e2d\uff0c\u8986\u76d6\u4e4b\u524d\u7684\u5c5e\u6027
        for (var i = constructors.length - 1; i >= 0; i--) {
          _self.addAttrs(constructors[i]['ATTRS'],true);
        };
        _self._initAttrs(config);

  };

  Base.INVALID = INVALID;

  BUI.extend(Base,Observable);

  BUI.augment(Base,
  {
    /**
     * \u6dfb\u52a0\u5c5e\u6027\u5b9a\u4e49
     * @protected
     * @param {String} name       \u5c5e\u6027\u540d
     * @param {Object} attrConfig \u5c5e\u6027\u5b9a\u4e49
     * @param {Boolean} overrides \u662f\u5426\u8986\u76d6\u5b57\u6bb5
     */
    addAttr: function (name, attrConfig,overrides) {
            var _self = this,
                attrs = _self.__attrs,
                attr = attrs[name];
                //;//$.clone(attrConfig);
            /**/
            if(!attr){
              attr = attrs[name] = {};
            }
            for (var p in attrConfig) {
              if(attrConfig.hasOwnProperty(p)){
                if(p == 'value'){
                  if(BUI.isObject(attrConfig[p])){
                    attr[p] = attr[p] || {};
                    BUI.mix(/*true,*/attr[p], attrConfig[p]); 
                  }else if(BUI.isArray(attrConfig[p])){
                    attr[p] = attr[p] || [];
                    BUI.mix(/*true,*/attr[p], attrConfig[p]); 
                  }else{
                    attr[p] = attrConfig[p];
                  }
                }else{
                  attr[p] = attrConfig[p];
                }
              }

            };
            /*if (!attrs[name]) {
                attrs[name] = BUI.cloneObject(attrConfig);
            } else if(overrides){
                BUI.mix(true,attrs[name], attrConfig);
            }*/
            return _self;
    },
    /**
     * \u6dfb\u52a0\u5c5e\u6027\u5b9a\u4e49
     * @protected
     * @param {Object} attrConfigs  An object with attribute name/configuration pairs.
     * @param {Object} initialValues user defined initial values
     * @param {Boolean} overrides \u662f\u5426\u8986\u76d6\u5b57\u6bb5
     */
    addAttrs: function (attrConfigs, initialValues,overrides) {
        var _self = this;
        if(!attrConfigs)
        {
          return _self;
        }
        if(typeof(initialValues) === 'boolean'){
          overrides = initialValues;
          initialValues = null;
        }
        BUI.each(attrConfigs, function (attrConfig, name) {
            _self.addAttr(name, attrConfig,overrides);
        });
        if (initialValues) {
            _self.set(initialValues);
        }
        return _self;
    },
    /**
     * \u662f\u5426\u5305\u542b\u6b64\u5c5e\u6027
     * @protected
     * @param  {String}  name \u503c
     * @return {Boolean} \u662f\u5426\u5305\u542b
     */
    hasAttr : function(name){
      return name && this.__attrs.hasOwnProperty(name);
    },
    /**
     * \u83b7\u53d6\u9ed8\u8ba4\u7684\u5c5e\u6027\u503c
     * @protected
     * @return {Object} \u5c5e\u6027\u503c\u7684\u952e\u503c\u5bf9
     */
    getAttrs : function(){
       return this.__attrs;//ensureNonEmpty(this, '__attrs', true);
    },
    /**
     * \u83b7\u53d6\u5c5e\u6027\u540d/\u5c5e\u6027\u503c\u952e\u503c\u5bf9
     * @protected
     * @return {Object} \u5c5e\u6027\u5bf9\u8c61
     */
    getAttrVals: function(){
      return this.__attrVals; //ensureNonEmpty(this, '__attrVals', true);
    },
    /**
     * \u83b7\u53d6\u5c5e\u6027\u503c\uff0c\u6240\u6709\u7684\u914d\u7f6e\u9879\u548c\u5c5e\u6027\u90fd\u53ef\u4ee5\u901a\u8fc7get\u65b9\u6cd5\u83b7\u53d6
     * <pre><code>
     *  var control = new Control({
     *   text : 'control text'
     *  });
     *  control.get('text'); //control text
     *
     *  control.set('customValue','value'); //\u4e34\u65f6\u53d8\u91cf
     *  control.get('customValue'); //value
     * </code></pre>
     * ** \u5c5e\u6027\u503c/\u914d\u7f6e\u9879 **
     * <pre><code> 
     *   Control.ATTRS = { //\u58f0\u660e\u5c5e\u6027\u503c
     *     text : {
     *       valueFn : function(){},
     *       value : 'value',
     *       getter : function(v){} 
     *     }
     *   };
     *   var c = new Control({
     *     text : 'text value'
     *   });
     *   //get \u51fd\u6570\u53d6\u7684\u987a\u5e8f\u4e3a\uff1a\u662f\u5426\u6709\u4fee\u6539\u503c\uff08\u914d\u7f6e\u9879\u3001set)\u3001\u9ed8\u8ba4\u503c\uff08\u7b2c\u4e00\u6b21\u8c03\u7528\u6267\u884cvalueFn)\uff0c\u5982\u679c\u6709getter\uff0c\u5219\u5c06\u503c\u4f20\u5165getter\u8fd4\u56de
     *
     *   c.get('text') //text value
     *   c.set('text','new text');//\u4fee\u6539\u503c
     *   c.get('text');//new text
     * </code></pre>
     * @param  {String} name \u5c5e\u6027\u540d
     * @return {Object} \u5c5e\u6027\u503c
     */
    get : function(name){
      var _self = this,
                //declared = _self.hasAttr(name),
                attrVals = _self.__attrVals,
                attrConfig,
                getter, 
                ret;

            attrConfig = ensureNonEmpty(_self.__attrs, name);
            getter = attrConfig['getter'];

            // get user-set value or default value
            //user-set value takes privilege
            ret = name in attrVals ?
                attrVals[name] :
                _self._getDefAttrVal(name);

            // invoke getter for this attribute
            if (getter && (getter = normalFn(_self, getter))) {
                ret = getter.call(_self, ret, name);
            }

            return ret;
    },
  	/**
  	* @\u6e05\u7406\u6240\u6709\u5c5e\u6027\u503c
    * @protected 
  	*/
  	clearAttrVals : function(){
  		this.__attrVals = {};
  	},
    /**
     * \u79fb\u9664\u5c5e\u6027\u5b9a\u4e49
     * @protected
     */
    removeAttr: function (name) {
        var _self = this;

        if (_self.hasAttr(name)) {
            delete _self.__attrs[name];
            delete _self.__attrVals[name];
        }

        return _self;
    },
    /**
     * \u8bbe\u7f6e\u5c5e\u6027\u503c\uff0c\u4f1a\u89e6\u53d1before+Name+Change,\u548c after+Name+Change\u4e8b\u4ef6
     * <pre><code>
     *  control.on('beforeTextChange',function(ev){
     *    var newVal = ev.newVal,
     *      attrName = ev.attrName,
     *      preVal = ev.prevVal;
     *
     *    //TO DO
     *  });
     *  control.set('text','new text');  //\u6b64\u65f6\u89e6\u53d1 beforeTextChange,afterTextChange
     *  control.set('text','modify text',{silent : true}); //\u6b64\u65f6\u4e0d\u89e6\u53d1\u4e8b\u4ef6
     * </code></pre>
     * @param {String|Object} name  \u5c5e\u6027\u540d
     * @param {Object} value \u503c
     * @param {Object} opts \u914d\u7f6e\u9879
     * @param {Boolean} opts.silent  \u914d\u7f6e\u5c5e\u6027\u65f6\uff0c\u662f\u5426\u4e0d\u89e6\u53d1\u4e8b\u4ef6
     */
    set : function(name,value,opts){
      var _self = this;
            if ($.isPlainObject(name)) {
                opts = value;
                var all = Object(name),
                    attrs = [];
                   
                for (name in all) {
                    if (all.hasOwnProperty(name)) {
                        setInternal(_self, name, all[name], opts);
                    }
                }
                return _self;
            }
            return setInternal(_self, name, value, opts);
    },
    /**
     * \u8bbe\u7f6e\u5c5e\u6027\uff0c\u4e0d\u89e6\u53d1\u4e8b\u4ef6
     * <pre><code>
     *  control.setInternal('text','text');//\u6b64\u65f6\u4e0d\u89e6\u53d1\u4e8b\u4ef6
     * </code></pre>
     * @param  {String} name  \u5c5e\u6027\u540d
     * @param  {Object} value \u5c5e\u6027\u503c
     * @return {Boolean|undefined}   \u5982\u679c\u503c\u65e0\u6548\u5219\u8fd4\u56defalse,\u5426\u5219\u8fd4\u56deundefined
     */
    setInternal : function(name, value, opts){
        return this._set(name, value, opts);
    },
    //\u83b7\u53d6\u5c5e\u6027\u9ed8\u8ba4\u503c
    _getDefAttrVal : function(name){
      var _self = this,
        attrs = _self.__attrs,
              attrConfig = ensureNonEmpty(attrs, name),
              valFn = attrConfig.valueFn,
              val;

          if (valFn && (valFn = normalFn(_self, valFn))) {
              val = valFn.call(_self);
              if (val !== undefined) {
                  attrConfig.value = val;
              }
              delete attrConfig.valueFn;
              attrs[name] = attrConfig;
          }

          return attrConfig.value;
    },
    //\u4ec5\u4ec5\u8bbe\u7f6e\u5c5e\u6027\u503c
    _set : function(name, value, opts){
      var _self = this,
                setValue,
            // if host does not have meta info corresponding to (name,value)
            // then register on demand in order to collect all data meta info
            // \u4e00\u5b9a\u8981\u6ce8\u518c\u5c5e\u6027\u5143\u6570\u636e\uff0c\u5426\u5219\u5176\u4ed6\u6a21\u5757\u901a\u8fc7 _attrs \u4e0d\u80fd\u679a\u4e3e\u5230\u6240\u6709\u6709\u6548\u5c5e\u6027
            // \u56e0\u4e3a\u5c5e\u6027\u5728\u58f0\u660e\u6ce8\u518c\u524d\u53ef\u4ee5\u76f4\u63a5\u8bbe\u7f6e\u503c
                attrConfig = ensureNonEmpty(_self.__attrs, name, true),
                setter = attrConfig['setter'];

            // if setter has effect
            if (setter && (setter = normalFn(_self, setter))) {
                setValue = setter.call(_self, value, name);
            }

            if (setValue === INVALID) {
                return false;
            }

            if (setValue !== undefined) {
                value = setValue;
            }
            
            // finally set
            _self.__attrVals[name] = value;
    },
    //\u521d\u59cb\u5316\u5c5e\u6027
    _initAttrs : function(config){
      var _self = this;
      if (config) {
              for (var attr in config) {
                  if (config.hasOwnProperty(attr)) {
                      // \u7528\u6237\u8bbe\u7f6e\u4f1a\u8c03\u7528 setter/validator \u7684\uff0c\u4f46\u4e0d\u4f1a\u89e6\u53d1\u5c5e\u6027\u53d8\u5316\u4e8b\u4ef6
                      _self._set(attr, config[attr]);
                  }

              }
          }
    }
  });

  //BUI.Base = Base;
  return Base;
});
define('bui/component',['bui/component/manage','bui/component/uibase','bui/component/view','bui/component/controller'],function (require) {
  /**
   * @class BUI.Component
   * <p>
   * <img src="../assets/img/class-common.jpg"/>
   * </p>
   * \u63a7\u4ef6\u57fa\u7c7b\u7684\u547d\u540d\u7a7a\u95f4
   */
  var Component = {};

  BUI.mix(Component,{
    Manager : require('bui/component/manage'),
    UIBase : require('bui/component/uibase'),
    View : require('bui/component/view'),
    Controller : require('bui/component/controller')
  });

  function create(component, self) {
    var childConstructor, xclass;
    if (component && (xclass = component.xclass)) {
        if (self && !component.prefixCls) {
            component.prefixCls = self.get('prefixCls');
        }
        childConstructor = Component.Manager.getConstructorByXClass(xclass);
        if (!childConstructor) {
            BUI.error('can not find class by xclass desc : ' + xclass);
        }
        component = new childConstructor(component);
    }
    return component;
  }

  /**
   * \u6839\u636eXclass\u521b\u5efa\u5bf9\u8c61
   * @method
   * @static
   * @param  {Object} component \u63a7\u4ef6\u7684\u914d\u7f6e\u9879\u6216\u8005\u63a7\u4ef6
   * @param  {Object} self      \u7236\u7c7b\u5b9e\u4f8b
   * @return {Object} \u5b9e\u4f8b\u5bf9\u8c61
   */
  Component.create = create;

  return Component;
});
//\u63a7\u4ef6\u7c7b\u7684\u7ba1\u7406\u5668
define('bui/component/manage',function(require){

    var uis = {
        // \u4e0d\u5e26\u524d\u7f00 prefixCls
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
         * \u6bcf\u5b9e\u4f8b\u5316\u4e00\u4e2a\u63a7\u4ef6\uff0c\u5c31\u6ce8\u518c\u5230\u7ba1\u7406\u5668\u4e0a
         * @param {String} id  \u63a7\u4ef6 id
         * @param {BUI.Component.Controller} component \u63a7\u4ef6\u5bf9\u8c61
         */
        addComponent:function (id, component) {
            componentInstances[id] = component;
        },
        /**
         * \u79fb\u9664\u6ce8\u518c\u7684\u63a7\u4ef6
         * @param  {String} id \u63a7\u4ef6 id
         */
        removeComponent:function (id) {
            delete componentInstances[id];
        },
        /**
         * \u904d\u5386\u6240\u6709\u7684\u63a7\u4ef6
         * @param  {Function} fn \u904d\u5386\u51fd\u6570
         */
        eachComponent : function(fn){
            BUI.each(componentInstances,fn);
        },
        /**
         * \u6839\u636eId\u83b7\u53d6\u63a7\u4ef6
         * @param  {String} id \u7f16\u53f7
         * @return {BUI.Component.UIBase}   \u7ee7\u627f UIBase\u7684\u7c7b\u5bf9\u8c61
         */
        getComponent:function (id) {
            return componentInstances[id];
        },

        getCssClassWithPrefix:getCssClassWithPrefix,
        /**
         * \u901a\u8fc7\u6784\u9020\u51fd\u6570\u83b7\u53d6xclass.
         * @param {Function} constructor \u63a7\u4ef6\u7684\u6784\u9020\u51fd\u6570.
         * @type {Function}
         * @return {String}
         * @method
         */
        getXClassByConstructor:getXClassByConstructor,
        /**
         * \u901a\u8fc7xclass\u83b7\u53d6\u63a7\u4ef6\u7684\u6784\u9020\u51fd\u6570
         * @param {String} classNames Class names separated by space.
         * @type {Function}
         * @return {Function}
         * @method
         */
        getConstructorByXClass:getConstructorByXClass,
        /**
         * \u5c06 xclass \u540c\u6784\u9020\u51fd\u6570\u76f8\u5173\u8054.
         * @type {Function}
         * @param {String} className \u63a7\u4ef6\u7684xclass\u540d\u79f0.
         * @param {Function} componentConstructor \u6784\u9020\u51fd\u6570
         * @method
         */
        setConstructorByXClass:setConstructorByXClass
    };

    return Manager;
});
;(function(){
var BASE = 'bui/component/uibase/';
define('bui/component/uibase',[BASE + 'base',BASE + 'align',BASE + 'autoshow',BASE + 'autohide',
    BASE + 'close',BASE + 'collapseable',BASE + 'drag',BASE + 'keynav',BASE + 'list',
    BASE + 'listitem',BASE + 'mask',BASE + 'position',BASE + 'selection',BASE + 'stdmod',
    BASE + 'decorate',BASE + 'tpl',BASE + 'childcfg',BASE + 'bindable',BASE + 'depends'],function(r){

  var UIBase = r(BASE + 'base');
    
  BUI.mix(UIBase,{
    Align : r(BASE + 'align'),
    AutoShow : r(BASE + 'autoshow'),
    AutoHide : r(BASE + 'autohide'),
    Close : r(BASE + 'close'),
    Collapseable : r(BASE + 'collapseable'),
    Drag : r(BASE + 'drag'),
    KeyNav : r(BASE + 'keynav'),
    List : r(BASE + 'list'),
    ListItem : r(BASE + 'listitem'),
    Mask : r(BASE + 'mask'),
    Position : r(BASE + 'position'),
    Selection : r(BASE + 'selection'),
    StdMod : r(BASE + 'stdmod'),
    Decorate : r(BASE + 'decorate'),
    Tpl : r(BASE + 'tpl'),
    ChildCfg : r(BASE + 'childcfg'),
    Bindable : r(BASE + 'bindable'),
    Depends : r(BASE + 'depends')
  });

  BUI.mix(UIBase,{
    CloseView : UIBase.Close.View,
    CollapseableView : UIBase.Collapseable.View,
    ChildList : UIBase.List.ChildList,
    /*DomList : UIBase.List.DomList,
    DomListView : UIBase.List.DomList.View,*/
    ListItemView : UIBase.ListItem.View,
    MaskView : UIBase.Mask.View,
    PositionView : UIBase.Position.View,
    StdModView : UIBase.StdMod.View,
    TplView : UIBase.Tpl.View
  });
  return UIBase;
});   
})();

define('bui/component/uibase/base',['bui/component/manage'],function(require){

  var Manager = require('bui/component/manage'),
   
    UI_SET = '_uiSet',
        ATTRS = 'ATTRS',
        ucfirst = BUI.ucfirst,
        noop = $.noop,
        Base = require('bui/base');
   /**
     * \u6a21\u62df\u591a\u7ee7\u627f
     * init attr using constructors ATTRS meta info
     * @ignore
     */
    function initHierarchy(host, config) {
        callMethodByHierarchy(host, 'initializer', 'constructor');
    }

    function callMethodByHierarchy(host, mainMethod, extMethod) {
        var c = host.constructor,
            extChains = [],
            ext,
            main,
            exts,
            t;

        // define
        while (c) {

            // \u6536\u96c6\u6269\u5c55\u7c7b
            t = [];
            if (exts = c.mixins) {
                for (var i = 0; i < exts.length; i++) {
                    ext = exts[i];
                    if (ext) {
                        if (extMethod != 'constructor') {
                            //\u53ea\u8c03\u7528\u771f\u6b63\u81ea\u5df1\u6784\u9020\u5668\u539f\u578b\u7684\u5b9a\u4e49\uff0c\u7ee7\u627f\u539f\u578b\u94fe\u4e0a\u7684\u4e0d\u8981\u7ba1
                            if (ext.prototype.hasOwnProperty(extMethod)) {
                                ext = ext.prototype[extMethod];
                            } else {
                                ext = null;
                            }
                        }
                        ext && t.push(ext);
                    }
                }
            }

            // \u6536\u96c6\u4e3b\u7c7b
            // \u53ea\u8c03\u7528\u771f\u6b63\u81ea\u5df1\u6784\u9020\u5668\u539f\u578b\u7684\u5b9a\u4e49\uff0c\u7ee7\u627f\u539f\u578b\u94fe\u4e0a\u7684\u4e0d\u8981\u7ba1 !important
            // \u6240\u4ee5\u4e0d\u7528\u81ea\u5df1\u5728 renderUI \u4e2d\u8c03\u7528 superclass.renderUI \u4e86\uff0cUIBase \u6784\u9020\u5668\u81ea\u52a8\u641c\u5bfb
            // \u4ee5\u53ca initializer \u7b49\u540c\u7406
            if (c.prototype.hasOwnProperty(mainMethod) && (main = c.prototype[mainMethod])) {
                t.push(main);
            }

            // \u539f\u5730 reverse
            if (t.length) {
                extChains.push.apply(extChains, t.reverse());
            }

            c = c.superclass && c.superclass.constructor;
        }

        // \u521d\u59cb\u5316\u51fd\u6570
        // \u987a\u5e8f\uff1a\u7236\u7c7b\u7684\u6240\u6709\u6269\u5c55\u7c7b\u51fd\u6570 -> \u7236\u7c7b\u5bf9\u5e94\u51fd\u6570 -> \u5b50\u7c7b\u7684\u6240\u6709\u6269\u5c55\u51fd\u6570 -> \u5b50\u7c7b\u5bf9\u5e94\u51fd\u6570
        for (i = extChains.length - 1; i >= 0; i--) {
            extChains[i] && extChains[i].call(host);
        }
    }

     /**
     * \u9500\u6bc1\u7ec4\u4ef6\u987a\u5e8f\uff1a \u5b50\u7c7b destructor -> \u5b50\u7c7b\u6269\u5c55 destructor -> \u7236\u7c7b destructor -> \u7236\u7c7b\u6269\u5c55 destructor
     * @ignore
     */
    function destroyHierarchy(host) {
        var c = host.constructor,
            extensions,
            d,
            i;

        while (c) {
            // \u53ea\u89e6\u53d1\u8be5\u7c7b\u771f\u6b63\u7684\u6790\u6784\u5668\uff0c\u548c\u7236\u4eb2\u6ca1\u5173\u7cfb\uff0c\u6240\u4ee5\u4e0d\u8981\u5728\u5b50\u7c7b\u6790\u6784\u5668\u4e2d\u8c03\u7528 superclass
            if (c.prototype.hasOwnProperty('destructor')) {
                c.prototype.destructor.apply(host);
            }

            if ((extensions = c.mixins)) {
                for (i = extensions.length - 1; i >= 0; i--) {
                    d = extensions[i] && extensions[i].prototype.__destructor;
                    d && d.apply(host);
                }
            }

            c = c.superclass && c.superclass.constructor;
        }
    }

    /**
     * \u6784\u5efa \u63d2\u4ef6
     * @ignore
     */
    function constructPlugins(plugins) {
        if(!plugins){
        return;
        }
        BUI.each(plugins, function (plugin,i) {
            if (BUI.isFunction(plugin)) {
                plugins[i] = new plugin();
            }
        });
    }

    /**
     * \u8c03\u7528\u63d2\u4ef6\u7684\u65b9\u6cd5
     * @ignore
     */
    function actionPlugins(self, plugins, action) {
        if(!plugins){
        return;
        }
        BUI.each(plugins, function (plugin,i) {
            if (plugin[action]) {
                plugin[action](self);
            }
        });
    }

     /**
     * \u6839\u636e\u5c5e\u6027\u53d8\u5316\u8bbe\u7f6e UI
     * @ignore
     */
    function bindUI(self) {
        var attrs = self.getAttrs(),
            attr,
            m;

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                m = UI_SET + ucfirst(attr);
                if (self[m]) {
                    // \u81ea\u52a8\u7ed1\u5b9a\u4e8b\u4ef6\u5230\u5bf9\u5e94\u51fd\u6570
                    (function (attr, m) {
                        self.on('after' + ucfirst(attr) + 'Change', function (ev) {
                            // fix! \u9632\u6b62\u5192\u6ce1\u8fc7\u6765\u7684
                            if (ev.target === self) {
                                self[m](ev.newVal, ev);
                            }
                        });
                    })(attr, m);
                }
            }
        }
    }

        /**
     * \u6839\u636e\u5f53\u524d\uff08\u521d\u59cb\u5316\uff09\u72b6\u6001\u6765\u8bbe\u7f6e UI
     * @ignore
     */
    function syncUI(self) {
        var v,
            f,
            attrs = self.getAttrs();
        for (var a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                var m = UI_SET + ucfirst(a);
                //\u5b58\u5728\u65b9\u6cd5\uff0c\u5e76\u4e14\u7528\u6237\u8bbe\u7f6e\u4e86\u521d\u59cb\u503c\u6216\u8005\u5b58\u5728\u9ed8\u8ba4\u503c\uff0c\u5c31\u540c\u6b65\u72b6\u6001
                if ((f = self[m])
                    // \u7528\u6237\u5982\u679c\u8bbe\u7f6e\u4e86\u663e\u5f0f\u4e0d\u540c\u6b65\uff0c\u5c31\u4e0d\u540c\u6b65\uff0c\u6bd4\u5982\u4e00\u4e9b\u503c\u4ece html \u4e2d\u8bfb\u53d6\uff0c\u4e0d\u9700\u8981\u540c\u6b65\u518d\u6b21\u8bbe\u7f6e
                    && attrs[a].sync !== false
                    && (v = self.get(a)) !== undefined) {
                    f.call(self, v);
                }
            }
        }
    }

  /**
   * \u63a7\u4ef6\u5e93\u7684\u57fa\u7c7b\uff0c\u5305\u62ec\u63a7\u4ef6\u7684\u751f\u547d\u5468\u671f,\u4e0b\u9762\u662f\u57fa\u672c\u7684\u6269\u5c55\u7c7b
   * <p>
   * <img src="https://dxq613.github.io/assets/img/class-mixins.jpg"/>
   * </p>
   * @class BUI.Component.UIBase
   * @extends BUI.Base
   * @param  {Object} config \u914d\u7f6e\u9879
   */
  var UIBase = function(config){

     var _self = this, 
      id;

        // \u8bfb\u53d6\u7528\u6237\u8bbe\u7f6e\u7684\u5c5e\u6027\u503c\u5e76\u8bbe\u7f6e\u5230\u81ea\u8eab
        Base.apply(_self, arguments);

        //\u4fdd\u5b58\u7528\u6237\u4f20\u5165\u7684\u914d\u7f6e\u9879
        _self.setInternal('userConfig',config);
        // \u6309\u7167\u7c7b\u5c42\u6b21\u6267\u884c\u521d\u59cb\u51fd\u6570\uff0c\u4e3b\u7c7b\u6267\u884c initializer \u51fd\u6570\uff0c\u6269\u5c55\u7c7b\u6267\u884c\u6784\u9020\u5668\u51fd\u6570
        initHierarchy(_self, config);

        var listener,
            n,
            plugins = _self.get('plugins'),
            listeners = _self.get('listeners');

        constructPlugins(plugins);
    
        var xclass= _self.get('xclass');
        if(xclass){
          _self.__xclass = xclass;//debug \u65b9\u4fbf
        }
        actionPlugins(_self, plugins, 'initializer');

        // \u662f\u5426\u81ea\u52a8\u6e32\u67d3
        config && config.autoRender && _self.render();

  };

  UIBase.ATTRS = 
  {
    
    
    /**
     * \u7528\u6237\u4f20\u5165\u7684\u914d\u7f6e\u9879
     * @type {Object}
     * @readOnly
     * @protected
     */
    userConfig : {

    },
    /**
     * \u662f\u5426\u81ea\u52a8\u6e32\u67d3,\u5982\u679c\u4e0d\u81ea\u52a8\u6e32\u67d3\uff0c\u9700\u8981\u7528\u6237\u8c03\u7528 render()\u65b9\u6cd5
     * <pre><code>
     *  //\u9ed8\u8ba4\u72b6\u6001\u4e0b\u521b\u5efa\u5bf9\u8c61\uff0c\u5e76\u6ca1\u6709\u8fdb\u884crender
     *  var control = new Control();
     *  control.render(); //\u9700\u8981\u8c03\u7528render\u65b9\u6cd5
     *
     *  //\u8bbe\u7f6eautoRender\u540e\uff0c\u4e0d\u9700\u8981\u8c03\u7528render\u65b9\u6cd5
     *  var control = new Control({
     *   autoRender : true
     *  });
     * </code></pre>
     * @cfg {Boolean} autoRender
     */
    /**
     * \u662f\u5426\u81ea\u52a8\u6e32\u67d3,\u5982\u679c\u4e0d\u81ea\u52a8\u6e32\u67d3\uff0c\u9700\u8981\u7528\u6237\u8c03\u7528 render()\u65b9\u6cd5
     * @type {Boolean}
     * @ignore
     */
    autoRender : {
      value : false
    },
    /**
     * @type {Object}
     * \u4e8b\u4ef6\u5904\u7406\u51fd\u6570:
     *      {
     *        'click':function(e){}
     *      }
     *  @ignore
     */
    listeners: {
        value: {}
    },
    /**
     * \u63d2\u4ef6\u96c6\u5408
     * <pre><code>
     *  var grid = new Grid({
     *    columns : [{},{}],
     *    plugins : [Grid.Plugins.RadioSelection]
     *  });
     * </code></pre>
     * @cfg {Array} plugins
     */
    /**
     * \u63d2\u4ef6\u96c6\u5408
     * @type {Array}
     * @readOnly
     */
    plugins : {
      value : []
    },
    /**
     * \u662f\u5426\u5df2\u7ecf\u6e32\u67d3\u5b8c\u6210
     * @type {Boolean}
     * @default  false
     * @readOnly
     */
    rendered : {
        value : false
    },
    /**
    * \u83b7\u53d6\u63a7\u4ef6\u7684 xclass
    * @readOnly
    * @type {String}
    * @protected
    */
    xclass: {
        valueFn: function () {
            return Manager.getXClassByConstructor(this.constructor);
        }
    }
  };
  
  BUI.extend(UIBase,Base);

  BUI.augment(UIBase,
  {
    /**
     * \u521b\u5efaDOM\u7ed3\u6784
     * @protected
     */
    create : function(){
      var self = this;
            // \u662f\u5426\u751f\u6210\u8fc7\u8282\u70b9
            if (!self.get('created')) {
                /**
                 * @event beforeCreateDom
                 * fired before root node is created
                 * @param e
                 */
                self.fire('beforeCreateDom');
                callMethodByHierarchy(self, 'createDom', '__createDom');
                self._set('created', true);
                /**
                 * @event afterCreateDom
                 * fired when root node is created
                 * @param e
                 */
                self.fire('afterCreateDom');
                actionPlugins(self, self.get('plugins'), 'createDom');
            }
            return self;
    },
    /**
     * \u6e32\u67d3
     */
    render : function(){
      var _self = this;
            // \u662f\u5426\u5df2\u7ecf\u6e32\u67d3\u8fc7
            if (!_self.get('rendered')) {
                var plugins = _self.get('plugins');
                _self.create(undefined);

                /**
                 * @event beforeRenderUI
                 * fired when root node is ready
                 * @param e
                 */
                _self.fire('beforeRenderUI');
                callMethodByHierarchy(_self, 'renderUI', '__renderUI');

                /**
                 * @event afterRenderUI
                 * fired after root node is rendered into dom
                 * @param e
                 */

                _self.fire('afterRenderUI');
                actionPlugins(_self, plugins, 'renderUI');

                /**
                 * @event beforeBindUI
                 * fired before UIBase 's internal event is bind.
                 * @param e
                 */

                _self.fire('beforeBindUI');
                bindUI(_self);
                callMethodByHierarchy(_self, 'bindUI', '__bindUI');

                /**
                 * @event afterBindUI
                 * fired when UIBase 's internal event is bind.
                 * @param e
                 */

                _self.fire('afterBindUI');
                actionPlugins(_self, plugins, 'bindUI');

                /**
                 * @event beforeSyncUI
                 * fired before UIBase 's internal state is synchronized.
                 * @param e
                 */

                _self.fire('beforeSyncUI');

                syncUI(_self);
                callMethodByHierarchy(_self, 'syncUI', '__syncUI');

                /**
                 * @event afterSyncUI
                 * fired after UIBase 's internal state is synchronized.
                 * @param e
                 */

                _self.fire('afterSyncUI');
                actionPlugins(_self, plugins, 'syncUI');
                _self._set('rendered', true);
            }
            return _self;
    },
    /**
     * \u5b50\u7c7b\u53ef\u7ee7\u627f\u6b64\u65b9\u6cd5\uff0c\u5f53DOM\u521b\u5efa\u65f6\u8c03\u7528
     * @protected
     * @method
     */
    createDom : noop,
    /**
     * \u5b50\u7c7b\u53ef\u7ee7\u627f\u6b64\u65b9\u6cd5\uff0c\u6e32\u67d3UI\u65f6\u8c03\u7528
     * @protected
     *  @method
     */
    renderUI : noop,
    /**
     * \u5b50\u7c7b\u53ef\u7ee7\u627f\u6b64\u65b9\u6cd5,\u7ed1\u5b9a\u4e8b\u4ef6\u65f6\u8c03\u7528
     * @protected
     * @method
     */
    bindUI : noop,
    /**
     * \u540c\u6b65\u5c5e\u6027\u503c\u5230UI\u4e0a
     * @protected
     * @method
     */
    syncUI : noop,

    /**
     * \u6790\u6784\u51fd\u6570
     */
    destroy: function () {
        var _self = this;
        /**
         * @event beforeDestroy
         * fired before UIBase 's destroy.
         * @param e
         */
        _self.fire('beforeDestroy');

        actionPlugins(_self, _self.get('plugins'), 'destructor');
        destroyHierarchy(_self);
         /**
         * @event afterDestroy
         * fired before UIBase 's destroy.
         * @param e
         */
        _self.fire('afterDestroy');
        _self.off();
        _self.clearAttrVals();
        _self.destroyed = true;
        return _self;
    } 
  });
    
  //\u5ef6\u65f6\u5904\u7406\u6784\u9020\u51fd\u6570
  function initConstuctor(c){
    var constructors = [];
    while(c.base){
        constructors.push(c);
        c = c.base;
    }
    for(var i = constructors.length - 1; i >=0 ; i--){
        var C = constructors[i];
        //BUI.extend(C,C.base,C.px,C.sx);
        BUI.mix(C.prototype,C.px);
        BUI.mix(C,C.sx);
        C.base = null;
        C.px = null;
        C.sx = null;
    }
  }
  
  BUI.mix(UIBase,
    {
    /**
     * \u5b9a\u4e49\u4e00\u4e2a\u7c7b
     * @static
     * @param  {Function} base   \u57fa\u7c7b\u6784\u9020\u51fd\u6570
     * @param  {Array} extensions \u6269\u5c55
     * @param  {Object} px  \u539f\u578b\u94fe\u4e0a\u7684\u6269\u5c55
     * @param  {Object} sx  
     * @return {Function} \u7ee7\u627f\u4e0e\u57fa\u7c7b\u7684\u6784\u9020\u51fd\u6570
     */
    define : function(base, extensions, px, sx){
          if ($.isPlainObject(extensions)) {
              sx = px;
              px = extensions;
              extensions = [];
          }

          function C() {
            var c = this.constructor;
            if(c.base){
                initConstuctor(c);
            }
            UIBase.apply(this, arguments);
          }

          BUI.extend(C, base);  //\u65e0\u6cd5\u5ef6\u8fdf
          C.base = base;
          C.px = px;//\u5ef6\u8fdf\u590d\u5236\u539f\u578b\u94fe\u4e0a\u7684\u51fd\u6570
          C.sx = sx;//\u5ef6\u8fdf\u590d\u5236\u9759\u6001\u5c5e\u6027

          //BUI.mixin(C,extensions);
          if(extensions.length){ //\u5ef6\u8fdf\u6267\u884cmixin
            C.extensions = extensions;
          }
         
          return C;
    },
    /**
     * \u6269\u5c55\u4e00\u4e2a\u7c7b\uff0c\u57fa\u7c7b\u5c31\u662f\u7c7b\u672c\u8eab
     * @static
     * @param  {Array} extensions \u6269\u5c55
     * @param  {Object} px  \u539f\u578b\u94fe\u4e0a\u7684\u6269\u5c55
     * @param  {Object} sx  
     * @return {Function} \u7ee7\u627f\u4e0e\u57fa\u7c7b\u7684\u6784\u9020\u51fd\u6570
     */
    extend: function extend(extensions, px, sx) {
        var args = $.makeArray(arguments),
            ret,
            last = args[args.length - 1];
        args.unshift(this);
        if (last.xclass) {
            args.pop();
            args.push(last.xclass);
        }
        ret = UIBase.define.apply(UIBase, args);
        if (last.xclass) {
            var priority = last.priority || (this.priority ? (this.priority + 1) : 1);

            Manager.setConstructorByXClass(last.xclass, {
                constructor: ret,
                priority: priority
            });
            //\u65b9\u4fbf\u8c03\u8bd5
            ret.__xclass = last.xclass;
            ret.priority = priority;
            ret.toString = function(){
                return last.xclass;
            }
        }
        ret.extend = extend;
        return ret;
    }
  });

  return UIBase;
});

define('bui/component/uibase/align',['bui/ua'],function (require) {
    var UA = require('bui/ua'),
        CLS_ALIGN_PREFIX ='x-align-',
        win = window;

    // var ieMode = document.documentMode || UA.ie;

    /*
     inspired by closure library by Google
     see http://yiminghe.iteye.com/blog/1124720
     */

    /**
     * \u5f97\u5230\u4f1a\u5bfc\u81f4\u5143\u7d20\u663e\u793a\u4e0d\u5168\u7684\u7956\u5148\u5143\u7d20
     * @ignore
     */
    function getOffsetParent(element) {
        // ie \u8fd9\u4e2a\u4e5f\u4e0d\u662f\u5b8c\u5168\u53ef\u884c
        /**
         <div style="width: 50px;height: 100px;overflow: hidden">
         <div style="width: 50px;height: 100px;position: relative;" id="d6">
         \u5143\u7d20 6 \u9ad8 100px \u5bbd 50px<br/>
         </div>
         </div>
         @ignore
         **/
        // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
        //  In other browsers it only includes elements with position absolute, relative or
        // fixed, not elements with overflow set to auto or scroll.
        //        if (UA.ie && ieMode < 8) {
        //            return element.offsetParent;
        //        }
                // \u7edf\u4e00\u7684 offsetParent \u65b9\u6cd5
        var doc = element.ownerDocument,
            body = doc.body,
            parent,
            positionStyle = $(element).css('position'),
            skipStatic = positionStyle == 'fixed' || positionStyle == 'absolute';

        if (!skipStatic) {
            return element.nodeName.toLowerCase() == 'html' ? null : element.parentNode;
        }

        for (parent = element.parentNode; parent && parent != body; parent = parent.parentNode) {
            positionStyle = $(parent).css('position');
            if (positionStyle != 'static') {
                return parent;
            }
        }
        return null;
    }

    /**
     * \u83b7\u5f97\u5143\u7d20\u7684\u663e\u793a\u90e8\u5206\u7684\u533a\u57df
     * @private
     * @ignore
     */
    function getVisibleRectForElement(element) {
        var visibleRect = {
                left:0,
                right:Infinity,
                top:0,
                bottom:Infinity
            },
            el,
            scrollX,
            scrollY,
            winSize,
            doc = element.ownerDocument,
            body = doc.body,
            documentElement = doc.documentElement;

        // Determine the size of the visible rect by climbing the dom accounting for
        // all scrollable containers.
        for (el = element; el = getOffsetParent(el);) {
            // clientWidth is zero for inline block elements in ie.
            if ((!UA.ie || el.clientWidth != 0) &&
                // body may have overflow set on it, yet we still get the entire
                // viewport. In some browsers, el.offsetParent may be
                // document.documentElement, so check for that too.
                (el != body && el != documentElement && $(el).css('overflow') != 'visible')) {
                var pos = $(el).offset();
                // add border
                pos.left += el.clientLeft;
                pos.top += el.clientTop;

                visibleRect.top = Math.max(visibleRect.top, pos.top);
                visibleRect.right = Math.min(visibleRect.right,
                    // consider area without scrollBar
                    pos.left + el.clientWidth);
                visibleRect.bottom = Math.min(visibleRect.bottom,
                    pos.top + el.clientHeight);
                visibleRect.left = Math.max(visibleRect.left, pos.left);
            }
        }

        // Clip by window's viewport.
        scrollX = $(win).scrollLeft();
        scrollY = $(win).scrollTop();
        visibleRect.left = Math.max(visibleRect.left, scrollX);
        visibleRect.top = Math.max(visibleRect.top, scrollY);
        winSize = {
            width:BUI.viewportWidth(),
            height:BUI.viewportHeight()
        };
        visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
        visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
        return visibleRect.top >= 0 && visibleRect.left >= 0 &&
            visibleRect.bottom > visibleRect.top &&
            visibleRect.right > visibleRect.left ?
            visibleRect : null;
    }

    function getElFuturePos(elRegion, refNodeRegion, points, offset) {
        var xy,
            diff,
            p1,
            p2;

        xy = {
            left:elRegion.left,
            top:elRegion.top
        };

        p1 = getAlignOffset(refNodeRegion, points[0]);
        p2 = getAlignOffset(elRegion, points[1]);

        diff = [p2.left - p1.left, p2.top - p1.top];

        return {
            left:xy.left - diff[0] + (+offset[0]),
            top:xy.top - diff[1] + (+offset[1])
        };
    }

    function isFailX(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.left < visibleRect.left ||
            elFuturePos.left + elRegion.width > visibleRect.right;
    }

    function isFailY(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.top < visibleRect.top ||
            elFuturePos.top + elRegion.height > visibleRect.bottom;
    }

    function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
        var pos = BUI.cloneObject(elFuturePos),
            size = {
                width:elRegion.width,
                height:elRegion.height
            };

        if (overflow.adjustX && pos.left < visibleRect.left) {
            pos.left = visibleRect.left;
        }

        // Left edge inside and right edge outside viewport, try to resize it.
        if (overflow['resizeWidth'] &&
            pos.left >= visibleRect.left &&
            pos.left + size.width > visibleRect.right) {
            size.width -= (pos.left + size.width) - visibleRect.right;
        }

        // Right edge outside viewport, try to move it.
        if (overflow.adjustX && pos.left + size.width > visibleRect.right) {
            // \u4fdd\u8bc1\u5de6\u8fb9\u754c\u548c\u53ef\u89c6\u533a\u57df\u5de6\u8fb9\u754c\u5bf9\u9f50
            pos.left = Math.max(visibleRect.right - size.width, visibleRect.left);
        }

        // Top edge outside viewport, try to move it.
        if (overflow.adjustY && pos.top < visibleRect.top) {
            pos.top = visibleRect.top;
        }

        // Top edge inside and bottom edge outside viewport, try to resize it.
        if (overflow['resizeHeight'] &&
            pos.top >= visibleRect.top &&
            pos.top + size.height > visibleRect.bottom) {
            size.height -= (pos.top + size.height) - visibleRect.bottom;
        }

        // Bottom edge outside viewport, try to move it.
        if (overflow.adjustY && pos.top + size.height > visibleRect.bottom) {
            // \u4fdd\u8bc1\u4e0a\u8fb9\u754c\u548c\u53ef\u89c6\u533a\u57df\u4e0a\u8fb9\u754c\u5bf9\u9f50
            pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top);
        }

        return BUI.mix(pos, size);
    }


    function flip(points, reg, map) {
        var ret = [];
        $.each(points, function (index,p) {
            ret.push(p.replace(reg, function (m) {
                return map[m];
            }));
        });
        return ret;
    }

    function flipOffset(offset, index) {
        offset[index] = -offset[index];
        return offset;
    }


    /**
     * @class BUI.Component.UIBase.Align
     * Align extension class.
     * Align component with specified element.
     * <img src="http://images.cnitblog.com/blog/111279/201304/09180221-201343d4265c46e7987e6b1c46d5461a.jpg"/>
     */
    function Align() {
    }


    Align.__getOffsetParent = getOffsetParent;

    Align.__getVisibleRectForElement = getVisibleRectForElement;

    Align.ATTRS =
    {
        /**
         * \u5bf9\u9f50\u914d\u7f6e\uff0c\u8be6\u7ec6\u8bf4\u660e\u8bf7\u53c2\u770b\uff1a <a href="http://www.cnblogs.com/zaohe/archive/2013/04/09/3010651.html">JS\u63a7\u4ef6 \u5bf9\u9f50</a>
         * @cfg {Object} align
         * <pre><code>
         *  var overlay = new Overlay( {  
         *       align :{
         *         node: null,         // \u53c2\u8003\u5143\u7d20, falsy \u6216 window \u4e3a\u53ef\u89c6\u533a\u57df, 'trigger' \u4e3a\u89e6\u53d1\u5143\u7d20, \u5176\u4ed6\u4e3a\u6307\u5b9a\u5143\u7d20
         *         points: ['cc','cc'], // ['tr', 'tl'] \u8868\u793a overlay \u7684 tl \u4e0e\u53c2\u8003\u8282\u70b9\u7684 tr \u5bf9\u9f50
         *         offset: [0, 0]      // \u6709\u6548\u503c\u4e3a [n, m]
         *       }
         *     }); 
         * </code></pre>
         */

        /**
         * \u8bbe\u7f6e\u5bf9\u9f50\u5c5e\u6027
         * @type {Object}
         * @field
         * <code>
         *   var align =  {
         *        node: null,         // \u53c2\u8003\u5143\u7d20, falsy \u6216 window \u4e3a\u53ef\u89c6\u533a\u57df, 'trigger' \u4e3a\u89e6\u53d1\u5143\u7d20, \u5176\u4ed6\u4e3a\u6307\u5b9a\u5143\u7d20
         *        points: ['cc','cc'], // ['tr', 'tl'] \u8868\u793a overlay \u7684 tl \u4e0e\u53c2\u8003\u8282\u70b9\u7684 tr \u5bf9\u9f50
         *        offset: [0, 0]      // \u6709\u6548\u503c\u4e3a [n, m]
         *     };
         *   overlay.set('align',align);
         * </code>
         */
        align:{
            value:{}
        }
    };

    function getRegion(node) {
        var offset, w, h;
        if (node.length && !$.isWindow(node[0])) {
            offset = node.offset();
            w = node.outerWidth();
            h = node.outerHeight();
        } else {
            offset = { left:BUI.scrollLeft(), top:BUI.scrollTop() };
            w = BUI.viewportWidth();
            h = BUI.viewportHeight();
        }
        offset.width = w;
        offset.height = h;
        return offset;
    }

    /**
     * \u83b7\u53d6 node \u4e0a\u7684 align \u5bf9\u9f50\u70b9 \u76f8\u5bf9\u4e8e\u9875\u9762\u7684\u5750\u6807
     * @param region
     * @param align
     */
    function getAlignOffset(region, align) {
        var V = align.charAt(0),
            H = align.charAt(1),
            w = region.width,
            h = region.height,
            x, y;

        x = region.left;
        y = region.top;

        if (V === 'c') {
            y += h / 2;
        } else if (V === 'b') {
            y += h;
        }

        if (H === 'c') {
            x += w / 2;
        } else if (H === 'r') {
            x += w;
        }

        return { left:x, top:y };
    }

    //\u6e05\u9664\u5bf9\u9f50\u7684css\u6837\u5f0f
    function clearAlignCls(el){
        var cls = el.attr('class'),
            regex = new RegExp('\s?'+CLS_ALIGN_PREFIX+'[a-z]{2}-[a-z]{2}','ig'),
            arr = regex.exec(cls);
        if(arr){
            el.removeClass(arr.join(' '));
        }
    }

    Align.prototype =
    {
        _uiSetAlign:function (v,ev) {
            var alignCls = '',
                el,   
                selfAlign; //points \u7684\u7b2c\u4e8c\u4e2a\u53c2\u6570\uff0c\u662f\u81ea\u5df1\u5bf9\u9f50\u4e8e\u5176\u4ed6\u8282\u70b9\u7684\u7684\u65b9\u5f0f
            if (v && v.points) {
                this.align(v.node, v.points, v.offset, v.overflow);
                this.set('cachePosition',null);
                el = this.get('el');
                clearAlignCls(el);
                selfAlign = v.points.join('-');
                alignCls = CLS_ALIGN_PREFIX + selfAlign;
                el.addClass(alignCls);
                /**/
            }
        },

        /*
         \u5bf9\u9f50 Overlay \u5230 node \u7684 points \u70b9, \u504f\u79fb offset \u5904
         @method
         @ignore
         @param {Element} node \u53c2\u7167\u5143\u7d20, \u53ef\u53d6\u914d\u7f6e\u9009\u9879\u4e2d\u7684\u8bbe\u7f6e, \u4e5f\u53ef\u662f\u4e00\u5143\u7d20
         @param {String[]} points \u5bf9\u9f50\u65b9\u5f0f
         @param {Number[]} [offset] \u504f\u79fb
         */
        align:function (refNode, points, offset, overflow) {
            refNode = $(refNode || win);
            offset = offset && [].concat(offset) || [0, 0];
            overflow = overflow || {};

            var self = this,
                el = self.get('el'),
                fail = 0,
            // \u5f53\u524d\u8282\u70b9\u53ef\u4ee5\u88ab\u653e\u7f6e\u7684\u663e\u793a\u533a\u57df
                visibleRect = getVisibleRectForElement(el[0]),
            // \u5f53\u524d\u8282\u70b9\u6240\u5360\u7684\u533a\u57df, left/top/width/height
                elRegion = getRegion(el),
            // \u53c2\u7167\u8282\u70b9\u6240\u5360\u7684\u533a\u57df, left/top/width/height
                refNodeRegion = getRegion(refNode),
            // \u5f53\u524d\u8282\u70b9\u5c06\u8981\u88ab\u653e\u7f6e\u7684\u4f4d\u7f6e
                elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset),
            // \u5f53\u524d\u8282\u70b9\u5c06\u8981\u6240\u5904\u7684\u533a\u57df
                newElRegion = BUI.merge(elRegion, elFuturePos);

            // \u5982\u679c\u53ef\u89c6\u533a\u57df\u4e0d\u80fd\u5b8c\u5168\u653e\u7f6e\u5f53\u524d\u8282\u70b9\u65f6\u5141\u8bb8\u8c03\u6574
            if (visibleRect && (overflow.adjustX || overflow.adjustY)) {

                // \u5982\u679c\u6a2a\u5411\u4e0d\u80fd\u653e\u4e0b
                if (isFailX(elFuturePos, elRegion, visibleRect)) {
                    fail = 1;
                    // \u5bf9\u9f50\u4f4d\u7f6e\u53cd\u4e0b
                    points = flip(points, /[lr]/ig, {
                        l:'r',
                        r:'l'
                    });
                    // \u504f\u79fb\u91cf\u4e5f\u53cd\u4e0b
                    offset = flipOffset(offset, 0);
                }

                // \u5982\u679c\u7eb5\u5411\u4e0d\u80fd\u653e\u4e0b
                if (isFailY(elFuturePos, elRegion, visibleRect)) {
                    fail = 1;
                    // \u5bf9\u9f50\u4f4d\u7f6e\u53cd\u4e0b
                    points = flip(points, /[tb]/ig, {
                        t:'b',
                        b:'t'
                    });
                    // \u504f\u79fb\u91cf\u4e5f\u53cd\u4e0b
                    offset = flipOffset(offset, 1);
                }

                // \u5982\u679c\u5931\u8d25\uff0c\u91cd\u65b0\u8ba1\u7b97\u5f53\u524d\u8282\u70b9\u5c06\u8981\u88ab\u653e\u7f6e\u7684\u4f4d\u7f6e
                if (fail) {
                    elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset);
                    BUI.mix(newElRegion, elFuturePos);
                }

                var newOverflowCfg = {};

                // \u68c0\u67e5\u53cd\u4e0b\u540e\u7684\u4f4d\u7f6e\u662f\u5426\u53ef\u4ee5\u653e\u4e0b\u4e86
                // \u5982\u679c\u4ecd\u7136\u653e\u4e0d\u4e0b\u53ea\u6709\u6307\u5b9a\u4e86\u53ef\u4ee5\u8c03\u6574\u5f53\u524d\u65b9\u5411\u624d\u8c03\u6574
                newOverflowCfg.adjustX = overflow.adjustX &&
                    isFailX(elFuturePos, elRegion, visibleRect);

                newOverflowCfg.adjustY = overflow.adjustY &&
                    isFailY(elFuturePos, elRegion, visibleRect);

                // \u786e\u5b9e\u8981\u8c03\u6574\uff0c\u751a\u81f3\u53ef\u80fd\u4f1a\u8c03\u6574\u9ad8\u5ea6\u5bbd\u5ea6
                if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
                    newElRegion = adjustForViewport(elFuturePos, elRegion,
                        visibleRect, newOverflowCfg);
                }
            }

            // \u65b0\u533a\u57df\u4f4d\u7f6e\u53d1\u751f\u4e86\u53d8\u5316
            if (newElRegion.left != elRegion.left) {
                self.setInternal('x', null);
                self.get('view').setInternal('x', null);
                self.set('x', newElRegion.left);
            }

            if (newElRegion.top != elRegion.top) {
                // https://github.com/kissyteam/kissy/issues/190
                // \u76f8\u5bf9\u4e8e\u5c4f\u5e55\u4f4d\u7f6e\u6ca1\u53d8\uff0c\u800c left/top \u53d8\u4e86
                // \u4f8b\u5982 <div 'relative'><el absolute></div>
                // el.align(div)
                self.setInternal('y', null);
                self.get('view').setInternal('y', null);
                self.set('y', newElRegion.top);
            }

            // \u65b0\u533a\u57df\u9ad8\u5bbd\u53d1\u751f\u4e86\u53d8\u5316
            if (newElRegion.width != elRegion.width) {
                el.width(el.width() + newElRegion.width - elRegion.width);
            }
            if (newElRegion.height != elRegion.height) {
                el.height(el.height() + newElRegion.height - elRegion.height);
            }

            return self;
        },

        /**
         * \u5bf9\u9f50\u5230\u5143\u7d20\u7684\u4e2d\u95f4\uff0c\u67e5\u770b\u5c5e\u6027 {@link BUI.Component.UIBase.Align#property-align} .
         * <pre><code>
         *  control.center('#t1'); //\u63a7\u4ef6\u5904\u4e8e\u5bb9\u5668#t1\u7684\u4e2d\u95f4\u4f4d\u7f6e
         * </code></pre>
         * @param {undefined|String|HTMLElement|jQuery} node
         * 
         */
        center:function (node) {
            var self = this;
            self.set('align', {
                node:node,
                points:['cc', 'cc'],
                offset:[0, 0]
            });
            return self;
        }
    };
    
  return Align;
});
define('bui/component/uibase/autoshow',function () {

  /**
   * \u5904\u7406\u81ea\u52a8\u663e\u793a\u63a7\u4ef6\u7684\u6269\u5c55\uff0c\u4e00\u822c\u7528\u4e8e\u663e\u793amenu,picker,tip\u7b49
   * @class BUI.Component.UIBase.AutoShow
   */
  function autoShow() {
    
  }

  autoShow.ATTRS = {

    /**
     * \u89e6\u53d1\u663e\u793a\u63a7\u4ef6\u7684DOM\u9009\u62e9\u5668
     * <pre><code>
     *  var overlay = new Overlay({ //\u70b9\u51fb#t1\u65f6\u663e\u793a\uff0c\u70b9\u51fb#t1,overlay\u4e4b\u5916\u7684\u5143\u7d20\u9690\u85cf
     *    trigger : '#t1',
     *    autoHide : true,
     *    content : '\u60ac\u6d6e\u5185\u5bb9'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {HTMLElement|String|jQuery} trigger
     */
    /**
     * \u89e6\u53d1\u663e\u793a\u63a7\u4ef6\u7684DOM\u9009\u62e9\u5668
     * @type {HTMLElement|String|jQuery}
     */
    trigger : {

    },
    /**
     * \u662f\u5426\u4f7f\u7528\u4ee3\u7406\u7684\u65b9\u5f0f\u89e6\u53d1\u663e\u793a\u63a7\u4ef6,\u5982\u679ctigger\u4e0d\u662f\u5b57\u7b26\u4e32\uff0c\u6b64\u5c5e\u6027\u65e0\u6548
     * <pre><code>
     *  var overlay = new Overlay({ //\u70b9\u51fb.t1(\u65e0\u8bba\u521b\u5efa\u63a7\u4ef6\u65f6.t1\u662f\u5426\u5b58\u5728)\u65f6\u663e\u793a\uff0c\u70b9\u51fb.t1,overlay\u4e4b\u5916\u7684\u5143\u7d20\u9690\u85cf
     *    trigger : '.t1',
     *    autoHide : true,
     *    delegateTigger : true, //\u4f7f\u7528\u59d4\u6258\u7684\u65b9\u5f0f\u89e6\u53d1\u663e\u793a\u63a7\u4ef6
     *    content : '\u60ac\u6d6e\u5185\u5bb9'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Boolean} [delegateTigger = false]
     */
    /**
     * \u662f\u5426\u4f7f\u7528\u4ee3\u7406\u7684\u65b9\u5f0f\u89e6\u53d1\u663e\u793a\u63a7\u4ef6,\u5982\u679ctigger\u4e0d\u662f\u5b57\u7b26\u4e32\uff0c\u6b64\u5c5e\u6027\u65e0\u6548
     * @type {Boolean}
     * @ignore
     */
    delegateTigger : {
      value : false
    },
    /**
     * \u9009\u62e9\u5668\u662f\u5426\u59cb\u7ec8\u8ddf\u968f\u89e6\u53d1\u5668\u5bf9\u9f50
     * @cfg {Boolean} autoAlign
     * @ignore
     */
    /**
     * \u9009\u62e9\u5668\u662f\u5426\u59cb\u7ec8\u8ddf\u968f\u89e6\u53d1\u5668\u5bf9\u9f50
     * @type {Boolean}
     * @protected
     */
    autoAlign :{
      value : true
    },
    /**
     * \u663e\u793a\u65f6\u662f\u5426\u9ed8\u8ba4\u83b7\u53d6\u7126\u70b9
     * @type {Boolean}
     */
    autoFocused : {
      value : true
    },
    /**
     * \u63a7\u4ef6\u663e\u793a\u65f6\u7531\u6b64trigger\u89e6\u53d1\uff0c\u5f53\u914d\u7f6e\u9879 trigger \u9009\u62e9\u5668\u4ee3\u8868\u591a\u4e2aDOM \u5bf9\u8c61\u65f6\uff0c
     * \u63a7\u4ef6\u53ef\u7531\u591a\u4e2aDOM\u5bf9\u8c61\u89e6\u53d1\u663e\u793a\u3002
     * <pre><code>
     *  overlay.on('show',function(){
     *    var curTrigger = overlay.get('curTrigger');
     *    //TO DO
     *  });
     * </code></pre>
     * @type {jQuery}
     * @readOnly
     */
    curTrigger : {

    },
    /**
     * \u89e6\u53d1\u663e\u793a\u65f6\u7684\u56de\u8c03\u51fd\u6570
     * @cfg {Function} triggerCallback
     * @ignore
     */
    /**
     * \u89e6\u53d1\u663e\u793a\u65f6\u7684\u56de\u8c03\u51fd\u6570
     * @type {Function}
     * @ignore
     */
    triggerCallback : {
      value : function (ev) {
        
      }
    },
    /**
     * \u663e\u793a\u83dc\u5355\u7684\u4e8b\u4ef6
     *  <pre><code>
     *    var overlay = new Overlay({ //\u79fb\u52a8\u5230#t1\u65f6\u663e\u793a\uff0c\u79fb\u52a8\u51fa#t1,overlay\u4e4b\u5916\u63a7\u4ef6\u9690\u85cf
     *      trigger : '#t1',
     *      autoHide : true,
     *      triggerEvent :'mouseover',
     *      autoHideType : 'leave',
     *      content : '\u60ac\u6d6e\u5185\u5bb9'
     *    });
     *    overlay.render();
     * 
     *  </code></pre>
     * @cfg {String} [triggerEvent='click']
     * @default 'click'
     */
    /**
     * \u663e\u793a\u83dc\u5355\u7684\u4e8b\u4ef6
     * @type {String}
     * @default 'click'
     * @ignore
     */
    triggerEvent : {
      value:'click'
    },
    /**
     * \u56e0\u4e3a\u89e6\u53d1\u5143\u7d20\u53d1\u751f\u6539\u53d8\u800c\u5bfc\u81f4\u63a7\u4ef6\u9690\u85cf
     * @cfg {String} triggerHideEvent
     * @ignore
     */
    /**
     * \u56e0\u4e3a\u89e6\u53d1\u5143\u7d20\u53d1\u751f\u6539\u53d8\u800c\u5bfc\u81f4\u63a7\u4ef6\u9690\u85cf
     * @type {String}
     * @ignore
     */
    triggerHideEvent : {

    },
    events : {
      value : {
        /**
         * \u5f53\u89e6\u53d1\u5668\uff08\u89e6\u53d1\u9009\u62e9\u5668\u51fa\u73b0\uff09\u53d1\u751f\u6539\u53d8\u65f6\uff0c\u7ecf\u5e38\u7528\u4e8e\u4e00\u4e2a\u9009\u62e9\u5668\u5bf9\u5e94\u591a\u4e2a\u89e6\u53d1\u5668\u7684\u60c5\u51b5
         * <pre><code>
         *  overlay.on('triggerchange',function(ev){
         *    var curTrigger = ev.curTrigger;
         *    overlay.set('content',curTrigger.html());
         *  });
         * </code></pre>
         * @event
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {jQuery} e.prevTrigger \u4e4b\u524d\u89e6\u53d1\u5668\uff0c\u53ef\u80fd\u4e3anull
         * @param {jQuery} e.curTrigger \u5f53\u524d\u7684\u89e6\u53d1\u5668
         */
        'triggerchange':false
      }
    }
  };

  autoShow.prototype = {

    __createDom : function () {
      this._setTrigger();
    },
    _setTrigger : function () {
      var _self = this,
        triggerEvent = _self.get('triggerEvent'),
        triggerHideEvent = _self.get('triggerHideEvent'),
        triggerCallback = _self.get('triggerCallback'),
        trigger = _self.get('trigger'),
        isDelegate = _self.get('delegateTigger'),
        triggerEl = $(trigger);

      //\u89e6\u53d1\u663e\u793a
      function tiggerShow (ev) {
        var prevTrigger = _self.get('curTrigger'),
          curTrigger = isDelegate ?$(ev.currentTarget) : $(this),
          align = _self.get('align');
        if(!prevTrigger || prevTrigger[0] != curTrigger[0]){

          _self.set('curTrigger',curTrigger);
          _self.fire('triggerchange',{prevTrigger : prevTrigger,curTrigger : curTrigger});
        }
        if(_self.get('autoAlign')){
          align.node = curTrigger;
          
        }
        _self.set('align',align);
        _self.show();
        /*if(_self.get('autoFocused')){
          try{ //\u5143\u7d20\u9690\u85cf\u7684\u65f6\u5019\uff0cie\u4e0b\u7ecf\u5e38\u4f1a\u62a5\u9519
            _self.focus();
          }catch(ev){
            BUI.log(ev);
          }
        }*/
        
        
        triggerCallback && triggerCallback(ev);
      }

      //\u89e6\u53d1\u9690\u85cf
      function tiggerHide (ev){
        var toElement = ev.toElement || ev.relatedTarget;
        if(!toElement || !_self.containsElement(toElement)){ //mouseleave\u65f6\uff0c\u5982\u679c\u79fb\u52a8\u5230\u5f53\u524d\u63a7\u4ef6\u4e0a\uff0c\u53d6\u6d88\u6d88\u5931
          _self.hide();
        }
      }

      if(triggerEvent){
        if(isDelegate && BUI.isString(trigger)){
          $(document).delegate(trigger,triggerEvent,tiggerShow);
        }else{
          triggerEl.on(triggerEvent,tiggerShow);
        }
        
      }

      if(triggerHideEvent){
        if(isDelegate && BUI.isString(trigger)){
          $(document).delegate(trigger,triggerHideEvent,tiggerHide);
        }else{
          triggerEl.on(triggerHideEvent,tiggerHide);
        }
      } 
    },
    __renderUI : function () {
      var _self = this,
        align = _self.get('align');
      //\u5982\u679c\u63a7\u4ef6\u663e\u793a\u65f6\u4e0d\u662f\u7531trigger\u89e6\u53d1\uff0c\u5219\u540c\u7236\u5143\u7d20\u5bf9\u9f50
      if(align && !align.node){
        align.node = _self.get('render') || _self.get('trigger');
      }
    }
  };

  return autoShow;
});
define('bui/component/uibase/autohide',function () {

  var wrapBehavior = BUI.wrapBehavior,
      getWrapBehavior = BUI.getWrapBehavior;

  function isExcept(self,elem){
    var hideExceptNode = self.get('hideExceptNode');
    if(hideExceptNode && hideExceptNode.length){
      return $.contains(hideExceptNode[0],elem);
    }
    return false;
  }
  /**
   * \u70b9\u51fb\u9690\u85cf\u63a7\u4ef6\u7684\u6269\u5c55
   * @class BUI.Component.UIBase.AutoHide
   */
  function autoHide() {
  
  }

  autoHide.ATTRS = {

    /**
     * \u63a7\u4ef6\u81ea\u52a8\u9690\u85cf\u7684\u4e8b\u4ef6\uff0c\u8fd9\u91cc\u652f\u63012\u79cd\uff1a
     *  - 'click'
     *  - 'leave'
     *  <pre><code>
     *    var overlay = new Overlay({ //\u70b9\u51fb#t1\u65f6\u663e\u793a\uff0c\u70b9\u51fb#t1\u4e4b\u5916\u7684\u5143\u7d20\u9690\u85cf
     *      trigger : '#t1',
     *      autoHide : true,
     *      content : '\u60ac\u6d6e\u5185\u5bb9'
     *    });
     *    overlay.render();
     *
     *    var overlay = new Overlay({ //\u79fb\u52a8\u5230#t1\u65f6\u663e\u793a\uff0c\u79fb\u52a8\u51fa#t1,overlay\u4e4b\u5916\u63a7\u4ef6\u9690\u85cf
     *      trigger : '#t1',
     *      autoHide : true,
     *      triggerEvent :'mouseover',
     *      autoHideType : 'leave',
     *      content : '\u60ac\u6d6e\u5185\u5bb9'
     *    });
     *    overlay.render();
     * 
     *  </code></pre>
     * @cfg {String} [autoHideType = 'click']
     */
    /**
     * \u63a7\u4ef6\u81ea\u52a8\u9690\u85cf\u7684\u4e8b\u4ef6\uff0c\u8fd9\u91cc\u652f\u63012\u79cd\uff1a
     * 'click',\u548c'leave',\u9ed8\u8ba4\u4e3a'click'
     * @type {String}
     */
    autoHideType : {
      value : 'click'
    },
    /**
     * \u662f\u5426\u81ea\u52a8\u9690\u85cf
     * <pre><code>
     *  
     *  var overlay = new Overlay({ //\u70b9\u51fb#t1\u65f6\u663e\u793a\uff0c\u70b9\u51fb#t1,overlay\u4e4b\u5916\u7684\u5143\u7d20\u9690\u85cf
     *    trigger : '#t1',
     *    autoHide : true,
     *    content : '\u60ac\u6d6e\u5185\u5bb9'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Object} autoHide
     */
    /**
     * \u662f\u5426\u81ea\u52a8\u9690\u85cf
     * @type {Object}
     * @ignore
     */
    autoHide:{
      value : false
    },
    /**
     * \u70b9\u51fb\u6216\u8005\u79fb\u52a8\u5230\u6b64\u8282\u70b9\u65f6\u4e0d\u89e6\u53d1\u81ea\u52a8\u9690\u85cf
     * <pre><code>
     *  
     *  var overlay = new Overlay({ //\u70b9\u51fb#t1\u65f6\u663e\u793a\uff0c\u70b9\u51fb#t1,#t2,overlay\u4e4b\u5916\u7684\u5143\u7d20\u9690\u85cf
     *    trigger : '#t1',
     *    autoHide : true,
     *    hideExceptNode : '#t2',
     *    content : '\u60ac\u6d6e\u5185\u5bb9'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Object} hideExceptNode
     */
    hideExceptNode :{

    },
    events : {
      value : {
        /**
         * @event autohide
         * \u70b9\u51fb\u63a7\u4ef6\u5916\u90e8\u65f6\u89e6\u53d1\uff0c\u53ea\u6709\u5728\u63a7\u4ef6\u8bbe\u7f6e\u81ea\u52a8\u9690\u85cf(autoHide = true)\u6709\u6548
         * \u53ef\u4ee5\u963b\u6b62\u63a7\u4ef6\u9690\u85cf\uff0c\u901a\u8fc7\u5728\u4e8b\u4ef6\u76d1\u542c\u51fd\u6570\u4e2d return false
         * <pre><code>
         *  overlay.on('autohide',function(){
         *    var curTrigger = overlay.curTrigger; //\u5f53\u524d\u89e6\u53d1\u7684\u9879
         *    if(condtion){
         *      return false; //\u963b\u6b62\u9690\u85cf
         *    }
         *  });
         * </code></pre>
         */
        autohide : false
      }
    }
  };

  autoHide.prototype = {

    __bindUI : function() {
      var _self = this;

      _self.on('afterVisibleChange',function (ev) {
        var visible = ev.newVal;
        if(_self.get('autoHide')){
          if(visible){
            _self._bindHideEvent();
          }else{
            _self._clearHideEvent();
          }
        }
      });
    },
    /**
     * \u5904\u7406\u9f20\u6807\u79fb\u51fa\u4e8b\u4ef6\uff0c\u4e0d\u5f71\u54cd{BUI.Component.Controller#handleMouseLeave}\u4e8b\u4ef6
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleMoveOuter : function (ev) {
      var _self = this,
        target = ev.toElement || ev.relatedTarget;
      if(!_self.containsElement(target) && !isExcept(_self,target)){
        if(_self.fire('autohide') !== false){
          _self.hide();
        }
      }
    },
    /**
     * \u70b9\u51fb\u9875\u9762\u65f6\u7684\u5904\u7406\u51fd\u6570
     * @param {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     * @protected
     */
    handleDocumentClick : function (ev) {
      var _self = this,
        target = ev.target;
      if(!_self.containsElement(target) && !isExcept(_self,target)){
        if(_self.fire('autohide') !== false){
          _self.hide();
        }
      }
    },
    _bindHideEvent : function() {
      var _self = this,
        trigger = _self.get('curTrigger'),
        autoHideType = _self.get('autoHideType');
      if(autoHideType === 'click'){
        $(document).on('mousedown',wrapBehavior(_self,'handleDocumentClick'));
      }else{
        _self.get('el').on('mouseleave',wrapBehavior(_self,'handleMoveOuter'));
        if(trigger){
          $(trigger).on('mouseleave',wrapBehavior(_self,'handleMoveOuter'))
        }
      }

    },
    //\u6e05\u9664\u7ed1\u5b9a\u7684\u9690\u85cf\u4e8b\u4ef6
    _clearHideEvent : function() {
      var _self = this,
        trigger = _self.get('curTrigger'),
        autoHideType = _self.get('autoHideType');
      if(autoHideType === 'click'){
        $(document).off('mousedown',getWrapBehavior(_self,'handleDocumentClick'));
      }else{
        _self.get('el').off('mouseleave',getWrapBehavior(_self,'handleMoveOuter'));
        if(trigger){
          $(trigger).off('mouseleave',getWrapBehavior(_self,'handleMoveOuter'))
        }
      }
    }
  };

  return autoHide;

});





define('bui/component/uibase/close',function () {
  
  var CLS_PREFIX = BUI.prefix + 'ext-';

  function getCloseRenderBtn(self) {
      return $(self.get('closeTpl'));
  }

  /**
  * \u5173\u95ed\u6309\u94ae\u7684\u89c6\u56fe\u7c7b
  * @class BUI.Component.UIBase.CloseView
  * @private
  */
  function CloseView() {
  }

  CloseView.ATTRS = {
    closeTpl : {
      value : '<a ' +
            'tabindex="0" ' +
            "href='javascript:void(\"\u5173\u95ed\")' " +
            'role="button" ' +
            'class="' + CLS_PREFIX + 'close' + '">' +
            '<span class="' +
            CLS_PREFIX + 'close-x' +
            '">\u5173\u95ed<' + '/span>' +
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
      * \u5173\u95ed\u6309\u94ae\u7684\u9ed8\u8ba4\u6a21\u7248
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
      * \u5173\u95ed\u6309\u94ae\u7684\u9ed8\u8ba4\u6a21\u7248
      * @type {String}
      * @protected
      */
      closeTpl:{
        view : true
      },
      /**
       * \u662f\u5426\u51fa\u73b0\u5173\u95ed\u6309\u94ae
       * @cfg {Boolean} [closeable = false]
       */
      /**
       * \u662f\u5426\u51fa\u73b0\u5173\u95ed\u6309\u94ae
       * @type {Boolean}
       */
      closeable:{
          view:1
      },

      /**
       * \u5173\u95ed\u6309\u94ae.
       * @protected
       * @type {jQuery}
       */
      closeBtn:{
          view:1
      },
      /**
       * \u5173\u95ed\u65f6\u9690\u85cf\u8fd8\u662f\u79fb\u9664DOM\u7ed3\u6784<br/>
       * 
       *  - "hide" : default \u9690\u85cf. 
       *  - "destroy"\uff1a\u5f53\u70b9\u51fb\u5173\u95ed\u6309\u94ae\u65f6\u79fb\u9664\uff08destroy)\u63a7\u4ef6
       *  - 'remove' : \u5f53\u5b58\u5728\u7236\u63a7\u4ef6\u65f6\u4f7f\u7528remove\uff0c\u540c\u65f6\u4ece\u7236\u5143\u7d20\u4e2d\u5220\u9664
       * @cfg {String} [closeAction = 'hide']
       */
      /**
       * \u5173\u95ed\u65f6\u9690\u85cf\u8fd8\u662f\u79fb\u9664DOM\u7ed3\u6784
       * default "hide".\u53ef\u4ee5\u8bbe\u7f6e "destroy" \uff0c\u5f53\u70b9\u51fb\u5173\u95ed\u6309\u94ae\u65f6\u79fb\u9664\uff08destroy)\u63a7\u4ef6
       * @type {String}
       * @protected
       */
      closeAction:{
        value:HIDE
      }

      /**
       * @event closing
       * \u6b63\u5728\u5173\u95ed\uff0c\u53ef\u4ee5\u901a\u8fc7return false \u963b\u6b62\u5173\u95ed\u4e8b\u4ef6
       * @param {Object} e \u5173\u95ed\u4e8b\u4ef6
       * @param {String} e.action \u5173\u95ed\u6267\u884c\u7684\u884c\u4e3a\uff0chide,destroy,remove
       */
      
      /**
       * @event beforeclosed
       * \u5173\u95ed\u524d\uff0c\u53d1\u751f\u5728closing\u540e\uff0cclosed\u524d\uff0c\u7528\u4e8e\u5904\u7406\u5173\u95ed\u524d\u7684\u4e00\u4e9b\u5de5\u4f5c
       * @param {Object} e \u5173\u95ed\u4e8b\u4ef6
       * @param {String} e.action \u5173\u95ed\u6267\u884c\u7684\u884c\u4e3a\uff0chide,destroy,remove
       */

      /**
       * @event closed
       * \u5df2\u7ecf\u5173\u95ed
       * @param {Object} e \u5173\u95ed\u4e8b\u4ef6
       * @param {String} e.action \u5173\u95ed\u6267\u884c\u7684\u884c\u4e3a\uff0chide,destroy,remove
       */
      
      /**
       * @event closeclick
       * \u89e6\u53d1\u70b9\u51fb\u5173\u95ed\u6309\u94ae\u7684\u4e8b\u4ef6,return false \u963b\u6b62\u5173\u95ed
       * @param {Object} e \u5173\u95ed\u4e8b\u4ef6
       * @param {String} e.domTarget \u70b9\u51fb\u7684\u5173\u95ed\u6309\u94ae\u8282\u70b9
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
       * \u5173\u95ed\u5f39\u51fa\u6846\uff0c\u5982\u679ccloseAction = 'hide'\u90a3\u4e48\u5c31\u662f\u9690\u85cf\uff0c\u5982\u679c closeAction = 'destroy'\u90a3\u4e48\u5c31\u662f\u91ca\u653e,'remove'\u4ece\u7236\u63a7\u4ef6\u4e2d\u5220\u9664\uff0c\u5e76\u91ca\u653e
       */
      close : function(){
        var self = this,
          action = actions[self.get('closeAction') || HIDE];
        if(self.fire('closing',{action : action}) !== false){
          self.fire('beforeclosed',{action : action});
          if(action == 'remove'){ //\u79fb\u9664\u65f6\u540c\u65f6destroy
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

define('bui/component/uibase/drag',function(){

   
    var dragBackId = BUI.guid('drag');
    
    /**
     * \u62d6\u62fd\u63a7\u4ef6\u7684\u6269\u5c55
     * <pre><code>
     *  var Control = Overlay.extend([UIBase.Drag],{
     *      
     *  });
     *
     *  var c = new Contol({ //\u62d6\u52a8\u63a7\u4ef6\u65f6\uff0c\u5728#t2\u5185
     *      content : '<div id="header"></div><div></div>',
     *      dragNode : '#header',
     *      constraint : '#t2'
     *  });
     * </code></pre>
     * @class BUI.Component.UIBase.Drag
     */
    var drag = function(){

    };

    drag.ATTRS = 
    {

        /**
         * \u70b9\u51fb\u62d6\u52a8\u7684\u8282\u70b9
         * <pre><code>
         *  var Control = Overlay.extend([UIBase.Drag],{
         *      
         *  });
         *
         *  var c = new Contol({ //\u62d6\u52a8\u63a7\u4ef6\u65f6\uff0c\u5728#t2\u5185
         *      content : '<div id="header"></div><div></div>',
         *      dragNode : '#header',
         *      constraint : '#t2'
         *  });
         * </code></pre>
         * @cfg {jQuery} dragNode
         */
        /**
         * \u70b9\u51fb\u62d6\u52a8\u7684\u8282\u70b9
         * @type {jQuery}
         * @ignore
         */
        dragNode : {

        },
        /**
         * \u662f\u5426\u6b63\u5728\u62d6\u52a8
         * @type {Boolean}
         * @protected
         */
        draging:{
            setter:function (v) {
                if (v === true) {
                    return {};
                }
            },
            value:null
        },
        /**
         * \u62d6\u52a8\u7684\u9650\u5236\u8303\u56f4
         * <pre><code>
         *  var Control = Overlay.extend([UIBase.Drag],{
         *      
         *  });
         *
         *  var c = new Contol({ //\u62d6\u52a8\u63a7\u4ef6\u65f6\uff0c\u5728#t2\u5185
         *      content : '<div id="header"></div><div></div>',
         *      dragNode : '#header',
         *      constraint : '#t2'
         *  });
         * </code></pre>
         * @cfg {jQuery} constraint
         */
        /**
         * \u62d6\u52a8\u7684\u9650\u5236\u8303\u56f4
         * @type {jQuery}
         * @ignore
         */
        constraint : {

        },
        /**
         * @private
         * @type {jQuery}
         */
        dragBackEl : {
            /** @private **/
            getter:function(){
                return $('#'+dragBackId);
            }
        }
    };
    var dragTpl = '<div id="' + dragBackId + '" style="background-color: red; position: fixed; left: 0px; width: 100%; height: 100%; top: 0px; cursor: move; z-index: 999999; display: none; "></div>';
       
    function initBack(){
        var el = $(dragTpl).css('opacity', 0).prependTo('body');
        return el;
    }
    drag.prototype = {
        
        __bindUI : function(){
            var _self = this,
                constraint = _self.get('constraint'),
                dragNode = _self.get('dragNode');
            if(!dragNode){
                return;
            }
            dragNode.on('mousedown',function(e){

                if(e.which == 1){
                    e.preventDefault();
                    _self.set('draging',{
                        elX: _self.get('x'),
                        elY: _self.get('y'),
                        startX : e.pageX,
                        startY : e.pageY
                    });
                    registEvent();
                }
            });
            /**
             * @private
             */
            function mouseMove(e){
                var draging = _self.get('draging');
                if(draging){
                    e.preventDefault();
                    _self._dragMoveTo(e.pageX,e.pageY,draging,constraint);
                }
            }
            /**
             * @private
             */
            function mouseUp(e){
                if(e.which == 1){
                    _self.set('draging',false);
                    var dragBackEl = _self.get('dragBackEl');
                    if(dragBackEl){
                        dragBackEl.hide();
                    }
                    unregistEvent();
                }
            }
            /**
             * @private
             */
            function registEvent(){
                $(document).on('mousemove',mouseMove);
                $(document).on('mouseup',mouseUp);
            }
            /**
             * @private
             */
            function unregistEvent(){
                $(document).off('mousemove',mouseMove);
                $(document).off('mouseup',mouseUp);
            }

        },
        _dragMoveTo : function(x,y,draging,constraint){
            var _self = this,
                dragBackEl = _self.get('dragBackEl'),
                draging = draging || _self.get('draging'),
                offsetX = draging.startX - x,
                offsetY = draging.startY - y;
            if(!dragBackEl.length){
                 dragBackEl = initBack();
            }
            dragBackEl.css({
                cursor: 'move',
                display: 'block'
            });
            _self.set('xy',[_self._getConstrainX(draging.elX - offsetX,constraint),
                            _self._getConstrainY(draging.elY - offsetY,constraint)]);    

        },
        _getConstrainX : function(x,constraint){
            var _self = this,
                width =  _self.get('el').outerWidth(),
                endX = x + width,
                curX = _self.get('x');
            //\u5982\u679c\u5b58\u5728\u7ea6\u675f
            if(constraint){
                var constraintOffset = constraint.offset();
                if(constraintOffset.left >= x){
                    return constraintOffset.left;
                }
                if(constraintOffset.left + constraint.width() < endX){
                    return constraintOffset.left + constraint.width() - width;
                }
                return x;
            }
            //\u5f53\u5de6\u53f3\u9876\u70b9\u90fd\u5728\u89c6\u56fe\u5185\uff0c\u79fb\u52a8\u5230\u6b64\u70b9
            if(BUI.isInHorizontalView(x) && BUI.isInHorizontalView(endX)){
                return x;
            }

            return curX;
        },
        _getConstrainY : function(y,constraint){
             var _self = this,
                height =  _self.get('el').outerHeight(),
                endY = y + height,
                curY = _self.get('y');
            //\u5982\u679c\u5b58\u5728\u7ea6\u675f
            if(constraint){
                var constraintOffset = constraint.offset();
                if(constraintOffset.top > y){
                    return constraintOffset.top;
                }
                if(constraintOffset.top + constraint.height() < endY){
                    return constraintOffset.top + constraint.height() - height;
                }
                return y;
            }
            //\u5f53\u5de6\u53f3\u9876\u70b9\u90fd\u5728\u89c6\u56fe\u5185\uff0c\u79fb\u52a8\u5230\u6b64\u70b9
            if(BUI.isInVerticalView(y) && BUI.isInVerticalView(endY)){
                return y;
            }

            return curY;
        }
    };

    return drag;

});
define('bui/component/uibase/keynav',['bui/keycode'],function (require) {

  var KeyCode = require('bui/keycode'),
      wrapBehavior = BUI.wrapBehavior,
      getWrapBehavior = BUI.getWrapBehavior;
  /**
   * \u952e\u76d8\u5bfc\u822a
   * @class BUI.Component.UIBase.KeyNav
   */
  var keyNav = function () {
    
  };

  keyNav.ATTRS = {

    /**
     * \u662f\u5426\u5141\u8bb8\u952e\u76d8\u5bfc\u822a
     * @cfg {Boolean} [allowKeyNav = true]
     */
    allowKeyNav : {
      value : true
    },
    /**
     * \u5bfc\u822a\u4f7f\u7528\u7684\u4e8b\u4ef6
     * @cfg {String} [navEvent = 'keydown']
     */
    navEvent : {
      value : 'keydown'
    },
    /**
     * \u5f53\u83b7\u53d6\u4e8b\u4ef6\u7684DOM\u662f input,textarea,select\u7b49\u65f6\uff0c\u4e0d\u5904\u7406\u952e\u76d8\u5bfc\u822a
     * @cfg {Object} [ignoreInputFields='true']
     */
    ignoreInputFields : {
      value : true
    }

  };

  keyNav.prototype = {

    __bindUI : function () {
      
    },
    _uiSetAllowKeyNav : function(v){
      var _self = this,
        eventName = _self.get('navEvent'),
        el = _self.get('el');
      if(v){
        el.on(eventName,wrapBehavior(_self,'_handleKeyDown'));
      }else{
        el.off(eventName,getWrapBehavior(_self,'_handleKeyDown'));
      }
    },
    /**
     * \u5904\u7406\u952e\u76d8\u5bfc\u822a
     * @private
     */
    _handleKeyDown : function(ev){
      var _self = this,
        ignoreInputFields = _self.get('ignoreInputFields'),
        code = ev.which;
      if(ignoreInputFields && $(ev.target).is('input,select,textarea')){
        return;
      }
      
      switch(code){
        case KeyCode.UP :
          ev.preventDefault();
          _self.handleNavUp(ev);
          break;
        case KeyCode.DOWN : 
          ev.preventDefault();
          _self.handleNavDown(ev);
          break;
        case KeyCode.RIGHT : 
          ev.preventDefault();
          _self.handleNavRight(ev);
          break;
        case KeyCode.LEFT : 
          ev.preventDefault();
          _self.handleNavLeft(ev);
          break;
        case KeyCode.ENTER : 
          _self.handleNavEnter(ev);
          break;
        case KeyCode.ESC : 
          _self.handleNavEsc(ev);
          break;
        case KeyCode.TAB :
          _self.handleNavTab(ev);
          break;
        default:
          break;
      }
    },
    /**
     * \u5904\u7406\u5411\u4e0a\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavUp : function (ev) {
      // body...
    },
    /**
     * \u5904\u7406\u5411\u4e0b\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavDown : function (ev) {
      // body...
    },
    /**
     * \u5904\u7406\u5411\u5de6\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavLeft : function (ev) {
      // body...
    },
    /**
     * \u5904\u7406\u5411\u53f3\u5bfc\u822a
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavRight : function (ev) {
      // body...
    },
    /**
     * \u5904\u7406\u786e\u8ba4\u952e
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavEnter : function (ev) {
      // body...
    },
    /**
     * \u5904\u7406 esc \u952e
     * @protected
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavEsc : function (ev) {
      // body...
    },
    /**
     * \u5904\u7406Tab\u952e
     * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
     */
    handleNavTab : function(ev){

    }

  };

  return keyNav;
});

define('bui/component/uibase/mask',function (require) {

    var UA = require('bui/ua'),
        
        /**
         * \u6bcf\u7ec4\u76f8\u540c prefixCls \u7684 position \u5171\u4eab\u4e00\u4e2a\u906e\u7f69
         * @ignore
         */
        maskMap = {
            /**
             * @ignore
             * {
             *  node:
             *  num:
             * }
             */

    },
        ie6 = UA.ie == 6;

    function getMaskCls(self) {
        return self.get('prefixCls') + 'ext-mask';
    }

    function docWidth() {
        return  ie6 ? BUI.docWidth() + 'px' : '100%';
    }

    function docHeight() {
        return ie6 ? BUI.docHeight() + 'px' : '100%';
    }

    function initMask(maskCls) {
        var mask = $('<div ' +
            ' style="width:' + docWidth() + ';' +
            'left:0;' +
            'top:0;' +
            'height:' + docHeight() + ';' +
            'position:' + (ie6 ? 'absolute' : 'fixed') + ';"' +
            ' class="' +
            maskCls +
            '">' +
            (ie6 ? '<' + 'iframe ' +
                'style="position:absolute;' +
                'left:' + '0' + ';' +
                'top:' + '0' + ';' +
                'background:white;' +
                'width: expression(this.parentNode.offsetWidth);' +
                'height: expression(this.parentNode.offsetHeight);' +
                'filter:alpha(opacity=0);' +
                'z-index:-1;"></iframe>' : '') +
            '</div>')
            .prependTo('body');
        /**
         * \u70b9 mask \u7126\u70b9\u4e0d\u8f6c\u79fb
         * @ignore
         */
       // mask.unselectable();
        mask.on('mousedown', function (e) {
            e.preventDefault();
        });
        return mask;
    }

    /**
    * \u906e\u7f69\u5c42\u7684\u89c6\u56fe\u7c7b
    * @class BUI.Component.UIBase.MaskView
    * @private
    */
    function MaskView() {
    }

    MaskView.ATTRS = {
        maskShared:{
            value:true
        }
    };

    MaskView.prototype = {

        _maskExtShow:function () {
            var self = this,
                zIndex,
                maskCls = getMaskCls(self),
                maskDesc = maskMap[maskCls],
                maskShared = self.get('maskShared'),
                mask = self.get('maskNode');
            if (!mask) {
                if (maskShared) {
                    if (maskDesc) {
                        mask = maskDesc.node;
                    } else {
                        mask = initMask(maskCls);
                        maskDesc = maskMap[maskCls] = {
                            num:0,
                            node:mask
                        };
                    }
                } else {
                    mask = initMask(maskCls);
                }
                self.setInternal('maskNode', mask);
            }
            if (zIndex = self.get('zIndex')) {
                mask.css('z-index', zIndex - 1);
            }
            if (maskShared) {
                maskDesc.num++;
            }
            if (!maskShared || maskDesc.num == 1) {
                mask.show();
            }
            $('body').addClass('x-masked-relative');
        },

        _maskExtHide:function () {
            var self = this,
                maskCls = getMaskCls(self),
                maskDesc = maskMap[maskCls],
                maskShared = self.get('maskShared'),
                mask = self.get('maskNode');
            if (maskShared && maskDesc) {
                maskDesc.num = Math.max(maskDesc.num - 1, 0);
                if (maskDesc.num == 0) {
                    mask.hide();
                }
            } else if(mask){
                mask.hide();
            }
            $('body').removeClass('x-masked-relative');
        },

        __destructor:function () {
            var self = this,
                maskShared = self.get('maskShared'),
                mask = self.get('maskNode');
            if (self.get('maskNode')) {
                if (maskShared) {
                    if (self.get('visible')) {
                        self._maskExtHide();
                    }
                } else {
                    mask.remove();
                }
            }
        }

    };

   /**
     * @class BUI.Component.UIBase.Mask
     * Mask extension class.
     * Make component to be able to show with mask.
     */
    function Mask() {
    }

    Mask.ATTRS =
    {
        /**
         * \u63a7\u4ef6\u663e\u793a\u65f6\uff0c\u662f\u5426\u663e\u793a\u5c4f\u853d\u5c42
         * <pre><code>
         *   var overlay = new Overlay({ //\u663e\u793aoverlay\u65f6\uff0c\u5c4f\u853dbody
         *     mask : true,
         *     maskNode : 'body',
         *     trigger : '#t1'
         *   });
         *   overlay.render();
         * </code></pre>
         * @cfg {Boolean} [mask = false]
         */
        /**
         * \u63a7\u4ef6\u663e\u793a\u65f6\uff0c\u662f\u5426\u663e\u793a\u5c4f\u853d\u5c42
         * @type {Boolean}
         * @protected
         */
        mask:{
            value:false
        },
        /**
         * \u5c4f\u853d\u7684\u5185\u5bb9
         * <pre><code>
         *   var overlay = new Overlay({ //\u663e\u793aoverlay\u65f6\uff0c\u5c4f\u853dbody
         *     mask : true,
         *     maskNode : 'body',
         *     trigger : '#t1'
         *   });
         *   overlay.render();
         * </code></pre>
         * @cfg {jQuery} maskNode
         */
        /**
         * \u5c4f\u853d\u7684\u5185\u5bb9
         * @type {jQuery}
         * @protected
         */
        maskNode:{
            view:1
        },
        /**
         * Whether to share mask with other overlays.
         * @default true.
         * @type {Boolean}
         * @protected
         */
        maskShared:{
            view:1
        }
    };

    Mask.prototype = {

        __bindUI:function () {
            var self = this,
                view = self.get('view'),
                _maskExtShow = view._maskExtShow,
                _maskExtHide = view._maskExtHide;
            if (self.get('mask')) {
                self.on('show',function(){
                    view._maskExtShow();
                });
                self.on('hide',function(){
                    view._maskExtHide();
                });
            }
        }
    };

  Mask = Mask;
  Mask.View = MaskView;

  return Mask;
});


define('bui/component/uibase/position',function () {


    /**
    * \u5bf9\u9f50\u7684\u89c6\u56fe\u7c7b
    * @class BUI.Component.UIBase.PositionView
    * @private
    */
    function PositionView() {

    }

    PositionView.ATTRS = {
        x:{
            /**
             * \u6c34\u5e73\u65b9\u5411\u7edd\u5bf9\u4f4d\u7f6e
             * @private
             * @ignore
             */
            valueFn:function () {
                var self = this;
                // \u8bfb\u5230\u8fd9\u91cc\u65f6\uff0cel \u4e00\u5b9a\u662f\u5df2\u7ecf\u52a0\u5230 dom \u6811\u4e2d\u4e86\uff0c\u5426\u5219\u62a5\u672a\u77e5\u9519\u8bef
                // el \u4e0d\u5728 dom \u6811\u4e2d offset \u62a5\u9519\u7684
                // \u6700\u65e9\u8bfb\u5c31\u662f\u5728 syncUI \u4e2d\uff0c\u4e00\u70b9\u91cd\u590d\u8bbe\u7f6e(\u8bfb\u53d6\u81ea\u8eab X \u518d\u8c03\u7528 _uiSetX)\u65e0\u6240\u8c13\u4e86
                return self.get('el') && self.get('el').offset().left;
            }
        },
        y:{
            /**
             * \u5782\u76f4\u65b9\u5411\u7edd\u5bf9\u4f4d\u7f6e
             * @private
             * @ignore
             */
            valueFn:function () {
                var self = this;
                return self.get('el') && self.get('el').offset().top;
            }
        },
        zIndex:{
        },
        /**
         * @private
         * see {@link BUI.Component.UIBase.Box#visibleMode}.
         * @default "visibility"
         * @ignore
         */
        visibleMode:{
            value:'visibility'
        }
    };


    PositionView.prototype = {

        __createDom:function () {
            this.get('el').addClass(BUI.prefix + 'ext-position');
        },

        _uiSetZIndex:function (x) {
            this.get('el').css('z-index', x);
        },
        _uiSetX:function (x) {
            if (x != null) {
                this.get('el').offset({
                    left:x
                });
            }
        },
        _uiSetY:function (y) {
            if (y != null) {
                this.get('el').offset({
                    top:y
                });
            }
        },
        _uiSetLeft:function(left){
            if(left != null){
                this.get('el').css({left:left});
            }
        },
        _uiSetTop : function(top){
            if(top != null){
                this.get('el').css({top:top});
            }
        }
    };
  
    /**
     * @class BUI.Component.UIBase.Position
     * Position extension class.
     * Make component positionable
     */
    function Position() {
    }

    Position.ATTRS =
    /**
     * @lends BUI.Component.UIBase.Position#
     * @ignore
     */
    {
        /**
         * \u6c34\u5e73\u5750\u6807
         * @cfg {Number} x
         */
        /**
         * \u6c34\u5e73\u5750\u6807
         * <pre><code>
         *     overlay.set('x',100);
         * </code></pre>
         * @type {Number}
         */
        x:{
            view:1
        },
        /**
         * \u5782\u76f4\u5750\u6807
         * @cfg {Number} y
         */
        /**
         * \u5782\u76f4\u5750\u6807
         * <pre><code>
         *     overlay.set('y',100);
         * </code></pre>
         * @type {Number}
         */
        y:{
            view:1
        },
        /**
         * \u76f8\u5bf9\u4e8e\u7236\u5143\u7d20\u7684\u6c34\u5e73\u4f4d\u7f6e
         * @type {Number}
         * @protected
         */
        left : {
            view:1
        },
        /**
         * \u76f8\u5bf9\u4e8e\u7236\u5143\u7d20\u7684\u5782\u76f4\u4f4d\u7f6e
         * @type {Number}
         * @protected
         */
        top : {
            view:1
        },
        /**
         * \u6c34\u5e73\u548c\u5782\u76f4\u5750\u6807
         * <pre><code>
         * var overlay = new Overlay({
         *   xy : [100,100],
         *   trigger : '#t1',
         *   srcNode : '#c1'
         * });
         * </code></pre>
         * @cfg {Number[]} xy
         */
        /**
         * \u6c34\u5e73\u548c\u5782\u76f4\u5750\u6807
         * <pre><code>
         *     overlay.set('xy',[100,100]);
         * </code></pre>
         * @type {Number[]}
         */
        xy:{
            // \u76f8\u5bf9 page \u5b9a\u4f4d, \u6709\u6548\u503c\u4e3a [n, m], \u4e3a null \u65f6, \u9009 align \u8bbe\u7f6e
            setter:function (v) {
                var self = this,
                    xy = $.makeArray(v);
                /*
                 \u5c5e\u6027\u5185\u5206\u53d1\u7279\u522b\u6ce8\u610f\uff1a
                 xy -> x,y
                 */
                if (xy.length) {
                    xy[0] && self.set('x', xy[0]);
                    xy[1] && self.set('y', xy[1]);
                }
                return v;
            },
            /**
             * xy \u7eaf\u4e2d\u8f6c\u4f5c\u7528
             * @ignore
             */
            getter:function () {
                return [this.get('x'), this.get('y')];
            }
        },
        /**
         * z-index value.
         * <pre><code>
         *   var overlay = new Overlay({
         *       zIndex : '1000'
         *   });
         * </code></pre>
         * @cfg {Number} zIndex
         */
        /**
         * z-index value.
         * <pre><code>
         *   overlay.set('zIndex','1200');
         * </code></pre>
         * @type {Number}
         */
        zIndex:{
            view:1
        },
        /**
         * Positionable element is by default visible false.
         * For compatibility in overlay and PopupMenu.
         * @default false
         * @ignore
         */
        visible:{
            view:true,
            value:true
        }
    };


    Position.prototype =
    /**
     * @lends BUI.Component.UIBase.Position.prototype
     * @ignore
     */
    {
        /**
         * Move to absolute position.
         * @param {Number|Number[]} x
         * @param {Number} [y]
         * @example
         * <pre><code>
         * move(x, y);
         * move(x);
         * move([x,y])
         * </code></pre>
         */
        move:function (x, y) {
            var self = this;
            if (BUI.isArray(x)) {
                y = x[1];
                x = x[0];
            }
            self.set('xy', [x, y]);
            return self;
        },
        //\u8bbe\u7f6e x \u5750\u6807\u65f6\uff0c\u91cd\u7f6e left
        _uiSetX : function(v){
            if(v != null){
                var _self = this,
                    el = _self.get('el');
                _self.setInternal('left',el.position().left);
                if(v != -999){
                    this.set('cachePosition',null);
                }
                
            }
            
        },
        //\u8bbe\u7f6e y \u5750\u6807\u65f6\uff0c\u91cd\u7f6e top
        _uiSetY : function(v){
            if(v != null){
                var _self = this,
                    el = _self.get('el');
                _self.setInternal('top',el.position().top);
                if(v != -999){
                    this.set('cachePosition',null);
                }
            }
        },
        //\u8bbe\u7f6e left\u65f6\uff0c\u91cd\u7f6e x
        _uiSetLeft : function(v){
            var _self = this,
                    el = _self.get('el');
            if(v != null){
                _self.setInternal('x',el.offset().left);
            }/*else{ //\u5982\u679clef \u4e3anull,\u540c\u65f6\u8bbe\u7f6e\u8fc7left\u548ctop\uff0c\u90a3\u4e48\u53d6\u5bf9\u5e94\u7684\u503c
                _self.setInternal('left',el.position().left);
            }*/
        },
        //\u8bbe\u7f6etop \u65f6\uff0c\u91cd\u7f6ey
        _uiSetTop : function(v){
            var _self = this,
                el = _self.get('el');
            if(v != null){
                _self.setInternal('y',el.offset().top);
            }/*else{ //\u5982\u679clef \u4e3anull,\u540c\u65f6\u8bbe\u7f6e\u8fc7left\u548ctop\uff0c\u90a3\u4e48\u53d6\u5bf9\u5e94\u7684\u503c
                _self.setInternal('top',el.position().top);
            }*/
        }
    };

    Position.View = PositionView;
    return Position;
});

define('bui/component/uibase/listitem',function () {

  /**
   * \u5217\u8868\u9879\u63a7\u4ef6\u7684\u89c6\u56fe\u5c42
   * @class BUI.Component.UIBase.ListItemView
   * @private
   */
  function listItemView () {
    // body...
  }

  listItemView.ATTRS = {
    /**
     * \u662f\u5426\u9009\u4e2d
     * @type {Boolean}
     */
    selected : {

    }
  };

  listItemView.prototype = {
     _uiSetSelected : function(v){
      var _self = this,
        cls = _self.getStatusCls('selected'),
        el = _self.get('el');
      if(v){
        el.addClass(cls);
      }else{
        el.removeClass(cls);
      }
    }
  };
  /**
   * \u5217\u8868\u9879\u7684\u6269\u5c55
   * @class BUI.Component.UIBase.ListItem
   */
  function listItem() {
    
  }

  listItem.ATTRS = {

    /**
     * \u662f\u5426\u53ef\u4ee5\u88ab\u9009\u4e2d
     * @cfg {Boolean} [selectable=true]
     */
    /**
     * \u662f\u5426\u53ef\u4ee5\u88ab\u9009\u4e2d
     * @type {Boolean}
     */
    selectable : {
      value : true
    },
    
    /**
     * \u662f\u5426\u9009\u4e2d,\u53ea\u80fd\u901a\u8fc7\u8bbe\u7f6e\u7236\u7c7b\u7684\u9009\u4e2d\u65b9\u6cd5\u6765\u5b9e\u73b0\u9009\u4e2d
     * @type {Boolean}
     * @readOnly
     */
    selected :{
      view : true,
      sync : false,
      value : false
    }
  };

  listItem.prototype = {
    
  };

  listItem.View = listItemView;

  return listItem;

});

define('bui/component/uibase/stdmod',function () {

    var CLS_PREFIX = BUI.prefix + 'stdmod-';
        

    /**
    * \u6807\u51c6\u6a21\u5757\u7ec4\u7ec7\u7684\u89c6\u56fe\u7c7b
    * @class BUI.Component.UIBase.StdModView
    * @private
    */
    function StdModView() {
    }

    StdModView.ATTRS = {
        header:{
        },
        body:{
        },
        footer:{
        },
        bodyStyle:{
        },
        footerStyle:{
        },
        headerStyle:{
        },
        headerContent:{
        },
        bodyContent:{
        },
        footerContent:{
        }
    };

    StdModView.PARSER = {
        header:function (el) {
            return el.one("." + CLS_PREFIX + "header");
        },
        body:function (el) {
            return el.one("." + CLS_PREFIX + "body");
        },
        footer:function (el) {
            return el.one("." + CLS_PREFIX + "footer");
        }
    };/**/

    function createUI(self, part) {
        var el = self.get('contentEl'),
            partEl = self.get(part);
        if (!partEl) {
            partEl = $('<div class="' +
                CLS_PREFIX + part + '"' +
                ' ' +
                ' >' +
                '</div>');
            partEl.appendTo(el);
            self.setInternal(part, partEl);
        }
    }


    function _setStdModRenderContent(self, part, v) {
        part = self.get(part);
        if (BUI.isString(v)) {
            part.html(v);
        } else {
            part.html('')
                .append(v);
        }
    }

    StdModView.prototype = {

        __createDom:function () {
            createUI(this, 'header');
            createUI(this, 'body');
            createUI(this, 'footer');
        },

        _uiSetBodyStyle:function (v) {
            this.get('body').css(v);
        },

        _uiSetHeaderStyle:function (v) {
            this.get('header').css(v);
        },
        _uiSetFooterStyle:function (v) {
            this.get('footer').css(v);
        },

        _uiSetBodyContent:function (v) {
            _setStdModRenderContent(this, 'body', v);
        },

        _uiSetHeaderContent:function (v) {
            _setStdModRenderContent(this, 'header', v);
        },

        _uiSetFooterContent:function (v) {
            _setStdModRenderContent(this, 'footer', v);
        }
    };

   /**
     * @class BUI.Component.UIBase.StdMod
     * StdMod extension class.
     * Generate head, body, foot for component.
     */
    function StdMod() {
    }

    StdMod.ATTRS =
    /**
     * @lends BUI.Component.UIBase.StdMod#
     * @ignore
     */
    {
        /**
         * \u63a7\u4ef6\u7684\u5934\u90e8DOM. Readonly
         * @readOnly
         * @type {jQuery}
         */
        header:{
            view:1
        },
        /**
         * \u63a7\u4ef6\u7684\u5185\u5bb9DOM. Readonly
         * @readOnly
         * @type {jQuery}
         */
        body:{
            view:1
        },
        /**
         * \u63a7\u4ef6\u7684\u5e95\u90e8DOM. Readonly
         * @readOnly
         * @type {jQuery}
         */
        footer:{
            view:1
        },
        /**
         * \u5e94\u7528\u5230\u63a7\u4ef6\u5185\u5bb9\u7684css\u5c5e\u6027\uff0c\u952e\u503c\u5bf9\u5f62\u5f0f
         * @cfg {Object} bodyStyle
         */
        /**
         * \u5e94\u7528\u5230\u63a7\u4ef6\u5185\u5bb9\u7684css\u5c5e\u6027\uff0c\u952e\u503c\u5bf9\u5f62\u5f0f
         * @type {Object}
         * @protected
         */
        bodyStyle:{
            view:1
        },
        /**
         * \u5e94\u7528\u5230\u63a7\u4ef6\u5e95\u90e8\u7684css\u5c5e\u6027\uff0c\u952e\u503c\u5bf9\u5f62\u5f0f
         * @cfg {Object} footerStyle
         */
        /**
         * \u5e94\u7528\u5230\u63a7\u4ef6\u5e95\u90e8\u7684css\u5c5e\u6027\uff0c\u952e\u503c\u5bf9\u5f62\u5f0f
         * @type {Object}
         * @protected
         */
        footerStyle:{
            view:1
        },
        /**
         * \u5e94\u7528\u5230\u63a7\u4ef6\u5934\u90e8\u7684css\u5c5e\u6027\uff0c\u952e\u503c\u5bf9\u5f62\u5f0f
         * @cfg {Object} headerStyle
         */
        /**
         * \u5e94\u7528\u5230\u63a7\u4ef6\u5934\u90e8\u7684css\u5c5e\u6027\uff0c\u952e\u503c\u5bf9\u5f62\u5f0f
         * @type {Object}
         * @protected
         */
        headerStyle:{
            view:1
        },
        /**
         * \u63a7\u4ef6\u5934\u90e8\u7684html
         * <pre><code>
         * var dialog = new Dialog({
         *     headerContent: '&lt;div class="header"&gt;&lt;/div&gt;',
         *     bodyContent : '#c1',
         *     footerContent : '&lt;div class="footer"&gt;&lt;/div&gt;'
         * });
         * dialog.show();
         * </code></pre>
         * @cfg {jQuery|String} headerContent
         */
        /**
         * \u63a7\u4ef6\u5934\u90e8\u7684html
         * @type {jQuery|String}
         */
        headerContent:{
            view:1
        },
        /**
         * \u63a7\u4ef6\u5185\u5bb9\u7684html
         * <pre><code>
         * var dialog = new Dialog({
         *     headerContent: '&lt;div class="header"&gt;&lt;/div&gt;',
         *     bodyContent : '#c1',
         *     footerContent : '&lt;div class="footer"&gt;&lt;/div&gt;'
         * });
         * dialog.show();
         * </code></pre>
         * @cfg {jQuery|String} bodyContent
         */
        /**
         * \u63a7\u4ef6\u5185\u5bb9\u7684html
         * @type {jQuery|String}
         */
        bodyContent:{
            view:1
        },
        /**
         * \u63a7\u4ef6\u5e95\u90e8\u7684html
         * <pre><code>
         * var dialog = new Dialog({
         *     headerContent: '&lt;div class="header"&gt;&lt;/div&gt;',
         *     bodyContent : '#c1',
         *     footerContent : '&lt;div class="footer"&gt;&lt;/div&gt;'
         * });
         * dialog.show();
         * </code></pre>
         * @cfg {jQuery|String} footerContent
         */
        /**
         * \u63a7\u4ef6\u5e95\u90e8\u7684html
         * @type {jQuery|String}
         */
        footerContent:{
            view:1
        }
    };

  StdMod.View = StdModView;
  return StdMod;
});
define('bui/component/uibase/decorate',['bui/array','bui/json','bui/component/manage'],function (require) {
  
  var ArrayUtil = require('bui/array'),
    JSON = require('bui/json'),
    prefixCls = BUI.prefix,
    FIELD_PREFIX = 'data-'
    FIELD_CFG = FIELD_PREFIX + 'cfg',
    PARSER = 'PARSER',
    Manager = require('bui/component/manage'),
    regx = /^[\{\[]/;

  function isConfigField(name,cfgFields){
    if(cfgFields[name]){
      return true;
    }
    var reg = new RegExp("^"+FIELD_PREFIX);  
    if(name !== FIELD_CFG && reg.test(name)){
      return true;
    }
    return false;
  }

  // \u6536\u96c6\u5355\u7ee7\u627f\u94fe\uff0c\u5b50\u7c7b\u5728\u524d\uff0c\u7236\u7c7b\u5728\u540e
  function collectConstructorChains(self) {
      var constructorChains = [],
          c = self.constructor;
      while (c) {
          constructorChains.push(c);
          c = c.superclass && c.superclass.constructor;
      }
      return constructorChains;
  }

  //\u5982\u679c\u5c5e\u6027\u4e3a\u5bf9\u8c61\u6216\u8005\u6570\u7ec4\uff0c\u5219\u8fdb\u884c\u8f6c\u6362
  function parseFieldValue(value){
    value = $.trim(value);
    if(regx.test(value)){
      value = JSON.looseParse(value);
    }
    return value;
  }

  function setConfigFields(self,cfg){

    var userConfig = self.userConfig || {};
    for (var p in cfg) {
      // \u7528\u6237\u8bbe\u7f6e\u8fc7\u90a3\u4e48\u8fd9\u91cc\u4e0d\u4ece dom \u8282\u70b9\u53d6
      // \u7528\u6237\u8bbe\u7f6e > html parser > default value
      if (!(p in userConfig)) {
        self.setInternal(p,cfg[p]);
      }
    }
  }
  function applyParser(srcNode, parser) {
    var self = this,
      p, v,
      userConfig = self.userConfig || {};

    // \u4ece parser \u4e2d\uff0c\u9ed8\u9ed8\u8bbe\u7f6e\u5c5e\u6027\uff0c\u4e0d\u89e6\u53d1\u4e8b\u4ef6
    for (p in parser) {
      // \u7528\u6237\u8bbe\u7f6e\u8fc7\u90a3\u4e48\u8fd9\u91cc\u4e0d\u4ece dom \u8282\u70b9\u53d6
      // \u7528\u6237\u8bbe\u7f6e > html parser > default value
      if (!(p in userConfig)) {
        v = parser[p];
        // \u51fd\u6570
        if (BUI.isFunction(v)) {
            self.setInternal(p, v.call(self, srcNode));
        }
        // \u5355\u9009\u9009\u62e9\u5668
        else if (typeof v == 'string') {
            self.setInternal(p, srcNode.find(v));
        }
        // \u591a\u9009\u9009\u62e9\u5668
        else if (BUI.isArray(v) && v[0]) {
            self.setInternal(p, srcNode.find(v[0]))
        }
      }
    }
  }

  function initParser(self,srcNode){

    var c = self.constructor,
      len,
      p,
      constructorChains;

    constructorChains = collectConstructorChains(self);

    // \u4ece\u7236\u7c7b\u5230\u5b50\u7c7b\u5f00\u59cb\u4ece html \u8bfb\u53d6\u5c5e\u6027
    for (len = constructorChains.length - 1; len >= 0; len--) {
        c = constructorChains[len];
        if (p = c[PARSER]) {
            applyParser.call(self, srcNode, p);
        }
    }
  }

  function initDecorate(self){
    var _self = self,
      srcNode = _self.get('srcNode'),
      userConfig,
      decorateCfg;
    if(srcNode){
      srcNode = $(srcNode);
      _self.setInternal('el',srcNode);
      _self.setInternal('srcNode',srcNode);

      userConfig = _self.get('userConfig');
      decorateCfg = _self.getDecorateConfig(srcNode);
      setConfigFields(self,decorateCfg);
      
      //\u5982\u679c\u4eceDOM\u4e2d\u8bfb\u53d6\u5b50\u63a7\u4ef6
      if(_self.get('isDecorateChild') && _self.decorateInternal){
        _self.decorateInternal(srcNode);
      }
      initParser(self,srcNode);
    }
  }

  /**
   * @class BUI.Component.UIBase.Decorate
   * \u5c06DOM\u5bf9\u8c61\u5c01\u88c5\u6210\u63a7\u4ef6
   */
  function decorate(){
    initDecorate(this);
  }

  decorate.ATTRS = {

    /**
     * \u914d\u7f6e\u63a7\u4ef6\u7684\u6839\u8282\u70b9\u7684DOM
     * <pre><code>
     * new Form.Form({
     *   srcNode : '#J_Form'
     * }).render();
     * </code></pre>
     * @cfg {jQuery} srcNode
     */
    /**
     * \u914d\u7f6e\u63a7\u4ef6\u7684\u6839\u8282\u70b9\u7684DOM
     * @type {jQuery} 
     */
    srcNode : {
      view : true
    },
    /**
     * \u662f\u5426\u6839\u636eDOM\u751f\u6210\u5b50\u63a7\u4ef6
     * @type {Boolean}
     * @protected
     */
    isDecorateChild : {
      value : false
    },
    /**
     * \u6b64\u914d\u7f6e\u9879\u914d\u7f6e\u4f7f\u7528\u90a3\u4e9bsrcNode\u4e0a\u7684\u8282\u70b9\u4f5c\u4e3a\u914d\u7f6e\u9879
     *  - \u5f53\u65f6\u7528 decorate \u65f6\uff0c\u53d6 srcNode\u4e0a\u7684\u8282\u70b9\u7684\u5c5e\u6027\u4f5c\u4e3a\u63a7\u4ef6\u7684\u914d\u7f6e\u4fe1\u606f
     *  - \u9ed8\u8ba4id,name,value,title \u90fd\u4f1a\u4f5c\u4e3a\u5c5e\u6027\u4f20\u5165
     *  - \u4f7f\u7528 'data-cfg' \u4f5c\u4e3a\u6574\u4f53\u7684\u914d\u7f6e\u5c5e\u6027
     *  <pre><code>
     *     <input id="c1" type="text" name="txtName" id="id",data-cfg="{allowBlank:false}" />
     *     //\u4f1a\u751f\u6210\u4ee5\u4e0b\u914d\u7f6e\u9879\uff1a
     *     {
     *         name : 'txtName',
     *         id : 'id',
     *         allowBlank:false
     *     }
     *     new Form.Field({
     *        src:'#c1'
     *     }).render();
     *  </code></pre>
     * @type {Object}
     * @protected
     */
    decorateCfgFields : {
      value : {
        'id' : true,
        'name' : true,
        'value' : true,
        'title' : true
      }
    }
  };

  decorate.prototype = {

    /**
     * \u83b7\u53d6\u63a7\u4ef6\u7684\u914d\u7f6e\u4fe1\u606f
     * @protected
     */
    getDecorateConfig : function(el){
      if(!el.length){
        return null;
      }
      var _self = this,
        dom = el[0],
        attributes = dom.attributes,
        decorateCfgFields = _self.get('decorateCfgFields'),
        config = {},
        statusCfg = _self._getStautsCfg(el);

      BUI.each(attributes,function(attr){
        var name = attr.nodeName;
        try{
          if(name === FIELD_CFG){
              var cfg = parseFieldValue(attr.nodeValue);
              BUI.mix(config,cfg);
          }
          else if(isConfigField(name,decorateCfgFields)){
            name = name.replace(FIELD_PREFIX,'');
            config[name] = parseFieldValue(attr.nodeValue);
          }
        }catch(e){
          BUI.log('parse field error,the attribute is:' + name);
        }
      });
      return BUI.mix(config,statusCfg);
    },
    //\u6839\u636ecss class\u83b7\u53d6\u72b6\u6001\u5c5e\u6027
    //\u5982\uff1a selected,disabled\u7b49\u5c5e\u6027
    _getStautsCfg : function(el){
      var _self = this,
        rst = {},
        statusCls = _self.get('statusCls');
      BUI.each(statusCls,function(v,k){
        if(el.hasClass(v)){
          rst[k] = true;
        }
      });
      return rst;
    },
    /**
     * \u83b7\u53d6\u5c01\u88c5\u6210\u5b50\u63a7\u4ef6\u7684\u8282\u70b9\u96c6\u5408
     * @protected
     * @return {Array} \u8282\u70b9\u96c6\u5408
     */
    getDecorateElments : function(){
      var _self = this,
        el = _self.get('el'),
        contentContainer = _self.get('childContainer');
      if(contentContainer){
        return el.find(contentContainer).children();
      }else{
        return el.children();
      }
    },

    /**
     * \u5c01\u88c5\u6240\u6709\u7684\u5b50\u63a7\u4ef6
     * @protected
     * @param {jQuery} el Root element of current component.
     */
    decorateInternal: function (el) {
      var self = this;
      self.decorateChildren(el);
    },
    /**
     * \u83b7\u53d6\u5b50\u63a7\u4ef6\u7684xclass\u7c7b\u578b
     * @protected
     * @param {jQuery} \u5b50\u63a7\u4ef6\u7684\u6839\u8282\u70b9
     */
    findXClassByNode: function (childNode, ignoreError) {
      var _self = this,
        cls = childNode.attr("class") || '',
        childClass = _self.get('defaultChildClass'); //\u5982\u679c\u6ca1\u6709\u6837\u5f0f\u6216\u8005\u67e5\u627e\u4e0d\u5230\u5bf9\u5e94\u7684\u7c7b\uff0c\u4f7f\u7528\u9ed8\u8ba4\u7684\u5b50\u63a7\u4ef6\u7c7b\u578b

          // \u8fc7\u6ee4\u6389\u7279\u5b9a\u524d\u7f00
      cls = cls.replace(new RegExp("\\b" + prefixCls, "ig"), "");

      var UI = Manager.getConstructorByXClass(cls) ||  Manager.getConstructorByXClass(childClass);

      if (!UI && !ignoreError) {
        BUI.log(childNode);
        BUI.error("can not find ui " + cls + " from this markup");
      }
      return Manager.getXClassByConstructor(UI);
    },
    // \u751f\u6210\u4e00\u4e2a\u7ec4\u4ef6
    decorateChildrenInternal: function (xclass, c) {
      var _self = this,
        children = _self.get('children');
      children.push({
        xclass : xclass,
        srcNode: c
      });
    },
    /**
     * \u5c01\u88c5\u5b50\u63a7\u4ef6
     * @private
     * @param {jQuery} el component's root element.
     */
    decorateChildren: function (el) {
      var _self = this,
          children = _self.getDecorateElments();
      BUI.each(children,function(c){
        var xclass = _self.findXClassByNode($(c));
        _self.decorateChildrenInternal(xclass, $(c));
      });
    }
  };

  return decorate;
});
define('bui/component/uibase/tpl',function () {

  /**
   * @private
   * \u63a7\u4ef6\u6a21\u677f\u6269\u5c55\u7c7b\u7684\u6e32\u67d3\u7c7b(view)
   * @class BUI.Component.UIBase.TplView
   */
  function tplView () {
    
  }

  tplView.ATTRS = {
    /**
     * \u6a21\u677f
     * @protected
     * @type {String}
     */
    tpl:{

    },
    tplEl : {

    }
  };

  tplView.prototype = {
    __renderUI : function(){
      var _self = this,
        contentContainer = _self.get('childContainer'),
        contentEl;

      if(contentContainer){
        contentEl = _self.get('el').find(contentContainer);
        if(contentEl.length){
          _self.set('contentEl',contentEl);
        }
      }
    },
    /**
     * \u83b7\u53d6\u751f\u6210\u63a7\u4ef6\u7684\u6a21\u677f
     * @protected
     * @param  {Object} attrs \u5c5e\u6027\u503c
     * @return {String} \u6a21\u677f
     */
    getTpl:function (attrs) {
        var _self = this,
            tpl = _self.get('tpl'),
            tplRender = _self.get('tplRender');
        attrs = attrs || _self.getAttrVals();

        if(tplRender){
          return tplRender(attrs);
        }
        if(tpl){
          return BUI.substitute(tpl,attrs);
        }
        return '';
    },
    /**
     * \u5982\u679c\u63a7\u4ef6\u8bbe\u7f6e\u4e86\u6a21\u677f\uff0c\u5219\u6839\u636e\u6a21\u677f\u548c\u5c5e\u6027\u503c\u751f\u6210DOM
     * \u5982\u679c\u8bbe\u7f6e\u4e86content\u5c5e\u6027\uff0c\u6b64\u6a21\u677f\u4e0d\u5e94\u7528
     * @protected
     * @param  {Object} attrs \u5c5e\u6027\u503c\uff0c\u9ed8\u8ba4\u4e3a\u521d\u59cb\u5316\u65f6\u4f20\u5165\u7684\u503c
     */
    setTplContent:function (attrs) {
        var _self = this,
            el = _self.get('el'),
            content = _self.get('content'),
            tplEl = _self.get('tplEl'),
            tpl = _self.getTpl(attrs);

        //tplEl.remove();
        if(!content && tpl){ //\u66ff\u6362\u6389\u539f\u5148\u7684\u5185\u5bb9
          //el.empty();//el.html(tpl);
          if(tplEl){
            var node = $(tpl).insertBefore(tplEl);
            tplEl.remove();
            tplEl = node;
          }else{
            tplEl = $(tpl).appendTo(el);
          }
          _self.set('tplEl',tplEl)
          
        }
    }
  }

  /**
   * \u63a7\u4ef6\u7684\u6a21\u677f\u6269\u5c55
   * @class BUI.Component.UIBase.Tpl
   */
  function tpl() {

  }

  tpl.ATTRS = {
    /**
    * \u63a7\u4ef6\u7684\u6a21\u7248\uff0c\u7528\u4e8e\u521d\u59cb\u5316
    * <pre><code>
    * var list = new List.List({
    *   tpl : '&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;',
    *   childContainer : 'ul'
    * });
    * //\u7528\u4e8e\u7edf\u4e00\u5b50\u63a7\u4ef6\u6a21\u677f
    * var list = new List.List({
    *   defaultChildCfg : {
    *     tpl : '&lt;span&gt;{text}&lt;/span&gt;'
    *   }
    * });
    * list.render();
    * </code></pre>
    * @cfg {String} tpl
    */
    /**
     * \u63a7\u4ef6\u7684\u6a21\u677f
     * <pre><code>
     *   list.set('tpl','&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;&lt;div class="bottom"&gt;&lt;/div&gt;')
     * </code></pre>
     * @type {String}
     */
    tpl : {
      view : true,
      sync: false
    },
    /**
     * <p>\u63a7\u4ef6\u7684\u6e32\u67d3\u51fd\u6570\uff0c\u5e94\u5bf9\u4e00\u4e9b\u7b80\u5355\u6a21\u677f\u89e3\u51b3\u4e0d\u4e86\u7684\u95ee\u9898\uff0c\u4f8b\u5982\u6709if,else\u903b\u8f91\uff0c\u6709\u5faa\u73af\u903b\u8f91,
     * \u51fd\u6570\u539f\u578b\u662ffunction(data){},\u5176\u4e2ddata\u662f\u63a7\u4ef6\u7684\u5c5e\u6027\u503c</p>
     * <p>\u63a7\u4ef6\u6a21\u677f\u7684\u52a0\u5f3a\u6a21\u5f0f\uff0c\u6b64\u5c5e\u6027\u4f1a\u8986\u76d6@see {BUI.Component.UIBase.Tpl#property-tpl}\u5c5e\u6027</p>
     * //\u7528\u4e8e\u7edf\u4e00\u5b50\u63a7\u4ef6\u6a21\u677f
     * var list = new List.List({
     *   defaultChildCfg : {
     *     tplRender : funciton(item){
     *       if(item.type == '1'){
     *         return 'type1 html';
     *       }else{
     *         return 'type2 html';
     *       }
     *     }
     *   }
     * });
     * list.render();
     * @cfg {Function} tplRender
     */
    tplRender : {
      view : true,
      value : null
    },
    /**
     * \u8fd9\u662f\u4e00\u4e2a\u9009\u62e9\u5668\uff0c\u4f7f\u7528\u4e86\u6a21\u677f\u540e\uff0c\u5b50\u63a7\u4ef6\u53ef\u80fd\u4f1a\u6dfb\u52a0\u5230\u6a21\u677f\u5bf9\u5e94\u7684\u4f4d\u7f6e,
     *  - \u9ed8\u8ba4\u4e3anull,\u6b64\u65f6\u5b50\u63a7\u4ef6\u4f1a\u5c06\u63a7\u4ef6\u6700\u5916\u5c42 el \u4f5c\u4e3a\u5bb9\u5668
     * <pre><code>
     * var list = new List.List({
     *   tpl : '&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;',
     *   childContainer : 'ul'
     * });
     * </code></pre>
     * @cfg {String} childContainer
     */
    childContainer : {
      view : true
    }
  };

  tpl.prototype = {

    __renderUI : function () {
      //\u4f7f\u7528srcNode\u65f6\uff0c\u4e0d\u4f7f\u7528\u6a21\u677f
      if(!this.get('srcNode')){
        this.setTplContent();
      }
    },
    /**
     * \u63a7\u4ef6\u4fe1\u606f\u53d1\u751f\u6539\u53d8\u65f6\uff0c\u63a7\u4ef6\u5185\u5bb9\u8ddf\u6a21\u677f\u76f8\u5173\u65f6\u9700\u8981\u8c03\u7528\u8fd9\u4e2a\u51fd\u6570\uff0c
     * \u91cd\u65b0\u901a\u8fc7\u6a21\u677f\u548c\u63a7\u4ef6\u4fe1\u606f\u6784\u9020\u5185\u5bb9
     */
    updateContent : function(){
      this.setTplContent();
    },
    /**
     * \u6839\u636e\u63a7\u4ef6\u7684\u5c5e\u6027\u548c\u6a21\u677f\u751f\u6210\u63a7\u4ef6\u5185\u5bb9
     * @protected
     */
    setTplContent : function () {
      var _self = this,
        attrs = _self.getAttrVals();
      _self.get('view').setTplContent(attrs);
    },
    //\u6a21\u677f\u53d1\u751f\u6539\u53d8
    _uiSetTpl : function(){
      this.setTplContent();
    }
  };


  tpl.View = tplView;

  return tpl;
});
 


define('bui/component/uibase/collapseable',function () {

  /**
  * \u63a7\u4ef6\u5c55\u5f00\u6298\u53e0\u7684\u89c6\u56fe\u7c7b
  * @class BUI.Component.UIBase.CollapseableView
  * @private
  */
  var collapseableView = function(){
  
  };

  collapseableView.ATTRS = {
    collapsed : {}
  }

  collapseableView.prototype = {
    //\u8bbe\u7f6e\u6536\u7f29\u6837\u5f0f
    _uiSetCollapsed : function(v){
      var _self = this,
        cls = _self.getStatusCls('collapsed'),
        el = _self.get('el');
      if(v){
        el.addClass(cls);
      }else{
        el.removeClass(cls);
      }
    }
  }
  /**
   * \u63a7\u4ef6\u5c55\u5f00\u6298\u53e0\u7684\u6269\u5c55
   * @class BUI.Component.UIBase.Collapseable
   */
  var collapseable = function(){
    
  };

  collapseable.ATTRS = {
    /**
     * \u662f\u5426\u53ef\u6298\u53e0
     * @type {Boolean}
     */
    collapseable: {
      value : false
    },
    /**
     * \u662f\u5426\u5df2\u7ecf\u6298\u53e0 collapsed
     * @cfg {Boolean} collapsed
     */
    /**
     * \u662f\u5426\u5df2\u7ecf\u6298\u53e0
     * @type {Boolean}
     */
    collapsed : {
      view : true,
      value : false
    },
    events : {
      value : {
        /**
         * \u63a7\u4ef6\u5c55\u5f00
         * @event
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {BUI.Component.Controller} target \u63a7\u4ef6
         */
        'expanded' : true,
        /**
         * \u63a7\u4ef6\u6298\u53e0
         * @event
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {BUI.Component.Controller} target \u63a7\u4ef6
         */
        'collapsed' : true
      }
    }
  };

  collapseable.prototype = {
    _uiSetCollapsed : function(v){
      var _self = this;
      if(v){
        _self.fire('collapsed');
      }else{
        _self.fire('expanded');
      }
    }
  };

  collapseable.View = collapseableView;
  
  return collapseable;
});
define('bui/component/uibase/selection',function () {
    var 
        SINGLE_SELECTED = 'single';

    /**
     * @class BUI.Component.UIBase.Selection
     * \u9009\u4e2d\u63a7\u4ef6\u4e2d\u7684\u9879\uff08\u5b50\u5143\u7d20\u6216\u8005DOM\uff09\uff0c\u6b64\u7c7b\u9009\u62e9\u7684\u5185\u5bb9\u67092\u79cd
     * <ol>
     *     <li>\u5b50\u63a7\u4ef6</li>
     *     <li>DOM\u5143\u7d20</li>
     * </ol>
     * ** \u5f53\u9009\u62e9\u662f\u5b50\u63a7\u4ef6\u65f6\uff0celement \u548c item \u90fd\u662f\u6307 \u5b50\u63a7\u4ef6\uff1b**
     * ** \u5f53\u9009\u62e9\u7684\u662fDOM\u5143\u7d20\u65f6\uff0celement \u6307DOM\u5143\u7d20\uff0citem \u6307DOM\u5143\u7d20\u5bf9\u5e94\u7684\u8bb0\u5f55 **
     * @abstract
     */
    var selection = function(){

    };

    selection.ATTRS = 
    /**
     * @lends BUI.Component.UIBase.Selection#
     * @ignore
     */
    {
        /**
         * \u9009\u4e2d\u7684\u4e8b\u4ef6
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value',
         *   selectedEvent : 'mouseenter',
         *   render : '#t1',
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         * </code></pre>
         * @cfg {String} [selectedEvent = 'click']
         */
        selectedEvent:{
            value : 'click'
        },
        events : {
            value : {
                /**
                   * \u9009\u4e2d\u7684\u83dc\u5355\u6539\u53d8\u65f6\u53d1\u751f\uff0c
                   * \u591a\u9009\u65f6\uff0c\u9009\u4e2d\uff0c\u53d6\u6d88\u9009\u4e2d\u90fd\u89e6\u53d1\u6b64\u4e8b\u4ef6\uff0c\u5355\u9009\u65f6\uff0c\u53ea\u6709\u9009\u4e2d\u65f6\u89e6\u53d1\u6b64\u4e8b\u4ef6
                   * @name  BUI.Component.UIBase.Selection#selectedchange
                   * @event
                   * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                   * @param {Object} e.item \u5f53\u524d\u9009\u4e2d\u7684\u9879
                   * @param {HTMLElement} e.domTarget \u5f53\u524d\u9009\u4e2d\u7684\u9879\u7684DOM\u7ed3\u6784
                   * @param {Boolean} e.selected \u662f\u5426\u9009\u4e2d
                   */
                'selectedchange' : false,

                /**
                   * \u9009\u62e9\u6539\u53d8\u524d\u89e6\u53d1\uff0c\u53ef\u4ee5\u901a\u8fc7return false\uff0c\u963b\u6b62selectedchange\u4e8b\u4ef6
                   * @event
                   * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                   * @param {Object} e.item \u5f53\u524d\u9009\u4e2d\u7684\u9879
                   * @param {Boolean} e.selected \u662f\u5426\u9009\u4e2d
                   */
                'beforeselectedchange' : false,

                /**
                   * \u83dc\u5355\u9009\u4e2d
                   * @event
                   * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                   * @param {Object} e.item \u5f53\u524d\u9009\u4e2d\u7684\u9879
                   * @param {HTMLElement} e.domTarget \u5f53\u524d\u9009\u4e2d\u7684\u9879\u7684DOM\u7ed3\u6784
                   */
                'itemselected' : false,
                /**
                   * \u83dc\u5355\u53d6\u6d88\u9009\u4e2d
                   * @event
                   * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                   * @param {Object} e.item \u5f53\u524d\u9009\u4e2d\u7684\u9879
                   * @param {HTMLElement} e.domTarget \u5f53\u524d\u9009\u4e2d\u7684\u9879\u7684DOM\u7ed3\u6784
                   */
                'itemunselected' : false
            }
        },
        /**
         * \u6570\u636e\u7684id\u5b57\u6bb5\u540d\u79f0\uff0c\u901a\u8fc7\u6b64\u5b57\u6bb5\u67e5\u627e\u5bf9\u5e94\u7684\u6570\u636e
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value',
         *   render : '#t1',
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         * </code></pre>
         * @cfg {String} [idField = 'id']
         */
        /**
         * \u6570\u636e\u7684id\u5b57\u6bb5\u540d\u79f0\uff0c\u901a\u8fc7\u6b64\u5b57\u6bb5\u67e5\u627e\u5bf9\u5e94\u7684\u6570\u636e
         * @type {String}
         * @ignore
         */
        idField : {
            value : 'id'
        },
        /**
         * \u662f\u5426\u591a\u9009
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value',
         *   render : '#t1',
         *   multipleSelect : true,
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         * </code></pre>
         * @cfg {Boolean} [multipleSelect=false]
         */
        /**
         * \u662f\u5426\u591a\u9009
         * @type {Boolean}
         * @default false
         */
        multipleSelect : {
            value : false
        }

    };

    selection.prototype = 
    /**
     * @lends BUI.Component.UIBase.Selection.prototype
     * @ignore
     */
    {
        /**
         * \u6e05\u7406\u9009\u4e2d\u7684\u9879
         * <pre><code>
         *  list.clearSelection();
         * </code></pre>
         *
         */
        clearSelection : function(){
            var _self = this,
                selection = _self.getSelection();
            BUI.each(selection,function(item){
                _self.clearSelected(item);
            });
        },
        /**
         * \u83b7\u53d6\u9009\u4e2d\u7684\u9879\u7684\u503c
         * @template
         * @return {Array} 
         */
        getSelection : function(){

        },
        /**
         * \u83b7\u53d6\u9009\u4e2d\u7684\u7b2c\u4e00\u9879
         * <pre><code>
         * var item = list.getSelected(); //\u591a\u9009\u6a21\u5f0f\u4e0b\u7b2c\u4e00\u6761
         * </code></pre>
         * @return {Object} \u9009\u4e2d\u7684\u7b2c\u4e00\u9879\u6216\u8005\u4e3aundefined
         */
        getSelected : function(){
            return this.getSelection()[0];
        },
        /**
         * \u6839\u636e idField \u83b7\u53d6\u5230\u7684\u503c
         * @protected
         * @return {Object} \u9009\u4e2d\u7684\u503c
         */
        getSelectedValue : function(){
            var _self = this,
                field = _self.get('idField'),
                item = _self.getSelected();

            return _self.getValueByField(item,field);
        },
        /**
         * \u83b7\u53d6\u9009\u4e2d\u7684\u503c\u96c6\u5408
         * @protected
         * @return {Array} \u9009\u4e2d\u503c\u5f97\u96c6\u5408
         */
        getSelectionValues:function(){
            var _self = this,
                field = _self.get('idField'),
                items = _self.getSelection();
            return $.map(items,function(item){
                return _self.getValueByField(item,field);
            });
        },
        /**
         * \u83b7\u53d6\u9009\u4e2d\u7684\u6587\u672c
         * @protected
         * @return {Array} \u9009\u4e2d\u7684\u6587\u672c\u96c6\u5408
         */
        getSelectionText:function(){
            var _self = this,
                items = _self.getSelection();
            return $.map(items,function(item){
                return _self.getItemText(item);
            });
        },
        /**
         * \u79fb\u9664\u9009\u4e2d
         * <pre><code>
         *    var item = list.getItem('id'); //\u901a\u8fc7id \u83b7\u53d6\u9009\u9879
         *    list.setSelected(item); //\u9009\u4e2d
         *
         *    list.clearSelected();//\u5355\u9009\u6a21\u5f0f\u4e0b\u6e05\u9664\u6240\u9009\uff0c\u591a\u9009\u6a21\u5f0f\u4e0b\u6e05\u9664\u9009\u4e2d\u7684\u7b2c\u4e00\u9879
         *    list.clearSelected(item); //\u6e05\u9664\u9009\u9879\u7684\u9009\u4e2d\u72b6\u6001
         * </code></pre>
         * @param {Object} [item] \u6e05\u9664\u9009\u9879\u7684\u9009\u4e2d\u72b6\u6001\uff0c\u5982\u679c\u672a\u6307\u5b9a\u5219\u6e05\u9664\u9009\u4e2d\u7684\u7b2c\u4e00\u4e2a\u9009\u9879\u7684\u9009\u4e2d\u72b6\u6001
         */
        clearSelected : function(item){
            var _self = this;
            item = item || _self.getSelected();
            if(item){
                _self.setItemSelected(item,false);
            } 
        },
        /**
         * \u83b7\u53d6\u9009\u9879\u663e\u793a\u7684\u6587\u672c
         * @protected
         */
        getSelectedText : function(){
            var _self = this,
                item = _self.getSelected();
            return _self.getItemText(item);
        },
        /**
         * \u8bbe\u7f6e\u9009\u4e2d\u7684\u9879
         * <pre><code>
         *  var items = list.getItemsByStatus('active'); //\u83b7\u53d6\u67d0\u79cd\u72b6\u6001\u7684\u9009\u9879
         *  list.setSelection(items);
         * </code></pre>
         * @param {Array} items \u9879\u7684\u96c6\u5408
         */
        setSelection: function(items){
            var _self = this;

            items = BUI.isArray(items) ? items : [items];

            BUI.each(items,function(item){
                _self.setSelected(item);
            }); 
        },
        /**
         * \u8bbe\u7f6e\u9009\u4e2d\u7684\u9879
         * <pre><code>
         *   var item = list.getItem('id');
         *   list.setSelected(item);
         * </code></pre>
         * @param {Object} item \u8bb0\u5f55\u6216\u8005\u5b50\u63a7\u4ef6
         */
        setSelected: function(item){
            var _self = this,
                multipleSelect = _self.get('multipleSelect');

            if(!_self.isItemSelectable(item)){
                return;
            }    
            if(!multipleSelect){
                var selectedItem = _self.getSelected();
                if(item != selectedItem){
                    //\u5982\u679c\u662f\u5355\u9009\uff0c\u6e05\u9664\u5df2\u7ecf\u9009\u4e2d\u7684\u9879
                    _self.clearSelected(selectedItem);
                }
               
            }
            _self.setItemSelected(item,true);
            
        },
        /**
         * \u9009\u9879\u662f\u5426\u88ab\u9009\u4e2d
         * @template
         * @param  {*}  item \u9009\u9879
         * @return {Boolean}  \u662f\u5426\u9009\u4e2d
         */
        isItemSelected : function(item){

        },
        /**
         * \u9009\u9879\u662f\u5426\u53ef\u4ee5\u9009\u4e2d
         * @protected
         * @param {*} item \u9009\u9879
         * @return {Boolean} \u9009\u9879\u662f\u5426\u53ef\u4ee5\u9009\u4e2d
         */
        isItemSelectable : function(item){
          return true;
        },
        /**
         * \u8bbe\u7f6e\u9009\u9879\u7684\u9009\u4e2d\u72b6\u6001
         * @param {*} item \u9009\u9879
         * @param {Boolean} selected \u9009\u4e2d\u6216\u8005\u53d6\u6d88\u9009\u4e2d
         * @protected
         */
        setItemSelected : function(item,selected){
            var _self = this,
                isSelected;
            
            //\u5f53\u524d\u72b6\u6001\u7b49\u4e8e\u8981\u8bbe\u7f6e\u7684\u72b6\u6001\u65f6\uff0c\u4e0d\u89e6\u53d1\u6539\u53d8\u4e8b\u4ef6
            if(item){
                isSelected =  _self.isItemSelected(item);
                if(isSelected == selected){
                    return;
                }
            }
            if(_self.fire('beforeselectedchange',{item : item,selected : selected}) !== false){
                _self.setItemSelectedStatus(item,selected);
            }
        },
        /**
         * \u8bbe\u7f6e\u9009\u9879\u7684\u9009\u4e2d\u72b6\u6001
         * @template
         * @param {*} item \u9009\u9879
         * @param {Boolean} selected \u9009\u4e2d\u6216\u8005\u53d6\u6d88\u9009\u4e2d
         * @protected
         */
        setItemSelectedStatus : function(item,selected){

        },
        /**
         * \u8bbe\u7f6e\u6240\u6709\u9009\u9879\u9009\u4e2d
         * <pre><code>
         *  list.setAllSelection(); //\u9009\u4e2d\u5168\u90e8\uff0c\u591a\u9009\u72b6\u6001\u4e0b\u6709\u6548
         * </code></pre>
         * @template
         */
        setAllSelection : function(){
          
        },
        /**
         * \u8bbe\u7f6e\u9879\u9009\u4e2d\uff0c\u901a\u8fc7\u5b57\u6bb5\u548c\u503c
         * @param {String} field \u5b57\u6bb5\u540d,\u9ed8\u8ba4\u4e3a\u914d\u7f6e\u9879'idField',\u6240\u4ee5\u6b64\u5b57\u6bb5\u53ef\u4ee5\u4e0d\u586b\u5199\uff0c\u4ec5\u586b\u5199\u503c
         * @param {Object} value \u503c
         * @example
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{id}"&gt;{text}&lt;/li&gt;',
         *   idField : 'id', //id \u5b57\u6bb5\u4f5c\u4e3akey
         *   render : '#t1',
         *   items : [{id : '1',text : '1'},{id : '2',text : '2'}]
         * });
         *
         *   list.setSelectedByField('123'); //\u9ed8\u8ba4\u6309\u7167id\u5b57\u6bb5\u67e5\u627e
         *   //\u6216\u8005
         *   list.setSelectedByField('id','123');
         *
         *   list.setSelectedByField('value','123');
         * </code></pre>
         */
        setSelectedByField:function(field,value){
            if(!value){
                value = field;
                field = this.get('idField');
            }
            var _self = this,
                item = _self.findItemByField(field,value);
            _self.setSelected(item);
        },
        /**
         * \u8bbe\u7f6e\u591a\u4e2a\u9009\u4e2d\uff0c\u6839\u636e\u5b57\u6bb5\u548c\u503c
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value', //value \u5b57\u6bb5\u4f5c\u4e3akey
         *   render : '#t1',
         *   multipleSelect : true,
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         *   var values = ['1','2','3'];
         *   list.setSelectionByField(values);//
         *
         *   //\u7b49\u4e8e
         *   list.setSelectionByField('value',values);
         * </code></pre>
         * @param {String} field \u9ed8\u8ba4\u4e3aidField
         * @param {Array} values \u503c\u5f97\u96c6\u5408
         */
        setSelectionByField:function(field,values){
            if(!values){
                values = field;
                field = this.get('idField');
            }
            var _self = this;
            BUI.each(values,function(value){
                _self.setSelectedByField(field,value);
            });   
        },
        /**
         * \u9009\u4e2d\u5b8c\u6210\u540e\uff0c\u89e6\u53d1\u4e8b\u4ef6
         * @protected
         * @param  {*} item \u9009\u9879
         * @param  {Boolean} selected \u662f\u5426\u9009\u4e2d
         * @param  {jQuery} element 
         */
        afterSelected : function(item,selected,element){
            var _self = this;

            if(selected){
                _self.fire('itemselected',{item:item,domTarget:element});
                _self.fire('selectedchange',{item:item,domTarget:element,selected:selected});
            }else{
                _self.fire('itemunselected',{item:item,domTarget:element});
                if(_self.get('multipleSelect')){ //\u53ea\u6709\u5f53\u591a\u9009\u65f6\uff0c\u53d6\u6d88\u9009\u4e2d\u624d\u89e6\u53d1selectedchange
                    _self.fire('selectedchange',{item:item,domTarget:element,selected:selected});
                } 
            } 
        }

    }
    
    return selection;
});
define('bui/component/uibase/list',['bui/component/uibase/selection'],function (require) {
  
  var Selection = require('bui/component/uibase/selection');

  /**
   * \u5217\u8868\u4e00\u7c7b\u7684\u63a7\u4ef6\u7684\u6269\u5c55\uff0clist,menu,grid\u90fd\u662f\u53ef\u4ee5\u4ece\u6b64\u7c7b\u6269\u5c55
   * @class BUI.Component.UIBase.List
   */
  var list = function(){

  };

  list.ATTRS = {

    /**
     * \u9009\u62e9\u7684\u6570\u636e\u96c6\u5408
     * <pre><code>
     * var list = new List.SimpleList({
     *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
     *   idField : 'value',
     *   render : '#t1',
     *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
     * });
     * list.render();
     * </code></pre>
     * @cfg {Array} items
     */
    /**
     * \u9009\u62e9\u7684\u6570\u636e\u96c6\u5408
     * <pre><code>
     *  list.set('items',items); //\u5217\u8868\u4f1a\u76f4\u63a5\u66ff\u6362\u5185\u5bb9
     *  //\u7b49\u540c\u4e8e 
     *  list.clearItems();
     *  list.addItems(items);
     * </code></pre>
     * @type {Array}
     */
    items:{
      view : true
    },
    /**
     * \u9009\u9879\u7684\u9ed8\u8ba4key\u503c
     * @cfg {String} [idField = 'id']
     */
    idField : {
      value : 'id'
    },
    /**
     * \u5217\u8868\u9879\u7684\u9ed8\u8ba4\u6a21\u677f,\u4ec5\u5728\u521d\u59cb\u5316\u65f6\u4f20\u5165\u3002
     * @type {String}
     * @ignore
     */
    itemTpl : {
      view : true
    },
    /**
     * \u5217\u8868\u9879\u7684\u6e32\u67d3\u51fd\u6570\uff0c\u5e94\u5bf9\u5217\u8868\u9879\u4e4b\u95f4\u6709\u5f88\u591a\u5dee\u5f02\u65f6
     * <pre><code>
     * var list = new List.SimpleList({
     *   itemTplRender : function(item){
     *     if(item.type == '1'){
     *       return '&lt;li&gt;&lt;img src="xxx.jpg"/&gt;'+item.text+'&lt;/li&gt;'
     *     }else{
     *       return '&lt;li&gt;item.text&lt;/li&gt;'
     *     }
     *   },
     *   idField : 'value',
     *   render : '#t1',
     *   items : [{value : '1',text : '1',type : '0'},{value : '2',text : '2',type : '1'}]
     * });
     * list.render();
     * </code></pre>
     * @type {Function}
     */
    itemTplRender : {
      view : true
    },
    /**
     * \u5b50\u63a7\u4ef6\u5404\u4e2a\u72b6\u6001\u9ed8\u8ba4\u91c7\u7528\u7684\u6837\u5f0f
     * <pre><code>
     * var list = new List.SimpleList({
     *   render : '#t1',
     *   itemStatusCls : {
     *     selected : 'active', //\u9ed8\u8ba4\u6837\u5f0f\u4e3alist-item-selected,\u73b0\u5728\u53d8\u6210'active'
     *     hover : 'hover' //\u9ed8\u8ba4\u6837\u5f0f\u4e3alist-item-hover,\u73b0\u5728\u53d8\u6210'hover'
     *   },
     *   items : [{id : '1',text : '1',type : '0'},{id : '2',text : '2',type : '1'}]
     * });
     * list.render();
     * </code></pre>
     * see {@link BUI.Component.Controller#property-statusCls}
     * @type {Object}
     */
    itemStatusCls : {
      view : true,
      value : {}
    },
    events : {

      value : {
        /**
         * \u9009\u9879\u70b9\u51fb\u4e8b\u4ef6
         * @event
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {BUI.Component.UIBase.ListItem} e.item \u70b9\u51fb\u7684\u9009\u9879
         * @param {HTMLElement} e.element \u9009\u9879\u4ee3\u8868\u7684DOM\u5bf9\u8c61
         * @param {HTMLElement} e.domTarget \u70b9\u51fb\u7684DOM\u5bf9\u8c61
         * @param {HTMLElement} e.domEvent \u70b9\u51fb\u7684\u539f\u751f\u4e8b\u4ef6\u5bf9\u8c61
         */
        'itemclick' : true
      }  
    }
  };

  list.prototype = {

    /**
     * \u83b7\u53d6\u9009\u9879\u7684\u6570\u91cf
     * <pre><code>
     *   var count = list.getItemCount();
     * </code></pre>
     * @return {Number} \u9009\u9879\u6570\u91cf
     */
    getItemCount : function () {
        return this.getItems().length;
    },
    /**
     * \u83b7\u53d6\u5b57\u6bb5\u7684\u503c
     * @param {*} item \u5b57\u6bb5\u540d
     * @param {String} field \u5b57\u6bb5\u540d
     * @return {*} \u5b57\u6bb5\u7684\u503c
     * @protected
     */
    getValueByField : function(item,field){

    },
    /**
     * \u83b7\u53d6\u6240\u6709\u9009\u9879\u503c\uff0c\u5982\u679c\u9009\u9879\u662f\u5b50\u63a7\u4ef6\uff0c\u5219\u662f\u6240\u6709\u5b50\u63a7\u4ef6
     * <pre><code>
     *   var items = list.getItems();
     *   //\u7b49\u540c
     *   list.get(items);
     * </code></pre>
     * @return {Array} \u9009\u9879\u503c\u96c6\u5408
     */
    getItems : function () {
      
    },
    /**
     * \u83b7\u53d6\u7b2c\u4e00\u9879
     * <pre><code>
     *   var item = list.getFirstItem();
     *   //\u7b49\u540c
     *   list.getItemAt(0);
     * </code></pre>
     * @return {Object|BUI.Component.Controller} \u9009\u9879\u503c\uff08\u5b50\u63a7\u4ef6\uff09
     */
    getFirstItem : function () {
      return this.getItemAt(0);
    },
    /**
     * \u83b7\u53d6\u6700\u540e\u4e00\u9879
     * <pre><code>
     *   var item = list.getLastItem();
     *   //\u7b49\u540c
     *   list.getItemAt(list.getItemCount()-1);
     * </code></pre>
     * @return {Object|BUI.Component.Controller} \u9009\u9879\u503c\uff08\u5b50\u63a7\u4ef6\uff09
     */
    getLastItem : function () {
      return this.getItemAt(this.getItemCount() - 1);
    },
    /**
     * \u901a\u8fc7\u7d22\u5f15\u83b7\u53d6\u9009\u9879\u503c\uff08\u5b50\u63a7\u4ef6\uff09
     * <pre><code>
     *   var item = list.getItemAt(0); //\u83b7\u53d6\u7b2c1\u4e2a
     *   var item = list.getItemAt(2); //\u83b7\u53d6\u7b2c3\u4e2a
     * </code></pre>
     * @param  {Number} index \u7d22\u5f15\u503c
     * @return {Object|BUI.Component.Controller}  \u9009\u9879\uff08\u5b50\u63a7\u4ef6\uff09
     */
    getItemAt : function  (index) {
      return this.getItems()[index] || null;
    },
    /**
     * \u901a\u8fc7Id\u83b7\u53d6\u9009\u9879\uff0c\u5982\u679c\u662f\u6539\u53d8\u4e86idField\u5219\u901a\u8fc7\u6539\u53d8\u7684idField\u6765\u67e5\u627e\u9009\u9879
     * <pre><code>
     *   //\u5982\u679cidField = 'id'
     *   var item = list.getItem('2'); 
     *   //\u7b49\u540c\u4e8e
     *   list.findItemByField('id','2');
     *
     *   //\u5982\u679cidField = 'value'
     *   var item = list.getItem('2'); 
     *   //\u7b49\u540c\u4e8e
     *   list.findItemByField('value','2');
     * </code></pre>
     * @param {String} id \u7f16\u53f7
     * @return {Object|BUI.Component.Controller} \u9009\u9879\uff08\u5b50\u63a7\u4ef6\uff09
     */
    getItem : function(id){
      var field = this.get('idField');
      return this.findItemByField(field,id);
    },
    /**
     * \u8fd4\u56de\u6307\u5b9a\u9879\u7684\u7d22\u5f15
     * <pre><code>
     * var index = list.indexOf(item); //\u8fd4\u56de\u7d22\u5f15\uff0c\u4e0d\u5b58\u5728\u5219\u8fd4\u56de-1
     * </code></pre>
     * @param  {Object|BUI.Component.Controller} \u9009\u9879
     * @return {Number}   \u9879\u7684\u7d22\u5f15\u503c
     */
    indexOfItem : function(item){
      return BUI.Array.indexOf(item,this.getItems());
    },
    /**
     * \u6dfb\u52a0\u591a\u6761\u9009\u9879
     * <pre><code>
     * var items = [{id : '1',text : '1'},{id : '2',text : '2'}];
     * list.addItems(items);
     * </code></pre>
     * @param {Array} items \u8bb0\u5f55\u96c6\u5408\uff08\u5b50\u63a7\u4ef6\u914d\u7f6e\u9879\uff09
     */
    addItems : function (items) {
      var _self = this;
      BUI.each(items,function (item) {
          _self.addItem(item);
      });
    },
    /**
     * \u63d2\u5165\u591a\u6761\u8bb0\u5f55
     * <pre><code>
     * var items = [{id : '1',text : '1'},{id : '2',text : '2'}];
     * list.addItemsAt(items,0); // \u5728\u6700\u524d\u9762\u63d2\u5165
     * list.addItemsAt(items,2); //\u7b2c\u4e09\u4e2a\u4f4d\u7f6e\u63d2\u5165
     * </code></pre>
     * @param  {Array} items \u591a\u6761\u8bb0\u5f55
     * @param  {Number} start \u8d77\u59cb\u4f4d\u7f6e
     */
    addItemsAt : function(items,start){
      var _self = this;
      BUI.each(items,function (item,index) {
        _self.addItemAt(item,start + index);
      });
    },
    /**
     * \u66f4\u65b0\u5217\u8868\u9879\uff0c\u4fee\u6539\u9009\u9879\u503c\u540e\uff0cDOM\u8ddf\u968f\u53d8\u5316
     * <pre><code>
     *   var item = list.getItem('2');
     *   list.text = '\u65b0\u5185\u5bb9'; //\u6b64\u65f6\u5bf9\u5e94\u7684DOM\u4e0d\u4f1a\u53d8\u5316
     *   list.updateItem(item); //DOM\u8fdb\u884c\u76f8\u5e94\u7684\u53d8\u5316
     * </code></pre>
     * @param  {Object} item \u9009\u9879\u503c
     */
    updateItem : function(item){

    },
    /**
     * \u6dfb\u52a0\u9009\u9879,\u6dfb\u52a0\u5728\u63a7\u4ef6\u6700\u540e
     * 
     * <pre><code>
     * list.addItem({id : '3',text : '3',type : '0'});
     * </code></pre>
     * 
     * @param {Object|BUI.Component.Controller} item \u9009\u9879\uff0c\u5b50\u63a7\u4ef6\u914d\u7f6e\u9879\u3001\u5b50\u63a7\u4ef6
     * @return {Object|BUI.Component.Controller} \u5b50\u63a7\u4ef6\u6216\u8005\u9009\u9879\u8bb0\u5f55
     */
    addItem : function (item) {
       return this.addItemAt(item,this.getItemCount());
    },
    /**
     * \u5728\u6307\u5b9a\u4f4d\u7f6e\u6dfb\u52a0\u9009\u9879
     * <pre><code>
     * list.addItemAt({id : '3',text : '3',type : '0'},0); //\u7b2c\u4e00\u4e2a\u4f4d\u7f6e
     * </code></pre>
     * @param {Object|BUI.Component.Controller} item \u9009\u9879\uff0c\u5b50\u63a7\u4ef6\u914d\u7f6e\u9879\u3001\u5b50\u63a7\u4ef6
     * @param {Number} index \u7d22\u5f15
     * @return {Object|BUI.Component.Controller} \u5b50\u63a7\u4ef6\u6216\u8005\u9009\u9879\u8bb0\u5f55
     */
    addItemAt : function(item,index) {

    },
    /**
      * \u6839\u636e\u5b57\u6bb5\u67e5\u627e\u6307\u5b9a\u7684\u9879
      * @param {String} field \u5b57\u6bb5\u540d
      * @param {Object} value \u5b57\u6bb5\u503c
      * @return {Object} \u67e5\u8be2\u51fa\u6765\u7684\u9879\uff08\u4f20\u5165\u7684\u8bb0\u5f55\u6216\u8005\u5b50\u63a7\u4ef6\uff09
      * @protected
    */
    findItemByField:function(field,value){

    },
    /**
     * 
     * \u83b7\u53d6\u6b64\u9879\u663e\u793a\u7684\u6587\u672c  
     * @param {Object} item \u83b7\u53d6\u8bb0\u5f55\u663e\u793a\u7684\u6587\u672c
     * @protected            
     */
    getItemText:function(item){

    },
    /**
     * \u6e05\u9664\u6240\u6709\u9009\u9879,\u4e0d\u7b49\u540c\u4e8e\u5220\u9664\u5168\u90e8\uff0c\u6b64\u65f6\u4e0d\u4f1a\u89e6\u53d1\u5220\u9664\u4e8b\u4ef6
     * <pre><code>
     * list.clearItems(); 
     * //\u7b49\u540c\u4e8e
     * list.set('items',items);
     * </code></pre>
     */
    clearItems : function(){
      var _self = this,
          items = _self.getItems();
      items.splice(0);
      _self.clearControl();
    },
    /**
     * \u5220\u9664\u9009\u9879
     * <pre><code>
     * var item = list.getItem('1');
     * list.removeItem(item);
     * </code></pre>
     * @param {Object|BUI.Component.Controller} item \u9009\u9879\uff08\u5b50\u63a7\u4ef6\uff09
     */
    removeItem : function (item) {

    },
    /**
     * \u79fb\u9664\u9009\u9879\u96c6\u5408
     * <pre><code>
     * var items = list.getSelection();
     * list.removeItems(items);
     * </code></pre>
     * @param  {Array} items \u9009\u9879\u96c6\u5408
     */
    removeItems : function(items){
      var _self = this;

      BUI.each(items,function(item){
          _self.removeItem(item);
      });
    },
    /**
     * \u901a\u8fc7\u7d22\u5f15\u5220\u9664\u9009\u9879
     * <pre><code>
     * list.removeItemAt(0); //\u5220\u9664\u7b2c\u4e00\u4e2a
     * </code></pre>
     * @param  {Number} index \u7d22\u5f15
     */
    removeItemAt : function (index) {
      this.removeItem(this.getItemAt(index));
    },
    /**
     * @protected
     * @template
     * \u6e05\u9664\u6240\u6709\u7684\u5b50\u63a7\u4ef6\u6216\u8005\u5217\u8868\u9879\u7684DOM
     */
    clearControl : function(){

    }
  }

  

  

  function clearSelected(item){
    if(item.selected){
        item.selected = false;
    }
    if(item.set){
        item.set('selected',false);
    }
  }

  function beforeAddItem(self,item){

    var c = item.isController ? item.getAttrVals() : item,
      defaultTpl = self.get('itemTpl'),
      defaultStatusCls = self.get('itemStatusCls'),
      defaultTplRender = self.get('itemTplRender');

    //\u914d\u7f6e\u9ed8\u8ba4\u6a21\u677f
    if(defaultTpl && !c.tpl){
      setItemAttr(item,'tpl',defaultTpl);
      //  c.tpl = defaultTpl;
    }
    //\u914d\u7f6e\u9ed8\u8ba4\u6e32\u67d3\u51fd\u6570
    if(defaultTplRender && !c.tplRender){
      setItemAttr(item,'tplRender',defaultTplRender);
      //c.tplRender = defaultTplRender;
    }
    //\u914d\u7f6e\u9ed8\u8ba4\u72b6\u6001\u6837\u5f0f
    if(defaultStatusCls){
      var statusCls = c.statusCls || item.isController ? item.get('statusCls') : {};
      BUI.each(defaultStatusCls,function(v,k){
        if(v && !statusCls[k]){
            statusCls[k] = v;
        }
      });
      setItemAttr(item,'statusCls',statusCls)
      //item.statusCls = statusCls;
    }
   // clearSelected(item);
  }
  function setItemAttr(item,name,val){
    if(item.isController){
      item.set(name,val);
    }else{
      item[name] = val;
    }
  }
  
  /**
  * @class BUI.Component.UIBase.ChildList
  * \u9009\u4e2d\u5176\u4e2d\u7684DOM\u7ed3\u6784
  * @extends BUI.Component.UIBase.List
  * @mixins BUI.Component.UIBase.Selection
  */
  var childList = function(){
    this.__init();
  };

  childList.ATTRS = BUI.merge(true,list.ATTRS,Selection.ATTRS,{
    items : {
      sync : false
    },
    /**
     * \u914d\u7f6e\u7684items \u9879\u662f\u5728\u521d\u59cb\u5316\u65f6\u4f5c\u4e3achildren
     * @protected
     * @type {Boolean}
     */
    autoInitItems : {
      value : true
    },
    /**
     * \u4f7f\u7528srcNode\u65f6\uff0c\u662f\u5426\u5c06\u5185\u90e8\u7684DOM\u8f6c\u6362\u6210\u5b50\u63a7\u4ef6
     * @type {Boolean}
     */
    isDecorateChild : {
      value : true
    },
    /**
     * \u9ed8\u8ba4\u7684\u52a0\u8f7d\u63a7\u4ef6\u5185\u5bb9\u7684\u914d\u7f6e,\u9ed8\u8ba4\u503c\uff1a
     * <pre>
     *  {
     *   property : 'children',
     *   dataType : 'json'
     * }
     * </pre>
     * @type {Object}
     */
    defaultLoaderCfg  : {
      value : {
        property : 'children',
        dataType : 'json'
      }
    }
  });

  BUI.augment(childList,list,Selection,{
    //\u521d\u59cb\u5316\uff0c\u5c06items\u8f6c\u6362\u6210children
    __init : function(){
      var _self = this,
        items = _self.get('items');
      if(items && _self.get('autoInitItems')){
        _self.addItems(items);
      } 
      _self.on('beforeRenderUI',function(){
        _self._beforeRenderUI();
      });
    },
    _uiSetItems : function (items) {
      var _self = this;
      //\u6e05\u7406\u5b50\u63a7\u4ef6
      _self.clearControl();
      _self.addItems(items);
    },
    //\u6e32\u67d3\u5b50\u63a7\u4ef6
    _beforeRenderUI : function(){
      var _self = this,
        children = _self.get('children'),
        items = _self.get('items');   
      BUI.each(children,function(item){
        beforeAddItem(_self,item);
      });
    },
    //\u7ed1\u5b9a\u4e8b\u4ef6
    __bindUI : function(){
      var _self = this,
        selectedEvent = _self.get('selectedEvent');
     
      _self.on(selectedEvent,function(e){
        var item = e.target;
        if(item.get('selectable')){
            if(!item.get('selected')){
              _self.setSelected(item);
            }else if(_self.get('multipleSelect')){
              _self.clearSelected(item);
            }
        }
      });

      _self.on('click',function(e){
        if(e.target !== _self){
          _self.fire('itemclick',{item:e.target,domTarget : e.domTarget,domEvent : e});
        }
      });
      _self.on('beforeAddChild',function(ev){
        beforeAddItem(_self,ev.child);
      });
      _self.on('beforeRemoveChild',function(ev){
        var item = ev.child,
          selected = item.get('selected');
        //\u6e05\u7406\u9009\u4e2d\u72b6\u6001
        if(selected){
          if(_self.get('multipleSelect')){
            _self.clearSelected(item);
          }else{
            _self.setSelected(null);
          }
        }
        item.set('selected',false);
      });
    },
    /**
     * @protected
     * @override
     * \u6e05\u9664\u8005\u5217\u8868\u9879\u7684DOM
     */
    clearControl : function(){
      this.removeChildren(true);
    },
    /**
     * \u83b7\u53d6\u6240\u6709\u5b50\u63a7\u4ef6
     * @return {Array} \u5b50\u63a7\u4ef6\u96c6\u5408
     * @override
     */
    getItems : function () {
      return this.get('children');
    },
    /**
     * \u66f4\u65b0\u5217\u8868\u9879
     * @param  {Object} item \u9009\u9879\u503c
     */
    updateItem : function(item){
      var _self = this,
        idField = _self.get('idField'),
        element = _self.findItemByField(idField,item[idField]);
      if(element){
        element.setTplContent();
      }
      return element;
    },
    /**
     * \u5220\u9664\u9879,\u5b50\u63a7\u4ef6\u4f5c\u4e3a\u9009\u9879
     * @param  {Object} element \u5b50\u63a7\u4ef6
     */
    removeItem : function (item) {
      var _self = this,
        idField = _self.get('idField');
      if(!(item instanceof BUI.Component.Controller)){
        item = _self.findItemByField(idField,item[idField]);
      }
      this.removeChild(item,true);
    },
    /**
     * \u5728\u6307\u5b9a\u4f4d\u7f6e\u6dfb\u52a0\u9009\u9879,\u6b64\u5904\u9009\u9879\u6307\u5b50\u63a7\u4ef6
     * @param {Object|BUI.Component.Controller} item \u5b50\u63a7\u4ef6\u914d\u7f6e\u9879\u3001\u5b50\u63a7\u4ef6
     * @param {Number} index \u7d22\u5f15
     * @return {Object|BUI.Component.Controller} \u5b50\u63a7\u4ef6
     */
    addItemAt : function(item,index) {
      return this.addChild(item,index);
    },
    findItemByField : function(field,value,root){

      root = root || this;
      var _self = this,
        children = root.get('children'),
        result = null;
      $(children).each(function(index,item){
        if(item.get(field) == value){
            result = item;
        }else if(item.get('children').length){
            result = _self.findItemByField(field,value,item);
        }
        if(result){
          return false;
        }
      });
      return result;
    },
    getItemText : function(item){
      return item.get('el').text();
    },
    getValueByField : function(item,field){
        return item && item.get(field);
    },
    /**
     * @protected
     * @ignore
     */
    setItemSelectedStatus : function(item,selected){
      var _self = this,
        method = selected ? 'addClass' : 'removeClass',
        element = null;

      if(item){
        item.set('selected',selected);
        element = item.get('el');
      }
      _self.afterSelected(item,selected,element);
    },
    /**
     * \u9009\u9879\u662f\u5426\u88ab\u9009\u4e2d
     * @override
     * @param  {*}  item \u9009\u9879
     * @return {Boolean}  \u662f\u5426\u9009\u4e2d
     */
    isItemSelected : function(item){
        return item ? item.get('selected') : false;
    },
    /**
     * \u8bbe\u7f6e\u6240\u6709\u9009\u9879\u9009\u4e2d
     * @override
     */
    setAllSelection : function(){
      var _self = this,
        items = _self.getItems();
      _self.setSelection(items);
    },
    /**
     * \u83b7\u53d6\u9009\u4e2d\u7684\u9879\u7684\u503c
     * @return {Array} 
     * @override
     * @ignore
     */
    getSelection : function(){
        var _self = this,
            items = _self.getItems(),
            rst = [];
        BUI.each(items,function(item){
            if(_self.isItemSelected(item)){
                rst.push(item);
            }
           
        });
        return rst;
    }
  });

  list.ChildList = childList;

  return list;
});

/**
 * @ignore
 * 2013-1-22 
 *   \u66f4\u6539\u663e\u793a\u6570\u636e\u7684\u65b9\u5f0f\uff0c\u4f7f\u7528 _uiSetItems
 */
define('bui/component/uibase/childcfg',function (require) {

  /**
   * @class BUI.Component.UIBase.ChildCfg
   * \u5b50\u63a7\u4ef6\u9ed8\u8ba4\u914d\u7f6e\u9879\u7684\u6269\u5c55\u7c7b
   */
  var childCfg = function(config){
    this._init();
  };

  childCfg.ATTRS = {
    /**
     * \u9ed8\u8ba4\u7684\u5b50\u63a7\u4ef6\u914d\u7f6e\u9879,\u5728\u521d\u59cb\u5316\u63a7\u4ef6\u65f6\u914d\u7f6e
     * 
     *  - \u5982\u679c\u63a7\u4ef6\u5df2\u7ecf\u6e32\u67d3\u8fc7\uff0c\u6b64\u914d\u7f6e\u9879\u65e0\u6548\uff0c
     *  - \u63a7\u4ef6\u751f\u6210\u540e\uff0c\u4fee\u6539\u6b64\u914d\u7f6e\u9879\u65e0\u6548\u3002
     * <pre><code>
     *   var control = new Control({
     *     defaultChildCfg : {
     *       tpl : '&lt;li&gt;{text}&lt;/li&gt;',
     *       xclass : 'a-b'
     *     }
     *   });
     * </code></pre>
     * @cfg {Object} defaultChildCfg
     */
    /**
     * @ignore
     */
    defaultChildCfg : {

    }
  };

  childCfg.prototype = {

    _init : function(){
      var _self = this,
        defaultChildCfg = _self.get('defaultChildCfg');
      if(defaultChildCfg){
        _self.on('beforeAddChild',function(ev){
          var child = ev.child;
          if($.isPlainObject(child)){
            BUI.each(defaultChildCfg,function(v,k){
              if(!child[k]){
                child[k] = v;
              }
            });
          }
        });
      }
    }

  };

  return childCfg;

});
define('bui/component/uibase/depends',['bui/component/manage'],function (require) {
  
  var regexp = /^#(.*):(.*)$/,
    Manager = require('bui/component/manage');

  //\u83b7\u53d6\u4f9d\u8d56\u4fe1\u606f
  function getDepend(name){

    var arr = regexp.exec(name),
      id = arr[1],
      eventType = arr[2],
      source = getSource(id);
    return {
      source : source,
      eventType: eventType
    };
  }

  //\u7ed1\u5b9a\u4f9d\u8d56
  function bindDepend(self,name,action){
    var depend = getDepend(name),
      source = depend.source,
      eventType = depend.eventType,
      callbak;
    if(source && action && eventType){

      if(BUI.isFunction(action)){//\u5982\u679caction\u662f\u4e00\u4e2a\u51fd\u6570
        callbak = action;
      }else if(BUI.isArray(action)){//\u5982\u679c\u662f\u4e00\u4e2a\u6570\u7ec4\uff0c\u6784\u5efa\u4e00\u4e2a\u56de\u8c03\u51fd\u6570
        callbak = function(){
          BUI.each(action,function(methodName){
            if(self[methodName]){
              self[methodName]();
            }
          });
        }
      }
    }
    if(callbak){
      depend.callbak = callbak;
      source.on(eventType,callbak);
      return depend;
    }
    return null;
  }
  //\u53bb\u9664\u4f9d\u8d56
  function offDepend(depend){
    var source = depend.source,
      eventType = depend.eventType,
      callbak = depend.callbak;
    source.off(eventType,callbak);
  }

  //\u83b7\u53d6\u7ed1\u5b9a\u7684\u4e8b\u4ef6\u6e90
  function getSource(id){
    var control = Manager.getComponent(id);
    if(!control){
      control = $('#' + id);
      if(!control.length){
        control = null;
      }
    }
    return control;
  }

  /**
   * @class BUI.Component.UIBase.Depends
   * \u4f9d\u8d56\u4e8b\u4ef6\u6e90\u7684\u6269\u5c55
   * <pre><code>
   *       var control = new Control({
   *         depends : {
   *           '#btn:click':['toggle'],//\u5f53\u70b9\u51fbid\u4e3a'btn'\u7684\u6309\u94ae\u65f6\uff0c\u6267\u884c control \u7684toggle\u65b9\u6cd5
   *           '#checkbox1:checked':['show'],//\u5f53\u52fe\u9009checkbox\u65f6\uff0c\u663e\u793a\u63a7\u4ef6
   *           '#menu:click',function(){}
   *         }
   *       });
   * </code></pre>
   */
  function Depends (){

  };

  Depends.ATTRS = {
    /**
     * \u63a7\u4ef6\u7684\u4f9d\u8d56\u4e8b\u4ef6\uff0c\u662f\u4e00\u4e2a\u6570\u7ec4\u96c6\u5408\uff0c\u6bcf\u4e00\u6761\u8bb0\u5f55\u662f\u4e00\u4e2a\u4f9d\u8d56\u5173\u7cfb<br/>
     * \u4e00\u4e2a\u4f9d\u8d56\u662f\u6ce8\u518c\u4e00\u4e2a\u4e8b\u4ef6\uff0c\u6240\u4ee5\u9700\u8981\u5728\u4e00\u4e2a\u4f9d\u8d56\u4e2d\u63d0\u4f9b\uff1a
     * <ol>
     * <li>\u7ed1\u5b9a\u6e90\uff1a\u4e3a\u4e86\u65b9\u4fbf\u914d\u7f6e\uff0c\u6211\u4eec\u4f7f\u7528 #id\u6765\u6307\u5b9a\u7ed1\u5b9a\u6e90\uff0c\u53ef\u4ee5\u4f7f\u63a7\u4ef6\u7684ID\uff08\u53ea\u652f\u6301\u7ee7\u627f{BUI.Component.Controller}\u7684\u63a7\u4ef6\uff09\uff0c\u4e5f\u53ef\u4ee5\u662fDOM\u7684id</li>
     * <li>\u4e8b\u4ef6\u540d\uff1a\u4e8b\u4ef6\u540d\u662f\u4e00\u4e2a\u4f7f\u7528":"\u4e3a\u524d\u7f00\u7684\u5b57\u7b26\u4e32\uff0c\u4f8b\u5982 "#id:change",\u5373\u76d1\u542cchange\u4e8b\u4ef6</li>
     * <li>\u89e6\u53d1\u7684\u65b9\u6cd5\uff1a\u53ef\u4ee5\u662f\u4e00\u4e2a\u6570\u7ec4\uff0c\u5982["disable","clear"],\u6570\u7ec4\u91cc\u9762\u662f\u63a7\u4ef6\u7684\u65b9\u6cd5\u540d\uff0c\u4e5f\u53ef\u4ee5\u662f\u4e00\u4e2a\u56de\u8c03\u51fd\u6570</li>
     * </ol>
     * <pre><code>
     *       var control = new Control({
     *         depends : {
     *           '#btn:click':['toggle'],//\u5f53\u70b9\u51fbid\u4e3a'btn'\u7684\u6309\u94ae\u65f6\uff0c\u6267\u884c control \u7684toggle\u65b9\u6cd5
     *           '#checkbox1:checked':['show'],//\u5f53\u52fe\u9009checkbox\u65f6\uff0c\u663e\u793a\u63a7\u4ef6
     *           '#menu:click',function(){}
     *         }
     *       });
     * </code></pre>
     * ** \u6ce8\u610f\uff1a** \u8fd9\u4e9b\u4f9d\u8d56\u9879\u662f\u5728\u63a7\u4ef6\u6e32\u67d3\uff08render\uff09\u540e\u8fdb\u884c\u7684\u3002         
     * @type {Object}
     */
    depends : {
      value : {}
    },
    /**
     * @private
     * \u4f9d\u8d56\u7684\u6620\u5c04\u96c6\u5408
     * @type {Object}
     */
    dependencesMap : {
      value : {}
    }
  };

  Depends.prototype = {

    __syncUI : function(){
      this.initDependences();
    },
    /**
     * \u521d\u59cb\u5316\u4f9d\u8d56\u9879
     * @protected
     */
    initDependences : function(){
      var _self = this,
        depends = _self.get('depends');
      BUI.each(depends,function(action,name){
        _self.addDependence(name,action);
      });
    },
    /**
     * \u6dfb\u52a0\u4f9d\u8d56\uff0c\u5982\u679c\u5df2\u7ecf\u6709\u540c\u540d\u7684\u4e8b\u4ef6\uff0c\u5219\u79fb\u9664\uff0c\u518d\u6dfb\u52a0
     * <pre><code>
     *  form.addDependence('#btn:click',['toggle']); //\u5f53\u6309\u94ae#btn\u70b9\u51fb\u65f6\uff0c\u8868\u5355\u4ea4\u66ff\u663e\u793a\u9690\u85cf
     *
     *  form.addDependence('#btn:click',function(){//\u5f53\u6309\u94ae#btn\u70b9\u51fb\u65f6\uff0c\u8868\u5355\u4ea4\u66ff\u663e\u793a\u9690\u85cf
     *   //TO DO
     *  }); 
     * </code></pre>
     * @param {String} name \u4f9d\u8d56\u9879\u7684\u540d\u79f0
     * @param {Array|Function} action \u4f9d\u8d56\u9879\u7684\u4e8b\u4ef6
     */
    addDependence : function(name,action){
      var _self = this,
        dependencesMap = _self.get('dependencesMap'),
        depend;
      _self.removeDependence(name);
      depend = bindDepend(_self,name,action)
      if(depend){
        dependencesMap[name] = depend;
      }
    },
    /**
     * \u79fb\u9664\u4f9d\u8d56
     * <pre><code>
     *  form.removeDependence('#btn:click'); //\u5f53\u6309\u94ae#btn\u70b9\u51fb\u65f6\uff0c\u8868\u5355\u4e0d\u5728\u76d1\u542c
     * </code></pre>
     * @param  {String} name \u4f9d\u8d56\u540d\u79f0
     */
    removeDependence : function(name){
      var _self = this,
        dependencesMap = _self.get('dependencesMap'),
        depend = dependencesMap[name];
      if(depend){
        offDepend(depend);
        delete dependencesMap[name];
      }
    },
    /**
     * \u6e05\u9664\u6240\u6709\u7684\u4f9d\u8d56
     * <pre><code>
     *  form.clearDependences();
     * </code></pre>
     */
    clearDependences : function(){
      var _self = this,
        map = _self.get('dependencesMap');
      BUI.each(map,function(depend,name){
        offDepend(depend);
      });
      _self.set('dependencesMap',{});
    },
    __destructor : function(){
      this.clearDependences();
    }

  };
  
  return Depends;
});
define('bui/component/uibase/bindable',function(){
	
	/**
		* bindable extension class.
		* <pre><code>
		*   BUI.use(['bui/list','bui/data','bui/mask'],function(List,Data,Mask){
		*     var store = new Data.Store({
		*       url : 'data/xx.json'
		*     });
		*   	var list = new List.SimpleList({
		*  	    render : '#l1',
		*  	    store : store,
		*  	    loadMask : new Mask.LoadMask({el : '#t1'})
		*     });
		*
		*     list.render();
		*     store.load();
		*   });
		* </code></pre>
		* \u4f7f\u63a7\u4ef6\u7ed1\u5b9astore\uff0c\u5904\u7406store\u7684\u4e8b\u4ef6 {@link BUI.Data.Store}
		* @class BUI.Component.UIBase.Bindable
		*/
	function bindable(){
		
	}

	bindable.ATTRS = 
	{
		/**
		* \u7ed1\u5b9a {@link BUI.Data.Store}\u7684\u4e8b\u4ef6
		* <pre><code>
		*  var store = new Data.Store({
		*   url : 'data/xx.json',
		*   autoLoad : true
		*  });
		*
		*  var list = new List.SimpleList({
		*  	 render : '#l1',
		*  	 store : store
		*  });
		*
		*  list.render();
		* </code></pre>
		* @cfg {BUI.Data.Store} store
		*/
		/**
		* \u7ed1\u5b9a {@link BUI.Data.Store}\u7684\u4e8b\u4ef6
		* <pre><code>
		*  var store = list.get('store');
		* </code></pre>
		* @type {BUI.Data.Store}
		*/
		store : {
			
		},
		/**
		* \u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u662f\u5426\u663e\u793a\u7b49\u5f85\u52a0\u8f7d\u7684\u5c4f\u853d\u5c42
		* <pre><code>
		*   BUI.use(['bui/list','bui/data','bui/mask'],function(List,Data,Mask){
		*     var store = new Data.Store({
		*       url : 'data/xx.json'
		*     });
		*   	var list = new List.SimpleList({
		*  	    render : '#l1',
		*  	    store : store,
		*  	    loadMask : new Mask.LoadMask({el : '#t1'})
		*     });
		*
		*     list.render();
		*     store.load();
		*   });
		* </code></pre>
		* @cfg {Boolean|Object} loadMask
		*/
		/**
		* \u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u662f\u5426\u663e\u793a\u7b49\u5f85\u52a0\u8f7d\u7684\u5c4f\u853d\u5c42
		* @type {Boolean|Object} 
		* @ignore
		*/
		loadMask : {
			value : false
		}
	};


	BUI.augment(bindable,
	/**
	* @lends BUI.Data.Bindable.prototype
	* @ignore
	*/	
	{

		__bindUI : function(){
			var _self = this,
				store = _self.get('store'),
				loadMask = _self.get('loadMask');
			if(!store){
				return;
			}
			store.on('beforeload',function(e){
				_self.onBeforeLoad(e);
				if(loadMask && loadMask.show){
					loadMask.show();
				}
			});
			store.on('load',function(e){
				_self.onLoad(e);
				if(loadMask && loadMask.hide){
					loadMask.hide();
				}
			});
			store.on('exception',function(e){
				_self.onException(e);
				if(loadMask && loadMask.hide){
					loadMask.hide();
				}
			});
			store.on('add',function(e){
				_self.onAdd(e);
			});
			store.on('remove',function(e){
				_self.onRemove(e);
			});
			store.on('update',function(e){
				_self.onUpdate(e);
			});
			store.on('localsort',function(e){
				_self.onLocalSort(e);
			});
		},
		__syncUI : function(){
			var _self = this,
				store = _self.get('store');
			if(!store){
				return;
			}
			if(store.hasData()){
				_self.onLoad();
			}
		},
		/**
		* @protected
    * @template
		* before store load data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-beforeload}
		*/
		onBeforeLoad : function(e){

		},
		/**
		* @protected
    * @template
		* after store load data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-load}
		*/
		onLoad : function(e){
			
		},
		/**
		* @protected
    * @template
		* occurred exception when store is loading data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-exception}
		*/
		onException : function(e){
			
		},
		/**
		* @protected
    * @template
		* after added data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-add}
		*/
		onAdd : function(e){
		
		},
		/**
		* @protected
    * @template
		* after remvoed data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-remove}
		*/
		onRemove : function(e){
		
		},
		/**
		* @protected
    * @template
		* after updated data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-update}
		*/
		onUpdate : function(e){
		
		},
		/**
		* @protected
    * @template
		* after local sorted data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-localsort}
		*/
		onLocalSort : function(e){
			
		}
	});

	return bindable;
});
define('bui/component/view',['bui/component/manage','bui/component/uibase'],function(require){

  var win = window,
    Manager = require('bui/component/manage'),
    UIBase = require('bui/component/uibase'),//BUI.Component.UIBase,
    doc = document;
    
    /**
     * \u63a7\u4ef6\u7684\u89c6\u56fe\u5c42\u57fa\u7c7b
     * @class BUI.Component.View
     * @protected
     * @extends BUI.Component.UIBase
     * @mixins BUI.Component.UIBase.TplView
     */
    var View = UIBase.extend([UIBase.TplView],
    {

        /**
         * Get all css class name to be applied to the root element of this component for given state.
         * the css class names are prefixed with component name.
         * @param {String} [state] This component's state info.
         */
        getComponentCssClassWithState: function (state) {
            var self = this,
                componentCls = self.get('ksComponentCss');
            state = state || '';
            return self.getCssClassWithPrefix(componentCls.split(/\s+/).join(state + ' ') + state);
        },

        /**
         * Get full class name (with prefix) for current component
         * @param classes {String} class names without prefixCls. Separated by space.
         * @method
         * @return {String} class name with prefixCls
         * @private
         */
        getCssClassWithPrefix: Manager.getCssClassWithPrefix,

        /**
         * Returns the dom element which is responsible for listening keyboard events.
         * @return {jQuery}
         */
        getKeyEventTarget: function () {
            return this.get('el');
        },
        /**
         * Return the dom element into which child component to be rendered.
         * @return {jQuery}
         */
        getContentElement: function () {
            return this.get('contentEl') || this.get('el');
        },
        /**
         * \u83b7\u53d6\u72b6\u6001\u5bf9\u5e94\u7684css\u6837\u5f0f
         * @param  {String} name \u72b6\u6001\u540d\u79f0 \u4f8b\u5982\uff1ahover,disabled\u7b49\u7b49
         * @return {String} \u72b6\u6001\u6837\u5f0f
         */
        getStatusCls : function(name){
            var self = this,
                statusCls = self.get('statusCls'),
                cls = statusCls[name];
            if(!cls){
                cls = self.getComponentCssClassWithState('-' + name);
            }
            return cls;
        },
        /**
         * \u6e32\u67d3\u63a7\u4ef6
         * @protected
         */
        renderUI: function () {
            var self = this;

            // \u65b0\u5efa\u7684\u8282\u70b9\u624d\u9700\u8981\u6446\u653e\u5b9a\u4f4d,\u4e0d\u652f\u6301srcNode\u6a21\u5f0f
            if (!self.get('srcNode')) {
                var render = self.get('render'),
                    el = self.get('el'),
                    renderBefore = self.get('elBefore');
                if (renderBefore) {
                    el.insertBefore(renderBefore, undefined);
                } else if (render) {
                    el.appendTo(render, undefined);
                } else {
                    el.appendTo(doc.body, undefined);
                }
            }
        },
        /**
         * \u53ea\u8d1f\u8d23\u5efa\u7acb\u8282\u70b9\uff0c\u5982\u679c\u662f decorate \u8fc7\u6765\u7684\uff0c\u751a\u81f3\u5185\u5bb9\u4f1a\u4e22\u5931
         * @protected
         * \u901a\u8fc7 render \u6765\u91cd\u5efa\u539f\u6709\u7684\u5185\u5bb9
         */
        createDom: function () {
            var self = this,
                contentEl = self.get('contentEl'),
                el = self.get('el');
            if (!self.get('srcNode')) {

                el = $('<' + self.get('elTagName') + '>');

                if (contentEl) {
                    el.append(contentEl);
                }

                self.setInternal('el', el);   
            }
            
            el.addClass(self.getComponentCssClassWithState());
            if (!contentEl) {
                // \u6ca1\u53d6\u5230,\u8fd9\u91cc\u8bbe\u4e0b\u503c, uiSet \u65f6\u53ef\u4ee5 set('content')  \u53d6\u5230
                self.setInternal('contentEl', el);
            }
        },
        /**
         * \u8bbe\u7f6e\u9ad8\u4eae\u663e\u793a
         * @protected
         */
        _uiSetHighlighted: function (v) {
            var self = this,
                componentCls = self.getStatusCls('hover'),
                el = self.get('el');
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },

        /**
         * \u8bbe\u7f6e\u7981\u7528
         * @protected
         */
        _uiSetDisabled: function (v) {
            var self = this,
                componentCls = self.getStatusCls('disabled'),
                el = self.get('el');
            el[v ? 'addClass' : 'removeClass'](componentCls)
                .attr('aria-disabled', v);
      
            //\u5982\u679c\u7981\u7528\u63a7\u4ef6\u65f6\uff0c\u5904\u4e8ehover\u72b6\u6001\uff0c\u5219\u6e05\u9664
            if(v && self.get('highlighted')){
            self.set('highlighted',false);
            }

            if (self.get('focusable')) {
                //\u4e0d\u80fd\u88ab tab focus \u5230
                self.getKeyEventTarget().attr('tabIndex', v ? -1 : 0);
            }
        },
        /**
         * \u8bbe\u7f6e\u6fc0\u6d3b\u72b6\u6001
         * @protected
         */
        _uiSetActive: function (v) {
            var self = this,
                componentCls = self.getStatusCls('active');
            self.get('el')[v ? 'addClass' : 'removeClass'](componentCls)
                .attr('aria-pressed', !!v);
        },
        /**
         * \u8bbe\u7f6e\u83b7\u5f97\u7126\u70b9
         * @protected
         */
        _uiSetFocused: function (v) {
            var self = this,
                el = self.get('el'),
                componentCls = self.getStatusCls('focused');
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },
        /**
         * \u8bbe\u7f6e\u63a7\u4ef6\u6700\u5916\u5c42DOM\u7684\u5c5e\u6027
         * @protected
         */
        _uiSetElAttrs: function (attrs) {
            this.get('el').attr(attrs);
        },
        /**
         * \u8bbe\u7f6e\u5e94\u7528\u5230\u63a7\u4ef6\u6700\u5916\u5c42DOM\u7684css class
         * @protected
         */
        _uiSetElCls: function (cls) {
            this.get('el').addClass(cls);
        },
        /**
         * \u8bbe\u7f6e\u5e94\u7528\u5230\u63a7\u4ef6\u6700\u5916\u5c42DOM\u7684css style
         * @protected
         */
        _uiSetElStyle: function (style) {
            this.get('el').css(style);
        },
        //\u8bbe\u7f6erole
        _uiSetRole : function(role){
            if(role){
                this.get('el').attr('role',role);
            } 
        },
        /**
         * \u8bbe\u7f6e\u5e94\u7528\u5230\u63a7\u4ef6\u5bbd\u5ea6
         * @protected
         */
        _uiSetWidth: function (w) {
            this.get('el').width(w);
        },
        /**
         * \u8bbe\u7f6e\u5e94\u7528\u5230\u63a7\u4ef6\u9ad8\u5ea6
         * @protected
         */
        _uiSetHeight: function (h) {
            var self = this;
            self.get('el').height(h);
        },
        /**
         * \u8bbe\u7f6e\u5e94\u7528\u5230\u63a7\u4ef6\u7684\u5185\u5bb9
         * @protected
         */
        _uiSetContent: function (c) {
            var self = this, 
                el;
            // srcNode \u65f6\u4e0d\u91cd\u65b0\u6e32\u67d3 content
            // \u9632\u6b62\u5185\u90e8\u6709\u6539\u53d8\uff0c\u800c content \u5219\u662f\u8001\u7684 html \u5185\u5bb9
            if (self.get('srcNode') && !self.get('rendered')) {
            } else {
                el = self.get('contentEl');
                if (typeof c == 'string') {
                    el.html(c);
                } else if (c) {
                    el.empty().append(c);
                }
            }
        },
        /**
         * \u8bbe\u7f6e\u5e94\u7528\u5230\u63a7\u4ef6\u662f\u5426\u53ef\u89c1
         * @protected
         */
        _uiSetVisible: function (isVisible) {
            var self = this,
                el = self.get('el'),
                visibleMode = self.get('visibleMode');
            if (visibleMode === 'visibility') {
                el.css('visibility', isVisible ? 'visible' : 'hidden');
            } else {
                el.css('display', isVisible ? '' : 'none');
            }
        },
        /**
         * \u6790\u6784\u51fd\u6570
         * @protected
         */
        destructor : function () {
            var el = this.get('el');
            if (el) {
                el.remove();
            }
        }
    },{
        xclass : 'view',
        priority : 0
    });


    View.ATTRS = 
    {   
        /**
         * \u63a7\u4ef6\u6839\u8282\u70b9
         * @readOnly
         * see {@link BUI.Component.Controller#property-el}
         */
        el: {
            /**
			* @private
			*/
            setter: function (v) {
                return $(v);
            }
        },

        /**
         * \u63a7\u4ef6\u6839\u8282\u70b9\u6837\u5f0f
         * see {@link BUI.Component.Controller#property-elCls}
         */
        elCls: {
        },
        /**
         * \u63a7\u4ef6\u6839\u8282\u70b9\u6837\u5f0f\u5c5e\u6027
         * see {@link BUI.Component.Controller#property-elStyle}
         */
        elStyle: {
        },
        /**
         * ARIA \u6807\u51c6\u4e2d\u7684role
         * @type {String}
         */
        role : {
            
        },
        /**
         * \u63a7\u4ef6\u5bbd\u5ea6
         * see {@link BUI.Component.Controller#property-width}
         */
        width: {
        },
        /**
         * \u63a7\u4ef6\u9ad8\u5ea6
         * see {@link BUI.Component.Controller#property-height}
         */
        height: {
        },
        /**
         * \u72b6\u6001\u76f8\u5173\u7684\u6837\u5f0f,\u9ed8\u8ba4\u60c5\u51b5\u4e0b\u4f1a\u4f7f\u7528 \u524d\u7f00\u540d + xclass + '-' + \u72b6\u6001\u540d
         * see {@link BUI.Component.Controller#property-statusCls}
         * @type {Object}
         */
        statusCls : {
            value : {}
        },
        /**
         * \u63a7\u4ef6\u6839\u8282\u70b9\u4f7f\u7528\u7684\u6807\u7b7e
         * @type {String}
         */
        elTagName: {
            // \u751f\u6210\u6807\u7b7e\u540d\u5b57
            value: 'div'
        },
        /**
         * \u63a7\u4ef6\u6839\u8282\u70b9\u5c5e\u6027
         * see {@link BUI.Component.Controller#property-elAttrs}
         * @ignore
         */
        elAttrs: {
        },
        /**
         * \u63a7\u4ef6\u5185\u5bb9\uff0chtml,\u6587\u672c\u7b49
         * see {@link BUI.Component.Controller#property-content}
         */
        content: {
        },
        /**
         * \u63a7\u4ef6\u63d2\u5165\u5230\u6307\u5b9a\u5143\u7d20\u524d
         * see {@link BUI.Component.Controller#property-tpl}
         */
        elBefore: {
            // better named to renderBefore, too late !
        },
        /**
         * \u63a7\u4ef6\u5728\u6307\u5b9a\u5143\u7d20\u5185\u90e8\u6e32\u67d3
         * see {@link BUI.Component.Controller#property-render}
         * @ignore
         */
        render: {},
        /**
         * \u662f\u5426\u53ef\u89c1
         * see {@link BUI.Component.Controller#property-visible}
         */
        visible: {
            value: true
        },
        /**
         * \u53ef\u89c6\u6a21\u5f0f
         * see {@link BUI.Component.Controller#property-visibleMode}
         */
        visibleMode: {
            value: 'display'
        },
        /**
         * @private
         * \u7f13\u5b58\u9690\u85cf\u65f6\u7684\u4f4d\u7f6e\uff0c\u5bf9\u5e94visibleMode = 'visiblity' \u7684\u573a\u666f
         * @type {Object}
         */
        cachePosition : {

        },
        /**
         * content \u8bbe\u7f6e\u7684\u5185\u5bb9\u8282\u70b9,\u9ed8\u8ba4\u6839\u8282\u70b9
         * @type {jQuery}
         * @default  el
         */
        contentEl: {
            valueFn: function () {
                return this.get('el');
            }
        },
        /**
         * \u6837\u5f0f\u524d\u7f00
         * see {@link BUI.Component.Controller#property-prefixCls}
         */
        prefixCls: {
            value: BUI.prefix
        },
        /**
         * \u53ef\u4ee5\u83b7\u53d6\u7126\u70b9
         * @protected
         * see {@link BUI.Component.Controller#property-focusable}
         */
        focusable: {
            value: true
        },
        /**
         * \u83b7\u53d6\u7126\u70b9
         * see {@link BUI.Component.Controller#property-focused}
         */
        focused: {},
        /**
         * \u6fc0\u6d3b
         * see {@link BUI.Component.Controller#property-active}
         */
        active: {},
        /**
         * \u7981\u7528
         * see {@link BUI.Component.Controller#property-disabled}
         */
        disabled: {},
        /**
         * \u9ad8\u4eae\u663e\u793a
         * see {@link BUI.Component.Controller#property-highlighted}
         */
        highlighted: {}
    };

    return View;
});
/**
 * jQuery \u4e8b\u4ef6
 * @class jQuery.Event
 * @private
 */


define('bui/component/controller',['bui/component/uibase','bui/component/manage','bui/component/view','bui/component/loader'],function(require){
    'use strict';
    var UIBase = require('bui/component/uibase'),
        Manager = require('bui/component/manage'),
        View = require('bui/component/view'),
        Loader = require('bui/component/loader'),
        wrapBehavior = BUI.wrapBehavior,
        getWrapBehavior = BUI.getWrapBehavior;

     /**
      * @ignore
      */
     function wrapperViewSetter(attrName) {
        return function (ev) {
            var self = this;
            // in case bubbled from sub component
            if (self === ev.target) {
                var value = ev.newVal,
                    view = self.get('view');
                if(view){
                    view.set(attrName, value); 
                }
               
            }
        };
    }

    /**
      * @ignore
      */
    function wrapperViewGetter(attrName) {
        return function (v) {
            var self = this,
                view = self.get('view');
            return v === undefined ? view.get(attrName) : v;
        };
    }

    /**
      * @ignore
      */
    function initChild(self, c, renderBefore) {
        // \u751f\u6210\u7236\u7ec4\u4ef6\u7684 dom \u7ed3\u6784
        self.create();
        var contentEl = self.getContentElement(),
            defaultCls = self.get('defaultChildClass');
        //\u914d\u7f6e\u9ed8\u8ba4 xclass
        if(!c.xclass && !(c instanceof Controller)){
            if(!c.xtype){
                c.xclass = defaultCls;
            }else{
                c.xclass = defaultCls + '-' + c.xtype;
            }
            
        }

        c = BUI.Component.create(c, self);
        c.setInternal('parent', self);
        // set \u901a\u77e5 view \u4e5f\u66f4\u65b0\u5bf9\u5e94\u5c5e\u6027
        c.set('render', contentEl);
        c.set('elBefore', renderBefore);
        // \u5982\u679c parent \u4e5f\u6ca1\u6e32\u67d3\uff0c\u5b50\u7ec4\u4ef6 create \u51fa\u6765\u548c parent \u8282\u70b9\u5173\u8054
        // \u5b50\u7ec4\u4ef6\u548c parent \u7ec4\u4ef6\u4e00\u8d77\u6e32\u67d3
        // \u4e4b\u524d\u8bbe\u597d\u5c5e\u6027\uff0cview \uff0clogic \u540c\u6b65\u8fd8\u6ca1 bind ,create \u4e0d\u662f render \uff0c\u8fd8\u6ca1\u6709 bindUI
        c.create(undefined);
        return c;
    }

    /**
     * \u4e0d\u4f7f\u7528 valueFn\uff0c
     * \u53ea\u6709 render \u65f6\u9700\u8981\u627e\u5230\u9ed8\u8ba4\uff0c\u5176\u4ed6\u65f6\u5019\u4e0d\u9700\u8981\uff0c\u9632\u6b62\u83ab\u540d\u5176\u5999\u521d\u59cb\u5316
     * @ignore
     */
    function constructView(self) {
        // \u9010\u5c42\u627e\u9ed8\u8ba4\u6e32\u67d3\u5668
        var attrs,
            attrCfg,
            attrName,
            cfg = {},
            v,
            Render = self.get('xview');

      
        //\u5c06\u6e32\u67d3\u5c42\u521d\u59cb\u5316\u6240\u9700\u8981\u7684\u5c5e\u6027\uff0c\u76f4\u63a5\u6784\u9020\u5668\u8bbe\u7f6e\u8fc7\u53bb

        attrs = self.getAttrs();

        // \u6574\u7406\u5c5e\u6027\uff0c\u5bf9\u7eaf\u5c5e\u4e8e view \u7684\u5c5e\u6027\uff0c\u6dfb\u52a0 getter setter \u76f4\u63a5\u5230 view
        for (attrName in attrs) {
            if (attrs.hasOwnProperty(attrName)) {
                attrCfg = attrs[attrName];
                if (attrCfg.view) {
                    // \u5148\u53d6\u540e getter
                    // \u9632\u6b62\u6b7b\u5faa\u73af
                    if (( v = self.get(attrName) ) !== undefined) {
                        cfg[attrName] = v;
                    }

                    // setter \u4e0d\u5e94\u8be5\u6709\u5b9e\u9645\u64cd\u4f5c\uff0c\u4ec5\u7528\u4e8e\u6b63\u89c4\u5316\u6bd4\u8f83\u597d
                    // attrCfg.setter = wrapperViewSetter(attrName);
                    self.on('after' + BUI.ucfirst(attrName) + 'Change',
                        wrapperViewSetter(attrName));
                    // \u903b\u8f91\u5c42\u8bfb\u503c\u76f4\u63a5\u4ece view \u5c42\u8bfb
                    // \u90a3\u4e48\u5982\u679c\u5b58\u5728\u9ed8\u8ba4\u503c\u4e5f\u8bbe\u7f6e\u5728 view \u5c42
                    // \u903b\u8f91\u5c42\u4e0d\u8981\u8bbe\u7f6e getter
                    attrCfg.getter = wrapperViewGetter(attrName);
                }
            }
        }
        // does not autoRender for view
        delete cfg.autoRender;
        cfg.ksComponentCss = getComponentCss(self);
        return new Render(cfg);
    }

    function getComponentCss(self) {
        var constructor = self.constructor,
            cls,
            re = [];
        while (constructor && constructor !== Controller) {
            cls = Manager.getXClassByConstructor(constructor);
            if (cls) {
                re.push(cls);
            }
            constructor = constructor.superclass && constructor.superclass.constructor;
        }
        return re.join(' ');
    }

    function isMouseEventWithinElement(e, elem) {
        var relatedTarget = e.relatedTarget;
        // \u5728\u91cc\u9762\u6216\u7b49\u4e8e\u81ea\u8eab\u90fd\u4e0d\u7b97 mouseenter/leave
        return relatedTarget &&
            ( relatedTarget === elem[0] ||$.contains(elem,relatedTarget));
    }

    /**
     * \u53ef\u4ee5\u5b9e\u4f8b\u5316\u7684\u63a7\u4ef6\uff0c\u4f5c\u4e3a\u6700\u9876\u5c42\u7684\u63a7\u4ef6\u7c7b\uff0c\u4e00\u5207\u7528\u6237\u63a7\u4ef6\u90fd\u7ee7\u627f\u6b64\u63a7\u4ef6
     * xclass: 'controller'.
     * ** \u521b\u5efa\u5b50\u63a7\u4ef6 ** 
     * <pre><code>
     * var Control = Controller.extend([mixin1,mixin2],{ //\u539f\u578b\u94fe\u4e0a\u7684\u51fd\u6570
     *   renderUI : function(){ //\u521b\u5efaDOM
     *   
     *   }, 
     *   bindUI : function(){  //\u7ed1\u5b9a\u4e8b\u4ef6
     *   
     *   },
     *   destructor : funciton(){ //\u6790\u6784\u51fd\u6570
     *   
     *   }
     * },{
     *   ATTRS : { //\u9ed8\u8ba4\u7684\u5c5e\u6027
     *       text : {
     *       
     *       }
     *   }
     * },{
     *     xclass : 'a' //\u7528\u4e8e\u628a\u5bf9\u8c61\u89e3\u6790\u6210\u7c7b
     * });
     * </code></pre>
     *
     * ** \u521b\u5efa\u5bf9\u8c61 **
     * <pre><code>
     * var c1 = new Control({
     *     render : '#t1', //\u5728t1\u4e0a\u521b\u5efa
     *     text : 'text1',
     *     children : [{xclass : 'a',text : 'a1'},{xclass : 'b',text : 'b1'}]
     * });
     *
     * c1.render();
     * </code></pre>
     * @extends BUI.Component.UIBase
     * @mixins BUI.Component.UIBase.Tpl
     * @mixins BUI.Component.UIBase.Decorate
     * @mixins BUI.Component.UIBase.Depends
     * @mixins BUI.Component.UIBase.ChildCfg
     * @class BUI.Component.Controller
     */
    var Controller = UIBase.extend([UIBase.Decorate,UIBase.Tpl,UIBase.ChildCfg,UIBase.KeyNav,UIBase.Depends],
    {
        /**
         * \u662f\u5426\u662f\u63a7\u4ef6\uff0c\u6807\u793a\u5bf9\u8c61\u662f\u5426\u662f\u4e00\u4e2aUI \u63a7\u4ef6
         * @type {Boolean}
         */
        isController: true,

        /**
         * \u4f7f\u7528\u524d\u7f00\u83b7\u53d6\u7c7b\u7684\u540d\u5b57
         * @param classes {String} class names without prefixCls. Separated by space.
         * @method
         * @protected
         * @return {String} class name with prefixCls
         */
        getCssClassWithPrefix: Manager.getCssClassWithPrefix,

        /**
         * From UIBase, Initialize this component.             *
         * @protected
         */
        initializer: function () {
            var self = this;

            if(!self.get('id')){
                self.set('id',self.getNextUniqueId());
            }
            Manager.addComponent(self.get('id'),self);
            // initialize view
            self.setInternal('view', constructView(self));
        },

        /**
         * \u8fd4\u56de\u65b0\u7684\u552f\u4e00\u7684Id,\u7ed3\u679c\u662f 'xclass' + number
         * @protected
         * @return {String} \u552f\u4e00id
         */
        getNextUniqueId : function(){
            var self = this,
                xclass = Manager.getXClassByConstructor(self.constructor);
            return BUI.guid(xclass);
        },
        /**
         * From UIBase. Constructor(or get) view object to create ui elements.
         * @protected
         *
         */
        createDom: function () {
            var self = this,
                //el,
                view = self.get('view');
            view.create(undefined);
            //el = view.getKeyEventTarget();
            /*if (!self.get('allowTextSelection')) {
                //el.unselectable(undefined);
            }*/
        },

        /**
         * From UIBase. Call view object to render ui elements.
         * @protected
         *
         */
        renderUI: function () {
            var self = this, 
                loader = self.get('loader');
            self.get('view').render();
            self._initChildren();
            if(loader){
                self.setInternal('loader',loader);
            }
            /**/

        },
        _initChildren : function(children){
            var self = this, 
                i, 
                children, 
                child;
            // then render my children
            children = children || self.get('children').concat();
            self.get('children').length = 0;
            for (i = 0; i < children.length; i++) {
                child = self.addChild(children[i]);
                child.render();
            }
        },
        /**
         * bind ui for box
         * @private
         */
        bindUI:function () {
            var self = this,
                events = self.get('events');
            this.on('afterVisibleChange', function (e) {
                this.fire(e.newVal ? 'show' : 'hide');
            });
            //\u5904\u7406\u63a7\u4ef6\u4e8b\u4ef6\uff0c\u8bbe\u7f6e\u4e8b\u4ef6\u662f\u5426\u5192\u6ce1
            BUI.each(events, function (v,k) {
              self.publish(k, {
                  bubbles:v
              });
            });
        },
        /**
         * \u63a7\u4ef6\u662f\u5426\u5305\u542b\u6307\u5b9a\u7684DOM\u5143\u7d20,\u5305\u62ec\u6839\u8282\u70b9
         * <pre><code>
         *   var control = new Control();
         *   $(document).on('click',function(ev){
         *     var target = ev.target;
         *
         *     if(!control.containsElement(elem)){ //\u672a\u70b9\u51fb\u5728\u63a7\u4ef6\u5185\u90e8
         *       control.hide();
         *     }
         *   });
         * </code></pre>
         * @param  {HTMLElement} elem DOM \u5143\u7d20
         * @return {Boolean}  \u662f\u5426\u5305\u542b
         */
        containsElement : function (elem) {
          var _self = this,
            el = _self.get('el'),
            children = _self.get('children'),
            result = false;
          if(!_self.get('rendered')){
            return false;
          }
          if($.contains(el[0],elem) || el[0] === elem){
            result = true;
          }else{
            BUI.each(children,function (item) {
                if(item.containsElement(elem)){
                    result = true;
                    return false;
                }
            });
          }
          return result;
        },
        /**
         * \u662f\u5426\u662f\u5b50\u63a7\u4ef6\u7684DOM\u5143\u7d20
         * @protected
         * @return {Boolean} \u662f\u5426\u5b50\u63a7\u4ef6\u7684DOM\u5143\u7d20
         */
        isChildrenElement : function(elem){
            var _self = this,
                children = _self.get('children'),
                rst = false;
            BUI.each(children,function(child){
                if(child.containsElement(elem)){
                    rst = true;
                    return false;
                }
            });
            return rst;
        },
        /**
         * \u663e\u793a\u63a7\u4ef6
         */
        show:function () {
            var self = this;
            self.render();
            self.set('visible', true);
            return self;
        },

        /**
         * \u9690\u85cf\u63a7\u4ef6
         */
        hide:function () {
            var self = this;
            self.set('visible', false);
            return self;
        },
        /**
         * \u4ea4\u66ff\u663e\u793a\u6216\u8005\u9690\u85cf
         * <pre><code>
         *  control.show(); //\u663e\u793a
         *  control.toggle(); //\u9690\u85cf
         *  control.toggle(); //\u663e\u793a
         * </code></pre>
         */
        toggle : function(){
            this.set('visible',!this.get('visible'));
            return this;
        },
        _uiSetFocusable: function (focusable) {
            var self = this,
                t,
                el = self.getKeyEventTarget();
            if (focusable) {
                el.attr('tabIndex', 0)
                    // remove smart outline in ie
                    // set outline in style for other standard browser
                    .attr('hideFocus', true)
                    .on('focus', wrapBehavior(self, 'handleFocus'))
                    .on('blur', wrapBehavior(self, 'handleBlur'))
                    .on('keydown', wrapBehavior(self, 'handleKeydown'))
                    .on('keyup',wrapBehavior(self,'handleKeyUp'));
            } else {
                el.removeAttr('tabIndex');
                if (t = getWrapBehavior(self, 'handleFocus')) {
                    el.off('focus', t);
                }
                if (t = getWrapBehavior(self, 'handleBlur')) {
                    el.off('blur', t);
                }
                if (t = getWrapBehavior(self, 'handleKeydown')) {
                    el.off('keydown', t);
                }
                if (t = getWrapBehavior(self, 'handleKeyUp')) {
                    el.off('keyup', t);
                }
            }
        },

        _uiSetHandleMouseEvents: function (handleMouseEvents) {
            var self = this, el = self.get('el'), t;
            if (handleMouseEvents) {
                el.on('mouseenter', wrapBehavior(self, 'handleMouseEnter'))
                    .on('mouseleave', wrapBehavior(self, 'handleMouseLeave'))
                    .on('contextmenu', wrapBehavior(self, 'handleContextMenu'))
                    .on('mousedown', wrapBehavior(self, 'handleMouseDown'))
                    .on('mouseup', wrapBehavior(self, 'handleMouseUp'))
                    .on('dblclick', wrapBehavior(self, 'handleDblClick'));
            } else {
                t = getWrapBehavior(self, 'handleMouseEnter') &&
                    el.off('mouseenter', t);
                t = getWrapBehavior(self, 'handleMouseLeave') &&
                    el.off('mouseleave', t);
                t = getWrapBehavior(self, 'handleContextMenu') &&
                    el.off('contextmenu', t);
                t = getWrapBehavior(self, 'handleMouseDown') &&
                    el.off('mousedown', t);
                t = getWrapBehavior(self, 'handleMouseUp') &&
                    el.off('mouseup', t);
                t = getWrapBehavior(self, 'handleDblClick') &&
                    el.off('dblclick', t);
            }
        },

        _uiSetFocused: function (v) {
            if (v) {
                this.getKeyEventTarget()[0].focus();
            }
        },
        //\u5f53\u4f7f\u7528visiblity\u663e\u793a\u9690\u85cf\u65f6\uff0c\u9690\u85cf\u65f6\u628aDOM\u79fb\u9664\u51fa\u89c6\u56fe\u5185\uff0c\u663e\u793a\u65f6\u56de\u590d\u539f\u4f4d\u7f6e
        _uiSetVisible : function(isVisible){
            var self = this,
                el = self.get('el'),
                visibleMode = self.get('visibleMode');
            if (visibleMode === 'visibility') {
                if(isVisible){
                    var position = self.get('cachePosition');
                    if(position){
                        self.set('xy',position);
                    }
                }
                if(!isVisible){
                    var position = [
                        self.get('x'),self.get('y')
                    ];
                    self.set('cachePosition',position);
                    self.set('xy',[-999,-999]);
                }
            }
        },
        //\u8bbe\u7f6echildren\u65f6
        _uiSetChildren : function(v){
            var self = this,
                children = BUI.cloneObject(v);
            //self.removeChildren(true);
            self._initChildren(children);
        },
        /**
         * \u4f7f\u63a7\u4ef6\u53ef\u7528
         */
        enable : function(){
            this.set('disabled',false);
            return this;
        },
        /**
         * \u4f7f\u63a7\u4ef6\u4e0d\u53ef\u7528\uff0c\u63a7\u4ef6\u4e0d\u53ef\u7528\u65f6\uff0c\u70b9\u51fb\u7b49\u4e8b\u4ef6\u4e0d\u4f1a\u89e6\u53d1
         * <pre><code>
         *  control.disable(); //\u7981\u7528
         *  control.enable(); //\u89e3\u9664\u7981\u7528
         * </code></pre>
         */
        disable : function(){
            this.set('disabled',true);
            return this;
        },
        /**
         * \u63a7\u4ef6\u83b7\u53d6\u7126\u70b9
         */
        focus : function(){
            if(this.get('focusable')){
                this.set('focused',true);
            }
        },
        /**
         * \u5b50\u7ec4\u4ef6\u5c06\u8981\u6e32\u67d3\u5230\u7684\u8282\u70b9\uff0c\u5728 render \u7c7b\u4e0a\u8986\u76d6\u5bf9\u5e94\u65b9\u6cd5
         * @protected
         * @ignore
         */
        getContentElement: function () {
            return this.get('view').getContentElement();
        },

        /**
         * \u7126\u70b9\u6240\u5728\u5143\u7d20\u5373\u952e\u76d8\u4e8b\u4ef6\u5904\u7406\u5143\u7d20\uff0c\u5728 render \u7c7b\u4e0a\u8986\u76d6\u5bf9\u5e94\u65b9\u6cd5
         * @protected
         * @ignore
         */
        getKeyEventTarget: function () {
            return this.get('view').getKeyEventTarget();
        },

        /**
         * \u6dfb\u52a0\u63a7\u4ef6\u7684\u5b50\u63a7\u4ef6\uff0c\u7d22\u5f15\u503c\u4e3a 0-based
         * <pre><code>
         *  control.add(new Control());//\u6dfb\u52a0controller\u5bf9\u8c61
         *  control.add({xclass : 'a'});//\u6dfb\u52a0xclass \u4e3aa \u7684\u4e00\u4e2a\u5bf9\u8c61
         *  control.add({xclass : 'b'},2);//\u63d2\u5165\u5230\u7b2c\u4e09\u4e2a\u4f4d\u7f6e
         * </code></pre>
         * @param {BUI.Component.Controller|Object} c \u5b50\u63a7\u4ef6\u7684\u5b9e\u4f8b\u6216\u8005\u914d\u7f6e\u9879
         * @param {String} [c.xclass] \u5982\u679cc\u4e3a\u914d\u7f6e\u9879\uff0c\u8bbe\u7f6ec\u7684xclass
         * @param {Number} [index]  0-based  \u5982\u679c\u672a\u6307\u5b9a\u7d22\u5f15\u503c\uff0c\u5219\u63d2\u5728\u63a7\u4ef6\u7684\u6700\u540e
         */
        addChild: function (c, index) {
            var self = this,
                children = self.get('children'),
                renderBefore;
            if (index === undefined) {
                index = children.length;
            }
            /**
             * \u6dfb\u52a0\u5b50\u63a7\u4ef6\u524d\u89e6\u53d1
             * @event beforeAddChild
             * @param {Object} e
             * @param {Object} e.child \u6dfb\u52a0\u5b50\u63a7\u4ef6\u65f6\u4f20\u5165\u7684\u914d\u7f6e\u9879\u6216\u8005\u5b50\u63a7\u4ef6
             * @param {Number} e.index \u6dfb\u52a0\u7684\u4f4d\u7f6e
             */
            self.fire('beforeAddChild',{child : c,index : index});
            renderBefore = children[index] && children[index].get('el') || null;
            c = initChild(self, c, renderBefore);
            children.splice(index, 0, c);
            // \u5148 create \u5360\u4f4d \u518d render
            // \u9632\u6b62 render \u903b\u8f91\u91cc\u8bfb parent.get('children') \u4e0d\u540c\u6b65
            // \u5982\u679c parent \u5df2\u7ecf\u6e32\u67d3\u597d\u4e86\u5b50\u7ec4\u4ef6\u4e5f\u8981\u7acb\u5373\u6e32\u67d3\uff0c\u5c31 \u521b\u5efa dom \uff0c\u7ed1\u5b9a\u4e8b\u4ef6
            if (self.get('rendered')) {
                c.render();
            }

            /**
             * \u6dfb\u52a0\u5b50\u63a7\u4ef6\u540e\u89e6\u53d1
             * @event afterAddChild
             * @param {Object} e
             * @param {Object} e.child \u6dfb\u52a0\u5b50\u63a7\u4ef6
             * @param {Number} e.index \u6dfb\u52a0\u7684\u4f4d\u7f6e
             */
            self.fire('afterAddChild',{child : c,index : index});
            return c;
        },
        /**
         * \u5c06\u81ea\u5df1\u4ece\u7236\u63a7\u4ef6\u4e2d\u79fb\u9664
         * <pre><code>
         *  control.remove(); //\u5c06\u63a7\u4ef6\u4ece\u7236\u63a7\u4ef6\u4e2d\u79fb\u9664\uff0c\u5e76\u672a\u5220\u9664
         *  parent.addChild(control); //\u8fd8\u53ef\u4ee5\u6dfb\u52a0\u56de\u7236\u63a7\u4ef6
         *  
         *  control.remove(true); //\u4ece\u63a7\u4ef6\u4e2d\u79fb\u9664\u5e76\u8c03\u7528\u63a7\u4ef6\u7684\u6790\u6784\u51fd\u6570
         * </code></pre>
         * @param  {Boolean} destroy \u662f\u5426\u5220\u9664DON\u8282\u70b9
         * @return {BUI.Component.Controller} \u5220\u9664\u7684\u5b50\u5bf9\u8c61.
         */
        remove : function(destroy){
            var self = this,
                parent = self.get('parent');
            if(parent){
                parent.removeChild(self,destroy);
            }else if (destroy) {
                self.destroy();
            }
            return self;
        },
        /**
         * \u79fb\u9664\u5b50\u63a7\u4ef6\uff0c\u5e76\u8fd4\u56de\u79fb\u9664\u7684\u63a7\u4ef6
         *
         * ** \u5982\u679c destroy=true,\u8c03\u7528\u79fb\u9664\u63a7\u4ef6\u7684 {@link BUI.Component.UIBase#destroy} \u65b9\u6cd5,
         * \u540c\u65f6\u5220\u9664\u5bf9\u5e94\u7684DOM **
         * <pre><code>
         *  var child = control.getChild(id);
         *  control.removeChild(child); //\u4ec5\u4ec5\u79fb\u9664
         *  
         *  control.removeChild(child,true); //\u79fb\u9664\uff0c\u5e76\u8c03\u7528\u6790\u6784\u51fd\u6570
         * </code></pre>
         * @param {BUI.Component.Controller} c \u8981\u79fb\u9664\u7684\u5b50\u63a7\u4ef6.
         * @param {Boolean} [destroy=false] \u5982\u679c\u662ftrue,
         * \u8c03\u7528\u63a7\u4ef6\u7684\u65b9\u6cd5 {@link BUI.Component.UIBase#destroy} .
         * @return {BUI.Component.Controller} \u79fb\u9664\u7684\u5b50\u63a7\u4ef6.
         */
        removeChild: function (c, destroy) {
            var self = this,
                children = self.get('children'),
                index = BUI.Array.indexOf(c, children);

            if(index === -1){
                return;
            }
            /**
             * \u5220\u9664\u5b50\u63a7\u4ef6\u524d\u89e6\u53d1
             * @event beforeRemoveChild
             * @param {Object} e
             * @param {Object} e.child \u5b50\u63a7\u4ef6
             * @param {Boolean} e.destroy \u662f\u5426\u6e05\u9664DOM
             */
            self.fire('beforeRemoveChild',{child : c,destroy : destroy});

            if (index !== -1) {
                children.splice(index, 1);
            }
            if (destroy &&
                // c is still json
                c.destroy) {
                c.destroy();
            }
            /**
             * \u5220\u9664\u5b50\u63a7\u4ef6\u524d\u89e6\u53d1
             * @event afterRemoveChild
             * @param {Object} e
             * @param {Object} e.child \u5b50\u63a7\u4ef6
             * @param {Boolean} e.destroy \u662f\u5426\u6e05\u9664DOM
             */
            self.fire('afterRemoveChild',{child : c,destroy : destroy});

            return c;
        },

        /**
         * \u5220\u9664\u5f53\u524d\u63a7\u4ef6\u7684\u5b50\u63a7\u4ef6
         * <pre><code>
         *   control.removeChildren();//\u5220\u9664\u6240\u6709\u5b50\u63a7\u4ef6
         *   control.removeChildren(true);//\u5220\u9664\u6240\u6709\u5b50\u63a7\u4ef6\uff0c\u5e76\u8c03\u7528\u5b50\u63a7\u4ef6\u7684\u6790\u6784\u51fd\u6570
         * </code></pre>
         * @see Component.Controller#removeChild
         * @param {Boolean} [destroy] \u5982\u679c\u8bbe\u7f6e true,
         * \u8c03\u7528\u5b50\u63a7\u4ef6\u7684 {@link BUI.Component.UIBase#destroy}\u65b9\u6cd5.
         */
        removeChildren: function (destroy) {
            var self = this,
                i,
                t = [].concat(self.get('children'));
            for (i = 0; i < t.length; i++) {
                self.removeChild(t[i], destroy);
            }
        },

        /**
         * \u6839\u636e\u7d22\u5f15\u83b7\u53d6\u5b50\u63a7\u4ef6
         * <pre><code>
         *  control.getChildAt(0);//\u83b7\u53d6\u7b2c\u4e00\u4e2a\u5b50\u63a7\u4ef6
         *  control.getChildAt(2); //\u83b7\u53d6\u7b2c\u4e09\u4e2a\u5b50\u63a7\u4ef6
         * </code></pre>
         * @param {Number} index 0-based \u7d22\u5f15\u503c.
         * @return {BUI.Component.Controller} \u5b50\u63a7\u4ef6\u6216\u8005null 
         */
        getChildAt: function (index) {
            var children = this.get('children');
            return children[index] || null;
        },
        /**
         * \u6839\u636eId\u83b7\u53d6\u5b50\u63a7\u4ef6
         * <pre><code>
         *  control.getChild('id'); //\u4ece\u63a7\u4ef6\u7684\u76f4\u63a5\u5b50\u63a7\u4ef6\u4e2d\u67e5\u627e
         *  control.getChild('id',true);//\u9012\u5f52\u67e5\u627e\u6240\u6709\u5b50\u63a7\u4ef6\uff0c\u5305\u542b\u5b50\u63a7\u4ef6\u7684\u5b50\u63a7\u4ef6
         * </code></pre>
         * @param  {String} id \u63a7\u4ef6\u7f16\u53f7
         * @param  {Boolean} deep \u662f\u5426\u7ee7\u7eed\u67e5\u627e\u5728\u5b50\u63a7\u4ef6\u4e2d\u67e5\u627e
         * @return {BUI.Component.Controller} \u5b50\u63a7\u4ef6\u6216\u8005null 
         */
        getChild : function(id,deep){
            return this.getChildBy(function(item){
                return item.get('id') === id;
            },deep);
        },
        /**
         * \u901a\u8fc7\u5339\u914d\u51fd\u6570\u67e5\u627e\u5b50\u63a7\u4ef6\uff0c\u8fd4\u56de\u7b2c\u4e00\u4e2a\u5339\u914d\u7684\u5bf9\u8c61
         * <pre><code>
         *  control.getChildBy(function(child){//\u4ece\u63a7\u4ef6\u7684\u76f4\u63a5\u5b50\u63a7\u4ef6\u4e2d\u67e5\u627e
         *    return child.get('id') = '1243';
         *  }); 
         *  
         *  control.getChild(function(child){//\u9012\u5f52\u67e5\u627e\u6240\u6709\u5b50\u63a7\u4ef6\uff0c\u5305\u542b\u5b50\u63a7\u4ef6\u7684\u5b50\u63a7\u4ef6
         *    return child.get('id') = '1243';
         *  },true);
         * </code></pre>
         * @param  {Function} math \u67e5\u627e\u7684\u5339\u914d\u51fd\u6570
         * @param  {Boolean} deep \u662f\u5426\u7ee7\u7eed\u67e5\u627e\u5728\u5b50\u63a7\u4ef6\u4e2d\u67e5\u627e
         * @return {BUI.Component.Controller} \u5b50\u63a7\u4ef6\u6216\u8005null 
         */
        getChildBy : function(math,deep){
            return this.getChildrenBy(math,deep)[0] || null;
        },
        /**
         * \u83b7\u53d6\u63a7\u4ef6\u7684\u9644\u52a0\u9ad8\u5ea6 = control.get('el').outerHeight() - control.get('el').height()
         * @protected
         * @return {Number} \u9644\u52a0\u5bbd\u5ea6
         */
        getAppendHeight : function(){
            var el = this.get('el');
            return el.outerHeight() - el.height();
        },
        /**
         * \u83b7\u53d6\u63a7\u4ef6\u7684\u9644\u52a0\u5bbd\u5ea6 = control.get('el').outerWidth() - control.get('el').width()
         * @protected
         * @return {Number} \u9644\u52a0\u5bbd\u5ea6
         */
        getAppendWidth : function(){
            var el = this.get('el');
            return el.outerWidth() - el.width();
        },
        /**
         * \u67e5\u627e\u7b26\u5408\u6761\u4ef6\u7684\u5b50\u63a7\u4ef6
         * <pre><code>
         *  control.getChildrenBy(function(child){//\u4ece\u63a7\u4ef6\u7684\u76f4\u63a5\u5b50\u63a7\u4ef6\u4e2d\u67e5\u627e
         *    return child.get('type') = '1';
         *  }); 
         *  
         *  control.getChildrenBy(function(child){//\u9012\u5f52\u67e5\u627e\u6240\u6709\u5b50\u63a7\u4ef6\uff0c\u5305\u542b\u5b50\u63a7\u4ef6\u7684\u5b50\u63a7\u4ef6
         *    return child.get('type') = '1';
         *  },true);
         * </code></pre>
         * @param  {Function} math \u67e5\u627e\u7684\u5339\u914d\u51fd\u6570
         * @param  {Boolean} deep \u662f\u5426\u7ee7\u7eed\u67e5\u627e\u5728\u5b50\u63a7\u4ef6\u4e2d\u67e5\u627e\uff0c\u5982\u679c\u7b26\u5408\u4e0a\u9762\u7684\u5339\u914d\u51fd\u6570\uff0c\u5219\u4e0d\u518d\u5f80\u4e0b\u67e5\u627e
         * @return {BUI.Component.Controller[]} \u5b50\u63a7\u4ef6\u6570\u7ec4 
         */
        getChildrenBy : function(math,deep){
            var self = this,
                results = [];
            if(!math){
                return results;
            }

            self.eachChild(function(child){
                if(math(child)){
                    results.push(child);
                }else if(deep){

                    results = results.concat(child.getChildrenBy(math,deep));
                }
            });
            return results;
        },
        /**
         * \u904d\u5386\u5b50\u5143\u7d20
         * <pre><code>
         *  control.eachChild(function(child,index){ //\u904d\u5386\u5b50\u63a7\u4ef6
         *  
         *  });
         * </code></pre>
         * @param  {Function} func \u8fed\u4ee3\u51fd\u6570\uff0c\u51fd\u6570\u539f\u578bfunction(child,index)
         */
        eachChild : function(func){
            BUI.each(this.get('children'),func);
        },
        /**
         * Handle dblclick events. By default, this performs its associated action by calling
         * {@link BUI.Component.Controller#performActionInternal}.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleDblClick: function (ev) {
            this.performActionInternal(ev);
            if(!this.isChildrenElement(ev.target)){
                this.fire('dblclick',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Called by it's container component to dispatch mouseenter event.
         * @private
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseOver: function (ev) {
            var self = this,
                el = self.get('el');
            if (!isMouseEventWithinElement(ev, el)) {
                self.handleMouseEnter(ev);
                
            }
        },

        /**
         * Called by it's container component to dispatch mouseleave event.
         * @private
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseOut: function (ev) {
            var self = this,
                el = self.get('el');
            if (!isMouseEventWithinElement(ev, el)) {
                self.handleMouseLeave(ev);
                
            }
        },

        /**
         * Handle mouseenter events. If the component is not disabled, highlights it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseEnter: function (ev) {
            var self = this;
            this.set('highlighted', !!ev);
            self.fire('mouseenter',{domTarget : ev.target,domEvent : ev});
        },

        /**
         * Handle mouseleave events. If the component is not disabled, de-highlights it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseLeave: function (ev) {
            var self = this;
            self.set('active', false);
            self.set('highlighted', !ev);
            self.fire('mouseleave',{domTarget : ev.target,domEvent : ev});
        },

        /**
         * Handles mousedown events. If the component is not disabled,
         * If the component is activeable, then activate it.
         * If the component is focusable, then focus it,
         * else prevent it from receiving keyboard focus.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseDown: function (ev) {
            var self = this,
                n,
                isMouseActionButton = ev['which'] === 1,
                el;
            if (isMouseActionButton) {
                el = self.getKeyEventTarget();
                if (self.get('activeable')) {
                    self.set('active', true);
                }
                if (self.get('focusable')) {
                    el[0].focus();
                    self.set('focused', true);
                }

                if (!self.get('allowTextSelection')) {
                    // firefox /chrome \u4e0d\u4f1a\u5f15\u8d77\u7126\u70b9\u8f6c\u79fb
                    n = ev.target.nodeName;
                    n = n && n.toLowerCase();
                    // do not prevent focus when click on editable element
                    if (n !== 'input' && n !== 'textarea') {
                        ev.preventDefault();
                    }
                }
                if(!self.isChildrenElement(ev.target)){
                    self.fire('mousedown',{domTarget : ev.target,domEvent : ev});
                }
                
            }
        },

        /**
         * Handles mouseup events.
         * If this component is not disabled, performs its associated action by calling
         * {@link BUI.Component.Controller#performActionInternal}, then deactivates it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseUp: function (ev) {
            var self = this,
                isChildrenElement = self.isChildrenElement(ev.target);
            // \u5de6\u952e
            if (self.get('active') && ev.which === 1) {
                self.performActionInternal(ev);
                self.set('active', false);
                if(!isChildrenElement){
                    self.fire('click',{domTarget : ev.target,domEvent : ev});
                }
            }
            if(!isChildrenElement){
                self.fire('mouseup',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Handles context menu.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleContextMenu: function (ev) {
        },

        /**
         * Handles focus events. Style focused class.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleFocus: function (ev) {
            this.set('focused', !!ev);
            this.fire('focus',{domEvent : ev,domTarget : ev.target});
        },

        /**
         * Handles blur events. Remove focused class.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleBlur: function (ev) {
            this.set('focused', !ev);
            this.fire('blur',{domEvent : ev,domTarget : ev.target});
        },

        /**
         * Handle enter keydown event to {@link BUI.Component.Controller#performActionInternal}.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleKeyEventInternal: function (ev) {
            var self = this,
                isChildrenElement = self.isChildrenElement(ev.target);
            if (ev.which === 13) {
                if(!isChildrenElement){
                    self.fire('click',{domTarget : ev.target,domEvent : ev});
                }
                
                return this.performActionInternal(ev);
            }
            if(!isChildrenElement){
                self.fire('keydown',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Handle keydown events.
         * If the component is not disabled, call {@link BUI.Component.Controller#handleKeyEventInternal}
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleKeydown: function (ev) {
            var self = this;
            if (self.handleKeyEventInternal(ev)) {
                ev.halt();
                return true;
            }
        },
        handleKeyUp : function(ev){
            var self = this;
            if(!self.isChildrenElement(ev.target)){
                self.fire('keyup',{domTarget : ev.target,domEvent : ev});
            }
        },
        /**
         * Performs the appropriate action when this component is activated by the user.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        performActionInternal: function (ev) {
        },
        /**
         * \u6790\u6784\u51fd\u6570
         * @protected
         */
        destructor: function () {
            var self = this,
                id,
                i,
                view,
                children = self.get('children');
            id = self.get('id');
            for (i = 0; i < children.length; i++) {
                children[i].destroy && children[i].destroy();
            }
            self.get('view').destroy();
            Manager.removeComponent(id);
        }
    },
    {
        ATTRS: 
        {
            /**
             * \u63a7\u4ef6\u7684Html \u5185\u5bb9
             * <pre><code>
             *  new Control({
             *     content : '\u5185\u5bb9',
             *     render : '#c1'
             *  });
             * </code></pre>
             * @cfg {String|jQuery} content
             */
            /**
             * \u63a7\u4ef6\u7684Html \u5185\u5bb9
             * @type {String|jQuery}
             */
            content:{
                view:1
            },
			/**
			 * \u63a7\u4ef6\u6839\u8282\u70b9\u4f7f\u7528\u7684\u6807\u7b7e
             * <pre><code>
             *  new Control({
             *     elTagName : 'ul',
             *      content : '<li>\u5185\u5bb9</li>',  //\u63a7\u4ef6\u7684DOM &lt;ul&gt;&lt;li&gt;\u5185\u5bb9&lt;/li&gt;&lt;/ul&gt;
             *     render : '#c1'
             *  });  
             * </code></pre>
			 * @cfg {String} elTagName
			 */
			elTagName: {
				// \u751f\u6210\u6807\u7b7e\u540d\u5b57
				view : true,
				value: 'div'
			},
            /**
             * \u5b50\u5143\u7d20\u7684\u9ed8\u8ba4 xclass,\u914d\u7f6echild\u7684\u65f6\u5019\u6ca1\u5fc5\u8981\u6bcf\u6b21\u90fd\u586b\u5199xclass
             * @type {String}
             */
            defaultChildClass : {
                
            },
            /**
             * \u5982\u679c\u63a7\u4ef6\u672a\u8bbe\u7f6e xclass\uff0c\u540c\u65f6\u7236\u5143\u7d20\u8bbe\u7f6e\u4e86 defaultChildClass\uff0c\u90a3\u4e48
             * xclass = defaultChildClass + '-' + xtype
             * <pre><code>
             *  A.ATTRS = {
             *    defaultChildClass : {
             *        value : 'b'
             *    }
             *  }
             *  //\u7c7bB \u7684xclass = 'b'\u7c7b B1\u7684xclass = 'b-1',\u7c7b B2\u7684xclass = 'b-2',\u90a3\u4e48
             *  var a = new A({
             *    children : [
             *        {content : 'b'}, //B\u7c7b
             *        {content : 'b1',xtype:'1'}, //B1\u7c7b
             *        {content : 'b2',xtype:'2'}, //B2\u7c7b
             *    ]
             *  });
             * </code></pre>
             * @type {String}
             */
            xtype : {

            },
            /**
             * \u6807\u793a\u63a7\u4ef6\u7684\u552f\u4e00\u7f16\u53f7\uff0c\u9ed8\u8ba4\u4f1a\u81ea\u52a8\u751f\u6210
             * @cfg {String} id
             */
            /**
             * \u6807\u793a\u63a7\u4ef6\u7684\u552f\u4e00\u7f16\u53f7\uff0c\u9ed8\u8ba4\u4f1a\u81ea\u52a8\u751f\u6210
             * @type {String}
             */
            id : {
                view : true
            },
            /**
             * \u63a7\u4ef6\u5bbd\u5ea6
             * <pre><code>
             * new Control({
             *   width : 200 // 200,'200px','20%'
             * });
             * </code></pre>
             * @cfg {Number|String} width
             */
            /**
             * \u63a7\u4ef6\u5bbd\u5ea6
             * <pre><code>
             *  control.set('width',200);
             *  control.set('width','200px');
             *  control.set('width','20%');
             * </code></pre>
             * @type {Number|String}
             */
            width:{
                view:1
            },
            /**
             * \u63a7\u4ef6\u5bbd\u5ea6
             * <pre><code>
             * new Control({
             *   height : 200 // 200,'200px','20%'
             * });
             * </code></pre>
             * @cfg {Number|String} height
             */
            /**
             * \u63a7\u4ef6\u5bbd\u5ea6
             * <pre><code>
             *  control.set('height',200);
             *  control.set('height','200px');
             *  control.set('height','20%');
             * </code></pre>
             * @type {Number|String}
             */
            height:{
                view:1
            },
            /**
             * \u63a7\u4ef6\u6839\u8282\u70b9\u5e94\u7528\u7684\u6837\u5f0f
             * <pre><code>
             *  new Control({
             *   elCls : 'test',
             *   content : '\u5185\u5bb9',
             *   render : '#t1'   //&lt;div id='t1'&gt;&lt;div class="test"&gt;\u5185\u5bb9&lt;/div&gt;&lt;/div&gt;
             *  });
             * </code></pre>
             * @cfg {String} elCls
             */
            /**
             * \u63a7\u4ef6\u6839\u8282\u70b9\u5e94\u7528\u7684\u6837\u5f0f css class
             * @type {String}
             */
            elCls:{
                view:1
            },
            /**
             * @cfg {Object} elStyle
			 * \u63a7\u4ef6\u6839\u8282\u70b9\u5e94\u7528\u7684css\u5c5e\u6027
             *  <pre><code>
             *    var cfg = {elStyle : {width:'100px', height:'200px'}};
             *  </code></pre>
             */
            /**
             * \u63a7\u4ef6\u6839\u8282\u70b9\u5e94\u7528\u7684css\u5c5e\u6027\uff0c\u4ee5\u952e\u503c\u5bf9\u5f62\u5f0f
             * @type {Object}
			 *  <pre><code>
             *	 control.set('elStyle',	{
             *		width:'100px',
             *		height:'200px'
             *   });
             *  </code></pre>
             */
            elStyle:{
                view:1
            },
            /**
             * @cfg {Object} elAttrs
			 * \u63a7\u4ef6\u6839\u8282\u70b9\u5e94\u7528\u7684\u5c5e\u6027\uff0c\u4ee5\u952e\u503c\u5bf9\u5f62\u5f0f:
             * <pre><code>
             *  new Control({
             *    elAttrs :{title : 'tips'}   
             *  });
             * </code></pre>
             */
            /**
             * @type {Object}
			 * \u63a7\u4ef6\u6839\u8282\u70b9\u5e94\u7528\u7684\u5c5e\u6027\uff0c\u4ee5\u952e\u503c\u5bf9\u5f62\u5f0f:
             * { title : 'tips'}
             * @ignore
             */
            elAttrs:{
                view:1
            },
            /**
             * \u5c06\u63a7\u4ef6\u63d2\u5165\u5230\u6307\u5b9a\u5143\u7d20\u524d
             * <pre><code>
             *  new Control({
             *      elBefore : '#t1'
             *  });
             * </code></pre>
             * @cfg {jQuery} elBefore
             */
            /**
             * \u5c06\u63a7\u4ef6\u63d2\u5165\u5230\u6307\u5b9a\u5143\u7d20\u524d
             * @type {jQuery}
             * @ignore
             */
            elBefore:{
                // better named to renderBefore, too late !
                view:1
            },

            /**
             * \u53ea\u8bfb\u5c5e\u6027\uff0c\u6839\u8282\u70b9DOM
             * @type {jQuery}
             */
            el:{
                view:1
            },
            /**
             * \u63a7\u4ef6\u652f\u6301\u7684\u4e8b\u4ef6
             * @type {Object}
             * @protected
             */
            events : {
                value : {
                    /**
                     * \u70b9\u51fb\u4e8b\u4ef6\uff0c\u6b64\u4e8b\u4ef6\u4f1a\u5192\u6ce1\uff0c\u6240\u4ee5\u53ef\u4ee5\u5728\u7236\u5143\u7d20\u4e0a\u76d1\u542c\u6240\u6709\u5b50\u5143\u7d20\u7684\u6b64\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'click' : true,
                    /**
                     * \u53cc\u51fb\u4e8b\u4ef6\uff0c\u6b64\u4e8b\u4ef6\u4f1a\u5192\u6ce1\uff0c\u6240\u4ee5\u53ef\u4ee5\u5728\u7236\u5143\u7d20\u4e0a\u76d1\u542c\u6240\u6709\u5b50\u5143\u7d20\u7684\u6b64\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'dblclick' : true,
                    /**
                     * \u9f20\u6807\u79fb\u5165\u63a7\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'mouseenter' : true,
                    /**
                     * \u9f20\u6807\u79fb\u51fa\u63a7\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'mouseleave' : true,
                    /**
                     * \u952e\u76d8\u6309\u4e0b\u6309\u952e\u4e8b\u4ef6\uff0c\u6b64\u4e8b\u4ef6\u4f1a\u5192\u6ce1\uff0c\u6240\u4ee5\u53ef\u4ee5\u5728\u7236\u5143\u7d20\u4e0a\u76d1\u542c\u6240\u6709\u5b50\u5143\u7d20\u7684\u6b64\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'keydown' : true,
                    /**
                     * \u952e\u76d8\u6309\u952e\u62ac\u8d77\u63a7\u4ef6\uff0c\u6b64\u4e8b\u4ef6\u4f1a\u5192\u6ce1\uff0c\u6240\u4ee5\u53ef\u4ee5\u5728\u7236\u5143\u7d20\u4e0a\u76d1\u542c\u6240\u6709\u5b50\u5143\u7d20\u7684\u6b64\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'keyup' : true,
                    /**
                     * \u63a7\u4ef6\u83b7\u53d6\u7126\u70b9\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'focus' : false,
                    /**
                     * \u63a7\u4ef6\u4e22\u5931\u7126\u70b9\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'blur' : false,
                    /**
                     * \u9f20\u6807\u6309\u4e0b\u63a7\u4ef6\uff0c\u6b64\u4e8b\u4ef6\u4f1a\u5192\u6ce1\uff0c\u6240\u4ee5\u53ef\u4ee5\u5728\u7236\u5143\u7d20\u4e0a\u76d1\u542c\u6240\u6709\u5b50\u5143\u7d20\u7684\u6b64\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'mousedown' : true,
                    /**
                     * \u9f20\u6807\u62ac\u8d77\u63a7\u4ef6\uff0c\u6b64\u4e8b\u4ef6\u4f1a\u5192\u6ce1\uff0c\u6240\u4ee5\u53ef\u4ee5\u5728\u7236\u5143\u7d20\u4e0a\u76d1\u542c\u6240\u6709\u5b50\u5143\u7d20\u7684\u6b64\u4e8b\u4ef6
                     * @event
                     * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
                     * @param {BUI.Component.Controller} e.target \u89e6\u53d1\u4e8b\u4ef6\u7684\u5bf9\u8c61
                     * @param {jQuery.Event} e.domEvent DOM\u89e6\u53d1\u7684\u4e8b\u4ef6
                     * @param {HTMLElement} e.domTarget \u89e6\u53d1\u4e8b\u4ef6\u7684DOM\u8282\u70b9
                     */
                    'mouseup' : true,
                    /**
                     * \u63a7\u4ef6\u663e\u793a
                     * @event
                     */
                    'show' : false,
                    /**
                     * \u63a7\u4ef6\u9690\u85cf
                     * @event
                     */
                    'hide' : false
                }
            },
            /**
             * \u6307\u5b9a\u63a7\u4ef6\u7684\u5bb9\u5668
             * <pre><code>
             *  new Control({
             *    render : '#t1',
             *    elCls : 'test',
             *    content : '<span>123</span>'  //&lt;div id="t1"&gt;&lt;div class="test bui-xclass"&gt;&lt;span&gt;123&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;
             *  });
             * </code></pre>
             * @cfg {jQuery} render
             */
            /**
             * \u6307\u5b9a\u63a7\u4ef6\u7684\u5bb9\u5668
             * @type {jQuery}
             * @ignore
             */
            render:{
                view:1
            },
            /**
             * ARIA \u6807\u51c6\u4e2d\u7684role,\u4e0d\u8981\u66f4\u6539\u6b64\u5c5e\u6027
             * @type {String}
             * @protected
             */
            role : {
                view : 1
            },
            /**
             * \u72b6\u6001\u76f8\u5173\u7684\u6837\u5f0f,\u9ed8\u8ba4\u60c5\u51b5\u4e0b\u4f1a\u4f7f\u7528 \u524d\u7f00\u540d + xclass + '-' + \u72b6\u6001\u540d
             * <ol>
             *     <li>hover</li>
             *     <li>focused</li>
             *     <li>active</li>
             *     <li>disabled</li>
             * </ol>
             * @type {Object}
             */
            statusCls : {
                view : true,
                value : {

                }
            },
            /**
             * \u63a7\u4ef6\u7684\u53ef\u89c6\u65b9\u5f0f,\u503c\u4e3a\uff1a
             *  - 'display' 
             *  - 'visibility'
             *  <pre><code>
             *   new Control({
             *     visibleMode: 'visibility'
             *   });
             *  </code></pre>
             * @cfg {String} [visibleMode = 'display']
             */
            /**
             * \u63a7\u4ef6\u7684\u53ef\u89c6\u65b9\u5f0f,\u4f7f\u7528 css 
             *  - 'display' \u6216\u8005 
             *  - 'visibility'
             * <pre><code>
             *  control.set('visibleMode','display')
             * </code></pre>
             * @type {String}
             */
            visibleMode:{
                view:1,
                value : 'display'
            },
            /**
             * \u63a7\u4ef6\u662f\u5426\u53ef\u89c1
             * <pre><code>
             *  new Control({
             *    visible : false   //\u9690\u85cf
             *  });
             * </code></pre>
             * @cfg {Boolean} [visible = true]
             */
            /**
             * \u63a7\u4ef6\u662f\u5426\u53ef\u89c1
             * <pre><code>
             *  control.set('visible',true); //control.show();
             *  control.set('visible',false); //control.hide();
             * </code></pre>
             * @type {Boolean}
             * @default true
             */
            visible:{
                value:true,
                view:1
            },
            /**
             * \u662f\u5426\u5141\u8bb8\u5904\u7406\u9f20\u6807\u4e8b\u4ef6
             * @default true.
             * @type {Boolean}
             * @protected
             */
            handleMouseEvents: {
                value: true
            },

            /**
             * \u63a7\u4ef6\u662f\u5426\u53ef\u4ee5\u83b7\u53d6\u7126\u70b9
             * @default true.
             * @protected
             * @type {Boolean}
             */
            focusable: {
                value: false,
                view: 1
            },
            /**
             * \u4e00\u65e6\u4f7f\u7528loader\u7684\u9ed8\u8ba4\u914d\u7f6e
             * @protected
             * @type {Object}
             */
            defaultLoaderCfg : {
                value : {
                    property : 'content',
                    autoLoad : true
                }
            },
            /**
             * \u63a7\u4ef6\u5185\u5bb9\u7684\u52a0\u8f7d\u5668
             * @type {BUI.Component.Loader}
             */
            loader : {
                getter : function(v){
                    var _self = this,
                        defaultCfg;
                    if(v && !v.isLoader){
                        v.target = _self;
                        defaultCfg = _self.get('defaultLoaderCfg')
                        v = new Loader(BUI.merge(defaultCfg,v));
                        _self.setInternal('loader',v);
                    }
                    return v;
                }
            },
            /**
             * 1. Whether allow select this component's text.<br/>
             * 2. Whether not to lose last component's focus if click current one (set false).
             *
             * Defaults to: false.
             * @type {Boolean}
             * @property allowTextSelection
             * @protected
             */
            /**
             * @ignore
             */
            allowTextSelection: {
                // \u548c focusable \u5206\u79bb
                // grid \u9700\u6c42\uff1a\u5bb9\u5668\u5141\u8bb8\u9009\u62e9\u91cc\u9762\u5185\u5bb9
                value: true
            },

            /**
             * \u63a7\u4ef6\u662f\u5426\u53ef\u4ee5\u6fc0\u6d3b
             * @default true.
             * @type {Boolean}
             * @protected
             */
            activeable: {
                value: true
            },

            /**
             * \u63a7\u4ef6\u662f\u5426\u83b7\u53d6\u7126\u70b9
             * @type {Boolean}
             * @readOnly
             */
            focused: {
                view: 1
            },

            /**
             * \u63a7\u4ef6\u662f\u5426\u5904\u4e8e\u6fc0\u6d3b\u72b6\u6001\uff0c\u6309\u94ae\u6309\u4e0b\u8fd8\u672a\u62ac\u8d77
             * @type {Boolean}
             * @default false
             * @protected
             */
            active: {
                view: 1
            },
            /**
             * \u63a7\u4ef6\u662f\u5426\u9ad8\u4eae
             * @cfg {Boolean} highlighted
             * @ignore
             */
            /**
             * \u63a7\u4ef6\u662f\u5426\u9ad8\u4eae
             * @type {Boolean}
             * @protected
             */
            highlighted: {
                view: 1
            },
            /**
             * \u5b50\u63a7\u4ef6\u96c6\u5408
             * @cfg {BUI.Component.Controller[]} children
             */
            /**
             * \u5b50\u63a7\u4ef6\u96c6\u5408
             * @type {BUI.Component.Controller[]}
             */
            children: {
                sync : false,
                value: []
            },
            /**
             * \u63a7\u4ef6\u7684CSS\u524d\u7f00
             * @cfg {String} [prefixCls = BUI.prefix]
             */
            /**
             * \u63a7\u4ef6\u7684CSS\u524d\u7f00
             * @type {String}
             * @default BUI.prefix
             */
            prefixCls: {
                value: BUI.prefix, // box srcNode need
                view: 1
            },

            /**
             * \u7236\u63a7\u4ef6
             * @cfg {BUI.Component.Controller} parent
             * @ignore
             */
            /**
             * \u7236\u63a7\u4ef6
             * @type {BUI.Component.Controller}
             */
            parent: {
                setter: function (p) {
                    // \u4e8b\u4ef6\u5192\u6ce1\u6e90
                    this.addTarget(p);
                }
            },

            /**
             * \u7981\u7528\u63a7\u4ef6
             * @cfg {Boolean} [disabled = false]
             */
            /**
             * \u7981\u7528\u63a7\u4ef6
             * <pre><code>
             *  control.set('disabled',true); //==  control.disable();
             *  control.set('disabled',false); //==  control.enable();
             * </code></pre>
             * @type {Boolean}
             * @default false
             */
            disabled: {
                view: 1,
                value : false
            },
            /**
             * \u6e32\u67d3\u63a7\u4ef6\u7684View\u7c7b.
             * @protected
             * @cfg {BUI.Component.View} [xview = BUI.Component.View]
             */
            /**
             * \u6e32\u67d3\u63a7\u4ef6\u7684View\u7c7b.
             * @protected
             * @type {BUI.Component.View}
             */
            xview: {
                value: View
            }
        },
        PARSER : {
            visible : function(el){
                var _self = this,
                    display = el.css('display'),

                    visibility = el.css('visibility'),
                    visibleMode = _self.get('visibleMode');
                if((display == 'none' && visibleMode == 'display')  || (visibility == 'hidden' && visibleMode == 'visibility')){
                    return false;
                }
                return true;
            }
        }
    }, {
        xclass: 'controller',
        priority : 0
    });
    
    return Controller;
});
