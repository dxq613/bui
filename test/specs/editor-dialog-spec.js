BUI.use(['bui/editor','bui/overlay'],function (Editor,Overlay) {

  var DialogEditor = Editor.DialogEditor,
    FIELD = 'data-el';

  var editor = new DialogEditor({
    trigger : '.dialog',
    contentId:'c1',
    //focusable : true,
    width : 500,
    title : '测试编辑',
    form : {
      srcNode : '#J_Form'
    },
    //mask : false,
    success : function(){
      BUI.log('success');
      this.accept();
    }
  });

  editor.render();

  

  /*var d = new Overlay.Dialog({
    contentId:'c1',
    width : 500,
    title : '编辑数据'
  });

  $('#btn').on('click',function(){
    d.show();
  });*/
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