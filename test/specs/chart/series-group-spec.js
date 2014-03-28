BUI.use(['bui/graphic','bui/chart/seriesgroup','bui/chart/numberaxis','bui/chart/categoryaxis','bui/chart/plotrange'],
  function (Graphic,Group,NAxis,CAxis,PlotRange) {

  describe('测试折线分组',function(){

    var canvas = new Graphic.Canvas({
      render : '#s1',
      width : 900,
      height : 500
    });

    var plotRange = new PlotRange({x : 50,y : 400},{x : 850, y : 50});

    var group = canvas.addGroup(Group,{
      xAxis : {
        categories : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        labels : {
          label : {
            y : 12
          }
        }
      },
      yAxis : {
        line : null,
        tickLine : null,
        grid : {
          line : {
            stroke : '#c0c0c0'
          }
        },
        title : {
          text : 'xsxxxxx',
          font : '16px bold',
          fill : 'blue',
          rotate : 90,
          x : -30
        },
        position:'left',
        labels : {
          label : {
            x : -12
          }
        }
      },
      legend : {
        dy : 30
      },
      plotRange : plotRange,
      seriesOptions : {
        lineCfg : {
          duration : 1000,
          line : {
            'stroke-width': 2,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
          },
          lineActived : {
            'stroke-width': 3
          },
          //smooth:true,
          markers : {
            marker : {
              radius : 3
            },
            actived : {
              radius : 6,
              stroke: '#fff'
            }
          },
          animate : true
        }
        
      },
      tooltip : {
        valueSuffix : '°C',
        offset : 10,
        shared : true,
        crosshairs : true
      },
      series : [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, /**/{
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
  
    canvas.sort();
    describe('测试生成',function(){

      it('测试分组生成',function(){
        expect(group.get('el')).not.toBe(undefined);

        expect(group.get('node')).not.toBe(undefined);
      });
      it('测试序列生成',function(){
        waits(1000);
        runs(function(){
          expect(group.get('children').length).toBe(group.get('series').length);
        });
        
      });

      it('测试marker',function(){
        var item = group.getFirst();
        var markersGroup = item.get('markersGroup');
        expect(markersGroup).not.toBe(undefined);
        expect(markersGroup.getCount()).toBe(item.get('data').length);
      });
    }); 

    describe('坐标轴生成',function(){
      it('x轴生成',function(){

      });

      it('y轴生成',function(){

      });
    });

    function findByName(name){
      return group.findBy(function(item){
        return item.get('name') == name;
      });
    }

    describe('测试操作',function(){
      it('测试查找',function(){
        var series = findByName('Tokyo');
        expect(series).not.toBe(null);
        expect(series.get('color')).toBe(group.get('colors')[0]);
      });

      it('测试激活序列',function(){
        var series = findByName('Tokyo');
        group.setActivedItem(series);
        waits(100);
        runs(function(){
          expect(series.get('actived')).toBe(true);
          expect(group.getActived()).toBe(series);
        });
        
      });

      it('激活另一个',function(){
        var series1 = findByName('Tokyo'),
          series2 = findByName('Berlin');

        expect(series1.get('actived')).toBe(true);
        expect(series2.get('actived')).not.toBe(true);

        group.setActivedItem(series2);

        waits(300);
        runs(function(){
          expect(series1.get('actived')).toBe(false);
          expect(series2.get('actived')).toBe(true);
          expect(group.getActived()).toBe(series2);
        });

      });

      it('清除激活',function(){
        group.clearActivedItem();
        expect(group.getActived()).toBe(null);
      });
    });

    describe('测试事件',function(){

      it('测试鼠标移动到序列',function(){

      });

      it('测试鼠标移动到另一个序列',function(){

      });

      it('测试鼠标移出序列',function(){

      });

      it('测试鼠标在坐标系内移动',function(){

      });

      it('测试鼠标移动到坐标系外',function(){

      });

      it('测试鼠标移动到坐标系内',function(){

      });

    });

    describe('测试图例',function(){
      var legendGroup = group.get('legendGroup').get('itemsGroup');

      it('测试图例生成',function(){
        expect(legendGroup).not.toBe(undefined);
        expect(legendGroup.getCount()).toBe(group.getCount());
      });

      it('测试图例位置',function(){

      });

      it('测试图例线,marker',function(){
        var item = legendGroup.getFirst();
        expect(item.get('shape')).not.toBe(undefined);
        expect(item.get('shape').get('type')).toBe('line');

        expect(item.get('marker')).not.toBe(undefined);
        expect(item.get('marker').attr('symbol')).toBe('circle');

        
      });

      it('测试图例，文本',function(){
        var item = legendGroup.getLast();
        expect(item.get('label').attr('text')).toBe(group.getLast().get('name'));
      });

      it('测试图例Hover',function(){

      });

      it('取消选中',function(){

      });

      it('选中',function(){

      });

    });

    describe('更改坐标轴',function(){
      var yAxis = group.get('yAxis');
      var interval = yAxis.get('tickInterval'),
        labelsGroup = yAxis.get('labelsGroup'),
        count = labelsGroup.getCount();

      it('隐藏序列,重置坐标轴',function(){
        group.hideSeries(group.getChildAt(0));
        group.hideSeries(group.getChildAt(1));
        waits(500);
        runs(function(){
          expect(interval).toBe(yAxis.get('tickInterval'));
          expect(count).not.toBe(labelsGroup.getCount());
        });
        
      });
      it('显示图例,重置坐标轴',function(){
        group.showSeries(group.getChildAt(0));
        group.showSeries(group.getChildAt(1));
        waits(500);
        runs(function(){
          expect(interval).toBe(yAxis.get('tickInterval'));
          expect(count).toBe(labelsGroup.getCount());
        });
      });
    });
    /**/
  });

  describe('测试多纵坐标分组',function(){

  });

  describe('测试柱状图分组',function(){

  });

  describe('测试混合分组',function(){

  });


});