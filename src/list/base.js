/**
 * @fileOverview 列表模块入口文件
 * @ignore
 */

define('bui/list',function (require) {
  var BUI = require('bui/common'),
    List = BUI.namespace('List');

  BUI.mix(List,{
    List : require('bui/list/list'),
    ListItem : require('bui/list/listitem'),
    SimpleList : require('bui/list/simplelist'),
    Listbox : require('bui/list/listbox'),
    Picker : require('bui/list/listpicker')
  });

  BUI.mix(List,{
    ListItemView : List.ListItem.View,
    SimpleListView : List.SimpleList.View
  });

  return List;
});