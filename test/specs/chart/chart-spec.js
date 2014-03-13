
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
      categories : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
      
    },
    yAxis : {
      title : {
        text : 'xxxxx'
      }
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
    series : [{
          name: 'Tokyo',
          markers : {
                  marker : {
                    radius : 6,
                    symbol : 'url(http://mat1.gtimg.com/www/images/qq2012/weather/20120906/sun.png)'
                  },
                  actived : {
                    radius : 10
                  }
          },
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
      }, {
          name: 'New York',
          data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
      }, {
          name: 'Berlin',
          data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
      }, {
          name: 'London',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
      }]
  });

  chart.render();

  describe('测试图形的基础内容',function(){
    it('测试控件生成',function(){
      expect(chart.get('el')).not.toBe(null);
    });

    it('测试plotRange',function(){
      var plotRange = chart.get('plotRange');
      expect(plotRange).not.toBe(undefined);
      expect(plotRange.getWidth()).toBe(chart.get('width') - 100);
    });

    it('测试边框',function(){

    });

    it('测试背景',function(){

    });

  });

  describe('测试图形数据',function(){

  });
});


BUI.use(['bui/chart/chart'],function (Chart) {

  var chart = new Chart({
          width : 950,
          height : 500,
          plotCfg : {
            margin : [50,50,80] //画板的边距
          },
          title : {
            text : '非均匀坐标轴'
          },
          subTitle : {
            text : 'Source: WorldClimate.com'
          },
          yAxis : [{
            position : 'left',
            
            title : {
              text : '金额',
              x : -40,
              rotate : -90
            },
            ticks : [0,20,500,5000,5100]
          },{
            type : 'number',
            position : 'right',
            line : null,
            tickLine : null,
            labels : {
              label : {
                x : 12
              }
            },
            title : {
              text : '右边',
              x : 40,
              rotate : 90
            },
            ticks : [0,5,10,15,20]
          }],
          seriesOptions : { //设置多个序列共同的属性
            lineCfg : { //不同类型的图对应不同的共用属性，lineCfg,areaCfg,columnCfg等，type + Cfg 标示
              smooth : true,
              pointStart : 20,
              pointInterval : 100
            }
          },
          tooltip : {
            valueSuffix : '￥'
          },
          series : [{
            name: 'Tokyo',
            data: [10,412,5020,5034,5023,5078,5008,5025,4997,420,18,40]
          }, {
              name: 'London',
              yAxis : 1, //使用第二个坐标轴，索引为1
              data: [[100,3.9], [250,4.2], [300,5.7], [400,8.5], [520,11.9], [600,15.2], [900,17.0], [1050,16.6], [1100,14.2]]
          }]
              
  });

  chart.render();

});
/*
*/