Perform.start('grid');
BUI.use(['bui/grid','bui/data'],function(Grid,Data){
       /*列，33行  
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
    */
     
     /* 10列，30行
      var Grid = Grid,
          Store = Data.Store,
          columns = [
            {title : '表头1',dataIndex :'a'},      
            {title : '表头2',dataIndex :'b'},
            {title : '表头3', dataIndex : 'c'},
            {title : '表头1',dataIndex :'a'},      
            {title : '表头2',dataIndex :'b'},
            {title : '表头3', dataIndex : 'c'},
            {title : '表头1',dataIndex :'a'},      
            {title : '表头2',dataIndex :'b'},
            {title : '表头3', dataIndex : 'c'},
            {title : '表头3', dataIndex : 'c'} 
             
          ],
          data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},{a:'123'},
          {a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2},
          {a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}
          ];
 
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
      
     */
    
    /* 可编辑表格*/
    var Grid = Grid,
          Store = Data.Store,
          enumObj = {"1" : "选项一","2" : "选项二","3" : "选项三"},
          columns = [
            {title : '文本',dataIndex :'a',editor : {xtype : 'text'}}, //editor中的定义等用于 BUI.Form.Field.Text的定义
            {title : '数字', dataIndex :'b',editor : {xtype : 'number',rules : {required : true}}},
            {title : '日期',dataIndex :'c', editor : {xtype : 'date'},renderer : Grid.Format.dateRenderer},
            {title : '单选',dataIndex : 'd', editor : {xtype :'select',items : enumObj,rules : {required : true},validator : valid},renderer : Grid.Format.enumRenderer(enumObj)},
            {title : '多选',dataIndex : 'e', editor : {xtype :'select',select:{multipleSelect : true},items : enumObj},renderer : Grid.Format.multipleItemsRenderer(enumObj)}
          ],
          data = [{a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2},
          {a:'123',e:'2,3'},{a:'cdd',c:1363924044176},{a:'1333',b:2222,d:2}
          ];
        function valid(value){
          if(value === '1'){
            return '不能选择1';
          }
        }
        var editing = new Grid.Plugins.CellEditing({
          triggerSelected : false //触发编辑的时候不选中行
        }),
          store = new Store({
            data : data,
            autoLoad:true
          }),
          grid = new Grid.Grid({
            render:'#J_Grid',
            columns : columns,
            width : 700,
            forceFit : true,
            tbar:{ //添加、删除
                items : [{
                  btnCls : 'button button-small',
                  text : '<i class="icon-plus"></i>添加',
                  listeners : {
                    'click' : addFunction
                  }
                },
                {
                  btnCls : 'button button-small',
                  text : '<i class="icon-remove"></i>删除',
                  listeners : {
                    'click' : delFunction
                  }
                }]
            },
            plugins : [editing,Grid.Plugins.CheckSelection],
            store : store
          });
 
        grid.render();
 
        //添加记录
        function addFunction(){
          var newData = {b : 0};
          store.addAt(newData,0);
          editing.edit(newData,'a'); //添加记录后，直接编辑
        }
        //删除选中的记录
        function delFunction(){
          var selections = grid.getSelection();
          store.remove(selections);
        }      

        

        Perform.end('grid');
        Perform.log('grid');
});