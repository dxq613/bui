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
          pointStart : 20,
          pointInterval : 100,
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
        },{
            name: 'New York',
            pointInterval : 25,
            markers : {

              single : true
            },
            data: [4.3, 5.1, 4.3, 5.2, 5.4, 4.7, 3.5, 4.1, 5.6, 7.4, 6.9, 7.1,
              7.9, 7.9, 7.5, 6.7, 7.7, 7.7, 7.4, 7.0, 7.1, 5.8, 5.9, 7.4,
              8.2, 8.5, 9.4, 8.1, 10.9, 10.4, 10.9, 12.4, 12.1, 9.5, 7.5,
              7.1, 7.5, 8.1, 6.8, 3.4, 2.1, 1.9, 2.8, 2.9, 1.3, 4.4, 4.2,
              3.0, 3.0]
        }, {
            name: 'London',
            data: [[100,3.9], [250,4.2], [300,5.7], [400,8.5], [520,11.9], [600,15.2], [900,17.0], [1050,16.6], [1100,14.2]]
        }]
    });
  
    canvas.sort();

  describe('测试折线分组',function(){

    it('测试折线生成',function(){
      
    });

    it('测试声明x轴值的值生成',function(){

    });

    it('测试x轴的生成',function(){
        
    });

    it('自动计算y轴',function(){

    });

  });

});