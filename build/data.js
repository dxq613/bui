/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
(function(){
var BASE = 'bui/data/';
define('bui/data',['bui/common',BASE + 'sortable',BASE + 'proxy',BASE + 'abstractstore',BASE + 'store',
  BASE + 'node',BASE + 'treestore'],function(r) {
  
  var BUI = r('bui/common'),
    Data = BUI.namespace('Data');
  BUI.mix(Data,{
    Sortable : r(BASE + 'sortable'),
    Proxy : r(BASE + 'proxy'),
    AbstractStore : r(BASE + 'abstractstore'),
    Store : r(BASE + 'store'),
    Node : r(BASE + 'node'),
    TreeStore : r(BASE + 'treestore')
  });

  return Data;
});
})();

define('bui/data/sortable',function() {

  var ASC = 'ASC',
    DESC = 'DESC';
  /**
   * \u6392\u5e8f\u6269\u5c55\u65b9\u6cd5\uff0c\u65e0\u6cd5\u76f4\u63a5\u4f7f\u7528
   * \u8bf7\u5728\u7ee7\u627f\u4e86 {@link BUI.Base}\u7684\u7c7b\u4e0a\u4f7f\u7528
   * @class BUI.Data.Sortable
   * @extends BUI.Base
   */
  var sortable = function(){

  };

  sortable.ATTRS = 
  /**
   * @lends BUI.Data.Sortable#
   * @ignore
   */
  {
    /**
     * \u6bd4\u8f83\u51fd\u6570
     * @cfg {Function} compareFunction
     * \u51fd\u6570\u539f\u578b function(v1,v2)\uff0c\u6bd4\u8f832\u4e2a\u5b57\u6bb5\u662f\u5426\u76f8\u7b49
     * \u5982\u679c\u662f\u5b57\u7b26\u4e32\u5219\u6309\u7167\u672c\u5730\u6bd4\u8f83\u7b97\u6cd5\uff0c\u5426\u5219\u4f7f\u7528 > ,== \u9a8c\u8bc1
     */
    compareFunction:{
      value : function(v1,v2){
        if(v1 === undefined){
          v1 = '';
        }
        if(v2 === undefined){
          v2 = '';
        }
        if(BUI.isString(v1)){
          return v1.localeCompare(v2);
        }

        if(v1 > v2){
          return 1;
        }else if(v1 === v2){
          return 0;
        }else{
          return  -1;
        }
      }
    },
    /**
     * \u6392\u5e8f\u5b57\u6bb5
     * @cfg {String} sortField
     */
    /**
     * \u6392\u5e8f\u5b57\u6bb5
     * @type {String}
     */
    sortField : {

    },
    /**
     * \u6392\u5e8f\u65b9\u5411,'ASC'\u3001'DESC'
     * @cfg {String} [sortDirection = 'ASC']
     */
    /**
     * \u6392\u5e8f\u65b9\u5411,'ASC'\u3001'DESC'
     * @type {String}
     */
    sortDirection : {
      value : 'ASC'
    },
    /**
     * \u6392\u5e8f\u4fe1\u606f
     * <ol>
     * <li>field: \u6392\u5e8f\u5b57\u6bb5</li>
     * <li>direction: \u6392\u5e8f\u65b9\u5411,ASC(\u9ed8\u8ba4),DESC</li>
     * </ol>
     * @cfg {Object} sortInfo
     */
    /**
     * \u6392\u5e8f\u4fe1\u606f
     * <ol>
     * <li>field: \u6392\u5e8f\u5b57\u6bb5</li>
     * <li>direction: \u6392\u5e8f\u65b9\u5411,ASC(\u9ed8\u8ba4),DESC</li>
     * </ol>
     * @type {Object}
     */
    sortInfo: {
      getter : function(){
        var _self = this,
          field = _self.get('sortField');

        return {
          field : field,
          direction : _self.get('sortDirection')
        };
      },
      setter: function(v){
        var _self = this;

        _self.set('sortField',v.field);
        _self.set('sortDirection',v.direction);
      }
    }
  };

  BUI.augment(sortable,
  /**
   * @lends BUI.Data.Sortable.prototype
   * @ignore
   */
  {
    compare : function(obj1,obj2,field,direction){

      var _self = this,
        dir;
      field = field || _self.get('sortField');
      direction = direction || _self.get('sortDirection');
      //\u5982\u679c\u672a\u6307\u5b9a\u6392\u5e8f\u5b57\u6bb5\uff0c\u6216\u65b9\u5411\uff0c\u5219\u6309\u7167\u9ed8\u8ba4\u987a\u5e8f
      if(!field || !direction){
        return 1;
      }
      dir = direction === ASC ? 1 : -1;

      return _self.get('compareFunction')(obj1[field],obj2[field]) * dir;
    },
    /**
     * \u83b7\u53d6\u6392\u5e8f\u7684\u96c6\u5408
     * @protected
     * @return {Array} \u6392\u5e8f\u96c6\u5408
     */
    getSortData : function(){

    },
    /**
     * \u6392\u5e8f\u6570\u636e
     * @param  {String|Array} field   \u6392\u5e8f\u5b57\u6bb5\u6216\u8005\u6570\u7ec4
     * @param  {String} direction \u6392\u5e8f\u65b9\u5411
     * @param {Array} records \u6392\u5e8f
     * @return {Array}    
     */
    sortData : function(field,direction,records){
      var _self = this,
        records = records || _self.getSortData();

      if(BUI.isArray(field)){
        records = field;
        field = null;
      }

      field = field || _self.get('sortField');
      direction = direction || _self.get('sortDirection');

      _self.set('sortField',field);
      _self.set('sortDirection',direction);

      if(!field || !direction){
        return records;
      }

      records.sort(function(obj1,obj2){
        return _self.compare(obj1,obj2,field,direction);
      });
      return records;
    }
  });

  return sortable;
});

define('bui/data/proxy',['bui/data/sortable'],function(require) {

  var Sortable = require('bui/data/sortable');

  /**
   * \u6570\u636e\u4ee3\u7406\u5bf9\u8c61\uff0c\u52a0\u8f7d\u6570\u636e,
   * \u4e00\u822c\u4e0d\u76f4\u63a5\u4f7f\u7528\uff0c\u5728store\u91cc\u9762\u51b3\u5b9a\u4f7f\u7528\u4ec0\u4e48\u7c7b\u578b\u7684\u6570\u636e\u4ee3\u7406\u5bf9\u8c61
   * @class BUI.Data.Proxy
   * @extends BUI.Base
   * @abstract 
   */
  var proxy = function(config){
    proxy.superclass.constructor.call(this,config);
  };

  proxy.ATTRS = {
    
  };

  BUI.extend(proxy,BUI.Base);

  BUI.augment(proxy,
  /**
   * @lends BUI.Data.Proxy.prototype
   * @ignore
   */
  {
    /**
     * @protected
     * @private
     */
    _read : function(params,callback){

    },
    /**
     * \u8bfb\u6570\u636e
     * @param  {Object} params \u952e\u503c\u5bf9\u5f62\u5f0f\u7684\u53c2\u6570
     * @param {Function} callback \u56de\u8c03\u51fd\u6570\uff0c\u51fd\u6570\u539f\u578b function(data){}
     * @param {Object} scope \u56de\u8c03\u51fd\u6570\u7684\u4e0a\u4e0b\u6587
     */
    read : function(params,callback,scope){
      var _self = this;
      scope = scope || _self;

      _self._read(params,function(data){
        callback.call(scope,data);
      });
    },
    /**
     * \u66f4\u65b0\u6570\u636e
     * @protected
     */
    update : function(params,callback,scope){

    }
  });

  /**
   * \u5f02\u6b65\u52a0\u8f7d\u6570\u636e\u7684\u4ee3\u7406
   * @class BUI.Data.Proxy.Ajax
   * @extends BUI.Data.Proxy
   */
  var ajaxProxy = function(config){
    ajaxProxy.superclass.constructor.call(this,config);
  };

  ajaxProxy.ATTRS = BUI.mix(true,proxy.ATTRS,
  /**
   * @lends BUI.Data.Proxy.Ajax#
   * @ignore
   */
  {
    /**
     * \u9650\u5236\u6761\u6570
     * @cfg {String} [limitParam='limit'] 
     */
    /**
     * \u9650\u5236\u6761\u6570
     * @type {String}
     * @default 'limit'
     */
    limitParam : {
      value : 'limit'
    },
    /**
     * \u8d77\u59cb\u7eaa\u5f55\u4ee3\u8868\u7684\u5b57\u6bb5
     * @cfg {String} [startParam='start']
     */
    /**
     * \u8d77\u59cb\u7eaa\u5f55\u4ee3\u8868\u7684\u5b57\u6bb5
     * @type {String}
     */
    startParam : {
      value : 'start'
    },
    /**
     * \u9875\u7801\u7684\u5b57\u6bb5\u540d
     * @cfg {String} [pageIndexParam='pageIndex']
     */
    /**
     * \u9875\u7801\u7684\u5b57\u6bb5\u540d
     * @type {String}
     * @default 'pageIndex'
     */
    pageIndexParam : {
      value : 'pageIndex'
    },
    /**
     * \u4f20\u9012\u5230\u540e\u53f0\uff0c\u5206\u9875\u5f00\u59cb\u7684\u9875\u7801\uff0c\u9ed8\u8ba4\u4ece0\u5f00\u59cb
     * @type {Number}
     */
    pageStart : {
      value : 0
    },
    /**
    * \u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u8fd4\u56de\u7684\u683c\u5f0f,\u76ee\u524d\u53ea\u652f\u6301"json\u3001jsonp"\u683c\u5f0f<br>
    * @cfg {String} [dataType='json']
    */
   /**
    * \u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u8fd4\u56de\u7684\u683c\u5f0f,\u76ee\u524d\u53ea\u652f\u6301"json\u3001jsonp"\u683c\u5f0f<br>
    * @type {String}
    * @default "json"
    */
    dataType: {
      value : 'json'
    },
    /**
     * \u83b7\u53d6\u6570\u636e\u7684\u65b9\u5f0f,'GET'\u6216\u8005'POST',\u9ed8\u8ba4\u4e3a'GET'
     * @cfg {String} [method='GET']
     */
    /**
     * \u83b7\u53d6\u6570\u636e\u7684\u65b9\u5f0f,'GET'\u6216\u8005'POST',\u9ed8\u8ba4\u4e3a'GET'
     * @type {String}
     * @default 'GET'
     */
    method : {
      value : 'GET'
    },
    /**
     * \u662f\u5426\u4f7f\u7528Cache
     * @type {Boolean}
     */
    cache : {
      value : false
    },
    /**
     * \u52a0\u8f7d\u6570\u636e\u7684\u94fe\u63a5
     * @cfg {String} url
     * @required
     */
    /**
     * \u52a0\u8f7d\u6570\u636e\u7684\u94fe\u63a5
     * @type {String}
     * @required
     */
    url :{

    }

  });
  BUI.extend(ajaxProxy,proxy);

  BUI.augment(ajaxProxy,{
    _processParams : function(params){
      var _self = this,
        pageStart = _self.get('pageStart'),
        arr = ['start','limit','pageIndex'];
      if(params.pageIndex != null){
        params.pageIndex = params.pageIndex + pageStart;
      }
      BUI.each(arr,function(field){
        var fieldParam = _self.get(field+'Param');
        if(fieldParam !== field){
          params[fieldParam] = params[field];
          delete params[field];
        }
      });
    },
    /**
     * @protected
     * @private
     */
    _read : function(params,callback){
      var _self = this;

      params = BUI.cloneObject(params);
      _self._processParams(params);

      $.ajax({
        url: _self.get('url'),
        type : _self.get('method'),
        dataType: _self.get('dataType'),
        data : params,
        cache : _self.get('cache'),
        success: function(data) {
          callback(data);
        },
        error : function(jqXHR, textStatus, errorThrown){
          var result = {
            exception : {
              status : textStatus,
              errorThrown: errorThrown,
              jqXHR : jqXHR
            }
          };
          callback(result);
        }
      });
    }
  });

  /**
   * \u8bfb\u53d6\u7f13\u5b58\u7684\u4ee3\u7406
   * @class BUI.Data.Proxy.Memery
   * @extends BUI.Data.Proxy
   * @mixins BUI.Data.Sortable
   */
  var memeryProxy = function(config){
    memeryProxy.superclass.constructor.call(this,config);
  };
  memeryProxy.ATTRS = {
    /**
     * \u5339\u914d\u7684\u5b57\u6bb5\u540d
     * @type {Array}
     */
    matchFields : {
      value : []
    }
  };

  BUI.extend(memeryProxy,proxy);

  BUI.mixin(memeryProxy,[Sortable]);

  BUI.augment(memeryProxy,{
    /**
     * @protected
     * @ignore
     */
    _read : function(params,callback){
      var _self = this,
        pageable = params.pageable,
        start = params.start,
        sortField = params.sortField,
        sortDirection = params.sortDirection,
        limit = params.limit,
        data = _self.get('data'),
        rows = []; 

      data = _self._getMatches(params);
      _self.sortData(sortField,sortDirection); 

      if(limit){//\u5206\u9875\u65f6
        rows = data.slice(start,start + limit);
        callback({rows:rows,results:data.length});
      }else{//\u4e0d\u5206\u9875\u65f6
        rows = data.slice(start);
        callback(rows);
      }
      
    },
    //\u83b7\u53d6\u5339\u914d\u51fd\u6570
    _getMatchFn : function(params, matchFields){
      var _self = this;
      return function(obj){
        var result = true;
        BUI.each(matchFields,function(field){
          if(params[field] != null && !(params[field] === obj[field])){
            result = false;
            return false;
          }
        });
        return result;
      }
    },
    //\u83b7\u53d6\u5339\u914d\u7684\u503c
    _getMatches : function(params){
      var _self = this,
        matchFields = _self.get('matchFields'),
        matchFn,
        data = _self.get('data') || [];
      if(params && matchFields.length){
        matchFn = _self._getMatchFn(params,matchFields);
        data = BUI.Array.filter(data,matchFn);
      }
      return data;
    }

  });

  proxy.Ajax = ajaxProxy;
  proxy.Memery = memeryProxy;

  return proxy;


});

define('bui/data/abstractstore',['bui/common','bui/data/proxy'],function (require) {
  var BUI = require('bui/common'),
    Proxy = require('bui/data/proxy');

  /**
   * @class BUI.Data.AbstractStore
   * \u6570\u636e\u7f13\u51b2\u62bd\u8c61\u7c7b,\u6b64\u7c7b\u4e0d\u8fdb\u884c\u5b9e\u4f8b\u5316
   * @extends BUI.Base
   */
  function AbstractStore(config){
    AbstractStore.superclass.constructor.call(this,config);
    this._init();
  }

  AbstractStore.ATTRS = {

    /**
    * \u521b\u5efa\u5bf9\u8c61\u65f6\u662f\u5426\u81ea\u52a8\u52a0\u8f7d
    * <pre><code>
    *   var store = new Data.Store({
    *     url : 'data.php',  //\u8bbe\u7f6e\u52a0\u8f7d\u6570\u636e\u7684URL
    *     autoLoad : true    //\u521b\u5efaStore\u65f6\u81ea\u52a8\u52a0\u8f7d\u6570\u636e
    *   });
    * </code></pre>
    * @cfg {Boolean} [autoLoad=false]
    */
    autoLoad: {
      value :false 
    },
    /**
     * \u662f\u5426\u670d\u52a1\u5668\u7aef\u8fc7\u6ee4\u6570\u636e\uff0c\u5982\u679c\u8bbe\u7f6e\u6b64\u5c5e\u6027\uff0c\u5f53\u8c03\u7528filter()\u51fd\u6570\u65f6\u53d1\u9001\u8bf7\u6c42
     * @type {Object}
     */
    remoteFilter: {
        value : false
    },
    /**
     * \u4e0a\u6b21\u67e5\u8be2\u7684\u53c2\u6570
     * @type {Object}
     * @readOnly
     */
    lastParams : {
      value : {}
    },
    /**
     * \u521d\u59cb\u5316\u65f6\u67e5\u8be2\u7684\u53c2\u6570\uff0c\u5728\u521d\u59cb\u5316\u65f6\u6709\u6548
     * <pre><code>
     * var store = new Data.Store({
    *     url : 'data.php',  //\u8bbe\u7f6e\u52a0\u8f7d\u6570\u636e\u7684URL
    *     autoLoad : true,    //\u521b\u5efaStore\u65f6\u81ea\u52a8\u52a0\u8f7d\u6570\u636e
    *     params : {         //\u8bbe\u7f6e\u8bf7\u6c42\u65f6\u7684\u53c2\u6570
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
     * \u6570\u636e\u4ee3\u7406\u5bf9\u8c61,\u7528\u4e8e\u52a0\u8f7d\u6570\u636e\u7684ajax\u914d\u7f6e\uff0c{@link BUI.Data.Proxy}
     * <pre><code>
     *   var store = new Data.Store({
    *     url : 'data.php',  //\u8bbe\u7f6e\u52a0\u8f7d\u6570\u636e\u7684URL
    *     autoLoad : true,    //\u521b\u5efaStore\u65f6\u81ea\u52a8\u52a0\u8f7d\u6570\u636e
    *     proxy : {
    *       method : 'post',
    *       dataType : 'jsonp'
    *     }
    *   });
     * </code></pre>
     * @cfg {Object|BUI.Data.Proxy} proxy
     */
    proxy : {
      value : {
        
      }
    },
    /**
     * \u8bf7\u6c42\u6570\u636e\u7684\u5730\u5740\uff0c\u901a\u8fc7ajax\u52a0\u8f7d\u6570\u636e\uff0c
     * \u6b64\u53c2\u6570\u8bbe\u7f6e\u5219\u52a0\u8f7d\u8fdc\u7a0b\u6570\u636e
     * ** \u4f60\u53ef\u4ee5\u8bbe\u7f6e\u5728proxy\u5916\u90e8 **
     * <pre><code>
     *   var store = new Data.Store({
    *     url : 'data.php',  //\u8bbe\u7f6e\u52a0\u8f7d\u6570\u636e\u7684URL
    *     autoLoad : true,    //\u521b\u5efaStore\u65f6\u81ea\u52a8\u52a0\u8f7d\u6570\u636e
    *     proxy : {
    *       method : 'post',
    *       dataType : 'jsonp'
    *     }
    *   });
     * </code></pre>
     * ** \u4f60\u4e5f\u53ef\u4ee5\u8bbe\u7f6e\u5728proxy\u4e0a **
     * <pre><code>
     *   var store = new Data.Store({
    *     autoLoad : true,    //\u521b\u5efaStore\u65f6\u81ea\u52a8\u52a0\u8f7d\u6570\u636e
    *     proxy : {
    *       url : 'data.php',  //\u8bbe\u7f6e\u52a0\u8f7d\u6570\u636e\u7684URL
    *       method : 'post',
    *       dataType : 'jsonp'
    *     }
    *   });
     * </code></pre>
     * \u5426\u5219\u628a {BUI.Data.Store#cfg-data}\u4f5c\u4e3a\u672c\u5730\u7f13\u5b58\u6570\u636e\u52a0\u8f7d
     * @cfg {String} url
     */
    /**
     * \u8bf7\u6c42\u6570\u636e\u7684url
     * <pre><code>
     *   //\u66f4\u6539url
     *   store.get('proxy').set('url',url);
     * </code></pre>
     * @type {String}
     */
    url : {

    },
    events : {
      value : [
        /**  
        * \u6570\u636e\u63a5\u53d7\u6539\u53d8\uff0c\u6240\u6709\u589e\u52a0\u3001\u5220\u9664\u3001\u4fee\u6539\u7684\u6570\u636e\u8bb0\u5f55\u6e05\u7a7a
        * @name BUI.Data.Store#acceptchanges
        * @event  
        */
        'acceptchanges',
        /**  
        * \u5f53\u6570\u636e\u52a0\u8f7d\u5b8c\u6210\u540e
        * @name BUI.Data.Store#load  
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61\uff0c\u5305\u542b\u52a0\u8f7d\u6570\u636e\u65f6\u7684\u53c2\u6570
        */
        'load',

        /**  
        * \u5f53\u6570\u636e\u52a0\u8f7d\u524d
        * @name BUI.Data.Store#beforeload
        * @event  
        */
        'beforeload',

        /**  
        * \u53d1\u751f\u5728\uff0cbeforeload\u548cload\u4e2d\u95f4\uff0c\u6570\u636e\u5df2\u7ecf\u83b7\u53d6\u5b8c\u6210\uff0c\u4f46\u662f\u8fd8\u672a\u89e6\u53d1load\u4e8b\u4ef6\uff0c\u7528\u4e8e\u83b7\u53d6\u8fd4\u56de\u7684\u539f\u59cb\u6570\u636e
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.data \u4ece\u670d\u52a1\u5668\u7aef\u8fd4\u56de\u7684\u6570\u636e
        */
        'beforeprocessload',
        
        /**  
        * \u5f53\u6dfb\u52a0\u6570\u636e\u65f6\u89e6\u53d1\u8be5\u4e8b\u4ef6
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.record \u6dfb\u52a0\u7684\u6570\u636e
        */
        'add',

        /**
        * \u52a0\u8f7d\u6570\u636e\u53d1\u751f\u5f02\u5e38\u65f6\u89e6\u53d1
        * @event
        * @name BUI.Data.Store#exception
        * @param {jQuery.Event} e \u4e8b\u4ef6\u5bf9\u8c61
        * @param {String|Object} e.error \u52a0\u8f7d\u6570\u636e\u65f6\u8fd4\u56de\u7684\u9519\u8bef\u4fe1\u606f\u6216\u8005\u52a0\u8f7d\u6570\u636e\u5931\u8d25\uff0c\u6d4f\u89c8\u5668\u8fd4\u56de\u7684\u4fe1\u606f\uff08httpResponse \u5bf9\u8c61 \u7684textStatus\uff09
        * @param {String} e.responseText \u7f51\u7edc\u6216\u8005\u6d4f\u89c8\u5668\u52a0\u8f7d\u6570\u636e\u53d1\u751f\u9519\u8bef\u662f\u8fd4\u56de\u7684httpResponse \u5bf9\u8c61\u7684responseText
        */
        'exception',

        /**  
        * \u5f53\u5220\u9664\u6570\u636e\u662f\u89e6\u53d1\u8be5\u4e8b\u4ef6
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.data \u5220\u9664\u7684\u6570\u636e
        */
        'remove',
        
        /**  
        * \u5f53\u66f4\u65b0\u6570\u636e\u6307\u5b9a\u5b57\u6bb5\u65f6\u89e6\u53d1\u8be5\u4e8b\u4ef6 
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.record \u66f4\u65b0\u7684\u6570\u636e
        * @param {Object} e.field \u66f4\u65b0\u7684\u5b57\u6bb5
        * @param {Object} e.value \u66f4\u65b0\u7684\u503c
        */
        'update',

        /**  
        * \u524d\u7aef\u53d1\u751f\u6392\u5e8f\u65f6\u89e6\u53d1
        * @name BUI.Data.Store#localsort
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.field \u6392\u5e8f\u7684\u5b57\u6bb5
        * @param {Object} e.direction \u6392\u5e8f\u7684\u65b9\u5411 'ASC'\uff0c'DESC'
        */
        'localsort'
      ]
    },
    /**
     * \u672c\u5730\u6570\u636e\u6e90,\u4f7f\u7528\u672c\u5730\u6570\u636e\u6e90\u65f6\u4f1a\u4f7f\u7528{@link BUI.Data.Proxy.Memery}
     * @cfg {Array} data
     */
    /**
     * \u672c\u5730\u6570\u636e\u6e90
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
        //\u8bbe\u7f6e\u672c\u5730\u6570\u636e\u65f6\uff0c\u628aautoLoad\u7f6e\u4e3atrue
        _self.set('autoLoad',true);
      }
    }
  };

  BUI.extend(AbstractStore,BUI.Base);

  BUI.augment(AbstractStore,{
    /**
     * \u662f\u5426\u662f\u6570\u636e\u7f13\u51b2\u5bf9\u8c61\uff0c\u7528\u4e8e\u5224\u65ad\u5bf9\u8c61
     * @type {Boolean}
     */
    isStore : true,
    /**
     * @private
     * \u521d\u59cb\u5316
     */
    _init : function(){
      var _self = this;

      _self.beforeInit();
      //\u521d\u59cb\u5316\u7ed3\u679c\u96c6
      _self._initParams();
      _self._initProxy();
      _self._initData();
    },
    /**
     * @protected
     * \u521d\u59cb\u5316\u4e4b\u524d
     */
    beforeInit : function(){

    },
    //\u521d\u59cb\u5316\u6570\u636e,\u5982\u679c\u9ed8\u8ba4\u52a0\u8f7d\u6570\u636e\uff0c\u5219\u52a0\u8f7d\u6570\u636e
    _initData : function(){
      var _self = this,
        autoLoad = _self.get('autoLoad');

      if(autoLoad){
        _self.load();
      }
    },
    //\u521d\u59cb\u5316\u67e5\u8be2\u53c2\u6570
    _initParams : function(){
      var _self = this,
        lastParams = _self.get('lastParams'),
        params = _self.get('params');

      //\u521d\u59cb\u5316 \u53c2\u6570
      BUI.mix(lastParams,params);
    },
    /**
     * @protected
     * \u521d\u59cb\u5316\u6570\u636e\u4ee3\u7406\u7c7b
     */
    _initProxy : function(){
      var _self = this,
        url = _self.get('url'),
        proxy = _self.get('proxy');

      if(!(proxy instanceof Proxy)){

        if(url){
          proxy.url = url;
        }

        //\u5f02\u6b65\u8bf7\u6c42\u7684\u4ee3\u7406\u7c7b
        if(proxy.type === 'ajax' || proxy.url){
          proxy = new Proxy.Ajax(proxy);
        }else{
          proxy = new Proxy.Memery(proxy);
        }

        _self.set('proxy',proxy);
      }
    },
    /**
     * \u52a0\u8f7d\u6570\u636e
     * <pre><code>
     *  //\u4e00\u822c\u8c03\u7528
     *  store.load(params);
     *  
     *  //\u4f7f\u7528\u56de\u8c03\u51fd\u6570
     *  store.load(params,function(data){
     *  
     *  });
     *
     *  //load\u6709\u8bb0\u5fc6\u53c2\u6570\u7684\u529f\u80fd
     *  store.load({id : '123',type="1"});
     *  //\u4e0b\u4e00\u6b21\u8c03\u7528
     *  store.load();\u9ed8\u8ba4\u4f7f\u7528\u4e0a\u6b21\u7684\u53c2\u6570\uff0c\u53ef\u4ee5\u5bf9\u5bf9\u5e94\u7684\u53c2\u6570\u8fdb\u884c\u8986\u76d6
     * </code></pre>
     * @param  {Object} params \u53c2\u6570\u952e\u503c\u5bf9
     * @param {Function} fn \u56de\u8c03\u51fd\u6570\uff0c\u9ed8\u8ba4\u4e3a\u7a7a
     */
    load : function(params,callback){
      var _self = this,
        proxy = _self.get('proxy'),
        lastParams = _self.get('lastParams');

      BUI.mix(lastParams,_self.getAppendParams(),params);

      _self.fire('beforeload',{params:lastParams});

      //\u9632\u6b62\u5f02\u6b65\u8bf7\u6c42\u672a\u7ed3\u675f\uff0c\u53c8\u53d1\u9001\u65b0\u8bf7\u6c42\u56de\u8c03\u53c2\u6570\u9519\u8bef
      params = BUI.cloneObject(lastParams);
      proxy.read(lastParams,function(data){
        _self.onLoad(data,params);
        if(callback){
          callback(data,params);
        }
      },_self);
    },
    /**
     * \u89e6\u53d1\u8fc7\u6ee4
     * @protected
     */
    onFiltered : function(data,filter){
      var _self = this;
      _self.fire('filtered',{data : data,filter : filter});
    },
    /**
     * \u52a0\u8f7d\u5b8c\u6570\u636e
     * @protected
     * @template
     */
    onLoad : function(data,params){
      var _self = this;

      var processResult = _self.processLoad(data,params);
      //\u5982\u679c\u5904\u7406\u6210\u529f\uff0c\u8fd4\u56de\u9519\u8bef\u65f6\uff0c\u4e0d\u8fdb\u884c\u540e\u9762\u7684\u5904\u7406
      if(processResult){
        _self.afterProcessLoad(data,params);
      }
    },
    /**
     * \u8fc7\u6ee4\u6570\u636e\uff0c\u6b64\u51fd\u6570\u7684\u6267\u884c\u540c\u5c5e\u6027 remoteFilter\u5173\u8054\u5bc6\u5207
     *
     *  - remoteFilter == true\u65f6\uff1a\u6b64\u51fd\u6570\u53ea\u63a5\u53d7\u5b57\u7b26\u4e32\u7c7b\u578b\u7684\u8fc7\u6ee4\u53c2\u6570\uff0c\u5c06{filter : filterStr}\u53c2\u6570\u4f20\u8f93\u5230\u670d\u52a1\u5668\u7aef
     *  - remoteFilter == false\u65f6\uff1a\u6b64\u51fd\u6570\u63a5\u53d7\u6bd4\u5bf9\u51fd\u6570\uff0c\u53ea\u6709\u5f53\u51fd\u6570\u8fd4\u56detrue\u65f6\u751f\u6548
     *  
     * @param {Function|String} fn \u8fc7\u6ee4\u51fd\u6570
     * @return {Array} \u8fc7\u6ee4\u7ed3\u679c
     */
    filter : function(filter){
        var _self = this,
            remoteFilter = _self.get('remoteFilter'),
            result;

        if(remoteFilter){
            _self.load({filter : filter});
        }else{
            _self.set('filter',filter);
            result = _self._filterLocal(filter);
            _self.onFiltered(result,filter);
        }
    },
    /**
     * @protected
     * \u8fc7\u6ee4\u7f13\u5b58\u7684\u6570\u636e
     * @param  {Function} fn \u8fc7\u6ee4\u51fd\u6570
     * @return {Array} \u8fc7\u6ee4\u7ed3\u679c
     */
    _filterLocal : function(fn){
        
    },
    _clearLocalFilter : function(){
        this._filterLocal(function(){
            return true;
        });
    },
    /**
     * \u6e05\u7406\u8fc7\u6ee4
     */
    clearFilter : function(){
        var _self = this,
            remoteFilter = _self.get('remoteFilter'),
            result;

        if(remoteFilter){
            _self.load({filter : ''});
        }else{
            _self._clearLocalFilter();
        }
    },
    /**
     * @private
     * \u52a0\u8f7d\u5b8c\u6570\u636e\u5904\u7406\u6570\u636e
     */
    processLoad : function(data,params){
      var _self = this,
        hasErrorField = _self.get('hasErrorProperty');

      _self.fire('beforeprocessload',{data : data});
    
      //\u83b7\u53d6\u7684\u539f\u59cb\u6570\u636e
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
     * \u5904\u7406\u6570\u636e\u540e
     */
    afterProcessLoad : function(data,params){

    },
    /**
     * @protected
     * \u5904\u7406\u9519\u8bef\u51fd\u6570
     * @param  {*} data \u51fa\u9519\u5bf9\u8c61
     */
    onException : function(data){
      var _self = this,
        errorProperty = _self.get('errorProperty'),
        obj = {};
      //\u7f51\u7edc\u5f02\u5e38\u3001\u8f6c\u7801\u9519\u8bef\u4e4b\u7c7b\uff0c\u53d1\u751f\u5728json\u83b7\u53d6\u6216\u8f6c\u53d8\u65f6
      if(data.exception){
        obj.type = 'exception';
        obj[errorProperty] = data.exception;
      }else{//\u7528\u6237\u5b9a\u4e49\u7684\u9519\u8bef
        obj.type = 'error';
        obj[errorProperty] = data[errorProperty];
      }
      _self.fire('exception',obj);

    },
    /**
     * \u662f\u5426\u5305\u542b\u6570\u636e
     * @return {Boolean} 
     */
    hasData : function(){

    },
    /**
     * \u83b7\u53d6\u9644\u52a0\u7684\u53c2\u6570
     * @template
     * @protected
     * @return {Object} \u9644\u52a0\u7684\u53c2\u6570
     */
    getAppendParams : function(){
      return {};
    }
  });

  return AbstractStore;
});
define('bui/data/node',['bui/common'],function (require) {
  var BUI = require('bui/common');

  function mapNode(cfg,map){
    var rst = {};
    if(map){
      BUI.each(cfg,function(v,k){
        var name = map[k] || k;
        rst[name] = v;
      });
      rst.record = cfg;
    }else{
      rst = cfg;
    }
    return rst;
  }
  /**
   * @class BUI.Data.Node
   * \u6811\u5f62\u6570\u636e\u7ed3\u6784\u7684\u8282\u70b9\u7c7b
   */
  function Node (cfg,map) {
    var _self = this;
    cfg = mapNode(cfg,map);
    BUI.mix(this,cfg);
  }

  BUI.augment(Node,{
    /**
     * \u662f\u5426\u6839\u8282\u70b9
     * @type {Boolean}
     */
    root : false,
    /**
     * \u662f\u5426\u53f6\u5b50\u8282\u70b9
     * @type {Boolean}
     */
    leaf : null,
    /**
     * \u663e\u793a\u8282\u70b9\u65f6\u663e\u793a\u7684\u6587\u672c
     * @type {Object}
     */
    text : '',
    /**
     * \u4ee3\u8868\u8282\u70b9\u7684\u7f16\u53f7
     * @type {String}
     */
    id : null,
    /**
     * \u5b50\u8282\u70b9\u662f\u5426\u5df2\u7ecf\u52a0\u8f7d\u8fc7
     * @type {Boolean}
     */
    loaded : false,
    /**
     * \u4ece\u6839\u8282\u70b9\u5230\u6b64\u8282\u70b9\u7684\u8def\u5f84\uff0cid\u7684\u96c6\u5408\u5982\uff1a ['0','1','12'],
     * \u4fbf\u4e8e\u5feb\u901f\u5b9a\u4f4d\u8282\u70b9
     * @type {Array}
     */
    path : null,
    /**
     * \u7236\u8282\u70b9
     * @type {BUI.Data.Node}
     */
    parent : null,
    /**
     * \u6811\u8282\u70b9\u7684\u7b49\u7ea7
     * @type {Number}
     */
    level : 0,
    /**
     * \u8282\u70b9\u662f\u5426\u7531\u4e00\u6761\u8bb0\u5f55\u5c01\u88c5\u800c\u6210
     * @type {Object}
     */
    record : null,
    /**
     * \u5b50\u8282\u70b9\u96c6\u5408
     * @type {BUI.Data.Node[]}
     */
    children : null,
    /**
     * \u662f\u5426\u662fNode\u5bf9\u8c61
     * @type {Object}
     */
    isNode : true
  });
  return Node;
});
define('bui/data/treestore',['bui/common','bui/data/node','bui/data/abstractstore','bui/data/proxy'],function (require) {

  var BUI = require('bui/common'),
    Node = require('bui/data/node'),
    Proxy = require('bui/data/proxy'),
    AbstractStore = require('bui/data/abstractstore');

  /**
   * @class BUI.Data.TreeStore
   * \u6811\u5f62\u6570\u636e\u7f13\u51b2\u7c7b
   * <p>
   * <img src="../assets/img/class-data.jpg"/>
   * </p>
   * <pre><code>
   *   //\u52a0\u8f7d\u9759\u6001\u6570\u636e
   *   var store = new TreeStore({
   *     root : {
   *       text : '\u6839\u8282\u70b9',
   *       id : 'root'
   *     },
   *     data : [{id : '1',text : 1},{id : '2',text : 2}] //\u4f1a\u52a0\u8f7d\u6210root\u7684children
   *   });
   *   //\u5f02\u6b65\u52a0\u8f7d\u6570\u636e\uff0c\u81ea\u52a8\u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u4f1a\u8c03\u7528store.load({id : 'root'}); //root\u4e3a\u6839\u8282\u70b9\u7684id
   *   var store = new TreeStore({
   *     root : {
   *       text : '\u6839\u8282\u70b9',
   *       id : 'root'
   *     },
   *     url : 'data/nodes.php',
   *     autoLoad : true  //\u8bbe\u7f6e\u81ea\u52a8\u52a0\u8f7d\uff0c\u521d\u59cb\u5316\u540e\u81ea\u52a8\u52a0\u8f7d\u6570\u636e
   *   });
   *
   *   //\u52a0\u8f7d\u6307\u5b9a\u8282\u70b9
   *   var node = store.findNode('1');
   *   store.loadNode(node);
   *   //\u6216\u8005
   *   store.load({id : '1'});//\u53ef\u4ee5\u914d\u7f6e\u81ea\u5b9a\u4e49\u53c2\u6570\uff0c\u8fd4\u56de\u503c\u9644\u52a0\u5230\u6307\u5b9aid\u7684\u8282\u70b9\u4e0a
   * </code></pre>
   * @extends BUI.Data.AbstractStore
   */
  function TreeStore(config){
    TreeStore.superclass.constructor.call(this,config);
  }

  TreeStore.ATTRS = {
    /**
     * \u6839\u8282\u70b9
     * <pre><code>
     *  var store = new TreeStore({
     *    root : {text : '\u6839\u8282\u70b9',id : 'rootId',children : [{id : '1',text : '1'}]}
     *  });
     * </code></pre>
     * @cfg {Object} root
     */
    /**
     * \u6839\u8282\u70b9,\u521d\u59cb\u5316\u540e\u4e0d\u8981\u66f4\u6539\u5bf9\u8c61\uff0c\u53ef\u4ee5\u66f4\u6539\u5c5e\u6027\u503c
     * <pre><code>
     *  var root = store.get('root');
     *  root.text = '\u4fee\u6539\u7684\u6587\u672c'\uff1b
     *  store.update(root);
     * </code></pre>
     * @type {Object}
     * @readOnly
     */
    root : {

    },
    /**
     * \u6570\u636e\u6620\u5c04\uff0c\u7528\u4e8e\u8bbe\u7f6e\u7684\u6570\u636e\u8ddf@see {BUI.Data.Node} \u4e0d\u4e00\u81f4\u65f6\uff0c\u8fdb\u884c\u5339\u914d\u3002
     * \u5982\u679c\u6b64\u5c5e\u6027\u4e3anull,\u90a3\u4e48\u5047\u8bbe\u8bbe\u7f6e\u7684\u5bf9\u8c61\u662fNode\u5bf9\u8c61
     * <pre><code>
     *   //\u4f8b\u5982\u539f\u59cb\u6570\u636e\u4e3a {name : '123',value : '\u6587\u672c123',isLeaf: false,nodes : []}
     *   var store = new TreeStore({
     *     map : {
     *       'name' : 'id',
     *       'value' : 'text',
     *       'isLeaf' : 'leaf' ,
     *       'nodes' : 'children'
     *     }
     *   });
     *   //\u6620\u5c04\u540e\uff0c\u8bb0\u5f55\u4f1a\u53d8\u6210  {id : '123',text : '\u6587\u672c123',leaf: false,children : []};
     *   //\u6b64\u65f6\u539f\u59cb\u8bb0\u5f55\u4f1a\u4f5c\u4e3a\u5bf9\u8c61\u7684 record\u5c5e\u6027
     *   var node = store.findNode('123'),
     *     record = node.record;
     * </code></pre> 
     * **Notes:**
     * \u4f7f\u7528\u6570\u636e\u6620\u5c04\u7684\u8bb0\u5f55\u4ec5\u505a\u4e8e\u5c55\u793a\u6570\u636e\uff0c\u4e0d\u4f5c\u4e3a\u53ef\u66f4\u6539\u7684\u6570\u636e\uff0cadd,update\u4e0d\u4f1a\u66f4\u6539\u6570\u636e\u7684\u539f\u59cb\u6570\u636e
     * @cfg {Object} map
     */
    map : {

    },
    /**
     * \u6807\u793a\u7236\u5143\u7d20id\u7684\u5b57\u6bb5\u540d\u79f0
     * @type {String}
     */
    pidField : {
      
    },
    /**
     * \u8fd4\u56de\u6570\u636e\u6807\u793a\u6570\u636e\u7684\u5b57\u6bb5</br>
     * \u5f02\u6b65\u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u8fd4\u56de\u6570\u636e\u53ef\u4ee5\u4f7f\u6570\u7ec4\u6216\u8005\u5bf9\u8c61
     * - \u5982\u679c\u8fd4\u56de\u7684\u662f\u5bf9\u8c61,\u53ef\u4ee5\u9644\u52a0\u5176\u4ed6\u4fe1\u606f,\u90a3\u4e48\u53d6\u5bf9\u8c61\u5bf9\u5e94\u7684\u5b57\u6bb5 {nodes : [],hasError:false}
     * - \u5982\u4f55\u83b7\u53d6\u9644\u52a0\u4fe1\u606f\u53c2\u770b @see {BUI.Data.AbstractStore-event-beforeprocessload}
     * <pre><code>
     *  //\u8fd4\u56de\u6570\u636e\u4e3a\u6570\u7ec4 [{},{}]\uff0c\u4f1a\u76f4\u63a5\u9644\u52a0\u5230\u52a0\u8f7d\u7684\u8282\u70b9\u540e\u9762
     *  
     *  var node = store.loadNode('123');
     *  store.loadNode(node);
     *  
     * </code></pre>
     * @cfg {Object} [dataProperty = 'nodes']
     */
    dataProperty : {
      value : 'nodes'
    },
    events : {
      value : [
        /**  
        * \u5f53\u6dfb\u52a0\u6570\u636e\u65f6\u89e6\u53d1\u8be5\u4e8b\u4ef6
        * @event  
        * <pre><code>
        *  store.on('add',function(ev){
        *    list.addItem(e.node,index);
        *  });
        * </code></pre>
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.node \u6dfb\u52a0\u7684\u8282\u70b9
        * @param {Number} index \u6dfb\u52a0\u7684\u4f4d\u7f6e
        */
        'add',
        /**  
        * \u5f53\u66f4\u65b0\u6570\u636e\u6307\u5b9a\u5b57\u6bb5\u65f6\u89e6\u53d1\u8be5\u4e8b\u4ef6 
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.node \u66f4\u65b0\u7684\u8282\u70b9
        */
        'update',
        /**  
        * \u5f53\u5220\u9664\u6570\u636e\u65f6\u89e6\u53d1\u8be5\u4e8b\u4ef6
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.node \u5220\u9664\u7684\u8282\u70b9
        * @param {Number} index \u5220\u9664\u8282\u70b9\u7684\u7d22\u5f15
        */
        'remove',
        /**  
        * \u8282\u70b9\u52a0\u8f7d\u5b8c\u6bd5\u89e6\u53d1\u8be5\u4e8b\u4ef6
        * <pre></code>
        *   //\u5f02\u6b65\u52a0\u8f7d\u8282\u70b9,\u6b64\u65f6\u8282\u70b9\u5df2\u7ecf\u9644\u52a0\u5230\u52a0\u8f7d\u8282\u70b9\u7684\u540e\u9762
        *   store.on('load',function(ev){
        *     var params = ev.params,
        *       id = params.id,
        *       node = store.findNode(id),
        *       children = node.children;  //\u8282\u70b9\u7684id
        *     //TO DO
        *   });
        * </code></pre>
        * 
        * @event  
        * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
        * @param {Object} e.node \u52a0\u8f7d\u7684\u8282\u70b9
        * @param {Object} e.params \u52a0\u8f7d\u8282\u70b9\u65f6\u7684\u53c2\u6570
        */
        'load'
      ]
    }
  }

  BUI.extend(TreeStore,AbstractStore);

  BUI.augment(TreeStore,{
    /**
     * @protected
     * @override
     * \u521d\u59cb\u5316\u524d
     */
    beforeInit:function(){
      this.initRoot();
    },
    //\u521d\u59cb\u5316\u6570\u636e,\u5982\u679c\u9ed8\u8ba4\u52a0\u8f7d\u6570\u636e\uff0c\u5219\u52a0\u8f7d\u6570\u636e
    _initData : function(){
      var _self = this,
        autoLoad = _self.get('autoLoad'),
        pidField = _self.get('pidField'),
        proxy = _self.get('proxy'),
        root = _self.get('root');

      //\u6dfb\u52a0\u9ed8\u8ba4\u7684\u5339\u914d\u7236\u5143\u7d20\u7684\u5b57\u6bb5
      if(!proxy.get('url') && pidField){
        proxy.get('matchFields').push(pidField);
      }
      
      if(autoLoad && !root.children){
        //params = root.id ? {id : root.id}: {};
        _self.loadNode(root);
      }
    },
    /**
     * @protected
     * \u521d\u59cb\u5316\u6839\u8282\u70b9
     */
    initRoot : function(){
      var _self = this,
        map = _self.get('map'),
        root = _self.get('root');
      if(!root){
        root = {};
      }
      if(!root.isNode){
        root = new Node(root,map);
        //root.children= [];
      }
      root.path = [root.id];
      root.level = 0;
      if(root.children){
        _self.setChildren(root,root.children);
      }
      _self.set('root',root);
    },
    /**
     * \u6dfb\u52a0\u8282\u70b9\uff0c\u89e6\u53d1{@link BUI.Data.TreeStore#event-add} \u4e8b\u4ef6
     * <pre><code>
     *  //\u6dfb\u52a0\u5230\u6839\u8282\u70b9\u4e0b
     *  store.add({id : '1',text : '1'});
     *  //\u6dfb\u52a0\u5230\u6307\u5b9a\u8282\u70b9
     *  var node = store.findNode('1'),
     *    subNode = store.add({id : '11',text : '11'},node);
     *  //\u63d2\u5165\u5230\u8282\u70b9\u7684\u6307\u5b9a\u4f4d\u7f6e
     *  var node = store.findNode('1'),
     *    subNode = store.add({id : '12',text : '12'},node,0);
     * </code></pre>
     * @param {BUI.Data.Node|Object} node \u8282\u70b9\u6216\u8005\u6570\u636e\u5bf9\u8c61
     * @param {BUI.Data.Node} [parent] \u7236\u8282\u70b9,\u5982\u679c\u672a\u6307\u5b9a\u5219\u4e3a\u6839\u8282\u70b9
     * @param {Number} [index] \u6dfb\u52a0\u8282\u70b9\u7684\u4f4d\u7f6e
     * @return {BUI.Data.Node} \u6dfb\u52a0\u5b8c\u6210\u7684\u8282\u70b9
     */
    add : function(node,parent,index){
      var _self = this;

      node = _self._add(node,parent,index);
      _self.fire('add',{node : node,record : node,index : index});
      return node;
    },
    //
    _add : function(node,parent,index){
      parent = parent || this.get('root');  //\u5982\u679c\u672a\u6307\u5b9a\u7236\u5143\u7d20\uff0c\u6dfb\u52a0\u5230\u8ddf\u8282\u70b9
      var _self = this,
        map = _self.get('map'),
        nodes = parent.children,
        nodeChildren;

      if(!node.isNode){
        node = new Node(node,map);
      }

      nodeChildren = node.children || []

      if(nodeChildren.length == 0 && node.leaf == null){
        node.leaf = true;
      }
      if(parent){
        parent.leaf = false;
      }
      
      node.parent = parent;
      node.level = parent.level + 1;
      node.path = parent.path.concat(node.id);
      index = index == null ? parent.children.length : index;
      BUI.Array.addAt(nodes,node,index);

      _self.setChildren(node,nodeChildren);
      return node;
    },
    /**
     * \u79fb\u9664\u8282\u70b9\uff0c\u89e6\u53d1{@link BUI.Data.TreeStore#event-remove} \u4e8b\u4ef6
     * 
     * <pre><code>
     *  var node = store.findNode('1'); //\u6839\u636e\u8282\u70b9id \u83b7\u53d6\u8282\u70b9
     *  store.remove(node);
     * </code></pre>
     * 
     * @param {BUI.Data.Node} node \u8282\u70b9\u6216\u8005\u6570\u636e\u5bf9\u8c61
     * @return {BUI.Data.Node} \u5220\u9664\u7684\u8282\u70b9
     */
    remove : function(node){
      var parent = node.parent || _self.get('root'),
        index = BUI.Array.indexOf(node,parent.children) ;

      BUI.Array.remove(parent.children,node);
      if(parent.children.length === 0){
        parent.leaf = true;
      }
      this.fire('remove',{node : node ,record : node , index : index});
      node.parent = null;
      return node;
    },
    /**
    * \u8bbe\u7f6e\u8bb0\u5f55\u7684\u503c \uff0c\u89e6\u53d1 update \u4e8b\u4ef6
    * <pre><code>
    *  store.setValue(obj,'value','new value');
    * </code></pre>
    * @param {Object} obj \u4fee\u6539\u7684\u8bb0\u5f55
    * @param {String} field \u4fee\u6539\u7684\u5b57\u6bb5\u540d
    * @param {Object} value \u4fee\u6539\u7684\u503c
    */
    setValue : function(node,field,value){
      var 
        _self = this;
        node[field] = value;

      _self.fire('update',{node:node,record : node,field:field,value:value});
    },
    /**
     * \u66f4\u65b0\u8282\u70b9
     * <pre><code>
     *  var node = store.findNode('1'); //\u6839\u636e\u8282\u70b9id \u83b7\u53d6\u8282\u70b9
     *  node.text = 'modify text'; //\u4fee\u6539\u6587\u672c
     *  store.update(node);        //\u6b64\u65f6\u4f1a\u89e6\u53d1update\u4e8b\u4ef6\uff0c\u7ed1\u5b9a\u4e86store\u7684\u63a7\u4ef6\u4f1a\u66f4\u65b0\u5bf9\u5e94\u7684DOM
     * </code></pre>
     * @return {BUI.Data.Node} \u66f4\u65b0\u8282\u70b9
     */
    update : function(node){
      this.fire('update',{node : node,record : node});
    },
    /**
     * \u8fd4\u56de\u7f13\u5b58\u7684\u6570\u636e\uff0c\u6839\u8282\u70b9\u7684\u76f4\u63a5\u5b50\u8282\u70b9\u96c6\u5408
     * <pre><code>
     *   //\u83b7\u53d6\u6839\u8282\u70b9\u7684\u6240\u6709\u5b50\u8282\u70b9
     *   var data = store.getResult();
     *   //\u83b7\u53d6\u6839\u8282\u70b9
     *   var root = store.get('root');
     * </code></pre>
     * @return {Array} \u6839\u8282\u70b9\u4e0b\u9762\u7684\u6570\u636e
     */
    getResult : function(){
      return this.get('root').children;
    },
    /**
     * \u8bbe\u7f6e\u7f13\u5b58\u7684\u6570\u636e\uff0c\u8bbe\u7f6e\u4e3a\u6839\u8282\u70b9\u7684\u6570\u636e
    *   <pre><code>
    *     var data = [
    *       {id : '1',text : '\u6587\u672c1'},
    *       {id : '2',text : '\u6587\u672c2',children:[
    *         {id : '21',text : '\u6587\u672c21'}
    *       ]},
    *       {id : '3',text : '\u6587\u672c3'}
    *     ];
    *     store.setResult(data); //\u4f1a\u5bf9\u6570\u636e\u8fdb\u884c\u683c\u5f0f\u5316\uff0c\u6dfb\u52a0leaf\u7b49\u5b57\u6bb5\uff1a
    *                            //[{id : '1',text : '\u6587\u672c1',leaf : true},{id : '2',text : '\u6587\u672c2',leaf : false,children:[...]}....]
    *   </code></pre>
     * @param {Array} data \u7f13\u5b58\u7684\u6570\u636e
     */
    setResult : function(data){
      var _self = this,
        proxy = _self.get('proxy'),
        root = _self.get('root');
      if(proxy instanceof Proxy.Memery){
        _self.set('data',data);
        _self.load({id : root.id});
      }else{
        _self.setChildren(root,data);
      }
    },
    /**
     * \u8bbe\u7f6e\u5b50\u8282\u70b9
     * @protected
     * @param {BUI.Data.Node} node  \u8282\u70b9
     * @param {Array} children \u5b50\u8282\u70b9
     */
    setChildren : function(node,children){
      var _self = this;
      node.children = [];
      if(!children.length){
        return;
      }
      BUI.each(children,function(item){
        _self._add(item,node);
      });
    },
    /**
     * \u67e5\u627e\u8282\u70b9
     * <pre><code>
     *  var node = store.findNode('1');//\u4ece\u6839\u8282\u70b9\u5f00\u59cb\u67e5\u627e\u8282\u70b9
     *  
     *  var subNode = store.findNode('123',node); //\u4ece\u6307\u5b9a\u8282\u70b9\u5f00\u59cb\u67e5\u627e
     * </code></pre>
     * @param  {String} id \u8282\u70b9Id
     * @param  {BUI.Data.Node} [parent] \u7236\u8282\u70b9
     * @param {Boolean} [deep = true] \u662f\u5426\u9012\u5f52\u67e5\u627e
     * @return {BUI.Data.Node} \u8282\u70b9
     */
    findNode : function(id,parent,deep){
      var _self = this;
      deep = deep == null ? true : deep;
      if(!parent){
        var root = _self.get('root');
        if(root.id === id){
          return root;
        }
        return _self.findNode(id,root);
      }
      var children = parent.children,
        rst = null;
      BUI.each(children,function(item){
        if(item.id === id){
          rst = item;
        }else if(deep){
          rst = _self.findNode(id,item);
        }
        if(rst){
          return false;
        }
      });
      return rst;
    },
    /**
     * \u67e5\u627e\u8282\u70b9,\u6839\u636e\u5339\u914d\u51fd\u6570\u67e5\u627e
     * <pre><code>
     *  var nodes = store.findNodesBy(function(node){
     *   if(node.status == '0'){
     *     return true;
     *   }
     *   return false;
     *  });
     * </code></pre>
     * @param  {Function} func \u5339\u914d\u51fd\u6570
     * @param  {BUI.Data.Node} [parent] \u7236\u5143\u7d20\uff0c\u5982\u679c\u4e0d\u5b58\u5728\uff0c\u5219\u4ece\u6839\u8282\u70b9\u67e5\u627e
     * @return {Array} \u8282\u70b9\u6570\u7ec4
     */
    findNodesBy : function(func,parent){
      var _self = this,
        root,
        rst = [];

      if(!parent){
        parent = _self.get('root');
      }

      BUI.each(parent.children,function(item){
        if(func(item)){
          rst.push(item);
        }
        rst = rst.concat(_self.findNodesBy(func,item));
      });

      return rst;
    },
    /**
     * \u6839\u636epath\u67e5\u627e\u8282\u70b9
     * @return {BUI.Data.Node} \u8282\u70b9
     * @ignore
     */
    findNodeByPath : function(path){
      if(!path){
        return null;
      }
      var _self = this,
        root = _self.get('root'),
        pathArr = path.split(','),
        node,
        i,
        tempId = pathArr[0];
      if(!tempId){
        return null;
      }
      if(root.id == tempId){
        node = root;
      }else{
        node = _self.findNode(tempId,root,false);
      }
      if(!node){
        return;
      }
      for(i = 1 ; i < pathArr.length ; i = i + 1){
        var tempId = pathArr[i];
        node = _self.findNode(tempId,node,false);
        if(!node){
          break;
        }
      }
      return node;
    },
    /**
     * \u662f\u5426\u5305\u542b\u6307\u5b9a\u8282\u70b9\uff0c\u5982\u679c\u672a\u6307\u5b9a\u7236\u8282\u70b9\uff0c\u4ece\u6839\u8282\u70b9\u5f00\u59cb\u641c\u7d22
     * <pre><code>
     *  store.contains(node); //\u662f\u5426\u5b58\u5728\u8282\u70b9
     *
     *  store.contains(subNode,node); //\u8282\u70b9\u662f\u5426\u5b58\u5728\u6307\u5b9a\u5b50\u8282\u70b9
     * </code></pre>
     * @param  {BUI.Data.Node} node \u8282\u70b9
     * @param  {BUI.Data.Node} parent \u7236\u8282\u70b9
     * @return {Boolean} \u662f\u5426\u5305\u542b\u6307\u5b9a\u8282\u70b9
     */
    contains : function(node,parent){
      var _self = this,
        findNode = _self.findNode(node.id,parent);
      return !!findNode;
    },
    /**
     * \u52a0\u8f7d\u5b8c\u6570\u636e
     * @protected
     * @override
     */
    afterProcessLoad : function(data,params){
      var _self = this,
        pidField = _self.get('pidField'),
        id = params.id || params[pidField],
        dataProperty = _self.get('dataProperty'),
        node = _self.findNode(id) || _self.get('root');//\u5982\u679c\u627e\u4e0d\u5230\u7236\u5143\u7d20\uff0c\u5219\u653e\u7f6e\u5728\u8ddf\u8282\u70b9

      if(BUI.isArray(data)){
        _self.setChildren(node,data);
      }else{
        _self.setChildren(node,data[dataProperty]);
      }
      node.loaded = true; //\u6807\u8bc6\u5df2\u7ecf\u52a0\u8f7d\u8fc7
      _self.fire('load',{node : node,params : params});
    },
    /**
     * \u662f\u5426\u5305\u542b\u6570\u636e
     * @return {Boolean} 
     */
    hasData : function(){
      //return true;
      return this.get('root').children && this.get('root').children.length !== 0;
    },
    /**
     * \u662f\u5426\u5df2\u7ecf\u52a0\u8f7d\u8fc7\uff0c\u53f6\u5b50\u8282\u70b9\u6216\u8005\u5b58\u5728\u5b57\u8282\u70b9\u7684\u8282\u70b9
     * @param   {BUI.Data.Node} node \u8282\u70b9
     * @return {Boolean}  \u662f\u5426\u52a0\u8f7d\u8fc7
     */
    isLoaded : function(node){
      var root = this.get('root');
      if(node == root && !root.children){
        return false;
      }
      if(!this.get('url') && !this.get('pidField')){ //\u5982\u679c\u4e0d\u4ece\u8fdc\u7a0b\u52a0\u8f7d\u6570\u636e,\u9ed8\u8ba4\u5df2\u7ecf\u52a0\u8f7d
        return true;
      }
      
      return node.loaded || node.leaf || (node.children && node.children.length);
    },
    /**
     * \u52a0\u8f7d\u8282\u70b9\u7684\u5b50\u8282\u70b9
     * @param  {BUI.Data.Node} node \u8282\u70b9
     */
    loadNode : function(node){
      var _self = this,
        pidField = _self.get('pidField'),
        params;
      //\u5982\u679c\u5df2\u7ecf\u52a0\u8f7d\u8fc7\uff0c\u6216\u8005\u8282\u70b9\u662f\u53f6\u5b50\u8282\u70b9
      if(_self.isLoaded(node)){
        return ;
      }
      params = {id : node.id};
      if(pidField){
        params[pidField] = node.id;
      }
      _self.load(params);  
    },
    /**
     * \u91cd\u65b0\u52a0\u8f7d\u8282\u70b9
     * @param  {BUI.Data.Node} node node\u8282\u70b9
     */
    reloadNode : function(node){
      var _self = this;
      node = node || _self.get('root');
      node.loaded = false;
      //node.children = [];
      _self.loadNode(node);
    },
    /**
     * \u52a0\u8f7d\u8282\u70b9\uff0c\u6839\u636epath
     * @param  {String} path \u52a0\u8f7d\u8def\u5f84
     * @ignore
     */
    loadPath : function(path){
      var _self = this,
        arr = path.split(','),
        id = arr[0];
      if(_self.findNodeByPath(path)){ //\u52a0\u8f7d\u8fc7
        return;
      }
      _self.load({id : id,path : path});
    }
  });

  return TreeStore;

});
define('bui/data/store',['bui/data/proxy','bui/data/abstractstore','bui/data/sortable'],function(require) {
  
  var Proxy = require('bui/data/proxy'),
    AbstractStore = require('bui/data/abstractstore'),
    Sortable = require('bui/data/sortable');

  //\u79fb\u9664\u6570\u636e
  function removeAt(index,array){
    if(index < 0){
      return;
    }
    var records = array,
      record = records[index];
    records.splice(index,1);
    return record;
  }

  function removeFrom(record,array){
    var index = BUI.Array.indexOf(record,array);   
    if(index >= 0){
      removeAt(index,array);
    }
  }

  function contains(record,array){
    return BUI.Array.indexOf(record,array) !== -1;
  }
  /**
   * \u7528\u4e8e\u52a0\u8f7d\u6570\u636e\uff0c\u7f13\u51b2\u6570\u636e\u7684\u7c7b
   * <p>
   * <img src="../assets/img/class-data.jpg"/>
   * </p>
   * ** \u7f13\u5b58\u9759\u6001\u6570\u636e ** 
   * <pre><code>
   *  var store = new Store({
   *    data : [{},{}]
   *  });
   * </code></pre>
   * ** \u5f02\u6b65\u52a0\u8f7d\u6570\u636e **
   * <pre><code>
   *  var store = new Store({
   *    url : 'data.json',
   *    autoLoad : true,
   *    params : {id : '123'},
   *    sortInfo : {
   *      field : 'id',
   *      direction : 'ASC' //ASC,DESC
   *    }
   *  });
   * </code></pre>
   * 
   * @class BUI.Data.Store
   * @extends BUI.Data.AbstractStore
   * @mixins BUI.Data.Sortable
   */
  var store = function(config){
    store.superclass.constructor.call(this,config);
    //this._init();
  };

  store.ATTRS = 
  /**
   * @lends BUI.Data.Store#
   * @ignore
   */
  {
    /**
     * \u5f53\u524d\u9875\u7801
     * @cfg {Number} [currentPage=0]
     * @ignore
     */
    /**
     * \u5f53\u524d\u9875\u7801
     * @type {Number}
     * @ignore
     * @readOnly
     */
    currentPage:{
      value : 0
    },
    
    /**
     * \u5220\u9664\u6389\u7684\u7eaa\u5f55
     * @readOnly
     * @private
     * @type {Array}
     */
    deletedRecords : {
      value:[]
    },
    /**
     * \u9519\u8bef\u5b57\u6bb5,\u5305\u542b\u5728\u8fd4\u56de\u4fe1\u606f\u4e2d\u8868\u793a\u9519\u8bef\u4fe1\u606f\u7684\u5b57\u6bb5
     * <pre><code>
     *   //\u53ef\u4ee5\u4fee\u6539\u63a5\u6536\u7684\u540e\u53f0\u53c2\u6570\u7684\u542b\u4e49
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //\u5b58\u653e\u9519\u8bef\u4fe1\u606f\u7684\u5b57\u6bb5(error)
     *     hasErrorProperty : 'isError', //\u662f\u5426\u9519\u8bef\u7684\u5b57\u6bb5\uff08hasError)
     *     root : 'data',               //\u5b58\u653e\u6570\u636e\u7684\u5b57\u6bb5\u540d(rows)
     *     totalProperty : 'total'     //\u5b58\u653e\u8bb0\u5f55\u603b\u6570\u7684\u5b57\u6bb5\u540d(results)
     *   });
     * </code></pre>
     * @cfg {String} [errorProperty='error']
     */
    /**
     * \u9519\u8bef\u5b57\u6bb5
     * @type {String}
     * @ignore
     */
    errorProperty : {
      value : 'error'
    },
    /**
     * \u662f\u5426\u5b58\u5728\u9519\u8bef,\u52a0\u8f7d\u6570\u636e\u65f6\u5982\u679c\u8fd4\u56de\u9519\u8bef\uff0c\u6b64\u5b57\u6bb5\u8868\u793a\u6709\u9519\u8bef\u53d1\u751f
     * <pre><code>
     *   //\u53ef\u4ee5\u4fee\u6539\u63a5\u6536\u7684\u540e\u53f0\u53c2\u6570\u7684\u542b\u4e49
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //\u5b58\u653e\u9519\u8bef\u4fe1\u606f\u7684\u5b57\u6bb5(error)
     *     hasErrorProperty : 'isError', //\u662f\u5426\u9519\u8bef\u7684\u5b57\u6bb5\uff08hasError)
     *     root : 'data',               //\u5b58\u653e\u6570\u636e\u7684\u5b57\u6bb5\u540d(rows)
     *     totalProperty : 'total'     //\u5b58\u653e\u8bb0\u5f55\u603b\u6570\u7684\u5b57\u6bb5\u540d(results)
     *   });
     * </code></pre>
     * @cfg {String} [hasErrorProperty='hasError']
     */
    /**
     * \u662f\u5426\u5b58\u5728\u9519\u8bef
     * @type {String}
     * @default 'hasError'
     * @ignore
     */
    hasErrorProperty : {
      value : 'hasError'
    },

    /**
     * \u5bf9\u6bd42\u4e2a\u5bf9\u8c61\u662f\u5426\u76f8\u5f53\uff0c\u5728\u53bb\u91cd\u3001\u66f4\u65b0\u3001\u5220\u9664\uff0c\u67e5\u627e\u6570\u636e\u65f6\u4f7f\u7528\u6b64\u51fd\u6570
     * @default  
     * function(obj1,obj2){
     *   return obj1 == obj2;
     * }
     * @type {Object}
     * @example
     * function(obj1 ,obj2){
     *   //\u5982\u679cid\u76f8\u7b49\uff0c\u5c31\u8ba4\u4e3a2\u4e2a\u6570\u636e\u76f8\u7b49\uff0c\u53ef\u4ee5\u5728\u6dfb\u52a0\u5bf9\u8c61\u65f6\u53bb\u91cd
     *   //\u66f4\u65b0\u5bf9\u8c61\u65f6\uff0c\u4ec5\u63d0\u4f9b\u6539\u53d8\u7684\u5b57\u6bb5
     *   return obj1.id == obj2.id;
     * }
     * 
     */
    matchFunction : {
      value : function(obj1,obj2){
        return obj1 == obj2;
      }
    },
    /**
     * \u66f4\u6539\u7684\u7eaa\u5f55\u96c6\u5408
     * @type {Array}
     * @private
     * @readOnly
     */
    modifiedRecords : {
      value:[]
    },
    /**
     * \u65b0\u6dfb\u52a0\u7684\u7eaa\u5f55\u96c6\u5408\uff0c\u53ea\u8bfb
     * @type {Array}
     * @private
     * @readOnly
     */
    newRecords : {
      value : []
    },
    /**
     * \u662f\u5426\u8fdc\u7a0b\u6392\u5e8f\uff0c\u9ed8\u8ba4\u72b6\u6001\u4e0b\u5185\u5b58\u6392\u5e8f
     *   - \u7531\u4e8e\u5f53\u524dStore\u5b58\u50a8\u7684\u4e0d\u4e00\u5b9a\u662f\u6570\u636e\u6e90\u7684\u5168\u96c6\uff0c\u6240\u4ee5\u6b64\u914d\u7f6e\u9879\u9700\u8981\u91cd\u65b0\u8bfb\u53d6\u6570\u636e
     *   - \u5728\u5206\u9875\u72b6\u6001\u4e0b\uff0c\u8fdb\u884c\u8fdc\u7a0b\u6392\u5e8f\uff0c\u4f1a\u8fdb\u884c\u5168\u96c6\u6570\u636e\u7684\u6392\u5e8f\uff0c\u5e76\u8fd4\u56de\u9996\u9875\u7684\u6570\u636e
     *   - remoteSort\u4e3a false\u7684\u60c5\u51b5\u4e0b\uff0c\u4ec5\u5bf9\u5f53\u524d\u9875\u7684\u6570\u636e\u8fdb\u884c\u6392\u5e8f
     * @cfg {Boolean} [remoteSort=false]
     */
    remoteSort : {
      value : false
    },
    /**
     * \u7f13\u5b58\u7684\u6570\u636e\uff0c\u5305\u542b\u4ee5\u4e0b\u51e0\u4e2a\u5b57\u6bb5
     * <ol>
     * <li>rows: \u6570\u636e\u96c6\u5408</li>
     * <li>results: \u603b\u7684\u6570\u636e\u6761\u6570</li>
     * </ol>
     * @type {Object}
     * @private
     * @readOnly
     */
    resultMap : {
      value : {}
    },
    /**
     * \u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u8fd4\u56de\u6570\u636e\u7684\u6839\u76ee\u5f55
     * @cfg {String} [root='rows']
     * <pre><code>
     *    //\u9ed8\u8ba4\u8fd4\u56de\u6570\u636e\u7c7b\u578b\uff1a
     *    '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
     *   //\u53ef\u4ee5\u4fee\u6539\u63a5\u6536\u7684\u540e\u53f0\u53c2\u6570\u7684\u542b\u4e49
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //\u5b58\u653e\u9519\u8bef\u4fe1\u606f\u7684\u5b57\u6bb5(error)
     *     hasErrorProperty : 'isError', //\u662f\u5426\u9519\u8bef\u7684\u5b57\u6bb5\uff08hasError)
     *     root : 'data',               //\u5b58\u653e\u6570\u636e\u7684\u5b57\u6bb5\u540d(rows)
     *     totalProperty : 'total'     //\u5b58\u653e\u8bb0\u5f55\u603b\u6570\u7684\u5b57\u6bb5\u540d(results)
     *   });
     * </code></pre>
     *   
     */
    root: { value : 'rows'}, 

    /**
     * \u5f53\u524dStore\u7f13\u5b58\u7684\u6570\u636e\u6761\u6570
     * @type {Number}
     * @private
     * @readOnly
     */
    rowCount :{
      value : 0
    },
    /**
     * \u52a0\u8f7d\u6570\u636e\u65f6\uff0c\u8fd4\u56de\u8bb0\u5f55\u7684\u603b\u6570\u7684\u5b57\u6bb5\uff0c\u7528\u4e8e\u5206\u9875
     * @cfg {String} [totalProperty='results']
     *<pre><code>
     *    //\u9ed8\u8ba4\u8fd4\u56de\u6570\u636e\u7c7b\u578b\uff1a
     *    '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
     *   //\u53ef\u4ee5\u4fee\u6539\u63a5\u6536\u7684\u540e\u53f0\u53c2\u6570\u7684\u542b\u4e49
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //\u5b58\u653e\u9519\u8bef\u4fe1\u606f\u7684\u5b57\u6bb5(error)
     *     hasErrorProperty : 'isError', //\u662f\u5426\u9519\u8bef\u7684\u5b57\u6bb5\uff08hasError)
     *     root : 'data',               //\u5b58\u653e\u6570\u636e\u7684\u5b57\u6bb5\u540d(rows)
     *     totalProperty : 'total'     //\u5b58\u653e\u8bb0\u5f55\u603b\u6570\u7684\u5b57\u6bb5\u540d(results)
     *   });
     * </code></pre>
     */
    totalProperty: {value :'results'}, 

    /**
     * \u52a0\u8f7d\u6570\u636e\u7684\u8d77\u59cb\u4f4d\u7f6e
     * <pre><code>
     *  //\u521d\u59cb\u5316\u65f6\uff0c\u53ef\u4ee5\u5728params\u4e2d\u914d\u7f6e
     *  var store = new Store({
     *    url : 'data.json',
     *    params : {
     *      start : 100
     *    }
     *  });
     * </code></pre>
     * @type {Object}
     */
    start:{
      value : 0
    },
    /**
     * \u6bcf\u9875\u591a\u5c11\u6761\u8bb0\u5f55,\u9ed8\u8ba4\u4e3anull,\u6b64\u65f6\u4e0d\u5206\u9875\uff0c\u5f53\u6307\u5b9a\u4e86\u6b64\u503c\u65f6\u5206\u9875
     * <pre><code>
     *  //\u5f53\u8bf7\u6c42\u7684\u6570\u636e\u5206\u9875\u65f6
     *  var store = new Store({
     *    url : 'data.json',
     *    pageSize : 30
     *  });
     * </code></pre>
     * @cfg {Number} pageSize
     */
    pageSize : {

    }
  };
  BUI.extend(store,AbstractStore);

  BUI.mixin(store,[Sortable]);

  BUI.augment(store,
  /**
   * @lends BUI.Data.Store.prototype
   * @ignore
   */
  {
    /**
    * \u6dfb\u52a0\u8bb0\u5f55,\u9ed8\u8ba4\u6dfb\u52a0\u5728\u540e\u9762
    * <pre><code>
    *  //\u6dfb\u52a0\u8bb0\u5f55
    *  store.add({id : '2',text: 'new data'});
    *  //\u662f\u5426\u53bb\u91cd\uff0c\u91cd\u590d\u6570\u636e\u4e0d\u80fd\u6dfb\u52a0
    *  store.add(obj,true); //\u4e0d\u80fd\u6dfb\u52a0\u91cd\u590d\u6570\u636e\uff0c\u6b64\u65f6\u7528obj1 === obj2\u5224\u65ad
    *  //\u4f7f\u7528\u5339\u914d\u51fd\u53bb\u91cd
    *  store.add(obj,true,function(obj1,obj2){
    *    return obj1.id == obj2.id;
    *  });
    *  
    * </code></pre>
    * @param {Array|Object} data \u6dfb\u52a0\u7684\u6570\u636e\uff0c\u53ef\u4ee5\u662f\u6570\u7ec4\uff0c\u53ef\u4ee5\u662f\u5355\u6761\u8bb0\u5f55
    * @param {Boolean} [noRepeat = false] \u662f\u5426\u53bb\u91cd,\u53ef\u4ee5\u4e3a\u7a7a\uff0c\u9ed8\u8ba4\uff1a false 
    * @param {Function} [match] \u5339\u914d\u51fd\u6570\uff0c\u53ef\u4ee5\u4e3a\u7a7a\uff0c
    * @default \u914d\u7f6e\u9879\u4e2d matchFunction \u5c5e\u6027\u4f20\u5165\u7684\u51fd\u6570\uff0c\u9ed8\u8ba4\u662f\uff1a<br>
    *  function(obj1,obj2){
    *    return obj1 == obj2;
    *  }
    * 
    */
    add :function(data,noRepeat,match){
      var _self = this,
        count = _self.getCount();
      _self.addAt(data,count,noRepeat,match)
    },
    /**
    * \u6dfb\u52a0\u8bb0\u5f55,\u6307\u5b9a\u7d22\u5f15\u503c
    * <pre><code>
    *  //\u4f7f\u7528\u65b9\u5f0f\u8ddf\u7c7b\u4f3c\u4e8eadd,\u589e\u52a0\u4e86index\u53c2\u6570
    *  store.add(obj,0);//\u6dfb\u52a0\u5728\u6700\u524d\u9762
    * </code></pre>
    * @param {Array|Object} data \u6dfb\u52a0\u7684\u6570\u636e\uff0c\u53ef\u4ee5\u662f\u6570\u7ec4\uff0c\u53ef\u4ee5\u662f\u5355\u6761\u8bb0\u5f55
    * @param {Number} index \u5f00\u59cb\u6dfb\u52a0\u6570\u636e\u7684\u4f4d\u7f6e
    * @param {Boolean} [noRepeat = false] \u662f\u5426\u53bb\u91cd,\u53ef\u4ee5\u4e3a\u7a7a\uff0c\u9ed8\u8ba4\uff1a false 
    * @param {Function} [match] \u5339\u914d\u51fd\u6570\uff0c\u53ef\u4ee5\u4e3a\u7a7a\uff0c
     */
    addAt : function(data,index,noRepeat,match){
      var _self = this;

      match = match || _self._getDefaultMatch();
      if(!BUI.isArray(data)){
        data = [data];
      }

      $.each(data,function(pos,element){
        if(!noRepeat || !_self.contains(element,match)){
          _self._addRecord(element,pos + index);

          _self.get('newRecords').push(element);

          removeFrom(element,_self.get('deletedRecords'));
          removeFrom(element,_self.get('modifiedRecords'));
        }
      });
    },
    /**
    * \u9a8c\u8bc1\u662f\u5426\u5b58\u5728\u6307\u5b9a\u8bb0\u5f55
    * <pre><code>
    *  store.contains(obj); //\u662f\u5426\u5305\u542b\u6307\u5b9a\u7684\u8bb0\u5f55
    *
    *  store.contains(obj,function(obj1,obj2){ //\u4f7f\u7528\u5339\u914d\u51fd\u6570
    *    return obj1.id == obj2.id;
    *  });
    * </code></pre>
    * @param {Object} record \u6307\u5b9a\u7684\u8bb0\u5f55
    * @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] \u9ed8\u8ba4\u4e3a\u6bd4\u8f832\u4e2a\u5bf9\u8c61\u662f\u5426\u76f8\u540c
    * @return {Boolean}
    */
    contains :function(record,match){
      return this.findIndexBy(record,match)!==-1;
    },
    /**
    * \u67e5\u627e\u8bb0\u5f55\uff0c\u4ec5\u8fd4\u56de\u7b2c\u4e00\u6761
    * <pre><code>
    *  var record = store.find('id','123');
    * </code></pre>
    * @param {String} field \u5b57\u6bb5\u540d
    * @param {String} value \u5b57\u6bb5\u503c
    * @return {Object|null}
    */
    find : function(field,value){
      var _self = this,
        result = null,
        records = _self.getResult();
      $.each(records,function(index,record){
        if(record[field] === value){
          result = record;
          return false;
        }
      });
      return result;
    },
    /**
    * \u67e5\u627e\u8bb0\u5f55\uff0c\u8fd4\u56de\u6240\u6709\u7b26\u5408\u67e5\u8be2\u6761\u4ef6\u7684\u8bb0\u5f55
    * <pre><code>
    *   var records = store.findAll('type','0');
    * </code></pre>
    * @param {String} field \u5b57\u6bb5\u540d
    * @param {String} value \u5b57\u6bb5\u503c
    * @return {Array}
    */
    findAll : function(field,value){
      var _self = this,
        result = [],
        records = _self.getResult();
      $.each(records,function(index,record){
        if(record[field] === value){
          result.push(record);
        }
      });
      return result;
    },
    /**
    * \u6839\u636e\u7d22\u5f15\u67e5\u627e\u8bb0\u5f55
    * <pre><code>
    *  var record = store.findByIndex(1);
    * </code></pre>
    * @param {Number} index \u7d22\u5f15
    * @return {Object} \u67e5\u627e\u7684\u8bb0\u5f55
    */
    findByIndex : function(index){
      return this.getResult()[index];
    },
    /**
    * \u67e5\u627e\u6570\u636e\u6240\u5728\u7684\u7d22\u5f15\u4f4d\u7f6e,\u82e5\u4e0d\u5b58\u5728\u8fd4\u56de-1
    * <pre><code>
    *  var index = store.findIndexBy(obj);
    *
    *  var index = store.findIndexBy(obj,function(obj1,obj2){
    *    return obj1.id == obj2.id;
    *  });
    * </code></pre>
    * @param {Object} target \u6307\u5b9a\u7684\u8bb0\u5f55
    * @param {Function} [match = matchFunction] @see {BUI.Data.Store#matchFunction}\u9ed8\u8ba4\u4e3a\u6bd4\u8f832\u4e2a\u5bf9\u8c61\u662f\u5426\u76f8\u540c
    * @return {Number}
    */
    findIndexBy :function(target,match){
      var _self = this,
        position = -1,
        records = _self.getResult();
      match = match || _self._getDefaultMatch();
      if(target === null || target === undefined){
        return -1;
      }
      $.each(records,function(index,record){
        if(match(target,record)){
          position = index;
          return false;
        }
      });
      return position;
    },
    /**
    * \u83b7\u53d6\u4e0b\u4e00\u6761\u8bb0\u5f55
    * <pre><code>
    *  var record = store.findNextRecord(obj);
    * </code></pre>
    * @param {Object} record \u5f53\u524d\u8bb0\u5f55
    * @return {Object} \u4e0b\u4e00\u6761\u8bb0\u5f55
    */
    findNextRecord : function(record){
      var _self = this,
        index = _self.findIndexBy(record);
      if(index >= 0){
        return _self.findByIndex(index + 1);
      }
      return;
    },

    /**
     * \u83b7\u53d6\u7f13\u5b58\u7684\u8bb0\u5f55\u6570
     * <pre><code>
     *  var count = store.getCount(); //\u7f13\u5b58\u7684\u6570\u636e\u6570\u91cf
     *
     *  var totalCount = store.getTotalCount(); //\u6570\u636e\u7684\u603b\u6570\uff0c\u5982\u679c\u6709\u5206\u9875\u65f6\uff0ctotalCount != count
     * </code></pre>
     * @return {Number} \u8bb0\u5f55\u6570
     */
    getCount : function(){
      return this.getResult().length;
    },
    /**
     * \u83b7\u53d6\u6570\u636e\u6e90\u7684\u6570\u636e\u603b\u6570\uff0c\u5206\u9875\u65f6\uff0c\u5f53\u524d\u4ec5\u7f13\u5b58\u5f53\u524d\u9875\u6570\u636e
     * <pre><code>
     *  var count = store.getCount(); //\u7f13\u5b58\u7684\u6570\u636e\u6570\u91cf
     *
     *  var totalCount = store.getTotalCount(); //\u6570\u636e\u7684\u603b\u6570\uff0c\u5982\u679c\u6709\u5206\u9875\u65f6\uff0ctotalCount != count
     * </code></pre>
     * @return {Number} \u8bb0\u5f55\u7684\u603b\u6570
     */
    getTotalCount : function(){
      var _self = this,
        resultMap = _self.get('resultMap'),
        total = _self.get('totalProperty');
      return resultMap[total] || 0;
    },
    /**
     * \u83b7\u53d6\u5f53\u524d\u7f13\u5b58\u7684\u7eaa\u5f55
     * <pre><code>
     *   var records = store.getResult();
     * </code></pre>
     * @return {Array} \u7eaa\u5f55\u96c6\u5408
     */
    getResult : function(){
      var _self = this,
        resultMap = _self.get('resultMap'),
        root = _self.get('root');
      return resultMap[root];
    },
    /**
     * \u662f\u5426\u5305\u542b\u6570\u636e
     * @return {Boolean} 
     */
    hasData : function(){
      return this.getCount() !== 0;
    },
    /**
     * \u8bbe\u7f6e\u6570\u636e\u6e90,\u975e\u5f02\u6b65\u52a0\u8f7d\u65f6\uff0c\u8bbe\u7f6e\u7f13\u5b58\u7684\u6570\u636e
     * <pre><code>
     *   store.setResult([]); //\u6e05\u7a7a\u6570\u636e
     *
     *   var data = [{},{}];
     *   store.setResult(data); //\u91cd\u8bbe\u6570\u636e
     * </code></pre>
     */
    setResult : function(data){
      var _self = this,
        proxy = _self.get('proxy');
      if(proxy instanceof Proxy.Memery){
        _self.set('data',data);
        _self.load({start:0});
      }else{
        _self._setResult(data);
      }
    },

    /**
    * \u5220\u9664\u4e00\u6761\u6216\u591a\u6761\u8bb0\u5f55\u89e6\u53d1 remove \u4e8b\u4ef6.
    * <pre><code>
    *  store.remove(obj);  //\u5220\u9664\u4e00\u6761\u8bb0\u5f55
    *
    *  store.remove([obj1,obj2...]); //\u5220\u9664\u591a\u4e2a\u6761\u8bb0\u5f55
    *
    *  store.remvoe(obj,funciton(obj1,obj2){ //\u4f7f\u7528\u5339\u914d\u51fd\u6570
    *    return obj1.id == obj2.id;
    *  });
    * </code></pre>
    * @param {Array|Object} data \u6dfb\u52a0\u7684\u6570\u636e\uff0c\u53ef\u4ee5\u662f\u6570\u7ec4\uff0c\u53ef\u4ee5\u662f\u5355\u6761\u8bb0\u5f55
    * @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] \u5339\u914d\u51fd\u6570\uff0c\u53ef\u4ee5\u4e3a\u7a7a
    */
    remove :function(data,match){
      var _self =this,
        delData=[];
      match = match || _self._getDefaultMatch();
      if(!BUI.isArray(data)){
        data = [data];
      }
      $.each(data,function(index,element){
        var index = _self.findIndexBy(element,match),
            record = removeAt(index,_self.getResult());
        //\u6dfb\u52a0\u5230\u5df2\u5220\u9664\u961f\u5217\u4e2d,\u5982\u679c\u662f\u65b0\u6dfb\u52a0\u7684\u6570\u636e\uff0c\u4e0d\u8ba1\u5165\u5220\u9664\u7684\u6570\u636e\u96c6\u5408\u4e2d
        if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('deletedRecords'))){
          _self.get('deletedRecords').push(record);
        }
        removeFrom(record,_self.get('newRecords'));
        removeFrom(record,_self.get('modifiedRecords'));
        _self.fire('remove',{record:record});
      }); 
    },
    /**
     * \u6392\u5e8f\uff0c\u5982\u679cremoteSort = true,\u53d1\u9001\u8bf7\u6c42\uff0c\u540e\u7aef\u6392\u5e8f
     * <pre><code>
     *   store.sort('id','DESC'); //\u4ee5id\u4e3a\u6392\u5e8f\u5b57\u6bb5\uff0c\u5012\u5e8f\u6392\u5e8f
     * </code></pre>
     * @param  {String} field     \u6392\u5e8f\u5b57\u6bb5
     * @param  {String} direction \u6392\u5e8f\u65b9\u5411
     */
    sort : function(field,direction){
      var _self = this,
        remoteSort = _self.get('remoteSort');

      if(!remoteSort){
        _self._localSort(field,direction);
      }else{
        _self.set('sortField',field);
        _self.set('sortDirection',direction);
        _self.load(_self.get('sortInfo'));
      }
    },
    /**
     * \u8ba1\u7b97\u6307\u5b9a\u5b57\u6bb5\u7684\u548c
     * <pre><code>
     *   var sum = store.sum('number');
     * </code></pre>
     * @param  {String} field \u5b57\u6bb5\u540d
     * @param  {Array} [data] \u8ba1\u7b97\u7684\u96c6\u5408\uff0c\u9ed8\u8ba4\u4e3aStore\u4e2d\u7684\u6570\u636e\u96c6\u5408
     * @return {Number} \u6c47\u603b\u548c
     */
    sum : function(field,data){
      var  _self = this,
        records = data || _self.getResult(),
        sum = 0;
      BUI.each(records,function(record){
        var val = record[field];
        if(!isNaN(val)){
          sum += parseFloat(val);
        }
      });
      return sum;
    },
    /**
    * \u8bbe\u7f6e\u8bb0\u5f55\u7684\u503c \uff0c\u89e6\u53d1 update \u4e8b\u4ef6
    * <pre><code>
    *  store.setValue(obj,'value','new value');
    * </code></pre>
    * @param {Object} obj \u4fee\u6539\u7684\u8bb0\u5f55
    * @param {String} field \u4fee\u6539\u7684\u5b57\u6bb5\u540d
    * @param {Object} value \u4fee\u6539\u7684\u503c
    */
    setValue : function(obj,field,value){
      var record = obj,
        _self = this;

      record[field]=value;
      if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('modifiedRecords'))){
          _self.get('modifiedRecords').push(record);
      }
      _self.fire('update',{record:record,field:field,value:value});
    },
    /**
    * \u66f4\u65b0\u8bb0\u5f55 \uff0c\u89e6\u53d1 update\u4e8b\u4ef6
    * <pre><code>
    *   var record = store.find('id','12');
    *   record.value = 'new value';
    *   record.text = 'new text';
    *   store.update(record); //\u89e6\u53d1update\u4e8b\u4ef6\uff0c\u5f15\u8d77\u7ed1\u5b9a\u4e86store\u7684\u63a7\u4ef6\u66f4\u65b0
    * </code></pre>
    * @param {Object} obj \u4fee\u6539\u7684\u8bb0\u5f55
    * @param {Boolean} [isMatch = false] \u662f\u5426\u9700\u8981\u8fdb\u884c\u5339\u914d\uff0c\u68c0\u6d4b\u6307\u5b9a\u7684\u8bb0\u5f55\u662f\u5426\u5728\u96c6\u5408\u4e2d
    * @param {Function} [match = matchFunction] \u5339\u914d\u51fd\u6570
    */
    update : function(obj,isMatch,match){
      var record = obj,
        _self = this,
        match = null,
        index = null;
      if(isMatch){
        match = match || _self._getDefaultMatch();
        index = _self.findIndexBy(obj,match);
        if(index >=0){
          record = _self.getResult()[index];
        }
      }
      record = BUI.mix(record,obj);
      if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('modifiedRecords'))){
          _self.get('modifiedRecords').push(record);
      }
      _self.fire('update',{record:record});
    },
    //\u6dfb\u52a0\u7eaa\u5f55
    _addRecord :function(record,index){
      var records = this.getResult();
      if(index == undefined){
        index = records.length;
      }
      records.splice(index,0,record);
      this.fire('add',{record:record,index:index});
    },
    //\u6e05\u9664\u6539\u53d8\u7684\u6570\u636e\u8bb0\u5f55
    _clearChanges : function(){
      var _self = this;
      _self.get('newRecords').splice(0);
      _self.get('modifiedRecords').splice(0);
      _self.get('deletedRecords').splice(0);
    },
    /**
     * @protected
     * \u8fc7\u6ee4\u7f13\u5b58\u7684\u6570\u636e
     * @param  {Function} fn \u8fc7\u6ee4\u51fd\u6570
     * @return {Array} \u8fc7\u6ee4\u7ed3\u679c
     */
    _filterLocal : function(fn,data){

      var _self = this,
        rst = [];
      data = data || _self.getResult();
      if(!fn){ //\u6ca1\u6709\u8fc7\u6ee4\u5668\u65f6\u76f4\u63a5\u8fd4\u56de
        return data;
      }
      BUI.each(data,function(record){
        if(fn(record)){
          rst.push(record);
        }
      });
      return rst;
    },
    //\u83b7\u53d6\u9ed8\u8ba4\u7684\u5339\u914d\u51fd\u6570
    _getDefaultMatch :function(){

      return this.get('matchFunction');
    },

    //\u83b7\u53d6\u5206\u9875\u76f8\u5173\u7684\u4fe1\u606f
    _getPageParams : function(){
      var _self = this,
        sortInfo = _self.get('sortInfo'),
        start = _self.get('start'),
        limit = _self.get('pageSize'),
        pageIndex = _self.get('pageIndex') || (limit ? start/limit : 0);

        params = {
          start : start,
          limit : limit,
          pageIndex : pageIndex //\u4e00\u822c\u800c\u8a00\uff0cpageIndex = start/limit
        };

      if(_self.get('remoteSort')){
        BUI.mix(params,sortInfo);
      }

      return params;
    },
     /**
     * \u83b7\u53d6\u9644\u52a0\u7684\u53c2\u6570,\u5206\u9875\u4fe1\u606f\uff0c\u6392\u5e8f\u4fe1\u606f
     * @override
     * @protected
     * @return {Object} \u9644\u52a0\u7684\u53c2\u6570
     */
    getAppendParams : function(){
      return this._getPageParams();
    },
    /**
     * @protected
     * \u521d\u59cb\u5316\u4e4b\u524d
     */
    beforeInit : function(){
      //\u521d\u59cb\u5316\u7ed3\u679c\u96c6
      this._setResult([]);
    },
    //\u672c\u5730\u6392\u5e8f
    _localSort : function(field,direction){
      var _self = this;

      _self._sortData(field,direction);

      _self.fire('localsort',{field:field,direction:direction});
    },
    _sortData : function(field,direction,data){
      var _self = this;
      data = data || _self.getResult();

      _self.sortData(field,direction,data);
    },
    //\u5904\u7406\u6570\u636e
    afterProcessLoad : function(data,params){
      var _self = this,
        root = _self.get('root'),
        start = params.start,
        limit = params.limit,
        totalProperty = _self.get('totalProperty');

      if(BUI.isArray(data)){
        _self._setResult(data);
      }else{
        _self._setResult(data[root],data[totalProperty]);
      }

      _self.set('start',start);

      if(limit){
        _self.set('pageIndex',start/limit);
      }

      //\u5982\u679c\u672c\u5730\u6392\u5e8f,\u5219\u6392\u5e8f
      if(!_self.get('remoteSort')){
        _self._sortData();
      }

      _self.fire('load',{ params : params });
    },
    //\u8bbe\u7f6e\u7ed3\u679c\u96c6
    _setResult : function(rows,totalCount){
      var _self = this,
        resultMap = _self.get('resultMap');

      totalCount = totalCount || rows.length;
      resultMap[_self.get('root')] = rows;
      resultMap[_self.get('totalProperty')] = totalCount;

      //\u6e05\u7406\u4e4b\u524d\u53d1\u751f\u7684\u6539\u53d8
      _self._clearChanges();
    }
  });

  return store;
});