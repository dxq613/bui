/**
 * @fileOverview imgview 命名空间入口
 * @ignore
 */
;(function(){
var BASE = 'bui/imgview';
define(BASE, ['bui/common',BASE + '/imgview',BASE + '/viewcontent',BASE + '/previewlist'],function (r) {
  var BUI = r('bui/common'),
    ImgView = BUI.namespace('ImgView');

  BUI.mix(ImgView,{
    ImgView: r(BASE + '/imgview'),
    ViewContent: r(BASE + '/viewcontent'),
    PreviewList: r(BASE + '/previewlist')
  });
  return ImgView;
});
})();
/**
 * @fileOverview 带样式的图片浏览
 * @ignore
 */

// 依赖关系数组写在第二参数，这样require关键字就可以压缩成"r"了。
define('bui/imgview/imgview',['bui/common','bui/toolbar','bui/imgview/viewcontent','bui/imgview/previewlist'],function (r) {

  var BUI = r('bui/common'),
    ViewContent = r('bui/imgview/viewcontent'),
    PreviewList = r('bui/imgview/previewlist'),
    Toolbar = r('bui/toolbar');

  /**
   * @class BUI.ImgView.ImgView
   * 自带小图预览及动作条的图片预览.
   * @extends BUI.Component.Controller
   */
  var ImgView = BUI.Component.Controller.extend({
    initializer : function(){
      var _self = this,
        el = _self.get('el'),
        children = _self.get('children');

      // 根据viewContent的配置项，生成viewContent
      var viewContent = new ViewContent(BUI.mix(_self.get('viewContent'),{
        elCls: "ui-img-view-content"
      }));
      // 生成底下的toolBar
      var toolBar = new Toolbar.Bar({
        elCls: "ui-img-view-toolbar",
        children: _self.get('commands'),
        itemTpl: '<a data-cmd="{cmd}" href="javascript:;">{text}</a>'
      });
      // 生成右边的previewList
      var previewList = new PreviewList({
        elCls: "ui-img-view-mini-wrap"
      })

      children.push(viewContent);
      children.push(previewList);
      children.push(toolBar);
      _self.set('toolBar',toolBar);
      _self.set('viewContent',viewContent);
      _self.set('previewList',previewList);
    },
    renderUI: function(){
      var _self = this,
        toolBar = _self.get('toolBar'),
        viewContent = _self.get('viewContent'),
        el = _self.get('el');

      viewContent.get('el').append('<a class="paintPrev J_paintPrev" href="#"></a><a class="paintNext J_paintNext" href="#"></a>')
      el.addClass("img-view-controls-wrap");
    },
    bindUI: function(){
      // 绑定工具栏事件，包括左右
      this._bindToolbar();
      this._bindSelectedChange();
      this._bindPrevNext();
    },
    // 绑定上下按钮的事件
    _bindPrevNext: function(){
      var _self = this,
        viewContent = _self.get('viewContent'),
        el = viewContent.get('el');

      el.hover(function(){
        el.find(".J_paintPrev,.J_paintNext").show();
      },function(){
        el.find(".J_paintPrev,.J_paintNext").hide();
      });
      el.find(".J_paintPrev").on('click',function(ev){
        ev.preventDefault();
        _self.paintPrev();
      });
      el.find(".J_paintNext").on('click',function(ev){
        ev.preventDefault();
        _self.paintNext();
      });
    },
    // 绑定动作条的事件
    _bindToolbar: function(){
      var _self = this,
        viewContent = _self.get('viewContent'),
        toolBar = _self.get('toolBar');

      toolBar.on('click',function(ev){
        var item = ev.target,
          command = item.get('cmd');

        if (command == "viewImg") {
          var imgSrc = viewContent.getSrc();
          $(ev.domTarget).attr("href", imgSrc);
        } else if (command) {
          viewContent[command]&&viewContent[command]();
        }
      });
    },
    // 绑定选中事件
    _bindSelectedChange: function(){
      var _self = this;

      _self.get('previewList').set('selectedchange', function(e, imgNum){
        // console.log(imgNum);
        var selectedchange = _self.get('selectedchange'),
          viewContent = _self.get('viewContent'),
          imgList = _self.get('imgList');

        if (imgList.length) {
          viewContent.set('imgSrc', imgList[imgNum].src);
          _self.set('imgNum', imgNum);
          // selectedchange是imgview的回掉
          selectedchange(imgNum, imgList[imgNum].src);
        }
      });
    },
    /**
     * 获得viewContet对象
     * @return {Object}
     * <pre><code>
     *  var viewContent = imgview.getViewContent();
     * </code></pre>
     */
    getViewContent: function(){
      return this.get('viewContent');
    },
    /**
     * 显示上一个
     */
    paintPrev: function(){
      var _self = this,
        imgNum = _self.get('imgNum');

      if (imgNum - 1 >= 0) {
        _self.set('imgNum', imgNum - 1);
      }
    },
    /**
     * 显示下一个
     */
    paintNext: function(){
      var _self = this,
        imgList = _self.get('imgList'),
        imgNum = _self.get('imgNum');

      if (imgNum + 1 < imgList.length) {
        _self.set('imgNum', imgNum + 1);
      }
    },
    /**
     * 充值viewcontent的装填
     */
    reset: function(){
      this.getViewContent().reset();
    },
    /**
     * 获得当前imgList的长度
     * @return {Number}
     */
    getLength: function(){
      return this.get('imgList').length;
    },
    /**
     * 获得当前选中图片的src
     * @return {Number}
     */
    getSrc: function(){
      return this.getViewContent().get('imgSrc');
    },
    // width修改触发的方法
    _uiSetWidth: function(width){
      width = width || this.get('width');
      var sidebarWidth = this.get('sidebarWidth');

      this.get('viewContent').set('width', width - sidebarWidth);
      this.get('toolBar').set('width', width - sidebarWidth);
    },
    // height修改触发的方法
    _uiSetHeight: function(height){
      height = height || this.get('height');
      this.get('viewContent').set('height', height - this.get('toolbarHeight'));
      this.get('previewList').set('height', height);
    },
    // toolbarHeight修改时触发的方法
    _uiSetToolbarHeight: function(toolbarHeight){
      this.get('toolBar').set('height', toolbarHeight);
      // 如果初始化toolbarHeight的时候触发setHeight，这样初始化会重置一次。
      // this._uiSetHeight();
    },
    // sidebarWidth修改时触发的方法
    _uiSetSidebarWidth: function(sidebarWidth){
      this.get('previewList').set('width', sidebarWidth);
      // this.get('toolBar').set('height', toolbarHeight);
      // this._uiSetWidth();
    },
    _uiSetImgNum: function(imgNum){
      // 控制右边条的切换，通过selectedchange触发图片的切换
      this.get('previewList').set('selected', imgNum);
    },
    _uiSetImgList: function(imgList){
      var _self = this,
        previewList = _self.get('previewList');

      // 防止第一次渲染的时候selected先执行了。
      previewList.set('items', imgList);
    },
    // 析构函数
    destructor: function(){

    }
  },{
    ATTRS: {
      imgList: {
        value: []
      },
      /**
       * 默认显示的当前图片
       * @type {Number}
       */
      imgNum: {
        value: 0
      },
      /**
       * 动作条的默认动作.
       * @type {Object}
       */
      commands: {
        value: [{
          cmd: 'fitToggle',
          text: '自动大小'
        },{
          cmd: 'resume',
          text: '实际大小'
        },{
          cmd: 'fit',
          text: '适合大小'
        },{
          cmd: 'leftHand',
          text: '左旋'
        },{
          cmd: 'rightHand',
          text: '右旋'
        },{
          cmd: 'zoom',
          text: '放大'
        },{
          cmd: 'micrify',
          text: '缩小'
        },{
          cmd: 'viewImg',
          content: '<a href="#" target="_blank">查看原图</a>'
        }]
      },
      /**
       * 右边滚动条的宽度
       * @type {Number}
       */
      sidebarWidth: {
        value: 100
      },
      /**
       * 底下toolbar的高度
       * @type {Number}
       */
      toolbarHeight: {
        value: 50
      },
      /**
       * viewContent的配置
       * @type {Object}
       */
      viewContent:{
        value: {
          rotateTime: 300, // 旋转速度
          scaleTime: 300, // 缩放时间
          zoomRate: 1.5, // 放大比率
          micrifyRate: 0.66, // 缩小比率
          overflowSize: 100 // 边界回弹数值
        }
      },
      elCls:{
        value: "ui-img-view-wrap"
      },
      /**
       * 图片变换后出发的事件
       * @type {Function}
       */
      selectedchange: {
        value: function(){

        }
      }
    }
  });

  BUI.mix(ImgView,{
    ViewContent: ViewContent,
    PreviewList: PreviewList
  })

  return ImgView;
});
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
/**
 * @fileOverview 图片预览
 * @ignore
 */
define('bui/imgview/viewcontent',['bui/common','bui/graphic'],function (r) {

  var BUI = r('bui/common'),
    Graphic = r('bui/graphic');

  // 获取图片居中信息
  function _getFixSize(w,h,w1,h1){
    var obj = {};

    if((w/h)>(w1/h1)){
      obj.height = w1/w*h;
      obj.width = w1;
    }else{
      obj.width = h1/h*w;
      obj.height = h1;
    }
    obj.x = (w1-obj.width)/2;
    obj.y = (h1-obj.height)/2;
    return obj;
  }


  /**
   * @class BUI.ImgView.ViewContent
   * 单纯的图片展示控件,兼容IE6,支持旋转、拖动、缩放
   * @extends BUI.Component.Controller
   */
  var ViewContent = BUI.Component.Controller.extend({
    initializer: function(){
      var _self = this,
        targetImg = new Image();

      _self.set('targetImg', targetImg);

      // 绑定paint事件，必须在paint之前绑定；
      targetImg.onload = function(){
        var imgWidth = targetImg.width,
          imgHeight = targetImg.height,
          width = _self.get('width'),
          height = _self.get('height');

        // 初始化一定是以fitSize的模式渲染，记录放大状态会比较麻烦。
        var fitSize = _getFixSize(imgWidth,imgHeight,width,height);
        _self.get('imgObj').attr(BUI.mix(fitSize, {
          src: targetImg.src,
          transform: "r0" // 旋转置0
        }));
        _self.set('isPaint', true); // 标记paint完成
        _self.set('imgWidth', imgWidth); // 记录图片宽度
        _self.set('imgHeight', imgHeight); // 记录图片高度
        _self.set('imgNowWidth', fitSize.width); // 记录图片缩放宽度
        _self.set('imgNowHeight', fitSize.height); // 记录图片缩放高度
        _self.set('angle', 0); // 旋转置0
        _self.set('imgSrc', targetImg.src); // 记录当前src
        _self.set('isFit', true) // 强制置为fit模式
      }
    },
    renderUI: function(){
      var _self = this,
        imgSrc = _self.get('imgSrc'),
        el = _self.get('el');

      // 建立canvas和图片对象
      var canvas = new Graphic.Canvas({render: el});
      var imgObj = canvas.addShape('image',{})
      _self.set('canvas', canvas);
      _self.set('imgObj', imgObj);
    },
    bindUI: function(){
      this._bindDrag();      //绑定拖动事件
    },
    /**
     * 清除图形
     */
    clear: function(){
      var _self = this,
        canvas = _self.get('canvas');
      canvas.destroy();
      _self.set('isPaint', false);
    },
    /**
     * 重置位置
     */
    reset: function(){
      // 旋转置0，缩放置0，fit置true。
      this.set('angle', 0);
      this.rotate(0, 0);
      this.scale('fit', 0);
    },
    /**
     * 左旋
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.leftHand(function(){
     *    //TODO
     *  })
     *  viewContent.leftHand("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    leftHand: function(easeing, callback){
      var _self = this,
        rotateTime = _self.get('rotateTime'),
        easeing = easeing || "<>";

      _self.rotate(-90, rotateTime, easeing, callback);
    },
    /**
     * 右旋
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.rightHand(function(){
     *    //TODO
     *  })
     *  viewContent.rightHand("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    rightHand: function(easeing, callback){
      var _self = this,
        rotateTime = _self.get('rotateTime'),
        easeing = easeing || "<>";

      _self.rotate(90, rotateTime, easeing, callback);
    },
    // 动态旋转方法
    rotate: function(rotateAngle, rotateTime, easeing, callback){
      var _self = this,
        isPaint = _self.get('isPaint'),
        angle = _self.get('angle'),
        imgObj = _self.get('imgObj'),
        easeing = easeing || "<>";

      if(isPaint){
        angle += rotateAngle;
        imgObj.attr({
          x: (_self.get('width') - _self.get('imgNowWidth'))/2,
          y: (_self.get('height') - _self.get('imgNowHeight'))/2
        }).stopAnimate().animate({transform: "r" + angle}, rotateTime, easeing, callback);
        _self.set('angle',angle);
      }
      _self.set('isFit',false);
    },
    /**
     * 放大
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.zoom(function(){
     *    //TODO
     *  })
     *  viewContent.zoom("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    zoom: function(easeing,callback){
      var _self = this,
        zoomRate = _self.get('zoomRate'),
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale(zoomRate,scaleTime,easeing,callback);
    },
    /**
     * 缩小
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.micrify(function(){
     *    //TODO
     *  })
     *  viewContent.micrify("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    micrify: function(easeing,callback){
      var _self = this,
        micrifyRate = _self.get('micrifyRate'),
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale(micrifyRate,scaleTime,easeing,callback);
    },
    /**
     * 原始大小
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.resume(function(){
     *    //TODO
     *  })
     *  viewContent.resume("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    resume: function(easeing,callback){
      var _self = this,
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale("resume",scaleTime,easeing,callback);
    },
    /**
     * 适合窗口大小
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.fit(function(){
     *    //TODO
     *  })
     *  viewContent.fit("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    fit: function(easeing,callback){
      var _self = this,
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale("fit",scaleTime,easeing,callback);
    },
    /**
     * 自动决定是fit还resume
     * <pre><code>
     *  viewContent.fitToggle()
     * </code></pre>
     */
    fitToggle: function(){
      var _self = this,
        isFit = _self.get('isFit');

      isFit?_self.resume():_self.fit();
    },
    // 缩放的统一方法。
    scale: function(rate,scaleTime,easeing,callback){
      var _self = this,
        imgObj = _self.get('imgObj'),
        width = _self.get('width'),
        height = _self.get('height'),
        imgWidth = _self.get('imgWidth'),
        imgHeight = _self.get('imgHeight'),
        imgNowWidth = _self.get('imgNowWidth'),
        imgNowHeight = _self.get('imgNowHeight'),
        isPaint = _self.get('isPaint'),
        angle = _self.get('angle');

      if(isPaint){
        var isFit = false;
        if(rate == "resume"){
          imgNowWidth = imgWidth;
          imgNowHeight = imgHeight;
        }else if(rate == "fit"){
          if(Math.abs(angle%180)==90){
            var fitSize = _getFixSize(imgHeight,imgWidth,width,height);
            imgNowWidth = fitSize.height;
            imgNowHeight = fitSize.width;
          }else{
            var fitSize = _getFixSize(imgWidth,imgHeight,width,height);
            imgNowWidth = fitSize.width;
            imgNowHeight = fitSize.height;
          }
          isFit = true;
        }else{
          imgNowWidth *= rate;
          imgNowHeight *= rate;
        }
        imgObj.stopAnimate().animate({
          x: (width-imgNowWidth)/2,
          y: (height-imgNowHeight)/2,
          width: imgNowWidth,
          height: imgNowHeight,
          transform: "r"+angle
        },scaleTime,easeing,callback);
        _self.set('imgNowWidth',imgNowWidth);
        _self.set('imgNowHeight',imgNowHeight);
        _self.set('isFit',isFit);
      }
    },
    /**
     * 获取当前图片的src
     * @return {String} 当前图片的src
     * <pre><code>
     *  var imgSrc = viewContent.getSrc()
     * </code></pre>
     */
    getSrc: function(){
      return this.get('imgSrc');
    },
    // 边界overflowSize回弹。
    _getOverflowSize: function(bbox,dragStartX,dragStartY,dx,dy,width,height,overflowSize){
      var _self = this;

      // 边界overflowSize回弹，默认100px。
      if(bbox.x + dx < overflowSize - bbox.width){
        dx = overflowSize - bbox.width - bbox.x;
      }else if(bbox.x + dx > width - overflowSize){
        dx = width - overflowSize - bbox.x;
      }
      if(bbox.y + dy < overflowSize - bbox.height){
        dy = overflowSize - bbox.height - bbox.y;
      }else if(bbox.y + dy > height - overflowSize){
        dy = height - overflowSize - bbox.y;
      }

      return {
        x: dragStartX+dx,
        y: dragStartY+dy
      };
    },
    // 拖动事件，包含旋转之后的拖动。
    _bindDrag: function(){
      var _self = this,
        imgObj = _self.get('imgObj'),
        width,height,
        imgNowWidth,imgNowHeight,
        dragStartX,dragStartY,
        overflowSize,bbox;

      imgObj.drag(function(dx,dy){
        if(_self.get('drag')){
          // move
          var dragEnd = _self._getOverflowSize(bbox,dragStartX,dragStartY,dx,dy,width,height,overflowSize);

          imgObj.attr(BUI.mix(dragEnd,{
            transform:imgObj.attr('transform') //在vml下，必须把transform之后的值重置回来，不然图片会丢失。
          }));
        }
      },function(){
        // start
        bbox = imgObj.getBBox();
        dragStartX = imgObj.attr("x");
        dragStartY = imgObj.attr("y");
        width = _self.get('width');
        height = _self.get('height');
        imgNowWidth = _self.get('imgNowWidth');
        imgNowHeight = _self.get('imgNowHeight');
        overflowSize = Math.min(imgNowWidth,imgNowHeight,_self.get('overflowSize'));
      })
    },
    /**
     * 决定是否可以拖动
     * <pre><code>
     *  viewContent.dragToggle()
     * </code></pre>
     */
    dragToggle: function(){
      if (this.get('drag')) {
        this.set('drag', false);
      } else {
        this.set('drag', true);
      }
    },
    // width修改触发的方法
    _uiSetWidth: function(width){
      // 把canvas的size同步修改掉。
      this.get('canvas').setSize(width, this.get('height') || 800);
      this.scale('fit', 0); // 第二个参数为0表示没有动画。
    },
    // height修改触发的方法
    _uiSetHeight: function(height){
      // 把canvas的size同步修改掉。
      this.get('canvas').setSize(this.get('width') || 600, height);
      this.scale('fit', 0); // 第二个参数为0表示没有动画。
    },
    // setImgSrc触发onload重绘方法。
    _uiSetImgSrc: function(imgSrc){
      this.get('targetImg').src = imgSrc;
      this.get('afterChanged')(imgSrc);
    },
    // setDrag决定是否可以拖放，顺便改变鼠标图标。
    _uiSetDrag: function(drag){
      if (drag) {
        this.get('imgObj').attr("cursor","move");
      } else {
        this.get('imgObj').attr("cursor","default");
      }
    },
    // 析构函数
    destructor: function(){
      this.clear();
    }
  },{
    ATTRS: {
      /**
       * 图片的url
       * @type {String}
       */
      imgSrc: {

      },
      /**
       * @private
       */
      isPaint: {
        value: false
      },
      /**
       * @private
       */
      angle: {
        value: 0
      },
      /**
       * 旋转速度
       * @type {Number}
       */
      rotateTime: {
        value: 300
      },
      /**
       * 放大缩小速度
       * @type {Number}
       */
      scaleTime: {
        value: 300
      },
      /**
       * 放大比率
       * @type {Number}
       */
      zoomRate: {
        value: 3/2
      },
      /**
       * 缩小比率
       * @type {Number}
       */
      micrifyRate: {
        value: 2/3
      },
      /**
       * drag边界回弹,超过多少像素无法拖动.
       * @type {Number}
       */
      overflowSize: {
        value: 100
      },
      elCls: {
        value: "ui-view-content"
      },
      /**
       * 是否可以拖动,默认为true
       * @type {Boolean}
       */
      drag: {
        value: true
      },
      /**
       * 图片变换后出发的事件
       * @type {Function}
       */
      afterChanged: {
        value: function(src){

        }
      }
    }
  })



  return ViewContent;
});
