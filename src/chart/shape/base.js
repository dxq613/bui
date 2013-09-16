/**
 * @fileOverview 图形的基类
 * @ignore
 */

define('bui/chart/shape/base',['bui/chart/shape/svgparser'],function (require){

  var BUI = require('bui/common'),
    UA = BUI.UA,
    SvgParser = require('bui/chart/shape/svgparser');

  /**
   * @class BUI.Chart.Shape
   * 图形的基类
   */
  var Shape = function(cfg){
    //Shape.superclass.constructor.call(this,cfg);
    //this.constructor.ATTRS
    this.cfg = cfg;
    this.render();
  };

  Shape.ATTRS = {
    autoRender : {

    },
    render : {

    },
    el : {

    },
    type : {

    },
    attrs : {

    }
  };

  //BUI.extend(Shape,BUI.Base);

  BUI.augment(Shape,{
    set : function(name,value){
      this[name] = value;
    },
    get : function(name){
      return this[name];
    },
    getDefaultAttrs : function(){
      var _self = this,
        attrs = _self.constructor.ATTRS,
        values = {};

      BUI.each(attrs,function(v,k){
        values[k] = v.value;
      });
      return values;
    },
    initCfg : function(cfg){
      var _self = this,
        defaultAttrs = _self.
    },
    /**
     * 获取转换器，用来处理图形
     * @return {BUI.Chart.ShapeParser} 图形转换器
     */
    getParser : function(){
      if(UA.ie && UA.ie <= 8){

      }else{
        return new SvgParser();
      } 
    },
    /**
     * 渲染图形
     */
    render : function(){
      var _self = this,
        cfg = _self.get('cfg'),
        parser = _self.getParser(),
        el = parser.create(cfg.type,cfg.attrs,cfg.render);
      
      _self.set('el',el);
    },
    /**
     * 设置或者设置属性，有一下3中情形：
     *
     *   - name为字符串，value 为空，获取属性值
     *   - name为字符串，value不为空，设置属性值，返回this
     *   - name为键值对，value 为空，设置属性值
     *   
     * @param  {String|Object} name  属性名
     * @param  {*} value 属性值
     * @return {*} 属性值
     */
    attr : function(name,value){
      var _self = this,
        el = _self.get('el'),
        parser = _self.getParser();
      if($.isPlainObject(name)){
        parser.setAttr(el,name);
      }
      if(value != null){
        parser.setAttr(el,name,value);
      }else{
        parser.getAttr(el,name);
        return this;
      }
    }
  });

  return Shape;
});