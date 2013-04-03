/**
 * @fileOverview 按钮组
 * @ignore
 */

(function ($) {
  var Component = BUI.Component,
    Button = BUI.namespace('Button'),
    UIBase = BUI.Component.UIBase;

  var buttonGroup = Component.Controller.extend([UIBase.ChildList],{

  },{
    ATTRS : {

      defaultChildClass : {
        value : 'button'
      }

    }
  },{
    xclass:'button-group'
  });

  Button.ButtonGroup = buttonGroup;
})(jQuery);