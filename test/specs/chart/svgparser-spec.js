BUI.use('bui/chart/shape/svgparser',function (Parser) {
  var parser = new Parser(),
    container = $('#s1');

  describe('创建图形',function(){
    it('测试parser',function(){
      expect(new Parser()).toBe(parser);
      expect(new Parser()).toBe(new Parser());
    });
    it('创建圆',function(){
       /* var start = performance.now();
      for (var i = 1000 - 1; i >= 0; i--) {
        var n = Math.random(),
          m = Math.random();
        parser.create('circle',{cx:(n * 1000),cy:(m * 1000),r:20,stroke:'red',strokeWidth:2},container);
         //parser.create('rect',{x:(n * 1000),y:(m * 1000),width:"10",height:10},container);
         //parser.create('line',{x1:0,y1:0,x2:(n * 1000),y2:(m * 1000),stroke:'red','stroke-width':1},container);
      };
      var end = performance.now();
      console.log(end-start);
    */
      var n = Math.random(),
          m = Math.random();
      var circle = parser.create('circle',{id:'c1',cx:(n * 100),cy:(m * 100),r:20,stroke:'red',strokeWidth:2},container);
      expect(circle.attr('stroke')).toBe('red');
      expect(circle.attr('stroke-Width')).toBe('2');
    });
    it('创建方块',function(){
      var rect = parser.create('rect',{id:'r1',x:'40',y:'40',width:'30',height:'30'},container);
      expect(rect.attr('x')).toBe('40');
      expect(rect.attr('width')).toBe('30');
      expect(rect.attr('fill')).toBe(undefined);
    });
  });

  describe('操作图形',function(){
    it('更改圆操作',function(){
      var c = $('#c1');
      parser.setAttr(c1,'strokeWidth','3');
      expect(c.attr('stroke-width')).toBe('3');
    });
  });

  describe('渐变图形',function(){

  });

  describe('过滤',function(){

  });


});