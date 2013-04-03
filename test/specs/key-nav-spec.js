
BUI.use('bui/common',function  () {
  var Component = BUI.Component,
    KeyCode = BUI.KeyCode,
    UIBase = Component.UIBase;
  var Control = Component.Controller.extend([UIBase.KeyNav],{
    handleNavEnter : function(ev){
      BUI.log(ev.target);
    }
  },{
    xclass:'test-control'
  });

  var control = new Control({
    render : '#c',
    width:100,
    height:100,
    children:[
      {
        height:10,
        xclass:'test-control'
      },
      {
        height:10,
        focusable : true,
        xclass:'test-control'
      },
      {
        height:10,
        xclass:'test-control'
      }
    ],
    focusable : true,
    autoRender : true
  });

  var el = control.get('el');
  describe('测试按键',function(){
    it('测试enter键',function(){
      spyOn(control, 'handleNavEnter').andCallThrough();
       jasmine.simulate(el[0],'keydown',{charCode : KeyCode.ENTER});
      expect(control.handleNavEnter).toHaveBeenCalled();;
    });
    it('测试left键',function(){
      spyOn(control, 'handleNavLeft').andCallThrough();
      //el.trigger('keydown',{which : KeyCode.LEFT});
      jasmine.simulate(el[0],'keydown',{charCode : KeyCode.LEFT});
      expect(control.handleNavLeft).toHaveBeenCalled();;
    });
    it('测试right键',function(){
      spyOn(control, 'handleNavRight').andCallThrough();
       jasmine.simulate(el[0],'keydown',{charCode : KeyCode.RIGHT});
      expect(control.handleNavRight).toHaveBeenCalled();;
    });
    it('测试down键',function(){
      spyOn(control, 'handleNavDown').andCallThrough();
       jasmine.simulate(el[0],'keydown',{charCode : KeyCode.DOWN});
      expect(control.handleNavDown).toHaveBeenCalled();;
    });
    it('测试up键',function(){
      spyOn(control, 'handleNavUp').andCallThrough();
       jasmine.simulate(el[0],'keydown',{charCode : KeyCode.UP});
      expect(control.handleNavUp).toHaveBeenCalled();;
    });
    it('测试esc键',function(){
      spyOn(control, 'handleNavEsc').andCallThrough();
       jasmine.simulate(el[0],'keydown',{charCode : KeyCode.ESC});
      expect(control.handleNavEsc).toHaveBeenCalled();;
    });
    it('测试tab键',function(){
      spyOn(control, 'handleNavTab').andCallThrough();
       jasmine.simulate(el[0],'keydown',{charCode : KeyCode.TAB});
      expect(control.handleNavTab).toHaveBeenCalled();;
    });
  });
});