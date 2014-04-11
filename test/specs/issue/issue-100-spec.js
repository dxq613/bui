
BUI.use('bui/overlay',function (Overlay) {
  
  var dialog = new Overlay.Dialog({
    title : '标题',
    tpl : '<div class="back"><div class="inner"></div></div>',
    childContainer  : '.inner',
    bodyContent : '自定义新嘻嘻嘻嘻嘻'
  });

  dialog.show();

  describe('issue100,测试dialog生成',function(){
    it('生成',function(){
      var back = dialog.get('el').find('.back');
      expect(back.length).not.toBe(0);
      expect(dialog.get('body').parent('.inner').length).not.toBe(0);
      dialog.close();
    });
  });
});