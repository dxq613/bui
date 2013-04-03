BUI.use('bui/progressbar/base',function(Progressbar){

	var progressbar = new Progressbar({
		elCls : 'progress progress-striped active',
		render : '#progressbar',
		tpl : '<div class="bar"></div>',
		percent:50
	});
	progressbar.render();
	var el = progressbar.get('el');

	describe('测试进度条初始化',function(){
		it('测试项的生成',function(){
			waits(700);
			runs(function(){
				expect(el.hasClass('bui-progress-bar').length).not.toBe(0);
			});
			
		});
		it('测试进行中',function(){
			expect(el.find('.bar').length).not.toBe(0);
		});
		
	});

	describe('测试进度条进行状态',function(){
		var barEl = el.children().first();
		it('测试默认进度',function(){
			expect(barEl.width()).toBe(el.width() * 0.5);
		});
		it('测试0%状态',function(){
			progressbar.set('percent',0);
			waits(700);
			runs(function () {
				expect(barEl.width()).toBe(el.width() * 0);
			})
			
		});
		it('测试50%状态',function(){
			progressbar.set('percent',50);
			waits(700);
			runs(function () {
				expect(barEl.width()).toBe(el.width() * 0.5);
			})

		});
		it('测试100%状态',function(){
			progressbar.set('percent',100);
			waits(700);
			runs(function () {
				expect(barEl.width()).toBe(el.width() * 1);

			})
		});


	});
});

BUI.use('bui/progressbar/base',function(Progressbar){

	var progressbar = new Progressbar({
		render : '#progressbar1',
		tpl : '<div class="bar bar-success"></div><div class="bar bar-warning"></div><div  class="bar bar-danger"></div>',
		elCls:'progress',
		percent : [10,30,60]
	});

	progressbar.render();
	var el = progressbar.get('el');

	describe('测试多值进度条',function(){
		it('测试项的初始化状态',function(){
			var children = el.children();
			expect(children.length).toBe(3);
			expect($(children[0]).width()).toBe(el.width() * 0.1);
			expect($(children[1]).width()).toBe(el.width() * 0.3);
			expect($(children[2]).width()).toBe(el.width() * 0.6);
		});
		it('测试项的修改进度值',function(){
			progressbar.set('tpl','<div class="bar bar-success"></div><div class="bar bar-warning"></div><div  class="bar bar-danger"></div><div class="bar bar-info"></div>');
			progressbar.set('percent',[20,30,30,20]);
			var children = el.children();
			expect(children.length).toBe(4);
			waits(700);
			runs(function () {
				expect($(children[0]).width()).toBe(el.width() * 0.2);
				expect($(children[1]).width()).toBe(el.width() * 0.3);
				expect($(children[2]).width()).toBe(el.width() * 0.3);
			});
		});
	});

});

BUI.use('bui/progressbar/load',function(Progressbar){
	var num = 0,
		ajaxCfg = {			
			url : 'data/progress.php',
			dataType : 'json',
			data : {
				id :num
			}
		};
	var progressbar = new Progressbar({
		render : '#progressbar3',
		tpl : '<div class="bar bar-success"></div>',
		elCls:'progress',
		ajaxCfg : ajaxCfg,
		interval : 1000
	});

	progressbar.render();

	

	var el = progressbar.get('el');

	describe('测试多值进度条',function(){
		it('测试项的初始化状态',function(){
			var children = el.children();
			expect(children.length).toBe(1);
			expect($(children[0]).width()).toBe(el.width() * (num / 100));
		});
		it('测试动态改变进度',function () {
			var children = el.children();

			function loadchange (argument) {
				
				var cfg = progressbar.get('ajaxCfg');
				if(cfg.data.id != 100){
					cfg.data.id += 10;
				}
				if(progressbar.isCompleted()){
					progressbar.off('loadchange',loadchange)
				}
			}
			progressbar.on('loadchange',loadchange);
			progressbar.start();
			waitsFor(function() {
				return progressbar.isCompleted();
			},'时间超时11000',11000);
		});

		it('测试完成状态',function(){
			progressbar.set('percent',100);
			expect(progressbar.isCompleted()).toBe(true);
		});
	});

});