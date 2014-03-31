
function contains(record,array){
  return $.inArray(record,array) !== -1;
}

BUI.use('bui/data',function (Data) {
  var Store = Data.Store;
  describe("测试未分页本地数据",function(){

    var data = [{},{},{},{}],
      store = new Store({
        data : data,
        autoLoad : true
      });

    it('测试Store生成',function(){
      var result = store.getResult();
      expect(result).not.toBe(data);
      expect(result.length).toBe(data.length);
    });

    it('测试设置数据',function(){
      var data1 = [{},{}],
        callback = jasmine.createSpy();
      store.on('load',callback);
      store.setResult(data1);
      expect(callback).toHaveBeenCalled();
      store.off('load',callback);
    });

  });

  describe("测试分页本地数据",function(){
    var data = [{},{},{a:'2'},{}],
      store = new Store({
        data : data,
        autoLoad : true,
        pageSize : 2
      });
    it('测试store生成',function(){
      var result = store.getResult();
      expect(result).not.toBe(data);
      expect(result.length).toBe(2);
      expect(store.getTotalCount()).toBe(data.length);
    });

    it('测试Store生成',function(){
      store.load({start:2});
      var result = store.getResult();
      expect(result.length).toBe(2);
      expect(result[0].a).toBe('2');

      expect(store.get('start')).toBe(2);
    });
  });

  describe("测试为分页异步数据",function(){

    var data = [{},{},{},{}],
      store = new Store({
        url:'data/store.json',
        autoLoad : true
      });

    it('测试默认加载的数据',function(){

      waits(100);
      runs(function(){
        var result = store.getResult();
        expect(result.length).not.toBe(0);
      });

    });
    it('测试加载数据',function(){
      var callback = jasmine.createSpy();
      store.on('load',callback);
      store.load();
      waits(100);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        store.off('load',callback);
      });
    });
  });

  describe("测试异步加载数据",function(){

    var data = [{},{},{},{}],
      store = new Store({
        url:'data/store-page.json',
        pageSize : 10,
        autoLoad : true
      });

    it('测试默认加载的数据',function(){
      
      waits(100);
      runs(function(){
        var result = store.getResult();
        expect(result.length).not.toBe(0);
        expect(store.getTotalCount()).toBe(100);
      });

    });

    it('测试加载数据',function(){

      store.load({start:20});
      waits(100);
      runs(function(){
        expect(store.get('start')).toBe(20);
        expect(store.get('pageIndex')).toBe(2);
      });

    });
  });

  describe('测试查询数据',function(){
    var store = new Store({
          dataType : 'json'
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'214',b:'124'}];
      store.setResult(records); 
    it('测试包含数据，对象相等',function(){          
      expect(store.contains(records[0])).toBeTruthy();
    });
    it('测试包含数据的索引，对象相等',function(){
      expect(store.findIndexBy(records[1])).toEqual(1);
    });

    it('测试查找数据，根据字段、值',function(){
      var record = store.find('a','123');
      expect(record).toEqual(records[0]);
      //查找所有
      var all = store.findAll('b','456');
      expect(all.length).toEqual(2);
    });

    it('测试包含数据，使用自定义的匹配函数',function(){
      var isContains = store.contains({a:'123'},function(obj1,obj2){
        return obj1.a === obj2.a;
      });
      expect(isContains).toBeTruthy();
    });

    it('测试数据索引值，使用匹配函数',function(){
      var index = store.findIndexBy({b:'124'},function(obj1,obj2){
        return obj1.b === obj2.b;
      });

      expect(index).toEqual(2);
    });
  });

  describe('测试排序',function(){
    var store = new Store({
        dataType : 'json',
        sortInfo :{field:'a',direction:'ASC'}
      }),
      records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
      obj = records[2];
    store.setResult(records); 
    it('比较对象大小',function(){
      var v = store.compare({a:'234',b:'456'},{a:'2141',b:'124'});
      expect(v >= 1).toBeTruthy();
    });
    it('使用默认的排序函数',function(){
      var index = store.findIndexBy({a:'2141'},function(obj1,obj2){
        return obj1.a === obj2.a;
      });
      expect(index).toEqual(1);
    });
    it('使用自定义的排序函数',function(){
      store.set('compareFunction',function(v1,v2){
        return Number(v1) - Number(v2);
      });
      store.sort();
      var index = store.findIndexBy(obj);
      expect(index).toEqual(2);
    });
  });

  describe('测试增删改',function(){
        
    it('测试添加数据，不去重复项',function(){
      var store = new Store({
          dataType : 'json',
          sortInfo :{field:'a',direction:'ASC'}
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = records[2];
      store.setResult(records); 
      expect(store.getCount()).toEqual(3);
      store.add(obj);
      expect(store.getCount()).toEqual(4);
      store.add({a:'123',b:'456'});
      expect(store.getCount()).toEqual(5);
    });
    it('测试添加数据，去掉重复项',function(){
      var store = new Store({
          dataType : 'json',
          sortInfo :{field:'a',direction:'ASC'}
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = records[2];
      store.setResult(records); 
      expect(store.getCount()).toEqual(3);
      //添加失败
      store.add(obj,true);
      expect(store.getCount()).toEqual(3);
      //添加成功
      store.add({a:'123',b:'456'},true);
      expect(store.getCount()).toEqual(4);
      //添加失败
      store.add({a:'123',b:'456'},true,function(obj1,obj2){
        return obj1.a == obj2.a;
      });
      expect(store.getCount()).toEqual(4);
    });
    
    it('测试批量添加',function(){

      var data = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        store = new Store({
          data : data
        });
      var count = store.getCount();
      expect(count).toBe(data.length);
      var newData = [{a : '222'},{a : '333'}];
      store.add(newData);
      expect(newData.length + count).toBe(store.getCount());
    });

    it('测试添加位置',function(){
      var data = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        store = new Store({
          data : data
        });
      var count = store.getCount(),
        record = {a:'e33'};
      store.addAt(record,2);
      expect(store.getCount()).toBe(count + 1);
      expect(store.findByIndex(2)).toBe(record);

    });

    it('测试删除数据',function(){
      var store = new Store({
          dataType : 'json',
          sortInfo :{field:'a',direction:'ASC'}
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = {a:'123',b:'456'};
      store.setResult(records); 
      store.remove(obj);
      expect(store.contains(obj)).toBeFalsy();
    });
    it('测试获取添加的数据',function(){
      var store = new Store({
          dataType : 'json',
          sortInfo :{field:'a',direction:'ASC'}
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = {a:'123',b:'456'};
      store.setResult(records); 
      store.add(obj);
      var newRecords = store.get('newRecords');
      expect(contains(obj,newRecords)).toBeTruthy();
      store.remove(obj);
      expect(contains(obj,newRecords)).toBeFalsy();
    });
    it('测试更改数据',function(){
      var store = new Store({
          dataType : 'json',
          matchFunction : function(obj1,obj2){
            return obj1.a == obj2.a;
          }
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = {a:'123',b:'457'};
      store.setResult(records);
      store.update(obj,true);

      expect(records[0].b).toEqual('457');

    });
    it('测试获取更改的数据',function(){
      var store = new Store({
          dataType : 'json',
          matchFunction : function(obj1,obj2){
            return obj1.a == obj2.a;
          }
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = records[0];
      store.setResult(records);
      obj.b = '444';
      store.update(obj,true);

      var edits =  store.get('modifiedRecords');
      expect(contains(obj,edits)).toBeTruthy();
      //expect(S.inArray(records[1],newRecords)).toBeFalsy();
    });
    
    
    it('测试删除的数据',function(){
      var store = new Store({
          dataType : 'json'
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = records[0];
      store.setResult(records);
      store.remove(obj);
      expect(store.contains(obj)).toBeFalsy();
      
    });
    it('测试删除数据，根据匹配函数',function(){
      var store = new Store({
          dataType : 'json'
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = records[0];
      store.setResult(records);
      store.remove({a:'123'},function(obj1,obj2){
        return obj1.a == obj2.a;
      });
      expect(store.contains(obj)).toBeFalsy();
    });
    it('测试删除数据，获取删除后的数据',function(){
      var store = new Store({
          dataType : 'json'
        }),
        records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'2141',b:'124'}],
        obj = records[0];
      store.setResult(records);
      store.remove(obj);
      expect(store.contains(obj)).toBeFalsy();
      expect(contains(obj,store.get('deletedRecords'))).toBeTruthy();
    });

  });

  describe('测试计算',function(){
    it('测试计算和',function(){
      var store = new Store({
          dataType : 'json'
        }),
        records = [{a:'1',b:'4'},{a:'2',b:4},{a:'2',b:'a'}],
        obj = records[2];
      store.setResult(records); 
      expect(store.sum('a')).toBe(5);
      expect(store.sum('b')).toBe(8)
    });

    it('测试计算和',function(){
      var store = new Store({
          dataType : 'json'
        }),
        records = [{a:'1',b:'4'},{a:'2',b:4},{a:'2',b:'a'}],
        obj = records[2];
      store.setResult(records); 
      expect(store.sum('a',[{a : 2}])).toBe(2);
      expect(store.sum('b',[{a:1}])).toBe(0)
    });
  });

  describe('测试filter', function(){
    it('测试load之后的数据', function(){
      var data = [{},{},{},{}],
      store = new Store({
        url:'data/store.json',
        autoLoad : true
      });

      var filtered = jasmine.createSpy();
      store.on('filtered', filtered);

      store.filter(function(item){
        return item['value'] === '1'
      })

      waits(100);
      runs(function(){
        expect(filtered).toHaveBeenCalled();
        var result = filtered.argsForCall[0][0].data;
        expect(result.length).toBe(1);
      });

      waits(100);
      store.load();
      runs(function(){
        expect(filtered.callCount).toBe(2);
      })
    })

    it('测试使用本地数据', function(){
      var data = [{value:'1'},{value: '2'},{value: '3'},{value: '4'}],
      store = new Store({
        data: data
      });

      var filtered = jasmine.createSpy();
      store.on('filtered', filtered);

      store.filter(function(item){
        return item['value'] === '1'
      })

      waits(100);
      runs(function(){
        expect(filtered).toHaveBeenCalled();
        var result = filtered.argsForCall[0][0].data;
        expect(result.length).toBe(1);
      });

      waits(100);
      store.setResult(data);
      runs(function(){
        expect(filtered.callCount).toBe(2);
      })
    })
  })

});
/**/
BUI.use('bui/data',function(Data){
  describe('修改传递到后台的参数',function(){
    var store = new Data.Store({
      url : 'data/store.json',
      pageSize:10,
      proxy : {
        limitParam : 'l',
        pageIndexParam : 'p',
        startParam : 's',
        pageStart : 1
      }
    });

    it('测试加载',function(){
      store.load();
    });
  });

  describe('修改链接',function(){
    var store = new Data.Store({
      url : 'data/store-a.json',
      pageSize:10
      
    });
    it('测试初始链接',function(){
      store.load();
      waits(100);
      runs(function(){
        expect(store.getCount()).toBe(1);
      });
    })
    it('更改链接',function(){
      store.get('proxy').set('url','data/store-b.json');
      store.load();
       waits(100);
      runs(function(){
        expect(store.getCount()).toBe(3);
      });
    });
  });

  describe('修改pageSize',function(){

  });
});