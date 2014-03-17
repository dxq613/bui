/**
 * @ignore
 * @fileOverview module
 * @author dxq613
 */

define('bui/module',['bui/common'], function (require) {

  var BUI = require('bui/common');

  var guid = 1;
  function getId(){
    return 'module' + (guid++);
  }
  /**
   * 业务模块
   * @class BUI.Module.Module
   * @extends BUI.Base
   */
  var Module = function(config){
    Module.superclass.constructor.call(this,config);
    if(!this.get('id')){
      this.set('id',getId());
    }
    if(this.get('autoInit')){
      this.init();
    }
    Module.Manager.add(this);
  };

  Module.ATTRS = {
    /**
     * 模块Id，如果未设置，可以自动生成
     * @type {String}
     */
    id : {

    },
    /**
     * 是否直接初始化
     * @type {Boolean}
     */
    autoInit: {
      value: false
    },
    /**
     * 是否初始化
     * @type {Boolean}
     */
    hasInit : {
      value : false
    },
    /**
     * 父模块
     * @type {BUI.Module.Module}
     */
    parent: {
    },
    /**
     * 是否释放
     * @type {Boolean}
     */
    destroyed : {
      value : false
    },
    /**
     * 子模块
     * @type {Object}
     */
    modules :{
      value : {
      },
      shared: false
    },
    events: {
      value: [
        /**
         * 当模块里触发任何事件时会同时触发方该事件
         * @event
         * @param {jQuery.Event} e 事件对像
         * @param {BUI.Module.Module} e.module 触发事件的对像
         * @param {String} e.eventType 触发事件的名称
         * @param {Object} e.event 触发事件时传递的变量
         */
        'change'
      ]
    }
  }

  BUI.extend(Module, BUI.Base);

  BUI.augment(Module,{
    set : function(k,value){
      if(this.setInternal){
        this.setInternal(k,value);
      }
      else{
        Module.superclass.set.call(this, k, value);
      }
    },
    /**
     * @chainable
     * 初始化模块
     * @return {BUI.Module.Module}
     */
    init : function(){
      if(!this.get('hasInit')){
        this._initData();
        this._initDom();
        this._initModules();
        this._initEvent();
        this.set('hasInit',true);
      }     
      return this;
    },
    /**
     * @override
     * 覆盖BUI.Base的的触发事件的方法
     */
    fire : function(eventType, obj, global){
      global = global == undefined ? true : global;
      var args = $.makeArray(arguments),
        module = this,
        event = obj;

      if(obj && obj.module){
        module = obj.module;
        event = obj.event;
      }

      Module.superclass.fire.apply(this, args);

      var parent = this.get('parent');
      if(parent){
        parent.fire('change', {module: module, eventType: eventType, event: event}, false);
      }
      if(global){
        Module.Manager.fire('change',{module : this,eventType: eventType, event : obj});
      }
    },
    // /**
    //  * 添加子模块的缩写
    //  * @param  {Module} module 添加子模块
    //  */
    // add : function(module){
    //   this.addModule(module.get('id'),module);
    // },
    /**
     * 添加子模块
     * @param  {BUI.Module.Module} module 添加子模块
     */
    addModule : function(module){
      module.set('parent', this);
      this.get('modules')[module.get('id')] = module;
    },
    /**
     * 根据id删除模块
     * @param  {String} id 模块编号
     */
    removeById : function(id){
      this.removeModule(this.getModule(id));
    },
    /**
     * 删除模块
     * @param  {BUI.Module.Module} module 模块
     */
    removeModule : function(module){
      delete this.get('modules')[module.get('id')];
    },
    /**
     * 获取模板
     * @param  {String} id 模块编号
     * @return {BUI.Module.Module} 模块
     */
    getModule : function(id){
      return this.get('modules')[id];
    },
    /**
     * 遍历模块
     * @param  {Function} callbak 回调函数，function(module,index)
     */
    eachModule : function(callbak){
      BUI.each(this.getModules(),callbak);
    },
    /**
     * 获取所有的子模块
     * @return {Object} 子模块列表
     */
    getModules : function(){
      return this.get('modules');
    },
    /**
     * 初始化数据
     * @protected
     */
    _initData :function(){

    },
    /**
     * 初始化DOM
     * @protected
     */
    _initDom : function(){

    },
    /**
     * @protected
     * 初始化子模块
     */
    _initModules :function(){

    },
    /**
     * 初始化事件
     * @protected
     */
    _initEvent : function(){

    },
    /**
     * 释放模块
     * @protected
     */
    _destroy : function(){
      var _self = this,
        modules = _self.get('modules');
      BUI.each(modules,function(module){
        module.destroy();
      });
      _self.set("modules", null);
      _self.detach();
    },
    /**
     * 释放模块
     */
    destroy : function(){
      if(!this.get('destroyed')){
        Module.Manager.remove(this);
        this._destroy();
        this.set('destroyed',true);
      }   
    }
  });

  var modulesMap = {};

  /**
   * 模块管理器，所有模块生成后会注册在管理器中
   * @class BUI.Module.Manager
   * @extends BUI.Base
   */
  var ModuleManager = function(){

  };

  BUI.extend(ModuleManager, BUI.Base);

  BUI.augment(ModuleManager,{
    /**
     * 注册模块
     * @param  {BUI.Module.Module} module 模块
     */
    add : function(module){
      var id = module.get('id');      
      modulesMap[id] = module;
    },
    /**
     * 移除注册
     * @param  {BUI.Module.Module} module 模块 
     */
    remove : function(module){
      var id = module.get('id');
      delete modulesMap[id];
    },
    /**
     * 通过编号获取模块
     * @param {String} id 模块
     */
    getModule : function(id){
      return modulesMap[id];
    }
  });

  Module.Manager = new ModuleManager();
  return Module;
});