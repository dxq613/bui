/*BUI.use('bui/graphic',function (Graphic) {
  var canvas = new Graphic.Canvas({
    render : '#s1',
    width : 1000,
    height : 1000
  });

  Perform.start('shape');

  for (var i = 0; i < 1000; i++) {
    var x = Math.random() * 1000,
      y = Math.random() * 1000;
    canvas.addShape('text',{
      x : x,
      y : y,
      text : i
    });

  };

  Perform.end('shape');
  Perform.log('shape')
});
*/

BUI.use('bui/graphic',function (Graphic) {
  var canvas = new Graphic.Canvas({
    render : '#s1',
    width : 1000,
    height : 1000
  });
  var i = 0,
  shape;

  setInterval(function(){
    shape && shape.remove();
    shape = canvas.addShape('text',{
      x : 100,
      y : 100,
      text : i++
    });

  },500)

});