BUI.use(['bui/form','bui/picker'],function (Form,Picker) {

  $('<div id="issue67"><h3>#issue67</h3></div>').appendTo('body');
  var form = new Form.Form({
    render : '#issue67',
    children : [
      {xtype : 'text',name:'a',label:'picker',rules : {required : true}},
      {xtype : 'hidden',name:'b',value:'0'}
    ]
  });

  form.render();

  var fieldA = form.getField('a'),
    fieldB = form.getField('b');

  var items = [
          
          {text:'选项2',value:'1'},
          {text:'选项1',value:'0'},
          {text:'选项3',value:'2'}
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
  describe('issue67 当值为0时的bug',function(){
    it('初始化文本',function(){
      var item = list.getItem(fieldB.get('value'));
      expect(item).not.toBe(null);

      expect(fieldA.get('value')).toBe(item.text);
    });

  });

});