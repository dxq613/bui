
BUI.use('bui/imgview',function (ImgView) {

  var viewContent = new ImgView.ViewContent({
    render: "#img-preview-wrap",
    autoRender: false, // 设置为true就自动渲染，默认为false！
    // 以下属性全部可以set来修改。
    width: $("#img-preview-wrap").width(),
    height: $("#img-preview-wrap").height(),
    imgSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg",
    rotateTime: 300, // 旋转时间,默认300
    scaleTime: 300, // 缩放时间,默认300
    overflowSize: 100, // 边界回弹像素,默认100,实际上是取Math.min(overflowSize,imgNowWidth,imgNowHeight)
    drag: true //是否可以拖动，默认为true
  });
  // autoRender如果为true就代表自动渲染。
  viewContent.render();




  // 点击事件
  $(".controls-wrap").on('click',function(e){
    var target = e.target;
    if($.contains(this,target)){
      var self = jQuery(target),
        cls = self.attr("class");

      if (cls == "viewImg") {
        // viewImg就是新窗口打开imgSrc
        self.attr({"href" : viewContent.get('imgSrc'),"target" : "_blank"});
        return true;
      } else if (cls == "drag1") {
        // 换src
        viewContent.set("drag", false);
      } else if (cls == "drag2") {
        // 换src
        viewContent.set("drag", true);
      } else if (cls == "chgImg1") {
        // 换src
        viewContent.set("imgSrc", "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg");
      } else if (cls == "chgImg2") {
        // 换src
        viewContent.set("imgSrc", "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg");
      } else if (cls == "resize1") {
        // 测试resize
        var width = 900,height = 600;
        $("#img-preview-wrap").width(width).height(height)
        // viewContent.resize({width : width,height : height});
        viewContent.set('width', width);
        viewContent.set('height', height);
      } else if (cls == "resize2") {
        // 测试resize
        var width = 450,height = 300;
        $("#img-preview-wrap").width(width).height(height)
        // viewContent.resize({width : width,height : height});
        viewContent.set('width', width);
        viewContent.set('height', height);
      }else{
        // 为了方便,直接根据className调用
        viewContent[cls]();
      }
      return false;
    }
  });

});
