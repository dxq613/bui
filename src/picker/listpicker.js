/**
 * @fileOverview 列表项的选择器
 * @ignore
 */

define('bui/picker/listpicker',['bui/picker/picker','bui/list'],function (require) {

  var List = require('bui/list'),
    Picker = require('bui/picker/picker'),
    /**
     * 列表选择器,xclass = 'list-picker'
     * <pre><code>
     * BUI.use(['bui/picker'],function(Picker){
     *
     * var items = [
     *       {text:'选项1',value:'a'},
     *       {text:'选项2',value:'b'},
     *      {text:'选项3',value:'c'}
     *     ],
     *   picker = new Picker.ListPicker({
     *     trigger : '#show',  
     *     valueField : '#hide', //如果需要列表返回的value，放在隐藏域，那么指定隐藏域
     *     width:100,  //指定宽度
     *     children : [{
     *        elCls:'bui-select-list',
     *        items : items
     *     }] //配置picker内的列表
     *   });
     * picker.render();
     * });
     * </code></pre>
     * @class BUI.Picker.ListPicker
     * @extends BUI.Picker.Picker
     */
    listPicker = Picker.extend({
      initializer : function(){
        var _self = this,
          children = _self.get('children'),
          list = _self.get('list');
        if(!list){
          children.push({

          });
        }
      },
      /**
       * 设置选中的值
       * @override
       * @param {String} val 设置值
       */
      setSelectedValue : function(val){
        val = val ? val.toString() : '';
        if(!this.get('isInit')){
          this._initControl();
        }
        var _self = this,
          list = _self.get('list'),
          selectedValue = _self.getSelectedValue();
        if(val !== selectedValue && list.getCount()){
          if(list.get('multipleSelect')){
            list.clearSelection();
          }
          list.setSelectionByField(val.split(','));
        }   
      },
      /**
       * @protected
       * @ignore
       */
      onChange : function(selText,selValue,ev){
        var _self = this,
          curTrigger = _self.get('curTrigger');
        //curTrigger && curTrigger.trigger('change'); //触发改变事件
        _self.fire('selectedchange',{value : selValue,text : selText,curTrigger : curTrigger,item : ev.item});
      },
      /**
       * 获取选中的值，多选状态下，值以','分割
       * @return {String} 选中的值
       */
      getSelectedValue : function(){
        if(!this.get('isInit')){
          this._initControl();
        }
        return this.get('list').getSelectionValues().join(',');
      },
      /**
       * 获取选中项的文本，多选状态下，文本以','分割
       * @return {String} 选中的文本
       */
      getSelectedText : function(){
        if(!this.get('isInit')){
          this._initControl();
        }
        return this.get('list').getSelectionText().join(',');
      }
    },{
      ATTRS : {
        /**
         * 默认子控件的样式,默认为'simple-list'
         * @type {String}
         * @override
         */
        defaultChildClass:{
          value : 'simple-list'
        },
        /**
         * 选择的列表
         * <pre><code>
         *  var list = picker.get('list');
         *  list.getSelected();
         * </code></pre>
         * @type {BUI.List.SimpleList}
         * @readOnly
         */
        list : {
          getter:function(){
            return this.get('children')[0];
          }
        }
        /**
         * @event selectedchange
         * 选择发生改变事件
         * @param {Object} e 事件对象
         * @param {String} e.text 选中的文本
         * @param {string} e.value 选中的值
         * @param {Object} e.item 发生改变的选项
         * @param {jQuery} e.curTrigger 当前触发picker的元素
         */
      }
    },{
      xclass : 'list-picker'
    });

  return listPicker;
});