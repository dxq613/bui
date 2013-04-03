
BUI.use('bui/common',function  (BUI) {
  
  var control = new BUI.Component.Controller({
    srcNode : '#c1',
    depends : {
      '#btn1:click':['hide','disable'],
      '#btn2:click':['show','enable'],
      '#btn3:click':function(){
        control.toggle();
      }
    }
  });
  

  describe('测试依赖初始化',function(){

    it('测试未初始化，依赖不生效',function(){
      $('#btn1').trigger('click');
      waits(100);
      runs(function(){
        expect(control.get('visible')).toBe(true);
      });
      
    });
    it('测试初始化完，依赖生效',function(){
      control.render();
      $('#btn1').trigger('click');
      waits(100);
      runs(function(){
        expect(control.get('visible')).toBe(false);
        $('#btn2').trigger('click');
        waits(100);
        runs(function(){
          expect(control.get('visible')).toBe(true);
        });
      });
    });

  });

  describe('测试依赖操作',function(){

    it('添加新依赖',function(){
      control.addDependence('#btn4:click',['disable']);
      $('#btn4').trigger('click');
      waits(100);
      runs(function(){
        expect(control.get('disabled')).toBe(true);
      });
    });
    it('移除依赖',function(){
      control.set('disabled',false);
      control.removeDependence('#btn4:click');
      $('#btn4').trigger('click');
      waits(100);
      runs(function(){
        expect(control.get('disabled')).toBe(false);
      });
    });
    it('清除所有依赖',function(){

    });
  });
});

BUI.use('bui/common',function  (BUI) {
  
  var control2 = new BUI.Component.Controller({
    srcNode : '#c2'
  });
  control2.render();
  var control3 = new BUI.Component.Controller({
    srcNode : '#c3',
    depends : {
      '#btn1:click':['hide'],
      '#c2:click' : ['show']
    }
  });
  control3.render();
  describe('测试控件间依赖',function(){

    it('点击按钮隐藏',function(){
      $('#btn1').trigger('click');
      waits(100);
      runs(function(){
        expect(control3.get('visible')).toBe(false);
      });
    });
    it('点击控件显示',function(){
      control2.fire('click');
      waits(100);
      runs(function(){
        expect(control3.get('visible')).toBe(true);
      });
    });
  });
});