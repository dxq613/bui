/**
 * @fileOverview 选择器
 * @ignore
 */

define('bui/picker/picker',['bui/overlay', 'bui/picker/mixin'],function (require) {
  
  var Overlay = require('bui/overlay').Overlay,
    Mixin = require('bui/picker/mixin');

  /**
   * 选择器控件的基类，弹出一个层来选择数据，不要使用此类创建控件，仅用于继承实现控件
   * xclass : 'picker'
   * <pre><code>
   * BUI.use(['bui/picker','bui/list'],function(Picker,List){
   *
   * var items = [
   *       {text:'选项1',value:'a'},
   *       {text:'选项2',value:'b'},
   *      {text:'选项3',value:'c'}
   *     ],
   *   list = new List.SimpleList({
   *     elCls:'bui-select-list',
   *     items : items
   *   }),
   *   picker = new Picker.ListPicker({
   *     trigger : '#show',  
   *     valueField : '#hide', //如果需要列表返回的value，放在隐藏域，那么指定隐藏域
   *     width:100,  //指定宽度
   *     children : [list] //配置picker内的列表
   *   });
   * picker.render();
   * });
   * </code></pre>
   * @abstract
   * @class BUI.Picker.Picker
   * @mixins BUI.Picker.Mixin
   * @extends BUI.Overlay.Overlay
   */
  var picker = Overlay.extend([Mixin], {
    
  },{
    ATTRS : {

    }
  },{
    xclass:'picker'
  });

  return picker;
});