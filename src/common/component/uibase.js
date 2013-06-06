/**
 * @fileOverview uibase的入口文件
 * @ignore
 */

define('bui/component/uibase',function(require){

  var UIBase = require('bui/component/uibase/base');
    
  BUI.mix(UIBase,{
    Align : require('bui/component/uibase/align'),
    AutoShow : require('bui/component/uibase/autoshow'),
    AutoHide : require('bui/component/uibase/autohide'),
    Close : require('bui/component/uibase/close'),
    Collapseable : require('bui/component/uibase/collapseable'),
    Drag : require('bui/component/uibase/drag'),
    KeyNav : require('bui/component/uibase/keynav'),
    List : require('bui/component/uibase/list'),
    ListItem : require('bui/component/uibase/listitem'),
    Mask : require('bui/component/uibase/mask'),
    Position : require('bui/component/uibase/position'),
    Selection : require('bui/component/uibase/selection'),
    StdMod : require('bui/component/uibase/stdmod'),
    Decorate : require('bui/component/uibase/decorate'),
    Tpl : require('bui/component/uibase/tpl'),
    ChildCfg : require('bui/component/uibase/childcfg'),
    Bindable : require('bui/component/uibase/bindable'),
    Depends : require('bui/component/uibase/depends')
  });

  BUI.mix(UIBase,{
    CloseView : UIBase.Close.View,
    CollapseableView : UIBase.Collapseable.View,
    ChildList : UIBase.List.ChildList,
    DomList : UIBase.List.DomList,
    DomListView : UIBase.List.DomList.View,
    ListItemView : UIBase.ListItem.View,
    MaskView : UIBase.Mask.View,
    PositionView : UIBase.Position.View,
    StdModView : UIBase.StdMod.View,
    TplView : UIBase.Tpl.View
  });
  return UIBase;
});