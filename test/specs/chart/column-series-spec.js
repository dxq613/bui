
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
      categories: [
                'Tokyo',
                'Jakarta',
                'New York',
                'Seoul',
                'Manila',
                'Mumbai',
                'Sao Paulo',
                'Mexico City',
                'Dehli',
                'Osaka',
                'Cairo',
                'Kolkata',
                'Los Angeles',
                'Shanghai',
                'Moscow',
                'Beijing',
                'Buenos Aires',
                'Guangzhou',
                'Shenzhen',
                'Istanbul'
            ],
      labels : {
        label : {
          rotate : -45,
          'text-anchor' : 'end'
        }
      }
    },
    yAxis : {
      title : {
        text : 'xxxxx'
      },
      min : 0
    },  
    tooltip : {
      shared : true
    },
    seriesOptions : {
        columnCfg : {
            
        }
    },
    series: [ {
            name: 'Africa',
            data: [34.4, 21.8, {y : 20.1,attrs : {fill : '#ff0000'}}, 20, 19.6, 19.5, 19.1, 18.4, 18,
                17.3, 16.8, 15, 14.7, 14.5, 13.3, 12.8, 12.4, 11.8,
                11.7, 11.2],
            allowPointSelect : true,
            labels : {
              label : {
                rotate : -90,
                y : 10,
                'fill' : '#fff',
                'text-anchor' : 'end',
                textShadow: '0 0 3px black',
                'font-size' : '14px'
              }
            }
            
        }]
  });

  chart.render();
  var  group = chart.get('seriesGroup'),
    series = group.getSeries()[0];

  describe('测试生成',function(){
    it('测试生成项个数',function(){
      expect(series).not.toBe(undefined);
      expect(series.getItems().length).toBe(series.get('data').length);
    });
    it('测试生成项的宽度',function(){
      
      expect(series.get('columnWidth')).toBe(group.get('xAxis').getTickAvgLength()/2);
    });
    it('测试生成的label',function(){
      expect(series.get('labelsGroup')).not.toBe(undefined);
      expect(series.get('labelsGroup').getCount()).toBe(series.getItems().length);
    });
    it('测试个性化项',function(){
      var item = series.getItems()[2];
      expect(item.get('point').yValue).toBe(20.1);
      expect(item.attr('fill')).toBe('#ff0000');
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
      categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ]
    },
    yAxis : {
      title : {
        text : 'xxxxx'
      },
      min : 0
    },  
    tooltip : {
      shared : true
    },
    seriesOptions : {
        columnCfg : {
            
        }
    },
    series: [ {
            name: 'Tokyo',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

        }, {
            name: 'New York',
            data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

        }, {
            name: 'London',
            data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

        }, {
            name: 'Berlin',
            data: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1]

        }]
  });

  chart.render();
  var group = chart.get('seriesGroup');
  describe('测试柱状图宽度',function(){
    it('起始宽度',function(){
      var first = group.getSeries()[0];
      expect(first.get('columnWidth')).toBe(9.375);
    });

    it('隐藏一个',function(){
       var first = group.getSeries()[0],
        second = group.getSeries()[1],
        preWidth = second.get('columnWidth');
      group.hideSeries(first);
      waits(500);
      runs(function(){
         expect(second.get('columnWidth') ).not.toBe(preWidth);
         group.showSeries(first);
      });
     
    });
  });
});

/*
*/