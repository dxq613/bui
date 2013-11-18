/**
 * @fileOverview 拥有多个面板的容器
 * @ignore
 */

define('bui/tab/panels',function (require) {
  
  /**
   * @class BUI.Tab.Panels
   * 包含面板的标签的扩展类
   */
  var Panels = function(){
    //this._initPanels();
  };

  Panels.ATTRS = {

    /**
     * 面板的模板
     * @type {String}
     */
    panelTpl : {

    },
    /**
     * 面板的容器，如果是id直接通过id查找，如果是非id，那么从el开始查找,例如：
     *   -#id ： 通过$('#id')查找
     *   -.cls : 通过 this.get('el').find('.cls') 查找
     *   -DOM/jQuery ：不需要查找
     * @type {String|HTMLElement|jQuery}
     */
    panelContainer : {
      
    },
    /**
     * panel 面板使用的样式，如果初始化时，容器内已经存在有该样式的DOM，则作为面板使用
     * 对应同一个位置的标签项,如果为空，默认取面板容器的子元素
     * @type {String}
     */
    panelCls : {

    }
  };

  BUI.augment(Panels,{

    __renderUI : function(){
      var _self = this,
        children = _self.get('children'),
        panelContainer = _self._initPanelContainer(),
        panelCls = _self.get('panelCls'),
        panels = panelCls ? panelContainer.find('.' + panels) : panelContainer.children();

      BUI.each(children,function(item,index){
        var panel = panels[index];
        _self._initPanelItem(item,panel);
      });
    },

    __bindUI : function(){
      var _self = this;
      _self.on('beforeAddChild',function(ev){
        var item = ev.child;
        _self._initPanelItem(item);
      });
    },
    //初始化容器
    _initPanelContainer : function(){
      var _self = this,
        panelContainer = _self.get('panelContainer');
      if(panelContainer && BUI.isString(panelContainer)){
        if(panelContainer.indexOf('#') == 0){ //如果是id
          panelContainer = $(panelContainer);
        }else{
          panelContainer = _self.get('el').find(panelContainer);
        }
        _self.setInternal('panelContainer',panelContainer);
      }
      return panelContainer;
    },
    //初始化面板配置信息
    _initPanelItem : function(item,panel){
      var _self = this;

      if(item.set){
        if(!item.get('panel')){
          panel = panel || _self._getPanel(item.get('userConfig'));
          item.set('panel',panel);
        }
      }else{
        if(!item.panel){
          panel = panel || _self._getPanel(item);
          item.panel = panel;
        }
      }
    },
    //获取面板
    _getPanel : function(item){
      var _self = this,
        panelContainer = _self.get('panelContainer'),
        panelTpl = BUI.substitute(_self.get('panelTpl'),item);
      
      return $(panelTpl).appendTo(panelContainer);
    }
  });

  return Panels;
});