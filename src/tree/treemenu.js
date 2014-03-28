/**
 * @fileOverview 树形菜单
 * @ignore
 */

define('bui/tree/treemenu',['bui/common','bui/list','bui/tree/treemixin','bui/tree/selection'],function (require) {
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Mixin = require('bui/tree/treemixin'),
    Selection = require('bui/tree/selection');

  var TreeMenuView = List.SimpleList.View.extend({
    //覆写获取模板方法
    getItemTpl : function  (item,index) {
      var _self = this,
        render = _self.get('itemTplRender'),
        itemTpl = item.leaf ? _self.get('leafTpl') : _self.get('dirTpl');  
      if(render){
        return render(item,index);
      }
      
      return BUI.substitute(itemTpl,item);
    }
  },{
    xclass : 'tree-menu-view'
  });

  /**
   * @class BUI.Tree.TreeMenu
   * 树形列表控件
   * ** 你可以简单的使用配置数据 **
   * <pre><code>
   *  BUI.use('bui/tree',function(Tree){
   *    var tree = new Tree.TreeMenu({
   *      render : '#t1',
   *      nodes : [
   *        {id : '1',text : '1',children : [{id : '11',text : '11'}]},
   *        {id : '2',text : '2'}
   *      ]
   *    });
   *    tree.render();
   *  });
   * </code></pre>
   *
   * ** 你还可以替换icon ** 
   * <pre><code>
   *  BUI.use('bui/tree',function(Tree){
   *    var tree = new Tree.TreeMenu({
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
   * </code></pre>
   * @mixin BUI.Tree.Mixin
   * @extends BUI.List.SimpleList
   */
  var TreeMenu = List.SimpleList.extend([Mixin,Selection],{
    
  },{
    ATTRS : {
      itemCls : {
        value : BUI.prefix + 'tree-item'
      },
      /**
       * 文件夹是否可选，用于选择节点时，避免选中非叶子节点
       * @cfg {Boolean} [dirSelectable = false]
       */
      dirSelectable  : {
        value : false
      },
      /**
       * 节点展开的事件
       * @type {String}
       */
      expandEvent : {
        value : 'itemclick'
      },

      itemStatusFields  : {
        /**/
        value : {
          selected : 'selected'
        }
      },
      /**
       * 节点折叠的事件
       * @type {String}
       */
      collapseEvent : {
        value : 'itemclick'
      },
      /**/xview : {
        value : TreeMenuView
      },
      /**
       * 非叶子节点的模板
       * @type {String}
       */
      dirTpl : {
        view : true,
        value : '<li class="{cls}"><a href="#">{text}</a></li>'
      },
      /**
       * 叶子节点的模板
       * @type {String}
       */
      leafTpl : {
        view : true,
        value : '<li class="{cls}"><a href="{href}">{text}</a></li>'
      },
      idField : {
        value : 'id'
      }
    }
  },{
    xclass : 'tree-menu'
  });

  TreeMenu.View = TreeMenuView;
  return TreeMenu;
});