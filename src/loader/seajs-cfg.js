
var loaderPath = seajs.pluginSDK.util.loaderDir;
seajs.config({
  map : [
    ['.js', '-min.js']
  ],
  alias : {
    'bui' : loaderPath
  },
  charset: 'utf-8'
});

var BUI = BUI || {};

BUI.use = seajs.use;

BUI.config = seajs.config;

BUI.setDebug = function (debug) {
  BUI.debug = debug;
  if(debug){
    seajs.config({
      map : [
        ['-min.js', '.js']
      ]
    });
  }else{
    seajs.config({
      map : [
        ['.js', '-min.js']
      ]
    });
  }
}