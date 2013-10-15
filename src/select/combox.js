/**
 * @fileOverview 组合框可用于选择输入文本
 * @ignore
 */

define('bui/select/combox',['bui/common','bui/select/select'],function (require) {

  var BUI = require('bui/common'),
    Select = require('bui/select/select'),
    CLS_INPUT = BUI.prefix + 'combox-input';

  function getFunction(textField,valueField,picker){
    var list = picker.get('list'),
      text = picker.getSelectedText();
    if(text){
      $(textField).val(text);
    }
  }

  /**
   * 组合框 用于提示输入
   * xclass:'combox'
   * <pre><code>
   * BUI.use('bui/select',function(Select){
   * 
   *  var select = new Select.Combox({
   *    render:'#c1',
   *    name:'combox',
   *    items:['选项1','选项2','选项3','选项4']
   *  });
   *  select.render();
   * });
   * </code></pre>
   * @class BUI.Select.Combox
   * @extends BUI.Select.Select
   */
  var combox = Select.extend({

    renderUI : function(){
      var _self = this,
        picker = _self.get('picker');
      picker.set('autoFocused',false);
      picker.set('getFunction',getFunction);
    },
    _uiSetItems : function(v){
      var _self = this;

      for(var i = 0 ; i < v.length ; i++){
        var item = v[i];
        if(BUI.isString(item)){
          v[i] = {value:item,text:item};
        }
      }
      combox.superclass._uiSetItems.call(_self,v);
    }

  },{
    ATTRS : 
    /**
     * @lends BUI.Select.Combox#
     * @ignore
     */
    {
      /**
       * 控件的模版
       * @type {String}
       * @default  
       * '&lt;input type="text" class="'+CLS_INPUT+'"/&gt;'
       */
      tpl:{
        view:true,
        value:'<input type="text" class="'+CLS_INPUT+'"/>'
      },
      /**
       * 显示选择回的文本DOM节点的样式
       * @type {String}
       * @protected
       * @default 'bui-combox-input'
       */
      inputCls:{
        value:CLS_INPUT
      }
    }
  },{
    xclass:'combox'
  });

  return combox;
});