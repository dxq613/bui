/**
 * @fileOverview 模拟选择框在表单中
 * @ignore
 */

define('bui/form/uploaderfield',['bui/common','bui/form/basefield','bui/form/rules'],function (require) {

  var BUI = require('bui/common'),
    JSON = BUI.JSON,
    Field = require('bui/form/basefield'),
    Rules = require('bui/form/rules');

  /**
   * 表单上传域
   * @class BUI.Form.Field.Upload
   * @extends BUI.Form.Field
   */
  var uploaderField = Field.extend({
    //生成upload
    renderUI : function(){
      var _self = this,
        innerControl = _self.getInnerControl();
      if(_self.get('srcNode') && innerControl.get(0).type === 'file'){ //如果使用现有DOM生成，不使用上传组件
        return;
      }
      _self._initControlValue();
      _self._initUpload();
    },
    _initUpload: function(){
      var _self = this,
        children = _self.get('children'),
        uploader = _self.get('uploader') || {};

      BUI.use('bui/uploader', function(Uploader){
        uploader.render = _self.getControlContainer();
        uploader.autoRender = true;
        uploader = new Uploader.Uploader(uploader);
        _self.set('uploader', uploader);
        _self.set('isCreate',true);
        _self.get('children').push(uploader);

        
        _self._initQueue(uploader.get('queue'));
        
        uploader.on('success', function(ev){
          var result = _self._getUploaderResult();
          _self.setControlValue(result);
        });
        uploader.get('queue').on('itemremoved', function(){
          var result = _self._getUploaderResult();
          _self.setControlValue(result);
        })
      });
    },
    _getUploaderResult: function(){
      var _self = this,
        uploader = _self.get('uploader'),
        queue = uploader.get('queue'),
        items = queue.getItems(),
        result = [];

      BUI.each(items, function(item){
        item.result && result.push(item.result);
      });
      return result;
    },
    setControlValue: function(items){
      var _self = this,
        innerControl = _self.getInnerControl();
      // _self.fire('change');
      innerControl.val(JSON.stringify(items));
    },
    _initControlValue: function(){
      var _self = this,
        textValue = _self.getControlValue(),
        value;
      if(textValue){
        value = BUI.JSON.parse(textValue);
        _self.set('value', value);
      }
    },
    _initQueue: function(queue){
      var _self = this,
        value = _self.get('value'),
        result = [];
      //初始化对列默认成功
      BUI.each(value, function(item){
        var newItem = BUI.cloneObject(item);
        newItem.success = true;
        newItem.result = item;
        result.push(newItem);
      });
      queue && queue.setItems(result);
    }//,
    // valid: function(){
    //   var _self = this,
    //     uploader = _self.get('uploader');
    //   uploaderField.superclass.valid.call(_self);
    //   uploader.valid();
    // }
  },{
    ATTRS : {
      /**
       * 内部表单元素的容器
       * @type {String}
       */
      controlTpl : {
        value : '<input type="hidden"/>'
      },
      uploader: {
        setter: function(v){
          var disabled = this.get('disabled');
          v && v.isController && v.set('disabled', disabled);
          return v;
        }
      },

      disabled: {
        setter: function(v){
          var _self = this,
            uploader = _self.get('uploader');
          uploader && uploader.isController && uploader.set('disabled', v);
        }
      },
      value:{
        shared : false,
        value: []
      },
      defaultRules: function(){
        uploader: true
      }
    }
  },{
    xclass : 'form-field-uploader'
  });

  
  Rules.add({
    name : 'uploader',  //规则名称
    msg : '上传文件选择有误！',//默认显示的错误信息
    validator : function(value, baseValue, formatMsg, field){ //验证函数，验证值、基准值、格式化后的错误信息
      var uploader = field.get('uploader');
      if(uploader && !uploader.isValid()){
        return formatMsg;
      }
    }
  }); 

  return uploaderField;
});