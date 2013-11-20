
BUI.use('bui/overlay',function () {  

  describe('测试显示信息',function(){
    it('显示提示信息',function(){
      var msg = '这只是简单的提示信息',
        icon = 'info';
        
      BUI.Message.Alert(msg,icon);
      waits(100);
      runs(function(){
        var el = $('.bui-message-content');
        expect(el.text()).toBe(msg);
      });
      
      //expect(BUI.Message)
    });

    it('显示成功信息',function(){
      var msg = '这只是简单的成功信息',
        icon = 'success';
      BUI.Message.Alert(msg,icon);
      waits(100);
      runs(function(){
        var el = $('.bui-message-content');
        expect(el.text()).toBe(msg);
      });
    });
  });
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