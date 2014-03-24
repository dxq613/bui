/**
 * @fileOverview 列表选项，使用键盘导航
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/list/keynav',['bui/common'],function (require) {
  'use strict';
  /**
   * @class BUI.List.KeyNav
   * 列表导航扩展类
   */
  var  BUI = require('bui/common'),
    KeyNav = function(){};

  KeyNav.ATTRS = {
    /**
     * 选项高亮使用的状态,有些场景下，使用selected更合适
     * @cfg {String} [highlightedStatus='hover']
     */
    highlightedStatus : {
      value : 'hover'
    }
  };

  BUI.augment(KeyNav,{

    /**
     * 设置选项高亮，默认使用 'hover' 状态
     * @param  {Object} item 选项
     * @param  {Boolean} value 状态值，true,false
     * @protected
     */
    setHighlighted : function(item,element){
      if(this.hasStatus(item,'hover',element)){
        return;
      }
      var _self = this,
        highlightedStatus = _self.get('highlightedStatus'),
        lightedElement = _self._getHighLightedElement(),
        lightedItem = lightedElement ? _self.getItemByElement(lightedElement) : null;
      if(lightedItem !== item){
        if(lightedItem){
          this.setItemStatus(lightedItem,highlightedStatus,false,lightedElement);
        }
        this.setItemStatus(item,highlightedStatus,true,element);
        _self._scrollToItem(item,element);
      }
    },
    _getHighLightedElement : function(){
      var _self = this,
        highlightedStatus = _self.get('highlightedStatus'),
        element = _self.get('view').getFirstElementByStatus(highlightedStatus);
      return element;
    },
    /**
     * 获取高亮的选项
     * @return {Object} item
     * @protected
     */
    getHighlighted : function(){
      var _self = this,
        highlightedStatus = _self.get('highlightedStatus'),
        element = _self.get('view').getFirstElementByStatus(highlightedStatus);
      return _self.getItemByElement(element) || null;
    },
    /**
     * 获取列数
     * @return {Number} 选项的列数,默认为1列
     * @protected
     */
    getColumnCount : function(){
      var _self = this,
        firstItem = _self.getFirstItem(),
        element = _self.findElement(firstItem),
        node = $(element);
      if(element){
        return parseInt(node.parent().width() / node.outerWidth(),10);
      }
      return 1;
    },
    /**
     * 获取选项的行数 ，总数/列数 = list.getCount / column
     * @protected
     * @return {Number} 选项行数
     */
    getRowCount : function(columns){
      var _self = this;
      columns = columns || _self.getColumnCount();
      return (this.getCount() + columns - 1) / columns;
    },
    _getNextItem : function(forward,skip,count){
      var _self = this,
        currentIndx = _self._getCurrentIndex(),//默认第一行
        itemCount = _self.getCount(),
        factor = forward ? 1 : -1,
        nextIndex; 
      if(currentIndx === -1){
        return forward ? _self.getFirstItem() : _self.getLastItem();
      }
      if(!forward){
        skip = skip * factor;
      }
      nextIndex = (currentIndx + skip + count) % count;
      if(nextIndex > itemCount - 1){ //如果位置超出索引位置
        if(forward){
          nextIndex = nextIndex -  (itemCount - 1);
        }else{
          nextIndex = nextIndex + skip;
        }
        
      }
      return _self.getItemAt(nextIndex);
    },
    //获取左边一项
    _getLeftItem : function(){
      var _self = this,
        count = _self.getCount(),
        column = _self.getColumnCount();
      if(!count || column <= 1){ //单列时,或者为0时
        return null;
      }
      return _self._getNextItem(false,1,count);
    },
    //获取当前项
    _getCurrentItem : function(){
      return this.getHighlighted();
    },
    //获取当前项
    _getCurrentIndex : function(){
      var _self = this,
        item = _self._getCurrentItem();
      return this.indexOfItem(item);
    },
    //获取右边一项
    _getRightItem : function(){
      var _self = this,
        count = _self.getCount(),
        column = _self.getColumnCount();
      if(!count || column <= 1){ //单列时,或者为0时
        return null;
      }
      return this._getNextItem(true,1,count);
    },
    //获取下面一项
    _getDownItem : function(){
      var _self = this,
        columns = _self.getColumnCount(),
        rows = _self.getRowCount(columns);
      if(rows <= 1){ //单行或者为0时
        return null;
      }

      return  this._getNextItem(true,columns,columns * rows);

    },
    getScrollContainer : function(){
      return this.get('el');
    },
    /**
     * @protected
     * 只处理上下滚动，不处理左右滚动
     * @return {Boolean} 是否可以上下滚动
     */
    isScrollVertical : function(){
      var _self = this,
        el = _self.get('el'),
        container = _self.get('view').getItemContainer();

      return el.height() < container.height();
    },

    _scrollToItem : function(item,element){
      var _self = this;

      if(_self.isScrollVertical()){
        element = element || _self.findElement(item);
        var container = _self.getScrollContainer(),
          top = $(element).position().top,
          ctop = container.position().top,
          cHeight = container.height(),
          distance = top - ctop,
          height = $(element).height(),
          scrollTop = container.scrollTop();

        if(distance < 0 || distance > cHeight - height){
          container.scrollTop(scrollTop + distance);
        }

      }
    },
    //获取上面一项
    _getUpperItem : function(){
      var _self = this,
        columns = _self.getColumnCount(),
        rows = _self.getRowCount(columns);
      if(rows <= 1){ //单行或者为0时
        return null;
      }
      return this._getNextItem(false,columns,columns * rows);
    },
    /**
     * 处理向上导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavUp : function (ev) {

      var _self = this,
        upperItem = _self._getUpperItem();
      _self.setHighlighted(upperItem);
    },
    /**
     * 处理向下导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavDown : function (ev) {
      
      this.setHighlighted(this._getDownItem());
    },
    /**
     * 处理向左导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavLeft : function (ev) {
      this.setHighlighted(this._getLeftItem());
    },
    
    /**
     * 处理向右导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavRight : function (ev) {
      this.setHighlighted(this._getRightItem());
    },
    /**
     * 处理确认键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEnter : function (ev) {
      var _self = this,
        current = _self._getCurrentItem(),
        element;
      if(current){
        element = _self.findElement(current);
        //_self.setSelected(current);
        $(element).trigger('click');
      }
    },
    /**
     * 处理 esc 键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEsc : function (ev) {
      this.setHighlighted(null); //移除
    },
    /**
     * 处理Tab键
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavTab : function(ev){
      this.setHighlighted(this._getRightItem());
    }

  });

  return KeyNav;
});