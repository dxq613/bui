BUI.use(['bui/module'], function(Module){
  var Manager = Module.Manager;


  var parent = new Module({id:'parent', autoInit: true});

  describe('测试添加模块', function(){

    it('测试添加是否成功', function(){
      expect(Manager.getModule('parent')).not.toBeNull();
    });
  });

  describe('测试子模块', function(){
    var module = new Module({autoInit: true});
    parent.addModule(module);

    it('测试添加是否成功', function(){
      expect($.isEmptyObject(parent.getModules())).not.toBe(true);
    });
  });

  describe('测试子模块的事件冒泡', function(){
    var module = new Module({autoInit: true}),
      childModule = new Module({autoInit: true}),
      subModule = new Module({autoInit: true});
    childModule.addModule(subModule);
    module.addModule(childModule);
    parent.addModule(module);

    it('父module是否能监听到子module的变化事件', function(){
      var spycallback = jasmine.createSpy();
      parent.on('change', function(ev){
        spycallback();
      });
      module.fire('change');
      waits(100);
      runs(function(){
        expect(spycallback).toHaveBeenCalled();
      })
    });

    it('父module是否能监听到多层子module的变化事件', function(){
      var spycallback = jasmine.createSpy(),
        spycallback1 = jasmine.createSpy(),
        spycallback2 = jasmine.createSpy();
      parent.on('change', function(ev){
        spycallback();
      });
      module.on('change', function(ev){
        spycallback1();
      });
      childModule.on('change', function(ev){
        spycallback2();
      });
      subModule.fire('change');
      waits(100);
      runs(function(){
        expect(spycallback).toHaveBeenCalled();
        expect(spycallback1).toHaveBeenCalled();
        expect(spycallback2).toHaveBeenCalled();
        expect(spycallback.callCount).toEqual(1);
        expect(spycallback1.callCount).toEqual(1);
        expect(spycallback2.callCount).toEqual(1);
      })
    });

    it('测试事件变量的传递是否正确', function(){
      var events,
        postData = {};
      parent.on('change', function(ev){
        events = ev;
      });
      childModule.fire('change', postData);
      waits(100);
      runs(function(){
        expect(events).not.toBeUndefined();
        expect(events.eventType).toBe('change');
        expect(events.module).toBe(childModule);
        expect(events.event).toBe(postData);
      })
    });

    it('测试事件执行的次数是否正确', function(){
      var spycallback = jasmine.createSpy();
      jasmine.Clock.useMock();

      parent.on('change', function(ev){
        spycallback();
      });

      expect(spycallback).not.toHaveBeenCalled();
      subModule.fire('change');
      jasmine.Clock.tick(100);

      expect(spycallback).toHaveBeenCalled();
      expect(spycallback.callCount).toEqual(1);
    });

    it('测试Mananger是否能监听到事件', function(){
      var spycallback = jasmine.createSpy(),
        postData = {},
        events;
      jasmine.Clock.useMock();

      Manager.on('change', function(ev){
        spycallback();
        events = ev;
      });

      expect(spycallback).not.toHaveBeenCalled();
      subModule.fire('change', postData);
      jasmine.Clock.tick(100);

      //是否被调用
      expect(spycallback).toHaveBeenCalled();
      //是否只调用一次
      expect(spycallback.callCount).toEqual(1);
      //事件名否正确
      expect(events.eventType).toEqual('change');
      //触发事件的模块是否正确
      expect(events.module).toBe(subModule);
      //传递的值是否正确
      expect(events.event).toBe(postData);
    });

  });
});