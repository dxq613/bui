/**
 * @fileOverview 拖拽改变列的宽度
 * @ignore
 */

define('bui/grid/plugins/columnresize',function (require) {
  

  var BUI = require('bui/common'),
    NUM_DIS = 15,
    NUM_MIN = 30,
    STYLE_CURSOR = 'col-resize';

  var Resize = function(cfg){
    Resize.superclass.constructor.call(this,cfg);
  };

  Resize.ATTRS = {
    /**
     * @private
     * 是否正在拖拽
     * @type {Boolean}
     */
    resizing : {
      value : false
    },
    //拖拽属性
    draging : {

    }
  };

  BUI.extend(Resize,BUI.Base);

  BUI.augment(Resize,{

    renderUI : function(grid){
      this.set('grid',grid);
    },

    bindUI : function(grid){
      var _self = this,
        header = grid.get('header'),
        curCol,
        preCol,
        direction;

      header.get('el').delegate('.bui-grid-hd','mouseenter',function(ev){
        var resizing = _self.get('resizing');
        if(!resizing){
          var sender = ev.currentTarget;
          curCol = _self._getColumn(sender);
          preCol = _self._getPreCol(curCol);
        }
      }).delegate('.bui-grid-hd','mouseleave',function(ev){
        var resizing = _self.get('resizing');
        if(!resizing && curCol){
          curCol.get('el').css('cursor','');
          curCol = null; 
        }
      }).delegate('.bui-grid-hd','mousemove',function(ev){
        var resizing = _self.get('resizing');

        if(!resizing && curCol){
          var el = curCol.get('el'),
            pageX = ev.pageX,
            offset = el.offset(),
            left = offset.left,
            width = el.width();
            
          if(pageX - left < NUM_DIS && preCol){
            el.css('cursor',STYLE_CURSOR);
            direction = -1;
          }else if((left + width) - pageX < NUM_DIS){
            direction = 1;
            el.css('cursor',STYLE_CURSOR);
          }else{
            curCol.get('el').css('cursor','');
          }
        }

        if(resizing){
          ev.preventDefault();
          var draging = _self.get('draging'),
            start = draging.start,
            pageX = ev.pageX,
            dif = pageX - start,
            width = direction > 0 ? curCol.get('width') : preCol.get('width'),
            toWidth = width + dif;
          if(toWidth > NUM_MIN && toWidth < grid.get('el').width()){
            draging.end = pageX;
            _self.moveDrag(pageX);
          }
        }

      }).delegate('.bui-grid-hd','mousedown',function(ev){
        var resizing = _self.get('resizing');
        if(!resizing && curCol && curCol.get('el').css('cursor') == STYLE_CURSOR){
          ev.preventDefault();
          _self.showDrag(ev.pageX);
          bindDraging();
        }
      });

      function callback(ev){
        var draging = _self.get('draging')
        if(curCol && draging){
          var col = direction > 0 ? curCol : preCol,
            width = col.get('width'),
            dif = draging.end - draging.start;

          _self.hideDrag();
          if(grid.get('forceFit')){
            var originWidth = col.get('originWidth'),
              factor = width / originWidth,
              toWidth = (width + dif) / factor;
           // console.log(originWidth + ' ,'+width);
            col.set('originWidth',toWidth);
            col.set('width',toWidth);
            //

          }else{
            col.set('width',width + dif);
          }
          
        }    
        $(document).off('mouseup',callback);
      }

      function bindDraging(){
        $(document).on('mouseup',callback);
      }

    },
    //显示拖拽
    showDrag : function(pageX){
      var _self = this,
        grid = _self.get('grid'),
        header = grid.get('header'),
        bodyEl = grid.get('el').find('.bui-grid-body'),
        height = header.get('el').height() + bodyEl.height(),
        offset = header.get('el').offset(),
        dragEl = _self.get('dragEl');

      if(!dragEl){
        var  tpl = '<div class="bui-drag-line"></div>';
        dragEl = $(tpl).appendTo('body');
        _self.set('dragEl',dragEl);
      }

      dragEl.css({
        top: offset.top,
        left: pageX,
        height : height
      });

      _self.set('resizing',true);

      _self.set('draging',{
        start : pageX,
        end : pageX
      });
      dragEl.show();
    },
    //关闭拖拽
    hideDrag : function(){
      var _self = this,
        dragEl = _self.get('dragEl');
      dragEl && dragEl.hide();
      _self.set('draging',null);
      _self.set('resizing',false);
    },
    //移动drag
    moveDrag : function(pageX){
      var _self = this,
        dragEl = _self.get('dragEl');
      dragEl && dragEl.css('left',pageX);
    },
    //获取点击的列
    _getColumn : function(element){
      var _self = this,
        columns = _self.get('grid').get('columns'),
        rst = null;
      BUI.each(columns,function(column){
        if(column.containsElement(element)){
          rst = column;
          return false;
        }
      });

      return rst;
    },
    //获取前一个列
    _getPreCol : function(col){
      var _self = this,
        columns = _self.get('grid').get('columns'),
        rst = null;
      BUI.each(columns,function(column,index){
        if(column == col){
          return false;
        }else if(column.get('visible')){
          rst = column;
        }
        
      });

      return rst;
    }
  });

  return Resize;
});