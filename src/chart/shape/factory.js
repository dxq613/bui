/**
 * @fileOverview 创建图形的工厂类
 * @ignore
 */

define('bui/chart/shape/factory',['bui/common'],function (require) {

  var BUI = require('bui/common');

  var Factory = function(){

  };

  BUI.augment(Factory,{
    
    createCircle : function(cfg){

    },
    createLine : function(cfg){

    },
    createPath : function(cfg){

    },
    createPolyline : function(cfg){

    },
    createShape : function(cfg){

    },
    createPolygon : function(cfg){

    },
    createShape : function(){

    }
  });

  return Factory;
});