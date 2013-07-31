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
    }//,
    /**
     * 设置item的状态
     * @return {[type]} [description]
     */
    // setItemStatus : function(item, status, value, element){
    //   var _self = this;
    //   _self.clearItemStatus(item);
    //   Queue.superclass.setItemStatus.call(_self, item, status, value, element);
    // }
  }, {
    ATTRS: {
      itemCls: {
        value: CLS_QUEUE
      },
      itemTpl: {
        value: '<li><span data-url="{url}">{name}</span><div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div></li>'
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