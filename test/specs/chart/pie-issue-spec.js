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
          ['Firefox',   0.1],
          ['IE',       1],
          ['Chrome',   0],
          
          ['Safari',    0],
          ['Opera',     0],
          ['Others',   0]
        ]
    }]
  });

  chart.render();

});