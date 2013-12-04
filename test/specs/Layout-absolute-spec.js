
BUI.use(['bui/layout/absolute'],function(Absolute) {

	var layout = new Absolute(),
		control = new BUI.Component.Controller({
		width:800,
		height:500,
		elCls : 'layout-test',
		children : [{
			layout : {
				top : 0,
				left : 0,
				width:'100%',
				elCls : 'north',
				height: 50
			},
			xclass : 'controller',
			content : '一'
		},{
			xclass : 'controller',
			layout : {
				width:'20%',
				height : '{height} - 100',
				top:50,
				elCls : 'east',
				left : 0
			},
			content : '二'
		},{
			xclass : 'controller',
			layout : {
				width:'80%',
				height : '{height} - 100',
				left : '20%',
				top:50,
				elCls : 'center'
			},
			content : '中间内容区'
		},{
			xclass : 'controller',
			layout : {
				bottom : 0,
				left : 0,
				width: '100%',
				height:48,
				elCls : 'south'
			},
			width:'100%',
			content : '三'
		}],
		plugins : [layout]
	});

	control.render();
	var el = control.get('el');

	describe('测试初始化',function(){
		it('测试样式',function(){
			expect(el.hasClass('x-layout-relative')).toBe(true);
		});
		it('测试生成布局项',function(){
			expect(el.children().length).toBe(control.get('children').length);
		});
		it('测试布局项的属性',function(){
			var children = el.children();
			expect($(children[0]).css('top')).toBe('0px');
			expect($(children[3]).css('bottom')).toBe('0px');
		});
		it('测试计算的值',function(){
			var children = el.children();
			expect($(children[1]).height()).toBe(400);
		});
	});

	describe('操作',function(){
		var children = el.children();
		it('重置高度',function(){
			control.set('height',600);
			expect($(children[1]).height()).toBe(500);
		});

		it('添加',function(){
			var count = layout.getItems().length;
			control.addChild({
				xclass : 'controller',
				id : 'new',
				layout : {
					top : 10,
					height : 10,
					width : 100,
					elCls : 'search',
					right : 50
				},
				content : '附加内容'
			});

			expect(layout.getItems().length).toBe(count + 1);
			expect(el.find('.x-layout-item-absolute').length).toBe(count + 1);

		});
		it('修改',function(){
			var child = control.getChild('new'),
				childLayout = child.get('layout'),
				item = layout.getItem(child);

			childLayout.right = 150;
			childLayout.top = 20;
			//child.set('layout',layout);
			expect(item).not.toBe(undefined);
			item.set(childLayout);
			item.syncItem();
			expect(item.get('el').css('right')).toBe('150px');

		});
		it('删除',function(){
			var count = layout.getItems().length,
				child = control.getChild('new');

			child.remove();

			expect(layout.getItems().length).toBe(count - 1);
			expect(el.find('.x-layout-item-absolute').length).toBe(count - 1);
		});

	});



});