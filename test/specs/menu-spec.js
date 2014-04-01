
BUI.use('bui/menu',function(Menu) {
	
	var menu = new Menu.Menu({
		render : '#m1',
		children : [
			{
				xclass : 'menu-item',
				content : '菜单一'

			},
			{
				id : 'm12',
				xclass : 'menu-item',
				content: '菜单二'
			},
			{
				xclass : 'menu-item',
				tpl : '<span><a href="{href}">{text}</a></span>',
				href :'http://www.taobao.com',
				text : '链接'
			}
		]
	});

	menu.render();
	el = menu.get('el');
	var children = menu.get('children');
	describe("测试菜单生成",function(){
		it('生成菜单',function(){
			expect(el).not.toBe(undefined);
			expect(el[0].nodeName).toBe('UL');
			expect(el.hasClass('bui-menu')).toBeTruthy();
		});

		it('生成子菜单',function(){
			
			expect(el.children().length).toBe(children.length);
			$.each(children,function(i,item){
				expect(item.get('el').hasClass('bui-menu-item')).toBeTruthy();
			})
		});
		
		it('测试点击事件',function(){
			var item = children[0],
				callback = jasmine.createSpy();
			menu.on('itemclick',callback);

			item.fire('click');
			waits(100);
			runs(function(){
				expect(callback).toHaveBeenCalled();
			});
			item.off('click');
		});

		it('测试点击事件Target',function () {
			var item = children[0],
				target = null;

			menu.on('itemclick',function(ev){
				target = ev.item;
			});

			item.fire('click');
			waits(100);
			runs(function(){
				expect(target).toBe(item);
			});
			item.off('click');
		});

		it('测试模版',function(){
			var item = children[2];
			var text = item.get('el').text();
			expect(text).toBe('链接');
		});
		it('查找菜单项',function(){
			var id = "m12",
				item = menu.findItemById(id);
			expect(item).not.toBe(null);
			expect(item.get('id')).toBe(id);
		});
	});

	
});
BUI.use('bui/menu',function(Menu) {
	var sideMenu = new Menu.SideMenu({
				width:200,
				render:'#m2',
				items : [
					{text:'基本结构',items:[
						{text : '上部导航',href:'1.php'},{id:'ss1',text:'左边导航',href:'2.php'}
					]},
					{text:'常用页面',collapsed:true,items:[
						{text : '上部导航',href:'1.php'},{text:'左边导航',href:'2.php'}
					]}
				]
			});

			sideMenu.render();
	describe("测试侧边栏菜单",function(){
			
			var el = sideMenu.get('el');
			it("测试菜单生成",function(){
				expect(el).not.toBe(undefined);
				var children = el.children();
				expect(children.length).toBe(2);
			});
			it('设置选中的菜单',function(){
				var id = 'ss1',
					item = null;
				sideMenu.setSelectedByField(id);
				item = sideMenu.getSelected();
				expect(item).not.toBe(null);
				expect(item.get('id')).toBe(id);
			});

		});

	});

BUI.use('bui/menu',function(Menu) {
	var subMenu = new Menu.ContextMenu({

			children : [
				{
					xclass : 'context-menu-item',
					iconCls:'icon-refresh',
					text : '刷新'

				},
				{xclass:'menu-item-sparator'},
				{
					id : 'm13',
					xclass : 'context-menu-item',
					iconCls:'icon-remove',
					text: '关闭'
				},
				{
					xclass : 'context-menu-item',
					iconCls:'icon-remove-sign',
					text : '关闭所有'
				}
			]
		}),
		menu = new Menu.ContextMenu({
		children : [
			{
				iconCls:'icon-refresh',
				text : '刷新'

			},
			{xclass:'menu-item-sparator'},
			{
				id : 'm12',
				iconCls:'icon-remove',
				text: '关闭',
				subMenu : subMenu
			},
			{
				iconCls:'icon-remove-sign',
				text : '关闭所有'
			}
		]
	});

	var contentEl = $('#content');
	contentEl.on('click',function(e){
		menu.set('xy',[e.pageX,e.pageY]);
		menu.show();
	});
	
	describe('测试菜单生成',function () {

		it('测试菜单项生成',function () {
			menu.render();
			var item = menu.findItemById('m12');
			expect(item).not.toBe(null);
			expect(item.get('subMenu')).not.toBe(undefined);
		});

	});

	describe('显示菜单后',function () {

		it('测试菜单项生成',function () {
			//expect(menu.get('visible')).toBe(false);
			contentEl.trigger('click',{pageX:100,pageY:100});
			waits(100);
			runs(function (argument) {
				expect(menu.get('visible')).toBe(true);
			});
		});
		it('测试更改菜单项图标',function () {
			var item = menu.findItemById('m12'),
				itemEl = item.get('el');
			expect(itemEl.find('.icon-remove').length).not.toBe(0);
			item.set('iconCls','icon-ok');
			expect(itemEl.find('.icon-ok').length).not.toBe(0);
			expect(itemEl.find('.icon-remove').length).toBe(0);
		});
		it('测试子菜单显示',function () {
			var item = menu.findItemById('m12');
			item.set('open',true);
			expect(subMenu.get('visible')).toBe(true);

			item.set('open',false);
			expect(subMenu.get('visible')).toBe(false);
		});

		it('测试菜单隐藏',function () {
			var item = menu.findItemById('m12');
			item.set('open',true);
			expect(subMenu.get('visible')).toBe(true);

			menu.hide();
			expect(menu.get('visible')).toBe(false);
			expect(subMenu.get('visible')).toBe(false);
		});
	});
});

BUI.use('bui/menu',function(Menu) {
	var dropMenu = new Menu.PopMenu({
		trigger : '#btn',
		autoRender : true,
		width : 140,
		children : [{
			id:'m1',
			content : "选项1"
		},{
			content : "选项2"
		},{
			content : "选项3"
		}]
	});
	var btn = $('#btn');
	describe('显示,隐藏菜单',function () {
		it('点击显示菜单',function () {
			btn.trigger('click');
			waits(100);
			runs(function () {
				expect(dropMenu.get('visible')).toBe(true);
			});
		});
		it('点击菜单项，隐藏菜单',function() {
			var item = dropMenu.findItemById('m1');
			expect(item).not.toBe(null);

			item.fire('click');
			waits(100);
			runs(function (argument) {
				expect(dropMenu.get('visible')).toBe(false);
			});
		});

		it('显示菜单项后，点击外部隐藏',function () {
			btn.trigger('click');
			waits(100);
			runs(function () {
				expect(dropMenu.get('visible')).toBe(true);
				$('#btn1').trigger('mousedown');
				waits(100);
				runs(function () {
					expect(dropMenu.get('visible')).toBe(false);
				});
			});
		})
	});
});

BUI.use('bui/menu',function(Menu) {
	var dropMenu = new Menu.PopMenu({
		trigger : '#link',
		autoRender : true,
		triggerEvent : 'mouseenter',
		triggerHideEvent : 'mouseleave',
		autoHideType:'leave',
		width : 140,
		children : [{
			id:'m5',
			content : "选项1"
		},{
			content : "选项2"
		},{
			content : "选项3"
		}]
	});
	var link = $('#link');
	
});
/*

BUI.use('bui/menu',function(Menu) {

	var menu = new Menu.Menu({
		srcNode : '#m20'
	});

	menu.render();

	describe('测试根据DOM生成菜单',function(){
		it('测试菜单生成',function(){
			expect(menu.get('el').attr('id')).toBe('m20');
			expect(menu.get('children').length).toBe(4);
		});

		it('测试子菜单完成',function(){
			var item = menu.getItemAt(0);
			expect(item.get('subMenu')).not.toBe(null);
		})
	});
});


BUI.use('bui/menu',function(Menu){
	var sideMenu = new Menu.SideMenu({
			width:200,
			srcNode:'#m15',
			collapsedCls : 'title'
		});

	sideMenu.render();
});
*/
