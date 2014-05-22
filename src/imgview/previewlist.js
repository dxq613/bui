/**
 * @fileOverview 图片预览控件
 * @ignore
 */
define('bui/imgview/previewlist',['bui/common','bui/list'],function (r) {

  var BUI = r('bui/common'),
    List = r('bui/list');

  var loadCenterImg = function(self, src){
    var w = self.width(),
      h = self.height(),
      targetImg = new Image(),
      imgObj = jQuery("<img>");

    targetImg.onload = function(){
      var tw = targetImg.width,
        th = targetImg.height;
      if((tw/th)>(w/h)){
        var ih = w/tw*th;
        imgObj.css({
          "width":w,
          "height":ih,
          "marginTop":(h-ih)/2
        });
      }else{
        var iw = h/th*tw;
        imgObj.css({
          "width":iw,
          "height":h,
          "marginLeft":(w-iw)/2
        });
      }
      imgObj[0].src = src;
      self.html(imgObj);
    }
    targetImg.src = src;
    return targetImg;
  }

  if(!Array.indexOf){
    Array.prototype.indexOf = function(obj){
      for(var i=0; i<this.length; i++){
        if(this[i]==obj){
          return i;
        }
      }
      return -1;
    }
  }


  var PreviewList = BUI.Component.Controller.extend({
    initializer: function(){
      var _self = this,
        children = _self.get('children'),
        list = new List.SimpleList({
          elCls: _self.get('listCls'),
          itemTpl: _self.get('itemTpl')
        });

      children.push(list);
      _self.set('list', list);
    },
    renderUI: function(){
      var _self = this,
        list = _self.get('list'),
        alignType = _self.get('alignType'),
        ul = $(list.get('el')).find('ul'),
        el = _self.get('el');

      _self.set('ul', ul);
      el.prepend('<a href="#" class="ui-previewlist-prev J_previewPrev"></a>');
      el.append('<a href="#" class="ui-previewlist-next J_previewNext"></a>');

      if (alignType == "width") {
        ul.width(10000);
        el.addClass("ui-preview-wrap-width");
      }
      ul.addClass("clearfix");

      _self._uiSetHeight();
    },
    bindUI: function(){
      this._bindSelect(); // 绑定选中事件
      this._bindScroll(); // 绑定滚动事件
    },
    // 绑定选中事件
    _bindSelect: function(){
      var _self = this,
        list = _self.get('list');

      list.on('selectedchange',function(e){
        // 当前选中的位置
        var items = _self.get('items'),
          selected = items.indexOf(e.item),
          pageSize = _self.get('pageSize'),
          selectedchange = _self.get('selectedchange');

        _self.set('selected', selected);
        _self.setPage(parseInt(selected / pageSize));
        selectedchange && selectedchange(e, selected);
      });
    },
    // 绑定滚动事件
    _bindScroll: function(){
      var _self = this,
        el = _self.get('el'),
        itemHeight = _self.get('itemHeight');

      el.find(".J_previewNext").on('click',function(ev){
        ev.preventDefault();
        _self.goNext();
      });
      el.find(".J_previewPrev").on('click',function(ev){
        ev.preventDefault();
        _self.goPrev();
      });
    },
    /**
     * 滚到第几页
     * @param {Number} 滚动到第几页
     * @param {Number} 滚动的时间
     * @return {Boolean} 页码是否属于正常范围之内
     * * <pre><code>
     *  previewList.setPage(2, 500);
     * </code></pre>
     */
    setPage: function(pageNum, scrollTime){
      var _self = this,
        pageNum = typeof pageNum == "number" ? pageNum : parseInt(_self.get('selected') / _self.get('pageSize')),
        maxPage = _self.get('maxPage'),
        returnValue = false;


      if (pageNum >= 0 && pageNum < maxPage) {
        returnValue = true;
      } else if (pageNum >= maxPage && maxPage != 0) {
        pageNum = maxPage - 1;
        returnValue = true;
      }
      if(returnValue){
        _self.set('pageNum', pageNum);
      }

      return returnValue;
    },
    _uiSetPageNum: function(pageNum){
      var _self = this,
        ul = _self.get('ul'),
        scrollSize = _self.get('scrollSize'),
        scrollTime = _self.get('scrollTime'),
        alignType = _self.get('alignType');

      if (alignType == "height") {
        ul.clearQueue().animate({'marginTop': -pageNum * scrollSize}, scrollTime);
      } else if (alignType == "width") {
        ul.clearQueue().animate({'marginLeft': -pageNum * scrollSize}, scrollTime);
      }
    },
    /**
     * 上一页, 到了第一页就进入到尾页
     */
    goPrev: function(){
      this.setPage(this.get('pageNum') - 1);
    },
    /**
     * 下一页, 到了第一页就进入到尾页
     */
    goNext: function(){
      this.setPage(this.get('pageNum') + 1);
    },
    // 获取当前选中的number
    getSelect: function(){
      return this.get('selected');
    },
    getLength: function(){
      return this.get('items').length || 0;
    },
    _uiSetWidth: function(width){
      width = width || this.get('width');
      var _self = this,
        list = _self.get('list'),
        alignType = _self.get('alignType'),
        listWidth = width - 90;

      if (alignType == "width") {
        list.set('width', listWidth);
        _self.set('listWidth', listWidth);
        _self.__initPageInfo();
      }
    },
    _uiSetHeight: function(height){
      height = height || this.get('height');
      var _self = this,
        list = _self.get('list'),
        alignType = _self.get('alignType'),
        listHeight = height - 90;

      if (alignType == "height") {
        list.set('height', listHeight);
        _self.set('listHeight', listHeight);
        _self.__initPageInfo();
      }
    },
    _uiSetSelected: function(selected){
      var _self = this,
        items = _self.get('items'),
        pageSize = _self.get('pageSize'),
        list = _self.get('list');

      if (items.length != 0) {
        list.setSelected(items[selected]);
        _self.setPage(parseInt(selected / pageSize));
      }
    },
    _uiSetItems: function(items){
      var _self = this,
        itemWidth = _self.get('itemWidth'),
        itemHeight = _self.get('itemHeight');

      _self.get('list').setItems(items);
      _self.get('el').find(".ui-preview-mini-wrap").each(function(i){
        // 因为有4px的border。所以减8
        $(this).width(itemWidth - 8).height(itemHeight - 8);
        loadCenterImg($(this), items[i].miniSrc)
      });
      _self.__initPageInfo();

      // 防止第一次渲染的时候selected先执行了。
      if(_self.get('_rendered')){
        // 切换items的时候强制置零
        _self._uiSetSelected(0);
        // _self.set('selected', '0');
      }
      _self.set('_rendered', true);
    },
    // 高度变化、items变化都会引起page信息的变更。
    __initPageInfo: function(){
      var _self = this,
        alignType = _self.get('alignType'),
        itemHeight = _self.get('itemHeight'),
        itemWidth = _self.get('itemWidth'),
        listHeight = _self.get('listHeight'),
        listWidth = _self.get('listWidth'),
        height = _self.get('height');

      if (alignType == "width") {
        var pageSize = parseInt(listWidth / itemWidth),
          scrollSize = pageSize * itemWidth,
          itemsLength = _self.getLength(),
          maxPage = itemsLength % pageSize == 0 ? itemsLength / pageSize : parseInt(itemsLength / pageSize) + 1;

        // 设置pageSize
        _self.set('pageSize', pageSize);
        _self.set('scrollSize', scrollSize);
        _self.set('maxPage', maxPage);
      } else if (alignType == "height") {
        var pageSize = parseInt(listHeight / itemHeight),
          scrollSize = pageSize * itemHeight,
          itemsLength = _self.getLength(),
          maxPage = itemsLength % pageSize == 0 ? itemsLength / pageSize : parseInt(itemsLength / pageSize) + 1;

        // 设置pageSize
        _self.set('pageSize', pageSize);
        _self.set('scrollSize', scrollSize);
        _self.set('maxPage', maxPage);
      }
    },
    // 析构函数
    destructor: function(){

    }
  },{
    ATTRS: {
      elCls: {
        value: 'ui-preview-wrap'
      },
      listCls: {
        value: 'ui-preview-simple-list'
      },
      itemTpl: {
        value: '<li class="ui-preview-mini-wrap"></li>'
      },
      items: {
        value: []
      },
      selectedchange: {
        value: function(e){

        }
      },
      // 初始化、当前选中第几个
      selected: {
        value: 0
      },
      pageNum: {
        value: 0
      },
      // 单条item的宽度
      itemWidth: {
        value: 100
      },
      // 单条item的高度
      itemHeight: {
        value: 60
      },
      // 是否自带controls
      controls: {
        value: false
      },
      // 上下滑屏速度300
      scrollTime: {
        value: 300
      },
      // 横竖两种type,默认是height
      alignType: {
        value: 'height'
      },
      _rendered: {
        value: false
      }
    }
  })


  return PreviewList;
});
