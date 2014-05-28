/**
 * @fileOverview 数据缓冲对象
 * @author dxq613@gmail.com
 * @ignore
 */

define('bui/data/store',['bui/data/proxy','bui/data/abstractstore','bui/data/sortable'],function(require) {
  
  var Proxy = require('bui/data/proxy'),
    AbstractStore = require('bui/data/abstractstore'),
    Sortable = require('bui/data/sortable');

  //移除数据
  function removeAt(index,array){
    if(index < 0){
      return;
    }
    var records = array,
      record = records[index];
    records.splice(index,1);
    return record;
  }

  function removeFrom(record,array){
    var index = BUI.Array.indexOf(record,array);   
    if(index >= 0){
      removeAt(index,array);
    }
  }

  function contains(record,array){
    return BUI.Array.indexOf(record,array) !== -1;
  }
  /**
   * 用于加载数据，缓冲数据的类
   * <p>
   * <img src="../assets/img/class-data.jpg"/>
   * </p>
   * ** 缓存静态数据 ** 
   * <pre><code>
   *  var store = new Store({
   *    data : [{},{}]
   *  });
   * </code></pre>
   * ** 异步加载数据 **
   * <pre><code>
   *  var store = new Store({
   *    url : 'data.json',
   *    autoLoad : true,
   *    params : {id : '123'},
   *    sortInfo : {
   *      field : 'id',
   *      direction : 'ASC' //ASC,DESC
   *    }
   *  });
   * </code></pre>
   * 
   * @class BUI.Data.Store
   * @extends BUI.Data.AbstractStore
   * @mixins BUI.Data.Sortable
   */
  var store = function(config){
    store.superclass.constructor.call(this,config);
    //this._init();
  };

  store.ATTRS = 
  {
    /**
     * 保存数据时，是否自动更新数据源的数据，常用于添加、删除、更改数据后重新加载数据。
     * @cfg {Boolean} autoSync
     */
    autoSync : {
      value : false
    },
    /**
     * 当前页码
     * @cfg {Number} [currentPage=0]
     * @ignore
     */
    /**
     * 当前页码
     * @type {Number}
     * @ignore
     * @readOnly
     */
    currentPage:{
      value : 0
    },
    
    /**
     * 删除掉的纪录
     * @readOnly
     * @private
     * @type {Array}
     */
    deletedRecords : {
      shared : false,
      value:[]
    },
    /**
     * 错误字段,包含在返回信息中表示错误信息的字段
     * <pre><code>
     *   //可以修改接收的后台参数的含义
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //存放错误信息的字段(error)
     *     hasErrorProperty : 'isError', //是否错误的字段（hasError)
     *     root : 'data',               //存放数据的字段名(rows)
     *     totalProperty : 'total'     //存放记录总数的字段名(results)
     *   });
     * </code></pre>
     * @cfg {String} [errorProperty='error']
     */
    /**
     * 错误字段
     * @type {String}
     * @ignore
     */
    errorProperty : {
      value : 'error'
    },
    /**
     * 是否存在错误,加载数据时如果返回错误，此字段表示有错误发生
     * <pre><code>
     *   //可以修改接收的后台参数的含义
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //存放错误信息的字段(error)
     *     hasErrorProperty : 'isError', //是否错误的字段（hasError)
     *     root : 'data',               //存放数据的字段名(rows)
     *     totalProperty : 'total'     //存放记录总数的字段名(results)
     *   });
     * </code></pre>
     * @cfg {String} [hasErrorProperty='hasError']
     */
    /**
     * 是否存在错误
     * @type {String}
     * @default 'hasError'
     * @ignore
     */
    hasErrorProperty : {
      value : 'hasError'
    },

    /**
     * 对比2个对象是否相当，在去重、更新、删除，查找数据时使用此函数
     * @default  
     * function(obj1,obj2){
     *   return obj1 == obj2;
     * }
     * @type {Object}
     * @example
     * function(obj1 ,obj2){
     *   //如果id相等，就认为2个数据相等，可以在添加对象时去重
     *   //更新对象时，仅提供改变的字段
     *   return obj1.id == obj2.id;
     * }
     * 
     */
    matchFunction : {
      value : function(obj1,obj2){
        return obj1 == obj2;
      }
    },
    /**
     * 更改的纪录集合
     * @type {Array}
     * @private
     * @readOnly
     */
    modifiedRecords : {
      shared : false,
      value:[]
    },
    /**
     * 新添加的纪录集合，只读
     * @type {Array}
     * @private
     * @readOnly
     */
    newRecords : {
      shared : false,
      value : []
    },
    /**
     * 是否远程排序，默认状态下内存排序
     *   - 由于当前Store存储的不一定是数据源的全集，所以此配置项需要重新读取数据
     *   - 在分页状态下，进行远程排序，会进行全集数据的排序，并返回首页的数据
     *   - remoteSort为 false的情况下，仅对当前页的数据进行排序
     * @cfg {Boolean} [remoteSort=false]
     */
    remoteSort : {
      value : false
    },
    /**
     * 缓存的数据，包含以下几个字段
     * <ol>
     * <li>rows: 数据集合</li>
     * <li>results: 总的数据条数</li>
     * </ol>
     * @type {Object}
     * @private
     * @readOnly
     */
    resultMap : {
      shared : false,
      value : {}
    },
    /**
     * 加载数据时，返回数据的根目录
     * @cfg {String} [root='rows']
     * <pre><code>
     *    //默认返回数据类型：
     *    '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
     *   //可以修改接收的后台参数的含义
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //存放错误信息的字段(error)
     *     hasErrorProperty : 'isError', //是否错误的字段（hasError)
     *     root : 'data',               //存放数据的字段名(rows)
     *     totalProperty : 'total'     //存放记录总数的字段名(results)
     *   });
     * </code></pre>
     *   
     */
    root: { value : 'rows'}, 

    /**
     * 当前Store缓存的数据条数
     * @type {Number}
     * @private
     * @readOnly
     */
    rowCount :{
      value : 0
    },
    /**
     * 加载数据时，返回记录的总数的字段，用于分页
     * @cfg {String} [totalProperty='results']
     *<pre><code>
     *    //默认返回数据类型：
     *    '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
     *   //可以修改接收的后台参数的含义
     *   var store = new Store({
     *     url : 'data.json',
     *     errorProperty : 'errorMsg', //存放错误信息的字段(error)
     *     hasErrorProperty : 'isError', //是否错误的字段（hasError)
     *     root : 'data',               //存放数据的字段名(rows)
     *     totalProperty : 'total'     //存放记录总数的字段名(results)
     *   });
     * </code></pre>
     */
    totalProperty: {value :'results'}, 

    /**
     * 加载数据的起始位置
     * <pre><code>
     *  //初始化时，可以在params中配置
     *  var store = new Store({
     *    url : 'data.json',
     *    params : {
     *      start : 100
     *    }
     *  });
     * </code></pre>
     * @type {Object}
     */
    start:{
      value : 0
    },
    /**
     * 每页多少条记录,默认为null,此时不分页，当指定了此值时分页
     * <pre><code>
     *  //当请求的数据分页时
     *  var store = new Store({
     *    url : 'data.json',
     *    pageSize : 30
     *  });
     * </code></pre>
     * @cfg {Number} pageSize
     */
    pageSize : {

    }
  };
  BUI.extend(store,AbstractStore);

  BUI.mixin(store,[Sortable]);

  BUI.augment(store,
  {
    /**
    * 添加记录,默认添加在后面
    * <pre><code>
    *  //添加记录
    *  store.add({id : '2',text: 'new data'});
    *  //是否去重，重复数据不能添加
    *  store.add(obj,true); //不能添加重复数据，此时用obj1 === obj2判断
    *  //使用匹配函去重
    *  store.add(obj,true,function(obj1,obj2){
    *    return obj1.id == obj2.id;
    *  });
    *  
    * </code></pre>
    * @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
    * @param {Boolean} [noRepeat = false] 是否去重,可以为空，默认： false 
    * @param {Function} [match] 匹配函数，可以为空，
    * @default 配置项中 matchFunction 属性传入的函数，默认是：<br>
    *  function(obj1,obj2){
    *    return obj1 == obj2;
    *  }
    * 
    */
    add :function(data,noRepeat,match){
      var _self = this,
        count = _self.getCount();
      _self.addAt(data,count,noRepeat,match)
    },
    /**
    * 添加记录,指定索引值
    * <pre><code>
    *  //使用方式跟类似于add,增加了index参数
    *  store.add(obj,0);//添加在最前面
    * </code></pre>
    * @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
    * @param {Number} index 开始添加数据的位置
    * @param {Boolean} [noRepeat = false] 是否去重,可以为空，默认： false 
    * @param {Function} [match] 匹配函数，可以为空，
     */
    addAt : function(data,index,noRepeat,match){
      var _self = this;

      match = match || _self._getDefaultMatch();
      if(!BUI.isArray(data)){
        data = [data];
      }

      $.each(data,function(pos,element){
        if(!noRepeat || !_self.contains(element,match)){
          _self._addRecord(element,pos + index);

          _self.get('newRecords').push(element);

          removeFrom(element,_self.get('deletedRecords'));
          removeFrom(element,_self.get('modifiedRecords'));
        }
      });
    },
    /**
    * 验证是否存在指定记录
    * <pre><code>
    *  store.contains(obj); //是否包含指定的记录
    *
    *  store.contains(obj,function(obj1,obj2){ //使用匹配函数
    *    return obj1.id == obj2.id;
    *  });
    * </code></pre>
    * @param {Object} record 指定的记录
    * @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] 默认为比较2个对象是否相同
    * @return {Boolean}
    */
    contains :function(record,match){
      return this.findIndexBy(record,match)!==-1;
    },
    /**
    * 查找记录，仅返回第一条
    * <pre><code>
    *  var record = store.find('id','123');
    * </code></pre>
    * @param {String} field 字段名
    * @param {String} value 字段值
    * @return {Object|null}
    */
    find : function(field,value){
      var _self = this,
        result = null,
        records = _self.getResult();
      $.each(records,function(index,record){
        if(record[field] === value){
          result = record;
          return false;
        }
      });
      return result;
    },
    /**
    * 查找记录，返回所有符合查询条件的记录
    * <pre><code>
    *   var records = store.findAll('type','0');
    * </code></pre>
    * @param {String} field 字段名
    * @param {String} value 字段值
    * @return {Array}
    */
    findAll : function(field,value){
      var _self = this,
        result = [],
        records = _self.getResult();
      $.each(records,function(index,record){
        if(record[field] === value){
          result.push(record);
        }
      });
      return result;
    },
    /**
    * 根据索引查找记录
    * <pre><code>
    *  var record = store.findByIndex(1);
    * </code></pre>
    * @param {Number} index 索引
    * @return {Object} 查找的记录
    */
    findByIndex : function(index){
      return this.getResult()[index];
    },
    /**
    * 查找数据所在的索引位置,若不存在返回-1
    * <pre><code>
    *  var index = store.findIndexBy(obj);
    *
    *  var index = store.findIndexBy(obj,function(obj1,obj2){
    *    return obj1.id == obj2.id;
    *  });
    * </code></pre>
    * @param {Object} target 指定的记录
    * @param {Function} [match = matchFunction] @see {BUI.Data.Store#matchFunction}默认为比较2个对象是否相同
    * @return {Number}
    */
    findIndexBy :function(target,match){
      var _self = this,
        position = -1,
        records = _self.getResult();
      match = match || _self._getDefaultMatch();
      if(target === null || target === undefined){
        return -1;
      }
      $.each(records,function(index,record){
        if(match(target,record)){
          position = index;
          return false;
        }
      });
      return position;
    },
    /**
    * 获取下一条记录
    * <pre><code>
    *  var record = store.findNextRecord(obj);
    * </code></pre>
    * @param {Object} record 当前记录
    * @return {Object} 下一条记录
    */
    findNextRecord : function(record){
      var _self = this,
        index = _self.findIndexBy(record);
      if(index >= 0){
        return _self.findByIndex(index + 1);
      }
      return;
    },

    /**
     * 获取缓存的记录数
     * <pre><code>
     *  var count = store.getCount(); //缓存的数据数量
     *
     *  var totalCount = store.getTotalCount(); //数据的总数，如果有分页时，totalCount != count
     * </code></pre>
     * @return {Number} 记录数
     */
    getCount : function(){
      return this.getResult().length;
    },
    /**
     * 获取数据源的数据总数，分页时，当前仅缓存当前页数据
     * <pre><code>
     *  var count = store.getCount(); //缓存的数据数量
     *
     *  var totalCount = store.getTotalCount(); //数据的总数，如果有分页时，totalCount != count
     * </code></pre>
     * @return {Number} 记录的总数
     */
    getTotalCount : function(){
      var _self = this,
        resultMap = _self.get('resultMap'),
        total = _self.get('totalProperty');
      return parseInt(resultMap[total],10) || 0;
    },
    /**
     * 获取当前缓存的纪录
     * <pre><code>
     *   var records = store.getResult();
     * </code></pre>
     * @return {Array} 纪录集合
     */
    getResult : function(){
      var _self = this,
        resultMap = _self.get('resultMap'),
        root = _self.get('root');
      return resultMap[root];
    },
    /**
     * 是否包含数据
     * @return {Boolean} 
     */
    hasData : function(){
      return this.getCount() !== 0;
    },
    /**
     * 设置数据源,非异步加载时，设置缓存的数据
     * <pre><code>
     *   store.setResult([]); //清空数据
     *
     *   var data = [{},{}];
     *   store.setResult(data); //重设数据
     * </code></pre>
     */
    setResult : function(data){
      var _self = this,
        proxy = _self.get('proxy');
      if(proxy instanceof Proxy.Memery){
        _self.set('data',data);
        _self.load({start:0});
      }else{
        _self._setResult(data);
        //如果有filter则进行过滤
        if(_self.get('filter')){
          _self.filter();
        }
      }
    },

    /**
    * 删除一条或多条记录触发 remove 事件.
    * <pre><code>
    *  store.remove(obj);  //删除一条记录
    *
    *  store.remove([obj1,obj2...]); //删除多个条记录
    *
    *  store.remvoe(obj,funciton(obj1,obj2){ //使用匹配函数
    *    return obj1.id == obj2.id;
    *  });
    * </code></pre>
    * @param {Array|Object} data 添加的数据，可以是数组，可以是单条记录
    * @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] 匹配函数，可以为空
    */
    remove :function(data,match){
      var _self =this,
        delData=[];
      match = match || _self._getDefaultMatch();
      if(!BUI.isArray(data)){
        data = [data];
      }
      $.each(data,function(index,element){
        var index = _self.findIndexBy(element,match),
            record = removeAt(index,_self.getResult());
        //添加到已删除队列中,如果是新添加的数据，不计入删除的数据集合中
        if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('deletedRecords'))){
          _self.get('deletedRecords').push(record);
        }
        removeFrom(record,_self.get('newRecords'));
        removeFrom(record,_self.get('modifiedRecords'));
        _self.fire('remove',{record:record});
      }); 
    },
    /**
     * 保存数据，有几种类型：
     * 
     *  - add 保存添加的记录,
     *  - remove 保存删除,
     *  - update 保存更新,
     *  - all 保存store从上次加载到目前更改的记录
     *
     * 
     * @param {String} type 保存的类型
     * @param {Object} saveData 数据
     * @param {Function} callback
     */
    save : function(type,saveData,callback){
      var _self = this,
        proxy = _self.get('proxy');

      if(BUI.isFunction(type)){ //只有回调函数
        callback = type;
        type = undefined;
      }
      if(BUI.isObject(type)){ //未指定类型
        callback = saveData;
        saveData = type;
        type = undefined;
      }
      if(!type){
        type = _self._getSaveType(saveData);
      }
      if(type == 'all' && !saveData){//如果保存全部，同时未提供保存的数据，自动获取
        saveData = _self._getDirtyData();
      }

      _self.fire('beforesave',{type : type,saveData : saveData});

      proxy.save(type,saveData,function(data){
        _self.onSave(type,saveData,data);
        if(callback){
          callback(data,saveData);
        }
      },_self);

    },
    //根据保存的数据获取保存的类型
    _getSaveType :function(saveData){
      var _self = this;
      if(!saveData){
        return 'all';
      }

      if(BUI.Array.contains(saveData,_self.get('newRecords'))){
        return 'add';
      }

      if(BUI.Array.contains(saveData,_self.get('modifiedRecords'))){
        return 'update';
      }

      if(BUI.Array.contains(saveData,_self.get('deletedRecords'))){
        return 'remove';
      }
      return 'custom';
    },
    //获取未保存的数据
    _getDirtyData : function(){
      var _self = this,
        proxy = _self.get('proxy');
      if(proxy.get('url')){
        return {
          add : BUI.JSON.stringify(_self.get('newRecords')),
          update : BUI.JSON.stringify(_self.get('modifiedRecords')),
          remove : BUI.JSON.stringify(_self.get('deletedRecords'))
        };
      }else{
        return {
          add : _self.get('newRecords'),
          update : _self.get('modifiedRecords'),
          remove : _self.get('deletedRecords')
        };
      }
      
    },
    /**
     * 保存完成后
     * @private
     */
    onSave : function(type,saveData,data){
      var _self = this,
         hasErrorField = _self.get('hasErrorProperty');

      if(data[hasErrorField] || data.exception){ //如果失败
        _self.onException(data);
        return;
      }
      _self._clearDirty(type,saveData);

      _self.fire('saved',{type : type,saveData : saveData,data : data});
      if(_self.get('autoSync')){
        _self.load();
      }
    },
    //清除脏数据
    _clearDirty : function(type,saveData){
      var _self = this;
      switch(type){
        case  'all' : 
          _self._clearChanges();
          break;
        case 'add' : 
          removeFrom(saveData,'newRecords');
          break;
        case 'update' : 
          removeFrom(saveData,'modifiedRecords');
          break;
        case 'remove' : 
          removeFrom(saveData,'deletedRecords');
          break;
        default : 
          break;
      }
      function removeFrom(obj,name){
        BUI.Array.remove(_self.get(name),obj);
      }
    },
    /**
     * 排序，如果remoteSort = true,发送请求，后端排序
     * <pre><code>
     *   store.sort('id','DESC'); //以id为排序字段，倒序排序
     * </code></pre>
     * @param  {String} field     排序字段
     * @param  {String} direction 排序方向
     */
    sort : function(field,direction){
      var _self = this,
        remoteSort = _self.get('remoteSort');

      if(!remoteSort){
        _self._localSort(field,direction);
      }else{
        _self.set('sortField',field);
        _self.set('sortDirection',direction);
        _self.load(_self.get('sortInfo'));
      }
    },
    /**
     * 计算指定字段的和
     * <pre><code>
     *   var sum = store.sum('number');
     * </code></pre>
     * @param  {String} field 字段名
     * @param  {Array} [data] 计算的集合，默认为Store中的数据集合
     * @return {Number} 汇总和
     */
    sum : function(field,data){
      var  _self = this,
        records = data || _self.getResult(),
        sum = 0;
      BUI.each(records,function(record){
        var val = record[field];
        if(!isNaN(val)){
          sum += parseFloat(val);
        }
      });
      return sum;
    },
    /**
    * 设置记录的值 ，触发 update 事件
    * <pre><code>
    *  store.setValue(obj,'value','new value');
    * </code></pre>
    * @param {Object} obj 修改的记录
    * @param {String} field 修改的字段名
    * @param {Object} value 修改的值
    */
    setValue : function(obj,field,value){
      var record = obj,
        _self = this;

      record[field]=value;
      if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('modifiedRecords'))){
          _self.get('modifiedRecords').push(record);
      }
      _self.fire('update',{record:record,field:field,value:value});
    },
    /**
    * 更新记录 ，触发 update事件
    * <pre><code>
    *   var record = store.find('id','12');
    *   record.value = 'new value';
    *   record.text = 'new text';
    *   store.update(record); //触发update事件，引起绑定了store的控件更新
    * </code></pre>
    * @param {Object} obj 修改的记录
    * @param {Boolean} [isMatch = false] 是否需要进行匹配，检测指定的记录是否在集合中
    * @param {Function} [match = matchFunction] 匹配函数
    */
    update : function(obj,isMatch,match){
      var record = obj,
        _self = this,
        match = null,
        index = null;
      if(isMatch){
        match = match || _self._getDefaultMatch();
        index = _self.findIndexBy(obj,match);
        if(index >=0){
          record = _self.getResult()[index];
        }
      }
      record = BUI.mix(record,obj);
      if(!contains(record,_self.get('newRecords')) && !contains(record,_self.get('modifiedRecords'))){
          _self.get('modifiedRecords').push(record);
      }
      _self.fire('update',{record:record});
    },
    //添加纪录
    _addRecord :function(record,index){
      var records = this.getResult();
      if(index == undefined){
        index = records.length;
      }
      records.splice(index,0,record);
      this.fire('add',{record:record,index:index});
    },
    //清除改变的数据记录
    _clearChanges : function(){
      var _self = this;
      BUI.Array.empty(_self.get('newRecords'));
      BUI.Array.empty(_self.get('modifiedRecords'));
      BUI.Array.empty(_self.get('deletedRecords'));
    },
    /**
     * @protected
     * 过滤缓存的数据
     * @param  {Function} fn 过滤函数
     * @return {Array} 过滤结果
     */
    _filterLocal : function(fn,data){

      var _self = this,
        rst = [];
      data = data || _self.getResult();
      if(!fn){ //没有过滤器时直接返回
        return data;
      }
      BUI.each(data,function(record){
        if(fn(record)){
          rst.push(record);
        }
      });
      return rst;
    },
    //获取默认的匹配函数
    _getDefaultMatch :function(){

      return this.get('matchFunction');
    },

    //获取分页相关的信息
    _getPageParams : function(){
      var _self = this,
        sortInfo = _self.get('sortInfo'),
        start = _self.get('start'),
        limit = _self.get('pageSize'),
        pageIndex = _self.get('pageIndex') || (limit ? start/limit : 0);

        params = {
          start : start,
          limit : limit,
          pageIndex : pageIndex //一般而言，pageIndex = start/limit
        };

      if(_self.get('remoteSort')){
        BUI.mix(params,sortInfo);
      }

      return params;
    },
     /**
     * 获取附加的参数,分页信息，排序信息
     * @override
     * @protected
     * @return {Object} 附加的参数
     */
    getAppendParams : function(){
      return this._getPageParams();
    },
    /**
     * @protected
     * 初始化之前
     */
    beforeInit : function(){
      //初始化结果集
      this._setResult([]);
    },
    //本地排序
    _localSort : function(field,direction){
      var _self = this;

      _self._sortData(field,direction);

      _self.fire('localsort',{field:field,direction:direction});
    },
    _sortData : function(field,direction,data){
      var _self = this;
      data = data || _self.getResult();

      _self.sortData(field,direction,data);
    },
    //处理数据
    afterProcessLoad : function(data,params){
      var _self = this,
        root = _self.get('root'),
        start = params.start,
        limit = params.limit,
        totalProperty = _self.get('totalProperty');

      if(BUI.isArray(data)){
        _self._setResult(data);
      }else{
        _self._setResult(data[root],data[totalProperty]);
      }

      _self.set('start',start);

      if(limit){
        _self.set('pageIndex',start/limit);
      }

      //如果本地排序,则排序
      if(!_self.get('remoteSort')){
        _self._sortData();
      }

      _self.fire('load',{ params : params });

      //如果有本地过滤，则本地过滤
      if(!_self.get('remoteFilter') && _self.get('filter')){
        _self.filter(_self.get('filter'));
      }
    },
    //设置结果集
    _setResult : function(rows,totalCount){
      var _self = this,
        resultMap = _self.get('resultMap');

      totalCount = totalCount || rows.length;
      resultMap[_self.get('root')] = rows;
      resultMap[_self.get('totalProperty')] = totalCount;

      //清理之前发生的改变
      _self._clearChanges();
    }
  });

  return store;
});