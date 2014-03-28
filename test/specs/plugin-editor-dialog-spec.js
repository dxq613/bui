BUI.use(['bui/grid/grid','bui/data','bui/grid/plugins/dialogediting','bui/grid/format'],function (Grid,Data,DialogEditing,Format,Selection) {

  var enumObj = {'1' : '选项一','2' : '选项二'},
      columns = [{
        title : '字段1',
        dataIndex :'a'
      },{
        id: '123',
        title : '字段2',
        dataIndex :'b',
        width:50
      },{
        title : '字段3',
        dataIndex : 'c',
        renderer : Format.dateRenderer
    },{
      id : 'select',
      title : '选择',
      dataIndex : 'd',
      renderer : Format.enumRenderer(enumObj)
    },{
      title : '操作',
      renderer : function(){
        return '<span class="grid-command btn-edit">操作</span>'
      }
    }],
    data = [{a:'123'},{a:'cdd',b:'edd',c:1362625302818},{a:'123'},{a:'1333',c:'eee',d:2},{a:'123'},{a:'123'},{a:'123'},{a:'123'},{a:'123'},{a:'123'},{a:'123'}];
  

  var editing = new DialogEditing({
      contentId : 'content',
      triggerCls : 'btn-edit'
    }),
    store = new Data.Store({
      data : data
    }),
    grid = new Grid({
    render:'#J_Grid2',
    columns : columns,
    width:800,
    height:250,
    forceFit : true,
    store : store,
    tbar : {
      items : [{
        btnCls : 'button button-small',
        text : '添加',
        handler: function(){
          editing.add({},0);
        }
      }]
    },
    plugins : [editing]
  });;

  grid.render();
  function log(obj){
    window.console && window.console.log(obj);
  }

  editing.on('accept',function(ev){
    log(ev);
  });

  editing.on('editorshow',function(ev){
    log(ev);

  });

  editing.on('cancel',function(ev){
    log(ev);
  });

  function getField(field){
    return form.getField(field);
  }

  var editor = null,
    form = null;
});