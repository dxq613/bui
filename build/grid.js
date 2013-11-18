/*! BUI - v0.1.0 - 2013-11-18
* https://github.com/dxq613/bui
* Copyright (c) 2013 dxq613; Licensed MIT */
define('bui/grid',['bui/common','bui/grid/simplegrid','bui/grid/grid','bui/grid/column','bui/grid/header','bui/grid/format','bui/grid/plugins'],function (require) {

  var BUI = require('bui/common'),
    Grid = BUI.namespace('Grid');

  BUI.mix(Grid,{
    SimpleGrid : require('bui/grid/simplegrid'),
    Grid : require('bui/grid/grid'),
    Column : require('bui/grid/column'),
    Header : require('bui/grid/header'),
    Format : require('bui/grid/format'),
    Plugins : require('bui/grid/plugins')
  });

  return Grid;

});
define('bui/grid/simplegrid',['bui/common','bui/list'],function(require) {
  
  var BUI = require('bui/common'),
    List = require('bui/list'),
    Component = BUI.Component,
    UIBase = Component.UIBase,
    PREFIX = BUI.prefix,
    CLS_GRID = PREFIX + 'grid',
    CLS_GRID_ROW = CLS_GRID + '-row',
    CLS_ROW_ODD = PREFIX + 'grid-row-odd',
    CLS_ROW_EVEN = PREFIX + 'grid-row-even',
    CLS_GRID_BORDER = PREFIX + 'grid-border',
    CLS_ROW_FIRST = PREFIX + 'grid-row-first';


  /**
   * \u7b80\u5355\u8868\u683c\u7684\u89c6\u56fe\u7c7b
   * @class BUI.Grid.SimpleGridView
   * @extends BUI.List.SimpleListView
   * @private
   */
  var simpleGridView = List.SimpleListView.extend({
    /**
     * \u8bbe\u7f6e\u5217
     * @internal 
     * @param {Array} columns \u5217\u96c6\u5408
     */
    setColumns : function(columns){
      var _self = this,
        headerRowEl = _self.get('headerRowEl');

      columns = columns || _self.get('columns');
      //\u6e05\u7a7a\u8868\u5934
      headerRowEl.empty();

      BUI.each(columns,function(column){
        _self._createColumn(column,headerRowEl);
      });
    },
    //\u521b\u5efa\u5217
    _createColumn : function(column,parent){
      var _self = this,
        columnTpl = BUI.substitute(_self.get('columnTpl'),column);
      $(columnTpl).appendTo(parent);
    },
    /**
     * \u83b7\u53d6\u884c\u6a21\u677f
     * @ignore
     */
    getItemTpl : function  (record,index) {
      var _self = this,
          columns = _self.get('columns'),
          rowTpl = _self.get('rowTpl'),
          oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN,
          cellsTpl = [],
          rowEl;

      BUI.each(columns, function (column) {
          var dataIndex = column['dataIndex'];
          cellsTpl.push(_self._getCellTpl(column, dataIndex, record));
      });

      rowTpl = BUI.substitute(rowTpl,{cellsTpl:cellsTpl.join(''), oddCls:oddCls});
      return rowTpl;
    },
    //get cell template by config and record
    _getCellTpl:function (column, dataIndex, record) {
        var _self = this,
            renderer = column.renderer,
            text = renderer ? renderer(record[dataIndex], record) : record[dataIndex],
            cellTpl = _self.get('cellTpl');
        return BUI.substitute(cellTpl,{elCls : column.elCls,text:text});    
    },
    /**
     * \u6e05\u9664\u6570\u636e
     * @ignore
     */
    clearData : function(){
      var _self = this,
        tbodyEl = _self.get('itemContainer');
       tbodyEl.empty();
    },
    showData : function(data){

      var _self = this;
      BUI.each(data,function(record,index){
        _self._createRow(record,index);
      });
    },
    //\u8bbe\u7f6e\u5355\u5143\u683c\u8fb9\u6846
    _uiSetInnerBorder : function(v){
        var _self = this,
            el = _self.get('el');
        if(v){
            el.addClass(CLS_GRID_BORDER);
        }else{
            el.removeClass(CLS_GRID_BORDER);
        }
    },
    _uiSetTableCls : function(v){
      var _self = this,
        tableEl = _self.get('el').find('table');
      tableEl.attr('class',v);
    }
  },{
    ATTRS : {
      /**
       * @private
       * @ignore
       */
      headerRowEl : {
        valueFn :function(){
          var _self = this,
            thead = _self.get('el').find('thead');
          return thead.children('tr');
        }
      },
      /**
       * @private 
       * @ignore
       * @type {Object}
       */
      itemContainer :{
        valueFn :function(){
          return this.get('el').find('tbody');
        }
      },
      tableCls : {

      }
    }
  },{
    xclass:'simple-grid-veiw'
  });

  /**
   * \u7b80\u5355\u8868\u683c
   * xclass:'simple-grid'
   * <pre><code>
   *  BUI.use('bui/grid',function(Grid){
   *     
   *    var columns = [{
   *             title : '\u8868\u59341(10%)',
   *             dataIndex :'a',
   *             width:'10%'
   *           },{
   *             id: '123',
   *             title : '\u8868\u59342(20%)',
   *             dataIndex :'b',
   *             width:'20%'
   *           },{
   *             title : '\u8868\u59343(70%)',
   *             dataIndex : 'c',
   *             width:'70%'
   *         }],
   *         data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}];
   *
   *     var grid = new Grid.SimpleGrid({
   *       render:'#grid',
   *       columns : columns,
   *       items : data,
   *       idField : 'a'
   *     });
   *
   *     grid.render();
   *   });
   * </code></pre>
   * @class BUI.Grid.SimpleGrid
   * @extends BUI.List.SimpleList
   */
  var simpleGrid = BUI.List.SimpleList.extend(
  /**
   * @lends BUI.Grid.SimpleGrid.prototype
   * @ignore
   */
  {
    renderUI : function(){
      this.get('view').setColumns();
    },
    /**
     * \u7ed1\u5b9a\u4e8b\u4ef6
     * @protected
     */
    bindUI : function(){
      var _self = this,
        itemCls = _self.get('itemCls'),
        hoverCls = itemCls + '-hover',
        el = _self.get('el');

      el.delegate('.'+itemCls,'mouseover',function(ev){
        var sender = $(ev.currentTarget);
        sender.addClass(hoverCls);
      }).delegate('.'+itemCls,'mouseout',function(ev){
        var sender = $(ev.currentTarget);
        sender.removeClass(hoverCls);
      });
    },
    /**
     * \u663e\u793a\u6570\u636e
     * <pre><code>
     *   var data = [{},{}];
     *   grid.showData(data);
     *
     *   //\u7b49\u540c
     *   grid.set('items',data);
     * </code></pre>
     * @param  {Array} data \u8981\u663e\u793a\u7684\u6570\u636e
     */
    showData : function(data){
      this.clearData();
      //this.get('view').showData(data);
      this.set('items',data);
    },
    /**
     * \u6e05\u9664\u6570\u636e
     */
    clearData : function(){
      this.get('view').clearData();
    },
    _uiSetColumns : function(columns){
      var _self = this;

      //\u91cd\u7f6e\u5217\uff0c\u5148\u6e05\u7a7a\u6570\u636e
      _self.clearData();
      _self.get('view').setColumns(columns);
    }
  },{
    ATTRS : 
    /**
     * @lends BUI.Grid.SimpleGrid#
     * @ignore
     */
    {
      /**
       * \u8868\u683c\u53ef\u70b9\u51fb\u9879\u7684\u6837\u5f0f
       * @protected
       * @type {String}
       */
      itemCls : {
        view:true,
        value : CLS_GRID_ROW
      },
      /**
       * \u8868\u683c\u5e94\u7528\u7684\u6837\u5f0f\uff0c\u66f4\u6539\u6b64\u503c\uff0c\u5219\u4e0d\u5e94\u7528\u9ed8\u8ba4\u8868\u683c\u6837\u5f0f
       * <pre><code>
       * grid = new Grid.SimpleGrid({
       *   render:'#grid',
       *   columns : columns,
       *   innerBorder : false,
       *   tableCls:'table table-bordered table-striped', 
       *   store : store 
       * }); 
       * </code></pre>
       * @type {Object}
       */
      tableCls : {
        view : true,
        value : CLS_GRID + '-table'
      },
      /**
       * \u5217\u4fe1\u606f
       * @cfg {Array} columns
       */
      /**
       * \u5217\u4fe1\u606f\uff0c\u4ec5\u652f\u6301\u4ee5\u4e0b\u914d\u7f6e\u9879\uff1a
       * <ol>
       *   <li>title\uff1a\u6807\u9898</li>
       *   <li>elCls: \u5e94\u7528\u5230\u672c\u5217\u7684\u6837\u5f0f</li>
       *   <li>width\uff1a\u5bbd\u5ea6\uff0c\u6570\u5b57\u6216\u8005\u767e\u5206\u6bd4</li>
       *   <li>dataIndex: \u5b57\u6bb5\u540d</li>
       *   <li>renderer: \u6e32\u67d3\u51fd\u6570</li>
       * </ol>
       * \u5177\u4f53\u5b57\u6bb5\u7684\u89e3\u91ca\u6e05\u53c2\u770b \uff1a {@link BUI.Grid.Column}
       * @type {Array}
       */
      columns : {
        view : true,
        sync:false,
        value : []
      },
      /**
       * \u6a21\u677f
       * @protected
       */
      tpl:{
        view : true,
        value:'<table cellspacing="0" class="{tableCls}" cellpadding="0"><thead><tr></tr></thead><tbody></tbody></table>'
      },
      /**
       * \u5355\u5143\u683c\u5de6\u53f3\u4e4b\u95f4\u662f\u5426\u51fa\u73b0\u8fb9\u6846
       * <pre><code>
       * <pre><code>
       * grid = new Grid.SimpleGrid({
       *   render:'#grid',
       *   columns : columns,
       *   innerBorder : false,
       *   store : store 
       * }); 
       * </code></pre>
       * </code></pre>
       * @cfg {Boolean} [innerBorder=true]
       */
      /**
       * \u5355\u5143\u683c\u5de6\u53f3\u4e4b\u95f4\u662f\u5426\u51fa\u73b0\u8fb9\u6846
       * @type {Boolean}
       * @default true
       */
      innerBorder : {
          view:true,
          value : true
      },
      /**
       * \u884c\u6a21\u7248
       * @type {Object}
       */
      rowTpl:{
        view : true,
        value:'<tr class="' + CLS_GRID_ROW + ' {oddCls}">{cellsTpl}</tr>'
      },
      /**
       * \u5355\u5143\u683c\u7684\u6a21\u7248
       * @type {String}
       */
      cellTpl:{
        view:true,
        value:'<td class="' + CLS_GRID + '-cell {elCls}"><div class="' + CLS_GRID + '-cell-inner"><span class="' + CLS_GRID + '-cell-text">{text}</span></div></td>'
      },
      /**
       * \u5217\u7684\u914d\u7f6e\u6a21\u7248
       * @type {String}
       */
      columnTpl : {
        view:true,
        value : '<th class="' + CLS_GRID + '-hd {elCls}" width="{width}"><div class="' + CLS_GRID + '-hd-inner"><span class="' + CLS_GRID + '-hd-title">{title}</span></div></th>'
      },
      /**
       * @private
       */
      events :{ 

          value : {
            
          }
      },
      xview : {
        value : simpleGridView
      }
    }
  },{
    xclass:'simple-grid'
  });
  
  simpleGrid.View = simpleGridView;
  return  simpleGrid;
});
define('bui/grid/column',['bui/common'],function (require) {

    var	BUI = require('bui/common'),
        PREFIX = BUI.prefix,
		CLS_HD_TITLE = PREFIX + 'grid-hd-title',
        CLS_OPEN = PREFIX + 'grid-hd-open',
        SORT_PREFIX = 'sort-',
        SORT_ASC = 'ASC',
        SORT_DESC = 'DESC',
        CLS_TRIGGER = PREFIX + 'grid-hd-menu-trigger',
        CLS_HD_TRIGGER = 'grid-hd-menu-trigger';

    /**
    * \u8868\u683c\u5217\u7684\u89c6\u56fe\u7c7b
    * @class BUI.Grid.ColumnView
    * @extends BUI.Component.View
    * @private
    */
    var columnView = BUI.Component.View.extend({

		/**
		* @protected
        * @ignore
		*/
		setTplContent : function(attrs){
			var _self = this,
				sortTpl = _self.get('sortTpl'),
                triggerTpl = _self.get('triggerTpl'),
				el = _self.get('el'),
                titleEl;

			columnView.superclass.setTplContent.call(_self,attrs);
            titleEl = el.find('.' + CLS_HD_TITLE);
			$(sortTpl).insertAfter(titleEl);
            $(triggerTpl).insertAfter(titleEl);

		},
        //use template to fill the column
        _setContent:function () {
           this.setTplContent();
        },
        _uiSetShowMenu : function(v){
            var _self = this,
                triggerTpl = _self.get('triggerTpl'),
                el = _self.get('el'),
                titleEl = el.find('.' + CLS_HD_TITLE);
            if(v){
                $(triggerTpl).insertAfter(titleEl);
            }else{
                el.find('.' + CLS_TRIGGER).remove();
            }   
        },
        //set the title of column
        _uiSetTitle:function (title) {
            if (!this.get('rendered')) {
                return;
            }
            this._setContent();
        },
        //set the draggable of column
        _uiSetDraggable:function (v) {
            if (!this.get('rendered')) {
                return;
            }
            this._setContent();
        },
        //set the sortableof column
        _uiSetSortable:function (v) {

            if (!this.get('rendered')) {
                return;
            }
            this._setContent();
        },
        //set the template of column
        _uiSetTpl:function (v) {
            if (!this.get('rendered')) {
                return;
            }
            this._setContent();
        },
        //set the sort state of column
        _uiSetSortState:function (v) {
            var _self = this,
                el = _self.get('el'),
                method = v ? 'addClass' : 'removeClass',
                ascCls = SORT_PREFIX + 'asc',
                desCls = SORT_PREFIX + 'desc';
            el.removeClass(ascCls + ' ' + desCls);
            if (v === 'ASC') {
                el.addClass(ascCls);
            } else if (v === 'DESC') {
                el.addClass(desCls);
            }
        },
        //\u5c55\u5f00\u8868\u5934
        _uiSetOpen : function (v) {
            var _self = this,
                el = _self.get('el');
            if(v){
                el.addClass(CLS_OPEN);
            }else{
                el.removeClass(CLS_OPEN);
            }
        }
    }, {
        ATTRS:{
            
            /**
             * @private
             */
            sortTpl : {
                view: true,
                getter: function(){
                    var _self = this,
                        sortable = _self.get('sortable');
                    if(sortable){
                        return '<span class="' + PREFIX + 'grid-sort-icon">&nbsp;</span>';
                    }
                    return '';
                }
            },
            tpl:{
            }
        }
    });

    /**
     * \u8868\u683c\u7684\u5217\u5bf9\u8c61\uff0c\u5b58\u50a8\u5217\u4fe1\u606f\uff0c\u6b64\u5bf9\u8c61\u4e0d\u4f1a\u7531\u7528\u6237\u521b\u5efa\uff0c\u800c\u662f\u914d\u7f6e\u5728Grid\u4e2d
     * xclass:'grid-column'
     * <pre><code>
     * columns = [{
     *        title : '\u8868\u59341',
     *        dataIndex :'a',
     *        width:100
     *      },{
     *        title : '\u8868\u59342',
     *        dataIndex :'b',
     *        visible : false, //\u9690\u85cf
     *        width:200
     *      },{
     *        title : '\u8868\u59343',
     *        dataIndex : 'c',
     *        width:200
     *    }];
     * </code></pre>
     * @class BUI.Grid.Column
     * @extends BUI.Component.Controller
     */
    var column = BUI.Component.Controller.extend(
        /**
         * @lends BUI.Grid.Column.prototype
         * @ignore
         */
        {    //toggle sort state of this column ,if no sort state set 'ASC',else toggle 'ASC' and 'DESC'
            _toggleSortState:function () {
                var _self = this,
                    sortState = _self.get('sortState'),
                    v = sortState ? (sortState === SORT_ASC ? SORT_DESC : SORT_ASC) : SORT_ASC;
                _self.set('sortState', v);
            },
            /**
             * {BUI.Component.Controller#performActionInternal}
             * @ignore
             */
            performActionInternal:function (ev) {
                var _self = this,
                    sender = $(ev.target),
                    prefix = _self.get('prefixCls');
                if (sender.hasClass(prefix + CLS_HD_TRIGGER)) {

                } else {
                    if (_self.get('sortable')) {
                        _self._toggleSortState();
                    }
                }
                //_self.fire('click',{domTarget:ev.target});
            },
            _uiSetWidth : function(v){
                if(v){
                    this.set('originWidth',v);
                }
            }
        }, {
            ATTRS:
            /*** 
            * @lends BUI.Grid.Column.prototype 
            * @ignore
            */
            {
                /**
                 * The tag name of the rendered column
                 * @private
                 */
                elTagName:{
                    value:'th'
                },
                /**
                 * \u8868\u5934\u5c55\u5f00\u663e\u793a\u83dc\u5355\uff0c
                 * @type {Boolean}
                 * @protected
                 */
                open : {
                    view : true,
                    value : false
                },
                /**
                 * \u6b64\u5217\u5bf9\u5e94\u663e\u793a\u6570\u636e\u7684\u5b57\u6bb5\u540d\u79f0
                 * <pre><code>
                 * {
                 *     title : '\u8868\u59341',
                 *     dataIndex :'a', //\u5bf9\u5e94\u7684\u6570\u636e\u7684\u5b57\u6bb5\u540d\u79f0\uff0c\u5982 \uff1a {a:'123',b:'456'}
                 *     width:100
                 * }
                 * </code></pre>
                 * @cfg {String} dataIndex
                 */
                /**
                 * \u6b64\u5217\u5bf9\u5e94\u663e\u793a\u6570\u636e\u7684\u5b57\u6bb5\u540d\u79f0
                 * @type {String}
                 * @default {String} empty string
                 */
                dataIndex:{
                    view:true,
                    value:''
                },
                /**
                 * \u662f\u5426\u53ef\u62d6\u62fd\uff0c\u6682\u65f6\u672a\u652f\u6301
                 * @private
                 * @type {Boolean}
                 * @defalut true
                 */
                draggable:{
					sync:false,
                    view:true,
                    value:true
                },
                /**
                 * \u7f16\u8f91\u5668,\u7528\u4e8e\u53ef\u7f16\u8f91\u8868\u683c\u4e2d<br>
                 * ** \u5e38\u7528\u7f16\u8f91\u5668 **
                 *  - xtype \u6307\u7684\u662f\u8868\u5355\u5b57\u6bb5\u7684\u7c7b\u578b {@link BUI.Form.Field}
                 *  - \u5176\u4ed6\u7684\u914d\u7f6e\u9879\u5bf9\u5e94\u4e8e\u8868\u5355\u5b57\u6bb5\u7684\u914d\u7f6e\u9879
                 * <pre><code>
                 * columns = [
                 *   {title : '\u6587\u672c',dataIndex :'a',editor : {xtype : 'text'}}, 
                 *   {title : '\u6570\u5b57', dataIndex :'b',editor : {xtype : 'number',rules : {required : true}}},
                 *   {title : '\u65e5\u671f',dataIndex :'c', editor : {xtype : 'date'},renderer : Grid.Format.dateRenderer},
                 *   {title : '\u5355\u9009',dataIndex : 'd', editor : {xtype :'select',items : enumObj},renderer : Grid.Format.enumRenderer(enumObj)},
                 *   {title : '\u591a\u9009',dataIndex : 'e', editor : {xtype :'select',select:{multipleSelect : true},items : enumObj},
                 *       renderer : Grid.Format.multipleItemsRenderer(enumObj)
                 *   }
                 * ]
                 * </code></pre>
                 * @type {Object}
                 */
                editor:{

                },
                /**
                 * \u662f\u5426\u53ef\u4ee5\u83b7\u53d6\u7126\u70b9
                 * @protected
                 */
                focusable:{
                    value:false
                },
                /**
                 * \u56fa\u5b9a\u5217,\u4e3b\u8981\u7528\u4e8e\u5728\u9996\u884c\u663e\u793a\u4e00\u4e9b\u7279\u6b8a\u5185\u5bb9\uff0c\u5982\u5355\u9009\u6846\uff0c\u590d\u9009\u6846\uff0c\u5e8f\u53f7\u7b49\u3002\u63d2\u4ef6\u4e0d\u80fd\u5bf9\u6b64\u5217\u8fdb\u884c\u7279\u6b8a\u64cd\u4f5c\uff0c\u5982\uff1a\u79fb\u52a8\u4f4d\u7f6e\uff0c\u9690\u85cf\u7b49
                 * @cfg {Boolean} fixed
                 */
                fixed : {
                    value : false
                },
                /**
                 * \u63a7\u4ef6\u7684\u7f16\u53f7
                 * @cfg {String} id
                 */
                id:{

                },
                /**
                 * \u6e32\u67d3\u8868\u683c\u5355\u5143\u683c\u7684\u683c\u5f0f\u5316\u51fd\u6570
                 * "function(value,obj,index){return value;}"
                 * <pre><code>
                 * {title : '\u64cd\u4f5c',renderer : function(){
                 *     return '<span class="grid-command btn-edit">\u7f16\u8f91</span>'
                 *   }}
                 * </code></pre>
                 * @cfg {Function} renderer
                 */
                renderer:{

                },
                /**
                 * \u662f\u5426\u53ef\u4ee5\u8c03\u6574\u5bbd\u5ea6\uff0c\u5e94\u7528\u4e8e\u62d6\u62fd\u6216\u8005\u81ea\u9002\u5e94\u5bbd\u5ea6\u65f6
                 * @type {Boolean}
                 * @protected
                 * @default true
                 */
                resizable:{
                    value:true
                },
                /* \u662f\u5426\u53ef\u4ee5\u6309\u7167\u6b64\u5217\u6392\u5e8f\uff0c\u5982\u679c\u8bbe\u7f6etrue,\u90a3\u4e48\u70b9\u51fb\u5217\u5934\u65f6
                 * <pre><code>
                 *     {title : '\u6570\u5b57', dataIndex :'b',sortable : false},
                 * </code></pre>
                 * @cfg {Boolean} [sortable=true]
                 */
                sortable:{
					sync:false,
                    view:true,
                    value:true
                },
                /**
                 * \u6392\u5e8f\u72b6\u6001\uff0c\u5f53\u524d\u6392\u5e8f\u662f\u6309\u7167\u5347\u5e8f\u3001\u964d\u5e8f\u3002\u67093\u79cd\u503c null, 'ASC','DESC'
                 * @type {String}
                 * @protected
                 * @default null
                 */
                sortState:{
                    view:true,
                    value:null
                },
                /**
                 * \u5217\u6807\u9898
                 * @cfg {String} [title=&#160;]
                 */
                /**
                 * \u5217\u6807\u9898
                 * <pre><code>
                 * var column = grid.findColumn('id');
                 * column.get('title');
                 * </code></pre>
                 * Note: to have a clickable header with no text displayed you can use the default of &#160; aka &nbsp;.
                 * @type {String}
                 * @default {String} &#160;
                 */
                title:{
					sync:false,
                    view:true,
                    value:'&#160;'
                },

                /**
                 * \u5217\u7684\u5bbd\u5ea6,\u53ef\u4ee5\u4f7f\u6570\u5b57\u6216\u8005\u767e\u5206\u6bd4,\u4e0d\u8981\u4f7f\u7528 width : '100'\u6216\u8005width : '100px'
                 * <pre><code>
                 *  {title : '\u6587\u672c',width:100,dataIndex :'a',editor : {xtype : 'text'}}
                 *  
                 *  {title : '\u6587\u672c',width:'10%',dataIndex :'a',editor : {xtype : 'text'}}
                 * </code></pre>
                 * @cfg {Number} [width = 80]
                 */
                
                /**
                 * \u5217\u5bbd\u5ea6
                 * <pre><code>
                 *  grid.findColumn(id).set('width',200);
                 * </code></pre>
                 * 
                 * @type {Number}
                 */
                width:{
                    value:100
                },
                /**
                 * \u662f\u5426\u663e\u793a\u83dc\u5355
                 * @cfg {Boolean} [showMenu=false]
                 */
                /**
                 * \u662f\u5426\u663e\u793a\u83dc\u5355
                 * @type {Boolean}
                 * @default false
                 */
                showMenu:{
                    view:true,
                    value:false
                },
                /**
                 * @private
                 * @type {Object}
                 */
                triggerTpl:{
					view:true,
                    value:'<span class="' + CLS_TRIGGER + '"></span>'
                    
                },
                /**
                 * An template used to create the internal structure inside this Component's encapsulating Element.
                 * User can use the syntax of KISSY 's template component.
                 * Only in the configuration of the column can set this property.
                 * @type {String}
                 */
                tpl:{
					sync:false,
                    view:true,
                    value:'<div class="' + PREFIX + 'grid-hd-inner">' +
                        '<span class="' + CLS_HD_TITLE + '">{title}</span>' +
                        '</div>'
                },
                /**
                 * \u5355\u5143\u683c\u7684\u6a21\u677f\uff0c\u5728\u5217\u4e0a\u8bbe\u7f6e\u5355\u5143\u683c\u7684\u6a21\u677f\uff0c\u53ef\u4ee5\u5728\u6e32\u67d3\u5355\u5143\u683c\u65f6\u4f7f\u7528\uff0c\u66f4\u6539\u5355\u5143\u683c\u7684\u5185\u5bb9
                 * @cfg {String} cellTpl
                 */
                /**
                 * \u5355\u5143\u683c\u7684\u6a21\u677f\uff0c\u5728\u5217\u4e0a\u8bbe\u7f6e\u5355\u5143\u683c\u7684\u6a21\u677f\uff0c\u53ef\u4ee5\u5728\u6e32\u67d3\u5355\u5143\u683c\u65f6\u4f7f\u7528\uff0c\u66f4\u6539\u5355\u5143\u683c\u7684\u5185\u5bb9
                 * @type {String}
                 */
                cellTpl:{
                    value:''
                },
                /**
                 * the collection of column's events
                 * @protected
                 * @type {Array}
                 */
                events:{
                    value:{
                    /**
                     * @event
                     * Fires when this column's width changed
                     * @param {jQuery.Event} e the event object
                     * @param {BUI.Grid.Column} target
                     */
                        'afterWidthChange' : true,
                    /**
                     * @event
                     * Fires when this column's sort changed
                     * @param {jQuery.Event} e the event object
                     * @param {BUI.Grid.Column} e.target
                     */
                        'afterSortStateChange' : true,
                    /**
                     * @event
                     * Fires when this column's hide or show
                     * @param {jQuery.Event} e the event object
                     * @param {BUI.Grid.Column} e.target
                     */
                        'afterVisibleChange' : true,
                    /**
                     * @event
                     * Fires when use clicks the column
                     * @param {jQuery.Event} e the event object
                     * @param {BUI.Grid.Column} e.target
                     * @param {HTMLElement} domTarget the dom target of this event
                     */
                        'click' : true,
                    /**
                     * @event
                     * Fires after the component is resized.
                     * @param {BUI.Grid.Column} target
                     * @param {Number} adjWidth The box-adjusted width that was set
                     * @param {Number} adjHeight The box-adjusted height that was set
                     */
                        'resize' : true,
                    /**
                     * @event
                     * Fires after the component is moved.
                     * @param {jQuery.Event} e the event object
                     * @param {BUI.Grid.Column} e.target
                     * @param {Number} x The new x position
                     * @param {Number} y The new y position
                     */
                        'move' : true
                    }
                },
                /**
                 * @private
                 */
                xview:{
                    value:columnView
                }

            }
        }, {
            xclass:'grid-hd',
            priority:1
        });

    column.Empty = column.extend({

    }, {
        ATTRS:{
            type:{
                value:'empty'
            },
            sortable:{
                view:true,
                value:false
            },
            width:{
                view:true,
                value:null
            },
            tpl:{
                view:true,
                value:'<div class="' + PREFIX + 'grid-hd-inner"></div>'
            }
        }
    }, {
        xclass:'grid-hd-empty',
        priority:1
    });

    return column;

});
	

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
  * \u8868\u683c\u63a7\u4ef6\u4e2d\u8868\u5934\u7684\u89c6\u56fe\u7c7b
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
    /**
     * @lends BUI.Grid.Header.prototype
     * @ignore
     */
    {
      /**
       * add a columns to header
       * @param {Object|BUI.Grid.Column} c The column object or column config.
       * @index {Number} index The position of the column in a header,0 based.
       */
      addColumn:function (c, index) {
        var _self = this,
          insertIndex = 0,
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
            emptyColumn = _self._createEmptyColumn();
        $.each(columns, function (index,item) {
            var columnControl = _self._createColumn(item);
            children[index] = columnControl;
            columns[index] = columnControl;
        });
        children.push(emptyColumn);
        _self.set('emptyColumn',emptyColumn);
      },
      /**
       * get the columns of this header,the result equals the 'children' property .
       * @return {Array} columns
       * @example var columns = header.getColumns();
       *    <br>or</br>
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
       * \u67e5\u627e\u5217
       * @param  {Function} func \u5339\u914d\u51fd\u6570\uff0cfunction(column){}
       * @return {BUI.Grid.Column}  \u67e5\u627e\u5230\u7684\u5217
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
              // \uff01 note
              //
              // \u4f1a\u518d\u8c03\u7528 setTableWidth\uff0c \u5faa\u73af\u8c03\u7528 || 
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
        //chrome \u4e0bborder-left-width\u53d6\u7684\u503c\u4e0d\u5c0f\u6570\uff0c\u6240\u4ee5\u6682\u65f6\u4f7f\u7528\u56fa\u5b9a\u8fb9\u6846
        //\u7b2c\u4e00\u4e2a\u8fb9\u6846\u65e0\u5bbd\u5ea6\uff0cie \u4e0b\u4ecd\u7136\u5b58\u5728Bug\uff0c\u6240\u4ee5\u505aie \u7684\u517c\u5bb9
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
        if (_self.get('forceFit')) {
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
      /** 
      * @lends BUI.Grid.Header.prototype
      * @ignore
      * */
      {
        /**
         * \u5217\u96c6\u5408
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
         * \u662f\u5426\u53ef\u4ee5\u83b7\u53d6\u7126\u70b9
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
         * \u8868\u5934\u7684\u6a21\u7248
         * @type {String}
         */
        tpl : {

          view : true,
          value : '<table cellspacing="0" class="' + PREFIX + 'grid-table" cellpadding="0">' +
          '<thead><tr></tr></thead>' +
          '</table>'
        },
        /**
         * \u8868\u683c\u5e94\u7528\u7684\u6837\u5f0f.
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
           * \u6dfb\u52a0\u5217\u65f6\u89e6\u53d1
           * @param {jQuery.Event} e the event object
           * @param {BUI.Grid.Column} e.column which column added
           * @param {Number} index the add column's index in this header
           *
           */
              'add' : false,
          /**
           * @event
           * \u79fb\u9664\u5217\u65f6\u89e6\u53d1
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
define('bui/grid/grid',['bui/common','bui/mask','bui/toolbar','bui/list','bui/grid/header','bui/grid/column'],function (require) {

  var BUI = require('bui/common'),
    Mask = require('bui/mask'),
    UA = BUI.UA,
    Component = BUI.Component,
    toolbar = require('bui/toolbar'),
    List = require('bui/list'),
    Header = require('bui/grid/header'),
    Column = require('bui/grid/column');

  function isPercent(str){
    if(BUI.isString(str)){
      return str.indexOf('%') !== -1;
    }
    return false;
  }

  var PREFIX = BUI.prefix,
    CLS_GRID_HEADER_CONTAINER = PREFIX + 'grid-header-container',
    CLS_GRID_BODY = PREFIX + 'grid-body',
    CLS_GRID_WITH = PREFIX + 'grid-width',
    CLS_GRID_HEIGHT = PREFIX + 'grid-height',
    CLS_GRID_BORDER = PREFIX + 'grid-border',
    CLS_GRID_TBAR = PREFIX + 'grid-tbar',
    CLS_GRID_BBAR = PREFIX + 'grid-bbar',
    CLS_BUTTON_BAR= PREFIX + 'grid-button-bar',
    CLS_GRID_STRIPE = PREFIX + 'grid-strip',
    CLS_GRID_ROW = PREFIX + 'grid-row',
    CLS_ROW_ODD = PREFIX + 'grid-row-odd',
    CLS_ROW_EVEN = PREFIX + 'grid-row-even',
    CLS_ROW_FIRST = PREFIX + 'grid-row-first',
    CLS_GRID_CELL = PREFIX + 'grid-cell',
    CLS_GRID_CELL_INNER = PREFIX + 'grid-cell-inner',
    CLS_TD_PREFIX = 'grid-td-',
    CLS_CELL_TEXT = PREFIX + 'grid-cell-text',
    CLS_CELL_EMPTY = PREFIX + 'grid-cell-empty',
    CLS_SCROLL_WITH = '17',
    CLS_HIDE = PREFIX + 'hidden',
    ATTR_COLUMN_FIELD = 'data-column-field',
    WIDTH_BORDER = 2,
    HEIGHT_BAR_PADDING = 1;  

  function getInnerWidth(width){
    var _self = this;
      if(BUI.isNumber(width)){
        width -= WIDTH_BORDER;
      }
      return width;
  }

  /**
   * @class BUI.Grid.GridView
   * @private
   * @extends BUI.List.SimpleListView
   * \u8868\u683c\u7684\u89c6\u56fe\u5c42
   */
  var gridView = List.SimpleListView.extend({

    //\u8bbe\u7f6e body\u548ctable\u7684\u6807\u7b7e
    renderUI : function(){
      var _self = this,
        el = _self.get('el'),
        bodyEl = el.find('.' + CLS_GRID_BODY);
      _self.set('bodyEl',bodyEl);
      _self._setTableTpl();
    },
    /**
     * \u83b7\u53d6\u884c\u6a21\u677f
     * @ignore
     */
    getItemTpl : function  (record,index) {
      var _self = this,
        columns =  _self._getColumns(),
        tbodyEl = _self.get('tbodyEl'),
        rowTpl = _self.get('rowTpl'),
        oddCls = index % 2 === 0 ? CLS_ROW_ODD : CLS_ROW_EVEN,
        cellsTpl = [],
        rowEl;

      BUI.each(columns, function (column) {
        var dataIndex = column.get('dataIndex');
        cellsTpl.push(_self._getCellTpl(column, dataIndex, record,index));
      });

      if(_self.get('useEmptyCell')){
        cellsTpl.push(_self._getEmptyCellTpl());
      }

      rowTpl = BUI.substitute(rowTpl,{cellsTpl:cellsTpl.join(''), oddCls:oddCls});
      return rowTpl;
    },
    /**
     * find the dom by the record in this component
     * @param {Object} record the record used to find row dom
     * @return jQuery
     */
    findRow:function (record) {
        var _self = this;
        return $(_self.findElement(record));
    },
    /**
     * find the cell dom by record and column id
     * @param {String} id the column id
     * @param {jQuery} rowEl the dom that showed in this component
     * @return  {jQuery}
     */
    findCell : function(id,rowEl){
      var cls = CLS_TD_PREFIX + id;
        return rowEl.find('.' + cls);
    },
    /**
     * \u91cd\u65b0\u521b\u5efa\u8868\u683c\u7684\u9996\u884c\uff0c\u4e00\u822c\u5728\u8868\u683c\u521d\u59cb\u5316\u5b8c\u6210\u540e\uff0c\u6216\u8005\u5217\u53d1\u751f\u6539\u53d8\u65f6
     */
    resetHeaderRow:function () {
      if(!this.get('useHeaderRow')){
        return;
      }
      var _self = this,
        headerRowEl = _self.get('headerRowEl'),
        tbodyEl = _self.get('tbodyEl');
      if(headerRowEl){
        headerRowEl.remove();
      }
      headerRowEl = _self._createHeaderRow();
      headerRowEl.prependTo(tbodyEl);
      _self.set('headerRowEl', headerRowEl);
    },
    /**
     * when header's column width changed, column in this component changed followed
     * @ignore
     */
    resetColumnsWidth:function (column,width) {
      var _self = this,
        headerRowEl = _self.get('headerRowEl'),
        cell = _self.findCell(column.get('id'), headerRowEl);
      width = width || column.get('width');
      if (cell) {
        cell.width(width);
      }
      _self.setTableWidth();
    },
    //set table width
    setTableWidth:function (columnsWidth) {
      if(!columnsWidth && isPercent(this.get('width'))){
        this.get('tableEl').width('100%');
        return;
      }
      var _self = this,
        width = _self._getInnerWidth(),
        height = _self.get('height'),
        tableEl = _self.get('tableEl'),
        forceFit = _self.get('forceFit'),
        headerRowEl = _self.get('headerRowEl');
      //\u4f7f\u7528\u767e\u5206\u6bd4\u7684\u5bbd\u5ea6\uff0c\u4e0d\u8fdb\u884c\u8ba1\u7b97
      if(!isPercent(columnsWidth)){
        
        columnsWidth = columnsWidth || _self._getColumnsWidth();
        if (!width) {
          return;
        }
        if (width >= columnsWidth) {
          columnsWidth = width;
          if (height) {
            var scrollWidth = (UA.ie == 6 || UA.ie == 7) ? CLS_SCROLL_WITH + 2 : CLS_SCROLL_WITH;
            columnsWidth = width - scrollWidth;
          }
        }
      }
      
      tableEl.width(columnsWidth);
    },
    /**
     * \u8868\u683c\u8868\u4f53\u7684\u5bbd\u5ea6
     * @param {Number} width \u5bbd\u5ea6
     */
    setBodyWidth : function(width){
      var _self = this,
        bodyEl = _self.get('bodyEl');
      width = width || _self._getInnerWidth();
      bodyEl.width(width);

    },
    /**
     * \u8bbe\u7f6e\u8868\u4f53\u9ad8\u5ea6
     * @param {Number} height \u9ad8\u5ea6
     */
    setBodyHeight : function(height){
      var _self = this,
        bodyEl = _self.get('bodyEl'),
        bodyHeight = height,
        siblings = bodyEl.siblings();

      BUI.each(siblings,function(item){
        if($(item).css('display') !== 'none'){
          bodyHeight -= $(item).outerHeight();
        }
      });
      bodyEl.height(bodyHeight);
    },
    //show or hide column
    setColumnVisible:function (column) {
      var _self = this,
        hide = !column.get('visible'),
        colId = column.get('id'),
        tbodyEl = _self.get('tbodyEl'),
        cells = $('.' + CLS_TD_PREFIX + colId,tbodyEl);
      if (hide) {
        cells.hide();
      } else {
        cells.show();
      }
    },
    /**
     * \u66f4\u65b0\u6570\u636e
     * @param  {Object} record \u66f4\u65b0\u7684\u6570\u636e
     */
    updateItem : function(record){
      var _self = this, 
        items = _self.getItems(),
        index = BUI.Array.indexOf(record,items),
        columns = _self._getColumns(),
        element = null,
        tpl;
      if(index >=0 ){
        element = _self.findElement(record);

        BUI.each(columns,function(column){
          var cellEl = _self.findCell(column.get('id'),$(element)),
            innerEl = cellEl.find('.' + CLS_GRID_CELL_INNER),
            textTpl = _self._getCellText(column,record,index);
          innerEl.html(textTpl);
        });
        return element;
      }
    },
    /**
     * \u663e\u793a\u6ca1\u6709\u6570\u636e\u65f6\u7684\u63d0\u793a\u4fe1\u606f
     */
    showEmptyText : function(){
      var _self = this,
        bodyEl = _self.get('bodyEl'),
        emptyDataTpl = _self.get('emptyDataTpl'),
        emptyEl = _self.get('emptyEl');
      if(emptyEl){
        emptyEl.remove();
      }
      var emptyEl = $(emptyDataTpl).appendTo(bodyEl);
      _self.set('emptyEl',emptyEl);
    },
    /**
     * \u6e05\u9664\u6ca1\u6709\u6570\u636e\u65f6\u7684\u63d0\u793a\u4fe1\u606f
     */
    clearEmptyText : function(){
       var _self = this,
        emptyEl = _self.get('emptyEl');
      if(emptyEl){
        emptyEl.remove();
      }
    },
    //\u8bbe\u7f6e\u7b2c\u4e00\u884c\u7a7a\u767d\u884c\uff0c\u4e0d\u663e\u793a\u4efb\u4f55\u6570\u636e\uff0c\u4ec5\u7528\u4e8e\u8bbe\u7f6e\u5217\u7684\u5bbd\u5ea6
    _createHeaderRow:function () {
      var _self = this,
          columns = _self._getColumns(),
          tbodyEl = _self.get('tbodyEl'),
          rowTpl = _self.get('headerRowTpl'),
          rowEl,
          cellsTpl = [];

      $.each(columns, function (index,column) {
        cellsTpl.push(_self._getHeaderCellTpl(column));
      });

      //if this component set width,add a empty column to fit row width
      if(_self.get('useEmptyCell')){
        cellsTpl.push(_self._getEmptyCellTpl());
      }
      rowTpl = BUI.substitute(rowTpl,{cellsTpl:cellsTpl.join('')});
      rowEl = $(rowTpl).appendTo(tbodyEl);
      return rowEl;
    },
    //get the sum of the columns' width
    _getColumnsWidth:function () {
      var _self = this,
        columns = _self.get('columns'),
        totalWidth = 0;

      BUI.each(columns, function (column) {
          if (column.get('visible')) {
              totalWidth += column.get('el').outerWidth();
          }
      });
      return totalWidth;
    },
    //\u83b7\u53d6\u5217\u96c6\u5408
    _getColumns : function(){
      return this.get('columns');
    },
    //get cell text by record and column
    _getCellText:function (column, record,index) {
        var _self = this,
          dataIndex = column.get('dataIndex'),
          textTpl = column.get('cellTpl') || _self.get('cellTextTpl'),
          text = _self._getCellInnerText(column,dataIndex, record,index);
        return BUI.substitute(textTpl,{text:text, tips:_self._getTips(column, dataIndex, record)});
    },
    _getCellInnerText : function(column,dataIndex, record,index){
      //renderer \u65f6\u53d1\u751f\u9519\u8bef\u53ef\u80fd\u6027\u5f88\u9ad8
      try{
        var _self = this,
          renderer = column.get('renderer'),
          text = renderer ? renderer(record[dataIndex], record,index) : record[dataIndex];
        return text == null ? '' : text;
      }catch(ex){
        throw 'column:' + column.get('title') +' fomat error!';
      }
    },
    //get cell template by config and record
    _getCellTpl:function (column, dataIndex, record,index) {
      var _self = this,
        cellText = _self._getCellText(column, record,index),
        cellTpl = _self.get('cellTpl');
      return BUI.substitute(cellTpl,{
        elCls : column.get('elCls'),
        id:column.get('id'),
        dataIndex:dataIndex,
        cellText:cellText,
        hideCls:!column.get('visible') ? CLS_HIDE : ''
      });
    },
    //\u83b7\u53d6\u7a7a\u767d\u5355\u5143\u683c\u7684\u6a21\u677f
    _getEmptyCellTpl:function () {
      return '<td class="' + CLS_GRID_CELL + ' ' + CLS_CELL_EMPTY + '">&nbsp;</td>';
    },
    //\u83b7\u53d6\u7a7a\u767d\u884c\u5355\u5143\u683c\u6a21\u677f
    _getHeaderCellTpl:function (column) {
      var _self = this,
        headerCellTpl = _self.get('headerCellTpl');
      return BUI.substitute(headerCellTpl,{
        id:column.get('id'),
        width:column.get('width'),
        hideCls:!column.get('visible') ? CLS_HIDE : ''
      });
    },
    //\u83b7\u53d6\u8868\u683c\u5185\u5bbd\u5ea6
    _getInnerWidth : function(){
      return getInnerWidth(this.get('width'));
    },
    //get cell tips
    _getTips:function (column, dataIndex, record) {
      var showTip = column.get('showTip'),
          value = '';
      if (showTip) {
        value = record[dataIndex];
        if (BUI.isFunction(showTip)) {
          value = showTip(value, record);
        }
      }
      return value;
    },
    //\u8bbe\u7f6e\u5355\u5143\u683c\u8fb9\u6846
    _uiSetInnerBorder : function(v){
      var _self = this,
        el = _self.get('el');
      if(v){
        el.addClass(CLS_GRID_BORDER);
      }else{
        el.removeClass(CLS_GRID_BORDER);
      }
    },
    //\u8bbe\u7f6e\u8868\u683c\u6a21\u677f
    _setTableTpl : function(tpl){
      var _self = this,
        bodyEl = _self.get('bodyEl');

      tpl = tpl || _self.get('tableTpl');
      $(tpl).appendTo(bodyEl);
      var tableEl = bodyEl.find('table'),
        tbodyEl = bodyEl.find('tbody');
        //headerRowEl = _self._createHeaderRow();
            
      _self.set('tableEl',tableEl);
      _self.set('tbodyEl',tbodyEl);
      //_self.set('headerRowEl', headerRowEl);
      _self.set('itemContainer',tbodyEl);
      _self._setTableCls(_self.get('tableCls'));
    },
    //\u8bbe\u7f6etable\u4e0a\u7684\u6837\u5f0f
    _uiSetTableCls : function(v){
      this._setTableCls(v);
    },
    //when set grid's height,the scroll can effect the width of its body and header
    _uiSetHeight:function (h) {
      var _self = this,
        bodyEl = _self.get('bodyEl');
      _self.get('el').height(h);
      _self.get('el').addClass(CLS_GRID_HEIGHT);

    },
    _uiSetWidth:function (w) {
      var _self = this;
      _self.get('el').width(w);
      _self.setBodyWidth(_self._getInnerWidth(w));
      _self.get('el').addClass(CLS_GRID_WITH);
      
    },
    _uiSetStripeRows : function(v){
      var _self = this,
        method = v ? 'addClass' : 'removeClass';
      _self.get('el')[method](CLS_GRID_STRIPE);
    },
    _setTableCls : function(cls){
      var _self = this,
        tableEl = _self.get('tableEl');
      tableEl.attr('class',cls);
    }
  },{
    ATTRS : {
      tableCls : {},
      bodyEl : {},
      tbodyEl : {},
      headerRowEl:{},
      tableEl : {},
      emptyEl : {}
    }
  },{
    xclass : 'grid-view'
  });

  /**
   * @class BUI.Grid.Grid
   *
   * \u8868\u683c\u63a7\u4ef6,\u8868\u683c\u63a7\u4ef6\u7c7b\u56fe\uff0c\u4e00\u822c\u60c5\u51b5\u4e0b\u914d\u5408{@link BUI.Data.Store} \u4e00\u8d77\u4f7f\u7528
   * <p>
   * <img src="../assets/img/class-grid.jpg"/>
   * </p>
   * <p>\u8868\u683c\u63d2\u4ef6\u7684\u7c7b\u56fe\uff1a</p>
   * <p>
   * <img src="../assets/img/class-grid-plugins.jpg"/>
   * </p>
   *
   * <pre><code>
   *  BUI.use(['bui/grid','bui/data'],function(Grid,Data){
   *    var Grid = Grid,
   *      Store = Data.Store,
   *      columns = [{  //\u58f0\u660e\u5217\u6a21\u578b
   *          title : '\u8868\u59341(20%)',
   *          dataIndex :'a',
   *          width:'20%'
   *        },{
   *          id: '123',
   *          title : '\u8868\u59342(30%)',
   *          dataIndex :'b',
   *          width:'30%'
   *        },{
   *          title : '\u8868\u59343(50%)',
   *          dataIndex : 'c',
   *          width:'50%'
   *      }],
   *      data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}]; //\u663e\u793a\u7684\u6570\u636e
   *
   *    var store = new Store({
   *        data : data,
   *        autoLoad:true
   *      }),
   *       grid = new Grid.Grid({
   *         render:'#grid',
   *         width:'100%',//\u8fd9\u4e2a\u5c5e\u6027\u4e00\u5b9a\u8981\u8bbe\u7f6e
   *         columns : columns,
   *         idField : 'a',
   *         store : store
   *       });
   *
   *     grid.render();
   *   });
   * </code></pre>
   * @extends BUI.List.SimpleList
   */
  var grid = List.SimpleList.extend({
    
    /**
     * \u521d\u59cb\u5316\uff0c\u5982\u679c\u672a\u8bbe\u7f6e\u5bbd\u5ea6\uff0c\u5219\u4f7f\u7528\u8868\u683c\u5bb9\u5668\u7684\u5bbd\u5ea6
     * @protected
     * @ignore
     */
    initializer : function(){
        var _self = this,
            render = _self.get('render'),
            width = _self.get('width');
        if(!width){
            _self.set('width',$(render).width());
        }
    },
    /**
     * @protected
     * @ignore
     */
    createDom:function () {
      var _self = this;

      // \u63d0\u524d,\u4e2d\u9014\u8bbe\u7f6e\u5bbd\u5ea6\u65f6\u4f1a\u5931\u8d25\uff01\uff01
      if (_self.get('width')) {
          _self.get('el').addClass(CLS_GRID_WITH);
      }

      if (_self.get('height')) {
        _self.get('el').addClass(CLS_GRID_HEIGHT);
      }

      //\u56e0\u4e3a\u5185\u90e8\u7684\u8fb9\u8ddd\u5f71\u54cdheader\u7684forceFit\u8ba1\u7b97\uff0c\u6240\u4ee5\u5fc5\u987b\u5728header\u8ba1\u7b97forceFit\u524d\u7f6e\u6b64\u9879
      if(_self.get('innerBorder')){
          _self.get('el').addClass(CLS_GRID_BORDER);
      } 
    },
    /**
     * @protected
     * @ignore
     */
    renderUI : function(){
      var _self = this;
      _self._initHeader();
      _self._initBars();
      _self._initLoadMask();
      _self.get('view').resetHeaderRow();
    },
    /**
     * @private
     */
    bindUI:function () {
      var _self = this;
      _self._bindHeaderEvent();
      _self._bindBodyEvent();
      _self._bindItemsEvent();
    },
    /**
     * \u6dfb\u52a0\u5217
     * <pre><code>
     *   //\u6dfb\u52a0\u5230\u6700\u540e
     *   grid.addColumn({title : 'new column',dataIndex : 'new',width:100});
     *   //\u6dfb\u52a0\u5230\u6700\u524d
     *   grid.addColumn({title : 'new column',dataIndex : 'new',width:100},0);
     * </code></pre>
     * @param {Object|BUI.Grid.Column} column \u5217\u7684\u914d\u7f6e\uff0c\u5217\u7c7b\u7684\u5b9a\u4e49 {@link BUI.Grid.Column}
     * @param {Number} index \u6dfb\u52a0\u5230\u7684\u4f4d\u7f6e
     * @return {BUI.Grid.Column}
     */
    addColumn : function(column, index){
      var _self = this,
        header = _self.get('header');

      if(header){
        column = header.addColumn(column, index);
      }else{
        column = new Column(column);
        _self.get('columns').splice(index,0,column);
      }  
      return column;
    },
    /**
     * \u6e05\u9664\u663e\u793a\u7684\u6570\u636e
     * <pre><code>
     *   grid.clearData();
     * </code></pre>       
     */
    clearData : function(){
      this.clearItems();
    },
    /**
     * \u5f53\u524d\u663e\u793a\u5728\u8868\u683c\u4e2d\u7684\u6570\u636e
     * @return {Array} \u7eaa\u5f55\u96c6\u5408
     * @private
     */
    getRecords : function(){
      return this.getItems();
    },
    /**
     * \u4f7f\u7528\u7d22\u5f15\u6216\u8005id\u67e5\u627e\u5217
     * <pre><code>
     *  //\u8bbe\u7f6e\u5217\u7684id,\u5426\u5219\u4f1a\u81ea\u52a8\u751f\u6210
     *  {id : '1',title : '\u8868\u5934',dataIndex : 'a'}
     *  //\u83b7\u53d6\u5217
     *  var column = grid.findColumn('id');
     *  //\u64cd\u4f5c\u5217
     *  column.set('visible',false);
     * </code></pre>
     * @param {String|Number} id|index  \u6587\u672c\u503c\u4ee3\u8868\u7f16\u53f7\uff0c\u6570\u5b57\u4ee3\u8868\u7d22\u5f15
     */
    findColumn : function(id){
      var _self = this,
        header = _self.get('header');
      if(BUI.isNumber(id)){
        return header.getColumnByIndex(id);
      }else{
        return header.getColumnById(id);
      }
    },
    /**
     * \u4f7f\u7528\u5b57\u6bb5\u540d\u67e5\u627e\u5217
     * <pre><code>
     * //\u8bbe\u7f6e\u5217dataIndex
     *  {id : '1',title : '\u8868\u5934',dataIndex : 'a'}
     *  //\u83b7\u53d6\u5217
     *  var column = grid.findColumnByField('a');
     *  //\u64cd\u4f5c\u5217
     *  column.set('visible',false);
     * </code></pre>
     * @param {String} field \u5217\u7684\u5b57\u6bb5\u540d dataIndex
     */
    findColumnByField : function(field){
      var _self = this,
        header = _self.get('header');
      return header.getColumn(function(column){
        return column.get('dataIndex') === field;
      });
    },
    /**
     * \u6839\u636e\u5217\u7684Id\u67e5\u627e\u5bf9\u5e94\u7684\u5355\u5143\u683c
     * @param {String|Number} id \u5217id
     * @param {Object|jQuery} record \u672c\u884c\u5bf9\u5e94\u7684\u8bb0\u5f55\uff0c\u6216\u8005\u662f\u672c\u884c\u7684\uff24\uff2f\uff2d\u5bf9\u8c61
     * @protected
     * @return  {jQuery}
     */
    findCell:function (id, record) {
        var _self = this,
            rowEl = null;
        if (record instanceof $) {
            rowEl = record;
        } else {
            rowEl = _self.findRow(record);
        }
        if (rowEl) {
            return _self.get('view').findCell(id, rowEl);
        }
        return null;
    },
    /**
     * find the dom by the record in this component
     * @param {Object} record the record used to find row dom
     * @protected
     * @return jQuery
     */
    findRow:function (record) {
        var _self = this;
        return _self.get('view').findRow(record);
    },
    /**
     * \u79fb\u9664\u5217
     * <pre><code>
     *   var column = grid.findColumn('id');
     *   grid.removeColumn(column);
     * </code></pre>
     * @param {BUI.Grid.Column} column \u8981\u79fb\u9664\u7684\u5217
     */
    removeColumn:function (column) {
      var _self = this;
        _self.get('header').removeColumn(column);
    },
    /**
     * \u663e\u793a\u6570\u636e,\u5f53\u4e0d\u4f7f\u7528store\u65f6\uff0c\u53ef\u4ee5\u5355\u72ec\u663e\u793a\u6570\u636e
     * <pre><code>
     *   var data = [{},{}];
     *   grid.showData(data);
     * </code></pre>
     * @param  {Array} data \u663e\u793a\u7684\u6570\u636e\u96c6\u5408
     */
    showData : function(data){
      var _self = this;
      _self.set('items',data);
    },
    /**
     * \u91cd\u7f6e\u5217\uff0c\u5f53\u5217\u53d1\u751f\u6539\u53d8\u65f6\u540c\u6b65DOM\u548c\u6570\u636e
     * @protected
     */
    resetColumns:function () {
      var _self = this,
          store = _self.get('store');
      //recreate the header row
      _self.get('view').resetHeaderRow();
      //show data
      if (store) {
          _self.onLoad();
      }
    },
    //when body scrolled,the other component of grid also scrolled
    _bindScrollEvent:function () {
      var _self = this,
        el = _self.get('el'),
        bodyEl = el.find('.' + CLS_GRID_BODY),
        header = _self.get('header');

      bodyEl.on('scroll', function () {
        var left = bodyEl.scrollLeft(),
            top = bodyEl.scrollTop();
        header.scrollTo({left:left, top:top});
        _self.fire('scroll', {scrollLeft:left, scrollTop:top,bodyWidth : bodyEl.width(),bodyHeight : bodyEl.height()});
      });
    },
    //bind header event,when column changed,followed this component
    _bindHeaderEvent:function () {
        var _self = this,
          header = _self.get('header'),
          view = _self.get('view'),
          store = _self.get('store');
        header.on('afterWidthChange', function (e) {
          var sender = e.target;
          if (sender !== header) {
              view.resetColumnsWidth(sender);
          }
        });

        header.on('afterSortStateChange', function (e) {
          var column = e.target,
              val = e.newVal;
          if (val && store) {
            store.sort(column.get('dataIndex'), column.get('sortState'));
          }
        });

        header.on('afterVisibleChange', function (e) {
          var sender = e.target;
          if (sender !== header) {
            view.setColumnVisible(sender);
            _self.fire('columnvisiblechange',{column:sender});
          }
        });

        header.on('click', function (e) {
          var sender = e.target;
          if (sender !== header) {
            _self.fire('columnclick',{column:sender,domTarget:e.domTarget});
          }
        });

        header.on('forceFitWidth', function () {
          if (_self.get('rendered')) {
              _self.resetColumns();
          }
        });

        header.on('add', function (e) {
          if (_self.get('rendered')) {
            _self.fire('columnadd',{column:e.column,index:e.index});
              _self.resetColumns();
          }
        });

        header.on('remove', function (e) {
          if (_self.get('rendered')) {
            _self.resetColumns();
            _self.fire('columnremoved',{column:e.column,index:e.index});
          }
        });

    },
    //when body scrolled, header can followed
    _bindBodyEvent:function () {
      var _self = this;
      _self._bindScrollEvent();       
    },
    //\u7ed1\u5b9a\u8bb0\u5f55DOM\u76f8\u5173\u7684\u4e8b\u4ef6
    _bindItemsEvent : function(){
      var _self = this,
        store = _self.get('store');

      _self.on('itemsshow',function(){
        _self.fire('aftershow');
      });

      _self.on('itemsclear',function(){
        _self.fire('clear');
      });

      _self.on('itemclick',function(ev){
        var target = ev.domTarget,
          record = ev.item,
          cell = $(target).closest('.' + CLS_GRID_CELL),
          rowEl = $(target).closest('.' + CLS_GRID_ROW),
          rst; //\u7528\u4e8e\u662f\u5426\u963b\u6b62\u4e8b\u4ef6\u89e6\u53d1

        if(cell.length){
          rst = _self.fire('cellclick', {record:record, row:rowEl[0], cell:cell[0], field:cell.attr(ATTR_COLUMN_FIELD), domTarget:target,domEvent:ev.domEvent});
        }

        if(rst === false){
          return rst;
        }

        return _self.fire('rowclick', {record:record, row:rowEl[0], domTarget:target});
          
      });

      _self.on('itemunselected',function(ev){
        _self.fire('rowunselected',getEventObj(ev));
      });

      _self.on('itemselected',function(ev){
        _self.fire('rowselected',getEventObj(ev));
      });

      _self.on('itemrendered',function(ev){
        _self.fire('rowcreated',getEventObj(ev));
      });
      
      _self.on('itemremoved',function(ev){
        _self.fire('rowremoved',getEventObj(ev));
      });

      _self.on('itemupdated',function(ev){
        _self.fire('rowupdated',getEventObj(ev));
      });

      function getEventObj(ev){
        return {record : ev.item, row : ev.domTarget, domTarget : ev.domTarget};
      }
    },
    //\u83b7\u53d6\u8868\u683c\u5185\u90e8\u7684\u5bbd\u5ea6\uff0c\u53d7\u8fb9\u6846\u7684\u5f71\u54cd\uff0c
    //\u5185\u90e8\u7684\u5bbd\u5ea6\u4e0d\u80fd\u7b49\u4e8e\u8868\u683c\u5bbd\u5ea6
    _getInnerWidth : function(width){
      width = width || this.get('width');
      return getInnerWidth(width);
    },
    //init header,if there is not a header property in config,instance it
    _initHeader:function () {
      var _self = this,
        header = _self.get('header'),
        container = _self.get('el').find('.'+ CLS_GRID_HEADER_CONTAINER);
      if (!header) {
        header = new Header({
          columns:_self.get('columns'),
          tableCls:_self.get('tableCls'),
          forceFit:_self.get('forceFit'),
          width:_self._getInnerWidth(),
          render: container,
          parent : _self
        }).render();
        //_self.addChild(header);
        _self.set('header', header);
      }
    },
    //\u521d\u59cb\u5316 \u4e0a\u4e0b\u5de5\u5177\u680f
    _initBars:function () {
      var _self = this,
          bbar = _self.get('bbar'),
          tbar = _self.get('tbar');
      _self._initBar(bbar, CLS_GRID_BBAR, 'bbar');
      _self._initBar(tbar, CLS_GRID_TBAR, 'tbar');
    },
    //set bar's elCls to identify top bar or bottom bar
    _initBar:function (bar, cls, name) {
      var _self = this,
        store = null,
        pagingBarCfg = null;
      if (bar) {
        //\u672a\u6307\u5b9axclass,\u540c\u65f6\u4e0d\u662fController\u65f6
        if(!bar.xclass && !(bar instanceof Component.Controller)){
          bar.xclass = 'bar';
          bar.children = bar.children || [];

          if(bar.items){
            bar.children.push({
                xclass : 'bar',
                defaultChildClass : "bar-item-button",
                elCls : CLS_BUTTON_BAR,
                children : bar.items
            });
            bar.items=null;
          }

          // modify by fuzheng
          if(bar.pagingBar){
            store = _self.get('store');
            pagingBarCfg = {
              xclass : 'pagingbar',
              store : store,
              pageSize : store.pageSize
            };
            if(bar.pagingBar !== true){
              pagingBarCfg = BUI.merge(pagingBarCfg, bar.pagingBar);
            }
            bar.children.push(pagingBarCfg);
          }
        }
        if (bar.xclass) {
          var barContainer = _self.get('el').find('.' + cls);
          barContainer.show();
          bar.render = barContainer;
          //bar.parent=_self;
          bar.elTagName = 'div';
          bar.autoRender = true;
          bar = _self.addChild(bar); //Component.create(bar).create();
        }
        _self.set(name, bar);
      }
      return bar;
    },
    //when set 'loadMask = true' ,create a loadMask instance
    _initLoadMask:function () {
      var _self = this,
        loadMask = _self.get('loadMask');
      if (loadMask && !loadMask.show) {
        loadMask = new BUI.Mask.LoadMask({el:_self.get('el')});
        _self.set('loadMask', loadMask);
      }
    },
    //\u8c03\u6574\u5bbd\u5ea6\u65f6\uff0c\u8c03\u6574\u5185\u90e8\u63a7\u4ef6\u5bbd\u5ea6
    _uiSetWidth:function (w) {
      var _self = this;
      if (_self.get('rendered')) {
        if(!isPercent(w)){
          _self.get('header').set('width', _self._getInnerWidth(w));
        }else{
          _self.get('header').set('width','100%');
        }
        
      }
      _self.get('view').setTableWidth();
    },
    //\u8bbe\u7f6e\u81ea\u9002\u5e94\u5bbd\u5ea6
    _uiSetForceFit:function (v) {
      var _self = this;
      _self.get('header').set('forceFit', v);
    },
    //when set grid's height,the scroll can effect the width of its body and header
    _uiSetHeight:function (h,obj) {
      var _self = this,
        header = _self.get('header');
      _self.get('view').setBodyHeight(h);
      if (_self.get('rendered')) {
        if (_self.get('forceFit') && !obj.prevVal) {
          header.forceFitColumns();
          //\u5f3a\u8feb\u5bf9\u9f50\u65f6\uff0c\u7531\u672a\u8bbe\u7f6e\u9ad8\u5ea6\u6539\u6210\u8bbe\u7f6e\u9ad8\u5ea6\uff0c\u589e\u52a0\u4e8617\u50cf\u7d20\u7684\u6eda\u52a8\u6761\u5bbd\u5ea6\uff0c\u6240\u4ee5\u91cd\u7f6e\u8868\u683c\u5bbd\u5ea6
          _self.get('view').setTableWidth();
        }
        header.setTableWidth();
      }
      
    },
    /**
     * \u52a0\u8f7d\u6570\u636e
     * @protected
     */
    onLoad : function(){
      var _self = this,
        store = _self.get('store');
      grid.superclass.onLoad.call(this);
      if(_self.get('emptyDataTpl')){ //\u521d\u59cb\u5316\u7684\u65f6\u5019\u4e0d\u663e\u793a\u7a7a\u767d\u6570\u636e\u7684\u6587\u672c
        if(store && store.getCount() == 0){
          _self.get('view').showEmptyText();
        }else{
          _self.get('view').clearEmptyText();
        }
      }
    }
  },{
    ATTRS : {
      /**
       * \u8868\u5934\u5bf9\u8c61
       * @type {BUI.Grid.Header}
       * @protected
       */
      header:{

      },
      /**
       * @see {BUI.Grid.Grid#tbar}
       * <pre><code>
       * grid = new Grid.Grid({
       *    render:'#grid',
       *    columns : columns,
       *    width : 700,
       *    forceFit : true,
       *    tbar:{ //\u6dfb\u52a0\u3001\u5220\u9664
       *        items : [{
       *          btnCls : 'button button-small',
       *          text : '<i class="icon-plus"></i>\u6dfb\u52a0',
       *          listeners : {
       *            'click' : addFunction
       *          }
       *        },
       *        {
       *          btnCls : 'button button-small',
       *          text : '<i class="icon-remove"></i>\u5220\u9664',
       *          listeners : {
       *            'click' : delFunction
       *          }
       *        }]
       *    },
       *    store : store
       *  });
       *
       * grid.render();
       * </code></pre>
       * @cfg {Object|BUI.Toolbar.Bar} bbar
       */
      /**
       * @see {BUI.Grid.Grid#tbar}
       * @type {Object}
       * @ignore
       */
      bbar:{

      },
      itemCls : {
        value : CLS_GRID_ROW
      },
      /**
       * \u5217\u7684\u914d\u7f6e \u7528\u6765\u914d\u7f6e \u8868\u5934 \u548c \u8868\u5185\u5bb9\u3002{@link BUI.Grid.Column}
       * @cfg {Array} columns
       */
      columns:{
        view : true,
        value:[]
      },
      /**
       * \u5f3a\u8feb\u5217\u81ea\u9002\u5e94\u5bbd\u5ea6\uff0c\u5982\u679c\u5217\u5bbd\u5ea6\u5927\u4e8eGrid\u6574\u4f53\u5bbd\u5ea6\uff0c\u7b49\u6bd4\u4f8b\u7f29\u51cf\uff0c\u5426\u5219\u7b49\u6bd4\u4f8b\u589e\u52a0
       * <pre><code>
       *  var grid = new Grid.Grid({
       *    render:'#grid',
       *    columns : columns,
       *    width : 700,
       *    forceFit : true, //\u81ea\u9002\u5e94\u5bbd\u5ea6
       *    store : store
       *  });
       * </code></pre>
       * @cfg {Boolean} [forceFit= false]
       */
      /**
       * \u5f3a\u8feb\u5217\u81ea\u9002\u5e94\u5bbd\u5ea6\uff0c\u5982\u679c\u5217\u5bbd\u5ea6\u5927\u4e8eGrid\u6574\u4f53\u5bbd\u5ea6\uff0c\u7b49\u6bd4\u4f8b\u7f29\u51cf\uff0c\u5426\u5219\u7b49\u6bd4\u4f8b\u589e\u52a0
       * <pre><code>
       *  grid.set('forceFit',true);
       * </code></pre>
       * @type {Boolean}
       * @default 'false'
       */
      forceFit:{
        sync:false,
        value:false
      },
      /**
       * \u6570\u636e\u4e3a\u7a7a\u65f6\uff0c\u663e\u793a\u7684\u63d0\u793a\u5185\u5bb9
       * <pre><code>
       *  var grid = new Grid({
       *   render:'#J_Grid4',
       *   columns : columns,
       *   store : store,
       *   emptyDataTpl : '&lt;div class="centered"&gt;&lt;img alt="Crying" src="http://img03.taobaocdn.com/tps/i3/T1amCdXhXqXXXXXXXX-60-67.png"&gt;&lt;h2&gt;\u67e5\u8be2\u7684\u6570\u636e\u4e0d\u5b58\u5728&lt;/h2&gt;&lt;/div&gt;',
       *   width:'100%'
       *
       * });
       * 
       * grid.render();
       * </code></pre>
       ** @cfg {Object} emptyDataTpl
       */
      emptyDataTpl : {
        view : true
      },
      /**
       * \u8868\u683c\u9996\u884c\u8bb0\u5f55\u6a21\u677f\uff0c\u9996\u884c\u8bb0\u5f55\uff0c\u9690\u85cf\u663e\u793a\uff0c\u7528\u4e8e\u786e\u5b9a\u8868\u683c\u5404\u5217\u7684\u5bbd\u5ea6
       * @type {String}
       * @protected
       */
      headerRowTpl:{
        view:true,
        value:'<tr class="' + PREFIX + 'grid-header-row">{cellsTpl}</tr>'
      },
      /**
       * \u8868\u683c\u9996\u884c\u8bb0\u5f55\u7684\u5355\u5143\u683c\u6a21\u677f
       * @protected
       * @type {String}
       */
      headerCellTpl:{
        view:true,
        value:'<td class="{hideCls} ' + CLS_TD_PREFIX + '{id}" width="{width}" style="height:0"></td>'
      },
      /**
       * \u8868\u683c\u6570\u636e\u884c\u7684\u6a21\u677f
       * @type {String}
       * @default  <pre>'&lt;tr class="' + CLS_GRID_ROW + ' {{oddCls}}"&gt;{{cellsTpl}}&lt;/tr&gt;'</pre>
       */
      rowTpl:{
        view:true,
        value:'<tr class="' + CLS_GRID_ROW + ' {oddCls}">{cellsTpl}</tr>'
      },
      /**
       * \u5355\u5143\u683c\u7684\u6a21\u677f
       * @type {String}
       * <pre>
       *     '&lt;td  class="' + CLS_GRID_CELL + ' grid-td-{{id}}" data-column-id="{{id}}" data-column-field = {{dataIndex}}&gt;'+
       *        '&lt;div class="' + CLS_GRID_CELL_INNER + '" &gt;{{cellText}}&lt;/div&gt;'+
       *    '&lt;/td&gt;'
       *</pre>
       */
      cellTpl:{
        view:true,
        value:'<td  class="{elCls} {hideCls} ' + CLS_GRID_CELL + ' ' + CLS_TD_PREFIX + '{id}" data-column-id="{id}" data-column-field = "{dataIndex}" >' +
            '<div class="' + CLS_GRID_CELL_INNER + '" >{cellText}</div>' +
            '</td>'

      },
      /**
       * \u5355\u5143\u683c\u6587\u672c\u7684\u6a21\u677f
       * @default &lt;span class="' + CLS_CELL_TEXT + ' " title = "{{tips}}"&gt;{{text}}&lt;/span&gt;
       * @type {String}
       */
      cellTextTpl:{
        view:true,
        value:'<span class="' + CLS_CELL_TEXT + ' " title = "{tips}">{text}</span>'
      },
      /**
       * \u4e8b\u4ef6\u96c6\u5408
       * @type {Object}
       */
      events:{
        value:{
          /**
           * \u663e\u793a\u5b8c\u6570\u636e\u89e6\u53d1
           * @event
           */
          'aftershow' : false,
           /**
           * \u8868\u683c\u7684\u6570\u636e\u6e05\u7406\u5b8c\u6210\u540e
           * @event
           */
          'clear' : false,
          /**
           * \u70b9\u51fb\u5355\u5143\u683c\u65f6\u89e6\u53d1,\u5982\u679creturn false,\u5219\u4f1a\u963b\u6b62 'rowclick' ,'rowselected','rowunselected'\u4e8b\u4ef6
           * @event
           * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.record \u6b64\u884c\u7684\u8bb0\u5f55
           * @param {String} e.field \u70b9\u51fb\u5355\u5143\u683c\u5217\u5bf9\u5e94\u7684\u5b57\u6bb5\u540d\u79f0
           * @param {HTMLElement} e.row \u70b9\u51fb\u884c\u5bf9\u5e94\u7684DOM
           * @param {HTMLElement} e.cell \u70b9\u51fb\u5bf9\u5e94\u7684\u5355\u5143\u683c\u7684DOM
           * @param {HTMLElement} e.domTarget \u70b9\u51fb\u7684DOM
           * @param {jQuery.Event} e.domEvent \u70b9\u51fb\u7684jQuery\u4e8b\u4ef6
           */
          'cellclick' : false,
          /**
           * \u70b9\u51fb\u8868\u5934
           * @event 
           * @param {jQuery.Event} e \u4e8b\u4ef6\u5bf9\u8c61
           * @param {BUI.Grid.Column} e.column \u5217\u5bf9\u8c61
           * @param {HTMLElement} e.domTarget \u70b9\u51fb\u7684DOM
           */
          'columnclick' : false,
          /**
           * \u70b9\u51fb\u884c\u65f6\u89e6\u53d1\uff0c\u5982\u679creturn false,\u5219\u4f1a\u963b\u6b62'rowselected','rowunselected'\u4e8b\u4ef6
           * @event
           * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.record \u6b64\u884c\u7684\u8bb0\u5f55
           * @param {HTMLElement} e.row \u70b9\u51fb\u884c\u5bf9\u5e94\u7684DOM
           * @param {HTMLElement} e.domTarget \u70b9\u51fb\u7684DOM
           */
          'rowclick' : false,
          /**
           * \u5f53\u4e00\u884c\u6570\u636e\u663e\u793a\u5728\u8868\u683c\u4e2d\u540e\u89e6\u53d1
           * @event
           * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.record \u6b64\u884c\u7684\u8bb0\u5f55
           * @param {HTMLElement} e.row \u884c\u5bf9\u5e94\u7684DOM
           * @param {HTMLElement} e.domTarget \u6b64\u4e8b\u4ef6\u4e2d\u7b49\u4e8e\u884c\u5bf9\u5e94\u7684DOM
           */
          'rowcreated' : false,
          /**
           * \u79fb\u9664\u4e00\u884c\u7684DOM\u540e\u89e6\u53d1
           * @event
           * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.record \u6b64\u884c\u7684\u8bb0\u5f55
           * @param {HTMLElement} e.row \u884c\u5bf9\u5e94\u7684DOM
           * @param {HTMLElement} e.domTarget \u6b64\u4e8b\u4ef6\u4e2d\u7b49\u4e8e\u884c\u5bf9\u5e94\u7684DOM
           */
          'rowremoved' : false,
          /**
           * \u9009\u4e2d\u4e00\u884c\u65f6\u89e6\u53d1
           * @event
           * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.record \u6b64\u884c\u7684\u8bb0\u5f55
           * @param {HTMLElement} e.row \u884c\u5bf9\u5e94\u7684DOM
           * @param {HTMLElement} e.domTarget \u6b64\u4e8b\u4ef6\u4e2d\u7b49\u4e8e\u884c\u5bf9\u5e94\u7684DOM
           */
          'rowselected' : false,
          /**
           * \u6e05\u9664\u9009\u4e2d\u4e00\u884c\u65f6\u89e6\u53d1\uff0c\u53ea\u6709\u591a\u9009\u60c5\u51b5\u4e0b\u89e6\u53d1
           * @event
           * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Object} e.record \u6b64\u884c\u7684\u8bb0\u5f55
           * @param {HTMLElement} e.row \u884c\u5bf9\u5e94\u7684DOM
           * @param {HTMLElement} e.domTarget \u6b64\u4e8b\u4ef6\u4e2d\u7b49\u4e8e\u884c\u5bf9\u5e94\u7684DOM
           */
          'rowunselected' : false,
          /**
           * \u8868\u683c\u5185\u90e8\u53d1\u751f\u6eda\u52a8\u65f6\u89e6\u53d1
           * @event
           * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
           * @param {Number} e.scrollLeft \u6eda\u52a8\u5230\u7684\u6a2a\u5750\u6807
           * @param {Number} e.scrollTop \u6eda\u52a8\u5230\u7684\u7eb5\u5750\u6807
           * @param {Number} e.bodyWidth \u8868\u683c\u5185\u90e8\u7684\u5bbd\u5ea6
           * @param {Number} e.bodyHeight \u8868\u683c\u5185\u90e8\u7684\u9ad8\u5ea6
           */
          'scroll' : false
        }
      },
      /**
       * \u662f\u5426\u5947\u5076\u884c\u6dfb\u52a0\u5206\u5272\u8272
       * @type {Boolean}
       * @default true
       */
      stripeRows:{
        view:true,
        value:true
      },
      /**
       * \u9876\u5c42\u7684\u5de5\u5177\u680f\uff0c\u8ddfbbar\u7ed3\u6784\u4e00\u81f4,\u53ef\u4ee5\u662f\u5de5\u5177\u680f\u5bf9\u8c61@see {BUI.Toolbar.Bar},\u4e5f\u53ef\u4ee5\u662fxclass\u5f62\u5f0f\u7684\u914d\u7f6e\u9879\uff0c
       * \u8fd8\u53ef\u4ee5\u662f\u5305\u542b\u4ee5\u4e0b\u5b57\u6bb5\u7684\u914d\u7f6e\u9879
       * <ol>
       * <li>items:\u5de5\u5177\u680f\u7684\u9879\uff0c
       *    - \u9ed8\u8ba4\u662f\u6309\u94ae(xtype : button)\u3001
       *    - \u6587\u672c(xtype : text)\u3001
       *    - \u94fe\u63a5(xtype : link)\u3001
       *    - \u5206\u9694\u7b26(bar-item-separator)\u4ee5\u53ca\u81ea\u5b9a\u4e49\u9879
       * </li>
       * <li>pagingBar:\u8868\u660e\u5305\u542b\u5206\u9875\u680f</li>
       * </ol>
       * @type {Object|BUI.Toolbar.Bar}
       * @example
       * tbar:{
       *     items:[
       *         {
       *             text:'\u547d\u4ee4\u4e00' //\u9ed8\u8ba4\u662f\u6309\u94ae
       *             
       *         },
       *         {
       *             xtype:'text',
       *             text:'\u6587\u672c'
       *         }
       *     ],
       *     pagingBar:true
       * }
       */
      tbar:{

      },
      /**
       * \u53ef\u4ee5\u9644\u52a0\u5230\u8868\u683c\u4e0a\u7684\u6837\u5f0f.
       * @cfg {String} tableCls
       * @default 'bui-grid-table' this css cannot be overridden
       */
      tableCls:{
        view : true,
        sync : false,
        value:PREFIX + 'grid-table'
      },
      /**
       * \u8868\u4f53\u7684\u6a21\u677f
       * @protected
       * @type {String}
       */
      tableTpl : {
        view:true,
        value:'<table cellspacing="0" cellpadding="0" >' +
            '<tbody></tbody>' +
            '</table>'
      },
      tpl : {
        value : '<div class="'+CLS_GRID_TBAR+'" style="display:none"></div><div class="'+CLS_GRID_HEADER_CONTAINER+'"></div><div class="'+CLS_GRID_BODY+'"></div><div style="display:none" class="' + CLS_GRID_BBAR + '"></div>'
      },
      /**
       * \u5355\u5143\u683c\u5de6\u53f3\u4e4b\u95f4\u662f\u5426\u51fa\u73b0\u8fb9\u6846
       * 
       * @cfg {Boolean} [innerBorder=true]
       */
      /**
       * \u5355\u5143\u683c\u5de6\u53f3\u4e4b\u95f4\u662f\u5426\u51fa\u73b0\u8fb9\u6846
       * <pre><code>
       *   var  grid = new Grid.Grid({
       *     render:'#grid',
       *     innerBorder: false, // \u9ed8\u8ba4\u4e3atrue
       *     columns : columns,
       *     store : store
       *   });
       * </code></pre>
       * @type {Boolean}
       * @default true
       */
      innerBorder : {
        sync:false,
        value : true
      },
      /**
       * \u662f\u5426\u4f7f\u7528\u7a7a\u767d\u5355\u5143\u683c\u7528\u4e8e\u5360\u4f4d\uff0c\u4f7f\u5217\u5bbd\u7b49\u4e8e\u8bbe\u7f6e\u7684\u5bbd\u5ea6
       * @type {Boolean}
       * @private
       */
      useEmptyCell : {
        view : true,
        value : true
      },
      /**
       * \u662f\u5426\u9996\u884c\u4f7f\u7528\u7a7a\u767d\u884c\uff0c\u7528\u4ee5\u786e\u5b9a\u8868\u683c\u5217\u7684\u5bbd\u5ea6
       * @type {Boolean}
       * @private
       */
      useHeaderRow : {
        view : true,
        value : true
      },
      /**
       * Grid \u7684\u89c6\u56fe\u7c7b\u578b
       * @type {BUI.Grid.GridView}
       */
      xview : {
        value : gridView
      }
    }
  },{
    xclass : 'grid'
  });

  return grid;
});

/**
 * @ignore
 * 2013.1.18 
 *   \u8fd9\u662f\u4e00\u4e2a\u91cd\u6784\u7684\u7248\u672c\uff0c\u5c06Body\u53d6\u6d88\u6389\u4e86\uff0c\u76ee\u7684\u662f\u4e3a\u4e86\u53ef\u4ee5\u5c06Grid\u548cSimpleGrid\u8054\u7cfb\u8d77\u6765\uff0c
 *   \u540c\u65f6\u5c06selection \u7edf\u4e00         
 */
define('bui/grid/format',function (require) {

    function formatTimeUnit(v) {
        if (v < 10) {
            return '0' + v;
        }
        return v;
    }

    /**
     * This class specifies some formatter for grid's cell renderer
     * @class BUI.Grid.Format
     * @singleton
     */
    var Format =
    /** 
    * @lends BUI.Grid.Format 
    * @ignore
    */
    {
        /**
         * \u65e5\u671f\u683c\u5f0f\u5316\u51fd\u6570
         * @param {Number|Date} d \u683c\u5f0f\u8bdd\u7684\u65e5\u671f\uff0c\u4e00\u822c\u4e3a1970 \u5e74 1 \u6708 1 \u65e5\u81f3\u4eca\u7684\u6beb\u79d2\u6570
         * @return {String} \u683c\u5f0f\u5316\u540e\u7684\u65e5\u671f\u683c\u5f0f\u4e3a 2011-10-31
         * @example
         * \u4e00\u822c\u7528\u6cd5\uff1a<br>
         * BUI.Grid.Format.dateRenderer(1320049890544);\u8f93\u51fa\uff1a2011-10-31 <br>
         * \u8868\u683c\u4e2d\u7528\u4e8e\u6e32\u67d3\u5217\uff1a<br>
         * {title:"\u51fa\u5e93\u65e5\u671f",dataIndex:"date",renderer:BUI.Grid.Format.dateRenderer}
         */
        dateRenderer:function (d) {
            if (!d) {
                return '';
            }
            if (BUI.isString(d)) {
                return d;
            }
            var date = null;
            try {
                date = new Date(d);
            } catch (e) {
                return '';
            }
            if (!date || !date.getFullYear) {
                return '';
            }
            return date.getFullYear() + '-' + formatTimeUnit(date.getMonth() + 1) + '-' + formatTimeUnit(date.getDate());
        },
        /**
         * @description \u65e5\u671f\u65f6\u95f4\u683c\u5f0f\u5316\u51fd\u6570
         * @param {Number|Date} d \u683c\u5f0f\u8bdd\u7684\u65e5\u671f\uff0c\u4e00\u822c\u4e3a1970 \u5e74 1 \u6708 1 \u65e5\u81f3\u4eca\u7684\u6beb\u79d2\u6570
         * @return {String} \u683c\u5f0f\u5316\u540e\u7684\u65e5\u671f\u683c\u5f0f\u65f6\u95f4\u4e3a 2011-10-31 16 : 41 : 02
         */
        datetimeRenderer:function (d) {
            if (!d) {
                return '';
            }
            if (BUI.isString(d)) {
                return d;
            }
            var date = null;
            try {
                date = new Date(d);
            } catch (e) {
                return '';
            }
            if (!date || !date.getFullYear) {
                return '';
            }
            return date.getFullYear() + '-' + formatTimeUnit(date.getMonth() + 1) + '-' + formatTimeUnit(date.getDate()) + ' ' + formatTimeUnit(date.getHours()) + ':' + formatTimeUnit(date.getMinutes()) + ':' + formatTimeUnit(date.getSeconds());
        },
        /**
         * \u6587\u672c\u622a\u53d6\u51fd\u6570\uff0c\u5f53\u6587\u672c\u8d85\u51fa\u4e00\u5b9a\u6570\u5b57\u65f6\uff0c\u4f1a\u622a\u53d6\u6587\u672c\uff0c\u6dfb\u52a0...
         * @param {Number} length \u622a\u53d6\u591a\u5c11\u5b57\u7b26
         * @return {Function} \u8fd4\u56de\u5904\u7406\u51fd\u6570 \u8fd4\u56de\u622a\u53d6\u540e\u7684\u5b57\u7b26\u4e32\uff0c\u5982\u679c\u672c\u8eab\u5c0f\u4e8e\u6307\u5b9a\u7684\u6570\u5b57\uff0c\u8fd4\u56de\u539f\u5b57\u7b26\u4e32\u3002\u5982\u679c\u5927\u4e8e\uff0c\u5219\u8fd4\u56de\u622a\u65ad\u540e\u7684\u5b57\u7b26\u4e32\uff0c\u5e76\u9644\u52a0...
         */
        cutTextRenderer:function (length) {
            return function (value) {
                value = value || '';
                if (value.toString().length > length) {
                    return value.toString().substring(0, length) + '...';
                }
                return value;
            };
        },
        /**
         * \u679a\u4e3e\u683c\u5f0f\u5316\u51fd\u6570
         * @param {Object} enumObj \u952e\u503c\u5bf9\u7684\u679a\u4e3e\u5bf9\u8c61 {"1":"\u5927","2":"\u5c0f"}
         * @return {Function} \u8fd4\u56de\u6307\u5b9a\u679a\u4e3e\u7684\u683c\u5f0f\u5316\u51fd\u6570
         * @example
         * //Grid \u7684\u5217\u5b9a\u4e49
         *  {title:"\u72b6\u6001",dataIndex:"status",renderer:BUI.Grid.Format.enumRenderer({"1":"\u5165\u5e93","2":"\u51fa\u5e93"})}
         */
        enumRenderer:function (enumObj) {
            return function (value) {
                return enumObj[value] || '';
            };
        },
        /*
         * \u5c06\u591a\u4e2a\u503c\u8f6c\u6362\u6210\u4e00\u4e2a\u5b57\u7b26\u4e32
         * @param {Object} enumObj \u952e\u503c\u5bf9\u7684\u679a\u4e3e\u5bf9\u8c61 {"1":"\u5927","2":"\u5c0f"}
         * @return {Function} \u8fd4\u56de\u6307\u5b9a\u679a\u4e3e\u7684\u683c\u5f0f\u5316\u51fd\u6570
         * @example
         * <code>
         *  //Grid \u7684\u5217\u5b9a\u4e49
         *  {title:"\u72b6\u6001",dataIndex:"status",renderer:BUI.Grid.Format.multipleItemsRenderer({"1":"\u5165\u5e93","2":"\u51fa\u5e93","3":"\u9000\u8d27"})}
         *  //\u6570\u636e\u6e90\u662f[1,2] \u65f6\uff0c\u5219\u8fd4\u56de "\u5165\u5e93,\u51fa\u5e93"
         * </code>
         */
        multipleItemsRenderer:function (enumObj) {
            var enumFun = Format.enumRenderer(enumObj);
            return function (values) {
                var result = [];
                if (!values) {
                    return '';
                }
                if (!BUI.isArray(values)) {
                    values = values.toString().split(',');
                }
                $.each(values, function (index,value) {
                    result.push(enumFun(value));
                });

                return result.join(',');
            };
        },
        /*
         * \u5c06\u8d22\u52a1\u6570\u636e\u5206\u8f6c\u6362\u6210\u5143
         * @param {Number|String} enumObj \u952e\u503c\u5bf9\u7684\u679a\u4e3e\u5bf9\u8c61 {"1":"\u5927","2":"\u5c0f"}
         * @return {Number} \u8fd4\u56de\u5c06\u5206\u8f6c\u6362\u6210\u5143\u7684\u6570\u5b57
         */
        moneyCentRenderer:function (v) {
            if (BUI.isString(v)) {
                v = parseFloat(v);
            }
            if ($.isNumberic(v)) {
                return (v * 0.01).toFixed(2);
            }
            return v;
        }
    };

    return Format;
});
;(function(){
var BASE = 'bui/grid/plugins/';
define('bui/grid/plugins',['bui/common',BASE + 'selection',BASE + 'cascade',BASE + 'cellediting',BASE + 'rowediting',BASE + 'autofit',
	BASE + 'dialogediting',BASE + 'menu',BASE + 'summary',BASE + 'rownumber'],function (r) {
	var BUI = r('bui/common'),
		Selection = r(BASE + 'selection'),

		Plugins = {};

		BUI.mix(Plugins,{
			CheckSelection : Selection.CheckSelection,
			RadioSelection : Selection.RadioSelection,
			Cascade : r(BASE + 'cascade'),
			CellEditing : r(BASE + 'cellediting'),
			RowEditing : r(BASE + 'rowediting'),
			DialogEditing : r(BASE + 'dialogediting'),
			AutoFit : r(BASE + 'autofit'),
			GridMenu : r(BASE + 'menu'),
			Summary : r(BASE + 'summary'),
			RowNumber : r(BASE + 'rownumber')
		});
		
	return Plugins;
});
})();

define('bui/grid/plugins/menu',['bui/common','bui/menu'],function (require) {

  var BUI = require('bui/common'),
    Menu = require('bui/menu'),
    PREFIX = BUI.prefix,
    ID_SORT_ASC = 'sort-asc',
    ID_SORT_DESC = 'sort-desc',
    ID_COLUMNS_SET = 'column-setting',
    CLS_COLUMN_CHECKED = 'icon-check';

  /**
   * @class BUI.Grid.Plugins.GridMenu
   * @extends BUI.Base
   * \u8868\u683c\u83dc\u5355\u63d2\u4ef6
   */
  var gridMenu = function (config) {
    gridMenu.superclass.constructor.call(this,config);
  };

  BUI.extend(gridMenu,BUI.Base);

  gridMenu.ATTRS = 
  {
    /**
     * \u5f39\u51fa\u83dc\u5355
     * @type {BUI.Menu.ContextMenu}
     */
    menu : {

    },
    /**
     * @private
     */
    activedColumn : {

    },
    triggerCls : {
      value : PREFIX + 'grid-hd-menu-trigger'
    },
    /**
     * \u83dc\u5355\u7684\u914d\u7f6e\u9879
     * @type {Array}
     */
    items : {
      value : [
        {
          id:ID_SORT_ASC,
          text:'\u5347\u5e8f',
          iconCls:'icon-arrow-up'
        },
        {
          id:ID_SORT_DESC,
          text:'\u964d\u5e8f',
          iconCls : 'icon-arrow-down'
        },
        {
          xclass:'menu-item-sparator'
        },
        {
          id : ID_COLUMNS_SET,
          text:'\u8bbe\u7f6e\u5217',
          iconCls:'icon-list-alt'
        }
      ]
    }
  };

  BUI.augment(gridMenu,{
    /**
     * \u521d\u59cb\u5316
     * @protected
     */
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);

    },
    /**
     * \u6e32\u67d3DOM
     */
    renderUI : function(grid){
      var _self = this, 
        columns = grid.get('columns');
      BUI.each(columns,function(column){
        _self._addShowMenu(column);
      });
    },
    /**
     * \u7ed1\u5b9a\u8868\u683c
     * @protected
     */
    bindUI : function (grid){
      var _self = this;

      grid.on('columnadd',function(ev){
        _self._addShowMenu(ev.column);
      });
      grid.on('columnclick',function (ev) {
        var sender = $(ev.domTarget),
          column = ev.column,
          menu;

        _self.set('activedColumn',column);
        
        if(sender.hasClass(_self.get('triggerCls'))){
          menu = _self.get('menu') || _self._initMenu();
          menu.set('align',{
            node: sender, // \u53c2\u8003\u5143\u7d20, falsy \u6216 window \u4e3a\u53ef\u89c6\u533a\u57df, 'trigger' \u4e3a\u89e6\u53d1\u5143\u7d20, \u5176\u4ed6\u4e3a\u6307\u5b9a\u5143\u7d20
            points: ['bl','tl'], // ['tr', 'tl'] \u8868\u793a overlay \u7684 tl \u4e0e\u53c2\u8003\u8282\u70b9\u7684 tr \u5bf9\u9f50
            offset: [0, 0] 
          });
          menu.show();
          _self._afterShow(column,menu);
        }
      });
    },
    _addShowMenu : function(column){
      if(!column.get('fixed')){
        column.set('showMenu',true);
      }
    },
    //\u83dc\u5355\u663e\u793a\u540e
    _afterShow : function (column,menu) {
      var _self = this,
        grid = _self.get('grid');

      menu = menu || _self.get('menu');
      _self._resetSortMenuItems(column,menu);
      _self._resetColumnsVisible(menu);
    },
    //\u8bbe\u7f6e\u83dc\u5355\u9879\u662f\u5426\u9009\u4e2d
    _resetColumnsVisible : function (menu) {
      var _self = this,
        settingItem = menu.findItemById(ID_COLUMNS_SET),
        subMenu = settingItem.get('subMenu') || _self._initColumnsMenu(settingItem),
        columns = _self.get('grid').get('columns');
      subMenu.removeChildren(true);
      $.each(columns,function (index,column) {
        if(!column.get('fixed')){
          var config = {
              xclass : 'context-menu-item',
              text : column.get('title'),
              column : column,
              iconCls : 'icon'
            },
            menuItem = subMenu.addChild(config);
          if(column.get('visible')){
            menuItem.set('selected',true);
          }
        }
      });
    },
    //\u8bbe\u7f6e\u6392\u5e8f\u83dc\u5355\u9879\u662f\u5426\u53ef\u7528
    _resetSortMenuItems : function(column,menu) {
      var ascItem = menu.findItemById(ID_SORT_ASC),
        descItem = menu.findItemById(ID_SORT_DESC);
      if(column.get('sortable')){
        ascItem.set('disabled',false);
        descItem.set('disabled',false);
      }else{
        ascItem.set('disabled',true);
        descItem.set('disabled',true);
      }
    },
    //\u521d\u59cb\u5316\u83dc\u5355
    _initMenu : function () {
      var _self = this,
        menu = _self.get('menu'),
        menuItems;

      if(!menu){
        menuItems = _self.get('items');
        $.each(menuItems,function (index,item) {
          if(!item.xclass){
            item.xclass = 'context-menu-item'
          }
        });
        menu = new Menu.ContextMenu({
          children : menuItems,
          elCls : 'grid-menu'
        });
        _self._initMenuEvent(menu);
        _self.set('menu',menu)
      }
      return menu;
    },
    _initMenuEvent : function  (menu) {
      var _self = this;

      menu.on('itemclick',function(ev) {
        var item = ev.item,
          id = item.get('id'),
          activedColumn = _self.get('activedColumn');
        if(id === ID_SORT_ASC){
          activedColumn.set('sortState','ASC');
        }else if(id === ID_SORT_DESC){
          activedColumn.set('sortState','DESC');
        }
      });

      menu.on('afterVisibleChange',function (ev) {
        var visible = ev.newVal,
          activedColumn = _self.get('activedColumn');
        if(visible && activedColumn){
          activedColumn.set('open',true);
        }else{
          activedColumn.set('open',false);
        }
      });
    },
    _initColumnsMenu : function (settingItem) {
      var subMenu = new Menu.ContextMenu({
          multipleSelect : true,
          elCls : 'grid-column-menu'
        });  
      settingItem.set('subMenu',subMenu);
      subMenu.on('itemclick',function (ev) {
        var item = ev.item,
          column = item.get('column'),
          selected = item.get('selected');
        if(selected){
          column.set('visible',true);
        }else{
          column.set('visible',false);
        }
      });
      return subMenu;
    },
    destructor:function () {
      var _self = this,
        menu = _self.get('menu');
      if(menu){
        menu.destroy();
      }
      _self.off();
      _self.clearAttrVals();
    }

  });

  return gridMenu;

});
define('bui/grid/plugins/cascade',['bui/common'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_GRID_CASCADE = '',
    DATA_RECORD = 'data-record',
    CLS_CASCADE = PREFIX + 'grid-cascade',
    CLS_CASCADE_EXPAND = CLS_CASCADE + '-expand',
    CLS_CASCADE_ROW = CLS_CASCADE + '-row',
    CLS_CASCADE_CELL = CLS_CASCADE + '-cell',
    CLS_CASCADE_ROW_COLLAPSE = CLS_CASCADE + '-collapse';

  /**
   * \u7ea7\u8054\u8868\u683c
   * <pre><code>
   *  // \u5b9e\u4f8b\u5316 Grid.Plugins.Cascade \u63d2\u4ef6
   *    var cascade = new Grid.Plugins.Cascade({
   *      renderer : function(record){
   *        return '<div style="padding: 10px 20px;"><h2>\u8be6\u60c5\u4fe1\u606f</h2><p>' + record.detail + '</p></div>';
   *      }
   *    });
   *    var store = new Store({
   *        data : data,
   *        autoLoad:true
   *      }),
   *      grid = new Grid.Grid({
   *        render:'#grid',
   *        columns : columns,
   *        store: store,
   *        plugins: [cascade]  // Grid.Plugins.Cascade \u63d2\u4ef6
   *      });
   *
   *    grid.render();
   *    
   *    cascade.expandAll();//\u5c55\u5f00\u6240\u6709
   * </code></pre>
   * @class BUI.Grid.Plugins.Cascade
   * @extends BUI.Base
   */
  var cascade = function(config){
    cascade.superclass.constructor.call(this, config);
  };

  BUI.extend(cascade,BUI.Base);

  cascade.ATTRS = 
  /**
   * @lends BUI.Grid.Plugins.Cascade#
   * @ignore
   */
  {
    /**
     * \u663e\u793a\u5c55\u5f00\u6309\u94ae\u5217\u7684\u5bbd\u5ea6
     * @cfg {Number} width
     */
    /**
     * \u663e\u793a\u5c55\u5f00\u6309\u94ae\u5217\u7684\u5bbd\u5ea6
     * @type {Number}
     * @default 40
     */
    width:{
      value:40
    },
    /**
     * \u5c55\u5f00\u5217\u7684\u9ed8\u8ba4\u5185\u5bb9
     * @type {String}
     * @protected
     */
    cellInner:{
      value:'<span class="' + CLS_CASCADE + '"><i class="' + CLS_CASCADE + '-icon"></i></span>'
    },
    /**
     * \u5c55\u5f00\u884c\u7684\u6a21\u7248
     * @protected
     * @type {String}
     */
    rowTpl : {
      value:'<tr class="' + CLS_CASCADE_ROW + '"><td class="'+ CLS_CASCADE_CELL + '"></td></tr>'
    },
    /**
     * \u751f\u6210\u7ea7\u8054\u5217\u65f6\u9700\u8981\u6e32\u67d3\u7684\u5185\u5bb9
     * @cfg {Function} renderer
     */
    /**
     * \u751f\u6210\u7ea7\u8054\u5217\u65f6\u9700\u8981\u6e32\u67d3\u7684\u5185\u5bb9
     * @type {Function}
     */
    renderer:{

    },
    events : [
      /**
       * \u5c55\u5f00\u7ea7\u8054\u5185\u5bb9\u65f6\u89e6\u53d1
       * @name  BUI.Grid.Plugins.Cascade#expand
       * @event
       * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
       * @param {Object} e.record \u7ea7\u8054\u5185\u5bb9\u5bf9\u5e94\u7684\u7eaa\u5f55
       * @param {HTMLElement} e.row \u7ea7\u8054\u7684\u884cDOM
       */
      'expand',
      /**
       * \u6298\u53e0\u7ea7\u8054\u5185\u5bb9\u65f6\u89e6\u53d1
       * @name  BUI.Grid.Plugins.Cascade#collapse
       * @event
       * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
       * @param {Object} e.record \u7ea7\u8054\u5185\u5bb9\u5bf9\u5e94\u7684\u7eaa\u5f55
       * @param {HTMLElement} e.row \u7ea7\u8054\u7684\u884cDOM
       */
      'collapse',
      /**
       * \u5220\u9664\u7ea7\u8054\u5185\u5bb9\u65f6\u89e6\u53d1
       * @name  BUI.Grid.Plugins.Cascade#removed
       * @event
       * @param {jQuery.Event} e  \u4e8b\u4ef6\u5bf9\u8c61
       * @param {Object} e.record \u7ea7\u8054\u5185\u5bb9\u5bf9\u5e94\u7684\u7eaa\u5f55
       * @param {HTMLElement} e.row \u7ea7\u8054\u7684\u884cDOM
       */
      'removed'
    ]
  };

  BUI.augment(cascade,
  /**
   * @lends BUI.Grid.Plugins.Cascade.prototype
   * @ignore
   */
  {
    /**
     * \u521d\u59cb\u5316
     * @protected
     */
    initializer:function(grid){
      var _self = this;
      var cfg = {
            title : '',
            elCls:'center',//\u5c45\u4e2d\u5bf9\u9f50
            width : _self.get('width'),
            resizable:false,
            fixed : true,
            sortable : false,
            cellTpl : _self.get('cellInner')
        },
        expandColumn = grid.addColumn(cfg,0);
      //\u5217\u4e4b\u95f4\u7684\u7ebf\u53bb\u6389
      grid.set('innerBorder',false);

      _self.set('grid',grid);
    },
    /**
     * \u7ed1\u5b9a\u4e8b\u4ef6
     * @protected
     */
    bindUI:function(grid){
      var _self = this;
      grid.on('cellclick',function(ev){
        var sender = $(ev.domTarget),
          cascadeEl = sender.closest('.' + CLS_CASCADE);
        //\u5982\u679c\u70b9\u51fb\u5c55\u5f00\u3001\u6298\u53e0\u6309\u94ae
        if(cascadeEl.length){
          if(!cascadeEl.hasClass(CLS_CASCADE_EXPAND)){
            _self._onExpand(ev.record,ev.row,cascadeEl);
          }else{
            _self._onCollapse(ev.record,ev.row,cascadeEl);
          }
        }
      });

      grid.on('columnvisiblechange',function(){
        _self._resetColspan();
      });

      grid.on('rowremoved',function(ev){
        _self.remove(ev.record);
      });

      grid.on('clear',function(){
        _self.removeAll();
      });
    },
    /**
     * \u5c55\u5f00\u6240\u6709\u7ea7\u8054\u6570\u636e
     * <pre><code>
     *   cascade.expandAll();
     * </code></pre>
     */
    expandAll : function(){
      var _self = this,
        grid = _self.get('grid'),
        records = grid.getRecords();
        $.each(records,function(index,record){
          _self.expand(record);
        });
    },
    /**
     * \u5c55\u5f00\u67d0\u6761\u7eaa\u5f55
     * <pre><code>
     *   var record = grid.getItem('a');
     *   cascade.expand(record);
     * </code></pre>
     * @param  {Object} record \u7eaa\u5f55
     */
    expand : function(record){
      var _self = this,
        grid = _self.get('grid');

      var row = grid.findRow(record);
      if(row){
        _self._onExpand(record,row);
      }
    },
    /**
     * \u6298\u53e0\u67d0\u6761\u7eaa\u5f55
     * <pre><code>
     *   var record = grid.getItem('a');
     *   cascade.collapse(record);
     * </code></pre>
     * @param  {Object} record \u7eaa\u5f55
     */
    collapse : function(record){
      var _self = this,
        grid = _self.get('grid');

      var row = grid.findRow(record);
      if(row){
        _self._onCollapse(record,row);
      }
    },
    /**
     * \u79fb\u9664\u6240\u6709\u7ea7\u8054\u6570\u636e\u7684\uff24\uff2f\uff2d
     * @protected
     */
    removeAll : function(){
      var _self = this,
        rows = _self._getAllCascadeRows();

      rows.each(function(index,row){
      
        _self._removeCascadeRow(row);
      });
    },
    /**
     * \u6839\u636e\u7eaa\u5f55\u5220\u9664\u7ea7\u8054\u4fe1\u606f
     * @protected
     * @param  {Object} record \u7ea7\u8054\u4fe1\u606f\u5bf9\u5e94\u7684\u7eaa\u5f55
     */
    remove : function(record){
      var _self = this,
        cascadeRow = _self._findCascadeRow(record);
      if(cascadeRow){
        _self._removeCascadeRow(cascadeRow);
      }

    },
    /**
     * \u6298\u53e0\u6240\u6709\u7ea7\u8054\u6570\u636e
     * <pre><code>
     *  cascade.collapseAll();
     * </code></pre>
     */
    collapseAll : function(){
      var _self = this,
        grid = _self.get('grid'),
        records = grid.getRecords();
        $.each(records,function(index,record){
          _self.collapse(record);
        });
    },
    //\u83b7\u53d6\u7ea7\u8054\u6570\u636e
    _getRowRecord : function(cascadeRow){
      return $(cascadeRow).data(DATA_RECORD);
    },
    //\u79fb\u9664\u7ea7\u8054\u884c
    _removeCascadeRow : function(row){

      this.fire('removed',{record: $(row).data(DATA_RECORD),row : row});
      $(row).remove();
    },
    //\u901a\u8fc7\u7eaa\u5f55\u67e5\u627e
    _findCascadeRow: function(record){
      var _self = this,
        rows = _self._getAllCascadeRows(),
        result = null;

      $.each(rows,function(index,row){
        if(_self._getRowRecord(row) === record){
          result = row;
          return false;
        }
      });
      return result;
    },
    _getAllCascadeRows : function(){
      var _self = this,
        grid = _self.get('grid');
      return grid.get('el').find('.' + CLS_CASCADE_ROW);
    },
    //\u83b7\u53d6\u751f\u6210\u7684\u7ea7\u8054\u884c
    _getCascadeRow : function(gridRow){
      var nextRow = $(gridRow).next();
      if((nextRow).hasClass(CLS_CASCADE_ROW)){
        return nextRow;
      }
      return null;
      //return $(gridRow).next('.' + CLS_CASCADE_ROW);
    },
    //\u83b7\u53d6\u7ea7\u8054\u5185\u5bb9
    _getRowContent : function(record){
      var _self = this,
        renderer = _self.get('renderer'),
        content = renderer ? renderer(record) : '';
      return content;
    },
    //\u521b\u5efa\u7ea7\u8054\u884c
    _createCascadeRow : function(record,gridRow){
      var _self = this,
        rowTpl = _self.get('rowTpl'),
        content = _self._getRowContent(record),
        rowEl = $(rowTpl).insertAfter(gridRow);

      rowEl.find('.' + CLS_CASCADE_CELL).append($(content));
      rowEl.data(DATA_RECORD,record);
      return rowEl;
    },
    //\u5c55\u5f00
    _onExpand : function(record,row,cascadeEl){
      var _self = this,
        cascadeRow = _self._getCascadeRow(row),
        colspan = _self._getColumnCount(row);

      cascadeEl = cascadeEl || $(row).find('.'+CLS_CASCADE);
      cascadeEl.addClass(CLS_CASCADE_EXPAND);

      if(!cascadeRow || !cascadeRow.length){
        cascadeRow = _self._createCascadeRow(record,row);
      }
      $(cascadeRow).removeClass(CLS_CASCADE_ROW_COLLAPSE);

      _self._setColSpan(cascadeRow,row);
      
      _self.fire('expand',{record : record,row : cascadeRow[0]});
    },
    //\u6298\u53e0
    _onCollapse : function(record,row,cascadeEl){

      var _self = this,
        cascadeRow = _self._getCascadeRow(row);
      cascadeEl = cascadeEl || $(row).find('.'+CLS_CASCADE);
      cascadeEl.removeClass(CLS_CASCADE_EXPAND);

      if(cascadeRow || !cascadeRow.length){
        $(cascadeRow).addClass(CLS_CASCADE_ROW_COLLAPSE);
        _self.fire('collapse',{record : record,row : cascadeRow[0]});
      }
      
    },
    //\u83b7\u53d6\u663e\u793a\u7684\u5217\u6570
    _getColumnCount : function(row){
      return $(row).children().filter(function(){
        return $(this).css('display') !== 'none';
      }).length;
    },
    //\u8bbe\u7f6ecolspan
    _setColSpan : function(cascadeRow,gridRow){
      gridRow = gridRow || $(cascadeRow).prev();
      var _self = this,
        colspan = _self._getColumnCount(gridRow);

      $(cascadeRow).find('.' + CLS_CASCADE_CELL).attr('colspan',colspan)
    },
    //\u91cd\u7f6e\u6240\u6709\u7684colspan
    _resetColspan : function(){
      var _self = this,
        cascadeRows =  _self._getAllCascadeRows();
      $.each(cascadeRows,function(index,cascadeRow){
        _self._setColSpan(cascadeRow);
      });
    },
    /**
     * \u6790\u6784\u51fd\u6570
     */
    destructor : function(){
      var _self = this;
      _self.removeAll();
      _self.off();
      _self.clearAttrVals();
    }
  });

  return cascade;
});
define('bui/grid/plugins/selection',['bui/common'],function(require){

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_CHECKBOX = PREFIX + 'grid-checkBox',
    CLS_CHECK_ICON = 'x-grid-checkbox',
    CLS_RADIO = PREFIX + 'grid-radio';
    
  /**
  * \u9009\u62e9\u884c\u63d2\u4ef6
  * <pre><code>
  ** var store = new Store({
  *       data : data,
  *       autoLoad:true
  *     }),
  *     grid = new Grid.Grid({
  *       render:'#grid',
  *       columns : columns,
  *       itemStatusFields : { //\u8bbe\u7f6e\u6570\u636e\u8ddf\u72b6\u6001\u7684\u5bf9\u5e94\u5173\u7cfb
  *         selected : 'selected',
  *         disabled : 'disabled'
  *       },
  *       store : store,
  *       plugins : [Grid.Plugins.CheckSelection] // \u63d2\u4ef6\u5f62\u5f0f\u5f15\u5165\u591a\u9009\u8868\u683c
  *      //multiSelect: true  // \u63a7\u5236\u8868\u683c\u662f\u5426\u53ef\u4ee5\u591a\u9009\uff0c\u4f46\u662f\u8fd9\u79cd\u65b9\u5f0f\u6ca1\u6709\u524d\u9762\u7684\u590d\u9009\u6846 \u9ed8\u8ba4\u4e3afalse
  *     });
  *
  *   grid.render();
  * </code></pre>
  * @class BUI.Grid.Plugins.CheckSelection
  * @extends BUI.Base
  */
  function checkSelection(config){
    checkSelection.superclass.constructor.call(this, config);
  }

  BUI.extend(checkSelection,BUI.Base);

  checkSelection.ATTRS = 
  /**
   * @lends BUI.Grid.Plugins.CheckSelection.prototype
   * @ignore
   */ 
  {
    /**
    * column's width which contains the checkbox
    */
    width : {
      value : 40
    },
    /**
    * @private
    */
    column : {
      
    },
    /**
    * @private
    * <input  class="' + CLS_CHECKBOX + '" type="checkbox">
    */
    cellInner : {
      value : '<div class="'+CLS_CHECKBOX+'-container"><span class="' + CLS_CHECK_ICON +'"></span></div>'
    }
  };

  BUI.augment(checkSelection, 
  /**
   * @lends BUI.Grid.Plugins.CheckSelection.prototype
   * @ignore
   */ 
  {
    createDom : function(grid){
      var _self = this;
      var cfg = {
            title : '',
            width : _self.get('width'),
            fixed : true,
            resizable:false,
            sortable : false,
            tpl : '<div class="' + PREFIX + 'grid-hd-inner">' + _self.get('cellInner') + '',
            cellTpl : _self.get('cellInner')
        },
        checkColumn = grid.addColumn(cfg,0);
      grid.set('multipleSelect',true);
      _self.set('column',checkColumn);
    },
    /**
    * @private
    */
    bindUI : function(grid){
      var _self = this,
        col = _self.get('column'),
        colEl = col.get('el'),
        checkBox = colEl.find('.' + CLS_CHECK_ICON);
      checkBox.on('click',function(){
        var checked = colEl.hasClass('checked');     
        if(!checked){
          grid.setAllSelection();
          colEl.addClass('checked');
        }else{
          grid.clearSelection();
          colEl.removeClass('checked');
        }
      });
      grid.on('rowunselected',function(e){
        
        colEl.removeClass('checked');
      });
      
      //\u6e05\u9664\u7eaa\u5f55\u65f6\u53d6\u5168\u9009
      grid.on('clear',function(){
        //checkBox.attr('checked',false);
        colEl.removeClass('checked');
      });
    }
  });
  
  /**
   * \u8868\u683c\u5355\u9009\u63d2\u4ef6
   * @class BUI.Grid.Plugins.RadioSelection
   * @extends BUI.Base
   */
  var radioSelection = function(config){
    radioSelection.superclass.constructor.call(this, config);
  };

  BUI.extend(radioSelection,BUI.Base);

  radioSelection.ATTRS = 
  /**
   * @lends BUI.Grid.Plugins.RadioSelection#
   * @ignore
   */ 
  {
    /**
    * column's width which contains the checkbox
    */
    width : {
      value : 40
    },
    /**
    * @private
    */
    column : {
      
    },
    /**
    * @private
    */
    cellInner : {
      value : '<div class="' + PREFIX + 'grid-radio-container"><input  class="' + CLS_RADIO + '" type="radio"></div>'
    }
  };

  BUI.augment(radioSelection, {
    createDom : function(grid){
      var _self = this;
      var cfg = {
            title : '',
            width : _self.get('width'),
            resizable:false,
            fixed : true,
            sortable : false,
            cellTpl : _self.get('cellInner')
        },
        column = grid.addColumn(cfg,0);
      grid.set('multipleSelect',false);
      _self.set('column',column);
    },
    /**
    * @private
    */
    bindUI : function(grid){
      var _self = this;

      grid.on('rowselected',function(e){
        _self._setRowChecked(e.row,true);
      });

      grid.on('rowunselected',function(e){
        _self._setRowChecked(e.row,false);
      });
    },
    _setRowChecked : function(row,checked){
      var rowEl = $(row),
        radio = rowEl.find('.' + CLS_RADIO);
      radio.attr('checked',checked);
    }
  });

  /**
  * @name BUI.Grid.Plugins
  * @namespace \u8868\u683c\u63d2\u4ef6\u547d\u540d\u7a7a\u95f4
  * @ignore
  */
  var Selection  = {
    CheckSelection : checkSelection,
    RadioSelection : radioSelection
  };

  
  return Selection;
});
define('bui/grid/plugins/summary',['bui/common'],function (require) {

  var BUI = require('bui/common'),
    PREFIX = BUI.prefix,
    CLS_GRID_ROW = PREFIX + 'grid-row',
    CLS_GRID_BODY = PREFIX + 'grid-body',
    CLS_SUMMARY_ROW = PREFIX + 'grid-summary-row',
    CLS_GRID_CELL_INNER = PREFIX + 'grid-cell-inner',
    CLS_COLUMN_PREFIX = 'grid-td-',
    CLS_GRID_CELL_TEXT = PREFIX + 'grid-cell-text',
    CLS_GRID_CELL = PREFIX + 'grid-cell';

  /**
  * @private
  * @ignore
  */
  function getEmptyCellTemplate(colspan){
    if(colspan > 0) {
      return '<td class="' + CLS_GRID_CELL + '" colspan="' + colspan + '">&nbsp;</td>';
    } 
    return '';
  }

  /**
   * @private
   * @ignore
   */
  function getCellTemplate(text,id){
    return '<td class="' + CLS_GRID_CELL + ' '+ CLS_COLUMN_PREFIX + id + '">' +
      getInnerTemplate(text) +
    '</td>';
  }

  /**
   * @private
   * @ignore
   */
  function getInnerTemplate(text){
    return '<div class="' + CLS_GRID_CELL_INNER + '" >' + 
      '<span class="'+CLS_GRID_CELL_TEXT+' ">' + text + '</span>' + 
      '</div>' ;
  }

  /**
   * @private
   * @ignore
   */
  function getLastEmptyCell(){
    return '<td class="' + CLS_GRID_CELL + ' ' + CLS_GRID_CELL + '-empty">&nbsp;</td>';
  }


  /**
   * \u8868\u683c\u83dc\u5355\u63d2\u4ef6 
   * <pre><code>
   * var store = new Store({
   *      url : 'data/summary.json',
   *      pageSize : 10,
   *      autoLoad:true
   *    }),
   *    grid = new Grid.Grid({
   *      render:'#grid',
   *      columns : columns,
   *      store: store,
   *      bbar : {pagingBar : true},
   *      plugins : [Grid.Plugins.Summary] // \u63d2\u4ef6\u5f62\u5f0f\u5f15\u5165\u5355\u9009\u8868\u683c
   *    });
   *
   *  grid.render();
   * </code></pre>
   * @class BUI.Grid.Plugins.Summary
   */
  var summary = function (config) {
    summary.superclass.constructor.call(this,config);
  };

  summary.ATTRS = 
  {

    footerTpl : {
      value : '<tfoot></tfoot>'
    },
    footerEl : {

    },
    /**
     * \u603b\u6c47\u603b\u884c\u7684\u6807\u9898
     * @type {String}
     * @default '\u603b\u6c47\u603b'
     */
    summaryTitle : {
      value : '\u67e5\u8be2\u5408\u8ba1'
    },
    /**
     * \u672c\u9875\u6c47\u603b\u7684\u6807\u9898
     * @type {String}
     */
    pageSummaryTitle : {
      value : '\u672c\u9875\u5408\u8ba1'
    },
    /**
     * \u5728\u5217\u5bf9\u8c61\u4e2d\u914d\u7f6e\u7684\u5b57\u6bb5
     * @type {String}
     * @default 'summary'
     */
    field : {
      value : 'summary'
    },
    /**
     * \u672c\u9875\u6c47\u603b\u503c\u7684\u8bb0\u5f55
     * @type {String}
     */
    pageSummaryField: {
      value : 'pageSummary'
    },
    /**
     * \u603b\u6c47\u603b\u503c\u7684\u8bb0\u5f55
     * @type {String}
     */
    summaryField : {
      value : 'summary'
    },
    /**
     * @private
     * \u672c\u9875\u6c47\u603b\u503c
     * @type {Object}
     */
    pageSummary : {

    },
    /**
     * @private
     * \u603b\u6c47\u603b
     * @type {Object}
     */
    summary : {

    }
  };

  BUI.extend(summary,BUI.Base);

  BUI.augment(summary,{
    //\u521d\u59cb\u5316
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);
    },
    //\u6dfb\u52a0DOM\u7ed3\u6784
    renderUI : function(grid){
      var _self = this,
        bodyEl = grid.get('el').find('.' + CLS_GRID_BODY),
        bodyTable = bodyEl.find('table'),
        footerEl = $(_self.get('footerTpl')).appendTo(bodyTable);
      _self.set('footerEl',footerEl);
    },
    //\u7ed1\u5b9a\u4e8b\u4ef6
    bindUI : function(grid){
      //\u7ed1\u5b9a\u83b7\u53d6\u6570\u636e
      var _self = this,
        store = grid.get('store');
      if(store){
        store.on('beforeprocessload',function(ev){
          _self._processSummary(ev.data);
        });
        store.on('add',function(){
          _self.resetPageSummary();
        });
        store.on('remove',function(){
          _self.resetPageSummary();
        });
        store.on('update',function(){
          _self.resetPageSummary();
        });
      }
      grid.on('aftershow',function(){
        _self.resetSummary();
      });

      grid.get('header').on('afterVisibleChange',function(){
        _self.resetSummary();
      });
    },
    //\u5904\u7406\u6c47\u603b\u6570\u636e
    _processSummary : function(data){
      var _self = this,
        footerEl = _self.get('footerEl');

      footerEl.empty();
      if(!data){
        return;
      }

      var pageSummary = data[_self.get('pageSummaryField')],
        summary = data[_self.get('summaryField')];

      _self.set('pageSummary',pageSummary);
      _self.set('summary',summary);
    },
    /**
     * \u91cd\u65b0\u8bbe\u7f6e\u672c\u9875\u6c47\u603b
     */
    resetPageSummary : function(){
      var _self = this,
        grid = _self.get('grid'),
        columns = grid.get('columns'),
        pageSummary = _self._calculatePageSummary(),
        pageEl = _self.get('pageEl');
      _self.set('pageSummary',pageSummary);
      if(pageEl){
        BUI.each(columns,function(column){
          if(column.get('summary') && column.get('visible')){
            var id = column.get('id'),
              cellEl = pageEl.find('.' + CLS_COLUMN_PREFIX + id),
              text = _self._getSummaryCellText(column,pageSummary);
            cellEl.find('.' + CLS_GRID_CELL_TEXT).text(text);
          }
        });
        _self._updateFirstRow(pageEl,_self.get('pageSummaryTitle'));
      }
    },
    //\u91cd\u7f6e\u6c47\u603b\u6570\u636e
    resetSummary : function(pageSummary,summary){
      var _self = this,
        footerEl = _self.get('footerEl'),
        pageEl = null;

      footerEl.empty();

      pageSummary = pageSummary || _self.get('pageSummary');
      if(!pageSummary){
        pageSummary = _self._calculatePageSummary();
        _self.set('pageSummary',pageSummary);
      }
      summary = summary || _self.get('summary');
      pageEl = _self._creatSummaryRow(pageSummary,_self.get('pageSummaryTitle'));
      _self.set('pageEl',pageEl);
      _self._creatSummaryRow(summary,_self.get('summaryTitle'));
    },
    //\u521b\u5efa\u6c47\u603b
    _creatSummaryRow : function(summary,title){
      if(!summary){
        return null;
      }
      var _self = this,
        footerEl = _self.get('footerEl'),
        tpl = _self._getSummaryTpl(summary),
        rowEl = $(tpl).appendTo(footerEl);
      
      _self._updateFirstRow(rowEl,title);
      return rowEl;
    },
    _updateFirstRow : function(rowEl,title){
      var firstCell = rowEl.find('td').first(),
          textEl = firstCell.find('.' + CLS_GRID_CELL_INNER);
      if(textEl.length){
        var textPrefix = title + ': ';
          text = textEl.text();
        if(text.indexOf(textPrefix) === -1){
          text = textPrefix + text;
        }
        firstCell.html(getInnerTemplate(text));
      }else{
        firstCell.html(getInnerTemplate(title + ':'));
      }
    },
    //\u83b7\u53d6\u6c47\u603b\u6a21\u677f
    _getSummaryTpl : function(summary){
      var _self = this,
        grid = _self.get('grid'),
        columns = grid.get('columns'),
        cellTempArray = [],
        prePosition = -1, //\u4e0a\u6b21\u6c47\u603b\u5217\u7684\u4f4d\u7f6e
        currentPosition = -1,//\u5f53\u524d\u4f4d\u7f6e
        rowTemplate = null;

      $.each(columns, function (colindex,column) {
        if(column.get('visible')){
          currentPosition += 1;
          if(column.get('summary')){
            cellTempArray.push(getEmptyCellTemplate(currentPosition-prePosition - 1));

            var text = _self._getSummaryCellText(column,summary),
              temp = getCellTemplate(text,column.get('id'));
            cellTempArray.push(temp);
            prePosition = currentPosition;
          }
        }
      });
      if(prePosition !== currentPosition){
        cellTempArray.push(getEmptyCellTemplate(currentPosition-prePosition));
      }

      rowTemplate = ['<tr class="', CLS_SUMMARY_ROW,' ', CLS_GRID_ROW, '">', cellTempArray.join(''),getLastEmptyCell(), '</tr>'].join('');
      return rowTemplate;
    },
    //\u83b7\u53d6\u6c47\u603b\u5355\u5143\u683c\u5185\u5bb9
    _getSummaryCellText : function(column,summary){
      var _self = this,
        val = summary[column.get('dataIndex')],
        value = val == null ? '' : val,
        renderer = column.get('renderer'),
        text = renderer ? renderer(value,summary) : value;
      return text;
    },
    _calculatePageSummary : function(){
      var _self = this,
        grid = _self.get('grid'),
        store = grid.get('store'),
        columns = grid.get('columns'),
        rst = {};

      BUI.each(columns,function(column){
        if(column.get('summary')){
          var dataIndex = column.get('dataIndex');
          rst[dataIndex] = store.sum(dataIndex);
        }
      });
      
      return rst;
    }
  });

  return summary;
});
define('bui/grid/plugins/editing',function (require) {

  var CLS_CELL_INNER = BUI.prefix + 'grid-cell-inner',
    CLS_CELL_ERROR = BUI.prefix + 'grid-cell-error';
  /**
   * \u8868\u683c\u7684\u7f16\u8f91\u63d2\u4ef6
   * @class BUI.Grid.Plugins.Editing
   */
  function Editing(config){
    Editing.superclass.constructor.call(this, config);
  }

  BUI.extend(Editing,BUI.Base);

  Editing.ATTRS = {
    /**
     * @protected
     * \u7f16\u8f91\u5668\u7684\u5bf9\u9f50\u8bbe\u7f6e
     * @type {Object}
     */
    align : {
      value : {
        points: ['cl','cl']
      }
    },
    /**
     * \u662f\u5426\u76f4\u63a5\u5728\u8868\u683c\u4e0a\u663e\u793a\u9519\u8bef\u4fe1\u606f
     * @type {Boolean}
     */
    showError : {
      value : true
    },
    errorTpl : {
      value : '<span class="x-icon ' + CLS_CELL_ERROR + ' x-icon-mini x-icon-error" title="{error}">!</span>'
    },
    /**
     * \u662f\u5426\u521d\u59cb\u5316\u8fc7\u7f16\u8f91\u5668
     * @protected
     * @type {Boolean}
     */
    isInitEditors : {
      value : false
    },
    /**
     * \u6b63\u5728\u7f16\u8f91\u7684\u8bb0\u5f55
     * @type {Object}
     */
    record : {

    },
    /**
     * \u5f53\u524d\u7f16\u8f91\u7684\u7f16\u8f91\u5668
     * @type {Object}
     */
    curEditor : {

    },
    /**
     * \u662f\u5426\u53d1\u751f\u8fc7\u9a8c\u8bc1
     * @type {Boolean}
     */
    hasValid : {

    },
    /**
     * \u7f16\u8f91\u5668
     * @protected
     * @type {Object}
     */
    editors : {
      value : []
    },
    /**
     * \u89e6\u53d1\u7f16\u8f91\u6837\u5f0f\uff0c\u4e3a\u7a7a\u65f6\u9ed8\u8ba4\u70b9\u51fb\u6574\u884c\u90fd\u4f1a\u89e6\u53d1\u7f16\u8f91
     * @type {String}
     */
    triggerCls : {

    },
    /**
     * \u8fdb\u884c\u7f16\u8f91\u65f6\u662f\u5426\u89e6\u53d1\u9009\u4e2d
     * @type {Boolean}
     */
    triggerSelected : {
      value : true
    }
  };

  BUI.augment(Editing,{
    /**
     * \u521d\u59cb\u5316
     * @protected
     */
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);
      _self.initEditing(grid);
      
    },
    renderUI : function(){
      var _self = this,
        grid = _self.get('grid');
      //\u5ef6\u8fdf\u52a0\u8f7d editor\u6a21\u5757
      BUI.use('bui/editor',function(Editor){
        _self.initEditors(Editor);
        _self._initGridEvent(grid);
        _self.set('isInitEditors',true);
      });
    },
    /**
     * \u521d\u59cb\u5316\u63d2\u4ef6
     * @protected
     */
    initEditing : function(grid){

    },
    _getCurEditor : function(){
      return this.get('curEditor');
    },
    _initGridEvent : function(grid){
      var _self = this,
        header = grid.get('header');

      grid.on('cellclick',function(ev){

        var editor = null,
          domTarget = ev.domTarget,
          triggerCls = _self.get('triggerCls'),
          curEditor = _self._getCurEditor();
        if(curEditor && curEditor.get('acceptEvent')){
          curEditor.accept();
          curEditor.hide();
        }else{
          curEditor && curEditor.cancel();
        }

        //if(ev.field){
          editor = _self.getEditor(ev.field);
        //}
        if(editor && $(domTarget).closest('.' + triggerCls).length){
          _self.showEditor(editor,ev);
          //if(curEditor && curEditor.get('acceptEvent')){
          if(!_self.get('triggerSelected')){
            return false; //\u6b64\u65f6\u4e0d\u89e6\u53d1\u9009\u4e2d\u4e8b\u4ef6
          }
            
          //}
        }
      });

      grid.on('rowcreated',function(ev){
        validRow(ev.record,ev.row);
      });

      grid.on('rowremoved',function(ev){
        if(_self.get('record') == ev.record){
          _self.cancel();
        }
      });

      grid.on('rowupdated',function(ev){
        validRow(ev.record,ev.row);
      });

      grid.on('scroll',function(ev){
        var editor = _self._getCurEditor();
        if(editor){

          var align = editor.get('align'),
            node = align.node,
            pos = node.position();
          if(pos.top < 0 || pos.top > ev.bodyHeight){
            editor.hide();
          }else{
            editor.set('align',align);
            editor.show();
          }
          
        }
      });

      header.on('afterVisibleChange',function(ev){
        if(ev.target && ev.target != header){
          var column = ev.target;
          _self.onColumnVisibleChange(column);
        }
      });

      function validRow(record,row){
        if(_self.get('hasValid')){
          _self.validRecord(record,_self.getFields(),$(row));
        }
      }

    },
    /**
     * \u521d\u59cb\u5316\u6240\u6709
     * @protected
     */
    initEditors : function(Editor){
      var _self = this,
        grid = _self.get('grid'),
        fields = [],
        columns = grid.get('columns');
      BUI.each(columns,function(column){
        var field = _self.getFieldConfig(column);
        if(field){
          field.name = column.get('dataIndex');
          field.id = column.get('id');
          if(field.validator){
            field.validator = _self.wrapValidator(field.validator);
          }
          fields.push(field);
        }
      });
      var cfgs = _self.getEditorCfgs(fields);
      BUI.each(cfgs,function(cfg){
        _self.initEidtor(cfg,Editor);
      });
    },
    /**
     * @protected
     * \u83b7\u53d6\u5217\u5b9a\u4e49\u4e2d\u7684\u5b57\u6bb5\u5b9a\u4e49\u4fe1\u606f
     * @param  {BUI.Grid.Column} column \u5217\u5b9a\u4e49
     * @return {Object}  \u5b57\u6bb5\u5b9a\u4e49
     */
    getFieldConfig : function(column){
      return column.get('editor');
    },
    /**
     * \u5c01\u88c5\u9a8c\u8bc1\u65b9\u6cd5
     * @protected
     */
    wrapValidator : function(validator){
      var _self = this;
      return function(value){
        var record = _self.get('record');
        return validator(value,record);
      };
    },
    /**
     * @protected
     * \u5217\u663e\u793a\u9690\u85cf\u65f6
     */
    onColumnVisibleChange : function(column){

    },
    /**
     * @protected
     * \u83b7\u53d6\u7f16\u8f91\u5668\u7684\u914d\u7f6e
     * @template
     * @param  {Array} fields \u5b57\u6bb5\u914d\u7f6e
     * @return {Array} \u7f16\u8f91\u5668\u7684\u914d\u7f6e\u9879
     */
    getEditorCfgs : function(fields){

    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u5668\u7684\u6784\u9020\u51fd\u6570
     * @param  {Object} Editor \u547d\u540d\u7a7a\u95f4
     * @return {Function}       \u6784\u9020\u51fd\u6570
     */
    getEditorConstructor : function(Editor){
      return Editor.Editor;
    },
    /**
     * \u521d\u59cb\u5316\u7f16\u8f91\u5668
     * @private
     */
    initEidtor : function(cfg,Editor){
      var _self = this,
        con = _self.getEditorConstructor(Editor),
        editor = new con(cfg);
      editor.render();
      _self.get('editors').push(editor);
      _self.bindEidtor(editor);
      return editor;
    },
    /**
     * @protected
     * \u7ed1\u5b9a\u7f16\u8f91\u5668\u4e8b\u4ef6
     * @param  {BUI.Editor.Editor} editor \u7f16\u8f91\u5668
     */
    bindEidtor : function(editor){
      var _self = this,
        grid = _self.get('grid'),
        store = grid.get('store');
      editor.on('accept',function(){
        var record = _self.get('record');
        _self.updateRecord(store,record,editor);
        _self.set('curEditor',null);
      });

      editor.on('cancel',function(){
        _self.set('curEditor',null);
      });
    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u5668
     * @protected
     * @param  {String} field \u5b57\u6bb5\u503c
     * @return {BUI.Editor.Editor}  \u7f16\u8f91\u5668
     */
    getEditor : function(options){

    },
    /**
     * @protected
     * \u83b7\u53d6\u5bf9\u9f50\u7684\u8282\u70b9
     * @template
     * @param  {Object} options \u70b9\u51fb\u5355\u5143\u683c\u7684\u4e8b\u4ef6\u5bf9\u8c61
     * @return {jQuery} 
     */
    getAlignNode : function(options){

    },
    /**
     * @protected
     * \u83b7\u53d6\u7f16\u8f91\u7684\u503c
     * @param  {Object} options \u70b9\u51fb\u5355\u5143\u683c\u7684\u4e8b\u4ef6\u5bf9\u8c61
     * @return {*}   \u7f16\u8f91\u7684\u503c
     */
    getEditValue : function(options){

    },
    /**
     * \u663e\u793a\u7f16\u8f91\u5668
     * @protected
     * @param  {BUI.Editor.Editor} editor 
     */
    showEditor : function(editor,options){
      var _self = this,
        value = _self.getEditValue(options),
        alignNode = _self.getAlignNode(options);

      _self.beforeShowEditor(editor,options);
      _self.set('record',options.record);
      editor.setValue(value);
      if(alignNode){
        var align = _self.get('align');
        align.node = alignNode;
        editor.set('align',align);
      }

      editor.show();
      _self.focusEditor(editor,options.field);
      _self.set('curEditor',editor);
    },
    /**
     * @protected
     * \u7f16\u8f91\u5668\u5b57\u6bb5\u5b9a\u4f4d
     */
    focusEditor : function(editor,field){
      editor.focus();
    },
    /**
     * \u663e\u793a\u7f16\u8f91\u5668\u524d
     * @protected
     * @template
     * @param  {BUI.Editor.Editor} editor 
     * @param  {Object} options
     */
    beforeShowEditor : function(editor,options){

    },
    //\u521b\u5efa\u7f16\u8f91\u7684\u914d\u7f6e\u9879
    _createEditOptions : function(record,field){
      var _self = this,
        grid = _self.get('grid'),
        rowEl = grid.findRow(record),
        column = grid.findColumnByField(field),
        cellEl = grid.findCell(column.get('id'),rowEl);
      return {
        record : record,
        field : field,
        cell : cellEl[0],
        row : rowEl[0]
      };
    },
    /**
     * \u9a8c\u8bc1\u8868\u683c\u662f\u5426\u901a\u8fc7\u9a8c\u8bc1
     */
    valid : function(){
      var _self = this,
        grid = _self.get('grid'),
        store = grid.get('store');

      if(store){
        var records = store.getResult();
        BUI.each(records,function(record){
          _self.validRecord(record,_self.getFields());
        });
      }
      _self.set('hasValid',true);
    },
    isValid : function(){
      var _self = this,
        grid = _self.get('grid');
      if(!_self.get('hasValid')){
        _self.valid();
      }
      return !grid.get('el').find('.' + CLS_CELL_ERROR).length;
    },
    /**
     * \u6e05\u7406\u9519\u8bef
     */
    clearErrors : function(){
      var _self = this,
        grid = _self.get('grid');
      grid.get('el').find('.' + CLS_CELL_ERROR).remove();
    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u7684\u5b57\u6bb5
     * @protected
     * @param  {Array} editors \u7f16\u8f91\u5668
     * @return {Array}  \u5b57\u6bb5\u96c6\u5408
     */
    getFields : function(editors){
      
    },
    /**
     * \u6821\u9a8c\u8bb0\u5f55
     * @protected
     * @param  {Object} record \u6821\u9a8c\u7684\u8bb0\u5f55
     * @param  {Array} fields \u5b57\u6bb5\u7684\u96c6\u5408
     */
    validRecord : function(record,fields,row){
      var _self = this,
        errors = [];
      _self.setInternal('record',record);
      fields = fields || _self.getFields();
      BUI.each(fields,function(field){
        var name = field.get('name'),
          value = record[name] || '',
          error = field.getValidError(value);
        if(error){
          errors.push({name : name,error : error,id : field.get('id')});
        }
      });
      _self.showRecordError(record,errors,row);
    },
    showRecordError : function(record,errors,row){
      var _self = this,
        grid = _self.get('grid');
      row = row || grid.findRow(record);
      if(row){
        _self._clearRowError(row);
        BUI.each(errors,function(item){
          var cell = grid.findCell(item.id,row);
          _self._showCellError(cell,item.error);
        });
      }
    },
    /**
     * \u66f4\u65b0\u6570\u636e
     * @protected
     * @param  {Object} record \u7f16\u8f91\u7684\u6570\u636e
     * @param  {*} value  \u7f16\u8f91\u503c
     */
    updateRecord : function(store,record,editor){
     
    },
    _clearRowError : function(row){
      row.find('.' + CLS_CELL_ERROR).remove();
    },
    _showCellError : function(cell,error){
      var _self = this,
        errorTpl = BUI.substitute(_self.get('errorTpl'),{error : error}),
        innerEl = cell.find('.' + CLS_CELL_INNER);
      $(errorTpl).appendTo(innerEl);
    },
    /**
     * \u7f16\u8f91\u8bb0\u5f55
     * @param  {Object} record \u9700\u8981\u7f16\u8f91\u7684\u8bb0\u5f55
     * @param  {String} field \u7f16\u8f91\u7684\u5b57\u6bb5
     */
    edit : function(record,field){
      var _self = this,
        options = _self._createEditOptions(record,field),
        editor = _self.getEditor(field);
      _self.showEditor(editor,options);
    },
    /**
     * \u53d6\u6d88\u7f16\u8f91
     */
    cancel : function(){
      var _self = this,
        editors = _self.get('editors');
      BUI.each(editors,function(editor){
        if(editor.get('visible')){
          editor.cancel();
        }
      });
      _self.set('curEditor',null);
      _self.set('record',null);
    },  
    /**
     * \u6790\u6784\u51fd\u6570
     * @protected
     */
    destructor:function () {
      var _self = this,
        editors = _self.get('editors');
      
      BUI.each(editors,function(editor){
        editor.destroy || editor.destroy();
      });
      _self.off();
      _self.clearAttrVals();
    }

  });

  return Editing;
});
define('bui/grid/plugins/cellediting',['bui/grid/plugins/editing'],function (require) {
  var Editing = require('bui/grid/plugins/editing'),
    CLS_BODY = BUI.prefix + 'grid-body',
    CLS_CELL = BUI.prefix + 'grid-cell';

  /**
   * @class BUI.Grid.Plugins.CellEditing
   * @extends BUI.Grid.Plugins.Editing
   * \u5355\u5143\u683c\u7f16\u8f91\u63d2\u4ef6
   */
  var CellEditing = function(config){
    CellEditing.superclass.constructor.call(this, config);
  };

  CellEditing.ATTRS = {
    /**
     * \u89e6\u53d1\u7f16\u8f91\u6837\u5f0f\uff0c\u4e3a\u7a7a\u65f6\u9ed8\u8ba4\u70b9\u51fb\u6574\u884c\u90fd\u4f1a\u89e6\u53d1\u7f16\u8f91
     * @cfg {String} [triggerCls = 'bui-grid-cell']
     */
    triggerCls : {
      value : CLS_CELL
    }
  };

  BUI.extend(CellEditing,Editing);

  BUI.augment(CellEditing,{
    /**
     * @protected
     * \u83b7\u53d6\u7f16\u8f91\u5668\u7684\u914d\u7f6e\u9879
     * @param  {Array} fields \u5b57\u6bb5\u914d\u7f6e
     */ 
    getEditorCfgs : function(fields){
      var _self = this,
        grid = _self.get('grid'),
        bodyNode = grid.get('el').find('.' + CLS_BODY),
        rst = [];
      BUI.each(fields,function(field){
        var cfg = {field : field,changeSourceEvent : null,hideExceptNode : bodyNode,autoUpdate : false,preventHide : false,editableFn : field.editableFn};
        if(field.xtype === 'checkbox'){
          cfg.innerValueField = 'checked';
        }
        rst.push(cfg);
      });

      return rst;
    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u5668
     * @protected
     * @param  {String} field \u5b57\u6bb5\u503c
     * @return {BUI.Editor.Editor}  \u7f16\u8f91\u5668
     */
    getEditor : function(field){
      if(!field){
        return null;
      }
      var  _self = this,
        editors = _self.get('editors'),
        editor = null;

      BUI.each(editors,function(item){
        if(item.get('field').get('name') === field){
          editor = item;
          return false;
        }
      });
      return editor;
    },
    /**
     * \u663e\u793a\u7f16\u8f91\u5668\u524d
     * @protected
     * @param  {BUI.Editor.Editor} editor 
     * @param  {Object} options
     */
    beforeShowEditor : function(editor,options){
      var _self = this,
        cell = $(options.cell);
      _self.resetWidth(editor,cell.outerWidth());
      _self._makeEnable(editor,options);
    },
    _makeEnable : function(editor,options){
      var editableFn = editor.get('editableFn'),
        field,
        enable,
        record;
      if(BUI.isFunction(editableFn)){
        field = options.field;
        record = options.record;
        if(record && field){
          enable = editableFn(record[field],record);
          if(enable){
            editor.get('field').enable();
          }else{
            editor.get('field').disable();
          }
        }
        
      }
    },
    resetWidth : function(editor,width){
      editor.set('width',width);
    },
    /**
     * \u66f4\u65b0\u6570\u636e
     * @protected
     * @param  {Object} record \u7f16\u8f91\u7684\u6570\u636e
     * @param  {*} value  \u7f16\u8f91\u503c
     */
    updateRecord : function(store,record,editor){
      var _self = this,
          value = editor.getValue(),
          fieldName = editor.get('field').get('name'),
          preValue = record[fieldName];
        value = BUI.isDate(value) ? value.getTime() : value;
        if(preValue !== value){
          store.setValue(record,fieldName,value);
        }
    },
    /**
     * @protected
     * \u83b7\u53d6\u5bf9\u9f50\u7684\u8282\u70b9
     * @override
     * @param  {Object} options \u70b9\u51fb\u5355\u5143\u683c\u7684\u4e8b\u4ef6\u5bf9\u8c61
     * @return {jQuery} 
     */
    getAlignNode : function(options){
      return $(options.cell);
    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u7684\u5b57\u6bb5
     * @protected
     * @return {Array}  \u5b57\u6bb5\u96c6\u5408
     */
    getFields : function(){
      var rst = [],
        _self = this,
        editors = _self.get('editors');
      BUI.each(editors,function(editor){
        rst.push(editor.get('field'));
      });
      return rst;
    },
    /**
     * @protected
     * \u83b7\u53d6\u8981\u7f16\u8f91\u7684\u503c
     * @param  {Object} options \u70b9\u51fb\u5355\u5143\u683c\u7684\u4e8b\u4ef6\u5bf9\u8c61
     * @return {*}   \u7f16\u8f91\u7684\u503c
     */
    getEditValue : function(options){
      if(options.record && options.field){
        var value = options.record[options.field];
        return value == null ? '' : value;
      }
      return '';
    }
  });

  return CellEditing;
});
define('bui/grid/plugins/rowediting',['bui/common','bui/grid/plugins/editing'],function (require) {
   var BUI = require('bui/common'),
    Editing = require('bui/grid/plugins/editing'),
    CLS_ROW = BUI.prefix + 'grid-row';

  /**
   * @class BUI.Grid.Plugins.RowEditing
   * @extends BUI.Grid.Plugins.Editing
   * \u5355\u5143\u683c\u7f16\u8f91\u63d2\u4ef6
   */
  var RowEditing = function(config){
    RowEditing.superclass.constructor.call(this, config);
  };

  RowEditing.ATTRS = {
     /**
     * @protected
     * \u7f16\u8f91\u5668\u7684\u5bf9\u9f50\u8bbe\u7f6e
     * @type {Object}
     */
    align : {
      value : {
        points: ['tl','tl'],
        offset : [-2,0]
      }
    },
    /**
     * \u89e6\u53d1\u7f16\u8f91\u6837\u5f0f\uff0c\u4e3a\u7a7a\u65f6\u9ed8\u8ba4\u70b9\u51fb\u6574\u884c\u90fd\u4f1a\u89e6\u53d1\u7f16\u8f91
     * @cfg {String} [triggerCls = 'bui-grid-row']
     */
    triggerCls : {
      value : CLS_ROW
    }
  };

  BUI.extend(RowEditing,Editing);

  BUI.augment(RowEditing,{

    /**
     * @protected
     * \u83b7\u53d6\u7f16\u8f91\u5668\u7684\u914d\u7f6e\u9879
     * @param  {Array} fields \u5b57\u6bb5\u914d\u7f6e
     */ 
    getEditorCfgs : function(fields){
      var rst = [];
      rst.push({
        changeSourceEvent : null,
        autoUpdate : false,
        form : {
          children : fields,
          buttonBar : {
            elCls : 'centered toolbar'
          }
        }
      });
      return rst;
    },
    /**
     * \u5c01\u88c5\u9a8c\u8bc1\u65b9\u6cd5
     * @protected
     */
    wrapValidator : function(validator){
      var _self = this;
      return function(value){
        var editor = _self.get('curEditor'),
          record = editor ? editor.getValue() : _self.get('record');
        if(record){
          return validator(value,record);
        }
      };
    },
    /**
     * @protected
     * \u7f16\u8f91\u5668\u5b57\u6bb5\u5b9a\u4f4d
     */
    focusEditor : function(editor,field){
      var form = editor.get('form'),
        control = form.getField(field);
      if(control){
        control.focus();
      }
    },
    /**
     * @protected
     * \u83b7\u53d6\u5217\u5b9a\u4e49\u4e2d\u7684\u5b57\u6bb5\u5b9a\u4e49\u4fe1\u606f
     * @param  {BUI.Grid.Column} column \u5217\u5b9a\u4e49
     * @return {Object}  \u5b57\u6bb5\u5b9a\u4e49
     */
    getFieldConfig : function(column){
      var editor = column.get('editor');
      if(editor){
        if(editor.xtype === 'checkbox'){
          editor.innerValueField = 'checked';
        }
        return editor;
      }
      var cfg = {xtype : 'plain'};
      if(column.get('dataIndex') && column.get('renderer')){
        cfg.renderer = column.get('renderer');
        //cfg.id = column.get('id');
      }
      return cfg;
    },
    /**
     * \u66f4\u65b0\u6570\u636e
     * @protected
     * @param  {Object} record \u7f16\u8f91\u7684\u6570\u636e
     * @param  {*} value  \u7f16\u8f91\u503c
     */
    updateRecord : function(store,record,editor){
      var _self = this,
          value = editor.getValue();
        BUI.each(value,function(v,k){
          if(BUI.isDate(v)){
            value[k] = v.getTime();
          }
        });
        BUI.mix(record,value);
        
        store.update(record);
    },
     /**
     * \u83b7\u53d6\u7f16\u8f91\u6b64\u5355\u5143\u683c\u7684\u7f16\u8f91\u5668
     * @protected
     * @param  {String} field \u70b9\u51fb\u5355\u5143\u683c\u7684\u5b57\u6bb5
     * @return {BUI.Editor.Editor}  \u7f16\u8f91\u5668
     */
    getEditor : function(field){
      var _self = this,
        editors = _self.get('editors');
      return editors[0];
    },
    /**
     * @override
     * \u5217\u53d1\u751f\u6539\u53d8
     */
    onColumnVisibleChange : function(column){
      var _self = this,
        id = column.get('id'),
        editor = _self.getEditor(),
        field = editor.getChild(id,true);
      if(field){
        field.set('visible',column.get('visible'));
      }
    },
    /**
     * \u663e\u793a\u7f16\u8f91\u5668\u524d
     * @protected
     * @template
     * @param  {BUI.Editor.Editor} editor 
     * @param  {Object} options
     */
    beforeShowEditor : function(editor,options){
      var _self = this,
        grid = _self.get('grid'),
        columns = grid.get('columns'),
        form = editor.get('form'),
        row = $(options.row);
      editor.set('width',row.width());
      BUI.each(columns,function(column){
        if(!column.get('visible')){
          field.set('visible',false);
        }else{
          var fieldName = column.get('dataIndex'),
            field = form.getField(fieldName),
            width = column.get('el').outerWidth() - field.getAppendWidth();
          field.set('width',width);
        }
      });
    },
    /**
     * @protected
     * \u83b7\u53d6\u8981\u7f16\u8f91\u7684\u503c
     * @param  {Object} options \u70b9\u51fb\u5355\u5143\u683c\u7684\u4e8b\u4ef6\u5bf9\u8c61
     * @return {*}   \u7f16\u8f91\u7684\u503c
     */
    getEditValue : function(options){
      return options.record;
    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u5668\u7684\u6784\u9020\u51fd\u6570
     * @param  {Object} Editor \u547d\u540d\u7a7a\u95f4
     * @return {Function}       \u6784\u9020\u51fd\u6570
     */
    getEditorConstructor : function(Editor){
      return Editor.RecordEditor;
    },
     /**
     * @protected
     * \u83b7\u53d6\u5bf9\u9f50\u7684\u8282\u70b9
     * @override
     * @param  {Object} options \u70b9\u51fb\u5355\u5143\u683c\u7684\u4e8b\u4ef6\u5bf9\u8c61
     * @return {jQuery} 
     */
    getAlignNode : function(options){
      return $(options.row);
    },
    /**
     * \u83b7\u53d6\u7f16\u8f91\u7684\u5b57\u6bb5
     * @protected
     * @return {Array}  \u5b57\u6bb5\u96c6\u5408
     */
    getFields : function(){
      var _self = this,
        editors = _self.get('editors');
      return editors[0].get('form').get('children');
    }
  });
  return RowEditing;
});
define('bui/grid/plugins/dialogediting',['bui/common'],function (require) {
  var BUI = require('bui/common'),
    TYPE_ADD = 'add',
    TYPE_EDIT = 'edit';

  /**
   * \u8868\u683c\u7684\u7f16\u8f91\u63d2\u4ef6
   * @class BUI.Grid.Plugins.DialogEditing
   */
  function Dialog(config){
     Dialog.superclass.constructor.call(this, config);
  }

  Dialog.ATTRS = {
    /**
     * \u7f16\u8f91\u7684\u8bb0\u5f55
     * @type {Object}
     * @readOnly
     */
    record : {

    },
    /**
     * @private
     * \u7f16\u8f91\u8bb0\u5f55\u7684index
     * @type {Object}
     */
    curIndex : {

    },
    /**
     * Dialog\u7684\u5185\u5bb9\uff0c\u5185\u90e8\u5305\u542b\u8868\u5355(form)
     * @cfg {String} contentId
     */
    /**
     * Dialog\u7684\u5185\u5bb9\uff0c\u5185\u90e8\u5305\u542b\u8868\u5355(form)
     * @type {String}
     */
    contentId:{

    },
    /**
     * \u7f16\u8f91\u5668
     * @type {BUI.Editor.DialogEditor}
     * @readOnly
     */
    editor : {

    },
    /**
     * Dialog\u4e2d\u7684\u8868\u5355
     * @type {BUI.Form.Form}
     * @readOnly
     */
    form : {

    },
    events : {
      value : {
        /**
         * @event
         * \u7f16\u8f91\u7684\u8bb0\u5f55\u53d1\u751f\u66f4\u6539
         * @param {Object} e \u4e8b\u4ef6\u5bf9\u8c61
         * @param {Object} e.record \u8bb0\u5f55
         * @param {Object} e.editType \u7f16\u8f91\u7684\u7c7b\u578b add \u6216\u8005 edit
         */
        recordchange : false
      }
    },
    editType : {

    }
  };

  BUI.extend(Dialog,BUI.Base);

  BUI.augment(Dialog,{
    /**
     * \u521d\u59cb\u5316
     * @protected
     */
    initializer : function (grid) {
      var _self = this;
      _self.set('grid',grid);
      //\u5ef6\u8fdf\u52a0\u8f7d editor\u6a21\u5757
      BUI.use('bui/editor',function(Editor){
        _self._initEditor(Editor);
      });
    },
    bindUI : function(grid){
      var _self = this,
        triggerCls = _self.get('triggerCls');
      if(triggerCls){
        grid.on('cellclick',function(ev){
          var sender = $(ev.domTarget),
            editor = _self.get('editor');
          if(sender.hasClass(triggerCls) && editor){

            _self.edit(ev.record);
            if(grid.get('multipleSelect')){
              return false;
            }
          }
        });
      }
    },
    //\u521d\u59cb\u5316\u7f16\u8f91\u5668
    _initEditor : function(Editor){
      var _self = this,
        contentId = _self.get('contentId'),
        formNode = $('#' + contentId).find('form'),
        editor = _self.get('editor'),
        cfg = BUI.merge(editor,{
            contentId : contentId,
            form : {
              srcNode : formNode
            }
        });

      editor = new Editor.DialogEditor(cfg);
      _self._bindEditor(editor);
      _self.set('editor',editor);
      _self.set('form',editor.get('form'));
    },
    //\u7ed1\u5b9a\u7f16\u8f91\u5668\u4e8b\u4ef6
    _bindEditor : function(editor){
      var _self = this;
      editor.on('accept',function(){
        var form = editor.get('form'),
          record = form.serializeToObject();
        _self.saveRecord(record);
      });
    },
    /**
     * \u7f16\u8f91\u8bb0\u5f55
     * @param  {Object} record \u8bb0\u5f55
     */
    edit : function(record){
      var _self = this;
      _self.set('editType',TYPE_EDIT);
      _self.showEditor(record);
    },
    /**
     * \u6dfb\u52a0\u8bb0\u5f55
     * @param  {Object} record \u8bb0\u5f55
     * @param {Number} [index] \u6dfb\u52a0\u5230\u7684\u4f4d\u7f6e\uff0c\u9ed8\u8ba4\u6dfb\u52a0\u5728\u6700\u540e
     */
    add : function(record,index){
      var _self = this;
      _self.set('editType',TYPE_ADD);
      _self.set('curIndex',index);
      _self.showEditor(record);
    },
    /**
     * @private
     * \u4fdd\u5b58\u8bb0\u5f55
     */
    saveRecord : function(record){
      var _self = this,
        grid = _self.get('grid'),
        editType = _self.get('editType'),
        curIndex = _self.get('curIndex'),
        store = grid.get('store'),
        curRecord = _self.get('record');

      BUI.mix(curRecord,record);

      if(editType == TYPE_ADD){
        if(curIndex != null){
          store.addAt(curRecord,curIndex);
        }else{
          store.add(curRecord);
        }
      }else{
        store.update(curRecord);
        /*if(store.contains(curRecord)){
          
        }else{
          store.add(curRecord);
        }*/
      }
    },
    /**
     * @private
     * \u663e\u793a\u7f16\u8f91\u5668
     */
    showEditor : function(record){
      var _self = this,
        editor = _self.get('editor');
      editor.show();
      editor.setValue(record,true); //\u8bbe\u7f6e\u503c\uff0c\u5e76\u4e14\u9690\u85cf\u9519\u8bef
      _self.set('record',record);
      _self.fire('recordchange',{record : record,editType : _self.get('editType')});
    },
    /**
     * \u53d6\u6d88\u7f16\u8f91
     */
    cancel : function(){
      var _self = this,
        editor = _self.get('editor');
      editor.cancel();
    },
    destructor : function(){
      var _self = this,
        editor = _self.get('editor');
      editor && editor.destroy();
      _self.off();
      _self.clearAttrVals();
    }

  });

  return Dialog;
});