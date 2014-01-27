BUI.use(['bui/graphic','bui/chart/labels'],function (Graphic,Lables) {

	var canvas = new Graphic.Canvas({
		render : '#s1',
		width : 500,
		height : 500
	});

	

	var labels = canvas.addGroup(Lables,{

		label : {
			font : "18px solid '宋体'",
			fill : 'red',
			x : -10,
			y : 20
		},
		items : [
			'第一句文本',
			{text : '是西溪西溪',x : 100,y:100},
			{text : 'hello\nworld',x : 100,y:100},
			{text : '你好啊!',fill : '#ffcc00',x : 20,y : 30},
			{text : '旋转的文本',rotate : -45,x : 50,y : 70}
		]
	});

	var nodeEl = $(labels.get('node'));
	describe('测试labels生成',function(){

		it('测试生成',function(){
			expect(labels.get('node')).not.toBe(undefined);
			expect(labels.get('node').getAttribute('class').indexOf('x-chart-labels') > -1).toBe(true);
		});

		it('测试文本生成',function(){
			expect(nodeEl.children().length).toBe(labels.get('items').length);
		});

		it('测试默认偏移位置',function(){
			var first = labels.getChildAt(0);
			expect(first.attr('x')).toBe(-10);
			expect(first.attr('y')).toBe(20);
		});

		it('测试偏移,指定位置',function(){
			var item = labels.getChildAt(1);
			expect(item.attr('x')).toBe(90);
			expect(item.attr('y')).toBe(120);
		});

		it('测试换行',function(){
			var item = labels.getChildAt(2);
			expect($(item.get('node')).children().length > 1).toBe(true);
		});

		it('测试自定义属性',function(){
			var item = labels.getChildAt(3);
			expect(item.attr('fill')).toBe('#ffcc00');
		});

		it('测试旋转',function(){
			var item = labels.getChildAt(4),
				matrix = item.attr('transform');
			expect(matrix[0][0]).toBe('r');
			expect(matrix[0][1]).toBe(-45);
		});

	});	

});