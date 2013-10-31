/**
 * @fileOverview 滚动条
 * @ignore
 */

define('bui/slider/scroller',['bui/common','bui/slider/slider'],function (require){

  var BUI = require('bui/common'),
    Slider = require('bui/slider/slider');

  /**
   * @class BUI.Slider.Scroller
   * 模拟滚动条
   * @extends BUI.Slider.Slider
   */
  var Scroller = Slider.extend({

  },{
    ATTRS : {

      /**
       * 绑定的容器
       * @type {jQuery|String}
       */
      panel : {

      },
      /**
       * 滑块的长度，水平滑块使用宽度，垂直滑块使用长度
       * @type {Object}
       */
      handlerLength : {

      },
      /**
       * 是否根据宽度/长度自动计算滑块的长度
       * @type {Object}
       */
      fitLength : {

      }
    }
  },{
    xclass : 'scroller'
  });

  return Scroller;

});