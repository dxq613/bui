
BUI.use('bui/form',function (Form) {
    var HForm = Form.HForm,
      record = {a:'123',b:'256',c:'222',e1: new Date()},
    buttons = [
      {
        btnCls : 'button button-primary',
        text : '保存',
        handler : function(){
          form.submit();
        }
      },
      {
        btnCls : 'button',
        text : '重置',
        handler : function(){
          form.reset();
        }
      }
    ],
    items1 = [{
      label : '文本1',
      name : 'a',
      tip:{
        text :'请输入文本'
      }
    },{
      label : '文本2',
      allowBlank : false,
      name : 'b'
    },{
      name : 'c',
      xclass:'form-field-hidden'
    }],
    items2 = [
    {
      id : 'group',
      xclass : 'form-group',
      label : '日期',
      elCls : 'control-group span20',
      defaultChildCfg : {
        xclass : 'form-field-date',
        datePicker : {
            showTime : true
        },
        elCls : 'pull-left'
      },
      validator : function(obj){
        if(obj.e1 && !obj.e2){
          return '填写起始日期后，结束日期不能为空';
        }
        if(obj.e1 > obj.e2){
          return '结束时间不能大于起始时间'
        }
      },
      children:[
        {
          name : 'e1',
          tpl : ''
        },
        {
          label : '&nbsp;-&nbsp;',
          name : 'e2'
        }
      ]
      
    }],
    form = new HForm({
      render : '#f2',
      initRecord : record,
      buttons : buttons,
      errorTpl : '<span>{error}</span>',
      children : [
        {
          children : items1
        },{
          children : items2
        },{
          children : [
            {
              label : '选择1',
              xclass : 'form-field-select',
              tip : {
                text : '请选择'
              },
              select : {
                items : [
                  {text:'选项1',value:'a'},
                  {text:'选项2',value:'b'},
                  {text:'选项3',value:'c'}
                ]
              },
              name : 'f'
            },
             {
              label : '选择2',
              xclass : 'form-field-select',
              select : {
                items : [
                  {text:'选项1',value:'a'},
                  {text:'选项2',value:'b'},
                  {text:'选项3',value:'c'}
                ]
              },
              name : 'g'
            }
          ]
        }
      ]
    });

  form.render();
  var el = form.get('el');

  describe('测试水平表单生成',function(){

    it('测试表单生成',function(){
      expect(el.length).toBe(1);
    });
    it('测试行',function(){
      expect(el.find('.bui-form-row').length).toBe(form.get('children').length);
    });
    it('测试分组',function(){
      expect(el.find('.bui-form-group').length).not.toBe(0);
      var group = form.getChild('group',true);
      expect(group).not.toBe(null);
      expect(group.get('children').length).not.toBe(0);

    });

  });

  describe('测试验证出错',function(){
    
    it('测试验证出错',function(){
      var group = form.getChild('group',true);
      expect(group.isValid()).toBe(false);
      expect(group.getErrors().length).not.toBe(0);
    });

    it('测试验证改变事件触发',function(){
      var group = form.getChild('group',true);
      var field2 = group.getField('e2'),
        callback = jasmine.createSpy();
      field2.set('value','122');
      group.on('validchange',callback);
      field2.set('value',new Date('2013/12/01'));
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(group.isValid()).toBe(true);
      });
    });
  });
});