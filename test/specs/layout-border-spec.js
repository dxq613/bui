/**/
BUI.use(['bui/layout/border'],function(Border) {

	var layout = new Border(),
		control = new BUI.Component.Controller({
		width:600,
		height:500,
		render : '#J_Layout',
		elCls : 'ext-border-layout',
		children : [{
			layout : {
				title : 'north',
				region : 'north',
				height : 50
			},
			width : 100,
			height :15,
			elCls : 'red',
			xclass : 'controller',
			content : "一 无自适应"
		},{
			xclass : 'controller',
			elCls : 'red',
			layout : {
				region : 'south',
				title : 'south',
				fit : 'height',
				height : 50
			},
			width : 250,
			content : '二 自适应高，但是不自适应宽'
		},{
			xclass : 'controller',
			layout : {
				region : 'east',
				fit : 'both',
				title : 'east',
				width : 150
			},
			elCls : 'red',
			content : "三 自适应宽高"
		},{
			xclass : 'controller',
			layout : {
				region : 'west',
				fit : 'width',
				width : 100
			},
			elCls : 'red',
			content : "四 自适应宽"
		},{
			xclass : 'controller',
			layout : {
				region : 'center',
				fit : 'both'
			},
			
			elCls : 'blue',
			content : '居中 自适应宽高'
		}],
		plugins : [layout]
	});

	control.render();
	var el = control.get('el');
	function getItemByRegion(region){
		return layout.getItemBy(function(item){
			return item.get('region') == region;
		});
	}
	describe('测试初始化',function(){
		var children = el.children();
		it('测试生成布局项',function(){
			expect(el.find('.x-layout-item-border').length).toBe(control.get('children').length);
		});

		it('north位置',function(){
			var north = getItemByRegion('north');
			expect(north).not.toBe(null);
			expect(north.get('el').parent().hasClass('x-border-top'));
		});
		it('south位置',function(){
			var south = getItemByRegion('south');
			expect(south).not.toBe(null);
			expect(south.get('el').parent().hasClass('x-boder-bottom'));
		});

		it('east位置',function(){
			var east = getItemByRegion('east');
			expect(east).not.toBe(null);
			expect(east.get('el').parent().hasClass('x-border-middle'));
		});
		it('west位置',function(){
			var west = getItemByRegion('west');
			expect(west).not.toBe(null);
			expect(west.get('el').parent().hasClass('x-border-middle'));
		});

		it('测试初始化高度',function(){
			var centerEl = layout.get('middleEl');
			expect(centerEl.height() > 300).toBe(true);
		});

		it('测试title',function(){
			var north = getItemByRegion('north');
			expect(!!north.get('title')).toBe(true);
			expect(north.get('el').find('.x-border-title').length).toBe(1);

			var west = getItemByRegion('west'); 
			expect(!!west.get('title')).toBe(false);
			expect(west.get('el').find('.x-border-title').length).toBe(0);

		});
		
	});
	
	function getFitHeight(item){
		 var el = item.get('el'),
				titleEl = item.get('_titleEl');
		if(titleEl){
			return el.height() - titleEl.outerHeight();
		}else{
			return el.height();
		}
		
	}

	function testCenter(){
		var center = getItemByRegion('center'),
				control = center.get('control');
			expect(getFitHeight(center)).toBe(control.get('el').outerHeight());
			expect(center.get('el').width()).toBe(control.get('el').outerWidth());
	}
	describe('自适应宽高',function(){
		it('测试自适应高度',function(){
			var south = getItemByRegion('south');
			expect(getFitHeight(south)).toBe(south.get('control').get('el').outerHeight());
		});

		it('测试无自适应',function(){
			var north = getItemByRegion('north'),
				control = north.get('control');
			expect(getFitHeight(north)).not.toBe(control.get('el').outerHeight());
			expect(north.get('width')).not.toBe(control.get('el').outerWidth());

		});
		it('测试自适应宽度',function(){
			var west = getItemByRegion('west'),
				control = west.get('control');
			expect(getFitHeight(west)).not.toBe(control.get('el').outerHeight());
			expect(west.get('width')).toBe(control.get('el').outerWidth());
		});
		it('测试自适应宽高',function(){
			var east = getItemByRegion('east'),
				control = east.get('control');
			expect(getFitHeight(east)).toBe(control.get('el').outerHeight());
			expect(east.get('width')).toBe(control.get('el').outerWidth());
		});
		it('测试中间区域',function(){
			testCenter();
		});
	});
	
	describe('操作',function(){
		it('添加title',function(){
			var center = getItemByRegion('center');
			
			expect(!!center.get('title')).toBe(false);
			expect(center.get('el').find('.x-border-title').length).toBe(0);
			center.set('title','新的标题');
			center.syncItem();
			expect(!!center.get('title')).toBe(true);
			expect(center.get('el').find('.x-border-title').length).toBe(1);
			
		});
		it('更改title',function(){
			var south = getItemByRegion('south');
			expect(!!south.get('title')).toBe(true);
			expect(south.get('el').find('.x-border-title').length).toBe(1);
			south.set('title','');
			south.syncItem();
			expect(!!south.get('title')).toBe(false);
			expect(south.get('el').find('.x-border-title').length).toBe(0);

		});
		it('更改高度',function(){
			var centerEl = layout.get('middleEl'),
				preHeight = centerEl.height();

			control.set('height',600);
			expect(centerEl.height() - preHeight).toBe(100);
			testCenter();
		});
		
		it('添加',function(){
			var centerEl = layout.get('middleEl'),
				preHeight = centerEl.height();
			control.addChild({
				content : '新增项',
				id : 'new',
				xclass : 'controller',
				layout : {
					region : 'south',
					height:50
				}
			});
			expect(centerEl.height()).not.toBe(preHeight);
			testCenter();
		});

		it('删除',function(){
			var delItem = control.getChild('new');

			var centerEl = layout.get('middleEl'),
				preHeight = centerEl.height();

			delItem.remove();
			expect(centerEl.height()).not.toBe(preHeight);
			testCenter();
		});
	});
});



BUI.use(['bui/layout/border'],function(Border) {

	var layout = new Border(),
		control = new BUI.Component.Controller({
		width:600,
		height:500,
		render : '#J_Layout',
		elCls : 'ext-border-layout',
		children : [{
			layout : {
				title : '顶部',
				collapsable : true,
				region : 'north',
				height : 50
			},
			xclass : 'controller',
			content : "一"
		},{
			xclass : 'controller',
			layout : {
				region : 'south',
				title : '下部',
				collapsable : true,
				collapsed : true,
				height : 50
			},
			content : '二'
		},{
			xclass : 'controller',
			layout : {
				region : 'east',
				title : '右侧',
				collapsable : true,
				width : '20%'
			},
			content : "三"
		},{
			xclass : 'controller',
			layout : {
				region : 'west',
				title : '左侧',
				collapsable : true,
				width : 100
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
		plugins : [layout]
	});

	control.render();
	var el = control.get('el');
	function getItemByRegion(region){
		return layout.getItemBy(function(item){
			return item.get('region') == region;
		});
	}
	
	describe('测试折叠,初始化',function(){
		it('测试默认展开',function(){
			var north = getItemByRegion('north');
			expect(north.get('collapsed')).toBe(false);
			expect(north.get('el').height()).toBe(north.get('height'));

		});
		it('测试默认收缩',function(){
			var south = getItemByRegion('south');
			expect(south.get('collapsed')).toBe(true);
			expect(south.get('el').height()).not.toBe(south.get('height'));
		});
	});

	describe('测试折叠,操作',function(){
		it('折叠选项',function(){
			var east = getItemByRegion('east');
			expect(east.get('collapsed')).toBe(false);
			//expect(east.get('el').width()).toBe(east.get('width'));
			layout.collapseItem(east);

			waits(500);
			runs(function(){
				expect(east.get('collapsed')).toBe(true);
				expect(east.get('el').width()).not.toBe(east.get('width'));
			});
		});

		it('展开选项',function(){
			var south = getItemByRegion('south');
			expect(south.get('collapsed')).toBe(true);
			expect(south.get('el').height()).not.toBe(south.get('height'));

			layout.expandItem(south);

			waits(500);
			runs(function(){
				expect(south.get('collapsed')).toBe(false);
				expect(south.get('el').height()).toBe(south.get('height'));
			});
		});
	});/**/
});

