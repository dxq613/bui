/**
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
});