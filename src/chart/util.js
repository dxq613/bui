/**
 * @fileOverview 图表帮助类
 * @ignore
 */

define('bui/chart/util',function (require) {
  
  /**
   * @class BUI.Chart.Util
   * 图表帮助类
   * @singleton
   */
  var Util = {
    
    /**
     * 基于脚本的动画的计时控制：requestAnimationFrame
     * @param {Function} callback 回调函数
     * @return {int} handle 返回的函数句柄
     */
    requestAFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function (callback) {
            return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
        };
    })(),
    /**
     * 取消动画帧
     */
    cancelAFrame = (function () {
      return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        };
    })()
  };

  return Util;
});