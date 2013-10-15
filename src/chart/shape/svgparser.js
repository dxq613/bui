/**
 * @fileOverview svg操作的类
 * @ignore
 */

define('bui/chart/shape/svgparser',['bui/chart/shape/parser','bui/common'],function (require) {
  
  var doc = document,
    NS_SVG = 'http://www.w3.org/2000/svg',
    BUI = require('bui/common'),
    REG_KEY = /[A-Z]/g,
    Parser = require('bui/chart/shape/parser');
  var single = null;
  /**
   * SVG图形转换类，用于创建图形、设置图形属性
   * @class BUI.Chart.Shape.SvgParser
   * @extends BUI.Chart.Shape.Chart
   */
  var SvgParser = function(){
    if(!single){
      single = this;
    }
    return single;
  };

  BUI.extend(Parser,SvgParser);

  BUI.augment(SvgParser,{
    
    parseKey : function(k){
      return k.replace(REG_KEY,function(find){
        return '-' + find.toLowerCase();
      });
    },
    _set : function(node,attrs){
      var _self = this;
      BUI.each(attrs,function(v,k){
        var k= _self.parseKey(k);
  
        node.setAttribute(k,v);
      });
    },
    /**
     * 创建图形
     * @param  {String} type 类型
     * @param  {Object} attrs 属性
     * @param  {HTMLElement} container 父元素
     * @return {jQuery} 返回的图形
     */
    create : function(type,attrs,container){
      var _self = this,
        node = doc.createElementNS(NS_SVG,type),
        el = $(node);
      _self._set(node,attrs);
      //el.attr(attrs);
      el.appendTo(container);
      return el;
    },
    /**
     * 设置属性
     * @param {jQuery|HTMLElement} el 
     * @param {String|Object} name 属性名
     * @param {*} value 属性值
     */
    setAttr : function(el,name,value){
      var node = $(el)[0];
      if(!node){
        return;
      }
      if(BUI.isString(name)){
        $(el).attr(this.parseKey(name),value);
      }else{
        this._set(node,name);
      }
    },
    /**
     * 获取属性
     * @param {jQuery|HTMLElement} el 
     * @param {String|Object} name 属性名
     * @return {*} 属性值
     */
    getAttr : function(el,name){
      return $(el).attr(this.parseKey(name));
    }
  });

  return SvgParser;
});