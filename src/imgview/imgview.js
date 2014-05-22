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
