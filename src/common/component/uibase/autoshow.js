/**
 * @fileOverview click，focus,hover等引起控件显示，并且定位
 * @ignore
 */

define('bui/component/uibase/autoshow',function () {

  /**
   * 处理自动显示控件的扩展，一般用于显示menu,picker,tip等
   * @class BUI.Component.UIBase.AutoShow
   */
  function autoShow() {
    
  }

  autoShow.ATTRS = {
    /**
     * 触发显示控件的DOM选择器
     * @cfg {HTMLElement|String|jQuery} trigger
     */
    /**
     * 触发显示控件的DOM选择器
     * @type {HTMLElement|String|jQuery}
     */
    trigger : {

    },
    /**
     * 是否使用代理的方式触发显示控件,如果tigger不是字符串，此属性无效
     * @cfg {Boolean} delegateTigger
     */
    /**
     * 是否使用代理的方式触发显示控件,如果tigger不是字符串，此属性无效
     * @type {Boolean}
     */
    delegateTigger : {
      value : false
    },
    /**
     * 选择器是否始终跟随触发器对齐
     * @cfg {Boolean} autoAlign
     */
    /**
     * 选择器是否始终跟随触发器对齐
     * @type {Boolean}
     */
    autoAlign :{
      value : true
    },
    /**
     * 控件显示时由此trigger触发，当配置项 trigger 选择器代表多个DOM 对象时，
     * 控件可由多个DOM对象触发显示。
     * @type {jQuery}
     * @readOnly
     */
    curTrigger : {

    },
    /**
     * 触发显示时的回调函数
     * @cfg {Function} triggerCallback
     */
    /**
     * 触发显示时的回调函数
     * @type {Function}
     */
    triggerCallback : {
      value : function (ev) {
        
      }
    },
    /**
     * 显示菜单的事件
     * @cfg {String} [triggerEvent='click']
     * @default 'click'
     */
    /**
     * 显示菜单的事件
     * @type {String}
     * @default 'click'
     */
    triggerEvent : {
      value:'click'
    },
    /**
     * 因为触发元素发生改变而导致控件隐藏
     * @cfg {String} triggerHideEvent
     */
    /**
     * 因为触发元素发生改变而导致控件隐藏
     * @type {String}
     */
    triggerHideEvent : {

    },
    events : {
      value : {
        /**
         * 当触发器（触发选择器出现）发生改变时，经常用于一个选择器对应多个触发器的情况
         * @event
         * @param {Object} e 事件对象
         * @param {jQuery} e.prevTrigger 之前触发器，可能为null
         * @param {jQuery} e.curTrigger 当前的触发器
         */
        'triggerchange':false
      }
    }
  };

  autoShow.prototype = {

    __createDom : function () {
      this._setTrigger();
    },
    _setTrigger : function () {
      var _self = this,
        triggerEvent = _self.get('triggerEvent'),
        triggerHideEvent = _self.get('triggerHideEvent'),
        triggerCallback = _self.get('triggerCallback'),
        trigger = _self.get('trigger'),
        isDelegate = _self.get('delegateTigger'),
        triggerEl = $(trigger);

      //触发显示
      function tiggerShow (ev) {
        var prevTrigger = _self.get('curTrigger'),
          curTrigger = isDelegate ?$(ev.currentTarget) : $(this),
          align = _self.get('align');
        if(!prevTrigger || prevTrigger[0] != curTrigger[0]){

          _self.set('curTrigger',curTrigger);
          _self.fire('triggerchange',{prevTrigger : prevTrigger,curTrigger : curTrigger});
        }
        if(_self.get('autoAlign')){
          align.node = curTrigger;
          
        }
        _self.set('align',align);
        _self.show();
        triggerCallback && triggerCallback(ev);
      }

      //触发隐藏
      function tiggerHide (ev){
        var toElement = ev.toElement;
        if(!toElement || !_self.containsElement(toElement)){ //mouseleave时，如果移动到当前控件上，取消消失
          _self.hide();
        }
      }

      if(triggerEvent){
        if(isDelegate && BUI.isString(trigger)){
          $(document).delegate(trigger,triggerEvent,tiggerShow);
        }else{
          triggerEl.on(triggerEvent,tiggerShow);
        }
        
      }

      if(triggerHideEvent){
        if(isDelegate && BUI.isString(trigger)){
          $(document).delegate(trigger,triggerHideEvent,tiggerHide);
        }else{
          triggerEl.on(triggerHideEvent,tiggerHide);
        }
      } 
    },
    __renderUI : function () {
      var _self = this,
        align = _self.get('align');
      //如果控件显示时不是由trigger触发，则同父元素对齐
      if(align && !align.node){
        align.node = _self.get('render') || _self.get('trigger');
      }
    }
  };

  return autoShow;
});