
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

  new Form.HForm({
    srcNode:'#J_Form'
  }).render();

});
/**/