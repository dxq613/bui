/**
 * @fileOverview 列表排序
 * @ignore
 */

define('bui/list/sortable',['bui/common','bui/data'],function (require) {

  var BUI = require('bui/common'),
    DataSortable = require('bui/data').Sortable;

  /**
   * @class BUI.List.Sortable
   * 列表排序的扩展
   * @extends BUI.Data.Sortable
   */
  var Sortable = function(){

  };



  Sortable.ATTRS = BUI.merge(true,DataSortable.ATTRS, {

  });

  BUI.augment(Sortable,DataSortable,{
    
    /**
     * @protected
     * @override
     * @ignore
     * 覆写比较方法
     */
    compare : function(obj1,obj2,field,direction){
      var _self = this,
        dir;
      field = field || _self.get('sortField');
      direction = direction || _self.get('sortDirection');
      //如果未指定排序字段，或方向，则按照默认顺序
      if(!field || !direction){
        return 1;
      }
      dir = direction === 'ASC' ? 1 : -1;
      if(!$.isPlainObject(obj1)){
        obj1 = _self.getItemByElement(obj1);
      }
      if(!$.isPlainObject(obj2)){
        obj2 = _self.getItemByElement(obj2);
      }

      return _self.get('compareFunction')(obj1[field],obj2[field]) * dir;
    },
    /**
     * 获取排序的集合
     * @protected
     * @return {Array} 排序集合
     */
    getSortData : function(){
      return $.makeArray(this.get('view').getAllElements());
    },
    /**
     * 列表排序
     * @param  {string} field  字段名
     * @param  {string} direction 排序方向 ASC,DESC
     */
    sort : function(field,direction){
      var _self = this,
        sortedElements = _self.sortData(field,direction),
        itemContainer = _self.get('view').getItemContainer();
      if(!_self.get('store')){
        _self.sortData(field,direction,_self.get('items'));
      }
      BUI.each(sortedElements,function(el){
        $(el).appendTo(itemContainer);
      });
    }

  });

  return Sortable;
});