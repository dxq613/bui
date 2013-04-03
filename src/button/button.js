/**
 * @fileOverview 按钮
 * @ignore
 */

(function ($) {

  var Component = BUI.Component,
    UIBase = Component.UIBase,
    Button = BUI.namespace('Button');

  /**
   * 按钮视图
   * @private
   * @class BUI.Button.ButtonView
   * @extends BUI.Component.View
   * @mixins BUI.Component.UIBase.ListItemView
   */
  var buttonView = Component.View.extend([UIBase.ListItemView]);

  /**
   * 按钮
   * @class BUI.Button.Button
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ListItem
   */
  var button = Component.Controller.extend([UIBase.ListItem],{

    _uiSetText : function(v){
      this.set('content',v);
    }
    
  },{
    ATTRS : {
      elTagName:{
        view:true,
        value:'button'
      },
      /**
       * 按钮的文本
       * @type {String}
       */
      text : {

      },
      xview : {
        value : buttonView
      }
    }
  },{
    xclass : 'button'
  });

  Button.Button = button;
  Button.ButtonView = buttonView;
    
})(jQuery);