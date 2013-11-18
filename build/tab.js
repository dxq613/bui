/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
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
});
define('bui/tab/navtabitem',['bui/common'],function(requrie){

  var BUI = requrie('bui/common'),
    Component =  BUI.Component,
    CLS_ITEM_TITLE = 'tab-item-title',
    CLS_ITEM_CLOSE = 'tab-item-close',
    CLS_ITEM_INNER = 'tab-item-inner',
    CLS_NAV_ACTIVED = 'tab-nav-actived',
    CLS_CONTENT = 'tab-content';

  /**
   * \u5bfc\u822a\u6807\u7b7e\u9879\u7684\u89c6\u56fe\u7c7b
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
    //\u8bbe\u7f6e\u94fe\u63a5\u5730\u5740
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
    //\u8bbe\u7f6e\u6807\u9898
    _uiSetTitle : function(v){
      var _self = this,
        el = _self.get('el');
      el.attr('title',v);
      $('.' + CLS_ITEM_TITLE,el).text(v);
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
    //\u6790\u6784\u51fd\u6570
    destructor : function(){
      var _self = this,
        tabContentEl = _self.get('tabContentEl');
      if(tabContentEl){
        tabContentEl.remove();
      }
    },
    //\u8bbe\u7f6e\u6807\u7b7e\u5185\u5bb9\u662f\u5426\u53ef\u89c1
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
   * \u5bfc\u822a\u6807\u7b7e\u9879
   * xclass : 'nav-tab-item'
   * @class BUI.Tab.NavTabItem
   * @extends BUI.Component.Controller
   */
  var navTabItem = Component.Controller.extend(
  /**
   * @lends BUI.Tab.NavTabItem.prototype
   * @ignore
   */
  {
    /**
     * \u521b\u5efaDOM
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
     * \u7ed1\u5b9a\u4e8b\u4ef6
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
     * \u5904\u7406\u53cc\u51fb
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
     * \u5904\u7406\u53f3\u952e
     * @protected
     */
    handleContextMenu:function(ev){
      ev.preventDefault();
      this.fire('showmenu',{position:{x:ev.pageX,y:ev.pageY}});
    },
    /**
     * \u8bbe\u7f6e\u6807\u9898
     * @param {String} title \u6807\u9898
     */
    setTitle : function(title){
      this.set('title',title);
    },
    /**
    * \u5173\u95ed
    */
    close:function(){
      this.fire('closed');
    },
    /**
     * \u91cd\u65b0\u52a0\u8f7d\u9875\u9762
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
    /**
     * @lends BUI.Tab.NavTabItem#
     * @ignore
     */
    {
      elTagName : {
        value: 'li'
      },
      /**
       * \u6807\u7b7e\u662f\u5426\u9009\u4e2d
       * @type {Boolean}
       */
      actived : {
        view:true,
        value : false
      }, 
      /**
       * \u662f\u5426\u53ef\u5173\u95ed
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
           * \u70b9\u51fb\u83dc\u5355\u9879
           * @name BUI.Tab.NavTabItem#click
           * @event 
           * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {BUI.Tab.NavTabItem} e.target \u6b63\u5728\u70b9\u51fb\u7684\u6807\u7b7e
           */
          'click' : true,
          /**
           * \u6b63\u5728\u5173\u95ed\uff0c\u8fd4\u56defalse\u53ef\u4ee5\u963b\u6b62\u5173\u95ed\u4e8b\u4ef6\u53d1\u751f
           * @name BUI.Tab.NavTabItem#closing
           * @event 
           * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {BUI.Tab.NavTabItem} e.target \u6b63\u5728\u5173\u95ed\u7684\u6807\u7b7e
           */
          'closing' : true,
          /**
           * \u5173\u95ed\u4e8b\u4ef6
           * @name BUI.Tab.NavTabItem#closed
           * @event 
           * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {BUI.Tab.NavTabItem} e.target \u5173\u95ed\u7684\u6807\u7b7e
           */
          'closed' : true,
          /**
           * @name BUI.Tab.NavTabItem#showmenu
           * @event
           * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {BUI.Tab.NavTabItem} e.target \u663e\u793a\u83dc\u5355\u7684\u6807\u7b7e
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
       * \u6807\u7b7e\u9875\u6307\u5b9a\u7684URL
       * @cfg {String} href
       */
      /**
       * \u6807\u7b7e\u9875\u6307\u5b9a\u7684URL
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
       * \u6807\u7b7e\u6587\u672c
       * @cfg {String} title
       */
      /**
       * \u6807\u7b7e\u6587\u672c
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
});
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
   * \u5bfc\u822a\u6807\u7b7e\u7684\u89c6\u56fe\u7c7b
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
    //\u8bbe\u7f6e\u81ea\u52a8\u9002\u5e94\u5bbd\u5ea6
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
   * \u5bfc\u822a\u6807\u7b7e
   * @class BUI.Tab.NavTab
   * @extends BUI.Component.Controller
   */
  var navTab = Component.Controller.extend(
    /**
     * @lends BUI.Tab.NavTab.prototype
     * @ignore
     */
    {
      /**
       * \u6dfb\u52a0\u6807\u7b7e\u9879
       * @param {Object} config \u83dc\u5355\u9879\u7684\u914d\u7f6e\u9879
       * @param {Boolean} reload \u5982\u679c\u6807\u7b7e\u9875\u5df2\u5b58\u5728\uff0c\u5219\u91cd\u65b0\u52a0\u8f7d
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
       * \u83b7\u53d6\u5bfc\u822a\u6807\u7b7e\uff0c\u5b58\u653e\u5185\u5bb9\u7684\u8282\u70b9
       * @return {jQuery} \u5bfc\u822a\u5185\u5bb9\u7684\u5bb9\u5668
       */
      getTabContentContainer : function(){
        return this.get('view').getTabContentContainer();
      },
      //\u7ed1\u5b9a\u4e8b\u4ef6
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

        //\u76d1\u542c\u70b9\u51fb\u6807\u7b7e
        _self.on('click',function(ev){
          var item = ev.target;
          if(item != _self){
            _self._setItemActived(item);
            _self.fire('itemclick',{item:item});
          }
        });

        //\u5173\u95ed\u6807\u7b7e
        _self.on('closed',function(ev){
          var item = ev.target;
          _self._closeItem(item);
        });

        _self.on('showmenu',function(ev){
          _self._showMenu(ev.target,ev.position);
        });

        
      },
      //\u7ed1\u5b9a\u6eda\u52a8\u4e8b\u4ef6
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
       * \u901a\u8fc7id,\u8bbe\u7f6e\u9009\u4e2d\u7684\u6807\u7b7e\u9879
       * @param {String} id \u6807\u7b7e\u7f16\u53f7
       */
      setActived : function(id){
        var _self = this,
          item = _self.getItemById(id);
        _self._setItemActived(item);
      },
      /**
       * \u83b7\u53d6\u5f53\u524d\u9009\u4e2d\u7684\u6807\u7b7e\u9879
       * @return {BUI.Tab.NavTabItem} \u9009\u4e2d\u7684\u6807\u7b7e\u5bf9\u8c61
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
       * \u901a\u8fc7\u7f16\u53f7\u83b7\u53d6\u6807\u7b7e\u9879
       * @param  {String} id \u6807\u7b7e\u9879\u7684\u7f16\u53f7
       * @return {BUI.Tab.NavTabItem} \u6807\u7b7e\u9879\u5bf9\u8c61
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
                text : '\u5237\u65b0',
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
                text: '\u5173\u95ed',
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
                text : '\u5173\u95ed\u5176\u4ed6',
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
                text : '\u5173\u95ed\u6240\u6709',
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
      //\u5173\u95ed\u6807\u7b7e\u9879
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
          }else{//\u5220\u9664\u6807\u7b7e\u9879\u65f6\uff0c\u53ef\u80fd\u4f1a\u5f15\u8d77\u6eda\u52a8\u6309\u94ae\u72b6\u6001\u7684\u6539\u53d8
            _self._scrollToItem(activedItem);;
          }
          _self.forceFit();
        });
        
      },
      closeAll:function(){
        var _self = this,
          children = _self.get('children');
        BUI.each(children,function(item){
          item.close();
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
      //\u901a\u8fc7\u4f4d\u7f6e\u67e5\u627e\u6807\u7b7e\u9879
      _getItemByIndex : function(index){
        var _self = this,
          children = _self.get('children');  
        return children[index];
      },
      //\u83b7\u53d6\u6807\u7b7e\u9879\u7684\u4f4d\u7f6e
      _getIndex : function(item){
        var _self = this,
          children = _self.get('children');    
        return BUI.Array.indexOf(item,children);
      },
      //\u91cd\u65b0\u8ba1\u7b97\u6807\u7b7e\u9879\u5bb9\u5668\u7684\u5bbd\u5ea6\u4f4d\u7f6e
      _resetItemList : function(){
        if(this.get('forceFit')){
          return;
        }
        var _self = this,
          container = _self.getContentElement();

        container.width(_self._getTotalWidth());

      },
      //\u83b7\u53d6\u9009\u9879\u7684\u603b\u5bbd\u5ea6\uff0c\u4ee5\u9ed8\u8ba4\u5bbd\u5ea6\u4e3a\u57fa\u6570
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
      //\u8bbe\u7f6e\u5e73\u5747\u5bbd\u5ea6
      _forceItemWidth : function(width){
        width = width || this.get('itemWidth');
        var _self = this,
          children = _self.get('children');
        BUI.each(children,function(item){
          item.set('width',width);
        });
      },
      //\u4f7f\u6307\u5b9a\u6807\u7b7e\u9879\u5728\u7528\u6237\u53ef\u89c6\u533a\u57df\u5185
      _scrollToItem : function(item){
        if(this.get('forceFit')){ //\u81ea\u9002\u5e94\u540e\uff0c\u4e0d\u8fdb\u884c\u6eda\u52a8
          return;
        }
        var _self = this,
          container = _self.getContentElement(),
          containerPosition = container.position(),
          disWidth = _self._getDistanceToEnd(item,container,containerPosition),
          disBegin = _self._getDistanceToBegin(item,containerPosition); //\u5f53\u524d\u6d3b\u52a8\u7684\u9879\u8ddd\u79bb\u6700\u53f3\u7aef\u7684\u8ddd\u79bb

        //\u5982\u679c\u6807\u7b7e\u9879\u5217\u8868\u5c0f\u4e8e\u6574\u4e2a\u6807\u7b7e\u5bb9\u5668\u7684\u5927\u5c0f\uff0c\u5219\u5de6\u5bf9\u9f50
        if(container.width() < container.parent().width()){
          _self._scrollTo(container,0);  
        }else if(disBegin < 0){//\u5982\u679c\u5de6\u8fb9\u88ab\u906e\u6321\uff0c\u5411\u53f3\u79fb\u52a8

          _self._scrollTo(container,containerPosition.left - (disBegin));

        }else if(disWidth > 0){//\u5982\u679c\u5f53\u524d\u8282\u70b9\u88ab\u53f3\u7aef\u906e\u6321\uff0c\u5219\u5411\u5de6\u6eda\u52a8\u5230\u663e\u793a\u4f4d\u7f6e
        
          _self._scrollTo(container,containerPosition.left + (disWidth) * -1);

        }else if(containerPosition.left < 0){//\u5c06\u5de6\u8fb9\u79fb\u52a8\uff0c\u4f7f\u6700\u540e\u4e00\u4e2a\u6807\u7b7e\u9879\u79bb\u53f3\u8fb9\u6700\u8fd1
          var lastDistance = _self._getLastDistance(container,containerPosition),
            toLeft = 0;
          if(lastDistance < 0){
            toLeft = containerPosition.left - lastDistance;
            toLeft = toLeft < 0 ? toLeft : 0;
            _self._scrollTo(container,toLeft);  
          }
        }
      },
      //\u83b7\u53d6\u6807\u7b7e\u5230\u6700\u5de6\u7aef\u7684\u8ddd\u79bb
      _getDistanceToBegin : function(item,containerPosition){
        var position = item.get('el').position();

        return position.left + containerPosition.left;
      },
      /**
       * \u83b7\u53d6\u6807\u7b7e\u5230\u6700\u53f3\u7aef\u7684\u8ddd\u79bb
       * @return  {Number} \u50cf\u7d20
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
      //\u83b7\u53d6\u6700\u540e\u4e00\u4e2a\u6807\u7b7e\u9879\u79bb\u53f3\u8fb9\u7684\u95f4\u8ddd
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
      //\u5411\u53f3\u6eda\u52a8
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
      //\u8bbe\u7f6e\u5411\u5de6\uff0c\u5411\u53f3\u7684\u7bad\u5934\u662f\u5426\u53ef\u7528
      _setArrowStatus : function(container,containerPosition){

        container = container || this.getContentElement();
        var _self = this,
          wapperEl = _self.get('el'),
          position = containerPosition || container.position(),
          disWidth = _self._getLastDistance(container,containerPosition);

        //\u53ef\u4ee5\u5411\u5de6\u8fb9\u6eda\u52a8
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
      //\u8bbe\u7f6e\u5f53\u524d\u9009\u4e2d\u7684\u6807\u7b7e
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
          //\u5f53\u6807\u7b7e\u9879\u53ef\u89c1\u65f6\uff0c\u5426\u5219\u65e0\u6cd5\u8ba1\u7b97\u4f4d\u7f6e\u4fe1\u606f
          if(item.get('visible')){
            _self._scrollToItem(item);
          }
          
          _self.fire('activeChange',{item:item});
        }
      }

    },
    
    {
      ATTRS : 
    /**
      * @lends BUI.Tab.NavTab.prototype
      * @ignore
      */    
    {
        defaultChildClass:{
          value : 'nav-tab-item'
        },
        /**
         * @private
         * \u53f3\u952e\u83dc\u5355
         * @type {Object}
         */
        menu : {

        },
        /**
         * \u8bbe\u7f6e\u6b64\u53c2\u6570\u65f6\uff0c\u6807\u7b7e\u9009\u9879\u7684\u5bbd\u5ea6\u4f1a\u8fdb\u884c\u81ea\u9002\u5e94
         * @cfg {Boolean} forceFit
         */
        forceFit : {
          view : true,
          value : false
        },
        /**
         * \u6807\u7b7e\u7684\u9ed8\u8ba4\u5bbd\u5ea6,140px\uff0c\u8bbe\u7f6eforceFit:true\u540e\uff0c\u6b64\u5bbd\u5ea6\u4e3a\u6700\u5bbd\u5bbd\u5ea6
         * @type {Number}
         */
        itemWidth : {
          value : ITEM_WIDTH
        },
        /**
         * \u6e32\u67d3\u6807\u7b7e\u7684\u6a21\u7248
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
             * \u70b9\u51fb\u6807\u7b7e\u9879
             * @event
             * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
             * @param {BUI.Tab.NavTabItem} e.item \u6807\u7b7e\u9879
             */
            'itemclick' : false
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
});
define('bui/tab/tabitem',['bui/common'],function (require) {
  

  var BUI = require('bui/common'),
    Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * @private
   * @class BUI.Tab.TabItemView
   * @extends BUI.Component.View
   * @mixins BUI.Component.UIBase.ListItemView
   * \u6807\u7b7e\u9879\u7684\u89c6\u56fe\u5c42\u5bf9\u8c61
   */
  var itemView = Component.View.extend([UIBase.ListItemView],{
  },{
    xclass:'tab-item-view'
  });


  /**
   * \u6807\u7b7e\u9879
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
});
define('bui/tab/tab',['bui/common'],function (require) {
  

  var BUI = require('bui/common'),
    Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * \u5217\u8868
   * xclass:'tab'
   * <pre><code>
   * BUI.use('bui/tab',function(Tab){
   *   
   *     var tab = new Tab.Tab({
   *         render : '#tab',
   *         elCls : 'nav-tabs',
   *         autoRender: true,
   *         children:[
   *           {text:'\u6807\u7b7e\u4e00',value:'1'},
   *           {text:'\u6807\u7b7e\u4e8c',value:'2'},
   *           {text:'\u6807\u7b7e\u4e09',value:'3'}
   *         ]
   *       });
   *     tab.on('selectedchange',function (ev) {
   *       var item = ev.item;
   *       $('#log').text(item.get('text') + ' ' + item.get('value'));
   *     });
   *     tab.setSelected(tab.getItemAt(0)); //\u8bbe\u7f6e\u9009\u4e2d\u7b2c\u4e00\u4e2a
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
       * \u5b50\u7c7b\u7684\u9ed8\u8ba4\u7c7b\u540d\uff0c\u5373\u7c7b\u7684 xclass
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

});
define('bui/tab/tabpanelitem',['bui/common','bui/tab/tabitem','bui/tab/panelitem'],function (require) {
  

  var BUI = require('bui/common'),
    TabItem = require('bui/tab/tabitem'),
    PanelItem = require('bui/tab/panelitem'),
    Component = BUI.Component;

  /**
   * @private
   * @class BUI.Tab.TabPanelItemView
   * @extends BUI.Tab.TabItemView
   * \u5b58\u5728\u9762\u677f\u7684\u6807\u7b7e\u9879\u89c6\u56fe\u5c42\u5bf9\u8c61
   */
  var itemView = TabItem.View.extend([Component.UIBase.Close.View],{
  },{
    xclass:'tab-panel-item-view'
  });


  /**
   * \u6807\u7b7e\u9879
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
       * \u5173\u95ed\u65f6\u76f4\u63a5\u9500\u6bc1\u6807\u7b7e\u9879\uff0c\u6267\u884cremove\u65b9\u6cd5
       * @type {String}
       */
      closeAction : {
        value : 'remove'
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

});
define('bui/tab/tabpanel',['bui/common','bui/tab/tab','bui/tab/panels'],function (require) {
  
  var BUI = require('bui/common'),
    Tab = require('bui/tab/tab'),
    Panels = require('bui/tab/panels');

  /**
   * \u5e26\u6709\u9762\u677f\u7684\u5207\u6362\u6807\u7b7e
   * <pre><code>
   * BUI.use('bui/tab',function(Tab){
   *   
   *     var tab = new Tab.TabPanel({
   *       render : '#tab',
   *       elCls : 'nav-tabs',
   *       panelContainer : '#panel',
   *       autoRender: true,
   *       children:[
   *         {text:'\u6e90\u4ee3\u7801',value:'1'},
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
      //\u5173\u95ed\u6807\u7b7e
      _self.on('beforeclosed',function(ev){
        var item = ev.target;
        _self._beforeClosedItem(item);
      });
    },
    //\u5173\u95ed\u6807\u7b7e\u9009\u9879\u524d
    _beforeClosedItem : function(item){
      if(!item.get('selected')){ //\u5982\u679c\u672a\u9009\u4e2d\u4e0d\u6267\u884c\u4e0b\u9762\u7684\u9009\u4e2d\u64cd\u4f5c
        return;
      }

      var _self = this,
        index = _self.indexOfItem(item),
        count = _self.getItemCount(),
        preItem,
        nextItem;
      if(index !== count - 1){ //\u4e0d\u662f\u6700\u540e\u4e00\u4e2a\uff0c\u5219\u6fc0\u6d3b\u6700\u540e\u4e00\u4e2a
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
       * \u9ed8\u8ba4\u7684\u9762\u677f\u5bb9\u5668
       * @cfg {String} [panelContainer='.tab-panels']
       */
      panelContainer : {
        value : '.tab-panels'
      },
      /**
       * \u9ed8\u8ba4\u5b50\u63a7\u4ef6\u7684xclass
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