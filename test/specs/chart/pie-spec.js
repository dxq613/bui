
BUI.use(['bui/graphic','bui/chart/pie','bui/chart/baseaxis'],function (Graphic,Pie,Axis) {

  var Util = Graphic.Util,
    UA = BUI.UA;

  var canvas = new Graphic.Canvas({
    render : '#s1',
    width : 500,
    height : 500
  });

  function isIe7(){
    return UA.ie && UA.ie < 8;
  }

  var paper = canvas.get("el");

  

  var pie = canvas.addGroup(Pie,{
    data:[
      ['Firefox',   45.0],
      ['IE',     26.8],
      ['Chrome', 12.8],
      // {
      //   name: 'Chrome',
      //   y: 12.8,
      //   sliced: true,
      //   selected: true
      // },
      ['Safari',  8.5],
      ['Opera',   6.2],
      ['Others',   0.7]
    ]
  });

  var s = pie.showDatas();
  console.log(s);



  // var axis = canvas.addGroup(Axis,{
  //   start : {x : 10,y : 250},
  //   end : {x : 490, y : 250},
  //   position : 'bottom',
  //   ticks : [0,1,2,3,4,5,6,7,8,9],
  //   tickOffset : 10,
  //   title : {
  //     text : 'x 轴坐标',
  //     'font-size' : 18,
  //     y : 30
  //   },
  //   labels : {
  //     label : {
  //       y : 10
  //     }
  //   }
  // });

  // var line = canvas.addShape('line',{
  //   x1 : 0,
  //   y1 : 0,
  //   x2 : 122,
  //   y2 : 122
  // });
  


  describe("测试饼图生成",function(){


    it("test生成情况",function(){
      expect(true).toBe(true);
    })
  })

});