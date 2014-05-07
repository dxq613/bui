BUI.use(['bui/grid/grid','bui/grid/plugins/columnresize'],function(Grid,Resize){

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
        title : '隐藏',
        sortable:false,
        visible : false
      },{
        title : '表头3',
        dataIndex : 'c'
    }],
    data = [{a:'123',selected:true},{a:'cdd',b:'edd',disabled:true},{a:'1333',c:'eee',d:2}];
    
  var grid = new Grid({
      render:'#J_Grid10',
      columns : columns,
      plugins : [Resize],
      forceFit : true/**/
    });

    

  grid.render();
  grid.showData(data);


});