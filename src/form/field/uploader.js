/**
 * @fileOverview 模拟选择框在表单中
 * @ignore
 */

define('bui/form/uploaderfield',['bui/common','bui/form/basefield'],function (require) {

  var BUI = require('bui/common'),
    JSON = BUI.JSON,
    Field = require('bui/form/basefield');

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
          var items = uploader.get('queue').getItems(),
            resultItems = [];
          BUI.each(items, function(item){
            item.result && resultItems.push(item.result);
          });
          _self.setControlValue(resultItems);
        });
      });
    },
    setControlValue: function(items){
      var _self = this,
        innerControl = _self.getInnerControl();
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
        value = _self.get('value');
      //初始化对列默认成功
      BUI.each(value, function(item){
        item.success = true;
      });
      queue && queue.setItems(value);
    }
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
        value: []
      }
    }
  },{
    xclass : 'form-field-uploader'
  });

  return uploaderField;
});