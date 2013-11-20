/**
 * @fileOverview  Base UI控件的最基础的类
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */
define('bui/base',['bui/observable'],function(require){

  var INVALID = {},
    Observable = require('bui/observable');

  function ensureNonEmpty(obj, name, create) {
        var ret = obj[name] || {};
        if (create) {
            obj[name] = ret;
        }
        return ret;
  }

  function normalFn(host, method) {
      if (BUI.isString(method)) {
          return host[method];
      }
      return method;
  }

  function __fireAttrChange(self, when, name, prevVal, newVal) {
      var attrName = name;
      return self.fire(when + BUI.ucfirst(name) + 'Change', {
          attrName: attrName,
          prevVal: prevVal,
          newVal: newVal
      });
  }

  function setInternal(self, name, value, opts, attrs) {
      opts = opts || {};

      var ret,
          subVal,
          prevVal;

      prevVal = self.get(name);

      //如果未改变值不进行修改
      if(!$.isPlainObject(value) && !BUI.isArray(value) && prevVal === value){
        return undefined;
      }
      // check before event
      if (!opts['silent']) {
          if (false === __fireAttrChange(self, 'before', name, prevVal, value)) {
              return false;
          }
      }
      // set it
      ret = self._set(name, value, opts);

      if (ret === false) {
          return ret;
      }

      // fire after event
      if (!opts['silent']) {
          value = self.__attrVals[name];
          __fireAttrChange(self, 'after', name, prevVal, value);
      }
      return self;
  }

  function initClassAttrs(c){
    if(c._attrs || c == Base){
      return;
    }

    var superCon = c.superclass.constructor;
    if(superCon && !superCon._attrs){
      initClassAttrs(superCon);
    }
    c._attrs =  {};
    
    BUI.mixAttrs(c._attrs,superCon._attrs);
    BUI.mixAttrs(c._attrs,c.ATTRS);
  }
  /**
   * 基础类，此类提供以下功能
   *  - 提供设置获取属性
   *  - 提供事件支持
   *  - 属性变化时会触发对应的事件
   *  - 将配置项自动转换成属性
   *
   * ** 创建类，继承BUI.Base类 **
   * <pre><code>
   *   var Control = function(cfg){
   *     Control.superclass.constructor.call(this,cfg); //调用BUI.Base的构造方法，将配置项变成属性
   *   };
   *
   *   BUI.extend(Control,BUI.Base);
   * </code></pre>
   *
   * ** 声明默认属性 ** 
   * <pre><code>
   *   Control.ATTRS = {
   *     id : {
   *       value : 'id' //value 是此属性的默认值
   *     },
   *     renderTo : {
   *      
   *     },
   *     el : {
   *       valueFn : function(){                 //第一次调用的时候将renderTo的DOM转换成el属性
   *         return $(this.get('renderTo'));
   *       }
   *     },
   *     text : {
   *       getter : function(){ //getter 用于获取值，而不是设置的值
   *         return this.get('el').val();
   *       },
   *       setter : function(v){ //不仅仅是设置值，可以进行相应的操作
   *         this.get('el').val(v);
   *       }
   *     }
   *   };
   * </code></pre>
   *
   * ** 声明类的方法 ** 
   * <pre><code>
   *   BUI.augment(Control,{
   *     getText : function(){
   *       return this.get('text');   //可以用get方法获取属性值
   *     },
   *     setText : function(txt){
   *       this.set('text',txt);      //使用set 设置属性值
   *     }
   *   });
   * </code></pre>
   *
   * ** 创建对象 ** 
   * <pre><code>
   *   var c = new Control({
   *     id : 'oldId',
   *     text : '测试文本',
   *     renderTo : '#t1'
   *   });
   *
   *   var el = c.get(el); //$(#t1);
   *   el.val(); //text的值 ： '测试文本'
   *   c.set('text','修改的值');
   *   el.val();  //'修改的值'
   *
   *   c.set('id','newId') //会触发2个事件： beforeIdChange,afterIdChange 2个事件 ev.newVal 和ev.prevVal标示新旧值
   * </code></pre>
   * @class BUI.Base
   * @abstract
   * @extends BUI.Observable
   * @param {Object} config 配置项
   */
  var Base = function(config){
    var _self = this,
            c = _self.constructor,
            constructors = [];
        this.__attrs = {};
        this.__attrVals = {};
        Observable.apply(this,arguments);
        // define
        while (c) {
            constructors.push(c);
            if(c.extensions){ //延迟执行mixin
              BUI.mixin(c,c.extensions);
              delete c.extensions;
            }
            //_self.addAttrs(c['ATTRS']);
            c = c.superclass ? c.superclass.constructor : null;
        }
        //以当前对象的属性最终添加到属性中，覆盖之前的属性
        /*for (var i = constructors.length - 1; i >= 0; i--) {
          _self.addAttrs(constructors[i]['ATTRS'],true);
        };*/
      var con = _self.constructor;
      initClassAttrs(con);
      _self._initStaticAttrs(con._attrs);
      _self._initAttrs(config);
  };

  Base.INVALID = INVALID;

  BUI.extend(Base,Observable);

  BUI.augment(Base,
  {
    _initStaticAttrs : function(attrs){
      var _self = this,
        __attrs;

      __attrs = _self.__attrs = {};
      for (var p in attrs) {
        if(attrs.hasOwnProperty(p)){
          var attr = attrs[p];
          /*if(BUI.isObject(attr.value) || BUI.isArray(attr.value) || attr.valueFn){*/
          if(attr.shared === false || attr.valueFn){
            __attrs[p] = {};
            BUI.mixAttr(__attrs[p], attrs[p]); 
          }else{
            __attrs[p] = attrs[p];
          }
        }
      };
    },
    /**
     * 添加属性定义
     * @protected
     * @param {String} name       属性名
     * @param {Object} attrConfig 属性定义
     * @param {Boolean} overrides 是否覆盖字段
     */
    addAttr: function (name, attrConfig,overrides) {
            var _self = this,
                attrs = _self.__attrs,
                attr = attrs[name];
            
            if(!attr){
              attr = attrs[name] = {};
            }
            for (var p in attrConfig) {
              if(attrConfig.hasOwnProperty(p)){
                if(p == 'value'){
                  if(BUI.isObject(attrConfig[p])){
                    attr[p] = attr[p] || {};
                    BUI.mix(/*true,*/attr[p], attrConfig[p]); 
                  }else if(BUI.isArray(attrConfig[p])){
                    attr[p] = attr[p] || [];
                    BUI.mix(/*true,*/attr[p], attrConfig[p]); 
                  }else{
                    attr[p] = attrConfig[p];
                  }
                }else{
                  attr[p] = attrConfig[p];
                }
              }

            };
            return _self;
    },
    /**
     * 添加属性定义
     * @protected
     * @param {Object} attrConfigs  An object with attribute name/configuration pairs.
     * @param {Object} initialValues user defined initial values
     * @param {Boolean} overrides 是否覆盖字段
     */
    addAttrs: function (attrConfigs, initialValues,overrides) {
        var _self = this;
        if(!attrConfigs)
        {
          return _self;
        }
        if(typeof(initialValues) === 'boolean'){
          overrides = initialValues;
          initialValues = null;
        }
        BUI.each(attrConfigs, function (attrConfig, name) {
            _self.addAttr(name, attrConfig,overrides);
        });
        if (initialValues) {
            _self.set(initialValues);
        }
        return _self;
    },
    /**
     * 是否包含此属性
     * @protected
     * @param  {String}  name 值
     * @return {Boolean} 是否包含
     */
    hasAttr : function(name){
      return name && this.__attrs.hasOwnProperty(name);
    },
    /**
     * 获取默认的属性值
     * @protected
     * @return {Object} 属性值的键值对
     */
    getAttrs : function(){
       return this.__attrs;//ensureNonEmpty(this, '__attrs', true);
    },
    /**
     * 获取属性名/属性值键值对
     * @protected
     * @return {Object} 属性对象
     */
    getAttrVals: function(){
      return this.__attrVals; //ensureNonEmpty(this, '__attrVals', true);
    },
    /**
     * 获取属性值，所有的配置项和属性都可以通过get方法获取
     * <pre><code>
     *  var control = new Control({
     *   text : 'control text'
     *  });
     *  control.get('text'); //control text
     *
     *  control.set('customValue','value'); //临时变量
     *  control.get('customValue'); //value
     * </code></pre>
     * ** 属性值/配置项 **
     * <pre><code> 
     *   Control.ATTRS = { //声明属性值
     *     text : {
     *       valueFn : function(){},
     *       value : 'value',
     *       getter : function(v){} 
     *     }
     *   };
     *   var c = new Control({
     *     text : 'text value'
     *   });
     *   //get 函数取的顺序为：是否有修改值（配置项、set)、默认值（第一次调用执行valueFn)，如果有getter，则将值传入getter返回
     *
     *   c.get('text') //text value
     *   c.set('text','new text');//修改值
     *   c.get('text');//new text
     * </code></pre>
     * @param  {String} name 属性名
     * @return {Object} 属性值
     */
    get : function(name){
      var _self = this,
                //declared = _self.hasAttr(name),
                attrVals = _self.__attrVals,
                attrConfig,
                getter, 
                ret;

            attrConfig = ensureNonEmpty(_self.__attrs, name);
            getter = attrConfig['getter'];

            // get user-set value or default value
            //user-set value takes privilege
            ret = name in attrVals ?
                attrVals[name] :
                _self._getDefAttrVal(name);

            // invoke getter for this attribute
            if (getter && (getter = normalFn(_self, getter))) {
                ret = getter.call(_self, ret, name);
            }

            return ret;
    },
  	/**
  	* @清理所有属性值
    * @protected 
  	*/
  	clearAttrVals : function(){
  		this.__attrVals = {};
  	},
    /**
     * 移除属性定义
     * @protected
     */
    removeAttr: function (name) {
        var _self = this;

        if (_self.hasAttr(name)) {
            delete _self.__attrs[name];
            delete _self.__attrVals[name];
        }

        return _self;
    },
    /**
     * 设置属性值，会触发before+Name+Change,和 after+Name+Change事件
     * <pre><code>
     *  control.on('beforeTextChange',function(ev){
     *    var newVal = ev.newVal,
     *      attrName = ev.attrName,
     *      preVal = ev.prevVal;
     *
     *    //TO DO
     *  });
     *  control.set('text','new text');  //此时触发 beforeTextChange,afterTextChange
     *  control.set('text','modify text',{silent : true}); //此时不触发事件
     * </code></pre>
     * @param {String|Object} name  属性名
     * @param {Object} value 值
     * @param {Object} opts 配置项
     * @param {Boolean} opts.silent  配置属性时，是否不触发事件
     */
    set : function(name,value,opts){
      var _self = this;
            if ($.isPlainObject(name)) {
                opts = value;
                var all = Object(name),
                    attrs = [];
                   
                for (name in all) {
                    if (all.hasOwnProperty(name)) {
                        setInternal(_self, name, all[name], opts);
                    }
                }
                return _self;
            }
            return setInternal(_self, name, value, opts);
    },
    /**
     * 设置属性，不触发事件
     * <pre><code>
     *  control.setInternal('text','text');//此时不触发事件
     * </code></pre>
     * @param  {String} name  属性名
     * @param  {Object} value 属性值
     * @return {Boolean|undefined}   如果值无效则返回false,否则返回undefined
     */
    setInternal : function(name, value, opts){
        return this._set(name, value, opts);
    },
    //获取属性默认值
    _getDefAttrVal : function(name){
      var _self = this,
        attrs = _self.__attrs,
              attrConfig = ensureNonEmpty(attrs, name),
              valFn = attrConfig.valueFn,
              val;

          if (valFn && (valFn = normalFn(_self, valFn))) {
              val = valFn.call(_self);
              if (val !== undefined) {
                  attrConfig.value = val;
              }
              delete attrConfig.valueFn;
              attrs[name] = attrConfig;
          }

          return attrConfig.value;
    },
    //仅仅设置属性值
    _set : function(name, value, opts){
      var _self = this,
                setValue,
            // if host does not have meta info corresponding to (name,value)
            // then register on demand in order to collect all data meta info
            // 一定要注册属性元数据，否则其他模块通过 _attrs 不能枚举到所有有效属性
            // 因为属性在声明注册前可以直接设置值
                attrConfig = ensureNonEmpty(_self.__attrs, name, true),
                setter = attrConfig['setter'];

            // if setter has effect
            if (setter && (setter = normalFn(_self, setter))) {
                setValue = setter.call(_self, value, name);
            }

            if (setValue === INVALID) {
                return false;
            }

            if (setValue !== undefined) {
                value = setValue;
            }
            
            // finally set
            _self.__attrVals[name] = value;
      return _self;
    },
    //初始化属性
    _initAttrs : function(config){
      var _self = this;
      if (config) {
              for (var attr in config) {
                  if (config.hasOwnProperty(attr)) {
                      // 用户设置会调用 setter/validator 的，但不会触发属性变化事件
                      _self._set(attr, config[attr]);
                  }

              }
          }
    }
  });

  //BUI.Base = Base;
  return Base;
});