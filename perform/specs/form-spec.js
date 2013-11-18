Perform.start('form');

BUI.use('bui/form',function (Form) {
  new Form.HForm({
        srcNode : '#J_Form'
  }).render();

  Perform.end('form');
  Perform.log('form');
});