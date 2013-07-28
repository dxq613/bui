/**
 * @fileoverview 文件上传队列列表显示和处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/queue', ['bui/list'], function (require) {

  var SimpleList = require('bui/list/simplelist');

  var CLS_QUEUE = BUI.prefix + 'queue',
    CLS_QUEUE_ITEM = CLS_QUEUE + '-item';
  
  var Queue = SimpleList.extend({
    /**
     * 移除所有的状态
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    clearItemStatus: function(item){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      BUI.each(itemStatusFields, function(v, k){
        _self.setItemStatus(item, k, false);
      });
    }
  }, {
    ATTRS: {
      itemCls: {
        value: CLS_QUEUE
      },
      itemTpl: {
        value: '<li data-url="{url}">{name}</li>'
      },
      itemCls: {
        value: CLS_QUEUE_ITEM
      },
      itemStatusFields: {
        value: {
          waiting: 'waiting',
          start: 'start',
          progress: 'progress',
          success: 'success',
          cancel: 'cancel',
          error: 'error'
        }
      }
    }
  }, { 
    xclass: 'queue'
  });

  return Queue;

});