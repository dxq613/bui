/**/
BUI.use(['bui/tree/treelist','bui/data'],function (TreeList,Data) {
  var nodes = [
        {text : '1',id : '1',leaf : false},
        {text : '2',id : '2',children : [
            {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
            {text : '22',id : '22'}
        ]},
        {text : '3',id : '3'},
        {text : '4',id : '4'}
      ],
    store = new Data.TreeStore({
      root : {
        id : '0',
        text : '0',
        children : nodes
      }
    });
  var tree = new TreeList({
    render : '#t4',
    showLine : true,
    store : store,
    showRoot : true
  });
  tree.render();
  var el = tree.get('el'),
    showRoot = tree.get('showRoot');
  describe('测试初始化',function(){
    it('显示数据',function(){
      if(showRoot){
        expect(el.find('li').length).toBe(1);
      }else{
        expect(el.find('li').length).toBe(nodes.length);
      }
      
    });
    it('显示所有',function(){
      tree.expandAll();
      var node = tree.getItem('212');
      expect(node).not.toBe(null);
    });
  });

  describe('测试操作store',function(){

    it('重置节点',function(){
      
    });

     it('在叶子节点上添加节点',function(){
        var node = tree.getItem('3'),
          subNode = {id:'31',text : '31'},
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-dir').length).toBe(0);
        store.add(subNode,node,0);
        waits(100);
        runs(function(){
          expect($(element).find('.x-tree-elbow-dir').length).toBe(1);
        });
      });

      it('展开的节点上，添加节点到最后',function(){
        var node = tree.getItem('21'),
          sblingNode = tree.getItem('212'), //添加之前最后一个节点
          sblingElement = tree.findElement(sblingNode),
          subNode = {id : '213',text: '213'};

        expect($(sblingElement).find('.x-tree-elbow-end').length).toBe(1);
        subNode = store.add(subNode,node);

        waits(100);
        runs(function(){
          var subElement = tree.findElement(subNode);
          expect($(sblingElement).find('.x-tree-elbow-end').length).toBe(0);
          expect($(subElement).find('.x-tree-elbow-end').length).toBe(1);
        });
      });

      it('添加节点到第一个',function(){
        var node = tree.getItem('21'),
          subNode = {id : '210',text: '210'};

        subNode = store.add(subNode,node,0);
        waits(100);
        runs(function(){
          var subElement = tree.findElement(subNode);
          
          expect($(subElement).find('.x-tree-elbow-end').length).toBe(0);
        });

      });
      it('添加多级节点',function(){
        var node = tree.getItem('1'),
          subNode = {id : '11',text:'11',children : [{id : '111',text : '111'},{id:'112',text : '112'}]};
        store.add(subNode,node);
         expect(tree.getItem('112')).toBe(null);
        tree.expandNode(node,true);
        expect(tree.getItem('112')).not.toBe(null);
      });

      it('测试添加最后',function(){
        var node = tree.getItem('4'),
          element = tree.findElement(node);
        store.add({id : '41',text:'41'},node);
        store.add({id : '42',text:'42'},node);
        tree.expandNode(node);
        expect($(element).find('.x-tree-elbow-dir').length).toBe(1);
        expect($(element).find('.x-tree-elbow-expander').length).toBe(1);
        expect($(element).find('.x-tree-elbow-expander-end').length).toBe(1);
        expect(tree.getItem('41')).not.toBe(null);
        var node = store.add({id : '5',text:'5',leaf : true},null,4),
          element = tree.findElement(node);
        expect(element).not.toBe(null);
        expect($(element).next('li').length).toBe(0);
      });
     
      it('删除非最后一个节点',function(){
        var node = tree.getItem('210');
        store.remove(node);
        expect(tree.getItem('210')).toBe(null);
      });
      it('删除最后一个节点',function(){
        var node = tree.getItem('213');
        store.remove(node);
        expect(tree.getItem('213')).toBe(null);
        var node = tree.getItem('212'),
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-end').length).toBe(1);
      });
      it('删除仅有一个子节点',function(){ 
        var node = tree.getItem('3'),
          element = tree.findElement(node);

        store.remove(node.children[0]);
        expect(node.leaf).toBe(true);
        expect($(element).find('.x-tree-elbow-dir').length).toBe(0);
      });

      it('更改节点',function(){

      });
  });
});

BUI.use(['bui/tree/treelist','bui/data'],function (TreeList,Data) {
  var store = new Data.TreeStore({
      root : {
        id : '0',
        text : '0'
      },
      url : 'data/nodes.php'
    });
    
  var tree = new TreeList({
    render : '#t5',
    showLine : true,
    store : store,
    showRoot : true
  });
  tree.render();
  var el = tree.get('el');
  describe('异步获取数据',function(){

    it('初始化',function(){
      store.load({id : '0'});
      waits(1500);
      runs(function(){
        expect(el.find('li')).not.toBe(0);
      });
    });

    it('展开未加载的节点',function(){
      var node = store.findNode('1'),
        element = tree.findElement(node);
      tree.expandNode(node);
      expect($(element).hasClass('bui-tree-item-loading')).toBe(true);
      expect(tree.getItem('11')).toBe(null);
      waits(1500);
      runs(function(){
        expect($(element).hasClass('bui-tree-item-loading')).toBe(false);
        expect(tree.getItem('11')).not.toBe(null);
      });
    });

    it('展开已加载过的节点',function(){
      var node = store.findNode('1'),
        element = tree.findElement(node);
      tree.collapseNode(node);
      expect(tree.getItem('11')).toBe(null);
      tree.expandNode(store.findNode('11'));
      expect(tree.getItem('11')).not.toBe(null);
    });

    it('展开多个节点',function(){
      tree.expandNode('13');
      tree.expandNode('15');
      waits(1500);
      runs(function(){
        expect(tree.getItem('131')).not.toBe(null);
        expect(tree.getItem('151')).not.toBe(null);
      });
    });

    it('展开指定的路径',function(){
      var path = '3,31,313,3131';
      tree.expandPath(path,true);
      waits(4000);
      runs(function(){
        expect(tree.getItem('3131')).not.toBe(null);
      });
    });

    it('重新加载节点',function(){
      var node = store.findNode('11'),
        element = tree.findElement(node);
      expect(element).not.toBe(null);

      tree.expandNode(node);
      waits(1500);
      runs(function(){
        expect(node.loaded).toBe(true);

        store.reloadNode(node);
        expect(node.loaded).toBe(false);

        expect($(element).hasClass('bui-tree-item-loading')).toBe(true);
        waits(1500);
        runs(function(){
          expect($(element).hasClass('bui-tree-item-loading')).toBe(false);
          expect(node.loaded).toBe(true);
          expect(store.isLoaded(node)).toBe(true);
        });
      });
    });
  });

});


BUI.use(['bui/tree/treelist','bui/data'],function (TreeList,Data) {
  var data = [
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
    store = new Data.TreeStore({
      pidField : 'pid',
      root : {
        id : '1',
        text : '1',
        expanded : true
      },
      data : data
    });
    
  var tree = new TreeList({
    render : '#t7',
    showLine : true,
    store : store,
    showRoot : true
  });
  tree.render();
  var el = tree.get('el');

  describe('测试缓存级联数据',function(){
    it('初始化',function(){
      expect(store.get('root').children.length).toBe(3);
    });
    it('展开节点',function(){
      var node = store.findNode('13');
      expect(node.children.length).toBe(0);
      tree.expandNode(node);
      expect(node.children.length).not.toBe(0);
    });
  });

});
/*
*/

