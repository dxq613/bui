/**
 * @fileOverview Data 命名空间的入口文件
 * @ignore
 */
(function(){
var BASE = 'bui/data/';
define('bui/data',['bui/common',BASE + 'sortable',BASE + 'proxy',BASE + 'abstractstore',BASE + 'store',
  BASE + 'node',BASE + 'treestore'],function(r) {
  
  var BUI = r('bui/common'),
    Data = BUI.namespace('Data');
  BUI.mix(Data,{
    Sortable : r(BASE + 'sortable'),
    Proxy : r(BASE + 'proxy'),
    AbstractStore : r(BASE + 'abstractstore'),
    Store : r(BASE + 'store'),
    Node : r(BASE + 'node'),
    TreeStore : r(BASE + 'treestore')
  });

  return Data;
});
})();
