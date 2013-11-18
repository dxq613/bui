Perform.start('calendar');

BUI.use('bui/calendar',function (Calendar) {
  var datepicker = new Calendar.DatePicker({
    trigger:'.calendar',
    autoRender : true
  });

  Perform.end('calendar');
  Perform.log('calendar');
});