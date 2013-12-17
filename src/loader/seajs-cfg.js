;(function(){
  //获取当前路径
  var loaderPath = seajs.pluginSDK ? seajs.pluginSDK.util.loaderDir : seajs.data.base,
    lastIndex = loaderPath.lastIndexOf('/');
  if(lastIndex == loaderPath.length -1){ //去掉最后的 /
    loaderPath = loaderPath.substr(0,lastIndex);
  }
  seajs.config({
    charset: 'utf-8'
  });

  seajs.config({
    paths : {
      'bui' : loaderPath
    }
  });
  var BUI = window.BUI = window.BUI || {};

  //获取bui使用的script标签
  var scripts = document.getElementsByTagName('script'),
    loaderScript = scripts[scripts.length - 1];
  BUI.loaderScript = loaderScript;
  //设置 是否调试
  if(loaderScript.getAttribute('data-debug') == 'true'){
    BUI.debug = true;
  }else{
    BUI.debug = false;
  }

  

  BUI.use = seajs.use;

  BUI.config = function(cfg){
    if(cfg.alias){
      cfg.paths = cfg.alias;
      delete cfg.alias;
    }
    seajs.config(cfg);
  } 

  BUI.setDebug = function (debug) {
    BUI.debug = debug;

    if(debug){
      var map = seajs.data.map,
        index = -1;
      if(map){
        for(var i = 0 ; i < map.length; i++){
          var item = map[i];
          if(item[0].toString() == /.js$/.toString() && item[1] == '-min.js'){
            index = i;
            break;
          }
        }
        if(index != -1){
          map.splice(index,1);
        }
      }      
    }else{
      seajs.config({
        map : [
          [/.js$/, '-min.js']
        ]
      });
    }
  }

  
    BUI.setDebug(BUI.debug);
  

})();


