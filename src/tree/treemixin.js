/**
 * @fileOverview 树形扩展，基于list扩展，可以组合出tree list,tree grid ,tree menu
 * @ignore
 */

define('bui/tree/treemixin',['bui/common'],function (require) {

  var BUI = require('bui/common'),
    EXPAND = 'expanded',
    CLS_EXPAND = BUI.prefix + 'tree-item' + EXPAND,
    CLS_ICON = 'x-tree-icon',
    CLS_ELBOW = 'x-tree-elbow',
    CLS_ICON_PREFIX = CLS_ELBOW + '-',
    CLS_ICON_WRAPER = CLS_ICON + '-wraper',
    CLS_LINE = CLS_ICON_PREFIX + 'line',
    CLS_END = CLS_ICON_PREFIX + 'end',
    CLS_EMPTY = CLS_ICON_PREFIX + 'empty',
    CLS_EXPANDER = CLS_ICON_PREFIX + 'expander',
    
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
     * 放置icon外层的模板，空白icon、叶子节点的icon、非叶子节点的Icon
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
     * @type {Object}
     */
    iconTpl : {
      value : '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" class="x-tree-icon {cls}"/>'
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
          _self._collapseNode(item,element);
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
      if(BUI.isString(node)){
        item = _self.getItem(node);
      }
      element = _self.findElement(node);
      return this._isExpanded(node);
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
      var _self = this; 
      if(node.leaf){
        return _self._getLevelIcon(node);
      }
      return _self._getIcon(CLS_EXPANDER);
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

      var parent = node.parent,
        count;

      if(!parent){ //根节点，是最后一个节点
        return true;
      }
      count = parent.children.length;
      return parent.children[count - 1] === node;
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
    _collapseNode : function(node,element){
      var _self = this;
      if(node.leaf){
        return;
      }
      if(_self.hasStatus(node,EXPAND,element)){
        _self._collapseChildren(node);
        _self.setItemStatus(node,EXPAND,false,element);
        _self.removeItems(node.children);
        _self.fire('collapsed',{node : node ,element : element});
      }
    },
    _collapseChildren : function(parentNode,parentElement){
      var _self = this,
        children = parentNode.children;
      
      BUI.each(children,function(node){
        _self.collapseNode(node);
      });
    },
    //展开选项
    _expandNode : function(node,element,deep){
      var _self = this,
        index = _self.indexOfItem(node);

      if(!_self.hasStatus(node,EXPAND,element)){
        _self.setItemStatus(node,EXPAND,true,element);
        _self.addItemsAt(node.children,index + 1);
        _self.fire('expanded',{node : node ,element : element});
      }
      if(deep){
        BUI.each(node.children,function(subNode){
          _self.expandNode(subNode);
        });
      }
    },
    //重置选项的图标
    _resetIcons :function(node,element){
      var _self = this,
        iconsTpl = _self._getIconsTpl(node);
      $(element).find('.' + CLS_ICON_WRAPER).remove(); //移除掉以前的图标

      $(element).prepend($(iconsTpl));
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
    _updateIcons : function(node){

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
      _self.set('items',v);
    }
  });

  return Mixin;
})