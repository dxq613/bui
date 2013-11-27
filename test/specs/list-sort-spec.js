BUI.use(['bui/list/simplelist','bui/data'],function (List,Data) {
   
/**/
  describe('测试直接控件排序',function(){
    var items = [{text:'选项1',value:'a'},{text:'选项2',value:'c'},{text:'选项3',value:'b'},{text:"数字值",value:3}],
      list = new List({
      elCls:'bui-select-list',
      frontSortable:true,
      render : '#ls1',
      items : items,
      itemTpl : '<li><a href="#" title="{value}">{text}</a></li>'
    });
    list.render();

    var el = list.get('el');
    it('调用排序',function(){
      list.sort('value','ASC');
      list.setSelected(list.getFirstItem());
      expect(list.getFirstItem().value).toBe(3);
      var element = el.find('li')[0];
      expect(list.getFirstItem()).toBe(list.getItemByElement(element));
    });
    it('调用排序降序',function(){
      list.sort('value','DESC');
      var element = el.find('li')[0];
      expect(list.getFirstItem()).toBe(list.getItemByElement(element));
      expect(list.getFirstItem().value).toBe('c');

    });
  });

  describe('测试使用store本地排序',function(){
    var items = [{text:'选项1',value:'a'},{text:'选项2',value:'c'},{text:'选项3',value:'b'},{text:"数字值",value:3}],
      store = new Data.Store({
        data : items,
        sortInfo : {
          field : 'value',
          direction : 'DESC'
        },
        remoteSort : false
      }),
      list = new List({
      elCls:'bui-select-list',
      frontSortable:true,

      render : '#ls2',
      store : store,
      itemTpl : '<li><a href="#" title="{value}">{text}</a></li>'
    });
    list.render();

    var el = list.get('el');

    it('初始化排序',function(){
      expect(list.getFirstItem().value).toBe('c');
    });

    it('修改排序',function(){
      store.sort('value','ASC');
      expect(list.getFirstItem().value).toBe(3);
      var element = el.find('li')[0];
      expect(list.getFirstItem()).toBe(list.getItemByElement(element));
    });

    it('调用排序降序',function(){
      store.sort('value','DESC');
      var element = el.find('li')[0];
      expect(list.getFirstItem()).toBe(list.getItemByElement(element));
      expect(list.getFirstItem().value).toBe('c');

    });
  });


});