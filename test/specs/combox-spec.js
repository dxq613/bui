
BUI.use('bui/select',function (Select) {
  var data = ['选项1','选项2','选项3','选项4'],
    select = new Select.Combox({
    render:'#ct1',
    valueField : '#txt1',
    showTag : true,
    items : data
  });
  select.render();
  var picker = select.get('picker'),
    list = picker.get('list');

  describe('测试生成',function(){

    it('测试生成项',function(){
      var items = list.getItems();
      BUI.each(items,function(item,index){
        expect(item.text).toBe(data[index])
      });
    });

    it('测试默认值',function(){
      expect($(select.get('valueField')).val()).not.toBe('');
    });

    it('测试生成的tag',function(){
      var val = $(select.get('valueField')).val(),
        length = val.split(';').length;
      expect(select.get('tagList')).not.toBe(null);
      expect(select.get('tagList')).not.toBe(undefined);

      expect(select.get('tagList').getItemCount()).toBe(length);
    });

  });

  describe('操作',function(){
    it('输入',function(){

    });

    it('继续输入',function(){

    });

    it('无数据时删除',function(){

    });

    it('继续，无数据时删除',function(){

    });

    it('点击删除tag',function(){

    });
  });
});


BUI.use('bui/select',function (Select) {
  var data = ['选项1','选项2','选项3','选项4'],
    select = new Select.Combox({
    render:'#ct2',
    valueField : '#txt2',
    elCls : 'bui-tag-follow',
    width: 500,
    showTag : true,
    items : data
  });
  select.render();
  var picker = select.get('picker'),
    list = picker.get('list');

});