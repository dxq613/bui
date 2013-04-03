BUI.use(['bui/toolbar','bui/data'],function(Toolbar,Data){
	
	var NumerPBar = Toolbar.NumberPagingBar,
			Store = Data.Store;

	describe("测试初始化", function(){
		var bar = new NumerPBar({
			render : '#numpbar',
			elCls : 'pagination'
		});
		bar.render();

		var barEl = $('#numpbar .bui-bar-item');

		it('测试pagingbar生成',function(){
			expect(barEl).toNotBe(null);
			expect(barEl.length).toBe(bar.get('children').length);
		});

		it('测试生成按钮：上一页和下一页',function(){
			var firstBtn = bar.getItem('first'),
				prevBtn = bar.getItem('prev'),
				nextBtn = bar.getItem('next');

			//未生成首页按钮
			expect(firstBtn).toBe(null);
			expect(prevBtn).not.toBe(null);
			expect(nextBtn).not.toBe(null);

			expect(prevBtn.get('el')).toBeTruthy();
			expect(nextBtn.get('el')).toBeTruthy();
		});		
	});

	describe("测试加载数据后，当页面少于6页时", function(){
		var store = new Store({
			url:'data/number40.php',
			pageSize : 10
		});
		var bar1 = new NumerPBar({
			render : '#numpbar1',
			elCls : 'pagination',
			store: store
		});
		bar1.render();

		var barItem = bar1.get('el');
		it('测试生成的页码是否正确',function(){
			var count  = bar1.get('totalPage');
			store.load();
			waits(200);
			runs(function(){
				var count  = bar1.get('totalPage'),
					curPage = bar1.get('curPage');
				expect($('.bui-button-number',barItem).length).toBe(count);
				expect($('.active',barItem).text()).toBe(curPage.toString());
			});			
		});

		it('跳转到首页,选中数字按钮 “1”,按钮有选中状态',function(){
			bar1.jumpToPage(1);
			waits(200);
			runs(function(){
				var curPageObj = $('.bui-button-number',barItem)[0];
				expect($(curPageObj).hasClass('active')).toBeTruthy();
				expect($('.active',barItem).text()).toBe('1');
			});			
		});

		it('跳转到末页,选中最后一个按钮',function(){
			var lastPage = bar1.get('totalPage');
			bar1.jumpToPage(lastPage);
			waits(200);
			runs(function(){
				expect($('.active',barItem).text()).toBe(lastPage.toString());
			});			
		});

		it('跳转到中间页',function(){
			var lastPage = bar1.get('totalPage'),
				middle = parseInt((lastPage + 1) / 2);
			bar1.jumpToPage(middle);
			waits(200);
			runs(function(){
				expect($('.active',barItem).text()).toBe(middle.toString());
			});
		});		
	});

	describe("测试加载数据后，当页面大于6页时",function(){
		var store = new Store({
				url:'data/number40.php',
				pageSize : 4
			}),
		bar1 = new NumerPBar({
			render : '#numpbar2',
			elCls : 'pagination',
			store : store
		});
		bar1.render();

		var barItem = bar1.get('el');
		var limitCount = bar1.get('maxLimitCount');
		it('测试生成的页码是否正确',function(){
			var count  = bar1.get('totalPage');
			store.load();
			waits(200);
			runs(function(){
				var count  = bar1.get('totalPage'),
					curPage = bar1.get('curPage');

				expect($('.bui-button-number',barItem).length).not.toBe(count);
				expect($('.active',barItem).text()).toBe(curPage.toString());	
			});			
		});

		it('跳转到中间页',function(){
			var lastPage = bar1.get('totalPage'),
				middle = parseInt((lastPage + 1) / 2);
			bar1.jumpToPage(middle);
			waits(200);
			runs(function(){
				expect($('.active',barItem).text()).toBe(middle.toString());
			});
		});

		it('跳到第九页',function(){
			bar1.jumpToPage(9);
			waits(200);
			runs(function(){
				var curPage = bar1.get('curPage');
				expect($('.active',barItem).text()).toBe(curPage.toString());
			});
		});	

	});

	describe('测试按钮事件',function(){
		var store = new Store({
				url:'data/number40.php',
				pageSize : 1
			}),
		bar1 = new NumerPBar({
			render : '#numpbar3',
			elCls : 'pagination',
			store : store
		});
		bar1.render();

		var barItem = bar1.get('el');
		it('测试点击上一页',function(){
			var prevBtn = bar1.getItem('prev');

			expect(prevBtn).not.toBe(null);

			//跳转到第11页
			store.load({start:10});
			waits(200);

			runs(function(){
				var curPage = bar1.get('curPage');

				prevBtn.fire('click');
				waits(100);
				runs(function(){					
					expect(bar1.get('curPage')).toBe(curPage-1);
				});				
			});

		});

		it('测试点击下一页',function(){
			var nextBtn = bar1.getItem('next');

			expect(nextBtn).not.toBe(null);

			runs(function(){
				var curPage = bar1.get('curPage');

				nextBtn.fire('click');
				waits(100);
				runs(function(){					
					expect(bar1.get('curPage')).toBe(curPage+1);
				});				
			});
		});

		it('测试当前页数据刷新',function(){
			var curPage = bar1.get('curPage');

			runs(function(){
				var curPage = bar1.get('curPage'),
					item = bar1.getItem(curPage);
				var callback = jasmine.createSpy();
				store.on('load',callback)
				item.fire('click');
				waits(100);
				runs(function(){	
					expect(callback).toHaveBeenCalled();
					store.off('load',callback);
				});				
			});
		});

	});
});