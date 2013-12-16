BUI.use('bui/data',function (Data) {

  var Store = Data.Store;
  describe("测试单一路径，一起保存",function(){
    var store = new Store({
      url:'data/store.json',
      proxy : {
        save : 'data/save.php',
        method : 'POST'
      }
    });
      
    
    it('加载数据',function(){
      store.load();
      waits(200);
      runs(function(){
        var data = store.getResult();
        expect(data.length).not.toBe(0);
      });
    });

    it('添加、修改、删除数据',function(){
      var obj = {value : 'new',text : 'new'};
      store.add(obj);
      expect(BUI.Array.contains(obj,store.get('newRecords')));

      var obj1 = store.find('value',"1");
      obj1.text = 'update 1';
      store.update(obj1);
      expect(BUI.Array.contains(obj1,store.get('modifiedRecords')));

      var obj2 = store.find('value',"2");
      store.remove(obj2);

      expect(BUI.Array.contains(obj2,store.get('deletedRecords')));

    });

    it('保存数据',function(){
      var callback = jasmine.createSpy();
      store.save('all',null,function(data){
        expect(data.hasError).toBe(false);
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(store.get('newRecords').length).toBe(0);
        expect(store.get('modifiedRecords').length).toBe(0);
        expect(store.get('deletedRecords').length).toBe(0);
      });
    });
  });
  

  describe('测试单一路径，分别保存',function(){
    var store = new Store({
      url:'data/store.json',
      proxy : {
        save : 'data/save.php',
        method : 'POST'
      }
    });

    it('加载数据',function(){
      store.load();
      waits(200);
      runs(function(){
        var data = store.getResult();
        expect(data.length).not.toBe(0);
      });
    });

    it('测试添加记录',function(){
      var obj = {value : 'new',text : 'new'};
      store.add(obj);
      expect(BUI.Array.contains(obj,store.get('newRecords')));

      var callback = jasmine.createSpy();

      store.save('add',obj,function(data){
        expect(data.id).not.toBe(undefined);
        obj.id = data.id;
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(obj.id).not.toBe(undefined);
        expect(store.get('newRecords').length).toBe(0);
      });
    });

    it('测试更新数据',function(){
      var obj = store.find('value','1');
      obj.text = 'new text';

      store.update(obj);
      expect(BUI.Array.contains(obj,store.get('modifiedRecords')));

      var callback = jasmine.createSpy();

      store.save('update',obj,function(data){
        expect(data.success).toBe(true);
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(store.get('modifiedRecords').length).toBe(0);
      });
    });

    it('测试删除记录',function(){
      var obj = store.find('value','2');

      store.remove(obj);
      expect(BUI.Array.contains(obj,store.get('deletedRecords')));

      var callback = jasmine.createSpy();

      store.save('remove',obj,function(data){
        expect(data.success).toBe(true);
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(store.get('deletedRecords').length).toBe(0);
      });
    });
  });

  describe('测试多路径，分别保存',function(){
    var store = new Store({
      url:'data/store.json',
      proxy : {
        save : {
          addUrl : 'data/add.json',
          updateUrl : 'data/update.json',
          removeUrl : 'data/remove.json'
        },
        method : 'POST'
      }
    });

    it('加载数据',function(){
      store.load();
      waits(200);
      runs(function(){
        var data = store.getResult();
        expect(data.length).not.toBe(0);
      });
    });

    it('测试添加记录',function(){
      var obj = {value : 'new',text : 'new'};
      store.add(obj);
      expect(BUI.Array.contains(obj,store.get('newRecords')));

      var callback = jasmine.createSpy();

      store.save('add',obj,function(data){
        expect(data.id).not.toBe(undefined);
        obj.id = data.id;
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(obj.id).not.toBe(undefined);
        expect(store.get('newRecords').length).toBe(0);
      });
    });

    it('测试更新数据',function(){
      var obj = store.find('value','1');
      obj.text = 'new text';

      store.update(obj);
      expect(BUI.Array.contains(obj,store.get('modifiedRecords')));

      var callback = jasmine.createSpy();

      store.save('update',obj,function(data){
        expect(data.success).toBe(true);
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(store.get('modifiedRecords').length).toBe(0);
      });
    });

    it('测试删除记录',function(){
      var obj = store.find('value','2');

      store.remove(obj);
      expect(BUI.Array.contains(obj,store.get('deletedRecords')));

      var callback = jasmine.createSpy();

      store.save('remove',obj,function(data){
        expect(data.success).toBe(true);
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(store.get('deletedRecords').length).toBe(0);
      });
    });
  });

  describe('测试不指定类型',function(){
    var store = new Store({
      url:'data/store.json',
      proxy : {
        save : {
          addUrl : 'data/add.json',
          updateUrl : 'data/update.json',
          removeUrl : 'data/remove.json'
        },
        method : 'POST'
      }
    });

    it('加载数据',function(){
      store.load();
      waits(200);
      runs(function(){
        var data = store.getResult();
        expect(data.length).not.toBe(0);
      });
    });

    it('测试添加记录',function(){
      var obj = {value : 'new',text : 'new'};
      store.add(obj);
      expect(BUI.Array.contains(obj,store.get('newRecords')));

      var callback = jasmine.createSpy();

      store.save(obj,function(data){
        expect(data.id).not.toBe(undefined);
        obj.id = data.id;
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(obj.id).not.toBe(undefined);
        expect(store.get('newRecords').length).toBe(0);
      });
    });

    it('测试更新数据',function(){
      var obj = store.find('value','1');
      obj.text = 'new text';

      store.update(obj);
      expect(BUI.Array.contains(obj,store.get('modifiedRecords')));

      var callback = jasmine.createSpy();

      store.save(obj,function(data){
        expect(data.success).toBe(true);
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(store.get('modifiedRecords').length).toBe(0);
      });
    });

    it('测试删除记录',function(){
      var obj = store.find('value','2');

      store.remove(obj);
      expect(BUI.Array.contains(obj,store.get('deletedRecords')));

      var callback = jasmine.createSpy();

      store.save(obj,function(data){
        expect(data.success).toBe(true);
        callback();
      });

      waits(200);
      runs(function(){
        expect(callback).toHaveBeenCalled();
        expect(store.get('deletedRecords').length).toBe(0);
      });
    });
  });


  describe('测试事件、回调、失败',function(){
    var store = new Store({
      url:'data/store.json',
      proxy : {
        save : 'data/save.php',
        method : 'POST'
      }
    });

    it('加载数据',function(){
      store.load();
      waits(200);
      runs(function(){
        var data = store.getResult();
        expect(data.length).not.toBe(0);
      });
    });

    it('测试事件',function(){
      var before = jasmine.createSpy(),
        saved = jasmine.createSpy(),
        obj = {};
      function fn1(ev){
        expect(ev.type).toBe('add');
        expect(ev.saveData).toBe(obj);
        before();
      }

      function fn2(ev){
        expect(ev.type).toBe('add');
        expect(ev.saveData).toBe(obj);
        expect(ev.data.id).not.toBe(undefined);
        saved();
      }
      store.on('beforesave',fn1);

      store.on('saved',fn2);
      store.add(obj);
      store.save('add',obj);
      waits(200);
      runs(function(){
        expect(before).toHaveBeenCalled();
        expect(saved).toHaveBeenCalled();
        store.off('beforesave',fn1);
        store.off('saved',fn2);
      });

    });

    it('测试保存失败',function(){
      var exception = jasmine.createSpy();

      store.on('exception',exception);

      var obj = store.find('value','1');
      obj.error = true;
      store.update(obj);
      store.save('update',obj);

      waits(200);
      runs(function(){
        expect(exception).toHaveBeenCalled();
      });
    });
  });

  describe('测试保存本地数据,分别保存',function(){

    var records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'214',b:'124'}],
      store = new Store({
        data : records
      });
    it('测试初始化',function(){
      var result = store.getResult();
      expect(records).not.toBe(result);
      expect(records.length).toBe(result.length);
    });

    it('测试添加记录',function(){
      var obj = {};
      store.add(obj);
      var result = store.getResult();
      expect(result.length).not.toBe(records.length);
      store.save('add',obj);
      expect(result.length).toBe(records.length);
    });

    it('测试删除记录',function(){
      var obj = store.find('a','123');
      store.remove(obj);
      var result = store.getResult();
      expect(result.length).not.toBe(records.length);
      store.save('remove',obj);
      expect(result.length).toBe(records.length);
    });

  });

  describe('测试保存本地数据,集体保存',function(){
    var records = [{a:'123',b:'456'},{a:'234',b:'456'},{a:'214',b:'124'}],
      store = new Store({
        data : records
      });
    it('测试初始化',function(){
      var result = store.getResult();
      expect(records).not.toBe(result);
      expect(records.length).toBe(result.length);
    });
    it('测试保存数据',function(){
      var obj = {};
      store.add(obj);

      var obj = store.find('a','123');
      store.remove(obj);

      store.add({});
      var result = store.getResult();
      expect(records.length).not.toBe(result.length);
      store.save('all');
      expect(records.length).toBe(result.length);
    });
  });
});