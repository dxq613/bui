
BUI.use(['bui/graphic','bui/chart/pie'],function (Graphic,Pie) {

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
  

  // var pie = canvas.addGroup(Pie,{
  //   cx : 150,
  //   cy : 150,
  //   r : 120,
  //   colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970','#f28f43', '#77a1e5', '#c42525', '#a6c96a']
  //   ,data : [
  //     ['Firefox',   45.0],
  //     ['IE',     26.8],
  //     // ['Chrome', 12.8],
  //     {
  //       name: 'Chrome',
  //       y: 12.8,
  //       sliced: true,
  //       selected: true
  //     },
  //     ['Safari',  8.5],
  //     ['Opera',   6.2],
  //     ['Others',   0.7]
  //   ]
  // });

  var pie = canvas.addGroup(Pie,{
    cx : 200,
    cy : 200,
    r : 150,
    data : [
      ['1',   1],
      ['2',     1],
      ['3',  1],
      ['4',  1],
      ['5',   1],
      ['6',   1],
      ['7',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['6',   1],
      ['7',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['6',   1],
      ['7',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['8',   1],
      ['9',   1],
      ['10',   1],
      ['11',   1],
      ['11',   1],
      ['11',   1],
      ['11',   1],
      ['11',   1],
      ['11',   1],
      ['11',   12],
    ]
  });

  //fill="rgb(72,151,241)"
  //fill="rgb(47,126,216)"

  // var s = pie.showDatas();
  // console.log(s);



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