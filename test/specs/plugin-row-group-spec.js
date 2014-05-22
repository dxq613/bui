BUI.use(['bui/grid/grid','bui/data','bui/grid/plugins/rowgroup'],function(Grid,Data,Group){

  var 
    columns = [{
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
    }],
    data = [{a:'123',selected:true},{a:'cdd',b:'edd',disabled:true},{a:'1333',c:'eee',d:2}];
    
  var store = new Data.Store({
      sortInfo : {
        field : 'a',
        direction : 'ASC'
      },
      url : 'data/group.json'
    }),
    group = new Group({
      renderer : function(text,group){
        var items = group.items,
          sum = store.sum('b',items);
        return text + '（'+items.length+'）- total : ' + sum;
      }
    }),
    grid = new Grid({
      render:'#J_Grid9',
      columns : columns,
      plugins : [group],
      forceFit : true,
      store : store
    });
  grid.render();


  var el = grid.get('el');
  describe('测行列分组生成',function () {

    it('测试行分组Group',function () {
      store.load();
      waits(200);
      runs(function(){
        expect(el.find('.bui-grid-row-group').length).not.toBe(0);
      });
    });


    it('测试展开',function(){
      var elment = el.find('.bui-grid-row-group')[0],
        firstEl = $(el.find('.bui-grid-row')[0]),
        cacadeEl = $(elment).find('.bui-grid-cascade');

      expect(firstEl.css('display')).toBe('none');
      cacadeEl.trigger('click');

      expect(firstEl.css('display')).not.toBe('none');

    });

    it('测试折叠',function(){
       var elment = el.find('.bui-grid-row-group')[0],
        firstEl = $(el.find('.bui-grid-row')[0]),
        cacadeEl = $(elment).find('.bui-grid-cascade');

      expect(firstEl.css('display')).not.toBe('none');
      cacadeEl.trigger('click');

      expect(firstEl.css('display')).toBe('none');
    });

    it('测试重新排序',function(){

    });
  });


});