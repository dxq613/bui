/**
 * @fileOverview 树形扩展，基于list扩展，可以组合出tree list,tree grid ,tree menu
 * @ignore
 */

define('bui/tree/treemixin',['bui/common'],function (require) {

  var BUI = require('bui/common'),
    EXPAND = 'expanded',
    LOADING = 'loading',
    CLS_EXPAND = BUI.prefix + 'tree-item' + EXPAND,
    CLS_ICON = 'x-tree-icon',
    CLS_ELBOW = 'x-tree-elbow',
    CLS_SHOW_LINE = 'x-tree-show-line',
    CLS_ICON_PREFIX = CLS_ELBOW + '-',
    CLS_ICON_WRAPER = CLS_ICON + '-wraper',
    CLS_LINE = CLS_ICON_PREFIX + 'line',
    CLS_END = CLS_ICON_PREFIX + 'end',
    CLS_EMPTY = CLS_ICON_PREFIX + 'empty',
    CLS_EXPANDER = CLS_ICON_PREFIX + 'expander',
    CLS_EXPANDER_END = CLS_EXPANDER + '-end',
    Mixin = function(){

    };

  /**
   * @class BUI.Tree.Mixin
   * 树控件的扩展，可以应用于List,Grid等控件
   */
  Mixin.ATTRS = {

    /**
     * 树的缓冲类对象
     * @type {BUI.Data.TreeStore}
     */
    store : {

    },
    /**
     * 节点
     * @type {Array}
     */
    nodes : {

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
     * @type {False}
     */
    showLine : {
      value : false
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
     * @type {Strign}
     */
    leafCls : {
      value : CLS_ICON_PREFIX + 'leaf'
    },
    /**
     * 非叶子节点应用的样式
     * @type {Strign}
     */
    dirCls : {
      value : CLS_ICON_PREFIX + 'dir'
    },
    /**
     * 节点展开的属性
     * @type {String}
     */
    expandField : {
      value : 'expanded'
    },
    /**
     * 是否选中
     * @type {String}
     */
    checkedField : {
      value : 'checked'
    },
    /**
     * 是否显示根节点
     * @type {Boolean}
     */
    showRoot : {
      value : false
    },
    /**
     * 开始的层级，如果显示根节点，从0开始，不显示根节点从1开始
     * @readOnly
     * @type {Number}
     */
    startLevel : {
      value : 1
    }
  };

  BUI.augment(Mixin,{

    //初始化根节点
    _initRoot : function(){
      var _self = this,
        store = _self.get('store'),
        root,
        showRoot = _self.get('showRoot'),
        nodes;
      if(store){
        root = store.get('root');
        if(showRoot){
          nodes = [showRoot];
        }else{
          nodes = root.children;
        }
        _self.set('nodes',nodes);
      }

    },
    //绑定事件
    __bindUI : function(){
      var _self = this,
        el = _self.get('el');

      //点击选项
      _self.on('itemclick',function(ev){
        var sender = $(ev.domTarget),
          element = ev.element,
          node = ev.item;
        if(sender.hasClass(CLS_EXPANDER)){
          _self._toggleExpand(node,element);
        }
      });

      _self.on('itemrendered',function(ev){
        var node = ev.item,
          element = ev.domTarget;
        _self._resetIcons(node,element);
      });
    },
    /**
     * 折叠所有
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
     * @param {Object|BUI.Data.Node} node 节点
     */
    collapseNode : function(node){
      var _self = this,
        element;
      if(BUI.isString(node)){
        item = _self.getItem(node);
      }
      element = _self.findElement(node);
      
      _self._collapseNode(node,element);
    },
    /*
     * 展开所有
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
     * @param  {String|Object|BUI.Data.Node} node 节点或者 节点id
     */
    expandNode : function(node,deep){
      var _self = this,
        element;
      if(BUI.isString(node)){
        node = _self.getItem(node);
      }

      if(node.parent && !_self.isExpanded(node.parent)){
        _self.expandNode(node.parent);
      }

      element = _self.findElement(node);
      _self._expandNode(node,element,deep);
    }, 
    /**
     * 节点是否展开,如果节点是叶子节点，则始终是false
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
    _setLoadStatus : function(node,element){
      var _self = this;
      _self.setItemStatus(node,LOADING,true,element);
    },  
    //加载节点前
    _beforeLoadNode : function(node){
      var _self = this,
        element = _self.findElement(node);
      if(element){
        _self._setLoadStatus(node,element);
      }
    },
    /**
     * @override
     * @protected
     * 加载节点前触发
     */
    onBeforeLoad : function(e){
      var _self = this,
        node = e.node;
      _self._beforeLoadNode(node);
    },
    //添加节点
    _addNode : function(node,index){
      var _self = this,
        parent = node.parent,
        scount,//兄弟节点的数量
        prevNode, //前一个节点
        nextNode, //后一个节点，用于计算本节点放置的位置,不一定是同级节点
        //pIndex,//父节点的索引位置
        cIndex;//节点插入的位置
      if(parent){
        if(_self.isExpanded(parent)){ //展开的节点
          //pIndex = _self.indexOfItem(parent);
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
      if(_self.isExpanded(parent)){ //如果父节点展开
        _self.removeItem(node);
        scount = parent.children.length;
        if(scount == index && index !== 0){ //如果删除的是最后一个，更新前一个节点图标
          prevNode = parent.children[index - 1];
          _self._updateIcons(prevNode);
        }
      }
      _self._updateIcons(parent);
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
      _self.expandNode(node);
      _self._updateIcons(node);
      _self.setItemStatus(node,LOADING,false);
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
      }else{
        _self._loadNode(e.node);
      } 
    },
    /**
     * 切换显示隐藏
     * @param  {Object|BUI.Data.Node} node 节点
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
      icons.push(_self._getNodeTypeIcon(node));
      return BUI.substitute(iconWraperTpl,{icons : icons.join('')});
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
        cls = node.leaf ? _self.get('leafCls') : _self.get('dirCls');
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
        node[_self.get('expandField')] = false;
      }
    },
    //隐藏字节点
    _hideChildrenNodes : function(node){
      var _self = this,
        children = node.children;
      BUI.each(children,function(subNode){
        _self.removeItem(subNode);
        _self._hideChildrenNodes(subNode);
      });
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
        store = _self.get('store'),
        index = _self.indexOfItem(node);
      if(node.leaf){ //子节点不展开
        return;
      }
      if(!_self.hasStatus(node,EXPAND,element)){
        if(store && !store.isLoaded(node)){ //节点未加载，则加载节点
          if(!_self._isLoading(node,element)){
            store.loadNode(node);
          }
        }else{
          _self.setItemStatus(node,EXPAND,true,element);
          _self.addItemsAt(node.children,index + 1);
          _self.fire('expanded',{node : node ,element : element});
        }
        node[_self.get('expandField')] = true;
      }
      BUI.each(node.children,function(subNode){
        if(deep || subNode[_self.get('expandField')]){
          _self.expandNode(subNode,deep);
        }
      });
      
    },
    _isLoading : function(node,element){
      var _self = this;
      return _self.hasStatus(node,LOADING,element);
    },
    //重置选项的图标
    _resetIcons :function(node,element){
      var _self = this,
        iconContainer = _self.get('iconContainer'),
        containerEl,
        iconsTpl = _self._getIconsTpl(node);
      $(element).find('.' + CLS_ICON_WRAPER).remove(); //移除掉以前的图标
      containerEl = $(element).find('.' + iconContainer);
      if(iconContainer && containerEl.length){
        $(iconsTpl).appendTo(containerEl);
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
        showRoot = _self.get('showRoot'),
        level = showRoot ? 0 : 1;
      _self._initNodes(v,level);
      _self.clearItems();
      _self.addItems(v);
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
})