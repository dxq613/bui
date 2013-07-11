/**
 * @fileOverview 树形对象缓冲类
 * @ignore
 */

define('bui/data/treestore',['bui/common','bui/data/node','bui/data/abstractstore'],function (require) {

  var BUI = require('bui/common'),
    Node = require('bui/data/node'),
    AbstractStore = require('bui/data/abstractstore');

  /**
   * @class BUI.Data.TreeStore
   * 树形数据缓冲类
   * <p>
   * <img src="../assets/img/class-data.jpg"/>
   * </p>
   * <code>
   *   //加载静态数据
   *   var store = new TreeStore({
   *     root : {
   *       text : '根节点',
   *       children : []
   *     }
   *   });
   * </code>
   * @extends BUI.Data.AbstractStore
   */
  function TreeStore(config){
    TreeStore.superclass.constructor.call(this,config);
  }

  TreeStore.ATTRS = {
    /**
     * 根节点
     * @type {Object}
     */
    root : {

    },
    /**
     * 数据映射，用于设置的数据跟@see {BUI.Data.Node} 不一致时，进行匹配。
     * 如果此属性为null,那么假设设置的对象是Node对象
     * @type {Object}
     */
    map : {

    },
    /**
     * 返回数据标示数据的字段
     * @type {Object}
     */
    dataProperty : {
      value : 'nodes'
    },
    events : {
      value : [
        /**  
        * 当添加数据时触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 添加的节点
        * @param {Number} index 添加的位置
        */
        'add',
        /**  
        * 当更新数据指定字段时触发该事件 
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 更新的节点
        */
        'update',
        /**  
        * 当删除数据时触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 删除的节点
        * @param {Number} index 删除节点的索引
        */
        'remove',
        /**  
        * 节点加载完毕触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.node 加载的节点
        * @param {Object} e.params 加载节点时的参数
        */
        'load'
      ]
    }
  }

  BUI.extend(TreeStore,AbstractStore);

  BUI.augment(TreeStore,{
    /**
     * @protected
     * @override
     * 初始化前
     */
    beforeInit:function(){
      this.initRoot();
    },
    //初始化数据,如果默认加载数据，则加载数据
    _initData : function(){
      var _self = this,
        autoLoad = _self.get('autoLoad'),
        root = _self.get('root');

      if(autoLoad){
        params = root.id ? {id : root.id}: {};
        _self.load(params);
      }
    },
    /**
     * @protected
     * 初始化根节点
     */
    initRoot : function(){
      var _self = this,
        map = _self.get('map'),
        root = _self.get('root');
      if(!root){
        root = {};
      }
      if(!root.isNode){
        root = new Node(root,map);
      }
      root.path = [root.id];
      root.level = 0;
      if(root.children){
        _self.setChildren(root,root.children);
      }
      _self.set('root',root);
    },
    /**
     * 添加节点
     * @param {BUI.Data.Node|Object} node 节点或者数据对象
     * @param {BUI.Data.Node} parent 父节点
     * @param {Number} index 添加节点的位置
     */
    add : function(node,parent,index){
      parent = parent || this.get('root');  //如果未指定父元素，添加到跟节点
      var _self = this,
        map = _self.get('map'),
        nodes = parent.children,
        nodeChildren = node.children || [];
      if(nodeChildren.length == 0 && node.leaf == null){
        node.leaf = true;
      }
      if(!node.isNode){
        node = new Node(node,map);
      }

      node.parent = parent;
      node.level = parent.level + 1;
      node.path = parent.path.concat(node.id);
      parent.leaf = false;
      index = index == null ? parent.children.length : index;
      BUI.Array.addAt(nodes,node,index);

      _self.setChildren(node,nodeChildren);
      _self.fire('add',{node : node,index : index});
      return node;
    },
    /**
     * 移除节点
     * @param {BUI.Data.Node} node 节点或者数据对象
     */
    remove : function(node){
      var parent = node.parent || _self.get('root'),
        index = BUI.Array.indexOf(node,parent.children) ;

      BUI.Array.remove(parent.children,node);
      if(parent.children.length === 0){
        parent.leaf = true;
      }
      this.fire('remove',{node : node , index : index});
      node.parent = null;
    },
    /**
     * 更新节点
     * @return {BUI.Data.Node} 更新节点
     */
    update : function(node){
      this.fire('update',{node : node});
    },
    /**
     * 设置子节点
     * @protected
     * @param {BUI.Data.Node} node  节点
     * @param {Array} children 子节点
     */
    setChildren : function(node,children){
      var _self = this;
      node.children = [];
      if(!children.length){
        return;
      }
      BUI.each(children,function(item){
        _self.add(item,node);
      });
    },
    /**
     * 查找节点
     * @param  {String} id 节点Id
     * @param  {BUI.Data.Node} parent 父节点
     * @return {BUI.Data.Node} 节点
     */
    findNode : function(id,parent){
      var _self = this;

      if(!parent){
        var root = _self.get('root');
        if(root.id === id){
          return root;
        }
        return _self.findNode(id,root);
      }
      var children = parent.children,
        rst = null;
      BUI.each(children,function(item){
        if(item.id === id){
          rst = item;
        }else{
          rst = _self.findNode(id,item);
        }
        if(rst){
          return false;
        }
      });
      return rst;
    },
    /**
     * 查找节点,根据匹配函数查找
     * @param  {Function} func 匹配函数
     * @param  {BUI.Data.Node} parent 父元素，如果不存在，则从根节点查找
     * @return {Array} 节点数组
     */
    findNodesBy : function(func,parent){
      var _self = this,
        root,
        rst = [];

      if(!parent){
        parent = _self.get('root');
      }

      BUI.each(parent.children,function(item){
        if(func(item)){
          rst.push(item);
        }
        rst = rst.concat(_self.findNodesBy(func,item));
      });

      return rst;
    },
    /**
     * 是否包含指定节点，如果未指定父节点，从根节点开始搜索
     * @param  {BUI.Data.Node} node 节点
     * @param  {BUI.Data.Node} parent 父节点
     * @return {Boolean} 是否包含指定节点
     */
    contains : function(node,parent){
      var _self = this,
        findNode = _self.findNode(node.id,parent);
      return !!findNode;
    },
    /**
     * 加载完数据
     * @template
     */
    afterProcessLoad : function(data,params){
      var _self = this,
        id = params.id,
        dataProperty = _self.get('dataProperty'),
        node = _self.findNode(id) || _self.get('root');//如果找不到父元素，则放置在跟节点
      if(BUI.isArray(data)){
        _self.setChildren(node,data);
      }else{
        _self.setChildren(node,data[dataProperty]);
      }
      _self.fire('load',{node : node,params : params});
    },
    /**
     * 是否包含数据
     * @return {Boolean} 
     */
    hasData : function(){
      return this.get('root').children && this.get('root').children.length !== 0;
    },
    /**
     * 是否已经加载过，叶子节点或者存在字节点的节点
     * @param   {BUI.Data.Node} node 节点
     * @return {Boolean}  是否加载过
     */
    isLoaded : function(node){
      return node.leaf || node.children.length;
    },
    /**
     * 加载节点的子节点
     * @param  {BUI.Data.Node} node 节点
     */
    loadNode : function(node){
      var _self = this;
      //如果已经加载过，或者节点是叶子节点
      if(_self.isLoaded(node)){
        return ;
      }
      if(!_self.get('url')){ //如果不从远程加载数据，不是根节点的话，取消加载
        return;
      }else{
        _self.load({id:node.id});
      }
      
    }
  });

  return TreeStore;

});