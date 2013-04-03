
BUI.use('bui/overlay',function () {  
  $('#J_MsgInfo').on('click',function(){
    BUI.Message.Alert('这只是简单的提示信息','info');
  });

  $('#J_MsgSuccess').on('click',function(){
    BUI.Message.Alert('这只是简单的成功信息','success');
  });
  $('#J_MsgAlert').on('click',function(){
    BUI.Message.Alert('这只是简单的警告信息','warning');
  });
  $('#J_MsgError').on('click',function(){
    BUI.Message.Alert('这只是简单的错误信息','error');
  });
  $('#J_MsgConfirm').on('click',function(){
    BUI.Message.Alert('这只是简单的确认信息','question');
  });

  $('#J_Confirm').on('click',function(){
    BUI.Message.Confirm('确认要更改么？',function(){
      alert('确认');
    },'question');
  });
});