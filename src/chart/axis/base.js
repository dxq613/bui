/**
 * @fileOverview 坐标轴的基类
 * @ignore
 */

define('bui/chart/baseaxis',['bui/common','bui/graphic','bui/chart/abstractaxis'],function(require) {

    var BUI = require('bui/common'),
        Abstract = require('bui/chart/abstractaxis'),
        Util = require('bui/graphic').Util,
        CLS_AXIS = 'x-chart-axis';

    //是否在2个数之间
    function isBetween(x,x1,x2){
        if(x1 > x2){
            var temp = x2;
            x2 = x1;
            x1 = temp;
        }
        return x >= x1 && x <= x2;
    }

    /**
     * @class BUI.Chart.Axis
     * 坐标轴
     * @extends BUI.Chart.Axis.Abstract
     */
    function Axis(cfg){
        Axis.superclass.constructor.call(this,cfg);
    }

    Axis.ATTRS = {
        zIndex : {
            value : 4
        },
        /**
         * 距离初始位置的x轴偏移量,仅对于左侧、右侧的纵向坐标有效
         * @type {Number}
         */
        x : {

        },
        /**
         * 距离初始位置的y轴偏移量，仅对顶部、底部的横向坐标轴有效
         * @type {Number}
         */
        y : {

        },
        /**
         * 起始点
         * @type {Object}
         */
        start : {

        },
        /**
         * 终点
         * @type {Object}
         */
        end : {

        },
        /**
         * 起点终点的偏移量
         * @type {Number}
         */
        tickOffset : {
            value : 0
        },
        /**
         * 附加的样式
         * @type {String}
         */
        elCls : {
            value : CLS_AXIS
        },
        /**
         * 位置,此属性决定是横坐标还是纵坐标
         *
         * - top : 顶部的横向坐标轴
         * - bottrom : 底部的横向坐标轴
         * - left ：左侧纵向坐标轴
         * - right : 右侧纵向坐标轴
         * @type {String}
         */
        position : {
            value : 'bottom'
        },
        /**
         * 坐标轴线的配置信息,如果设置成null，则不显示轴线
         * @type {Object}
         */
        line : {
            value : {
                'stroke-width' : 1,
                'stroke' : '#C0D0E0'
            }
        },
        /**
         * 标注坐标线的配置
         * @type {Object}
         */
        tickLine : {
            value : {
                'stroke-width' : 1,
                'stroke' : '#C0D0E0',
                value : 5
            }
        }
       

    };

    BUI.extend(Axis,Abstract);


    BUI.augment(Axis,{

        //渲染控件前
        beforeRenderUI : function(){
            var _self = this,
                plotRange;
            Axis.superclass.beforeRenderUI.call(_self);
            plotRange = _self.get('plotRange');

            if(plotRange){
                var start = plotRange.start,
                    position = _self.get('position'),
                    end = {};
                if(_self.isVertical()){
                    if(position == 'left'){
                        end.y = plotRange.end.y;
                        end.x = start.x; 
                    }else{
                        start = {};
                        end = plotRange.end;
                        start.x = plotRange.end.x;
                        start.y = plotRange.start.y;
                    }
                    
                }else{
                    
                    end.x = plotRange.end.x;
                    end.y = start.y;
                }
                _self.set('start',start);
                _self.set('end',end);
            }

            _self.set('indexCache',{});
            _self.set('pointCache',[]);

        },
         /**
         * 改变坐标轴
         */
        change : function(info){
            var _self = this;
            if(_self.isChange(info.ticks)){
                _self._clearTicksInfo();
                _self.changeInfo(info);
                _self._processTicks(null,true);
                _self._changeTicks();
                _self._changeGrid();
                _self.resetLabels();
            }
        },
        /**
         * 坐标轴是否将要发生改变
         * @param  {Array}  ticks 新的坐标点
         * @return {Boolean}  是否发生改变
         */
        isChange : function(ticks){
          var _self = this,
              preTicks = _self.get('ticks');

          return  !BUI.Array.equals(ticks,preTicks);
        },
        /**
         * @protected
         * 更改信息
         */
        changeInfo : function(info){
            var _self = this;

            _self.set('ticks',info.ticks);
        },
        _clearTicksInfo : function(){
            var _self = this,
                grid = _self.get('grid'),
                labels = _self.get('labels');

            _self.set('pointCache',[]);
            _self.set('indexCache',[]);
            _self.set('tickItems',[]);

            if(grid){
                grid.items = [];
            }

            if(labels){
                labels.items = [];
            }

        },
        
        /**
         * 绘制坐标轴
         */
        paint : function(){
            var _self = this;
            _self._drawLines();
            _self._renderTicks();
            _self._renderGrid(); 
        },
        /**
         * 是否是纵坐标
         */
        isVertical : function(){
            var _self = this,
                isVertical = _self.get('isVertical'),
                position;
            if(isVertical != null){
                return isVertical;
            }
            position = _self.get('position');
            if(position == 'bottom' || position == 'top'){
                isVertical = false;
            }else{
                isVertical = true;
            }
            
            _self.set('isVertical',isVertical);
            return isVertical;
        },
        /**
         * 将指定的节点转换成对应的坐标点
         * @param  {*} value 数据值或者分类 
         * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
         */
        getOffset : function(value){
            var _self = this,
                ticks = _self.get('ticks'),
                index = BUI.Array.indexOf(value,ticks);

            return _self.getOffsetByIndex(index);
        },
        /**
         * 起点的坐标位置，也就是cavas上的点的位置
         * @return {Number} 坐标点的位置
         */
        getStartOffset : function(){
            return this._getStartCoord();
        },
        /**
         * 终点的坐标位置，也就是cavas上的点的位置
         * @return {Number} 坐标点的位置
         */
        getEndOffset : function(){
            return this._getEndCoord();
        },
        /**
         * 根据画板上的点获取坐标轴上的值，用于将cavas上的点的坐标转换成坐标轴上的坐标
         * @param  {Number} offset 
         * @return {Number} 点在坐标轴上的值
         */
        getValue : function(offset){
            var _self = this,
                startCoord = _self._getStartCoord(),
                endCoord = _self._getEndCoord();

            if(offset < startCoord || offset > endCoord){
                return NaN;
            }

            return _self.parseOffsetValue(offset);
        },
        /**
         * 获取坐标轴上起点代表的值
         * @return {*} 起点代表的值
         */
        getStartValue : function(){
            var _self = this,
                ticks = _self.get('ticks');
            return ticks[0];
        },
        /**
         * 获取坐标轴终点代表的值
         * @return {*} 终点代表的值
         */
        getEndValue : function(){
            var _self = this,
                ticks = _self.get('ticks');
            return ticks[ticks.length - 1];
        },

        
        getSnapIndex : function(offset){
            var _self = this,
                pointCache = _self.get('pointCache'),
                snap = Util.snapTo(pointCache,offset);;
            return BUI.Array.indexOf(snap,pointCache);
        },
        _appendEndOffset : function(offset){
            var _self = this,
                tickOffset = _self.get('tickOffset'),
                directfactor;
            
            if(typeof tickOffset !== "number"){
              tickOffset = tickOffset[0];
            }
            if(tickOffset){
                directfactor = _self._getDirectFactor();
                if(offset == 0){
                    offset = offset + tickOffset * directfactor;
                }else if(offset > 0){
                
                    offset = offset + tickOffset;
                }else{
                    offset = offset - tickOffset;
                }
            }
            return offset;
        },
        /**
         * 将指定的节点转换成对应的坐标点
         * @param  {Number} index 顺序 
         * @return {Number} 节点坐标点（单一坐标）x轴的坐标点或者y轴的坐标点
         */
        getOffsetByIndex : function(index){
            var _self = this,
                length = _self._getLength(),
                ticks = _self.get('ticks'),
                count = ticks.length,
                offset = (length / (count - 1)) * index;

            return _self._appendEndOffset(offset) + _self._getStartCoord();
        },
        //获取坐标轴上的节点位置
        getOffsetPoint : function(index,current){

            var _self = this,
                ortho = _self._getOrthoCoord(),
                indexCache = _self.get('indexCache'); //根据索引获取值的缓存，防止重复计算

            if(!current){
                if(indexCache[index] !== undefined){
                    current = indexCache[index];
                }else{
                    current = _self.getOffsetByIndex(index);
                    indexCache[index] = current;
                }
                
            }
            
            if(_self.isVertical()){
                return {
                    x : ortho,
                    y : current
                };
            }

            return {
                x : current,
                y : ortho
            };

        },
        /**
         * @protected
         * 获取显示坐标点的位置
         */
        getTickOffsetPoint : function(index){
            return this.getOffsetPoint(index);
        },
       
        //获取坐标轴开始的点
        _getStartCoord : function(){
            var _self = this,
                start = _self.get('start');
            if(_self.isVertical()){
                return start.y;
            }else{
                return start.x;
            }
        },
        //获取平行于坐标轴的点
        _getOrthoCoord : function(){
            var _self = this,
                start = _self.get('start');
            if(_self.isVertical()){
                return start.x;
            }else{
                return start.y;
            }
        },
        //获取坐标轴结束的点
        _getEndCoord : function(){
            var _self = this,
                end = _self.get('end');
            if(_self.isVertical()){
                return end.y;
            }else{
                return end.x;
            }
        },
        //获取中间点的位置
        _getMiddleCoord : function(){
            var _self = this,
                start = _self._getStartCoord(),
                length = _self._getLength();
            return start + _self._appendEndOffset(length/2);
        },
        /**
         * 获取坐标轴的长度
         * @return {Number} 坐标轴长度
         */
        getLength : function(){
            return Math.abs(this._getLength());
        },
        /**
         * 获取坐标点之间的长度
         * @return {Number} 坐标点之间的宽度
         */
        getTickAvgLength : function(){
            var _self = this,
                ticks = _self.get('ticks');
            return _self.getLength()/(ticks.length - 1);
        },
        //获取坐标轴内部的长度，不计算偏移量
        _getLength : function(){
            var _self = this,
                start = _self.get('start'),
                offset = _self.get('tickOffset'),
                end = _self.get('end'),
                length;

            if(typeof offset !== "number"){
              offset = offset[0] + offset[1];
            }else{
              offset = offset * 2;
            }

            if(_self.isVertical()){
                length = end.y - start.y;
            }else{
                length = end.x - start.x;
            }
            if(length > 0){
                length = length - offset;
            }else{
                length = length + offset;
            }
            return length;
        },
        /**
         * @protected
         * 获取坐标轴的path
         * @return {String|Array} path
         */
        getLinePath : function(){
            var _self = this,
                start = _self.get('start'),
                end = _self.get('end'),
                path = [];

            path.push(['M',start.x,start.y]);
            path.push(['L',end.x,end.y]);
            return path;
        },
        getTickEnd : function(start){
            var _self = this,
                lineAttrs = _self.get('tickLine'),
                factor = _self._getAlignFactor(),
                value = lineAttrs.value,
                rst = {};

            if(_self.isVertical()){
                rst.x2 = start.x1 + value * factor;
                rst.y2 = start.y1;
            }else {
                rst.x2 = start.x1;
                rst.y2 = start.y1 + value * factor;
            }
            return rst;
        },
        _changeTicks : function(){
            var _self = this,
                tickShape = _self.get('tickShape'),
                tickItems = _self.get('tickItems'),
                path = '';
            
            if(!tickShape){
                if(tickItems && tickItems.length){
                    _self._renderTicks();
                }
                return;
            }
            BUI.each(tickItems,function(item){
                var subPath = BUI.substitute('M{x1} {y1}L{x2} {y2}',item);
                path += subPath;
            });
            Util.animPath(tickShape,path,2);
        },

        //获取方向的系数，坐标轴方向跟浏览器的方向是否一致
        _getDirectFactor : function(){
            var _self = this,
                directfactor = _self.get('directfactor'),
                position,
                start,
                end;
            if(directfactor){
                return directfactor;
            }
            directfactor = 1;
            position = _self.get('position');
            start = _self.get('start');
            end = _self.get('end');
            //判断方向是否与坐标系方向一致
            if(position == 'bottom' || position == 'top'){
                if(start.x > end.x){
                    directfactor = -1;
                }
            }else{
                if(start.y > end.y){
                    directfactor = -1;
                }
            }

            _self.set('directfactor',directfactor);
            return directfactor;
        },
        //获取文本、坐标点线方向的因子
        _getAlignFactor : function(){
            var _self = this,
                factor = _self.get('factor'),
                position;
            if(factor){
                return factor;
            }
            position = _self.get('position');

            if(position == 'bottom' || position == 'right'){
                factor = 1;
            }else{
                factor = -1;
            }
            _self.set('factor',factor);
            return factor;
        },
        //渲染标题
        _renderTitle : function(){
            var _self = this,
                title = _self.get('title'),
                middle = _self._getMiddleCoord(),
                offsetPoint = _self.getOffsetPoint(null,middle),
                cfg = BUI.mix({},title);
            if(title.text){


                cfg.x = offsetPoint.x + (title.x || 0);
                cfg.y = offsetPoint.y + (title.y || 0);
                _self.addShape({
                    type : 'label',
                    elCls : CLS_AXIS + '-title',
                    attrs : cfg
                });
            }

        },
        /**
         * 获取栅格项的配置信息，一般是起始点信息
         * @protected
         */
        getGridItemCfg : function(offsetPoint){
            var _self = this,
                item = {},
                plotRange = _self.get('plotRange');

            item.x1 = offsetPoint.x;
            item.y1 = offsetPoint.y;
            if(_self.isVertical()){
                item.y2 = item.y1;
                item.x2 = plotRange.end.x;
            }else{
                item.x2 = item.x1;
                item.y2 = plotRange.end.y;
            }

            return item;

        },

        _changeGrid : function(){
            var _self = this,
                grid = _self.get('grid'),
                gridGroup;
            if(!grid){
                return;
            }
            gridGroup = _self.get('gridGroup');

            gridGroup && gridGroup.change(grid.items);
        },
        //移除控件前移除对应的grid和labels
        remove : function(){
            
            var _self = this,
                gridGroup = _self.get('gridGroup'),
                labelsGroup = _self.get('labelsGroup');
            gridGroup && gridGroup.remove();
            _self.removeLabels();
            Axis.superclass.remove.call(this);
        }
    });

    return Axis;
});
