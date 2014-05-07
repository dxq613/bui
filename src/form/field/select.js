/**
 * @fileOverview 模拟选择框在表单中
 * @ignore
 */

define('bui/form/selectfield',['bui/common','bui/form/basefield'],function (require) {

  var BUI = require('bui/common'),
    Field = require('bui/form/basefield');

  function resetOptions (select,options,self) {
    select.children().remove();
    var emptyText = self.get('emptyText');
    if(emptyText && self.get('showBlank')){
      appendItem('',emptyText,select);
    }
    BUI.each(options,function (option) {
      appendItem(option.value,option.text,select);
    });
  }

  function appendItem(value,text,select){
    // var str = '<option value="' + value +'">'+text+'</option>'
    // $(str).appendTo(select);
    
    // 上面那种写法在ie6下会报一个奇怪的错误，使用new Option则不会有这个问题
    var option = new Option(text, value),
      options = select[0].options;
    options[options.length] = option;
  }
  /**
   * 表单选择域
   * @class BUI.Form.Field.Select
   * @extends BUI.Form.Field
   */
  var selectField = Field.extend({
    //生成select
    renderUI : function(){
      var _self = this,
        innerControl = _self.getInnerControl(),
        select = _self.get('select');
      if(_self.get('srcNode') && innerControl.is('select')){ //如果使用现有DOM生成，不使用自定义选择框控件
        return;
      }
      //select = select || {};
      if($.isPlainObject(select)){
        _self._initSelect(select);
      }
    },
    _initSelect : function(select){
      var _self = this,
        items = _self.get('items');
      BUI.use('bui/select',function(Select){
        select.render = _self.getControlContainer();
        select.valueField = _self.getInnerControl();
        select.autoRender = true;
       
        select = new Select.Select(select);
        _self.set('select',select);
        _self.set('isCreate',true);
        _self.get('children').push(select);
        select.on('change',function(ev){
          var val = select.getSelectedValue();
          _self.set('value',val);
        });
      })
    },
    /**
     * 重新设置选项集合
     * @param {Array} items 选项集合
     */
    setItems : function (items) {
      var _self = this,
        select = _self.get('select');

      if($.isPlainObject(items)){
        var tmp = [];
        BUI.each(items,function(v,n){
          tmp.push({value : n,text : v});
        });
        items = tmp;
      }

      var control = _self.getInnerControl();
      if(control.is('select')){
        resetOptions(control,items,_self);
        _self.setControlValue(_self.get('value'));
        if(!_self.getControlValue()){
          _self.setInternal('value','');
        }
      }

      if(select){
        if(select.set){
          select.set('items',items);
        }else{
          select.items = items;
        }
      }
    },
    /**
     * 设置字段的值
     * @protected
     * @param {*} value 字段值
     */
    setControlValue : function(value){
      var _self = this,
        select = _self.get('select'),
        innerControl = _self.getInnerControl();
      innerControl.val(value);
      if(select && select.set &&  select.getSelectedValue() !== value){
        select.setSelectedValue(value);
      }
    },
    /**
     * 获取选中的文本
     * @return {String} 选中的文本
     */
    getSelectedText : function(){
      var _self = this,
        select = _self.get('select'),
        innerControl = _self.getInnerControl();
      if(innerControl.is('select')){
        var dom = innerControl[0],
          item = dom.options[dom.selectedIndex];
        return item ? item.text : '';
      }else{
        return select.getSelectedText();
      }
    },
    /**
     * 获取tip显示对应的元素
     * @protected
     * @override
     * @return {HTMLElement} 
     */
    getTipTigger : function(){
      var _self = this,
        select = _self.get('select');
      if(select && select.rendered){
        return select.get('el').find('input');
      }
      return _self.get('el');
    },
    //设置选项
    _uiSetItems : function(v){
      if(v){
        this.setItems(v);
      }
    },
    /**
     * @protected
     * 设置内部元素宽度
     */
    setInnerWidth : function(width){
      var _self = this,
        innerControl = _self.getInnerControl(),
        select = _self.get('select'),
        appendWidth = innerControl.outerWidth() - innerControl.width();
      innerControl.width(width - appendWidth);
      if(select && select.set){
        select.set('width',width);
      }
    }
  },{
    ATTRS : {
      /**
       * 选项
       * @type {Array}
       */
      items : {

      },
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      /**
       * 是否显示为空的文本
       * @type {Boolean}
       */
      showBlank : {
        value : true
      },
      /**
       * 选择为空时的文本
       * @type {String}
       */
      emptyText : {
        value : '请选择'
      },
      /**
       * 内部的Select控件的配置项
       * @cfg {Object} select
       */
      /**
       * 内部的Select控件
       * @type {BUI.Select.Select}
       */
      select : {
        shared : false,
        value : {}
      }
    },
    PARSER : {
      emptyText : function(el){
        if(!this.get('showBlank')){
          return '';
        }
        var options = el.find('option'),
          rst = this.get('emptyText');
        if(options.length){
          rst = $(options[0]).text();
        }
        return rst;
      }
    }
  },{
    xclass : 'form-field-select'
  });

  return selectField;
});
