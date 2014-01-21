define('bui/graphic/container',['bui/common','bui/graphic/base','bui/graphic/shape'],function (require) {

	var BUI = require('bui/common'),
		Shape = require('bui/graphic/shape'),
		Base = require('bui/graphic/base');

	/**
	 * @class BUI.Graphic.Container
	 * 图形容器
	 * @extends BUI.Graphic.Base
	 * @abstract
	 */
	var Container = function(cfg){
		Container.superclass.constructor.call(this,cfg);
		this.set('children',[]);;
	};

	BUI.extend(Container,Base);

	Container.ATTRS = {
		/**
		 * 子节点
		 * @type {Array}
		 */
		children : []
	}

	BUI.augment(Container,{

		isContainer : true,

		/**
		 * @protected
		 * @ignore
		 */
		getGroupClass : function(){

		},
		/**
		 * @protected
		 * @ignore
		 */
		getShapeClass : function(type){
			var cName = BUI.ucfirst(type);
			if(Shape[cName]){
				return Shape[cName];
			}
			return Shape;
		},
		/**
		 * 添加图形
		 * @param {String | Object} 类型或者配置项
		 * @param {String} 属性
		 * @return {BUI.Graphic.Shape} 图形
		 */
		addShape : function(type,attrs){
			var _self = this,
				C,
				cfg,
				shape;
			if(BUI.isObject(type)){
				cfg = type;
				type = cfg.type;
			}else{
				cfg = {
					type : type,
					attrs : attrs
				};
			}
			cfg.parent = _self;
			C = _self.getShapeClass(type);
			shape = new C(cfg);
			_self.addChild(shape);
			return shape;
		},
		/**
		 * 添加分组
		 * @return {BUI.Graphic.Group} 分组
		 */
		addGroup : function(cfg){
			var _self = this,
				C = _self.getGroupClass(),
				cfg = BUI.mix({
					parent : _self
				},cfg),
				group = new C(cfg);
			_self.addChild(group);
			return group;
		},
		/**
		 * 移除子图形
		 * @protected
		 * @param  {*} item 子图形或者分组
		 * @param  {Boolean} [destroy=true] 是否同时从控件移除
		 */
		removeChild : function(item,destroy){
			if(destroy == undefined){
    		destroy = true;
    	}
			var _self = this,
				el = _self.get('el'),
				children = _self.get('children');
			BUI.Array.remove(children,item);
			if(el.__set && el.__set.exclude){
				el.__set.exclude(item.get('el'));
			}
			if(destroy){
				item.destroy();
			}
			return item;
		},
		/**
		 * @protected
		 * 添加图形或者分组
		 * @param {BUI.Graphic.Base} 图形或者分组
		 */
		addChild : function(item){
			var _self = this,
				children = _self.get('children');
			children.push(item);
			item.parent = item;
		},
		/**
		 * 根据id查找分组或者图形
		 * @param  {String} id id
		 * @return {BUI.Graphic.Base} 分组或者图形
		 */
		find : function(id){
			var _self = this;
			return _self.findBy(function(item){
				return item.get('id') == id;
			});
		},
		/**
		 * 根据查找函数查找分组或者图形
		 * @param  {Function} fn [description]
		 * @return {BUI.Graphic.Base} 分组或者图形
		 */
		findBy : function(fn){
			var _self = this,
				children = _self.get('children'),
				rst = null;
			BUI.each(children,function(item){
				if(fn(item)){
					rst = item;
					
				}else if(item.findBy){
					rst = item.findBy(fn);
				}
				if(rst){
					return false;
				}
			});
			return rst;
		},
		/**
		 * 清除容器内的图形或者分组
		 */
		clear : function(){
			var _self = this,
				children = _self.get('children'),
				el = _self.get('el');
			BUI.each(children,function(item){
				item.destroy();
			});
			BUI.Array.empty(children);
			if(el.__set && el.__set.clear){
				el.__set.clear();
			}
			el.clear && el.clear();
		},
		/**
		 * 析构函数
		 */
		destroy : function(){
    	var _self = this,
    		children = _self.get('children'),
    		el = _self.get('el'),
    		node = _self.get('node');

    	_self.clear();

    	Container.superclass.destroy.call(this);

    }

	});

	return Container;
});