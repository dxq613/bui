BUI.use(['bui/grid/grid','bui/grid/plugins'],function(Grid,Plugins){

	var CLS_CHECKBOX = 'bui-grid-checkBox',
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
		data = [{a:'123'},{a:'cdd',b:'edd'},{a:'1333',c:'eee',d:2}];
		
	var grid = new Grid({
		render:'#J_Grid',
		columns : columns,
		plugins : [Plugins.CheckSelection],
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
	});

	describe("测试事件", function () {
		var col = columns[0],
			colCheckBox = col.get('el').find('.'+ CLS_CHECKBOX),
			rows = bodyEl.find('.bui-grid-row');
		it('测试选中表头',function(){
			//colCheckBox.attr('checked','checked');
			expect(colCheckBox).not.toBe(null);
			var checked = colCheckBox.attr('checked');
			/**/
			//colCheckBox.attr('checked',!checked);
			jasmine.simulate(colCheckBox[0],'click');
			//colCheckBox.fire('click');
			waits(300);
			runs(function(){
				expect(!!colCheckBox.attr('checked')).toBe(!checked);
				rows.each(function(index,row){
					var checkBox = $(row).find('.'+ CLS_CHECKBOX);
					expect(!!checkBox.attr('checked')).toBe(!checked);
				});

			});
		});

		it('测试取消选中表头',function(){
			colCheckBox.attr('checked','checked');
			jasmine.simulate(colCheckBox[0],'click');
			waits(300);
			runs(function(){
				expect(!!colCheckBox.attr('checked')).toBe(false);
				rows.each(function(index,row){
					var checkBox = $(row).find('.'+ CLS_CHECKBOX);
					expect(!!checkBox.attr('checked')).toBe(false);
				});

			});
		});

		it('测试勾选行,取消勾选',function(){
			var index = 1,
				record = data[index],
				row = $(rows[index]),
				checkBox = row.find('.'+ CLS_CHECKBOX);
			grid.setSelection(record);
			expect(!!checkBox.attr('checked')).toBe(true);
			grid.clearSelection();
			expect(!!checkBox.attr('checked')).toBe(false);
		});
	});
	
});