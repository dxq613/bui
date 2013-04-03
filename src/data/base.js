/**
 * @fileOverview Data 命名空间的入口文件
 * @ignore
 */

define('bui/data',function(require) {
  
  var BUI = require('bui/common'),
    Data = BUI.namespace('Data');
  BUI.mix(Data,{
    Sortable : require('bui/data/sortable'),
    Proxy : require('bui/data/proxy'),
    AbstractStore : require('bui/data/abstractstore'),
    Store : require('bui/data/store'),
    Node : require('bui/data/node'),
    TreeStore : require('bui/data/treestore'),
    Bindable : require('bui/data/bindable')
  });

  return Data;
});