
BUI.use(['bui/graphic','bui/chart/baseaxis'],function (Graphic,Axis) {

  var Util = Graphic.Util,
    UA = BUI.UA;

  var canvas = new Graphic.Canvas({
    render : '#s1',
    width : 500,
    height : 500
  });

  function isIe7(){
    return UA.ie && UA.ie < 8;
  }

  
  describe("测试饼图生成",function(){
    
    it("test生成情况",function(){
      expect(true).toBe(true);
    })
  })

});