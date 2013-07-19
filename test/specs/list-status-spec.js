
BUI.use('bui/list',function (List) {

  describe('测试禁用',function(){
    var items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:"数字值",value:3}],
      list = new List.SimpleList({
      elCls:'bui-select-list',
      render : '#l4',
      items : items,
      itemTpl : '<li><a href="#" title="{value}">{text}</a></li>'
    });
    list.render();
    var el = list.get('el');

    it('设置禁用',function(){
      var item = list.getItem('a'),
        element = list.findElement(item);
      list.setItemDisabled(item,true);
      expect($(element).hasClass('bui-list-item-disabled')).toBe(true);
      expect(list.isItemDisabled(item)).toBe(true);
    });
    it('清理禁用',function(){
      var item = list.getItem('a'),
        element = list.findElement(item);
      list.setItemDisabled(item,false);
      expect($(element).hasClass('bui-list-item-disabled')).toBe(false);
      expect(list.isItemDisabled(item)).toBe(false);
    });
    it('禁用后，选中操作',function(){
      var item = list.getItem('a'),
        element = list.findElement(item);
      list.setItemDisabled(item,true);
      expect(list.hasStatus(item,'selected')).toBe(false);
      list.setSelected(item);
      expect(list.hasStatus(item,'selected')).toBe(false);
    });
    it('选中后，禁用',function(){
      var item = list.getItem('b');
      list.setSelected(item);
      expect(list.hasStatus(item,'selected')).toBe(true);
      list.setItemDisabled(item,true);
      expect(list.hasStatus(item,'selected')).toBe(false);
    });
  });

  describe('测试列表状态',function(){
     var items = [{text:'选项1',value:'a',checked : true},{text:'选项2',value:'b',selected : true},{text:'选项3',value:'c',disabled: true},{text:"数字值",value:3,disabled: true,checked:true}],
      list = new List.SimpleList({
      elCls:'bui-select-list',
      render : '#l5',
      itemStatusFields  : {
        selected : 'selected',
        disabled : 'disabled',
        checked : 'checked'
      },
      items : items,
      itemTpl : '<li><a href="#" title="{value}">{text}</a></li>'
    });
    list.render();
    describe('测试初始化',function(){

      it('测试自定义状态',function(){
        var item = list.getItem('a');
        expect(list.hasStatus(item,'checked')).toBe(true);
      });
      it('测试禁用状态',function(){
        var item = list.getItem('c');
        expect(list.hasStatus(item,'disabled')).toBe(true);
      });

      it('测试选中状态',function(){
        var item = list.getItem('b');
        expect(list.hasStatus(item,'selected')).toBe(true);
      });

      it('测试多个状态',function(){
        var item = list.getItem(3);
        expect(list.hasStatus(item,'checked')).toBe(true);
        expect(list.hasStatus(item,'disabled')).toBe(true);
      });
    });

    describe('测试操作',function(){

      it('添加选项',function(){
        var item = {text : '新增选项1',value : '234',checked : true};
        list.addItem(item);
        expect(list.hasStatus(item,'checked')).toBe(true);
      });

      it('添加禁用选项',function(){
        var item = {text : '新增选项1',value : '12',disabled : true};
        list.addItem(item);
        expect(list.hasStatus(item,'disabled')).toBe(true);
      });

      it('更新选项状态',function(){
        var item = list.getItem('12');
        item.disabled = false;
        list.updateItem(item);
        expect(list.hasStatus(item,'disabled')).toBe(false);
        list.setItemDisabled(item,true);
        expect(item.disabled).toBe(true);
      });

    });

    describe('测试阻止选中',function(){
      it('阻止选中事件',function(){

        var selectFn = function(ev){
          return false;
        };
        list.on('beforeselectedchange',selectFn);
        
        var item = list.getItemAt(0);
        list.setSelected(item);
        expect(list.isItemSelected(item)).toBe(false);
      });
    });
  })
    
});