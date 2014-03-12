


BUI.use(['bui/chart/chart'],function (Chart) {
  var chart = new Chart({
    width : 1000,
    height : 500,
    plotCfg : {
      margin : [50,50,100]
      
    },
    title : {
      text : '饼图'
    },
   
    tooltip : {
      shared : true,
      pointRenderer : function(point){
        return (point.percent * 100).toFixed(2)+ '%';
      }
    },
    seriesOptions : {
        pieCfg : {
          allowPointSelect : true,
          labels : {
            distance : 40,
            label : {

            },
            renderer : function(value,item){
                
                return value + ' ' + (item.point.percent * 100).toFixed(2)  + '%'; 
            }
          }
        }
    },
    legend : null,
    series: [{
        type: 'pie',
        name: 'Browser share',
        data: [
          ['Firefox',   45.0],
          ['IE',       26.8],
          {
              name: 'Chrome',
              y: 12.8,
              sliced: true,
              selected: true
          },
          ['Safari',    8.5],
          ['Opera',     6.2],
          ['Others',   0.7]
        ]
    }]
  });

  chart.render();
  var group = chart.get('seriesGroup');
  describe('测试饼图',function(){
    
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
      text : '饼图'
    },
   
    tooltip : {
      shared : true,
      pointRenderer : function(point){
        return (point.percent * 100).toFixed(2)+ '%';
      }
    },
    seriesOptions : {
        pieCfg : {
          allowPointSelect : true,
          labels : {
            distance : 40,
            label : {

            },
            renderer : function(value,item){
                
                return value + ' ' + (item.point.percent * 100).toFixed(2)  + '%'; 
            }
          }
        }
    },
    legend : null,
    series: [{
        type: 'pie',
        name: 'Browser share',
        data: [
            ['Firefox',   45.0],
            ['test',1],
            ['test',1],
            ['test',1],
            ['test',1],
            ['IE',       26.8],
            {
                name: 'Chrome',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Safari',    8.5],
            ['test',1],
            ['test',1],
            ['test',1],
            ['test',1],
            ['Opera',     6.2],
            ['test',1],
            ['test',1],
            ['test',1],
            ['test',1],
            ['Others',   0.7]
        ]
    }]
  });

  chart.render();
  var group = chart.get('seriesGroup');
  describe('测试饼图',function(){
    
  });
});


BUI.use(['bui/chart/chart'],function (Chart) {
  var chart = new Chart({
    width : 1000,
    height : 500,
    plotCfg : {
      margin : [50,50,100]
      
    },
   
    tooltip : {
      shared : true
    },
    seriesOptions : {
        pieCfg : {
          
        }
    },
    legend : null,
    series: [{
        type: 'pie',
        name: 'Browser share',
        innerSize : '60%',
        data: [
            ['Firefox',   45.0],
            ['IE',       26.8],
            {
                name: 'Chrome',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Safari',    8.5],
            ['Opera',     6.2],
            ['Others',   0.7]
        ]
    }]
  });

  chart.render();
  var group = chart.get('seriesGroup');
  describe('测试饼图',function(){
    
  });
});

BUI.use(['bui/chart/chart'],function (Chart) {
  var chart = new Chart({
    render : '#s1',
    width : 1000,
    height : 500,
    plotCfg : {
      margin : [50,50,100]
      
    },
  
    tooltip : {
      shared : true
    },
    seriesOptions : {
        pieCfg : {
          labels : {
            distance : 40,
            label : {

            },
            renderer : function(value,item){
                
                return value + ' ' + (item.point.percent * 100).toFixed(2) + '%'; 
              }
          }
        }
    },
    legend : null,
    series: [{
        type: 'pie',
        name: 'Browser share',
        startAngle : -180,
        endAngle : 0,
        data:[['Firefox',   44.2],
                ['IE7',       26.6],
                ['IE6',       20],
                ['Chrome',    3.1],
                ['Other',    5.4]
                ]
    }]
  });

  chart.render();
  var group = chart.get('seriesGroup');
  describe('测试饼图',function(){
    
  });
});
/**/

