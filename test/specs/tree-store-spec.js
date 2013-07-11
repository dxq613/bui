BUI.use(['bui/tree/treelist','bui/data'],function (TreeList,Data) {
  var nodes = [
        {text : '1',id : '1',leaf : false},
        {text : '2',id : '2',children : [
            {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
            {text : '22',id : '22'}
        ]},
        {text : '3',id : '3'},
        {text : '4',id : '4'},
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
    store : store
  });
  tree.render();
  var el = tree.get('el');
  describe('测试初始化',function(){
    it('显示数据',function(){
      expect(el.find('li').length).toBe(nodes.length);
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

      /*it('更改节点',function(){

      });
    */
  });
});

BUI.use('bui/tree/treelist',function (TreeList) {

  describe('异步获取数据',function(){

    it('初始化',function(){

    });

    it('展开未加载的节点',function(){

    });

    it('展开已加载过的节点',function(){

    });

    it('展开所有节点',function(){

    });

  });
 
});