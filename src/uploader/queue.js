/**
 * @ignore
 * @fileoverview 文件上传队列列表显示和处理
 * @author 索丘 <zengyue.yezy@alibaba-inc.com>
 **/
define('bui/uploader/queue', ['bui/list'], function (require) {

  var BUI = require('bui/common'),
    SimpleList = require('bui/list/simplelist');

  var CLS_QUEUE = BUI.prefix + 'queue',
    CLS_QUEUE_ITEM = CLS_QUEUE + '-item';
  
  /**
   * 上传文件的显示队列
   * @class BUI.Uploader.Queue
   * @extends BUI.List.SimpleList
   */
  var Queue = SimpleList.extend({
    bindUI: function () {
      var _self = this,
        el = _self.get('el'),
        delCls = _self.get('delCls');

      el.delegate('.' + delCls, 'click', function (ev) {
        var itemContainer = $(ev.target).parents('.bui-queue-item'),
          uploader = _self.get('uploader'),
          item = _self.getItemByElement(itemContainer);
        uploader && uploader.cancel && uploader.cancel(item);
        _self.removeItem(item);
      });
    },
    /**
     * 更新文件上传的状态
     * @param  {Object} item
     * @param  {String} status  上传的状态
     * @param  {HtmlElement} element 这一项对应的dom元素
     */
    updateFileStatus: function(item, status, element){
      var _self = this,
        itemStatusFields = _self.get('itemStatusFields');
      element = element || _self.findElement(item);
        
      BUI.each(itemStatusFields, function(v,k){
        _self.setItemStatus(item,k,false,element);
      });

      _self.setItemStatus(item,status,true,element);
      _self._setItemTpl(item, status);
      _self.updateItem(item);
    },
    /**
     * 根据上传的状态设置上传列表的模板
     * @private
     * @param {String} 状态名称
     */
    _setItemTpl: function(item, status){
      var _self = this,
        resultTpl = _self.get('resultTpl'),
        itemTpl = resultTpl[status] || resultTpl['default'];
      _self.set('itemTpl', BUI.substitute(itemTpl, item.result));
    }
  }, {
    ATTRS: {
      itemTpl: {
      },
      /**
       * 上传结果的模板，可根据上传状态的不同进行设置，没有时取默认的
       * @type {Object}
       */
      resultTpl:{
        value: {
          'default': '<li><span data-url="{url}" class="filename">{name}</span><div class="action"><span class="' + CLS_QUEUE_ITEM + '-del">删除</span></div></li>',
          success: '<li>{url}</li>',
          error: '<li>{name} {msg}</li>',
          progress: '<li>progress</li>'
        }
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