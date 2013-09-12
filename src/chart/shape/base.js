/**
 * @fileOverview 图形的基类
 * @ignore
 */

define('bui/chart/shape/base',function (require){

  var Shape = function(cfg){

  };

  Shape.ATTRS = {
    autoRender : {

    },
    render : {

    },
    el : {

    },
    fill : {

    },
    stroke : {

    },
    strokeWidth : {

    },
    fillOpacity : {

    },
    strokeOpacity : {

    },
    x : {

    },
    y : {

    }
  };

  BUI.augment(Shape,{
    /**
     * 获取转换器，用来处理图形
     * @return {BUI.Chart.ShapeParser} 图形转换器
     */
    getParser : function(){

    },
    /**
     * 渲染图形
     * @return {[type]} [description]
     */
    render : function(){

    },
    /**
     * 设置或者设置属性，有一下3中情形：
     *
     *   - name为字符串，value 为空，获取属性值
     *   - name为字符串，value不为空，设置属性值，返回this
     *   - name为键值对，value 为空，设置属性值，返回this
     * 
     * @param  {String|Object} name  属性名
     * @param  {*} value 属性值
     * @return {*} 属性值
     */
    attr : function(name,value){

    }
  });

  return Shape;
});