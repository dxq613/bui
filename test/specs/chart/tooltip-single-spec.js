
BUI.use(['bui/graphic','bui/chart/tooltip','bui/chart/numberaxis','bui/chart/categoryaxis','bui/chart/plotrange'],function (Graphic,Tooltip,NAxis,CAxis,PlotRange) {
	var canvas = new Graphic.Canvas({
		render : '#s2',
		width : 900,
		height : 500
	});

	var plotRange = new PlotRange({x : 50,y : 400},{x : 850, y : 50}),
			xAxis = canvas.addGroup(CAxis,{
				plotRange : plotRange,
				categories : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
				labels : {
					label : {
						y : 12
					}
				}
			});

		var yAxis = canvas.addGroup(NAxis,{
				plotRange : plotRange,
				line : null,
				tickLine : null,
				grid : {
					line : {
						stroke : '#c0c0c0'
					}
				},
				title : {
					text : 'xsxxxxx',
					font : '16px bold',
					fill : 'blue',
					rotate : 90,
					x : -30
				},
				min : -5,
				max : 30,
				position:'left',
				tickInterval : 5,
				labels : {
					label : {
						x : -12
					}
				}
			});

		var tooltip = canvas.addGroup(Tooltip,{
			plotRange : plotRange,
			title : {
				text : '这是测试title',
				'font-size' : '10',
					'text-anchor' : 'start',
					x : 8,
					y : 15
			},
			valueSuffix : 'millions',
			visible : true,
			items : [
				{
				color : '#2f7ed8',
				name : 'Asia',
				value : '635'
			},{
				color : '#0d233a',
				name : 'Africa',
				value : '107'
			}]
			
		});

		canvas.sort();

		describe('测试生成',function(){
			it('测试生成',function(){
				expect(tooltip.get('el')).not.toBe(undefined);
			});
		});

		function getPoint(){
			return {
				x : tooltip.get('x'),
				y : tooltip.get('y')
			};
		}

		describe('测试移动位置',function(){

			it('全部移动到坐标轴内',function(){
				tooltip.setPosition(300,300);
				waits(200);
				runs(function(){
					var bbox = tooltip.getBBox();
					expect(xAxis.isInAxis(bbox)).toBe(true);
					expect(bbox.x + bbox.width).toBe(300);
				});
				
			});

			it('左侧全部外面',function(){
				tooltip.setPosition(10,300);
				waits(300);
				runs(function(){
					var bbox = tooltip.getBBox();
					expect(xAxis.isInAxis(bbox)).toBe(true);
					expect(bbox.x).toBe(50);
					
				});
			});

			it('左侧部分外面',function(){
				tooltip.setPosition(60,300);
				waits(300);
				runs(function(){
					var bbox = tooltip.getBBox();
					expect(xAxis.isInAxis(bbox)).toBe(true);
					expect(bbox.x).toBe(60);
					
				});
			});


			it('上面',function(){
				tooltip.setPosition(300,10);

				waits(300);
				runs(function(){
					var bbox = tooltip.getBBox();
					expect(xAxis.isInAxis(bbox)).toBe(true);
					expect(bbox.y).toBe(50);
					
				});
			});

			it('上面部分',function(){
				tooltip.setPosition(300,60);

				waits(300);
				runs(function(){
					var bbox = tooltip.getBBox();
					expect(xAxis.isInAxis(bbox)).toBe(true);
					expect(bbox.y).toBe(50);
					
				});
			});

			it('左上角',function(){
				tooltip.setPosition(10,10);

				waits(300);
				runs(function(){
					var bbox = tooltip.getBBox();
					expect(xAxis.isInAxis(bbox)).toBe(true);
					expect(bbox.y).toBe(50);
					expect(bbox.x).toBe(50);
					
				});
			});

			it('左上角部分',function(){
				tooltip.setPosition(60,60);

				waits(300);
				runs(function(){
					var bbox = tooltip.getBBox();
					expect(xAxis.isInAxis(bbox)).toBe(true);
					expect(bbox.y).toBe(50);
					expect(bbox.x).toBe(60);
					
				});
			});
		});
});

/**/

BUI.use(['bui/graphic','bui/chart/tooltip','bui/chart/numberaxis','bui/chart/categoryaxis','bui/chart/plotrange'],function (Graphic,Tooltip,NAxis,CAxis,PlotRange) {

	var canvas = new Graphic.Canvas({
		render : '#s3',
		width : 900,
		height : 500
	});

	var plotRange = new PlotRange({x : 50,y : 400},{x : 850, y : 50}),
			xAxis = canvas.addGroup(CAxis,{
				plotRange : plotRange,
				categories : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
				labels : {
					label : {
						y : 12
					}
				}
			});

		var yAxis = canvas.addGroup(NAxis,{
				plotRange : plotRange,
				line : null,
				tickLine : null,
				grid : {
					line : {
						stroke : '#c0c0c0'
					}
				},
				title : {
					text : 'xsxxxxx',
					font : '16px bold',
					fill : 'blue',
					rotate : 90,
					x : -30
				},
				min : -5,
				max : 30,
				position:'left',
				tickInterval : 5,
				labels : {
					label : {
						x : -12
					}
				}
			});

		var tooltip = canvas.addGroup(Tooltip,{
			plotRange : plotRange,
			title : {
				text : '这是测试title',
				'font-size' : '10',
					'text-anchor' : 'start',
					x : 8,
					y : 15
			},
			valueSuffix : 'millions',
			offset : 10,
			crosshairs : true,
			items : [
				{
				color : '#2f7ed8',
				name : 'Asia',
				value : '635'
			},{
				color : '#0d233a',
				name : 'Africa',
				value : '107'
			}]
			
		});

		canvas.sort();

		canvas.on('mousemove',function(ev){
			var point = canvas.getPoint(ev.pageX,ev.pageY);

			if(plotRange.isInRange(point)){
				tooltip.setPosition(point.x,point.y);
				if(!tooltip.get('visible')){
					tooltip.show();
				}
				
			}else{
				if(tooltip.get('visible')){
					tooltip.hide();
				}
				
			}
		});
		tooltip.show();

		describe('测试生成',function(){

			it('tooltip生成',function(){

			});

			it('测试cross线生成',function(){
				var line = tooltip.get('crossShape');
				expect(line).not.toBe(undefined);

			});

		});

		function getX(){
			var line = tooltip.get('crossShape'),
				transform = line.attr('transform');
			return transform[0][1];
		}

		describe('移动',function(){
			it('全部移动到坐标轴内',function(){
				tooltip.setPosition(300,300);
				waits(200);
				runs(function(){
					expect(getX()).toBe(300);
				});
				
			});

			it('左侧全部外面',function(){
				tooltip.setPosition(10,300);
				waits(300);
				runs(function(){
					expect(getX()).toBe(50);
					
				});
			});

			it('左侧部分外面',function(){
				tooltip.setPosition(60,300);
				waits(300);
				runs(function(){
					expect(getX()).toBe(60);
					
				});
			});


			it('上面',function(){
				tooltip.setPosition(300,10);

				waits(300);
				runs(function(){
					expect(getX()).toBe(300);
					
				});
			});

			it('上面部分',function(){
				tooltip.setPosition(300,60);

				waits(300);
				runs(function(){
					expect(getX()).toBe(300);
				});
			});

			it('左上角',function(){
				tooltip.setPosition(10,10);

				waits(300);
				runs(function(){
					
					expect(getX()).toBe(50);
				});
			});

			it('左上角部分',function(){
				tooltip.setPosition(60,60);

				waits(300);
				runs(function(){
					expect(getX()).toBe(60);
				});
			});
	
		});

});