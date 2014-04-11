

BUI.use('bui/select',function (Select) {

  var valueEl = $('#hide');
    
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
	 
    it('测试自动生成的name',function(){

    });

  });

  describe('设置选项',function(){
	var items1 = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:'选项4',value:'d'}]
    it('更改选项',function(){
	    select.set('items',items1);
      expect(control.get('items').length).toBe(select.get('items').length);
    });

    it('更改选项',function(){
      var items2 = {'a' : '选项1','b':'选项2','c' : '选项3'}
      select.set('items',items2);
      expect(control.get('items').length).toBe(3);
    });

    it('禁用',function(){
      select.set('disabled',true);
      $('#s1').trigger('click');
      waits(100);
      runs(function(){
        picker.get('visible',false);
      });
    });
    it('可用',function(){
      select.enable();
      $('#s1').trigger('click');
      waits(100);
      runs(function(){
        picker.get('visible',true);
      });
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
  
  describe('测试多选初始化',function(){
    it('测试初始化,默认值',function(){

    });
  });

  describe('测试设置值',function(){

    it('修改选项',function(){

    });
    it('修改值',function(){

    });
    it('重置选项',function(){

    });
    it('禁用勾选',function(){

    });
  });
});
/**/
BUI.use(['bui/select','bui/data'],function(Select,Data){
  var store = new Data.Store({
      url : 'data/store.json',
      autoLoad : true
    }),
    select = new Select.Select({
      render:'#s5',
      valueField : '#v_s5',
      store : store
    });
  select.render();
  var list = select.get('picker').get('list');
  describe('测试初始化',function(){
    it('测试选项生成',function(){
      waits(100);
      runs(function(){
         expect(list.getCount()).toBe(store.getCount());
      });
     
    });
    it('测试默认值',function(){
      expect(list.getSelectedValue()).toBe(select.getSelectedValue());
      expect(list.getSelectedValue()).toBe($('#v_s5').val());
    });
  });

  describe('加载数据',function(){
    it('测试加载数据',function(){

    });
  });
});

BUI.use('bui/select',function (Select) {
  var data = ['选项1','选项2','选项3','选项4'],
    select = new Select.Combox({
    render:'#c1',
    name:'combox',
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
  });
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
  
});/**/