BUI.use('perform',function(Perform){
  Perform.start('grid');
  BUI.use(['bui/grid','bui/data'],function(Grid,Data){
        var Grid = Grid,
            Store = Data.Store,
            columns = [{
                title : '表头1(20%)',
                dataIndex :'a',
                width:'20%'
              },{
                id: '123',
                title : '表头2(30%)',
                dataIndex :'b',
                width:'30%'
              },{
                title : '表头3(50%)',
                dataIndex : 'c',
                width:'50%'
            }],
            data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}];
   
          var store = new Store({
              data : data
            }),
            grid = new Grid.Grid({
              render:'#J_Grid',
              width:'100%',//这个属性一定要设置
              columns : columns,
              idField : 'a',
              store : store
            });
   
          grid.render();
          Perform.end('grid');
          Perform.log('grid');
  });

});