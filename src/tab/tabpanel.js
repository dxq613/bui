/**
 * @fileOverview 每个标签对应一个面板
 * @ignore
 */

define('bui/tab/tabpanel',['bui/common','bui/tab/tab','bui/tab/panels'],function (require) {
  
  var BUI = require('bui/common'),
    Tab = require('bui/tab/tab'),
    Panels = require('bui/tab/panels');

  /**
   * 带有面板的切换标签
   * <pre><code>
   * BUI.use('bui/tab',function(Tab){
   *   
   *     var tab = new Tab.TabPanel({
   *       render : '#tab',
   *       elCls : 'nav-tabs',
   *       panelContainer : '#panel',
   *       autoRender: true,
   *       children:[
   *         {text:'源代码',value:'1'},
   *         {text:'HTML',value:'2'},
   *         {text:'JS',value:'3'}
   *       ]
   *     });
   *     tab.setSelected(tab.getItemAt(0));
   *   });
   * </code></pre>
   * @class BUI.Tab.TabPanel
   * @extends BUI.Tab.Tab
   * @mixins BUI.Tab.Panels
   */
  var tabPanel = Tab.extend([Panels],{

    bindUI : function(){
      var _self = this;
      //关闭标签
      _self.on('beforeclosed',function(ev){
        var item = ev.target;
        _self._beforeClosedItem(item);
      });
    },
    //关闭标签选项前
    _beforeClosedItem : function(item){
      if(!item.get('selected')){ //如果未选中不执行下面的选中操作
        return;
      }

      var _self = this,
        index = _self.indexOfItem(item),
        count = _self.getItemCount(),
        preItem,
        nextItem;
      if(index !== count - 1){ //不是最后一个，则激活最后一个
        nextItem = _self.getItemAt(index + 1);
        _self.setSelected(nextItem);
      }else if(index !== 0){
        preItem = _self.getItemAt(index - 1);
        _self.setSelected(preItem);
      }
    }

  },{
    ATTRS : {
      elTagName : {
        value : 'div'
      },
      childContainer : {
        value : 'ul'
      },
      tpl : {
        value : '<div class="tab-panel-inner"><ul></ul><div class="tab-panels"></div></div>'
      },
      panelTpl : {
        value : '<div></div>'
      },
      /**
       * 默认的面板容器
       * @cfg {String} [panelContainer='.tab-panels']
       */
      panelContainer : {
        value : '.tab-panels'
      },
      /**
       * 默认子控件的xclass
       * @type {String}
       */
      defaultChildClass:{
        value : 'tab-panel-item'
      }
    }
  },{
    xclass : 'tab-panel'
  });

  return tabPanel;
});