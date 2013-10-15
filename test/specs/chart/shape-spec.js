BUI.use('bui/chart/shape/base',function (Shape) {
  describe('创建图形',function(){
    var  container = $('#s1');
    it('创建圆',function(){
      var start = performance.now();
      for (var i = 1000 - 1; i >= 0; i--) {
        var n = Math.random(),
          m = Math.random();
        new Shape({
          render : container,
          type : 'circle',
          attrs : {
            cx:(n * 1000),
            cy:(m * 1000),
            r:20,stroke:'red',
            strokeWidth:2
          }
        });
        //parser.create('circle',{cx:(n * 1000),cy:(m * 1000),r:20,stroke:'red',strokeWidth:2},container);
         //parser.create('rect',{x:(n * 1000),y:(m * 1000),width:"10",height:10},container);
         //parser.create('line',{x1:0,y1:0,x2:(n * 1000),y2:(m * 1000),stroke:'red','stroke-width':1},container);
      };
      var end = performance.now();
      console.log(end-start);
    /**/
   });
  });

});