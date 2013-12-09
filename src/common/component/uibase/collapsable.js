/**
 * @fileOverview 可以展开折叠的控件
 * @ignore
 */

define('bui/component/uibase/collapsable',function () {

  /**
  * 控件展开折叠的视图类
  * @class BUI.Component.UIBase.CollapsableView
  * @private
  */
  var collapsableView = function(){
  
  };

  collapsableView.ATTRS = {
    collapsed : {}
  }

  collapsableView.prototype = {
    //设置收缩样式
    _uiSetCollapsed : function(v){
      var _self = this,
        cls = _self.getStatusCls('collapsed'),
        el = _self.get('el');
      if(v){
        el.addClass(cls);
      }else{
        el.removeClass(cls);
      }
    }
  }
  /**
   * 控件展开折叠的扩展
   * @class BUI.Component.UIBase.Collapsable
   */
  var collapsable = function(){
    
  };

  collapsable.ATTRS = {
    /**
     * 是否可折叠
     * @type {Boolean}
     */
    collapsable: {
      value : false
    },
    /**
     * 是否已经折叠 collapsed
     * @cfg {Boolean} collapsed
     */
    /**
     * 是否已经折叠
     * @type {Boolean}
     */
    collapsed : {
      view : true,
      value : false
    },
    events : {
      value : {
        /**
         * 控件展开
         * @event
         * @param {Object} e 事件对象
         * @param {BUI.Component.Controller} target 控件
         */
        'expanded' : true,
        /**
         * 控件折叠
         * @event
         * @param {Object} e 事件对象
         * @param {BUI.Component.Controller} target 控件
         */
        'collapsed' : true
      }
    }
  };

  collapsable.prototype = {
    _uiSetCollapsed : function(v){
      var _self = this;
      if(v){
        _self.fire('collapsed');
      }else{
        _self.fire('expanded');
      }
    }
  };

  collapsable.View = collapsableView;
  
  return collapsable;
});