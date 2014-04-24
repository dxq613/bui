/**
 * @fileOverview 表格的头部
 * @author dxq613@gmail.com, yiminghe@gmail.com
 * @ignore
 */

define('bui/grid/header',['bui/common','bui/grid/column'],function(require) {

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    Grid = BUI.namespace('Grid'),
    Column = require('bui/grid/column'),
    View = BUI.Component.View,
    Controller = BUI.Component.Controller,
    CLS_SCROLL_WITH = 17,
	  UA = BUI.UA;

  /**
  * 表格控件中表头的视图类
  * @class BUI.Grid.HeaderView
  * @extends BUI.Component.View
  * @private
  */
  var headerView = View.extend({

    /**
     * @see {Component.Render#getContentElement}
     * @ignore
     */
    getContentElement:function () {
      return this.get('el').find('tr');
    },
    scrollTo:function (obj) {
      var _self = this,
          el = _self.get('el');
      if (obj.top !== undefined) {
          el.scrollTop(obj.top);
      }
      if (obj.left !== undefined) {
          el.scrollLeft(obj.left);
      }
    },
    _uiSetTableCls : function(v){
      var _self = this,
        tableEl = _self.get('el').find('table');
      tableEl.attr('class',v);
    }
  }, {
    ATTRS:{
      emptyCellEl:{},
      tableCls : {

      }
    }
  },{
    xclass : 'header-view'
  });
  /**
   * Container which holds headers and is docked at the top or bottom of a Grid.
   * The HeaderContainer drives resizing/moving/hiding of columns within the GridView.
   * As headers are hidden, moved or resized,
   * the header container is responsible for triggering changes within the view.
   * If you are not in the writing plugins, don't direct manipulation this control.
   * @class BUI.Grid.Header
   * @protected
   * xclass:'grid-header'
   * @extends BUI.Component.Controller
   */
  var header = Controller.extend(
    {
      /**
       * add a columns to header
       * @param {Object|BUI.Grid.Column} c The column object or column config.
       * @index {Number} index The position of the column in a header,0 based.
       */
      addColumn:function (c, index) {
        var _self = this,
          insertIndex = index,
          columns = _self.get('columns');
        c = _self._createColumn(c);
        if (index === undefined) {
          index = columns.length;
          insertIndex = _self.get('children').length - 1;
        }
        columns.splice(index, 0, c);
        _self.addChild(c, insertIndex);
        _self.fire('add', {column:c, index:index});
        return c;
      },
      /**
       * remove a columns from header
       * @param {BUI.Grid.Column|Number} c is The column object or The position of the column in a header,0 based.
       */
      removeColumn:function (c) {
        var _self = this,
            columns = _self.get('columns'),
            index;
        c = BUI.isNumber(c) ? columns[c] : c;
        index = BUI.Array.indexOf(c, columns);
        columns.splice(index, 1);
        _self.fire('remove', {column:c, index:index});
        return _self.removeChild(c, true);
      },
      /**
       * For overridden.
       * @see Component.Controller#bindUI
       */
      bindUI:function () {
        var _self = this;
        _self._bindColumnsEvent();
      },
      /*
       * For overridden.
       * @protected
       *
       */
      initializer:function () {
        var _self = this,
            children = _self.get('children'),
            columns = _self.get('columns'),
            emptyColumn;
        $.each(columns, function (index,item) {
            var columnControl = _self._createColumn(item);
            children[index] = columnControl;
            columns[index] = columnControl;
        });
        //if(!_self.get('forceFit')){
          emptyColumn = _self._createEmptyColumn();
          children.push(emptyColumn);
          _self.set('emptyColumn',emptyColumn);
        //}
        
      },
      /**
       * get the columns of this header,the result equals the 'children' property .
       * @return {Array} columns
       * @example var columns = header.getColumns();
       *    <br>or<br>
       * var columns = header.get('children');
       */
      getColumns:function () {
        return this.get('columns');
      },
      /**
       * Obtain the sum of the width of all columns
       * @return {Number}
       */
      getColumnsWidth:function () {
        var _self = this,
          columns = _self.getColumns(),
          totalWidth = 0;

        $.each(columns, function (index,column) {
          if (column.get('visible')) {
            totalWidth += column.get('el').outerWidth();//column.get('width')
          }
        });
        return totalWidth;
      },
      getColumnOriginWidth : function(){
        var _self = this,
          columns = _self.getColumns(),
          totalWidth = 0;

        $.each(columns, function (index,column) {
          if (column.get('visible')) {
            var width = column.get('originWidth') || column.get('width');
            totalWidth += width;
          }
        });
        return totalWidth;
      },
      /**
       * get {@link BUI.Grid.Column} instance by index,when column moved ,the index changed.
       * @param {Number} index The index of columns
       * @return {BUI.Grid.Column} the column in the header,if the index outof the range,the result is null
       */
      getColumnByIndex:function (index) {
        var _self = this,
          columns = _self.getColumns(),
          result = columns[index];
        return result;
      },
      /**
       * 查找列
       * @param  {Function} func 匹配函数，function(column){}
       * @return {BUI.Grid.Column}  查找到的列
       */
      getColumn:function (func) {
        var _self = this,
          columns = _self.getColumns(),
          result = null;
        $.each(columns, function (index,column) {
          if (func(column)) {
              result = column;
              return false;
          }
        });
        return result;
      },
      /**
       * get {@link BUI.Grid.Column} instance by id,when column rendered ,this id can't to be changed
       * @param {String|Number}id The id of columns
       * @return {BUI.Grid.Column} the column in the header,if the index out of the range,the result is null
       */
      getColumnById:function (id) {
        var _self = this;
        return _self.getColumn(function(column){
          return column.get('id') === id;
        });
      },
      /**
       * get {@link BUI.Grid.Column} instance's index,when column moved ,the index changed.
       * @param {BUI.Grid.Column} column The instance of column
       * @return {Number} the index of column in the header,if the column not in the header,the index is -1
       */
      getColumnIndex:function (column) {
        var _self = this,
            columns = _self.getColumns();
        return BUI.Array.indexOf(column, columns);
      },
      /**
       * move the header followed by body's or document's scrolling
       * @param {Object} obj the scroll object which has two value:top(scrollTop),left(scrollLeft)
       */
      scrollTo:function (obj) {
        this.get('view').scrollTo(obj);
      },
      //when column's event fire ,this header must handle them.
      _bindColumnsEvent:function () {
        var _self = this;

        _self.on('afterWidthChange', function (e) {
          var sender = e.target;
          if (sender !== _self) {
              _self.setTableWidth();
          }
        });
        _self.on('afterVisibleChange', function (e) {
          var sender = e.target;
          if (sender !== _self) {
              _self.setTableWidth();
          }
        });
        _self.on('afterSortStateChange', function (e) {
          var sender = e.target,
            columns = _self.getColumns(),
            val = e.newVal;
          if (val) {
            $.each(columns, function (index,column) {
                if (column !== sender) {
                    column.set('sortState', '');
                }
            });
          }
        });

        _self.on('add',function(){
          _self.setTableWidth();
        });
        _self.on('remove',function(){
          _self.setTableWidth();
        });
      },
      //create the column control
      _createColumn:function (cfg) {
        if (cfg instanceof Column) {
          return cfg;
        }
        if (!cfg.id) {
          cfg.id = BUI.guid('col');
        }
        return new Column(cfg);
      },
      _createEmptyColumn:function () {
        return new Column.Empty();
      },
      //when set grid's height, scroll bar emerged.
      _isAllowScrollLeft:function () {
        var _self = this,
          parent = _self.get('parent');

        return parent && !!parent.get('height');
      },
      /**
       * force every column fit the table's width
       */
      forceFitColumns:function () {
          
        var _self = this,
          columns = _self.getColumns(),
          width = _self.get('width'),
          totalWidth = width,
          totalColumnsWidth = _self.getColumnOriginWidth(),
					realWidth = 0,
					appendWidth = 0,
					lastShowColumn = null,
          allowScroll = _self._isAllowScrollLeft();

				/**
				* @private
				*/
				function setColoumnWidthSilent(column,colWidth){
					var columnEl = column.get('el');
					column.set('width',colWidth , {
						silent:1
					});
					columnEl.width(colWidth);
				}
        //if there is not a width config of grid ,The forceFit action can't work
        if (width) {
          if (allowScroll) {
            width -= CLS_SCROLL_WITH;
            totalWidth = width;
          }

          var adjustCount = 0;

          $.each(columns, function (index,column) {
            if (column.get('visible') && column.get('resizable')) {
              adjustCount++;
            }
            if (column.get('visible') && !column.get('resizable')) {
              var colWidth = column.get('el').outerWidth();
              totalWidth -= colWidth;
              totalColumnsWidth -= colWidth;
            }
          });

          var colWidth = Math.floor(totalWidth / adjustCount),
              ratio = totalWidth / totalColumnsWidth;
          if(ratio ===1){
            return;
          }
          $.each(columns, function (index,column) {
            if (column.get('visible') && column.get('resizable')) {

              var borderWidth = _self._getColumnBorderWith(column,index),
                  originWidth = column.get('originWidth');
              if(!originWidth){
                  column.set('originWidth',column.get('width'));
                  originWidth = column.get('width');
              }
              colWidth = Math.floor((originWidth + borderWidth) * ratio);
                 /* parseInt(columnEl.css('border-left-width')) || 0 +
                      parseInt(columnEl.css('border-right-width')) || 0;*/
              // ！ note
              //
              // 会再调用 setTableWidth， 循环调用 || 
              setColoumnWidthSilent(column,colWidth - borderWidth);
							realWidth += colWidth;
							lastShowColumn = column;
            }
          });

					if(lastShowColumn){
						appendWidth = totalWidth - realWidth;
						setColoumnWidthSilent(lastShowColumn,lastShowColumn.get('width') + appendWidth);
					}

          _self.fire('forceFitWidth');
        }

      },
      _getColumnBorderWith : function(column,index){
        //chrome 下border-left-width取的值不小数，所以暂时使用固定边框
        //第一个边框无宽度，ie 下仍然存在Bug，所以做ie 的兼容
        var columnEl = column.get('el'),
          borderWidth = Math.round(parseFloat(columnEl.css('border-left-width')) || 0)  + 
               Math.round(parseFloat(columnEl.css('border-right-width')) || 0);
        
        borderWidth = UA.ie && UA.ie < 8 ? (index === 0 ? 1 : borderWidth) : borderWidth;
        return borderWidth;                   
      },
      /**
       * set the header's inner table's width
       */
      setTableWidth:function () {
        var _self = this,
          width = _self.get('width'),
          totalWidth = 0,
          emptyColumn = null;
        if(width == 'auto'){
          //_self.get('el').find('table').width()
          return;
        }
        if(_self.get('forceFit')) {
          _self.forceFitColumns();
        }else if(_self._isAllowScrollLeft()){
          totalWidth = _self.getColumnsWidth();
          emptyColumn = _self.get('emptyColumn');
          if(width < totalWidth){
              emptyColumn.get('el').width(CLS_SCROLL_WITH);
          }else{
              emptyColumn.get('el').width('auto');
          }
        }
      },
      //when header's width changed, it also effects its columns.
      _uiSetWidth:function () {
        var _self = this;
        _self.setTableWidth();
      },
      _uiSetForceFit:function (v) {
        var _self = this;
        if (v) {
          _self.setTableWidth();
        }
      }

    }, {
      ATTRS:
      {
        /**
         * 列集合
         * @type {Array}
         */
        columns:{
            value:[]
        },
        /**
         * @private
         */
        emptyColumn:{

        },
        /**
         * 是否可以获取焦点
         * @protected
         */
        focusable:{
            value:false
        },
        /**
         * true to force the columns to fit into the available width. Headers are first sized according to configuration, whether that be a specific width, or flex.
         * Then they are all proportionally changed in width so that the entire content width is used.
         * @type {Boolean}
         * @default 'false'
         */
        forceFit:{
            sync:false,
            view:true,
            value:false
        },
        /**
         * 表头的模版
         * @type {String}
         */
        tpl : {

          view : true,
          value : '<table cellspacing="0" class="' + PREFIX + 'grid-table" cellpadding="0">' +
          '<thead><tr></tr></thead>' +
          '</table>'
        },
        /**
         * 表格应用的样式.
         */
        tableCls:{
            view:true
        },
        /**
         * @private
         */
        xview:{
            value:headerView
        },
        /**
         * the collection of header's events
         * @type {Array}
         * @protected
         */
        events:{
          value:{
          /**
           * @event
           * 添加列时触发
           * @param {jQuery.Event} e the event object
           * @param {BUI.Grid.Column} e.column which column added
           * @param {Number} index the add column's index in this header
           *
           */
              'add' : false,
          /**
           * @event
           * 移除列时触发
           * @param {jQuery.Event} e the event object
           * @param {BUI.Grid.Column} e.column which column removed
           * @param {Number} index the removed column's index in this header
           */
              'remove' : false
          }
        } 
      }
    }, {
      xclass:'grid-header',
      priority:1
    });
  
  return header;
});