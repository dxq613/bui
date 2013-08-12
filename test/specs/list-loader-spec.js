BUI.use('bui/list',function (List) {
  var list = new List.List({
    render : '#l6',
    loader : {
      url : 'data/items.json'
    }
  });
  
  describe('测试异步加载选项',function(){
    it('测试初始化',function(){
      expect(list.getItems().length).toBe(0);
      list.render();
      waits(200);
      runs(function(){
        expect(list.getItems().length).not.toBe(0);
      });
    });
  })
});

BUI.use('bui/list',function (List) {
  var list = new List.SimpleList({
    render : '#l7',
    loader : {
      url : 'data/items.json'
    }
  });
  
  describe('测试异步加载选项',function(){
    it('测试初始化',function(){
      expect(list.getItems().length).toBe(0);
      list.render();
      waits(200);
      runs(function(){
        expect(list.getItems().length).not.toBe(0);
      });
    });
  })
});