BUI.use('bui/form',function (Form) {
 
  var form = new Form.Form({
    srcNode : '#J_issue_117'
  }).render();

  describe('issue117,测试日历生成',function(){
    it('测试日历',function(){
      var field = form.getField('date');
      expect(field).not.toBe(null);
      expect(field.get('el').attr('data-cfg')).not.toBe(undefined);
    });

    it('测试最小值',function(){
      var field = form.getField('date'),
        datePicker = field.get('datePicker');
      expect(datePicker.get('minDate')).not.toBe(undefined);
    });

    it('测试最大值',function(){
      var field = form.getField('date-time'),
        datePicker = field.get('datePicker');
      expect(datePicker.get('minDate')).toBe(undefined);
      expect(datePicker.get('maxDate')).not.toBe(undefined);

    });
  });
});