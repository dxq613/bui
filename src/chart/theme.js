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
    colors : ['#2f7ed8','#0d233a','#8bbc21','#910000','#1aadce','#492970','#f28f43','#77a1e5','#c42525','#a6c96a'],
    symbols : ['circle','diamond','square','triangle','triangle-down'],
    plotCfg : {
      margin : 50
    },
    title : {
      'font-size' : '16px',
      'font-family' : 'tahoma,arial,"SimSun",Georgia, "Times New Roman", Times, serif',
      'fill' : '#274b6d'
    },
    subTitle : {
      'font-size' : '14px',
      'font-family' : 'tahoma,arial,"SimSun",Georgia, "Times New Roman", Times, serif',
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
        font : '16px bold',
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
        colors : ['#2f7ed8','#0d233a','#8bbc21','#910000','#1aadce','#492970','#f28f43','#77a1e5','#c42525','#a6c96a'],
        item : {
          stroke : '#fff'
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