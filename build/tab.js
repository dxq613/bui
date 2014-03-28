/**
 * @fileOverview 切换标签入口
 * @ignore
 */

define('bui/tab',['bui/common','bui/tab/tab','bui/tab/tabitem','bui/tab/navtabitem','bui/tab/navtab','bui/tab/tabpanel','bui/tab/tabpanelitem'],function (require) {
  var BUI = require('bui/common'),
    Tab = BUI.namespace('Tab');

  BUI.mix(Tab,{
    Tab : require('bui/tab/tab'),
    TabItem : require('bui/tab/tabitem'),
    NavTabItem : require('bui/tab/navtabitem'),
    NavTab : require('bui/tab/navtab'),
    TabPanel : require('bui/tab/tabpanel'),
    TabPanelItem : require('bui/tab/tabpanelitem')
  });

  return Tab;
});/**
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

});/**
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
});/**
 * @fileOverview 导航项
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/tab/navtabitem',['bui/common'],function(requrie){

  var BUI = requrie('bui/common'),
    Component =  BUI.Component,
    CLS_ITEM_TITLE = 'tab-item-title',
    CLS_ITEM_CLOSE = 'tab-item-close',
    CLS_ITEM_INNER = 'tab-item-inner',
    CLS_NAV_ACTIVED = 'tab-nav-actived',
    CLS_CONTENT = 'tab-content';

  /**
   * 导航标签项的视图类
   * @class BUI.Tab.NavTabItemView
   * @extends BUI.Component.View
   * @private
   */
  var navTabItemView =  Component.View.extend({
    renderUI : function(){
      var _self = this,
        contentContainer = _self.get('tabContentContainer'),
        contentTpl = _self.get('tabContentTpl');
      if(contentContainer){
        var tabContentEl = $(contentTpl).appendTo(contentContainer);
        _self.set('tabContentEl',tabContentEl);
      }
    },
    //设置链接地址
    _uiSetHref : function(v){
      this._setHref(v);
    },
    _setHref : function(href){
      var _self = this,
        tabContentEl = _self.get('tabContentEl');
      href = href || _self.get('href');
      if(tabContentEl){
        $('iframe',tabContentEl).attr('src',href);
      }
    },
    resetHref : function(){
      this._setHref();
    },
    //设置标题
    _uiSetTitle : function(v){
      var _self = this,
        el = _self.get('el');
      //el.attr('title',v);
      $('.' + CLS_ITEM_TITLE,el).html(v);
    },
    _uiSetActived : function(v){
      var _self = this,
        el = _self.get('el');

      _self.setTabContentVisible(v);
      if(v){
        el.addClass(CLS_NAV_ACTIVED);
      }else{
        el.removeClass(CLS_NAV_ACTIVED);
      }

    },
    //析构函数
    destructor : function(){
      var _self = this,
        tabContentEl = _self.get('tabContentEl');
      if(tabContentEl){
        tabContentEl.remove();
      }
    },
    //设置标签内容是否可见
    setTabContentVisible : function(v){
      var _self = this,
        tabContentEl = _self.get('tabContentEl');

      if(tabContentEl){
        if(v){
          tabContentEl.show();
        }else{
          tabContentEl.hide();
        }
      }
    }

  },{

    ATTRS : {

      tabContentContainer:{

      },
      tabContentEl: {

      },
      title:{

      },
      href:{

      }
    }
  });

  /**
   * 导航标签项
   * xclass : 'nav-tab-item'
   * @class BUI.Tab.NavTabItem
   * @extends BUI.Component.Controller
   */
  var navTabItem = Component.Controller.extend(
  {
    /**
     * 创建DOM
     * @protected
     */
    createDom : function(){
      var _self = this,
          parent = _self.get('parent');
      if(parent){
        _self.set('tabContentContainer',parent.getTabContentContainer());
      }
    },
    /**
     * 绑定事件
     * @protected
     */
    bindUI : function(){
      var _self = this,
        el = _self.get('el'),
        events = _self.get('events');

      el.on('click',function(ev){
        var sender = $(ev.target);
       if(sender.hasClass(CLS_ITEM_CLOSE)){
          if(_self.fire('closing')!== false){
            _self.close();
          }
        }
      });
    },
    /**
     * 处理双击
     * @protected
     */
    handleDblClick:function(ev){
      var _self = this;

      if(_self.get('closeable') && _self.fire('closing')!== false){
        _self.close();
      }
      _self.fire('dblclick',{domTarget : ev.target,domEvent : ev});
    },
    /**
     * 处理右键
     * @protected
     */
    handleContextMenu:function(ev){
      ev.preventDefault();
      this.fire('showmenu',{position:{x:ev.pageX,y:ev.pageY}});
    },
    /**
     * 设置标题
     * @param {String} title 标题
     */
    setTitle : function(title){
      this.set('title',title);
    },
    /**
    * 关闭
    */
    close:function(){
      this.fire('closed');
    },
    /**
     * 重新加载页面
     */
    reload : function(){
      this.get('view').resetHref();
    },
    /**
     * @protected
     * @ignore
     */
    show : function(){
      var _self = this;
        _self.get('el').show(500,function(){
          _self.set('visible',true);
        });
    },
    /**
     * @protected
     * @ignore
     */
    hide : function(callback){
      var _self = this;
      this.get('el').hide(500,function(){
        _self.set('visible',false);
        callback && callback();
      });
    },

    _uiSetActived : function(v){
      var _self = this,
        parent = _self.get('parent');
      if(parent && v){
        parent._setItemActived(_self);
      }
    },
    _uiSetCloseable : function(v){
      var _self = this,
        el = _self.get('el'),
        closeEl = el.find('.' + CLS_ITEM_CLOSE);
      if(v){
        closeEl.show();
      }else{
        closeEl.hide();
      }
    }
  },{
    ATTRS : 
    {
      elTagName : {
        value: 'li'
      },
      /**
       * 标签是否选中
       * @type {Boolean}
       */
      actived : {
        view:true,
        value : false
      }, 
      /**
       * 是否可关闭
       * @type {Boolean}
       */
      closeable : {
        value : true
      },
      allowTextSelection:{
        view:false,
        value:false
      },
      events:{
        value : {
          /**
           * 点击菜单项
           * @name BUI.Tab.NavTabItem#click
           * @event 
           * @param {Object} e 事件对象
           * @param {BUI.Tab.NavTabItem} e.target 正在点击的标签
           */
          'click' : true,
          /**
           * 正在关闭，返回false可以阻止关闭事件发生
           * @name BUI.Tab.NavTabItem#closing
           * @event 
           * @param {Object} e 事件对象
           * @param {BUI.Tab.NavTabItem} e.target 正在关闭的标签
           */
          'closing' : true,
          /**
           * 关闭事件
           * @name BUI.Tab.NavTabItem#closed
           * @event 
           * @param {Object} e 事件对象
           * @param {BUI.Tab.NavTabItem} e.target 关闭的标签
           */
          'closed' : true,
          /**
           * @name BUI.Tab.NavTabItem#showmenu
           * @event
           * @param {Object} e 事件对象
           * @param {BUI.Tab.NavTabItem} e.target 显示菜单的标签
           */
          'showmenu' : true,
          'afterVisibleChange' : true
        }
      },
      /**
       * @private
       * @type {Object}
       */
      tabContentContainer:{
        view : true
      },
      /**
       * @private
       * @type {Object}
       */
      tabContentTpl : {
        view : true,
        value : '<div class="' + CLS_CONTENT + '" style="display:none;"><iframe src="" width="100%" height="100%" frameborder="0"></iframe></div>'
      },
      /**
       * 标签页指定的URL
       * @cfg {String} href
       */
      /**
       * 标签页指定的URL
       * @type {String}
       */
      href : {
        view : true,
        value:''
      },
      visible:{
        view:true,
        value:true
      },
      /**
       * 标签文本
       * @cfg {String} title
       */
      /**
       * 标签文本
       * tab.getItem('id').set('title','new title');
       * @type {String}
       * @default ''
       */
      title : {
        view:true,
        value : ''
      },
      tpl : {
        view:true,
        value :'<s class="l"></s><div class="' + CLS_ITEM_INNER + '">{icon}<span class="' + CLS_ITEM_TITLE + '"></span><s class="' + CLS_ITEM_CLOSE + '"></s></div><s class="r"></s>'
      },
      xview:{
        value : navTabItemView
      }
    }
  },{
    xclass : 'nav-tab-item',
    priority : 0
  });

  navTabItem.View = navTabItemView;
  return navTabItem;
});/**
 * @fileOverview 导航标签
 * @author dxq613@gmail.com
 * @ignore              
 */
define('bui/tab/navtab',['bui/common','bui/menu'],function(require){

  var BUI = require('bui/common'),
    Menu = require('bui/menu'),
    Component =  BUI.Component,
    CLS_NAV_LIST = 'tab-nav-list',
    CLS_ARROW_LEFT = 'arrow-left',
    CLS_ARROW_RIGHT = 'arrow-right',
    CLS_FORCE_FIT = BUI.prefix + 'tab-force',
    ID_CLOSE = 'm_close',
    ITEM_WIDTH = 140;

  /**
   * 导航标签的视图类
   * @class BUI.Tab.NavTabView
   * @extends BUI.Component.View
   * @private
   */
  var navTabView = Component.View.extend({
    renderUI : function(){
      var _self = this,
        el = _self.get('el'),
        listEl = null;

      listEl = el.find('.' + CLS_NAV_LIST);
      _self.setInternal('listEl',listEl);
    },
    getContentElement : function(){
      
      return this.get('listEl');
    },
    getTabContentContainer : function(){
      return this.get('el').find('.tab-content-container');
    },
    _uiSetHeight : function(v){
      var _self = this,
        el = _self.get('el'),
        barEl = el.find('.tab-nav-bar'),
        containerEl = _self.getTabContentContainer();
      if(v){
        containerEl.height(v - barEl.height());
      }
      el.height(v);
    },
    //设置自动适应宽度
    _uiSetForceFit : function(v){
      var _self = this,
        el = _self.get('el');
      if(v){
        el.addClass(CLS_FORCE_FIT);
      }else{
        el.removeClass(CLS_FORCE_FIT);
      }
    }
  },{
    ATTRS : {
      forceFit : {}
    }
  },{
    xclass : 'nav-tab-view',
    priority:0
  });
  /**
   * 导航标签
   * @class BUI.Tab.NavTab
   * @extends BUI.Component.Controller
   */
  var navTab = Component.Controller.extend(
    {
      /**
       * 添加标签项
       * @param {Object} config 菜单项的配置项
       * @param {Boolean} reload 如果标签页已存在，则重新加载
       */
      addTab:function(config,reload){
        var _self = this,
          id = config.id || BUI.guid('tab-item'),
          forceFit = _self.get('forceFit'),
          item = _self.getItemById(id);

        if(item){
          var hrefChage = false;
          if(config.href && item.get('href') != config.href){
            item.set('href',config.href);
            hrefChage = true;
          }
          _self._setItemActived(item);
          if(reload && !hrefChage){
            item.reload();
          }
        }else{

          config = BUI.mix({
            id : id,
            visible : false,
            actived : true,
            xclass : 'nav-tab-item'
          },config);

          item = _self.addChild(config);
          if(forceFit){
            _self.forceFit();
          }
          item.show();
          _self._resetItemList();
        }
        return item;
      },
      /**
       * 获取导航标签，存放内容的节点
       * @return {jQuery} 导航内容的容器
       */
      getTabContentContainer : function(){
        return this.get('view').getTabContentContainer();
      },
      //绑定事件
      bindUI: function(){
        var _self = this,
          forceFit = _self.get('forceFit');
        if(!forceFit){
          _self._bindScrollEvent();
          _self.on('afterVisibleChange',function(ev){
            var item = ev.target;
            if(item.get('actived')){
              _self._scrollToItem(item);
            }
          });
        }

        //监听点击标签
        _self.on('click',function(ev){
          var item = ev.target;
          if(item != _self){
            _self._setItemActived(item);
            _self.fire('itemclick',{item:item});
          }
        });

        //关闭标签
        _self.on('closed',function(ev){
          var item = ev.target;
          _self._closeItem(item);
        });

        _self.on('showmenu',function(ev){
          _self._showMenu(ev.target,ev.position);
        });

        
      },
      //绑定滚动事件
      _bindScrollEvent : function(){
        var _self = this,
          el = _self.get('el');

        el.find('.arrow-left').on('click',function(){
          if(el.hasClass(CLS_ARROW_LEFT + '-active')){
            _self._scrollLeft();
          }
        });

        el.find('.arrow-right').on('click',function(){
          if(el.hasClass(CLS_ARROW_RIGHT + '-active')){
            _self._scrllRight();
          }
        });
      },
      _showMenu : function(item,position){
        var _self = this,
            menu = _self._getMenu(),
            closeable = item.get('closeable'),
            closeItem;

        _self.set('showMenuItem',item);

        menu.set('xy',[position.x,position.y]);
        menu.show();
        closeItem = menu.getItem(ID_CLOSE);
        if(closeItem){
          closeItem.set('disabled',!closeable);
        }
      },
      /**
       * 通过id,设置选中的标签项
       * @param {String} id 标签编号
       */
      setActived : function(id){
        var _self = this,
          item = _self.getItemById(id);
        _self._setItemActived(item);
      },
      /**
       * 获取当前选中的标签项
       * @return {BUI.Tab.NavTabItem} 选中的标签对象
       */
      getActivedItem : function(){
        var _self = this,
          children = _self.get('children'),
          result = null;
        BUI.each(children,function(item){
          if(item.get('actived')){
            result = item;
            return false;
          }
        });
        return result;
      },
      /**
       * 通过编号获取标签项
       * @param  {String} id 标签项的编号
       * @return {BUI.Tab.NavTabItem} 标签项对象
       */
      getItemById : function(id){
        var _self = this,
          children = _self.get('children'),
          result = null;
        BUI.each(children,function(item){
          if(item.get('id') === id){
            result = item;
            return false;
          }
        });
        return result;
      },
      _getMenu : function(){
        var _self = this;

        return _self.get('menu') || _self._initMenu();
      },
      _initMenu : function(){
        var _self = this,
          menu = new Menu.ContextMenu({
              children : [
              {

                xclass : 'context-menu-item',
                iconCls:'icon icon-refresh',
                text : '刷新',
                listeners:{
                  'click':function(){
                    var item = _self.get('showMenuItem');
                    if(item){
                      item.reload();
                    }
                  }
                }
              },
              {
                id : ID_CLOSE,
                xclass : 'context-menu-item',
                iconCls:'icon icon-remove',
                text: '关闭',
                listeners:{
                  'click':function(){
                    var item = _self.get('showMenuItem');
                    if(item){
                      item.close();
                    }
                  }
                }
              },
              {
                xclass : 'context-menu-item',
                iconCls:'icon icon-remove-sign',
                text : '关闭其他',
                listeners:{
                  'click':function(){
                    var item = _self.get('showMenuItem');
                    if(item){
                      _self.closeOther(item);
                    }
                  }
                }
              },
              {
                xclass : 'context-menu-item',
                iconCls:'icon icon-remove-sign',
                text : '关闭所有',
                listeners:{
                  'click':function(){
                    _self.closeAll();
                  }
                }
              }

            ]
          });
          
        _self.set('menu',menu);
        return menu;
      },
      //关闭标签项
      _closeItem : function(item){
        var _self = this,
          index = _self._getIndex(item),
          activedItem = _self.getActivedItem(),
          preItem = _self.get('preItem') || _self._getItemByIndex(index -1),
          nextItem = _self._getItemByIndex(index + 1);

        item.hide(function(){
          _self.removeChild(item,true);
          _self._resetItemList();
          if(activedItem === item){
            if(preItem){
              _self._setItemActived(preItem);
            }else{
              _self._setItemActived(nextItem);
            }
          }else{//删除标签项时，可能会引起滚动按钮状态的改变
            _self._scrollToItem(activedItem);;
          }
          _self.forceFit();
        });
        
      },
      closeAll:function(){
        var _self = this,
          children = _self.get('children');
        BUI.each(children,function(item){
          if(item.get('closeable')){
            item.close();
          }
        });
      },
      closeOther : function(curItem){
        var _self = this,
          children = _self.get('children');
        BUI.each(children,function(item){
          if(curItem !==item){
            item.close();
          }
          
        });
      },
      //通过位置查找标签项
      _getItemByIndex : function(index){
        var _self = this,
          children = _self.get('children');  
        return children[index];
      },
      //获取标签项的位置
      _getIndex : function(item){
        var _self = this,
          children = _self.get('children');    
        return BUI.Array.indexOf(item,children);
      },
      //重新计算标签项容器的宽度位置
      _resetItemList : function(){
        if(this.get('forceFit')){
          return;
        }
        var _self = this,
          container = _self.getContentElement();

        container.width(_self._getTotalWidth());

      },
      //获取选项的总宽度，以默认宽度为基数
      _getTotalWidth : function(){
        var _self = this,
          children = _self.get('children');

        return children.length * _self.get('itemWidth');
      },
      _getForceItemWidth : function(){
        var _self = this,
          width =  _self.getContentElement().width(),
          children = _self.get('children'),
          totalWidth = _self._getTotalWidth(),
          itemWidth = _self.get(itemWidth);
        if(totalWidth > width){
          itemWidth = width/children.length;
        }
        return itemWidth;
      },
      forceFit : function(){
        var _self = this;
        _self._forceItemWidth(_self._getForceItemWidth());
      },
      //设置平均宽度
      _forceItemWidth : function(width){
        width = width || this.get('itemWidth');
        var _self = this,
          children = _self.get('children');
        BUI.each(children,function(item){
          item.set('width',width);
        });
      },
      //使指定标签项在用户可视区域内
      _scrollToItem : function(item){
        if(this.get('forceFit')){ //自适应后，不进行滚动
          return;
        }
        var _self = this,
          container = _self.getContentElement(),
          containerPosition = container.position(),
          disWidth = _self._getDistanceToEnd(item,container,containerPosition),
          disBegin = _self._getDistanceToBegin(item,containerPosition); //当前活动的项距离最右端的距离

        //如果标签项列表小于整个标签容器的大小，则左对齐
        if(container.width() < container.parent().width()){
          _self._scrollTo(container,0);  
        }else if(disBegin < 0){//如果左边被遮挡，向右移动

          _self._scrollTo(container,containerPosition.left - (disBegin));

        }else if(disWidth > 0){//如果当前节点被右端遮挡，则向左滚动到显示位置
        
          _self._scrollTo(container,containerPosition.left + (disWidth) * -1);

        }else if(containerPosition.left < 0){//将左边移动，使最后一个标签项离右边最近
          var lastDistance = _self._getLastDistance(container,containerPosition),
            toLeft = 0;
          if(lastDistance < 0){
            toLeft = containerPosition.left - lastDistance;
            toLeft = toLeft < 0 ? toLeft : 0;
            _self._scrollTo(container,toLeft);  
          }
        }
      },
      //获取标签到最左端的距离
      _getDistanceToBegin : function(item,containerPosition){
        var position = item.get('el').position();

        return position.left + containerPosition.left;
      },
      /**
       * 获取标签到最右端的距离
       * @return  {Number} 像素
       * @private
       */
      _getDistanceToEnd : function(item,container,containerPosition){
        var _self = this,
          container = container || _self.getContentElement(),
          wraperWidth = container.parent().width(),
          containerPosition = containerPosition || container.position(),
          offsetLeft = _self._getDistanceToBegin(item,containerPosition),
          disWidth = offsetLeft + _self.get('itemWidth') - wraperWidth; 
        return disWidth;
      },
      //获取最后一个标签项离右边的间距
      _getLastDistance : function(container,containerPosition){
        var _self = this,
          children = _self.get('children'),
          lastItem = children[children.length - 1];
        if(lastItem)
        {
          return _self._getDistanceToEnd(lastItem,container,containerPosition);
        }
        return 0;
      },
      _scrollTo : function(el,left,callback){
        var _self = this;
        el.animate({left:left},500,function(){
           _self._setArrowStatus(el);
        });
      },
      _scrollLeft : function(){
        var _self = this,
          container = _self.getContentElement(),
          position = container.position(),
          disWidth = _self._getLastDistance(container,position),
          toLeft;
        if(disWidth > 0 ){
          toLeft = disWidth > _self.get('itemWidth') ? _self.get('itemWidth') : disWidth;
          _self._scrollTo(container,position.left - toLeft);
        }

      },
      //向右滚动
      _scrllRight : function(){
        var _self = this,
          container = _self.getContentElement(),
          position = container.position(),
          toRight;
        if(position.left < 0){
          toRight = position.left + _self.get('itemWidth');
          toRight = toRight < 0 ? toRight : 0;
          _self._scrollTo(container,toRight);
        }
      },
      //设置向左，向右的箭头是否可用
      _setArrowStatus : function(container,containerPosition){

        container = container || this.getContentElement();
        var _self = this,
          wapperEl = _self.get('el'),
          position = containerPosition || container.position(),
          disWidth = _self._getLastDistance(container,containerPosition);

        //可以向左边滚动
        if(position.left < 0){
          wapperEl.addClass(CLS_ARROW_RIGHT+'-active');
        }else{
          wapperEl.removeClass(CLS_ARROW_RIGHT+'-active');
        }

        if(disWidth > 0){
          wapperEl.addClass(CLS_ARROW_LEFT+'-active');
        }else{
          wapperEl.removeClass(CLS_ARROW_LEFT+'-active');
        }
      },
      //设置当前选中的标签
      _setItemActived:function(item){
        var _self = this,
          preActivedItem = _self.getActivedItem();
        if(item === preActivedItem){
          return;
        }

        if(preActivedItem){
          preActivedItem.set('actived',false);
        }
        _self.set('preItem',preActivedItem);
        if(item){
          if(!item.get('actived')){
            item.set('actived',true);
          }
          //当标签项可见时，否则无法计算位置信息
          if(item.get('visible')){
            _self._scrollToItem(item);
          }
          //为了兼容原先代码
          _self.fire('activeChange',{item:item});
          _self.fire('activedchange',{item:item});
        }
      }

    },
    
    {
      ATTRS :    
    {
        defaultChildClass:{
          value : 'nav-tab-item'
        },
        /**
         * @private
         * 右键菜单
         * @type {Object}
         */
        menu : {

        },
        /**
         * 设置此参数时，标签选项的宽度会进行自适应
         * @cfg {Boolean} forceFit
         */
        forceFit : {
          view : true,
          value : false
        },
        /**
         * 标签的默认宽度,140px，设置forceFit:true后，此宽度为最宽宽度
         * @type {Number}
         */
        itemWidth : {
          value : ITEM_WIDTH
        },
        /**
         * 渲染标签的模版
         * @type {String}
         */
        tpl : {
          view : true,
          value : '<div class="tab-nav-bar">'+
            '<s class="tab-nav-arrow arrow-left"></s><div class="tab-nav-wrapper"><div class="tab-nav-inner"><ul class="'+CLS_NAV_LIST+'"></ul></div></div><s class="tab-nav-arrow arrow-right"></s>'+
            '</div>'+
            '<div class="tab-content-container"></div>'
        },
        xview : {
          value : navTabView
        },
        events : {
                
          value : {
            /**
             * 点击标签项
             * @event
             * @param {Object} e 事件对象
             * @param {BUI.Tab.NavTabItem} e.item 标签项
             */
            'itemclick' : false,
            /**
             * 标签项激活改变
             * @event
             * @param {Object} e 事件对象
             * @param {BUI.Tab.NavTabItem} e.item 标签项
             */
            activedchange : false
          }
        }
      }
    },
    {
      xclass:'nav-tab',
      priority : 0

    }
  );

  return navTab;
});/**
 * @fileOverview 
 * @ignore
 */

define('bui/tab/tabitem',['bui/common'],function (require) {
  

  var BUI = require('bui/common'),
    Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * @private
   * @class BUI.Tab.TabItemView
   * @extends BUI.Component.View
   * @mixins BUI.Component.UIBase.ListItemView
   * 标签项的视图层对象
   */
  var itemView = Component.View.extend([UIBase.ListItemView],{
  },{
    xclass:'tab-item-view'
  });


  /**
   * 标签项
   * @class BUI.Tab.TabItem
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ListItem
   */
  var item = Component.Controller.extend([UIBase.ListItem],{

  },{
    ATTRS : 
    {
     
      elTagName:{
        view:true,
        value:'li'
      },
      xview:{
        value:itemView
      },
      tpl:{
        view:true,
        value:'<span class="bui-tab-item-text">{text}</span>'
      }
    }
  },{
    xclass:'tab-item'
  });

  
  item.View = itemView;
  return item;
});/**
 * @fileOverview 切换标签
 * @ignore
 */

define('bui/tab/tab',['bui/common'],function (require) {
  

  var BUI = require('bui/common'),
    Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * 列表
   * xclass:'tab'
   * <pre><code>
   * BUI.use('bui/tab',function(Tab){
   *   
   *     var tab = new Tab.Tab({
   *         render : '#tab',
   *         elCls : 'nav-tabs',
   *         autoRender: true,
   *         children:[
   *           {text:'标签一',value:'1'},
   *           {text:'标签二',value:'2'},
   *           {text:'标签三',value:'3'}
   *         ]
   *       });
   *     tab.on('selectedchange',function (ev) {
   *       var item = ev.item;
   *       $('#log').text(item.get('text') + ' ' + item.get('value'));
   *     });
   *     tab.setSelected(tab.getItemAt(0)); //设置选中第一个
   *   
   *   });
   *  </code></pre>
   * @class BUI.Tab.Tab
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ChildList
   */
  var tab = Component.Controller.extend([UIBase.ChildList],{

  },{
    ATTRS : {
      elTagName:{
        view:true,
        value:'ul'
      },
      /**
       * 子类的默认类名，即类的 xclass
       * @type {String}
       * @override
       * @default 'tab-item'
       */
      defaultChildClass : {
        value : 'tab-item'
      }
    }
  },{
    xclass : 'tab'
  });

  return tab;

});/**
 * @fileOverview 
 * @ignore
 */

define('bui/tab/tabpanelitem',['bui/common','bui/tab/tabitem','bui/tab/panelitem'],function (require) {
  

  var BUI = require('bui/common'),
    TabItem = require('bui/tab/tabitem'),
    PanelItem = require('bui/tab/panelitem'),
    CLS_TITLE = 'bui-tab-item-text',
    Component = BUI.Component;

  /**
   * @private
   * @class BUI.Tab.TabPanelItemView
   * @extends BUI.Tab.TabItemView
   * 存在面板的标签项视图层对象
   */
  var itemView = TabItem.View.extend([Component.UIBase.Close.View],{
    _uiSetTitle : function(v){
      var _self = this,
        el = _self.get('el'),
        titleEl = el.find('.' + CLS_TITLE);
      titleEl.text(v);
    }
  },{
    xclass:'tab-panel-item-view'
  });


  /**
   * 标签项
   * @class BUI.Tab.TabPanelItem
   * @extends BUI.Tab.TabItem
   * @mixins BUI.Tab.PanelItem
   * @mixins BUI.Component.UIBase.Close
   */
  var item = TabItem.extend([PanelItem,Component.UIBase.Close],{
    
  },{
    ATTRS : 
    {
      /**
       * 关闭时直接销毁标签项，执行remove方法
       * @type {String}
       */
      closeAction : {
        value : 'remove'
      },
      /**
       * 标题
       * @cfg {String} title 
       */
      /**
       * 标题
       * @type {String}
       * <code>
       *   tab.getItem('id').set('title','new title');
       * </code>
       */
      title : {
        view : true,
        sync : false

      },
      /**
       * 标签项的模板,因为之前没有title属性，所以默认用text，所以也兼容text，但是在最好直接使用title，方便更改
       * @type {String}
       */
      tpl : {
        value : '<span class="' + CLS_TITLE + '">{text}{title}</span>'
      },
      closeable : {
        value : false
      },
      events : {
        value : {
          beforeclosed : true
        }
      },
      xview:{
        value:itemView
      }
    }
  },{
    xclass:'tab-panel-item'
  });
  
  item.View = itemView;
  return item;

});/**
 * @fileOverview 每个标签对应一个面板
 * @ignore
 */

define('bui/tab/tabpanel',['bui/common','bui/tab/tab','bui/tab/panels'],function (require) {
  
  var BUI = require('bui/common'),
    Tab = require('bui/tab/tab'),
    Panels = require('bui/tab/panels');

  /**
   * 带有面板的切换标签
   * <pre><code>
   * BUI.use('bui/tab',function(Tab){
   *   
   *     var tab = new Tab.TabPanel({
   *       render : '#tab',
   *       elCls : 'nav-tabs',
   *       panelContainer : '#panel',
   *       autoRender: true,
   *       children:[
   *         {text:'源代码',value:'1'},
   *         {text:'HTML',value:'2'},
   *         {text:'JS',value:'3'}
   *       ]
   *     });
   *     tab.setSelected(tab.getItemAt(0));
   *   });
   * </code></pre>
   * @class BUI.Tab.TabPanel
   * @extends BUI.Tab.Tab
   * @mixins BUI.Tab.Panels
   */
  var tabPanel = Tab.extend([Panels],{

    bindUI : function(){
      var _self = this;
      //关闭标签
      _self.on('beforeclosed',function(ev){
        var item = ev.target;
        _self._beforeClosedItem(item);
      });
    },
    //关闭标签选项前
    _beforeClosedItem : function(item){
      if(!item.get('selected')){ //如果未选中不执行下面的选中操作
        return;
      }

      var _self = this,
        index = _self.indexOfItem(item),
        count = _self.getItemCount(),
        preItem,
        nextItem;
      if(index !== count - 1){ //不是最后一个，则激活最后一个
        nextItem = _self.getItemAt(index + 1);
        _self.setSelected(nextItem);
      }else if(index !== 0){
        preItem = _self.getItemAt(index - 1);
        _self.setSelected(preItem);
      }
    }

  },{
    ATTRS : {
      elTagName : {
        value : 'div'
      },
      childContainer : {
        value : 'ul'
      },
      tpl : {
        value : '<div class="tab-panel-inner"><ul></ul><div class="tab-panels"></div></div>'
      },
      panelTpl : {
        value : '<div></div>'
      },
      /**
       * 默认的面板容器
       * @cfg {String} [panelContainer='.tab-panels']
       */
      panelContainer : {
        value : '.tab-panels'
      },
      /**
       * 默认子控件的xclass
       * @type {String}
       */
      defaultChildClass:{
        value : 'tab-panel-item'
      }
    }
  },{
    xclass : 'tab-panel'
  });

  return tabPanel;
});