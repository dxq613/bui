/**
 * @fileOverview  控件可以实例化的基类
 * @ignore
 * @author yiminghe@gmail.com
 * copied by dxq613@gmail.com
 */

/**
 * jQuery 事件
 * @class jQuery.Event
 * @private
 */


define('bui/component/controller',['bui/component/uibase','bui/component/manage','bui/component/view','bui/component/loader'],function(require){
    'use strict';
    var UIBase = require('bui/component/uibase'),
        Manager = require('bui/component/manage'),
        View = require('bui/component/view'),
        Loader = require('bui/component/loader'),
        wrapBehavior = BUI.wrapBehavior,
        getWrapBehavior = BUI.getWrapBehavior;

     /**
      * @ignore
      */
     function wrapperViewSetter(attrName) {
        return function (ev) {
            var self = this;
            // in case bubbled from sub component
            if (self === ev.target) {
                var value = ev.newVal,
                    view = self.get('view');
                if(view){
                    view.set(attrName, value); 
                }
               
            }
        };
    }

    /**
      * @ignore
      */
    function wrapperViewGetter(attrName) {
        return function (v) {
            var self = this,
                view = self.get('view');
            return v === undefined ? view.get(attrName) : v;
        };
    }

    /**
      * @ignore
      */
    function initChild(self, c, renderBefore) {
        // 生成父组件的 dom 结构
        self.create();
        var contentEl = self.getContentElement(),
            defaultCls = self.get('defaultChildClass');
        //配置默认 xclass
        if(!c.xclass && !(c instanceof Controller)){
            if(!c.xtype){
                c.xclass = defaultCls;
            }else{
                c.xclass = defaultCls + '-' + c.xtype;
            }
            
        }

        c = BUI.Component.create(c, self);
        c.setInternal('parent', self);
        // set 通知 view 也更新对应属性
        c.set('render', contentEl);
        c.set('elBefore', renderBefore);
        // 如果 parent 也没渲染，子组件 create 出来和 parent 节点关联
        // 子组件和 parent 组件一起渲染
        // 之前设好属性，view ，logic 同步还没 bind ,create 不是 render ，还没有 bindUI
        c.create(undefined);
        return c;
    }

    /**
     * 不使用 valueFn，
     * 只有 render 时需要找到默认，其他时候不需要，防止莫名其妙初始化
     * @ignore
     */
    function constructView(self) {
        // 逐层找默认渲染器
        var attrs,
            attrCfg,
            attrName,
            cfg = {},
            v,
            Render = self.get('xview');

      
        //将渲染层初始化所需要的属性，直接构造器设置过去

        attrs = self.getAttrs();

        // 整理属性，对纯属于 view 的属性，添加 getter setter 直接到 view
        for (attrName in attrs) {
            if (attrs.hasOwnProperty(attrName)) {
                attrCfg = attrs[attrName];
                if (attrCfg.view) {
                    // 先取后 getter
                    // 防止死循环
                    if (( v = self.get(attrName) ) !== undefined) {
                        cfg[attrName] = v;
                    }

                    // setter 不应该有实际操作，仅用于正规化比较好
                    // attrCfg.setter = wrapperViewSetter(attrName);
                    // 不更改attrCfg的定义，可以多个实例公用一份attrCfg
                    /*self.on('after' + BUI.ucfirst(attrName) + 'Change',
                        wrapperViewSetter(attrName));
                    */
                    // 逻辑层读值直接从 view 层读
                    // 那么如果存在默认值也设置在 view 层
                    // 逻辑层不要设置 getter
                    //attrCfg.getter = wrapperViewGetter(attrName);
                }
            }
        }
        // does not autoRender for view
        delete cfg.autoRender;
        cfg.ksComponentCss = getComponentCss(self);
        return new Render(cfg);
    }

    function getComponentCss(self) {
        var constructor = self.constructor,
            cls,
            re = [];
        while (constructor && constructor !== Controller) {
            cls = Manager.getXClassByConstructor(constructor);
            if (cls) {
                re.push(cls);
            }
            constructor = constructor.superclass && constructor.superclass.constructor;
        }
        return re.join(' ');
    }

    function isMouseEventWithinElement(e, elem) {
        var relatedTarget = e.relatedTarget;
        // 在里面或等于自身都不算 mouseenter/leave
        return relatedTarget &&
            ( relatedTarget === elem[0] ||$.contains(elem,relatedTarget));
    }

    /**
     * 可以实例化的控件，作为最顶层的控件类，一切用户控件都继承此控件
     * xclass: 'controller'.
     * ** 创建子控件 ** 
     * <pre><code>
     * var Control = Controller.extend([mixin1,mixin2],{ //原型链上的函数
     *   renderUI : function(){ //创建DOM
     *   
     *   }, 
     *   bindUI : function(){  //绑定事件
     *   
     *   },
     *   destructor : funciton(){ //析构函数
     *   
     *   }
     * },{
     *   ATTRS : { //默认的属性
     *       text : {
     *       
     *       }
     *   }
     * },{
     *     xclass : 'a' //用于把对象解析成类
     * });
     * </code></pre>
     *
     * ** 创建对象 **
     * <pre><code>
     * var c1 = new Control({
     *     render : '#t1', //在t1上创建
     *     text : 'text1',
     *     children : [{xclass : 'a',text : 'a1'},{xclass : 'b',text : 'b1'}]
     * });
     *
     * c1.render();
     * </code></pre>
     * @extends BUI.Component.UIBase
     * @mixins BUI.Component.UIBase.Tpl
     * @mixins BUI.Component.UIBase.Decorate
     * @mixins BUI.Component.UIBase.Depends
     * @mixins BUI.Component.UIBase.ChildCfg
     * @class BUI.Component.Controller
     */
    var Controller = UIBase.extend([UIBase.Decorate,UIBase.Tpl,UIBase.ChildCfg,UIBase.KeyNav,UIBase.Depends],
    {
        /**
         * 是否是控件，标示对象是否是一个UI 控件
         * @type {Boolean}
         */
        isController: true,

        /**
         * 使用前缀获取类的名字
         * @param classes {String} class names without prefixCls. Separated by space.
         * @method
         * @protected
         * @return {String} class name with prefixCls
         */
        getCssClassWithPrefix: Manager.getCssClassWithPrefix,

        /**
         * From UIBase, Initialize this component.             *
         * @protected
         */
        initializer: function () {
            var self = this;

            if(!self.get('id')){
                self.set('id',self.getNextUniqueId());
            }
            Manager.addComponent(self.get('id'),self);
            // initialize view
            var view = constructView(self);
            self.setInternal('view', view);
            self.__view = view;
        },

        /**
         * 返回新的唯一的Id,结果是 'xclass' + number
         * @protected
         * @return {String} 唯一id
         */
        getNextUniqueId : function(){
            var self = this,
                xclass = Manager.getXClassByConstructor(self.constructor);
            return BUI.guid(xclass);
        },
        /**
         * From UIBase. Constructor(or get) view object to create ui elements.
         * @protected
         *
         */
        createDom: function () {
            var self = this,
                //el,
                view = self.get('view');
            view.create(undefined);
            //el = view.getKeyEventTarget();
            /*if (!self.get('allowTextSelection')) {
                //el.unselectable(undefined);
            }*/
        },

        /**
         * From UIBase. Call view object to render ui elements.
         * @protected
         *
         */
        renderUI: function () {
            var self = this, 
                loader = self.get('loader');
            self.get('view').render();
            self._initChildren();
            if(loader){
                self.setInternal('loader',loader);
            }
            /**/

        },
        _initChildren : function(children){
            var self = this, 
                i, 
                children, 
                child;
            // then render my children
            children = children || self.get('children').concat();
            self.get('children').length = 0;
            for (i = 0; i < children.length; i++) {
                child = self.addChild(children[i]);
                child.render();
            }
        },
        /**
         * bind ui for box
         * @private
         */
        bindUI:function () {
            var self = this,
                events = self.get('events');
            this.on('afterVisibleChange', function (e) {
                this.fire(e.newVal ? 'show' : 'hide');
            });
            //处理控件事件，设置事件是否冒泡
            BUI.each(events, function (v,k) {
              self.publish(k, {
                  bubbles:v
              });
            });
        },
        /**
         * 控件是否包含指定的DOM元素,包括根节点
         * <pre><code>
         *   var control = new Control();
         *   $(document).on('click',function(ev){
         *     var target = ev.target;
         *
         *     if(!control.containsElement(elem)){ //未点击在控件内部
         *       control.hide();
         *     }
         *   });
         * </code></pre>
         * @param  {HTMLElement} elem DOM 元素
         * @return {Boolean}  是否包含
         */
        containsElement : function (elem) {
          var _self = this,
            el = _self.get('el'),
            children = _self.get('children'),
            result = false;
          if(!_self.get('rendered')){
            return false;
          }
          if($.contains(el[0],elem) || el[0] === elem){
            result = true;
          }else{
            BUI.each(children,function (item) {
                if(item.containsElement(elem)){
                    result = true;
                    return false;
                }
            });
          }
          return result;
        },
        /**
         * 是否是子控件的DOM元素
         * @protected
         * @return {Boolean} 是否子控件的DOM元素
         */
        isChildrenElement : function(elem){
            var _self = this,
                children = _self.get('children'),
                rst = false;
            BUI.each(children,function(child){
                if(child.containsElement(elem)){
                    rst = true;
                    return false;
                }
            });
            return rst;
        },
        /**
         * 显示控件
         */
        show:function () {
            var self = this;
            self.render();
            self.set('visible', true);
            return self;
        },

        /**
         * 隐藏控件
         */
        hide:function () {
            var self = this;
            self.set('visible', false);
            return self;
        },
        /**
         * 交替显示或者隐藏
         * <pre><code>
         *  control.show(); //显示
         *  control.toggle(); //隐藏
         *  control.toggle(); //显示
         * </code></pre>
         */
        toggle : function(){
            this.set('visible',!this.get('visible'));
            return this;
        },
        _uiSetFocusable: function (focusable) {
            var self = this,
                t,
                el = self.getKeyEventTarget();
            if (focusable) {
                el.attr('tabIndex', 0)
                    // remove smart outline in ie
                    // set outline in style for other standard browser
                    .attr('hideFocus', true)
                    .on('focus', wrapBehavior(self, 'handleFocus'))
                    .on('blur', wrapBehavior(self, 'handleBlur'))
                    .on('keydown', wrapBehavior(self, 'handleKeydown'))
                    .on('keyup',wrapBehavior(self,'handleKeyUp'));
            } else {
                el.removeAttr('tabIndex');
                if (t = getWrapBehavior(self, 'handleFocus')) {
                    el.off('focus', t);
                }
                if (t = getWrapBehavior(self, 'handleBlur')) {
                    el.off('blur', t);
                }
                if (t = getWrapBehavior(self, 'handleKeydown')) {
                    el.off('keydown', t);
                }
                if (t = getWrapBehavior(self, 'handleKeyUp')) {
                    el.off('keyup', t);
                }
            }
        },

        _uiSetHandleMouseEvents: function (handleMouseEvents) {
            var self = this, el = self.get('el'), t;
            if (handleMouseEvents) {
                el.on('mouseenter', wrapBehavior(self, 'handleMouseEnter'))
                    .on('mouseleave', wrapBehavior(self, 'handleMouseLeave'))
                    .on('contextmenu', wrapBehavior(self, 'handleContextMenu'))
                    .on('mousedown', wrapBehavior(self, 'handleMouseDown'))
                    .on('mouseup', wrapBehavior(self, 'handleMouseUp'))
                    .on('dblclick', wrapBehavior(self, 'handleDblClick'));
            } else {
                t = getWrapBehavior(self, 'handleMouseEnter') &&
                    el.off('mouseenter', t);
                t = getWrapBehavior(self, 'handleMouseLeave') &&
                    el.off('mouseleave', t);
                t = getWrapBehavior(self, 'handleContextMenu') &&
                    el.off('contextmenu', t);
                t = getWrapBehavior(self, 'handleMouseDown') &&
                    el.off('mousedown', t);
                t = getWrapBehavior(self, 'handleMouseUp') &&
                    el.off('mouseup', t);
                t = getWrapBehavior(self, 'handleDblClick') &&
                    el.off('dblclick', t);
            }
        },

        _uiSetFocused: function (v) {
            if (v) {
                this.getKeyEventTarget()[0].focus();
            }
        },
        //当使用visiblity显示隐藏时，隐藏时把DOM移除出视图内，显示时回复原位置
        _uiSetVisible : function(isVisible){
            var self = this,
                el = self.get('el'),
                visibleMode = self.get('visibleMode');
            if (visibleMode === 'visibility') {
                if(isVisible){
                    var position = self.get('cachePosition');
                    if(position){
                        self.set('xy',position);
                    }
                }
                if(!isVisible){
                    var position = [
                        self.get('x'),self.get('y')
                    ];
                    self.set('cachePosition',position);
                    self.set('xy',[-999,-999]);
                }
            }
        },
        //设置children时
        _uiSetChildren : function(v){
            var self = this,
                children = BUI.cloneObject(v);
            //self.removeChildren(true);
            self._initChildren(children);
        },
        /**
         * 使控件可用
         */
        enable : function(){
            this.set('disabled',false);
            return this;
        },
        /**
         * 使控件不可用，控件不可用时，点击等事件不会触发
         * <pre><code>
         *  control.disable(); //禁用
         *  control.enable(); //解除禁用
         * </code></pre>
         */
        disable : function(){
            this.set('disabled',true);
            return this;
        },
        /**
         * 控件获取焦点
         */
        focus : function(){
            if(this.get('focusable')){
                this.set('focused',true);
            }
        },
        /**
         * 子组件将要渲染到的节点，在 render 类上覆盖对应方法
         * @protected
         * @ignore
         */
        getContentElement: function () {
            return this.get('view').getContentElement();
        },

        /**
         * 焦点所在元素即键盘事件处理元素，在 render 类上覆盖对应方法
         * @protected
         * @ignore
         */
        getKeyEventTarget: function () {
            return this.get('view').getKeyEventTarget();
        },

        /**
         * 添加控件的子控件，索引值为 0-based
         * <pre><code>
         *  control.add(new Control());//添加controller对象
         *  control.add({xclass : 'a'});//添加xclass 为a 的一个对象
         *  control.add({xclass : 'b'},2);//插入到第三个位置
         * </code></pre>
         * @param {BUI.Component.Controller|Object} c 子控件的实例或者配置项
         * @param {String} [c.xclass] 如果c为配置项，设置c的xclass
         * @param {Number} [index]  0-based  如果未指定索引值，则插在控件的最后
         */
        addChild: function (c, index) {
            var self = this,
                children = self.get('children'),
                renderBefore;
            if (index === undefined) {
                index = children.length;
            }
            /**
             * 添加子控件前触发
             * @event beforeAddChild
             * @param {Object} e
             * @param {Object} e.child 添加子控件时传入的配置项或者子控件
             * @param {Number} e.index 添加的位置
             */
            self.fire('beforeAddChild',{child : c,index : index});
            renderBefore = children[index] && children[index].get('el') || null;
            c = initChild(self, c, renderBefore);
            children.splice(index, 0, c);
            // 先 create 占位 再 render
            // 防止 render 逻辑里读 parent.get('children') 不同步
            // 如果 parent 已经渲染好了子组件也要立即渲染，就 创建 dom ，绑定事件
            if (self.get('rendered')) {
                c.render();
            }

            /**
             * 添加子控件后触发
             * @event afterAddChild
             * @param {Object} e
             * @param {Object} e.child 添加子控件
             * @param {Number} e.index 添加的位置
             */
            self.fire('afterAddChild',{child : c,index : index});
            return c;
        },
        /**
         * 将自己从父控件中移除
         * <pre><code>
         *  control.remove(); //将控件从父控件中移除，并未删除
         *  parent.addChild(control); //还可以添加回父控件
         *  
         *  control.remove(true); //从控件中移除并调用控件的析构函数
         * </code></pre>
         * @param  {Boolean} destroy 是否删除DON节点
         * @return {BUI.Component.Controller} 删除的子对象.
         */
        remove : function(destroy){
            var self = this,
                parent = self.get('parent');
            if(parent){
                parent.removeChild(self,destroy);
            }else if (destroy) {
                self.destroy();
            }
            return self;
        },
        /**
         * 移除子控件，并返回移除的控件
         *
         * ** 如果 destroy=true,调用移除控件的 {@link BUI.Component.UIBase#destroy} 方法,
         * 同时删除对应的DOM **
         * <pre><code>
         *  var child = control.getChild(id);
         *  control.removeChild(child); //仅仅移除
         *  
         *  control.removeChild(child,true); //移除，并调用析构函数
         * </code></pre>
         * @param {BUI.Component.Controller} c 要移除的子控件.
         * @param {Boolean} [destroy=false] 如果是true,
         * 调用控件的方法 {@link BUI.Component.UIBase#destroy} .
         * @return {BUI.Component.Controller} 移除的子控件.
         */
        removeChild: function (c, destroy) {
            var self = this,
                children = self.get('children'),
                index = BUI.Array.indexOf(c, children);

            if(index === -1){
                return;
            }
            /**
             * 删除子控件前触发
             * @event beforeRemoveChild
             * @param {Object} e
             * @param {Object} e.child 子控件
             * @param {Boolean} e.destroy 是否清除DOM
             */
            self.fire('beforeRemoveChild',{child : c,destroy : destroy});

            if (index !== -1) {
                children.splice(index, 1);
            }
            if (destroy &&
                // c is still json
                c.destroy) {
                c.destroy();
            }
            /**
             * 删除子控件前触发
             * @event afterRemoveChild
             * @param {Object} e
             * @param {Object} e.child 子控件
             * @param {Boolean} e.destroy 是否清除DOM
             */
            self.fire('afterRemoveChild',{child : c,destroy : destroy});

            return c;
        },

        /**
         * 删除当前控件的子控件
         * <pre><code>
         *   control.removeChildren();//删除所有子控件
         *   control.removeChildren(true);//删除所有子控件，并调用子控件的析构函数
         * </code></pre>
         * @see Component.Controller#removeChild
         * @param {Boolean} [destroy] 如果设置 true,
         * 调用子控件的 {@link BUI.Component.UIBase#destroy}方法.
         */
        removeChildren: function (destroy) {
            var self = this,
                i,
                t = [].concat(self.get('children'));
            for (i = 0; i < t.length; i++) {
                self.removeChild(t[i], destroy);
            }
        },

        /**
         * 根据索引获取子控件
         * <pre><code>
         *  control.getChildAt(0);//获取第一个子控件
         *  control.getChildAt(2); //获取第三个子控件
         * </code></pre>
         * @param {Number} index 0-based 索引值.
         * @return {BUI.Component.Controller} 子控件或者null 
         */
        getChildAt: function (index) {
            var children = this.get('children');
            return children[index] || null;
        },
        /**
         * 根据Id获取子控件
         * <pre><code>
         *  control.getChild('id'); //从控件的直接子控件中查找
         *  control.getChild('id',true);//递归查找所有子控件，包含子控件的子控件
         * </code></pre>
         * @param  {String} id 控件编号
         * @param  {Boolean} deep 是否继续查找在子控件中查找
         * @return {BUI.Component.Controller} 子控件或者null 
         */
        getChild : function(id,deep){
            return this.getChildBy(function(item){
                return item.get('id') === id;
            },deep);
        },
        /**
         * 通过匹配函数查找子控件，返回第一个匹配的对象
         * <pre><code>
         *  control.getChildBy(function(child){//从控件的直接子控件中查找
         *    return child.get('id') = '1243';
         *  }); 
         *  
         *  control.getChild(function(child){//递归查找所有子控件，包含子控件的子控件
         *    return child.get('id') = '1243';
         *  },true);
         * </code></pre>
         * @param  {Function} math 查找的匹配函数
         * @param  {Boolean} deep 是否继续查找在子控件中查找
         * @return {BUI.Component.Controller} 子控件或者null 
         */
        getChildBy : function(math,deep){
            return this.getChildrenBy(math,deep)[0] || null;
        },
        /**
         * 获取控件的附加高度 = control.get('el').outerHeight() - control.get('el').height()
         * @protected
         * @return {Number} 附加宽度
         */
        getAppendHeight : function(){
            var el = this.get('el');
            return el.outerHeight() - el.height();
        },
        /**
         * 获取控件的附加宽度 = control.get('el').outerWidth() - control.get('el').width()
         * @protected
         * @return {Number} 附加宽度
         */
        getAppendWidth : function(){
            var el = this.get('el');
            return el.outerWidth() - el.width();
        },
        /**
         * 查找符合条件的子控件
         * <pre><code>
         *  control.getChildrenBy(function(child){//从控件的直接子控件中查找
         *    return child.get('type') = '1';
         *  }); 
         *  
         *  control.getChildrenBy(function(child){//递归查找所有子控件，包含子控件的子控件
         *    return child.get('type') = '1';
         *  },true);
         * </code></pre>
         * @param  {Function} math 查找的匹配函数
         * @param  {Boolean} deep 是否继续查找在子控件中查找，如果符合上面的匹配函数，则不再往下查找
         * @return {BUI.Component.Controller[]} 子控件数组 
         */
        getChildrenBy : function(math,deep){
            var self = this,
                results = [];
            if(!math){
                return results;
            }

            self.eachChild(function(child){
                if(math(child)){
                    results.push(child);
                }else if(deep){

                    results = results.concat(child.getChildrenBy(math,deep));
                }
            });
            return results;
        },
        /**
         * 遍历子元素
         * <pre><code>
         *  control.eachChild(function(child,index){ //遍历子控件
         *  
         *  });
         * </code></pre>
         * @param  {Function} func 迭代函数，函数原型function(child,index)
         */
        eachChild : function(func){
            BUI.each(this.get('children'),func);
        },
        /**
         * Handle dblclick events. By default, this performs its associated action by calling
         * {@link BUI.Component.Controller#performActionInternal}.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleDblClick: function (ev) {
            this.performActionInternal(ev);
            if(!this.isChildrenElement(ev.target)){
                this.fire('dblclick',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Called by it's container component to dispatch mouseenter event.
         * @private
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseOver: function (ev) {
            var self = this,
                el = self.get('el');
            if (!isMouseEventWithinElement(ev, el)) {
                self.handleMouseEnter(ev);
                
            }
        },

        /**
         * Called by it's container component to dispatch mouseleave event.
         * @private
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseOut: function (ev) {
            var self = this,
                el = self.get('el');
            if (!isMouseEventWithinElement(ev, el)) {
                self.handleMouseLeave(ev);
                
            }
        },

        /**
         * Handle mouseenter events. If the component is not disabled, highlights it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseEnter: function (ev) {
            var self = this;
            this.set('highlighted', !!ev);
            self.fire('mouseenter',{domTarget : ev.target,domEvent : ev});
        },

        /**
         * Handle mouseleave events. If the component is not disabled, de-highlights it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseLeave: function (ev) {
            var self = this;
            self.set('active', false);
            self.set('highlighted', !ev);
            self.fire('mouseleave',{domTarget : ev.target,domEvent : ev});
        },

        /**
         * Handles mousedown events. If the component is not disabled,
         * If the component is activeable, then activate it.
         * If the component is focusable, then focus it,
         * else prevent it from receiving keyboard focus.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseDown: function (ev) {
            var self = this,
                n,
                target = $(ev.target),
                isMouseActionButton = ev['which'] === 1,
                el;
            if (isMouseActionButton) {
                el = self.getKeyEventTarget();
                if (self.get('activeable')) {
                    self.set('active', true);
                }
                if (self.get('focusable')) {
                    //如果不是input,select,area等可以获取焦点的控件，那么设置此控件的focus
                    /*if(target[0] == el[0] || (!target.is('input,select,area') && !target.attr('tabindex'))){
                      el[0].focus(); 
                      
                    }*/
                    self.setInternal('focused', true); 
                }

                if (!self.get('allowTextSelection')) {
                    // firefox /chrome 不会引起焦点转移
                    n = ev.target.nodeName;
                    n = n && n.toLowerCase();
                    // do not prevent focus when click on editable element
                    if (n !== 'input' && n !== 'textarea') {
                        ev.preventDefault();
                    }
                }
                if(!self.isChildrenElement(ev.target)){
                    self.fire('mousedown',{domTarget : ev.target,domEvent : ev});
                }
                
            }
        },

        /**
         * Handles mouseup events.
         * If this component is not disabled, performs its associated action by calling
         * {@link BUI.Component.Controller#performActionInternal}, then deactivates it.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleMouseUp: function (ev) {
            var self = this,
                isChildrenElement = self.isChildrenElement(ev.target);
            // 左键
            if (self.get('active') && ev.which === 1) {
                self.performActionInternal(ev);
                self.set('active', false);
                if(!isChildrenElement){
                    self.fire('click',{domTarget : ev.target,domEvent : ev});
                }
            }
            if(!isChildrenElement){
                self.fire('mouseup',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Handles context menu.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleContextMenu: function (ev) {
        },

        /**
         * Handles focus events. Style focused class.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleFocus: function (ev) {
            this.set('focused', !!ev);
            this.fire('focus',{domEvent : ev,domTarget : ev.target});
        },

        /**
         * Handles blur events. Remove focused class.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleBlur: function (ev) {
            this.set('focused', !ev);
            this.fire('blur',{domEvent : ev,domTarget : ev.target});
        },

        /**
         * Handle enter keydown event to {@link BUI.Component.Controller#performActionInternal}.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleKeyEventInternal: function (ev) {
            var self = this,
                isChildrenElement = self.isChildrenElement(ev.target);
            if (ev.which === 13) {
                if(!isChildrenElement){
                    self.fire('click',{domTarget : ev.target,domEvent : ev});
                }
                
                return this.performActionInternal(ev);
            }
            if(!isChildrenElement){
                self.fire('keydown',{domTarget : ev.target,domEvent : ev});
            }
        },

        /**
         * Handle keydown events.
         * If the component is not disabled, call {@link BUI.Component.Controller#handleKeyEventInternal}
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        handleKeydown: function (ev) {
            var self = this;
            if (self.handleKeyEventInternal(ev)) {
                ev.halt();
                return true;
            }
        },
        handleKeyUp : function(ev){
            var self = this;
            if(!self.isChildrenElement(ev.target)){
                self.fire('keyup',{domTarget : ev.target,domEvent : ev});
            }
        },
        /**
         * Performs the appropriate action when this component is activated by the user.
         * @protected
         * @param {jQuery.Event} ev DOM event to handle.
         */
        performActionInternal: function (ev) {
        },
        /**
         * 析构函数
         * @protected
         */
        destructor: function () {
            var self = this,
                id,
                i,
                view,
                children = self.get('children');
            id = self.get('id');
            for (i = 0; i < children.length; i++) {
                children[i].destroy && children[i].destroy();
            }
            self.get('view').destroy();
            Manager.removeComponent(id);
        },
        //覆写set方法
        set : function(name,value,opt){
            var _self = this,
                view = _self.__view,
                attr = _self.__attrs[name],
                ucName,
                ev,
                m;
            if(BUI.isObject(name)){
                opt = value;
                BUI.each(name,function(v,k){
                    _self.set(k,v,opt);
                });
            }
            if(!view || !attr || (opt && opt.silent)){ //未初始化view或者没用定义属性
                Controller.superclass.set.call(this,name,value,opt);
                return _self;
            }

            var prevVal = Controller.superclass.get.call(this,name);

            //如果未改变值不进行修改
            if(!$.isPlainObject(value) && !BUI.isArray(value) && prevVal === value){
                return _self;
            }
            ucName = BUI.ucfirst(name);
            m = '_uiSet' + ucName;
            //触发before事件
            _self.fire('before' + ucName + 'Change', {
              attrName: name,
              prevVal: prevVal,
              newVal: value
            });

            _self.setInternal(name, value);

            value = _self.__attrVals[name];
            if(view && attr.view){
                view.set(name,value);
                //return _self;
            }
            ev = {attrName: name,prevVal: prevVal,newVal: value};

            //触发before事件
            _self.fire('after' + ucName + 'Change', ev);
            if(_self.get('binded') && _self[m]){
                _self[m](value,ev);
            }
            return _self;
        },
        //覆写get方法，改变时同时改变view的值
        get : function(name){
            var _self = this,
                view = _self.__view,
                attr = _self.__attrs[name],
                value = Controller.superclass.get.call(this,name);
            if(value !== undefined){
                return value;
            }
            if(view && attr && attr.view){
                return view.get(name);
            }

            return value;
        }
    },
    {
        ATTRS: 
        {
            /**
             * 控件的Html 内容
             * <pre><code>
             *  new Control({
             *     content : '内容',
             *     render : '#c1'
             *  });
             * </code></pre>
             * @cfg {String|jQuery} content
             */
            /**
             * 控件的Html 内容
             * @type {String|jQuery}
             */
            content:{
                view:1
            },
			/**
			 * 控件根节点使用的标签
             * <pre><code>
             *  new Control({
             *     elTagName : 'ul',
             *      content : '<li>内容</li>',  //控件的DOM &lt;ul&gt;&lt;li&gt;内容&lt;/li&gt;&lt;/ul&gt;
             *     render : '#c1'
             *  });  
             * </code></pre>
			 * @cfg {String} elTagName
			 */
			elTagName: {
				// 生成标签名字
				view : true,
				value: 'div'
			},
            /**
             * 子元素的默认 xclass,配置child的时候没必要每次都填写xclass
             * @type {String}
             */
            defaultChildClass : {
                
            },
            /**
             * 如果控件未设置 xclass，同时父元素设置了 defaultChildClass，那么
             * xclass = defaultChildClass + '-' + xtype
             * <pre><code>
             *  A.ATTRS = {
             *    defaultChildClass : {
             *        value : 'b'
             *    }
             *  }
             *  //类B 的xclass = 'b'类 B1的xclass = 'b-1',类 B2的xclass = 'b-2',那么
             *  var a = new A({
             *    children : [
             *        {content : 'b'}, //B类
             *        {content : 'b1',xtype:'1'}, //B1类
             *        {content : 'b2',xtype:'2'}, //B2类
             *    ]
             *  });
             * </code></pre>
             * @type {String}
             */
            xtype : {

            },
            /**
             * 标示控件的唯一编号，默认会自动生成
             * @cfg {String} id
             */
            /**
             * 标示控件的唯一编号，默认会自动生成
             * @type {String}
             */
            id : {
                view : true
            },
            /**
             * 控件宽度
             * <pre><code>
             * new Control({
             *   width : 200 // 200,'200px','20%'
             * });
             * </code></pre>
             * @cfg {Number|String} width
             */
            /**
             * 控件宽度
             * <pre><code>
             *  control.set('width',200);
             *  control.set('width','200px');
             *  control.set('width','20%');
             * </code></pre>
             * @type {Number|String}
             */
            width:{
                view:1
            },
            /**
             * 控件宽度
             * <pre><code>
             * new Control({
             *   height : 200 // 200,'200px','20%'
             * });
             * </code></pre>
             * @cfg {Number|String} height
             */
            /**
             * 控件宽度
             * <pre><code>
             *  control.set('height',200);
             *  control.set('height','200px');
             *  control.set('height','20%');
             * </code></pre>
             * @type {Number|String}
             */
            height:{
                view:1
            },
            /**
             * 控件根节点应用的样式
             * <pre><code>
             *  new Control({
             *   elCls : 'test',
             *   content : '内容',
             *   render : '#t1'   //&lt;div id='t1'&gt;&lt;div class="test"&gt;内容&lt;/div&gt;&lt;/div&gt;
             *  });
             * </code></pre>
             * @cfg {String} elCls
             */
            /**
             * 控件根节点应用的样式 css class
             * @type {String}
             */
            elCls:{
                view:1
            },
            /**
             * @cfg {Object} elStyle
			 * 控件根节点应用的css属性
             *  <pre><code>
             *    var cfg = {elStyle : {width:'100px', height:'200px'}};
             *  </code></pre>
             */
            /**
             * 控件根节点应用的css属性，以键值对形式
             * @type {Object}
			 *  <pre><code>
             *	 control.set('elStyle',	{
             *		width:'100px',
             *		height:'200px'
             *   });
             *  </code></pre>
             */
            elStyle:{
                view:1
            },
            /**
             * @cfg {Object} elAttrs
			 * 控件根节点应用的属性，以键值对形式:
             * <pre><code>
             *  new Control({
             *    elAttrs :{title : 'tips'}   
             *  });
             * </code></pre>
             */
            /**
             * @type {Object}
			 * 控件根节点应用的属性，以键值对形式:
             * { title : 'tips'}
             * @ignore
             */
            elAttrs:{
                view:1
            },
            /**
             * 将控件插入到指定元素前
             * <pre><code>
             *  new Control({
             *      elBefore : '#t1'
             *  });
             * </code></pre>
             * @cfg {jQuery} elBefore
             */
            /**
             * 将控件插入到指定元素前
             * @type {jQuery}
             * @ignore
             */
            elBefore:{
                // better named to renderBefore, too late !
                view:1
            },

            /**
             * 只读属性，根节点DOM
             * @type {jQuery}
             */
            el:{
                view:1
            },
            /**
             * 控件支持的事件
             * @type {Object}
             * @protected
             */
            events : {
                value : {
                    /**
                     * 点击事件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'click' : true,
                    /**
                     * 双击事件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'dblclick' : true,
                    /**
                     * 鼠标移入控件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mouseenter' : true,
                    /**
                     * 鼠标移出控件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mouseleave' : true,
                    /**
                     * 键盘按下按键事件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'keydown' : true,
                    /**
                     * 键盘按键抬起控件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'keyup' : true,
                    /**
                     * 控件获取焦点事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'focus' : false,
                    /**
                     * 控件丢失焦点事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'blur' : false,
                    /**
                     * 鼠标按下控件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mousedown' : true,
                    /**
                     * 鼠标抬起控件，此事件会冒泡，所以可以在父元素上监听所有子元素的此事件
                     * @event
                     * @param {Object} e 事件对象
                     * @param {BUI.Component.Controller} e.target 触发事件的对象
                     * @param {jQuery.Event} e.domEvent DOM触发的事件
                     * @param {HTMLElement} e.domTarget 触发事件的DOM节点
                     */
                    'mouseup' : true,
                    /**
                     * 控件显示
                     * @event
                     */
                    'show' : false,
                    /**
                     * 控件隐藏
                     * @event
                     */
                    'hide' : false
                }
            },
            /**
             * 指定控件的容器
             * <pre><code>
             *  new Control({
             *    render : '#t1',
             *    elCls : 'test',
             *    content : '<span>123</span>'  //&lt;div id="t1"&gt;&lt;div class="test bui-xclass"&gt;&lt;span&gt;123&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;
             *  });
             * </code></pre>
             * @cfg {jQuery} render
             */
            /**
             * 指定控件的容器
             * @type {jQuery}
             * @ignore
             */
            render:{
                view:1
            },
            /**
             * ARIA 标准中的role,不要更改此属性
             * @type {String}
             * @protected
             */
            role : {
                view : 1
            },
            /**
             * 状态相关的样式,默认情况下会使用 前缀名 + xclass + '-' + 状态名
             * <ol>
             *     <li>hover</li>
             *     <li>focused</li>
             *     <li>active</li>
             *     <li>disabled</li>
             * </ol>
             * @type {Object}
             */
            statusCls : {
                view : true,
                value : {

                }
            },
            /**
             * 控件的可视方式,值为：
             *  - 'display' 
             *  - 'visibility'
             *  <pre><code>
             *   new Control({
             *     visibleMode: 'visibility'
             *   });
             *  </code></pre>
             * @cfg {String} [visibleMode = 'display']
             */
            /**
             * 控件的可视方式,使用 css 
             *  - 'display' 或者 
             *  - 'visibility'
             * <pre><code>
             *  control.set('visibleMode','display')
             * </code></pre>
             * @type {String}
             */
            visibleMode:{
                view:1,
                value : 'display'
            },
            /**
             * 控件是否可见
             * <pre><code>
             *  new Control({
             *    visible : false   //隐藏
             *  });
             * </code></pre>
             * @cfg {Boolean} [visible = true]
             */
            /**
             * 控件是否可见
             * <pre><code>
             *  control.set('visible',true); //control.show();
             *  control.set('visible',false); //control.hide();
             * </code></pre>
             * @type {Boolean}
             * @default true
             */
            visible:{
                value:true,
                view:1
            },
            /**
             * 是否允许处理鼠标事件
             * @default true.
             * @type {Boolean}
             * @protected
             */
            handleMouseEvents: {
                value: true
            },

            /**
             * 控件是否可以获取焦点
             * @default true.
             * @protected
             * @type {Boolean}
             */
            focusable: {
                value: false,
                view: 1
            },
            /**
             * 一旦使用loader的默认配置
             * @protected
             * @type {Object}
             */
            defaultLoaderCfg : {
                value : {
                    property : 'content',
                    autoLoad : true
                }
            },
            /**
             * 控件内容的加载器
             * @type {BUI.Component.Loader}
             */
            loader : {
                getter : function(v){
                    var _self = this,
                        defaultCfg;
                    if(v && !v.isLoader){
                        v.target = _self;
                        defaultCfg = _self.get('defaultLoaderCfg')
                        v = new Loader(BUI.merge(defaultCfg,v));
                        _self.setInternal('loader',v);
                    }
                    return v;
                }
            },
            /**
             * 1. Whether allow select this component's text.<br/>
             * 2. Whether not to lose last component's focus if click current one (set false).
             *
             * Defaults to: false.
             * @type {Boolean}
             * @property allowTextSelection
             * @protected
             */
            /**
             * @ignore
             */
            allowTextSelection: {
                // 和 focusable 分离
                // grid 需求：容器允许选择里面内容
                value: true
            },

            /**
             * 控件是否可以激活
             * @default true.
             * @type {Boolean}
             * @protected
             */
            activeable: {
                value: true
            },

            /**
             * 控件是否获取焦点
             * @type {Boolean}
             * @readOnly
             */
            focused: {
                view: 1
            },

            /**
             * 控件是否处于激活状态，按钮按下还未抬起
             * @type {Boolean}
             * @default false
             * @protected
             */
            active: {
                view: 1
            },
            /**
             * 控件是否高亮
             * @cfg {Boolean} highlighted
             * @ignore
             */
            /**
             * 控件是否高亮
             * @type {Boolean}
             * @protected
             */
            highlighted: {
                view: 1
            },
            /**
             * 子控件集合
             * @cfg {BUI.Component.Controller[]} children
             */
            /**
             * 子控件集合
             * @type {BUI.Component.Controller[]}
             */
            children: {
                sync : false,
                shared : false,
                value: []/**/
            },
            /**
             * 控件的CSS前缀
             * @cfg {String} [prefixCls = BUI.prefix]
             */
            /**
             * 控件的CSS前缀
             * @type {String}
             * @default BUI.prefix
             */
            prefixCls: {
                value: BUI.prefix, // box srcNode need
                view: 1
            },

            /**
             * 父控件
             * @cfg {BUI.Component.Controller} parent
             * @ignore
             */
            /**
             * 父控件
             * @type {BUI.Component.Controller}
             */
            parent: {
                setter: function (p) {
                    // 事件冒泡源
                    this.addTarget(p);
                }
            },

            /**
             * 禁用控件
             * @cfg {Boolean} [disabled = false]
             */
            /**
             * 禁用控件
             * <pre><code>
             *  control.set('disabled',true); //==  control.disable();
             *  control.set('disabled',false); //==  control.enable();
             * </code></pre>
             * @type {Boolean}
             * @default false
             */
            disabled: {
                view: 1,
                value : false
            },
            /**
             * 渲染控件的View类.
             * @protected
             * @cfg {BUI.Component.View} [xview = BUI.Component.View]
             */
            /**
             * 渲染控件的View类.
             * @protected
             * @type {BUI.Component.View}
             */
            xview: {
                value: View
            }
        },
        PARSER : {
            visible : function(el){
                var _self = this,
                    display = el.css('display'),

                    visibility = el.css('visibility'),
                    visibleMode = _self.get('visibleMode');
                if((display == 'none' && visibleMode == 'display')  || (visibility == 'hidden' && visibleMode == 'visibility')){
                    return false;
                }
                return true;
            }
        }
    }, {
        xclass: 'controller',
        priority : 0
    });
    
    return Controller;
});
