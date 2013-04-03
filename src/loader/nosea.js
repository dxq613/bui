//不使用seajs时，模拟seajs的几个方法
//define,use,require

var BUI = BUI || {};
seajs || (function () {
  var toString = Object.prototype.toString;

  function module(id,factory){
    this.id = id;
    this.factory = factory;
    this.isInit = false;
  }

  module.init = function(){
    this.result = this.factory(require);
  }

  window.__module = {};

  function require(id){

  }

  function saveModule(id,factory){
    window.__module[id] = {

    };
  }
  function getModule(id){
    var factory = window.__module[id];
    if(factory){
      return factory();
    }
  }
  window.define = window.define || function(id,factory){
    saveModule(id,factory);
  };

  BUI.use = function(ids,factory){
    if(ids)
  };

})();