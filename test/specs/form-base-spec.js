
BUI.use(['bui/form/form','bui/toolbar'],function (Form) {

  var record = {a:'123',b:'256',c:'222',d:'1'},
    buttons = [
      {
        btnCls : 'button button-primary',
        text : '保存',
        handler : function(){
          BUI.log(form.getRecord());
        }
      },
      {
        btnCls : 'button',
        text : '重置',
        handler : function(){
          alert('click reset');
        }
      }
    ],
    items = [{
      label : '文本1',
      name : 'a'
    },{
      label : '文本2',
      name : 'b'
    },{
      name : 'c',
      xclass:'form-field-hidden'
    },{
      name : 'd',
      value : '0',
      xclass : 'form-field-checkbox'
    },{
      name : 'd',
      value : '1',
      id : 'check1',
      xclass : 'form-field-checkbox'
    }],
    form = new Form({
      render : '#f1',
      initRecord : record,
      buttons : buttons,
      children : items
    });

  form.render();
  var el = form.get('el');
  describe('测试表单生成',function(){

    it('测试DOM',function(){
      expect(el.length).toBe(1);
      expect(el[0].tagName).toBe('FORM');
    });
    it('测试表单属性',function(){
      expect(el.attr('action')).toBe(form.get('action'));
      expect(el.attr('method')).toBe(form.get('method'));
    });
    it('测试表单字段生成',function(){
      expect(el.find('.bui-form-field').length).toBe(form.getFields().length);
    });

    it('测试获取表单字段',function(){
      var name = 'a',
        field = form.getField(name);
      expect(field).not.toBe(null);
    });
    it('测试表单字段值初始化',function(){
      var name = 'a',
        field = form.getField(name);
      expect(field.get('value')).toBe(record[name]);
    });
    it('测试表单按钮栏生成',function(){
      var bar = form.get('buttonBar');
      expect($.isPlainObject(bar)).toBe(false);
      expect(el.find('.bui-bar').length).not.toBe(0);
    });
    it('测试表单按钮生成',function(){
      var bar = form.get('buttonBar');
      expect(bar.get('children').length).toBe(buttons.length);
    });

    it('测试复选框',function(){
      var name = 'd';
      expect(form.getFieldValue(name)).toBe(record[name]);
      var field = form.getChild('check1');
      expect(field.get('checked')).toBe(true);
    });
  });

  describe('测试表单操作',function(){

    it('测试获取表单记录',function(){
      var data = form.getRecord();
      expect(data.a).toBe(record.a);
      expect(data.b).toBe(record.b);
    });
    it('测试表单字段改变',function(){
      var name = 'a',
        val = 'new';
      field = form.getField(name);
      field.set('value',val);
      var newRecord = form.getRecord();
      expect(form.getFieldValue(name)).toBe(val);
       expect(newRecord[name]).toBe(val);
    });

    it('测试通过表单改变字段',function(){
      var name = 'a',
        val = 'new';
      field = form.getField(name);
      form.setFieldValue(name,val);
      var newRecord = form.getRecord();
      expect(field.get('value')).toBe(val);
      expect(newRecord[name]).toBe(val);
    });
    it('更改设置表单记录',function(){
      var newRecord = {a:'newa',b:'newb',c:''};
      form.setRecord(newRecord);
      var name = 'a';
      field = form.getField(name);
      expect(field.get('value')).toBe(newRecord[name]);

      var name = 'c';
      field = form.getField(name);
      expect(field.get('value')).toBe(newRecord[name]);

    });
    it('更新表单记录',function(){
      var updateRecord = {a:'upa',b:'upb',c:'upc',d : '0'};
      form.updateRecord(updateRecord);
      var name = 'a';
      field = form.getField(name);
      expect(field.get('value')).toBe(updateRecord[name]);
      var name = 'd';
      field = form.getField(name);
      expect(field.get('value')).toBe(updateRecord[name]);
    });
    it('测试更新复选框值',function(){
      var name = 'd',
        val = ['0','1'];
      form.setFieldValue(name,val);
      expect(form.getFieldValue(name).length).toBe(val.length);
      var fields = form.getFields(name);
      expect(fields.length).toBe(2);
      BUI.each(fields,function(field){
        expect(field.get('checked')).toBe(true);
        expect(!!field.get('el').find('input').attr('checked')).toBe(true);
      });
    });
    it('测试表单验证',function(){
      var name = 'a';
      field = form.getField(name);
      field.addRule('required',true);
      field.set('value','');

      expect(form.isValid()).toBe(false);
      field.set('value','222');
      expect(form.isValid()).toBe(true);
    });

    it('测试验证失败表单提交',function(){
      var name = 'a';
      field = form.getField(name);
      field.set('value','');
      var callback = jasmine.createSpy();
      form.on('beforesubmit',callback)
      form.submit();

      expect(callback).not.toHaveBeenCalled();
      form.off('beforesubmit',callback);
    });
  
    it('测试验证成功，阻止表单提交',function(){
      var name = 'a';
      field = form.getField(name);
      field.set('value','2122');
      expect(form.isValid()).toBe(true);
      var a={
        func : function(){
          return false;
        }
      };
      spyOn(a,'func').andCallThrough();
      form.on('beforesubmit',a.func);
      form.submit();
      expect(a.func).toHaveBeenCalled();
    });
    it('测试表单同步提交',function(){

    });

    it('测试表单异步提交',function(){

    });
    it('测试表单回滚',function(){
      form.reset();
      var curRecord = form.getRecord();
      expect(curRecord.a).toBe(record.a);
      expect(curRecord.b).toBe(record.b);
    });
  });
});