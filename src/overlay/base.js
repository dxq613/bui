/**
 * @fileOverview Overlay 模块的入口
 * @ignore
 */

define('bui/overlay',['bui/common','bui/overlay/overlay','bui/overlay/dialog','bui/overlay/message','bui/overlay/picker'],function (require) {
  var BUI = require('bui/common'),
    Overlay = BUI.namespace('Overlay');

  BUI.mix(Overlay,{
    Overlay : require('bui/overlay/overlay'),
    Dialog : require('bui/overlay/dialog'),
    Message : require('bui/overlay/message'),
    Picker : require('bui/overlay/picker')
  });

  BUI.mix(Overlay,{
    OverlayView : Overlay.Overlay.View,
    DialogView : Overlay.Dialog.View
  });

  BUI.Message = BUI.Overlay.Message;
  return Overlay;

});