
BUI.use('bui/form',function (Form) {
  
  describe('测试日期范围分组',function () {
    var group = new Form.Group( {
        srcNode : '#g1',
        rules : {
          dateRange : true
        }
      });
    group.render();

    var el = group.get('el');
    it('测试初始化',function () {
      expect(el.length).not.toBe(0);
      expect(group.get('children').length).toBe(2);
    })
    it('测试设置初始日期',function () {
      var record = {start: new Date('2001/01/01 00:00:00'),end: new Date('2002/01/01 00:00:00')};
      group.setRecord(record);
      /* */
      expect(group.getField('start').get('value')).toBe(record.start);
      expect(group.getField('end').get('value')).toBe(record.end);
     
      expect(group.isValid()).toBe(true);
    });

    it('测试修改日期，验证失败',function () {
      var record = {start: new Date('2001/01/01'),end:new Date('2000/01/01')};
      group.setRecord(record);

      expect(group.isValid()).toBe(false);
    });

    it('测试修改日期，验证成功',function () {
      var record = {start: new Date('2001/01/01'),end:'2002/01/01'};
      group.setRecord(record);

      expect(group.isValid()).toBe(true);
    });

  });

  describe('测试数字范围分组',function () {
    var group = new Form.Group( {
        srcNode : '#g2',
        rules : {
          numberRange : {equals:false}
        },
        messages : {
          numberRange : '起始年龄不能大于等于结束年龄！'
        }
      });
    group.render();
    var el = group.get('el');
    it('测试初始化',function () {
      expect(el.length).not.toBe(0);
      expect(group.get('children').length).toBe(2);
    });

    it('测试设置值',function () {
      var record = {start:3,end:5};
      group.setRecord(record);

      expect(group.getField('start').get('value')).toBe(record.start);
      expect(group.getField('end').get('value')).toBe(record.end);

      expect(group.isValid()).toBe(true);
    });

     it('测试修改值，验证失败',function () {
      var record = {start:5,end:3};
      group.setRecord(record);

      expect(group.isValid()).toBe(false);
    });

    it('测试修改值，验证成功',function () {
      var record = {start:3,end:5};
      group.setRecord(record);

      expect(group.isValid()).toBe(true);
    });
  });

  describe('测试复选框分组',function () {
    var group = new Form.Group( {
        srcNode : '#g3'
      });
    group.render();
    var el = group.get('el');
    it('测试初始化',function () {
      expect(el.length).not.toBe(0);
      expect(group.get('children').length).toBe(5);
    });

    it('测试设置值',function () {
      var record = {ck:'1'};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });

    it('测试修改值，设置至少选一个，验证失败',function () {
      group.set('range',1);
      group.set('rangeText','请至少选择一项！');
      var record = {ck:''};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);
    });

    it('测试修改值，设置至少选一个，验证成功',function () {
      var record = {ck:'1'};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);

      var record = {ck:['1','2']};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });
  });

  describe('测试复选框分组,只能选择一个',function () {
    var group = new Form.Group({
        srcNode : '#g4'
      });
    group.render();

    it('测试修改值，设置只能选一个，验证成功',function () {
      var record = {ck:'1'};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });

    it('测试修改值，设置只能选一个，验证失败',function () {
      var record = {ck:['1','2']};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);

      var record = {ck:['2']};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);

      var record = {ck:['2','3']};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);

      var record = {ck:''};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);
    });
  });

  describe('测试复选框分组,只能选择2个',function () {
    var group = new Form.Group({
        srcNode : '#g5'
      });
    group.render();

    it('测试修改值，验证成功',function () {
      var record = {ck:['1','2']};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });

    it('测试修改值,设置少于2个值，验证失败',function () {
      var record = {ck:['1']};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);

      var record = {ck:''};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);
    });

    it('测试修改值,设置大于2个值，验证失败',function () {
      var record = {ck:['1','2','3']};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);

      var record = {ck:['1','2']};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });

  });

  describe('测试复选框分组,只能选择2-4个',function () {
    var group = new Form.Group({
        srcNode : '#g6'
      });
    group.render();

    it('测试修改值，设置少于2个',function () {
      var record = {ck:['1']};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);

      var record = {ck:''};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);
    });

    it('测试修改值，设置等于2个',function () {
      var record = {ck:['1','2']};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });

    it('测试修改值，设置3-4个',function () {
       var record = {ck:['1','2','3']};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);

      var record = {ck:['1','2','3','4']};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });

    it('测试修改值，设置多于4个',function () {
      var record = {ck:['1','2','3','4','5']};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);
    });
  });

  describe('测试复选框分组,只能选择2-4个',function () {
    var group = new Form.Group.Check({
        srcNode : '#g61'
      });
    group.render();

    it('')
  });

  describe('测试单选框分组',function () {
    var group = new Form.Group({
        srcNode : '#g7'
      });
    group.render();

    it('测试修改值，设置只能选一个，验证成功',function () {
      var record = {ck:'1'};
      group.setRecord(record);
      expect(group.isValid()).toBe(true);
    });

    it('测试修改值，设置未选中，验证失败',function () {
      var record = {ck:''};
      group.setRecord(record);
      expect(group.isValid()).toBe(false);
    });
  });
/**/
  
});

BUI.use(["bui/form",'bui/form/group/select'],function(Form,Select){


  (function(){
    var group = new Select({
      srcNode : '#g8'
    });
    group.render();
    describe('测试级联选择框分组',function () {
      it('测试初始化',function(){
        waits(600);
        runs(function(){
          var fields = group.getFields();
          BUI.each(fields,function(field){
            expect(field.get('value')).toBe(field.getControlValue());
          });
        });
      });

      it('测试清空值',function(){
        var field = group.getFieldAt(0);
        field.set('value','');

        var fields = group.getFields();
        BUI.each(fields,function(field){
          expect(field.get('value')).toBe(field.getControlValue());
          expect(field.get('value')).toBe('');
        });
      });

      it('测试更改值',function(){
        var f1 = group.getFieldAt(0);
        f1.set('value','1');
        var f2 = group.getFieldAt(1);
        f2.set('value','12');
        var f3 = group.getFieldAt(2);
        f3.set('value','121');
        var fields = group.getFields();
        BUI.each(fields,function(field){
          expect(field.get('value')).toBe(field.getControlValue());
        });
      });
    });

  })();
  
  (function(){
    
    var group = new Select({
      srcNode : '#g9'
    });
    group.render();
    
    var data = [{"id" : "1","text":"山东","children":[
      {"id":"11","text":"济南","leaf":false},
      {"id":"12","text":"淄博","leaf":false,"children":[
        {"id":"121","text":"高青","leaf":true}
      ]}
    ]}];
    BUI.Form.Group.Select.addType('test',{
      data : data
    });
    new Select({
      srcNode : '#g10'
    }).render();
  })();  
});
/**/