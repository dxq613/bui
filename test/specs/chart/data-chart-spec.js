
BUI.use(['bui/chart/chart'],function (Chart) {
  
  var chart = new Chart({
    width : 1000,
    height : 500,
    plotCfg : {
      margin : [50,50,50]
      
    },
    title : {
      text : 'Monthly Average Temperature'
    },
    subTitle : {
      text : 'Source: WorldClimate.com'
    },
    xAxis : {
      type : 'category'
    },
    tooltip : {
      valueSuffix : '°C',
      shared : true,
      crosshairs : true
    },
    data : [
            {"month":"0","tokyo":7,"newYork":-0.2,"berlin":-0.9,"london":3.9},
            {"month":"1","tokyo":6.9,"newYork":0.8,"berlin":0.6,"london":4.2},
            {"month":"2","tokyo":9.5,"newYork":5.7,"berlin":3.5,"london":5.7},
            {"month":"3","tokyo":14.5,"newYork":11.3,"berlin":8.4,"london":8.5},
            {"month":"4","tokyo":18.2,"newYork":17,"berlin":13.5,"london":11.9},
            {"month":"5","tokyo":21.5,"newYork":22,"berlin":17,"london":15.2},
            {"month":"6","tokyo":25.2,"newYork":24.8,"berlin":18.6,"london":17},
            {"month":"7","tokyo":26.5,"newYork":24.1,"berlin":17.9,"london":16.6},
            {"month":"8","tokyo":23.3,"newYork":20.1,"berlin":14.3,"london":14.2},
            {"month":"9","tokyo":18.3,"newYork":14.1,"berlin":9,"london":10.3},
            {"month":"10","tokyo":13.9,"newYork":8.6,"berlin":3.9,"london":6.6},
            {"month":"11","tokyo":9.6,"newYork":2.5,"berlin":1,"london":4.8}
          ],
    legend : {
      align : 'right',
      layout : 'vertical',
      dy : -150,
      dx : -60
    },
    seriesOptions: {
      lineCfg : {
        animate : false,
        xField : 'month'
      }
    },
    series : [{
          name: 'Tokyo',
          yField : 'tokyo'
      }, {
          name: 'New York',
          yField : 'newYork'
      }, {
          name: 'Berlin',
          yField : 'berlin'
      }, {
          name: 'London',
          yField : 'london'
      }]
  });

  chart.render();

  var series = chart.getSeries(),
    xAxis = series[0].get('xAxis'),
    data = chart.get('data');


  describe('测试图形的数据支持',function(){
    it('测试数据序列的生成',function(){
      expect(chart.get('el')).not.toBe(null);
      expect(series.length).toBe(4);
     
    });

    it('测试坐标轴的生成',function(){
      expect(xAxis.get('ticks').length).toBe(13);
    });

    it('测试markers',function(){
      expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
    });

  });

  describe('修改数据',function(){

    it('添加记录',function(){
      var obj = {"month":"12","tokyo":3.5,"newYork":4.2,"berlin":2,"london":6};
      data.push(obj);
      chart.changeData(data);
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(14);
        expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
      });
      

    });
    it('删除记录',function(){
      data.pop();
      chart.changeData(data);
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(13);
        expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
      });
      

    });

    it('更改数据源',function(){
       var newdata = [
            {"month":"0","tokyo":7,"newYork":-0.2,"berlin":-0.9,"london":3.9},
            {"month":"11","tokyo":9.6,"newYork":2.5,"berlin":1,"london":4.8}
        ];
      chart.changeData(newdata);
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(3);
        expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
        chart.changeData(data);
      });
    });

  });
});


BUI.use(['bui/chart/chart','bui/data'],function (Chart,Data) {
  
  var store = new Data.Store({
    url : '../data/chart.json'
  });

  var chart = new Chart({
    width : 1000,
    height : 500,
    store : store,
    plotCfg : {
      margin : [50,50,50]
      
    },
    title : {
      text : 'Monthly Average Temperature'
    },
    subTitle : {
      text : 'Source: WorldClimate.com'
    },
    xAxis : {
      type : 'category'
    },
    tooltip : {
      valueSuffix : '°C',
      shared : true,
      crosshairs : true
    },
    legend : {
      align : 'right',
      layout : 'vertical',
      dy : -150,
      dx : -60
    },
    seriesOptions: {
      lineCfg : {
        animate : false,
        xField : 'month'
      }
    },
    series : [{
          name: 'Tokyo',
          yField : 'tokyo'
      }, {
          name: 'New York',
          yField : 'newYork'
      }, {
          name: 'Berlin',
          yField : 'berlin'
      }, {
          name: 'London',
          yField : 'london'
      }]
  });

  chart.render();

  var series = chart.getSeries(),
    xAxis = series[0].get('xAxis');


  describe('测试图形的数据支持',function(){
    it('测试数据序列的生成',function(){
      expect(chart.get('el')).not.toBe(null);
      expect(series.length).toBe(4);
     
    });

    it('加载数据',function(){
      store.load();
      waits(500);
      runs(function(){
        expect(chart.get('data').length).toBe(store.getResult().length);
      });
    });

    it('测试坐标轴的生成',function(){
      expect(xAxis.get('ticks').length).toBe(13);
    });

    it('测试markers',function(){
      expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
    });

  });

  describe('修改数据',function(){

    it('添加记录',function(){
      var obj = {"month":"12","tokyo":3.5,"newYork":4.2,"berlin":2,"london":6};
      store.add(obj);
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(14);
        expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
      });
      

    });
    it('删除记录',function(){
      var obj = store.getResult()[store.getCount() - 1];
      store.remove(obj);
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(13);
        expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
      });
      

    });
    
    it('更新数据',function(){
      var obj = store.getResult()[0];
      obj.newYork = 6;
      obj.berlin = 9;

      store.update(obj);
    });
    it('更改数据源',function(){
      var data = store.getResult();
       var newdata = [
            {"month":"0","tokyo":7,"newYork":-0.2,"berlin":-0.9,"london":3.9},
            {"month":"11","tokyo":9.6,"newYork":2.5,"berlin":1,"london":4.8}
        ];
      store.setResult(newdata);
      store.fire('load');
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(3);
        expect(series[0].get('markersGroup').getCount()).toBe(chart.get('data').length);
        store.setResult(data);
        store.fire('load');
      });
    });
  });

});
/**/
BUI.use(['bui/chart/chart','bui/data'],function (Chart,Data) {
  
  var store = new Data.Store({
    url : '../data/chart.json'
  });

  var chart = new Chart({
    width : 1000,
    height : 500,
    store : store,
    plotCfg : {
      margin : [50,50,50]
      
    },
    title : {
      text : 'Monthly Average Temperature'
    },
    subTitle : {
      text : 'Source: WorldClimate.com'
    },
    xAxis : {
      type : 'category'
    },
    tooltip : {
      valueSuffix : '°C',
      shared : true,
      crosshairs : true
    },
    legend : {
      align : 'right',
      layout : 'vertical',
      dy : -150,
      dx : -60
    },
    seriesOptions: {
      columnCfg : {
        xField : 'month'
      }
    },
    series : [{
          name: 'Tokyo',
          yField : 'tokyo'
      }, {
          name: 'New York',
          yField : 'newYork'
      }, {
          name: 'Berlin',
          yField : 'berlin'
      }, {
          name: 'London',
          yField : 'london'
      }]
  });

  chart.render();

  var series = chart.getSeries(),
    xAxis = series[0].get('xAxis');


  describe('测试图形的数据支持',function(){
    it('测试数据序列的生成',function(){
      expect(chart.get('el')).not.toBe(null);
      expect(series.length).toBe(4);
     
    });

    it('加载数据',function(){
      store.load();
      waits(1500);
      runs(function(){
        expect(chart.get('data').length).toBe(store.getResult().length);
      });
    });

    it('测试坐标轴的生成',function(){
      expect(xAxis.get('ticks').length).toBe(13);
    });

    it('测试items',function(){
      expect(series[0].getItems().length).toBe(chart.get('data').length);
    });

  });

  describe('修改数据',function(){

    it('添加记录',function(){
      var obj = {"month":"12","tokyo":3.5,"newYork":4.2,"berlin":2,"london":6};
      store.add(obj);
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(14);
        expect(series[0].getItems().length).toBe(chart.get('data').length);
      });
      

    });
    it('删除记录',function(){
      var obj = store.getResult()[store.getCount() - 1];
      store.remove(obj);
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(13);
        expect(series[0].getItems().length).toBe(chart.get('data').length);

      });
      

    });
    
    it('更新数据',function(){
      var obj = store.getResult()[0];
      obj.newYork = 6;
      obj.berlin = 9;

      store.update(obj);
    });
    it('更改数据源',function(){
      var data = store.getResult();
       var newdata = [
            {"month":"0","tokyo":7,"newYork":-0.2,"berlin":-0.9,"london":3.9},
            {"month":"11","tokyo":9.6,"newYork":2.5,"berlin":1,"london":4.8}
        ];
      store.setResult(newdata);
      store.fire('load');
      waits(500);
      runs(function(){
        expect(xAxis.get('ticks').length).toBe(3);
        expect(series[0].getItems().length).toBe(chart.get('data').length);

        store.setResult(data);
        store.fire('load');
      });
    });
  });

});



BUI.use(['bui/chart/chart','bui/data'],function (Chart,Data) {

  var store = new Data.Store({
    url : '../data/pie.json'
  });

  var chart = new Chart({
    width : 1000,
    height : 500,
    store : store,
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
        name: 'Browser share'
    }]
  });

  chart.render();
  var series = chart.getSeries();

  describe('测试pie的生成',function(){
    it('测试生成',function(){
      expect(chart.get('el')).not.toBe(null);
      expect(series.length).toBe(1);
    });

    it('测试加载',function(){
      store.load();
      waits(2000);
      runs(function(){
        expect(series[0].getItems().length).toBe(chart.get('data').length);
      });
    });
     
  });

  describe('测试数据更改',function(){

    it('添加一项',function(){
      store.add({name : 'add',y : 1});
      waits(500);
      runs(function(){
        expect(series[0].getItems().length).toBe(chart.get('data').length);
      });
    });

   it('删除一项',function(){
      var item = store.findByIndex(store.getCount() - 1);
      store.remove(item);
      waits(1000);
      runs(function(){
        expect(series[0].getItems().length).toBe(chart.get('data').length);
      });
    });

   it('更新数据',function(){
    var item = store.getResult()[0];
    item.y = 20;
    store.update(item);

    waits(1000);
    runs(function(){
        expect(series[0].getItems().length).toBe(chart.get('data').length);
    });
   });

    it('数据源替换',function(){
      var data = chart.get('data'),
        newData = [['a',40],['b',60]];
      store.setResult(newData);
      store.fire('load');

      waits(1000);
      runs(function(){
        expect(series[0].getItems().length).toBe(chart.get('data').length);
        store.setResult(data);
        store.fire('load');
      });
    });

  });
});
/**/
