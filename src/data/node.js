/**
 * @fileOverview 树形数据结构的节点类，无法直接使用数据作为节点，所以进行一层封装
 * 可以直接作为TreeNode控件的配置项
 * @ignore
 */

define('bui/data/node',['bui/common'],function (require) {
  var BUI = require('bui/common');

  function mapNode(cfg,map){
    var rst = {};
    if(map){
      BUI.each(cfg,function(v,k){
        var name = map[k] || k;
        rst[name] = v;
      });
      rst.record = cfg;
    }else{
      rst = cfg;
    }
    return rst;
  }
  /**
   * @class BUI.Data.Node
   * 树形数据结构的节点类
   */
  function Node (cfg,map) {
    var _self = this;
    cfg = mapNode(cfg,map);
    BUI.mix(this,cfg);
  }

  BUI.augment(Node,{
    /**
     * 是否根节点
     * @type {Boolean}
     */
    root : false,
    /**
     * 是否叶子节点
     * @type {Boolean}
     */
    leaf : null,
    /**
     * 显示节点时显示的文本
     * @type {Object}
     */
    text : '',
    /**
     * 代表节点的编号
     * @type {String}
     */
    id : null,
    /**
     * 子节点是否已经加载过
     * @type {Boolean}
     */
    loaded : false,
    /**
     * 从根节点到此节点的路径，id的集合如： ['0','1','12'],
     * 便于快速定位节点
     * @type {Array}
     */
    path : null,
    /**
     * 父节点
     * @type {BUI.Data.Node}
     */
    parent : null,
    /**
     * 树节点的等级
     * @type {Number}
     */
    level : 0,
    /**
     * 节点是否由一条记录封装而成
     * @type {Object}
     */
    record : null,
    /**
     * 子节点集合
     * @type {BUI.Data.Node[]}
     */
    children : null,
    /**
     * 是否是Node对象
     * @type {Object}
     */
    isNode : true
  });
  return Node;
});