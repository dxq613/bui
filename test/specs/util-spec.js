BUI.use('bui/common',function(){
	/*	*/
		describe("测试 extend 继承", function () {

			function base(){
				this.name = 'base';
			}

			base.prototype = {
				method1 : function(){
					
				}
			};

			var subClass = function(){
				this.name = 'subclass';
			}
	    
			subClass.prototype ={
				method : function(){}
			};
			BUI.extend(subClass,base,{
				method2:function(){

				}
			});

			var sub2 = BUI.extend(subClass,{
				method3 :function(){}
			});

			var obj = new subClass(),
				obj1 = new sub2();

			it('测试继承',function(){
				expect(obj instanceof base).toBe(true);
				expect(obj instanceof subClass).toBe(true);

				expect(obj1 instanceof subClass).toBe(true);
			});

			it('测试原有的方法',function(){
				expect(obj.method).not.toBe(undefined);
			});
			it('测试继承的方法',function(){
				expect(obj.method1).not.toBe(undefined);
			});

			it('测试自定义的方法',function(){
				expect(obj.method2).not.toBe(undefined);
			});

			it('测试构造函数',function(){
				expect(obj.constructor).toBe(subClass);
			});

			it('测试调用父类的方法',function(){
				expect(obj.constructor.superclass.constructor).toBe(base);
			});

			it('测试直接生成子类',function(){
				expect(obj1.method1).not.toBe(undefined);
				expect(obj1.method2).not.toBe(undefined);
				expect(obj1.method2).not.toBe(undefined);
				expect(obj1.constructor.superclass.constructor).toBe(subClass);
			})
		});

		describe("测试 mixin 扩展", function () {
			
			function a(){
			
			}

			a.ATTRS = {
				p1 : {
					v1:'1',
					v2 : '2',
					v4:'4'
				}
			}

			b.ATTRS = {
				p1 : {
					v1:'b1',
					v2 : 'b2',
					v3:'b3'
				},
				p2 : {
					v : 'b1'
				}
			}

			function b(){
				
			}

			BUI.augment(b,{
				m1 : function(){
				
				}
			});

			BUI.mixin(a,[b]);

			it('测试扩展方法',function(){
				var a1 = new a();
				expect(a1.m1).not.toBe(undefined);
			
			});

			it('测试扩展属性',function(){

				expect(a.ATTRS.p1.v1).toBe('1');
				expect(a.ATTRS.p1.v3).toBe('b3');
				expect(a.ATTRS.p1.v4).toBe('4');
				expect(a.ATTRS.p2.v).toBe('b1');
			
			});
		});

		describe("测试命名空间",function(){

			it("测试创建命名空间",function(){
				expect(BUI.test).toBe(undefined);

				BUI.namespace('test.unit');

				expect(BUI.test).not.toBe(undefined);
				expect(BUI.test.unit).not.toBe(undefined);
				
				BUI.test.a = 'test';
				var obj = {};
				BUI.test.obj = obj;
				BUI.namespace('test.a');
				expect(BUI.test.a).toBe('test');
				expect(BUI.test.obj).toBe(obj) ;

			});
		});

		describe("测试原型链扩展", function () {
		
			it('测试扩展一个对象',function(){
				function a(){
				
				}

				BUI.augment(a,{
					method1 : function(){
						
					}
				});
				var a1=new a();
				expect(a.method1).toBe(undefined);
				expect(a1.method1).not.toBe(undefined);
			});

			it('测试多个扩展',function(){
				function a(){
				
				}

				BUI.augment(a,{
					method1 : function(){
						return 1;
					}
				},{
					method1 : function(){
						return 2;
					},
					method2 : function(){
						return 2;
					}
				});
				var a1=new a();
				expect(a.method1).toBe(undefined);
				expect(a1.method1).not.toBe(undefined);
				expect(a1.method1()).toBe(2);
			});
		});
		
		describe("测试事件",function(){
			var A = function(){
				this.addEvents(['click','up']);
			}
			BUI.extend(A,BUI.Observable);
			
			var a = new A(),
				callback = jasmine.createSpy(),
				callback1 = jasmine.createSpy();
			a.on('click',callback);

			it('测试事件触发',function(){
				a.fire('click');
				expect(callback).toHaveBeenCalled();
			});

			it('测试移除事件',function(){
				callback.reset();
				a.off('click',callback);
				a.fire('click');
				expect(callback).not.toHaveBeenCalled();
			});

			it('测试添加多个事件',function(){
				a.on('up',callback);
				a.on('up',callback1);
				var obj ={a:123};
				a.fire('up',obj);
				expect(callback).toHaveBeenCalledWith(obj);
				expect(callback1).toHaveBeenCalledWith(obj);
				
			});

			it('阻止事件',function(){
				a.pauseEvent('up');
				var newCal = jasmine.createSpy();
				a.on('up',newCal);
				var obj ={a:123};
				a.fire('up',obj);
				expect(newCal).not.toHaveBeenCalled();

				a.resumeEvent('up');
				var obj ={a:123};
				a.fire('up',obj);
				expect(newCal).toHaveBeenCalled();

			});

			it('移除所有事件',function(){
				callback.reset();
				a.clearListeners();
				a.fire('up');
				expect(callback).not.toHaveBeenCalled();
			});
			
		});

		describe("测试拷贝",function(){
			it('测试深拷贝',function(){
				var obj = {a:{},b:{c:{}}},
					obj1 = BUI.cloneObject(obj);
				expect(obj).not.toBe(obj1);

				expect(obj.a).not.toBe(obj1.a);
				expect(obj.b.c).not.toBe(obj1.b.c);
			});	
			
			it('测试合并对象',function(){
				var a = {a:'a'},
					b = {b:'b'};
				var c = BUI.merge(a,b);
				expect(c).not.toBe(a);
				expect(a.a).toBe(c.a);
				expect(b.b).toBe(c.b);
			});
		});

		describe("测试Base类", function () {

			function A(config){
				A.superclass.constructor.call(this,config)
			}

			A.ATTRS = {
				m1 : {
					value : 1
				}
			};
			BUI.extend(A,BUI.Base);

			var a = new A({m2:2});

			it('测试初始值',function(){
				expect(a.get('m1')).toBe(1);
				expect(a.get('m2')).toBe(2);
			})

			it('添加属性，获取默认值',function(){
				var val = 2;
				a.addAttr('a1',{value:val});
				expect(a.get('a1')).toBe(val);
			});

			it('设置属性，获取属性',function(){
				var val = 3;
				a.set('a2',val);
				expect(a.get('a2')).toBe(val);
			});

			it('设置属性，触发事件',function(){
				var val = 4;
				var callback = jasmine.createSpy();
				a.on('afterA1Change',callback);
				a.set('a1',val,{silent:1});
				expect(callback).not.toHaveBeenCalled();

				a.set('a1',val);
				expect(callback).toHaveBeenCalled;

				a.off('afterA1Change',callback);
			});


			it('清除属性',function(){
				a.removeAttr('a1');
				expect(a.get('a1')).toBe(undefined);
			});

			it('获取动态属性',function(){
				var val = 2;
				a.addAttr('b',{getter:function(value){
					return value * 2;
				}});

				a.set('b',val);
				expect(a.get('b')).toBe(val*2);
			});

		});
	
		describe("测试UIBase 基类",function(){

			function A(){

			}

			BUI.extend(A,BUI.Component.UIBase);

			var B = BUI.Component.UIBase.extend({

			});
			var b = new B();
			it('检测基础属性',function(){
				expect(b.get('rendered')).toBe(false);

				b.render();
				expect(b.get('rendered')).toBe(true);
			});
			
		});

		describe("测试控件基类 cotroller ",function(){

			
			it("生成控件",function(){
				var control = new BUI.Component.Controller({
					render : '#c1',
					content : '<p>第一个控件</p>',
					allowTextSelection : true
				});
				control.render();
				expect(control).not.toBe(undefined);
				expect(control.get('el')).not.toBe(undefined);
			});

			it("生成多个控件",function(){
				var control = new BUI.Component.Controller({
					render : '#c2',
					content : '第二个控件',
					children : [
						{
	            id:'1',
							xclass : 'controller',
	            children : [
	              {
	                id:'2',
	                xclass : 'controller',
							    content :'22'
	              },
	              {
	                id:'3',
	                xclass : 'controller',
							    content :'20'
	              }
	            ],
							content :'21'
						},{
	            id:'4',
							xclass : 'controller',
							content :'22'
						}	
					]

				});
				control.render();
				var el = control.get('el'),
					children = el.children();
				expect(children.length).toBe(2);
			});

			it("测试事件",function(){
				var callback = jasmine.createSpy(),
					control = new BUI.Component.Controller({
					content : '<p>第三个控件</p>',
					allowTextSelection : true,
					listeners : {
						'click' : callback
					}
				});
				control.render();
				control.fire('click');
				expect(callback).toHaveBeenCalled();
			});
		});
		
		describe('测试 decorate',function(){
			
			it('测试封装控件生成',function(){
				var cls ='test-cls',
					control = new BUI.Component.Controller({
					srcNode : '#c4',
					elCls : cls
				});
				control.render();
				expect(control.get('id')).toBe('c4');
				expect(control.get('el').hasClass(cls)).toBe(true);
				expect(control.get('el').html()).toBe($('#c4').html());
			});
			/**/
			it('测试封装控件读取属性',function(){
				var el = $('#c5'),
					control = new BUI.Component.Controller({
					srcNode : el
				});
				control.render();
				expect(control.get('title')).toBe(el.attr('title'));
				expect(control.get('value')).toBe(el.attr('data-value'));
				expect(control.get('el').html()).toBe(el.html());
			});

			describe('测试复杂属性',function(){
				var el = $('#c7'),
					control = new BUI.Component.Controller({
					srcNode : el
				});
				control.render();
				it('测试属性名称',function(){
					expect(control.get('blTrue')).not.toBe(null);
				});
				it('测试Boolean类型',function(){
					expect(control.get('blTrue')).toBe(true);
					expect(control.get('blFalse')).toBe(false);
				});

				it('测试数字类型',function(){
					expect(control.get('numA')).toBe(123);
					expect(control.get('numB')).toBe('a234');
				});



			});


			
			it('测试封装控件，封装子控件',function(){

				var AClass = BUI.Component.Controller.extend({},{
					ATTRS : {
						defaultChildClass : {
							value : 'classb'
						}
					}
				},{
					xclass : 'classa'
				});

				var BClass = BUI.Component.Controller.extend({},{
					PARSER : {
						a : function(el){
							return el.text();
						}
					}
				},{
					xclass : 'classb'
				});

				var node = $('#c6'),

					control = new AClass({
						srcNode : node,
						isDecorateChild : true
					});

				control.render();
				var children = control.get('children'),
					nodeChildren = node.children();
				expect(control.get('el').hasClass('bui-classa')).toBe(true);
				expect(children.length).toBe(nodeChildren.length);
				BUI.each(children,function(item){
					expect(item instanceof(BClass)).toBe(true);
					expect(item.get('el').length).not.toBe(0);
					expect(item.get('a')).toBe(item.get('el').text());
				});
			});
		});


	  describe("测试控件查找 ",function(){
	  	var control = new BUI.Component.Controller({
					render : '#c3',
					content : '第三个控件',
					children : [
						{
	            id:'1',
							xclass : 'controller',
	            children : [
	              {
	                id:'2',
	                xclass : 'controller',
							    content :'22'
	              },
	              {
	                id:'3',
	                xclass : 'controller',
							    content :'20'
	              }
	            ],
							content :'21'
						},{
	            id:'4',
							xclass : 'controller',
							content :'22'
						}	
					]

			});
			control.render();

	    it('测试查找',function(){
	      var id = '1';
	      expect(control.getChild(id)).not.toBe(null);
	    });

	   
	    
	    it('测试级联查找',function(){
	      var id = '2';
	      expect(control.getChild(id)).toBe(null);
	      expect(control.getChild(id,true)).not.toBe(null);
	    });

	     it('测试级查找多个',function(){
	      var items = control.getChildrenBy(function(item){
	        return item.get('content') === '22';
	      },true);
	      expect(items.length).toBe(2);

	    });

	     it('测试删除',function(){
	      var id = '4',
	          control1 = control.getChild(id);
	      expect(control1).not.toBe(null);
	      control1.remove(true);
	      expect(control.getChild(id)).toBe(null);
	    })
	  });

		describe('测试json',function(){

			it('测试函数存在',function(){
				expect(BUI.JSON).not.toBe(undefined);
				expect(BUI.JSON.parse).not.toBe(undefined);
				expect(BUI.JSON.stringify).not.toBe(undefined);
			});

			it('测试格式化json成字符串',function(){
				var obj = {a:123},
					str = '{"a":123}';
				expect(BUI.JSON.stringify(obj)).toBe(str);
			});

			it('测试格式化宽松的json字符串',function(){
				var str = '{a:123}',
					obj = BUI.JSON.looseParse(str);
				expect(obj).not.toBe(undefined);
				expect(obj.a).toBe(123);
			});
			
		});
		/**/
/**/
});
