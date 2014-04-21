/**
 * @fileOverview imgview 命名空间入口
 * @ignore
 */
;(function(){
var BASE = 'bui/imgview';
define(BASE, ['bui/common',BASE + '/imgview',BASE + '/viewcontent',BASE + '/previewlist'],function (r) {
  var BUI = r('bui/common'),
    ImgView = BUI.namespace('ImgView');

  BUI.mix(ImgView,{
    ImgView: r(BASE + '/imgview'),
    ViewContent: r(BASE + '/viewcontent'),
    PreviewList: r(BASE + '/previewlist')
  });
  return ImgView;
});
})();
