
BUI.use(['bui/graphic','bui/chart/tooltip'],function (Graphic,Tooltip) {
	

	var canvas = new Graphic.Canvas({
		render : '#s1',
		width : 300,
		height : 300
	});

	var tooltip = canvas.addGroup(Tooltip,{
		x : 10,
		y : 10,
		title : {
			text : '这是测试title',
			'font-size' : '10',
				'text-anchor' : 'start',
				x : 8,
				y : 15
		},
		visible : true,
		valueSuffix : 'millions',
		items : [
			{color : 'red',name : 'name1',value : '1222333'},
			{color : 'blue',name : 'n2',value : '1233'},
			{color : 'yellow',name : 'name3',value : 'swww - afas'}
		]
	});

	describe('测试生成',function(){

		it('测试tooltip',function(){
			expect(tooltip.get('el')).not.toBe(undefined);
			expect(tooltip.get('node')).not.toBe(undefined);
		});

		it('测试title',function(){
			expect(tooltip.get('titleShape')).not.toBe(undefined);
		});

		it('测试文本项',function(){
			expect(tooltip.get('textGroup')).not.toBe(undefined);
			expect(tooltip.get('textGroup').getCount()).toBe(3);
		});

		it('测试边框',function(){
			var borderShape = tooltip.get('borderShape');
			expect(borderShape).not.toBe(undefined);
			expect(borderShape.attr('stroke')).toBe('red');
		});

	});

	describe('测试操作',function(){

		it('修改标题',function(){
			waits(500);
			runs(function(){
				var title = 'new title';
				tooltip.setTitle(title);
				expect(tooltip.get('titleShape').attr('text')).toBe(title);
			});
			
		});

		it('修改内容',function(){
			var items = [{
				color : '#2f7ed8',
				name : 'Asia',
				value : '635'
			},{
				color : '#0d233a',
				name : 'Africa',
				value : '107'
			}];

			tooltip.setItems(items);

			expect(tooltip.get('textGroup').getCount()).toBe(2);
		});

		it('边框改变',function(){
			expect(tooltip.get('borderShape').attr('stroke')).toBe('#2f7ed8');
		});

		it('测试移动',function(){
			tooltip.setPosition(100,100);
		});

		it('修改复杂内容',function(){
			var items = [{
				color : '#2f7ed8',
				name : 'Asia',
				value : '635'
			},{
				color : '#0d233a',
				name : 'Africa',
				value : ['107',{fill : 'red',text : 100}]
			}];

			tooltip.setItems(items);

			expect(tooltip.get('textGroup').getCount()).toBe(2);

		});

	});
});



