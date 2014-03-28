
BUI.use(['bui/chart/chart'],function (Chart) {
  var chart = new Chart({
    width : 1000,
    height : 500,
    plotCfg : {
      margin : [50,50,100]
      
    },
    title : {
      text : 'Monthly Average Temperature',
      'font-size' : '16px'
    },
    subTitle : {
      text : 'Source: WorldClimate.com'
    },
    xAxis : {
        tickOffset : 20
    },
    yAxis : {
      title : {
        text : 'xxxxx'
      },
      min : -10
    },  
    tooltip : {
      shared : true
    },
    seriesOptions : {
        bubbleCfg : {
          
        }
    },
    series: [{
            name : 'bubble1',
            data: [[97,36,79],[94,74,60],[68,76,58],[64,87,56],[68,27,73],[74,99,42],[7,93,87],[51,69,40],[38,23,33],[57,86,31]]
        }, {
            name : 'bubble2',
            data: [[25,10,87],[2,75,59],[11,54,8],[86,55,93],[5,3,58],[90,63,44],[91,33,17],[97,3,56],[15,67,48],[54,25,81]]
        }, {
            name : 'bubble3',
            data: [[47,47,21],[20,12,4],[6,76,91],[38,30,60],[57,98,64],[61,17,80],[83,60,13],[67,78,75],[64,12,10],[30,77,82]]
        }]
  });

  chart.render();
  var group = chart.get('seriesGroup');
  describe('测试气泡图',function(){
    it('测试生成',function(){
      var series = group.getSeries();
      expect(series.length).toBe(3);
     
    });
  });
});

BUI.use(['bui/chart/chart'],function (Chart) {
  var chart = new Chart({
    width : 1000,
    height : 500,
    plotCfg : {
      margin : [50,50,100]
      
    },
    title : {
      text : 'Monthly Average Temperature',
      'font-size' : '16px'
    },
    subTitle : {
      text : 'Source: WorldClimate.com'
    },
    xAxis : {
        tickOffset : 20
    },
    yAxis : {
      title : {
        text : 'xxxxx'
      },
      min : -10
    },  
    tooltip : {
      shared : true
    },
    seriesOptions : {
        bubbleCfg : {
          
        }
    },
    series: [{
            name : 'bubble1',
            data: [[9, 81, 63],
                [98, 5, 89],
                [51, 50, 73],
                [41, 22, 14],
                [58, 24, 20],
                [78, 37, 34],
                [55, 56, 53],
                [18, 45, 70],
                [42, 44, 28],
                [3, 52, 59],
                [31, 18, 97],
                [79, 91, 63],
                [93, 23, 23],
                [44, 83, 22]],
            circle : {
                fill : 'r(0.4, 0.3)rgba(255,255,255,0.5)-rgba(69,114,167,0.5)'
            }
        }, {
            name : 'bubble2',
            data: [ [42, 38, 20],
                [6, 18, 1],
                [1, 93, 55],
                [57, 2, 90],
                [80, 76, 22],
                [11, 74, 96],
                [88, 56, 10],
                [30, 47, 49],
                [57, 62, 98],
                [4, 16, 16],
                [46, 10, 11],
                [22, 87, 89],
                [57, 91, 82],
                [45, 15, 98]],
            circle : {
                fill : 'r(0.4, 0.3)rgba(255,255,255,0.5)-rgba(170,70,67,0.5)'
            }
        }]
  });

  chart.render();
  var group = chart.get('seriesGroup');
  describe('测试气泡图',function(){
    it('测试生成',function(){
      var series = group.getSeries();
      expect(series.length).toBe(2);
     
    });
  });
});
