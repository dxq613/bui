/**
 * @fileOverview 加载控件内容
 * @ignore
 */

define('bui/component/loader',['bui/util'],function (require) {
  'use strict';
  var BUI = require('bui/util'),
    Base = require('bui/base'),
    /**
     * @class BUI.Component.Loader
     * @extends BUI.Base
     * ** 控件的默认Loader属性是：**
     * <pre><code>
     *   
     *   defaultLoader : {
     *     value : {
     *       property : 'content',
     *       autoLoad : true
     *     }
     *   }
     * </code></pre>
     * ** 一般的控件默认读取html，作为控件的content值 **
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json'
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     *
     * ** 可以修改Loader的默认属性，加载children **
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/children.json',
     *       property : 'children',
     *       dataType : 'json'
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * 加载控件内容的类，一般不进行实例化
     */
    Loader = function(config){
      Loader.superclass.constructor.call(this,config);
      this._init();
    };

  Loader.ATTRS = {

    /**
     * 加载内容的地址
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json'
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {String} url
     */
    url : {

    },
    /**
     * 对应的控件，加载完成后设置属性到对应的控件
     * @readOnly
     * @type {BUI.Component.Controller}
     */
    target : {

    },
    /**
     * @private
     * 是否load 过
     */
    hasLoad : {
      value : false
    },
    /**
     * 是否自动加载数据
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json',
     *       autoLoad : false
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {Boolean} [autoLoad = true]
     */
    autoLoad : {

    },
    /**
     * 延迟加载
     * 
     *   - event : 触发加载的事件
     *   - repeat ：是否重复加载
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json',
     *       lazyLoad : {
     *         event : 'show',
     *         repeat : true
     *       }
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {Object} [lazyLoad = null]
     */
    lazyLoad: {

    },
    /**
     * 加载返回的数据作为控件的那个属性
     * <pre><code>
     *   var control = new BUI.List.SimpleList({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json',
     *       dataType : 'json',
     *       property : 'items'
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {String} property
     */
    property : {

    },
    /**
     * 格式化返回的数据
     * @cfg {Function} renderer
     */
    renderer : {
      value : function(value){
        return value;
      }
    },
    /**
     * 加载数据时是否显示屏蔽层和加载提示 {@link BUI.Mask.LoadMask}
     * 
     *  -  loadMask : true时使用loadMask 默认的配置信息
     *  -  loadMask : {msg : '正在加载，请稍后。。'} LoadMask的配置信息
     *   <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json',
     *       loadMask : true
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {Boolean|Object} [loadMask = false]
     */
    loadMask : {
      value : false
    },
    /**
     * ajax 请求返回数据的类型
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json',
     *       dataType : 'json',
     *       property : 'items'
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {String} [dataType = 'text']
     */
    dataType : {
      value : 'text'
    },
    /**
     * Ajax请求的配置项,会覆盖 url,dataType数据
     * @cfg {Object} ajaxOptions
     */
    ajaxOptions : {
      //shared : false,
      value : {
        type : 'get',
        cache : false
      }
    },
    /**
     * 初始化的请求参数
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json',
     *       params : {
     *         a : 'a',
     *         b : 'b'
     *       }
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {Object} params
     * @default null
     */
    params : {
        
    },
    /**
     * 附加参数，每次请求都带的参数
     * @cfg {Object} appendParams
     */
    appendParams : {

    },
    /**
     * 最后一次请求的参数
     * @readOnly
     * @private
     * @type {Object}
     */
    lastParams : {
      shared : false,
      value : {}
    },
    /**
     * 加载数据，并添加属性到控件后的回调函数
     *   - data : 加载的数据
     *   - params : 加载的参数
     * <pre><code>
     *   var control = new BUI.Component.Controller({
     *     render : '#c1',
     *     loader : {
     *       url : 'data/text.json',
     *       callback : function(text){
     *         var target = this.get('target');//control
     *         //TO DO
     *       }
     *     }
     *   });
     *
     *   control.render();
     * </code></pre>
     * @cfg {Function} callback
     */
    callback : {

    },
    /**
     * 失败的回调函数
     *   - response : 返回的错误对象
     *   - params : 加载的参数
     * @cfg {Function} failure
     */
    failure : {

    }

  };

  BUI.extend(Loader,Base);

  BUI.augment(Loader,{
    /**
     * @protected
     * 是否是Loader
     * @type {Boolean}
     */
    isLoader : true,
    //初始化
    _init : function(){
      var _self = this,
        autoLoad = _self.get('autoLoad'),
        params = _self.get('params');

      _self._initMask();
      if(autoLoad){
        _self.load(params);
      }else{
        _self._initParams();
        _self._initLazyLoad();
      }
    },
    //初始化延迟加载
    _initLazyLoad : function(){
      var _self = this,
        target = _self.get('target'),
        lazyLoad= _self.get('lazyLoad');

      if(target && lazyLoad && lazyLoad.event){
        target.on(lazyLoad.event,function(){
          if(!_self.get('hasLoad') || lazyLoad.repeat){
            _self.load();
          }
        });
      }
    },
    /**
     * 初始化mask
     * @private
     */
    _initMask : function(){
      var _self = this,
        target = _self.get('target'),
        loadMask = _self.get('loadMask');
      if(target && loadMask){
        BUI.use('bui/mask',function(Mask){
          var cfg = $.isPlainObject(loadMask) ? loadMask : {};
          loadMask = new Mask.LoadMask(BUI.mix({el : target.get('el')},cfg));
          _self.set('loadMask',loadMask);
        });
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
     * 加载内容
     * @param {Object} params 加载数据的参数
     */
    load : function(params){
      var _self = this,
        url = _self.get('url'),
        ajaxOptions = _self.get('ajaxOptions'),
        lastParams = _self.get('lastParams'),
        appendParams = _self.get('appendParams');

      //BUI.mix(true,lastParams,appendParams,params);
      params = params || lastParams;
      params = BUI.merge(appendParams,params); //BUI.cloneObject(lastParams);
      _self.set('lastParams',params);
      //未提供加载地址，阻止加载
      if(!url){
        return;
      }

      _self.onBeforeLoad();
      _self.set('hasLoad',true);
      $.ajax(BUI.mix({
        dataType : _self.get('dataType'),
        data : params,
        url : url,
        success : function(data){
          _self.onload(data,params);
        },
        error : function(jqXHR, textStatus, errorThrown){
          _self.onException({
            jqXHR : jqXHR, 
            textStatus : textStatus, 
            errorThrown : errorThrown
          },params);
        }
      },ajaxOptions));
    },
    /**
     * @private
     * 加载前
     */
    onBeforeLoad : function(){
      var _self = this,
        loadMask = _self.get('loadMask');
      if(loadMask && loadMask.show){
        loadMask.show();
      }
    },
    /**
     * @private
     * 加载完毕
     */
    onload : function(data,params){
      var _self = this,
        loadMask = _self.get('loadMask'),
        property = _self.get('property'),
        callback = _self.get('callback'),
        renderer = _self.get('renderer'),
        target = _self.get('target');

      if(BUI.isString(data)){
        target.set(property,'');//防止2次返回的数据一样
      }
      target.set(property,renderer.call(_self,data));

      /**/
      if(loadMask && loadMask.hide){
        loadMask.hide();
      }
      if(callback){
        callback.call(this,data,params);
      }
    },
    /**
     * @private
     * 加载出错
     */
    onException : function(response,params){
      var _self = this,
        failure = _self.get('failure');
      if(failure){
        failure.call(this,response,params);
      }
    }

  });

  return Loader;
});