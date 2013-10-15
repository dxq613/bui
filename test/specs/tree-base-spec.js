/*
*/
BUI.use('bui/tree/treelist',function (TreeList) {
  var data = [
      {text : '1',id : '1',leaf : false,children: []},
      {text : '2',id : '2',expanded : true,children : [
          {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212',children : [{text : '2121',id : '2121'},{text : '2122',id : '2122'}]}]},
          {text : '22',id : '22'}
      ]},
      {text : '3',id : '3'},
      {text : '4',id : '4'}
    ];
  var tree = new TreeList({
    render : '#t1',
    root : {
      id : '0',
      text : '0',
      expanded : true,
      children : data
    },
    showRoot : true
  });
  tree.render();

  var el = tree.get('el');
  var nodes = tree.get('root').children;

  describe('测试tree生成',function(){

    it('测试生成',function(){
      expect(el.length).not.toBe(0);
    });
    it('测试初始化所有数据',function(){
      var n1 = tree.getItem('1');
      expect(n1.leaf).toBe(false);
      var n2 = tree.getItem('2');
      expect(n2.leaf).toBe(false);
      expect(n2.children[0].level).toBe(2);
      expect(n2.children[0].children[0].level).toBe(3);
      expect(n2.children[1].leaf).toBe(true);
    });

    it('测试树节点,测试叶节点生成',function(){
      
      BUI.each(nodes,function(node){
        var element = tree.findElement(node);
        element = $(element);
        expect(element.length).not.toBe(0);
        if(node.leaf){
          expect(element.find('.x-tree-elbow-leaf').length).toBe(1);
        }else{
          expect(element.find('.x-tree-elbow-dir').length).toBe(1);
        }
      });
    });

    it('测试初始展开的节点',function(){
      var node = tree.getItem('2');
      expect(tree.isExpanded(node)).toBe(true);
      expect(tree.getItem('21')).not.toBe(null);
    });

  });

  describe('测试tree操作',function(){
    var showRoot = tree.get('showRoot');
    it('重置数据',function(){
      tree.set('nodes',[]);
      if(showRoot){
        expect(el.find('li').length).toBe(1);
      }else{
        expect(el.find('li').length).toBe(0);
      }
      
      tree.set('nodes',nodes);
      tree.collapseAll();
      if(showRoot){
        expect(el.find('li').length).toBe(1);
      }else{
        expect(el.find('li').length).toBe(nodes.length);
      }
    });

    it('测试展开',function(){
      if(showRoot){
        tree.expandNode('0');
      }
      var node = tree.findNode('2'),
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
      var append = 0;
      if(showRoot){
        append = 1;
      }
      var node = tree.getItem('21');
      tree.expandNode(node);
      var sub = node.children[0],
        element = tree.findElement(sub);
      expect($(element).find('.x-tree-elbow-empty').length).toBe(sub.level + append);
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

    it('收缩后展开,查看子节点的展开状态',function(){
      var node = tree.getItem('2');
      tree.collapseNode(node);
      tree.expandNode(node);
      expect(tree.isExpanded(node.children[0])).toBe(true);
      expect(tree.getItem('211')).not.toBe(null);

    });

    it('展开path',function(){
      tree.collapseAll();
      var path = '2,21,212,2121';
      tree.expandPath(path);
      var node = tree.getItem('2121');
      expect(node).not.toBe(null);

    });

  });
/**/
});

BUI.use('bui/tree/treelist',function (TreeList) {
  var nodes = [
      {text : '1',id : '1',leaf : false},
      {text : '2',id : '2',children : [
          {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
          {text : '22',id : '22'}
      ]},
      {text : '3',id : '3'},
      {text : '4',id : '4'}
    ];
  var tree = new TreeList({
    render : '#t2',
    showLine : true,
    nodes : nodes
  });
  tree.render();
  var el = tree.get('el');

  describe('测试有连接线的树',function(){
    describe('测试初始化',function(){
      it('测试线的样式',function(){
        expect(el.hasClass('x-tree-show-line')).toBe(true);
      });
      it('测试线的生成',function(){
        var node = tree.getItem('3'),
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-empty').length).toBe(0);
        expect($(element).find('.x-tree-elbow').length).toBe(1);
      });
      it('测试最后节点线的生成',function(){
        var node = tree.getItem('4'),
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-empty').length).toBe(0);
        expect($(element).find('.x-tree-elbow-end').length).toBe(1);
      });
    });

    function addNode(node,subNode,index){
      return tree.get('store').add(subNode,node,index)
    }

    function removeNode(node){
      tree.get('store').remove(node);
      
    }

    describe('测试操作',function(){

      it('展开节点',function(){
        tree.expandNode('2');
        var node = tree.getItem('21'),
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-line').length).toBe(1);

        var node = tree.getItem('22'),
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-line').length).toBe(1);
      });

      it('继续展开',function(){
        tree.expandNode('21');
        var node = tree.getItem('211'),
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-line').length).toBe(2);
      });

      it('在叶子节点上添加节点',function(){
        var node = tree.getItem('3'),
          subNode = {id:'31',text : '31'},
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-dir').length).toBe(0);
        subNode = addNode(node,subNode,0);
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
        subNode = addNode(node,subNode);

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

        subNode = addNode(node,subNode,0);
        waits(100);
        runs(function(){
          var subElement = tree.findElement(subNode);
          expect($(subElement).find('.x-tree-elbow-end').length).toBe(0);
        });

      });

      it('测试添加最后',function(){
        var node = tree.getItem('4'),
          element = tree.findElement(node);
        addNode(node,{id : '41',text:'41'});
        addNode(node,{id : '42',text:'42'});
        tree.expandNode(node);
        expect($(element).find('.x-tree-elbow-dir').length).toBe(1);
        expect($(element).find('.x-tree-elbow-expander').length).toBe(1);
        expect($(element).find('.x-tree-elbow-expander-end').length).toBe(1);
        addNode(null,{id : '5',text:'5',leaf : true},4);
      });
     
      it('删除非最后一个节点',function(){
        var node = tree.getItem('210');
        removeNode(node);
        expect(tree.getItem('210')).toBe(null);
      });
      it('删除最后一个节点',function(){
        var node = tree.getItem('213');
        removeNode(node);
        expect(tree.getItem('213')).toBe(null);
        var node = tree.getItem('212'),
          element = tree.findElement(node);
        expect($(element).find('.x-tree-elbow-end').length).toBe(1);
      });
      it('删除仅有一个子节点',function(){ 
        var node = tree.getItem('3'),
          element = tree.findElement(node);

        removeNode(node.children[0]);
        expect(node.leaf).toBe(true);
        expect($(element).find('.x-tree-elbow-dir').length).toBe(0);
      });
    });
  });
});

BUI.use('bui/tree/treelist',function (TreeList) {
  var nodes = [
      {text : '1',id : '1',leaf : false,children : [{text : '11',id : '11'},{text : '12',id : '12'}]},
      {text : '2',id : '2',children : [
          {text : '21',id : '21',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
          {text : '22',id : '22'}
      ]},
      {text : '3',id : '3',children : [
        {id : '31',text : '31',children : [{text : '311',id : '311'},{text : '312',id : '312'}]},
        {id : '32',text : '32',children : [{text : '321',id : '321'},{text : '322',id : '322'}]}
      ]},
      {text : '4',id : '4'}
    ];
  var tree = new TreeList({
    render : '#t8',
    showLine : true,
    expandEvent : 'itemclick',
    collapseEvent : null,
    accordion : true,
    nodes : nodes
  });
  tree.render();
  var el = tree.get('el');

  describe('测试手风琴式展开',function(){
    it('测试展开节点',function(){
      tree.expandNode('2');
      tree.expandNode('3');
      expect(tree.findNode('2').expanded).toBe(false);
      expect(tree.findNode('3').expanded).toBe(true);
    });
    it('测试展开兄弟节点',function(){
      tree.expandNode('31');
      tree.expandNode('32');
      expect(tree.findNode('31').expanded).toBe(false);
      expect(tree.findNode('32').expanded).toBe(true);
    });
    it('测试展开其他层级节点',function(){
      tree.expandNode('21');
      expect(tree.findNode('3').expanded).toBe(false);
      expect(tree.findNode('21').expanded).toBe(true);
      expect(tree.findNode('2').expanded).toBe(true);
    });
    it('触发展开事件',function(){
      var node = tree.findNode('3'),
        element = tree.findElement(node);
      $(element).trigger('click');
      waits(100);
      runs(function(){
        expect(tree.findNode('2').expanded).toBe(false);
        expect(tree.findNode('3').expanded).toBe(true);
      });
    });/**/
  });
});



/**/