

BUI.use('bui/list',function (List) {

  var items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:"数字值",value:3}],
    list = new List.SimpleList({
    elCls:'bui-select-list',
    render : '#list1',

    items : items,
    itemTpl : '<li><a href="#" title="{value}">{text}</a></li>'
  });
  list.render();
  var el = list.get('el');

  describe('测试列表初始化',function(){

    it('测试项的生成',function(){
      expect(el.find('.bui-list-item').length).toBe(items.length);
    });

    it('测试模板',function(){
      expect(el.find('a').length).toBe(items.length);
    });
    
  });

  describe('测试单选',function(){

    it('测试单选选中',function(){
      list.setSelectedByField('a');
      expect(list.getSelectedValue()).toBe('a');
      expect(list.getSelected().value).toBe('a');

      list.setSelectedByField('b');
      expect(list.getSelectedValue()).toBe('b');
      expect(list.getSelected().value).toBe('b');
      expect(list.getSelection().length).toBe(1);
    });
    
    it('测试清理选中',function(){
      list.setSelectedByField('b');
      list.clearSelected();
      expect(list.getSelection().length).toBe(0);
      
      list.setSelectedByField('b');
      list.clearSelection();
      expect(list.getSelection().length).toBe(0);
    });

    it('测试选中数字项',function(){
      list.setSelectedByField(3);
      expect(list.getSelectedValue()).toBe(3);
    });

    it('测试点击',function(){
      var item = null;
        obj = {
        callback : function(ev){
            item = ev.item;
            list.off('itemclick',obj.callback);
        }
      }
      spyOn(obj,'callback').andCallThrough();
      list.on('itemclick',obj.callback);
      waits(200);
      runs(function(){
        expect(item).toBe(list.getSelected());
      });

      var item = list.getItemAt(0),
        dom = list.findElement(item);
      $(dom).trigger('click');
      waits(200);
      runs(function(){
        expect(obj.callback).toHaveBeenCalled();
      });
    });
  });

  describe('测试多选',function(){
    it('测试多选',function(){
      list.clearSelection();
      list.set('multipleSelect',true);

      list.setSelectedByField('a');
      list.setSelectedByField('b');

      expect(list.getSelection().length).toBe(2);
    });
  });

  describe('更改选项集合',function(){
    var items1 = [{text:'选项1',value:'a'},{text:'选项2',value:'b'}];
    it('测试生成列表项',function(){
      list.setSelectedByField('a');

      list.set('items',items1);
      expect(el.find('.bui-list-item').length).toBe(items1.length);
      expect(list.getSelection().length).toBe(0);
    });

    it('测试更改列表',function(){
      list.setItems(BUI.cloneObject(items));
      expect(list.getItems().length).toBe(items.length);
      list.setItems(items1);
    });
    it('添加列表项',function(){
      var item = {text:'添加项',value:'new'}
      list.addItem(item);
      expect($.inArray(item,items1)).not.toBe(-1);
      expect(el.find('.bui-list-item').length).toBe(items1.length);
    });

    it('添加多项',function(){
      var items = [{text:'添加项',value:'new'},{text:'添加项',value:'new'}],
        count = list.getItemCount();
      list.addItems(items);
      expect(list.getItemCount()).toBe(count + items.length);
      expect(el.find('.bui-list-item').length).toBe(items1.length);

      list.removeItems(items);
      expect(list.getItemCount()).toBe(count);
    });

    it('删除列表项',function(){
      var item = items1[1];
      list.removeItem(item);
      expect($.inArray(item,items1)).toBe(-1);
      expect(el.find('.bui-list-item').length).toBe(items1.length);
    });

  });

  describe('测试事件',function(){
    it('测试选中改变',function(){
      list.clearSelection();

      var selectCallback = jasmine.createSpy();
      list.on('itemselected',selectCallback);
      list.setSelectedByField('a');
      expect(selectCallback).toHaveBeenCalled();
    });
  });

});



BUI.use('bui/list',function (List) {

  var items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:"数字值",value:3}],
    list = new List.List({
    elCls:'bui-select-list',
    render : '#list2',
    idField:'value',
    items : items
  });
  list.render();
  var el = list.get('el');

  describe('测试列表初始化',function(){

    it('测试项的生成',function(){
      expect(el.find('.bui-list-item').length).toBe(items.length);
    });
    
  });

  describe('测试单选',function(){

    it('测试单选选中',function(){
      list.setSelectedByField('a');
      expect(list.getSelectedValue()).toBe('a');
      expect(list.getSelected().get('value')).toBe('a');

      list.setSelectedByField('b');
      expect(list.getSelectedValue()).toBe('b');
      expect(list.getSelected().get('value')).toBe('b');
      expect(list.getSelection().length).toBe(1);
    });
    
    it('测试清理选中',function(){
      list.clearSelection();
      expect(list.getSelection().length).toBe(0);
    });

    it('测试选中数字项',function(){
      list.setSelectedByField(3);
      expect(list.getSelectedValue()).toBe(3);
    });

    it('测试点击选项',function(){
      var item = list.getFirstItem();
      item.fire('click');
      waits(100);
      runs(function(){
        expect(list.getSelected()).toBe(item);
        expect(item.get('el').hasClass('bui-list-item-selected')).toBe(true);
      })
    });
  });

  describe('测试多选',function(){
    it('测试多选',function(){
      list.clearSelection();
      list.set('multipleSelect',true);

      list.setSelectedByField('a');
      list.setSelectedByField('b');

      expect(list.getSelection().length).toBe(2);
    });
  });

  describe('更改选项集合',function(){
    var items1 = [{text:'选项1',value:'a'},{text:'选项2',value:'b'}];
    it('测试生成列表项',function(){
      list.setSelectedByField('a');

      list.set('items',items1);
      expect(el.find('.bui-list-item').length).toBe(items1.length);
      expect(list.getSelection().length).toBe(0);
    });


    it('添加列表项',function(){
      var count = list.get('children').length,
        item = {text:'添加项',value:'new'}
      list.addItem(item);
      expect(el.find('.bui-list-item').length).toBe(count+1);
    });

    it('插入列表项',function(){
      var count = list.get('children').length,
        item = {text:'添加项',value:'new',id:'121'}
      list.addItemAt(item,0);
      expect(list.getItems()[0].get('id')).toBe(item.id);
      expect(el.find('.bui-list-item').length).toBe(count+1);
    });

    it('删除列表项',function(){
      var item = list.findItemByField('value','b'),
        count = list.get('children').length;

      list.removeItem(item);
      expect(el.find('.bui-list-item').length).toBe(count - 1);
    });
  });

  describe('测试事件',function(){
    it('测试选中改变',function(){
      list.clearSelection();

      var selectCallback = jasmine.createSpy();
      list.on('itemselected',selectCallback);
      list.setSelectedByField('a');
      expect(selectCallback).toHaveBeenCalled();
    });

  });

});
/**/
BUI.use('bui/list',function (List) {

  var items = [{id:123,text:'选项1',value:'a'},{id:234,tpl:'<span>{text}</span>',text:'选项2',value:'b'},
    {id:455,text:'选项3',tplRender:function(data){return data.value;},value:'c'},
    {id:222,text:"数字值",value:3},{id:125,text:'选项4',value:'d'},{id:128,text:'选项5',value:'d'}],
    list = new List.List({
    elCls:'bui-select-list',
    render : '#listCheck',

    idField:'id',
    itemTpl : '<span class="badge badge-error">{id}</span>  <span>{text}</span>',
    children : BUI.cloneObject(items)
  });
  list.render();

  describe('测试模板',function (){
    var children = list.get('children');
    it('测试初始化模板',function(){
      var 
        firstNode = children[0],
        secondNode = children[1];
      expect(firstNode).not.toBe(undefined);
      expect(firstNode.get('el').find('.badge').length).not.toBe(0);
      expect(firstNode.get('el').find('.badge').text()).toBe(items[0].id.toString());
      expect(secondNode.get('el').find('.badge').length).toBe(0);
    });
    it('更改第一个对象的模板',function(){
      var firstNode = children[0];
      firstNode.set('tpl','<span>{text}</span>');
      expect(firstNode.get('el').find('.badge').length).toBe(0);  
    });
    it('测试模板渲染函数',function(){
      var thirdNode = children[2];
      expect(thirdNode.get('el').text()).toBe(thirdNode.get('value').toString());
    });
  });
});

BUI.use('bui/list',function (List) {

  var items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:"数字值",value:3}]
    list = new List.SimpleList({
      elCls:'bui-select-list',
      tpl : '<div class="panel"><h2 class="panel-header">列表</h2><ul></ul></div>',
      items : items,
      cancelSelected : true,
      render : '#list3',
      idField:'value'
    });
  list.render();
  var 
    arr = [{text:'附加1',value:'f1'},{text:'附加2',value:'f2'}];

  describe('测试列表操作',function(){

    it('测试添加选项',function(){
      var count = list.getItemCount();
      list.addItem({text : '选项5',value : '5'});
      expect(list.getItemCount()).toBe(count + 1);
    });
    it('测试删除选项',function(){
      var item = list.getItem('5');
      expect(item).not.toBe(null);
      list.removeItem(item);

      item = list.getItem('5');
      expect(item).toBe(null);

    });

    it('测试更新选项',function(){
      var item = list.getItem('c');
      item.text = "修改";
      list.updateItem(item);
      expect($(list.findElement(item)).text()).toBe(item.text);
    });

    it('批量添加',function(){
      var count = list.getItemCount();
      list.addItems(arr);
      expect(list.getItemCount()).toBe(count + arr.length);

    });
    it('批量删除',function(){
       var count = list.getItemCount();
      list.removeItems(arr);
      expect(list.getItemCount()).toBe(count - arr.length);
    });

  });

  describe('测试列表自定义状态',function(){

    it('设置状态',function(){
      var item = list.getFirstItem();
      list.setItemStatus(item,'active',true);
      var element = list.findElement(item);
      expect($(element).hasClass('bui-list-item-active')).toBe(true);
    });

    it('获取设置了状态的选项',function(){
      var arr = list.getItemsByStatus('active');
      expect(arr.length).not.toBe(0);
    });

    it('取消状态',function(){
       var item = list.getFirstItem();
      list.setItemStatus(item,'active',false);
      var element = list.findElement(item);
      expect($(element).hasClass('bui-list-item-active')).toBe(false);
    });

    it('测试双击事件',function(){
      var item = list.getFirstItem(),
        callback = jasmine.createSpy(),
        element = list.findElement(item);
      list.on('itemdblclick',callback);
      $(element).trigger('dblclick');
      waits(100);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        list.off('itemdblclick',callback);
      });
    });

    it('测试点击',function(){
      list.clearSelection();
      var item = list.getFirstItem(),
        element = list.findElement(item);
      $(element).trigger('click');
      waits(100);
      runs(function(){
        expect(list.isItemSelected(item)).toBe(true);
        var callback = jasmine.createSpy();
        list.on('selectedchange',callback);

        $(element).trigger('click');
        waits(100);
        runs(function(){
          expect(list.isItemSelected(item)).toBe(false);
          expect(callback).toHaveBeenCalled();
          list.off('selectedchange',callback);
        });

      });
    });
  });
});


BUI.use(['bui/list','bui/data'],function (List,Data) {
  var Store = Data.Store;
    

  var items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:"数字值",value:3}],
    store = new Store({
      data:items,
      matchFunction:function(obj1,obj2){
        return obj1.value === obj2.value;
      }
    }),
    list = new List.SimpleList({
      elCls:'bui-select-list',
      render : '#list3',
      itemTpl : '<li><span class="x-radio"></span>{text}</li>',
      idField:'value',
      store:store
    });
  list.render();
  store.load();
  var el = list.get('el');

  describe('测试列表跟数据',function(){

    it('测试项的生成',function(){
      expect(el.find('.bui-list-item').length).toBe(items.length);
    });

    it('添加、删除纪录',function(){
      var item = {text:'文本',value:'d'};
      store.add(item);
      expect(el.find('.bui-list-item').length).toBe(store.getCount());
      store.remove(item);
      expect(el.find('.bui-list-item').length).toBe(store.getCount());
    });

    it('更新数据',function(){
      var text = '123';
      store.update({value:'a',text:text},true);
      list.setSelectedByField('a');
      expect(list.getSelectedText()).toBe(text);
    });

    
  });
});


BUI.use('bui/list',function (List) {


  var items = [{id:1,text:'选项1',value:'a',ischeck:true},{id:4,text:'选项2',value:'b',ischeck:true},{id:2,text:'选项3',value:'c',ischeck:true},{id:3,text:"数字值",value:3}],
    list = new List.Listbox({
    elCls : 'bui-select-list',
    render : '#lb1',
    idField:'id',
    items : items
  });
  list.render();
  $('#clear').on('click',function(){
    list.clearItems();
  });
  var el = list.get('el');


  function testSelected(item,selected){
    var el = $(list.findElement(item));
    expect(el.hasClass('bui-list-item-selected')).toBe(selected);
    //expect(!!el.find('input').attr('checked')).toBe(selected);
  }
  describe('测试listBox 生成',function(){
    it('测试容器生成',function(){
      expect(el.length).not.toBe(0);
      expect(el.hasClass('bui-listbox')).toBe(true);
    });

    it('测试选项的数量',function(){
      var children = list.get('items');
      expect(items.length).toBe(children.length);

    });
    it('测试选项的生成',function(){
      var item = list.getFirstItem(),
        el = $(list.findElement(item));
      expect(item).not.toBe(null);
      expect(el.length).not.toBe(0);
      //expect(el.find('input').length).not.toBe(0);
    });
  });

  describe('测试listBox 选中',function(){
    it('测试选中一项',function(){
      var item = list.getItemAt(1),
        el = list.findElement(item);
      list.setSelected(item);
      expect(list.getSelected()).toBe(item);
      

    });

    it('测试取消选中一项',function(){
      var item = list.getSelected();
      list.clearSelected(item);
      
      expect(list.getSelected()).not.toBe(item);
      testSelected(item,false);
      
    });


    it('测试选中多项',function(){
      var arr = [];
      list.clearSelection();
      $.each(items,function(i,element){
        if(element.ischeck){
          arr.push(list.getItem(element.id));
        }
      });
      list.setSelection(arr);
      expect(list.getSelection().length).toBe(3);
    });

    it('测试清除所有选中',function(){
      list.clearSelection();
      expect(list.getSelected()).toBe(null);
    });
    
  });

  describe('测试listBox事件',function(){

    

  describe('测试listbox禁用',function(){
    it('测试点击项',function(){
      list.set('disabled',false);
      var item = list.getItem(1),
          el = $(list.findElement(item));

      el.trigger('click');
      waits(100);
      runs(function(){
        testSelected(item,true);
        el.trigger('click');

        waits(100);
        runs(function(){
          testSelected(item,false);
        });
      });
    });
    
    it('测试禁用',function(){
      list.set('disabled',true);
      var item = list.getItem(1),
          el = $(list.findElement(item));

      el.trigger('click');
      waits(100);
      runs(function(){
        testSelected(item,false);
        el.trigger('click');

        waits(100);
        runs(function(){
          testSelected(item,false);
        });
      });
    });
  });

    
  });

});/**/
BUI.use('bui/list',function(List){
  describe('list srcNode',function(){
    var node = $('<section><ul><li class="item item-active" data-id="1">1</li><li  class="item" data-id="2">2</li><li  class="item" data-id="3">3</li><li class="item" data-id="4">4</li></ul></section>').appendTo('.container'),
      list = new List.SimpleList({
        srcNode : node,
        idField : 'id',
        itemStatusFields : {
          active : 'active'
        },
        itemCls : 'item'
      });
    list.render();

    it('test items',function(){
      expect(list.getCount()).toBe(node.find('.item').length);
    });

    it('test item status',function(){
      var item = list.getItem('1');
      expect(list.hasStatus(item,'active')).toBe(true);
      expect(item.active).toBe(true);
    });
  });
});

/*
*/

