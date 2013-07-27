/**
 * @fileOverview 切换标签
 * @ignore
 */

define('bui/tab/tab',['bui/common'],function (require) {
  

  var BUI = require('bui/common'),
    Component = BUI.Component,
    UIBase = Component.UIBase;

  /**
   * 列表
   * xclass:'tab'
   * <pre><code>
   * BUI.use('bui/tab',function(Tab){
   *   
   *     var tab = new Tab.Tab({
   *         render : '#tab',
   *         elCls : 'nav-tabs',
   *         autoRender: true,
   *         children:[
   *           {text:'标签一',value:'1'},
   *           {text:'标签二',value:'2'},
   *           {text:'标签三',value:'3'}
   *         ]
   *       });
   *     tab.on('selectedchange',function (ev) {
   *       var item = ev.item;
   *       $('#log').text(item.get('text') + ' ' + item.get('value'));
   *     });
   *     tab.setSelected(tab.getItemAt(0)); //设置选中第一个
   *   
   *   });
   *  </code></pre>
   * @class BUI.Tab.Tab
   * @extends BUI.Component.Controller
   * @mixins BUI.Component.UIBase.ChildList
   */
  var tab = Component.Controller.extend([UIBase.ChildList],{

  },{
    ATTRS : {
      elTagName:{
        view:true,
        value:'ul'
      },
      /**
       * 子类的默认类名，即类的 xclass
       * @type {String}
       * @override
       * @default 'tab-item'
       */
      defaultChildClass : {
        value : 'tab-item'
      }
    }
  },{
    xclass : 'tab'
  });

  return tab;

});