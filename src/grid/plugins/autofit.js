/**
 * @fileOverview 自动适应表格宽度的扩展
 * @ignore
 */

define('bui/grid/plugins/autofit',['bui/common'],function (require) {
  var BUI = require('bui/common'),
    UA = BUI.UA;

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
          _self.set('handler',handler);
        }
        autoFit();
      });
    },
    //自适应宽度
    _autoFit : function(grid){
      var _self = this,
        render = $(grid.get('render')),
        docWidth = $(window).width(),//窗口宽度
        width,
        appendWidth = 0,
        parent = grid.get('el').parent();
      while(parent[0] && parent[0] != $('body')[0]){
        appendWidth += parent.outerWidth() - parent.width();
        parent = parent.parent();
      }

      grid.set('width',docWidth - appendWidth);
    }

  });

  return AutoFit;
});