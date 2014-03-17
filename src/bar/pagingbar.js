/**
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

});