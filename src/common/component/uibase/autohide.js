/**
 * @fileOverview 点击或移出控件外部，控件隐藏
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/autohide',function () {

  var wrapBehavior = BUI.wrapBehavior,
      getWrapBehavior = BUI.getWrapBehavior;

  function isExcept(self,elem){
    var hideExceptNode = self.get('hideExceptNode');
    if(hideExceptNode && hideExceptNode.length){
      return $.contains(hideExceptNode[0],elem);
    }
    return false;
  }
  /**
   * 点击隐藏控件的扩展
   * @class BUI.Component.UIBase.AutoHide
   */
  function autoHide() {
  
  }

  autoHide.ATTRS = {

    /**
     * 控件自动隐藏的事件，这里支持2种：
     *  - 'click'
     *  - 'leave'
     *  <pre><code>
     *    var overlay = new Overlay({ //点击#t1时显示，点击#t1之外的元素隐藏
     *      trigger : '#t1',
     *      autoHide : true,
     *      content : '悬浮内容'
     *    });
     *    overlay.render();
     *
     *    var overlay = new Overlay({ //移动到#t1时显示，移动出#t1,overlay之外控件隐藏
     *      trigger : '#t1',
     *      autoHide : true,
     *      triggerEvent :'mouseover',
     *      autoHideType : 'leave',
     *      content : '悬浮内容'
     *    });
     *    overlay.render();
     * 
     *  </code></pre>
     * @cfg {String} [autoHideType = 'click']
     */
    /**
     * 控件自动隐藏的事件，这里支持2种：
     * 'click',和'leave',默认为'click'
     * @type {String}
     */
    autoHideType : {
      value : 'click'
    },
    /**
     * 是否自动隐藏
     * <pre><code>
     *  
     *  var overlay = new Overlay({ //点击#t1时显示，点击#t1,overlay之外的元素隐藏
     *    trigger : '#t1',
     *    autoHide : true,
     *    content : '悬浮内容'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Object} autoHide
     */
    /**
     * 是否自动隐藏
     * @type {Object}
     * @ignore
     */
    autoHide:{
      value : false
    },
    /**
     * 点击或者移动到此节点时不触发自动隐藏
     * <pre><code>
     *  
     *  var overlay = new Overlay({ //点击#t1时显示，点击#t1,#t2,overlay之外的元素隐藏
     *    trigger : '#t1',
     *    autoHide : true,
     *    hideExceptNode : '#t2',
     *    content : '悬浮内容'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Object} hideExceptNode
     */
    hideExceptNode :{

    },
    events : {
      value : {
        /**
         * @event autohide
         * 点击控件外部时触发，只有在控件设置自动隐藏(autoHide = true)有效
         * 可以阻止控件隐藏，通过在事件监听函数中 return false
         * <pre><code>
         *  overlay.on('autohide',function(){
         *    var curTrigger = overlay.curTrigger; //当前触发的项
         *    if(condtion){
         *      return false; //阻止隐藏
         *    }
         *  });
         * </code></pre>
         */
        autohide : false
      }
    }
  };

  autoHide.prototype = {

    __bindUI : function() {
      var _self = this;

      _self.on('afterVisibleChange',function (ev) {
        var visible = ev.newVal;
        if(_self.get('autoHide')){
          if(visible){
            _self._bindHideEvent();
          }else{
            _self._clearHideEvent();
          }
        }
      });
    },
    /**
     * 处理鼠标移出事件，不影响{BUI.Component.Controller#handleMouseLeave}事件
     * @param  {jQuery.Event} ev 事件对象
     */
    handleMoveOuter : function (ev) {
      var _self = this,
        target = ev.toElement || ev.relatedTarget;
      if(!_self.containsElement(target) && !isExcept(_self,target)){
        if(_self.fire('autohide') !== false){
          _self.hide();
        }
      }
    },
    /**
     * 点击页面时的处理函数
     * @param {jQuery.Event} ev 事件对象
     * @protected
     */
    handleDocumentClick : function (ev) {
      var _self = this,
        target = ev.target;
      if(!_self.containsElement(target) && !isExcept(_self,target)){
        if(_self.fire('autohide') !== false){
          _self.hide();
        }
      }
    },
    _bindHideEvent : function() {
      var _self = this,
        trigger = _self.get('curTrigger'),
        autoHideType = _self.get('autoHideType');
      if(autoHideType === 'click'){
        $(document).on('mousedown',wrapBehavior(_self,'handleDocumentClick'));
      }else{
        _self.get('el').on('mouseleave',wrapBehavior(_self,'handleMoveOuter'));
        if(trigger){
          $(trigger).on('mouseleave',wrapBehavior(_self,'handleMoveOuter'))
        }
      }

    },
    //清除绑定的隐藏事件
    _clearHideEvent : function() {
      var _self = this,
        trigger = _self.get('curTrigger'),
        autoHideType = _self.get('autoHideType');
      if(autoHideType === 'click'){
        $(document).off('mousedown',getWrapBehavior(_self,'handleDocumentClick'));
      }else{
        _self.get('el').off('mouseleave',getWrapBehavior(_self,'handleMoveOuter'));
        if(trigger){
          $(trigger).off('mouseleave',getWrapBehavior(_self,'handleMoveOuter'))
        }
      }
    }
  };

  return autoHide;

});




