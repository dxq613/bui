/**
 * @fileOverview 工具栏命名空间入口
 * @ignore
 */

define('bui/toolbar',['bui/common','bui/toolbar/baritem','bui/toolbar/bar','bui/toolbar/pagingbar','bui/toolbar/numberpagingbar'],function (require) {
  var BUI = require('bui/common'),
    Toolbar = BUI.namespace('Toolbar');

  BUI.mix(Toolbar,{
    BarItem : require('bui/toolbar/baritem'),
    Bar : require('bui/toolbar/bar'),
    PagingBar : require('bui/toolbar/pagingbar'),
    NumberPagingBar : require('bui/toolbar/numberpagingbar')
  });
  return Toolbar;
});/**
 * @fileOverview buttons or controls of toolbar
 * @author dxq613@gmail.com, yiminghe@gmail.com
 * @ignore
 */
define('bui/toolbar/baritem',function(){

  /**
   * @name BUI.Toolbar
   * @namespace 工具栏命名空间
   * @ignore
   */
  var PREFIX = BUI.prefix,
    Component = BUI.Component,
    UIBase = Component.UIBase;
    
  /**
   * barItem的视图类
   * @class BUI.Toolbar.BarItemView
   * @extends BUI.Component.View
   * @mixins BUI.Component.UIBase.ListItemView
   * @private
   */
  var BarItemView = Component.View.extend([UIBase.ListItemView]);
  /**
     * 工具栏的子项，包括按钮、文本、链接和分隔符等
     * @class BUI.Toolbar.BarItem
     * @extends BUI.Component.Controller
     */
  var BarItem = Component.Controller.extend([UIBase.ListItem],{
    
    /**
    * render baritem 's dom
    * @protected
    */
    renderUI:function() {
        var el = this.get('el');
        el.addClass(PREFIX + 'inline-block');
        if (!el.attr('id')) {
            el.attr('id', this.get('id'));
        }
    }
  },{
    ATTRS:
    {
      elTagName :{
          view : true,
          value : 'li'
      },
      /**
       * 是否可选择
       * <pre><code>
       * 
       * </code></pre>
       * @cfg {Object} [selectable = false]
       */
      selectable : {
        value : false
      },
      /**
      * 是否获取焦点
      * @default {boolean} false
      */
      focusable : {
        value : false
      },
      xview: {
        value : BarItemView
      }
    }
  },{
    xclass : 'bar-item',
    priority : 1  
  });

  /**
     * 工具栏的子项，添加按钮
     * xclass : 'bar-item-button'
     * @extends  BUI.Toolbar.BarItem
     * @class BUI.Toolbar.BarItem.Button
     */
  var ButtonBarItem = BarItem.extend({
    
    _uiSetDisabled : function(value){
      var _self = this,
        el = _self.get('el'),
        method = value ? 'addClass' : 'removeClass';
      
      el.find('button').attr('disabled',value)[method](PREFIX + 'button-disabled');
    },
    _uiSetChecked: function(value){
      var _self = this,
        el = _self.get('el'),
        method = value ? 'addClass' : 'removeClass';

        el.find('button')[method](PREFIX + 'button-checked');
    },
    _uiSetText : function(v){
      var _self = this,
        el = _self.get('el');
      el.find('button').text(v);
    },
    _uiSetbtnCls : function(v){
      var _self = this,
        el = _self.get('el');
      el.find('button').addClass(v);
    }
    
  },{
    ATTRS:
    {
      /**
       * 是否选中
       * @type {Boolean}
       */
      checked : {
        value :false
      },
      /**
       * 模板
       * @type {String}
       */
      tpl : {
        view : true,
        value : '<button type="button" class="{btnCls}">{text}</button>'
      },
      /**
       * 按钮的样式
       * @cfg {String} btnCls
       */
      /**
       * 按钮的样式
       * @type {String}
       */
      btnCls:{
        sync:false
      },
      /**
      * The text to be used as innerHTML (html tags are accepted).
      * @cfg {String} text
      */
      /**
      * The text to be used as innerHTML (html tags are accepted).
      * @type {String} 
      */
      text : {
        sync:false,
        value : ''
      }
    }
  },{
    xclass : 'bar-item-button',
    priority : 2  
  });
  
  /**
     * 工具栏项之间的分隔符
     * xclass:'bar-item-separator'
     * @extends  BUI.Toolbar.BarItem
     * @class BUI.Toolbar.BarItem.Separator
     */
  var SeparatorBarItem = BarItem.extend({
    /* render separator's dom
    * @protected
        *
    */
    renderUI:function() {
            var el = this.get('el');
            el .attr('role', 'separator');
        }
  },
  {
    xclass : 'bar-item-separator',
    priority : 2  
  });

  
  /**
     * 工具栏项之间的空白
     * xclass:'bar-item-spacer'
     * @extends  BUI.Toolbar.BarItem
     * @class BUI.Toolbar.BarItem.Spacer
     */
  var SpacerBarItem = BarItem.extend({
    
  },{
    ATTRS:
    {
      /**
      * 空白宽度
      * @type {Number}
      */
      width : {
        view:true,
        value : 2
      }
    }
  },{
    xclass : 'bar-item-spacer',
    priority : 2  
  });
  

  /**
     * 显示文本的工具栏项
     * xclass:'bar-item-text'
     * @extends  BUI.Toolbar.BarItem
     * @class BUI.Toolbar.BarItem.Text
     */
  var TextBarItem = BarItem.extend({
    _uiSetText : function(text){
      var _self = this,
        el = _self.get('el');
      el.html(text);
    }
  },{
    ATTRS:
    {
      
      /**
      * 文本用作 innerHTML (html tags are accepted).
      * @cfg {String} text
      */
      /**
      * 文本用作 innerHTML (html tags are accepted).
      * @default {String} ""
      */
      text : {
        value : ''
      }
    }
  },{
    xclass : 'bar-item-text',
    priority : 2  
  });
  

  BarItem.types = {
    'button' : ButtonBarItem,
    'separator' : SeparatorBarItem,
    'spacer' : SpacerBarItem,
    'text'  : TextBarItem
  };
  

  return BarItem;
});/**
 * @fileOverview A collection of commonly used function buttons or controls represented in compact visual form.
 * @author dxq613@gmail.com, yiminghe@gmail.com
 * @ignore
 */
define('bui/toolbar/bar',function(){

	var Component = BUI.Component,
    UIBase = Component.UIBase;
		
	/**
	 * bar的视图类
	 * @class BUI.Toolbar.BarView
	 * @extends BUI.Component.View
	 * @private
	 */
	var barView = Component.View.extend({

		renderUI:function() {
        var el = this.get('el');
        el.attr('role', 'toolbar');
           
        if (!el.attr('id')) {
            el.attr('id', BUI.guid('bar'));
        }
    }
	});

	/**
	 * 工具栏
   * 可以放置按钮、文本、链接等，是分页栏的基类
   * xclass : 'bar'
   * <p>
   * <img src="../assets/img/class-toolbar.jpg"/>
   * </p>
   * ## 按钮组
   * <pre><code>
   *   BUI.use('bui/toolbar',function(Toolbar){
   *     var buttonGroup = new Toolbar.Bar({
   *       elCls : 'button-group',
   *       defaultChildCfg : {
   *         elCls : 'button button-small'
   *       },
   *       children : [{content : '增加'},{content : '修改'},{content : '删除'}],
   *       
   *       render : '#b1'
   *     });
   *
   *     buttonGroup.render();
   *   });
   * </code></pre>
   * @class BUI.Toolbar.Bar
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ChildList
   */
	var Bar = Component.Controller.extend([UIBase.ChildList],	
	{
		/**
		* 通过id 获取项
		* @param {String|Number} id the id of item 
		* @return {BUI.Toolbar.BarItem}
		*/
		getItem : function(id){
			return this.getChild(id);
		}
	},{
		ATTRS:
		{
      elTagName :{
          view : true,
          value : 'ul'
      },
      /**
       * 默认子项的样式
       * @type {String}
       * @override
       */
      defaultChildClass: {
        value : 'bar-item'
      },
			/**
			* 获取焦点
      * @protected
      * @ignore
			*/
			focusable : {
				value : false
			},
			/**
			* @private
      * @ignore
			*/
			xview : {
				value : barView	
			}
		}
	},{
		xclass : 'bar',
		priority : 1	
	});

	return Bar;
});/**
 * @fileOverview  a specialized toolbar that is bound to a Grid.Store and provides automatic paging control.
 * @author dxq613@gmail.com, yiminghe@gmail.com
 * @ignore
 */
define('bui/toolbar/pagingbar',['bui/toolbar/bar'],function(require) {

    var Bar = require('bui/toolbar/bar'),
        Component = BUI.Component,
        Bindable = Component.UIBase.Bindable;

    var PREFIX = BUI.prefix,
		ID_FIRST = 'first',
        ID_PREV = 'prev',
        ID_NEXT = 'next',
        ID_LAST = 'last',
        ID_SKIP = 'skip',
        ID_REFRESH = 'refresh',
        ID_TOTAL_PAGE = 'totalPage',
        ID_CURRENT_PAGE = 'curPage',
        ID_TOTAL_COUNT = 'totalCount',
        ID_BUTTONS = [ID_FIRST,ID_PREV,ID_NEXT,ID_LAST,ID_SKIP,ID_REFRESH],
        ID_TEXTS = [ID_TOTAL_PAGE,ID_CURRENT_PAGE,ID_TOTAL_COUNT];

    /**
     * 分页栏
     * xclass:'pagingbar'
     * @extends BUI.Toolbar.Bar
     * @mixins BUI.Component.UIBase.Bindable
     * @class BUI.Toolbar.PagingBar
     */
    var PagingBar = Bar.extend([Bindable],
        {
            /**
             * From Bar, Initialize this paging bar items.
             *
             * @protected
             */
            initializer:function () {
                var _self = this,
                    children = _self.get('children'),
                    items = _self.get('items'),
                    store = _self.get('store');
                if(!items){
                    items = _self._getItems();
                    BUI.each(items, function (item) {
                        children.push(item);//item
                    });
                }else{
                    BUI.each(items, function (item,index) { //转换对应的分页栏
                        if(BUI.isString(item)){
                            if(BUI.Array.contains(item,ID_BUTTONS)){
                                item = _self._getButtonItem(item);
                            }else if(BUI.Array.contains(item,ID_TEXTS)){
                            
                                item = _self._getTextItem(item);
                            }else{
                                item = {xtype : item};
                            }

                        }
                        children.push(item);
                    }); 
                }
                
                if (store && store.get('pageSize')) {
                    _self.set('pageSize', store.get('pageSize'));
                }
            },
            /**
             * bind page change and store events
             *
             * @protected
             */
            bindUI:function () {
                var _self = this;
                _self._bindButtonEvent();
                //_self._bindStoreEvents();

            },
            /**
             * skip to page
             * this method can fire "beforepagechange" event,
             * if you return false in the handler the action will be canceled
             * @param {Number} page target page
             */
            jumpToPage:function (page) {
                if (page <= 0 || page > this.get('totalPage')) {
                    return;
                }
                var _self = this,
                    store = _self.get('store'),
                    pageSize = _self.get('pageSize'),
                    index = page - 1,
                    start = index * pageSize;
                var result = _self.fire('beforepagechange', {from:_self.get('curPage'), to:page});
                if (store && result !== false) {
                    store.load({ start:start, limit:pageSize, pageIndex:index });
                }
            },
            //after store loaded data,reset the information of paging bar and buttons state
            _afterStoreLoad:function (store, params) {
                var _self = this,
                    pageSize = _self.get('pageSize'),
                    start = 0, //页面的起始记录
                    end, //页面的结束记录
                    totalCount, //记录的总数
                    curPage, //当前页
                    totalPage;//总页数;

                start = store.get('start');
                
                //设置加载数据后翻页栏的状态
                totalCount = store.getTotalCount();
                end = totalCount - start > pageSize ? start + store.getCount() - 1: totalCount;
                totalPage = parseInt((totalCount + pageSize - 1) / pageSize, 10);
                totalPage = totalPage > 0 ? totalPage : 1;
                curPage = parseInt(start / pageSize, 10) + 1;

                _self.set('start', start);
                _self.set('end', end);
                _self.set('totalCount', totalCount);
                _self.set('curPage', curPage);
                _self.set('totalPage', totalPage);

                //设置按钮状态
                _self._setAllButtonsState();
                _self._setNumberPages();
            },

            //bind page change events
            _bindButtonEvent:function () {
                var _self = this;

                //first page handler
                _self._bindButtonItemEvent(ID_FIRST, function () {
                    _self.jumpToPage(1);
                });

                //previous page handler
                _self._bindButtonItemEvent(ID_PREV, function () {
                    _self.jumpToPage(_self.get('curPage') - 1);
                });

                //previous page next
                _self._bindButtonItemEvent(ID_NEXT, function () {
                    _self.jumpToPage(_self.get('curPage') + 1);
                });

                //previous page next
                _self._bindButtonItemEvent(ID_LAST, function () {
                    _self.jumpToPage(_self.get('totalPage'));
                });
                //skip to one page
                _self._bindButtonItemEvent(ID_SKIP, function () {
                    handleSkip();
                });

                //refresh
                _self._bindButtonItemEvent(ID_REFRESH, function () {
                    _self.jumpToPage(_self.get('curPage'));
                });
                //input page number and press key "enter"
                var curPage = _self.getItem(ID_CURRENT_PAGE);
                if(curPage){
                    curPage.get('el').on('keyup', function (event) {
                        event.stopPropagation();
                        if (event.keyCode === 13) {
                            handleSkip();
                        }
                    });
                }
                
                //when click skip button or press key "enter",cause an action of skipping page
                /**
                 * @private
                 * @ignore
                 */
                function handleSkip() {
                    var value = parseInt(_self._getCurrentPageValue(), 10);
                    if (_self._isPageAllowRedirect(value)) {
                        _self.jumpToPage(value);
                    } else {
                        _self._setCurrentPageValue(_self.get('curPage'));
                    }
                }
            },
            // bind button item event
            _bindButtonItemEvent:function (id, func) {
                var _self = this,
                    item = _self.getItem(id);
                if (item) {
                    item.on('click', func);
                }
            },
            onLoad:function (params) {
                var _self = this,
                    store = _self.get('store');
                _self._afterStoreLoad(store, params);
            },
            //get the items of paging bar
            _getItems:function () {
                var _self = this,
                    items = _self.get('items');
                if (items && items.length) {
                    return items;
                }
                //default items
                items = [];
                //first item
                items.push(_self._getButtonItem(ID_FIRST));
                //previous item
                items.push(_self._getButtonItem(ID_PREV));
                //separator item
                items.push(_self._getSeparator());
                //total page of store
                items.push(_self._getTextItem(ID_TOTAL_PAGE));
                //current page of store
                items.push(_self._getTextItem(ID_CURRENT_PAGE));
                //button for skip to
                items.push(_self._getButtonItem(ID_SKIP));
                //separator item
                items.push(_self._getSeparator());
                //next item
                items.push(_self._getButtonItem(ID_NEXT));
                //last item
                items.push(_self._getButtonItem(ID_LAST));
                //separator item
                items.push(_self._getSeparator());
                //current page of store
                items.push(_self._getTextItem(ID_TOTAL_COUNT));
                return items;
            },
            //get item which the xclass is button
            _getButtonItem:function (id) {
                var _self = this;
                return {
                    id:id,
                    xclass:'bar-item-button',
                    text:_self.get(id + 'Text'),
                    disabled:true,
                    elCls:_self.get(id + 'Cls')
                };
            },
            //get separator item
            _getSeparator:function () {
                return {xclass:'bar-item-separator'};
            },
            //get text item
            _getTextItem:function (id) {
                var _self = this;
                return {
                    id:id,
                    xclass:'bar-item-text',
                    text:_self._getTextItemTpl(id)
                };
            },
            //get text item's template
            _getTextItemTpl:function (id) {
                var _self = this,
                    obj = _self.getAttrVals();
                return BUI.substitute(this.get(id + 'Tpl'), obj);
            },
            //Whether to allow jump, if it had been in the current page or not within the scope of effective page, not allowed to jump
            _isPageAllowRedirect:function (value) {
                var _self = this;
                return value && value > 0 && value <= _self.get('totalPage') && value !== _self.get('curPage');
            },
            //when page changed, reset all buttons state
            _setAllButtonsState:function () {
                var _self = this,
                    store = _self.get('store');
                if (store) {
                    _self._setButtonsState([ID_PREV, ID_NEXT, ID_FIRST, ID_LAST, ID_SKIP], true);
                }

                if (_self.get('curPage') === 1) {
                    _self._setButtonsState([ID_PREV, ID_FIRST], false);
                }
                if (_self.get('curPage') === _self.get('totalPage')) {
                    _self._setButtonsState([ID_NEXT, ID_LAST], false);
                }
            },
            //if button id in the param buttons,set the button state
            _setButtonsState:function (buttons, enable) {
                var _self = this,
                    children = _self.get('children');
                BUI.each(children, function (child) {
                    if (BUI.Array.indexOf(child.get('id'), buttons) !== -1) {
                        child.set('disabled', !enable);
                    }
                });
            },
            //show the information of current page , total count of pages and total count of records
            _setNumberPages:function () {
                var _self = this,
                    items = _self.getItems();/*,
                    totalPageItem = _self.getItem(ID_TOTAL_PAGE),
                    totalCountItem = _self.getItem(ID_TOTAL_COUNT);
                if (totalPageItem) {
                    totalPageItem.set('content', _self._getTextItemTpl(ID_TOTAL_PAGE));
                }
                _self._setCurrentPageValue(_self.get(ID_CURRENT_PAGE));
                if (totalCountItem) {
                    totalCountItem.set('content', _self._getTextItemTpl(ID_TOTAL_COUNT));
                }*/
                BUI.each(items,function(item){
                    if(item.__xclass === 'bar-item-text'){
                        item.set('content', _self._getTextItemTpl(item.get('id')));
                    }
                });

            },
            _getCurrentPageValue:function (curItem) {
                var _self = this;
                curItem = curItem || _self.getItem(ID_CURRENT_PAGE);
                if(curItem){
                    var textEl = curItem.get('el').find('input');
                    return textEl.val();
                }
                
            },
            //show current page in textbox
            _setCurrentPageValue:function (value, curItem) {
                var _self = this;
                curItem = curItem || _self.getItem(ID_CURRENT_PAGE);
                if(curItem){
                    var textEl = curItem.get('el').find('input');
                    textEl.val(value);
                }
                
            }
        }, {
            ATTRS:
     
            {
               
                /**
                 * the text of button for first page
                 * @default {String} "首 页"
                 */
                firstText:{
                    value:'首 页'
                },
                /**
                 * the cls of button for first page
                 * @default {String} "bui-pb-first"
                 */
                firstCls:{
                    value:PREFIX + 'pb-first'
                },
                /**
                 * the text for previous page button
                 * @default {String} "前一页"
                 */
                prevText:{
                    value:'上一页'
                },
                /**
                 * the cls for previous page button
                 * @default {String} "bui-pb-prev"
                 */
                prevCls:{
                    value: PREFIX + 'pb-prev'
                },
                /**
                 * the text for next page button
                 * @default {String} "下一页"
                 */
                nextText:{
                    value:'下一页'
                },
                /**
                 * the cls for next page button
                 * @default {String} "bui-pb-next"
                 */
                nextCls:{
                    value: PREFIX + 'pb-next'
                },
                /**
                 * the text for last page button
                 * @default {String} "末 页"
                 */
                lastText:{
                    value:'末 页'
                },
                /**
                 * the cls for last page button
                 * @default {String} "bui-pb-last"
                 */
                lastCls:{
                    value:PREFIX + 'pb-last'
                },
                /**
                 * the text for skip page button
                 * @default {String} "跳 转"
                 */
                skipText:{
                    value:'确定'
                },
                /**
                 * the cls for skip page button
                 * @default {String} "bui-pb-last"
                 */
                skipCls:{
                    value:PREFIX + 'pb-skip'
                },
                refreshText : {
                    value : '刷新'
                },
                refreshCls : {
                    value:PREFIX + 'pb-refresh'
                },
                /**
                 * the template of total page info
                 * @default {String} '共 {totalPage} 页'
                 */
                totalPageTpl:{
                    value:'共 {totalPage} 页'
                },
                /**
                 * the template of current page info
                 * @default {String} '第 &lt;input type="text" autocomplete="off" class="bui-pb-page" size="20" name="inputItem"&gt; 页'
                 */
                curPageTpl:{
                    value:'第 <input type="text" '+
                        'autocomplete="off" class="'+PREFIX+'pb-page" size="20" value="{curPage}" name="inputItem"> 页'
                },
                /**
                 * the template of total count info
                 * @default {String} '共{totalCount}条记录'
                 */
                totalCountTpl:{
                    value:'共{totalCount}条记录'
                },
                autoInitItems : {
                    value : false
                },
                /**
                 * current page of the paging bar
                 * @private
                 * @default {Number} 0
                 */
                curPage:{
                    value:0
                },
                /**
                 * total page of the paging bar
                 * @private
                 * @default {Number} 0
                 */
                totalPage:{
                    value:0
                },
                /**
                 * total count of the store that the paging bar bind to
                 * @private
                 * @default {Number} 0
                 */
                totalCount:{
                    value:0
                },
                /**
                 * The number of records considered to form a 'page'.
                 * if store set the property ,override this value by store's pageSize
                 * @private
                 */
                pageSize:{
                    value:30
                },
                /**
                 * The {@link BUI.Data.Store} the paging toolbar should use as its data source.
                 * @protected
                 */
                store:{

                }
            },
            ID_FIRST:ID_FIRST,
            ID_PREV:ID_PREV,
            ID_NEXT:ID_NEXT,
            ID_LAST:ID_LAST,
            ID_SKIP:ID_SKIP,
            ID_REFRESH: ID_REFRESH,
            ID_TOTAL_PAGE:ID_TOTAL_PAGE,
            ID_CURRENT_PAGE:ID_CURRENT_PAGE,
            ID_TOTAL_COUNT:ID_TOTAL_COUNT
        }, {
            xclass:'pagingbar',
            priority:2
        });

    return PagingBar;

});/**
 * @fileOverview  a specialized toolbar that is bound to a Grid.Store and provides automatic paging control.
 * @author 
 * @ignore
 */
define('bui/toolbar/numberpagingbar',['bui/toolbar/pagingbar'],function(require) {

    var Component = BUI.Component,
        PBar = require('bui/toolbar/pagingbar');

    var PREFIX = BUI.prefix,
        NUMBER_CONTAINER = 'numberContainer',
        CLS_NUMBER_BUTTON = PREFIX + 'button-number';

    /**
     * 数字分页栏
     * xclass:'pagingbar-number'
     * @extends BUI.Toolbar.PagingBar
     * @class BUI.Toolbar.NumberPagingBar
     */
    var NumberPagingBar = PBar.extend(
        {
        /**
        * get the initial items of paging bar
        * @protected
        *
        */
        _getItems : function(){
            var _self = this,
                items = _self.get('items');

            if(items){
                return items;
            }
            //default items
            items = [];
            //previous item
            items.push(_self._getButtonItem(PBar.ID_PREV));
            //next item
            items.push(_self._getButtonItem(PBar.ID_NEXT));
            return items;
        },
        _getButtonItem : function(id){
          var _self = this;

          return {
              id:id,
              content:'<a href="javascript:;">'+_self.get(id + 'Text')+'</a>',
              disabled:true
          };
        },
        /**
        * bind buttons event
        * @protected
        *
        */
        _bindButtonEvent : function(){
            var _self = this,
                cls = _self.get('numberButtonCls');
            _self.constructor.superclass._bindButtonEvent.call(this);
            _self.get('el').delegate('a','click',function(ev){
              ev.preventDefault();
            });
            _self.on('click',function(ev){
              var item = ev.target;
              if(item && item.get('el').hasClass(cls)){
                var page = item.get('id');
                _self.jumpToPage(page);
              }
            });
        },
        //设置页码信息，设置 页数 按钮
        _setNumberPages : function(){
            var _self = this;

            _self._setNumberButtons();
        },
        //设置 页数 按钮
        _setNumberButtons : function(){
            var _self = this,
                curPage = _self.get('curPage'),
                totalPage = _self.get('totalPage'),
                numberItems = _self._getNumberItems(curPage,totalPage),
                curItem;

            _self._clearNumberButtons();

            BUI.each(numberItems,function(item){
                _self._appendNumberButton(item);
            });
            curItem = _self.getItem(curPage);
            if(curItem){
                curItem.set('selected',true);
            }
               
        },
        _appendNumberButton : function(cfg){
          var _self = this,
            count = _self.getItemCount();
          var item = _self.addItemAt(cfg,count - 1);
        },
        _clearNumberButtons : function(){
          var _self = this,
            items = _self.getItems(),
            count = _self.getItemCount();

          while(count > 2){
            _self.removeItemAt(count-2);  
            count = _self.getItemCount();          
          }
        },
        //获取所有页码按钮的配置项
        _getNumberItems : function(curPage, totalPage){
            var _self = this,
                result = [],
                maxLimitCount = _self.get('maxLimitCount'),
                showRangeCount = _self.get('showRangeCount'),
                maxPage;

            function addNumberItem(from,to){
                for(var i = from ;i<=to;i++){
                    result.push(_self._getNumberItem(i));
                }
            }

            function addEllipsis(){
                result.push(_self._getEllipsisItem());
            }

            if(totalPage < maxLimitCount){
                maxPage = totalPage;
                addNumberItem(1,totalPage);
            }else{
                var startNum = (curPage <= maxLimitCount) ? 1 : (curPage - showRangeCount),
                    lastLimit = curPage + showRangeCount,
                    endNum = lastLimit < totalPage ? (lastLimit > maxLimitCount ? lastLimit : maxLimitCount) : totalPage;
                if (startNum > 1) {
                    addNumberItem(1, 1);
                    if(startNum > 2){
                        addEllipsis();
                    }
                }
                maxPage = endNum;
                addNumberItem(startNum, endNum);
            }

            if (maxPage < totalPage) {
                if(maxPage < totalPage -1){
                    addEllipsis();
                }
                addNumberItem(totalPage, totalPage);
            }

            return result;
        },
        //获取省略号
        _getEllipsisItem : function(){
            var _self = this;
            return {
                disabled: true,           
                content : _self.get('ellipsisTpl')
            };
        },
        //生成页面按钮配置项
        _getNumberItem : function(page){
            var _self = this;
            return {
                id : page,
                elCls : _self.get('numberButtonCls')
            };
        }
        
    },{
        ATTRS:{
            itemStatusCls : {
              value : {
                selected : 'active',
                disabled : 'disabled'
              }
            },
            itemTpl : {
              value : '<a href="">{id}</a>'
            },
            prevText : {
              value : '<<'
            },
            nextText : {
              value : '>>'
            },
            /**
            * 当页码超过该设置页码时候显示省略号
            * @default {Number} 4
            */
            maxLimitCount : {
                value : 4
            },
            showRangeCount : {
                value : 1   
            },
            /**
            * the css used on number button
            */
            numberButtonCls:{
                value : CLS_NUMBER_BUTTON
            },
            /**
            * the template of ellipsis which represent the omitted pages number
            */
            ellipsisTpl : {
                value : '<a href="#">...</a>'
            }
        }
    },{
        xclass : 'pagingbar-number',
        priority : 3    
    });

    return NumberPagingBar;

});