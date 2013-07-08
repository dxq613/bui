/**
 * @fileOverview This class specifies the definition for a column of a grid.
 * @author dxq613@gmail.com
 * @ignore
 */

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
    * 表格列的视图类
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
        //展开表头
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
     * 表格的列对象，存储列信息
     * xclass:'grid-column'
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
                 * 表头展开显示菜单，
                 * @type {Boolean}
                 */
                open : {
                    view : true,
                    value : false
                },
                /**
                 * 此列对应显示数据的字段名称
                 * @cfg {String} dataIndex
                 */
                /**
                 * 此列对应显示数据的字段名称
                 * @type {String}
                 * @default {String} empty string
                 */
                dataIndex:{
                    view:true,
                    value:''
                },
                /**
                 * 是否可拖拽，暂时未支持
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
                 * 编辑器，暂时为支持
                 * @private
                 * @type {Object}
                 */
                editor:{

                },
                /**
                 * 是否可以获取焦点
                 * @protected
                 */
                focusable:{
                    value:false
                },
                /**
                 * 固定列,主要用于在首行显示一些特殊内容，如单选框，复选框，序号等。插件不能对此列进行特殊操作，如：移动位置，隐藏等
                 * @cfg {Boolean} fixed
                 */
                /**
                 * 固定列,主要用于在首行显示一些特殊内容，如单选框，复选框，序号等。插件不能对此列进行特殊操作，如：移动位置，隐藏等
                 * @type {Boolean}
                 */
                fixed : {
                    value : false
                },
                /**
                 * 控件的编号
                 * @cfg {String} id
                 */
                /**
                 * 控件的编号
                 * @type {String}
                 * @default null
                 */
                id:{

                },
                /**
                 * 渲染表格单元格的格式化函数
                 * "function(value,obj,index){return value;}"
                 * @cfg {Function} renderer
                 */
                /**
                 * 渲染表格单元格的格式化函数
                 * "function(value,obj,index){return value;}"
                 * @type {Function}
                 * @default
                 */
                renderer:{

                },
                /**
                 * 是否可以调整宽度，应用于拖拽或者自适应宽度时
                 * @type {Boolean}
                 * @default true
                 */
                resizable:{
                    value:true
                },
                /* 是否可以按照此列排序，如果设置true,那么点击列头时
                 * @cfg {Boolean} [sortable=true]
                 */
                /* 是否可以按照此列排序，如果设置true,那么点击列头时
                 * @type {Boolean}
                 * @default true.
                 */
                sortable:{
					sync:false,
                    view:true,
                    value:true
                },
                /**
                 * 排序状态，当前排序是按照升序、降序。有3种值 null, 'ASC','DESC'
                 * @type {String}
                 * @default null
                 */
                sortState:{
                    view:true,
                    value:null
                },
                /**
                 * 列标题
                 * @cfg {String} [title=&#160;]
                 */
                /**
                 * 列标题
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
                 * 列的宽度,可以使数字或者百分比
                 * @type {Number|String}
                 * @default {Number} 80
                 */
                width:{
                    value:100
                },
                /**
                 * 是否显示菜单
                 * @cfg {Boolean} [showMenu=false]
                 */
                /**
                 * 是否显示菜单
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
                 * 单元格的模板，在列上设置单元格的模板，可以在渲染单元格时使用，更改单元格的内容
                 * @cfg {String} cellTpl
                 */
                /**
                 * 单元格的模板，在列上设置单元格的模板，可以在渲染单元格时使用，更改单元格的内容
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
	
