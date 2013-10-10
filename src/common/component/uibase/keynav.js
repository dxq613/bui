/**
 * @fileOverview 使用键盘导航
 * @ignore
 */

define('bui/component/uibase/keynav',['bui/keycode'],function (require) {

  var KeyCode = require('bui/keycode'),
      wrapBehavior = BUI.wrapBehavior,
      getWrapBehavior = BUI.getWrapBehavior;
  /**
   * 键盘导航
   * @class BUI.Component.UIBase.KeyNav
   */
  var keyNav = function () {
    
  };

  keyNav.ATTRS = {

    /**
     * 是否允许键盘导航
     * @cfg {Boolean} [allowKeyNav = true]
     */
    allowKeyNav : {
      value : true
    },
    /**
     * 导航使用的事件
     * @cfg {String} [navEvent = 'keydown']
     */
    navEvent : {
      value : 'keydown'
    },
    /**
     * 当获取事件的DOM是 input,textarea,select等时，不处理键盘导航
     * @cfg {Object} [ignoreInputFields='true']
     */
    ignoreInputFields : {
      value : true
    }

  };

  keyNav.prototype = {

    __bindUI : function () {
      
    },
    _uiSetAllowKeyNav : function(v){
      var _self = this,
        eventName = _self.get('navEvent'),
        el = _self.get('el');
      if(v){
        el.on(eventName,wrapBehavior(_self,'_handleKeyDown'));
      }else{
        el.off(eventName,getWrapBehavior(_self,'_handleKeyDown'));
      }
    },
    /**
     * 处理键盘导航
     * @private
     */
    _handleKeyDown : function(ev){
      var _self = this,
        ignoreInputFields = _self.get('ignoreInputFields'),
        code = ev.which;
      if(ignoreInputFields && $(ev.target).is('input,select,textarea')){
        return;
      }
      
      switch(code){
        case KeyCode.UP :
          ev.preventDefault();
          _self.handleNavUp(ev);
          break;
        case KeyCode.DOWN : 
          ev.preventDefault();
          _self.handleNavDown(ev);
          break;
        case KeyCode.RIGHT : 
          ev.preventDefault();
          _self.handleNavRight(ev);
          break;
        case KeyCode.LEFT : 
          ev.preventDefault();
          _self.handleNavLeft(ev);
          break;
        case KeyCode.ENTER : 
          _self.handleNavEnter(ev);
          break;
        case KeyCode.ESC : 
          _self.handleNavEsc(ev);
          break;
        case KeyCode.TAB :
          _self.handleNavTab(ev);
          break;
        default:
          break;
      }
    },
    /**
     * 处理向上导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavUp : function (ev) {
      // body...
    },
    /**
     * 处理向下导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavDown : function (ev) {
      // body...
    },
    /**
     * 处理向左导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavLeft : function (ev) {
      // body...
    },
    /**
     * 处理向右导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavRight : function (ev) {
      // body...
    },
    /**
     * 处理确认键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEnter : function (ev) {
      // body...
    },
    /**
     * 处理 esc 键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEsc : function (ev) {
      // body...
    },
    /**
     * 处理Tab键
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavTab : function(ev){

    }

  };

  return keyNav;
});
