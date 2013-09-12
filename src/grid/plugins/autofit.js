/**
 * @fileOverview 自动适应表格宽度的扩展
 * @ignore
 */

define('bui/grid/plugins/autofit',['bui/common'],function (require) {
  var BUI = require('bui/common');

  /**
   * 表格自适应宽度
   * @class BUI.Grid.Plugins.AutoFit
   */
  var AutoFit = function(){

  };

  BUI.extend(AutoFit,BUI.Base);

  AutoFit.ATTRS = {

  };

  BUI.augment(AutoFit,{
    bindUI : function(grid){
      var _self = this,
        handler;
      $(window).on('resize',function(){

        function autoFit(){
          clearTimeout(handler);
          handler = setTimeout(function(){
            _self._autoFit(grid);
          },100);
        }
        autoFit();
      });
    },
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