
  Perform.start('load');
  BUI.use('bui/common',function(BUI){
    Perform.end('load');
    Perform.start('control');
    var control = new BUI.Component.Controller({
      render : '#c1',
      content : '<p>第一个控件<p>'
    });   
    control.render();
    Perform.end('control');
  
    Perform.start('10 control');
    for(var i = 0; i < 10 ; i++){
      var c1 = new BUI.Component.Controller({
        render : '#c1',
        content : '<p>第'+i+'个控件<p>'
      });   
      c1.render();
    }
    Perform.end('10 control');
 /**/
    Perform.log('control');
    Perform.log('load');
    Perform.log('10 control');

  });
