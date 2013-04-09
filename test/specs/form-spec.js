
BUI.use('bui/form/tips',function (Tips) {
  
  var TipItem = Tips.Item;

  describe('批量添加提示',function(){
    var form = $('form')[0];

    var tips = Tips({
      form : form
    });

    tips.render();

    var items = $.map($.makeArray($('form')[0].elements),function(elem){
      if($(elem).attr('data-tip')){
        return true;
      }
    });

    it('测试生成的tips',function(){
      expect(tips.get('items').length).toBe(items.length);
    });

    it('设置值,测试对应的提示是否可见。',function(){
      var val = '2233',
        name = 'b',
        elem = form[name];

      BUI.FormHelper.setField(form,name,val);

      expect($(elem).val()).toBe(val);
      tips.resetVisible();

      var item = tips.getItem(name);

      expect(item).not.toBe(null);
      expect(item.get('visible')).toBe(false);

    });
  });

  describe('测试Tip生成，默认显示时',function(){
    var config = {
        trigger : '#J_Name',
        text:'请输入学生编号'
      },
      tip = new TipItem(config);

     tip.render();
    var el = tip.get('el');
 

    it('测试代码tip生成',function(){
      expect(el.one(".tip-text").text()).toBe(config.text);
    });

    it('测试tip是否显示',function(){
      expect(tip.get('visible')).toBe(true);
    });

    it('测试tip位置',function(){
      var offset = el.offset(),
        triggerEl = $(config.trigger);

      expect(triggerEl.offset().left).toBe(offset.left);
    });

    it('测试tip隐藏',function(){
       $(config.trigger).focus();
       expect(tip.get('visible')).toBe(false);
    });/**/
  });
  
  describe('测试tip,默认隐藏',function(){

    var config = {
        trigger : '#J_Name1',
        iconCls:'icon icon-ok',
        text:'请输入学生姓名'
      },
      tip = new Tips.Item(config);

     tip.render();
    var el = tip.get('el'),
      triggerEl = $(config.trigger);

    it('测试tip是否显示',function(){
       expect(tip.get('visible')).toBe(false);
    });
    it('清除文本离开焦点',function(){
      triggerEl.focus();
      triggerEl.val('');
      triggerEl.blur();
      expect(tip.get('visible')).toBe(true);
    });
  });


});