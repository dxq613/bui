(function(){
  var requires = ['bui/util','bui/ua','bui/json','bui/date','bui/array','bui/keycode','bui/observable','bui/base','bui/component'];
  if(window.KISSY){ //如果是kissy则加载core模块
    requires.unshift('bui/adapter');
  }
  define('bui/common',requires,function(require){
    if(window.KISSY){
      require('bui/adapter');
    }
    var BUI = require('bui/util');

    BUI.mix(BUI,{
      UA : require('bui/ua'),
      JSON : require('bui/json'),
      Date : require('bui/date'),
      Array : require('bui/array'),
      KeyCode : require('bui/keycode'),
      Observable : require('bui/observable'),
      Base : require('bui/base'),
      Component : require('bui/component')
    });
    return BUI;
  });
})();
