BUI.use(['bui/graphic','bui/chart/seriesgroup','bui/chart/numberaxis','bui/chart/categoryaxis','bui/chart/plotrange'],
  function (Graphic,Group,NAxis,CAxis,PlotRange) {

  var canvas = new Graphic.Canvas({
      render : '#s2',
      width : 900,
      height : 500
    });

    var plotRange = new PlotRange({x : 50,y : 400},{x : 850, y : 50});

    var group = canvas.addGroup(Group,{
      xAxis : {
        //min : 0,
        //tickInterval : 200,
        type : 'time',
        formatter : function(value){
          var date = new Date(value);
          return  BUI.Date.format(date,'yyyy.mm.dd');
        },
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
          pointStart : new Date('2010/01/01').getTime(),
          pointInterval : 2 * 24 * 3600 * 1000, //2天
          line : {
            'stroke-width': 2,
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round'
          },
          lineActived : {
            'stroke-width': 3
          },
          smooth:true,
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
        offset : 10
      },
      series : [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'London',
            data: [['2010/01/01',3.9], ['2010/01/02',4.2], ['2010/01/05',5.7], ['2010/01/10',8.5], 
            ['2010/01/12',11.9], ['2010/01/18',15.2], ['2010/01/22',17.0], ['2010/01/23',16.6], ['2010/01/28',14.2]]
        }]
    });
  
    canvas.sort();

  describe('测试折线分组',function(){

    it('测试折线生成',function(){
      expect(group.getCount()).toBe(2);
    });

    it('测试声明x轴值的值生成',function(){
      var xAxis = group.getChildAt(0).get('xAxis');
      expect(xAxis).not.toBe(undefined);
    });

    it('自动计算y轴',function(){
      var yAxis = group.getChildAt(0).get('yAxis');
      expect(yAxis).not.toBe(undefined);
      
    });

  });

});