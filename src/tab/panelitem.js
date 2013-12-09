/**
 * @fileOverview 拥有内容的标签项的扩展类，每个标签项都有一个分离的容器作为面板
 * @ignore
 */

define('bui/tab/panelitem',function (requrie) {

  /**
   * @class BUI.Tab.PanelItem
   * 包含面板的标签项的扩展
   */
  var PanelItem = function(){

  };

  PanelItem.ATTRS = {

    /**
     * 标签项对应的面板容器，当标签选中时，面板显示
     * @cfg {String|HTMLElement|jQuery} panel
     * @internal 面板属性一般由 tabPanel设置而不应该由用户手工设置
     */
    /**
     * 标签项对应的面板容器，当标签选中时，面板显示
     * @type {String|HTMLElement|jQuery}
     * @readOnly
     */
    panel : {

    },
    /**
     * 面板的内容
     * @type {String}
     */
    panelContent : {

    },
    /**
     * 关联面板显示隐藏的属性名
     * @protected
     * @type {string}
     */
    panelVisibleStatus : {
      value : 'selected'
    },
    /**
       * 默认的加载控件内容的配置,默认值：
       * <pre>
       *  {
       *   property : 'panelContent',
       *   lazyLoad : {
       *       event : 'active'
       *   },
       *     loadMask : {
       *       el : _self.get('panel')
       *   }
       * }
       * </pre>
       * @type {Object}
       */
      defaultLoaderCfg  : {
        valueFn :function(){
          var _self = this,
            eventName = _self._getVisibleEvent();
          return {
            property : 'panelContent',
            autoLoad : false,
            lazyLoad : {
              event : eventName
            },
            loadMask : {
              el : _self.get('panel')
            }
          }
        } 
      },
    /**
     * 面板是否跟随标签一起释放
     * @type {Boolean}
     */
    panelDestroyable : {
      value : true
    }
  }


  BUI.augment(PanelItem,{

    __renderUI : function(){
      this._resetPanelVisible();
    },
    __bindUI : function(){
      var _self = this,
      eventName = _self._getVisibleEvent();

      _self.on(eventName,function(ev){
        _self._setPanelVisible(ev.newVal);
      });
    },
    _resetPanelVisible : function(){
      var _self = this,
        status = _self.get('panelVisibleStatus'),
        visible = _self.get(status);
      _self._setPanelVisible(visible);
    },
    //获取显示隐藏的事件
    _getVisibleEvent : function(){
      var _self = this,
        status = _self.get('panelVisibleStatus');

      return 'after' + BUI.ucfirst(status) + 'Change';;
    },
    /**
     * @private
     * 设置面板的可见
     * @param {Boolean} visible 显示或者隐藏
     */
    _setPanelVisible : function(visible){
      var _self = this,
        panel = _self.get('panel'),
        method = visible ? 'show' : 'hide';
      if(panel){
        $(panel)[method]();
      }
    },
    __destructor : function(){
      var _self = this,
        panel = _self.get('panel');
      if(panel && _self.get('panelDestroyable')){
        $(panel).remove();
      }
    },
    _setPanelContent : function(panel,content){
      var panelEl = $(panel);
      $(panel).html(content);
    },
    _uiSetPanelContent : function(v){
      var _self = this,
        panel = _self.get('panel');
      //$(panel).html(v);
      _self._setPanelContent(panel,v);
    },
    //设置panel
    _uiSetPanel : function(v){
      var _self = this,
        content = _self.get('panelContent');
      if(content){
        _self._setPanelContent(v,content);
      }
      _self._resetPanelVisible();
    }
  });

  return PanelItem;

});