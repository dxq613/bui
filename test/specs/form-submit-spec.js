
BUI.use('bui/form',function (Form) {

  var form = new Form.HForm({
    srcNode : '#form',
    submitType : 'ajax'
  });
  form.render();

  describe('测试异步提交',function(){

    describe('测试初始化',function(){

      it('测试submit mask',function(){
        waits(100);
        expect(!!form.get('submitMask').show).toBe(true);
      });

    });

    describe('测试',function(){

      it('验证未通过',function(){
        var callback = jasmine.createSpy();
        form.submit({
          success : callback
        });
        expect(form.isValid()).toBe(false);
        waits(100);
        runs(function(){
          expect(callback).not.toHaveBeenCalled();
          //form.getField('id').
        });
      });

      it('验证通过，显示mask',function(){
        form.set('record',{id : '12345',type:'saler',select : '2'});
        var callback = jasmine.createSpy();
        form.submit({
          success : callback
        });
        expect(form.isValid()).toBe(true);
        waits(100);
        runs(function(){
          expect(callback).toHaveBeenCalled();
        });
      });

    })
  });
});


BUI.use('bui/form',function (Form) {
  
});