/**
 * @fileOverview 树形扩展，基于list扩展，可以组合出tree list,tree grid ,tree menu
 * @ignore
 */

define('bui/tree/treemixin',['bui/common'],function (require) {

  //将id 转换成node
  function makeSureNode(self,node){
    if(BUI.isString(node)){
      node = self.getItem(node);
    }
    return node;
  }

  var BUI = require('bui/common'),
    EXPAND = 'expanded',
    LOADING = 'loading',
    CHECKED = 'checked',
    PARTIAL_CHECKED = 'partial-checked',
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
     * 勾选类型，目前提供一下几种勾选方式:
     * <ol>
     *  <li>all : 全部节点可以勾选</li>
     *  <li>onlyLeaf : 只有子节点可以勾选</li>
     *  <li>custom : 自定义勾选，只有节点数据上有checked字段才允许勾选</li>
     *  <li>none : 全部节点不可勾选</li>
     * </ol>
     * @type {Object}
     */
    checkType : {
      value : 'custom'
    },
    /**
     * 选中对象中属性会直接影响相应的状态,默认：
     * <code>
     * {
     *   expanded : 'expanded',
     *   checked : 'checked'
     * }
     * </code>
     * @type {Object}
     */
    itemStatusFields  : {
      value : {
        expanded : 'expanded',
        disabled : 'disabled',
        checked : 'checked'
      }  
    },
    /**
     * 是否显示根节点
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
        checkchange : false
      }
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
    //初始化节点的勾选
    _initChecked : function(node,deep){
      var _self = this,
        parent; 

      if(!node || !_self.isCheckable(node)){ //如果不可选，则不处理勾选
        return;
      }
      parent = node.parent;
      if(!_self.isChecked(node)){ //节点未被选择，根据父、子节点处理勾选
        if(parent && _self.isChecked(parent)){ //如果父节点选中，当前节点必须勾选
          _self.setStatusValue(node,'checked',true);
        }
        if(_self._isAllChildrenChecked(node)){
          _self.setStatusValue(node,'checked',true);
        }
      }
      if(deep){
        BUI.each(node.children,function(subNode){
          _self._initChecked(subNode);
        });
      }
      
    },
    //设置部分选中效果
    _resetPatialChecked : function(node,checked,hasChecked,element){
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
      
    },
    //子节点变化，重置父节点勾选
    _resetParentChecked : function(parentNode){
      var _self = this,
        allChecked = _self._isAllChildrenChecked(parentNode);
      _self.setStatusValue(parentNode,'checked',allChecked);
      _self.setNodeChecked(parentNode,allChecked,false);
      _self._resetPatialChecked(parentNode,allChecked);
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
        }else if(sender.hasClass(CLS_CHECKBOX)){
          var checked = _self.isChecked(node);
          _self.setNodeChecked(node,!checked);
        }
      });

      _self.on('itemrendered',function(ev){
        var node = ev.item,
          element = ev.domTarget;
        _self._resetIcons(node,element);
        if(_self.isCheckable(node)){
          _self._resetPatialChecked(node,null,null,element);
        }
        if(_self._isExpanded(node,element)){
          _self._showChildren(node);
        }
        
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
        node = _self.getItem(node);
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
     * 设置节点勾选状态
     * @param {String|Object|BUI.Data.Node} node 节点或者节点id
     * @param {Boolean} checked 是否勾选
     */
    setNodeChecked : function(node,checked,deep){
      deep = deep == null ? true : deep;
      var _self = this,
        parent,
        element;
      node = makeSureNode(this,node);
      parent = node.parent;
      if(!_self.isCheckable(node)){
        return;
      }

      if(_self.isChecked(node) !== checked || _self.hasStatus(node,'checked') !== checked){

        element =  _self.findElement(node);
        if(element){
          _self.setItemStatus(node,CHECKED,checked,element); //设置选中状态
          _self._resetPatialChecked(node,checked,checked,element); //设置部分勾选状态
        }else if(!_self.isItemDisabled(node)){
          _self.setStatusValue(node,'checked',checked);
        }
        if(parent){ //设置父元素选中
          if(_self.isChecked(parent) != checked){
            _self._resetParentChecked(parent);
          }else{
            _self._resetPatialChecked(parent);
          }
        }
        _self.fire('checkchange',{node : node,element: element,checked : checked});
        
      }
      if(!node.leaf && deep){ //树节点，勾选所有子节点
        BUI.each(node.children,function(subNode){
          _self.setNodeChecked(subNode,checked,deep);
        });
      }
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
    /**
     * 节点是否勾选
     * @return {Boolean} 节点是否勾选
     */
    isChecked : function(node){
      if(!node){
        return false;
      }
      return this.getStatusValue(node,'checked');
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
      var _self = this,
        children = node.children,
        rst = false;
      BUI.each(children,function(subNode){
        rst = rst || _self.isChecked(subNode);
        if(rst){ //存在选中的，返回
          return false;
        }
      });
      return rst;
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
        element = _self.findElement(node);
      if(element){
        _self._setLoadStatus(node,element,true);
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
        id = params.id;
      _self._beforeLoadNode(id);
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
      if(_self.isExpanded(parent)){ //如果父节点展开
        _self.removeItem(node);
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
      icons.push(_self._getCheckedIcon(node));
      icons.push(_self._getNodeTypeIcon(node));
      return BUI.substitute(iconWraperTpl,{icons : icons.join('')});
    },
    //获取勾选icon
    _getCheckedIcon : function(node){
      var _self = this,
        checkable = _self.isCheckable(node);
      if(checkable){
        return _self._getIcon(CLS_CHECKBOX);
      }
      return '';
    },
    isCheckable : function(node){
      return this.getStatusValue(node,'checked') != null;
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
        //node[_self.get('expandField')] = false;
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
        store = _self.get('store');
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
          //_self.addItemsAt(node.children,index + 1);
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
        i;
      for (i = length - 1; i >= 0; i--) {
        subNode = node.children[i];
        if(!_self.getItem(subNode)){
          _self.addItemAt(subNode,index + 1);
        }
      };
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