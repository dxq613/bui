BUI.use('bui/select',function (Select) {
  
  $('<div class="issue" id="issue109"><strong>issue109</strong></div>').appendTo('body');
 
  $('#s1').on('keyup',function(ev){
    console.log(ev.which);
  });
  var suggest = new Select.Suggest({
     render:'#issue109',
     name:'suggest',
     data:['1222224','234445','122','1111111']
  });
  suggest.render();

  var input = suggest.get('el').find('input'),
    picker = suggest.get('picker');

  describe('issue 109 测试事件',function(){
    it('显示suggest',function(){
      input.trigger('click');
      expect(picker.get('visible')).toBe(true);
    });

    it('输入文本',function(){
      input.val('12');
      input.trigger('keyup');

    });
  });

});