BUI.use('bui/editor',function (Editor) {

  var DialogEditor = Editor.DialogEditor,
    FIELD = 'data-el';

  var editor = new DialogEditor({
    trigger : '.dialog',
    contentId:'content',
    form : {
      srcNode : '#J_Form'
    }
  });

  editor.render();
  $('.dialog').each(function (index,el) {
    var logEl = $(el).prev('.well'),
      info = logEl.text();
    if(info){
      var record = BUI.JSON.looseParse($.trim(info));
      $(el).data(FIELD,record);
    }
  });

  editor.on('triggerchange',function (ev) {
    var curTrigger = ev.curTrigger,
      record = curTrigger.data(FIELD);
    editor.set('record',record);

  });

  editor.on('accept',function (ev) {
    var curTrigger = editor.get('curTrigger'),
      logEl = curTrigger.prev('.well'),
      record = editor.get('record');

    logEl.text(BUI.JSON.stringify(record));

  });

});