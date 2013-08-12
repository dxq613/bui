BUI.use('bui/common',function (BUI) {
  var Controller = BUI.Component.Controller;

  describe('测试loader初始化',function(){

    it('测试默认不加载',function(){
      var control = new Controller({
        loader : {
          url : 'data/text',
          autoLoad : false
        }
      });
      var loader = control.get('loader')
      expect(loader.isLoader).toBe(true);
      control.render();
      expect(control.get('loader')).toBe(loader);
    });
    it('测试默认加载',function(){
      var control = new Controller({
        render : '#l1',
        loader : {
          url : 'data/text.json',
          autoLoad : true
        }
      });
      control.render();
      var el = control.get('el');
      waits(100);
      runs(function(){
        expect(el.find('p').length).not.toBe(0);
      });
    });
    it('测试通过src生成',function(){
      var control = new Controller({
        srcNode : '#l2'
      });
      control.render();
      var el = control.get('el');
      waits(100);
      runs(function(){
        expect(el.find('p').length).not.toBe(0);
      });
    });
  });

  describe('测试loader加载',function(){

    it('测试加载children',function(){
      var control = new Controller({
        render : '#l3',
        loader : {
          url : 'data/children.json',
          property : 'children',
          dataType : 'json'
        }
      });
      control.render();
      waits(100);
      runs(function(){
        expect(control.get('children').length).not.toBe(0);
        expect(control.get('children')[0].isController).toBe(true);
      });
    });

    it('测试加载自定义属性',function(){
      var control = new Controller({
        render : '#l4',
        loader : {
          url : 'data/children.json',
          property : 'items',
          dataType : 'json'
        }
      });
      control.render();
      waits(100);
      runs(function(){
        expect(control.get('items').length).not.toBe(0);
      });
    });
    it('测试回调函数',function(){
      var callback = jasmine.createSpy(),
        control = new Controller({
        render : '#l4',
        loader : {
          url : 'data/text.json',
          callback : callback
        }
      });
      control.render();
      waits(100);
      runs(function(){
        expect(callback).toHaveBeenCalled();
      });
    });

    it('测试出错',function(){

    });
    it('测试renderer',function(){
      var customText =  '修改的数据',
        control = new Controller({
        render : '#l5',
        loader : {
          url : 'data/text.json',
          renderer : function(text){
            return customText;
          }
        }
      });
      control.render();
      waits(100);
      runs(function(){
        expect(control.get('el').text()).toBe(customText);
      });
    });
  });
});

BUI.use('bui/common',function (BUI) {
  
  describe('测试loader屏蔽层',function(){
    
  });

});