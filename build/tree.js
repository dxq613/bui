/**
 * @fileOverview 选择框命名空间入口文件
 * @ignore
 */

define('bui/tree',['bui/common','bui/tree/treemixin','bui/tree/treelist','bui/tree/treemenu'],function (require) {
  var BUI = require('bui/common'),
    Tree = BUI.namespace('Tree');

  BUI.mix(Tree,{
    TreeList : require('bui/tree/treelist'),
    Mixin : require('bui/tree/treemixin'),
    TreeMenu : require('bui/tree/treemenu')
  });
  return Tree;
});/**
 * @fileOverview 树形扩展，基于list扩展，可以组合出tree list,tree grid ,tree menu
 * @ignore
 */

define('bui/tree/treemixin',['bui/common','bui/data'],function (require) {

  //将id 转换成node
  function makeSureNode(self,node){
    if(BUI.isString(node)){
      node = self.findNode(node);
    }
    return node;
  }
  //动画执行
  function animateFn(fn,timeout,count){
    setTimeout(function(){
      fn();
    }, timeout/count);
  }

  var BUI = require('bui/common'),
    Data = require('bui/data'),
    EXPAND = 'expanded',
    LOADING = 'loading',
    CHECKED = 'checked',
    PARTIAL_CHECKED = 'partial-checked',
    MAP_TYPES = {
      NONE : 'none',
      ALL : 'all',
      CUSTOM : 'custom',
      ONLY_LEAF : 'onlyLeaf'
    },
    CLS_ICON = 'x-tree-icon',
    CLS_ELBOW = 'x-tree-elbow',
    CLS_SHOW_LINE = 'x-tree-show-line',
    CLS_ICON_PREFIX = CLS_ELBOW + '-',
    CLS_ICON_WRAPER = CLS_ICON + '-wraper',
    CLS_LINE = CLS_ICON_PREFIX + 'line',
    CLS_END = CLS_ICON_PREFIX + 'end',
    CLS_EMPTY = CLS_ICON_PREFIX + 'empty',
    CLS_EXPANDER = CLS_ICON_PREFIX + 'expander',
    CLS_CHECKBOX = CLS_ICON + '-checkbox',
    CLS_RADIO = CLS_ICON + '-radio', 
    CLS_EXPANDER_END = CLS_EXPANDER + '-end',
    Mixin = function(){

    };

  /**
   * @class BUI.Tree.Mixin
   * 树控件的扩展，可以应用于List,Grid等控件
   */
  Mixin.ATTRS = {


    /**
     * 树的数据缓冲类对象,用于操作数据的加载、增删改
     * <pre><code>
     * //数据缓冲类
     * var store = new Data.TreeStore({
     *     root : {
     *       id : '0',
     *      text : '0'
     *     },
     *     url : 'data/nodes.php'
     *   });
     *   
     * var tree = new Tree.TreeList({
     *   render : '#t1',
     *   showLine : true,
     *   height:300,
     *   store : store,
     *   showRoot : true
     * });
     * tree.render();
     * 
     * </code></pre>
     * @cfg {BUI.Data.TreeStore} store
     */
    /**
     * 树的数据缓冲类对象,默认都会生成对应的缓冲对象
     * <pre><code>
     * var store = tree.get('store');
     * </code></pre>
     * @type {BUI.Data.TreeStore}
     */
    store : {
      getter : function(v){
        if(!v){
          var _self = this,
            store = new Data.TreeStore({
            root : _self.get('root'),
            data : _self.get('nodes')
          });
          _self.setInternal('store',store);
          return store;
        }
        return v;
      }
    },
    /**
     * 树的根节点
     * <pre><code>
     *   //如果数据存在根节点，则配置根节点，以便于显示
     *   var tree = new TreeList({
     *     root : {id: '0',text : '0',children:[{},{}]},
     *     showRoot : true
     *   });
     *   //如果配置store，则不需要配置此属性
     *   var store = new Data.TreeStore({
     *     root : {id: '0',text : '0',children:[{},{}]}
     *   });
     *   
     *   var tree = new TreeList({
     *     store : store,
     *     showRoot : true
     *   });
     * </code></pre>
     * @cfg {Object} root
     */
    root : {

    },
    /**
     * 子节点集合
     * <pre><code>
     *   //如果不显示根节点，并且数据源中不存在根节点，可以仅配置此属性
     *   var tree = new TreeList({
     *     nodes:[{},{}]
     *   });
     * </code></pre>
     * @cfg {Array} nodes
     */
    nodes : {
      sync : false
    },
    /**
     * 放置节点Icon的容器,为空时，放置在节点的最前面
     * @protected
     * @type {String}
     */
    iconContainer : {

    },
    /**
     * 放置icon外层的模板，空白icon、叶子节点的icon、非叶子节点的Icon
     * @protected
     * @type {String}
     */
    iconWraperTpl : {
      value : '<span class="' + CLS_ICON_WRAPER + '">{icons}</span>'
    },
    /**
     * 是否显示连接线
     * <pre><code>
     *  var tree = new TreeList({
     *    nodes : [],
     *    showLine : true
     *  });
     * </code></pre>
     * @cfg {Boolean} showLine
     */
    /**
     * 是否显示连接线
     * @type {Boolean} showLine
     */
    showLine : {
      value : false
    },
    /**
     * 是否显示图标，包括节点展开折叠的图标，标示层级关系的空白图标
     * @type {Boolean}
     */
    showIcons : {
      value : true
    },
    /**
     * 图标所使用的模板
     * @protected
     * @type {Object}
     */
    iconTpl : {
      value : '<span class="x-tree-icon {cls}"></span>'
    },
    /**
     * 叶子节点应用的样式
     * <pre><code>
     *  var tree = new TreeList({
     *    nodes : [{},{}],
     *    leafCls : 'file',
     *    dirCls : 'folder' 
     *  });
     * </code></pre>
     * @cfg {String} [leafCls = 'x-tree-elbow-leaf']
     */
    leafCls : {
      value : CLS_ICON_PREFIX + 'leaf'
    },

    /**
     * 非叶子节点应用的样式
     * @cfg {String} [dirCls = 'x-tree-elbow-dir']
     */
    dirCls : {
      value : CLS_ICON_PREFIX + 'dir'
    },
    /**
     * 勾选类型，目前提供一下几种勾选方式:
     * <ol>
     *  <li>all : 全部节点可以勾选</li>
     *  <li>onlyLeaf : 只有子节点可以勾选</li>
     *  <li>custom : 自定义勾选，只有节点数据上有checked字段才允许勾选</li>
     *  <li>none : 全部节点不可勾选</li>
     * </ol>
     * @cfg {Object} [checkType = 'custom']
     */
    checkType : {
      value : 'custom'
    },
    /**
     * 是否级联选择
     * @type {Boolean}
     */
    cascadeCheckd : {
      value : true
    },
    /**
     * 是否只允许一个节点展开
     * @type {Boolean}
     */
    accordion : {
      value : false
    },
    /**
     * 是否可以勾选多个节点
     * @type {Boolean}
     */
    multipleCheck : {
      value : true
    },
    /**
     * @private
     * 勾选字段
     * @type {String}
     */
    checkedField : {
      valueFn : function(){
        return this.getStatusField('checked');
      }
    },
    /**
     * 是否可以勾选的字段名称
     * @type {String}
     */
    checkableField : {
      value : 'checkable'
    },
    /**
     * 选项对象中属性会直接影响相应的状态,默认：
     * <pre><code>
     * //默认值
     * {
     *   expanded : 'expanded',
     *   disabled : 'disabled',
     *   checked : 'checked'
     * }
     * //对象
     * var node = {id : '1',text : '1',checked : true,expanded : true};
     * 
     * //如果你的数据源中的字段名跟这些状态名不一致，你可以自己修改
     * var tree = new TreeList({
     *   nodes : [],
     *   itemStatusFields : {
     *     disabled : 'hasDisabled', 
     *     custom : 'custom'  //添加自定义属性，此时节点生成后会自动添加对应的样式 bui + xclass + 'custom'
     *   }
     * });
     * </code></pre>
     * @override
     * @cfg {Object} itemStatusFields
     */
    itemStatusFields  : {
      value : {
        expanded : 'expanded',
        disabled : 'disabled',
        checked : 'checked'
      }  
    },
    /**
     * 文件夹是否可选，用于选择节点时，避免选中非叶子节点
     * @cfg {Boolean} [dirSelectable = true]
     */
    dirSelectable : {
      value : true
    },
    /**
     * 是否显示根节点
     * <pre><code>
     *
     *  var tree = new TreeList({
     *    root : {id : '0',text : '0',childrent : []},
     *    showRoot : true
     *  });
     *   
     * </code></pre>
     * @type {Boolean}
     */
    showRoot : {
      value : false
    },
    events : {
      value : {
        /**
         * @event
         * 展开节点
         * @param {Object} e 事件对象
         * @param {Object} e.Node 节点
         * @param {HTMLElement} e.element 节点的DOM
         */
        expanded : false,
        /**
         * @event
         * 折叠节点
         * @param {Object} e 事件对象
         * @param {Object} e.Node 节点
         * @param {HTMLElement} e.element 节点的DOM
         */
        collapsed : false,
        /**
         * @event
         * 勾选改变事件
         * @param {Object} e 事件对象
         * @param {Object} e.Node 节点
         * @param {Boolean} e.checked 选中状态
         * @param {HTMLElement} e.element 节点的DOM
         */
        checkedchange : false
      }
    },
    /**
     * 节点展开的事件
     * @type {String}
     */
    expandEvent : {
      value : 'itemdblclick'
    },
    /**
     * 展开收缩时是否使用动画
     * @type {Boolean}
     */
    expandAnimate : {
      value : false 
    },
    /**
     * 节点收缩的事件
     * @type {String}
     */
    collapseEvent : {
      value : 'itemdblclick'
    },
    /**
     * 开始的层级，如果显示根节点，从0开始，不显示根节点从1开始
     * @private
     * @readOnly
     * @type {Number}
     */
    startLevel : {
      value : 1
    }
  };

  BUI.augment(Mixin,{
    /**
     * 折叠所有
     * <pre><code>
     *  tree.collapseAll();
     * </code></pre>
     */
    collapseAll: function(){
      var _self = this,
        elements = _self.get('view').getAllElements();

      BUI.each(elements,function(element){
        var item = _self.getItemByElement(element);
        if(item){
          _self._collapseNode(item,element,true);
        }
      });
    },
    /**
     * 折叠节点
     * <pre><code>
     *  //获取节点后，折叠
     *  var node = tree.findNode('id');
     *  tree.collapseNode(node);
     *  //直接通过id 折叠
     *  tree.collapseNode('id');
     * </code></pre>
     * @param {String|Object|BUI.Data.Node} node 节点
     */
    collapseNode : function(node){
      var _self = this,
        element;
      if(BUI.isString(node)){
        node = _self.findNode(node);
      }
      if(!node){
        return;
      }
      element = _self.findElement(node);
      
      _self._collapseNode(node,element);
    },   
    /*
     * 展开所有
     * <pre><code>
     *  tree.expandAll();
     * </code></pre>
     */
    expandAll : function(){
      var _self = this,
        elements = _self.get('view').getAllElements();

      BUI.each(elements,function(element){
        var item = _self.getItemByElement(element);
        _self._expandNode(item,element,true);
      });
    },
    /**
     * 展开节点
     * <pre><code>
     *  //获取节点后展开
     *  var node = tree.findNode('id');
     *  tree.expandNode(node);
     *  //使用store时，获取节点，然后展开
     *  var node = store.findNode('id');
     *  tree.expandNode(node);
     *  //直接使用id 展开
     *  tree.expandNode('id');
     * </code></pre>
     * ** Notes **
     * 由于树控件其实是一个列表，所以未展开节点的子节点其实不在列表中，所以这些节点通过tree.getItem('id'),此时查找不到对应的节点
     * @param  {String|Object|BUI.Data.Node} node 节点或者 节点id
     */
    expandNode : function(node,deep){
      var _self = this,
        element;
      if(BUI.isString(node)){
        node = _self.findNode(node);
      }

      if(!node){
        return;
      }

      if(node.parent && !_self.isExpanded(node.parent)){
        _self.expandNode(node.parent);
      }

      element = _self.findElement(node);
      _self._expandNode(node,element,deep);
    },
    /**
     * 沿着path(id的连接串) 展开
     * <pre>
     *  <code>
     *    var path = "0,1,12,121"; //沿着根节点0，树节点 1,12直到121的路径展开
     *    tree.expandPath(path); //如果中间有节点不存在，终止展开
     *  </code>
     * </pre>
     * @param  {String} path 节点的path，从根节点，到当前节点的id组合
     */
    expandPath : function(path,async,startIndex){
      if(!path){
        return;
      }
      startIndex = startIndex || 0;
      var _self = this,
        store = _self.get('store'),
        preNode,
        node,
        i,
        id,
        arr = path.split(',');

      preNode = _self.findNode(arr[startIndex]);
      for(i = startIndex + 1; i < arr.length ; i++){
        id = arr[i];
        node = _self.findNode(id,preNode);
        if(preNode && node){ //父元素，子元素同时存在
          _self.expandNode(preNode);
          preNode = node;
        }else if(preNode && async){
          store.load({id : preNode.id},function(){ //加载完成后
            node = _self.findNode(id,preNode);
            if(node){
              _self.expandPath(path,async,i);
            }
          });
          break;
        } 
      }
    },
    /**
     * 查找节点
     * <pre><code>
     *  var node = tree.findNode('1');//从根节点开始查找节点
     *  
     *  var subNode = tree.findNode('123',node); //从指定节点开始查找
     * </code></pre>
     * @param  {String} id 节点Id
     * @param  {BUI.Data.Node} [parent] 父节点
     * @return {BUI.Data.Node} 节点
     */
    findNode : function(id,parent){
      return this.get('store').findNode(id,parent);
    },  
    /**
     * 获取所有勾选的子节点
     * <pre><code>
     *  //获取所有选中的叶子节点
     *  var nodes = tree.getCheckedLeaf();
     *  
     *  //获取指定节点选中的叶子节点
     *  var node = tree.findNode('1'),
     *    nodes = tree.getCheckedLeaf(node);
     *  
     * </code></pre>
     * @param {BUI.Data.Node} [parent] 父节点
     * @return {Array} 节点列表
     */
    getCheckedLeaf : function(parent){
      var _self = this,
        store = _self.get('store');

      return store.findNodesBy(function(node){
        return node.leaf && _self.isChecked(node);
      },parent);
    },
    /**
     * 获取勾选中的节点列表
     * <pre><code>
     *  //获取所有选中节点
     *  var nodes = tree.getCheckedNodes();
     *  
     *  //获取指定节点选中的节点
     *  var node = tree.findNode('1'),
     *    nodes = tree.getCheckedNodes(node);
     *  
     * </code></pre>
     * @param {BUI.Data.Node} [parent] 父节点
     * @return {Array} 节点列表
     */
    getCheckedNodes : function(parent){
      var _self = this,
        store = _self.get('store');

      return store.findNodesBy(function(node){
        return _self.isChecked(node);
      },parent);
    },
    //节点是否可以被选中
    isItemSelectable : function(item){
      var _self = this,
        dirSelectable = _self.get('dirSelectable'),
        node = item;
      if(node && !dirSelectable && !node.leaf){ //如果阻止非叶子节点选中
        return false;
      }
      return true;
    },
    /**
     * 节点是否展开,如果节点是叶子节点，则始终是false
     * <pre><code>
     *  tree.isExpanded(node);
     * </code></pre>
     * @return {Boolean} 是否展开
     */
    isExpanded : function(node){
      if(!node || node.leaf){
        return false;
      }
      var _self = this,
        element;
      if(_self._isRoot(node) && !_self.get('showRoot')){ //根节点，切不显示根节点时，认为根节点时展开的
        return true;
      }
      if(BUI.isString(node)){
        item = _self.getItem(node);
      }
      element = _self.findElement(node);
      return this._isExpanded(node,element);
    },
    /**
     * 节点是否勾选
     * <pre><code>
     *  tree.isChecked(node);
     * </code></pre>
     * @return {Boolean} 节点是否勾选
     */
    isChecked : function(node){
      if(!node){
        return false;
      }
      return  !!node[this.get('checkedField')];//this.getStatusValue(node,'checked');
    },
    /**
     * 切换显示隐藏
     * <pre><code>
     *  var node = tree.getItem('id');
     *  tree.collapseNode(node); //节点收缩
     *  tree.toggleExpand(node); //节点展开
     *  tree.toggleExpand(node); //节点收缩
     * </code></pre>
     * @param  {String|Object|BUI.Data.Node} node 节点
     */
    toggleExpand : function(node){
      var _self = this,
        element;
      if(BUI.isString(node)){
        item = _self.getItem(node);
      }
      element = _self.findElement(node);
      _self._toggleExpand(node,element);
    },
    /**
     * 设置节点勾选状态
     * <pre><code>
     *  var node = tree.findNode('1');
     *  tree.setNodeChecked(node,true); //勾选
     *  tree.setNodeChecked(node,false); //取消勾选
     * </code></pre>
     * @param {String|Object|BUI.Data.Node} node 节点或者节点id
     * @param {Boolean} checked 是否勾选
     */
    setNodeChecked : function(node,checked,deep){
      deep = deep == null ? true : deep;

      if(!node){
        return;
      }
      var _self = this,
        parent,
        multipleCheck = _self.get('multipleCheck'),
        cascadeCheckd = _self.get('cascadeCheckd'),
        element;
      node = makeSureNode(this,node); //将id转换成节点
      if(!node){
        return;
      }
      parent = node.parent;
      if(!_self.isCheckable(node)){ //不可选返回
        return;
      }

      //如果节点当前的选中状态不等于 checked
      if(_self.isChecked(node) !== checked || _self.hasStatus(node,'checked') !== checked){

        element =  _self.findElement(node);
        //如果级联选择
        if(cascadeCheckd){ 

          if(element){
            _self.setItemStatus(node,CHECKED,checked,element); //设置选中状态
            if(multipleCheck){ //多选状态下设置半选状态
              _self._resetPatialChecked(node,checked,checked,element); //设置部分勾选状态
            }else{
              if(checked && parent && _self.isChecked(parent) != checked){
                _self.setNodeChecked(parent,checked,false);
              }
            }
          }else if(!_self.isItemDisabled(node)){
            _self.setStatusValue(node,CHECKED,checked);
          }

          if(parent){ //设置父元素选中
            if(_self.isChecked(parent) != checked){
              _self._resetParentChecked(parent);
            }else if(multipleCheck){
              _self._resetPatialChecked(parent,null,null,null,true);
            }
          }
          
        }else if(!_self.isItemDisabled(node)){
          if(element){
            _self.setItemStatus(node,CHECKED,checked,element)
          }else{
            _self.setStatusValue(node,CHECKED,checked);
          } 
        }

        //如果是单选则，清除兄弟元素的选中
        if(checked && !multipleCheck && (_self.isChecked(parent) || parent == _self.get('root') || !cascadeCheckd)){
          var nodes = parent.children;
          BUI.each(nodes,function(slibNode){
            if(slibNode !== node && _self.isChecked(slibNode)){
              _self.setNodeChecked(slibNode,false);
            } 
          });
        }
          
        _self.fire('checkedchange',{node : node,element: element,checked : checked});
        
      }
      if(!node.leaf && deep && cascadeCheckd){ //树节点，勾选所有子节点
        BUI.each(node.children,function(subNode,index){
          if(multipleCheck || !checked || (!multipleCheck && index == 0)){ //多选或者单选时第一个
            _self.setNodeChecked(subNode,checked,deep);
          }
        });
      }
    },

    /**
     * 设置节点勾选状态
     * @param {String|Object|BUI.Data.Node} node 节点或者节点id
     */
    setChecked : function(node){
      this.setNodeChecked(node,true);
    },
    /**
     * 清除所有的勾选
     */
    clearAllChecked : function(){
      var _self = this,
        nodes = _self.getCheckedNodes();
      BUI.each(nodes,function(node){
        _self.setNodeChecked(node,false);
      });
    },
    //初始化根节点
    _initRoot : function(){
      var _self = this,
        store = _self.get('store'),
        root,
        showRoot = _self.get('showRoot'),
        nodes;
      if(store){
        root = store.get('root');
        _self.setInternal('root',root);
        if(showRoot){
          nodes = [root];
        }else{
          nodes = root.children;
        }
        
        BUI.each(nodes,function(subNode){
          _self._initChecked(subNode,true);
        });
        _self.clearItems();
        _self.addItems(nodes);
        //_self.set('nodes',nodes);
      }

    },
    //初始化节点的勾选
    _initChecked : function(node,deep){
      var _self = this,
        checkType = _self.get('checkType'),
        checkedField = _self.get('checkedField'),
        multipleCheck = _self.get('multipleCheck'),
        checkableField = _self.get('checkableField'),
        cascadeCheckd = _self.get('cascadeCheckd'),
        parent; 
      if(checkType === MAP_TYPES.NONE){ //不允许选中
        node[checkableField] = false;
        node[checkedField] = false;
        return;
      }

      if(checkType === MAP_TYPES.ONLY_LEAF){ //仅叶子节点可选
        if(node.leaf){
          node[checkableField] = true;
        }else{
          node[checkableField] = false;
          node[checkedField] = false;
          if(deep){
            BUI.each(node.children,function(subNode){
              _self._initChecked(subNode,deep);
            });
          }
        }
        return;
      }

      if(checkType === MAP_TYPES.CUSTOM){ //自定义选中时，根据节点上是否有checked判断
        if(node[checkableField] == null){
          node[checkableField] = node[checkedField] != null;
        }
        
      }

      if(checkType === MAP_TYPES.ALL){ //所有允许选中
        node[checkableField] = true;
      }

      if(!node || !_self.isCheckable(node)){ //如果不可选，则不处理勾选
        return;
      }

      parent = node.parent;
      if(!_self.isChecked(node) && cascadeCheckd){ //节点未被选择，根据父、子节点处理勾选

        if(parent && _self.isChecked(parent)){ //如果父节点选中，当前节点必须勾选
          if(multipleCheck || !_self._hasChildChecked(parent)){ //多选或者兄弟节点没有被选中
            _self.setStatusValue(node,'checked',true);
          }
        }
        //节点为非叶子节点，同时叶子节点不为空时根据叶子节点控制
        if((node.children && node.children.length && _self._isAllChildrenChecked(node)) ||(!multipleCheck && _self._hasChildChecked(node))){
          _self.setStatusValue(node,'checked',true);
        }
      }
      if(deep){
        BUI.each(node.children,function(subNode){
          _self._initChecked(subNode,deep);
        });
      }
      
    },
    //设置部分选中效果
    _resetPatialChecked : function(node,checked,hasChecked,element,upper){
      if(!node || node.leaf){
        return true;
      }
      var _self = this,
        hasChecked;
      checked = checked == null ? _self.isChecked(node) : checked;
      if(checked){
        _self.setItemStatus(node,PARTIAL_CHECKED,false,element);
        return;
      }
      hasChecked = hasChecked == null ? _self._hasChildChecked(node) : hasChecked;

      _self.setItemStatus(node,PARTIAL_CHECKED,hasChecked,element);
      if(upper && node.parent){
        _self._resetPatialChecked(node.parent,false,hasChecked ? hasChecked : null,null,upper)
      }
      
    },
    //子节点变化，重置父节点勾选
    _resetParentChecked : function(parentNode){
      if(!this.isCheckable(parentNode)){
        return;
      }
      var _self = this,
        multipleCheck = _self.get('multipleCheck'),
        allChecked = multipleCheck ? _self._isAllChildrenChecked(parentNode) : _self._hasChildChecked(parentNode);
      _self.setStatusValue(parentNode,'checked',allChecked);
      _self.setNodeChecked(parentNode,allChecked,false);

      multipleCheck && _self._resetPatialChecked(parentNode,allChecked,null,null,true);
    },
    //绑定事件
    __bindUI : function(){
      var _self = this,
        el = _self.get('el'),
        multipleCheck = _self.get('multipleCheck');

      //点击选项
      _self.on('itemclick',function(ev){
        var sender = $(ev.domTarget),
          element = ev.element,
          node = ev.item;
        if(sender.hasClass(CLS_EXPANDER)){
          _self._toggleExpand(node,element); //点击展开收缩节点，不触发选中事件
          return false;
        }else if(sender.hasClass(CLS_CHECKBOX)){
          var checked = _self.isChecked(node);
          _self.setNodeChecked(node,!checked);
        }else if(sender.hasClass(CLS_RADIO)){
          _self.setNodeChecked(node,true);
        }
        
      });

      _self.on('itemrendered',function(ev){
        var node = ev.item,
          element = ev.domTarget;
        _self._resetIcons(node,element);
        if(_self.isCheckable(node) && multipleCheck && _self.get('cascadeCheckd')){
          _self._resetPatialChecked(node,null,null,element);
        }
        if(_self._isExpanded(node,element)){
          _self._showChildren(node);
        }
        
      });
      _self._initExpandEvent();
    },
    //初始化展开收缩事件
    _initExpandEvent : function(){
      var _self = this,
        el = _self.get('el'),
        expandEvent = _self.get('expandEvent'),
        collapseEvent = _self.get('collapseEvent');

      function createCallback(methodName){
        return function(ev){
          var sender = $(ev.domTarget),
            element = ev.element,
            node = ev.item;
          if(!sender.hasClass(CLS_EXPANDER)){
            _self[methodName](node,element);
          }
        }
      }
      if(expandEvent == collapseEvent){
        _self.on(expandEvent,createCallback('_toggleExpand'));
      }else{
        if(expandEvent){
          _self.on(expandEvent,createCallback('_expandNode'));
        }
        if(collapseEvent){
          _self.on(collapseEvent,createCallback('_collapseNode'));
        }
      }
      
    },
    //是否根据子节点选中
    _isForceChecked : function(node){
      var _self = this,
        multipleCheck = _self.get('multipleCheck');
      return multipleCheck ? _self._isAllChildrenChecked() : _isForceChecked();
    },
    //是否所有子节点被选中
    _isAllChildrenChecked : function(node){
      if(!node || node.leaf){
        return false;
      }
      var _self = this,
        children = node.children,
        rst = true;
      BUI.each(children,function(subNode){
        rst = rst && _self.isChecked(subNode);
        if(!rst){ //存在未选中的，返回
          return false;
        }
      });
      return rst;
    },
    //是否有子节点选中
    _hasChildChecked : function(node){
      if(!node || node.leaf){
        return false;
      }
      var _self = this;

      return _self.getCheckedNodes(node).length != 0;
    },
    //是否是根节点
    _isRoot : function(node){
      var _self = this,
        store = _self.get('store');
      if(store && store.get('root') == node){
        return true;
      }
      return false;
    },
    //设置加载状态
    _setLoadStatus : function(node,element,loading){
      var _self = this;
      _self.setItemStatus(node,LOADING,loading,element);
    },  
    //加载节点前
    _beforeLoadNode : function(node){
      var _self = this,
        element;
      if(BUI.isString(node)){
        node = _self.findNode(node);
      }
      element = _self.findElement(node);

      if(element){ //折叠节点，设置加载状态
        _self._collapseNode(node,element);
        _self._setLoadStatus(node,element,true);
        
      }
      else if(node){
        BUI.each(node.children,function(subNode){
          _self._removeNode(subNode);
        });
      }
      
    },
    /**
     * @override
     * @protected
     * 加载节点前触发
     */
    onBeforeLoad : function(e){
      var _self = this,
        params = e.params,
        id = params.id,
        node = _self.findNode(id) || _self.get('root');
      _self._beforeLoadNode(node);
    },
    //添加节点
    _addNode : function(node,index){
      var _self = this,
        parent = node.parent,
        scount,//兄弟节点的数量
        prevNode, //前一个节点
        nextNode, //后一个节点，用于计算本节点放置的位置,不一定是同级节点
        cIndex;//节点插入的位置
      _self._initChecked(node,true);
      if(parent){
        if(_self.isExpanded(parent)){ //展开的节点
          scount = parent.children.length;

          cIndex = _self._getInsetIndex(node);//下一个节点的位置
          _self.addItemAt(node,cIndex);
          if(index == scount -1 && index > 0){ //作为最后一个节点，更新前一个兄弟节点的图标
            prevNode = parent.children[index - 1];
            _self._updateIcons(prevNode);
          }
        }
        _self._updateIcons(parent); //更新父节点的icon
      }else{ //没有父节点，则添加到跟节点下
        cIndex = _self._getInsetIndex(node);
        _self.addItemAt(node,cIndex);
        prevNode = _self.get('nodes')[index - 1];
        _self._updateIcons(prevNode);
      }
    },
    //获取节点的插入位置
    _getInsetIndex : function(node){
      var _self = this,
        nextNode,
        rst = null;
      nextNode = _self._getNextItem(node);
      if(nextNode){
        return _self.indexOfItem(nextNode);
      }
      return _self.getItemCount();
    },
    //获取显示在列表上的下一项，不仅仅是同级节点
    _getNextItem : function(item){
      var _self = this,
        parent = item.parent,
        slibings,
        cIndex,
        rst = null;
      if(!parent){
        return null;
      }
      slibings = parent.children;
      cIndex = BUI.Array.indexOf(item,slibings)
      rst = slibings[cIndex + 1];

      return rst || _self._getNextItem(parent);
    },
    /**
     * @override 
     * @protected
     * 重写添加节点方法
     */
    onAdd : function(e){
      var _self = this,
        node = e.node,
        index = e.index;
      _self._addNode(node,index);
    },
    //更新节点
    _updateNode : function(node){
      var _self = this;
      _self.updateItem(node);
      _self._updateIcons(node);
    },
    /**
     * @override 
     * @protected
     * 重写更新节点方法
     */
    onUpdate : function(e){
      var _self = this,
        node = e.node;
      _self._updateNode(node);
    },
    //删除节点
    _removeNode : function(node,index){
      var _self = this,
        parent = node.parent,
        scount,
        prevNode;
      _self.collapseNode(node); //收缩节点，以便于同时删除子节点
      if(!parent){
        return;
      }
      _self.removeItem(node);
      if(_self.isExpanded(parent)){ //如果父节点展开
        
        scount = parent.children.length;
        if(scount == index && index !== 0){ //如果删除的是最后一个，更新前一个节点图标
          prevNode = parent.children[index - 1];
          _self._updateIcons(prevNode);
        }
      }
      _self._updateIcons(parent);
      _self._resetParentChecked(parent);
    },
    /**
     * @override 
     * @protected
     * 重写删除节点方法
     */
    onRemove : function(e){
      var _self = this,
        node = e.node,
        index = e.index;
      _self._removeNode(node,index);
    },
    //加载完节点
    _loadNode : function(node){
      var _self = this;
      _self._initChecked(node,true);
      _self.expandNode(node);
      _self._updateIcons(node);
      _self.setItemStatus(node,LOADING,false);
    },
    __syncUI : function(){
      var _self = this,
        store = _self.get('store'),
        showRoot = _self.get('showRoot');
      if(showRoot && !store.hasData()){ //树节点没有数据，但是需要显示根节点时
        _self._initRoot();
      }
    },

     /**
     * @override 
     * @protected
     * 加载节点
     */
    onLoad : function(e){
      var _self = this,
        store = _self.get('store'),
        root = store.get('root'),
        node;

      if(!e || e.node == root){ //初始化加载时,或者加载根节点
        _self._initRoot();
      }
      if(e && e.node){
        _self._loadNode(e.node);
      } 
    },
    _isExpanded : function(node,element){
      return this.hasStatus(node,EXPAND,element);
    },
    //获取Icon的模板
    _getIconsTpl : function(node){
      var _self = this,
        level = node.level,
        start = _self.get('startLevel'),
        iconWraperTpl = _self.get('iconWraperTpl'),
        icons = [],
        i;
      for(i = start ; i < level ; i = i + 1){
        icons.push(_self._getLevelIcon(node,i));
      }
      icons.push(_self._getExpandIcon(node));
      icons.push(_self._getCheckedIcon(node));
      icons.push(_self._getNodeTypeIcon(node));
      return BUI.substitute(iconWraperTpl,{icons : icons.join('')});
    },
    //获取勾选icon
    _getCheckedIcon : function(node){
      var _self = this,
        checkable = _self.isCheckable(node),
        cls;
      if(checkable){
        cls = _self.get('multipleCheck') ? CLS_CHECKBOX : CLS_RADIO;
        return _self._getIcon(cls);
      }
      return '';
    },
    /**
     * 是否可以勾选
     * @protected
     * @param  {Object | BUI.Data.Node} node 节点
     * @return {Boolean}  是否可以勾选
     */
    isCheckable : function(node){
      return node[this.get('checkableField')];
    },
    //获取展开折叠的icon
    _getExpandIcon : function(node){
      var _self = this,
        cls = CLS_EXPANDER; 
      if(node.leaf){
        return _self._getLevelIcon(node);
      }
      if(_self._isLastNode(node)){
        cls = cls + ' ' + CLS_EXPANDER_END;
      }
      return _self._getIcon(cls);
    },
    //叶子节点和树节点有不同的icon
    _getNodeTypeIcon : function(node){
      var _self = this,
        cls = node.cls ? node.cls :(node.leaf ? _self.get('leafCls') : _self.get('dirCls'));
      return _self._getIcon(cls);
    },
    //获取对应Level的icon
    _getLevelIcon : function(node,level){
      var _self = this,
        showLine = _self.get('showLine'),
        cls = CLS_EMPTY,
        levelNode;
      if(showLine){ //如果显示连接线
        if(node.level === level || level == null){ //当前的连接线
          cls = _self._isLastNode(node) ? CLS_END : CLS_ELBOW;
        }else{ //上一级的连接线
          levelNode = _self._getParentNode(node,level);
          cls = _self._isLastNode(levelNode) ? CLS_EMPTY : CLS_LINE;
        }
      }
      return _self._getIcon(cls);
    },
    //获取对应level的父节点
    _getParentNode : function(node,level){
      var nodeLevel = node.level,
        parent = node.parent,
        i = nodeLevel - 1;
      if(nodeLevel <= level){
        return null;
      }
      while(i > level){
        parent = parent.parent;
        i = i - 1;
      }
      return parent;
    },
    //获取icon
    _getIcon : function(cls){
       var _self = this,
        iconTpl = _self.get('iconTpl');
      return BUI.substitute(iconTpl,{cls : cls});
    },
    //是否是父节点的最后一个节点
    _isLastNode : function(node){

      if(!node){
        return false;
      }
      if(node == this.get('root')){
        return true;
      }

      var _self = this,
        parent = node.parent,
        siblings = parent ? parent.children : _self.get('nodes'),
        count;

      count = siblings.length;
      return siblings[count - 1] === node;
    },
    //初始化所有节点，设置level 和 leaf
    _initNodes : function(nodes,level,parent){
      var _self = this;
      BUI.each(nodes,function(node){
        node.level = level;
        if(node.leaf == null){
          node.leaf = node.children ? false : true;
        }
        if(parent && !node.parent){
          node.parent = parent;
        }
        _self._initChecked(node);
        if(node.children){
          _self._initNodes(node.children,level + 1,node);
        }
        
      });
    },
    //折叠节点
    _collapseNode : function(node,element,deep){
      var _self = this;
      if(node.leaf){
        return;
      }
      if(_self.hasStatus(node,EXPAND,element)){
        _self.setItemStatus(node,EXPAND,false,element);
        if(deep){
          _self._collapseChildren(node,deep);
          _self.removeItems(node.children);
        }else{
          _self._hideChildrenNodes(node);
        }
        _self.fire('collapsed',{node : node ,element : element});
      }
    },
    //隐藏子节点
    _hideChildrenNodes : function(node){
      var _self = this,
        children = node.children,
        elements = [];
      BUI.each(children,function(subNode){
        //_self.removeItem(subNode);
        var element = _self.findElement(subNode);
        if(element){
          elements.push(element);
          _self._hideChildrenNodes(subNode);
        }
      });
      if(_self.get('expandAnimate')){
        elements = $(elements);
        elements.animate({height : 0},function(){
          _self.removeItems(children);
        });
      }else{
        _self.removeItems(children);
      }
      
    },
    _collapseChildren : function(parentNode,deep){
      var _self = this,
        children = parentNode.children;
      
      BUI.each(children,function(node){
        _self.collapseNode(node,deep);
      });
    },
    //展开选项
    _expandNode : function(node,element,deep){
      var _self = this,
        accordion = _self.get('accordion'),
        store = _self.get('store');
      if(node.leaf){ //子节点不展开
        return;
      }
      if(!_self.hasStatus(node,EXPAND,element)){
        if(accordion && node.parent){
          var slibings = node.parent.children;
          BUI.each(slibings,function(sNode){
            if(sNode != node){
              _self.collapseNode(sNode);
            }
          });
        }
        if(store && !store.isLoaded(node)){ //节点未加载，则加载节点
          if(!_self._isLoading(node,element)){
            store.loadNode(node);
          }
        }else if(element){
          _self.setItemStatus(node,EXPAND,true,element);
          _self._showChildren(node);
          _self.fire('expanded',{node : node ,element : element});
        }

      }
      BUI.each(node.children,function(subNode){
        if(deep || _self.isExpanded(subNode)){
          _self.expandNode(subNode,deep);
        }
      });
      
    },
    //显示子节点
    _showChildren : function(node){
      if(!node || !node.children){
        return;
      }
      var _self = this,
        index = _self.indexOfItem(node),
        length = node.children.length,
        subNode,
        i = length - 1,
        elements = [];
      for (i = length - 1; i >= 0; i--) {
        subNode = node.children[i];
        if(!_self.getItem(subNode)){
          if(_self.get('expandAnimate')){
            el = _self._addNodeAt(subNode,index + 1);
            el.hide();
            el.slideDown();
          }else{
            _self.addItemAt(subNode,index + 1);
          } 
        }
      };
    },
    _addNodeAt : function(item,index){
       var _self = this,
        items = _self.get('items');
      if(index === undefined) {
          index = items.length;
      }
      items.splice(index, 0, item);
      return _self.addItemToView(item,index);
    },
    //_showNode
    _isLoading : function(node,element){
      var _self = this;
      return _self.hasStatus(node,LOADING,element);
    },
    //重置选项的图标
    _resetIcons :function(node,element){
      if(!this.get('showIcons')){ //如果不显示图标，则不重置
        return;
      }
      var _self = this,
        iconContainer = _self.get('iconContainer'),
        containerEl,
        iconsTpl = _self._getIconsTpl(node);
      $(element).find('.' + CLS_ICON_WRAPER).remove(); //移除掉以前的图标
      containerEl = $(element).find(iconContainer).first();
      if(iconContainer && containerEl.length){
        $(iconsTpl).prependTo(containerEl);
      }else{
        $(element).prepend($(iconsTpl));
      }
    },
    //切换显示隐藏
    _toggleExpand : function(node,element){
      var _self = this;
      if(_self._isExpanded(node,element)){
        _self._collapseNode(node,element);
      }else{
        _self._expandNode(node,element);
      }
    }, 
    //更新节点图标 
    _updateIcons : function(node){
      var _self = this,
        element = _self.findElement(node);
      if(element){
        _self._resetIcons(node,element);
        if(_self._isExpanded(node,element) && !node.leaf){ //如果节点展开，那么更新子节点的图标样式
          BUI.each(node.children,function(subNode){
            _self._updateIcons(subNode);
          });
        }
      }
    },
    //设置显示根节点
    _uiSetShowRoot : function(v){
      var _self = this,
        start = this.get('showRoot') ? 0 : 1;
      _self.set('startLevel',start);
    },
    _uiSetNodes : function(v){
      var _self = this,
        store = _self.get('store');
      store.setResult(v);
    },
    _uiSetShowLine : function(v){
      var _self = this,
        el = _self.get('el');
      if(v){
        el.addClass(CLS_SHOW_LINE);
      }else{
        el.removeClass(CLS_SHOW_LINE);
      }
    }
  });

  return Mixin;
})/**
 * @fileOverview 树的选中，跟列表的选中有所差异
 * @ignore
 */

define('bui/tree/selection',['bui/list'],function (require) {


	var BUI = require('bui/common'),
		SimpleList = require('bui/list').SimpleList;

	/**
	 * @class BUI.Tree.Selection
	 * 扩展树的选择
	 */
	var Selection = function(){

	};

	Selection.ATTRS = {};

	BUI.augment(Selection,{
		/**
		 * 获取选中的节点，一般用于多选状态下
		 * @return {Array} 获取选中的节点
		 */
		getSelection : function(){
			var _self = this,
				field = _self.getStatusField('selected'),
				store;
			if(field){
				store = _self.get('store');
				return store.findNodesBy(function(node){
					return node[field];
				});
			}
			return SimpleList.prototype.getSelection.call(this);
		},
		/**
		 * 获取选中的一个节点，如果是多选则返回第一个
		 * @return {Object} 获取选中的一个节点
		 */
		getSelected : function(){
			var _self = this,
				field = _self.getStatusField('selected'),
				store;
			if(field){
				store = _self.get('store');
				return store.findNodeBy(function(node){
					return node[field];
				});
			}
			return SimpleList.prototype.getSelected.call(this);
		}
	});

	return Selection;

});/**
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