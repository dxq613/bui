
BUI.use(['bui/imgview'],function (Imgview) {

  var items = [{
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

  var items2 = [{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_02.jpg"
  },{
    src: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg",
    miniSrc: "https://s.tbcdn.cn/g/fi/act/c/2014/3/jwy/images/Hdy_03.jpg"
  }]

  var previewList = new Imgview.PreviewList({
    render: "#preview-list-wrap",
    items: items,
    height: jQuery(window).height() - 100,
    alignType : "height",
    selected: 2
  })

  previewList.render();

  var previewList2 = new Imgview.PreviewList({
    render: "#preview-list-wrap2",
    items: items,
    width: jQuery(window).width(),
    alignType : "width",
    selected: 2
  })

  previewList2.render();

  jQuery(window).resize(function(){
    previewList.set('height',jQuery(window).height() - 100)
    previewList2.set('width',jQuery(window).width())
  })






  // 点击事件
  $(".controls-wrap").on('click',function(e){
    var target = e.target;
    if($.contains(this,target)){
      var self = jQuery(target),
        cls = self.attr("class");

      if (cls == "chgList1") {
        previewList.set('items', items);
        previewList2.set('items', items);
      } else if (cls == "chgList2") {
        previewList.set('items', items2);
        previewList2.set('items', items2);
      }
    }
  })

});
