BUI.use(['bui/chart/chart','bui/data'],function (Chart,Data) {

  var store = new Data.Store({
    url : '../data/radar.json'
  });
  var chart = new Chart({
    width : 1000,
    height : 500,
    plotCfg : {
      margin : [50,50,100]
      
    },
    store : store,
    fields : ['intelli','force','political','commander','reputation'],
    title : {
      text : '三国志人物',
      'font-size' : '16px'
    },
    xAxis : {
      type : 'circle',
      ticks : ['智力','武力','政治','统帅','声望']
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
          type: 'line',
          name: '张三'
          
      },
      {
          type: 'line',
          name: '李四'
         
      }, {
          type: 'line',
          name: '王五'
          
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
    it('测试加载数据',function(){
      store.load();
      waits(1000);
      runs(function(){
        expect(group.getCount()).toBe(chart.get('data').length);
      })
    });
  });

  describe('测试更新数据',function(){
    it('更新数据',function(){
      var first = store.getResult()[0];
      first.intelli = 30;
      first.force = 63;
      store.update(first);
    });
  });

});