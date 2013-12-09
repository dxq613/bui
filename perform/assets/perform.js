(function(){
   var map = {},
    id = '#log',
    idEl = $(id);

  if(!idEl.length){
    idEl =  $('<div class="well" id=""></div>').appendTo('body');
  }

  performance.now = performance.now || function(){
    return new Date().getTime();
  }

  function now(){

  }

  var Perform = {
    start : function(name){
      var record = map[name];
      if(!record){
        record = map[name] = {};
        record.name = name;
      }
      record.start = performance.now();
    },
    end : function(name){
      var record = map[name];
      if(record){
        record.end = performance.now();
        record.used = record.end - record.start;
      }
    },
    log : function(name){
      var record = map[name],
        tpl = '<p><label class="label">'+record.name+'</label>start: '+record.start+';end : ' + record.end + ';used: '+record.used+'</p>';
      if(record){
        idEl.append(tpl);
      }
    }
  };

  window.Perform = Perform;

})();
 