/**
 * @fileOverview 菜单按钮，点击按钮弹出菜单，选择选项
 * @ignore
 */

(function ($) {

  var Component= BUI.Component,
    UIBase = Component.UIBase;

  var menuButtonView = Component.View.extend([UIBase.openableView]),
    menuButton = Component.Controller.extend([UIBase.openable],{

      bindUI : function(){

      }
  },{
    ATTRS : {
      /**
       * 菜单
       * @type {BUI.Menu.PopMenu}
       * @readOnly
       */
      menu : {
        
      },
      items : {

      }
    }
  },{
    xclass : 'menu-button'
  });
})(jQuery);
