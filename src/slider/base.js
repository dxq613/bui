define('bui/slider',['bui/slider/slider'],function (require) {
  var Slider = BUI.namespace('Slider');

  BUI.mix(Slider,{
    Slider : require('bui/slider/slider')
  });

  return Slider;
});