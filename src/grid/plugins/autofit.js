/**
 * @fileOverview 自动适应表格宽度的扩展
 * @ignore
 */

define('bui/grid/plugins/autofit',['bui/common'],function (require) {
  var BUI = require('bui/common');

  /**
   * 表格自适应宽度
   * @class BUI.Grid.Plugins.AutoFit
   * @extends BUI.Base
   */
  var AutoFit = function(cfg){
    AutoFit.superclass.constructor.call(this,cfg);
  };

  BUI.extend(AutoFit,BUI.Base);

  AutoFit.ATTRS = {

  };

  BUI.augment(AutoFit,{
    //绑定事件
    bindUI : function(grid){
      var _self = this,
        handler;
      $(window).on('resize',function(){

        function autoFit(){
          clearTimeout(handler); //防止resize短时间内反复调用
          handler = setTimeout(function(){
            _self._autoFit(grid);
          },100);
        }
        autoFit();
      });
    },
    //自适应宽度
    _autoFit : function(grid){
      var render = grid.get('render'),
          width;
        grid.set('visible',false);
        width = $(render).width();

        grid.set('visible',true);
        grid.set('width',width);
    }

  });

  return AutoFit;
});