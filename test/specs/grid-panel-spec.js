BUI.use(['bui/grid/grid','bui/data'],function(Grid,Data){
  
  var columns = [{
        title : '表头1',
        dataIndex :'a',
        sortState :'ASC'
    },{
        id: '123',
        title : '表头2',
        dataIndex :'b',
        sortable:false
    },{
        title : '表头3',
        dataIndex : 'c'
    },{
      id : 'colhide',
      title : '隐藏',
      dataIndex : 'd',
      visible : false
    }],
    data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}],
    store = new Data.Store({
      url : 'data/number40.php',
      autoLoad : false,
      pageSize:3
    });
  var grid = new Grid({
    render:'#J_Grid',
    columns : columns,
    width:800,
    height:500,
    tbar : {
          
            items : [{xclass : 'bar-item-button',
            elCls : 'grid-bar-test',
            btnCls : 'button  button-primary',
            text : '测试3',
            listeners : {
              'click':function(event){
                alert('122');
              }
            }
          },{xclass : 'bar-item-separator'},{xclass : 'bar-item-button',
            btnCls : 'button button-small',
            text : '删除',
            listeners : {
              'click':function(event){
                alert('删除');
              }
            }
          }]
        },

    bbar : {pagingBar : true},
    store : store
  });
  grid.render();
  store.load();
  var gridEl = grid.get('el'),
    header = grid.get('header'),
    body = grid.get('body');

  function getSetWidth(el){
    var dom = el[0];
    if(dom){
      return dom.style.width;
    }
  }
  /*
  describe("测试Grid 生成", function () {
    it('测试Grid 元素生成',function(){
      expect(gridEl).not.toBe(null);
      expect(gridEl.hasClass('bui-grid')).toBeTruthy();
    });

    it('测试Grid 表头生成',function(){
      var headerEl = gridEl.find('.bui-grid-header');
      expect(headerEl).not.toBe(null);
    });

    it('测试Grid Body生成',function(){
      var bodyEl = gridEl.find('.bui-grid-body');
      expect(bodyEl).not.toBe(null);
    });

    it('测试Grid初始化宽度',function(){
      expect(grid._getInnerWidth()).toBe(header.get('width'));
      expect(grid._getInnerWidth()).toBe(body.get('width'));
      expect(gridEl.hasClass('bui-grid-width')).toBeTruthy();
    });

    it('测试Grid初始化高度',function(){
      expect(gridEl.hasClass('bui-grid-height')).toBeTruthy();
      expect(body.get('height')).not.toBe(undefined);
    });
    
    it('测试Grid 命令栏的生成',function(){
      expect(gridEl.find('.grid-bar-test').length).not.toBe(0);
    });

    it('测试Grid 分页栏的生成',function(){
      expect(gridEl.find('.bui-pagingbar').length).not.toBe(0);
    });
    it('测试Grid显示数据',function(){
      store.load();
      //store.setResult(data);
      waits(200);
      runs(function(){
        expect($('.bui-grid-row',gridEl).length).toBe(store.getCount());
      });
      //
    });

  });

  describe("测试 子模块之间的联动", function () {
    describe("测试表头和内容之间的联动", function () {
      it('排序',function(){
        var index = 0,
          colObj = grid.findColumn(index);
        spyOn(body, 'onLocalSort').andCallThrough();
        colObj.set('sortState','DESC');
        expect(body.onLocalSort).toHaveBeenCalled();
      });

      it('测试更改列宽度',function(){
        var index = 2,
          colObj = grid.findColumn(index),
          bodyEl = body.get('el'),
          firstRowEl = bodyEl.find('.bui-grid-header-row'),
          width = 150,
          cellEl = body.get('view').findCell(colObj.get('id'),firstRowEl);

        colObj.set('width',width);
        expect(getSetWidth(cellEl)).toBe(width + 'px');
      });

      it('显示、隐藏列',function(){
        var index = 2,
          colObj = grid.findColumn('colhide'),
          bodyEl = body.get('el'),
          firstRowEl = bodyEl.find('.bui-grid-header-row'),
          width = 150,
          cellEl = body.get('view').findCell(colObj.get('id'),firstRowEl);
        expect(cellEl.css('display')).toBe('none');
        colObj.set('visible',true);
        expect(cellEl.css('display')).not.toBe('none');
        colObj.set('visible',false);
      });
      it('添加列,删除列',function(){
        var cfg = {id : 'new1',title:'新建表头'},
          colObj = null,
          index = 0,
          bodyEl = body.get('el'),
          tableEl = bodyEl.find('table'),
          rowEl = null,
          cellEl = null;
        colObj = grid.addColumn(cfg);
        index = header.getColumnIndex(colObj);
        expect(index).not.toBe(-1);
        rowEl = tableEl.find('.bui-grid-row');
        cellEl = body.findCell(cfg.id, rowEl);
        expect(cellEl.length).not.toBe(0);

        grid.removeColumn(colObj);
        index = header.getColumnIndex(colObj);
        expect(index).toBe(-1);
        rowEl = tableEl.find('.bui-grid-row');
        cellEl = body.findCell(cfg.id, rowEl);
        expect(cellEl.length).toBe(0);
      });
    });

    

    describe("测试维度配置项", function () {
      it('测试Grid，设置宽度',function(){
        var width = 500;
        grid.set('width',width);
        expect(grid._getInnerWidth()).toBe(width - 2);
        expect(header.get('width')).toBe(grid._getInnerWidth());
        expect(body.get('width')).toBe(grid._getInnerWidth());
      });

      
      it('测试forceFit = false时,Grid有宽度，调整列的宽度',function(){
        var width = 300;
        grid.set('width',width);
        var index = 2,
          colObj = grid.findColumn(index),
          bodyEl = body.get('el'),
          tableEl = bodyEl.find('table'),
          formColWidth = colObj.get('width'),
          formTableWidth = tableEl.width();
        
        colObj.set('width',formColWidth + 100);
        if(header.getColumnsWidth() > width){
          expect(tableEl.width()).toBe(formTableWidth + 100);
        }else{
          expect(getSetWidth(tableEl)).toBe(width + 'px');
        }
      });

      it('测试表格高度设置',function(){
        var height = 300;
        grid.set('height',height);
        expect(gridEl.hasClass('bui-grid-height')).toBeTruthy();
      });

      it('测试表格高度设置',function(){
        var bodyEl = body.get('el'),
          tableEl = bodyEl.find('table'),
          width = grid.get('width'),
          height =  400;//tableEl.height();
        grid.set('height',height);
        if(header.getColumnsWidth() <= width){
          expect(getSetWidth(tableEl)).toBe((width - 17) + 'px');
        }else{
          expect(getSetWidth(tableEl)).toBe(header.getColumnsWidth() + 'px'); 
        }
        expect(gridEl.hasClass('bui-grid-height')).toBeTruthy();
      });
      it('测试滚动条',function(){
        var callBack = jasmine.createSpy(),
          left = 30;
        body.on('scroll',function(e){
          callBack(e.scrollLeft);
        });
        spyOn(header, 'scrollTo').andCallThrough();
        body.get('el').scrollLeft(left);
        waits(100);
        runs(function(){
          expect(callBack).toHaveBeenCalledWith(left);
          expect(header.scrollTo).toHaveBeenCalled();
          grid.set('width',800);
        });
      });
    });

    describe("测试分页栏", function () {
      it('测试加载数据后分页栏的状态',function(){
        store.load();
        waits(100);
        runs(function(){
          expect(grid.get('bbar').get('totalPage')).not.toBe(1);
        });
      });
    });
  });


  describe("测试Grid 事件", function () {
    var CLS_SELECTED = 'bui-grid-row-selected',
      bodyEl = body.get('el'),
      tableEl = bodyEl.find('table');
    it('测试Grid，单选模式下点击行',function(){
      
      var rows =  $('.bui-grid-row',tableEl),
        rowEl = $(rows[0]);
      body._rowClickEvent({currentTarget : rowEl[0],target : rowEl.children()[0]});
      waits(100);
      runs(function(){
        expect(rowEl.hasClass(CLS_SELECTED)).toBeTruthy();
        body._rowClickEvent({currentTarget : rows[1],target : rowEl.children()[0]});
        waits(100);
        runs(function(){
          expect($('.'+CLS_SELECTED,tableEl).length).toBe(1);
        });
      });
    });
    it('测试Grid，单选模式移除所有选中',function(){
      body.clearSelection();
      expect($('.'+CLS_SELECTED,tableEl).length).toBe(0);
    });

    it('测试Grid，多选模式下点击行',function(){
      
      var rows =  $('.bui-grid-row',tableEl),
      rowEl = $(rows[0]);
      grid.set('multiSelect',true);
      body._rowClickEvent({currentTarget : rowEl[0],target : rowEl.children()[0]});
      waits(100);
      runs(function(){
        expect(rowEl.hasClass(CLS_SELECTED)).toBeTruthy();
        body._rowClickEvent({currentTarget : rows[1],target : rowEl.children()[0]});
        waits(100);
        runs(function(){
          expect($('.'+CLS_SELECTED,tableEl).length).toBe(2);
          body._rowClickEvent({currentTarget : rowEl[0],target : rowEl.children()[0]});
          waits(100);
          runs(function(){
            expect(rowEl.hasClass(CLS_SELECTED)).not.toBeTruthy();
          });
        });
        
      });
    });

    it('测试Grid，设置、获取选中',function(){
      var index = 1,
        record = store.getResult()[index];
      grid.clearSelection();
      expect($('.'+CLS_SELECTED,tableEl).length).toBe(0);

      grid.setSelection(record);
      expect($($('.bui-grid-row',tableEl)[index]).hasClass(CLS_SELECTED)).toBeTruthy();
    });
    
    
    it('测试Grid，全选，全部取消选中',function(){
      var rows = $('.bui-grid-row',tableEl);
      grid.setAllSelection();
      expect(grid.getSelection().length).toBe(store.getCount());
      rows.each(function(index,row){

        expect($(row).hasClass(CLS_SELECTED)).toBeTruthy();
      });
      grid.clearSelection();
      rows.each(function(index,row){
        expect($(row).hasClass(CLS_SELECTED)).not.toBeTruthy();
      });
    });
  });
  */
});