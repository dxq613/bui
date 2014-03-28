BUI.use(['bui/form','bui/picker'],function (Form,Picker) {

  $('<div id="issue62"></div>').appendTo('body');
  var form = new Form.Form({
    render : '#issue62',
    children : [
      {xtype : 'text',name:'a',id : 'i_62_a',label:'picker',rules : {required : true}},
      {xtype : 'hidden',name:'b',value:'b'}
    ]
  });

  form.render();

  var fieldA = form.getField('a'),
    fieldB = form.getField('b');

  var items = [
          {text:'选项1',value:'a'},
          {text:'选项2',value:'b'},
          {text:'选项3',value:'c'}
        ],
      picker = new Picker.ListPicker({
        trigger : fieldA.get('el').find('input'),  
        valueField : fieldB.get('el').find('input'),
        width:100,  //指定宽度
        children : [{
          elCls:'bui-select-list',
          items : items
        }] //配置picker内的列表 //也可以不直接声明list 使用 children:[{elCls:'bui-select-list',items : items}]
        
      });
    picker.render();
  var list = picker.get('list');
  describe('issue62',function(){
    it('初始化文本',function(){
      var item = list.getItem(fieldB.get('value'));
      expect(item).not.toBe(null);

      expect(fieldA.get('value')).toBe(item.text);
    });

    it('初始化选中',function(){
      fieldA.get('el').find('input').trigger('click');
      expect(picker.get('visible')).toBe(true);
      expect(list.getSelected()).toBe(list.getItem(fieldB.get('value')));
    });

    it('修改picker',function(){
      var item = list.getFirstItem();
      list.setSelected(item);
      expect(fieldB.get('value')).toBe(item.value);
      expect(fieldA.get('value')).toBe(item.text);
    });

    it('清空选中',function(){
      list.setSelected(null);
      expect(form.isValid()).toBe(false);

      var item = list.getFirstItem();
      list.setSelected(item);
      expect(form.isValid()).toBe(true);



    });


    
  });

});