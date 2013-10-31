/**
 * @fileOverview 列表排序
 * @ignore
 */

define('bui/list/sortable',['bui/common','bui/data'],function (require) {

  var BUI = require('bui/common'),
    DataSortable = require('bui/data').Sortable;

  var Sortable = function(){

  };



  Sortable.ATTRS = BUI.merge(true,DataSortable.ATTRS, {

  });

  BUI.augment(Sortable,{
    
    /**
     * 获取排序的集合
     * @protected
     * @return {Array} 排序集合
     */
    getSortData : function(){

    },
    /**
     * 列表排序
     * @param  {string} field  字段名
     * @param  {string} direction 排序方向 ASC,DESC
     */
    sort : function(field,direction){
      var _self = this;

    },
    /**
     * 列表排序根据比较函数
     * @param  {Function} fn 比较函数
     */
    sortBy : function(fn){

    }

  });

  return Sortable;
});