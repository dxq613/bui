
BUI.use('bui/mask',function () {

  var Mask = BUI.Mask,
    el = $('#t1');
  var loadMask =new Mask.LoadMask({el:el,msg:'加载数据'});
  
  $('#btnShow').on('click',function(){
    loadMask.show();
  });
  $('#btnHide').on('click',function(){
   loadMask.hide();
  });

  describe('屏蔽元素',function(){
    it('屏蔽元素',function(){
      Mask.maskElement(el);
      expect(el.find('.bui-ext-mask').length).not.toBe(0);
    });

    it('解除屏蔽元素',function(){
      Mask.unmaskElement(el);
      expect(el.find('.bui-ext-mask').length).toBe(0);
    });

  });

  describe('加载数据，屏蔽元素',function(){

    
    it('加载数据',function(){
      loadMask.show();
      expect(el.find('.bui-ext-mask').length).not.toBe(0);
    });

    it('解除屏蔽元素',function(){
      loadMask.hide();
      expect(el.find('.bui-ext-mask').length).toBe(0);
    });
  });

});