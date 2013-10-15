BUI.use(['bui/grid/grid','bui/grid/plugins'],function(Grid,Plugins){

	var CLS_CHECKBOX = 'x-grid-checkbox',
		columns = [{
				title : '表头1',
				dataIndex :'a',
				sortState :'ASC'
			},{
				id: '123',
				title : '表头2',
				dataIndex :'b',
				sortable:false
			},{
				title : '表头3',
				dataIndex : 'c'
		},{
			id : 'colhide',
			title : '隐藏',
			dataIndex : 'd'
		}],
		data = [{a:'123',selected:true},{a:'cdd',b:'edd',disabled:true},{a:'1333',c:'eee',d:2}];
		
	var grid = new Grid({
		render:'#J_Grid',
		columns : columns,
		plugins : [Plugins.CheckSelection],
		itemStatusFields : {
			selected : 'selected',
			disabled : 'disabled'
		},
		forceFit : true
	});
	grid.render();
	grid.showData(data);
	var gridEl = grid.get('el'),
		header = grid.get('header'),
		bodyEl = gridEl.find('.bui-grid-body'),
		columns = grid.get('columns');
	describe("测试生成check列", function () {
	
		it('测试生成表头',function(){
			var col = columns[0];
			expect(header.get('el').find('.'+ CLS_CHECKBOX)).not.toBe(null);
			expect(col.get('el').find('.'+ CLS_CHECKBOX)).not.toBe(null);
		});

		it('测试生成内容',function(){
			var 
				rows = bodyEl.find('.bui-grid-row');
			rows.each(function(index,row){
				expect($(row).find('.bui-grid-checkBox')).not.toBe(null);
			});

		});
		it('测试默认选中',function(){
			var item = data[0];
			expect(grid.hasStatus(item,'selected')).toBe(true);
		});
	});

	describe("测试事件", function () {
		var col = columns[0],
			colEl = col.get('el'),
			colCheckBox = col.get('el').find('.'+ CLS_CHECKBOX),
			rows = bodyEl.find('.bui-grid-row');
		it('测试选中表头',function(){
			
			expect(colCheckBox).not.toBe(null);
			var checked = colEl.hasClass('checked');
			/**/
			//colCheckBox.attr('checked',!checked);
			jasmine.simulate(colCheckBox[0],'click');
			//colCheckBox.fire('click');
			waits(300);
			/*runs(function(){
				expect(colEl.hasClass('checked')).toBe(!checked);
				rows.each(function(index,row){
					if(!grid.hasStatus(null,'disabled',row)){
						expect(grid.hasStatus(null,'selected',row)).toBe(!checked);
					}
					
				});

			});*/
		});

		it('测试取消选中表头',function(){
			colEl.addClass('checked');
			jasmine.simulate(colCheckBox[0],'click');
			waits(300);
			runs(function(){
				expect(!!colEl.hasClass('checked')).toBe(false);
				rows.each(function(index,row){
					if(!grid.hasStatus(null,'disabled',row)){
						expect($(row).hasClass('bui-grid-row-selected')).toBe(false);
					}
				});
			});
		});
	});
	
});