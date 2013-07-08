/**
 * @fileOverview 组合框可用于选择输入文本
 * @ignore
 */

define('bui/select/suggest',['bui/common','bui/select/combox'],function (require) {

  var BUI = require('bui/common'),
    Combox = require('bui/select/combox'),
    /*CODE_ENTER = BUI.KeyCode.ENTER,
    CODE_TAB = 9,
    CODE_EXPCEPT = [CODE_ENTER,CODE_TAB],
    */
    TIMER_DELAY = 200,
    EMPTY = '',
    EMPTY_ARRAY = [];
    
    //浏览器版本
    ie = BUI.UA['ie'];


  /**
   * 组合框 用于提示输入
   * xclass:'suggest'
   * @class BUI.Select.Suggest
   * @extends BUI.Select.Combox
   */
  var suggest = Combox.extend({
    renderUI:function(){
      var _self = this;
        picker = _self.get('picker');
      if (_self.get('itemTpl')) {
        var picker = _self.get('picker'),
          list = picker.get('list');
        list.set('itemTpl', _self.get('itemTpl'));
      }
    },
    bindUI : function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        picker = _self.get('picker'),
        list = picker.get('list'),
        triggerEvent = (_self.get('triggerEvent') === 'keyup') ? 'keyup' : 'keyup click';

      //监听 keyup 事件
      textEl.on(triggerEvent, function(ev){
        _self._start();
      });
    },
    //启动计时器，开始监听用户输入
    _start:function(){
      var _self = this;
      _self._timer = _self.later(function(){
        _self._updateContent();
       // _self._timer = _self.later(arguments.callee, TIMER_DELAY);
      }, TIMER_DELAY);
    },
    //更新提示层的数据
    _updateContent:function(){
      var _self = this,
        isStatic = _self.get('data'),
        textEl = _self.get('el').find('input'),
        text,
        picker = _self.get('picker');

      //检测是否需要更新。注意：加入空格也算有变化
      if (!isStatic && (textEl.val() === _self.get('query'))) {
        return;
      }

      _self.set('query', textEl.val());
      text = textEl.val();
      //输入为空时,直接返回
      if (!isStatic && !text) {
        /*        _self.set('items',EMPTY_ARRAY);
        picker.hide();*/
        return;
      }

      //3种加载方式选择
      var cacheable = _self.get('cacheable'),
        url = _self.get('url'),
        data = _self.get('data');

      if (cacheable && url) {
        var dataCache = _self.get('dataCache');
        if (dataCache[text] !== undefined) {
          //从缓存读取
          //BUI.log('use cache');
          _self._handleResponse(dataCache[text]);
        }else{
          //请求服务器数据
          //BUI.log('no cache, data from server');
          _self._requestData();
        }
      }else if (url) {
        //从服务器获取数据
        //BUI.log('no cache, data always from server');
        _self._requestData();
      }else if (data) {
        //使用静态数据源
        //BUI.log('use static datasource');
        _self._handleResponse(data);
      }
    },
    
    //通过 script 元素异步加载数据
    _requestData:function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        param = {};
        param[textEl.attr('name')] = textEl.val();
      $.ajax({
        url:_self.get('url'),
        type:'post',
        dataType:'jsonp',
        data:param,
        success:function(data){
          _self._handleResponse(data);
        },
        error:function(){
          //BUI.log('server error');
        }
      });
    },
    //处理获取的数据
    _handleResponse:function(data){
      var _self = this,
        items = _self._getFilterItems(data),
        picker = _self.get('picker');
        _self.set('items',items);

      if(_self.get('cacheable')){
        _self.get('dataCache')[_self.get('query')] = items;
      }
    },
    //获取过滤的文本
    _getFilterItems:function(data){
      var _self = this,
        result = [],
        textEl = _self.get('el').find('input'),
        text = textEl.val(),
        isStatic = _self.get('data');
      data = data ? data : [];
      $.each(data, function(index, item){
        var str = BUI.isString(item) ? item : item['text'];
        if(isStatic){
          if(str.indexOf($.trim(text)) !== -1){
            result.push(str);
          }
        }else{
          result.push(str);
        }
      });
      return result;
    },
    /**
     * 延迟执行指定函数 fn
     * @protected
     * @return {Object} 操作定时器的对象
     */
    later:function (fn, when, periodic) {
      when = when || 0;
      var r = (periodic) ? setInterval(fn, when) : setTimeout(fn, when);

      return {
        id:r,
        interval:periodic,
        cancel:function () {
          if (this.interval) {
            clearInterval(r);
          } else {
            clearTimeout(r);
          }
        }
      };
    }
  },{
    ATTRS : 
    /**
     * @lends BUI.Select.Suggest#
     * @ignore
     */
    {
      /**
       * 用于显示提示的数据源
       * @cfg {Array} data
       */
      /**
       * 用于显示提示的数据源
       * @type {Array}
       */
      data:{
        value : null
      },
      /**
       * 输入框的值
       * @type {String}
       */
      query:{
        value : EMPTY
      },
      /**
       * 是否允许缓存
       * @cfg {Boolean} cacheable
       * @default false
       */
      /**
       * 是否允许缓存
       * @type {Boolean}
       * @default false
       */
      cacheable:{
        value:false
      },
      /**
       * 缓存的数据
       * @private
       */
      dataCache:{
        value:{}
      },
      /**
       * 列表项的模板
       * @cfg {String} itemTpl
       */
      itemTpl:{
        value:EMPTY
      },
      /**
       * 触发的事件
       * @cfg {String} triggerEvent
       * @default 'click'
       */
      triggerEvent:{
        valueFn:function(){
          if(this.get('data')){
            return 'click';
          }
          return 'keyup';
        }
      },
      /**
       * suggest不提供自动设置选中文本功能
       * @type {Boolean}
       * @default true
       */
      autoSetValue:{
        value:false
      }
    }
  },{
    xclass:'suggest'
  });

  return suggest;
});