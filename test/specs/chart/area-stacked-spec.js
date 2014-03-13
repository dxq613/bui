
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
     
    },
    yAxis : {
      title : {
        text : 'xxxxx'
      }
    },  
    tooltip : {
      shared : true,
      crosshairs : true
    },
    seriesOptions : {
        areaCfg : {
            pointStart: 1940,
            pointInterval: 1,
            stackType : 'normal'
        }
    },
    series: [ {
            name: 'Africa',
            data: [106, 107, 111, 133, 221, 767, 1766]
        }, {
            name: 'Europe',
            data: [163, 203, 276, 408, 547, 729, 628]
        }, {
            name: 'America',
            data: [18, 31, 54, 156, 339, 818, 1201]
        }, {
            name: 'Oceania',
            data: [2, 2, 2, 6, 13, 30, 46]
        },{
            name: 'Asia',
            data: [502, 635, 809, 947, 1402, 3634, 5268]
        }]
  });

  chart.render();
  var seriesGroup = chart.get('seriesGroup');


  describe('测试图形的基础内容',function(){

    it('生成series',function(){
        var series = seriesGroup.getFirst();
        expect(series).not.toBe(undefined);
        expect(series.get('areaShape')).not.toBe(undefined);

    });

    it('测试area',function(){
      var series = seriesGroup.getSeries()[0];
      var  areaShape = series.get('areaShape'),
        lieShape = series.get('lineShape');
      expect(areaShape.getPath().length).toBe(lieShape.getPath().length + 3);
    });

    it('测试第二个area',function(){
      waits(500);
      runs(function(){
        var series = seriesGroup.getSeries()[1];
        var  areaShape = series.get('areaShape'),
          lieShape = series.get('lineShape');
        expect(areaShape.getPath().length).toBe(lieShape.getPath().length * 2 + 1);
      });
      
    });

    it('隐藏第一个，测试第二个area',function(){
      waits(1000);
      runs(function(){
        var series = seriesGroup.getSeries()[0];
        seriesGroup.hideSeries(series);

        var series = seriesGroup.getSeries()[1];
        var  areaShape = series.get('areaShape'),
          lieShape = series.get('lineShape');
        expect(areaShape.getPath().length).toBe(lieShape.getPath().length + 3);
      });
      
    });

  });
});
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
     
    },
    yAxis : {
      title : {
        text : 'xxxxx'
      }
    },  
    tooltip : {
      shared : true,
      crosshairs : true
    },
    seriesOptions : {
        areaCfg : {
            pointStart: 1940,
            pointInterval: 1,
            stackType : 'percent'
        }
    },
    series: [ {
            name: 'Africa',
            data: [106, 107, 111, 133, 221, 767, 1766]
        }, {
            name: 'Europe',
            data: [163, 203, 276, 408, 547, 729, 628]
        }, {
            name: 'America',
            data: [18, 31, 54, 156, 339, 818, 1201]
        }, {
            name: 'Oceania',
            data: [2, 2, 2, 6, 13, 30, 46]
        },{
            name: 'Asia',
            data: [502, 635, 809, 947, 1402, 3634, 5268]
        }]
  });

  chart.render();
  var seriesGroup = chart.get('seriesGroup');


  describe('测试图形的基础内容',function(){

    it('生成series',function(){
        var series = seriesGroup.getFirst();
        expect(series).not.toBe(undefined);
        expect(series.get('areaShape')).not.toBe(undefined);

    });

    it('测试area',function(){
      var series = seriesGroup.getSeries()[0];
      var  areaShape = series.get('areaShape'),
        lieShape = series.get('lineShape');
      expect(areaShape.getPath().length).toBe(lieShape.getPath().length + 3);
    });

    it('测试第二个area',function(){
      waits(1000);
      runs(function(){
        var series = seriesGroup.getSeries()[1];
        var  areaShape = series.get('areaShape'),
          lieShape = series.get('lineShape');
        expect(areaShape.getPath().length).toBe(lieShape.getPath().length * 2 + 1);
      });
      
    });

    it('隐藏第一个，测试第二个area',function(){
      waits(1000);
      runs(function(){
        var series = seriesGroup.getSeries()[0];
        seriesGroup.hideSeries(series);

        var series = seriesGroup.getSeries()[1];
        var  areaShape = series.get('areaShape'),
          lieShape = series.get('lineShape');
        expect(areaShape.getPath().length).toBe(lieShape.getPath().length + 3);
      });
      
    });

  });
});
