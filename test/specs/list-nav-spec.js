BUI.use('bui/list/simplelist',function (List) {

  var KeyCode = BUI.KeyCode,
    items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},{text:"数字值",value:3}];

  describe('list key navigation',function(){

    describe('single column',function(){
      var node = $('<section></section>').appendTo('.container'),
        list = new List({
          render : node,
          elCls:'bui-select-list',
          focusable : true,
          items : BUI.cloneObject(items)
        });
      list.render();

      describe('no item highlighted',function(){

        it('get left item',function(){
          expect(list._getLeftItem()).toBe(null);
        });
        it('get right item',function(){
          expect(list._getRightItem()).toBe(null);
        });
        it('get down item',function(){
          var item = list._getDownItem();
          expect(item).toBe(list.getFirstItem());
        });
        it('get up item',function(){
          var item = list._getUpperItem();
          expect(item).toBe(list.getLastItem());
        });
      });
      var el = list.get('el');
      it('test key left',function(){
        list.set('focused',true);
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.LEFT});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(null);
        });
      });
      it('test key right',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.RIGHT});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(null);
        });
      });
      it('test key down',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.DOWN});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getFirstItem());
        });
      });
      it('test key up',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.UP});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getLastItem());
        });
      });
      it('test key enter',function(){
  
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.ENTER});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getLastItem());
        });
      });
    });

    describe('multiple columns',function(){

      var items = [{id : '1',text : '1'},{id : '2',text : '2'},{id : '3',text : '3'},{id : '4',text : '4'},{id : '5',text : '5'},{id : '6',text : '6'},{id : '7',text : '7'}],
        node = $('<section></section>').appendTo('.container'),
        list = new List({
          render : node,
          idField : 'id',
          elCls : 'column-3 bui-select-list',
          focusable : true,
          items :items
        });
      list.render();
      var el = list.get('el');
      describe('no item highlighted',function(){

        it('get left item',function(){
          list.set('focused',true);
          expect(list._getLeftItem()).toBe(list.getLastItem());
        });
        it('get right item',function(){
          expect(list._getRightItem()).toBe(list.getFirstItem());
        });
        it('get down item',function(){
          var item = list._getDownItem();
          expect(item).toBe(list.getFirstItem());
        });
        it('get up item',function(){
          var item = list._getUpperItem();
          expect(item).toBe(list.getLastItem());
        });
      });

      it('test key down',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.DOWN});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getFirstItem());
        });
      });

      it('test key up',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.UP});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getLastItem());
        });
      });

      it('test key left',function(){
        var item = list.getHighlighted(),
          index = list.indexOfItem(item);
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.LEFT});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getItemAt(index - 1));
        });
      });

      it('test key left again',function(){
        var item = list.getHighlighted(),
          index = list.indexOfItem(item);
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.LEFT});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getItemAt(index - 1));
        });
      });

      it('test key right',function(){
        var item = list.getHighlighted(),
          index = list.indexOfItem(item);
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.RIGHT});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getItemAt(index + 1));
        });
        
      });

      it('test key right agin',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.RIGHT});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getLastItem());
        });
      });


      it('test key enter',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.ENTER});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getLastItem());
        });
      });

      it('test key tab',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.TAB});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getFirstItem());
        });
      });

      it('test key down',function(){
        var item = list.getItem('5');
        list.setHighlighted(item);
        expect(list.getHighlighted()).toBe(item);

        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.DOWN});
        waits(100);
        runs(function(){
          expect(list.getHighlighted()).toBe(list.getItemAt(1));
        });
      });
    })
    describe('when key nav,selected change',function(){
      var items = [{id : '1',text : '1'},{id : '2',text : '2'},{id : '3',text : '3'},{id : '4',text : '4'},{id : '5',text : '5'},{id : '6',text : '6'},{id : '7',text : '7'}],
        node = $('<section></section>').appendTo('.container'),
        list = new List({
          render : node,
          idField : 'id',
          elCls : 'column-3 bui-select-list',
          focusable : true,
          highlightedStatus : 'selected',
          items :items
        });
      list.render();
      var el = list.get('el');
      it('test key down',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.DOWN});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getFirstItem());
        });
      });

      it('test key up',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.UP});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getLastItem());
        });
      });

      it('test key left',function(){
        var item = list.getSelected(),
          index = list.indexOfItem(item);
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.LEFT});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getItemAt(index - 1));
        });
      });

      it('test key left again',function(){
        var item = list.getSelected(),
          index = list.indexOfItem(item);
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.LEFT});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getItemAt(index - 1));
        });
      });

      it('test key right',function(){
        var item = list.getSelected(),
          index = list.indexOfItem(item);
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.RIGHT});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getItemAt(index + 1));
        });
        
      });

      it('test key right agin',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.RIGHT});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getLastItem());
        });
      });

      it('test key tab',function(){
        jasmine.simulate(el[0],'keydown',{charCode : KeyCode.TAB});
        waits(100);
        runs(function(){
          expect(list.getSelected()).toBe(list.getFirstItem());
        });
      });
    });

  });
});


BUI.use('bui/list/simplelist',function (List) {

  var KeyCode = BUI.KeyCode,
    items = [{text:'选项1',value:'a'},{text:'选项2',value:'b'},{text:'选项3',value:'c'},
    {text:'选项11',value:'a11'},{text:'选项12',value:'a2'},{text:'选项13',value:'a3'},{text:'选项14',value:'a4'},
    {text:'选项111',value:'a111'},{text:'选项121',value:'a21'},{text:'选项131',value:'a31'},{text:'选项15',value:'a5'}];

  var list = new List({
    render : '#l8',
    height:150,
    elCls:'bui-select-list',
    items : items
  });
  list.render();

  describe('键盘操作，阻止默认窗口滚动',function(){

    it('向上',function(){

    });

    it('向下',function(){

    });
  });

  describe('键盘操作,列表滚动条',function(){

  });

});