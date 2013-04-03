
BUI.use(['bui/list','bui/overlay'],function (List,Overlay) {

  var Overlay = BUI.Overlay;

  var textEl = $('#c1'),
      defaultValue = "a",
      valueEl = $('#r2');
  valueEl.val(defaultValue);

  var  items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:"数字值",value:'3'}],
    list = new BUI.List.SimpleList({
      elCls:'bui-select-list',
      items : items
    }),
    picker = new BUI.List.Picker({
      children:[list],
      trigger:'#c1',
      valueField : '#r2',
      textField:textEl

    });

  picker.render();
  var list = picker.get('list');
  
  describe('测试初始化',function(){

    it('测试选项生成',function(){
      expect(list.get('items').length).toBe(items.length);
    });

    it('测试初始化值和文本',function(){
      expect(list.getSelectedValue()).toBe(defaultValue);

      expect(textEl.val()).toBe('选项1');
    });
  });
  describe('测试更改选项',function(){

    it('选中一项',function(){
      list.setSelectedByField('b');
      expect(valueEl.val()).toBe('b');
      expect(textEl.val()).toBe('选项2');
    });

    it('更改一项',function(){
      list.setSelectedByField('c');
      expect(valueEl.val()).toBe('c');
      expect(textEl.val()).toBe('选项3');
    });

    it('测试特殊值,非字符串',function(){
      var value = 3;
      picker.setSelectedValue(value);
      expect(valueEl.val()).toBe('3');
    });
    it('设置不存在项',function(){
      list.setSelectedByField('d');
      expect(valueEl.val()).toBe('');
      expect(textEl.val()).toBe('');
    });



    it('清除所有',function(){
      list.clearSelection('d');
      expect(valueEl.val()).toBe('');
      expect(textEl.val()).toBe('');
    });
  });

});
