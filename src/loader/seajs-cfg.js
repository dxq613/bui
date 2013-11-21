
var loaderPath = seajs.pluginSDK ? seajs.pluginSDK.util.loaderDir : seajs.data.base;
seajs.config({
  map : [
    [/.js$/, '-min.js']
  ],
  charset: 'utf-8'
});

  seajs.config({
    paths : {
      'bui' : loaderPath
    }
  });



var BUI = BUI || {};

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
    
  }else{
    seajs.config({
      map : [
        [/.js$/, '-min.js']
      ]
    });
  }
}