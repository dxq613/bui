


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
  var group = chart.get('seriesGroup'),
    pie = group.getSeries()[0];
  describe('测试饼图',function(){
    it('生成饼图',function(){
      waits(1000);
      runs(function(){
        expect(pie).not.toBe(undefined);
        expect(pie.get('node')).not.toBe(undefined);
      });
      
    });
    it('生成label',function(){
      var labels = pie.get('labelsGroup');
      expect(labels.getCount()).toBe(pie.get('data').length);
    });

    it('点击选中饼图',function(){
      var first = pie.getItems()[0];
      first.fire('click',{target : first.get('node')});
      waits(500);
      runs(function(){
        expect(first.get('selected')).toBe(true);
      })

    });

    it('点击其他',function(){
      var first = pie.getItems()[0],
        second = pie.getItems()[1];
      second.fire('click',{
        target : second.get('node')
      });
       waits(500);
      runs(function(){
        expect(first.get('selected')).toBe(false);
        expect(second.get('selected')).toBe(true);
      });
    });

    it('点击取消',function(){
      var second = pie.getItems()[1];
      second.fire('click',{
        target : second.get('node')
      });
      waits(500);
      runs(function(){
        expect(second.get('selected')).toBe(false);
      });
    });
  });

  describe('测试触发的事件',function(){
    var items = pie.getItems(),
    
    unActiveFn = jasmine.createSpy();

    it('触发actived',function(){
      var first = items[0],
        callback = jasmine.createSpy();
      chart.on('seriesitemactived',callback);
      first.fire('mouseover',{target : first.get('node')});
      waits(500);
      runs(function(){
        expect(first.get('actived')).toBe(true);
        expect(callback).toHaveBeenCalled();

        chart.off('seriesitemactived',callback);
      });
      
    });
    it('触发unactived',function(){
      var first = items[0],
        second = items[1],
        callback = jasmine.createSpy();
      chart.on('seriesitemunactived',callback);
      second.fire('mouseover',{target : second.get('node')});

      waits(500);
      runs(function(){
        expect(first.get('actived')).toBe(false);
        expect(second.get('actived')).toBe(true);

        chart.off('seriesitemunactived',callback);
      });
    });

    it('触发click,触发选中',function(){
      var first = items[0],
        callback = jasmine.createSpy(),
        selCallback = jasmine.createSpy();
      chart.on('seriesitemclick',callback);
      chart.on('seriesitemselected',selCallback);
      first.fire('click',{target : first.get('node')});
      waits(500);
      runs(function(){
        expect(callback).toHaveBeenCalled();
         expect(selCallback).toHaveBeenCalled();
        chart.off('seriesitemclick',callback);
        chart.off('seriesitemselected',selCallback);
      });
    });

    it('触发取消选中',function(){
      var first = items[0],
        callback = jasmine.createSpy();
      chart.on('seriesitemunselected',callback);

      first.fire('click',{target : first.get('node')});
      waits(500);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        chart.off('seriesitemunselected',callback);
      });
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

