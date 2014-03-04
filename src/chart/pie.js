/**
 * @fileOverview 坐标轴的基类
 * @ignore
 */

define('bui/chart/pie',['bui/common','bui/chart/plotitem','bui/chart/activedgroup','bui/graphic'],function(require) {

  var BUI = require('bui/common'),
    Item = require('bui/chart/plotitem'),
    ActiveGroup = require('bui/chart/activedgroup'),
    Util = require('bui/graphic').Util;

  /**
   * @class BUI.Chart.Pie
   * 饼图
   * @extends BUI.Chart.PlotItem
   */
  function Pie(cfg){
    Pie.superclass.constructor.call(this,cfg);
  }

  Pie.ATTRS = {
    zIndex : {
      value : 4
    },
    /**
     * 显示饼图的数据表
     */
    data:{
      value:[]
    },
    /**
     * 标准以-90度方向开始。
     */
    baseRotate: {
      value : -90
    },
    /**
     * 饼图显示的10个基准色。
     */
    colors: {
      value:['#2f7ed1', '#0d2331', '#8bbc23', '#910001', '#1aadcd', '#492972','#f28f42', '#77a1e4', '#c42524', '#a6c96b']
    },
    /**
     * 饼图显示的10个划过色。
     */
    hoverColors: {
      value:['#4897F2', '#263C52', '#A4D531', '#AA1912', '#33C6E2', '#624282','#FFA85a', '#90BAFd', '#DD3E3d', '#BFE284']
    }
    

  };

  BUI.extend(Pie,Item);

  BUI.mixin(Pie,[ActiveGroup]);

  BUI.augment(Pie,{
    // beforeRtenderUI : function(){
    //   var _self = this;
    //   Pie.superclass.beforeRtenderUI.call(_self);
    // },
    renderUI : function(){
      var _self = this,
        data = _self.get('data');

      Pie.superclass.renderUI.call(_self);

      var initData = _self._initData(data);
      var pieData = _self._initPieData(initData);
      _self._drawPie(pieData);
      _self._getHighlight();
    },
    //初始化data，转换成json，顺便得到最大值。
    _initData : function(data){
      var _self = this,
        initData = [],
        max = 0;
      for(var i = 0 ; i < data.length ; i ++){
        var obj = {};
        if(data[i].length){
          obj.name = data[i][0];
          obj.y = data[i][1];
        }else{
          obj = data[i];
        }
        obj.index = i;
        max += obj.y;
        initData.push(obj);
      }
      _self.set('max',max);
      _self.set('initData',initData);
      return initData;
    },
    //初始化pieData,得到每个饼图的起始角度。
    _initPieData : function(data){
      var _self = this,
        pieData = [],
        max = _self.get('max'),
        baseRotate = _self.get('baseRotate'),
        startSum = 0;
      for(var i = 0 ; i < data.length ; i ++){
        var obj = {};
        obj.start = baseRotate+startSum/max*360;
        startSum += data[i].y;
        obj.end = baseRotate+startSum/max*360;
        pieData.push(obj);
      }
      _self.set('pieData',pieData);
      return pieData;
    },
    //根据pieData画饼图
    _drawPie : function(pieData){
      var _self = this,
        pieData = pieData || _self.get('pieData'),
        colors = _self.get('colors'),
        hoverColors = _self.get('hoverColors'),
        baseRotate = _self.get('baseRotate'),
        cx = _self.get('cx'),
        cy = _self.get('cy'),
        r = _self.get('r'),
        pieItems = [];


      for(var i = 0 ; i < pieData.length ; i ++){
        var pieItem = _self.addShape('path',_self._sector(cx, cy, r, baseRotate, baseRotate, {"fill":colors[i%colors.length],"stroke":"#fff","stroke-width":"1px"}));
        //var path = _self._sector(cx, cy, r, pieData[i].start, pieData[i].end).path;

        //pieItem.animate({path:path},500)

        
        

        pieItems.push(pieItem);

        
      }

      // (function(pieItem,i,pieObj){
      //   pieItem.on('mouseover',function(){
      //     pieItem.attr({"fill":hoverColors[i%colors.length]})
      //   }).on('mouseleave',function(){
      //     pieItem.attr({"fill":colors[i%colors.length]})
      //   }).on('click',function(){
      //     if(!pieItem.get('selected')){
      //       pieItem.set('selected',true);
      //       var angle = (pieObj.start+pieObj.end)/2,
      //         rad = Math.PI / 180,
      //         dr = 10,
      //         dx = dr * Math.cos(angle * rad);
      //         dy = dr * Math.sin(angle * rad);
      //       pieItem.animate({"transform":"t"+dx+","+dy},200);
      //     }else{
      //       pieItem.set('selected',false);
      //       pieItem.animate({"transform":"t0,0"},200);
      //     }
      //   });
      // })(pieItem,i,pieData[i]);

      var s = new Date().getTime();
      Util.animStep(2000,function(factor){
        for(var i = 0 ; i < pieItems.length ; i ++){
          var index = i;
          pieItem = pieItems[i];
          var curRotateStart = (pieData[index].start - baseRotate) * factor + baseRotate;
          var curRotateEnd = (pieData[index].end - baseRotate) * factor + baseRotate;
          path = _self._sector(cx, cy, r * factor, curRotateStart, curRotateEnd).path;
          pieItem.attr('path',path);
        }
      },function(){
        var e = new Date().getTime();
        console.log(e-s);
      });


      _self.set('pieItems',pieItems);
      return pieItems;
      
    },
    bindUI : function () {
      var _self = this,
        children = _self.get('children');
      _self.on('click',function (ev) {
        var target = ev.target,
          shape = target.shape;
        _self.setActived(shape);
      }).on('mousemove',function(){
        
      });
    },

    /**
     * @protected
     * 设置激活状态
     * @param {BUI.Chart.Actived} item 可以被激活的元素
     * @param {Boolean} actived 是否激活
     */
    setItemActived : function(item,actived){
      if(actived){
        item.attr('fill','blue');
        item.set('actived',true);
      }else{
        var fill = item.getCfgAttr('attrs').fill;
        item.attr('fill',fill);
        item.set('actived',false);
      }
    },
    /**
     * @protected
     * 是否激活
     * @param {BUI.Chart.Actived} item 可以被激活的元素
     * @return {BUI.Chart.Actived[]} 可以被激活的元素集合
     */
    isItemActived : function(item){
      return item.get('actived');
    },
    //根据pieData画饼图
    _sector : function(cx, cy, r, startAngle, endAngle, params) {
      var _self = this,
        rad = Math.PI / 180;
      var x1 = cx + r * Math.cos(startAngle * rad),
          x2 = cx + r * Math.cos(endAngle * rad),
          y1 = cy + r * Math.sin(startAngle * rad),
          y2 = cy + r * Math.sin(endAngle * rad);

      return BUI.mix({
        path:["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 1, x2, y2, "z"],
      },params);
    },
   
    // 获取高亮颜色
    _getHighlight : function(color) {
      var _self = this,
        r = _self.get('parent').get('el');
    }
  });

  return Pie;
});