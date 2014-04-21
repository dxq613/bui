
//文本域
BUI.use('bui/form/textfield',function  (TextField) {
  var tpl = ' <label class="control-label">{label}</label>\
                <div class="controls">\
                </div>';
    
  describe('测试控件生成',function(){

    var textField = new TextField({
        render : '#row',
        label : '测试字段',
        elCls : 'control-group span8',
        value : '默认文本',
        tip : {
          text : '请填写内容'
        },
        controlContainer : '.controls',
        validator : function(){
          return 'error';
        },
        tpl : tpl
      });

    textField.render();

    var el = textField.get('el');

    it('测试label',function(){
      expect(el.find('label').first().text()).toBe(textField.get('label'));
    });

    it('测试value',function(){
      expect(textField.getInnerControl().val()).toBe(textField.get('value'));
    });

    it('测试name',function(){
      expect(textField.getInnerControl().attr('name')).toBe(textField.get('name'));
    });

    it('测试模板',function(){
      expect(el.find('.control-label').length).not.toBe(0);
    });

    it('测试初始化验证不通过',function(){
      if(!textField.get('value')){
        expect(textField.get('error')).toBe('error');
      }
    });

    it('禁用验证',function(){
      textField.set('pauseValid',true);
      textField.valid();
      expect(textField.get('error')).toBe(null);

      textField.set('pauseValid',false);
      textField.valid();
      expect(textField.get('error')).not.toBe(null);
    })

    it('验证不通过时,禁用字段',function(){
      textField.disable();
      expect(textField.get('error')).toBe(null);
    });

    it('验证不通过时,恢复禁用字段',function(){
      textField.enable();
      expect(textField.get('error')).toBe('error');
    });


    it('测试Tip提示',function(){
      var tip = textField.get('tip');
      expect(tip.get('visible')).toBe(false);
    });

    it('测试Tip提示显示',function(){
      textField.set('value','');
      var tip = textField.get('tip');
      expect(tip.get('visible')).toBe(true);
    });

/**/
  }); 
});

//文本域
BUI.use(['bui/form/textfield','bui/form/rules'],function  (TextField,Rules) {

  var tpl = ' <label class="control-label">{label}</label>\
                <div class="controls">\
                </div>';
  var textField = new TextField({
        render : '#row',
        label : '测试字段',
        elCls : 'control-group span8',
        tip : {
          text : '请填写内容'
        },
        controlContainer : '.controls',
        errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>',
        rules : {
          required : true,
          min : 5,
          max : 10
        },
        tpl : tpl
      });

    textField.render();

    var el = textField.get('el');
  
  describe('测试控件验证Rules',function(){
    it('验证必填',function(){
      expect(textField.get('error')).toBe(undefined);
      textField.valid();
      expect(textField.get('error')).toBe(Rules.get('required').get('msg'));
    });

    it('验证最小值',function(){
      textField.set('value',4);
      expect(textField.get('error').substring('5')).not.toBe(-1);
      textField.set('value',5);
    });

    it('验证最大值',function(){
      textField.set('value',12);
      expect(textField.get('error').substring('10')).not.toBe(-1);
    });

  }); 
});




//文本域测试方法事件
BUI.use('bui/form/textfield',function  (TextField) {

  var tpl = ' <label class="control-label">{label}</label>\
                <div class="controls">\
                </div>';
      
  var msg = '不能大于200！',
      textField = new TextField({
      render : '#row',
      label : '测试字段',
      elCls : 'control-group span8',
      value : '默认文本',
      controlContainer : '.controls',
      errorTpl : '<span class="x-icon x-icon-mini x-icon-error" title="{error}">!</span>',
      //errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>',
      validator : function(val){
        var num = parseInt(val);
        if(num > 200){
          return msg;
        }
      },
      tpl : tpl
    });

    textField.render();
    var el = textField.get('el');

  describe('测试字段域赋值、验证',function(){

    it('更改值',function(){
      var val = '124';
      textField.set('value',val);
      expect(el.find('input').val()).toBe(textField.get('value'));
      expect(el.find('input').val()).toBe(val);
    });
    it('测试验证通过',function(){
      expect(textField.get('error')).toBe(null);
    });
    it('更改值,测试验证失败',function(){
      var val = 201;
      textField.set('value',val);
      expect(textField.get('error')).toBe(msg);
      expect(textField.get('el').hasClass('bui-form-field-error')).toBe(true);
    });
  });

  describe('测试字段域事件',function(){

    it('测试keyup事件',function(){
      var control = el.find('input'),
        callback = jasmine.createSpy();
      textField.on('error',callback);
      jasmine.simulate(control[0],'keyup');
      waits(100);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        textField.off('error',callback);
      });
      
    });

    it('测试函数触发change事件',function(){
      var callback = jasmine.createSpy();

      textField.on('change',callback);
      textField.set('value',200);
      textField.change();
      waits(100);
      runs(function(){
        expect(callback).toHaveBeenCalled();
      });
      textField.off('change',callback);
    });

    it('测试函数触发error事件',function(){
      var callback = jasmine.createSpy();
      textField.on('error',callback);
      textField.set('value',300);
      waits(100);
      runs(function(){
        expect(callback).toHaveBeenCalled();
      });
      textField.off('error',callback);
    });

    it('测试清除错误',function(){
      textField.clearErrors();
      var control = el.find('input');
      expect(control.val()).toBe(textField.get('value').toString());
      expect(textField.get('error')).toBe(null);
      expect(textField.isValid()).toBe(true);
      textField.set('value',300);
    });

    it('测试函数触发valid事件',function(){
      var callback = jasmine.createSpy();
      textField.on('valid',callback);
      textField.set('value',30);
      waits(100);
      runs(function(){
        expect(callback).toHaveBeenCalled();
      });
      textField.off('valid',callback);
    });
  });

});

BUI.use('bui/form/textareafield',function(TextAreaField){
  var tpl = ' <label class="control-label">{label}</label>\
                <div class="controls">\
                </div>';
      
  var textField = new TextAreaField({
      render : '#row',
      label : '测试字段',
      elCls : 'control-group span8',
      value : '默认文本',
      rows : 10,
      cols : 30,
      controlContainer : '.controls',
      tpl : tpl
    });

  textField.render();

  var inputEl = textField.getInnerControl();
  
  describe('测试textarea',function(){

    it('测试行',function(){
      expect(inputEl.attr('rows')).toBe('10');
    });
    it('测试列',function(){
      expect(inputEl.attr('cols')).toBe('30');
    });
  });

});

//数字域
BUI.use('bui/form/numberfield',function  (NumberField) {
  var tpl = ' <label class="control-label">{label}</label>\
              <div class="controls">\
              </div>';
  var msg = '不能大于200！',
    numberField = new NumberField({
    render : '#row',
    label : '数字字段',
    elCls : 'control-group span8',
    controlContainer : '.controls',
    value : 100,
    errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>',
    validator : function(val){
      if(val > 200){
        return msg;
      }
    },
    tpl : tpl
  });
  numberField.render();
  var el = numberField.get('el');

  describe('测试数字域生成',function(){
    it('测试默认值',function(){
      expect(numberField.get('value')).toBe(100);
      expect(el.find('input').val()).toBe('100');
    });
  });

  describe('测试数字域操作',function(){
    it('测试设置整数',function(){
      var val = 100;
      el.find('input').val(val);
      numberField.validControl();
      numberField.change();
      waits(100);
      runs(function(){
        expect(numberField.get('value')).toBe(val);
      });
    });
    it('测试设置小数',function(){
      var val = 100.345;
      el.find('input').val(val);
      numberField.validControl();
      numberField.change();
      waits(100);
      runs(function(){
        expect(numberField.get('value')).not.toBe(val);
        expect(numberField.get('value')).toBe(parseFloat(val.toFixed(2)));
      });
    });

    it('设置空值',function(){
      var val = '';
      numberField.set('value','');
      numberField.validControl();
      expect(numberField.get('value')).toBe(null);
    });

    it('测试设置非数字',function(){
      var val = '100qqq',
        preVal = numberField.get('value');
      el.find('input').val(val);
      numberField.validControl();
      numberField.change();
      waits(100);
      runs(function(){
        expect(numberField.get('value')).toBe(preVal);
        expect(!!numberField.get('error')).not.toBe(false);
      });
    });
  });

  describe('测试数字域验证',function(){

    it('测试验证成功',function(){
      var val = 101;
      numberField.set('value',val);
      expect(numberField.get('error')).toBe(null);
      
    });
    it('测试验证失败',function(){
      var val = 201;
      numberField.set('value',val);
      expect(numberField.get('error')).not.toBe(null);
    });

  });

});


//日期域
BUI.use(['bui/form/datefield','bui/calendar'],function  (DateField) {

  var tpl = ' <label class="control-label">{label}</label>\
              <div class="controls">\
              </div>';
  var DateUtil = BUI.Date,
    date = new Date();
   
  var  dateField = new DateField({
      render : '#row1',
      label : '日期字段',
      elCls : 'control-group span12',
      datePicker : {
        showTime : true
      },
      min : new Date('2012/12/01'),
      max : new Date('2013/01/01'),
      value : date,
      controlContainer : '.controls',
      errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>',
      tpl : tpl
    });
  dateField.render();
  var el = dateField.get('el'),
    datePicker;
  describe('测试日期域的生成',function(){
    it('等待测试日历',function(){
      waits(200);
      runs(function(){
        datePicker = dateField.get('datePicker');
          datePicker._initControl();
      });
    });
    it('验证日期控件的生成',function(){
      expect(el.length).not.toBe(0);
      expect(datePicker).not.toBe(null);
      expect(datePicker.get('calendar')).not.toBe(null);
    });
    it('验证日期控件的初始值',function(){
      expect(DateUtil.isDateEquals(dateField.get('value'),date)).toBe(true);
      var selDate = datePicker.get('calendar').get('selectedDate');
      expect(DateUtil.isDateEquals(date,selDate)).toBe(true);
    });
  });

  describe('测试日期操作',function(){
    it('通过日期域更改日期',function(){
      var newDate = DateUtil.addDay(1,date);
      dateField.set('value',newDate);
      var val = el.find('input').val();
      expect(DateUtil.format(newDate,dateField._getFormatMask())).toBe(val);
    });
    it('通过DOM更改日期',function(){
      var newDate = DateUtil.addDay(2,date);
      var val = el.find('input').val(DateUtil.format(newDate,dateField._getFormatMask()));
      dateField.validControl();
      dateField.change();
      waits(100);
      runs(function(){
        var value = dateField.get('value');
        expect(DateUtil.isDateEquals(value,newDate)).toBe(true);
      });
    });
    it('通过日期控件更改日期',function(){

    });
  });

  describe('测试日期验证',function(){
    it('验证正确日期',function(){
       expect(dateField.get('error')).toBe(null);
    });
    it('验证错误日期',function(){
      var val = 'xxxx';
      dateField.set('value',val);
      expect(dateField.get('error')).not.toBe(null);
    });
  });

});

//日期域
BUI.use('bui/form/datefield',function  (DateField) {

  var tpl = ' <label class="control-label">{label}</label>\
              <div class="controls">\
              </div>';
  var DateUtil = BUI.Date,
    date = new Date();
   
  var  dateField = new DateField({
      render : '#row1',
      label : '日期字段',
      elCls : 'control-group span12',
      datePicker : {
        showTime : true
      },
      value : date,
      controlContainer : '.controls',
      errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>',
      tpl : tpl
    });
  dateField.render();
  var el = dateField.get('el'),
    datePicker = dateField.get('datePicker');
  describe('测试日期域的销毁',function(){
    it('等待测试日历',function(){
      waits(200);
      runs(function(){
        datePicker = dateField.get('datePicker');
          datePicker._initControl();
      });
    });
    it('测试数字日期值',function(){
      var date = new Date(),
        value = date.getTime();
      dateField.set('value',value);
      expect(datePicker).not.toBe(undefined);
      expect(datePicker).not.toBe(null);
      expect(DateUtil.isDateEquals(date,dateField.get('value'))).toBe(true);
    });
    it('验证日期域的销毁',function(){
      dateField.destroy();
      expect(datePicker.destroyed).toBe(true);
    });

  }); 

});

//单选框
BUI.use('bui/form/selectfield',function  (SelectField) {

  var tpl = ' <label class="control-label">{label}</label>\
              <div class="controls">\
              </div>';
 
   
  var  data =  [
          {text:'选项1',value:'a'},
          {text:'选项2',value:'b'},
          {text:'选项3',value:'c'}
        ],
    selectField = new SelectField({
      render : '#row1',
      label : '选择字段',
      items : data,
      value : 'a',
      elCls : 'control-group span8',
      controlContainer : '.controls',
      errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>',
      tpl : tpl
    });
  selectField.render();
  
  var select = null;
  describe('测试选择框的生成',function(){

    
    it('测试初始化select控件',function(){
      waits(500);
      runs(function(){
        select = selectField.get('select');
        expect(select.isController).toBe(true);
        expect(select.get('items').length).toBe(data.length);
      });
    });

    it('测试初始化值',function(){
      expect(selectField.get('value')).toBe(select.getSelectedValue());
    });


    it('获取文本',function(){
      expect(selectField.getSelectedText()).toBe(select.getSelectedText());
    });
    
  });

  describe('测试选择框操作',function(){
    it('更改值',function(){
      var val = 'b';
      selectField.set('value',val);
      expect(select.getSelectedValue()).toBe(val);

      var val = 'c';
      selectField.set('value',val);
      expect(select.getSelectedValue()).toBe(val);
    });


    it('更改选择框值',function(){
      var val =  select.getSelectedValue();
      var items = {'a' : '选项一','b' : '选项二','c' : '选项三','d' : '选项四'};
      selectField.setItems(items);
      expect(select.getSelectedValue()).toBe(val);
    });

    it('销毁选择框',function(){
      selectField.destroy();
      expect(select.destroyed).toBe(true);
    });
  });

});

//多选框
BUI.use('bui/form/selectfield',function  (SelectField) {

  var tpl = ' <label class="control-label">{label}</label>\
              <div class="controls">\
              </div>';
 
   
  var  data =  [
          {text:'选项1',value:'a'},
          {text:'选项2',value:'b'},
          {text:'选项3',value:'c'}
        ],
    selectField = new SelectField({
      render : '#row1',
      label : '选择字段',
      items : data,
      select : {
        multipleSelect : true
      },
      value : 'a,b',
      elCls : 'control-group span8',
      controlContainer : '.controls',
      errorTpl : '<span class="valid-text"><span class="estate error"><span class="x-icon x-icon-mini x-icon-error">!</span><em>{error}</em></span></span>',
      tpl : tpl
    });
  selectField.render();
  
  var select = null;
  describe('测试选择框的生成',function(){

    it('测试初始化select控件',function(){
      waits(500);
      runs(function(){
        select = selectField.get('select');
        expect(select.getSelectedValue()).toBe(selectField.get('value'));
      });
    });

    it('设置空值',function(){
      select.setSelectedValue('');
      expect(select.getSelectedValue()).toBe('');
      var value  = 'a,c'
      select.setSelectedValue(value);  
      expect(select.getSelectedValue()).toBe(value);
    });

    it('设置值',function(){
      var value  = 'a,c'
      select.setSelectedValue(value);  
      expect(select.getSelectedValue()).toBe(value);
    });
    
  });
});

//单选框，select 标签元素
BUI.use('bui/form/selectfield',function  (SelectField) {
  var select = new SelectField({
    srcNode : '#s1',
    rules : {
      required:true
    }
  });
  select.render();
  var el = select.get('el');
  describe('测试初始化',function() {
    it('测试初始值',function () {
      var value = select.get('el').attr('value');
      expect(select.get('value')).toBe(value);
    });

    it('测试选中的文本',function(){
      expect(select.getSelectedText()).toBe('选项三');
    });
  });

  describe('测试操作',function() {
    it('重置数据',function () {
      var items = [
          {text:'选项1',value:'1'},
          {text:'选项2',value:'2'},
          {text:'选项3',value:'3'}];
      select.setItems(items);
      expect(el.val()).toBe(select.get('value'));
    });
    it('测试选中的文本',function(){
      expect(select.getSelectedText()).toBe('选项3');
    });
  });
});

//单独显示文本，不允许编辑可以格式化
BUI.use('bui/form/plainfield',function  (PlainField) {
  var tpl = ' <label class="control-label">{label}</label>\
              <div class="controls">\
              </div>',
      CLS_TEXT = 'x-form-text';

  function render(value){
    return value + '元';
  } 
  var field = new PlainField({
    render : '#row',
    label : '纯文本字段',
    elCls : 'control-group span8',
    controlContainer : '.controls',
    value : 100,
    renderer : render,
    tpl : tpl
  });
  field.render();

  function testText(){
    var el = field.get('el'),
        textEl = el.find('.' + CLS_TEXT);
      expect(textEl.length).not.toBe(0);
      expect(textEl.text()).toBe(render(field.get('value')));
  }
  describe('测试不允许编辑的纯文本字段',function(){
    it('测试初始化',function(){
      testText();
    });
    it('修改值为空',function(){
      var value = '';
      field.set('value',value);
      testText();
    });
    it('修改值不为空',function(){
      var value = '22222';
      field.set('value',value);
      testText();
    });
  });
});

BUI.use('bui/form/listfield',function(ListField){

  describe('测试JS创建列表字段',function(){
    var field = new ListField({
      render : '#row',
      label : '列表',
      elCls : 'control-group span8',
      items : {'1' : '1','2':'2'},
      list : {
        elCls : 'bui-select-list'
      },
      value : '2'
    });
    field.render();

    var list = field.get('list');
    describe('初始化',function(){
      it('测试列表初始化',function(){
        expect(!!list).not.toBe(false);
      });
      it('测试列表项',function(){
        expect(list.getItems().length).not.toBe(0);
      });
      it('测试默认值',function(){
        expect(field.getInnerControl().val()).toBe('2');
        expect(list.getSelectedValue()).toBe('2');
      })
    });

    describe('测试操作',function(){
      it('设置值',function(){
        var val = '1';
        field.set('value',val);
        expect(list.getSelectedValue()).toBe(val);
        expect(field.getInnerControl().val()).toBe(val);
      });
      it('重设记录',function(){
        var items = [{value : '1',text :'第1项'},{value : '2',text :'第2项'},{value : '3',text :'第3项'}];
        field.set('items',items);
        expect(list.getItems().length).toBe(items.length);
        expect(list.getSelectedValue()).toBe(field.get('value'));
      });
    });
  });
  describe('测试srcNode 创建列表字段',function(){
    var field = new ListField({
      srcNode : '#lf'
    });
    field.render(),
    list = field.get('list');
    it('初始化',function(){

      expect(!!list).toBe(true);
      expect(list.getItems().length).not.toBe(0);

    });
    it('选项生成',function(){
      expect(list.get('el').find('.bui-list-item').length).not.toBe(0);
    });
  });
});

BUI.use('bui/form/checklistfield',function(ListField){
  describe('测试srcNode 创建列表字段',function(){
    var field = new ListField({
        render : '#row',
        label : '可勾选列表',
        elCls : 'control-group span8',
        items : {'1' : '1','2':'2'},
        value : '2'
      });
      field.render(),
      list = field.get('list');

    it('初始化',function(){
      expect(!!list).toBe(true);
      expect(list.getItems().length).not.toBe(0);
    });
    it('选项生成',function(){
      expect(list.get('el').find('.bui-list-item').length).not.toBe(0);
    });
  });
});

BUI.use('bui/form/radiolistfield',function(ListField){
  describe('测试srcNode 创建列表字段',function(){
    var field = new ListField({
        render : '#row',
        label : '可勾选列表',
        elCls : 'control-group span8',
        items : {'1' : '1','2':'2'},
        value : '2'
      });
      field.render(),
      list = field.get('list');

    it('初始化',function(){
      expect(!!list).toBe(true);
      expect(list.getItems().length).not.toBe(0);
    });
    it('选项生成',function(){
      expect(list.get('el').find('.bui-list-item').length).not.toBe(0);
    });
  });
});



BUI.use('bui/form/checkboxfield',function(CheckBox){
  var checkbox = new CheckBox({
    render : '#row',
    label : '勾选',
    value : 'a',
    checked : true
  });
  checkbox.render();
  var el = checkbox.get('el');
  describe('生成checkbox',function(){
    it('测试初始化',function(){
      expect(el.length).toBe(1);
      expect(el.find('input').length).toBe(1);
      expect(el.find('input').attr('checked')).toBe('checked');
      expect(checkbox.get('value')).toBe('a');
      expect(el.find('input').val()).toBe('a');
    });
  });
});
/**/

/**上传组件**/
BUI.use('bui/form/uploaderfield',function(UploaderField){
  var field = new UploaderField({
    render : '#upload',
    label: '文件上传字段',
    uploader: {
    }
  });
  field.render();
  field.valid();

  describe('测试disabled状态', function(){
    it('设置disabled', function(){
      waits(100);
      field.set('disabled', true);
      
    });
  })

});
