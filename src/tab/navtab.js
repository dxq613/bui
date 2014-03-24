/**
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
});