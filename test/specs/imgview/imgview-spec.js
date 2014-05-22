
BUI.use(['bui/imgview'],function (ImgView) {

  var imgList = [{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_04.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_05.jpg"
  }]

  var imgList2 = [{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg"
  }]

  var imgView = new ImgView.ImgView({
    render: "#img-preview-wrap",
    width: $(window).width(),
    height: $(window).height() - 50,
    imgList: imgList,
    imgNum: 2, // 默认取第几张图片，默认为0，取第一张
    autoRender: false // 是否自动渲染,默认为false
  });
  // autoRender如果为true就代表自动渲染。
  imgView.render();


  jQuery(window).resize(function(){
    imgView.set('width', jQuery(window).width());
    imgView.set('height', jQuery(window).height() - 50);
  })


  // 点击事件
  $(".controls-wrap").on('click',function(e){
    e.preventDefault();
    var target = e.target;
    if($.contains(this,target)){
      var self = jQuery(target),
        cls = self.attr("class");

      if (cls == "chgList1") {
        imgView.set('imgList', imgList);
      } else if (cls == "chgList2") {
        imgView.set('imgList', imgList2);
      }
    }
  })



});
