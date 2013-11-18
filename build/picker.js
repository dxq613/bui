/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/picker',['bui/common','bui/picker/picker','bui/picker/listpicker'],function (require) {
  var BUI = require('bui/common'),
    Picker = BUI.namespace('Picker');

  BUI.mix(Picker,{
    Picker : require('bui/picker/picker'),
    ListPicker : require('bui/picker/listpicker')
  });

  return Picker;
});
define('bui/picker/picker',['bui/overlay'],function (require) {
  
  var Overlay = require('bui/overlay').Overlay;

  /**
   * \u9009\u62e9\u5668\u63a7\u4ef6\u7684\u57fa\u7c7b\uff0c\u5f39\u51fa\u4e00\u4e2a\u5c42\u6765\u9009\u62e9\u6570\u636e\uff0c\u4e0d\u8981\u4f7f\u7528\u6b64\u7c7b\u521b\u5efa\u63a7\u4ef6\uff0c\u4ec5\u7528\u4e8e\u7ee7\u627f\u5b9e\u73b0\u63a7\u4ef6
   * xclass : 'picker'
   * <pre><code>
   * BUI.use(['bui/picker','bui/list'],function(Picker,List){
   *
   * var items = [
   *       {text:'\u9009\u98791',value:'a'},
   *       {text:'\u9009\u98792',value:'b'},
   *      {text:'\u9009\u98793',value:'c'}
   *     ],
   *   list = new List.SimpleList({
   *     elCls:'bui-select-list',
   *     items : items
   *   }),
   *   picker = new Picker.ListPicker({
   *     trigger : '#show',  
   *     valueField : '#hide', //\u5982\u679c\u9700\u8981\u5217\u8868\u8fd4\u56de\u7684value\uff0c\u653e\u5728\u9690\u85cf\u57df\uff0c\u90a3\u4e48\u6307\u5b9a\u9690\u85cf\u57df
   *     width:100,  //\u6307\u5b9a\u5bbd\u5ea6
   *     children : [list] //\u914d\u7f6epicker\u5185\u7684\u5217\u8868
   *   });
   * picker.render();
   * });
   * </code></pre>
   * @abstract
   * @class BUI.Picker.Picker
   * @extends BUI.Overlay.Overlay
   */
  var picker = Overlay.extend({
    
      bindUI : function(){
        var _self = this,
          //innerControl = _self.get('innerControl'),
          hideEvent = _self.get('hideEvent'),
          trigger = $(_self.get('trigger'));

        trigger.on(_self.get('triggerEvent'),function(e){
          if(!_self.get('isInit')){
            _self._initControl();
          }
          if(_self.get('autoSetValue')){
            var valueField = _self.get('valueField') || _self.get('textField') || this,
              val = $(valueField).val();
            _self.setSelectedValue(val);
          }
        });


        //_self.initControlEvent();
      },
      _initControl : function(){
        var _self = this;
        if(_self.get('isInit')){ //\u5df2\u7ecf\u521d\u59cb\u5316\u8fc7
          return ;
        }
        if(!_self.get('innerControl')){
          var control = _self.createControl();
          _self.get('children').push(control);
        }
        _self.initControlEvent();
        _self.set('isInit',true);
      },
      /**
       * @protected
       * \u521d\u59cb\u5316\u5185\u90e8\u63a7\u4ef6
       */
      createControl : function(){
        
      },
      //\u521d\u59cb\u5316\u5185\u90e8\u63a7\u4ef6\u7684\u4e8b\u4ef6
      initControlEvent : function(){
        var _self = this,
          innerControl = _self.get('innerControl'),
          trigger = $(_self.get('trigger')),
          hideEvent = _self.get('hideEvent');

        innerControl.on(_self.get('changeEvent'),function(e){
          var curTrigger = _self.get('curTrigger'),
            textField = _self.get('textField') || curTrigger || trigger,
            valueField = _self.get('valueField'),
            selValue = _self.getSelectedValue(),
            isChange = false;

          if(textField){
            var selText = _self.getSelectedText(),
              preText = $(textField).val();
            if(selText != preText){
              $(textField).val(selText);
              isChange = true;
              $(textField).trigger('change');
            }
          }
          
          if(valueField){
            var preValue = $(valueField).val();  
            if(valueField != preValue){
              $(valueField).val(selValue);
              isChange = true;
              $(valueField).trigger('change');
            }
          }
          if(isChange){
            _self.onChange(selText,selValue,e);
          }
        });
        
        if(hideEvent){
          innerControl.on(_self.get('hideEvent'),function(){
            var curTrigger = _self.get('curTrigger');
            try{ //\u9690\u85cf\u65f6\uff0c\u5728ie6,7\u4e0b\u4f1a\u62a5\u9519
              if(curTrigger){
                curTrigger.focus();
              }
            }catch(e){
              BUI.log(e);
            }
            _self.hide();
          });
        }
      },
      /**
       * \u8bbe\u7f6e\u9009\u4e2d\u7684\u503c
       * @template
       * @protected
       * @param {String} val \u8bbe\u7f6e\u503c
       */
      setSelectedValue : function(val){
        
      },
      /**
       * \u83b7\u53d6\u9009\u4e2d\u7684\u503c\uff0c\u591a\u9009\u72b6\u6001\u4e0b\uff0c\u503c\u4ee5','\u5206\u5272
       * @template
       * @protected
       * @return {String} \u9009\u4e2d\u7684\u503c
       */
      getSelectedValue : function(){
        
      },
      /**
       * \u83b7\u53d6\u9009\u4e2d\u9879\u7684\u6587\u672c\uff0c\u591a\u9009\u72b6\u6001\u4e0b\uff0c\u6587\u672c\u4ee5','\u5206\u5272
       * @template
       * @protected
       * @return {String} \u9009\u4e2d\u7684\u6587\u672c
       */
      getSelectedText : function(){

      },
      /**
       * \u9009\u62e9\u5668\u83b7\u53d6\u7126\u70b9\u65f6\uff0c\u9ed8\u8ba4\u9009\u4e2d\u5185\u90e8\u63a7\u4ef6
       */
      focus : function(){
        this.get('innerControl').focus();
      },
      /**
       * @protected
       * \u53d1\u751f\u6539\u53d8
       */
      onChange : function(selText,selValue,ev){
        var _self = this,
          curTrigger = _self.get('curTrigger');
        //curTrigger && curTrigger.trigger('change'); //\u89e6\u53d1\u6539\u53d8\u4e8b\u4ef6
        _self.fire('selectedchange',{value : selValue,text : selText,curTrigger : curTrigger});
      },
      /**
       * \u5904\u7406 esc \u952e
       * @protected
       * @param  {jQuery.Event} ev \u4e8b\u4ef6\u5bf9\u8c61
       */
      handleNavEsc : function (ev) {
        this.hide();
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
       * \u7528\u4e8e\u9009\u62e9\u7684\u63a7\u4ef6\uff0c\u9ed8\u8ba4\u4e3a\u7b2c\u4e00\u4e2a\u5b50\u5143\u7d20,\u6b64\u63a7\u4ef6\u5b9e\u73b0 @see {BUI.Component.UIBase.Selection} \u63a5\u53e3
       * @protected
       * @type {Object|BUI.Component.Controller}
       */
      innerControl : {
        getter:function(){
          return this.get('children')[0];
        }
      },
      /**
       * \u663e\u793a\u9009\u62e9\u5668\u7684\u4e8b\u4ef6
       * @cfg {String} [triggerEvent='click']
       */
      /**
       * \u663e\u793a\u9009\u62e9\u5668\u7684\u4e8b\u4ef6
       * @type {String}
       * @default 'click'
       */
      triggerEvent:{
        value:'click'
      },
      /**
       * \u9009\u62e9\u5668\u9009\u4e2d\u7684\u9879\uff0c\u662f\u5426\u968f\u7740\u89e6\u53d1\u5668\u6539\u53d8
       * @cfg {Boolean} [autoSetValue=true]
       */
      /**
       * \u9009\u62e9\u5668\u9009\u4e2d\u7684\u9879\uff0c\u662f\u5426\u968f\u7740\u89e6\u53d1\u5668\u6539\u53d8
       * @type {Boolean}
       */
      autoSetValue : {
        value : true
      },
      /**
       * \u9009\u62e9\u53d1\u751f\u6539\u53d8\u7684\u4e8b\u4ef6
       * @cfg {String} [changeEvent='selectedchange']
       */
      /**
       * \u9009\u62e9\u53d1\u751f\u6539\u53d8\u7684\u4e8b\u4ef6
       * @type {String}
       */
      changeEvent : {
        value:'selectedchange'
      },
      /**
       * \u81ea\u52a8\u9690\u85cf
       * @type {Boolean}
       * @override
       */
      autoHide:{
        value : true
      },
      /**
       * \u9690\u85cf\u9009\u62e9\u5668\u7684\u4e8b\u4ef6
       * @protected
       * @type {String}
       */
      hideEvent:{
        value:'itemclick'
      },
      /**
       * \u8fd4\u56de\u7684\u6587\u672c\u653e\u5728\u7684DOM\uff0c\u4e00\u822c\u662finput
       * @cfg {String|HTMLElement|jQuery} textField
       */
      /**
       * \u8fd4\u56de\u7684\u6587\u672c\u653e\u5728\u7684DOM\uff0c\u4e00\u822c\u662finput
       * @type {String|HTMLElement|jQuery}
       */
      textField : {

      },
      align : {
        value : {
           points: ['bl','tl'], // ['tr', 'tl'] \u8868\u793a overlay \u7684 tl \u4e0e\u53c2\u8003\u8282\u70b9\u7684 tr \u5bf9\u9f50
           offset: [0, 0]      // \u6709\u6548\u503c\u4e3a [n, m]
        }
      },
      /**
       * \u8fd4\u56de\u7684\u503c\u653e\u7f6eDOM ,\u4e00\u822c\u662finput
       * @cfg {String|HTMLElement|jQuery} valueField
       */
      /**
       * \u8fd4\u56de\u7684\u503c\u653e\u7f6eDOM ,\u4e00\u822c\u662finput
       * @type {String|HTMLElement|jQuery}
       */
      valueField:{

      }
      /**
       * @event selectedchange
       * \u9009\u4e2d\u503c\u6539\u53d8\u4e8b\u4ef6
       * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
       * @param {String} text \u9009\u4e2d\u7684\u6587\u672c
       * @param {string} value \u9009\u4e2d\u7684\u503c
       * @param {jQuery} curTrigger \u5f53\u524d\u89e6\u53d1picker\u7684\u5143\u7d20
       */
    }
  },{
    xclass:'picker'
  });

  return picker;
});
define('bui/picker/listpicker',['bui/picker/picker','bui/list'],function (require) {

  var List = require('bui/list'),
    Picker = require('bui/picker/picker'),
    /**
     * \u5217\u8868\u9009\u62e9\u5668,xclass = 'list-picker'
     * <pre><code>
     * BUI.use(['bui/picker'],function(Picker){
     *
     * var items = [
     *       {text:'\u9009\u98791',value:'a'},
     *       {text:'\u9009\u98792',value:'b'},
     *      {text:'\u9009\u98793',value:'c'}
     *     ],
     *   picker = new Picker.ListPicker({
     *     trigger : '#show',  
     *     valueField : '#hide', //\u5982\u679c\u9700\u8981\u5217\u8868\u8fd4\u56de\u7684value\uff0c\u653e\u5728\u9690\u85cf\u57df\uff0c\u90a3\u4e48\u6307\u5b9a\u9690\u85cf\u57df
     *     width:100,  //\u6307\u5b9a\u5bbd\u5ea6
     *     children : [{
     *        elCls:'bui-select-list',
     *        items : items
     *     }] //\u914d\u7f6epicker\u5185\u7684\u5217\u8868
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
       * \u8bbe\u7f6e\u9009\u4e2d\u7684\u503c
       * @override
       * @param {String} val \u8bbe\u7f6e\u503c
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
        //curTrigger && curTrigger.trigger('change'); //\u89e6\u53d1\u6539\u53d8\u4e8b\u4ef6
        _self.fire('selectedchange',{value : selValue,text : selText,curTrigger : curTrigger,item : ev.item});
      },
      /**
       * \u83b7\u53d6\u9009\u4e2d\u7684\u503c\uff0c\u591a\u9009\u72b6\u6001\u4e0b\uff0c\u503c\u4ee5','\u5206\u5272
       * @return {String} \u9009\u4e2d\u7684\u503c
       */
      getSelectedValue : function(){
        if(!this.get('isInit')){
          this._initControl();
        }
        return this.get('list').getSelectionValues().join(',');
      },
      /**
       * \u83b7\u53d6\u9009\u4e2d\u9879\u7684\u6587\u672c\uff0c\u591a\u9009\u72b6\u6001\u4e0b\uff0c\u6587\u672c\u4ee5','\u5206\u5272
       * @return {String} \u9009\u4e2d\u7684\u6587\u672c
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
         * \u9ed8\u8ba4\u5b50\u63a7\u4ef6\u7684\u6837\u5f0f,\u9ed8\u8ba4\u4e3a'simple-list'
         * @type {String}
         * @override
         */
        defaultChildClass:{
          value : 'simple-list'
        },
        /**
         * \u9009\u62e9\u7684\u5217\u8868
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
         * \u9009\u62e9\u53d1\u751f\u6539\u53d8\u4e8b\u4ef6
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {String} e.text \u9009\u4e2d\u7684\u6587\u672c
         * @param {string} e.value \u9009\u4e2d\u7684\u503c
         * @param {Object} e.item \u53d1\u751f\u6539\u53d8\u7684\u9009\u9879
         * @param {jQuery} e.curTrigger \u5f53\u524d\u89e6\u53d1picker\u7684\u5143\u7d20
         */
      }
    },{
      xclass : 'list-picker'
    });

  return listPicker;
});