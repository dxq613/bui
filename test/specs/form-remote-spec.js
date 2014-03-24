//文本域
BUI.use('bui/form/basefield',function  (Field) {
  var tpl = ' <label class="control-label">{label}</label>\
                <div class="controls">\
                </div>';
    
  describe('测试控件生成',function(){

    var textField = new Field({
        name : 'a',
        render : '#row',
        label : '测试字段',
        elCls : 'control-group span16',
        value : '默认文本',
        tip : {
          text : '请填写内容'
        },
        controlContainer : '.controls',
        tpl : tpl,
        rules : {
          required : true
        },
        remote : 'data/remote.php'
      });

    textField.render();

    var el = textField.get('el');

    describe('测试初始化',function () {
      it('初始化不进行异步验证',function () {
        waits(600);
        runs(function () {
          expect(!!textField.get('error')).toBe(false);
          expect(textField.get('isLoading')).toBe(false);
        });
        
      });
    });

    describe('修改值，测试异步验证',function () {

      it('清空数据,不进行验证',function () {
        textField.set('value','');
        waits(600);
        runs(function () {
          expect(!!textField.get('error')).not.toBe(false);
          expect(textField.get('isLoading')).toBe(false);
        });
      });

      it('设置数据长度等于5，测试验证成功',function () {
        textField.set('value','12345');
        waits(600);
        runs(function () {
          expect(!!textField.get('error')).toBe(false);
        });
      });

      it('设置数据长度等于11·，测试验证失败',function () {
        textField.set('value','12345678910');
        waits(600);
        runs(function () {
          expect(!!textField.get('error')).toBe(false);
          expect(textField.get('isLoading')).toBe(true);
          waits(4000);
          runs(function () {
            expect(!!textField.get('error')).not.toBe(false);
            expect(textField.get('isLoading')).toBe(false);
          });
        });
      });

      it('禁止校验',function(){
        textField.set('pauseValid',true);
        textField.set('value','123456789102');
        waits(600);
        runs(function () {
          expect(!!textField.get('error')).toBe(false);
          expect(textField.get('isLoading')).toBe(false);
        });
      });

      it('设置数据长度等于12，9，测试验证取消，测试验证成功',function () {
        textField.set('pauseValid',false);
        textField.set('value','123456789101');
        waits(600);
        runs(function () {
          expect(textField.get('isLoading')).toBe(true);
          textField.set('value','123456');
          expect(textField.get('isLoading')).toBe(false);
          waits(1000);
          runs(function () {
            expect(!!textField.get('error')).toBe(false);
            expect(textField.get('isLoading')).toBe(false);
          });
        });
      });

      it('测试缓存',function(){
        textField.set('value','12345678910');
        expect(!!textField.get('error')).not.toBe(false);
        expect(textField.get('isLoading')).toBe(false);

      });

      /**/
    });
  }); 
});