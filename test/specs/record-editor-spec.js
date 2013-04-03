
BUI.use('bui/editor',function (Editor) {
  var RecordEditor = Editor.RecordEditor;

  var record = {a:'21e',b:'222',c:'ddd'},
    editor = new RecordEditor({
    trigger : '#btnRecord',
    form : {
      children : [
        {name : 'a'},
        {name : 'b',rules :{required:true}},
        {name : 'c',rules :{required:true}}
      ],
      buttonBar : {
        elCls : 'centered toolbar'
      }
    },
    record : record
  });

  editor.render();
  var el = editor.get('el'),
    form = editor.get('form');
  changeData();
  function changeData(){
    var r = editor.get('record');
    $('#log').text(BUI.JSON.stringify(r));
  }
  editor.on('accept',function(ev){
    changeData();
  });

  describe('测试编辑器生成',function(){
    it('测试编辑器生成',function(){
      expect(el.length).not.toBe(0);
    });
    it('测试表单生成',function(){
      
      expect($.isPlainObject(form)).toBe(false);
      expect(form.get('el').length).not.toBe(0);
    });
    it('测试表单初始化',function(){
      var frecord = form.get('record');
      expect(frecord.a).toBe(record.a);
      expect(frecord.b).toBe(record.b);
      expect(frecord.c).toBe(record.c);
    });
    it('显示编辑器',function(){
      expect(editor.get('visible')).toBe(false);
      $('#btnRecord').trigger('click');
      waits(100);
      runs(function(){
        expect(editor.get('visible')).toBe(true);
      });
    });
  });

  describe('测试编辑器操作',function(){

    it('修改数据未通过验证，提交',function(){
      var field = form.getField('b');
      field.set('value','');
      editor.accept();
      expect(editor.isValid()).toBe(false);
      expect(editor.get('visible')).toBe(true);
    });

    it('取消操作',function(){
      var field = form.getField('b');
      editor.cancel();
      expect(record.b).not.toBe(field.get('value'));
      expect(editor.get('visible')).toBe(false);
    });

    it('修改数据通过验证,提交',function(){
      $('#btnRecord').trigger('click');
      waits(100);
      runs(function(){
        expect(editor.get('visible')).toBe(true);
        var value = 'ssee',
          field = form.getField('b');
        field.set('value',value);
        editor.accept();
        expect(editor.get('visible')).toBe(false);
        expect(record.b).toBe(value);
      });
    });
  });
});