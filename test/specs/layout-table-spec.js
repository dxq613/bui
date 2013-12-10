
BUI.use(['bui/layout/table'],function(Table) {

	var layout = new Table({
		rows : 4,
		columns : 4
	}),
		control = new BUI.Component.Controller({
		width:600,
		height:500,
		render : '#J_Layout',
		elCls : 'layout-test',
		defaultChildClass : 'controller',
		children : [
			{
				layout : {
					row : 0,
					height : 50
				},
				content : '1'
			},{
				layout : {
					row : 0
				},
				content : '2'
			},{
				layout : {
					row : 0
				},
				content : '3'
			},{
				layout : {
					row : 0,
					rowspan : 4
				},
				content : '4'
			},

			{
				layout : {
					row : 1,
					colspan : 2,
					height : 100
				},
				content : '5'
			},{
				layout : {
					row : 1
				},
				content : '6'
			},

			{
				id:'7',
				layout : {
					row : 2
				},
				content : '7'
			},{
				layout : {
					row : 2,
					colspan : 2,
					rowspan:2
				},
				id : '8',
				content : '8'
			},

			{
				id:'9',
				layout : {
					row : 3
				},
				content : '9'
			}

		],
		plugins : [layout]
	});

	control.render();
	var el = control.get('el');

	describe('测试初始化',function(){
		var children = el.find('td');
		it('测试生成布局项',function(){
			expect(children.length).toBe(control.get('children').length);
		});
	});

	describe('操作',function(){
		it('删除',function(){
			var count = layout.getItems().length,
				child = control.getChild('8');
			child.remove();
			expect(layout.getItems().length).toBe(count -1);
		});

		/**/it('更改',function(){
			var child = control.getChild('7'),
				item = layout.getItem(child);

			expect(item).not.toBe(undefined);
			item.set('colspan',3);
			item.syncItem();
			expect(item.get('el').attr('colspan')).toBe('3');
		});

	});

});