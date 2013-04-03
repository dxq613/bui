
BUI.use('bui/grid/simplegrid',function (SimpleGrid) {


   var  columns = [{
        title : '表头1',
        dataIndex :'a'
      },{
        id: '123',
        title : '表头2',
        dataIndex :'b'
      },{
        title : '表头3',
        dataIndex : 'c'
    }],
    data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}];

  var grid = new SimpleGrid({
    render:'#J_Grid',
    columns : columns,
    innerBorder : false,
    tableCls : 'table table-striped table-bordered',
    idField : 'a',
    items : data
  });

  grid.render();

 // grid.showData(data);
  var el = grid.get('el');

  describe('测试Grid生成',function(){
    it('测试列的生成',function(){
      expect(el.find('th').length).toBe(columns.length);
    });

    it('测试行的生成',function(){
      expect(el.find('.bui-grid-row').length).toBe(data.length);
    });
  });

  describe('测试Grid操作',function(){
    it('测试重置数据',function(){
      var newData = [{a:'123'},{a:'234',b:'edd'}];
      grid.showData(newData);
      expect(el.find('.bui-grid-row').length).toBe(newData.length);
    });

    it('测试清数据',function(){
      grid.clearData();
      expect(el.find('.bui-grid-row').length).toBe(0);
    });

    it('测试重置列',function(){

      columns.push({title:'新建列',dataIndex:'d'});
      grid.set('columns',columns);
      expect(el.find('th').length).toBe(columns.length);
    });

    it('测试选中数据',function(){
      grid.showData(data);
      
      var value = '123';
      grid.setSelectedByField(value);
      expect(grid.getSelectedValue()).toBe(value);

    });

    it('测试插入数据',function(){
     var record = {a:'cdd',b:'edd'},
      length = grid.getItemCount();
     grid.addItemAt(record,0);
     expect(grid.getItemCount()).toBe(length + 1);
     expect(grid.getFirstItem()).toBe(record);
     /*grid.removeItemAt(0);
     expect(grid.getFirstItem()).not.toBe(record);*/
    });

  });

});