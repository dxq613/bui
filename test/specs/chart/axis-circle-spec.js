/**/
BUI.use(['bui/graphic','bui/chart/circleaxis','bui/chart/plotrange','bui/chart/radiusaxis',],function (Graphic,Axis,PlotRange,RAxis) {

  var canvas = new Graphic.Canvas({
    render : '#s2',
    width : 500,
    height : 500
  });

  var plotRange = new PlotRange({x : 20,y : 20}, {x : 460, y : 460});
  var xAxis = canvas.addGroup(Axis,{
      plotRange : plotRange,
      line : {
          'stroke-width' : 1,
          'stroke' : '#C0D0E0'
      },
      tickLine : {
          'stroke-width' : 1,
          value : 5,
          'stroke' : '#C0D0E0'
      },
      tickInterval : 60,
      labels : {
        label : {
          
        }
      },
      grid : {
        line : {
          'stroke-width' : 1,
          'stroke' : '#C0D0E0'
        }
      }
    });
  var yAxis = canvas.addGroup(RAxis,{
      plotRange : plotRange,
      line : {
          'stroke-width' : 1,
          'stroke' : '#aaa'
      },
     
      min : 0,
      max : 100,
      circle : xAxis,
      tickInterval : 20,
      grid : {
        line : {
          'stroke-width' : 1,
          'stroke' : '#C0D0E0'
        },
         type : 'circle'
      },
      labels : {
        label : {
          x : -12
        }
      }
    });

  describe('测试中轴坐标系',function(){

    it('测试坐标轴生成',function(){
      expect(xAxis.get('node')).not.toBe(undefined);
      
    });
    it('测试半径,圆心',function(){
      var center = xAxis.getCenter();
      expect(center.x).toBe(240);
      expect(center.y).toBe(240);

      var r = xAxis.getRadius();
      expect(r).toBe(200);
    });
    it('测试线',function(){
      var lineShape = xAxis.get('lineShape');
      expect(lineShape).not.toBe(undefined);
      expect(lineShape.getPath().length).not.toBe(0);
    });
    it('测试ticks',function(){
      var ticks = xAxis.get('ticks');
      expect(ticks.length).toBe(6);

      var tickShape = xAxis.get('tickShape');
      expect(tickShape).not.toBe(undefined);
      expect(tickShape.getPath().length).toBe(6*2);
    });

    it('测试lables',function(){
      var labelsGroup = xAxis.get('labelsGroup');
      expect(labelsGroup).not.toBe(null);
      expect(labelsGroup.getCount()).toBe(6);
    });

    it('测试栅格',function(){
      var gridGroup = xAxis.get('gridGroup');
      expect(gridGroup).not.toBe(undefined);
      expect(gridGroup.getCount()).toBe(1);
    });

    it('根据角度获取值坐标点，圆上',function(){
      var point = xAxis.getCirclePoint(0);
      expect(point.x).toBe(240);
      expect(point.y).toBe(40);

      var point1 = xAxis.getCirclePoint(180);
      expect(parseInt(point1.x)).toBe(240);
      expect(parseInt(point1.y)).toBe(440);
    });
    it('根据角度获取值坐标点，圆外，圆内',function(){

    });

    it('根据点获取角度',function(){
      var point = {x : 240,y : 40},
        angle = xAxis.getCircleAngle(point.x,point.y);
      expect(angle).toBe(0);

      point = {x : 40,y : 240};
      angle = xAxis.getCircleAngle(point.x,point.y);
      expect(angle).toBe(270);
    });

  });

  describe('测试半径坐标轴',function(){

    it('测试坐标轴生成',function(){
       expect(yAxis.get('node')).not.toBe(undefined);
    });

    it('测试栅格',function(){
      var gridGroup = yAxis.get('gridGroup');
      expect(gridGroup).not.toBe(undefined);
      expect(gridGroup.getCount()).toBe(1);
    });
  });


});


BUI.use(['bui/graphic','bui/chart/circleaxis','bui/chart/plotrange','bui/chart/radiusaxis',],function (Graphic,Axis,PlotRange,RAxis) {

  var canvas = new Graphic.Canvas({
    render : '#s1',
    width : 500,
    height : 500
  });

  var plotRange = new PlotRange({x : 20,y : 20}, {x : 460, y : 460});
  var xAxis = canvas.addGroup(Axis,{
      plotRange : plotRange,
      ticks : ['一月','二月','三','四月','五月','六月'],
      labels : {
        label : {
          
        }
      },
      grid : {
        line : {
          'stroke-width' : 1,
          'stroke' : '#C0D0E0'
        }
      }
    });
  var yAxis = canvas.addGroup(RAxis,{
      plotRange : plotRange,
      line : {
          'stroke-width' : 1,
          'stroke' : '#aaa'
      },
     
      min : 0,
      max : 100,
      circle : xAxis,
      tickInterval : 20,
      grid : {
        line : {
          'stroke-width' : 1,
          'stroke' : '#C0D0E0'
        },
         type : 'polygon'
      },
      labels : {
        label : {
          x : -12
        }
      }
    });

  describe('测试中轴坐标系',function(){

    it('测试坐标轴生成',function(){
      expect(xAxis.get('node')).not.toBe(undefined);
      
    });
    it('测试半径,圆心',function(){
      var center = xAxis.getCenter();
      expect(center.x).toBe(240);
      expect(center.y).toBe(240);

      var r = xAxis.getRadius();
      expect(r).toBe(200);
    });
    

    it('测试lables',function(){
      var labelsGroup = xAxis.get('labelsGroup');
      expect(labelsGroup).not.toBe(null);
      expect(labelsGroup.getCount()).toBe(6);
    });

    it('测试栅格',function(){
      var gridGroup = xAxis.get('gridGroup');
      expect(gridGroup).not.toBe(undefined);
      expect(gridGroup.getCount()).toBe(1);
    });

    it('根据角度获取值坐标点，圆上',function(){
      var point = xAxis.getCirclePoint(0);
      expect(point.x).toBe(240);
      expect(point.y).toBe(40);

      var point1 = xAxis.getCirclePoint(180);
      expect(parseInt(point1.x)).toBe(240);
      expect(parseInt(point1.y)).toBe(440);
    });
    it('根据角度获取值坐标点，圆外，圆内',function(){

    });

    it('根据点获取角度',function(){
      var point = {x : 240,y : 40},
        angle = xAxis.getCircleAngle(point.x,point.y);
      expect(angle).toBe(0);

      point = {x : 40,y : 240};
      angle = xAxis.getCircleAngle(point.x,point.y);
      expect(angle).toBe(270);
    });

  });

  describe('测试半径坐标轴',function(){

    it('测试坐标轴生成',function(){
       expect(yAxis.get('node')).not.toBe(undefined);
    });

    it('测试栅格',function(){
      var gridGroup = yAxis.get('gridGroup');
      expect(gridGroup).not.toBe(undefined);
      expect(gridGroup.getCount()).toBe(1);
    });
  });

});