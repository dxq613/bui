
BUI.use('bui/form',function (Form) {
  $('<div class="issue" id="issue102"><h3>issue102</h3></div>').appendTo('body');
  var form = new Form.Form({
    render : '#issue102',
    children : [
      {xtype :'number', name:'a',value:123}
    ]
  });

  form.render();
  var  field = form.getField('a');
  describe('issue102,测试验证失败时修改值',function(){
    it('出错',function(){
      form.valid();
      expect(form.isValid()).toBe(true)
      var
        control = field.getInnerControl();

      control.val('abc');
      form.valid();
      expect(form.isValid()).toBe(false);
    });

    it('修改值',function(){
      field.clearErrors(true);
      field.set('value',123);
      expect(form.isValid()).toBe(true);
    });
  });
});