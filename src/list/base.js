/**
 * @fileOverview 列表模块入口文件
 * @ignore
 */
;(function(){
var BASE = 'bui/list/';
define('bui/list',['bui/common',BASE + 'list',BASE + 'listitem',BASE + 'simplelist',BASE + 'listbox'],function (r) {
  var BUI = r('bui/common'),
    List = BUI.namespace('List');

  BUI.mix(List,{
    List : r(BASE + 'list'),
    ListItem : r(BASE + 'listitem'),
    SimpleList : r(BASE + 'simplelist'),
    Listbox : r(BASE + 'listbox')
  });

  BUI.mix(List,{
    ListItemView : List.ListItem.View,
    SimpleListView : List.SimpleList.View
  });

  return List;
});  
})();
