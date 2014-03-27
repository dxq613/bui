
BUI.use('bui/form/rules',function (Rules) {
  
  describe('测试验证规则存在',function(){

    it('required',function(){
        expect(Rules.get('required')).not.toBe(undefined);
    });

    it('min,max',function(){
        expect(Rules.get('min')).not.toBe(undefined);
        expect(Rules.get('max')).not.toBe(undefined);
        expect(Rules.get('minlength')).not.toBe(undefined);
        expect(Rules.get('maxlength')).not.toBe(undefined);
    });
    it('number,date,email',function(){
        expect(Rules.get('number')).not.toBe(undefined);
        expect(Rules.get('email')).not.toBe(undefined);
        expect(Rules.get('date')).not.toBe(undefined);
    });

    it('equalTo,regexp',function(){
        expect(Rules.get('regexp')).not.toBe(undefined);
        expect(Rules.get('equalTo')).not.toBe(undefined);
    });

  });

  describe('测试验证规则增删改查',function(){

    it('测试添加验证',function(){
        var cfg = {
            name : 'test',
            msg : '测试信息'
        };
        Rules.add(cfg);

        var rule = Rules.get(cfg.name);
        expect(rule).not.toBe(undefined);
        expect(rule.get('name')).toBe(cfg.name);
        expect(rule.get('msg')).toBe(cfg.msg);
    });

    it('测试移除验证',function(){
        Rules.remove('test');
        expect(Rules.get('test')).toBe(undefined);
    });
    
  });

  describe('进行验证测试',function(){

    it('测试必填',function(){
        var a = '223';
        expect(Rules.isValid('required',a)).toBe(true);
        a = '   ';
        expect(Rules.isValid('required',a)).toBe(false);
        a = '';
        expect(Rules.isValid('required',a)).toBe(false);
    });
    it('测试非必填',function(){
        var a = '223';
        expect(Rules.isValid('required',a,false)).toBe(true);
        a = '   ';
        expect(Rules.isValid('required',a,false)).toBe(true);
        a = '';
        expect(Rules.isValid('required',a,false)).toBe(true);
    });

    it('测试最小值',function(){
        var val = 0,
            min = 5;
        expect(Rules.isValid('min',val,min)).toBe(false);
        val = 5;
        expect(Rules.isValid('min',val,min)).toBe(true);
        val = '5';
        expect(Rules.isValid('min',val,min)).toBe(true);

        val = 10;
        expect(Rules.isValid('min',val,min)).toBe(true);

        val = '10';
        expect(Rules.isValid('min',val,min)).toBe(true);
    });


    it('测试最小值，带有逗号',function(){
        var val = 0,
            min = 5000;
        expect(Rules.isValid('min',val,min)).toBe(false);
        val = 5000;
        expect(Rules.isValid('min',val,min)).toBe(true);
        val = '5000';
        expect(Rules.isValid('min',val,min)).toBe(true);

        val = '5,000';
        expect(Rules.isValid('min',val,min)).toBe(true);

        val = '4,000';
        expect(Rules.isValid('min',val,min)).toBe(false);
    });

    it('测试最大值',function(){
        var val = 0,
            max = 5;
        expect(Rules.isValid('max',val,max)).toBe(true);
        val = 5;
        expect(Rules.isValid('max',val,max)).toBe(true);

        val = '5';
        expect(Rules.isValid('max',val,max)).toBe(true);

        val = 10;
        expect(Rules.isValid('max',val,max)).toBe(false);

        val = '10';
        expect(Rules.isValid('max',val,max)).toBe(false);
    });

    it('测试最大值,带有逗号',function(){
        var val = 0,
            max = 5000;
        expect(Rules.isValid('max',val,max)).toBe(true);
        val = 5000;
        expect(Rules.isValid('max',val,max)).toBe(true);

        val = '5000';
        expect(Rules.isValid('max',val,max)).toBe(true);

        val = '5,000';
        expect(Rules.isValid('max',val,max)).toBe(true);

       

        val = '10,000';
        expect(Rules.isValid('max',val,max)).toBe(false);
    });

    it('测试最小长度,空格测试',function(){
        var val = '',
            minlength = 5;
        expect(Rules.isValid('minlength',val,minlength)).toBe(false);
        val = ' ';
        expect(Rules.isValid('minlength',val,minlength)).toBe(false);
        val = '      ';
        expect(Rules.isValid('minlength',val,minlength)).toBe(false);
    });

    it('测试长度,空格测试',function(){
        var val = '',
            length = 5;
        expect(Rules.isValid('length',val,length)).toBe(false);
        val = ' ';
        expect(Rules.isValid('length',val,length)).toBe(false);
        val = '      ';
        expect(Rules.isValid('length',val,length)).toBe(false);
        val = '       ';
        expect(Rules.isValid('length',val,length)).toBe(false);
    });

    it('测试长度,非空格测试',function(){
        var val = '1',
            length = 5;
        expect(Rules.isValid('length',val,length)).toBe(false);
        val = '12';
        expect(Rules.isValid('length',val,length)).toBe(false);
        val = '12345';
        expect(Rules.isValid('length',val,length)).toBe(true);
        val = '123456';
        expect(Rules.isValid('length',val,length)).toBe(false);
    });

    it('测试最小长度,非空格测试',function(){
        var val = '1',
            minlength = 5;
        expect(Rules.isValid('minlength',val,minlength)).toBe(false);
        val = '12345';
        expect(Rules.isValid('minlength',val,minlength)).toBe(true);
        val = '123456';
        expect(Rules.isValid('minlength',val,minlength)).toBe(true);
    });

    it('测试最大长度,非空格',function(){
        var val = '1',
            maxlength = 5;
        expect(Rules.isValid('maxlength',val,maxlength)).toBe(true);
        val = '12345';
        expect(Rules.isValid('maxlength',val,maxlength)).toBe(true);
        val = '123456';
        expect(Rules.isValid('maxlength',val,maxlength)).toBe(false);    
    });

    it('测试相等',function(){
        var val = 'abc',
            val1 = 'abc';
        expect(Rules.isValid('equalTo',val,val1)).toBe(true);
        val1 = 'abc ';
        expect(Rules.isValid('equalTo',val,val1)).toBe(false);

        expect(Rules.isValid('equalTo',val,val1)).toBe(false);
    });

    it('测试日期格式',function(){
        var date = '1';
        expect(Rules.isValid('date',date)).toBe(false);

        date = '';
        expect(Rules.isValid('date',date)).toBe(true);
        date = '2001-01-01';
        expect(Rules.isValid('date',date)).toBe(true);

        date = '2001-01-01 ';
        expect(Rules.isValid('date',date)).toBe(true);
    });

     it('测试日期时间格式',function(){

        var date = '2001-01-01 10';
        expect(Rules.isValid('date',date)).toBe(false);

        date = '2001-01-01 10:01:01';
        expect(Rules.isValid('date',date)).toBe(true);

        date = '2001-01-01 10:61:01';
        expect(Rules.isValid('date',date)).toBe(false);

        date = '2001-01-01 30:11:01';
        expect(Rules.isValid('date',date)).toBe(false);
     });

    it('测试日期最小值',function(){
        var minDate = '2001-01-01',
            date = '';
        expect(Rules.isValid('minDate',date,minDate)).toBe(true);

        date = 'abc';
        expect(Rules.isValid('minDate',date,minDate)).toBe(true);

        date = '2001-02-02';
        expect(Rules.isValid('minDate',date,minDate)).toBe(true);

        date = '1999-02-02';
        expect(Rules.isValid('minDate',date,minDate)).toBe(false);

        date = '2001-01-01';
        expect(Rules.isValid('minDate',date,minDate)).toBe(true);

    });

    it('测试日期最小值',function(){
        var maxDate = '2001-01-01',
            date = '';
        expect(Rules.isValid('maxDate',date,maxDate)).toBe(true);

        date = 'abc';
        expect(Rules.isValid('maxDate',date,maxDate)).toBe(true);

        date = '2001-02-02';
        expect(Rules.isValid('maxDate',date,maxDate)).toBe(false);

        date = '1999-02-02';
        expect(Rules.isValid('maxDate',date,maxDate)).toBe(true);

        date = '2001-01-01';
        expect(Rules.isValid('maxDate',date,maxDate)).toBe(true);

    });
    it('测试数字格式',function(){
        var number = '';
        expect(Rules.isValid('number',number)).toBe(true);

        number = '123';
        expect(Rules.isValid('number',number)).toBe(true);

        number = ' 123';
        expect(Rules.isValid('number',number)).toBe(true);
    });

    it('测试这则表达式',function(){
        var val = '',
            regexp = /^[a]/;
        expect(Rules.isValid('regexp',val,regexp)).toBe(false);
        val = ' ',
        expect(Rules.isValid('regexp',val,regexp)).toBe(false);

        val = 'a',
        expect(Rules.isValid('regexp',val,regexp)).toBe(true);
        val = 'a1',
        expect(Rules.isValid('regexp',val,regexp)).toBe(true);
    });

    it('测试邮箱格式',function(){
        var email = '';
        expect(Rules.isValid('email',email)).toBe(true);
        var email = 'a@sina.com';
        expect(Rules.isValid('email',email)).toBe(true);

        var email = 'a@sina';
        expect(Rules.isValid('email',email)).toBe(false);

        var email = 'sina.com';
        expect(Rules.isValid('email',email)).toBe(false);
    });

    it('测试手机号码格式',function(){
        var mobile = '';
        expect(Rules.isValid('mobile',mobile)).toBe(true);
        var mobile = '12345678901';
        expect(Rules.isValid('mobile',mobile)).toBe(true);

        var mobile = 'a12345678901';
        expect(Rules.isValid('mobile',mobile)).toBe(false);

        var mobile = 'a2345678901';
        expect(Rules.isValid('mobile',mobile)).toBe(false);
    });
  });
});