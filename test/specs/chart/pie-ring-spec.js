
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
            distance : -20,
            label : {
              fill : '#fff',
              'font-weight': 'bold'
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
  
});

/**/


BUI.use(['bui/chart/chart','bui/graphic'],function (Chart,Graphic) {
  var colors = [ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'],
    categories = ['MSIE', 'Firefox', 'Chrome', 'Safari', 'Opera'],
    name = 'Browser brands',
    data = [{
            y: 55.11,
            color: colors[0],
            drilldown: {
                name: 'MSIE versions',
                categories: ['MSIE 6.0', 'MSIE 7.0', 'MSIE 8.0', 'MSIE 9.0'],
                data: [10.85, 7.35, 33.06, 2.81],
                color: colors[0]
            }
        }, {
            y: 21.63,
            color: colors[1],
            drilldown: {
                name: 'Firefox versions',
                categories: ['Firefox 2.0', 'Firefox 3.0', 'Firefox 3.5', 'Firefox 3.6', 'Firefox 4.0'],
                data: [0.20, 0.83, 1.58, 13.12, 5.43],
                color: colors[1]
            }
        }, {
            y: 11.94,
            color: colors[2],
            drilldown: {
                name: 'Chrome versions',
                categories: ['Chrome 5.0', 'Chrome 6.0', 'Chrome 7.0', 'Chrome 8.0', 'Chrome 9.0',
                    'Chrome 10.0', 'Chrome 11.0', 'Chrome 12.0'],
                data: [0.12, 0.19, 0.12, 0.36, 0.32, 9.91, 0.50, 0.22],
                color: colors[2]
            }
        }, {
            y: 7.15,
            color: colors[3],
            drilldown: {
                name: 'Safari versions',
                categories: ['Safari 5.0', 'Safari 4.0', 'Safari Win 5.0', 'Safari 4.1', 'Safari/Maxthon',
                    'Safari 3.1', 'Safari 4.1'],
                data: [4.55, 1.42, 0.23, 0.21, 0.20, 0.19, 0.14],
                color: colors[3]
            }
        }, {
            y: 2.14,
            color: colors[4],
            drilldown: {
                name: 'Opera versions',
                categories: ['Opera 9.x', 'Opera 10.x', 'Opera 11.x'],
                data: [ 0.12, 0.37, 1.65],
                color: colors[4]
            }
        }];


        // Build the data arrays
        var browserData = [];
        var versionsData = [];
        for (var i = 0; i < data.length; i++) {

            // add browser data
            browserData.push({
                name: categories[i],
                y: data[i].y,
                attrs : {
                  fill: data[i].color
                }
            });

            // add version data
            for (var j = 0; j < data[i].drilldown.data.length; j++) {
                var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
                versionsData.push({
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j],
                    attrs : {
                      fill: Graphic.Util.highlight(data[i].color,.3)
                    }
                });
            }
        }

    var chart = new Chart({
      width : 950,
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
            allowPointSelect : true //允许选中
            
          }
      },
      legend : null,
      series: [{
              name: 'Browsers',
              allowPointSelect : false,
              data: browserData,
              labels : {
                distance : -30,
                label : {
                  fill : '#fff'
                }
              },
              size: '60%'
            },
            {
              name: 'Versions',
              labels : {
                label : {

                },
                renderer : function(value,item){
                  return value + ' ' + (item.point.percent * 100).toFixed(2)  + '%'; 
                }
              },
              data: versionsData,
              size: '80%',
              innerSize: '60%'
            }
          
      ]
    });

    chart.render();
  
});