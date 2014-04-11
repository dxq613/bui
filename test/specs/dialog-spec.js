
BUI.use('bui/overlay/dialog',function (Dialog) {
  
  var CLS_TITLE = 'header-title';
  var callback = jasmine.createSpy();
  var config = {
      width:500,
      height:300,
      title:'第一个弹出库',
      contentId : 'd1',
      success:function(){
        callback();
        this.hide();
      },
      cancel : function(){
        return false;
      }
    },
    dialog = new Dialog(config);

  var contentNode = $('#d1'),
    pElement = contentNode.children()[0];
  

  var dialogEl = dialog.get('el');

  $('#btnShow').on('click',function(){
    dialog.show();
  });

  $('#btnShow1').on('click',function(){
    dialog.set('title','');
    dialog.show();
  });
  describe('测试Dialog生成',function(){
    it('测试Dialog生成',function(){
      expect(contentNode.children().length).toBe(1);
      dialog.render();
      dialogEl = dialog.get('el');
      expect(dialogEl.length).not.toBe(0);
      expect(contentNode.children().length).toBe(0);
      expect(dialog.get('body').children()[0]).toBe(pElement);
    });

    it('测试标题',function(){
      expect(dialogEl.find('.'+CLS_TITLE).text()).toBe(config.title);
    })
  });

  describe('测试操作',function(){
    
    it('测试显示',function(){
      dialog.show();
      expect(dialog.get('body').children()[0]).toBe(pElement);
    });

    it('测试隐藏',function(){
      dialog.close();
      expect(dialog.get('body').children()[0]).toBe(pElement);
    });
    it('测试success函数',function(){
      dialog.show();
      expect(callback).not.toHaveBeenCalled();
      var buttons = dialogEl.find('button');
      $(buttons[0]).trigger('click');
      expect(callback).toHaveBeenCalled();
    });

    it('测试cancel函数',function(){
       dialog.show();
       var buttons = dialogEl.find('button');
      $(buttons[1]).trigger('click');
      expect(dialog.get('visible')).toBe(true);
    });

    describe('测试closing,close事件',function(){
      var callback1 = jasmine.createSpy(),
        callback2 = jasmine.createSpy();
      function fn(){
        callback1();
        return false;
      }
      dialog.on('closing',fn);
      dialog.on('closed',callback2);

      it('测试阻止',function(){
        dialog.close();
        expect(callback1).toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
        expect(dialog.get('visible')).toBe(true);
        dialog.off('closing',fn);
      });

      it('测试取消阻止',function(){
        dialog.close();
        expect(callback2).toHaveBeenCalled();
        expect(dialog.get('visible')).toBe(false);
        dialog.off('closed',callback2);
      });    
    });
  });

});

BUI.use('bui/overlay/dialog',function (Dialog) {
  var config = {
      width:500,
      height:300,
      title:'第一个弹出库',
      closeAction : 'destroy',
      contentId : 'd2',
      success:function(){
        callback();
        this.hide();
      },
      cancel : function(){
        return false;
      }
    },
    dialog = new Dialog(config);

  var cNode = $('#d2'),
    maskNode;

  describe('测试contentId',function(){
    it('测试初始化',function(){
      maskNode = dialog.get('maskNode')
      expect(maskNode).not.toBe(null);
      dialog.show();
      expect(cNode.children().length).toBe(0);
    });
    it('测试关闭',function(){
      dialog.close();
      expect(dialog.destroyed).toBe(true);
      expect(cNode.children().length).toBe(1);
      
      //expect(dialog.get('maskNode')).toBe(null);
    });
  });
});

BUI.use(['bui/overlay/dialog'],function (Dialog) {
  var config = {
      width:500,
      height:300,
      title:'异步弹出库',
      loader : {
        url : 'data/text.php',
        lazyLoad : {
          event : 'show',
          repeat : true
        }/*,
        loadMask : {
          msg : '正在加载dialog ,请等待。。。'
        }*/
      }
    },
    dialog = new Dialog(config);
  $('#btnAsyn').on('click',function(){
    dialog.show();
  });
  describe('测试加载异步数据',function(){
    it('显示dialog',function(){

    });
  });
});

