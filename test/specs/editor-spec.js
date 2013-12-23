
BUI.use('bui/editor',function (Editor) {

  var editor = new Editor.Editor({
    trigger : '.edit-text',
    field : {
      rules : {
        required : true
      }
    }
  });

  editor.render();
  var el = editor.get('el'),
    field = editor.get('field');
  describe('测试编辑器生成',function(){

    it('测试生成编辑器',function(){
      expect(el.length).not.toBe(0);
      expect(editor.get('visible')).toBe(false);
    });

    it('测试编辑器字段域',function(){
      
      expect(field).not.toBe(null);
      expect($.isPlainObject(field)).toBe(false);
    });

    it('测试编辑器显示',function(){
      var txtEl1 = $('#e1');
      txtEl1.trigger('click');
      waits(100);
      runs(function(){
        expect(editor.get('visible')).toBe(true);
        expect(field.get('value')).toBe(txtEl1.text());
      });
    });

    it('测试编辑器编辑其他DOM',function(){
      var txtEl1 = $('#e2');
      txtEl1.trigger('click');
      waits(100);
      runs(function(){
        expect(editor.get('visible')).toBe(true);
        expect(field.get('value')).toBe(txtEl1.text());
      });
    });

  });

  describe('测试编辑器编辑文本',function(){

    it('修改字段域内容,调用Accept方法',function(){
      var textEl = $('#e1'),
        value = '222';
      textEl.trigger('click');
      waits(100);
      runs(function(){
        field.set('value',value);
        editor.accept();
        expect(editor.getValue()).toBe(value);
        expect(textEl.text()).toBe(value);
        expect(editor.get('visible')).toBe(false);
      });
    });

    it('修改字段域内容,验证失败，调用accept',function(){
      var textEl = $('#e1'),
        value = '';
      textEl.trigger('click');
      waits(100);
      runs(function(){
        field.set('value',value);
        editor.accept();
        expect(editor.get('visible')).toBe(true);
        expect(textEl.text()).not.toBe(value);
      });
    });
    it('测试编辑器取消编辑',function(){
      var textEl = $('#e1');
      editor.cancel();
      expect(editor.get('visible')).toBe(false);
      expect(textEl.text()).not.toBe('');
    });
    it('修改字段域内容,验证失败，点击外部',function(){
      
      var textEl = $('#e1'),
        value = '';
      textEl.trigger('click');
      waits(100);
      runs(function(){
        field.set('value',value);
        $('#outer').trigger('mousedown');
        waits(100);
        runs(function(){
          expect(editor.get('visible')).toBe(true);
          expect(textEl.text()).not.toBe(value);
        });
      });
    });

    it('修改字段域内容,验证成功，点击外部',function(){
      editor.cancel();
      var textEl = $('#e1'),
        value = '200';
      textEl.trigger('click');
      waits(100);
      runs(function(){
        field.set('value',value);
        $('#outer').trigger('mousedown');
        waits(100);
        runs(function(){
          expect(editor.get('visible')).toBe(false);
          expect(textEl.text()).toBe(value);
        });
      });
    });
  });

  describe('测试事件',function(){

    it('测试触发accept事件',function(){
      var callback = jasmine.createSpy();
      editor.on('accept',callback);
      var textEl = $('#e1'),
        value = '200';
      textEl.trigger('click');
      waits(100);
      runs(function(){
        $('#outer').trigger('mousedown');
        waits(100);
        runs(function(){
          expect(callback).toHaveBeenCalled();
        });
      });
    });

    it('测试触发cancel事件',function(){
      var callback = jasmine.createSpy();
      editor.on('cancel',callback);
      var textEl = $('#e1'),
        value = '200';
      textEl.trigger('click');
      waits(100);
      runs(function(){
        editor.cancel();
        expect(callback).toHaveBeenCalled();
      });
    });
  });
  
});
/**/

BUI.use('bui/editor',function(Editor){

  function getValue(obj,text){
    var rst = text;
    BUI.each(obj,function(v,k){
      if(v == text){
        rst = k;
        return false;
      }
    });
    return rst;
  }
  var items = {'1' : '通过','2':'不通过'},
    editor = new Editor.Editor({
    trigger : '.edit-sel',
    field : {
      xtype : 'select',
      items : items
    },
    parser : function(text){
      return getValue(items,text);
    },
    formatter : function(text){
      return items[text];
    }
  });

  editor.render();
  var select;

  describe('测试编辑器生成',function(){
    it('测试select选项',function(){
      waits(100);
      runs(function(){
        select = editor.get('field').get('select');
        var list = select.get('list');
        expect(list).not.toBe(undefined);

        expect(list.getItemCount()).toBe(2);
      });
      
    });

  });

  describe('操作',function(){
    var s1El = $('#s1');
    it('编辑文本,测试展示值',function(){
      s1El.trigger('click');
      waits(100);
      runs(function(){
        expect(editor.get('visible')).toBe(true);
        expect(select.getSelectedText()).toBe(s1El.text());
      });
    });
    it('更改选项',function(){
      var preText = s1El.text();
      select.setSelectedValue('2');
      editor.accept();
      expect(editor.get('visible')).not.toBe(true);
      expect(s1El.text()).toBe(select.getSelectedText());
      expect(preText).not.toBe(s1El.text());
    });
  });


});