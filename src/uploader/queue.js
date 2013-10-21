/**
 * @fileoverview 文件上传队列列表显示和处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/queue', ['bui/list'], function (require) {

  var BUI = require('bui/common'),
    SimpleList = require('bui/list/simplelist');

  var CLS_QUEUE = BUI.prefix + 'queue',
    CLS_QUEUE_ITEM = CLS_QUEUE + '-item';
  
  var Queue = SimpleList.extend({
    bindUI: function () {
      var _self = this,
        el = _self.get('el'),
        delCls = _self.get('delCls');

      el.delegate('.' + delCls, 'click', function (ev) {
        var itemContainer = $(ev.target).parent(),
          uploader = _self.get('uploader'),
          item = _self.getItemByElement(itemContainer);
        uploader && uploader.cancel && uploader.cancel(item);
        _self.removeItem(item);
      });
    },
    /**
     * 由于一个文件只能处理一种状态，所以在更新状态前要把所有的文件状态去掉
     * @param  {[type]} item    [description]
     * @param  {[type]} status  [description]
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    updateFileStatus: function(item, status, element){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      element = element || _self.findElement(item);
        
      BUI.each(itemStatusFields, function(v,k){
        _self.setItemStatus(item,k,false,element);
      });

      _self.setItemStatus(item,status,true,element);
      _self.updateItem(item);
    }
  }, {
    ATTRS: {
      itemTpl: {
        value: '<li><span data-url="{url}" class="filename">{name}</span><div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div><div class="action"><span class="' + CLS_QUEUE_ITEM + '-del">删除</span></div></li>'
      },
      itemCls: {
        value: CLS_QUEUE_ITEM
      },
      delCls: {
        value: CLS_QUEUE_ITEM + '-del'
      },
      itemStatusFields: {
        value: {
          wait: 'wait',
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