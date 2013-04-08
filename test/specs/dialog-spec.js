
BUI.use('bui/overlay/dialog',function (Dialog) {
  
  var CLS_TITLE = 'header-title';

  var config = {
      width:500,
      height:300,
      title:'第一个弹出库',
      contentId : 'd1',
      success:function(){
        this.hide();
      }
    },
    dialog = new Dialog(config);

  dialog.render();

  var dialogEl = dialog.get('el');

  $('#btnShow').on('click',function(){
    dialog.show();
  });

  $('#btnShow1').on('click',function(){
    dialog.set('title','');
    dialog.show();
  });
  describe('测试Dialog生成',function(){
    it('测试Dialog生成',function(){
      expect(dialogEl.length).not.toBe(0);
    });

    it('测试标题',function(){
      expect(dialogEl.find('.'+CLS_TITLE).text()).toBe(config.title);
    })
    
  });
});