/**/
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
      type : 'circle',
      tickInterval : 45
    },
    yAxis : {
      title : null,
      type : 'radius',
      grid : {
        type : 'circle'
      },
      labels : {
        label : {
          x : -12
        }
      },
      min : 0
    },  
    tooltip : {
      shared : true
    },
    seriesOptions : {
      
    },
    series: [
      {
          type: 'column',
          name: 'Column',
          data: [8, 7, 6, 5, 4, 3, 2, 1],
          pointPlacement: 'between'
      },
      {
          type: 'line',
          name: 'Line',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      }, {
          type: 'area',
          name: 'Area',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      }
      ]
  });

  chart.render();
  var group = chart.get('seriesGroup');
 describe('测试雷达图',function(){
    it('测试生成',function(){
      var series = group.getSeries();
      expect(series.length).toBe(3);
    });
  });

});


BUI.use(['bui/chart/chart'],function (Chart) {
  var chart = new Chart({
    width : 500,
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
      type : 'circle',
      tickInterval : 45
    },
    yAxis : {
      title : null,
      type : 'radius',
      grid : {
        type : 'polygon'
      },
      labels : {
        label : {
          x : -12
        }
      },
      min : 0
    },  
    tooltip : {
      shared : false
    },
    seriesOptions : {
      
    },
    series: [
      {
          type: 'column',
          name: 'Column',
          data: [8, 7, 6, 5, 4, 3, 2, 1]
      },
      {
          type: 'column',
          name: 'column2',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      }, {
          type: 'column',
          name: 'column3',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      }
      ]
  });

  chart.render();
  
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
      type : 'circle',
      tickInterval : 45
    },
    yAxis : {
      title : null,
      type : 'radius',
      grid : {
        type : 'polygon'
      },
      labels : {
        label : {
          x : -12
        }
      },
      min : 0
    },  
    tooltip : {
      shared : false
    },
    seriesOptions : {
      columnCfg : {
        stackType : 'normal'
      }
    },
    series: [
      {
          
          name: 'Column',
          data: [8, 7, 6, 5, 4, 3, 2, 1]
      },
      {
          
          name: 'column2',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      }, {
          
          name: 'column3',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      }
      ]
  });

  chart.render();
  
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
      type : 'circle',
      tickInterval : 45
    },
    yAxis : {
      title : null,
      type : 'radius',
      grid : {
        type : 'polygon'
      },
      labels : {
        label : {
          x : -12
        }
      },
      min : 0
    },  
    tooltip : {
      shared : false
    },
    seriesOptions : {
      columnCfg : {
        stackType : 'percent'
      }
    },
    series: [
      {
          
          name: 'Column',
          data: [8, 7, 6, 5, 4, 3, 2, 1]
      },
      {
          
          name: 'column2',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      }, {
          
          name: 'column3',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      }
      ]
  });

  chart.render();
  
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
      type : 'circle',
      tickInterval : 45
    },
    yAxis : {
      title : null,
      type : 'radius',
      grid : {
        type : 'polygon'
      },
      labels : {
        label : {
          x : -12
        }
      },
      min : 0
    },  
    tooltip : {
      shared : false
    },
    seriesOptions : {
      areaCfg : {
        stackType : 'normal',
        animate : false
      }
    },
    series: [
      {
          
          name: 'column3',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      },{
          
          name: 'Column',
          data: [8, 7, 6, 5, 4, 3, 2, 1]
      }, 
      {
          
          name: 'column2',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      }
      ]
  });

  chart.render();
  
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
      type : 'circle',
      tickInterval : 45
    },
    yAxis : {
      title : null,
      type : 'radius',
      grid : {
        type : 'polygon'
      },
      labels : {
        label : {
          x : -12
        }
      },
      min : 0
    },  
    tooltip : {
      shared : false
    },
    seriesOptions : {
      areaCfg : {
        stackType : 'percent',
        animate : false
      }
    },
    series: [
      {
          
          name: 'column3',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      },{
          
          name: 'Column',
          data: [8, 7, 6, 5, 4, 3, 2, 1]
      }, 
      {
          
          name: 'column2',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      }
      ]
  });

  chart.render();
  
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
      type : 'circle',
      tickInterval : 45
    },
    yAxis : {
      title : null,
      type : 'radius',
      grid : {
        type : 'polygon'
      },
      labels : {
        label : {
          x : -12
        }
      },
      min : 0
    },  
    tooltip : {
      shared : false
    },
    seriesOptions : {
     
    },
    series: [
      {
          
          name: 'column',
          type : 'column',
          data: [8, 7, 6, 5, 4, 3, 2, 1]
      }, 
      {
          type : 'line',
          name: 'column2',
          data: [1, 2, 3, 4, 5, 6, 7, 8]
      },{ 
          type : 'area',
          name: 'column3',
          data: [1, 8, 2, 7, 3, 6, 4, 5]
      }
      ]
  });

  chart.render();
  
});
