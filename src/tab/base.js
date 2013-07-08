/**
 * @fileOverview 切换标签入口
 * @ignore
 */

define('bui/tab',['bui/common','bui/tab/tab','bui/tab/tabitem','bui/tab/navtabitem','bui/tab/navtab','bui/tab/tabpanel','bui/tab/tabpanelitem'],function (require) {
  var BUI = require('bui/common'),
    Tab = BUI.namespace('Tab');

  BUI.mix(Tab,{
    Tab : require('bui/tab/tab'),
    TabItem : require('bui/tab/tabitem'),
    NavTabItem : require('bui/tab/navtabitem'),
    NavTab : require('bui/tab/navtab'),
    TabPanel : require('bui/tab/tabpanel'),
    TabPanelItem : require('bui/tab/tabpanelitem')
  });

  return Tab;
});