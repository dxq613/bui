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
        var itemContainer = $(ev.target).parent();
        _self.removeItem(_self.getItemByElement(itemContainer));
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
      itemCls: {
        value: CLS_QUEUE
      },
      itemTpl: {
        value: '<li><span data-url="{url}">{name}</span><div class="progress"><div class="bar" style="width:{loadedPercent}%"></div></div><div class="' + CLS_QUEUE_ITEM + '-del">删除</div></li>'
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

  
  var themes = {};
  var Theme = function(){
  }

  Theme.prototype = {
    createQueue: function(themeName, config){
      var _self = this,
        theme = _self.getTheme(themeName) || {},
        queue;
      theme = BUI.mix(theme, config);
      queue = new Queue(theme);
      return queue;
    },
    addTheme: function(name, config){
      themes[name] = config;
    },
    getTheme: function(name){
      return themes[name];
    }
  };

  Queue.Theme = new Theme();

  return Queue;

});