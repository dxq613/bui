/**/
BUI.use('bui/data',function (Data) {
  var TStore = Data.TreeStore;
  var data = [
          {
            id:'1',
            text : '第一项',
            leaf : true
          },
          {
            id:'2',
            text : '第二项',
            leaf : false,
            children : [
              {
                id : '21',
                text : '第二一项',
                leaf : false
              },
              {
                id : '22',
                text : '第二二项',
                leaf : true
              }
            ]
          },
          {
            id:'3',
            text : '第三项',
            leaf : false
          }
        ];
  describe('设置完整记录',function(){
    var store = new TStore({
      root : {
        id : 'test',
        text : '根节点',
        children : BUI.cloneObject(data) 
      }
    });
    var root = store.get('root')
    it('测试根节点',function(){
      expect(root.isNode).toBe(true);
      expect(root.level).toBe(0);
      expect(BUI.Array.equals(root.path,['test'])).toBe(true);
    });

    it('测试子节点',function(){
      var children = store.get('root').children;
      expect(children.length).toBe(data.length);
      BUI.each(children,function(item){
        expect(item.level).toBe(1);
        expect(item.path.length).toBe(2);
      });
    });
  });
  describe('查找节点',function(){

    var store = new TStore({
      root : {
        id : 'test',
        text : '根节点',
        children : BUI.cloneObject(data) 
      }
    });
    var root = store.get('root');
    it('获取根节点',function(){
      expect(store.findNode('test')).toBe(root);
    });
    it('查找子节点',function(){
      var node = store.findNode('31',root);
      expect(node).toBe(null);

      var node = store.findNode('21',root);
      expect(node).not.toBe(null);
      expect(node.parent).toBe(store.findNode('2'));
      
    });

    it('添加子节点',function(){
      var node = store.findNode('3');
      store.add({
        id : '31',
        text : '三一'
      },node);

      expect(store.findNode('31')).not.toBe(null);
    });

    it('删除子节点',function(){
      var node = store.findNode('31');
      store.remove(node);

      expect(store.findNode('31')).toBe(null);
    });
  });

  describe('设置数据',function(){
    var store = new TStore({
      root : {
        id : 'test',
        text : '根节点'
      },
      data : BUI.cloneObject(data)
    });
    var root = store.get('root');
    it('测试子节点',function(){
      expect(root.children.length).toBe(data.length)
    });
  });

  describe('加载数据',function(){
    var store = new TStore({
      root : {
        id : '0',
        text : '根节点',
        children : []
      },
      url : 'data/nodes.php'
    });
    var root = store.get('root');

    it('加载数据',function(){
      var node = store.findNode('0');
      expect(node.children.length).toBe(0);
      store.loadNode(node);
      waits(500);
      runs(function(){
        expect(node.children.length).not.toBe(0);
      });
    });
  });
});


BUI.use('bui/data',function(Data){
  var TStore = Data.TreeStore,
    data = [
      {pid : '1',id : '11',text : '11',leaf : false},
      {pid : '1',id : '12',text : '12'},
      {pid : '11',id : '112',text : '112'},
      {pid : '11',id : '111',text : '111'},
      {pid : '1',id : '13',text : '13',leaf : false},
      {pid : '13',id : '131',text : '131',leaf : false},
      {pid : '131',id : '1311',text : '1311'},
      {pid : '13',id : '132',text : '132'},
      {pid : '131',id : '1312',text : '1312'}
    ],
    store = new TStore({
      data : data,
      root : {
        id : '1',
        text : '1'
      },
      pidField : 'pid'
    });
  describe('设置数据,获取子节点',function(){
    it('proxy的匹配字段',function(){
      var proxy = store.get('proxy');
      expect(proxy.get('matchFields').length).toBe(1);
      expect(proxy.get('matchFields')[0]).toBe('pid');
    });
    it('默认加载的子节点',function(){
      var root = store.get('root');
      expect(root.children.length).toBe(3);
    });
    it('加载子节点',function(){
      var node = store.findNode('13');
      expect(node).not.toBe(null);
      expect(node.children.length).toBe(0);
      store.loadNode(node);
      expect(node.children.length).toBe(2);
    });
  });
});

