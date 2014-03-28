/**
 * @fileOverview 兼容kissy 和 jQuery 的适配器
 * @ignore
 */

/**
 * @private
 * @class jQuery
 * 原生的jQuery对象或者使用kissy时适配出来的对象
 */

window.BUI = window.BUI || {};

window.define = window.define || function(name,depends,fun){
  if(KISSY.isFunction(depends)){
    fun = depends;
    depends = [];
  }
  if(depends && !KISSY.Node){
    depends.unshift('core');
  }

  function require(name){
    return KISSY.require.call(KISSY,name);
  }

  function callback(S){
    return fun.call(window,require);
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
      callback && callback.apply(S,args);
    });
  };
}

var adapterCallback = function(){
  var S = KISSY,
    DOM = S.DOM,
    NLP = S.Node.prototype;

  window.jQuery = window.jQuery || (function () {
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
      //返回的结果不一致
      /*children : function(selector){
        return new wrapNode(DOM.children(this[0],selector));
      },*/
      sort : function(fn){
        return Array.prototype.sort.call(this,fn);
      },
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
      //返回的结果不一致
      find : function(selector){
        return new wrapNode(DOM.query(selector,this[0]));
      },
      /**
       * 判断是否符合指定的选择器
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
      //复写delegate，更改参数顺序
      delegate : function(selector,eventType,fn){
       return wrapNode.superclass.delegate.call(this,eventType,selector,fn);
      },
      //更改 便遍历函数的顺序
      //修改this,和对象
      each : function(fn){
        return wrapNode.superclass.each.call(this,function(value,index){
          return fn.call(this[0],index,value[0]);
        });
      },
      //第一个子元素
      first : function(){
        return new wrapNode(this[0]);
      },
      //查找父节点，jQuery 的parent 和parents 有差异
      parents : function(selector){
        return this.parent(selector);
      },
      //最后一个子元素
      last : function(){
        var length = this.length;
        return new wrapNode(this[length-1]);
      },
      /**
       * kissy 未提供此方法
       */
      offsetParent : function(){
        return new wrapNode(getOffsetParent(this[0]));
      },
      //参数顺序不一致
      animate : function(properties,speed, easing,callback){
        var params = getDurationParams(speed, easing,callback);
        wrapNode.superclass.animate.call(this,properties,params.duration,params.easing,params.complete);
      },
      /**
       * kissy 未提供此方法
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
      * 将表单数据序列化成对象
      * @return {Object} 表单元素的
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
        //checkbox 做特殊处理，如果所有checkbox都未选中时,设置字段为空
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

    //由于 kissy的动画单位和参数位置跟 jquery的不一致
    var durationMethods = ['fadeIn','fadeOut','fadeToggle','slideDown','slideUp','slideToggle','show','hide'];
    S.each(durationMethods,function(fnName){
      wrapNode.prototype[fnName] = function(speed, easing,callback){
        excuteDuration(this,NLP[fnName],speed,easing,callback);
      };
    });
    //jquery上的很多DOM的方法在kissy的Node上不支持
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

    //由于返回的对象的类型是S.Node，所以要更改类型
    var nodeMethods = ['children','parent','next','prev','siblings','closest'];
    S.each(nodeMethods,function(fnName){
      wrapNode.prototype[fnName] = function(selector){
        return new wrapNode(DOM[fnName](this[0],selector));
      }
    });

    S.mix(wrapNode,S);
    S.mix(wrapNode,{
      /**
       * 是否包含指定DOM
       */
      contains : function(container, contained){
        return S.DOM.contains(container, contained);
      },
      /**
       * 实现$.extend
       * @return {Object} 结果
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
            if(S.isObject(args[i]) || S.isArray(args[i])){
              S.mix(obj,args[i],undefined,undefined,deep);
            }
            
          }
        }
        return obj;
      },
      /**
       * kissy 的此方法跟 jQuery的接口不一致
       */
      each : function(elements,fn){
        S.each(elements,function(value,index){
          return fn(index,value);
        });
      },
      /**
       * 返回结果不一致
       */
      inArray : function(elem,arr){
        return S.indexOf(elem,arr);
      },
      /**
       * jQuery 的map函数将返回为 null 和 undefined的项不返回
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
       * 空操作
       */
      noop : function(){},
      
      parseJSON : S.JSON.parse
    })
    return wrapNode;
  })();

  window.$ = window.$ || window.jQuery;
  return KISSY;
};

define('bui/adapter',['core'],adapterCallback);
if(KISSY.Node){
  adapterCallback();
}

KISSY.config({
  packages:[{
    name:"bui",
    tag:"201312251606",
    path:"http://g.tbcdn.cn/fi",
    charset:'utf-8'
  }]
});