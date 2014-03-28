BUI.use(['bui/graphic','bui/chart/timeaxis'],function (Graphic,Axis) {

  var canvas = new Graphic.Canvas({
    render : '#s3',
    width : 500,
    height : 500
  });

  function isDateUnit(date,arr){
    var rst = true;
    BUI.each(arr,function(m){
      if(date[m]() != 0){
        rst = false;
        return false;
      }
    });
    return rst;
  }

  var axis = canvas.addGroup(Axis,{
      plotRange : {
        start : {x : 20,y : 480},
        end : {x : 480, y : 20}
      },
      startDate : '2012-01-01 00:00:00',
      endDate : '2012-01-02 00:00:00',
      tickInterval : 1000 * 60 * 60 * 6, //5天
       labels : {
        label : {
          y : 12
        }
      },
      formatter : function(value){
        var date = new Date(value);

        if(isDateUnit(date,['getHours','getMinutes','getSeconds'])){
          return  BUI.Date.format(date,'yy.mm.dd');
        }else{
          return BUI.Date.format(date,'HH:MM')
        }
        
      }
  });

  describe('测试坐标轴生成',function(){


  });

});