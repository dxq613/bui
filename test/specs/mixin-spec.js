

BUI.use('bui/common',function(){
  var Component = BUI.Component,
    UIBase = Component.UIBase,
    Controller = Component.Controller,
    View = Component.View;
  var controlView = View.extend([UIBase.PositionView]);

  var control = Controller.extend([UIBase.Position,UIBase.Align,UIBase.Drag],{

  },{
    ATTRS : {
      xview : {
        value : controlView
      },
      dragNode : {
        valueFn : function(){
          return this.get('el');
        }
      }
    }
  });
  /*  */
  describe("测试Position",function(){
    
    var config = {
        x : 100,
        y : 100,
        elCls : 'well',
        width:30,
        height:30
      },
      c = new control(config);

    c.render();
    var el = c.get('el'),
      offset = el.offset();
    it("测试初始位置",function(){
      expect(offset.top).toBe(config.y);
      expect(offset.left).toBe(config.x);
    });
    
    it("测试初始位置",function(){
      var config1 = {
        x : 100,
        y: 100
      };
      c.move(config1.x,config1.y);
      offset = el.offset();
      expect(offset.top).toBe(config1.y);
      expect(offset.left).toBe(config1.x);
    });
  });

  describe("测试对齐",function(){
    var node = $('#t1'),
        offset = node.offset(),
          config = {
          align : {
            node:node,
            points: ['tl','tl']
          },
          
          elCls : 'well',
          width:100,
          height:100
        },
        c = new control(config);
      c.render();
      var el = c.get('el'),
        elOffset = el.offset();
    it('测试对齐方式',function(){
      expect(offset.top).toBe(elOffset.top);
      expect(offset.left).toBe(elOffset.left);
    });

    it("更改对齐方式",function(){
      c.set('align', {
        node:node,
        points: ['tr','tr']
      });
      elOffset = el.offset();
      expect(offset.top).toBe(elOffset.top);
      expect(offset.left+node.width()).toBe(elOffset.left+el.outerWidth());

      c.set('align', {
        node:node,
        points: ['br','br']
      });
    });

  
  });


  describe('测试拖拽',function(){
     var node = $('#t1'),
        offset = node.offset(),
        config = {
          render : node,
          elCls : 'well',
          width:50,
          height:50,
          x : 50,
          y: 50,
          constraint: node
        },
        c = new control(config);
      c.render();
      var el = c.get('el');
      
    it('测试隐藏',function(){
      c.set('visible',false);
      expect(el.position().left).toBe(-999);
    });

    it('测试显示',function(){
      c.set('visible',true);
      expect(el.position().left).not.toBe(-999);
    });
/**/
  });

});
/**/
BUI.use('bui/overlay',function(Overlay){
  var overlay = new Overlay.Overlay({
    align : {
      node:'#t1',
      points: ['cc','cc']
    },
    //visibleMode:'display',
    effect:{
      effect:'linear',
      duration:2000
    },
    elCls : 'well',
    width:50,
    height:50
  });

  $('#btnShow').on('click',function(){
    overlay.show();
  });

  $('#btnHide').on('click',function(){
    overlay.hide();
  });
});
