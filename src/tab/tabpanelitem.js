/**
 * @fileOverview 
 * @ignore
 */

define('bui/tab/tabpanelitem',['bui/common','bui/tab/tabitem','bui/tab/panelitem'],function (require) {
  

  var BUI = require('bui/common'),
    TabItem = require('bui/tab/tabitem'),
    PanelItem = require('bui/tab/panelitem'),
    CLS_TITLE = 'bui-tab-item-text',
    Component = BUI.Component;

  /**
   * @private
   * @class BUI.Tab.TabPanelItemView
   * @extends BUI.Tab.TabItemView
   * 存在面板的标签项视图层对象
   */
  var itemView = TabItem.View.extend([Component.UIBase.Close.View],{
    _uiSetTitle : function(v){
      var _self = this,
        el = _self.get('el'),
        titleEl = el.find('.' + CLS_TITLE);
      titleEl.text(v);
    }
  },{
    xclass:'tab-panel-item-view'
  });


  /**
   * 标签项
   * @class BUI.Tab.TabPanelItem
   * @extends BUI.Tab.TabItem
   * @mixins BUI.Tab.PanelItem
   * @mixins BUI.Component.UIBase.Close
   */
  var item = TabItem.extend([PanelItem,Component.UIBase.Close],{
    
  },{
    ATTRS : 
    {
      /**
       * 关闭时直接销毁标签项，执行remove方法
       * @type {String}
       */
      closeAction : {
        value : 'remove'
      },
      /**
       * 标题
       * @cfg {String} title 
       */
      /**
       * 标题
       * @type {String}
       * <code>
       *   tab.getItem('id').set('title','new title');
       * </code>
       */
      title : {
        view : true,
        sync : false

      },
      /**
       * 标签项的模板,因为之前没有title属性，所以默认用text，所以也兼容text，但是在最好直接使用title，方便更改
       * @type {String}
       */
      tpl : {
        value : '<span class="' + CLS_TITLE + '">{text}{title}</span>'
      },
      closeable : {
        value : false
      },
      events : {
        value : {
          beforeclosed : true
        }
      },
      xview:{
        value:itemView
      }
    }
  },{
    xclass:'tab-panel-item'
  });
  
  item.View = itemView;
  return item;

});