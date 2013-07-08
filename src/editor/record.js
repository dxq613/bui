/**
 * @fileOverview 对象编辑器
 * @ignore
 */

define('bui/editor/record',['bui/common','bui/editor/editor'],function (require) {
  var BUI = require('bui/common'),
    Editor = require('bui/editor/editor');

  /**
   * @class BUI.Editor.RecordEditor
   * @extends BUI.Editor.Editor
   * 编辑器
   */
  var editor = Editor.extend({
    /**
     * @protected
     * @override
     * 获取编辑的源数据
     * @return {String} 返回需要编辑的文本
     */
    getSourceValue : function(){
      return this.get('record');
    },
    /**
     * @protected
     * 更新文本
     * @param  {Object} value 编辑器的值
     */
    updateSource : function(value){
      var _self = this,
        record = _self.get('record');
      BUI.mix(record,value);
    },
    _uiSetRecord : function(v){
      this.setValue(v);
    }
  },{
    ATTRS : {

      /**
       * 内部控件的代表Value的字段
       * @protected
       * @override
       * @type {String}
       */
      innerValueField : {
        value : 'record'
      },
      /**
       * 接受更改的事件
       * @type {String}
       */
      acceptEvent : {
        value : ''
      },
      /**
       * 空值的数据，清空编辑器时使用
       * @protected
       * @type {*}
       */
      emptyValue : {
        value : {}
      },
      /**
       * 是否自动隐藏
       * @override
       * @type {Boolean}
       */
      autoHide : {
        value : false
      },
      /**
       * 编辑的记录
       * @type {Object}
       */
      record : {
        value : {}
      },
      /**
       * 内部控件配置项的字段
       * @protected
       * @type {String}
       */
      controlCfgField : {
        value : 'form'
      },
      /**
       * 编辑器内表单的配置项
       * @type {Object}
       */
      form : {
        value : {}
      },
      /**
       * 错误信息的对齐方式
       * @type {Object}
       */
      errorAlign : {
        value : {
          points: ['tr','tl'],
          offset : [10,0]
        }
      },
      /**
       * 默认的字段域配置项
       * @type {Object}
       */
      defaultChildCfg : {
        valueFn : function(){
          var _self = this;
          return {
            xclass : 'form',
            errorTpl : '',
            showError : true,
            showChildError : true,
            defaultChildCfg : {
              elCls : 'bui-inline-block',
              tpl : '',
              forceFit : true
            },
            buttons : [
            {
              btnCls : 'button button-primary',
              text : '确定',
              handler : function(){
                _self.accept();
              }
            },
            {
              btnCls : 'button',
              text : '取消',
              handler : function(){
                _self.cancel();
              }
            }]
          }
        }
      }
    }
  },{
    xclass : 'record-editor'
  });

  return editor;
});