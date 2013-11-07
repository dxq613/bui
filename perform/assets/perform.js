define('perform',function (require) {
  var BUI = require('bui/common');
  var map = {},
    id = '#log',
    idEl = $(id);

  if(!idEl.length){
    idEl =  $('<div class="well" id=""></div>').appendTo('body');
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
        tpl = '<p><label class="label">{name}</label>start: {start};end : {end};used: {used}</p>';
      if(record){
        idEl.append(BUI.substitute(tpl,record));
      }
    }
  };

  window.Perform = Perform;

  return Perform;


});