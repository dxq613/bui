define('bui/graphic/base',function (require) {
	
	/**
	 * @class BUI.Graphic.Base
	 * 图形控件或者分组的基类
	 */
	var Base = function(cfg){
		this.cfg = cfg;
		this._attrs = {
			autoRender : true
		};
		
    BUI.mix(this._attrs,cfg);
    if(this.get('autoRender')){
    	this.render();
    }
	};

	Base.ATTRS = {
		
		/**
		 * @protected
		 * 底层使用了raphael 所以此属性对应raphael的对对象
		 */
		el : {},
		/**
		 * svg或者vml对象
		 * @type {HTMLElement}
		 */
		node : {}
	};

	BUI.augment(Base,{

		/**
  	 * 设置属性信息
  	 * @protected
  	 */
    set : function(name,value){
      this._attrs[name] = value;
    },
    /**
  	 * 获取属性信息
  	 * @protected
  	 */
    get : function(name){
      return this._attrs[name];
    },
    /**
     * 设置或者设置属性，有一下3中情形：
     *
     *   - name为字符串，value 为空，获取属性值
     *   - name为字符串，value不为空，设置属性值，返回this
     *   - name为键值对，value 为空，设置属性值
     *   
     * @param  {String|Object} name  属性名
     * @param  {*} value 属性值
     * @return {*} 属性值
     */
    attr : function(name,value){
      var _self = this,
        el = _self.get('el');
      if(BUI.isObject(name)){
      	BUI.each(name,function(v,k){
      		_self.attr(k,v);
      	});
      	return _self;
      }
      if(value !== undefined){
      	return _self._setAttr(name,value);
      }
      return _self._getAttr(name);
    },
    /**
     * 附加事件
     * @param  {String}   eventType 事件类型
     * @param  {Function} fn  事件处理函数
     */
    on : function(eventType,fn){
      var _self = this,
        node = _self.get('node');
      $(node).on(eventType,fn);
      return this;
    },
    /**
     * 移除事件
     * @param  {String}   eventType 事件类型
     * @param  {Function} fn  事件处理函数
     */
    off : function(eventType,fn){
      var _self = this,
        node = _self.get('node');
      $(node).off(eventType,fn);
      return this;
    },
    /**
     * 触发事件
     * @param  {String} eventType 事件类型
     */
    fire : function(eventType){
      var _self = this,
        node = _self.get('node');
      $(node).trigger(eventType);
    },
    /**
     * 添加委托事件
     * @param  {String}   selector  选择器
     * @param  {String}   eventType 事件类型
     * @param  {Function} fn  事件处理函数
     */
    delegate : function(selector,eventType,fn){
      var _self = this,
        node = _self.get('node');
      $(node).delegate(selector,eventType,fn);
      return this;
    },
    //获取属性值
    _getAttr : function(name){
    	var _self = this,
    		el = _self.get('el'),
    		value = el.attr ? el.attr(name) : '',
    		m = '_get' + BUI.ucfirst(name);
    	if(_self[m]){
    		value = _self[m](value);
    	}
    	return value;
    },
    //设置属性值
    _setAttr : function(name,value){
    	var _self = this,
    		el = _self.get('el'),
    		m = '_set' + BUI.ucfirst(name);
    	if(_self[m]){
    		_self[m](value);
    	}else{
    		el.attr && el.attr(name,value);
    	}
    	return _self;
    },
    /**
     * 渲染控件/图形
     */
    render : function(){
    	var _self = this;

    	if(!_self.get('rendered')){
    		_self.renderUI();
    		_self.set('rendered',true);
    	}
    },
    /**
     * @protected
     * 渲染控件
     */
    renderUI : function(){

    },
    /**
     * 移除，从父元素中移除
     * @param  {Boolean} [destroy=true] 
     */
    remove : function(destroy){
    	if(destroy == undefined){
    		destroy = true;
    	}
    	var _self = this;
    	if(_self.get('parent')){
    		_self.get('parent').removeChild(_self,destroy);
    	}else if(destroy){
    		_self.destroy();
    	}
    },
    /**
     * 析构函数
     */
    destroy : function(){
    	var _self = this,
    		el = _self.get('el'),
        node = _self.get('node');
    	el.remove && el.remove();
    	_self._attrs = {};
      $(node).off();
    }

	});

	return Base;
});