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
        uploader.get('uploaderType').on('success', function(ev){
          var items = uploader.get('queue').getItems();
          _self.setControlValue(items);
        });
      });
    },
    setControlValue: function(items){
      var _self = this,
        innerControl = _self.getInnerControl(),
        result = [];
      BUI.each(items, function(item){
        result.push(item.result);
      })
      innerControl.val(JSON.stringify(result));
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