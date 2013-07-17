BUI.use('bui/tree/treelist',function (TreeList) {
  var data = [
      {text : '1',id : '1',leaf : false,children: []},
      {text : '2',id : '2',expanded : true,children : [
          {text : '21',id : '21',cls : 'task-folder',children : [{text : '211',id : '211'},{text : '212',id : '212'}]},
          {text : '22',id : '22',cls : 'task'}
      ]},
      {text : '3',id : '3'},
      {text : '4',id : '4'}
    ];
  var tree = new TreeList({
    render : '#t6',
    root : {
      id : '0',
      text : '0',
      children : data
    },
    dirCls : 'icon-pkg',
    leafCls : 'icon-example'
  });
  tree.render();
  var store = tree.get('store');

  describe('初始化Icon',function(){
    it('整体更换icon',function(){
      var node = tree.findNode('1'),
        element = tree.findElement(node);
      expect($(element).find('.icon-pkg').length).toBe(1);

      var node = tree.findNode('3'),
        element = tree.findElement(node);
      expect($(element).find('.icon-example').length).toBe(1);
    });
    it('自定义icon',function(){
       var node = tree.findNode('21'),
        element = tree.findElement(node);
      expect($(element).find('.icon-pkg').length).toBe(0);
      expect($(element).find('.task-folder').length).toBe(1);
      var node = tree.findNode('22'),
        element = tree.findElement(node);
      expect($(element).find('.icon-example').length).toBe(0);
      expect($(element).find('.task').length).toBe(1);
    });
  });
  describe('操作数据',function(){

    it('添加数据',function(){
      tree.expandNode('1');
      var node = store.findNode('1'),
        subNode = store.add({id : '11',text : '11'},node),
        element = tree.findElement(subNode);
      expect($(element).find('.icon-example').length).toBe(1);

      subNode = store.add({id : '12',text : '12',cls : 'task'},node);
      element = tree.findElement(subNode);
      expect($(element).find('.icon-example').length).toBe(0);
      expect($(element).find('.task').length).toBe(1);

    });
    it('更新数据',function(){
      var node = tree.findNode('11');
      node.cls = 'task';
      store.update(node);

      var element = tree.findElement(node);
      expect($(element).find('.icon-example').length).toBe(0);
      expect($(element).find('.task').length).toBe(1);

    });
  });
});