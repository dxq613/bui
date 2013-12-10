
BUI.use(['bui/layout/anchor'],function(Anchor) {

	var layout = new Anchor(),
		control = new BUI.Component.Controller({
		width:800,
		height:500,
		render : '#J_Layout',
		elCls : 'layout-test',
		children : [{
			layout : {
				anchor : ['100%',50]
			},
			xclass : 'controller',
			content : "一 ['100%',50]"
		},{
			xclass : 'controller',
			layout : {
				anchor : [-100,50]
			},
			content : '二 [-100,50]'
		},{
			xclass : 'controller',
			layout : {
				anchor : ['60%','20%']
			},
			content : "三 ['60%','20%']"
		},{
			xclass : 'controller',
			layout : {
				anchor : ['50%',-300]
			},
			content : "四 ['50%',-300]"
		}],
		plugins : [layout]
	});

	control.render();
	var el = control.get('el');

	describe('测试初始化',function(){
		var children = el.children();
		it('测试生成布局项',function(){
			expect(el.children().length).toBe(control.get('children').length);
		});
		it('测试布局项的属性',function(){
			
			expect($(children[0]).css('width')).toBe('800px');
			expect($(children[0]).css('height')).toBe('50px');
			
		});
		it('测试计算的值',function(){
			
			expect($(children[1]).width()).toBe(700);

			expect($(children[3]).height()).toBe(200);
		});
	});

	describe('操作',function(){
		var children = el.children();
		it('重置高度',function(){
			control.set('height',600);
			expect($(children[3]).height()).toBe(300);
		});

		it('添加',function(){
			var count = layout.getItems().length;
			control.addChild({
				xclass : 'controller',
				id : 'new',
				layout : {
					anchor : [-200,-400]
				},
				content : '附加内容'
			});

			expect(layout.getItems().length).toBe(count + 1);
			expect(el.find('.x-layout-item').length).toBe(count + 1);

		});
		it('修改',function(){
			var child = control.getChild('new'),
				
				item = layout.getItem(child);
			//child.set('layout',layout);
			expect(item).not.toBe(undefined);
			item.set('anchor',[100,-300]);
			item.syncItem();
			expect(item.get('el').css('width')).toBe('100px');
			expect(item.get('el').css('height')).toBe('300px');

		});
		it('删除',function(){
			var count = layout.getItems().length,
				child = control.getChild('new');

			child.remove();

			expect(layout.getItems().length).toBe(count - 1);
			expect(el.find('.x-layout-item').length).toBe(count - 1);
		});

	});

});