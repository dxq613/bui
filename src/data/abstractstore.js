/**
 * @fileOverview 抽象数据缓冲类
 * @ignore
 */

define('bui/data/abstractstore',['bui/common','bui/data/proxy'],function (require) {
  var BUI = require('bui/common'),
    Proxy = require('bui/data/proxy');

  /**
   * @class BUI.Data.AbstractStore
   * 数据缓冲抽象类,此类不进行实例化
   * @extends BUI.Base
   */
  function AbstractStore(config){
    AbstractStore.superclass.constructor.call(this,config);
    this._init();
  }

  AbstractStore.ATTRS = {

    /**
    * 创建对象时是否自动加载
    * <pre><code>
    *   var store = new Data.Store({
    *     url : 'data.php',  //设置加载数据的URL
    *     autoLoad : true    //创建Store时自动加载数据
    *   });
    * </code></pre>
    * @cfg {Boolean} [autoLoad=false]
    */
    autoLoad: {
      value :false 
    },
    /**
     * 是否服务器端过滤数据，如果设置此属性，当调用filter()函数时发送请求
     * @type {Object}
     */
    remoteFilter: {
        value : false
    },
    /**
     * 上次查询的参数
     * @type {Object}
     * @readOnly
     */
    lastParams : {
      shared : false,
      value : {}
    },
    /**
     * 初始化时查询的参数，在初始化时有效
     * <pre><code>
     * var store = new Data.Store({
    *     url : 'data.php',  //设置加载数据的URL
    *     autoLoad : true,    //创建Store时自动加载数据
    *     params : {         //设置请求时的参数
    *       id : '1',
    *       type : '1'
    *     }
    *   });
     * </code></pre>
     * @cfg {Object} params
     */
    params : {

    },
    /**
     * 数据代理对象,用于加载数据的ajax配置，{@link BUI.Data.Proxy}
     * <pre><code>
     *   var store = new Data.Store({
    *     url : 'data.php',  //设置加载数据的URL
    *     autoLoad : true,    //创建Store时自动加载数据
    *     proxy : {
    *       method : 'post',
    *       dataType : 'jsonp'
    *     }
    *   });
     * </code></pre>
     * @cfg {Object|BUI.Data.Proxy} proxy
     */
    proxy : {
      shared : false,
      value : {
        
      }
    },
    /**
     * 请求数据的地址，通过ajax加载数据，
     * 此参数设置则加载远程数据
     * ** 你可以设置在proxy外部 **
     * <pre><code>
     *   var store = new Data.Store({
    *     url : 'data.php',  //设置加载数据的URL
    *     autoLoad : true,    //创建Store时自动加载数据
    *     proxy : {
    *       method : 'post',
    *       dataType : 'jsonp'
    *     }
    *   });
     * </code></pre>
     * ** 你也可以设置在proxy上 **
     * <pre><code>
     *   var store = new Data.Store({
    *     autoLoad : true,    //创建Store时自动加载数据
    *     proxy : {
    *       url : 'data.php',  //设置加载数据的URL
    *       method : 'post',
    *       dataType : 'jsonp'
    *     }
    *   });
     * </code></pre>
     * 否则把 {BUI.Data.Store#cfg-data}作为本地缓存数据加载
     * @cfg {String} url
     */
    /**
     * 请求数据的url
     * <pre><code>
     *   //更改url
     *   store.get('proxy').set('url',url);
     * </code></pre>
     * @type {String}
     */
    url : {

    },
    events : {
      value : [
        /**  
        * 数据接受改变，所有增加、删除、修改的数据记录清空
        * @name BUI.Data.Store#acceptchanges
        * @event  
        */
        'acceptchanges',
        /**  
        * 当数据加载完成后
        * @name BUI.Data.Store#load  
        * @event  
        * @param {jQuery.Event} e  事件对象，包含加载数据时的参数
        */
        'load',

        /**  
        * 当数据加载前
        * @name BUI.Data.Store#beforeload
        * @event  
        */
        'beforeload',

        /**  
        * 发生在，beforeload和load中间，数据已经获取完成，但是还未触发load事件，用于获取返回的原始数据
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.data 从服务器端返回的数据
        */
        'beforeprocessload',
        
        /**  
        * 当添加数据时触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.record 添加的数据
        */
        'add',

        /**
        * 加载数据发生异常时触发
        * @event
        * @name BUI.Data.Store#exception
        * @param {jQuery.Event} e 事件对象
        * @param {String|Object} e.error 加载数据时返回的错误信息或者加载数据失败，浏览器返回的信息（httpResponse 对象 的textStatus）
        * @param {String} e.responseText 网络或者浏览器加载数据发生错误是返回的httpResponse 对象的responseText
        */
        'exception',

        /**  
        * 当删除数据是触发该事件
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.data 删除的数据
        */
        'remove',
        
        /**  
        * 当更新数据指定字段时触发该事件 
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.record 更新的数据
        * @param {Object} e.field 更新的字段
        * @param {Object} e.value 更新的值
        */
        'update',

        /**  
        * 前端发生排序时触发
        * @name BUI.Data.Store#localsort
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Object} e.field 排序的字段
        * @param {Object} e.direction 排序的方向 'ASC'，'DESC'
        */
        'localsort',

        /**  
        * 前端发生过滤时触发
        * @event  
        * @param {jQuery.Event} e  事件对象
        * @param {Array} e.data 过滤完成的数据
        * @param {Function} e.filter 过滤器
        */
        'filtered'
      ]
    },
    /**
     * 本地数据源,使用本地数据源时会使用{@link BUI.Data.Proxy.Memery}
     * @cfg {Array} data
     */
    /**
     * 本地数据源
     * @type {Array}
     */
    data : {
      setter : function(data){
        var _self = this,
          proxy = _self.get('proxy');
        if(proxy.set){
          proxy.set('data',data);
        }else{
          proxy.data = data;
        }
        //设置本地数据时，把autoLoad置为true
        _self.set('autoLoad',true);
      }
    }
  };

  BUI.extend(AbstractStore,BUI.Base);

  BUI.augment(AbstractStore,{
    /**
     * 是否是数据缓冲对象，用于判断对象
     * @type {Boolean}
     */
    isStore : true,
    /**
     * @private
     * 初始化
     */
    _init : function(){
      var _self = this;

      _self.beforeInit();
      //初始化结果集
      _self._initParams();
      _self._initProxy();
      _self._initData();
    },
    /**
     * @protected
     * 初始化之前
     */
    beforeInit : function(){

    },
    //初始化数据,如果默认加载数据，则加载数据
    _initData : function(){
      var _self = this,
        autoLoad = _self.get('autoLoad');

      if(autoLoad){
        _self.load();
      }
    },
    //初始化查询参数
    _initParams : function(){
      var _self = this,
        lastParams = _self.get('lastParams'),
        params = _self.get('params');

      //初始化 参数
      BUI.mix(lastParams,params);
    },
    /**
     * @protected
     * 初始化数据代理类
     */
    _initProxy : function(){
      var _self = this,
        url = _self.get('url'),
        proxy = _self.get('proxy');

      if(!(proxy instanceof Proxy)){

        if(url){
          proxy.url = url;
        }

        //异步请求的代理类
        if(proxy.type === 'ajax' || proxy.url){
          proxy = new Proxy.Ajax(proxy);
        }else{
          proxy = new Proxy.Memery(proxy);
        }

        _self.set('proxy',proxy);
      }
    },
    /**
     * 加载数据
     * <pre><code>
     *  //一般调用
     *  store.load(params);
     *  
     *  //使用回调函数
     *  store.load(params,function(data){
     *  
     *  });
     *
     *  //load有记忆参数的功能
     *  store.load({id : '123',type="1"});
     *  //下一次调用
     *  store.load();默认使用上次的参数，可以对对应的参数进行覆盖
     * </code></pre>
     * @param  {Object} params 参数键值对
     * @param {Function} fn 回调函数，默认为空
     */
    load : function(params,callback){
      var _self = this,
        proxy = _self.get('proxy'),
        lastParams = _self.get('lastParams');

      BUI.mix(lastParams,_self.getAppendParams(),params);

      _self.fire('beforeload',{params:lastParams});

      //防止异步请求未结束，又发送新请求回调参数错误
      params = BUI.cloneObject(lastParams);
      proxy.read(lastParams,function(data){
        _self.onLoad(data,params);
        if(callback){
          callback(data,params);
        }
      },_self);
    },
    /**
     * 触发过滤
     * @protected
     */
    onFiltered : function(data,filter){
      var _self = this;
      _self.fire('filtered',{data : data,filter : filter});
    },
    /**
     * 加载完数据
     * @protected
     * @template
     */
    onLoad : function(data,params){
      var _self = this;

      var processResult = _self.processLoad(data,params);
      //如果处理成功，返回错误时，不进行后面的处理
      if(processResult){
        _self.afterProcessLoad(data,params);
      }
    },
    /**
     * 获取当前缓存的纪录
     */
    getResult : function(){
    },
    /**
     * 过滤数据，此函数的执行同属性 remoteFilter关联密切
     *
     *  - remoteFilter == true时：此函数只接受字符串类型的过滤参数，将{filter : filterStr}参数传输到服务器端
     *  - remoteFilter == false时：此函数接受比对函数，只有当函数返回true时生效
     *  
     * @param {Function|String} fn 过滤函数
     * @return {Array} 过滤结果
     */
    filter : function(filter){
        var _self = this,
            remoteFilter = _self.get('remoteFilter'),
            result;

        filter = filter || _self.get('filter');

        if(remoteFilter){
            _self.load({filter : filter});
        }else if(filter){
            _self.set('filter',filter);
            //如果result有值时才会进行filter
            if(_self.getResult().length > 0){
                result = _self._filterLocal(filter);
                _self.onFiltered(result,filter);
            }
        }
    },
    /**
     * @protected
     * 过滤缓存的数据
     * @param  {Function} fn 过滤函数
     * @return {Array} 过滤结果
     */
    _filterLocal : function(fn){
        
    },
    /**
     * 获取过滤后的数据，仅当本地过滤(remoteFilter = false)时有效
     * @return {Array} 过滤过的数据
     */
    getFilterResult: function(){
        var filter = this.get('filter');
        if(filter) {
            return this._filterLocal(filter);
        }
        else {
            return this.getResult();
        }
    },
    _clearLocalFilter : function(){
        this.set('filter', null);
    },
    /**
     * 清理过滤
     */
    clearFilter : function(){
        var _self = this,
            remoteFilter = _self.get('remoteFilter'),
            result;

        if(remoteFilter){
            _self.load({filter : ''});
        }else{
            _self._clearLocalFilter();
            result = _self.getFilterResult();
            _self.onFiltered(result, null);
        }
    },
    /**
     * @private
     * 加载完数据处理数据
     */
    processLoad : function(data,params){
      var _self = this,
        hasErrorField = _self.get('hasErrorProperty');

      _self.fire('beforeprocessload',{data : data});
    
      //获取的原始数据
      _self.fire('beforeProcessLoad',data);

      if(data[hasErrorField] || data.exception){
        _self.onException(data);
        return false;
      }
      return true;
    },
    /**
     * @protected
     * @template
     * 处理数据后
     */
    afterProcessLoad : function(data,params){

    },
    /**
     * @protected
     * 处理错误函数
     * @param  {*} data 出错对象
     */
    onException : function(data){
      var _self = this,
        errorProperty = _self.get('errorProperty'),
        obj = {};
      //网络异常、转码错误之类，发生在json获取或转变时
      if(data.exception){
        obj.type = 'exception';
        obj[errorProperty] = data.exception;
      }else{//用户定义的错误
        obj.type = 'error';
        obj[errorProperty] = data[errorProperty];
      }
      _self.fire('exception',obj);

    },
    /**
     * 是否包含数据
     * @return {Boolean} 
     */
    hasData : function(){

    },
    /**
     * 获取附加的参数
     * @template
     * @protected
     * @return {Object} 附加的参数
     */
    getAppendParams : function(){
      return {};
    }
  });

  return AbstractStore;
});