BUI.use('bui/tree/treelist',function (TreeList) {
  var nodes = [
      {text : '1',id : '1',leaf : false},
      {text : '2',id : '2',children : [
          {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
          {text : '22',id : '22'}
      ]},
      {text : '3',id : '3'},
      {text : '4',id : '4'},
    ];
  var tree = new TreeList({
    render : '#t1',
    nodes : nodes
  });
  tree.render();

  var el = tree.get('el');

  describe('测试tree生成',function(){

    it('测试生成',function(){
      expect(el.length).not.toBe(0);
    });

    it('测试节点生成',function(){
      expect(el.find('li').length).toBe(nodes.length);
    });

    it('测试初始化所有数据',function(){
      var n1 = tree.getFirstItem();
      expect(n1.leaf).toBe(false);
      var n2 = tree.getItemAt(1);
      expect(n2.leaf).toBe(false);
      expect(n2.children[0].level).toBe(2);
      expect(n2.children[0].children[0].level).toBe(3);
      expect(n2.children[1].leaf).toBe(true);
    });

    it('测试树节点,测试叶节点生成',function(){
      BUI.each(nodes,function(node){
        var element = $(tree.findElement(node));
        expect(element.length).not.toBe(0);
        if(node.leaf){
          expect(element.find('.x-tree-elbow-leaf').length).toBe(1);
        }else{
          expect(element.find('.x-tree-elbow-dir').length).toBe(1);
        }
      });
    });

  });

  describe('测试树属性',function(){
    it('测试显示根节点',function(){

    });
    it('测试不显示根节点',function(){

    });
  });

  describe('测试tree操作',function(){

    it('重置数据',function(){
      tree.set('nodes',[]);
      expect(el.find('li').length).toBe(0);
      tree.set('nodes',nodes);
      expect(el.find('li').length).toBe(nodes.length);
    });

    it('测试展开',function(){
      var node = tree.getItem('2'),
        count = tree.getItemCount(),
        children = node.children,
        nodeEl = tree.findElement(node);
      tree.expandNode(node);
      expect(tree.isExpanded(node)).toBe(true);
      waits(100);
      runs(function(){
        expect(tree.getItemCount()).toBe(count + children.length);
        BUI.each(children,function(sub){
          expect(tree.findElement(sub)).not.toBe(null);
        });

      });

    });

    it('测试缩进',function(){
      var node = tree.getItem('21');
      tree.expandNode(node);
      var sub = node.children[0],
        element = tree.findElement(sub);
      expect($(element).find('.x-tree-elbow-empty').length).toBe(sub.level);
    });

    it('测试折叠',function(){
      var node = tree.getItem('2');
      tree.collapseNode(node);
      var children = node.children;
      expect(tree.isExpanded(node)).toBe(false);
      BUI.each(children,function(sub){
        expect(tree.findElement(sub)).toBe(null);
      });
    });

    it('展开所有',function(){
      tree.expandAll();
      waits(100);
      runs(function(){
        BUI.each(nodes,function(node){
          if(!node.leaf){
            expect(tree.isExpanded(node)).toBe(true);
          }else{
            expect(tree.isExpanded(node)).toBe(false);
          }
        });
      });
      
    });

    it('折叠所有',function(){
      tree.collapseAll();
      BUI.each(nodes,function(node){
        expect(tree.isExpanded(node)).toBe(false);
      });
    });

    it('展开父元素未展开的元素',function(){
      var node = nodes[1].children[0];
      tree.expandNode(node);
      expect(tree.isExpanded(node)).toBe(true);
      expect(tree.isExpanded(node.parent)).toBe(true);
    });

    it('添加节点',function(){

    });

    it('删除节点',function(){

    });

    it('更改节点',function(){

    });

  });
});

BUI.use('bui/tree/treelist',function (TreeList) {
  describe('测试有连接线的树',function(){
    describe('测试初始化',function(){

    });
    describe('测试操作',function(){
      it('展开节点',function(){

      });

      it('折叠节点',function(){

      });

      it('添加节点到最后',function(){

      });
      it('添加节点到第一个',function(){

      });
      it('在叶子节点上添加节点',function(){

      });
      it('删除非最后一个节点',function(){

      });
      it('删除最后一个节点',function(){

      });
      it('删除仅有一个子节点',function(){

      });

    });
  });
});