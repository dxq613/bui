/**
 * @fileOverview  控件的视图层
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 * @ignore
 */
define('bui/component/view',['bui/component/manage','bui/component/uibase'],function(require){

  var win = window,
    Manager = require('bui/component/manage'),
    UIBase = require('bui/component/uibase'),//BUI.Component.UIBase,
    doc = document;
    
    /**
     * 控件的视图层基类
     * @class BUI.Component.View
     * @protected
     * @extends BUI.Component.UIBase
     * @mixins BUI.Component.UIBase.TplView
     */
    var View = UIBase.extend([UIBase.TplView],
    {

        /**
         * Get all css class name to be applied to the root element of this component for given state.
         * the css class names are prefixed with component name.
         * @param {String} [state] This component's state info.
         */
        getComponentCssClassWithState: function (state) {
            var self = this,
                componentCls = self.get('ksComponentCss');
            state = state || '';
            return self.getCssClassWithPrefix(componentCls.split(/\s+/).join(state + ' ') + state);
        },

        /**
         * Get full class name (with prefix) for current component
         * @param classes {String} class names without prefixCls. Separated by space.
         * @method
         * @return {String} class name with prefixCls
         * @private
         */
        getCssClassWithPrefix: Manager.getCssClassWithPrefix,

        /**
         * Returns the dom element which is responsible for listening keyboard events.
         * @return {jQuery}
         */
        getKeyEventTarget: function () {
            return this.get('el');
        },
        /**
         * Return the dom element into which child component to be rendered.
         * @return {jQuery}
         */
        getContentElement: function () {
            return this.get('contentEl') || this.get('el');
        },
        /**
         * 获取状态对应的css样式
         * @param  {String} name 状态名称 例如：hover,disabled等等
         * @return {String} 状态样式
         */
        getStatusCls : function(name){
            var self = this,
                statusCls = self.get('statusCls'),
                cls = statusCls[name];
            if(!cls){
                cls = self.getComponentCssClassWithState('-' + name);
            }
            return cls;
        },
        /**
         * 渲染控件
         * @protected
         */
        renderUI: function () {
            var self = this;

            // 新建的节点才需要摆放定位,不支持srcNode模式
            if (!self.get('srcNode')) {
                var render = self.get('render'),
                    el = self.get('el'),
                    renderBefore = self.get('elBefore');
                if (renderBefore) {
                    el.insertBefore(renderBefore, undefined);
                } else if (render) {
                    el.appendTo(render, undefined);
                } else {
                    el.appendTo(doc.body, undefined);
                }
            }
        },
        /**
         * 只负责建立节点，如果是 decorate 过来的，甚至内容会丢失
         * @protected
         * 通过 render 来重建原有的内容
         */
        createDom: function () {
            var self = this,
                contentEl = self.get('contentEl'),
                el = self.get('el');
            if (!self.get('srcNode')) {

                el = $('<' + self.get('elTagName') + '>');

                if (contentEl) {
                    el.append(contentEl);
                }

                self.setInternal('el', el);   
            }
            
            el.addClass(self.getComponentCssClassWithState());
            if (!contentEl) {
                // 没取到,这里设下值, uiSet 时可以 set('content')  取到
                self.setInternal('contentEl', el);
            }
        },
        /**
         * 设置高亮显示
         * @protected
         */
        _uiSetHighlighted: function (v) {
            var self = this,
                componentCls = self.getStatusCls('hover'),
                el = self.get('el');
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },

        /**
         * 设置禁用
         * @protected
         */
        _uiSetDisabled: function (v) {
            var self = this,
                componentCls = self.getStatusCls('disabled'),
                el = self.get('el');
            el[v ? 'addClass' : 'removeClass'](componentCls)
                .attr('aria-disabled', v);
      
            //如果禁用控件时，处于hover状态，则清除
            if(v && self.get('highlighted')){
            self.set('highlighted',false);
            }

            if (self.get('focusable')) {
                //不能被 tab focus 到
                self.getKeyEventTarget().attr('tabIndex', v ? -1 : 0);
            }
        },
        /**
         * 设置激活状态
         * @protected
         */
        _uiSetActive: function (v) {
            var self = this,
                componentCls = self.getStatusCls('active');
            self.get('el')[v ? 'addClass' : 'removeClass'](componentCls)
                .attr('aria-pressed', !!v);
        },
        /**
         * 设置获得焦点
         * @protected
         */
        _uiSetFocused: function (v) {
            var self = this,
                el = self.get('el'),
                componentCls = self.getStatusCls('focused');
            el[v ? 'addClass' : 'removeClass'](componentCls);
        },
        /**
         * 设置控件最外层DOM的属性
         * @protected
         */
        _uiSetElAttrs: function (attrs) {
            this.get('el').attr(attrs);
        },
        /**
         * 设置应用到控件最外层DOM的css class
         * @protected
         */
        _uiSetElCls: function (cls) {
            this.get('el').addClass(cls);
        },
        /**
         * 设置应用到控件最外层DOM的css style
         * @protected
         */
        _uiSetElStyle: function (style) {
            this.get('el').css(style);
        },
        //设置role
        _uiSetRole : function(role){
            if(role){
                this.get('el').attr('role',role);
            } 
        },
        /**
         * 设置应用到控件宽度
         * @protected
         */
        _uiSetWidth: function (w) {
            this.get('el').width(w);
        },
        /**
         * 设置应用到控件高度
         * @protected
         */
        _uiSetHeight: function (h) {
            var self = this;
            self.get('el').height(h);
        },
        /**
         * 设置应用到控件的内容
         * @protected
         */
        _uiSetContent: function (c) {
            var self = this, 
                el;
            // srcNode 时不重新渲染 content
            // 防止内部有改变，而 content 则是老的 html 内容
            if (self.get('srcNode') && !self.get('rendered')) {
            } else {
                el = self.get('contentEl');
                if (typeof c == 'string') {
                    el.html(c);
                } else if (c) {
                    el.empty().append(c);
                }
            }
        },
        /**
         * 设置应用到控件是否可见
         * @protected
         */
        _uiSetVisible: function (isVisible) {
            var self = this,
                el = self.get('el'),
                visibleMode = self.get('visibleMode');
            if (visibleMode === 'visibility') {
                el.css('visibility', isVisible ? 'visible' : 'hidden');
            } else {
                el.css('display', isVisible ? '' : 'none');
            }
        },
        set : function(name,value){
             var _self = this,
                attr = _self.__attrs[name],
                ev,
                ucName,
                m;

            if(!attr || !_self.get('binded')){ //未初始化view或者没用定义属性
                View.superclass.set.call(this,name,value);
                return _self;
            }

            var prevVal = View.superclass.get.call(this,name);

            //如果未改变值不进行修改
            if(!$.isPlainObject(value) && !BUI.isArray(value) && prevVal === value){
                return _self;
            }
            View.superclass.set.call(this,name,value);

            value = _self.__attrVals[name];
            ev = {attrName: name,prevVal: prevVal,newVal: value};
            ucName = BUI.ucfirst(name);
            m = '_uiSet' + ucName;
            if(_self[m]){
                _self[m](value,ev);
            }

            return _self;

        },
        /**
         * 析构函数
         * @protected
         */
        destructor : function () {
            var el = this.get('el');
            if (el) {
                el.remove();
            }
        }
    },{
        xclass : 'view',
        priority : 0
    });


    View.ATTRS = 
    {   
        /**
         * 控件根节点
         * @readOnly
         * see {@link BUI.Component.Controller#property-el}
         */
        el: {
            /**
			* @private
			*/
            setter: function (v) {
                return $(v);
            }
        },

        /**
         * 控件根节点样式
         * see {@link BUI.Component.Controller#property-elCls}
         */
        elCls: {
        },
        /**
         * 控件根节点样式属性
         * see {@link BUI.Component.Controller#property-elStyle}
         */
        elStyle: {
        },
        /**
         * ARIA 标准中的role
         * @type {String}
         */
        role : {
            
        },
        /**
         * 控件宽度
         * see {@link BUI.Component.Controller#property-width}
         */
        width: {
        },
        /**
         * 控件高度
         * see {@link BUI.Component.Controller#property-height}
         */
        height: {
        },
        /**
         * 状态相关的样式,默认情况下会使用 前缀名 + xclass + '-' + 状态名
         * see {@link BUI.Component.Controller#property-statusCls}
         * @type {Object}
         */
        statusCls : {
            value : {}
        },
        /**
         * 控件根节点使用的标签
         * @type {String}
         */
        elTagName: {
            // 生成标签名字
            value: 'div'
        },
        /**
         * 控件根节点属性
         * see {@link BUI.Component.Controller#property-elAttrs}
         * @ignore
         */
        elAttrs: {
        },
        /**
         * 控件内容，html,文本等
         * see {@link BUI.Component.Controller#property-content}
         */
        content: {
        },
        /**
         * 控件插入到指定元素前
         * see {@link BUI.Component.Controller#property-tpl}
         */
        elBefore: {
            // better named to renderBefore, too late !
        },
        /**
         * 控件在指定元素内部渲染
         * see {@link BUI.Component.Controller#property-render}
         * @ignore
         */
        render: {},
        /**
         * 是否可见
         * see {@link BUI.Component.Controller#property-visible}
         */
        visible: {
            value: true
        },
        /**
         * 可视模式
         * see {@link BUI.Component.Controller#property-visibleMode}
         */
        visibleMode: {
            value: 'display'
        },
        /**
         * @private
         * 缓存隐藏时的位置，对应visibleMode = 'visiblity' 的场景
         * @type {Object}
         */
        cachePosition : {

        },
        /**
         * content 设置的内容节点,默认根节点
         * @type {jQuery}
         * @default  el
         */
        contentEl: {
            valueFn: function () {
                return this.get('el');
            }
        },
        /**
         * 样式前缀
         * see {@link BUI.Component.Controller#property-prefixCls}
         */
        prefixCls: {
            value: BUI.prefix
        },
        /**
         * 可以获取焦点
         * @protected
         * see {@link BUI.Component.Controller#property-focusable}
         */
        focusable: {
            value: true
        },
        /**
         * 获取焦点
         * see {@link BUI.Component.Controller#property-focused}
         */
        focused: {},
        /**
         * 激活
         * see {@link BUI.Component.Controller#property-active}
         */
        active: {},
        /**
         * 禁用
         * see {@link BUI.Component.Controller#property-disabled}
         */
        disabled: {},
        /**
         * 高亮显示
         * see {@link BUI.Component.Controller#property-highlighted}
         */
        highlighted: {}
    };

    return View;
});