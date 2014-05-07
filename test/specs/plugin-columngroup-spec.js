BUI.use(['bui/grid/grid','bui/grid/plugins/columngroup'],function(Grid,Group){

  var 
    columns = [{
        title : '表头1',
        dataIndex :'a',
        sortState :'ASC'
      },{
        id: '123',
        title : '表头2',
        dataIndex :'b',
        sortable:false
      },{
        title : '表头3',
        dataIndex : 'c'
    },{
      title : '表头4',
      dataIndex : 'd'
    },{
      title : '表头5',
      dataIndex : 'd'
    },{
      title : '表头6',
      dataIndex : 'd'
    },{
      title : '表头7',
      dataIndex : 'd'
    },{
      title : '表头8',
      dataIndex : 'd'
    }],
    data = [{a:'123',selected:true},{a:'cdd',b:'edd',disabled:true},{a:'1333',c:'eee',d:2}];
    
  var group = new Group({
      groups : [{
        title : '分组1',
        from : 1,
        to : 2
      },{
        title : '分组2',
        from : 5,
        to : 6
      }]
    }),
    grid = new Grid({
      render:'#J_Grid8',
      columns : columns,
      plugins : [group],
      forceFit : true/**/
    });
  grid.render();
  grid.showData(data);

  var hel = grid.get('header').get('el');
  describe('测试列分组生成',function () {
    it('测试列分组容器',function () {
      expect(hel.find('.bui-grid-column-group').length).not.toBe(0);
    });

    it('测试列分组Group',function () {
      // body...
    });
    it('测试列未分组列',function () {
      // body...
    });
  });
});