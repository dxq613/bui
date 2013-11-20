Perform.start('form');

BUI.use('bui/form',function (Form) {
  var form = new Form.HForm({
    srcNode : '#J_Form',
    submitType : 'ajax'
  }).render();

  Perform.end('form');
  Perform.log('form');

  /*form.on('beforesubmit',function(){
    console.log(form.serializeToObject());
    return false;
  });*/
});