
BUI.use(['bui/layout/viewport','bui/layout/border'],function (Viewport,Border) {
	
	

	describe('测试初始化',function(){
		var port1 = new Viewport({
			elCls : 'test1-view'
		});

		port1.render();
		it('测试初始化',function(){
			var viewWidth = BUI.viewportWidth(),
				viewHeight = BUI.viewportHeight();
			expect(port1.get('width')).toBe(viewWidth);
			expect(port1.get('height')).toBe(viewHeight);
		});
		it('调整边距',function(){
			port1.get('el').css('padding',10);
			port1.reset();
			var viewWidth = BUI.viewportWidth(),
				viewHeight = BUI.viewportHeight();
			expect(port1.get('width') + 20).toBe(viewWidth);
			expect(port1.get('height') + 20).toBe(viewHeight);
		});
		it('释放port',function(){
			port1.destroy();
			expect($('.test1-view').length).toBe(0);
		});
	});/**/

	describe('使用layout',function(){
		var port = new Viewport({
			elCls : 'ext-border-layout',
			children : [{
				layout : {
					title : '顶部',
					collapsable : true,
					region : 'north',
					height : 100
				},
				xclass : 'controller',
				content : "一"
			},{
				xclass : 'controller',
				layout : {
					region : 'south',
					title : '下部',
					collapsable : true,
					height : 100
				},
				content : '二'
			},{
				xclass : 'controller',
				layout : {
					region : 'east',
					title : '右侧',
					collapsable : true,
					width : 150
				},
				content : "三"
			},{
				xclass : 'controller',
				layout : {
					region : 'west',
					title : '左侧',
					collapsable : true,
					width : 300
				},
				content : "四"
			},{
				xclass : 'controller',
				layout : {
					title : '居中',
					region : 'center'
				},
				content : '居中'
			}],
			plugins : [Border]
		});
		port.render();

		describe('测试初始化',function(){

		});

	});

});