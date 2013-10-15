BUI.use(['bui/extensions/treegrid','bui/grid'],function (TreeGrid,Grid) {

  var grid = new TreeGrid({
    render : '#t1',
    showLine : true,
    columns : [
      {title : '名称',dataIndex : 'text',editor : {xtype:'text'}},
      {title : '表头1',dataIndex : 'a'},
      {title : '表头2',dataIndex : 'b'}
    ],
    plugins : [Grid.Plugins.CellEditing],
    nodes : [
      {text : '1',id : '1',a:'a1',b:'b1',children: [{text : '11',id : '11',a:'a11',b:'b11'}]},
      {text : '2',id : '2',a:'a2',b:'b2',expanded : true,children : [
          {text : '21',id : '21',a:'a21',b:'b21',children : [{text : '211',id : '211',a:'a211',b:'b211'},{text : '212',id : '212',a:'a212',b:'b212'}]},
          {text : '22',id : '22',a:'a22',b:'b22'}
      ]},
      {text : '3',id : '3',a:'a3',b:'b3'},
      {text : '4',id : '4',a:'a4',b:'b4'}
    ]
  });

  grid.render();
});