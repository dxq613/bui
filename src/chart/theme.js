/**
 * @fileOverview 图表的皮肤
 * @ignore
 */

define('bui/chart/theme',function (requrie) {

  var BUI = requrie('bui/common');

  /**
   * BUI.Chart.Theme
   * @param {Object} cfg  样式的配置项
   * @param {Object} base 扩展的样式
   */
  var Theme = function(cfg,base){

    Theme.initTheme(cfg,base);
    return cfg;
  };

  Theme.initTheme = function(cfg,base){
    BUI.mix(true,cfg,base);
  };

  var lineCfg = {
        duration : 1000,
        line : {
          'stroke-width': 2,
          'stroke-linejoin': 'round',
          'stroke-linecap': 'round'
        },
        lineActived : {
          'stroke-width': 3
        },
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
      };
  Theme.Base = Theme({
    colors : [ '#5e90c9','#1c2d3f','#a9d052','#a12d2d','#43bbb4','#5a2a94','#fabe3c','#2279dc','#e360e5','#48000c'],
    //['#2f7ed8','#0d233a','#8bbc21','#910000','#1aadce','#492970','#f28f43','#77a1e5','#c42525','#a6c96a'],
    symbols : ['circle','diamond','square','triangle','triangle-down'],
    plotCfg : {
      margin : [50,50,100]
    },
    title : {
      'font-size' : '16px',
      'font-family' : 'SimSun,Georgia, Times, serif',
      'fill' : '#274b6d'
    },
    subTitle : {
      'font-size' : 14,
      'font-family' : 'tahoma,arial,SimSun,Georgia, Times, serif',
      'fill' : '#4d759e'
    },
    xAxis : {
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
        text : '',
        rotate : -90,
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
    seriesOptions : {
      lineCfg : lineCfg,
      areaCfg : lineCfg,
      bubbleCfg : {
        circle : {
            'stroke-width' : 1,
            'fill-opacity' : .5
        },
        activeCircle : {
            'stroke-width' : 2
        }
      },
      pieCfg : {
        colors : [ '#5e90c9','#1c2d3f','#a9d052','#a12d2d','#43bbb4','#5a2a94','#fabe3c','#2279dc','#e360e5','#48000c'],
        //['#2f7ed8','#0d233a','#8bbc21','#910000','#1aadce','#492970','#f28f43','#77a1e5','#c42525','#a6c96a'],
        //[ '#ff6600','#b01111','#ac5724','#572d8a','#333333','#7bab12','#c25e5e','#a6c96a','#133960','#2586e7'],
        item : {
          stroke : '#fff'
        },
        labels : {
          distance : 30,
          label : {

          }
         }
      }
      
    },
    tooltip : {
      offset : 10
    }

  },{

  });


  return Theme;
});