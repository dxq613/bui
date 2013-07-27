

BUI.use('bui/select',function (Select) {

  var 
    valueEl = $('#hide');

  var select = new Select.Select({
    render:'#s1',
    valueField:valueEl,
    items:[{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'}]
  });
  select.render();
  select.on('change',function(e){
    BUI.log(e.item)
  });
  var picker = select.get('picker'),
    control = picker.get('list');
  describe('测试初始化',function(){

    it('测试选择器是否存在',function(){
      expect(picker).not.toBe(undefined);
      expect(picker.get('el').length).toBe(1);
      expect(control.get('items').length).toBe(select.get('items').length);
    });

    it('测试初始化值',function(){
      var val = picker.get('list').getSelectedValue();
      expect(valueEl.val()).toBe(val.toString());
    });
	

  });

  describe('设置选项',function(){
	var items1 = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:'选项4',value:'d'}]
    it('更改选项',function(){
	  select.set('items',items1);
      expect(control.get('items').length).toBe(select.get('items').length);
    });

  });
  
});

BUI.use('bui/select',function (Select) {


  var select = new Select.Select({
    render:'#s2',
	valueField:'#hide1',
	multipleSelect:true,
    items:[{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:'选项4',value:'d'}]
  });
  select.render();
  
});

BUI.use('bui/select',function (Select) {
  var select = new Select.Combox({
    render:'#c1',
    name:'combox',
    items:['选项1','选项2','选项3','选项4']
  });
  select.render();
  
});

BUI.use('bui/select',function (Select) {

  var suggest = new Select.Suggest({
    render:'#c2',
    name:'suggest',
    data:['1222224','234445','122','1111111']
  });
  suggest.render();
  
});

BUI.use(['bui/select','bui/picker','bui/grid'],function(Select,Picker,Grid){
  var columns = [
          {title : '表头1(30%)',dataIndex :'a', width:'30%'},
          {id: '123',title : '表头2(30%)',dataIndex :'b', width:'30%'},
          {title : '表头3(40%)',dataIndex : 'c',width:'40%'}
        ],   
      data = [{a:'123',b:'选择文本1'},{a:'cdd',b:'选择文本2'},{a:'1333',b:'选择文本3',c:'eee',d:2}],
      grid = new Grid.SimpleGrid({
        dataField : 'a',
        columns : columns,
        textGetter: function(item){ //返回选中的文本
          return item.b;
        }
      }),
      picker = new Picker.ListPicker({
        width:300,  //指定宽度
        children : [grid] //配置picker内的列表
      });
  var suggest = new Select.Suggest({
    render:'#c3',
    name:'suggest',
    forceFit:false,
    picker : picker,
    data:data
  });
  suggest.render();
  
});