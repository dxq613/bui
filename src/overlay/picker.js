/**
 * @fileOverview 选择器
 * @ignore
 */

define('bui/overlay/picker',['bui/overlay/overlay'],function (require) {
  
  var Overlay = require('bui/overlay/overlay');
  /**
   * 选择器控件，弹出一个层来选择数据
   * @class BUI.Overlay.Picker
   * @extends BUI.Overlay.Overlay
   */
  var picker = Overlay.extend({
    
      bindUI : function(){
        var _self = this,
          innerControl = _self.get('innerControl'),
          hideEvent = _self.get('hideEvent'),
          trigger = $(_self.get('trigger'));

        trigger.on(_self.get('triggerEvent'),function(e){
          if(_self.get('autoSetValue')){
            var valueField = _self.get('valueField') || _self.get('textField') || this,
              val = $(valueField).val();
            _self.setSelectedValue(val);
          }
        });

        innerControl.on(_self.get('changeEvent'),function(e){
          var curTrigger = _self.get('curTrigger'),
            textField = _self.get('textField') || curTrigger,
            valueField = _self.get('valueField'),
            selValue = _self.getSelectedValue(),
            isChange = false;

          if(textField){
            var selText = _self.getSelectedText(),
              preText = $(textField).val();
            if(selText != preText){
              $(textField).val(selText);
              isChange = true;
            }
          }
          
          if(valueField){
            var preValue = $(valueField).val();  
            if(valueField != preValue){
              $(valueField).val(selValue);
              isChange = true;
            }
          }
          if(isChange){
            _self.fire('selectedchange',{value : selValue,curTrigger : curTrigger});
          }
          
        });
        if(hideEvent){
          innerControl.on(_self.get('hideEvent'),function(){
            _self.hide();
          });
        }
      },
      /**
       * 设置选中的值
       * @param {String} val 设置值
       */
      setSelectedValue : function(val){
        
      },
      /**
       * 获取选中的值，多选状态下，值以','分割
       * @return {String} 选中的值
       */
      getSelectedValue : function(){
        
      },
      /**
       * 获取选中项的文本，多选状态下，文本以','分割
       * @return {String} 选中的文本
       */
      getSelectedText : function(){

      },
      _uiSetValueField : function(v){
        var _self = this;
        if(v){
          _self.setSelectedValue($(v).val());
        }
      },
      _getTextField : function(){
        var _self = this;
        return _self.get('textField') || _self.get('curTrigger');
      }
  },{
    ATTRS : {
      
      /**
       * 用于选择的控件，默认为第一个子元素,此控件实现 @see {BUI.Component.UIBase.Selection} 接口
       * @protected
       * @type {Object|BUI.Component.Controller}
       */
      innerControl : {
        getter:function(){
          return this.get('children')[0];
        }
      },
      /**
       * 显示选择器的事件
       * @cfg {String} [triggerEvent='click']
       */
      /**
       * 显示选择器的事件
       * @type {String}
       * @default 'click'
       */
      triggerEvent:{
        value:'click'
      },
      /**
       * 选择器选中的项，是否随着触发器改变
       * @cfg {Boolean} [autoSetValue=true]
       */
      /**
       * 选择器选中的项，是否随着触发器改变
       * @type {Boolean}
       */
      autoSetValue : {
        value : true
      },
      /**
       * 选择发生改变的事件
       * @cfg {String} [changeEvent='selectedchange']
       */
      /**
       * 选择发生改变的事件
       * @type {String}
       */
      changeEvent : {
        value:'selectedchange'
      },
      /**
       * 自动隐藏
       * @type {Boolean}
       * @override
       */
      autoHide:{
        value : true
      },
      /**
       * 隐藏选择器的事件
       * @protected
       * @type {String}
       */
      hideEvent:{
        value:'itemclick'
      },
      /**
       * 返回的文本放在的DOM，一般是input
       * @cfg {String|HTMLElement|jQuery} textField
       */
      /**
       * 返回的文本放在的DOM，一般是input
       * @type {String|HTMLElement|jQuery}
       */
      textField : {

      },
      align : {
        value : {
           points: ['bl','tl'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
           offset: [0, 0]      // 有效值为 [n, m]
        }
      },
      /**
       * 返回的值放置DOM ,一般是input
       * @cfg {String|HTMLElement|jQuery} valueField
       */
      /**
       * 返回的值放置DOM ,一般是input
       * @type {String|HTMLElement|jQuery}
       */
      valueField:{

      }
    }
  },{
    xclass:'picker'
  });

  return picker;
});