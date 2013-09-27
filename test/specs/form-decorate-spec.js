
BUI.use('bui/form',function (Form) {

  var record = {a:'123',b:'256',c:'0',c1:'0'},
    form = new Form.Form({
      srcNode : '#f3',
      initRecord : record,
      messages : {
        a : {
          number:'不是我们要求的数字！'
        }
      },
      validators : {
        '#g1' : function(record){
          if(parseFloat(record.a) > parseFloat(record.b)){
            return 'a 不能大于 b';
          }
        },
        a:function(value){
          if(value == '12'){
            alert(23);
          }
        }
      }
    });

  form.render();

  var el = form.get('el');

  describe('测试表单生成',function(){
    it('测试配置项',function(){
      expect(form.get('action')).toBe(el.attr('action'));
      expect(form.get('method')).toBe(el.attr('method'));
    });
    it('测试group生成',function(){
      var group = form.getChild('g1');
      expect(group).not.toBe(null);
    });
  });
  
  describe('测试表单字段域',function(){

    it('测试字段默认禁用',function(){
      var name = 'a',
        field = form.getField('a');

      field.disable();
      expect(field.get('disabled')).toBe(true);
      expect(!!field.get('control').attr('disabled')).toBe(true);

      field.enable();
      expect(field.get('disabled')).toBe(false);
      expect(!!field.get('control').attr('disabled')).toBe(false);
    });

    it('测试group禁用',function(){

      var group = form.getChild('g1');
      group.disable();
      var fields = group.getFields();
      BUI.each(fields,function(field){
        expect(field.get('disabled')).toBe(true);
        expect(!!field.get('control').attr('disabled')).toBe(true);
      });
    });

    it('测试group取消禁用',function(){
      var group = form.getChild('g1');
      group.enable();
      var fields = group.getFields();
      BUI.each(fields,function(field){
        expect(field.get('disabled')).toBe(false);
        expect(!!field.get('control').attr('disabled')).toBe(false);
      });
    });

    it('测试group设置应用验证',function(){
      var group = form.getChild('g1');
      expect(group.get('validator')).not.toBe(undefined);
    });

    it('测试字段设置应用验证',function(){
      var field = form.getField('a');
      expect(field.get('validator')).not.toBe(undefined);
    });

    it('测试设置group值',function(){
      var group = form.getChild('g1');
      group.setRecord({a:20,b:10});
    });

    it('测试清理group值',function(){
      var group = form.getChild('g1');
      group.clearFields();
    });
  });
  /**/
});

BUI.use('bui/form',function(Form){

  var form = new Form.HForm({
    srcNode:'#J_Form',
    defaultChildCfg : {
      firstValidEvent : ''
    }
  }).render();

  describe('select',function(){
    it('测试一般select',function(){
      var select = form.getField('type');
      expect(select).not.toBe(null);
      expect(select.get('value')).toBe('large');
    });


    it('测试单选select',function(){
      var select = form.getField('select'),
      innerSelect = select.get('select');
      expect(select).not.toBe(null);
      expect(select.get('value')).not.toBe('');
      expect(innerSelect.getSelectedValue()).toBe(select.get('value'));
    });


    it('测试单选select，对象格式',function(){
      var select = form.getField('select0'),
      innerSelect = select.get('select');
      expect(select).not.toBe(null);
      expect(select.get('value')).not.toBe('');
      expect(innerSelect.getSelectedValue()).toBe(select.get('value'));
    });

    it('测试多选select',function(){
      var select = form.getField('m_select'),
      innerSelect = select.get('select');
      expect(select).not.toBe(null);
      expect(select.get('value')).not.toBe('');
      expect(innerSelect.getSelectedValue()).toBe(select.get('value'));
    });

    it('测试多选对象格式',function(){

    });
  });
});
/**/