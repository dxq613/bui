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
   * @class BUI.Data.Store
   * @extends BUI.Data.AbstractStore
   * @mixins BUI.Data.Sortable
   */
  var store = function(config){
    store.superclass.constructor.call(this,config);
    //this._init();
  };

  store.ATTRS = 
  /**
   * @lends BUI.Data.Store#
   * @ignore
   */
  {
    /**
     * 当前页码
     * @cfg {Number} [currentPage=0]
     */
    /**
     * 当前页码
     * @type {Number}
     * @default 0
     */
    currentPage:{
      value : 0
    },
    
    /**
     * 删除掉的纪录
     * @readOnly
     * @type {Array}
     */
    deletedRecords : {
      value:[]
    },
    /**
     * 错误字段,包含在返回信息中表示错误信息的字段
     * @cfg {String} [errorProperty='error']
     */
    /**
     * 错误字段
     * @type {String}
     * @default 'error'
     */
    errorProperty : {
      value : 'error'
    },
    /**
     * 是否存在错误,加载数据时如果返回错误，此字段表示有错误发生
     * @cfg {String} [hasErrorProperty='hasError']
     */
    /**
     * 是否存在错误
     * @type {String}
     * @default 'hasError'
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
     * @readOnly
     */
    modifiedRecords : {
      value:[]
    },
    /**
     * 新添加的纪录集合，只读
     * @type {Array}
     * @readOnly
     */
    newRecords : {
      value : []
    },
    /**
     * 是否远程排序，由于当前Store存储的不一定是数据源的全集，所以此配置项需要重新读取数据
     * 在分页状态下，进行远程排序，会进行全集数据的排序，并返回首页的数据
     * remoteSort为 false的情况下，仅对当前页的数据进行排序
     * @cfg {Boolean} [remoteSort=false]
     */
    /**
     * 是否远程排序，由于当前Store存储的不一定是数据源的全集，所以此配置项需要重新读取数据
     * 在分页状态下，进行远程排序，会进行全集数据的排序，并返回首页的数据
     * remoteSort为 false的情况下，仅对当前页的数据进行排序
     * @type {Boolean}
     * @default false
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
     * @protected
     * @readOnly
     */
    resultMap : {
      value : {}
    },
    /**
    * 加载数据时，返回数据的根目录
    * @cfg {String} [root='rows']
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    /**
    * 加载数据时，返回数据的根目录
    * @field
    * @type {String}
    * @default  "rows"
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    root: { value : 'rows'}, 

    /**
     * 当前Store缓存的数据条数
     * @type {Number}
     * @readOnly
     */
    rowCount :{
      value : 0
    },
    /**
    * 加载数据时，返回记录的总数的字段，用于分页
    * @cfg {String} [totalProperty='results']
    *
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    /**
    * 加载数据时，返回记录的总数的字段，用于分页
    * @field
    * @type {String}
    * @default  "results"
    *
    *   '{"rows":[{"name":"abc"},{"name":"bcd"}],"results":100}'
    */
    totalProperty: {value :'results'}, 

    /**
     * 加载数据的起始位置
     * @type {Object}
     */
    start:{
      value : 0
    },
    /**
     * 每页多少条记录,默认为null,此时不分页，当指定了此值时分页
     * @cfg {Number} pageSize
     */
    /**
     * 每页多少条记录,默认为null,此时不分页，当指定了此值时分页
     * @type {Number}
     */
    pageSize : {

    }
  };
  BUI.extend(store,AbstractStore);

  BUI.mixin(store,[Sortable]);

  BUI.augment(store,
  /**
   * @lends BUI.Data.Store.prototype
   * @ignore
   */
  {
    /**
    * 添加记录,默认添加在后面
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
    * @param {Object} record 指定的记录
    * @param {Function} [match = function(obj1,obj2){return obj1 == obj2}] 默认为比较2个对象是否相同
    * @return {Boolean}
    */
    contains :function(record,match){
      return this.findIndexBy(record,match)!==-1;
    },
    /**
    * 查找记录，仅返回第一条
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
    * @param {Number} index 索引
    * @return {Object} 查找的记录
    */
    findByIndex : function(index){
      return this.getResult()[index];
    },
    /**
    * 查找数据所在的索引位置,若不存在返回-1
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
     * @return {Number} 记录数
     */
    getCount : function(){
      return this.getResult().length;
    },
    /**
     * 获取数据源的数据总数，分页时，当前仅缓存当前页数据
     * @return {Number} 记录的总数
     */
    getTotalCount : function(){
      var _self = this,
        resultMap = _self.get('resultMap'),
        total = _self.get('totalProperty');
      return resultMap[total] || 0;
    },
    /**
     * 获取当前缓存的纪录
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
     * 设置数据源
     */
    setResult : function(data){
      var _self = this,
        proxy = _self.get('proxy');
      if(proxy instanceof Proxy.Memery){
        _self.set('data',data);
        _self.load({start:0});
      }else{
        _self._setResult(data);
      }
    },

    /**
    * 删除记录触发 remove 事件.
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
     * 排序
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
    * @param {Object} obj 修改的记录
    * @param {Boolean} [isMatch = false] 是否需要进行匹配，检测指定的记录是否在集合中
    */
    update : function(obj,isMatch){
      var record = obj,
        _self = this,
        match = null,
        index = null;
      if(isMatch){
        match = _self._getDefaultMatch();
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
      _self.get('newRecords').splice(0);
      _self.get('modifiedRecords').splice(0);
      _self.get('deletedRecords').splice(0);
    },
    //获取默认的匹配函数
    _getDefaultMatch :function(){

      return this.get('matchFunction');
    },

    //获取分页相关的信息
    _getPageParams : function(){
      var _self = this,
        sortInfo = _self.get('sortInfo'),
        params = {
          start : _self.get('start'),
          limit : _self.get('pageSize'),
          pageIndex : _self.get('pageIndex') //一般而言，pageIndex = start/limit
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

      _self.fire('localsort');
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