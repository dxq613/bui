/**
 * Sea.js 2.1.1 | seajs.org/LICENSE.md
 */
(function(global, undefined) {

// Avoid conflicting when `sea.js` is loaded multiple times
if (global.seajs) {
  return
}

var seajs = global.seajs = {
  // The current version of Sea.js being used
  version: "2.1.1"
}

var data = seajs.data = {}

/**
 * util-lang.js - The minimal language enhancement
 */

function isType(type) {
  return function(obj) {
    return Object.prototype.toString.call(obj) === "[object " + type + "]"
  }
}

var isObject = isType("Object")
var isString = isType("String")
var isArray = Array.isArray || isType("Array")
var isFunction = isType("Function")

var _cid = 0
function cid() {
  return _cid++
}


/**
 * util-events.js - The minimal events support
 */

var events = data.events = {}

// Bind event
seajs.on = function(name, callback) {
  var list = events[name] || (events[name] = [])
  list.push(callback)
  return seajs
}

// Remove event. If `callback` is undefined, remove all callbacks for the
// event. If `event` and `callback` are both undefined, remove all callbacks
// for all events
seajs.off = function(name, callback) {
  // Remove *all* events
  if (!(name || callback)) {
    events = data.events = {}
    return seajs
  }

  var list = events[name]
  if (list) {
    if (callback) {
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i] === callback) {
          list.splice(i, 1)
        }
      }
    }
    else {
      delete events[name]
    }
  }

  return seajs
}

// Emit event, firing all bound callbacks. Callbacks receive the same
// arguments as `emit` does, apart from the event name
var emit = seajs.emit = function(name, data) {
  var list = events[name], fn

  if (list) {
    // Copy callback lists to prevent modification
    list = list.slice()

    // Execute event callbacks
    while ((fn = list.shift())) {
      fn(data)
    }
  }

  return seajs
}


/**
 * util-path.js - The utilities for operating path such as id, uri
 */

var DIRNAME_RE = /[^?#]*\//

var DOT_RE = /\/\.\//g
var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//

// Extract the directory portion of a path
// dirname("a/b/c.js?t=123#xx/zz") ==> "a/b/"
// ref: http://jsperf.com/regex-vs-split/2
function dirname(path) {
  return path.match(DIRNAME_RE)[0]
}

// Canonicalize a path
// realpath("http://test.com/a//./b/../c") ==> "http://test.com/a/c"
function realpath(path) {
  // /a/b/./c/./d ==> /a/b/c/d
  path = path.replace(DOT_RE, "/")

  // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
  while (path.match(DOUBLE_DOT_RE)) {
    path = path.replace(DOUBLE_DOT_RE, "/")
  }

  return path
}

// Normalize an id
// normalize("path/to/a") ==> "path/to/a.js"
// NOTICE: substring is faster than negative slice and RegExp
function normalize(path) {
  var last = path.length - 1
  var lastC = path.charAt(last)

  // If the uri ends with `#`, just return it without '#'
  if (lastC === "#") {
    return path.substring(0, last)
  }

  return (path.substring(last - 2) === ".js" ||
      path.indexOf("?") > 0 ||
      path.substring(last - 3) === ".css" ||
      lastC === "/") ? path : path + ".js"
}


var PATHS_RE = /^([^/:]+)(\/.+)$/
var VARS_RE = /{([^{]+)}/g

function parseAlias(id) {
  var alias = data.alias
  return alias && isString(alias[id]) ? alias[id] : id
}

function parsePaths(id) {
  var paths = data.paths
  var m

  if (paths && (m = id.match(PATHS_RE)) && isString(paths[m[1]])) {
    id = paths[m[1]] + m[2]
  }

  return id
}

function parseVars(id) {
  var vars = data.vars

  if (vars && id.indexOf("{") > -1) {
    id = id.replace(VARS_RE, function(m, key) {
      return isString(vars[key]) ? vars[key] : m
    })
  }

  return id
}

function parseMap(uri) {
  var map = data.map
  var ret = uri

  if (map) {
    for (var i = 0, len = map.length; i < len; i++) {
      var rule = map[i]

      ret = isFunction(rule) ?
          (rule(uri) || uri) :
          uri.replace(rule[0], rule[1])

      // Only apply the first matched rule
      if (ret !== uri) break
    }
  }

  return ret
}


var ABSOLUTE_RE = /^\/\/.|:\//
var ROOT_DIR_RE = /^.*?\/\/.*?\//

function addBase(id, refUri) {
  var ret
  var first = id.charAt(0)

  // Absolute
  if (ABSOLUTE_RE.test(id)) {
    ret = id
  }
  // Relative
  else if (first === ".") {
    ret = realpath((refUri ? dirname(refUri) : data.cwd) + id)
  }
  // Root
  else if (first === "/") {
    var m = data.cwd.match(ROOT_DIR_RE)
    ret = m ? m[0] + id.substring(1) : id
  }
  // Top-level
  else {
    ret = data.base + id
  }

  return ret
}

function id2Uri(id, refUri) {
  if (!id) return ""

  id = parseAlias(id)
  id = parsePaths(id)
  id = parseVars(id)
  id = normalize(id)

  var uri = addBase(id, refUri)
  uri = parseMap(uri)

  return uri
}


var doc = document
var loc = location
var cwd = dirname(loc.href)
var scripts = doc.getElementsByTagName("script")

// Recommend to add `seajsnode` id for the `sea.js` script element
var loaderScript = doc.getElementById("seajsnode") ||
    scripts[scripts.length - 1]

// When `sea.js` is inline, set loaderDir to current working directory
var loaderDir = dirname(getScriptAbsoluteSrc(loaderScript) || cwd)

function getScriptAbsoluteSrc(node) {
  return node.hasAttribute ? // non-IE6/7
      node.src :
    // see http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
      node.getAttribute("src", 4)
}


/**
 * util-request.js - The utilities for requesting script and style files
 * ref: tests/research/load-js-css/test.html
 */

var head = doc.getElementsByTagName("head")[0] || doc.documentElement
var baseElement = head.getElementsByTagName("base")[0]

var IS_CSS_RE = /\.css(?:\?|$)/i
var READY_STATE_RE = /^(?:loaded|complete|undefined)$/

var currentlyAddingScript
var interactiveScript

// `onload` event is not supported in WebKit < 535.23 and Firefox < 9.0
// ref:
//  - https://bugs.webkit.org/show_activity.cgi?id=38995
//  - https://bugzilla.mozilla.org/show_bug.cgi?id=185236
//  - https://developer.mozilla.org/en/HTML/Element/link#Stylesheet_load_events
var isOldWebKit = (navigator.userAgent
    .replace(/.*AppleWebKit\/(\d+)\..*/, "$1")) * 1 < 536


function request(url, callback, charset) {
  var isCSS = IS_CSS_RE.test(url)
  var node = doc.createElement(isCSS ? "link" : "script")

  if (charset) {
    var cs = isFunction(charset) ? charset(url) : charset
    if (cs) {
      node.charset = cs
    }
  }

  addOnload(node, callback, isCSS)

  if (isCSS) {
    node.rel = "stylesheet"
    node.href = url
  }
  else {
    node.async = true
    node.src = url
  }

  // For some cache cases in IE 6-8, the script executes IMMEDIATELY after
  // the end of the insert execution, so use `currentlyAddingScript` to
  // hold current node, for deriving url in `define` call
  currentlyAddingScript = node

  // ref: #185 & http://dev.jquery.com/ticket/2709
  baseElement ?
      head.insertBefore(node, baseElement) :
      head.appendChild(node)

  currentlyAddingScript = null
}

function addOnload(node, callback, isCSS) {
  var missingOnload = isCSS && (isOldWebKit || !("onload" in node))

  // for Old WebKit and Old Firefox
  if (missingOnload) {
    setTimeout(function() {
      pollCss(node, callback)
    }, 1) // Begin after node insertion
    return
  }

  node.onload = node.onerror = node.onreadystatechange = function() {
    if (READY_STATE_RE.test(node.readyState)) {

      // Ensure only run once and handle memory leak in IE
      node.onload = node.onerror = node.onreadystatechange = null

      // Remove the script to reduce memory leak
      if (!isCSS && !data.debug) {
        head.removeChild(node)
      }

      // Dereference the node
      node = null

      callback()
    }
  }
}

function pollCss(node, callback) {
  var sheet = node.sheet
  var isLoaded

  // for WebKit < 536
  if (isOldWebKit) {
    if (sheet) {
      isLoaded = true
    }
  }
  // for Firefox < 9.0
  else if (sheet) {
    try {
      if (sheet.cssRules) {
        isLoaded = true
      }
    } catch (ex) {
      // The value of `ex.name` is changed from "NS_ERROR_DOM_SECURITY_ERR"
      // to "SecurityError" since Firefox 13.0. But Firefox is less than 9.0
      // in here, So it is ok to just rely on "NS_ERROR_DOM_SECURITY_ERR"
      if (ex.name === "NS_ERROR_DOM_SECURITY_ERR") {
        isLoaded = true
      }
    }
  }

  setTimeout(function() {
    if (isLoaded) {
      // Place callback here to give time for style rendering
      callback()
    }
    else {
      pollCss(node, callback)
    }
  }, 20)
}

function getCurrentScript() {
  if (currentlyAddingScript) {
    return currentlyAddingScript
  }

  // For IE6-9 browsers, the script onload event may not fire right
  // after the script is evaluated. Kris Zyp found that it
  // could query the script nodes and the one that is in "interactive"
  // mode indicates the current script
  // ref: http://goo.gl/JHfFW
  if (interactiveScript && interactiveScript.readyState === "interactive") {
    return interactiveScript
  }

  var scripts = head.getElementsByTagName("script")

  for (var i = scripts.length - 1; i >= 0; i--) {
    var script = scripts[i]
    if (script.readyState === "interactive") {
      interactiveScript = script
      return interactiveScript
    }
  }
}


/**
 * util-deps.js - The parser for dependencies
 * ref: tests/research/parse-dependencies/test.html
 */

var REQUIRE_RE = /"(?:\\"|[^"])*"|'(?:\\'|[^'])*'|\/\*[\S\s]*?\*\/|\/(?:\\\/|[^\/\r\n])+\/(?=[^\/])|\/\/.*|\.\s*require|(?:^|[^$])\brequire\s*\(\s*(["'])(.+?)\1\s*\)/g
var SLASH_RE = /\\\\/g

function parseDependencies(code) {
  var ret = []

  code.replace(SLASH_RE, "")
      .replace(REQUIRE_RE, function(m, m1, m2) {
        if (m2) {
          ret.push(m2)
        }
      })

  return ret
}


/**
 * module.js - The core of module loader
 */

var cachedMods = seajs.cache = {}
var anonymousMeta

var fetchingList = {}
var fetchedList = {}
var callbackList = {}

var STATUS = Module.STATUS = {
  // 1 - The `module.uri` is being fetched
  FETCHING: 1,
  // 2 - The meta data has been saved to cachedMods
  SAVED: 2,
  // 3 - The `module.dependencies` are being loaded
  LOADING: 3,
  // 4 - The module are ready to execute
  LOADED: 4,
  // 5 - The module is being executed
  EXECUTING: 5,
  // 6 - The `module.exports` is available
  EXECUTED: 6
}


function Module(uri, deps) {
  this.uri = uri
  this.dependencies = deps || []
  this.exports = null
  this.status = 0

  // Who depends on me
  this._waitings = {}

  // The number of unloaded dependencies
  this._remain = 0
}

// Resolve module.dependencies
Module.prototype.resolve = function() {
  var mod = this
  var ids = mod.dependencies
  var uris = []

  for (var i = 0, len = ids.length; i < len; i++) {
    uris[i] = Module.resolve(ids[i], mod.uri)
  }
  return uris
}

// Load module.dependencies and fire onload when all done
Module.prototype.load = function() {
  var mod = this

  // If the module is being loaded, just wait it onload call
  if (mod.status >= STATUS.LOADING) {
    return
  }

  mod.status = STATUS.LOADING

  // Emit `load` event for plugins such as combo plugin
  var uris = mod.resolve()
  emit("load", uris)

  var len = mod._remain = uris.length
  var m

  // Initialize modules and register waitings
  for (var i = 0; i < len; i++) {
    m = Module.get(uris[i])

    if (m.status < STATUS.LOADED) {
      // Maybe duplicate
      m._waitings[mod.uri] = (m._waitings[mod.uri] || 0) + 1
    }
    else {
      mod._remain--
    }
  }

  if (mod._remain === 0) {
    mod.onload()
    return
  }

  // Begin parallel loading
  var requestCache = {}

  for (i = 0; i < len; i++) {
    m = cachedMods[uris[i]]

    if (m.status < STATUS.FETCHING) {
      m.fetch(requestCache)
    }
    else if (m.status === STATUS.SAVED) {
      m.load()
    }
  }

  // Send all requests at last to avoid cache bug in IE6-9. Issues#808
  for (var requestUri in requestCache) {
    if (requestCache.hasOwnProperty(requestUri)) {
      requestCache[requestUri]()
    }
  }
}

// Call this method when module is loaded
Module.prototype.onload = function() {
  var mod = this
  mod.status = STATUS.LOADED

  if (mod.callback) {
    mod.callback()
  }

  // Notify waiting modules to fire onload
  var waitings = mod._waitings
  var uri, m

  for (uri in waitings) {
    if (waitings.hasOwnProperty(uri)) {
      m = cachedMods[uri]
      m._remain -= waitings[uri]
      if (m._remain === 0) {
        m.onload()
      }
    }
  }

  // Reduce memory taken
  delete mod._waitings
  delete mod._remain
}

// Fetch a module
Module.prototype.fetch = function(requestCache) {
  var mod = this
  var uri = mod.uri

  mod.status = STATUS.FETCHING

  // Emit `fetch` event for plugins such as combo plugin
  var emitData = { uri: uri }
  emit("fetch", emitData)
  var requestUri = emitData.requestUri || uri

  // Empty uri or a non-CMD module
  if (!requestUri || fetchedList[requestUri]) {
    mod.load()
    return
  }

  if (fetchingList[requestUri]) {
    callbackList[requestUri].push(mod)
    return
  }

  fetchingList[requestUri] = true
  callbackList[requestUri] = [mod]

  // Emit `request` event for plugins such as text plugin
  emit("request", emitData = {
    uri: uri,
    requestUri: requestUri,
    onRequest: onRequest,
    charset: data.charset
  })

  if (!emitData.requested) {
    requestCache ?
        requestCache[emitData.requestUri] = sendRequest :
        sendRequest()
  }

  function sendRequest() {
    request(emitData.requestUri, emitData.onRequest, emitData.charset)
  }

  function onRequest() {
    delete fetchingList[requestUri]
    fetchedList[requestUri] = true

    // Save meta data of anonymous module
    if (anonymousMeta) {
      Module.save(uri, anonymousMeta)
      anonymousMeta = null
    }

    // Call callbacks
    var m, mods = callbackList[requestUri]
    delete callbackList[requestUri]
    while ((m = mods.shift())) m.load()
  }
}

// Execute a module
Module.prototype.exec = function () {
  var mod = this

  // When module is executed, DO NOT execute it again. When module
  // is being executed, just return `module.exports` too, for avoiding
  // circularly calling
  if (mod.status >= STATUS.EXECUTING) {
    return mod.exports
  }

  mod.status = STATUS.EXECUTING

  // Create require
  var uri = mod.uri

  function require(id) {
    return Module.get(require.resolve(id)).exec()
  }

  require.resolve = function(id) {
    return Module.resolve(id, uri)
  }

  require.async = function(ids, callback) {
    Module.use(ids, callback, uri + "_async_" + cid())
    return require
  }

  // Exec factory
  var factory = mod.factory

  var exports = isFunction(factory) ?
      factory(require, mod.exports = {}, mod) :
      factory

  if (exports === undefined) {
    exports = mod.exports
  }

  // Emit `error` event
  if (exports === null && !IS_CSS_RE.test(uri)) {
    emit("error", mod)
  }

  // Reduce memory leak
  delete mod.factory

  mod.exports = exports
  mod.status = STATUS.EXECUTED

  // Emit `exec` event
  emit("exec", mod)

  return exports
}

// Resolve id to uri
Module.resolve = function(id, refUri) {
  // Emit `resolve` event for plugins such as text plugin
  var emitData = { id: id, refUri: refUri }
  emit("resolve", emitData)

  return emitData.uri || id2Uri(emitData.id, refUri)
}

// Define a module
Module.define = function (id, deps, factory) {
  var argsLen = arguments.length

  // define(factory)
  if (argsLen === 1) {
    factory = id
    id = undefined
  }
  else if (argsLen === 2) {
    factory = deps

    // define(deps, factory)
    if (isArray(id)) {
      deps = id
      id = undefined
    }
    // define(id, factory)
    else {
      deps = undefined
    }
  }

  // Parse dependencies according to the module factory code
  if (!isArray(deps) && isFunction(factory)) {
    deps = parseDependencies(factory.toString())
  }

  var meta = {
    id: id,
    uri: Module.resolve(id),
    deps: deps,
    factory: factory
  }

  // Try to derive uri in IE6-9 for anonymous modules
  if (!meta.uri && doc.attachEvent) {
    var script = getCurrentScript()

    if (script) {
      meta.uri = script.src
    }

    // NOTE: If the id-deriving methods above is failed, then falls back
    // to use onload event to get the uri
  }

  // Emit `define` event, used in nocache plugin, seajs node version etc
  emit("define", meta)

  meta.uri ? Module.save(meta.uri, meta) :
      // Save information for "saving" work in the script onload event
      anonymousMeta = meta
}

// Save meta data to cachedMods
Module.save = function(uri, meta) {
  var mod = Module.get(uri)

  // Do NOT override already saved modules
  if (mod.status < STATUS.SAVED) {
    mod.id = meta.id || uri
    mod.dependencies = meta.deps || []
    mod.factory = meta.factory
    mod.status = STATUS.SAVED
  }
}

// Get an existed module or create a new one
Module.get = function(uri, deps) {
  return cachedMods[uri] || (cachedMods[uri] = new Module(uri, deps))
}

// Use function is equal to load a anonymous module
Module.use = function (ids, callback, uri) {
  var mod = Module.get(uri, isArray(ids) ? ids : [ids])

  mod.callback = function() {
    var exports = []
    var uris = mod.resolve()

    for (var i = 0, len = uris.length; i < len; i++) {
      exports[i] = cachedMods[uris[i]].exec()
    }

    if (callback) {
      callback.apply(global, exports)
    }

    delete mod.callback
  }

  mod.load()
}

// Load preload modules before all other modules
Module.preload = function(callback) {
  var preloadMods = data.preload
  var len = preloadMods.length

  if (len) {
    Module.use(preloadMods, function() {
      // Remove the loaded preload modules
      preloadMods.splice(0, len)

      // Allow preload modules to add new preload modules
      Module.preload(callback)
    }, data.cwd + "_preload_" + cid())
  }
  else {
    callback()
  }
}


// Public API

seajs.use = function(ids, callback) {
  Module.preload(function() {
    Module.use(ids, callback, data.cwd + "_use_" + cid())
  })
  return seajs
}

Module.define.cmd = {}
global.define = Module.define


// For Developers

seajs.Module = Module
data.fetchedList = fetchedList
data.cid = cid

seajs.resolve = id2Uri
seajs.require = function(id) {
  return (cachedMods[Module.resolve(id)] || {}).exports
}


/**
 * config.js - The configuration for the loader
 */

var BASE_RE = /^(.+?\/)(\?\?)?(seajs\/)+/

// The root path to use for id2uri parsing
// If loaderUri is `http://test.com/libs/seajs/[??][seajs/1.2.3/]sea.js`, the
// baseUri should be `http://test.com/libs/`
data.base = (loaderDir.match(BASE_RE) || ["", loaderDir])[1]

// The loader directory
data.dir = loaderDir

// The current working directory
data.cwd = cwd

// The charset for requesting files
data.charset = "utf-8"

// Modules that are needed to load before all other modules
data.preload = (function() {
  var plugins = []

  // Convert `seajs-xxx` to `seajs-xxx=1`
  // NOTE: use `seajs-xxx=1` flag in uri or cookie to preload `seajs-xxx`
  var str = loc.search.replace(/(seajs-\w+)(&|$)/g, "$1=1$2")

  // Add cookie string
  str += " " + doc.cookie

  // Exclude seajs-xxx=0
  str.replace(/(seajs-\w+)=1/g, function(m, name) {
    plugins.push(name)
  })

  return plugins
})()

// data.alias - An object containing shorthands of module id
// data.paths - An object containing path shorthands in module id
// data.vars - The {xxx} variables in module id
// data.map - An array containing rules to map module uri
// data.debug - Debug mode. The default value is false

seajs.config = function(configData) {

  for (var key in configData) {
    var curr = configData[key]
    var prev = data[key]

    // Merge object config such as alias, vars
    if (prev && isObject(prev)) {
      for (var k in curr) {
        prev[k] = curr[k]
      }
    }
    else {
      // Concat array config such as map, preload
      if (isArray(prev)) {
        curr = prev.concat(curr)
      }
      // Make sure that `data.base` is an absolute path
      else if (key === "base") {
        (curr.slice(-1) === "/") || (curr += "/")
        curr = addBase(curr)
      }

      // Set config
      data[key] = curr
    }
  }

  emit("config", configData)
  return seajs
}


})(this);
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


(function(){
  var requires = ['bui/util','bui/ua','bui/json','bui/date','bui/array','bui/keycode','bui/observable','bui/base','bui/component'];
  if(window.KISSY && (!window.KISSY.Node || !window.jQuery)){ //如果是kissy同时未加载core模块
    requires.unshift('bui/adapter');
  }
  define('bui/common',requires,function(require){
    if(window.KISSY && (!window.KISSY.Node || !window.jQuery)){
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

/**
 * @class BUI
 * 控件库的工具方法，这些工具方法直接绑定到BUI对象上
 * <pre><code>
 *     BUI.isString(str);
 *
 *     BUI.extend(A,B);
 *
 *     BUI.mix(A,{a:'a'});
 * </code></pre>
 * @singleton
 */
window.BUI = window.BUI || {};

if(!BUI.use && window.seajs){
    BUI.use = seajs.use;
    BUI.config = seajs.config;
}

define('bui/util',function(require){

    //兼容jquery 1.6以下
    (function($){
        if($.fn){
            $.fn.on = $.fn.on || $.fn.bind;
            $.fn.off = $.fn.off || $.fn.unbind;
        }

    })(jQuery);
    /**
     * @ignore
     * 处于效率的目的，复制属性
     */
    function mixAttrs(to,from){

        for(var c in from){
            if(from.hasOwnProperty(c)){
                to[c] = to[c] || {};
                mixAttr(to[c],from[c]);
            }
        }

    }
    //合并属性
    function mixAttr(attr,attrConfig){
        for (var p in attrConfig) {
            if(attrConfig.hasOwnProperty(p)){
                if(p == 'value'){
                    if(BUI.isObject(attrConfig[p])){
                        attr[p] = attr[p] || {};
                        BUI.mix(/*true,*/attr[p], attrConfig[p]);
                    }else if(BUI.isArray(attrConfig[p])){
                        attr[p] = attr[p] || [];
                        //BUI.mix(/*true,*/attr[p], attrConfig[p]);
                        attr[p] = attr[p].concat(attrConfig[p]);
                    }else{
                        attr[p] = attrConfig[p];
                    }
                }else{
                    attr[p] = attrConfig[p];
                }
            }
        };
    }

    var win = window,
        doc = document,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        BODY = 'body',
        DOC_ELEMENT = 'documentElement',
        SCROLL = 'scroll',
        SCROLL_WIDTH = SCROLL + 'Width',
        SCROLL_HEIGHT = SCROLL + 'Height',
        ATTRS = 'ATTRS',
        PARSER = 'PARSER',
        GUID_DEFAULT = 'guid';

    $.extend(BUI,
        {
            /**
             * 版本号
             * @memberOf BUI
             * @type {Number}
             */
            version:1.0,

            /**
             * 子版本号
             * @type {Number}
             */
            subVersion : 96,


            /**
             * 是否为函数
             * @param  {*} fn 对象
             * @return {Boolean}  是否函数
             */
            isFunction : function(fn){
                return typeof(fn) === 'function';
            },
            /**
             * 是否数组
             * @method
             * @param  {*}  obj 是否数组
             * @return {Boolean}  是否数组
             */
            isArray : ('isArray' in Array) ? Array.isArray : function(value) {
                return toString.call(value) === '[object Array]';
            },
            /**
             * 是否日期
             * @param  {*}  value 对象
             * @return {Boolean}  是否日期
             */
            isDate: function(value) {
                return toString.call(value) === '[object Date]';
            },
            /**
             * 是否是javascript对象
             * @param {Object} value The value to test
             * @return {Boolean}
             * @method
             */
            isObject: (toString.call(null) === '[object Object]') ?
                function(value) {
                    // check ownerDocument here as well to exclude DOM nodes
                    return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
                } :
                function(value) {
                    return toString.call(value) === '[object Object]';
                },
            /**
             * 是否是数字或者数字字符串
             * @param  {String}  value 数字字符串
             * @return {Boolean}  是否是数字或者数字字符串
             */
            isNumeric: function(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            },
            /**
             * 将指定的方法或属性放到构造函数的原型链上，
             * 函数支持多于2个变量，后面的变量同s1一样将其成员复制到构造函数的原型链上。
             * @param  {Function} r  构造函数
             * @param  {Object} s1 将s1 的成员复制到构造函数的原型链上
             *          @example
             *          BUI.augment(class1,{
     *              method1: function(){
     *   
     *              }
     *          });
             */
            augment : function(r,s1){
                if(!BUI.isFunction(r))
                {
                    return r;
                }
                for (var i = 1; i < arguments.length; i++) {
                    BUI.mix(r.prototype,arguments[i].prototype || arguments[i]);
                };
                return r;
            },
            /**
             * 拷贝对象
             * @param  {Object} obj 要拷贝的对象
             * @return {Object} 拷贝生成的对象
             */
            cloneObject : function(obj){
                var result = BUI.isArray(obj) ? [] : {};

                return BUI.mix(true,result,obj);
            },
            /**
             * 抛出错误
             */
            error : function(msg){
                if(BUI.debug){
                    throw msg;
                }
            },
            
            /**
             * 实现类的继承，通过父类生成子类
             * @param  {Function} subclass
             * @param  {Function} superclass 父类构造函数
             * @param  {Object} overrides  子类的属性或者方法
             * @return {Function} 返回的子类构造函数
             * 示例:
             *      @example
             *      //父类
             *      function base(){
             *  
             *      }
             *
             *      function sub(){
             * 
             *      }
             *      //子类
             *      BUI.extend(sub,base,{
             *          method : function(){
             *    
             *          }
             *      });
             *
             *      //或者
             *      var sub = BUI.extend(base,{});
             */
            extend : function(subclass,superclass,overrides, staticOverrides){
                //如果只提供父类构造函数，则自动生成子类构造函数
                if(!BUI.isFunction(superclass))
                {

                    overrides = superclass;
                    superclass = subclass;
                    subclass =  function(){};
                }

                var create = Object.create ?
                    function (proto, c) {
                        return Object.create(proto, {
                            constructor: {
                                value: c
                            }
                        });
                    } :
                    function (proto, c) {
                        function F() {
                        }

                        F.prototype = proto;

                        var o = new F();
                        o.constructor = c;
                        return o;
                    };
                var superObj = create(superclass.prototype,subclass);//new superclass(),//实例化父类作为子类的prototype
                subclass.prototype = BUI.mix(superObj,subclass.prototype);     //指定子类的prototype
                subclass.superclass = create(superclass.prototype,superclass);
                BUI.mix(superObj,overrides);
                BUI.mix(subclass,staticOverrides);
                return subclass;
            },
            /**
             * 生成唯一的Id
             * @method
             * @param {String} prefix 前缀
             * @default 'bui-guid'
             * @return {String} 唯一的编号
             */
            guid : (function(){
                var map = {};
                return function(prefix){
                    prefix = prefix || BUI.prefix + GUID_DEFAULT;
                    if(!map[prefix]){
                        map[prefix] = 1;
                    }else{
                        map[prefix] += 1;
                    }
                    return prefix + map[prefix];
                };
            })(),
            /**
             * 判断是否是字符串
             * @return {Boolean} 是否是字符串
             */
            isString : function(value){
                return typeof value === 'string';
            },
            /**
             * 判断是否数字，由于$.isNumberic方法会把 '123'认为数字
             * @return {Boolean} 是否数字
             */
            isNumber : function(value){
                return typeof value === 'number';
            },
            /**
             * 是否是布尔类型
             *
             * @param {Object} value 测试的值
             * @return {Boolean}
             */
            isBoolean: function(value) {
                return typeof value === 'boolean';
            },
            /**
             * 控制台输出日志
             * @param  {Object} obj 输出的数据
             */
            log : function(obj){
                if(BUI.debug && win.console && win.console.log){
                    win.console.log(obj);
                }
            },
            /**
             * 将多个对象的属性复制到一个新的对象
             */
            merge : function(){
                var args = $.makeArray(arguments),
                    first = args[0];
                if(BUI.isBoolean(first)){
                    args.shift();
                    args.unshift({});
                    args.unshift(first);
                }else{
                    args.unshift({});
                }

                return BUI.mix.apply(null,args);

            },
            /**
             * 封装 jQuery.extend 方法，将多个对象的属性merge到第一个对象中
             * @return {Object}
             */
            mix : function(){
                return $.extend.apply(null,arguments);
            },
            /**
             * 创造顶层的命名空间，附加到window对象上,
             * 包含namespace方法
             */
            app : function(name){
                if(!window[name]){
                    window[name] = {
                        namespace :function(nsName){
                            return BUI.namespace(nsName,window[name]);
                        }
                    };
                }
                return window[name];
            },

            mixAttrs : mixAttrs,

            mixAttr : mixAttr,

            /**
             * 将其他类作为mixin集成到指定类上面
             * @param {Function} c 构造函数
             * @param {Array} mixins 扩展类
             * @param {Array} attrs 扩展的静态属性，默认为['ATTRS']
             * @return {Function} 传入的构造函数
             */
            mixin : function(c,mixins,attrs){
                attrs = attrs || [ATTRS,PARSER];
                var extensions = mixins;
                if (extensions) {
                    c.mixins = extensions;

                    var desc = {
                        // ATTRS:
                        // HTML_PARSER:
                    }, constructors = extensions['concat'](c);

                    // [ex1,ex2]，扩展类后面的优先，ex2 定义的覆盖 ex1 定义的
                    // 主类最优先
                    BUI.each(constructors, function (ext) {
                        if (ext) {
                            // 合并 ATTRS/HTML_PARSER 到主类
                            BUI.each(attrs, function (K) {
                                if (ext[K]) {
                                    desc[K] = desc[K] || {};
                                    // 不覆盖主类上的定义，因为继承层次上扩展类比主类层次高
                                    // 但是值是对象的话会深度合并
                                    // 注意：最好值是简单对象，自定义 new 出来的对象就会有问题(用 function return 出来)!
                                    if(K == 'ATTRS'){
                                        //BUI.mix(true,desc[K], ext[K]);
                                        mixAttrs(desc[K],ext[K]);
                                    }else{
                                        BUI.mix(desc[K], ext[K]);
                                    }

                                }
                            });
                        }
                    });

                    BUI.each(desc, function (v,k) {
                        c[k] = v;
                    });

                    var prototype = {};

                    // 主类最优先
                    BUI.each(constructors, function (ext) {
                        if (ext) {
                            var proto = ext.prototype;
                            // 合并功能代码到主类，不覆盖
                            for (var p in proto) {
                                // 不覆盖主类，但是主类的父类还是覆盖吧
                                if (proto.hasOwnProperty(p)) {
                                    prototype[p] = proto[p];
                                }
                            }
                        }
                    });

                    BUI.each(prototype, function (v,k) {
                        c.prototype[k] = v;
                    });
                }
                return c;
            },
            /**
             * 生成命名空间
             * @param  {String} name 命名空间的名称
             * @param  {Object} baseNS 在已有的命名空间上创建命名空间，默认“BUI”
             * @return {Object} 返回的命名空间对象
             *      @example
             *      BUI.namespace("Grid"); // BUI.Grid
             */
            namespace : function(name,baseNS){
                baseNS = baseNS || BUI;
                if(!name){
                    return baseNS;
                }
                var list = name.split('.'),
                //firstNS = win[list[0]],
                    curNS = baseNS;

                for (var i = 0; i < list.length; i++) {
                    var nsName = list[i];
                    if(!curNS[nsName]){
                        curNS[nsName] = {};
                    }
                    curNS = curNS[nsName];
                };
                return curNS;
            },
            /**
             * BUI 控件的公用前缀
             * @type {String}
             */
            prefix : 'bui-',
            /**
             * 替换字符串中的字段.
             * @param {String} str 模版字符串
             * @param {Object} o json data
             * @param {RegExp} [regexp] 匹配字符串的正则表达式
             */
            substitute: function (str, o, regexp) {
                if (!BUI.isString(str)
                    || (!BUI.isObject(o)) && !BUI.isArray(o)) {
                    return str;
                }

                return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
                    if (match.charAt(0) === '\\') {
                        return match.slice(1);
                    }
                    return (o[name] === undefined) ? '' : o[name];
                });
            },
            /**
             * 使第一个字母变成大写
             * @param  {String} s 字符串
             * @return {String} 首字母大写后的字符串
             */
            ucfirst : function(s){
                s += '';
                return s.charAt(0).toUpperCase() + s.substring(1);
            },
            /**
             * 页面上的一点是否在用户的视图内
             * @param {Object} offset 坐标，left,top
             * @return {Boolean} 是否在视图内
             */
            isInView : function(offset){
                var left = offset.left,
                    top = offset.top,
                    viewWidth = BUI.viewportWidth(),
                    wiewHeight = BUI.viewportHeight(),
                    scrollTop = BUI.scrollTop(),
                    scrollLeft = BUI.scrollLeft();
                //判断横坐标
                if(left < scrollLeft ||left > scrollLeft + viewWidth){
                    return false;
                }
                //判断纵坐标
                if(top < scrollTop || top > scrollTop + wiewHeight){
                    return false;
                }
                return true;
            },
            /**
             * 页面上的一点纵向坐标是否在用户的视图内
             * @param {Object} top  纵坐标
             * @return {Boolean} 是否在视图内
             */
            isInVerticalView : function(top){
                var wiewHeight = BUI.viewportHeight(),
                    scrollTop = BUI.scrollTop();

                //判断纵坐标
                if(top < scrollTop || top > scrollTop + wiewHeight){
                    return false;
                }
                return true;
            },
            /**
             * 页面上的一点横向坐标是否在用户的视图内
             * @param {Object} left 横坐标
             * @return {Boolean} 是否在视图内
             */
            isInHorizontalView : function(left){
                var viewWidth = BUI.viewportWidth(),
                    scrollLeft = BUI.scrollLeft();
                //判断横坐标
                if(left < scrollLeft ||left > scrollLeft + viewWidth){
                    return false;
                }
                return true;
            },
            /**
             * 获取窗口可视范围宽度
             * @return {Number} 可视区宽度
             */
            viewportWidth : function(){
                return $(window).width();
            },
            /**
             * 获取窗口可视范围高度
             * @return {Number} 可视区高度
             */
            viewportHeight:function(){
                return $(window).height();
            },
            /**
             * 滚动到窗口的left位置
             */
            scrollLeft : function(){
                return $(window).scrollLeft();
            },
            /**
             * 滚动到横向位置
             */
            scrollTop : function(){
                return $(window).scrollTop();
            },
            /**
             * 窗口宽度
             * @return {Number} 窗口宽度
             */
            docWidth : function(){
                return Math.max(this.viewportWidth(), doc[DOC_ELEMENT][SCROLL_WIDTH], doc[BODY][SCROLL_WIDTH]);
            },
            /**
             * 窗口高度
             * @return {Number} 窗口高度
             */
            docHeight : function(){
                return Math.max(this.viewportHeight(), doc[DOC_ELEMENT][SCROLL_HEIGHT], doc[BODY][SCROLL_HEIGHT]);
            },
            /**
             * 遍历数组或者对象
             * @param {Object|Array} element/Object 数组中的元素或者对象的值
             * @param {Function} func 遍历的函数 function(elememt,index){} 或者 function(value,key){}
             */
            each : function (elements,func) {
                if(!elements){
                    return;
                }
                $.each(elements,function(k,v){
                    return func(v,k);
                });
            },
            /**
             * 封装事件，便于使用上下文this,和便于解除事件时使用
             * @protected
             * @param  {Object} self   对象
             * @param  {String} action 事件名称
             */
            wrapBehavior : function(self, action) {
                return self['__bui_wrap_' + action] = function (e) {
                    if (!self.get('disabled')) {
                        self[action](e);
                    }
                };
            },
            /**
             * 获取封装的事件
             * @protected
             * @param  {Object} self   对象
             * @param  {String} action 事件名称
             */
            getWrapBehavior : function(self, action) {
                return self['__bui_wrap_' + action];
            },
            /**
             * 获取页面上使用了此id的控件
             * @param  {String} id 控件id
             * @return {BUI.Component.Controller}    查找的控件
             */
            getControl : function(id){
                return BUI.Component.Manager.getComponent(id);
            }

        });

    /**
     * 表单帮助类，序列化、反序列化，设置值
     * @class BUI.FormHelper
     * @singleton
     */
    var formHelper = BUI.FormHelper = {
        /**
         * 将表单格式化成键值对形式
         * @param {HTMLElement} form 表单
         * @return {Object} 键值对的对象
         */
        serializeToObject:function(form){
            var array = $(form).serializeArray(),
                result = {};
            BUI.each(array,function(item){
                var name = item.name;
                if(!result[name]){ //如果是单个值，直接赋值
                    result[name] = item.value;
                }else{ //多值使用数组
                    if(!BUI.isArray(result[name])){
                        result[name] = [result[name]];
                    }
                    result[name].push(item.value);
                }
            });
            return result;
        },
        /**
         * 设置表单的值
         * @param {HTMLElement} form 表单
         * @param {Object} obj  键值对
         */
        setFields : function(form,obj){
            for(var name in obj){
                if(obj.hasOwnProperty(name)){
                    BUI.FormHelper.setField(form,name,obj[name]);
                }
            }
        },
        /**
         * 清空表单
         * @param  {HTMLElement} form 表单元素
         */
        clear : function(form){
            var elements = $.makeArray(form.elements);

            BUI.each(elements,function(element){
                if(element.type === 'checkbox' || element.type === 'radio' ){
                    $(element).attr('checked',false);
                }else{
                    $(element).val('');
                }
                $(element).change();
            });
        },
        /**
         * 设置表单字段
         * @param {HTMLElement} form 表单元素
         * @param {string} field 字段名
         * @param {string} value 字段值
         */
        setField:function(form,fieldName,value){
            var fields = form.elements[fieldName];
            if(fields && fields.type){
                formHelper._setFieldValue(fields,value);
            }else if(BUI.isArray(fields) || (fields && fields.length)){
                BUI.each(fields,function(field){
                    formHelper._setFieldValue(field,value);
                });
            }
        },
        //设置字段的值
        _setFieldValue : function(field,value){
            if(field.type === 'checkbox'){
                if(field.value == ''+ value ||(BUI.isArray(value) && BUI.Array.indexOf(field.value,value) !== -1)) {
                    $(field).attr('checked',true);
                }else{
                    $(field).attr('checked',false);
                }
            }else if(field.type === 'radio'){
                if(field.value == ''+  value){
                    $(field).attr('checked',true);
                }else{
                    $(field).attr('checked',false);
                }
            }else{
                $(field).val(value);
            }
        },
        /**
         * 获取表单字段值
         * @param {HTMLElement} form 表单元素
         * @param {string} field 字段名
         * @return {String}   字段值
         */
        getField : function(form,fieldName){
            return BUI.FormHelper.serializeToObject(form)[fieldName];
        }
    };

    return BUI;
});
/**
 * @fileOverview 数组帮助类
 * @ignore
 */

/**
 * @class BUI
 * 控件库的基础命名空间
 * @singleton
 */

define('bui/array',['bui/util'],function (r) {
  
  var BUI = r('bui/util');
  /**
   * @class BUI.Array
   * 数组帮助类
   */
  BUI.Array ={
    /**
     * 返回数组的最后一个对象
     * @param {Array} array 数组或者类似于数组的对象.
     * @return {*} 数组的最后一项.
     */
    peek : function(array) {
      return array[array.length - 1];
    },
    /**
     * 查找记录所在的位置
     * @param  {*} value 值
     * @param  {Array} array 数组或者类似于数组的对象
     * @param  {Number} [fromIndex=0] 起始项，默认为0
     * @return {Number} 位置，如果为 -1则不在数组内
     */
    indexOf : function(value, array,opt_fromIndex){
       var fromIndex = opt_fromIndex == null ?
          0 : (opt_fromIndex < 0 ?
               Math.max(0, array.length + opt_fromIndex) : opt_fromIndex);

      for (var i = fromIndex; i < array.length; i++) {
        if (i in array && array[i] === value)
          return i;
      }
      return -1;
    },
    /**
     * 数组是否存在指定值
     * @param  {*} value 值
     * @param  {Array} array 数组或者类似于数组的对象
     * @return {Boolean} 是否存在于数组中
     */
    contains : function(value,array){
      return BUI.Array.indexOf(value,array) >=0;
    },
    /**
     * 遍历数组或者对象
     * @method 
     * @param {Object|Array} element/Object 数组中的元素或者对象的值 
     * @param {Function} func 遍历的函数 function(elememt,index){} 或者 function(value,key){}
     */
    each : BUI.each,
    /**
     * 2个数组内部的值是否相等
     * @param  {Array} a1 数组1
     * @param  {Array} a2 数组2
     * @return {Boolean} 2个数组相等或者内部元素是否相等
     */
    equals : function(a1,a2){
      if(a1 == a2){
        return true;
      }
      if(!a1 || !a2){
        return false;
      }

      if(a1.length != a2.length){
        return false;
      }
      var rst = true;
      for(var i = 0 ;i < a1.length; i++){
        if(a1[i] !== a2[i]){
          rst = false;
          break;
        }
      }
      return rst;
    },

    /**
     * 过滤数组
     * @param {Object|Array} element/Object 数组中的元素或者对象的值 
     * @param {Function} func 遍历的函数 function(elememt,index){} 或者 function(value,key){},如果返回true则添加到结果集
     * @return {Array} 过滤的结果集
     */
    filter : function(array,func){
      var result = [];
      BUI.Array.each(array,function(value,index){
        if(func(value,index)){
          result.push(value);
        }
      });
      return result;
    },
    /**
     * 转换数组数组
     * @param {Object|Array} element/Object 数组中的元素或者对象的值 
     * @param {Function} func 遍历的函数 function(elememt,index){} 或者 function(value,key){},将返回的结果添加到结果集
     * @return {Array} 过滤的结果集
     */
    map : function(array,func){
      var result = [];
      BUI.Array.each(array,function(value,index){
        result.push(func(value,index));
      });
      return result;
    },
    /**
     * 获取第一个符合条件的数据
     * @param  {Array} array 数组
     * @param  {Function} func  匹配函数
     * @return {*}  符合条件的数据
     */
    find : function(array,func){
      var i = BUI.Array.findIndex(array, func);
      return i < 0 ? null : array[i];
    },
    /**
     * 获取第一个符合条件的数据的索引值
    * @param  {Array} array 数组
     * @param  {Function} func  匹配函数
     * @return {Number} 符合条件的数据的索引值
     */
    findIndex : function(array,func){
      var result = -1;
      BUI.Array.each(array,function(value,index){
        if(func(value,index)){
          result = index;
          return false;
        }
      });
      return result;
    },
    /**
     * 数组是否为空
     * @param  {Array}  array 数组
     * @return {Boolean}  是否为空
     */
    isEmpty : function(array){
      return array.length == 0;
    },
    /**
     * 插入数组
     * @param  {Array} array 数组
     * @param  {Number} index 位置
     * @param {*} value 插入的数据
     */
    add : function(array,value){
      array.push(value);
    },
    /**
     * 将数据插入数组指定的位置
     * @param  {Array} array 数组
     * @param {*} value 插入的数据
     * @param  {Number} index 位置
     */
    addAt : function(array,value,index){
      BUI.Array.splice(array, index, 0, value);
    },
    /**
     * 清空数组
     * @param  {Array} array 数组
     * @return {Array}  清空后的数组
     */
    empty : function(array){
      if(!(array instanceof(Array))){
        for (var i = array.length - 1; i >= 0; i--) {
          delete array[i];
        }
      }
      array.length = 0;
    },
    /**
     * 移除记录
     * @param  {Array} array 数组
     * @param  {*} value 记录
     * @return {Boolean}   是否移除成功
     */
    remove : function(array,value){
      var i = BUI.Array.indexOf(value, array);
      var rv;
      if ((rv = i >= 0)) {
        BUI.Array.removeAt(array, i);
      }
      return rv;
    },
    /**
     * 移除指定位置的记录
     * @param  {Array} array 数组
     * @param  {Number} index 索引值
     * @return {Boolean}   是否移除成功
     */
    removeAt : function(array,index){
      return BUI.Array.splice(array, index, 1).length == 1;
    },
    /**
     * @private
     */
    slice : function(arr, start, opt_end){
      if (arguments.length <= 2) {
        return Array.prototype.slice.call(arr, start);
      } else {
        return Array.prototype.slice.call(arr, start, opt_end);
      }
    },
    /**
     * @private
     */
    splice : function(arr, index, howMany, var_args){
      return Array.prototype.splice.apply(arr, BUI.Array.slice(arguments, 1))
    }

  };
  return BUI.Array;
});/**
 * @fileOverview 观察者模式实现事件
 * @ignore
 */

define('bui/observable',['bui/util'],function (r) {
  
  var BUI = r('bui/util');
  /**
   * @private
   * @class BUI.Observable.Callbacks
   * jquery 1.7 时存在 $.Callbacks,但是fireWith的返回结果是$.Callbacks 对象，
   * 而我们想要的效果是：当其中有一个函数返回为false时，阻止后面的执行，并返回false
   */
  var Callbacks = function(){
    this._init();
  };

  BUI.augment(Callbacks,{

    _functions : null,

    _init : function(){
      var _self = this;

      _self._functions = [];
    },
    /**
     * 添加回调函数
     * @param {Function} fn 回调函数
     */
    add:function(fn){
      this._functions.push(fn);
    },
    /**
     * 移除回调函数
     * @param  {Function} fn 回调函数
     */
    remove : function(fn){
      var functions = this._functions;
        index = BUI.Array.indexOf(fn,functions);
      if(index>=0){
        functions.splice(index,1);
      }
    },
    /**
     * 清空事件
     */
    empty : function(){
      var length = this._functions.length; //ie6,7下，必须指定需要删除的数量
      this._functions.splice(0,length);
    },
    /**
     * 暂停事件
     */
    pause : function(){
      this._paused = true;
    },
    /**
     * 唤醒事件
     */
    resume : function(){
      this._paused = false;
    },
    /**
     * 触发回调
     * @param  {Object} scope 上下文
     * @param  {Array} args  回调函数的参数
     * @return {Boolean|undefined} 当其中有一个函数返回为false时，阻止后面的执行，并返回false
     */
    fireWith : function(scope,args){
      var _self = this,
        rst;
      if(this._paused){
        return;
      }
      BUI.each(_self._functions,function(fn){
        rst = fn.apply(scope,args);
        if(rst === false){
          return false;
        }
      });
      return rst;
    }
  });

  function getCallbacks(){
    return new Callbacks();
  }
  /**
   * 支持事件的对象，参考观察者模式
   *  - 此类提供事件绑定
   *  - 提供事件冒泡机制
   *
   * <pre><code>
   *   var control = new Control();
   *   control.on('click',function(ev){
   *   
   *   });
   *
   *   control.off();  //移除所有事件
   * </code></pre>
   * @class BUI.Observable
   * @abstract
   * @param {Object} config 配置项键值对
   */
  var Observable = function(config){
        this._events = [];
        this._eventMap = {};
        this._bubblesEvents = [];
    this._initEvents(config);
  };

  BUI.augment(Observable,
  {

    /**
     * @cfg {Object} listeners 
     *  初始化事件,快速注册事件
     *  <pre><code>
     *    var list = new BUI.List.SimpleList({
     *      listeners : {
     *        itemclick : function(ev){},
     *        itemrendered : function(ev){}
     *      },
     *      items : []
     *    });
     *    list.render();
     *  </code></pre>
     */
    
    /**
     * @cfg {Function} handler
     * 点击事件的处理函数，快速配置点击事件而不需要写listeners属性
     * <pre><code>
     *    var list = new BUI.List.SimpleList({
     *      handler : function(ev){} //click 事件
     *    });
     *    list.render();
     *  </code></pre>
     */
    
    /**
     * 支持的事件名列表
     * @private
     */
    _events:[],

    /**
     * 绑定的事件
     * @private
     */
    _eventMap : {},

    _bubblesEvents : [],

    _bubbleTarget : null,

    //获取回调集合
    _getCallbacks : function(eventType){
      var _self = this,
        eventMap = _self._eventMap;
      return eventMap[eventType];
    },
    //初始化事件列表
    _initEvents : function(config){
      var _self = this,
        listeners = null; 

      if(!config){
        return;
      }
      listeners = config.listeners || {};
      if(config.handler){
        listeners.click = config.handler;
      }
      if(listeners){
        for (var name in listeners) {
          if(listeners.hasOwnProperty(name)){
            _self.on(name,listeners[name]);
          }
        };
      }
    },
    //事件是否支持冒泡
    _isBubbles : function (eventType) {
        return BUI.Array.indexOf(eventType,this._bubblesEvents) >= 0;
    },
    /**
     * 添加冒泡的对象
     * @protected
     * @param {Object} target  冒泡的事件源
     */
    addTarget : function(target) {
        this._bubbleTarget = target;
    },
    /**
     * 添加支持的事件
     * @protected
     * @param {String|String[]} events 事件
     */
    addEvents : function(events){
      var _self = this,
        existEvents = _self._events,
        eventMap = _self._eventMap;

      function addEvent(eventType){
        if(BUI.Array.indexOf(eventType,existEvents) === -1){
          eventMap[eventType] = getCallbacks();
          existEvents.push(eventType);
        }
      }
      if(BUI.isArray(events)){
        $.each(events,function(index,eventType){
          addEvent(eventType);
        });
      }else{
        addEvent(events);
      }
    },
    /**
     * 移除所有绑定的事件
     * @protected
     */
    clearListeners : function(){
      var _self = this,
        eventMap = _self._eventMap;
      for(var name in eventMap){
        if(eventMap.hasOwnProperty(name)){
          eventMap[name].empty();
        }
      }
    },
    /**
     * 触发事件
     * <pre><code>
     *   //绑定事件
     *   list.on('itemclick',function(ev){
     *     alert('21');
     *   });
     *   //触发事件
     *   list.fire('itemclick');
     * </code></pre>
     * @param  {String} eventType 事件类型
     * @param  {Object} eventData 事件触发时传递的数据
     * @return {Boolean|undefined}  如果其中一个事件处理器返回 false , 则返回 false, 否则返回最后一个事件处理器的返回值
     */
    fire : function(eventType,eventData){
      var _self = this,
        callbacks = _self._getCallbacks(eventType),
        args = $.makeArray(arguments),
        result;
      if(!eventData){
        eventData = {};
        args.push(eventData);
      }
      if(!eventData.target){
        eventData.target = _self;
      }
      if(callbacks){
        result = callbacks.fireWith(_self,Array.prototype.slice.call(args,1));
      }
      if(_self._isBubbles(eventType)){
          var bubbleTarget = _self._bubbleTarget;
          if(bubbleTarget && bubbleTarget.fire){
              bubbleTarget.fire(eventType,eventData);
          }
      }
      return result;
    },
    /**
     * 暂停事件的执行
     * <pre><code>
     *  list.pauseEvent('itemclick');
     * </code></pre>
     * @param  {String} eventType 事件类型
     */
    pauseEvent : function(eventType){
      var _self = this,
        callbacks = _self._getCallbacks(eventType);
      callbacks && callbacks.pause();
    },
    /**
     * 唤醒事件
     * <pre><code>
     *  list.resumeEvent('itemclick');
     * </code></pre>
     * @param  {String} eventType 事件类型
     */
    resumeEvent : function(eventType){
      var _self = this,
        callbacks = _self._getCallbacks(eventType);
      callbacks && callbacks.resume();
    },
    /**
     * 添加绑定事件
     * <pre><code>
     *   //绑定单个事件
     *   list.on('itemclick',function(ev){
     *     alert('21');
     *   });
     *   //绑定多个事件
     *   list.on('itemrendered itemupdated',function(){
     *     //列表项创建、更新时触发操作
     *   });
     * </code></pre>
     * @param  {String}   eventType 事件类型
     * @param  {Function} fn        回调函数
     */
    on : function(eventType,fn){
      //一次监听多个事件
      var arr = eventType.split(' '),
        _self = this,
        callbacks =null;
      if(arr.length > 1){
        BUI.each(arr,function(name){
          _self.on(name,fn);
        });
      }else{
        callbacks = _self._getCallbacks(eventType);
        if(callbacks){
          callbacks.add(fn);
        }else{
          _self.addEvents(eventType);
          _self.on(eventType,fn);
        }
      }
      return _self;
    },
    /**
     * 移除绑定的事件
     * <pre><code>
     *  //移除所有事件
     *  list.off();
     *  
     *  //移除特定事件
     *  function callback(ev){}
     *  list.on('click',callback);
     *
     *  list.off('click',callback);//需要保存回调函数的引用
     * 
     * </code></pre>
     * @param  {String}   eventType 事件类型
     * @param  {Function} fn        回调函数
     */
    off : function(eventType,fn){
      if(!eventType && !fn){
        this.clearListeners();
        return this;
      }
      var _self = this,
        callbacks = _self._getCallbacks(eventType);
      if(callbacks){
        if(fn){
          callbacks.remove(fn);
        }else{
          callbacks.empty();
        }
        
      }
      return _self;
    },
    /**
     * 配置事件是否允许冒泡
     * @protected
     * @param  {String} eventType 支持冒泡的事件
     * @param  {Object} cfg 配置项
     * @param {Boolean} cfg.bubbles 是否支持冒泡
     */
    publish : function(eventType, cfg){
      var _self = this,
          bubblesEvents = _self._bubblesEvents;

      if(cfg.bubbles){
          if(BUI.Array.indexOf(eventType,bubblesEvents) === -1){
              bubblesEvents.push(eventType);
          }
      }else{
          var index = BUI.Array.indexOf(eventType,bubblesEvents);
          if(index !== -1){
              bubblesEvents.splice(index,1);
          }
      }
    }
  });

  return Observable;
});/**
 * @fileOverview UA,jQuery的 $.browser 对象非常难使用
 * @ignore
 * @author dxq613@gmail.com
 */
define('bui/ua', function () {

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    };

    function uaMatch(s) {
        s = s.toLowerCase();
        var r = /(chrome)[ \/]([\w.]+)/.exec(s) || /(webkit)[ \/]([\w.]+)/.exec(s) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(s) || /(msie) ([\w.]+)/.exec(s) || s.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(s) || [],
            a = {
                browser: r[1] || "",
                version: r[2] || "0"
            },
            b = {};
        a.browser && (b[a.browser] = !0, b.version = a.version),
            b.chrome ? b.webkit = !0 : b.webkit && (b.safari = !0);
        return b;
    }

    var UA = $.UA || (function () {
        var browser = $.browser || uaMatch(navigator.userAgent),
            versionNumber = numberify(browser.version),
            /**
             * 浏览器版本检测
             * @class BUI.UA
             * @singleton
             */
                ua =
            {
                /**
                 * ie 版本
                 * @type {Number}
                 */
                ie: browser.msie && versionNumber,

                /**
                 * webkit 版本
                 * @type {Number}
                 */
                webkit: browser.webkit && versionNumber,
                /**
                 * opera 版本
                 * @type {Number}
                 */
                opera: browser.opera && versionNumber,
                /**
                 * mozilla 火狐版本
                 * @type {Number}
                 */
                mozilla: browser.mozilla && versionNumber
            };
        return ua;
    })();

    return UA;
});/**
 * @fileOverview 由于jQuery只有 parseJSON ，没有stringify所以使用过程不方便
 * @ignore
 */
define('bui/json',['bui/ua'],function (require) {

  var win = window,
    UA = require('bui/ua'),
    JSON = win.JSON;

  // ie 8.0.7600.16315@win7 json 有问题
  if (!JSON || UA['ie'] < 9) {
      JSON = win.JSON = {};
  }

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {

      Date.prototype.toJSON = function (key) {

          return isFinite(this.valueOf()) ?
              this.getUTCFullYear() + '-' +
                  f(this.getUTCMonth() + 1) + '-' +
                  f(this.getUTCDate()) + 'T' +
                  f(this.getUTCHours()) + ':' +
                  f(this.getUTCMinutes()) + ':' +
                  f(this.getUTCSeconds()) + 'Z' : null;
      };

      String.prototype.toJSON =
          Number.prototype.toJSON =
              Boolean.prototype.toJSON = function (key) {
                  return this.valueOf();
              };
  }


  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

    function quote(string) {

      // If the string contains no control characters, no quote characters, and no
      // backslash characters, then we can safely slap some quotes around it.
      // Otherwise we must also replace the offending characters with safe escape
      // sequences.

      escapable['lastIndex'] = 0;
      return escapable.test(string) ?
          '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string' ? c :
                  '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' :
          '"' + string + '"';
    }

    function str(key, holder) {

      // Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

      // If the value has a toJSON method, call it to obtain a replacement value.

      if (value && typeof value === 'object' &&
          typeof value.toJSON === 'function') {
          value = value.toJSON(key);
      }

      // If we were called with a replacer function, then call the replacer to
      // obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

      // What happens next depends on the value's type.

      switch (typeof value) {
          case 'string':
              return quote(value);

          case 'number':

      // JSON numbers must be finite. Encode non-finite numbers as null.

              return isFinite(value) ? String(value) : 'null';

          case 'boolean':
          case 'null':

      // If the value is a boolean or null, convert it to a string. Note:
      // typeof null does not produce 'null'. The case is included here in
      // the remote chance that this gets fixed someday.

              return String(value);

      // If the type is 'object', we might be dealing with an object or an array or
      // null.

          case 'object':

      // Due to a specification blunder in ECMAScript, typeof null is 'object',
      // so watch out for that case.

              if (!value) {
                  return 'null';
              }

      // Make an array to hold the partial results of stringifying this object value.

              gap += indent;
              partial = [];

      // Is the value an array?

              if (Object.prototype.toString.apply(value) === '[object Array]') {

      // The value is an array. Stringify every element. Use null as a placeholder
      // for non-JSON values.

                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                      partial[i] = str(i, value) || 'null';
                  }

      // Join all of the elements together, separated with commas, and wrap them in
      // brackets.

                  v = partial.length === 0 ? '[]' :
                      gap ? '[\n' + gap +
                          partial.join(',\n' + gap) + '\n' +
                          mind + ']' :
                          '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
              }

      // If the replacer is an array, use it to select the members to be stringified.

              if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                      k = rep[i];
                      if (typeof k === 'string') {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              } else {

      // Otherwise, iterate through all of the keys in the object.

                  for (k in value) {
                      if (Object.hasOwnProperty.call(value, k)) {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              }

      // Join all of the member texts together, separated with commas,
      // and wrap them in braces.

              v = partial.length === 0 ? '{}' :
                  gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                      mind + '}' : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
      }
  }

  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

      // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
          (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.

      return str('', {'': value});
      };
    }

  function looseParse(data){
    try{
      return new Function('return ' + data + ';')();
    }catch(e){
      throw 'Json parse error!';
    }
  }
 /**
	* JSON 格式化
  * @class BUI.JSON
	* @singleton
  */
  var JSON = {
    /**
     * 转成json 等同于$.parseJSON
     * @method
     * @param {String} jsonstring 合法的json 字符串
     */
    parse : $.parseJSON,
    /**
     * 业务中有些字符串组成的json数据不是严格的json数据，如使用单引号，或者属性名不是字符串
     * 如 ： {a:'abc'}
     * @method 
     * @param {String} jsonstring
     */
    looseParse : looseParse,
    /**
     * 将Json转成字符串
     * @method 
     * @param {Object} json json 对象
     */
    stringify : JSON.stringify
  }

  return JSON;
});/**
 * @fileOverview 键盘值
 * @ignore
 */

define('bui/keycode',function () {
  
  /**
   * 键盘按键对应的数字值
   * @class BUI.KeyCode
   * @singleton
   */
  var keyCode = {
    /** Key constant @type Number */
    BACKSPACE: 8,
    /** Key constant @type Number */
    TAB: 9,
    /** Key constant @type Number */
    NUM_CENTER: 12,
    /** Key constant @type Number */
    ENTER: 13,
    /** Key constant @type Number */
    RETURN: 13,
    /** Key constant @type Number */
    SHIFT: 16,
    /** Key constant @type Number */
    CTRL: 17,
    /** Key constant @type Number */
    ALT: 18,
    /** Key constant @type Number */
    PAUSE: 19,
    /** Key constant @type Number */
    CAPS_LOCK: 20,
    /** Key constant @type Number */
    ESC: 27,
    /** Key constant @type Number */
    SPACE: 32,
    /** Key constant @type Number */
    PAGE_UP: 33,
    /** Key constant @type Number */
    PAGE_DOWN: 34,
    /** Key constant @type Number */
    END: 35,
    /** Key constant @type Number */
    HOME: 36,
    /** Key constant @type Number */
    LEFT: 37,
    /** Key constant @type Number */
    UP: 38,
    /** Key constant @type Number */
    RIGHT: 39,
    /** Key constant @type Number */
    DOWN: 40,
    /** Key constant @type Number */
    PRINT_SCREEN: 44,
    /** Key constant @type Number */
    INSERT: 45,
    /** Key constant @type Number */
    DELETE: 46,
    /** Key constant @type Number */
    ZERO: 48,
    /** Key constant @type Number */
    ONE: 49,
    /** Key constant @type Number */
    TWO: 50,
    /** Key constant @type Number */
    THREE: 51,
    /** Key constant @type Number */
    FOUR: 52,
    /** Key constant @type Number */
    FIVE: 53,
    /** Key constant @type Number */
    SIX: 54,
    /** Key constant @type Number */
    SEVEN: 55,
    /** Key constant @type Number */
    EIGHT: 56,
    /** Key constant @type Number */
    NINE: 57,
    /** Key constant @type Number */
    A: 65,
    /** Key constant @type Number */
    B: 66,
    /** Key constant @type Number */
    C: 67,
    /** Key constant @type Number */
    D: 68,
    /** Key constant @type Number */
    E: 69,
    /** Key constant @type Number */
    F: 70,
    /** Key constant @type Number */
    G: 71,
    /** Key constant @type Number */
    H: 72,
    /** Key constant @type Number */
    I: 73,
    /** Key constant @type Number */
    J: 74,
    /** Key constant @type Number */
    K: 75,
    /** Key constant @type Number */
    L: 76,
    /** Key constant @type Number */
    M: 77,
    /** Key constant @type Number */
    N: 78,
    /** Key constant @type Number */
    O: 79,
    /** Key constant @type Number */
    P: 80,
    /** Key constant @type Number */
    Q: 81,
    /** Key constant @type Number */
    R: 82,
    /** Key constant @type Number */
    S: 83,
    /** Key constant @type Number */
    T: 84,
    /** Key constant @type Number */
    U: 85,
    /** Key constant @type Number */
    V: 86,
    /** Key constant @type Number */
    W: 87,
    /** Key constant @type Number */
    X: 88,
    /** Key constant @type Number */
    Y: 89,
    /** Key constant @type Number */
    Z: 90,
    /** Key constant @type Number */
    CONTEXT_MENU: 93,
    /** Key constant @type Number */
    NUM_ZERO: 96,
    /** Key constant @type Number */
    NUM_ONE: 97,
    /** Key constant @type Number */
    NUM_TWO: 98,
    /** Key constant @type Number */
    NUM_THREE: 99,
    /** Key constant @type Number */
    NUM_FOUR: 100,
    /** Key constant @type Number */
    NUM_FIVE: 101,
    /** Key constant @type Number */
    NUM_SIX: 102,
    /** Key constant @type Number */
    NUM_SEVEN: 103,
    /** Key constant @type Number */
    NUM_EIGHT: 104,
    /** Key constant @type Number */
    NUM_NINE: 105,
    /** Key constant @type Number */
    NUM_MULTIPLY: 106,
    /** Key constant @type Number */
    NUM_PLUS: 107,
    /** Key constant @type Number */
    NUM_MINUS: 109,
    /** Key constant @type Number */
    NUM_PERIOD: 110,
    /** Key constant @type Number */
    NUM_DIVISION: 111,
    /** Key constant @type Number */
    F1: 112,
    /** Key constant @type Number */
    F2: 113,
    /** Key constant @type Number */
    F3: 114,
    /** Key constant @type Number */
    F4: 115,
    /** Key constant @type Number */
    F5: 116,
    /** Key constant @type Number */
    F6: 117,
    /** Key constant @type Number */
    F7: 118,
    /** Key constant @type Number */
    F8: 119,
    /** Key constant @type Number */
    F9: 120,
    /** Key constant @type Number */
    F10: 121,
    /** Key constant @type Number */
    F11: 122,
    /** Key constant @type Number */
    F12: 123
  };

  return keyCode;
});/*
 * @fileOverview Date Format 1.2.3
 * @ignore
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 *
 * Last modified by jayli 拔赤 2010-09-09
 * - 增加中文的支持
 * - 简单的本地化，对w（星期x）的支持
 * 
 */
define('bui/date', function () {

    var dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;

    function dateParse(val, format) {
		if(val instanceof Date){
			return val;
		}
		if (typeof(format)=="undefined" || format==null || format=="") {
			var checkList=new Array('y-m-d','yyyy-mm-dd','yyyy-mm-dd HH:MM:ss','H:M:s');
			for (var i=0; i<checkList.length; i++) {
					var d=dateParse(val,checkList[i]);
					if (d!=null) { 
						return d; 
					}
			}
			return null;
		};
        val = val + "";
        var i_val = 0;
        var i_format = 0;
        var c = "";
        var token = "";
        var x, y;
        var now = new Date();
        var year = now.getYear();
        var month = now.getMonth() + 1;
        var date = 1;
        var hh = 00;
        var mm = 00;
        var ss = 00;
        this.isInteger = function(val) {
            return /^\d*$/.test(val);
		};
		this.getInt = function(str,i,minlength,maxlength) {
			for (var x=maxlength; x>=minlength; x--) {
				var token=str.substring(i,i+x);
				if (token.length < minlength) { 
					return null; 
				}
				if (this.isInteger(token)) { 
					return token; 
				}
			}
		return null;
		};

        while (i_format < format.length) {
            c = format.charAt(i_format);
            token = "";
            while ((format.charAt(i_format) == c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            if (token=="yyyy" || token=="yy" || token=="y") {
				if (token=="yyyy") { 
					x=4;y=4; 
				}
				if (token=="yy") { 
					x=2;y=2; 
				}
				if (token=="y") { 
					x=2;y=4; 
				}
				year=this.getInt(val,i_val,x,y);
				if (year==null) { 
					return null; 
				}
				i_val += year.length;
				if (year.length==2) {
                    year = year>70?1900+(year-0):2000+(year-0);
				}
			}
            else if (token=="mm"||token=="m") {
				month=this.getInt(val,i_val,token.length,2);
				if(month==null||(month<1)||(month>12)){
					return null;
				}
				i_val+=month.length;
			}
			else if (token=="dd"||token=="d") {
				date=this.getInt(val,i_val,token.length,2);
				if(date==null||(date<1)||(date>31)){
					return null;
				}
				i_val+=date.length;
			}
			else if (token=="hh"||token=="h") {
				hh=this.getInt(val,i_val,token.length,2);
				if(hh==null||(hh<1)||(hh>12)){
					return null;
				}
				i_val+=hh.length;
			}
			else if (token=="HH"||token=="H") {
				hh=this.getInt(val,i_val,token.length,2);
				if(hh==null||(hh<0)||(hh>23)){
					return null;
				}
				i_val+=hh.length;
			}
			else if (token=="MM"||token=="M") {
				mm=this.getInt(val,i_val,token.length,2);
				if(mm==null||(mm<0)||(mm>59)){
					return null;
				}
				i_val+=mm.length;
			}
			else if (token=="ss"||token=="s") {
				ss=this.getInt(val,i_val,token.length,2);
				if(ss==null||(ss<0)||(ss>59)){
					return null;
				}
				i_val+=ss.length;
			}
			else {
				if (val.substring(i_val,i_val+token.length)!=token) {
					return null;
				}
				else {
					i_val+=token.length;
				}
			}
		}
		if (i_val != val.length) { 
			return null; 
		}
		if (month==2) {
			if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
				if (date > 29){ 
					return null; 
				}
			}
			else { 
				if (date > 28) { 
					return null; 
				} 
			}
		}
		if ((month==4)||(month==6)||(month==9)||(month==11)) {
			if (date > 30) { 
				return null; 
			}
		}
		return new Date(year,month-1,date,hh,mm,ss);
    }

    function DateAdd(strInterval, NumDay, dtDate) {
        var dtTmp = new Date(dtDate);
        if (isNaN(dtTmp)) {
            dtTmp = new Date();
        }
        NumDay = parseInt(NumDay,10);
        switch (strInterval) {
            case   's':
                dtTmp = new Date(dtTmp.getTime() + (1000 * NumDay));
                break;
            case   'n':
                dtTmp = new Date(dtTmp.getTime() + (60000 * NumDay));
                break;
            case   'h':
                dtTmp = new Date(dtTmp.getTime() + (3600000 * NumDay));
                break;
            case   'd':
                dtTmp = new Date(dtTmp.getTime() + (86400000 * NumDay));
                break;
            case   'w':
                dtTmp = new Date(dtTmp.getTime() + ((86400000 * 7) * NumDay));
                break;
            case   'm':
                dtTmp = new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + NumDay, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                break;
            case   'y':
                //alert(dtTmp.getFullYear());
                dtTmp = new Date(dtTmp.getFullYear() + NumDay, dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
                //alert(dtTmp);
                break;
        }
        return dtTmp;
    }

    var dateFormat = function () {
        var token = /w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = '0' + val;
                }
                return val;
            },
            // Some common format strings
            masks = {
                'default':'ddd mmm dd yyyy HH:MM:ss',
                shortDate:'m/d/yy',
                //mediumDate:     'mmm d, yyyy',
                longDate:'mmmm d, yyyy',
                fullDate:'dddd, mmmm d, yyyy',
                shortTime:'h:MM TT',
                //mediumTime:     'h:MM:ss TT',
                longTime:'h:MM:ss TT Z',
                isoDate:'yyyy-mm-dd',
                isoTime:'HH:MM:ss',
                isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",
                isoUTCDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",

                //added by jayli
                localShortDate:'yy年mm月dd日',
                localShortDateTime:'yy年mm月dd日 hh:MM:ss TT',
                localLongDate:'yyyy年mm月dd日',
                localLongDateTime:'yyyy年mm月dd日 hh:MM:ss TT',
                localFullDate:'yyyy年mm月dd日 w',
                localFullDateTime:'yyyy年mm月dd日 w hh:MM:ss TT'

            },

            // Internationalization strings
            i18n = {
                dayNames:[
                    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
                    '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'
                ],
                monthNames:[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ]
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                throw SyntaxError('invalid date');
            }

            mask = String(masks[mask] || mask || masks['default']);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) === 'UTC:') {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? 'getUTC' : 'get',
                d = date[_ + 'Date'](),
                D = date[_ + 'Day'](),
                m = date[_ + 'Month'](),
                y = date[_ + 'FullYear'](),
                H = date[_ + 'Hours'](),
                M = date[_ + 'Minutes'](),
                s = date[_ + 'Seconds'](),
                L = date[_ + 'Milliseconds'](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:d,
                    dd:pad(d, undefined),
                    ddd:i18n.dayNames[D],
                    dddd:i18n.dayNames[D + 7],
                    w:i18n.dayNames[D + 14],
                    m:m + 1,
                    mm:pad(m + 1, undefined),
                    mmm:i18n.monthNames[m],
                    mmmm:i18n.monthNames[m + 12],
                    yy:String(y).slice(2),
                    yyyy:y,
                    h:H % 12 || 12,
                    hh:pad(H % 12 || 12, undefined),
                    H:H,
                    HH:pad(H, undefined),
                    M:M,
                    MM:pad(M, undefined),
                    s:s,
                    ss:pad(s, undefined),
                    l:pad(L, 3),
                    L:pad(L > 99 ? Math.round(L / 10) : L, undefined),
                    t:H < 12 ? 'a' : 'p',
                    tt:H < 12 ? 'am' : 'pm',
                    T:H < 12 ? 'A' : 'P',
                    TT:H < 12 ? 'AM' : 'PM',
                    Z:utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                    o:(o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    /**
     * 日期的工具方法
     * @class BUI.Date
     */
    var DateUtil = {
        /**
         * 日期加法
         * @param {String} strInterval 加法的类型，s(秒),n(分),h(时),d(天),w(周),m(月),y(年)
         * @param {Number} Num         数量，如果为负数，则为减法
         * @param {Date} dtDate      起始日期，默认为此时
         */
        add: function (strInterval, Num, dtDate) {
            return DateAdd(strInterval, Num, dtDate);
        },
        /**
         * 小时的加法
         * @param {Number} hours 小时
         * @param {Date} date 起始日期
         */
        addHour: function (hours, date) {
            return DateAdd('h', hours, date);
        },
        /**
         * 分的加法
         * @param {Number} minutes 分
         * @param {Date} date 起始日期
         */
        addMinute: function (minutes, date) {
            return DateAdd('n', minutes, date);
        },
        /**
         * 秒的加法
         * @param {Number} seconds 秒
         * @param {Date} date 起始日期
         */
        addSecond: function (seconds, date) {
            return DateAdd('s', seconds, date);
        },
        /**
         * 天的加法
         * @param {Number} days 天数
         * @param {Date} date 起始日期
         */
        addDay: function (days, date) {
            return DateAdd('d', days, date);
        },
        /**
         * 增加周
         * @param {Number} weeks 周数
         * @param {Date} date  起始日期
         */
        addWeek: function (weeks, date) {
            return DateAdd('w', weeks, date);
        },
        /**
         * 增加月
         * @param {Number} months 月数
         * @param {Date} date  起始日期
         */
        addMonths: function (months, date) {
            return DateAdd('m', months, date);
        },
        /**
         * 增加年
         * @param {Number} years 年数
         * @param {Date} date  起始日期
         */
        addYear: function (years, date) {
            return DateAdd('y', years, date);
        },
        /**
         * 日期是否相等，忽略时间
         * @param  {Date}  d1 日期对象
         * @param  {Date}  d2 日期对象
         * @return {Boolean}    是否相等
         */
        isDateEquals: function (d1, d2) {

            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        },
        /**
         * 日期时间是否相等，包含时间
         * @param  {Date}  d1 日期对象
         * @param  {Date}  d2 日期对象
         * @return {Boolean}    是否相等
         */
        isEquals: function (d1, d2) {
            if (d1 == d2) {
                return true;
            }
            if (!d1 || !d2) {
                return false;
            }
            if (!d1.getTime || !d2.getTime) {
                return false;
            }
            return d1.getTime() == d2.getTime();
        },
        /**
         * 字符串是否是有效的日期类型
         * @param {String} str 字符串
         * @return 字符串是否能转换成日期
         */
        isDateString: function (str) {
            return dateRegex.test(str);
        },
        /**
         * 将日期格式化成字符串
         * @param  {Date} date 日期
         * @param  {String} mask 格式化方式
         * @param  {Date} utc  是否utc时间
         * @return {String}      日期的字符串
         */
        format: function (date, mask, utc) {
            return dateFormat(date, mask, utc);
        },
        /**
         * 转换成日期
         * @param  {String|Date} date 字符串或者日期
         * @param  {String} dateMask  日期的格式,如:yyyy-MM-dd
         * @return {Date}      日期对象
         */
        parse: function (date, s) {
            if(BUI.isString(date)){
                date = date.replace('\/','-');
            }
            return dateParse(date, s);
        },
        /**
         * 当前天
         * @return {Date} 当前天 00:00:00
         */
        today: function () {
            var now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        },
        /**
         * 返回当前日期
         * @return {Date} 日期的 00:00:00
         */
        getDate: function (date) {
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
        }
    };

    return DateUtil;
});/**
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
});/**
 * @fileOverview Component命名空间的入口文件
 * @ignore
 */

define('bui/component',['bui/component/manage','bui/component/uibase','bui/component/view','bui/component/controller'],function (require) {
  /**
   * @class BUI.Component
   * <p>
   * <img src="../assets/img/class-common.jpg"/>
   * </p>
   * 控件基类的命名空间
   */
  var Component = {};

  BUI.mix(Component,{
    Manager : require('bui/component/manage'),
    UIBase : require('bui/component/uibase'),
    View : require('bui/component/view'),
    Controller : require('bui/component/controller')
  });

  function create(component, self) {
    var childConstructor, xclass;
    if (component && (xclass = component.xclass)) {
        if (self && !component.prefixCls) {
            component.prefixCls = self.get('prefixCls');
        }
        childConstructor = Component.Manager.getConstructorByXClass(xclass);
        if (!childConstructor) {
            BUI.error('can not find class by xclass desc : ' + xclass);
        }
        component = new childConstructor(component);
    }
    return component;
  }

  /**
   * 根据Xclass创建对象
   * @method
   * @static
   * @param  {Object} component 控件的配置项或者控件
   * @param  {Object} self      父类实例
   * @return {Object} 实例对象
   */
  Component.create = create;

  return Component;
});/**
 * @fileOverview  Base UI控件的管理类
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */



//控件类的管理器
define('bui/component/manage',function(require){

    var uis = {
        // 不带前缀 prefixCls
        /*
         "menu" :{
         priority:0,
         constructor:Menu
         }
         */
    };

    function getConstructorByXClass(cls) {
        var cs = cls.split(/\s+/), 
            p = -1, 
            t, 
            ui = null;
        for (var i = 0; i < cs.length; i++) {
            var uic = uis[cs[i]];
            if (uic && (t = uic.priority) > p) {
                p = t;
                ui = uic.constructor;
            }
        }
        return ui;
    }

    function getXClassByConstructor(constructor) {
        for (var u in uis) {
            var ui = uis[u];
            if (ui.constructor == constructor) {
                return u;
            }
        }
        return 0;
    }

    function setConstructorByXClass(cls, uic) {
        if (BUI.isFunction(uic)) {
            uis[cls] = {
                constructor:uic,
                priority:0
            };
        } else {
            uic.priority = uic.priority || 0;
            uis[cls] = uic;
        }
    }


    function getCssClassWithPrefix(cls) {
        var cs = $.trim(cls).split(/\s+/);
        for (var i = 0; i < cs.length; i++) {
            if (cs[i]) {
                cs[i] = this.get('prefixCls') + cs[i];
            }
        }
        return cs.join(' ');
    }



    var componentInstances = {};

    /**
     * Manage component metadata.
     * @class BUI.Component.Manager
     * @singleton
     */
    var Manager ={

        __instances:componentInstances,
        /**
         * 每实例化一个控件，就注册到管理器上
         * @param {String} id  控件 id
         * @param {BUI.Component.Controller} component 控件对象
         */
        addComponent:function (id, component) {
            componentInstances[id] = component;
        },
        /**
         * 移除注册的控件
         * @param  {String} id 控件 id
         */
        removeComponent:function (id) {
            delete componentInstances[id];
        },
        /**
         * 遍历所有的控件
         * @param  {Function} fn 遍历函数
         */
        eachComponent : function(fn){
            BUI.each(componentInstances,fn);
        },
        /**
         * 根据Id获取控件
         * @param  {String} id 编号
         * @return {BUI.Component.UIBase}   继承 UIBase的类对象
         */
        getComponent:function (id) {
            return componentInstances[id];
        },

        getCssClassWithPrefix:getCssClassWithPrefix,
        /**
         * 通过构造函数获取xclass.
         * @param {Function} constructor 控件的构造函数.
         * @type {Function}
         * @return {String}
         * @method
         */
        getXClassByConstructor:getXClassByConstructor,
        /**
         * 通过xclass获取控件的构造函数
         * @param {String} classNames Class names separated by space.
         * @type {Function}
         * @return {Function}
         * @method
         */
        getConstructorByXClass:getConstructorByXClass,
        /**
         * 将 xclass 同构造函数相关联.
         * @type {Function}
         * @param {String} className 控件的xclass名称.
         * @param {Function} componentConstructor 构造函数
         * @method
         */
        setConstructorByXClass:setConstructorByXClass
    };

    return Manager;
});/**
 * @fileOverview uibase的入口文件
 * @ignore
 */
;(function(){
var BASE = 'bui/component/uibase/';
define('bui/component/uibase',[BASE + 'base',BASE + 'align',BASE + 'autoshow',BASE + 'autohide',
    BASE + 'close',BASE + 'collapsable',BASE + 'drag',BASE + 'keynav',BASE + 'list',
    BASE + 'listitem',BASE + 'mask',BASE + 'position',BASE + 'selection',BASE + 'stdmod',
    BASE + 'decorate',BASE + 'tpl',BASE + 'childcfg',BASE + 'bindable',BASE + 'depends'],function(r){

  var UIBase = r(BASE + 'base');
    
  BUI.mix(UIBase,{
    Align : r(BASE + 'align'),
    AutoShow : r(BASE + 'autoshow'),
    AutoHide : r(BASE + 'autohide'),
    Close : r(BASE + 'close'),
    Collapsable : r(BASE + 'collapsable'),
    Drag : r(BASE + 'drag'),
    KeyNav : r(BASE + 'keynav'),
    List : r(BASE + 'list'),
    ListItem : r(BASE + 'listitem'),
    Mask : r(BASE + 'mask'),
    Position : r(BASE + 'position'),
    Selection : r(BASE + 'selection'),
    StdMod : r(BASE + 'stdmod'),
    Decorate : r(BASE + 'decorate'),
    Tpl : r(BASE + 'tpl'),
    ChildCfg : r(BASE + 'childcfg'),
    Bindable : r(BASE + 'bindable'),
    Depends : r(BASE + 'depends')
  });

  BUI.mix(UIBase,{
    CloseView : UIBase.Close.View,
    CollapsableView : UIBase.Collapsable.View,
    ChildList : UIBase.List.ChildList,
    /*DomList : UIBase.List.DomList,
    DomListView : UIBase.List.DomList.View,*/
    ListItemView : UIBase.ListItem.View,
    MaskView : UIBase.Mask.View,
    PositionView : UIBase.Position.View,
    StdModView : UIBase.StdMod.View,
    TplView : UIBase.Tpl.View
  });
  return UIBase;
});   
})();
/**
 * @fileOverview  UI控件的流程控制
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/base',['bui/component/manage'],function(require){

  var Manager = require('bui/component/manage'),
   
    UI_SET = '_uiSet',
        ATTRS = 'ATTRS',
        ucfirst = BUI.ucfirst,
        noop = $.noop,
        Base = require('bui/base');
   /**
     * 模拟多继承
     * init attr using constructors ATTRS meta info
     * @ignore
     */
    function initHierarchy(host, config) {
        callMethodByHierarchy(host, 'initializer', 'constructor');
    }

    function callMethodByHierarchy(host, mainMethod, extMethod) {
        var c = host.constructor,
            extChains = [],
            ext,
            main,
            exts,
            t;

        // define
        while (c) {

            // 收集扩展类
            t = [];
            if (exts = c.mixins) {
                for (var i = 0; i < exts.length; i++) {
                    ext = exts[i];
                    if (ext) {
                        if (extMethod != 'constructor') {
                            //只调用真正自己构造器原型的定义，继承原型链上的不要管
                            if (ext.prototype.hasOwnProperty(extMethod)) {
                                ext = ext.prototype[extMethod];
                            } else {
                                ext = null;
                            }
                        }
                        ext && t.push(ext);
                    }
                }
            }

            // 收集主类
            // 只调用真正自己构造器原型的定义，继承原型链上的不要管 !important
            // 所以不用自己在 renderUI 中调用 superclass.renderUI 了，UIBase 构造器自动搜寻
            // 以及 initializer 等同理
            if (c.prototype.hasOwnProperty(mainMethod) && (main = c.prototype[mainMethod])) {
                t.push(main);
            }

            // 原地 reverse
            if (t.length) {
                extChains.push.apply(extChains, t.reverse());
            }

            c = c.superclass && c.superclass.constructor;
        }

        // 初始化函数
        // 顺序：父类的所有扩展类函数 -> 父类对应函数 -> 子类的所有扩展函数 -> 子类对应函数
        for (i = extChains.length - 1; i >= 0; i--) {
            extChains[i] && extChains[i].call(host);
        }
    }

     /**
     * 销毁组件顺序： 子类 destructor -> 子类扩展 destructor -> 父类 destructor -> 父类扩展 destructor
     * @ignore
     */
    function destroyHierarchy(host) {
        var c = host.constructor,
            extensions,
            d,
            i;

        while (c) {
            // 只触发该类真正的析构器，和父亲没关系，所以不要在子类析构器中调用 superclass
            if (c.prototype.hasOwnProperty('destructor')) {
                c.prototype.destructor.apply(host);
            }

            if ((extensions = c.mixins)) {
                for (i = extensions.length - 1; i >= 0; i--) {
                    d = extensions[i] && extensions[i].prototype.__destructor;
                    d && d.apply(host);
                }
            }

            c = c.superclass && c.superclass.constructor;
        }
    }

    /**
     * 构建 插件
     * @ignore
     */
    function constructPlugins(plugins) {
        if(!plugins){
        return;
        }
        BUI.each(plugins, function (plugin,i) {
            if (BUI.isFunction(plugin)) {
                plugins[i] = new plugin();
            }
        });
    }

    /**
     * 调用插件的方法
     * @ignore
     */
    function actionPlugins(self, plugins, action) {
        if(!plugins){
        return;
        }
        BUI.each(plugins, function (plugin,i) {
            if (plugin[action]) {
                plugin[action](self);
            }
        });
    }

     /**
     * 根据属性变化设置 UI
     * @ignore
     */
    function bindUI(self) {
        /*var attrs = self.getAttrs(),
            attr,
            m;

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                m = UI_SET + ucfirst(attr);
                if (self[m]) {
                    // 自动绑定事件到对应函数
                    (function (attr, m) {
                        self.on('after' + ucfirst(attr) + 'Change', function (ev) {
                            // fix! 防止冒泡过来的
                            if (ev.target === self) {
                                self[m](ev.newVal, ev);
                            }
                        });
                    })(attr, m);
                }
            }
        }
        */
    }

        /**
     * 根据当前（初始化）状态来设置 UI
     * @ignore
     */
    function syncUI(self) {
        var v,
            f,
            attrs = self.getAttrs();
        for (var a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                var m = UI_SET + ucfirst(a);
                //存在方法，并且用户设置了初始值或者存在默认值，就同步状态
                if ((f = self[m])
                    // 用户如果设置了显式不同步，就不同步，比如一些值从 html 中读取，不需要同步再次设置
                    && attrs[a].sync !== false
                    && (v = self.get(a)) !== undefined) {
                    f.call(self, v);
                }
            }
        }
    }

  /**
   * 控件库的基类，包括控件的生命周期,下面是基本的扩展类
   * <p>
   * <img src="https://dxq613.github.io/assets/img/class-mixins.jpg"/>
   * </p>
   * @class BUI.Component.UIBase
   * @extends BUI.Base
   * @param  {Object} config 配置项
   */
  var UIBase = function(config){

     var _self = this, 
      id;

        // 读取用户设置的属性值并设置到自身
        Base.apply(_self, arguments);

        //保存用户传入的配置项
        _self.setInternal('userConfig',config);
        // 按照类层次执行初始函数，主类执行 initializer 函数，扩展类执行构造器函数
        initHierarchy(_self, config);

        var listener,
            n,
            plugins = _self.get('plugins')/*,
            listeners = _self.get('listeners')*/;

        constructPlugins(plugins);
    
        var xclass= _self.get('xclass');
        if(xclass){
          _self.__xclass = xclass;//debug 方便
        }
        actionPlugins(_self, plugins, 'initializer');

        // 是否自动渲染
        config && config.autoRender && _self.render();

  };

  UIBase.ATTRS = 
  {
    
    
    /**
     * 用户传入的配置项
     * @type {Object}
     * @readOnly
     * @protected
     */
    userConfig : {

    },
    /**
     * 是否自动渲染,如果不自动渲染，需要用户调用 render()方法
     * <pre><code>
     *  //默认状态下创建对象，并没有进行render
     *  var control = new Control();
     *  control.render(); //需要调用render方法
     *
     *  //设置autoRender后，不需要调用render方法
     *  var control = new Control({
     *   autoRender : true
     *  });
     * </code></pre>
     * @cfg {Boolean} autoRender
     */
    /**
     * 是否自动渲染,如果不自动渲染，需要用户调用 render()方法
     * @type {Boolean}
     * @ignore
     */
    autoRender : {
      value : false
    },
    /**
     * @type {Object}
     * 事件处理函数:
     *      {
     *        'click':function(e){}
     *      }
     *  @ignore
     */
    listeners: {
        value: {}
    },
    /**
     * 插件集合
     * <pre><code>
     *  var grid = new Grid({
     *    columns : [{},{}],
     *    plugins : [Grid.Plugins.RadioSelection]
     *  });
     * </code></pre>
     * @cfg {Array} plugins
     */
    /**
     * 插件集合
     * @type {Array}
     * @readOnly
     */
    plugins : {
      //value : []
    },
    /**
     * 是否已经渲染完成
     * @type {Boolean}
     * @default  false
     * @readOnly
     */
    rendered : {
        value : false
    },
    /**
    * 获取控件的 xclass
    * @readOnly
    * @type {String}
    * @protected
    */
    xclass: {
        valueFn: function () {
            return Manager.getXClassByConstructor(this.constructor);
        }
    }
  };
  
  BUI.extend(UIBase,Base);

  BUI.augment(UIBase,
  {
    /**
     * 创建DOM结构
     * @protected
     */
    create : function(){
      var self = this;
            // 是否生成过节点
            if (!self.get('created')) {
                /**
                 * @event beforeCreateDom
                 * fired before root node is created
                 * @param e
                 */
                self.fire('beforeCreateDom');
                callMethodByHierarchy(self, 'createDom', '__createDom');
                self._set('created', true);
                /**
                 * @event afterCreateDom
                 * fired when root node is created
                 * @param e
                 */
                self.fire('afterCreateDom');
                actionPlugins(self, self.get('plugins'), 'createDom');
            }
            return self;
    },
    /**
     * 渲染
     */
    render : function(){
      var _self = this;
            // 是否已经渲染过
            if (!_self.get('rendered')) {
                var plugins = _self.get('plugins');
                _self.create(undefined);
                _self.set('created',true);
                /**
                 * @event beforeRenderUI
                 * fired when root node is ready
                 * @param e
                 */
                _self.fire('beforeRenderUI');
                callMethodByHierarchy(_self, 'renderUI', '__renderUI');

                /**
                 * @event afterRenderUI
                 * fired after root node is rendered into dom
                 * @param e
                 */

                _self.fire('afterRenderUI');
                actionPlugins(_self, plugins, 'renderUI');

                /**
                 * @event beforeBindUI
                 * fired before UIBase 's internal event is bind.
                 * @param e
                 */

                _self.fire('beforeBindUI');
                bindUI(_self);
                callMethodByHierarchy(_self, 'bindUI', '__bindUI');
                _self.set('binded',true);
                /**
                 * @event afterBindUI
                 * fired when UIBase 's internal event is bind.
                 * @param e
                 */

                _self.fire('afterBindUI');
                actionPlugins(_self, plugins, 'bindUI');

                /**
                 * @event beforeSyncUI
                 * fired before UIBase 's internal state is synchronized.
                 * @param e
                 */

                _self.fire('beforeSyncUI');

                syncUI(_self);
                callMethodByHierarchy(_self, 'syncUI', '__syncUI');

                /**
                 * @event afterSyncUI
                 * fired after UIBase 's internal state is synchronized.
                 * @param e
                 */

                _self.fire('afterSyncUI');
                actionPlugins(_self, plugins, 'syncUI');
                _self._set('rendered', true);
            }
            return _self;
    },
    /**
     * 子类可继承此方法，当DOM创建时调用
     * @protected
     * @method
     */
    createDom : noop,
    /**
     * 子类可继承此方法，渲染UI时调用
     * @protected
     *  @method
     */
    renderUI : noop,
    /**
     * 子类可继承此方法,绑定事件时调用
     * @protected
     * @method
     */
    bindUI : noop,
    /**
     * 同步属性值到UI上
     * @protected
     * @method
     */
    syncUI : noop,

    /**
     * 析构函数
     */
    destroy: function () {
        var _self = this;
        if(_self.destroyed){ //防止返回销毁
            return _self;
        }
        /**
         * @event beforeDestroy
         * fired before UIBase 's destroy.
         * @param e
         */
        _self.fire('beforeDestroy');

        actionPlugins(_self, _self.get('plugins'), 'destructor');
        destroyHierarchy(_self);
         /**
         * @event afterDestroy
         * fired before UIBase 's destroy.
         * @param e
         */
        _self.fire('afterDestroy');
        _self.off();
        _self.clearAttrVals();
        _self.destroyed = true;
        return _self;
    } 
  });
    
  //延时处理构造函数
  function initConstuctor(c){
    var constructors = [];
    while(c.base){
        constructors.push(c);
        c = c.base;
    }
    for(var i = constructors.length - 1; i >=0 ; i--){
        var C = constructors[i];
        //BUI.extend(C,C.base,C.px,C.sx);
        BUI.mix(C.prototype,C.px);
        BUI.mix(C,C.sx);
        C.base = null;
        C.px = null;
        C.sx = null;
    }
  }
  
  BUI.mix(UIBase,
    {
    /**
     * 定义一个类
     * @static
     * @param  {Function} base   基类构造函数
     * @param  {Array} extensions 扩展
     * @param  {Object} px  原型链上的扩展
     * @param  {Object} sx  
     * @return {Function} 继承与基类的构造函数
     */
    define : function(base, extensions, px, sx){
          if ($.isPlainObject(extensions)) {
              sx = px;
              px = extensions;
              extensions = [];
          }

          function C() {
            var c = this.constructor;
            if(c.base){
                initConstuctor(c);
            }
            UIBase.apply(this, arguments);
          }

          BUI.extend(C, base);  //无法延迟
          C.base = base;
          C.px = px;//延迟复制原型链上的函数
          C.sx = sx;//延迟复制静态属性

          //BUI.mixin(C,extensions);
          if(extensions.length){ //延迟执行mixin
            C.extensions = extensions;
          }
         
          return C;
    },
    /**
     * 扩展一个类，基类就是类本身
     * @static
     * @param  {Array} extensions 扩展
     * @param  {Object} px  原型链上的扩展
     * @param  {Object} sx  
     * @return {Function} 继承与基类的构造函数
     */
    extend: function extend(extensions, px, sx) {
        var args = $.makeArray(arguments),
            ret,
            last = args[args.length - 1];
        args.unshift(this);
        if (last.xclass) {
            args.pop();
            args.push(last.xclass);
        }
        ret = UIBase.define.apply(UIBase, args);
        if (last.xclass) {
            var priority = last.priority || (this.priority ? (this.priority + 1) : 1);

            Manager.setConstructorByXClass(last.xclass, {
                constructor: ret,
                priority: priority
            });
            //方便调试
            ret.__xclass = last.xclass;
            ret.priority = priority;
            ret.toString = function(){
                return last.xclass;
            }
        }
        ret.extend = extend;
        return ret;
    }
  });

  return UIBase;
});
/**
 * @fileOverview 跟指定的元素项对齐的方式
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */


define('bui/component/uibase/align',['bui/ua'],function (require) {
    var UA = require('bui/ua'),
        CLS_ALIGN_PREFIX ='x-align-',
        win = window;

    // var ieMode = document.documentMode || UA.ie;

    /*
     inspired by closure library by Google
     see http://yiminghe.iteye.com/blog/1124720
     */

    /**
     * 得到会导致元素显示不全的祖先元素
     * @ignore
     */
    function getOffsetParent(element) {
        // ie 这个也不是完全可行
        /**
         <div style="width: 50px;height: 100px;overflow: hidden">
         <div style="width: 50px;height: 100px;position: relative;" id="d6">
         元素 6 高 100px 宽 50px<br/>
         </div>
         </div>
         @ignore
         **/
        // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
        //  In other browsers it only includes elements with position absolute, relative or
        // fixed, not elements with overflow set to auto or scroll.
        //        if (UA.ie && ieMode < 8) {
        //            return element.offsetParent;
        //        }
                // 统一的 offsetParent 方法
        var doc = element.ownerDocument,
            body = doc.body,
            parent,
            positionStyle = $(element).css('position'),
            skipStatic = positionStyle == 'fixed' || positionStyle == 'absolute';

        if (!skipStatic) {
            return element.nodeName.toLowerCase() == 'html' ? null : element.parentNode;
        }

        for (parent = element.parentNode; parent && parent != body; parent = parent.parentNode) {
            positionStyle = $(parent).css('position');
            if (positionStyle != 'static') {
                return parent;
            }
        }
        return null;
    }

    /**
     * 获得元素的显示部分的区域
     * @private
     * @ignore
     */
    function getVisibleRectForElement(element) {
        var visibleRect = {
                left:0,
                right:Infinity,
                top:0,
                bottom:Infinity
            },
            el,
            scrollX,
            scrollY,
            winSize,
            doc = element.ownerDocument,
            body = doc.body,
            documentElement = doc.documentElement;

        // Determine the size of the visible rect by climbing the dom accounting for
        // all scrollable containers.
        for (el = element; el = getOffsetParent(el);) {
            // clientWidth is zero for inline block elements in ie.
            if ((!UA.ie || el.clientWidth != 0) &&
                // body may have overflow set on it, yet we still get the entire
                // viewport. In some browsers, el.offsetParent may be
                // document.documentElement, so check for that too.
                (el != body && el != documentElement && $(el).css('overflow') != 'visible')) {
                var pos = $(el).offset();
                // add border
                pos.left += el.clientLeft;
                pos.top += el.clientTop;

                visibleRect.top = Math.max(visibleRect.top, pos.top);
                visibleRect.right = Math.min(visibleRect.right,
                    // consider area without scrollBar
                    pos.left + el.clientWidth);
                visibleRect.bottom = Math.min(visibleRect.bottom,
                    pos.top + el.clientHeight);
                visibleRect.left = Math.max(visibleRect.left, pos.left);
            }
        }

        // Clip by window's viewport.
        scrollX = $(win).scrollLeft();
        scrollY = $(win).scrollTop();
        visibleRect.left = Math.max(visibleRect.left, scrollX);
        visibleRect.top = Math.max(visibleRect.top, scrollY);
        winSize = {
            width:BUI.viewportWidth(),
            height:BUI.viewportHeight()
        };
        visibleRect.right = Math.min(visibleRect.right, scrollX + winSize.width);
        visibleRect.bottom = Math.min(visibleRect.bottom, scrollY + winSize.height);
        return visibleRect.top >= 0 && visibleRect.left >= 0 &&
            visibleRect.bottom > visibleRect.top &&
            visibleRect.right > visibleRect.left ?
            visibleRect : null;
    }

    function getElFuturePos(elRegion, refNodeRegion, points, offset) {
        var xy,
            diff,
            p1,
            p2;

        xy = {
            left:elRegion.left,
            top:elRegion.top
        };

        p1 = getAlignOffset(refNodeRegion, points[0]);
        p2 = getAlignOffset(elRegion, points[1]);

        diff = [p2.left - p1.left, p2.top - p1.top];

        return {
            left:xy.left - diff[0] + (+offset[0]),
            top:xy.top - diff[1] + (+offset[1])
        };
    }

    function isFailX(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.left < visibleRect.left ||
            elFuturePos.left + elRegion.width > visibleRect.right;
    }

    function isFailY(elFuturePos, elRegion, visibleRect) {
        return elFuturePos.top < visibleRect.top ||
            elFuturePos.top + elRegion.height > visibleRect.bottom;
    }

    function adjustForViewport(elFuturePos, elRegion, visibleRect, overflow) {
        var pos = BUI.cloneObject(elFuturePos),
            size = {
                width:elRegion.width,
                height:elRegion.height
            };

        if (overflow.adjustX && pos.left < visibleRect.left) {
            pos.left = visibleRect.left;
        }

        // Left edge inside and right edge outside viewport, try to resize it.
        if (overflow['resizeWidth'] &&
            pos.left >= visibleRect.left &&
            pos.left + size.width > visibleRect.right) {
            size.width -= (pos.left + size.width) - visibleRect.right;
        }

        // Right edge outside viewport, try to move it.
        if (overflow.adjustX && pos.left + size.width > visibleRect.right) {
            // 保证左边界和可视区域左边界对齐
            pos.left = Math.max(visibleRect.right - size.width, visibleRect.left);
        }

        // Top edge outside viewport, try to move it.
        if (overflow.adjustY && pos.top < visibleRect.top) {
            pos.top = visibleRect.top;
        }

        // Top edge inside and bottom edge outside viewport, try to resize it.
        if (overflow['resizeHeight'] &&
            pos.top >= visibleRect.top &&
            pos.top + size.height > visibleRect.bottom) {
            size.height -= (pos.top + size.height) - visibleRect.bottom;
        }

        // Bottom edge outside viewport, try to move it.
        if (overflow.adjustY && pos.top + size.height > visibleRect.bottom) {
            // 保证上边界和可视区域上边界对齐
            pos.top = Math.max(visibleRect.bottom - size.height, visibleRect.top);
        }

        return BUI.mix(pos, size);
    }


    function flip(points, reg, map) {
        var ret = [];
        $.each(points, function (index,p) {
            ret.push(p.replace(reg, function (m) {
                return map[m];
            }));
        });
        return ret;
    }

    function flipOffset(offset, index) {
        offset[index] = -offset[index];
        return offset;
    }


    /**
     * @class BUI.Component.UIBase.Align
     * Align extension class.
     * Align component with specified element.
     * <img src="http://images.cnitblog.com/blog/111279/201304/09180221-201343d4265c46e7987e6b1c46d5461a.jpg"/>
     */
    function Align() {
    }


    Align.__getOffsetParent = getOffsetParent;

    Align.__getVisibleRectForElement = getVisibleRectForElement;

    Align.ATTRS =
    {
        /**
         * 对齐配置，详细说明请参看： <a href="http://www.cnblogs.com/zaohe/archive/2013/04/09/3010651.html">JS控件 对齐</a>
         * @cfg {Object} align
         * <pre><code>
         *  var overlay = new Overlay( {  
         *       align :{
         *         node: null,         // 参考元素, falsy 或 window 为可视区域, 'trigger' 为触发元素, 其他为指定元素
         *         points: ['cc','cc'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
         *         offset: [0, 0]      // 有效值为 [n, m]
         *       }
         *     }); 
         * </code></pre>
         */

        /**
         * 设置对齐属性
         * @type {Object}
         * @field
         * <code>
         *   var align =  {
         *        node: null,         // 参考元素, falsy 或 window 为可视区域, 'trigger' 为触发元素, 其他为指定元素
         *        points: ['cc','cc'], // ['tr', 'tl'] 表示 overlay 的 tl 与参考节点的 tr 对齐
         *        offset: [0, 0]      // 有效值为 [n, m]
         *     };
         *   overlay.set('align',align);
         * </code>
         */
        align:{
            shared : false,
            value:{}
        }
    };

    function getRegion(node) {
        var offset, w, h;
        if (node.length && !$.isWindow(node[0])) {
            offset = node.offset();
            w = node.outerWidth();
            h = node.outerHeight();
        } else {
            offset = { left:BUI.scrollLeft(), top:BUI.scrollTop() };
            w = BUI.viewportWidth();
            h = BUI.viewportHeight();
        }
        offset.width = w;
        offset.height = h;
        return offset;
    }

    /**
     * 获取 node 上的 align 对齐点 相对于页面的坐标
     * @param region
     * @param align
     */
    function getAlignOffset(region, align) {
        var V = align.charAt(0),
            H = align.charAt(1),
            w = region.width,
            h = region.height,
            x, y;

        x = region.left;
        y = region.top;

        if (V === 'c') {
            y += h / 2;
        } else if (V === 'b') {
            y += h;
        }

        if (H === 'c') {
            x += w / 2;
        } else if (H === 'r') {
            x += w;
        }

        return { left:x, top:y };
    }

    //清除对齐的css样式
    function clearAlignCls(el){
        var cls = el.attr('class'),
            regex = new RegExp('\s?'+CLS_ALIGN_PREFIX+'[a-z]{2}-[a-z]{2}','ig'),
            arr = regex.exec(cls);
        if(arr){
            el.removeClass(arr.join(' '));
        }
    }

    Align.prototype =
    {
        _uiSetAlign:function (v,ev) {
            var alignCls = '',
                el,   
                selfAlign; //points 的第二个参数，是自己对齐于其他节点的的方式
            if (v && v.points) {
                this.align(v.node, v.points, v.offset, v.overflow);
                this.set('cachePosition',null);
                el = this.get('el');
                clearAlignCls(el);
                selfAlign = v.points.join('-');
                alignCls = CLS_ALIGN_PREFIX + selfAlign;
                el.addClass(alignCls);
                /**/
            }
        },
        __bindUI : function(){
            var _self = this;
            
            _self.on('show',function(){
                $(window).on('resize',BUI.wrapBehavior(_self,'handleWindowResize'));
            });

            _self.on('hide',function(){
                $(window).off('resize',BUI.getWrapBehavior(_self,'handleWindowResize'));
            });
        },
        //处理window resize事件
        handleWindowResize : function(){
            var _self = this,
                align = _self.get('align');

            _self.set('align',align);
        },
        /*
         对齐 Overlay 到 node 的 points 点, 偏移 offset 处
         @method
         @ignore
         @param {Element} node 参照元素, 可取配置选项中的设置, 也可是一元素
         @param {String[]} points 对齐方式
         @param {Number[]} [offset] 偏移
         */
        align:function (refNode, points, offset, overflow) {
            refNode = $(refNode || win);
            offset = offset && [].concat(offset) || [0, 0];
            overflow = overflow || {};

            var self = this,
                el = self.get('el'),
                fail = 0,
            // 当前节点可以被放置的显示区域
                visibleRect = getVisibleRectForElement(el[0]),
            // 当前节点所占的区域, left/top/width/height
                elRegion = getRegion(el),
            // 参照节点所占的区域, left/top/width/height
                refNodeRegion = getRegion(refNode),
            // 当前节点将要被放置的位置
                elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset),
            // 当前节点将要所处的区域
                newElRegion = BUI.merge(elRegion, elFuturePos);

            // 如果可视区域不能完全放置当前节点时允许调整
            if (visibleRect && (overflow.adjustX || overflow.adjustY)) {

                // 如果横向不能放下
                if (isFailX(elFuturePos, elRegion, visibleRect)) {
                    fail = 1;
                    // 对齐位置反下
                    points = flip(points, /[lr]/ig, {
                        l:'r',
                        r:'l'
                    });
                    // 偏移量也反下
                    offset = flipOffset(offset, 0);
                }

                // 如果纵向不能放下
                if (isFailY(elFuturePos, elRegion, visibleRect)) {
                    fail = 1;
                    // 对齐位置反下
                    points = flip(points, /[tb]/ig, {
                        t:'b',
                        b:'t'
                    });
                    // 偏移量也反下
                    offset = flipOffset(offset, 1);
                }

                // 如果失败，重新计算当前节点将要被放置的位置
                if (fail) {
                    elFuturePos = getElFuturePos(elRegion, refNodeRegion, points, offset);
                    BUI.mix(newElRegion, elFuturePos);
                }

                var newOverflowCfg = {};

                // 检查反下后的位置是否可以放下了
                // 如果仍然放不下只有指定了可以调整当前方向才调整
                newOverflowCfg.adjustX = overflow.adjustX &&
                    isFailX(elFuturePos, elRegion, visibleRect);

                newOverflowCfg.adjustY = overflow.adjustY &&
                    isFailY(elFuturePos, elRegion, visibleRect);

                // 确实要调整，甚至可能会调整高度宽度
                if (newOverflowCfg.adjustX || newOverflowCfg.adjustY) {
                    newElRegion = adjustForViewport(elFuturePos, elRegion,
                        visibleRect, newOverflowCfg);
                }
            }

            // 新区域位置发生了变化
            if (newElRegion.left != elRegion.left) {
                self.setInternal('x', null);
                self.get('view').setInternal('x', null);
                self.set('x', newElRegion.left);
            }

            if (newElRegion.top != elRegion.top) {
                // https://github.com/kissyteam/kissy/issues/190
                // 相对于屏幕位置没变，而 left/top 变了
                // 例如 <div 'relative'><el absolute></div>
                // el.align(div)
                self.setInternal('y', null);
                self.get('view').setInternal('y', null);
                self.set('y', newElRegion.top);
            }

            // 新区域高宽发生了变化
            if (newElRegion.width != elRegion.width) {
                el.width(el.width() + newElRegion.width - elRegion.width);
            }
            if (newElRegion.height != elRegion.height) {
                el.height(el.height() + newElRegion.height - elRegion.height);
            }

            return self;
        },

        /**
         * 对齐到元素的中间，查看属性 {@link BUI.Component.UIBase.Align#property-align} .
         * <pre><code>
         *  control.center('#t1'); //控件处于容器#t1的中间位置
         * </code></pre>
         * @param {undefined|String|HTMLElement|jQuery} node
         * 
         */
        center:function (node) {
            var self = this;
            self.set('align', {
                node:node,
                points:['cc', 'cc'],
                offset:[0, 0]
            });
            return self;
        }
    };
    
  return Align;
});/**
 * @fileOverview click，focus,hover等引起控件显示，并且定位
 * @ignore
 */

define('bui/component/uibase/autoshow',function () {

  /**
   * 处理自动显示控件的扩展，一般用于显示menu,picker,tip等
   * @class BUI.Component.UIBase.AutoShow
   */
  function autoShow() {
    
  }

  autoShow.ATTRS = {

    /**
     * 触发显示控件的DOM选择器
     * <pre><code>
     *  var overlay = new Overlay({ //点击#t1时显示，点击#t1,overlay之外的元素隐藏
     *    trigger : '#t1',
     *    autoHide : true,
     *    content : '悬浮内容'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {HTMLElement|String|jQuery} trigger
     */
    /**
     * 触发显示控件的DOM选择器
     * @type {HTMLElement|String|jQuery}
     */
    trigger : {

    },
    delegateTigger : {
      getter : function(){
        this.get('delegateTrigger');//兼容之前的版本
      },
      setter : function(v){
        this.set('delegateTrigger',v);
      }
      
    },
    /**
     * 是否使用代理的方式触发显示控件,如果tigger不是字符串，此属性无效
     * <pre><code>
     *  var overlay = new Overlay({ //点击.t1(无论创建控件时.t1是否存在)时显示，点击.t1,overlay之外的元素隐藏
     *    trigger : '.t1',
     *    autoHide : true,
     *    delegateTrigger : true, //使用委托的方式触发显示控件
     *    content : '悬浮内容'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Boolean} [delegateTrigger = false]
     */
    /**
     * 是否使用代理的方式触发显示控件,如果tigger不是字符串，此属性无效
     * @type {Boolean}
     * @ignore
     */
    delegateTrigger : {
      value : false
    },
    /**
     * 选择器是否始终跟随触发器对齐
     * @cfg {Boolean} autoAlign
     * @ignore
     */
    /**
     * 选择器是否始终跟随触发器对齐
     * @type {Boolean}
     * @protected
     */
    autoAlign :{
      value : true
    },
    /**
     * 显示时是否默认获取焦点
     * @type {Boolean}
     */
    autoFocused : {
      value : true
    },
    /**
     * 如果设置了这个样式，那么触发显示（overlay）时trigger会添加此样式
     * @type {Object}
     */
    triggerActiveCls : {
      
    },
    /**
     * 控件显示时由此trigger触发，当配置项 trigger 选择器代表多个DOM 对象时，
     * 控件可由多个DOM对象触发显示。
     * <pre><code>
     *  overlay.on('show',function(){
     *    var curTrigger = overlay.get('curTrigger');
     *    //TO DO
     *  });
     * </code></pre>
     * @type {jQuery}
     * @readOnly
     */
    curTrigger : {

    },
    /**
     * 触发显示时的回调函数
     * @cfg {Function} triggerCallback
     * @ignore
     */
    /**
     * 触发显示时的回调函数
     * @type {Function}
     * @ignore
     */
    triggerCallback : {
      
    },
    /**
     * 显示菜单的事件
     *  <pre><code>
     *    var overlay = new Overlay({ //移动到#t1时显示，移动出#t1,overlay之外控件隐藏
     *      trigger : '#t1',
     *      autoHide : true,
     *      triggerEvent :'mouseover',
     *      autoHideType : 'leave',
     *      content : '悬浮内容'
     *    });
     *    overlay.render();
     * 
     *  </code></pre>
     * @cfg {String} [triggerEvent='click']
     * @default 'click'
     */
    /**
     * 显示菜单的事件
     * @type {String}
     * @default 'click'
     * @ignore
     */
    triggerEvent : {
      value:'click'
    },
    /**
     * 因为触发元素发生改变而导致控件隐藏
     * @cfg {String} triggerHideEvent
     * @ignore
     */
    /**
     * 因为触发元素发生改变而导致控件隐藏
     * @type {String}
     * @ignore
     */
    triggerHideEvent : {

    },
    events : {
      value : {
        /**
         * 当触发器（触发选择器出现）发生改变时，经常用于一个选择器对应多个触发器的情况
         * <pre><code>
         *  overlay.on('triggerchange',function(ev){
         *    var curTrigger = ev.curTrigger;
         *    overlay.set('content',curTrigger.html());
         *  });
         * </code></pre>
         * @event
         * @param {Object} e 事件对象
         * @param {jQuery} e.prevTrigger 之前触发器，可能为null
         * @param {jQuery} e.curTrigger 当前的触发器
         */
        'triggerchange':false
      }
    }
  };

  autoShow.prototype = {

    __createDom : function () {
      this._setTrigger();
    },
    __bindUI : function(){
      var _self = this,
        triggerActiveCls = _self.get('triggerActiveCls');
      if(triggerActiveCls){
        _self.on('hide',function(){
          var curTrigger = _self.get('curTrigger');
          if(curTrigger){
            curTrigger.removeClass(triggerActiveCls);
          }
        });
      }
     
    },
    _setTrigger : function () {
      var _self = this,
        triggerEvent = _self.get('triggerEvent'),
        triggerHideEvent = _self.get('triggerHideEvent'),
        triggerCallback = _self.get('triggerCallback'),
        triggerActiveCls = _self.get('triggerActiveCls') || '',
        trigger = _self.get('trigger'),
        isDelegate = _self.get('delegateTrigger'),
        triggerEl = $(trigger);

      //触发显示
      function tiggerShow (ev) {
        if(_self.get('disabled')){ //如果禁用则中断
          return;
        }
        var prevTrigger = _self.get('curTrigger'),
          curTrigger = isDelegate ?$(ev.currentTarget) : $(this),
          align = _self.get('align');
        if(!prevTrigger || prevTrigger[0] != curTrigger[0]){
          if(prevTrigger){
            prevTrigger.removeClass(triggerActiveCls);
          }
          _self.set('curTrigger',curTrigger);
          _self.fire('triggerchange',{prevTrigger : prevTrigger,curTrigger : curTrigger});
        }
        curTrigger.addClass(triggerActiveCls);
        if(_self.get('autoAlign')){
          align.node = curTrigger;
          
        }
        _self.set('align',align);
        _self.show();
        
        
        triggerCallback && triggerCallback(ev);
      }

      //触发隐藏
      function tiggerHide (ev){
        var toElement = ev.toElement || ev.relatedTarget;
        if(!toElement || !_self.containsElement(toElement)){ //mouseleave时，如果移动到当前控件上，取消消失
          _self.hide();
        }
      }

      if(triggerEvent){
        if(isDelegate && BUI.isString(trigger)){
          $(document).delegate(trigger,triggerEvent,tiggerShow);
        }else{
          triggerEl.on(triggerEvent,tiggerShow);
        }
        
      }

      if(triggerHideEvent){
        if(isDelegate && BUI.isString(trigger)){
          $(document).delegate(trigger,triggerHideEvent,tiggerHide);
        }else{
          triggerEl.on(triggerHideEvent,tiggerHide);
        }
      } 
    },
    __renderUI : function () {
      var _self = this,
        align = _self.get('align');
      //如果控件显示时不是由trigger触发，则同父元素对齐
      if(align && !align.node){
        align.node = _self.get('render') || _self.get('trigger');
      }
    }
  };

  return autoShow;
});/**
 * @fileOverview 点击或移出控件外部，控件隐藏
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/autohide',function () {

  var wrapBehavior = BUI.wrapBehavior,
      getWrapBehavior = BUI.getWrapBehavior;

  function isExcept(self,elem){
    var hideExceptNode = self.get('hideExceptNode');
    if(hideExceptNode && hideExceptNode.length){
      return $.contains(hideExceptNode[0],elem);
    }
    return false;
  }
  /**
   * 点击隐藏控件的扩展
   * @class BUI.Component.UIBase.AutoHide
   */
  function autoHide() {
  
  }

  autoHide.ATTRS = {

    /**
     * 控件自动隐藏的事件，这里支持2种：
     *  - 'click'
     *  - 'leave'
     *  <pre><code>
     *    var overlay = new Overlay({ //点击#t1时显示，点击#t1之外的元素隐藏
     *      trigger : '#t1',
     *      autoHide : true,
     *      content : '悬浮内容'
     *    });
     *    overlay.render();
     *
     *    var overlay = new Overlay({ //移动到#t1时显示，移动出#t1,overlay之外控件隐藏
     *      trigger : '#t1',
     *      autoHide : true,
     *      triggerEvent :'mouseover',
     *      autoHideType : 'leave',
     *      content : '悬浮内容'
     *    });
     *    overlay.render();
     * 
     *  </code></pre>
     * @cfg {String} [autoHideType = 'click']
     */
    /**
     * 控件自动隐藏的事件，这里支持2种：
     * 'click',和'leave',默认为'click'
     * @type {String}
     */
    autoHideType : {
      value : 'click'
    },
    /**
     * 是否自动隐藏
     * <pre><code>
     *  
     *  var overlay = new Overlay({ //点击#t1时显示，点击#t1,overlay之外的元素隐藏
     *    trigger : '#t1',
     *    autoHide : true,
     *    content : '悬浮内容'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Object} autoHide
     */
    /**
     * 是否自动隐藏
     * @type {Object}
     * @ignore
     */
    autoHide:{
      value : false
    },
    /**
     * 点击或者移动到此节点时不触发自动隐藏
     * <pre><code>
     *  
     *  var overlay = new Overlay({ //点击#t1时显示，点击#t1,#t2,overlay之外的元素隐藏
     *    trigger : '#t1',
     *    autoHide : true,
     *    hideExceptNode : '#t2',
     *    content : '悬浮内容'
     *  });
     *  overlay.render();
     * </code></pre>
     * @cfg {Object} hideExceptNode
     */
    hideExceptNode :{

    },
    events : {
      value : {
        /**
         * @event autohide
         * 点击控件外部时触发，只有在控件设置自动隐藏(autoHide = true)有效
         * 可以阻止控件隐藏，通过在事件监听函数中 return false
         * <pre><code>
         *  overlay.on('autohide',function(){
         *    var curTrigger = overlay.curTrigger; //当前触发的项
         *    if(condtion){
         *      return false; //阻止隐藏
         *    }
         *  });
         * </code></pre>
         */
        autohide : false
      }
    }
  };

  autoHide.prototype = {

    __bindUI : function() {
      var _self = this;

      _self.on('afterVisibleChange',function (ev) {
        var visible = ev.newVal;
        if(_self.get('autoHide')){
          if(visible){
            _self._bindHideEvent();
          }else{
            _self._clearHideEvent();
          }
        }
      });
    },
    /**
     * 处理鼠标移出事件，不影响{BUI.Component.Controller#handleMouseLeave}事件
     * @param  {jQuery.Event} ev 事件对象
     */
    handleMoveOuter : function (ev) {
      var _self = this,
        target = ev.toElement || ev.relatedTarget;
      if(!_self.containsElement(target) && !isExcept(_self,target)){
        if(_self.fire('autohide') !== false){
          _self.hide();
        }
      }
    },
    /**
     * 点击页面时的处理函数
     * @param {jQuery.Event} ev 事件对象
     * @protected
     */
    handleDocumentClick : function (ev) {
      var _self = this,
        target = ev.target;
      if(!_self.containsElement(target) && !isExcept(_self,target)){
        if(_self.fire('autohide') !== false){
          _self.hide();
        }
      }
    },
    _bindHideEvent : function() {
      var _self = this,
        trigger = _self.get('curTrigger'),
        autoHideType = _self.get('autoHideType');
      if(autoHideType === 'click'){
        $(document).on('mousedown',wrapBehavior(_self,'handleDocumentClick'));
      }else{
        _self.get('el').on('mouseleave',wrapBehavior(_self,'handleMoveOuter'));
        if(trigger){
          $(trigger).on('mouseleave',wrapBehavior(_self,'handleMoveOuter'))
        }
      }

    },
    //清除绑定的隐藏事件
    _clearHideEvent : function() {
      var _self = this,
        trigger = _self.get('curTrigger'),
        autoHideType = _self.get('autoHideType');
      if(autoHideType === 'click'){
        $(document).off('mousedown',getWrapBehavior(_self,'handleDocumentClick'));
      }else{
        _self.get('el').off('mouseleave',getWrapBehavior(_self,'handleMoveOuter'));
        if(trigger){
          $(trigger).off('mouseleave',getWrapBehavior(_self,'handleMoveOuter'))
        }
      }
    }
  };

  return autoHide;

});




/**
 * @fileOverview close 关闭或隐藏控件
 * @author yiminghe@gmail.com
 * copied and modified by dxq613@gmail.com
 * @ignore
 */

define('bui/component/uibase/close',function () {
  
  var CLS_PREFIX = BUI.prefix + 'ext-';

  function getCloseRenderBtn(self) {
      return $(self.get('closeTpl'));
  }

  /**
  * 关闭按钮的视图类
  * @class BUI.Component.UIBase.CloseView
  * @private
  */
  function CloseView() {
  }

  CloseView.ATTRS = {
    closeTpl : {
      value : '<a ' +
            'tabindex="0" ' +
            "href='javascript:void(\"关闭\")' " +
            'role="button" ' +
            'class="' + CLS_PREFIX + 'close' + '">' +
            '<span class="' +
            CLS_PREFIX + 'close-x' +
            '">关闭<' + '/span>' +
            '<' + '/a>'
    },
    closeable:{
        value:true
    },
    closeBtn:{
    }
  };

  CloseView.prototype = {
      _uiSetCloseable:function (v) {
          var self = this,
              btn = self.get('closeBtn');
          if (v) {
              if (!btn) {
                  self.setInternal('closeBtn', btn = getCloseRenderBtn(self));
              }
              btn.appendTo(self.get('el'), undefined);
          } else {
              if (btn) {
                  btn.remove();
              }
          }
      }
  };

   /**
   * @class BUI.Component.UIBase.Close
   * Close extension class.
   * Represent a close button.
   */
  function Close() {
  }

  var HIDE = 'hide';
  Close.ATTRS =
  {
      /**
      * 关闭按钮的默认模版
      * <pre><code>
      *   var overlay = new Overlay({
      *     closeTpl : '<a href="#" title="close">x</a>',
      *     closeable : true,
      *     trigger : '#t1'
      *   });
      *   overlay.render();
      * </code></pre>
      * @cfg {String} closeTpl
      */
      /**
      * 关闭按钮的默认模版
      * @type {String}
      * @protected
      */
      closeTpl:{
        view : true
      },
      /**
       * 是否出现关闭按钮
       * @cfg {Boolean} [closeable = false]
       */
      /**
       * 是否出现关闭按钮
       * @type {Boolean}
       */
      closeable:{
          view:1
      },

      /**
       * 关闭按钮.
       * @protected
       * @type {jQuery}
       */
      closeBtn:{
          view:1
      },
      /**
       * 关闭时隐藏还是移除DOM结构<br/>
       * 
       *  - "hide" : default 隐藏. 
       *  - "destroy"：当点击关闭按钮时移除（destroy)控件
       *  - 'remove' : 当存在父控件时使用remove，同时从父元素中删除
       * @cfg {String} [closeAction = 'hide']
       */
      /**
       * 关闭时隐藏还是移除DOM结构
       * default "hide".可以设置 "destroy" ，当点击关闭按钮时移除（destroy)控件
       * @type {String}
       * @protected
       */
      closeAction:{
        value:HIDE
      }

      /**
       * @event closing
       * 正在关闭，可以通过return false 阻止关闭事件
       * @param {Object} e 关闭事件
       * @param {String} e.action 关闭执行的行为，hide,destroy,remove
       */
      
      /**
       * @event beforeclosed
       * 关闭前，发生在closing后，closed前，用于处理关闭前的一些工作
       * @param {Object} e 关闭事件
       * @param {String} e.action 关闭执行的行为，hide,destroy,remove
       */

      /**
       * @event closed
       * 已经关闭
       * @param {Object} e 关闭事件
       * @param {String} e.action 关闭执行的行为，hide,destroy,remove
       */
      
      /**
       * @event closeclick
       * 触发点击关闭按钮的事件,return false 阻止关闭
       * @param {Object} e 关闭事件
       * @param {String} e.domTarget 点击的关闭按钮节点
       */
  };

  var actions = {
      hide:HIDE,
      destroy:'destroy',
      remove : 'remove'
  };

  Close.prototype = {
      _uiSetCloseable:function (v) {
          var self = this;
          if (v && !self.__bindCloseEvent) {
              self.__bindCloseEvent = 1;
              self.get('closeBtn').on('click', function (ev) {
                if(self.fire('closeclick',{domTarget : ev.target}) !== false){
                  self.close();
                }
                ev.preventDefault();
              });
          }
      },
      __destructor:function () {
          var btn = this.get('closeBtn');
          btn && btn.detach();
      },
      /**
       * 关闭弹出框，如果closeAction = 'hide'那么就是隐藏，如果 closeAction = 'destroy'那么就是释放,'remove'从父控件中删除，并释放
       */
      close : function(){
        var self = this,
          action = actions[self.get('closeAction') || HIDE];
        if(self.fire('closing',{action : action}) !== false){
          self.fire('beforeclosed',{action : action});
          if(action == 'remove'){ //移除时同时destroy
            self[action](true);
          }else{
            self[action]();
          }
          self.fire('closed',{action : action});
        }
      }
  };

  Close.View = CloseView;

  return Close;
});
/**
 * @fileOverview 拖拽
 * @author by dxq613@gmail.com
 * @ignore
 */

define('bui/component/uibase/drag',function(){

   
    var dragBackId = BUI.guid('drag');
    
    /**
     * 拖拽控件的扩展
     * <pre><code>
     *  var Control = Overlay.extend([UIBase.Drag],{
     *      
     *  });
     *
     *  var c = new Contol({ //拖动控件时，在#t2内
     *      content : '<div id="header"></div><div></div>',
     *      dragNode : '#header',
     *      constraint : '#t2'
     *  });
     * </code></pre>
     * @class BUI.Component.UIBase.Drag
     */
    var drag = function(){

    };

    drag.ATTRS = 
    {

        /**
         * 点击拖动的节点
         * <pre><code>
         *  var Control = Overlay.extend([UIBase.Drag],{
         *      
         *  });
         *
         *  var c = new Contol({ //拖动控件时，在#t2内
         *      content : '<div id="header"></div><div></div>',
         *      dragNode : '#header',
         *      constraint : '#t2'
         *  });
         * </code></pre>
         * @cfg {jQuery} dragNode
         */
        /**
         * 点击拖动的节点
         * @type {jQuery}
         * @ignore
         */
        dragNode : {

        },
        /**
         * 是否正在拖动
         * @type {Boolean}
         * @protected
         */
        draging:{
            setter:function (v) {
                if (v === true) {
                    return {};
                }
            },
            value:null
        },
        /**
         * 拖动的限制范围
         * <pre><code>
         *  var Control = Overlay.extend([UIBase.Drag],{
         *      
         *  });
         *
         *  var c = new Contol({ //拖动控件时，在#t2内
         *      content : '<div id="header"></div><div></div>',
         *      dragNode : '#header',
         *      constraint : '#t2'
         *  });
         * </code></pre>
         * @cfg {jQuery} constraint
         */
        /**
         * 拖动的限制范围
         * @type {jQuery}
         * @ignore
         */
        constraint : {

        },
        /**
         * @private
         * @type {jQuery}
         */
        dragBackEl : {
            /** @private **/
            getter:function(){
                return $('#'+dragBackId);
            }
        }
    };
    var dragTpl = '<div id="' + dragBackId + '" style="background-color: red; position: fixed; left: 0px; width: 100%; height: 100%; top: 0px; cursor: move; z-index: 999999; display: none; "></div>';
       
    function initBack(){
        var el = $(dragTpl).css('opacity', 0).prependTo('body');
        return el;
    }
    drag.prototype = {
        
        __bindUI : function(){
            var _self = this,
                constraint = _self.get('constraint'),
                dragNode = _self.get('dragNode');
            if(!dragNode){
                return;
            }
            dragNode.on('mousedown',function(e){

                if(e.which == 1){
                    e.preventDefault();
                    _self.set('draging',{
                        elX: _self.get('x'),
                        elY: _self.get('y'),
                        startX : e.pageX,
                        startY : e.pageY
                    });
                    registEvent();
                }
            });
            /**
             * @private
             */
            function mouseMove(e){
                var draging = _self.get('draging');
                if(draging){
                    e.preventDefault();
                    _self._dragMoveTo(e.pageX,e.pageY,draging,constraint);
                }
            }
            /**
             * @private
             */
            function mouseUp(e){
                if(e.which == 1){
                    _self.set('draging',false);
                    var dragBackEl = _self.get('dragBackEl');
                    if(dragBackEl){
                        dragBackEl.hide();
                    }
                    unregistEvent();
                }
            }
            /**
             * @private
             */
            function registEvent(){
                $(document).on('mousemove',mouseMove);
                $(document).on('mouseup',mouseUp);
            }
            /**
             * @private
             */
            function unregistEvent(){
                $(document).off('mousemove',mouseMove);
                $(document).off('mouseup',mouseUp);
            }

        },
        _dragMoveTo : function(x,y,draging,constraint){
            var _self = this,
                dragBackEl = _self.get('dragBackEl'),
                draging = draging || _self.get('draging'),
                offsetX = draging.startX - x,
                offsetY = draging.startY - y;
            if(!dragBackEl.length){
                 dragBackEl = initBack();
            }
            dragBackEl.css({
                cursor: 'move',
                display: 'block'
            });
            _self.set('xy',[_self._getConstrainX(draging.elX - offsetX,constraint),
                            _self._getConstrainY(draging.elY - offsetY,constraint)]);    

        },
        _getConstrainX : function(x,constraint){
            var _self = this,
                width =  _self.get('el').outerWidth(),
                endX = x + width,
                curX = _self.get('x');
            //如果存在约束
            if(constraint){
                var constraintOffset = constraint.offset();
                if(constraintOffset.left >= x){
                    return constraintOffset.left;
                }
                if(constraintOffset.left + constraint.width() < endX){
                    return constraintOffset.left + constraint.width() - width;
                }
                return x;
            }
            //当左右顶点都在视图内，移动到此点
            if(BUI.isInHorizontalView(x) && BUI.isInHorizontalView(endX)){
                return x;
            }

            return curX;
        },
        _getConstrainY : function(y,constraint){
             var _self = this,
                height =  _self.get('el').outerHeight(),
                endY = y + height,
                curY = _self.get('y');
            //如果存在约束
            if(constraint){
                var constraintOffset = constraint.offset();
                if(constraintOffset.top > y){
                    return constraintOffset.top;
                }
                if(constraintOffset.top + constraint.height() < endY){
                    return constraintOffset.top + constraint.height() - height;
                }
                return y;
            }
            //当左右顶点都在视图内，移动到此点
            if(BUI.isInVerticalView(y) && BUI.isInVerticalView(endY)){
                return y;
            }

            return curY;
        }
    };

    return drag;

});/**
 * @fileOverview 使用键盘导航
 * @ignore
 */

define('bui/component/uibase/keynav',['bui/keycode'],function (require) {

  var KeyCode = require('bui/keycode'),
      wrapBehavior = BUI.wrapBehavior,
      getWrapBehavior = BUI.getWrapBehavior;
  /**
   * 键盘导航
   * @class BUI.Component.UIBase.KeyNav
   */
  var keyNav = function () {
    
  };

  keyNav.ATTRS = {

    /**
     * 是否允许键盘导航
     * @cfg {Boolean} [allowKeyNav = true]
     */
    allowKeyNav : {
      value : true
    },
    /**
     * 导航使用的事件
     * @cfg {String} [navEvent = 'keydown']
     */
    navEvent : {
      value : 'keydown'
    },
    /**
     * 当获取事件的DOM是 input,textarea,select等时，不处理键盘导航
     * @cfg {Object} [ignoreInputFields='true']
     */
    ignoreInputFields : {
      value : true
    }

  };

  keyNav.prototype = {

    __bindUI : function () {
      
    },
    _uiSetAllowKeyNav : function(v){
      var _self = this,
        eventName = _self.get('navEvent'),
        el = _self.get('el');
      if(v){
        el.on(eventName,wrapBehavior(_self,'_handleKeyDown'));
      }else{
        el.off(eventName,getWrapBehavior(_self,'_handleKeyDown'));
      }
    },
    /**
     * 处理键盘导航
     * @private
     */
    _handleKeyDown : function(ev){
      var _self = this,
        ignoreInputFields = _self.get('ignoreInputFields'),
        code = ev.which;
      if(ignoreInputFields && $(ev.target).is('input,select,textarea')){
        return;
      }
      
      switch(code){
        case KeyCode.UP :
          ev.preventDefault();
          _self.handleNavUp(ev);
          break;
        case KeyCode.DOWN : 
          ev.preventDefault();
          _self.handleNavDown(ev);
          break;
        case KeyCode.RIGHT : 
          ev.preventDefault();
          _self.handleNavRight(ev);
          break;
        case KeyCode.LEFT : 
          ev.preventDefault();
          _self.handleNavLeft(ev);
          break;
        case KeyCode.ENTER : 
          _self.handleNavEnter(ev);
          break;
        case KeyCode.ESC : 
          _self.handleNavEsc(ev);
          break;
        case KeyCode.TAB :
          _self.handleNavTab(ev);
          break;
        default:
          break;
      }
    },
    /**
     * 处理向上导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavUp : function (ev) {
      // body...
    },
    /**
     * 处理向下导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavDown : function (ev) {
      // body...
    },
    /**
     * 处理向左导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavLeft : function (ev) {
      // body...
    },
    /**
     * 处理向右导航
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavRight : function (ev) {
      // body...
    },
    /**
     * 处理确认键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEnter : function (ev) {
      // body...
    },
    /**
     * 处理 esc 键
     * @protected
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavEsc : function (ev) {
      // body...
    },
    /**
     * 处理Tab键
     * @param  {jQuery.Event} ev 事件对象
     */
    handleNavTab : function(ev){

    }

  };

  return keyNav;
});
/**
 * @fileOverview mask 遮罩层
 * @author yiminghe@gmail.com
 * copied and modified by dxq613@gmail.com
 * @ignore
 */

define('bui/component/uibase/mask',function (require) {

    var UA = require('bui/ua'),
        
        /**
         * 每组相同 prefixCls 的 position 共享一个遮罩
         * @ignore
         */
        maskMap = {
            /**
             * @ignore
             * {
             *  node:
             *  num:
             * }
             */

    },
        ie6 = UA.ie == 6;

    function getMaskCls(self) {
        return self.get('prefixCls') + 'ext-mask';
    }

    function docWidth() {
        return  ie6 ? BUI.docWidth() + 'px' : '100%';
    }

    function docHeight() {
        return ie6 ? BUI.docHeight() + 'px' : '100%';
    }

    function initMask(maskCls) {
        var mask = $('<div ' +
            ' style="width:' + docWidth() + ';' +
            'left:0;' +
            'top:0;' +
            'height:' + docHeight() + ';' +
            'position:' + (ie6 ? 'absolute' : 'fixed') + ';"' +
            ' class="' +
            maskCls +
            '">' +
            (ie6 ? '<' + 'iframe ' +
                'style="position:absolute;' +
                'left:' + '0' + ';' +
                'top:' + '0' + ';' +
                'background:white;' +
                'width: expression(this.parentNode.offsetWidth);' +
                'height: expression(this.parentNode.offsetHeight);' +
                'filter:alpha(opacity=0);' +
                'z-index:-1;"></iframe>' : '') +
            '</div>')
            .prependTo('body');
        /**
         * 点 mask 焦点不转移
         * @ignore
         */
       // mask.unselectable();
        mask.on('mousedown', function (e) {
            e.preventDefault();
        });
        return mask;
    }

    /**
    * 遮罩层的视图类
    * @class BUI.Component.UIBase.MaskView
    * @private
    */
    function MaskView() {
    }

    MaskView.ATTRS = {
        maskShared:{
            value:true
        }
    };

    MaskView.prototype = {

        _maskExtShow:function () {
            var self = this,
                zIndex,
                maskCls = getMaskCls(self),
                maskDesc = maskMap[maskCls],
                maskShared = self.get('maskShared'),
                mask = self.get('maskNode');
            if (!mask) {
                if (maskShared) {
                    if (maskDesc) {
                        mask = maskDesc.node;
                    } else {
                        mask = initMask(maskCls);
                        maskDesc = maskMap[maskCls] = {
                            num:0,
                            node:mask
                        };
                    }
                } else {
                    mask = initMask(maskCls);
                }
                self.setInternal('maskNode', mask);
            }
            if (zIndex = self.get('zIndex')) {
                mask.css('z-index', zIndex - 1);
            }
            if (maskShared) {
                maskDesc.num++;
            }
            if (!maskShared || maskDesc.num == 1) {
                mask.show();
            }
            $('body').addClass('x-masked-relative');
        },

        _maskExtHide:function () {
            var self = this,
                maskCls = getMaskCls(self),
                maskDesc = maskMap[maskCls],
                maskShared = self.get('maskShared'),
                mask = self.get('maskNode');
            if (maskShared && maskDesc) {
                maskDesc.num = Math.max(maskDesc.num - 1, 0);
                if (maskDesc.num == 0) {
                    mask.hide();
                }
            } else if(mask){
                mask.hide();
            }
            $('body').removeClass('x-masked-relative');
        },

        __destructor:function () {
            var self = this,
                maskShared = self.get('maskShared'),
                mask = self.get('maskNode');
            if (self.get('maskNode')) {
                if (maskShared) {
                    if (self.get('visible')) {
                        self._maskExtHide();
                    }
                } else {
                    mask.remove();
                }
            }
        }

    };

   /**
     * @class BUI.Component.UIBase.Mask
     * Mask extension class.
     * Make component to be able to show with mask.
     */
    function Mask() {
    }

    Mask.ATTRS =
    {
        /**
         * 控件显示时，是否显示屏蔽层
         * <pre><code>
         *   var overlay = new Overlay({ //显示overlay时，屏蔽body
         *     mask : true,
         *     maskNode : 'body',
         *     trigger : '#t1'
         *   });
         *   overlay.render();
         * </code></pre>
         * @cfg {Boolean} [mask = false]
         */
        /**
         * 控件显示时，是否显示屏蔽层
         * @type {Boolean}
         * @protected
         */
        mask:{
            value:false
        },
        /**
         * 屏蔽的内容
         * <pre><code>
         *   var overlay = new Overlay({ //显示overlay时，屏蔽body
         *     mask : true,
         *     maskNode : 'body',
         *     trigger : '#t1'
         *   });
         *   overlay.render();
         * </code></pre>
         * @cfg {jQuery} maskNode
         */
        /**
         * 屏蔽的内容
         * @type {jQuery}
         * @protected
         */
        maskNode:{
            view:1
        },
        /**
         * Whether to share mask with other overlays.
         * @default true.
         * @type {Boolean}
         * @protected
         */
        maskShared:{
            view:1
        }
    };

    Mask.prototype = {

        __bindUI:function () {
            var self = this,
                view = self.get('view'),
                _maskExtShow = view._maskExtShow,
                _maskExtHide = view._maskExtHide;
            if (self.get('mask')) {
                self.on('show',function(){
                    view._maskExtShow();
                });
                self.on('hide',function(){
                    view._maskExtHide();
                });
            }
        }
    };

  Mask = Mask;
  Mask.View = MaskView;

  return Mask;
});

/**
 * @fileOverview 位置，控件绝对定位
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/position',function () {


    /**
    * 对齐的视图类
    * @class BUI.Component.UIBase.PositionView
    * @private
    */
    function PositionView() {

    }

    PositionView.ATTRS = {
        x:{
            /**
             * 水平方向绝对位置
             * @private
             * @ignore
             */
            valueFn:function () {
                var self = this;
                // 读到这里时，el 一定是已经加到 dom 树中了，否则报未知错误
                // el 不在 dom 树中 offset 报错的
                // 最早读就是在 syncUI 中，一点重复设置(读取自身 X 再调用 _uiSetX)无所谓了
                return self.get('el') && self.get('el').offset().left;
            }
        },
        y:{
            /**
             * 垂直方向绝对位置
             * @private
             * @ignore
             */
            valueFn:function () {
                var self = this;
                return self.get('el') && self.get('el').offset().top;
            }
        },
        zIndex:{
        },
        /**
         * @private
         * see {@link BUI.Component.UIBase.Box#visibleMode}.
         * @default "visibility"
         * @ignore
         */
        visibleMode:{
            value:'visibility'
        }
    };


    PositionView.prototype = {

        __createDom:function () {
            this.get('el').addClass(BUI.prefix + 'ext-position');
        },

        _uiSetZIndex:function (x) {
            this.get('el').css('z-index', x);
        },
        _uiSetX:function (x) {
            if (x != null) {
                this.get('el').offset({
                    left:x
                });
            }
        },
        _uiSetY:function (y) {
            if (y != null) {
                this.get('el').offset({
                    top:y
                });
            }
        },
        _uiSetLeft:function(left){
            if(left != null){
                this.get('el').css({left:left});
            }
        },
        _uiSetTop : function(top){
            if(top != null){
                this.get('el').css({top:top});
            }
        }
    };
  
    /**
     * @class BUI.Component.UIBase.Position
     * Position extension class.
     * Make component positionable
     */
    function Position() {
    }

    Position.ATTRS =
    {
        /**
         * 水平坐标
         * @cfg {Number} x
         */
        /**
         * 水平坐标
         * <pre><code>
         *     overlay.set('x',100);
         * </code></pre>
         * @type {Number}
         */
        x:{
            view:1
        },
        /**
         * 垂直坐标
         * @cfg {Number} y
         */
        /**
         * 垂直坐标
         * <pre><code>
         *     overlay.set('y',100);
         * </code></pre>
         * @type {Number}
         */
        y:{
            view:1
        },
        /**
         * 相对于父元素的水平位置
         * @type {Number}
         * @protected
         */
        left : {
            view:1
        },
        /**
         * 相对于父元素的垂直位置
         * @type {Number}
         * @protected
         */
        top : {
            view:1
        },
        /**
         * 水平和垂直坐标
         * <pre><code>
         * var overlay = new Overlay({
         *   xy : [100,100],
         *   trigger : '#t1',
         *   srcNode : '#c1'
         * });
         * </code></pre>
         * @cfg {Number[]} xy
         */
        /**
         * 水平和垂直坐标
         * <pre><code>
         *     overlay.set('xy',[100,100]);
         * </code></pre>
         * @type {Number[]}
         */
        xy:{
            // 相对 page 定位, 有效值为 [n, m], 为 null 时, 选 align 设置
            setter:function (v) {
                var self = this,
                    xy = $.makeArray(v);
                /*
                 属性内分发特别注意：
                 xy -> x,y
                 */
                if (xy.length) {
                    xy[0] && self.set('x', xy[0]);
                    xy[1] && self.set('y', xy[1]);
                }
                return v;
            },
            /**
             * xy 纯中转作用
             * @ignore
             */
            getter:function () {
                return [this.get('x'), this.get('y')];
            }
        },
        /**
         * z-index value.
         * <pre><code>
         *   var overlay = new Overlay({
         *       zIndex : '1000'
         *   });
         * </code></pre>
         * @cfg {Number} zIndex
         */
        /**
         * z-index value.
         * <pre><code>
         *   overlay.set('zIndex','1200');
         * </code></pre>
         * @type {Number}
         */
        zIndex:{
            view:1
        },
        /**
         * Positionable element is by default visible false.
         * For compatibility in overlay and PopupMenu.
         * @default false
         * @ignore
         */
        visible:{
            view:true,
            value:true
        }
    };


    Position.prototype =
    {
        /**
         * Move to absolute position.
         * @param {Number|Number[]} x
         * @param {Number} [y]
         * @example
         * <pre><code>
         * move(x, y);
         * move(x);
         * move([x,y])
         * </code></pre>
         */
        move:function (x, y) {
            var self = this;
            if (BUI.isArray(x)) {
                y = x[1];
                x = x[0];
            }
            self.set('xy', [x, y]);
            return self;
        },
        //设置 x 坐标时，重置 left
        _uiSetX : function(v){
            if(v != null){
                var _self = this,
                    el = _self.get('el');
                _self.setInternal('left',el.position().left);
                if(v != -999){
                    this.set('cachePosition',null);
                }
                
            }
            
        },
        //设置 y 坐标时，重置 top
        _uiSetY : function(v){
            if(v != null){
                var _self = this,
                    el = _self.get('el');
                _self.setInternal('top',el.position().top);
                if(v != -999){
                    this.set('cachePosition',null);
                }
            }
        },
        //设置 left时，重置 x
        _uiSetLeft : function(v){
            var _self = this,
                    el = _self.get('el');
            if(v != null){
                _self.setInternal('x',el.offset().left);
            }/*else{ //如果lef 为null,同时设置过left和top，那么取对应的值
                _self.setInternal('left',el.position().left);
            }*/
        },
        //设置top 时，重置y
        _uiSetTop : function(v){
            var _self = this,
                el = _self.get('el');
            if(v != null){
                _self.setInternal('y',el.offset().top);
            }/*else{ //如果lef 为null,同时设置过left和top，那么取对应的值
                _self.setInternal('top',el.position().top);
            }*/
        }
    };

    Position.View = PositionView;
    return Position;
});
/**
 * @fileOverview 可选中的控件,父控件支持selection扩展
 * @ignore
 */

define('bui/component/uibase/listitem',function () {

  /**
   * 列表项控件的视图层
   * @class BUI.Component.UIBase.ListItemView
   * @private
   */
  function listItemView () {
    // body...
  }

  listItemView.ATTRS = {
    /**
     * 是否选中
     * @type {Boolean}
     */
    selected : {

    }
  };

  listItemView.prototype = {
     _uiSetSelected : function(v){
      var _self = this,
        cls = _self.getStatusCls('selected'),
        el = _self.get('el');
      if(v){
        el.addClass(cls);
      }else{
        el.removeClass(cls);
      }
    }
  };
  /**
   * 列表项的扩展
   * @class BUI.Component.UIBase.ListItem
   */
  function listItem() {
    
  }

  listItem.ATTRS = {

    /**
     * 是否可以被选中
     * @cfg {Boolean} [selectable=true]
     */
    /**
     * 是否可以被选中
     * @type {Boolean}
     */
    selectable : {
      value : true
    },
    
    /**
     * 是否选中,只能通过设置父类的选中方法来实现选中
     * @type {Boolean}
     * @readOnly
     */
    selected :{
      view : true,
      sync : false,
      value : false
    }
  };

  listItem.prototype = {
    
  };

  listItem.View = listItemView;

  return listItem;

});
/**
 * @fileOverview 
 * 控件包含头部（head)、内容(content)和尾部（foot)
 * @ignore
 */
define('bui/component/uibase/stdmod',function () {

    var CLS_PREFIX = BUI.prefix + 'stdmod-';
        

    /**
    * 标准模块组织的视图类
    * @class BUI.Component.UIBase.StdModView
    * @private
    */
    function StdModView() {
    }

    StdModView.ATTRS = {
        header:{
        },
        body:{
        },
        footer:{
        },
        bodyStyle:{
        },
        footerStyle:{
        },
        headerStyle:{
        },
        headerContent:{
        },
        bodyContent:{
        },
        footerContent:{
        }
    };

    StdModView.PARSER = {
        header:function (el) {
            return el.one("." + CLS_PREFIX + "header");
        },
        body:function (el) {
            return el.one("." + CLS_PREFIX + "body");
        },
        footer:function (el) {
            return el.one("." + CLS_PREFIX + "footer");
        }
    };/**/

    function createUI(self, part) {
        var el = self.get('contentEl'),
            partEl = self.get(part);
        if (!partEl) {
            partEl = $('<div class="' +
                CLS_PREFIX + part + '"' +
                ' ' +
                ' >' +
                '</div>');
            partEl.appendTo(el);
            self.setInternal(part, partEl);
        }
    }


    function _setStdModRenderContent(self, part, v) {
        part = self.get(part);
        if (BUI.isString(v)) {
            part.html(v);
        } else {
            part.html('')
                .append(v);
        }
    }

    StdModView.prototype = {

        __renderUI:function () { //createDom
            createUI(this, 'header');
            createUI(this, 'body');
            createUI(this, 'footer');
        },

        _uiSetBodyStyle:function (v) {
            this.get('body').css(v);
        },

        _uiSetHeaderStyle:function (v) {
            this.get('header').css(v);
        },
        _uiSetFooterStyle:function (v) {
            this.get('footer').css(v);
        },

        _uiSetBodyContent:function (v) {
            _setStdModRenderContent(this, 'body', v);
        },

        _uiSetHeaderContent:function (v) {
            _setStdModRenderContent(this, 'header', v);
        },

        _uiSetFooterContent:function (v) {
            _setStdModRenderContent(this, 'footer', v);
        }
    };

   /**
     * @class BUI.Component.UIBase.StdMod
     * StdMod extension class.
     * Generate head, body, foot for component.
     */
    function StdMod() {
    }

    StdMod.ATTRS =
    {
        /**
         * 控件的头部DOM. Readonly
         * @readOnly
         * @type {jQuery}
         */
        header:{
            view:1
        },
        /**
         * 控件的内容DOM. Readonly
         * @readOnly
         * @type {jQuery}
         */
        body:{
            view:1
        },
        /**
         * 控件的底部DOM. Readonly
         * @readOnly
         * @type {jQuery}
         */
        footer:{
            view:1
        },
        /**
         * 应用到控件内容的css属性，键值对形式
         * @cfg {Object} bodyStyle
         */
        /**
         * 应用到控件内容的css属性，键值对形式
         * @type {Object}
         * @protected
         */
        bodyStyle:{
            view:1
        },
        /**
         * 应用到控件底部的css属性，键值对形式
         * @cfg {Object} footerStyle
         */
        /**
         * 应用到控件底部的css属性，键值对形式
         * @type {Object}
         * @protected
         */
        footerStyle:{
            view:1
        },
        /**
         * 应用到控件头部的css属性，键值对形式
         * @cfg {Object} headerStyle
         */
        /**
         * 应用到控件头部的css属性，键值对形式
         * @type {Object}
         * @protected
         */
        headerStyle:{
            view:1
        },
        /**
         * 控件头部的html
         * <pre><code>
         * var dialog = new Dialog({
         *     headerContent: '&lt;div class="header"&gt;&lt;/div&gt;',
         *     bodyContent : '#c1',
         *     footerContent : '&lt;div class="footer"&gt;&lt;/div&gt;'
         * });
         * dialog.show();
         * </code></pre>
         * @cfg {jQuery|String} headerContent
         */
        /**
         * 控件头部的html
         * @type {jQuery|String}
         */
        headerContent:{
            view:1
        },
        /**
         * 控件内容的html
         * <pre><code>
         * var dialog = new Dialog({
         *     headerContent: '&lt;div class="header"&gt;&lt;/div&gt;',
         *     bodyContent : '#c1',
         *     footerContent : '&lt;div class="footer"&gt;&lt;/div&gt;'
         * });
         * dialog.show();
         * </code></pre>
         * @cfg {jQuery|String} bodyContent
         */
        /**
         * 控件内容的html
         * @type {jQuery|String}
         */
        bodyContent:{
            view:1
        },
        /**
         * 控件底部的html
         * <pre><code>
         * var dialog = new Dialog({
         *     headerContent: '&lt;div class="header"&gt;&lt;/div&gt;',
         *     bodyContent : '#c1',
         *     footerContent : '&lt;div class="footer"&gt;&lt;/div&gt;'
         * });
         * dialog.show();
         * </code></pre>
         * @cfg {jQuery|String} footerContent
         */
        /**
         * 控件底部的html
         * @type {jQuery|String}
         */
        footerContent:{
            view:1
        }
    };

  StdMod.View = StdModView;
  return StdMod;
});/**
 * @fileOverview 使用wrapper
 * @ignore
 */

define('bui/component/uibase/decorate',['bui/array','bui/json','bui/component/manage'],function (require) {
  
  var ArrayUtil = require('bui/array'),
    JSON = require('bui/json'),
    prefixCls = BUI.prefix,
    FIELD_PREFIX = 'data-',
    FIELD_CFG = FIELD_PREFIX + 'cfg',
    PARSER = 'PARSER',
    Manager = require('bui/component/manage'),
    RE_DASH_WORD = /-([a-z])/g,
    regx = /^[\{\[]/;

  function isConfigField(name,cfgFields){
    if(cfgFields[name]){
      return true;
    }
    var reg = new RegExp("^"+FIELD_PREFIX);  
    if(name !== FIELD_CFG && reg.test(name)){
      return true;
    }
    return false;
  }

  // 收集单继承链，子类在前，父类在后
  function collectConstructorChains(self) {
      var constructorChains = [],
          c = self.constructor;
      while (c) {
          constructorChains.push(c);
          c = c.superclass && c.superclass.constructor;
      }
      return constructorChains;
  }

  function camelCase(str) {
    return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
      return (letter + '').toUpperCase()
    })
  }

  //如果属性为对象或者数组，则进行转换
  function parseFieldValue(value){

    value = $.trim(value);
    if (value.toLowerCase() === 'false') {
      value = false
    }
    else if (value.toLowerCase() === 'true') {
      value = true
    }else if(regx.test(value)){
      value = JSON.looseParse(value);
    }else if (/\d/.test(value) && /[^a-z]/i.test(value)) {
      var number = parseFloat(value)
      if (number + '' === value) {
        value = number
      }
    }
    
    return value;
  }

  function setConfigFields(self,cfg){

    var userConfig = self.userConfig || {};
    for (var p in cfg) {
      // 用户设置过那么这里不从 dom 节点取
      // 用户设置 > html parser > default value
      if (!(p in userConfig)) {
        self.setInternal(p,cfg[p]);
      }
    }
  }
  function applyParser(srcNode, parser) {
    var self = this,
      p, v,
      userConfig = self.userConfig || {};

    // 从 parser 中，默默设置属性，不触发事件
    for (p in parser) {
      // 用户设置过那么这里不从 dom 节点取
      // 用户设置 > html parser > default value
      if (!(p in userConfig)) {
        v = parser[p];
        // 函数
        if (BUI.isFunction(v)) {
            self.setInternal(p, v.call(self, srcNode));
        }
        // 单选选择器
        else if (typeof v == 'string') {
            self.setInternal(p, srcNode.find(v));
        }
        // 多选选择器
        else if (BUI.isArray(v) && v[0]) {
            self.setInternal(p, srcNode.find(v[0]))
        }
      }
    }
  }

  function initParser(self,srcNode){

    var c = self.constructor,
      len,
      p,
      constructorChains;

    constructorChains = collectConstructorChains(self);

    // 从父类到子类开始从 html 读取属性
    for (len = constructorChains.length - 1; len >= 0; len--) {
        c = constructorChains[len];
        if (p = c[PARSER]) {
            applyParser.call(self, srcNode, p);
        }
    }
  }

  function initDecorate(self){
    var _self = self,
      srcNode = _self.get('srcNode'),
      userConfig,
      decorateCfg;
    if(srcNode){
      srcNode = $(srcNode);
      _self.setInternal('el',srcNode);
      _self.setInternal('srcNode',srcNode);

      userConfig = _self.get('userConfig');
      decorateCfg = _self.getDecorateConfig(srcNode);
      setConfigFields(self,decorateCfg);
      
      //如果从DOM中读取子控件
      if(_self.get('isDecorateChild') && _self.decorateInternal){
        _self.decorateInternal(srcNode);
      }
      initParser(self,srcNode);
    }
  }

  /**
   * @class BUI.Component.UIBase.Decorate
   * 将DOM对象封装成控件
   */
  function decorate(){
    initDecorate(this);
  }

  decorate.ATTRS = {

    /**
     * 配置控件的根节点的DOM
     * <pre><code>
     * new Form.Form({
     *   srcNode : '#J_Form'
     * }).render();
     * </code></pre>
     * @cfg {jQuery} srcNode
     */
    /**
     * 配置控件的根节点的DOM
     * @type {jQuery} 
     */
    srcNode : {
      view : true
    },
    /**
     * 是否根据DOM生成子控件
     * @type {Boolean}
     * @protected
     */
    isDecorateChild : {
      value : false
    },
    /**
     * 此配置项配置使用那些srcNode上的节点作为配置项
     *  - 当时用 decorate 时，取 srcNode上的节点的属性作为控件的配置信息
     *  - 默认id,name,value,title 都会作为属性传入
     *  - 使用 'data-cfg' 作为整体的配置属性
     *  <pre><code>
     *     <input id="c1" type="text" name="txtName" id="id",data-cfg="{allowBlank:false}" />
     *     //会生成以下配置项：
     *     {
     *         name : 'txtName',
     *         id : 'id',
     *         allowBlank:false
     *     }
     *     new Form.Field({
     *        src:'#c1'
     *     }).render();
     *  </code></pre>
     * @type {Object}
     * @protected
     */
    decorateCfgFields : {
      value : {
        'id' : true,
        'name' : true,
        'value' : true,
        'title' : true
      }
    }
  };

  decorate.prototype = {

    /**
     * 获取控件的配置信息
     * @protected
     */
    getDecorateConfig : function(el){
      if(!el.length){
        return null;
      }
      var _self = this,
        dom = el[0],
        attributes = dom.attributes,
        decorateCfgFields = _self.get('decorateCfgFields'),
        config = {},
        statusCfg = _self._getStautsCfg(el);

      BUI.each(attributes,function(attr){
        var name = attr.nodeName;
        try{
          if(name === FIELD_CFG){
              var cfg = parseFieldValue(attr.nodeValue);
              BUI.mix(config,cfg);
          }
          else if(isConfigField(name,decorateCfgFields)){
            var value = attr.nodeValue;
            if(name.indexOf(FIELD_PREFIX) !== -1){
              name = name.replace(FIELD_PREFIX,'');
              name = camelCase(name);
              value = parseFieldValue(value);
            }
            
            if(config[name] && BUI.isObject(value)){
              BUI.mix(config[name],value);
            }else{
              config[name] = value;
            }
          }
        }catch(e){
          BUI.log('parse field error,the attribute is:' + name);
        }
      });
      return BUI.mix(config,statusCfg);
    },
    //根据css class获取状态属性
    //如： selected,disabled等属性
    _getStautsCfg : function(el){
      var _self = this,
        rst = {},
        statusCls = _self.get('statusCls');
      BUI.each(statusCls,function(v,k){
        if(el.hasClass(v)){
          rst[k] = true;
        }
      });
      return rst;
    },
    /**
     * 获取封装成子控件的节点集合
     * @protected
     * @return {Array} 节点集合
     */
    getDecorateElments : function(){
      var _self = this,
        el = _self.get('el'),
        contentContainer = _self.get('childContainer');
      if(contentContainer){
        return el.find(contentContainer).children();
      }else{
        return el.children();
      }
    },

    /**
     * 封装所有的子控件
     * @protected
     * @param {jQuery} el Root element of current component.
     */
    decorateInternal: function (el) {
      var self = this;
      self.decorateChildren(el);
    },
    /**
     * 获取子控件的xclass类型
     * @protected
     * @param {jQuery} childNode 子控件的根节点
     */
    findXClassByNode: function (childNode, ignoreError) {
      var _self = this,
        cls = childNode.attr("class") || '',
        childClass = _self.get('defaultChildClass'); //如果没有样式或者查找不到对应的类，使用默认的子控件类型

          // 过滤掉特定前缀
      cls = cls.replace(new RegExp("\\b" + prefixCls, "ig"), "");

      var UI = Manager.getConstructorByXClass(cls) ||  Manager.getConstructorByXClass(childClass);

      if (!UI && !ignoreError) {
        BUI.log(childNode);
        BUI.error("can not find ui " + cls + " from this markup");
      }
      return Manager.getXClassByConstructor(UI);
    },
    // 生成一个组件
    decorateChildrenInternal: function (xclass, c) {
      var _self = this,
        children = _self.get('children');
      children.push({
        xclass : xclass,
        srcNode: c
      });
    },
    /**
     * 封装子控件
     * @private
     * @param {jQuery} el component's root element.
     */
    decorateChildren: function (el) {
      var _self = this,
          children = _self.getDecorateElments();
      BUI.each(children,function(c){
        var xclass = _self.findXClassByNode($(c));
        _self.decorateChildrenInternal(xclass, $(c));
      });
    }
  };

  return decorate;
});/**
 * @fileOverview 控件模板
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/tpl',function () {

  /**
   * @private
   * 控件模板扩展类的渲染类(view)
   * @class BUI.Component.UIBase.TplView
   */
  function tplView () {
    
  }

  tplView.ATTRS = {
    /**
     * 模板
     * @protected
     * @type {String}
     */
    tpl:{

    },
    tplEl : {

    }
  };

  tplView.prototype = {
    __renderUI : function(){
      var _self = this,
        contentContainer = _self.get('childContainer'),
        contentEl;

      if(contentContainer){
        contentEl = _self.get('el').find(contentContainer);
        if(contentEl.length){
          _self.set('contentEl',contentEl);
        }
      }
    },
    /**
     * 获取生成控件的模板
     * @protected
     * @param  {Object} attrs 属性值
     * @return {String} 模板
     */
    getTpl:function (attrs) {
        var _self = this,
            tpl = _self.get('tpl'),
            tplRender = _self.get('tplRender');
        attrs = attrs || _self.getAttrVals();

        if(tplRender){
          return tplRender(attrs);
        }
        if(tpl){
          return BUI.substitute(tpl,attrs);
        }
        return '';
    },
    /**
     * 如果控件设置了模板，则根据模板和属性值生成DOM
     * 如果设置了content属性，此模板不应用
     * @protected
     * @param  {Object} attrs 属性值，默认为初始化时传入的值
     */
    setTplContent:function (attrs) {
        var _self = this,
            el = _self.get('el'),
            content = _self.get('content'),
            tplEl = _self.get('tplEl'),
            tpl = _self.getTpl(attrs);

        //tplEl.remove();
        if(!content && tpl){ //替换掉原先的内容
          el.empty();
          el.html(tpl);
          /*if(tplEl){
            var node = $(tpl).insertBefore(tplEl);
            tplEl.remove();
            tplEl = node;
          }else{
            tplEl = $(tpl).appendTo(el);
          }
          _self.set('tplEl',tplEl)
          */
        }
    }
  }

  /**
   * 控件的模板扩展
   * @class BUI.Component.UIBase.Tpl
   */
  function tpl() {

  }

  tpl.ATTRS = {
    /**
    * 控件的模版，用于初始化
    * <pre><code>
    * var list = new List.List({
    *   tpl : '&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;',
    *   childContainer : 'ul'
    * });
    * //用于统一子控件模板
    * var list = new List.List({
    *   defaultChildCfg : {
    *     tpl : '&lt;span&gt;{text}&lt;/span&gt;'
    *   }
    * });
    * list.render();
    * </code></pre>
    * @cfg {String} tpl
    */
    /**
     * 控件的模板
     * <pre><code>
     *   list.set('tpl','&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;&lt;div class="bottom"&gt;&lt;/div&gt;')
     * </code></pre>
     * @type {String}
     */
    tpl : {
      view : true,
      sync: false
    },
    /**
     * <p>控件的渲染函数，应对一些简单模板解决不了的问题，例如有if,else逻辑，有循环逻辑,
     * 函数原型是function(data){},其中data是控件的属性值</p>
     * <p>控件模板的加强模式，此属性会覆盖@see {BUI.Component.UIBase.Tpl#property-tpl}属性</p>
     * //用于统一子控件模板
     * var list = new List.List({
     *   defaultChildCfg : {
     *     tplRender : funciton(item){
     *       if(item.type == '1'){
     *         return 'type1 html';
     *       }else{
     *         return 'type2 html';
     *       }
     *     }
     *   }
     * });
     * list.render();
     * @cfg {Function} tplRender
     */
    tplRender : {
      view : true,
      value : null
    },
    /**
     * 这是一个选择器，使用了模板后，子控件可能会添加到模板对应的位置,
     *  - 默认为null,此时子控件会将控件最外层 el 作为容器
     * <pre><code>
     * var list = new List.List({
     *   tpl : '&lt;div class="toolbar"&gt;&lt;/div&gt;&lt;ul&gt;&lt;/ul&gt;',
     *   childContainer : 'ul'
     * });
     * </code></pre>
     * @cfg {String} childContainer
     */
    childContainer : {
      view : true
    }
  };

  tpl.prototype = {

    __renderUI : function () {
      //使用srcNode时，不使用模板
      if(!this.get('srcNode')){
        this.setTplContent();
      }
    },
    /**
     * 控件信息发生改变时，控件内容跟模板相关时需要调用这个函数，
     * 重新通过模板和控件信息构造内容
     */
    updateContent : function(){
      this.setTplContent();
    },
    /**
     * 根据控件的属性和模板生成控件内容
     * @protected
     */
    setTplContent : function () {
      var _self = this,
        attrs = _self.getAttrVals();
      _self.get('view').setTplContent(attrs);
    },
    //模板发生改变
    _uiSetTpl : function(){
      this.setTplContent();
    }
  };


  tpl.View = tplView;

  return tpl;
});
 

/**
 * @fileOverview 可以展开折叠的控件
 * @ignore
 */

define('bui/component/uibase/collapsable',function () {

  /**
  * 控件展开折叠的视图类
  * @class BUI.Component.UIBase.CollapsableView
  * @private
  */
  var collapsableView = function(){
  
  };

  collapsableView.ATTRS = {
    collapsed : {}
  }

  collapsableView.prototype = {
    //设置收缩样式
    _uiSetCollapsed : function(v){
      var _self = this,
        cls = _self.getStatusCls('collapsed'),
        el = _self.get('el');
      if(v){
        el.addClass(cls);
      }else{
        el.removeClass(cls);
      }
    }
  }
  /**
   * 控件展开折叠的扩展
   * @class BUI.Component.UIBase.Collapsable
   */
  var collapsable = function(){
    
  };

  collapsable.ATTRS = {
    /**
     * 是否可折叠
     * @type {Boolean}
     */
    collapsable: {
      value : false
    },
    /**
     * 是否已经折叠 collapsed
     * @cfg {Boolean} collapsed
     */
    /**
     * 是否已经折叠
     * @type {Boolean}
     */
    collapsed : {
      view : true,
      value : false
    },
    events : {
      value : {
        /**
         * 控件展开
         * @event
         * @param {Object} e 事件对象
         * @param {BUI.Component.Controller} target 控件
         */
        'expanded' : true,
        /**
         * 控件折叠
         * @event
         * @param {Object} e 事件对象
         * @param {BUI.Component.Controller} target 控件
         */
        'collapsed' : true
      }
    }
  };

  collapsable.prototype = {
    _uiSetCollapsed : function(v){
      var _self = this;
      if(v){
        _self.fire('collapsed');
      }else{
        _self.fire('expanded');
      }
    }
  };

  collapsable.View = collapsableView;
  
  return collapsable;
});/**
 * @fileOverview 单选或者多选
 * @author  dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/selection',function () {
    var 
        SINGLE_SELECTED = 'single';

    /**
     * @class BUI.Component.UIBase.Selection
     * 选中控件中的项（子元素或者DOM），此类选择的内容有2种
     * <ol>
     *     <li>子控件</li>
     *     <li>DOM元素</li>
     * </ol>
     * ** 当选择是子控件时，element 和 item 都是指 子控件；**
     * ** 当选择的是DOM元素时，element 指DOM元素，item 指DOM元素对应的记录 **
     * @abstract
     */
    var selection = function(){

    };

    selection.ATTRS = 
   
    {
        /**
         * 选中的事件
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value',
         *   selectedEvent : 'mouseenter',
         *   render : '#t1',
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         * </code></pre>
         * @cfg {String} [selectedEvent = 'click']
         */
        selectedEvent:{
            value : 'click'
        },
        events : {
            value : {
                /**
                   * 选中的菜单改变时发生，
                   * 多选时，选中，取消选中都触发此事件，单选时，只有选中时触发此事件
                   * @name  BUI.Component.UIBase.Selection#selectedchange
                   * @event
                   * @param {Object} e 事件对象
                   * @param {Object} e.item 当前选中的项
                   * @param {HTMLElement} e.domTarget 当前选中的项的DOM结构
                   * @param {Boolean} e.selected 是否选中
                   */
                'selectedchange' : false,

                /**
                   * 选择改变前触发，可以通过return false，阻止selectedchange事件
                   * @event
                   * @param {Object} e 事件对象
                   * @param {Object} e.item 当前选中的项
                   * @param {Boolean} e.selected 是否选中
                   */
                'beforeselectedchange' : false,

                /**
                   * 菜单选中
                   * @event
                   * @param {Object} e 事件对象
                   * @param {Object} e.item 当前选中的项
                   * @param {HTMLElement} e.domTarget 当前选中的项的DOM结构
                   */
                'itemselected' : false,
                /**
                   * 菜单取消选中
                   * @event
                   * @param {Object} e 事件对象
                   * @param {Object} e.item 当前选中的项
                   * @param {HTMLElement} e.domTarget 当前选中的项的DOM结构
                   */
                'itemunselected' : false
            }
        },
        /**
         * 数据的id字段名称，通过此字段查找对应的数据
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value',
         *   render : '#t1',
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         * </code></pre>
         * @cfg {String} [idField = 'id']
         */
        /**
         * 数据的id字段名称，通过此字段查找对应的数据
         * @type {String}
         * @ignore
         */
        idField : {
            value : 'id'
        },
        /**
         * 是否多选
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value',
         *   render : '#t1',
         *   multipleSelect : true,
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         * </code></pre>
         * @cfg {Boolean} [multipleSelect=false]
         */
        /**
         * 是否多选
         * @type {Boolean}
         * @default false
         */
        multipleSelect : {
            value : false
        }

    };

    selection.prototype = 
    
    {
        /**
         * 清理选中的项
         * <pre><code>
         *  list.clearSelection();
         * </code></pre>
         *
         */
        clearSelection : function(){
            var _self = this,
                selection = _self.getSelection();
            BUI.each(selection,function(item){
                _self.clearSelected(item);
            });
        },
        /**
         * 获取选中的项的值
         * @template
         * @return {Array} 
         */
        getSelection : function(){

        },
        /**
         * 获取选中的第一项
         * <pre><code>
         * var item = list.getSelected(); //多选模式下第一条
         * </code></pre>
         * @return {Object} 选中的第一项或者为undefined
         */
        getSelected : function(){
            return this.getSelection()[0];
        },
        /**
         * 根据 idField 获取到的值
         * @protected
         * @return {Object} 选中的值
         */
        getSelectedValue : function(){
            var _self = this,
                field = _self.get('idField'),
                item = _self.getSelected();

            return _self.getValueByField(item,field);
        },
        /**
         * 获取选中的值集合
         * @protected
         * @return {Array} 选中值得集合
         */
        getSelectionValues:function(){
            var _self = this,
                field = _self.get('idField'),
                items = _self.getSelection();
            return $.map(items,function(item){
                return _self.getValueByField(item,field);
            });
        },
        /**
         * 获取选中的文本
         * @protected
         * @return {Array} 选中的文本集合
         */
        getSelectionText:function(){
            var _self = this,
                items = _self.getSelection();
            return $.map(items,function(item){
                return _self.getItemText(item);
            });
        },
        /**
         * 移除选中
         * <pre><code>
         *    var item = list.getItem('id'); //通过id 获取选项
         *    list.setSelected(item); //选中
         *
         *    list.clearSelected();//单选模式下清除所选，多选模式下清除选中的第一项
         *    list.clearSelected(item); //清除选项的选中状态
         * </code></pre>
         * @param {Object} [item] 清除选项的选中状态，如果未指定则清除选中的第一个选项的选中状态
         */
        clearSelected : function(item){
            var _self = this;
            item = item || _self.getSelected();
            if(item){
                _self.setItemSelected(item,false);
            } 
        },
        /**
         * 获取选项显示的文本
         * @protected
         */
        getSelectedText : function(){
            var _self = this,
                item = _self.getSelected();
            return _self.getItemText(item);
        },
        /**
         * 设置选中的项
         * <pre><code>
         *  var items = list.getItemsByStatus('active'); //获取某种状态的选项
         *  list.setSelection(items);
         * </code></pre>
         * @param {Array} items 项的集合
         */
        setSelection: function(items){
            var _self = this;

            items = BUI.isArray(items) ? items : [items];

            BUI.each(items,function(item){
                _self.setSelected(item);
            }); 
        },
        /**
         * 设置选中的项
         * <pre><code>
         *   var item = list.getItem('id');
         *   list.setSelected(item);
         * </code></pre>
         * @param {Object} item 记录或者子控件
         */
        setSelected: function(item){
            var _self = this,
                multipleSelect = _self.get('multipleSelect');

            if(!_self.isItemSelectable(item)){
                return;
            }    
            if(!multipleSelect){
                var selectedItem = _self.getSelected();
                if(item != selectedItem){
                    //如果是单选，清除已经选中的项
                    _self.clearSelected(selectedItem);
                }
               
            }
            _self.setItemSelected(item,true);
            
        },
        /**
         * 选项是否被选中
         * @template
         * @param  {*}  item 选项
         * @return {Boolean}  是否选中
         */
        isItemSelected : function(item){

        },
        /**
         * 选项是否可以选中
         * @protected
         * @param {*} item 选项
         * @return {Boolean} 选项是否可以选中
         */
        isItemSelectable : function(item){
          return true;
        },
        /**
         * 设置选项的选中状态
         * @param {*} item 选项
         * @param {Boolean} selected 选中或者取消选中
         * @protected
         */
        setItemSelected : function(item,selected){
            var _self = this,
                isSelected;
            
            //当前状态等于要设置的状态时，不触发改变事件
            if(item){
                isSelected =  _self.isItemSelected(item);
                if(isSelected == selected){
                    return;
                }
            }
            if(_self.fire('beforeselectedchange',{item : item,selected : selected}) !== false){
                _self.setItemSelectedStatus(item,selected);
            }
        },
        /**
         * 设置选项的选中状态
         * @template
         * @param {*} item 选项
         * @param {Boolean} selected 选中或者取消选中
         * @protected
         */
        setItemSelectedStatus : function(item,selected){

        },
        /**
         * 设置所有选项选中
         * <pre><code>
         *  list.setAllSelection(); //选中全部，多选状态下有效
         * </code></pre>
         * @template
         */
        setAllSelection : function(){
          
        },
        /**
         * 设置项选中，通过字段和值
         * @param {String} field 字段名,默认为配置项'idField',所以此字段可以不填写，仅填写值
         * @param {Object} value 值
         * @example
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{id}"&gt;{text}&lt;/li&gt;',
         *   idField : 'id', //id 字段作为key
         *   render : '#t1',
         *   items : [{id : '1',text : '1'},{id : '2',text : '2'}]
         * });
         *
         *   list.setSelectedByField('123'); //默认按照id字段查找
         *   //或者
         *   list.setSelectedByField('id','123');
         *
         *   list.setSelectedByField('value','123');
         * </code></pre>
         */
        setSelectedByField:function(field,value){
            if(!value){
                value = field;
                field = this.get('idField');
            }
            var _self = this,
                item = _self.findItemByField(field,value);
            _self.setSelected(item);
        },
        /**
         * 设置多个选中，根据字段和值
         * <pre><code>
         * var list = new List.SimpleList({
         *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
         *   idField : 'value', //value 字段作为key
         *   render : '#t1',
         *   multipleSelect : true,
         *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
         * });
         *   var values = ['1','2','3'];
         *   list.setSelectionByField(values);//
         *
         *   //等于
         *   list.setSelectionByField('value',values);
         * </code></pre>
         * @param {String} field 默认为idField
         * @param {Array} values 值得集合
         */
        setSelectionByField:function(field,values){
            if(!values){
                values = field;
                field = this.get('idField');
            }
            var _self = this;
            BUI.each(values,function(value){
                _self.setSelectedByField(field,value);
            });   
        },
        /**
         * 选中完成后，触发事件
         * @protected
         * @param  {*} item 选项
         * @param  {Boolean} selected 是否选中
         * @param  {jQuery} element 
         */
        afterSelected : function(item,selected,element){
            var _self = this;

            if(selected){
                _self.fire('itemselected',{item:item,domTarget:element});
                _self.fire('selectedchange',{item:item,domTarget:element,selected:selected});
            }else{
                _self.fire('itemunselected',{item:item,domTarget:element});
                if(_self.get('multipleSelect')){ //只有当多选时，取消选中才触发selectedchange
                    _self.fire('selectedchange',{item:item,domTarget:element,selected:selected});
                } 
            } 
        }

    }
    
    return selection;
});/**
 * @fileOverview 所有子元素都是同一类的集合
 * @ignore
 */

define('bui/component/uibase/list',['bui/component/uibase/selection'],function (require) {
  
  var Selection = require('bui/component/uibase/selection');

  /**
   * 列表一类的控件的扩展，list,menu,grid都是可以从此类扩展
   * @class BUI.Component.UIBase.List
   */
  var list = function(){

  };

  list.ATTRS = {

    /**
     * 选择的数据集合
     * <pre><code>
     * var list = new List.SimpleList({
     *   itemTpl : '&lt;li id="{value}"&gt;{text}&lt;/li&gt;',
     *   idField : 'value',
     *   render : '#t1',
     *   items : [{value : '1',text : '1'},{value : '2',text : '2'}]
     * });
     * list.render();
     * </code></pre>
     * @cfg {Array} items
     */
    /**
     * 选择的数据集合
     * <pre><code>
     *  list.set('items',items); //列表会直接替换内容
     *  //等同于 
     *  list.clearItems();
     *  list.addItems(items);
     * </code></pre>
     * @type {Array}
     */
    items:{
      shared : false,
      view : true
    },
    /**
     * 选项的默认key值
     * @cfg {String} [idField = 'id']
     */
    idField : {
      value : 'id'
    },
    /**
     * 列表项的默认模板,仅在初始化时传入。
     * @type {String}
     * @ignore
     */
    itemTpl : {
      view : true
    },
    /**
     * 列表项的渲染函数，应对列表项之间有很多差异时
     * <pre><code>
     * var list = new List.SimpleList({
     *   itemTplRender : function(item){
     *     if(item.type == '1'){
     *       return '&lt;li&gt;&lt;img src="xxx.jpg"/&gt;'+item.text+'&lt;/li&gt;'
     *     }else{
     *       return '&lt;li&gt;item.text&lt;/li&gt;'
     *     }
     *   },
     *   idField : 'value',
     *   render : '#t1',
     *   items : [{value : '1',text : '1',type : '0'},{value : '2',text : '2',type : '1'}]
     * });
     * list.render();
     * </code></pre>
     * @type {Function}
     */
    itemTplRender : {
      view : true
    },
    /**
     * 子控件各个状态默认采用的样式
     * <pre><code>
     * var list = new List.SimpleList({
     *   render : '#t1',
     *   itemStatusCls : {
     *     selected : 'active', //默认样式为list-item-selected,现在变成'active'
     *     hover : 'hover' //默认样式为list-item-hover,现在变成'hover'
     *   },
     *   items : [{id : '1',text : '1',type : '0'},{id : '2',text : '2',type : '1'}]
     * });
     * list.render();
     * </code></pre>
     * see {@link BUI.Component.Controller#property-statusCls}
     * @type {Object}
     */
    itemStatusCls : {
      view : true,
      value : {}
    },
    events : {

      value : {
        /**
         * 选项点击事件
         * @event
         * @param {Object} e 事件对象
         * @param {BUI.Component.UIBase.ListItem} e.item 点击的选项
         * @param {HTMLElement} e.element 选项代表的DOM对象
         * @param {HTMLElement} e.domTarget 点击的DOM对象
         * @param {HTMLElement} e.domEvent 点击的原生事件对象
         */
        'itemclick' : true
      }  
    }
  };

  list.prototype = {

    /**
     * 获取选项的数量
     * <pre><code>
     *   var count = list.getItemCount();
     * </code></pre>
     * @return {Number} 选项数量
     */
    getItemCount : function () {
        return this.getItems().length;
    },
    /**
     * 获取字段的值
     * @param {*} item 字段名
     * @param {String} field 字段名
     * @return {*} 字段的值
     * @protected
     */
    getValueByField : function(item,field){

    },
    /**
     * 获取所有选项值，如果选项是子控件，则是所有子控件
     * <pre><code>
     *   var items = list.getItems();
     *   //等同
     *   list.get(items);
     * </code></pre>
     * @return {Array} 选项值集合
     */
    getItems : function () {
      
    },
    /**
     * 获取第一项
     * <pre><code>
     *   var item = list.getFirstItem();
     *   //等同
     *   list.getItemAt(0);
     * </code></pre>
     * @return {Object|BUI.Component.Controller} 选项值（子控件）
     */
    getFirstItem : function () {
      return this.getItemAt(0);
    },
    /**
     * 获取最后一项
     * <pre><code>
     *   var item = list.getLastItem();
     *   //等同
     *   list.getItemAt(list.getItemCount()-1);
     * </code></pre>
     * @return {Object|BUI.Component.Controller} 选项值（子控件）
     */
    getLastItem : function () {
      return this.getItemAt(this.getItemCount() - 1);
    },
    /**
     * 通过索引获取选项值（子控件）
     * <pre><code>
     *   var item = list.getItemAt(0); //获取第1个
     *   var item = list.getItemAt(2); //获取第3个
     * </code></pre>
     * @param  {Number} index 索引值
     * @return {Object|BUI.Component.Controller}  选项（子控件）
     */
    getItemAt : function  (index) {
      return this.getItems()[index] || null;
    },
    /**
     * 通过Id获取选项，如果是改变了idField则通过改变的idField来查找选项
     * <pre><code>
     *   //如果idField = 'id'
     *   var item = list.getItem('2'); 
     *   //等同于
     *   list.findItemByField('id','2');
     *
     *   //如果idField = 'value'
     *   var item = list.getItem('2'); 
     *   //等同于
     *   list.findItemByField('value','2');
     * </code></pre>
     * @param {String} id 编号
     * @return {Object|BUI.Component.Controller} 选项（子控件）
     */
    getItem : function(id){
      var field = this.get('idField');
      return this.findItemByField(field,id);
    },
    /**
     * 返回指定项的索引
     * <pre><code>
     * var index = list.indexOf(item); //返回索引，不存在则返回-1
     * </code></pre>
     * @param  {Object|BUI.Component.Controller} item 选项
     * @return {Number}   项的索引值
     */
    indexOfItem : function(item){
      return BUI.Array.indexOf(item,this.getItems());
    },
    /**
     * 添加多条选项
     * <pre><code>
     * var items = [{id : '1',text : '1'},{id : '2',text : '2'}];
     * list.addItems(items);
     * </code></pre>
     * @param {Array} items 记录集合（子控件配置项）
     */
    addItems : function (items) {
      var _self = this;
      BUI.each(items,function (item) {
          _self.addItem(item);
      });
    },
    /**
     * 插入多条记录
     * <pre><code>
     * var items = [{id : '1',text : '1'},{id : '2',text : '2'}];
     * list.addItemsAt(items,0); // 在最前面插入
     * list.addItemsAt(items,2); //第三个位置插入
     * </code></pre>
     * @param  {Array} items 多条记录
     * @param  {Number} start 起始位置
     */
    addItemsAt : function(items,start){
      var _self = this;
      BUI.each(items,function (item,index) {
        _self.addItemAt(item,start + index);
      });
    },
    /**
     * 更新列表项，修改选项值后，DOM跟随变化
     * <pre><code>
     *   var item = list.getItem('2');
     *   list.text = '新内容'; //此时对应的DOM不会变化
     *   list.updateItem(item); //DOM进行相应的变化
     * </code></pre>
     * @param  {Object} item 选项值
     */
    updateItem : function(item){

    },
    /**
     * 添加选项,添加在控件最后
     * 
     * <pre><code>
     * list.addItem({id : '3',text : '3',type : '0'});
     * </code></pre>
     * 
     * @param {Object|BUI.Component.Controller} item 选项，子控件配置项、子控件
     * @return {Object|BUI.Component.Controller} 子控件或者选项记录
     */
    addItem : function (item) {
       return this.addItemAt(item,this.getItemCount());
    },
    /**
     * 在指定位置添加选项
     * <pre><code>
     * list.addItemAt({id : '3',text : '3',type : '0'},0); //第一个位置
     * </code></pre>
     * @param {Object|BUI.Component.Controller} item 选项，子控件配置项、子控件
     * @param {Number} index 索引
     * @return {Object|BUI.Component.Controller} 子控件或者选项记录
     */
    addItemAt : function(item,index) {

    },
    /**
      * 根据字段查找指定的项
      * @param {String} field 字段名
      * @param {Object} value 字段值
      * @return {Object} 查询出来的项（传入的记录或者子控件）
      * @protected
    */
    findItemByField:function(field,value){

    },
    /**
     * 
     * 获取此项显示的文本  
     * @param {Object} item 获取记录显示的文本
     * @protected            
     */
    getItemText:function(item){

    },
    /**
     * 清除所有选项,不等同于删除全部，此时不会触发删除事件
     * <pre><code>
     * list.clearItems(); 
     * //等同于
     * list.set('items',items);
     * </code></pre>
     */
    clearItems : function(){
      var _self = this,
          items = _self.getItems();
      items.splice(0);
      _self.clearControl();
    },
    /**
     * 删除选项
     * <pre><code>
     * var item = list.getItem('1');
     * list.removeItem(item);
     * </code></pre>
     * @param {Object|BUI.Component.Controller} item 选项（子控件）
     */
    removeItem : function (item) {

    },
    /**
     * 移除选项集合
     * <pre><code>
     * var items = list.getSelection();
     * list.removeItems(items);
     * </code></pre>
     * @param  {Array} items 选项集合
     */
    removeItems : function(items){
      var _self = this;

      BUI.each(items,function(item){
          _self.removeItem(item);
      });
    },
    /**
     * 通过索引删除选项
     * <pre><code>
     * list.removeItemAt(0); //删除第一个
     * </code></pre>
     * @param  {Number} index 索引
     */
    removeItemAt : function (index) {
      this.removeItem(this.getItemAt(index));
    },
    /**
     * @protected
     * @template
     * 清除所有的子控件或者列表项的DOM
     */
    clearControl : function(){

    }
  }

  

  

  function clearSelected(item){
    if(item.selected){
        item.selected = false;
    }
    if(item.set){
        item.set('selected',false);
    }
  }

  function beforeAddItem(self,item){

    var c = item.isController ? item.getAttrVals() : item,
      defaultTpl = self.get('itemTpl'),
      defaultStatusCls = self.get('itemStatusCls'),
      defaultTplRender = self.get('itemTplRender');

    //配置默认模板
    if(defaultTpl && !c.tpl){
      setItemAttr(item,'tpl',defaultTpl);
      //  c.tpl = defaultTpl;
    }
    //配置默认渲染函数
    if(defaultTplRender && !c.tplRender){
      setItemAttr(item,'tplRender',defaultTplRender);
      //c.tplRender = defaultTplRender;
    }
    //配置默认状态样式
    if(defaultStatusCls){
      var statusCls = c.statusCls || item.isController ? item.get('statusCls') : {};
      BUI.each(defaultStatusCls,function(v,k){
        if(v && !statusCls[k]){
            statusCls[k] = v;
        }
      });
      setItemAttr(item,'statusCls',statusCls)
      //item.statusCls = statusCls;
    }
   // clearSelected(item);
  }
  function setItemAttr(item,name,val){
    if(item.isController){
      item.set(name,val);
    }else{
      item[name] = val;
    }
  }
  
  /**
  * @class BUI.Component.UIBase.ChildList
  * 选中其中的DOM结构
  * @extends BUI.Component.UIBase.List
  * @mixins BUI.Component.UIBase.Selection
  */
  var childList = function(){
    this.__init();
  };

  childList.ATTRS = BUI.merge(true,list.ATTRS,Selection.ATTRS,{
    items : {
      sync : false
    },
    /**
     * 配置的items 项是在初始化时作为children
     * @protected
     * @type {Boolean}
     */
    autoInitItems : {
      value : true
    },
    /**
     * 使用srcNode时，是否将内部的DOM转换成子控件
     * @type {Boolean}
     */
    isDecorateChild : {
      value : true
    },
    /**
     * 默认的加载控件内容的配置,默认值：
     * <pre>
     *  {
     *   property : 'children',
     *   dataType : 'json'
     * }
     * </pre>
     * @type {Object}
     */
    defaultLoaderCfg  : {
      value : {
        property : 'children',
        dataType : 'json'
      }
    }
  });

  BUI.augment(childList,list,Selection,{
    //初始化，将items转换成children
    __init : function(){
      var _self = this,
        items = _self.get('items');
      if(items && _self.get('autoInitItems')){
        _self.addItems(items);
      } 
      _self.on('beforeRenderUI',function(){
        _self._beforeRenderUI();
      });
    },
    _uiSetItems : function (items) {
      var _self = this;
      //清理子控件
      _self.clearControl();
      _self.addItems(items);
    },
    //渲染子控件
    _beforeRenderUI : function(){
      var _self = this,
        children = _self.get('children'),
        items = _self.get('items');   
      BUI.each(children,function(item){
        beforeAddItem(_self,item);
      });
    },
    //绑定事件
    __bindUI : function(){
      var _self = this,
        selectedEvent = _self.get('selectedEvent');
     
      _self.on(selectedEvent,function(e){
        var item = e.target;
        if(item.get('selectable')){
            if(!item.get('selected')){
              _self.setSelected(item);
            }else if(_self.get('multipleSelect')){
              _self.clearSelected(item);
            }
        }
      });

      _self.on('click',function(e){
        if(e.target !== _self){
          _self.fire('itemclick',{item:e.target,domTarget : e.domTarget,domEvent : e});
        }
      });
      _self.on('beforeAddChild',function(ev){
        beforeAddItem(_self,ev.child);
      });
      _self.on('beforeRemoveChild',function(ev){
        var item = ev.child,
          selected = item.get('selected');
        //清理选中状态
        if(selected){
          if(_self.get('multipleSelect')){
            _self.clearSelected(item);
          }else{
            _self.setSelected(null);
          }
        }
        item.set('selected',false);
      });
    },
    /**
     * @protected
     * @override
     * 清除者列表项的DOM
     */
    clearControl : function(){
      this.removeChildren(true);
    },
    /**
     * 获取所有子控件
     * @return {Array} 子控件集合
     * @override
     */
    getItems : function () {
      return this.get('children');
    },
    /**
     * 更新列表项
     * @param  {Object} item 选项值
     */
    updateItem : function(item){
      var _self = this,
        idField = _self.get('idField'),
        element = _self.findItemByField(idField,item[idField]);
      if(element){
        element.setTplContent();
      }
      return element;
    },
    /**
     * 删除项,子控件作为选项
     * @param  {Object} element 子控件
     */
    removeItem : function (item) {
      var _self = this,
        idField = _self.get('idField');
      if(!(item instanceof BUI.Component.Controller)){
        item = _self.findItemByField(idField,item[idField]);
      }
      this.removeChild(item,true);
    },
    /**
     * 在指定位置添加选项,此处选项指子控件
     * @param {Object|BUI.Component.Controller} item 子控件配置项、子控件
     * @param {Number} index 索引
     * @return {Object|BUI.Component.Controller} 子控件
     */
    addItemAt : function(item,index) {
      return this.addChild(item,index);
    },
    findItemByField : function(field,value,root){

      root = root || this;
      var _self = this,
        children = root.get('children'),
        result = null;
      $(children).each(function(index,item){
        if(item.get(field) == value){
            result = item;
        }else if(item.get('children').length){
            result = _self.findItemByField(field,value,item);
        }
        if(result){
          return false;
        }
      });
      return result;
    },
    getItemText : function(item){
      return item.get('el').text();
    },
    getValueByField : function(item,field){
        return item && item.get(field);
    },
    /**
     * @protected
     * @ignore
     */
    setItemSelectedStatus : function(item,selected){
      var _self = this,
        method = selected ? 'addClass' : 'removeClass',
        element = null;

      if(item){
        item.set('selected',selected);
        element = item.get('el');
      }
      _self.afterSelected(item,selected,element);
    },
    /**
     * 选项是否被选中
     * @override
     * @param  {*}  item 选项
     * @return {Boolean}  是否选中
     */
    isItemSelected : function(item){
        return item ? item.get('selected') : false;
    },
    /**
     * 设置所有选项选中
     * @override
     */
    setAllSelection : function(){
      var _self = this,
        items = _self.getItems();
      _self.setSelection(items);
    },
    /**
     * 获取选中的项的值
     * @return {Array} 
     * @override
     * @ignore
     */
    getSelection : function(){
        var _self = this,
            items = _self.getItems(),
            rst = [];
        BUI.each(items,function(item){
            if(_self.isItemSelected(item)){
                rst.push(item);
            }
           
        });
        return rst;
    }
  });

  list.ChildList = childList;

  return list;
});

/**
 * @ignore
 * 2013-1-22 
 *   更改显示数据的方式，使用 _uiSetItems
 *//**
 * @fileOverview 子控件的默认配置项
 * @ignore
 */

define('bui/component/uibase/childcfg',function (require) {

  /**
   * @class BUI.Component.UIBase.ChildCfg
   * 子控件默认配置项的扩展类
   */
  var childCfg = function(config){
    this._init();
  };

  childCfg.ATTRS = {
    /**
     * 默认的子控件配置项,在初始化控件时配置
     * 
     *  - 如果控件已经渲染过，此配置项无效，
     *  - 控件生成后，修改此配置项无效。
     * <pre><code>
     *   var control = new Control({
     *     defaultChildCfg : {
     *       tpl : '&lt;li&gt;{text}&lt;/li&gt;',
     *       xclass : 'a-b'
     *     }
     *   });
     * </code></pre>
     * @cfg {Object} defaultChildCfg
     */
    /**
     * @ignore
     */
    defaultChildCfg : {

    }
  };

  childCfg.prototype = {

    _init : function(){
      var _self = this,
        defaultChildCfg = _self.get('defaultChildCfg');
      if(defaultChildCfg){
        _self.on('beforeAddChild',function(ev){
          var child = ev.child;
          if($.isPlainObject(child)){
            BUI.each(defaultChildCfg,function(v,k){
              if(child[k] == null){ //如果未在配置项中设置，则使用默认值
                child[k] = v;
              }
            });
          }
        });
      }
    }

  };

  return childCfg;

});/**
 * @fileOverview 依赖扩展，用于观察者模式中的观察者
 * @ignore
 */

define('bui/component/uibase/depends',['bui/component/manage'],function (require) {
  
  var regexp = /^#(.*):(.*)$/,
    Manager = require('bui/component/manage');

  //获取依赖信息
  function getDepend(name){

    var arr = regexp.exec(name),
      id = arr[1],
      eventType = arr[2],
      source = getSource(id);
    return {
      source : source,
      eventType: eventType
    };
  }

  //绑定依赖
  function bindDepend(self,name,action){
    var depend = getDepend(name),
      source = depend.source,
      eventType = depend.eventType,
      callbak;
    if(source && action && eventType){

      if(BUI.isFunction(action)){//如果action是一个函数
        callbak = action;
      }else if(BUI.isArray(action)){//如果是一个数组，构建一个回调函数
        callbak = function(){
          BUI.each(action,function(methodName){
            if(self[methodName]){
              self[methodName]();
            }
          });
        }
      }
    }
    if(callbak){
      depend.callbak = callbak;
      source.on(eventType,callbak);
      return depend;
    }
    return null;
  }
  //去除依赖
  function offDepend(depend){
    var source = depend.source,
      eventType = depend.eventType,
      callbak = depend.callbak;
    source.off(eventType,callbak);
  }

  //获取绑定的事件源
  function getSource(id){
    var control = Manager.getComponent(id);
    if(!control){
      control = $('#' + id);
      if(!control.length){
        control = null;
      }
    }
    return control;
  }

  /**
   * @class BUI.Component.UIBase.Depends
   * 依赖事件源的扩展
   * <pre><code>
   *       var control = new Control({
   *         depends : {
   *           '#btn:click':['toggle'],//当点击id为'btn'的按钮时，执行 control 的toggle方法
   *           '#checkbox1:checked':['show'],//当勾选checkbox时，显示控件
   *           '#menu:click',function(){}
   *         }
   *       });
   * </code></pre>
   */
  function Depends (){

  };

  Depends.ATTRS = {
    /**
     * 控件的依赖事件，是一个数组集合，每一条记录是一个依赖关系<br/>
     * 一个依赖是注册一个事件，所以需要在一个依赖中提供：
     * <ol>
     * <li>绑定源：为了方便配置，我们使用 #id来指定绑定源，可以使控件的ID（只支持继承{BUI.Component.Controller}的控件），也可以是DOM的id</li>
     * <li>事件名：事件名是一个使用":"为前缀的字符串，例如 "#id:change",即监听change事件</li>
     * <li>触发的方法：可以是一个数组，如["disable","clear"],数组里面是控件的方法名，也可以是一个回调函数</li>
     * </ol>
     * <pre><code>
     *       var control = new Control({
     *         depends : {
     *           '#btn:click':['toggle'],//当点击id为'btn'的按钮时，执行 control 的toggle方法
     *           '#checkbox1:checked':['show'],//当勾选checkbox时，显示控件
     *           '#menu:click',function(){}
     *         }
     *       });
     * </code></pre>
     * ** 注意：** 这些依赖项是在控件渲染（render）后进行的。         
     * @type {Object}
     */
    depends : {

    },
    /**
     * @private
     * 依赖的映射集合
     * @type {Object}
     */
    dependencesMap : {
      shared : false,
      value : {}
    }
  };

  Depends.prototype = {

    __syncUI : function(){
      this.initDependences();
    },
    /**
     * 初始化依赖项
     * @protected
     */
    initDependences : function(){
      var _self = this,
        depends = _self.get('depends');
      BUI.each(depends,function(action,name){
        _self.addDependence(name,action);
      });
    },
    /**
     * 添加依赖，如果已经有同名的事件，则移除，再添加
     * <pre><code>
     *  form.addDependence('#btn:click',['toggle']); //当按钮#btn点击时，表单交替显示隐藏
     *
     *  form.addDependence('#btn:click',function(){//当按钮#btn点击时，表单交替显示隐藏
     *   //TO DO
     *  }); 
     * </code></pre>
     * @param {String} name 依赖项的名称
     * @param {Array|Function} action 依赖项的事件
     */
    addDependence : function(name,action){
      var _self = this,
        dependencesMap = _self.get('dependencesMap'),
        depend;
      _self.removeDependence(name);
      depend = bindDepend(_self,name,action)
      if(depend){
        dependencesMap[name] = depend;
      }
    },
    /**
     * 移除依赖
     * <pre><code>
     *  form.removeDependence('#btn:click'); //当按钮#btn点击时，表单不在监听
     * </code></pre>
     * @param  {String} name 依赖名称
     */
    removeDependence : function(name){
      var _self = this,
        dependencesMap = _self.get('dependencesMap'),
        depend = dependencesMap[name];
      if(depend){
        offDepend(depend);
        delete dependencesMap[name];
      }
    },
    /**
     * 清除所有的依赖
     * <pre><code>
     *  form.clearDependences();
     * </code></pre>
     */
    clearDependences : function(){
      var _self = this,
        map = _self.get('dependencesMap');
      BUI.each(map,function(depend,name){
        offDepend(depend);
      });
      _self.set('dependencesMap',{});
    },
    __destructor : function(){
      this.clearDependences();
    }

  };
  
  return Depends;
});/**
 * @fileOverview bindable extension class.
 * @author dxq613@gmail.com
 * @ignore
 */
define('bui/component/uibase/bindable',function(){
	
	/**
		* bindable extension class.
		* <pre><code>
		*   BUI.use(['bui/list','bui/data','bui/mask'],function(List,Data,Mask){
		*     var store = new Data.Store({
		*       url : 'data/xx.json'
		*     });
		*   	var list = new List.SimpleList({
		*  	    render : '#l1',
		*  	    store : store,
		*  	    loadMask : new Mask.LoadMask({el : '#t1'})
		*     });
		*
		*     list.render();
		*     store.load();
		*   });
		* </code></pre>
		* 使控件绑定store，处理store的事件 {@link BUI.Data.Store}
		* @class BUI.Component.UIBase.Bindable
		*/
	function bindable(){
		
	}

	bindable.ATTRS = 
	{
		/**
		* 绑定 {@link BUI.Data.Store}的事件
		* <pre><code>
		*  var store = new Data.Store({
		*   url : 'data/xx.json',
		*   autoLoad : true
		*  });
		*
		*  var list = new List.SimpleList({
		*  	 render : '#l1',
		*  	 store : store
		*  });
		*
		*  list.render();
		* </code></pre>
		* @cfg {BUI.Data.Store} store
		*/
		/**
		* 绑定 {@link BUI.Data.Store}的事件
		* <pre><code>
		*  var store = list.get('store');
		* </code></pre>
		* @type {BUI.Data.Store}
		*/
		store : {
			
		},
		/**
		* 加载数据时，是否显示等待加载的屏蔽层
		* <pre><code>
		*   BUI.use(['bui/list','bui/data','bui/mask'],function(List,Data,Mask){
		*     var store = new Data.Store({
		*       url : 'data/xx.json'
		*     });
		*   	var list = new List.SimpleList({
		*  	    render : '#l1',
		*  	    store : store,
		*  	    loadMask : new Mask.LoadMask({el : '#t1'})
		*     });
		*
		*     list.render();
		*     store.load();
		*   });
		* </code></pre>
		* @cfg {Boolean|Object} loadMask
		*/
		/**
		* 加载数据时，是否显示等待加载的屏蔽层
		* @type {Boolean|Object} 
		* @ignore
		*/
		loadMask : {
			value : false
		}
	};


	BUI.augment(bindable,
	{

		__bindUI : function(){
			var _self = this,
				store = _self.get('store'),
				loadMask = _self.get('loadMask');
			if(!store){
				return;
			}
			store.on('beforeload',function(e){
				_self.onBeforeLoad(e);
				if(loadMask && loadMask.show){
					loadMask.show();
				}
			});
			store.on('load',function(e){
				_self.onLoad(e);
				if(loadMask && loadMask.hide){
					loadMask.hide();
				}
			});
			store.on('exception',function(e){
				_self.onException(e);
				if(loadMask && loadMask.hide){
					loadMask.hide();
				}
			});
			store.on('add',function(e){
				_self.onAdd(e);
			});
			store.on('remove',function(e){
				_self.onRemove(e);
			});
			store.on('update',function(e){
				_self.onUpdate(e);
			});
			store.on('localsort',function(e){
				_self.onLocalSort(e);
			});
			store.on('filtered',function(e){
				_self.onFiltered(e);
			});
		},
		__syncUI : function(){
			var _self = this,
				store = _self.get('store');
			if(!store){
				return;
			}
			if(store.hasData()){
				_self.onLoad();
			}
		},
		/**
		* @protected
    * @template
		* before store load data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-beforeload}
		*/
		onBeforeLoad : function(e){

		},
		/**
		* @protected
    * @template
		* after store load data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-load}
		*/
		onLoad : function(e){
			
		},
		/**
		* @protected
    * @template
		* occurred exception when store is loading data
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-exception}
		*/
		onException : function(e){
			
		},
		/**
		* @protected
    * @template
		* after added data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-add}
		*/
		onAdd : function(e){
		
		},
		/**
		* @protected
    * @template
		* after remvoed data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-remove}
		*/
		onRemove : function(e){
		
		},
		/**
		* @protected
    * @template
		* after updated data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-update}
		*/
		onUpdate : function(e){
		
		},
		/**
		* @protected
    * @template
		* after local sorted data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-localsort}
		*/
		onLocalSort : function(e){
			
		},
		/**
		* @protected
    * @template
		* after filter data to store
		* @param {Object} e The event object
		* @see {@link BUI.Data.Store#event-filtered}
		*/
		onFiltered : function(e){
		}
	});

	return bindable;
});/**
 * @fileOverview  控件的视图层
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */
define('bui/component/view',['bui/component/manage','bui/component/uibase'],function(require){

  var win = window,
    Manager = require('bui/component/manage'),
    UIBase = require('bui/component/uibase'),//BUI.Component.UIBase,
    doc = document;
    
    /**
     * 控件的视图层基类
     * @class BUI.Component.View
     * @protected
     * @extends BUI.Component.UIBase
     * @mixins BUI.Component.UIBase.TplView
     */
    var View = UIBase.extend([UIBase.TplView],
    {

        /**
         * Get all css class name to be applied to the root element of this component for given state.
         * the css class names are prefixed with component name.
         * @param {String} [state] This component's state info.
         */
        getComponentCssClassWithState: function (state) {
            var self = this,
                componentCls = self.get('ksComponentCss');
            state = state || '';
            return self.getCssClassWithPrefix(componentCls.split(/\s+/).join(state + ' ') + state);
        },

        /**
         * Get full class name (with prefix) for current component
         * @param classes {String} class names without prefixCls. Separated by space.
         * @method
         * @return {String} class name with prefixCls
         * @private
         */
        getCssClassWithPrefix: Manager.getCssClassWithPrefix,

        /**
         * Returns the dom element which is responsible for listening keyboard events.
         * @return {jQuery}
         */
        getKeyEventTarget: function () {
            return this.get('el');
        },
        /**
         * Return the dom element into which child component to be rendered.
         * @return {jQuery}
         */
        getContentElement: function () {
            return this.get('contentEl') || this.get('el');
        },
        /**
         * 获取状态对应的css样式
         * @param  {String} name 状态名称 例如：hover,disabled等等
         * @return {String} 状态样式
         */
        getStatusCls : function(name){
            var self = this,
                statusCls = self.get('statusCls'),
                cls = statusCls[name];
            if(!cls){
                cls = self.getComponentCssClassWithState('-' + name);
            }
            return cls;
        },
        /**
         * 渲染控件
         * @protected
         */
        renderUI: function () {
            var self = this;

            // 新建的节点才需要摆放定位,不支持srcNode模式
            if (!self.get('srcNode')) {
                var render = self.get('render'),
                    el = self.get('el'),
                    renderBefore = self.get('elBefore');
                if (renderBefore) {
                    el.insertBefore(renderBefore, undefined);
                } else if (render) {
                    el.appendTo(render, undefined);
                } else {
                    el.appendTo(doc.body, undefined);
                }
            }
        },
        /**
         * 只负责建立节点，如果是 decorate 过来的，甚至内容会丢失
         * @protected
         * 通过 render 来重建原有的内容
         */
        createDom: function () {
            var self = this,
                contentEl = self.get('contentEl'),
                el = self.get('el');
            if (!self.get('srcNode')) {

                el = $('<' + self.get('elTagName') + '>');

                if (contentEl) {
                    el.append(contentEl);
                }

                self.setInternal('el', el);   
            }
            
            el.addClass(self.getComponentCssClassWithState());
            if (!contentEl) {
                // 没取到,这里设下值, uiSet 时可以 set('content')  取到
                self.setInternal('contentEl', el);
            }
        },
        /**
         * 设置高亮显示
         * @protected
         */
        _uiSetHighlighted: function (v) {
            var self = this,
                componentCls = self.getStatusCls('hover'),
                el = self.get('el');
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },

        /**
         * 设置禁用
         * @protected
         */
        _uiSetDisabled: function (v) {
            var self = this,
                componentCls = self.getStatusCls('disabled'),
                el = self.get('el');
            el[v ? 'addClass' : 'removeClass'](componentCls)
                .attr('aria-disabled', v);
      
            //如果禁用控件时，处于hover状态，则清除
            if(v && self.get('highlighted')){
            self.set('highlighted',false);
            }

            if (self.get('focusable')) {
                //不能被 tab focus 到
                self.getKeyEventTarget().attr('tabIndex', v ? -1 : 0);
            }
        },
        /**
         * 设置激活状态
         * @protected
         */
        _uiSetActive: function (v) {
            var self = this,
                componentCls = self.getStatusCls('active');
            self.get('el')[v ? 'addClass' : 'removeClass'](componentCls)
                .attr('aria-pressed', !!v);
        },
        /**
         * 设置获得焦点
         * @protected
         */
        _uiSetFocused: function (v) {
            var self = this,
                el = self.get('el'),
                componentCls = self.getStatusCls('focused');
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },
        /**
         * 设置控件最外层DOM的属性
         * @protected
         */
        _uiSetElAttrs: function (attrs) {
            this.get('el').attr(attrs);
        },
        /**
         * 设置应用到控件最外层DOM的css class
         * @protected
         */
        _uiSetElCls: function (cls) {
            this.get('el').addClass(cls);
        },
        /**
         * 设置应用到控件最外层DOM的css style
         * @protected
         */
        _uiSetElStyle: function (style) {
            this.get('el').css(style);
        },
        //设置role
        _uiSetRole : function(role){
            if(role){
                this.get('el').attr('role',role);
            } 
        },
        /**
         * 设置应用到控件宽度
         * @protected
         */
        _uiSetWidth: function (w) {
            this.get('el').width(w);
        },
        /**
         * 设置应用到控件高度
         * @protected
         */
        _uiSetHeight: function (h) {
            var self = this;
            self.get('el').height(h);
        },
        /**
         * 设置应用到控件的内容
         * @protected
         */
        _uiSetContent: function (c) {
            var self = this, 
                el;
            // srcNode 时不重新渲染 content
            // 防止内部有改变，而 content 则是老的 html 内容
            if (self.get('srcNode') && !self.get('rendered')) {
            } else {
                el = self.get('contentEl');
                if (typeof c == 'string') {
                    el.html(c);
                } else if (c) {
                    el.empty().append(c);
                }
            }
        },
        /**
         * 设置应用到控件是否可见
         * @protected
         */
        _uiSetVisible: function (isVisible) {
            var self = this,
                el = self.get('el'),
                visibleMode = self.get('visibleMode');
            if (visibleMode === 'visibility') {
                el.css('visibility', isVisible ? 'visible' : 'hidden');
            } else {
                el.css('display', isVisible ? '' : 'none');
            }
        },
        set : function(name,value){
             var _self = this,
                attr = _self.__attrs[name],
                ev,
                ucName,
                m;

            if(!attr || !_self.get('binded')){ //未初始化view或者没用定义属性
                View.superclass.set.call(this,name,value);
                return _self;
            }

            var prevVal = View.superclass.get.call(this,name);

            //如果未改变值不进行修改
            if(!$.isPlainObject(value) && !BUI.isArray(value) && prevVal === value){
                return _self;
            }
            View.superclass.set.call(this,name,value);

            value = _self.__attrVals[name];
            ev = {attrName: name,prevVal: prevVal,newVal: value};
            ucName = BUI.ucfirst(name);
            m = '_uiSet' + ucName;
            if(_self[m]){
                _self[m](value,ev);
            }

            return _self;

        },
        /**
         * 析构函数
         * @protected
         */
        destructor : function () {
            var el = this.get('el');
            if (el) {
                el.remove();
            }
        }
    },{
        xclass : 'view',
        priority : 0
    });


    View.ATTRS = 
    {   
        /**
         * 控件根节点
         * @readOnly
         * see {@link BUI.Component.Controller#property-el}
         */
        el: {
            /**
			* @private
			*/
            setter: function (v) {
                return $(v);
            }
        },

        /**
         * 控件根节点样式
         * see {@link BUI.Component.Controller#property-elCls}
         */
        elCls: {
        },
        /**
         * 控件根节点样式属性
         * see {@link BUI.Component.Controller#property-elStyle}
         */
        elStyle: {
        },
        /**
         * ARIA 标准中的role
         * @type {String}
         */
        role : {
            
        },
        /**
         * 控件宽度
         * see {@link BUI.Component.Controller#property-width}
         */
        width: {
        },
        /**
         * 控件高度
         * see {@link BUI.Component.Controller#property-height}
         */
        height: {
        },
        /**
         * 状态相关的样式,默认情况下会使用 前缀名 + xclass + '-' + 状态名
         * see {@link BUI.Component.Controller#property-statusCls}
         * @type {Object}
         */
        statusCls : {
            value : {}
        },
        /**
         * 控件根节点使用的标签
         * @type {String}
         */
        elTagName: {
            // 生成标签名字
            value: 'div'
        },
        /**
         * 控件根节点属性
         * see {@link BUI.Component.Controller#property-elAttrs}
         * @ignore
         */
        elAttrs: {
        },
        /**
         * 控件内容，html,文本等
         * see {@link BUI.Component.Controller#property-content}
         */
        content: {
        },
        /**
         * 控件插入到指定元素前
         * see {@link BUI.Component.Controller#property-tpl}
         */
        elBefore: {
            // better named to renderBefore, too late !
        },
        /**
         * 控件在指定元素内部渲染
         * see {@link BUI.Component.Controller#property-render}
         * @ignore
         */
        render: {},
        /**
         * 是否可见
         * see {@link BUI.Component.Controller#property-visible}
         */
        visible: {
            value: true
        },
        /**
         * 可视模式
         * see {@link BUI.Component.Controller#property-visibleMode}
         */
        visibleMode: {
            value: 'display'
        },
        /**
         * @private
         * 缓存隐藏时的位置，对应visibleMode = 'visiblity' 的场景
         * @type {Object}
         */
        cachePosition : {

        },
        /**
         * content 设置的内容节点,默认根节点
         * @type {jQuery}
         * @default  el
         */
        contentEl: {
            valueFn: function () {
                return this.get('el');
            }
        },
        /**
         * 样式前缀
         * see {@link BUI.Component.Controller#property-prefixCls}
         */
        prefixCls: {
            value: BUI.prefix
        },
        /**
         * 可以获取焦点
         * @protected
         * see {@link BUI.Component.Controller#property-focusable}
         */
        focusable: {
            value: true
        },
        /**
         * 获取焦点
         * see {@link BUI.Component.Controller#property-focused}
         */
        focused: {},
        /**
         * 激活
         * see {@link BUI.Component.Controller#property-active}
         */
        active: {},
        /**
         * 禁用
         * see {@link BUI.Component.Controller#property-disabled}
         */
        disabled: {},
        /**
         * 高亮显示
         * see {@link BUI.Component.Controller#property-highlighted}
         */
        highlighted: {}
    };

    return View;
});/**
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
});/**
 * @fileOverview  控件可以实例化的基类
 * @ignore
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 */

/**
 * jQuery 事件
 * @class jQuery.Event
 * @private
 */


define('bui/component/controller',['bui/component/uibase','bui/component/manage','bui/component/view','bui/component/loader'],function(require){
    'use strict';
    var UIBase = require('bui/component/uibase'),
        Manager = require('bui/component/manage'),
        View = require('bui/component/view'),
        Loader = require('bui/component/loader'),
        wrapBehavior = BUI.wrapBehavior,
        getWrapBehavior = BUI.getWrapBehavior;

     /**
      * @ignore
      */
     function wrapperViewSetter(attrName) {
        return function (ev) {
            var self = this;
            // in case bubbled from sub component
            if (self === ev.target) {
                var value = ev.newVal,
                    view = self.get('view');
                if(view){
                    view.set(attrName, value); 
                }
               
            }
        };
    }

    /**
      * @ignore
      */
    function wrapperViewGetter(attrName) {
        return function (v) {
            var self = this,
                view = self.get('view');
            return v === undefined ? view.get(attrName) : v;
        };
    }

    /**
      * @ignore
      */
    function initChild(self, c, renderBefore) {
        // 生成父组件的 dom 结构
        self.create();
        var contentEl = self.getContentElement(),
            defaultCls = self.get('defaultChildClass');
        //配置默认 xclass
        if(!c.xclass && !(c instanceof Controller)){
            if(!c.xtype){
                c.xclass = defaultCls;
            }else{
                c.xclass = defaultCls + '-' + c.xtype;
            }
            
        }

        c = BUI.Component.create(c, self);
        c.setInternal('parent', self);
        // set 通知 view 也更新对应属性
        c.set('render', contentEl);
        c.set('elBefore', renderBefore);
        // 如果 parent 也没渲染，子组件 create 出来和 parent 节点关联
        // 子组件和 parent 组件一起渲染
        // 之前设好属性，view ，logic 同步还没 bind ,create 不是 render ，还没有 bindUI
        c.create(undefined);
        return c;
    }

    /**
     * 不使用 valueFn，
     * 只有 render 时需要找到默认，其他时候不需要，防止莫名其妙初始化
     * @ignore
     */
    function constructView(self) {
        // 逐层找默认渲染器
        var attrs,
            attrCfg,
            attrName,
            cfg = {},
            v,
            Render = self.get('xview');

      
        //将渲染层初始化所需要的属性，直接构造器设置过去

        attrs = self.getAttrs();

        // 整理属性，对纯属于 view 的属性，添加 getter setter 直接到 view
        for (attrName in attrs) {
            if (attrs.hasOwnProperty(attrName)) {
                attrCfg = attrs[attrName];
                if (attrCfg.view) {
                    // 先取后 getter
                    // 防止死循环
                    if (( v = self.get(attrName) ) !== undefined) {
                        cfg[attrName] = v;
                    }

                    // setter 不应该有实际操作，仅用于正规化比较好
                    // attrCfg.setter = wrapperViewSetter(attrName);
                    // 不更改attrCfg的定义，可以多个实例公用一份attrCfg
                    /*self.on('after' + BUI.ucfirst(attrName) + 'Change',
                        wrapperViewSetter(attrName));
                    */
                    // 逻辑层读值直接从 view 层读
                    // 那么如果存在默认值也设置在 view 层
                    // 逻辑层不要设置 getter
                    //attrCfg.getter = wrapperViewGetter(attrName);
                }
            }
        }
        // does not autoRender for view
        delete cfg.autoRender;
        cfg.ksComponentCss = getComponentCss(self);
        return new Render(cfg);
    }

    function getComponentCss(self) {
        var constructor = self.constructor,
            cls,
            re = [];
        while (constructor && constructor !== Controller) {
            cls = Manager.getXClassByConstructor(constructor);
            if (cls) {
                re.push(cls);
            }
            constructor = constructor.superclass && constructor.superclass.constructor;
        }
        return re.join(' ');
    }

    function isMouseEventWithinElement(e, elem) {
        var relatedTarget = e.relatedTarget;
        // 在里面或等于自身都不算 mouseenter/leave
        return relatedTarget &&
            ( relatedTarget === elem[0] ||$.contains(elem,relatedTarget));
    }

    /**
     * 可以实例化的控件，作为最顶层的控件类，一切用户控件都继承此控件
     * xclass: 'controller'.
     * ** 创建子控件 ** 
     * <pre><code>
     * var Control = Controller.extend([mixin1,mixin2],{ //原型链上的函数
     *   renderUI : function(){ //创建DOM
     *   
     *   }, 
     *   bindUI : function(){  //绑定事件
     *   
     *   },
     *   destructor : funciton(){ //析构函数
     *   
     *   }
     * },{
     *   ATTRS : { //默认的属性
     *       text : {
     *       
     *       }
     *   }
     * },{
     *     xclass : 'a' //用于把对象解析成类
     * });
     * </code></pre>
     *
     * ** 创建对象 **
     * <pre><code>
     * var c1 = new Control({
     *     render : '#t1', //在t1上创建
     *     text : 'text1',
     *     children : [{xclass : 'a',text : 'a1'},{xclass : 'b',text : 'b1'}]
     * });
     *
     * c1.render();
     * </code></pre>
     * @extends BUI.Component.UIBase
     * @mixins BUI.Component.UIBase.Tpl
     * @mixins BUI.Component.UIBase.Decorate
     * @mixins BUI.Component.UIBase.Depends
     * @mixins BUI.Component.UIBase.ChildCfg
     * @class BUI.Component.Controller
     */
    var Controller = UIBase.extend([UIBase.Decorate,UIBase.Tpl,UIBase.ChildCfg,UIBase.KeyNav,UIBase.Depends],
    {
        /**
         * 是否是控件，标示对象是否是一个UI 控件
         * @type {Boolean}
         */
        isController: true,

        /**
         * 使用前缀获取类的名字
         * @param classes {String} class names without prefixCls. Separated by space.
         * @method
         * @protected
         * @return {String} class name with prefixCls
         */
        getCssClassWithPrefix: Manager.getCssClassWithPrefix,

        /**
         * From UIBase, Initialize this component.             *
         * @protected
         */
        initializer: function () {
            var self = this;

            if(!self.get('id')){
                self.set('id',self.getNextUniqueId());
            }
            Manager.addComponent(self.get('id'),self);
            // initialize view
            var view = constructView(self);
            self.setInternal('view', view);
            self.__view = view;
        },

        /**
         * 返回新的唯一的Id,结果是 'xclass' + number
         * @protected
         * @return {String} 唯一id
         */
        getNextUniqueId : function(){
            var self = this,
                xclass = Manager.getXClassByConstructor(self.constructor);
            return BUI.guid(xclass);
        },
        /**
         * From UIBase. Constructor(or get) view object to create ui elements.
         * @protected
         *
         */
        createDom: function () {
            var self = this,
                //el,
                view = self.get('view');
            view.create(undefined);
            //el = view.getKeyEventTarget();
            /*if (!self.get('allowTextSelection')) {
                //el.unselectable(undefined);
            }*/
        },

        /**
         * From UIBase. Call view object to render ui elements.
         * @protected
         *
         */
        renderUI: function () {
            var self = this, 
                loader = self.get('loader');
            self.get('view').render();
            self._initChildren();
            if(loader){
                self.setInternal('loader',loader);
            }
            /**/

        },
        _initChildren : function(children){
            var self = this, 
                i, 
                children, 
                child;
            // then render my children
            children = children || self.get('children').concat();
            self.get('children').length = 0;
            for (i = 0; i < children.length; i++) {
                child = self.addChild(children[i]);
                child.render();
            }
        },
        /**
         * bind ui for box
         * @private
         */
        bindUI:function () {
            var self = this,
                events = self.get('events');
            this.on('afterVisibleChange', function (e) {
                this.fire(e.newVal ? 'show' : 'hide');
            });
            //处理控件事件，设置事件是否冒泡
            BUI.each(events, function (v,k) {
              self.publish(k, {
                  bubbles:v
              });
            });
        },
        /**
         * 控件是否包含指定的DOM元素,包括根节点
         * <pre><code>
         *   var control = new Control();
         *   $(document).on('click',function(ev){
         *     var target = ev.target;
         *
         *     if(!control.containsElement(elem)){ //未点击在控件内部
         *       control.hide();
         *     }
         *   });
         * </code></pre>
         * @param  {HTMLElement} elem DOM 元素
         * @return {Boolean}  是否包含
         */
        containsElement : function (elem) {
          var _self = this,
            el = _self.get('el'),
            children = _self.get('children'),
            result = false;
          if(!_self.get('rendered')){
            return false;
          }
          if($.contains(el[0],elem) || el[0] === elem){
            result = true;
          }else{
            BUI.each(children,function (item) {
                if(item.containsElement(elem)){
                    result = true;
                    return false;
                }
            });
          }
          return result;
        },
        /**
         * 是否是子控件的DOM元素
         * @protected
         * @return {Boolean} 是否子控件的DOM元素
         */
        isChildrenElement : function(elem){
            var _self = this,
                children = _self.get('children'),
                rst = false;
            BUI.each(children,function(child){
                if(child.containsElement(elem)){
                    rst = true;
                    return false;
                }
            });
            return rst;
        },
        /**
         * 显示控件
         */
        show:function () {
            var self = this;
            self.render();
            self.set('visible', true);
            return self;
        },

        /**
         * 隐藏控件
         */
        hide:function () {
            var self = this;
            self.set('visible', false);
            return self;
        },
        /**
         * 交替显示或者隐藏
         * <pre><code>
         *  control.show(); //显示
         *  control.toggle(); //隐藏
         *  control.toggle(); //显示
         * </code></pre>
         */
        toggle : function(){
            this.set('visible',!this.get('visible'));
            return this;
        },
        _uiSetFocusable: function (focusable) {
            var self = this,
                t,
                el = self.getKeyEventTarget();
            if (focusable) {
                el.attr('tabIndex', 0)
                    // remove smart outline in ie
                    // set outline in style for other standard browser
                    .attr('hideFocus', true)
                    .on('focus', wrapBehavior(self, 'handleFocus'))
                    .on('blur', wrapBehavior(self, 'handleBlur'))
                    .on('keydown', wrapBehavior(self, 'handleKeydown'))
                    .on('keyup',wrapBehavior(self,'handleKeyUp'));
            } else {
                el.removeAttr('tabIndex');
                if (t = getWrapBehavior(self, 'handleFocus')) {
                    el.off('focus', t);
                }
                if (t = getWrapBehavior(self, 'handleBlur')) {
                    el.off('blur', t);
                }
                if (t = getWrapBehavior(self, 'handleKeydown')) {
                    el.off('keydown', t);
                }
                if (t = getWrapBehavior(self, 'handleKeyUp')) {
                    el.off('keyup', t);
                }
            }
        },

        _uiSetHandleMouseEvents: function (handleMouseEvents) {
            var self = this, el = self.get('el'), t;
            if (handleMouseEvents) {
                el.on('mouseenter', wrapBehavior(self, 'handleMouseEnter'))
                    .on('mouseleave', wrapBehavior(self, 'handleMouseLeave'))
                    .on('contextmenu', wrapBehavior(self, 'handleContextMenu'))
                    .on('mousedown', wrapBehavior(self, 'handleMouseDown'))
                    .on('mouseup', wrapBehavior(self, 'handleMouseUp'))
                    .on('dblclick', wrapBehavior(self, 'handleDblClick'));
            } else {
                t = getWrapBehavior(self, 'handleMouseEnter') &&
                    el.off('mouseenter', t);
                t = getWrapBehavior(self, 'handleMouseLeave') &&
                    el.off('mouseleave', t);
                t = getWrapBehavior(self, 'handleContextMenu') &&
                    el.off('contextmenu', t);
                t = getWrapBehavior(self, 'handleMouseDown') &&
                    el.off('mousedown', t);
                t = getWrapBehavior(self, 'handleMouseUp') &&
                    el.off('mouseup', t);
                t = getWrapBehavior(self, 'handleDblClick') &&
                    el.off('dblclick', t);
            }
        },

        _uiSetFocused: function (v) {
            if (v) {
                this.getKeyEventTarget()[0].focus();
            }
        },
        //当使用visiblity显示隐藏时，隐藏时把DOM移除出视图内，显示时回复原位置
        _uiSetVisible : function(isVisible){
            var self = this,
                el = self.get('el'),
                visibleMode = self.get('visibleMode');
            if (visibleMode === 'visibility') {
                if(isVisible){
                    var position = self.get('cachePosition');
                    if(position){
                        self.set('xy',position);
                    }
                }
                if(!isVisible){
                    var position = [
                        self.get('x'),self.get('y')
                    ];
                    self.set('cachePosition',position);
                    self.set('xy',[-999,-999]);
                }
            }
        },
        //设置children时
        _uiSetChildren : function(v){
            var self = this,
                children = BUI.cloneObject(v);
            //self.removeChildren(true);
            self._initChildren(children);
        },
        /**
         * 使控件可用
         */
        enable : function(){
            this.set('disabled',false);
            return this;
        },
        /**
         * 使控件不可用，控件不可用时，点击等事件不会触发
         * <pre><code>
         *  control.disable(); //禁用
         *  control.enable(); //解除禁用
         * </code></pre>
         */
        disable : function(){
            this.set('disabled',true);
            return this;
        },
        /**
         * 控件获取焦点
         */
        focus : function(){
            if(this.get('focusable')){
                this.set('focused',true);
            }
        },
        /**
         * 子组件将要渲染到的节点，在 render 类上覆盖对应方法
         * @protected
         * @ignore
         */
        getContentElement: function () {
            return this.get('view').getContentElement();
        },

        /**
         * 焦点所在元素即键盘事件处理元素，在 render 类上覆盖对应方法
         * @protected
         * @ignore
         */
        getKeyEventTarget: function () {
            return this.get('view').getKeyEventTarget();
        },

        /**
         * 添加控件的子控件，索引值为 0-based
         * <pre><code>
         *  control.add(new Control());//添加controller对象
         *  control.add({xclass : 'a'});//添加xclass 为a 的一个对象
         *  control.add({xclass : 'b'},2);//插入到第三个位置
         * </code></pre>
         * @param {BUI.Component.Controller|Object} c 子控件的实例或者配置项
         * @param {String} [c.xclass] 如果c为配置项，设置c的xclass
         * @param {Number} [index]  0-based  如果未指定索引值，则插在控件的最后
         */
        addChild: function (c, index) {
            var self = this,
                children = self.get('children'),
                renderBefore;
            if (index === undefined) {
                index = children.length;
            }
            /**
             * 添加子控件前触发
             * @event beforeAddChild
             * @param {Object} e
             * @param {Object} e.child 添加子控件时传入的配置项或者子控件
             * @param {Number} e.index 添加的位置
             */
            self.fire('beforeAddChild',{child : c,index : index});
            renderBefore = children[index] && children[index].get('el') || null;
            c = initChild(self, c, renderBefore);
            children.splice(index, 0, c);
            // 先 create 占位 再 render
            // 防止 render 逻辑里读 parent.get('children') 不同步
            // 如果 parent 已经渲染好了子组件也要立即渲染，就 创建 dom ，绑定事件
            if (self.get('rendered')) {
                c.render();
            }

            /**
             * 添加子控件后触发
             * @event afterAddChild
             * @param {Object} e
             * @param {Object} e.child 添加子控件
             * @param {Number} e.index 添加的位置
             */
            self.fire('afterAddChild',{child : c,index : index});
            return c;
        },
        /**
         * 将自己从父控件中移除
         * <pre><code>
         *  control.remove(); //将控件从父控件中移除，并未删除
         *  parent.addChild(control); //还可以添加回父控件
         *  
         *  control.remove(true); //从控件中移除并调用控件的析构函数
         * </code></pre>
         * @param  {Boolean} destroy 是否删除DON节点
         * @return {BUI.Component.Controller} 删除的子对象.
         */
        remove : function(destroy){
            var self = this,
                parent = self.get('parent');
            if(parent){
                parent.removeChild(self,destroy);
            }else if (destroy) {
                self.destroy();
            }
            return self;
        },
        /**
         * 移除子控件，并返回移除的控件
         *
         * ** 如果 destroy=true,调用移除控件的 {@link BUI.Component.UIBase#destroy} 方法,
         * 同时删除对应的DOM **
         * <pre><code>
         *  var child = control.getChild(id);
         *  control.removeChild(child); //仅仅移除
         *  
         *  control.removeChild(child,true); //移除，并调用析构函数
         * </code></pre>
         * @param {BUI.Component.Controller} c 要移除的子控件.
         * @param {Boolean} [destroy=false] 如果是true,
         * 调用控件的方法 {@link BUI.Component.UIBase#destroy} .
         * @return {BUI.Component.Controller} 移除的子控件.
         */
        removeChild: function (c, destroy) {
            var self = this,
                children = self.get('children'),
                index = BUI.Array.indexOf(c, children);

            if(index === -1){
                return;
            }
            /**
             * 删除子控件前触发
             * @event beforeRemoveChild
             * @param {Object} e
             * @param {Object} e.child 子控件
             * @param {Boolean} e.destroy 是否清除DOM
             */
            self.fire('beforeRemoveChild',{child : c,destroy : destroy});

            if (index !== -1) {
                children.splice(index, 1);
            }
            if (destroy &&
                // c is still json
                c.destroy) {
                c.destroy();
            }
            /**
             * 删除子控件前触发
             * @event afterRemoveChild
             * @param {Object} e
             * @param {Object} e.child 子控件
             * @param {Boolean} e.destroy 是否清除DOM
             */
            self.fire('afterRemoveChild',{child : c,destroy : destroy});

            return c;
        },

        /**
         * 删除当前控件的子控件
         * <pre><code>
         *   control.removeChildren();//删除所有子控件
         *   control.removeChildren(true);//删除所有子控件，并调用子控件的析构函数
         * </code></pre>
         * @see Component.Controller#removeChild
         * @param {Boolean} [destroy] 如果设置 true,
         * 调用子控件的 {@link BUI.Component.UIBase#destroy}方法.
         */
        removeChildren: function (destroy) {
            var self = this,
                i,
                t = [].concat(self.get('children'));
            for (i = 0; i < t.length; i++) {
                self.removeChild(t[i], destroy);
            }
        },

        /**
         * 根据索引获取子控件
         * <pre><code>
         *  control.getChildAt(0);//获取第一个子控件
         *  control.getChildAt(2); //获取第三个子控件
         * </code></pre>
         * @param {Number} index 0-based 索引值.
         * @return {BUI.Component.Controller} 子控件或者null 
         */
        getChildAt: function (index) {
            var children = this.get('children');
            return children[index] || null;
        },
        /**
         * 根据Id获取子控件
         * <pre><code>
         *  control.getChild('id'); //从控件的直接子控件中查找
         *  control.getChild('id',true);//递归查找所有子控件，包含子控件的子控件
         * </code></pre>
         * @param  {String} id 控件编号
         * @param  {Boolean} deep 是否继续查找在子控件中查找
         * @return {BUI.Component.Controller} 子控件或者null 
         */
        getChild : function(id,deep){
            return this.getChildBy(function(item){
                return item.get('id') === id;
            },deep);
        },
        /**
         * 通过匹配函数查找子控件，返回第一个匹配的对象
         * <pre><code>
         *  control.getChildBy(function(child){//从控件的直接子控件中查找
         *    return child.get('id') = '1243';
         *  }); 
         *  
         *  control.getChild(function(child){//递归查找所有子控件，包含子控件的子控件
         *    return child.get('id') = '1243';
         *  },true);
         * </code></pre>
         * @param  {Function} math 查找的匹配函数
         * @param  {Boolean} deep 是否继续查找在子控件中查找
         * @return {BUI.Component.Controller} 子控件或者null 
         */
        getChildBy : function(math,deep){
            return this.getChildrenBy(math,deep)[0] || null;
        },
        /**
         * 获取控件的附加高度 = control.get('el').outerHeight() - control.get('el').height()
         * @protected
         * @return {Number} 附加宽度
         */
        getAppendHeight : function(){
            var el = this.get('el');
            return el.outerHeight() - el.height();
        },
        /**
         * 获取控件的附加宽度 = control.get('el').outerWidth() - control.get('el').width()
         * @protected
         * @return {Number} 附加宽度
         */
        getAppendWidth : function(){
            var el = this.get('el');
            return el.outerWidth() - el.width();
        },
        /**
         * 查找符合条件的子控件
         * <pre><code>
         *  control.getChildrenBy(function(child){//从控件的直接子控件中查找
         *    return child.get('type') = '1';
         *  }); 
         *  
         *  control.getChildrenBy(function(child){//递归查找所有子控件，包含子控件的子控件
         *    return child.get('type') = '1';
         *  },true);
         * </code></pre>
         * @param  {Function} math 查找的匹配函数
         * @param  {Boolean} deep 是否继续查找在子控件中查找，如果符合上面的匹配函数，则不再往下查找
         * @return {BUI.Component.Controller[]} 子控件数组 
         */
        getChildrenBy : function(math,deep){
            var self = this,
                results = [];
            if(!math){
                return results;
            }

            self.eachChild(function(child){
                if(math(child)){
                    results.push(child);
                }else if(deep){

                    results = results.concat(child.getChildrenBy(math,deep));
                }
            });
            return results;
        },
        /**
         * 遍历子元素
         * <pre><code>
         *  control.eachChild(function(child,index){ //遍历子控件
         *  
         *  });
         * </code></pre>
         * @param  {Function} func 迭代函数，函数原型function(child,index)
         */
        eachChild : function(func){
            BUI.each(this.get('children'),func);
        },
        /**
         * Handle dblclick events. By default, this performs its associated action by calling
         * {@link BUI.Component.Controller#performActionInternal}.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleDblClick: function (ev) {
            this.performActionInternal(ev);
            if(!this.isChildrenElement(ev.target)){
                this.fire('dblclick',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Called by it's container component to dispatch mouseenter event.
         * @private
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseOver: function (ev) {
            var self = this,
                el = self.get('el');
            if (!isMouseEventWithinElement(ev, el)) {
                self.handleMouseEnter(ev);
                
            }
        },

        /**
         * Called by it's container component to dispatch mouseleave event.
         * @private
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseOut: function (ev) {
            var self = this,
                el = self.get('el');
            if (!isMouseEventWithinElement(ev, el)) {
                self.handleMouseLeave(ev);
                
            }
        },

        /**
         * Handle mouseenter events. If the component is not disabled, highlights it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseEnter: function (ev) {
            var self = this;
            this.set('highlighted', !!ev);
            self.fire('mouseenter',{domTarget : ev.target,domEvent : ev});
        },

        /**
         * Handle mouseleave events. If the component is not disabled, de-highlights it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseLeave: function (ev) {
            var self = this;
            self.set('active', false);
            self.set('highlighted', !ev);
            self.fire('mouseleave',{domTarget : ev.target,domEvent : ev});
        },

        /**
         * Handles mousedown events. If the component is not disabled,
         * If the component is activeable, then activate it.
         * If the component is focusable, then focus it,
         * else prevent it from receiving keyboard focus.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseDown: function (ev) {
            var self = this,
                n,
                target = $(ev.target),
                isMouseActionButton = ev['which'] === 1,
                el;
            if (isMouseActionButton) {
                el = self.getKeyEventTarget();
                if (self.get('activeable')) {
                    self.set('active', true);
                }
                if (self.get('focusable')) {
                    //如果不是input,select,area等可以获取焦点的控件，那么设置此控件的focus
                    /*if(target[0] == el[0] || (!target.is('input,select,area') && !target.attr('tabindex'))){
                      el[0].focus(); 
                      
                    }*/
                    self.setInternal('focused', true); 
                }

                if (!self.get('allowTextSelection')) {
                    // firefox /chrome 不会引起焦点转移
                    n = ev.target.nodeName;
                    n = n && n.toLowerCase();
                    // do not prevent focus when click on editable element
                    if (n !== 'input' && n !== 'textarea') {
                        ev.preventDefault();
                    }
                }
                if(!self.isChildrenElement(ev.target)){
                    self.fire('mousedown',{domTarget : ev.target,domEvent : ev});
                }
                
            }
        },

        /**
         * Handles mouseup events.
         * If this component is not disabled, performs its associated action by calling
         * {@link BUI.Component.Controller#performActionInternal}, then deactivates it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseUp: function (ev) {
            var self = this,
                isChildrenElement = self.isChildrenElement(ev.target);
            // 左键
            if (self.get('active') && ev.which === 1) {
                self.performActionInternal(ev);
                self.set('active', false);
                if(!isChildrenElement){
                    self.fire('click',{domTarget : ev.target,domEvent : ev});
                }
            }
            if(!isChildrenElement){
                self.fire('mouseup',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Handles context menu.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleContextMenu: function (ev) {
        },

        /**
         * Handles focus events. Style focused class.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleFocus: function (ev) {
            this.set('focused', !!ev);
            this.fire('focus',{domEvent : ev,domTarget : ev.target});
        },

        /**
         * Handles blur events. Remove focused class.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleBlur: function (ev) {
            this.set('focused', !ev);
            this.fire('blur',{domEvent : ev,domTarget : ev.target});
        },

        /**
         * Handle enter keydown event to {@link BUI.Component.Controller#performActionInternal}.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleKeyEventInternal: function (ev) {
            var self = this,
                isChildrenElement = self.isChildrenElement(ev.target);
            if (ev.which === 13) {
                if(!isChildrenElement){
                    self.fire('click',{domTarget : ev.target,domEvent : ev});
                }
                
                return this.performActionInternal(ev);
            }
            if(!isChildrenElement){
                self.fire('keydown',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Handle keydown events.
         * If the component is not disabled, call {@link BUI.Component.Controller#handleKeyEventInternal}
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleKeydown: function (ev) {
            var self = this;
            if (self.handleKeyEventInternal(ev)) {
                ev.halt();
                return true;
            }
        },
        handleKeyUp : function(ev){
            var self = this;
            if(!self.isChildrenElement(ev.target)){
                self.fire('keyup',{domTarget : ev.target,domEvent : ev});
            }
        },
        /**
         * Performs the appropriate action when this component is activated by the user.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        performActionInternal: function (ev) {
        },
        /**
         * 析构函数
         * @protected
         */
        destructor: function () {
            var self = this,
                id,
                i,
                view,
                children = self.get('children');
            id = self.get('id');
            for (i = 0; i < children.length; i++) {
                children[i].destroy && children[i].destroy();
            }
            self.get('view').destroy();
            Manager.removeComponent(id);
        },
        //覆写set方法
        set : function(name,value,opt){
            var _self = this,
                view = _self.__view,
                attr = _self.__attrs[name],
                ucName,
                ev,
                m;
            if(BUI.isObject(name)){
                opt = value;
                BUI.each(name,function(v,k){
                    _self.set(k,v,opt);
                });
            }
            if(!view || !attr || (opt && opt.silent)){ //未初始化view或者没用定义属性
                Controller.superclass.set.call(this,name,value,opt);
                return _self;
            }

            var prevVal = Controller.superclass.get.call(this,name);

            //如果未改变值不进行修改
            if(!$.isPlainObject(value) && !BUI.isArray(value) && prevVal === value){
                return _self;
            }
            ucName = BUI.ucfirst(name);
            m = '_uiSet' + ucName;
            //触发before事件
            _self.fire('before' + ucName + 'Change', {
              attrName: name,
              prevVal: prevVal,
              newVal: value
            });

            _self.setInternal(name, value);

            value = _self.__attrVals[name];
            if(view && attr.view){
                view.set(name,value);
                //return _self;
            }
            ev = {attrName: name,prevVal: prevVal,newVal: value};

            //触发before事件
            _self.fire('after' + ucName + 'Change', ev);
            if(_self.get('binded') && _self[m]){
                _self[m](value,ev);
            }
            return _self;
        },
        //覆写get方法，改变时同时改变view的值
        get : function(name){
            var _self = this,
                view = _self.__view,
                attr = _self.__attrs[name],
                value = Controller.superclass.get.call(this,name);
            if(value !== undefined){
                return value;
            }
            if(view && attr && attr.view){
                return view.get(name);
            }

            return value;
        }
    },
    {
        ATTRS: 
        {
            /**
             * 控件的Html 内容
             * <pre><code>
             *  new Control({
             *     content : '内容',
             *     render : '#c1'
             *  });
             * </code></pre>
             * @cfg {String|jQuery} content
             */
            /**
             * 控件的Html 内容
             * @type {String|jQuery}
             */
            content:{
                view:1
            },
			/**
			 * 控件根节点使用的标签
             * <pre><code>
             *  new Control({
             *     elTagName : 'ul',
             *      content : '<li>内容</li>',  //控件的DOM &lt;ul&gt;&lt;li&gt;内容&lt;/li&gt;&lt;/ul&gt;
             *     render : '#c1'
             *  });  
             * </code></pre>
			 * @cfg {String} elTagName
			 */
			elTagName: {
				// 生成标签名字
				view : true,
				value: 'div'
			},
            /**
             * 子元素的默认 xclass,配置child的时候没必要每次都填写xclass
             * @type {String}
             */
            defaultChildClass : {
                
            },
            /**
             * 如果控件未设置 xclass，同时父元素设置了 defaultChildClass，那么
             * xclass = defaultChildClass + '-' + xtype
             * <pre><code>
             *  A.ATTRS = {
             *    defaultChildClass : {
             *        value : 'b'
             *    }
             *  }
             *  //类B 的xclass = 'b'类 B1的xclass = 'b-1',类 B2的xclass = 'b-2',那么
             *  var a = new A({
             *    children : [
             *        {content : 'b'}, //B类
             *        {content : 'b1',xtype:'1'}, //B1类
             *        {content : 'b2',xtype:'2'}, //B2类
             *    ]
             *  });
             * </code></pre>
             * @type {String}
             */
            xtype : {

            },
            /**
             * 标示控件的唯一编号，默认会自动生成
             * @cfg {String} id
             */
            /**
             * 标示控件的唯一编号，默认会自动生成
             * @type {String}
             */
            id : {
                view : true
            },
            /**
             * 控件宽度
             * <pre><code>
             * new Control({
             *   width : 200 // 200,'200px','20%'
             * });
             * </code></pre>
             * @cfg {Number|String} width
             */
            /**
             * 控件宽度
             * <pre><code>
             *  control.set('width',200);
             *  control.set('width','200px');
             *  control.set('width','20%');
             * </code></pre>
             * @type {Number|String}
             */
            width:{
                view:1
            },
            /**
             * 控件宽度
             * <pre><code>
             * new Control({
             *   height : 200 // 200,'200px','20%'
             * });
             * </code></pre>
             * @cfg {Number|String} height
             */
            /**
             * 控件宽度
             * <pre><code>
             *  control.set('height',200);
             *  control.set('height','200px');
             *  control.set('height','20%');
             * </code></pre>
             * @type {Number|String}
             */
            height:{
                view:1
            },
            /**
             * 控件根节点应用的样式
             * <pre><code>
             *  new Control({
             *   elCls : 'test',
             *   content : '内容',
             *   render : '#t1'   //&lt;div id='t1'&gt;&lt;div class="test"&gt;内容&lt;/div&gt;&lt;/div&gt;
             *  });
             * </code></pre>
             * @cfg {String} elCls
             */
            /**
             * 控件根节点应用的样式 css class
             * @type {String}
             */
            elCls:{
                view:1
            },
            /**
             * @cfg {Object} elStyle
			 * 控件根节点应用的css属性
             *  <pre><code>
             *    var cfg = {elStyle : {width:'100px', height:'200px'}};
             *  </code></pre>
             */
            /**
             * 控件根节点应用的css属性，以键值对形式
             * @type {Object}
			 *  <pre><code>
             *	 control.set('elStyle',	{
             *		width:'100px',
             *		height:'200px'
             *   });
             *  </code></pre>
             */
            elStyle:{
                view:1
            },
            /**
             * @cfg {Object} elAttrs
			 * 控件根节点应用的属性，以键值对形式:
             * <pre><code>
             *  new Control({
             *    elAttrs :{title : 'tips'}   
             *  });
             * </code></pre>
             */
            /**
             * @type {Object}
			 * 控件根节点应用的属性，以键值对形式:
             * { title : 'tips'}
             * @ignore
             */
            elAttrs:{
                view:1
            },
            /**
             * 将控件插入到指定元素前
             * <pre><code>
             *  new Control({
             *      elBefore : '#t1'
             *  });
             * </code></pre>
             * @cfg {jQuery} elBefore
             */
            /**
             * 将控件插入到指定元素前
             * @type {jQuery}
             * @ignore
             */
            elBefore:{
                // better named to renderBefore, too late !
                view:1
            },

            /**
             * 只读属性，根节点DOM
             * @type {jQuery}
             */
            el:{
                view:1
            },
            /**
             * 控件支持的事件
             * @type {Object}
             * @protected
             */
            events : {
                value : {
                    /**
                     * 点击事件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'click' : true,
                    /**
                     * 双击事件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'dblclick' : true,
                    /**
                     * 鼠标移入控件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mouseenter' : true,
                    /**
                     * 鼠标移出控件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mouseleave' : true,
                    /**
                     * 键盘按下按键事件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'keydown' : true,
                    /**
                     * 键盘按键抬起控件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'keyup' : true,
                    /**
                     * 控件获取焦点事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'focus' : false,
                    /**
                     * 控件丢失焦点事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'blur' : false,
                    /**
                     * 鼠标按下控件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mousedown' : true,
                    /**
                     * 鼠标抬起控件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mouseup' : true,
                    /**
                     * 控件显示
                     * @event
                     */
                    'show' : false,
                    /**
                     * 控件隐藏
                     * @event
                     */
                    'hide' : false
                }
            },
            /**
             * 指定控件的容器
             * <pre><code>
             *  new Control({
             *    render : '#t1',
             *    elCls : 'test',
             *    content : '<span>123</span>'  //&lt;div id="t1"&gt;&lt;div class="test bui-xclass"&gt;&lt;span&gt;123&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;
             *  });
             * </code></pre>
             * @cfg {jQuery} render
             */
            /**
             * 指定控件的容器
             * @type {jQuery}
             * @ignore
             */
            render:{
                view:1
            },
            /**
             * ARIA 标准中的role,不要更改此属性
             * @type {String}
             * @protected
             */
            role : {
                view : 1
            },
            /**
             * 状态相关的样式,默认情况下会使用 前缀名 + xclass + '-' + 状态名
             * <ol>
             *     <li>hover</li>
             *     <li>focused</li>
             *     <li>active</li>
             *     <li>disabled</li>
             * </ol>
             * @type {Object}
             */
            statusCls : {
                view : true,
                value : {

                }
            },
            /**
             * 控件的可视方式,值为：
             *  - 'display' 
             *  - 'visibility'
             *  <pre><code>
             *   new Control({
             *     visibleMode: 'visibility'
             *   });
             *  </code></pre>
             * @cfg {String} [visibleMode = 'display']
             */
            /**
             * 控件的可视方式,使用 css 
             *  - 'display' 或者 
             *  - 'visibility'
             * <pre><code>
             *  control.set('visibleMode','display')
             * </code></pre>
             * @type {String}
             */
            visibleMode:{
                view:1,
                value : 'display'
            },
            /**
             * 控件是否可见
             * <pre><code>
             *  new Control({
             *    visible : false   //隐藏
             *  });
             * </code></pre>
             * @cfg {Boolean} [visible = true]
             */
            /**
             * 控件是否可见
             * <pre><code>
             *  control.set('visible',true); //control.show();
             *  control.set('visible',false); //control.hide();
             * </code></pre>
             * @type {Boolean}
             * @default true
             */
            visible:{
                value:true,
                view:1
            },
            /**
             * 是否允许处理鼠标事件
             * @default true.
             * @type {Boolean}
             * @protected
             */
            handleMouseEvents: {
                value: true
            },

            /**
             * 控件是否可以获取焦点
             * @default true.
             * @protected
             * @type {Boolean}
             */
            focusable: {
                value: false,
                view: 1
            },
            /**
             * 一旦使用loader的默认配置
             * @protected
             * @type {Object}
             */
            defaultLoaderCfg : {
                value : {
                    property : 'content',
                    autoLoad : true
                }
            },
            /**
             * 控件内容的加载器
             * @type {BUI.Component.Loader}
             */
            loader : {
                getter : function(v){
                    var _self = this,
                        defaultCfg;
                    if(v && !v.isLoader){
                        v.target = _self;
                        defaultCfg = _self.get('defaultLoaderCfg')
                        v = new Loader(BUI.merge(defaultCfg,v));
                        _self.setInternal('loader',v);
                    }
                    return v;
                }
            },
            /**
             * 1. Whether allow select this component's text.<br/>
             * 2. Whether not to lose last component's focus if click current one (set false).
             *
             * Defaults to: false.
             * @type {Boolean}
             * @property allowTextSelection
             * @protected
             */
            /**
             * @ignore
             */
            allowTextSelection: {
                // 和 focusable 分离
                // grid 需求：容器允许选择里面内容
                value: true
            },

            /**
             * 控件是否可以激活
             * @default true.
             * @type {Boolean}
             * @protected
             */
            activeable: {
                value: true
            },

            /**
             * 控件是否获取焦点
             * @type {Boolean}
             * @readOnly
             */
            focused: {
                view: 1
            },

            /**
             * 控件是否处于激活状态，按钮按下还未抬起
             * @type {Boolean}
             * @default false
             * @protected
             */
            active: {
                view: 1
            },
            /**
             * 控件是否高亮
             * @cfg {Boolean} highlighted
             * @ignore
             */
            /**
             * 控件是否高亮
             * @type {Boolean}
             * @protected
             */
            highlighted: {
                view: 1
            },
            /**
             * 子控件集合
             * @cfg {BUI.Component.Controller[]} children
             */
            /**
             * 子控件集合
             * @type {BUI.Component.Controller[]}
             */
            children: {
                sync : false,
                shared : false,
                value: []/**/
            },
            /**
             * 控件的CSS前缀
             * @cfg {String} [prefixCls = BUI.prefix]
             */
            /**
             * 控件的CSS前缀
             * @type {String}
             * @default BUI.prefix
             */
            prefixCls: {
                value: BUI.prefix, // box srcNode need
                view: 1
            },

            /**
             * 父控件
             * @cfg {BUI.Component.Controller} parent
             * @ignore
             */
            /**
             * 父控件
             * @type {BUI.Component.Controller}
             */
            parent: {
                setter: function (p) {
                    // 事件冒泡源
                    this.addTarget(p);
                }
            },

            /**
             * 禁用控件
             * @cfg {Boolean} [disabled = false]
             */
            /**
             * 禁用控件
             * <pre><code>
             *  control.set('disabled',true); //==  control.disable();
             *  control.set('disabled',false); //==  control.enable();
             * </code></pre>
             * @type {Boolean}
             * @default false
             */
            disabled: {
                view: 1,
                value : false
            },
            /**
             * 渲染控件的View类.
             * @protected
             * @cfg {BUI.Component.View} [xview = BUI.Component.View]
             */
            /**
             * 渲染控件的View类.
             * @protected
             * @type {BUI.Component.View}
             */
            xview: {
                value: View
            }
        },
        PARSER : {
            visible : function(el){
                var _self = this,
                    display = el.css('display'),

                    visibility = el.css('visibility'),
                    visibleMode = _self.get('visibleMode');
                if((display == 'none' && visibleMode == 'display')  || (visibility == 'hidden' && visibleMode == 'visibility')){
                    return false;
                }
                return true;
            }
        }
    }, {
        xclass: 'controller',
        priority : 0
    });
    
    return Controller;
});
/**
 * @ignore
 * @fileOverview cookie
 * @author lifesinger@gmail.com
 */


define('bui/cookie',function () {

    var doc = document,
        MILLISECONDS_OF_DAY = 24 * 60 * 60 * 1000,
        encode = encodeURIComponent,
        decode = decodeURIComponent;

    function isNotEmptyString(val) {
        return typeof(val) === 'string' && val !== '';
    }

    /**
     * Provide Cookie utilities.
     * @class BUI.Cookie
     * @singleton
     */
    var Cookie = {

        /**
         * Returns the cookie value for given name
         * @return {String} name The name of the cookie to retrieve
         */
        get: function (name) {
            var ret, m;

            if (isNotEmptyString(name)) {
                if ((m = String(doc.cookie).match(
                    new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')))) {
                    ret = m[1] ? decode(m[1]) : '';
                }
            }
            return ret;
        },

        /**
         * Set a cookie with a given name and value
         * @param {String} name The name of the cookie to set
         * @param {String} val The value to set for cookie
         * @param {Number|Date} expires
         * if Number secified how many days this cookie will expire
         * @param {String} domain set cookie's domain
         * @param {String} path set cookie's path
         * @param {Boolean} secure whether this cookie can only be sent to server on https
         */
        set: function (name, val, expires, domain, path, secure) {
            var text = String(encode(val)), date = expires;

            // 从当前时间开始，多少天后过期
            if (typeof date === 'number') {
                date = new Date();
                date.setTime(date.getTime() + expires * MILLISECONDS_OF_DAY);
            }
            // expiration date
            if (date instanceof Date) {
                text += '; expires=' + date.toUTCString();
            }

            // domain
            if (isNotEmptyString(domain)) {
                text += '; domain=' + domain;
            }

            // path
            if (isNotEmptyString(path)) {
                text += '; path=' + path;
            }

            // secure
            if (secure) {
                text += '; secure';
            }

            doc.cookie = name + '=' + text;
        },

        /**
         * Remove a cookie from the machine by setting its expiration date to sometime in the past
         * @param {String} name The name of the cookie to remove.
         * @param {String} domain The cookie's domain
         * @param {String} path The cookie's path
         * @param {String} secure The cookie's secure option
         */
        remove: function (name, domain, path, secure) {
            this.set(name, '', -1, domain, path, secure);
        }
    };
    
    BUI.Cookie = Cookie;
    
    return Cookie;
});

/**
* @ignore
* 2012.02.14 yiminghe@gmail.com
* - jsdoc added
*
* 2010.04
* - get 方法要考虑 ie 下，
* 值为空的 cookie 为 'test3; test3=3; test3tt=2; test1=t1test3; test3', 没有等于号。
* 除了正则获取，还可以 split 字符串的方式来获取。
* - api 设计上，原本想借鉴 jQuery 的简明风格：S.cookie(name, ...), 但考虑到可扩展性，目前
* 独立成静态工具类的方式更优。
*/

BUI.use(['bui/common','bui/cookie']);