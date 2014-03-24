
define('bui/data/proxy',['bui/data/sortable'],function(require) {

  var Sortable = require('bui/data/sortable');

  /**
   * 数据代理对象，加载数据,
   * 一般不直接使用，在store里面决定使用什么类型的数据代理对象
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

  {
    /**
     * @protected
     * 读取数据的方法，在子类中覆盖
     */
    _read : function(params,callback){

    },
    /**
     * 读数据
     * @param  {Object} params 键值对形式的参数
     * @param {Function} callback 回调函数，函数原型 function(data){}
     * @param {Object} scope 回调函数的上下文
     */
    read : function(params,callback,scope){
      var _self = this;
      scope = scope || _self;

      _self._read(params,function(data){
        callback.call(scope,data);
      });
    },
    /**
     * @protected
     * 保存数据的方法，在子类中覆盖
     */
    _save : function(ype,data,callback){

    },
    /**
     * 保存数据
     * @param {String} type 类型，包括，add,update,remove,all几种类型
     * @param  {Object} saveData 键值对形式的参数
     * @param {Function} callback 回调函数，函数原型 function(data){}
     * @param {Object} scope 回调函数的上下文
     */
    save : function(type,saveData,callback,scope){
      var _self = this;
      scope = scope || _self;
      _self._save(type,saveData,function(data){
        callback.call(scope,data);
      });
    }
  });


  var TYPE_AJAX = {
    READ : 'read',
    ADD : 'add',
    UPDATE : 'update',
    REMOVE : 'remove',
    SAVE_ALL : 'all'
  };
  /**
   * 异步加载数据的代理
   * @class BUI.Data.Proxy.Ajax
   * @extends BUI.Data.Proxy
   */
  var ajaxProxy = function(config){
    ajaxProxy.superclass.constructor.call(this,config);
  };

  ajaxProxy.ATTRS = BUI.mix(true,proxy.ATTRS,
  {
    /**
     * 限制条数
     * @cfg {String} [limitParam='limit'] 
     */
    /**
     * 限制条数
     * @type {String}
     * @default 'limit'
     */
    limitParam : {
      value : 'limit'
    },
    /**
     * 起始纪录代表的字段
     * @cfg {String} [startParam='start']
     */
    /**
     * 起始纪录代表的字段
     * @type {String}
     */
    startParam : {
      value : 'start'
    },
    /**
     * 页码的字段名
     * @cfg {String} [pageIndexParam='pageIndex']
     */
    /**
     * 页码的字段名
     * @type {String}
     * @default 'pageIndex'
     */
    pageIndexParam : {
      value : 'pageIndex'
    },
    /**
     * 保存类型的字段名,如果每种保存类型未设置对应的Url，则附加参数
     * @type {Object}
     */
    saveTypeParam : {
      value : 'saveType'
    },
    /**
     * 保存数据放到的字段名称
     * @type {String}
     */
    saveDataParam : {

    },
    /**
     * 传递到后台，分页开始的页码，默认从0开始
     * @type {Number}
     */
    pageStart : {
      value : 0
    },
    /**
    * 加载数据时，返回的格式,目前只支持"json、jsonp"格式<br>
    * @cfg {String} [dataType='json']
    */
   /**
    * 加载数据时，返回的格式,目前只支持"json、jsonp"格式<br>
    * @type {String}
    * @default "json"
    */
    dataType: {
      value : 'json'
    },
    /**
     * 获取数据的方式,'GET'或者'POST',默认为'GET'
     * @cfg {String} [method='GET']
     */
    /**
     * 获取数据的方式,'GET'或者'POST',默认为'GET'
     * @type {String}
     * @default 'GET'
     */
    method : {
      value : 'GET'
    },
    /**
     * 异步请求的所有自定义参数，开放的其他属性用于快捷使用，如果有特殊参数配置，可以使用这个属性,<br>
     * 不要使用success和error的回调函数，会覆盖默认的处理数据的函数
     * @cfg {Object} ajaxOptions 
     */
    /**
     * 异步请求的所有自定义参数
     * @type {Object}
     */
    ajaxOptions  : {
      value : {

      }
    },
    /**
     * 是否使用Cache
     * @type {Boolean}
     */
    cache : {
      value : false
    },
    /**
     * 保存数据的配置信息
     * @type {Object}
     */
    save : {

    },
    /**
     * 加载数据的链接
     * @cfg {String} url
     * @required
     */
    /**
     * 加载数据的链接
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
    //获取异步请求的url
    _getUrl : function(type){
      var _self = this,
        save = _self.get('save'),
        url;
      if(type === TYPE_AJAX.READ){ //获取数据，直接返回 url
        return _self.get('url');
      }
      
      //如果不存在保存参数，则返回 url
      if(!save){
        return _self.get('url')
      }

      if(BUI.isString(save)){
        return save;
      }

      url = save[type + 'Url'];
      if(!url){
        url = _self.get('url');
      }

      return url;

    },
    //根据类型附加额外的参数
    _getAppendParams : function(type){
      var _self = this,
        save,
        saveTypeParam,
        rst = null;
      if(type == TYPE_AJAX.READ){
        return rst;
      }
      save = _self.get('save');
      saveTypeParam = _self.get('saveTypeParam');
      if(save && !save[type + 'Url']){
        rst = {};
        rst[saveTypeParam] = type;
      }
      return rst;
    },
    /**
     * @protected
     * @private
     */
    _read : function(params,callback){
      var _self = this,
        cfg;

      params = BUI.cloneObject(params);
      _self._processParams(params);
      cfg = _self._getAjaxOptions(TYPE_AJAX.READ,params);

      _self._ajax(cfg,callback);
    },
    //获取异步请求的选项
    _getAjaxOptions : function(type,params){
      var _self = this,
        ajaxOptions  = _self.get('ajaxOptions'),
        url = _self._getUrl(type),
        cfg;
      BUI.mix(params,_self._getAppendParams(type));
      cfg = BUI.merge({
        url: url,
        type : _self.get('method'),
        dataType: _self.get('dataType'),
        data : params,
        cache : _self.get('cache')
      },ajaxOptions);

      return cfg;
    },
    //异步请求
    _ajax : function(cfg,callback){
      var _self = this,
        success = cfg.success,
        error = cfg.error;
      //复写success
      cfg.success = function(data){
        success && success(data);
        callback(data);
      };
      //复写错误
      cfg.error = function(jqXHR, textStatus, errorThrown){
        error && error(jqXHR, textStatus, errorThrown);
        var result = {
            exception : {
              status : textStatus,
              errorThrown: errorThrown,
              jqXHR : jqXHR
            }
          };
          callback(result);
      }

      $.ajax(cfg);
      
    },
    _save : function(type,data,callback){
      var _self = this,
        cfg;

      cfg = _self._getAjaxOptions(type,data);

      _self._ajax(cfg,callback);
    }

  });

  /**
   * 读取缓存的代理
   * @class BUI.Data.Proxy.Memery
   * @extends BUI.Data.Proxy
   * @mixins BUI.Data.Sortable
   */
  var memeryProxy = function(config){
    memeryProxy.superclass.constructor.call(this,config);
  };
  memeryProxy.ATTRS = {
    /**
     * 匹配的字段名
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

      if(limit){//分页时
        rows = data.slice(start,start + limit);
        callback({rows:rows,results:data.length});
      }else{//不分页时
        rows = data.slice(start);
        callback(rows);
      }
      
    },
    //获取匹配函数
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
    //获取匹配的值
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
    },
    /**
     * @protected
     * 保存修改的数据
     */
    _save : function(type,saveData,callback){
      var _self = this,
        data = _self.get('data');

      if(type == TYPE_AJAX.ADD){
        data.push(saveData);
      }else if(type == TYPE_AJAX.REMOVE){
        BUI.Array.remove(data,saveData);
      }else if(type == TYPE_AJAX.SAVE_ALL){
        BUI.each(saveData.add,function(item){
          data.push(item);
        });

        BUI.each(saveData.remove,function(item){
          BUI.Array.remove(data,item);
        });
      }
    }

  });

  proxy.Ajax = ajaxProxy;
  proxy.Memery = memeryProxy;

  return proxy;


});
