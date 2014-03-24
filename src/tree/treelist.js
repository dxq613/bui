/**
 * @fileOverview 树形列表
 * @ignore
 */

define('bui/tree/treelist',['bui/common','bui/list','bui/tree/treemixin','bui/tree/selection'],function (require) {
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Mixin = require('bui/tree/treemixin'),
    Selection = require('bui/tree/selection');

  /**
   * @class BUI.Tree.TreeList
   * 树形列表控件
   * ** 你可以简单的使用配置数据 **
   * <pre><code>
   *  BUI.use('bui/tree',function(Tree){
   *    var tree = new Tree.TreeList({
   *      render : '#t1',
   *      nodes : [
   *        {id : '1',text : '1',children : [{id : '11',text : '11'}]},
   *        {id : '2',text : '2'}
   *      ]
   *    });
   *    tree.render();
   *  });
   * </code></pre>
   * ** 你也可以显示根节点 ** 
   * <pre><code>
   *  BUI.use('bui/tree',function(Tree){
   *    var tree = new Tree.TreeList({
   *      render : '#t1',
   *      root :{
   *        id : '0',
   *        text : '0',
   *        children : [
   *          {id : '1',text : '1',children : [{id : '11',text : '11'}]},
   *          {id : '2',text : '2'}
   *        ]
   *      },
   *      showRoot : true
   *    });
   *    tree.render();
   *  });
   * </code></pre>
   *
   * ** 你也可以异步加载数据 ** 
   * <pre><code>
   *  BUI.use(['bui/tree','bui/data'],function(Tree,Data){
   *    var store = new Data.TreeStore({
   *        root :{
   *          id : '0',
   *          text : '0'
   *        },
   *        url : 'data/nodes.php'
   *      }),
   *      tree = new Tree.TreeList({
   *        render : '#t1',
   *        store : store,
   *        showRoot : true //可以不配置，则不显示根节点
   *      });
   *    tree.render();
   *    store.load({id : '0'});//加载根节点，也可以让用户点击加载
   *  });
   * </code></pre>
   *
   * ** 你还可以替换icon ** 
   * <pre><code>
   *  BUI.use('bui/tree',function(Tree){
   *    var tree = new Tree.TreeList({
   *      render : '#t1',
   *      dirCls : 'folder', //替换树节点的样式
   *      leafCls : 'file', //叶子节点的样式
   *      nodes : [ //数据中存在cls 会替换节点的图标样式
   *        {id : '1',text : '1'cls:'task-folder',children : [{id : '11',text : '11',cls:'task'}]},
   *        {id : '2',text : '2'}
   *      ]
   *    });
   *    tree.render();
   *  });
   *  </code></pre>
   * @mixin BUI.Tree.Mixin
   * @extends BUI.List.SimpleList
   */
  var TreeList = List.SimpleList.extend([Mixin,Selection],{
    
  },{
    ATTRS : {
      itemCls : {
        value : BUI.prefix + 'tree-item'
      },
      itemTpl : {
        value : '<li>{text}</li>'
      },
      idField : {
        value : 'id'
      }
    }
  },{
    xclass : 'tree-list'
  });

  return TreeList;
});

