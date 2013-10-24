
BUI.use(['bui/grid/grid','bui/data','bui/grid/plugins','bui/grid/format'],function (Grid,Data,Plugins,Format) {
    var enumObj = {'1' : '选项一','2' : '选项二'},
      columns = [{
        title : '表头1',
        dataIndex :'a',
        editor : {
          xtype : 'number'
        }
      },{
        id: '123',
        title : '表头2',
        dataIndex :'b',
        editor : {
          xtype : 'text',
          rules : {
            maxlength : 5
          },
          editableFn : function(val,obj){
            if(BUI.isNumber(obj.a)){
              return true;
            }
            return false;
          }
        }
      },{
        title : '表头3',
        dataIndex : 'c',
        editor : {
          xtype : 'date',
          validator : function(value,obj){
            if(obj['b'] && !value){
              return '表头2不为空时，表头3也不能为空！';
            }
          }
        },
        renderer : Format.dateRenderer
    },{
      id : 'select',
      title : '选择',
      editor : {
          xtype : 'select',
          items : enumObj
      },
      dataIndex : 'd',
      renderer : Format.enumRenderer(enumObj)
    },{
      title : 'checkbox',
      dataIndex : 'e',
      editor : {
        xtype : 'checkbox',
        //tpl : '<label><span class="checkbox"></span>{label}</label>',
        value : '1'
      }
    }],
    data = [{a:'123'},{a:0,b:'edd',c:1362625302818},{a:123},{a:'1333',c:'eee',d:2},{a:'123'},{a:'123'},{a:'123'},{a:'123'},{a:'123'},{a:'123'},{a:'123'}];
  

  var editing = new Plugins.CellEditing,
    store = new Data.Store({
    data : data
  }),
    grid = new Grid({
    render:'#J_Grid',
    columns : columns,
    width:1000,
    height:250,
    forceFit : true,
    store : store,
    plugins : [editing]
  });;

  grid.render();

  $('#btnValid').on('click',function(){
    editing.valid();
  });
/**/
  describe('测试编辑文本',function(){
    var record = store.getResult()[1],
      editor = null;
    it('测试触发编辑记录',function(){
      waits(500);
      runs(function(){
       
        editing.edit(record,'b');
        editor = editing.getEditor('b');
        expect(editor).not.toBe(null);
        expect(editor.get('visible')).toBe(true);
        expect(editor.get('editValue')).toBe(record['b']);
      });
    });

    it('测试取消编辑记录',function(){
      editing.cancel();
      expect(editor.get('visible')).toBe(false);
    });

    it('修改值,验证不通过',function(){
      editing.edit(record,'b');
      expect(editor.get('visible')).toBe(true);
      editor.setValue('123456');
      expect(editor.isValid()).toBe(false);
      $('#btn').trigger('mousedown');
      waits(100);
      runs(function(){
        expect(editor.get('visible')).toBe(false);
      });
    });

    it('验证通过修改值',function(){
      editor.setValue('12345');
      expect(editor.isValid()).toBe(true);
      $('#btn').trigger('mousedown');
      waits(100);
      runs(function(){
        expect(editor.get('visible')).toBe(false);
      });
    });
  });

  describe('测试编辑日期',function(){
    var record = store.getResult()[1],
      field = 'c',
      editor ;
    it('显示日期编辑器',function(){
       waits(500);
      runs(function(){
        editor = editing.getEditor( field);
        editing.edit(record,field);
        expect(editor).not.toBe(null);
        expect(editor.get('visible')).toBe(true);
      });
    });
    it('隐藏日期编辑器',function(){
      editing.cancel();
      expect(editor.get('visible')).toBe(false);
    });
  });

  describe('测试编辑选择框',function(){
    var record = store.getResult()[1],
      field = 'd',
      editor ;
    it('显示选择编辑器',function(){
       waits(500);
      runs(function(){
        editor = editing.getEditor(field);
        editing.edit(record,field);
        expect(editor).not.toBe(null);
        expect(editor.get('visible')).toBe(true);
      });
    });
    it('隐藏选择编辑器',function(){
      editing.cancel();
      expect(editor.get('visible')).toBe(false);
    });
  });

  describe('测试数字编辑',function(){
    var record = store.getResult()[1],
      field = 'a',
      editor = null;
    it('显示选择编辑器',function(){
      waits(500);
      runs(function(){
        editor = editing.getEditor(field);
        editing.edit(record,field);
        expect(editor.getValue()).toBe(record[field]);
        expect(editor).not.toBe(null);
        expect(editor.get('visible')).toBe(true);
      });
    });
    it('隐藏选择编辑器',function(){
      editing.cancel();
      expect(editor.get('visible')).toBe(false);
    });

    it('设置为0',function(){
        editing.edit(record,field);
        expect(editor).not.toBe(null);
        editor.setValue(0);
        editor.accept();
        expect(editor.get('visible')).toBe(false);
        expect(record[field]).toBe(0);
    });
    it('设置为空格',function(){
        editing.edit(record,field);
        expect(editor).not.toBe(null);
        editor.setValue('');
        editor.accept();
        expect(editor.get('visible')).toBe(false);
        expect(record[field]).toBe(null);
    });

  });

  describe('表格操作，显示验证信息',function(){

    it('未验证表格数据',function(){
      //expect(editing.isValid()).toBe(true);
    });

    it('验证表格数据',function(){
      editing.valid();
      expect(editing.isValid()).toBe(false);
    });

    it('清理错误',function(){
      editing.clearErrors()
      expect(editing.isValid()).toBe(true);
    });

    it('添加数据',function(){
      var item = {b : '123'};
      store.addAt(item,0);
      expect(editing.isValid()).toBe(false);
    });

    it('编辑数据',function(){
      var item = store.findByIndex(0);
      item.c = new Date();
      store.update(item);
      expect(editing.isValid()).toBe(true);
    });

  });
/**/
});