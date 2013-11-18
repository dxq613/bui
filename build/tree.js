/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/tree',['bui/common','bui/tree/treemixin','bui/tree/treelist','bui/tree/treemenu'],function (require) {
  var BUI = require('bui/common'),
    Tree = BUI.namespace('Tree');

  BUI.mix(Tree,{
    TreeList : require('bui/tree/treelist'),
    Mixin : require('bui/tree/treemixin'),
    TreeMenu : require('bui/tree/treemenu')
  });
  return Tree;
});
define('bui/tree/treemixin',['bui/common','bui/data'],function (require) {

  //\u5c06id \u8f6c\u6362\u6210node
  function makeSureNode(self,node){
    if(BUI.isString(node)){
      node = self.findNode(node);
    }
    return node;
  }
  //\u52a8\u753b\u6267\u884c
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
   * \u6811\u63a7\u4ef6\u7684\u6269\u5c55\uff0c\u53ef\u4ee5\u5e94\u7528\u4e8eList,Grid\u7b49\u63a7\u4ef6
   */
  Mixin.ATTRS = {


    /**
     * \u6811\u7684\u6570\u636e\u7f13\u51b2\u7c7b\u5bf9\u8c61,\u7528\u4e8e\u64cd\u4f5c\u6570\u636e\u7684\u52a0\u8f7d\u3001\u589e\u5220\u6539
     * <pre><code>
     * //\u6570\u636e\u7f13\u51b2\u7c7b
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
     * \u6811\u7684\u6570\u636e\u7f13\u51b2\u7c7b\u5bf9\u8c61,\u9ed8\u8ba4\u90fd\u4f1a\u751f\u6210\u5bf9\u5e94\u7684\u7f13\u51b2\u5bf9\u8c61
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
     * \u6811\u7684\u6839\u8282\u70b9
     * <pre><code>
     *   //\u5982\u679c\u6570\u636e\u5b58\u5728\u6839\u8282\u70b9\uff0c\u5219\u914d\u7f6e\u6839\u8282\u70b9\uff0c\u4ee5\u4fbf\u4e8e\u663e\u793a
     *   var tree = new TreeList({
     *     root : {id: '0',text : '0',children:[{},{}]},
     *     showRoot : true
     *   });
     *   //\u5982\u679c\u914d\u7f6estore\uff0c\u5219\u4e0d\u9700\u8981\u914d\u7f6e\u6b64\u5c5e\u6027
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
     * \u5b50\u8282\u70b9\u96c6\u5408
     * <pre><code>
     *   //\u5982\u679c\u4e0d\u663e\u793a\u6839\u8282\u70b9\uff0c\u5e76\u4e14\u6570\u636e\u6e90\u4e2d\u4e0d\u5b58\u5728\u6839\u8282\u70b9\uff0c\u53ef\u4ee5\u4ec5\u914d\u7f6e\u6b64\u5c5e\u6027
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
     * \u653e\u7f6e\u8282\u70b9Icon\u7684\u5bb9\u5668,\u4e3a\u7a7a\u65f6\uff0c\u653e\u7f6e\u5728\u8282\u70b9\u7684\u6700\u524d\u9762
     * @protected
     * @type {String}
     */
    iconContainer : {

    },
    /**
     * \u653e\u7f6eicon\u5916\u5c42\u7684\u6a21\u677f\uff0c\u7a7a\u767dicon\u3001\u53f6\u5b50\u8282\u70b9\u7684icon\u3001\u975e\u53f6\u5b50\u8282\u70b9\u7684Icon
     * @protected
     * @type {String}
     */
    iconWraperTpl : {
      value : '<span class="' + CLS_ICON_WRAPER + '">{icons}</span>'
    },
    /**
     * \u662f\u5426\u663e\u793a\u8fde\u63a5\u7ebf
     * <pre><code>
     *  var tree = new TreeList({
     *    nodes : [],
     *    showLine : true
     *  });
     * </code></pre>
     * @cfg {Boolean} showLine
     */
    /**
     * \u662f\u5426\u663e\u793a\u8fde\u63a5\u7ebf
     * @type {Boolean} showLine
     */
    showLine : {
      value : false
    },
    /**
     * \u662f\u5426\u663e\u793a\u56fe\u6807\uff0c\u5305\u62ec\u8282\u70b9\u5c55\u5f00\u6298\u53e0\u7684\u56fe\u6807\uff0c\u6807\u793a\u5c42\u7ea7\u5173\u7cfb\u7684\u7a7a\u767d\u56fe\u6807
     * @type {Boolean}
     */
    showIcons : {
      value : true
    },
    /**
     * \u56fe\u6807\u6240\u4f7f\u7528\u7684\u6a21\u677f
     * @protected
     * @type {Object}
     */
    iconTpl : {
      value : '<span class="x-tree-icon {cls}"></span>'
    },
    /**
     * \u53f6\u5b50\u8282\u70b9\u5e94\u7528\u7684\u6837\u5f0f
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
     * \u975e\u53f6\u5b50\u8282\u70b9\u5e94\u7528\u7684\u6837\u5f0f
     * @cfg {String} [dirCls = 'x-tree-elbow-dir']
     */
    dirCls : {
      value : CLS_ICON_PREFIX + 'dir'
    },
    /**
     * \u52fe\u9009\u7c7b\u578b\uff0c\u76ee\u524d\u63d0\u4f9b\u4e00\u4e0b\u51e0\u79cd\u52fe\u9009\u65b9\u5f0f:
     * <ol>
     *  <li>all : \u5168\u90e8\u8282\u70b9\u53ef\u4ee5\u52fe\u9009</li>
     *  <li>onlyLeaf : \u53ea\u6709\u5b50\u8282\u70b9\u53ef\u4ee5\u52fe\u9009</li>
     *  <li>custom : \u81ea\u5b9a\u4e49\u52fe\u9009\uff0c\u53ea\u6709\u8282\u70b9\u6570\u636e\u4e0a\u6709checked\u5b57\u6bb5\u624d\u5141\u8bb8\u52fe\u9009</li>
     *  <li>none : \u5168\u90e8\u8282\u70b9\u4e0d\u53ef\u52fe\u9009</li>
     * </ol>
     * @cfg {Object} [checkType = 'custom']
     */
    checkType : {
      value : 'custom'
    },
    /**
     * \u662f\u5426\u53ea\u5141\u8bb8\u4e00\u4e2a\u8282\u70b9\u5c55\u5f00
     * @type {Boolean}
     */
    accordion : {
      value : false
    },
    /**
     * \u662f\u5426\u53ef\u4ee5\u52fe\u9009\u591a\u4e2a\u8282\u70b9
     * @type {Boolean}
     */
    multipleCheck : {
      value : true
    },
    /**
     * @private
     * \u52fe\u9009\u5b57\u6bb5
     * @type {String}
     */
    checkedField : {
      valueFn : function(){
        return this.getStatusField('checked');
      }
    },
    /**
     * \u662f\u5426\u53ef\u4ee5\u52fe\u9009\u7684\u5b57\u6bb5\u540d\u79f0
     * @type {String}
     */
    checkableField : {
      value : 'checkable'
    },
    /**
     * \u9009\u9879\u5bf9\u8c61\u4e2d\u5c5e\u6027\u4f1a\u76f4\u63a5\u5f71\u54cd\u76f8\u5e94\u7684\u72b6\u6001,\u9ed8\u8ba4\uff1a
     * <pre><code>
     * //\u9ed8\u8ba4\u503c
     * {
     *   expanded : 'expanded',
     *   disabled : 'disabled',
     *   checked : 'checked'
     * }
     * //\u5bf9\u8c61
     * var node = {id : '1',text : '1',checked : true,expanded : true};
     * 
     * //\u5982\u679c\u4f60\u7684\u6570\u636e\u6e90\u4e2d\u7684\u5b57\u6bb5\u540d\u8ddf\u8fd9\u4e9b\u72b6\u6001\u540d\u4e0d\u4e00\u81f4\uff0c\u4f60\u53ef\u4ee5\u81ea\u5df1\u4fee\u6539
     * var tree = new TreeList({
     *   nodes : [],
     *   itemStatusFields : {
     *     disabled : 'hasDisabled', 
     *     custom : 'custom'  //\u6dfb\u52a0\u81ea\u5b9a\u4e49\u5c5e\u6027\uff0c\u6b64\u65f6\u8282\u70b9\u751f\u6210\u540e\u4f1a\u81ea\u52a8\u6dfb\u52a0\u5bf9\u5e94\u7684\u6837\u5f0f bui + xclass + 'custom'
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
     * \u6587\u4ef6\u5939\u662f\u5426\u53ef\u9009\uff0c\u7528\u4e8e\u9009\u62e9\u8282\u70b9\u65f6\uff0c\u907f\u514d\u9009\u4e2d\u975e\u53f6\u5b50\u8282\u70b9
     * @cfg {Boolean} [dirSelectable = true]
     */
    dirSelectable : {
      value : true
    },
    /**
     * \u662f\u5426\u663e\u793a\u6839\u8282\u70b9
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
         * \u5c55\u5f00\u8282\u70b9
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.Node \u8282\u70b9
         * @param {HTMLElement} e.element \u8282\u70b9\u7684DOM
         */
        expanded : false,
        /**
         * @event
         * \u6298\u53e0\u8282\u70b9
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.Node \u8282\u70b9
         * @param {HTMLElement} e.element \u8282\u70b9\u7684DOM
         */
        collapsed : false,
        /**
         * @event
         * \u52fe\u9009\u6539\u53d8\u4e8b\u4ef6
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.Node \u8282\u70b9
         * @param {Boolean} e.checked \u9009\u4e2d\u72b6\u6001
         * @param {HTMLElement} e.element \u8282\u70b9\u7684DOM
         */
        checkedchange : false
      }
    },
    /**
     * \u8282\u70b9\u5c55\u5f00\u7684\u4e8b\u4ef6
     * @type {String}
     */
    expandEvent : {
      value : 'itemdblclick'
    },
    /**
     * \u5c55\u5f00\u6536\u7f29\u65f6\u662f\u5426\u4f7f\u7528\u52a8\u753b
     * @type {Boolean}
     */
    expandAnimate : {
      value : false 
    },
    /**
     * \u8282\u70b9\u6536\u7f29\u7684\u4e8b\u4ef6
     * @type {String}
     */
    collapseEvent : {
      value : 'itemdblclick'
    },
    /**
     * \u5f00\u59cb\u7684\u5c42\u7ea7\uff0c\u5982\u679c\u663e\u793a\u6839\u8282\u70b9\uff0c\u4ece0\u5f00\u59cb\uff0c\u4e0d\u663e\u793a\u6839\u8282\u70b9\u4ece1\u5f00\u59cb
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
     * \u6298\u53e0\u6240\u6709
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
     * \u6298\u53e0\u8282\u70b9
     * <pre><code>
     *  //\u83b7\u53d6\u8282\u70b9\u540e\uff0c\u6298\u53e0
     *  var node = tree.findNode('id');
     *  tree.collapseNode(node);
     *  //\u76f4\u63a5\u901a\u8fc7id \u6298\u53e0
     *  tree.collapseNode('id');
     * </code></pre>
     * @param {String|Object|BUI.Data.Node} node \u8282\u70b9
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
     * \u5c55\u5f00\u6240\u6709
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
     * \u5c55\u5f00\u8282\u70b9
     * <pre><code>
     *  //\u83b7\u53d6\u8282\u70b9\u540e\u5c55\u5f00
     *  var node = tree.findNode('id');
     *  tree.expandNode(node);
     *  //\u4f7f\u7528store\u65f6\uff0c\u83b7\u53d6\u8282\u70b9\uff0c\u7136\u540e\u5c55\u5f00
     *  var node = store.findNode('id');
     *  tree.expandNode(node);
     *  //\u76f4\u63a5\u4f7f\u7528id \u5c55\u5f00
     *  tree.expandNode('id');
     * </code></pre>
     * ** Notes **
     * \u7531\u4e8e\u6811\u63a7\u4ef6\u5176\u5b9e\u662f\u4e00\u4e2a\u5217\u8868\uff0c\u6240\u4ee5\u672a\u5c55\u5f00\u8282\u70b9\u7684\u5b50\u8282\u70b9\u5176\u5b9e\u4e0d\u5728\u5217\u8868\u4e2d\uff0c\u6240\u4ee5\u8fd9\u4e9b\u8282\u70b9\u901a\u8fc7tree.getItem('id'),\u6b64\u65f6\u67e5\u627e\u4e0d\u5230\u5bf9\u5e94\u7684\u8282\u70b9
     * @param  {String|Object|BUI.Data.Node} node \u8282\u70b9\u6216\u8005 \u8282\u70b9id
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
     * \u6cbf\u7740path(id\u7684\u8fde\u63a5\u4e32) \u5c55\u5f00
     * <pre>
     *  <code>
     *    var path = "0,1,12,121"; //\u6cbf\u7740\u6839\u8282\u70b90\uff0c\u6811\u8282\u70b9 1,12\u76f4\u5230121\u7684\u8def\u5f84\u5c55\u5f00
     *    tree.expandPath(path); //\u5982\u679c\u4e2d\u95f4\u6709\u8282\u70b9\u4e0d\u5b58\u5728\uff0c\u7ec8\u6b62\u5c55\u5f00
     *  </code>
     * </pre>
     * @param  {String} path \u8282\u70b9\u7684path\uff0c\u4ece\u6839\u8282\u70b9\uff0c\u5230\u5f53\u524d\u8282\u70b9\u7684id\u7ec4\u5408
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
        if(preNode && node){ //\u7236\u5143\u7d20\uff0c\u5b50\u5143\u7d20\u540c\u65f6\u5b58\u5728
          _self.expandNode(preNode);
          preNode = node;
        }else if(preNode && async){
          store.load({id : preNode.id},function(){ //\u52a0\u8f7d\u5b8c\u6210\u540e
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
     * \u67e5\u627e\u8282\u70b9
     * <pre><code>
     *  var node = tree.findNode('1');//\u4ece\u6839\u8282\u70b9\u5f00\u59cb\u67e5\u627e\u8282\u70b9
     *  
     *  var subNode = tree.findNode('123',node); //\u4ece\u6307\u5b9a\u8282\u70b9\u5f00\u59cb\u67e5\u627e
     * </code></pre>
     * @param  {String} id \u8282\u70b9Id
     * @param  {BUI.Data.Node} [parent] \u7236\u8282\u70b9
     * @return {BUI.Data.Node} \u8282\u70b9
     */
    findNode : function(id,parent){
      return this.get('store').findNode(id,parent);
    },  
    /**
     * \u83b7\u53d6\u6240\u6709\u52fe\u9009\u7684\u5b50\u8282\u70b9
     * <pre><code>
     *  //\u83b7\u53d6\u6240\u6709\u9009\u4e2d\u7684\u53f6\u5b50\u8282\u70b9
     *  var nodes = tree.getCheckedLeaf();
     *  
     *  //\u83b7\u53d6\u6307\u5b9a\u8282\u70b9\u9009\u4e2d\u7684\u53f6\u5b50\u8282\u70b9
     *  var node = tree.findNode('1'),
     *    nodes = tree.getCheckedLeaf(node);
     *  
     * </code></pre>
     * @param {BUI.Data.Node} [parent] \u7236\u8282\u70b9
     * @return {Array} \u8282\u70b9\u5217\u8868
     */
    getCheckedLeaf : function(parent){
      var _self = this,
        store = _self.get('store');

      return store.findNodesBy(function(node){
        return node.leaf && _self.isChecked(node);
      },parent);
    },
    /**
     * \u83b7\u53d6\u52fe\u9009\u4e2d\u7684\u8282\u70b9\u5217\u8868
     * <pre><code>
     *  //\u83b7\u53d6\u6240\u6709\u9009\u4e2d\u8282\u70b9
     *  var nodes = tree.getCheckedNodes();
     *  
     *  //\u83b7\u53d6\u6307\u5b9a\u8282\u70b9\u9009\u4e2d\u7684\u8282\u70b9
     *  var node = tree.findNode('1'),
     *    nodes = tree.getCheckedNodes(node);
     *  
     * </code></pre>
     * @param {BUI.Data.Node} [parent] \u7236\u8282\u70b9
     * @return {Array} \u8282\u70b9\u5217\u8868
     */
    getCheckedNodes : function(parent){
      var _self = this,
        store = _self.get('store');

      return store.findNodesBy(function(node){
        return _self.isChecked(node);
      },parent);
    },
    //\u8282\u70b9\u662f\u5426\u53ef\u4ee5\u88ab\u9009\u4e2d
    isItemSelectable : function(item){
      var _self = this,
        dirSelectable = _self.get('dirSelectable'),
        node = item;
      if(node && !dirSelectable && !node.leaf){ //\u5982\u679c\u963b\u6b62\u975e\u53f6\u5b50\u8282\u70b9\u9009\u4e2d
        return false;
      }
      return true;
    },
    /**
     * \u8282\u70b9\u662f\u5426\u5c55\u5f00,\u5982\u679c\u8282\u70b9\u662f\u53f6\u5b50\u8282\u70b9\uff0c\u5219\u59cb\u7ec8\u662ffalse
     * <pre><code>
     *  tree.isExpanded(node);
     * </code></pre>
     * @return {Boolean} \u662f\u5426\u5c55\u5f00
     */
    isExpanded : function(node){
      if(!node || node.leaf){
        return false;
      }
      var _self = this,
        element;
      if(_self._isRoot(node) && !_self.get('showRoot')){ //\u6839\u8282\u70b9\uff0c\u5207\u4e0d\u663e\u793a\u6839\u8282\u70b9\u65f6\uff0c\u8ba4\u4e3a\u6839\u8282\u70b9\u65f6\u5c55\u5f00\u7684
        return true;
      }
      if(BUI.isString(node)){
        item = _self.getItem(node);
      }
      element = _self.findElement(node);
      return this._isExpanded(node,element);
    },
    /**
     * \u8282\u70b9\u662f\u5426\u52fe\u9009
     * <pre><code>
     *  tree.isChecked(node);
     * </code></pre>
     * @return {Boolean} \u8282\u70b9\u662f\u5426\u52fe\u9009
     */
    isChecked : function(node){
      if(!node){
        return false;
      }
      return  !!node[this.get('checkedField')];//this.getStatusValue(node,'checked');
    },
    /**
     * \u5207\u6362\u663e\u793a\u9690\u85cf
     * <pre><code>
     *  var node = tree.getItem('id');
     *  tree.collapseNode(node); //\u8282\u70b9\u6536\u7f29
     *  tree.toggleExpand(node); //\u8282\u70b9\u5c55\u5f00
     *  tree.toggleExpand(node); //\u8282\u70b9\u6536\u7f29
     * </code></pre>
     * @param  {String|Object|BUI.Data.Node} node \u8282\u70b9
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
     * \u8bbe\u7f6e\u8282\u70b9\u52fe\u9009\u72b6\u6001
     * <pre><code>
     *  var node = tree.findNode('1');
     *  tree.setNodeChecked(node,true); //\u52fe\u9009
     *  tree.setNodeChecked(node,false); //\u53d6\u6d88\u52fe\u9009
     * </code></pre>
     * @param {String|Object|BUI.Data.Node} node \u8282\u70b9\u6216\u8005\u8282\u70b9id
     * @param {Boolean} checked \u662f\u5426\u52fe\u9009
     */
    setNodeChecked : function(node,checked,deep){
      deep = deep == null ? true : deep;

      if(!node){
        return;
      }
      var _self = this,
        parent,
        multipleCheck = _self.get('multipleCheck'),
        element;
      node = makeSureNode(this,node);
      if(!node){
        return;
      }
      parent = node.parent;
      if(!_self.isCheckable(node)){
        return;
      }

      if(_self.isChecked(node) !== checked || _self.hasStatus(node,'checked') !== checked){

        
        element =  _self.findElement(node);
        if(element){
          _self.setItemStatus(node,CHECKED,checked,element); //\u8bbe\u7f6e\u9009\u4e2d\u72b6\u6001
          if(multipleCheck){ //\u591a\u9009\u72b6\u6001\u4e0b\u8bbe\u7f6e\u534a\u9009\u72b6\u6001
            _self._resetPatialChecked(node,checked,checked,element); //\u8bbe\u7f6e\u90e8\u5206\u52fe\u9009\u72b6\u6001
          }else{
            if(checked && parent && _self.isChecked(parent) != checked){
              _self.setNodeChecked(parent,checked,false);
            }
          }/**/
        }else if(!_self.isItemDisabled(node)){
          _self.setStatusValue(node,'checked',checked);
        }

        if(parent){ //\u8bbe\u7f6e\u7236\u5143\u7d20\u9009\u4e2d
          if(_self.isChecked(parent) != checked){
            _self._resetParentChecked(parent);
          }else if(multipleCheck){
            _self._resetPatialChecked(parent,null,null,null,true);
          }
        }

        //\u5982\u679c\u662f\u5355\u9009\u5219\uff0c\u6e05\u9664\u5144\u5f1f\u5143\u7d20\u7684\u9009\u4e2d
        if(checked && !multipleCheck && (_self.isChecked(parent) || parent == _self.get('root'))){
          var nodes = parent.children;
          BUI.each(nodes,function(slibNode){
            if(slibNode !== node && _self.isChecked(slibNode)){
              _self.setNodeChecked(slibNode,false);
            } 
          });
        }
        _self.fire('checkedchange',{node : node,element: element,checked : checked});
        
      }
      if(!node.leaf && deep){ //\u6811\u8282\u70b9\uff0c\u52fe\u9009\u6240\u6709\u5b50\u8282\u70b9
        BUI.each(node.children,function(subNode,index){
          if(multipleCheck || !checked || (!multipleCheck && index == 0)){ //\u591a\u9009\u6216\u8005\u5355\u9009\u65f6\u7b2c\u4e00\u4e2a
            _self.setNodeChecked(subNode,checked,deep);
          }
        });
      }
    },

    /**
     * \u8bbe\u7f6e\u8282\u70b9\u52fe\u9009\u72b6\u6001
     * @param {String|Object|BUI.Data.Node} node \u8282\u70b9\u6216\u8005\u8282\u70b9id
     */
    setChecked : function(node){
      this.setNodeChecked(node,true);
    },
    /**
     * \u6e05\u9664\u6240\u6709\u7684\u52fe\u9009
     */
    clearAllChecked : function(){
      var _self = this,
        nodes = _self.getCheckedNodes();
      BUI.each(nodes,function(node){
        _self.setNodeChecked(node,false);
      });
    },
    //\u521d\u59cb\u5316\u6839\u8282\u70b9
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
    //\u521d\u59cb\u5316\u8282\u70b9\u7684\u52fe\u9009
    _initChecked : function(node,deep){
      var _self = this,
        checkType = _self.get('checkType'),
        checkedField = _self.get('checkedField'),
        multipleCheck = _self.get('multipleCheck'),
        checkableField = _self.get('checkableField'),
        parent; 
      if(checkType === MAP_TYPES.NONE){ //\u4e0d\u5141\u8bb8\u9009\u4e2d
        node[checkableField] = false;
        node[checkedField] = false;
        return;
      }

      if(checkType === MAP_TYPES.ONLY_LEAF){ //\u4ec5\u53f6\u5b50\u8282\u70b9\u53ef\u9009
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

      if(checkType === MAP_TYPES.CUSTOM){ //\u81ea\u5b9a\u4e49\u9009\u4e2d\u65f6\uff0c\u6839\u636e\u8282\u70b9\u4e0a\u662f\u5426\u6709checked\u5224\u65ad
        if(node[checkableField] == null){
          node[checkableField] = node[checkedField] != null;
        }
        
      }

      if(checkType === MAP_TYPES.ALL){ //\u6240\u6709\u5141\u8bb8\u9009\u4e2d
        node[checkableField] = true;
      }

      if(!node || !_self.isCheckable(node)){ //\u5982\u679c\u4e0d\u53ef\u9009\uff0c\u5219\u4e0d\u5904\u7406\u52fe\u9009
        return;
      }

      parent = node.parent;
      if(!_self.isChecked(node)){ //\u8282\u70b9\u672a\u88ab\u9009\u62e9\uff0c\u6839\u636e\u7236\u3001\u5b50\u8282\u70b9\u5904\u7406\u52fe\u9009

        if(parent && _self.isChecked(parent)){ //\u5982\u679c\u7236\u8282\u70b9\u9009\u4e2d\uff0c\u5f53\u524d\u8282\u70b9\u5fc5\u987b\u52fe\u9009
          if(multipleCheck || !_self._hasChildChecked(parent)){ //\u591a\u9009\u6216\u8005\u5144\u5f1f\u8282\u70b9\u6ca1\u6709\u88ab\u9009\u4e2d
            _self.setStatusValue(node,'checked',true);
          }
        }
        //\u8282\u70b9\u4e3a\u975e\u53f6\u5b50\u8282\u70b9\uff0c\u540c\u65f6\u53f6\u5b50\u8282\u70b9\u4e0d\u4e3a\u7a7a\u65f6\u6839\u636e\u53f6\u5b50\u8282\u70b9\u63a7\u5236
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
    //\u8bbe\u7f6e\u90e8\u5206\u9009\u4e2d\u6548\u679c
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
    //\u5b50\u8282\u70b9\u53d8\u5316\uff0c\u91cd\u7f6e\u7236\u8282\u70b9\u52fe\u9009
    _resetParentChecked : function(parentNode){
      if(!this.isCheckable(parentNode)){
        return;
      }
      var _self = this,
        multipleCheck = _self.get('multipleCheck'),
        allChecked = multipleCheck ? _self._isAllChildrenChecked(parentNode) : _self._hasChildChecked(parentNode);
      _self.setStatusValue(parentNode,'checked',allChecked);
      _self.setNodeChecked(parentNode,allChecked,false);

      multipleCheck && _self._resetPatialChecked(parentNode,allChecked,null,null);
    },
    //\u7ed1\u5b9a\u4e8b\u4ef6
    __bindUI : function(){
      var _self = this,
        el = _self.get('el'),
        multipleCheck = _self.get('multipleCheck');

      //\u70b9\u51fb\u9009\u9879
      _self.on('itemclick',function(ev){
        var sender = $(ev.domTarget),
          element = ev.element,
          node = ev.item;
        if(sender.hasClass(CLS_EXPANDER)){
          _self._toggleExpand(node,element); //\u70b9\u51fb\u5c55\u5f00\u6536\u7f29\u8282\u70b9\uff0c\u4e0d\u89e6\u53d1\u9009\u4e2d\u4e8b\u4ef6
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
        if(_self.isCheckable(node) && multipleCheck){
          _self._resetPatialChecked(node,null,null,element);
        }
        if(_self._isExpanded(node,element)){
          _self._showChildren(node);
        }
        
      });
      _self._initExpandEvent();
    },
    //\u521d\u59cb\u5316\u5c55\u5f00\u6536\u7f29\u4e8b\u4ef6
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
    //\u662f\u5426\u6839\u636e\u5b50\u8282\u70b9\u9009\u4e2d
    _isForceChecked : function(node){
      var _self = this,
        multipleCheck = _self.get('multipleCheck');
      return multipleCheck ? _self._isAllChildrenChecked() : _isForceChecked();
    },
    //\u662f\u5426\u6240\u6709\u5b50\u8282\u70b9\u88ab\u9009\u4e2d
    _isAllChildrenChecked : function(node){
      if(!node || node.leaf){
        return false;
      }
      var _self = this,
        children = node.children,
        rst = true;
      BUI.each(children,function(subNode){
        rst = rst && _self.isChecked(subNode);
        if(!rst){ //\u5b58\u5728\u672a\u9009\u4e2d\u7684\uff0c\u8fd4\u56de
          return false;
        }
      });
      return rst;
    },
    //\u662f\u5426\u6709\u5b50\u8282\u70b9\u9009\u4e2d
    _hasChildChecked : function(node){
      if(!node || node.leaf){
        return false;
      }
      var _self = this;

      return _self.getCheckedNodes(node).length != 0;
    },
    //\u662f\u5426\u662f\u6839\u8282\u70b9
    _isRoot : function(node){
      var _self = this,
        store = _self.get('store');
      if(store && store.get('root') == node){
        return true;
      }
      return false;
    },
    //\u8bbe\u7f6e\u52a0\u8f7d\u72b6\u6001
    _setLoadStatus : function(node,element,loading){
      var _self = this;
      _self.setItemStatus(node,LOADING,loading,element);
    },  
    //\u52a0\u8f7d\u8282\u70b9\u524d
    _beforeLoadNode : function(node){
      var _self = this,
        element;
      if(BUI.isString(node)){
        node = _self.findNode(node);
      }
      element = _self.findElement(node);

      if(element){ //\u6298\u53e0\u8282\u70b9\uff0c\u8bbe\u7f6e\u52a0\u8f7d\u72b6\u6001
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
     * \u52a0\u8f7d\u8282\u70b9\u524d\u89e6\u53d1
     */
    onBeforeLoad : function(e){
      var _self = this,
        params = e.params,
        id = params.id,
        node = _self.findNode(id) || _self.get('root');
      _self._beforeLoadNode(node);
    },
    //\u6dfb\u52a0\u8282\u70b9
    _addNode : function(node,index){
      var _self = this,
        parent = node.parent,
        scount,//\u5144\u5f1f\u8282\u70b9\u7684\u6570\u91cf
        prevNode, //\u524d\u4e00\u4e2a\u8282\u70b9
        nextNode, //\u540e\u4e00\u4e2a\u8282\u70b9\uff0c\u7528\u4e8e\u8ba1\u7b97\u672c\u8282\u70b9\u653e\u7f6e\u7684\u4f4d\u7f6e,\u4e0d\u4e00\u5b9a\u662f\u540c\u7ea7\u8282\u70b9
        cIndex;//\u8282\u70b9\u63d2\u5165\u7684\u4f4d\u7f6e
      _self._initChecked(node,true);
      if(parent){
        if(_self.isExpanded(parent)){ //\u5c55\u5f00\u7684\u8282\u70b9
          scount = parent.children.length;

          cIndex = _self._getInsetIndex(node);//\u4e0b\u4e00\u4e2a\u8282\u70b9\u7684\u4f4d\u7f6e
          _self.addItemAt(node,cIndex);
          if(index == scount -1 && index > 0){ //\u4f5c\u4e3a\u6700\u540e\u4e00\u4e2a\u8282\u70b9\uff0c\u66f4\u65b0\u524d\u4e00\u4e2a\u5144\u5f1f\u8282\u70b9\u7684\u56fe\u6807
            prevNode = parent.children[index - 1];
            _self._updateIcons(prevNode);
          }
        }
        _self._updateIcons(parent); //\u66f4\u65b0\u7236\u8282\u70b9\u7684icon
      }else{ //\u6ca1\u6709\u7236\u8282\u70b9\uff0c\u5219\u6dfb\u52a0\u5230\u8ddf\u8282\u70b9\u4e0b
        cIndex = _self._getInsetIndex(node);
        _self.addItemAt(node,cIndex);
        prevNode = _self.get('nodes')[index - 1];
        _self._updateIcons(prevNode);
      }
    },
    //\u83b7\u53d6\u8282\u70b9\u7684\u63d2\u5165\u4f4d\u7f6e
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
    //\u83b7\u53d6\u663e\u793a\u5728\u5217\u8868\u4e0a\u7684\u4e0b\u4e00\u9879\uff0c\u4e0d\u4ec5\u4ec5\u662f\u540c\u7ea7\u8282\u70b9
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
     * \u91cd\u5199\u6dfb\u52a0\u8282\u70b9\u65b9\u6cd5
     */
    onAdd : function(e){
      var _self = this,
        node = e.node,
        index = e.index;
      _self._addNode(node,index);
    },
    //\u66f4\u65b0\u8282\u70b9
    _updateNode : function(node){
      var _self = this;
      _self.updateItem(node);
      _self._updateIcons(node);
    },
    /**
     * @override 
     * @protected
     * \u91cd\u5199\u66f4\u65b0\u8282\u70b9\u65b9\u6cd5
     */
    onUpdate : function(e){
      var _self = this,
        node = e.node;
      _self._updateNode(node);
    },
    //\u5220\u9664\u8282\u70b9
    _removeNode : function(node,index){
      var _self = this,
        parent = node.parent,
        scount,
        prevNode;
      _self.collapseNode(node); //\u6536\u7f29\u8282\u70b9\uff0c\u4ee5\u4fbf\u4e8e\u540c\u65f6\u5220\u9664\u5b50\u8282\u70b9
      if(!parent){
        return;
      }
      _self.removeItem(node);
      if(_self.isExpanded(parent)){ //\u5982\u679c\u7236\u8282\u70b9\u5c55\u5f00
        
        scount = parent.children.length;
        if(scount == index && index !== 0){ //\u5982\u679c\u5220\u9664\u7684\u662f\u6700\u540e\u4e00\u4e2a\uff0c\u66f4\u65b0\u524d\u4e00\u4e2a\u8282\u70b9\u56fe\u6807
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
     * \u91cd\u5199\u5220\u9664\u8282\u70b9\u65b9\u6cd5
     */
    onRemove : function(e){
      var _self = this,
        node = e.node,
        index = e.index;
      _self._removeNode(node,index);
    },
    //\u52a0\u8f7d\u5b8c\u8282\u70b9
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
      if(showRoot && !store.hasData()){ //\u6811\u8282\u70b9\u6ca1\u6709\u6570\u636e\uff0c\u4f46\u662f\u9700\u8981\u663e\u793a\u6839\u8282\u70b9\u65f6
        _self._initRoot();
      }
    },

     /**
     * @override 
     * @protected
     * \u52a0\u8f7d\u8282\u70b9
     */
    onLoad : function(e){
      var _self = this,
        store = _self.get('store'),
        root = store.get('root'),
        node;

      if(!e || e.node == root){ //\u521d\u59cb\u5316\u52a0\u8f7d\u65f6,\u6216\u8005\u52a0\u8f7d\u6839\u8282\u70b9
        _self._initRoot();
      }
      if(e && e.node){
        _self._loadNode(e.node);
      } 
    },
    _isExpanded : function(node,element){
      return this.hasStatus(node,EXPAND,element);
    },
    //\u83b7\u53d6Icon\u7684\u6a21\u677f
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
    //\u83b7\u53d6\u52fe\u9009icon
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
     * \u662f\u5426\u53ef\u4ee5\u52fe\u9009
     * @protected
     * @param  {Object | BUI.Data.Node} node \u8282\u70b9
     * @return {Boolean}  \u662f\u5426\u53ef\u4ee5\u52fe\u9009
     */
    isCheckable : function(node){
      return node[this.get('checkableField')];
    },
    //\u83b7\u53d6\u5c55\u5f00\u6298\u53e0\u7684icon
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
    //\u53f6\u5b50\u8282\u70b9\u548c\u6811\u8282\u70b9\u6709\u4e0d\u540c\u7684icon
    _getNodeTypeIcon : function(node){
      var _self = this,
        cls = node.cls ? node.cls :(node.leaf ? _self.get('leafCls') : _self.get('dirCls'));
      return _self._getIcon(cls);
    },
    //\u83b7\u53d6\u5bf9\u5e94Level\u7684icon
    _getLevelIcon : function(node,level){
      var _self = this,
        showLine = _self.get('showLine'),
        cls = CLS_EMPTY,
        levelNode;
      if(showLine){ //\u5982\u679c\u663e\u793a\u8fde\u63a5\u7ebf
        if(node.level === level || level == null){ //\u5f53\u524d\u7684\u8fde\u63a5\u7ebf
          cls = _self._isLastNode(node) ? CLS_END : CLS_ELBOW;
        }else{ //\u4e0a\u4e00\u7ea7\u7684\u8fde\u63a5\u7ebf
          levelNode = _self._getParentNode(node,level);
          cls = _self._isLastNode(levelNode) ? CLS_EMPTY : CLS_LINE;
        }
      }
      return _self._getIcon(cls);
    },
    //\u83b7\u53d6\u5bf9\u5e94level\u7684\u7236\u8282\u70b9
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
    //\u83b7\u53d6icon
    _getIcon : function(cls){
       var _self = this,
        iconTpl = _self.get('iconTpl');
      return BUI.substitute(iconTpl,{cls : cls});
    },
    //\u662f\u5426\u662f\u7236\u8282\u70b9\u7684\u6700\u540e\u4e00\u4e2a\u8282\u70b9
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
    //\u521d\u59cb\u5316\u6240\u6709\u8282\u70b9\uff0c\u8bbe\u7f6elevel \u548c leaf
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
    //\u6298\u53e0\u8282\u70b9
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
    //\u9690\u85cf\u5b50\u8282\u70b9
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
    //\u5c55\u5f00\u9009\u9879
    _expandNode : function(node,element,deep){
      var _self = this,
        accordion = _self.get('accordion'),
        store = _self.get('store');
      if(node.leaf){ //\u5b50\u8282\u70b9\u4e0d\u5c55\u5f00
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
        if(store && !store.isLoaded(node)){ //\u8282\u70b9\u672a\u52a0\u8f7d\uff0c\u5219\u52a0\u8f7d\u8282\u70b9
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
    //\u663e\u793a\u5b50\u8282\u70b9
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
    //\u91cd\u7f6e\u9009\u9879\u7684\u56fe\u6807
    _resetIcons :function(node,element){
      if(!this.get('showIcons')){ //\u5982\u679c\u4e0d\u663e\u793a\u56fe\u6807\uff0c\u5219\u4e0d\u91cd\u7f6e
        return;
      }
      var _self = this,
        iconContainer = _self.get('iconContainer'),
        containerEl,
        iconsTpl = _self._getIconsTpl(node);
      $(element).find('.' + CLS_ICON_WRAPER).remove(); //\u79fb\u9664\u6389\u4ee5\u524d\u7684\u56fe\u6807
      containerEl = $(element).find(iconContainer).first();
      if(iconContainer && containerEl.length){
        $(iconsTpl).prependTo(containerEl);
      }else{
        $(element).prepend($(iconsTpl));
      }
    },
    //\u5207\u6362\u663e\u793a\u9690\u85cf
    _toggleExpand : function(node,element){
      var _self = this;
      if(_self._isExpanded(node,element)){
        _self._collapseNode(node,element);
      }else{
        _self._expandNode(node,element);
      }
    }, 
    //\u66f4\u65b0\u8282\u70b9\u56fe\u6807 
    _updateIcons : function(node){
      var _self = this,
        element = _self.findElement(node);
      if(element){
        _self._resetIcons(node,element);
        if(_self._isExpanded(node,element) && !node.leaf){ //\u5982\u679c\u8282\u70b9\u5c55\u5f00\uff0c\u90a3\u4e48\u66f4\u65b0\u5b50\u8282\u70b9\u7684\u56fe\u6807\u6837\u5f0f
          BUI.each(node.children,function(subNode){
            _self._updateIcons(subNode);
          });
        }
      }
    },
    //\u8bbe\u7f6e\u663e\u793a\u6839\u8282\u70b9
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
})
define('bui/tree/treelist',['bui/common','bui/list','bui/tree/treemixin'],function (require) {
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Mixin = require('bui/tree/treemixin');

  /**
   * @class BUI.Tree.TreeList
   * \u6811\u5f62\u5217\u8868\u63a7\u4ef6
   * ** \u4f60\u53ef\u4ee5\u7b80\u5355\u7684\u4f7f\u7528\u914d\u7f6e\u6570\u636e **
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
   * ** \u4f60\u4e5f\u53ef\u4ee5\u663e\u793a\u6839\u8282\u70b9 ** 
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
   * ** \u4f60\u4e5f\u53ef\u4ee5\u5f02\u6b65\u52a0\u8f7d\u6570\u636e ** 
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
   *        showRoot : true //\u53ef\u4ee5\u4e0d\u914d\u7f6e\uff0c\u5219\u4e0d\u663e\u793a\u6839\u8282\u70b9
   *      });
   *    tree.render();
   *    store.load({id : '0'});//\u52a0\u8f7d\u6839\u8282\u70b9\uff0c\u4e5f\u53ef\u4ee5\u8ba9\u7528\u6237\u70b9\u51fb\u52a0\u8f7d
   *  });
   * </code></pre>
   *
   * ** \u4f60\u8fd8\u53ef\u4ee5\u66ff\u6362icon ** 
   * <pre><code>
   *  BUI.use('bui/tree',function(Tree){
   *    var tree = new Tree.TreeList({
   *      render : '#t1',
   *      dirCls : 'folder', //\u66ff\u6362\u6811\u8282\u70b9\u7684\u6837\u5f0f
   *      leafCls : 'file', //\u53f6\u5b50\u8282\u70b9\u7684\u6837\u5f0f
   *      nodes : [ //\u6570\u636e\u4e2d\u5b58\u5728cls \u4f1a\u66ff\u6362\u8282\u70b9\u7684\u56fe\u6807\u6837\u5f0f
   *        {id : '1',text : '1'cls:'task-folder',children : [{id : '11',text : '11',cls:'task'}]},
   *        {id : '2',text : '2'}
   *      ]
   *    });
   *    tree.render();
   *  });
   * @mixin BUI.Tree.Mixin
   * @extends BUI.List.SimpleList
   */
  var TreeList = List.SimpleList.extend([Mixin],{
    
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

