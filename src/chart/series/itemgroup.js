/**
 * @fileOverview 包含数据序列子项的数据序列类,作为一个扩展可以用于柱状图、饼图
 * @ignorei
 */

define('bui/chart/series/itemgroup',['bui/chart/baseseries'],function (require) {
  
  var BUI = require('bui/common'),
    Base = require('bui/chart/baseseries'),
    Util = require('bui/graphic').Util;

  /**
   * @class BUI.Chart.Series.ItemGroup
   * 包含数据序列子项的数据序列类,作为一个扩展可以用于柱状图、饼图
   */
  var Group = function(){

  };

  Group.ATTRS = {
    /**
     * 子项的配置信息
     * @type {Object}
     */
    item : {

    },
    /**
     * 存放子项的容器
     * @type {BUI.Graphic.Group}
     */
    group : {

    }
  }

  BUI.extend(Group,Base);

  BUI.augment(Group,{

    addItem : function(point,index){
      var _self = this,
        group = _self.get('group'),
        cfg;
      if(index == null){
        index = _self.getItems().length;
      }
      if(!group){
        group = _self.addGroup();
        _self.set('group',group);
      }

      cfg = _self.getItemCfg(point,index);
      if(_self.get('animate')){
        cfg.path = _self.pointToFactorPath(point,0);
      }else{
        cfg.path = _self.pointToPath(point);
      }

      var shape = group.addShape('path',cfg);
      
      shape.set('point',point);
      return shape;
    },
    /**
     * @protected
     * 获取子项的配置信息
     * @param  {Object} item 信息
     */
    getItemCfg : function(point,index){
      var _self = this,
        item = _self.get('item'),
        cfg = point.obj,
        rst = {};

      BUI.mix(rst,item);
      if(cfg && cfg.attrs){
        BUI.mix(rst,cfg.attrs);
      }
      return rst;
    },
    /**
     * 数据序列的子项
     * @return {Array} 子项集合
     */
    getItems : function(){
      return this.get('group').get('children');
    },
    /**
     * 生成动画
     * @protected
     */
    animateItems : function(callback){
      var _self = this,
        items = _self.getItems();

      Util.animStep(_self.get('duration'),function(factor){

        BUI.each(items,function(item){
          var point = item.get('point'),
            path = _self.pointToFactorPath(point,factor);
          item.attr('path',path);
        });
      },callback);
    },
    /**
     * 删除子项
     * @param  {BUI.Chart.Series.Item} item 子项
     */
    removeItem : function(item){
      var _self = this;
      _self.removeLabel(item);
      item.remove();
    },
    /**
     * @protected
     * 移除对应的label
     */
    removeLabel : function(item){
      var label = item.get('label');
      label && label.remove();
    },
    /**
     * @protected
     * 动画过程中根据比例获取path
     * @param  {Object} point  子项的节点信息
     * @param  {Number} factor 比例
     * @return {Array}  path
     */
    pointToFactorPath : function(point,factor){

    },
    /**
     * @protected
     * 获取path
     * @param  {Object} point  子项的节点信息
     * @return {Array}  path
     */
    pointToPath : function(point){
      return this.pointToFactorPath(point,1);
    }
  });


  return Group;
});