/**
 * @fileOverview 组合框可用于选择输入文本
 * @ignore
 */

define('bui/select/suggest',['bui/common','bui/select/combox'],function (require) {
  'use strict';
  var BUI = require('bui/common'),
    Combox = require('bui/select/combox'),
    TIMER_DELAY = 200,
    EMPTY = '';

  /**
   * 组合框 用于提示输入
   * xclass:'suggest'
   * ** 简单使用静态数据 **
   * <pre><code>
   * BUI.use('bui/select',function (Select) {
   *
   *  var suggest = new Select.Suggest({
   *     render:'#c2',
   *     name:'suggest', //形成输入框的name
   *     data:['1222224','234445','122','1111111']
   *   });
   *   suggest.render();
   *   
   * });
   * </code></pre>
   * ** 查询服务器数据 **
   * <pre><code>
   * BUI.use('bui/select',function(Select){
   *
   *  var suggest = new Select.Suggest({
   *    render:'#s1',
   *    name:'suggest', 
   *    url:'server-data.php'
   *  });
   *  suggest.render();
   *
   * });
   * </code></pre>
   * @class BUI.Select.Suggest
   * @extends BUI.Select.Combox
   */
  var suggest = Combox.extend({
    bindUI : function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        triggerEvent = (_self.get('triggerEvent') === 'keyup') ? 'keyup' : 'keyup click';

      //监听 keyup 事件
      textEl.on(triggerEvent, function(){
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
        text;

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
        _self._handleResponse(data,true);
      }
    },
    //如果存在数据源
    _getStore : function(){
      var _self = this,
        picker = _self.get('picker'),
        list = picker.get('list');
      if(list){
        return list.get('store');
      }
    },
    //通过 script 元素异步加载数据
    _requestData:function(){
      var _self = this,
        textEl = _self.get('el').find('input'),
        callback = _self.get('callback'),
        store = _self.get('store'),
        param = {};

      param[textEl.attr('name')] = textEl.val();
      if(store){
        param.start = 0; //回滚到第一页
        store.load(param,callback);
      }else{
        $.ajax({
          url:_self.get('url'),
          type:'post',
          dataType:_self.get('dataType'),
          data:param,
          success:function(data){
            _self._handleResponse(data);
            if(callback){
              callback(data);
            }
          }
        });
      }
      
    },
    //处理获取的数据
    _handleResponse:function(data,filter){
      var _self = this,
        items = filter ? _self._getFilterItems(data) : data;
      _self.set('items',items);

      if(_self.get('cacheable')){
        _self.get('dataCache')[_self.get('query')] = items;
      }
    },
    //如果列表记录是对象获取显示的文本
    _getItemText : function(item){
      var _self = this,
        picker = _self.get('picker'),
        list = picker.get('list');
      if(list){
        return list.getItemText(item);
      }
      return '';
    },
    //获取过滤的文本
    _getFilterItems:function(data){
      var _self = this,
        result = [],
        textEl = _self.get('el').find('input'),
        text = textEl.val(),
        isStatic = _self.get('data');
      data = data || [];
      /**
       * @private
       * @ignore
       */
      function push(str,item){
        if(BUI.isString(item)){
          result.push(str);
        }else{
          result.push(item);
        }
      }
      BUI.each(data, function(item){
        var str = BUI.isString(item) ? item : _self._getItemText(item);
        if(isStatic){
          if(str.indexOf($.trim(text)) !== -1){
            push(str,item);
          }
        }else{
          push(str,item);
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
      var r = periodic ? setInterval(fn, when) : setTimeout(fn, when);

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
    {
      /**
       * 用于显示提示的数据源
       * <pre><code>
       *   var suggest = new Select.Suggest({
       *     render:'#c2',
       *     name:'suggest', //形成输入框的name
       *     data:['1222224','234445','122','1111111']
       *   });
       * </code></pre>
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
       * @private
       */
      query:{
        value : EMPTY
      },
      /**
       * 是否允许缓存
       * @cfg {Boolean} cacheable
       */
      /**
       * 是否允许缓存
       * @type {Boolean}
       */
      cacheable:{
        value:false
      },
      /**
       * 缓存的数据
       * @private
       */
      dataCache:{
        shared:false,
        value:{}
      },
      /**
       * 请求返回的数据格式默认为'jsonp'
       * <pre><code>
       *  var suggest = new Select.Suggest({
       *    render:'#s1',
       *    name:'suggest', 
       *    dataType : 'json',
       *    url:'server-data.php'
       *  }); 
       * </code></pre>
       * @cfg {Object} [dataType = 'jsonp']
       */
      dataType : {
        value : 'jsonp'
      },
      /**
       * 请求数据的url
       * <pre><code>
       *  var suggest = new Select.Suggest({
       *    render:'#s1',
       *    name:'suggest', 
       *    dataType : 'json',
       *    url:'server-data.php'
       *  }); 
       * </code></pre>
       * @cfg {String} url
       */
      url : {

      },
     
      /**
       * 请求完数据的回调函数
       * <pre><code>
       *  var suggest = new Select.Suggest({
       *    render:'#s1',
       *    name:'suggest', 
       *    dataType : 'json',
       *    callback : function(data){
       *      //do something
       *    },
       *    url:'server-data.php'
       *  }); 
       * </code></pre>
       * @type {Function}
       */
      callback : {

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