/**/
BUI.use('bui/tree/treelist',function (TreeList) {
  var nodes = [
      {text : '1',id : '1',leaf : false,checked:false,children : [{text : '11',id : '11',checked : true},{text : '12',id : '12',checked : true,children:[{text : '121',id : '121',checked:false},{text : '122',id : '122',checked:false}]}]},
      {text : '2',id : '2',expanded : true,checked:false,children : [
          {text : '21',id : '21',checked : true,children : [{text : '211',id : '211',checked : false},{text : '212',id : '212',disabled:true,checked : false}]},
          {text : '22',id : '22',checked : false}
      ]},
      {text : '3',id : '3',checked : false,children : [{id : '31',checked:true,text : '31'},{id : '32',text : '32',checked:false}]},
      {text : '4',id : '4',checked : true},
      {text : '5',id : '5'},
      {text : '6',id : '6'},
      {text : '7',id : '7'}
    ];
  var tree = new TreeList({
    render : '#t3',
    showLine : true,
    nodes : nodes
  });
  tree.render();

  describe('勾选的tree',function(){
    describe('初始化勾选',function(){
      
      it('测试是否可以勾选',function(){
        var node = tree.getItem('5'),
          element = tree.findElement(node);
        expect(tree.isCheckable(node)).toBe(false);
        expect($(element).find('.x-tree-icon-checkbox').length).toBe(0);
        var node = tree.getItem('3'),
          element = tree.findElement(node);
        expect(tree.isCheckable(node)).toBe(true);
        expect($(element).find('.x-tree-icon-checkbox').length).toBe(1);
      });
      it('默认勾选的文件夹',function(){
        var node = tree.getItem('21');
        expect(tree.isChecked(node)).toBe(true);
        BUI.each(node.children,function(subNode){
          expect(subNode.checked).toBe(true);
        });
      });
      it('默认部分勾选文件夹',function(){
        var node = tree.getItem('2');
        expect(tree.hasStatus(node,'partial-checked')).toBe(true);
      });
      it('默认勾选叶子节点',function(){
         var node = tree.getItem('4'),
          element = tree.findElement(node);
        expect(tree.isCheckable(node)).toBe(true);
        expect(tree.hasStatus(node,'checked')).toBe(true);
        expect($(element).find('.x-tree-icon-checkbox').length).toBe(1);
      });
      it('默认勾选所有叶子节点',function(){
         var node = tree.getItem('1');
         expect(tree.isChecked(node)).toBe(true);
         expect(tree.hasStatus(node,'partial-checked')).toBe(false);
      });
    });
    describe('测试勾中的值',function(){

      it('获取全部勾选的值',function(){
        var nodes = tree.getCheckedNodes(),
          node = tree.findNode('1');
        expect(BUI.Array.contains(node,nodes)).toBe(true);
        node = tree.findNode('4');
        expect(BUI.Array.contains(node,nodes)).toBe(true);
        node = tree.findNode('31');
        expect(BUI.Array.contains(node,nodes)).toBe(true);
      });
      it('获取树节点下勾选的值',function(){
        var node = tree.findNode('1'),
          nodes = tree.getCheckedNodes(node);
        expect(nodes.length).not.toBe(0);

      });
      it('获取勾选的所有叶子节点',function(){
        var nodes = tree.get('store').findNodesBy(function(node){
          return node.leaf && node.checked;
        });
        expect(nodes.length).not.toBe(0);
        BUI.each(nodes,function(subNode){
          expect(subNode.leaf).toBe(true);
          expect(subNode.checked).toBe(true);
        });
      });
    });

    describe('勾选操作',function(){
      it('勾选子节点',function(){
        var node = tree.getItem('22');
        tree.setNodeChecked(node,true);
        expect(tree.hasStatus(node,'checked')).toBe(true);
        expect(tree.hasStatus(node.parent,'checked')).toBe(true);
        expect(tree.hasStatus(node.parent,'partial-checked')).toBe(false);
      });

      it('取消勾选子节点',function(){
        var node = tree.getItem('22');
        tree.setNodeChecked(node,false);
        expect(tree.hasStatus(node,'checked')).toBe(false);
        expect(tree.hasStatus(node.parent,'checked')).toBe(false);
        expect(tree.hasStatus(node.parent,'partial-checked')).toBe(true);
      });

      it('勾选树节点',function(){
        var node = tree.getItem('2');
        tree.setNodeChecked(node,true);
        tree.expandNode(node);
        expect(tree.hasStatus(node,'checked')).toBe(true);
        var node = tree.getItem('22');
        expect(tree.hasStatus(node,'checked')).toBe(true);
        expect(tree.hasStatus(node.parent,'partial-checked')).toBe(false);
      });

      it('取消勾选树节点',function(){
        var node = tree.getItem('2');
        tree.setNodeChecked(node,false);
        tree.expandNode(node,true);
        expect(tree.hasStatus(node,'checked')).toBe(false);
        expect(tree.hasStatus(node,'partial-checked')).toBe(false);
        var node = tree.getItem('22');
        expect(tree.hasStatus(node,'checked')).toBe(false);
        var node = tree.getItem('211');
        expect(tree.hasStatus(node,'checked')).toBe(false);
      });

      it('树节点勾中状态下，取消叶子节点勾中',function(){
        var node = tree.getItem('2');
        tree.setNodeChecked(node,true);
        expect(tree.hasStatus(node,'checked')).toBe(true);
        var subNode = tree.getItem('21');
        expect(tree.hasStatus(subNode,'checked')).toBe(true);
        tree.setNodeChecked(subNode,false);
        expect(tree.hasStatus(subNode,'checked')).toBe(false);
        expect(tree.hasStatus(node,'checked')).toBe(false);
        expect(tree.hasStatus(node,'partial-checked')).toBe(true);
      });

      it('勾选所有叶子节点',function(){
        var node = tree.getItem('2');
        tree.setNodeChecked(node,false);
        expect(tree.hasStatus(node,'checked')).toBe(false);

        expect(tree.hasStatus(tree.getItem('21'),'checked')).toBe(false);
        expect(tree.hasStatus(tree.getItem('22'),'checked')).toBe(false);
        expect(tree.hasStatus(node,'partial-checked')).toBe(false);

        tree.setNodeChecked('21',true);
        expect(tree.hasStatus(node,'partial-checked')).toBe(true);

        tree.setNodeChecked('22',true);
        expect(tree.hasStatus(node,'checked')).toBe(true);
        expect(tree.hasStatus(node,'partial-checked')).toBe(false);
      });

      it('递归测试上级节点的半选状态',function(){
        tree.expandNode('1',true);
        var node = tree.getItem('122');
        expect(node).not.toBe(null);
        tree.setNodeChecked(node,false);
        expect(tree.hasStatus(node.parent,'partial-checked')).toBe(true);
        expect(tree.hasStatus(node.parent.parent,'partial-checked')).toBe(true);

        tree.setNodeChecked(node,true);
        expect(tree.hasStatus(node.parent,'partial-checked')).toBe(false);
        expect(tree.hasStatus(node.parent.parent,'partial-checked')).toBe(false);
      });

      it('折叠后，展开，测试节点勾选状态',function(){
        tree.collapseNode('2');
        tree.expandNode('2');
        var node = tree.getItem('21');
        expect(tree.hasStatus(node,'checked')).toBe(true);
        
      });

      it('清除选中父节点',function () {
        var node = tree.findNode('2');
        tree.setNodeChecked(node,false);
        expect(tree.isChecked('21')).toBe(false);
        expect(tree.isChecked('211')).toBe(false);
        expect(tree.isChecked('22')).toBe(false);
      });
      
      it('设置孙子节点',function() {
        var node = tree.findNode('2'),
          element = tree.findElement(node);

        tree.setNodeChecked('211',true);
        expect($(element).hasClass('bui-tree-item-partial-checked')).toBe(true);

      });


    });
    
  });
  
});


BUI.use(['bui/tree/treelist','bui/data'],function (TreeList,Data) {
  
  var nodes = [
      {text : '1',id : '1',leaf : false,checked:false,children : [{text : '11',id : '11',checked : true},{text : '12',id : '12',checked : true}]},
      {text : '2',id : '2',expanded : true,checked:false,children : [
          {text : '21',id : '21',checked : true,children : [{text : '211',id : '211',checked : false},{text : '212',id : '212',disabled:true,checked : false}]},
          {text : '22',id : '22',checked : false}
      ]},
      {text : '3',id : '3',checked : false,children : [{id : '31',checked:true,text : '31'},{id : '32',text : '32',checked:false}]},
      {text : '4',id : '4',checked : true},
      {text : '5',id : '5'},
      {text : '6',id : '6'},
      {text : '7',id : '7'}
    ];
  var store = new Data.TreeStore({
    data : nodes
  }),
  tree = new TreeList({
    render : '#t31',
    showLine : true,
    store : store
  });
  tree.render();

  describe('勾选状态下的，增删改',function(){

    it('未勾选的树节点下，添加未勾选的字节点',function(){
      var node = tree.getItem('3'),
        subNode = store.add({id : '33',text:'33',checked:false},node);
      expect(subNode.checked).not.toBe(true);
      tree.expandNode(node);
      expect(tree.hasStatus(subNode,'checked')).toBe(false);
    });

    it('未勾选的树节点下，添加勾选的字节点',function(){
       var node = tree.getItem('3'),
        subNode = store.add({id : '34',text:'34',checked : true},node);
      expect(subNode.checked).toBe(true);
      expect(tree.hasStatus(subNode,'checked')).toBe(true);
      expect(tree.hasStatus(node,'checked')).toBe(false);
    });

    it('未勾选的树节点下，删除勾选的字节点',function(){
      var node = tree.getItem('3'),
        subNode = tree.getItem('34');
      store.remove(subNode);
      expect(tree.hasStatus(node,'checked')).toBe(false);
    });
    it('未勾选的树节点下，删除未勾选的字节点',function(){
      var node = tree.getItem('3'),
        subNode = tree.getItem('32');
      store.remove(subNode);
      expect(tree.hasStatus(node,'checked')).toBe(false);
      subNode = tree.getItem('33');
      store.remove(subNode);
      expect(tree.hasStatus(node,'checked')).toBe(true);
    });

    it('勾选的树节点下，添加未勾选的字节点',function(){
      var node = tree.getItem('3'),
        subNode = store.add({id:'32',text : '32',checked : false},node);
      expect(subNode.checked).toBe(true);
      expect(tree.hasStatus(subNode,'checked')).toBe(true);
    });

    it('勾选的树节点下，添加勾选的字节点',function(){
      var node = tree.getItem('3'),
        subNode = store.add({id:'33',text : '33',checked : true},node);
      expect(subNode.checked).toBe(true);
      expect(tree.hasStatus(subNode,'checked')).toBe(true);
    });

    it('勾选的树节点下，删除勾选的字节点',function(){
      var node = tree.getItem('3'),
        subNode = tree.getItem('33');
      store.remove(subNode);
      expect(tree.hasStatus(node,'checked')).toBe(true);
    });
  });
  
});


BUI.use('bui/tree/treelist',function (TreeList) {
  var nodes = [
      {text : '1',id : '1',leaf : false,checked:false,children : [{text : '11',id : '11'},{text : '12',id : '12',children:[{text : '121',id : '121'},{text : '122',id : '122'}]}]},
      {text : '2',id : '2',expanded : true,checked:false,children : [
          {text : '21',id : '21',checked : true,children : [{text : '211',id : '211',checked : false},{text : '212',id : '212',checked : false}]},
          {text : '22',id : '22',checked : false}
      ]},
      {text : '3',id : '3',checked : false,children : [{id : '31',text : '31'},{id : '32',text : '32'}]},
      {text : '4',id : '4',checked : true},
      {text : '5',id : '5'},
      {text : '6',id : '6'},
      {text : '7',id : '7'}
    ];
  var tree = new TreeList({
    render : '#t32',
    showLine : true,
    checkType : 'none',
    nodes : BUI.cloneObject(nodes)
  });
  tree.render();

  describe('测试勾选模式',function(){

    it('测试勾选字段',function(){
      expect(tree.get('checkedField')).toBe('checked');
    });

    it('测试禁止所有勾选',function(){
      BUI.each(tree.get('root').children,function(subNode){
        expect(tree.isCheckable(subNode)).toBe(false);
        //expect(tree.hasStatus(subNode,'checked')).toBe(false);
      });
    });
    
    it('测试全部允许勾选',function(){
      tree.set('checkType','all');
      tree.set('nodes',BUI.cloneObject(nodes));
      BUI.each(tree.get('root').children,function(subNode){
        expect(tree.isCheckable(subNode)).toBe(true);
        //expect(tree.hasStatus(subNode,'checked')).toBe(subNode.checked);
      });
    });



    it('测试自由勾选',function(){
      tree.set('checkType','custom');
      tree.set('nodes',BUI.cloneObject(nodes));
      BUI.each(tree.get('root').children,function(subNode){
        expect(tree.isCheckable(subNode)).toBe(subNode.checked != null);
      });
    });

    it('测试仅叶子节点勾选',function(){
      tree.set('checkType','onlyLeaf');
      tree.set('nodes',BUI.cloneObject(nodes));
      BUI.each(tree.get('root').children,function(subNode){
        expect(tree.isCheckable(subNode)).toBe(subNode.leaf);
        
      });
    });

    it('禁用节点',function(){
      var node = tree.findNode('12');
      expect(node.checkable).toBe(false);
      tree.expandNode('1');
      tree.setItemDisabled(node);
      expect(node.checkable).toBe(false);
    });
  });

});

BUI.use('bui/tree/treelist',function (TreeList) {
  var nodes = [
      {text : '1',id : '1',leaf : false,checked:false,children : [{text : '11',id : '11',checked:true},{text : '12',checked:true,id : '12',children:[{text : '121',id : '121'},{text : '122',id : '122'}]}]},
      {text : '2',id : '2',expanded : true,checked:true,children : [
          {text : '21',id : '21',children : [{text : '211',id : '211',checked : false},{text : '212',id : '212',checked : false}]},
          {text : '22',id : '22',checked : false}
      ]},
      {text : '3',id : '3',checked : false,children : [{id : '31',text : '31'},{id : '32',text : '32'}]},
      {text : '4',id : '4',checked : true},
      {text : '5',id : '5'},
      {text : '6',id : '6'},
      {text : '7',id : '7'}
    ];
  var tree = new TreeList({
    render : '#t32',
    showLine : true,
    cascadeCheckd : false,
    checkType : 'all',
    nodes : BUI.cloneObject(nodes)
  });
  tree.render();

  describe('测试非级联选择',function(){

    it('测试勾选字段',function(){
      expect(tree.get('checkedField')).toBe('checked');
    });

    it('测试默认勾选',function () {
      var node = tree.findNode('2');
      expect(tree.isChecked(node)).toBe(true);

      expect(tree.findNode('11').checked).toBe(true);

    });

    it('测试子节点不默认勾选',function () {
      var node = tree.findNode('21');
      expect(tree.isChecked(node)).toBe(false);
      expect(tree.findNode('1').checked).toBe(false);
    });

  });

});
