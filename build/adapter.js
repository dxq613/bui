/**
 * @fileOverview \u517c\u5bb9kissy \u548c jQuery \u7684\u9002\u914d\u5668
 * @ignore
 */

/**
 * @private
 * @class jQuery
 * \u539f\u751f\u7684jQuery\u5bf9\u8c61\u6216\u8005\u4f7f\u7528kissy\u65f6\u9002\u914d\u51fa\u6765\u7684\u5bf9\u8c61
 */

var S = KISSY,
    DOM = S.DOM,
    NLP = S.Node.prototype;

var jQuery = jQuery || (function () {
  'use strict';
  function excuteDuration(self,fn,speed, easing,callback){
    var params = getDurationParams(speed, easing,callback);

    fn.call(self,params.duration,params.complete,params.easing);
  }

  function getDurationParams(speed, easing,callback){

    if(S.isPlainObject(speed)){
      var obj = speed;
      if(S.isNumber(obj.duration)){
        obj.duration = obj.duration / 1000;
      }
      return obj;
    }

    if(S.isNumber(speed)){
      speed = speed / 1000;
    }else if(S.isString(speed)){
      callback = easing;
      easing = speed;
      speed = undefined;
    }else if(S.isFunction(speed)){
      callback = speed;
      speed = undefined;
    }

    if(S.isFunction(easing)){
      callback = easing;
      easing = undefined;
    }
    return {duration : speed,complete : callback,easing : easing};
  }

  function getOffsetParent(element) {
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

  var 
    wrapNode = function(selector,content){
      if(!(this instanceof wrapNode)){
        return new wrapNode(selector,content);
      }
      //S.ready
      if(S.isFunction(selector)){
        return S.ready(selector);
      }
      if(S.isString(selector)){
        if(content){
          return new wrapNode(content).find(selector);
        }
        return new wrapNode(S.all(selector));
      }
      S.Node.call(this,selector);
    };

  S.extend(wrapNode,S.Node);

  S.augment(wrapNode,{
    bind : NLP.on,
    off : NLP.detach,
    trigger : NLP.fire,
    //\u8fd4\u56de\u7684\u7ed3\u679c\u4e0d\u4e00\u81f4
    /*children : function(selector){
      return new wrapNode(DOM.children(this[0],selector));
    },*/
    filter : function(selector){
      if(!selector){
        return new wrapNode();
      }
      if(S.isString(selector)){
        return new wrapNode(DOM.filter(this[0],selector));
      } 
      var nodes = this.getDOMNodes(),
        rst;
      if(S.isFunction(selector)){
        rst = [];
        S.each(nodes,function(node,index){
          var r = selector.call(node,index);
          if(r){
            rst.push(node);
          }
        });
        return new wrapNode(rst);
      }

      S.each(nodes,function(node){
        if(node === selector){
          rst = node;
          return false;
        }
      });
      return new wrapNode(rst);
    },
    //\u8fd4\u56de\u7684\u7ed3\u679c\u4e0d\u4e00\u81f4
    find : function(selector){
      return new wrapNode(DOM.query(selector,this[0]));
    },
    /**
     * \u5224\u65ad\u662f\u5426\u7b26\u5408\u6307\u5b9a\u7684\u9009\u62e9\u5668
     */
    is : function(selector){
      var splits = selector.split(','),
        rst = false;
      for (var i = 0; i < splits.length; i++) {
        if(!rst && splits[i]){
          rst = rst || DOM.test(this[0],splits[i]);
        }
      };
      return rst;
    },
    //\u590d\u5199delegate\uff0c\u66f4\u6539\u53c2\u6570\u987a\u5e8f
    delegate : function(selector,eventType,fn){
     return wrapNode.superclass.delegate.call(this,eventType,selector,fn);
    },
    //\u66f4\u6539 \u4fbf\u904d\u5386\u51fd\u6570\u7684\u987a\u5e8f
    //\u4fee\u6539this,\u548c\u5bf9\u8c61
    each : function(fn){
      return wrapNode.superclass.each.call(this,function(value,index){
        return fn.call(this[0],index,value[0]);
      });
    },
    //\u7b2c\u4e00\u4e2a\u5b50\u5143\u7d20
    first : function(){
      return new wrapNode(this[0]);
    },
    //\u67e5\u627e\u7236\u8282\u70b9\uff0cjQuery \u7684parent \u548cparents \u6709\u5dee\u5f02
    parents : function(selector){
      return this.parent(selector);
    },
    //\u6700\u540e\u4e00\u4e2a\u5b50\u5143\u7d20
    last : function(){
      var length = this.length;
      return new wrapNode(this[length-1]);
    },
    /**
     * kissy \u672a\u63d0\u4f9b\u6b64\u65b9\u6cd5
     */
    offsetParent : function(){
      return new wrapNode(getOffsetParent(this[0]));
    },
    //\u53c2\u6570\u987a\u5e8f\u4e0d\u4e00\u81f4
    animate : function(properties,speed, easing,callback){
      var params = getDurationParams(speed, easing,callback);
      wrapNode.superclass.animate.call(this,properties,params.duration,params.easing,params.complete);
    },
    /**
     * kissy \u672a\u63d0\u4f9b\u6b64\u65b9\u6cd5
     */
    position : function(){
      var _self = this,
        offset = this.offset(),
        parent = _self.offsetParent();
      if(parent.length){
        var parentOffset = parent.offset();
        offset.left -= parentOffset.left;
        offset.top -= parentOffset.top;
      }
      return offset;
    },
    /**
    * \u5c06\u8868\u5355\u6570\u636e\u5e8f\u5217\u5316\u6210\u5bf9\u8c61
    * @return {Object} \u8868\u5355\u5143\u7d20\u7684
    */
    serializeArray:function(){
      var form = this[0],
        originElements = null,
        elements = null,
        arr =[],
        checkboxElements = null,
        result={};
      if(S.isArray(form)){
        originElements = form;
      }else{
        originElements =  S.makeArray(form.elements);
      }
      elements = S.filter(originElements,function(item){
        return (item.id ||item.name) && !item.disabled &&
          (item.checked || /select|textarea/i.test(item.nodeName) ||
            /text|hidden|password/i.test(item.type));
      });
      //checkbox \u505a\u7279\u6b8a\u5904\u7406\uff0c\u5982\u679c\u6240\u6709checkbox\u90fd\u672a\u9009\u4e2d\u65f6,\u8bbe\u7f6e\u5b57\u6bb5\u4e3a\u7a7a
      checkboxElements = S.filter(originElements,function(item){
        return (item.id ||item.name) && !item.disabled &&(/checkbox/i.test(item.type));
      });
      S.each(elements,function(elem){
        var val = S.one(elem).val(),
          name = elem.name||elem.id,
          obj = val == null ? {name:  name, value: ''} : S.isArray(val) ?
          S.map( val, function(val, i){
            return {name: name, value: val};
          }) :
          {name:  name, value: val};
        if(obj){
          arr.push(obj);
        }
      });
      return arr;
    }
  });

  //\u7531\u4e8e kissy\u7684\u52a8\u753b\u5355\u4f4d\u548c\u53c2\u6570\u4f4d\u7f6e\u8ddf jquery\u7684\u4e0d\u4e00\u81f4
  var durationMethods = ['fadeIn','fadeOut','fadeToggle','slideDown','slideUp','slideToggle','show','hide'];
  S.each(durationMethods,function(fnName){
    wrapNode.prototype[fnName] = function(speed, easing,callback){
      excuteDuration(this,NLP[fnName],speed,easing,callback);
    };
  });
  //jquery\u4e0a\u7684\u5f88\u591aDOM\u7684\u65b9\u6cd5\u5728kissy\u7684Node\u4e0a\u4e0d\u652f\u6301
  var domMethods = ['change','blur','focus','select'];
  S.each(domMethods,function(fnName){
    wrapNode.prototype[fnName] = function(){
      var el = this[0];
      if(el){
        if(el[fnName]){
          el[fnName]();
        }else{
          this.fire(fnName);
        }
        
      }
    }
  });

  //\u7531\u4e8e\u8fd4\u56de\u7684\u5bf9\u8c61\u7684\u7c7b\u578b\u662fS.Node\uff0c\u6240\u4ee5\u8981\u66f4\u6539\u7c7b\u578b
  var nodeMethods = ['children','parent','next','prev','siblings','closest'];
  S.each(nodeMethods,function(fnName){
    wrapNode.prototype[fnName] = function(selector){
      return new wrapNode(DOM[fnName](this[0],selector));
    }
  });

  S.mix(wrapNode,S);
  S.mix(wrapNode,{
    /**
     * \u662f\u5426\u5305\u542b\u6307\u5b9aDOM
     */
    contains : function(container, contained){
      return S.DOM.contains(container, contained);
    },
    /**
     * \u5b9e\u73b0$.extend
     * @return {Object} \u7ed3\u679c
     */
    extend : function(){
      var args = S.makeArray(arguments),
        deep = false,
        obj;
      if(S.isBoolean(arguments[0])){
        deep = args.shift();
      }
      obj = args[0];
      if(obj){
        for(var i = 1; i < args.length;i++){
          S.mix(obj,args[i],undefined,undefined,deep);
        }
      }
      return obj;
    },
    /**
     * kissy \u7684\u6b64\u65b9\u6cd5\u8ddf jQuery\u7684\u63a5\u53e3\u4e0d\u4e00\u81f4
     */
    each : function(elements,fn){
      S.each(elements,function(value,index){
        return fn(index,value);
      });
    },
    /**
     * \u8fd4\u56de\u7ed3\u679c\u4e0d\u4e00\u81f4
     */
    inArray : function(elem,arr){
      return S.indexOf(elem,arr);
    },
    /**
     * jQuery \u7684map\u51fd\u6570\u5c06\u8fd4\u56de\u4e3a null \u548c undefined\u7684\u9879\u4e0d\u8fd4\u56de
     */
    map : function(arr,callback){
      var rst = [];
      S.each(arr,function(item,index){
        var val = callback(item,index);
        if(val != null){
          rst.push(val);
        }
      });
      return rst;
    },

    /**
     * \u7a7a\u64cd\u4f5c
     */
    noop : function(){},
    
    parseJSON : S.JSON.parse
  })
  return wrapNode;
})();

var $ = $ || jQuery,
  BUI = BUI || {};;

window.define = window.define || function(name,depends,fun){
  if(KISSY.isFunction(depends)){
    fun = depends;
    depends = [];
  }

  function require(name){
    return KISSY.require.call(KISSY,name);
  }

  function callback(S){
    return fun.call(S,require);
  }
  KISSY.add(name,callback,{requires : depends});
};

if(!BUI.use){
  BUI.use = function(modules,callback){
    if(KISSY.isArray(modules)){
      modules = modules.join();
    };
    KISSY.use(modules,function(S){
      var args = KISSY.makeArray(arguments); 
      args.shift();
      callback.apply(S,args);
    });
  };
}
KISSY.config({
  packages:[{
    name:"bui",
    tag:"201307042102",
    path:"http://g.tbcdn.cn/fi",
    charset:'utf-8'
  }]
});