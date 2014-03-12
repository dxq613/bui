
BUI.use(['bui/graphic','bui/chart/baseaxis'],function (Graphic,Axis) {

	var Util = Graphic.Util,
		UA = BUI.UA;

	var canvas = new Graphic.Canvas({
		render : '#s1',
		width : 500,
		height : 500
	});

	function isIe7(){
		return UA.ie && UA.ie < 8;
	}
/**/
	describe('测试坐标轴生成',function(){

		var axis = canvas.addGroup(Axis,{
			start : {x : 10,y : 250},
			end : {x : 490, y : 250},
			position : 'bottom',
			ticks : [0,1,2,3,4,5,6,7,8,9],
			tickOffset : 10,
			title : {
				text : 'x 轴坐标',
				'font-size' : 18,
				y : 30
			},
			labels : {
				label : {
					y : 10
				}
			}
		});

		var node = axis.get('node'),
			nodeEl = $(node);

		it('测试坐标轴生成',function(){
			expect(axis.get('el')).not.toBe(undefined);
			expect(axis.get('node')).not.toBe(undefined);
			expect(node.getAttribute('class').indexOf('x-chart-axis')).not.toBe(-1);
		});
		it('测试线生成',function(){
			if(!(UA.ie && UA.ie < 8)){ //ie7下无法通过class获取子节点
				expect(nodeEl.find('.x-chart-axis-line').length).toBe(1);
			}
			
		});
		it('测试点生成',function(){
			if(!(UA.ie && UA.ie < 8)){ 
				expect(nodeEl.find('.x-chart-axis-ticks').length).toBe(1);
			}
		});
		it('测试label生成',function(){
			var labelsGroup = axis.get('labelsGroup');
			expect(labelsGroup).not.toBe(undefined);
			expect(labelsGroup.get('children').length).toBe(axis.get('ticks').length);
		});
		it('测试tite',function(){
			if(!(UA.ie && UA.ie < 8)){ 
				expect(nodeEl.find('.x-chart-axis-title').length).toBe(1);
			}
		});

		it('测试偏移量',function(){
			if(Graphic.Util.svg){
				expect(axis.get('lineShape').getTotalLength()).toBe(480);
			}
			
			expect(axis._getLength()).toBe(460);
		});

		it('测试移除',function(){
			axis.remove();
			expect($.contains(canvas.get('node'),node)).toBe(false);
			expect(axis.get('children')).toBe(undefined);
		});
		

	});

	describe('测试底部坐标轴',function(){

		var axis = canvas.addGroup(Axis,{
			
			plotRange : {
				start : {x : 10,y : 480},
				end : {x : 480, y : 10}
			},
			position : 'bottom',
			ticks : [0,1,2,3,4,5,6,7,8,9],
			title : {
				text : 'xxx',
				y : 10
			},
			grid : {
				line : {
					stroke : '#c0c0c0'
				},
				minorLine : {
					stroke : '#e0e0e0'
				},
				minorCount : 2
			},
			labels : {
				label : {
					y : 10
				}
			}
		});

		var node = axis.get('node'),
			nodeEl = $(node),
			children = axis.get('children');

		it('测试线生成',function(){
			var 
				line = axis.get('lineShape'),
				path = line.getPath();

			expect(path[0][1]).toBe(10);
			expect(path[0][2]).toBe(480);
			
		});
		it('测试点生成位置',function(){
			var line = axis.get('lineShape'),
				path = line.getPath();
			expect(path[0][2]).toBe(480);
			expect(path[0][1] > 480);
		});
		it('测试label生成位置',function(){
			var labelsGroup = axis.get('labelsGroup');
			expect(labelsGroup.getCount()).toBe(10);
		});
		it('测试tite位置',function(){
			if(!isIe7()){
				var titleEl = nodeEl.find('.x-chart-axis-title'),
					text = axis.findByNode(titleEl[0]);
				expect(text).not.toBe(null);
				expect(text.attr('y')).toBe(490);
			}
			
		});

		it('测试栅格',function(){
			if(!isIe7()){
				expect($(canvas.get('node')).find('.x-chart-grid').length).not.toBe(0);
			}
		});

		it('测试栅格背景',function(){

		});

		it('获取点对应的位置',function(){
			var value = 8,
				offset = axis.getOffset(value);
			expect(parseInt(offset)).toBe(427);
			//axis.remove();
		});

		describe('测试数字坐标轴变化',function(){

			it('更改坐标轴',function(){
				axis.change({
					ticks : [1,2,3,4,5]
				});

				waits(1000);
				runs(function(){
					expect(axis.get('ticks').length).toBe(5);
				});

			});

			it('测试新的label',function(){
				var labelsGroup = axis.get('labelsGroup');
				expect(labelsGroup.getCount()).toBe(5);
			});
			it('测试栅格变化',function(){
				var gridGroup = axis.get('gridGroup'),
					line = gridGroup.getChildAt(0);

				expect(line.getPath().length).toBe(10);

			});

			it('更改回来',function(){
				axis.change({
					ticks : [1,2,3,4,5,6,7,8,9,10]
				});
			});
		});

	});
	
	describe('测试顶部坐标轴',function(){
		var axis = canvas.addGroup(Axis,{
			start : {x : 10,y : 10},
			end : {x : 480, y : 10},
			position : 'top',
			ticks : [0,1,2,3,4,5,6,7,8,9],
			title : {
				text : 'top axis',
				y : 10
			},
			labels : {
				label : {
					y : -10
				}
			}
		});
		var node = axis.get('node'),
			nodeEl = $(node),
			children = axis.get('children');
		it('测试线生成',function(){
			var 
				line = axis.get('lineShape'),
				path = line.getPath();

			expect(path[0][1]).toBe(10);
			expect(path[0][2]).toBe(10);
		});

		it('测试点生成位置',function(){
			var line = axis.get('lineShape'),
				path = line.getPath();
			expect(path[0][2]).toBe(10);
			expect(path[1][2]).toBe(10);
		});
		it('测试label生成位置',function(){

		});
		it('测试tite位置',function(){
			if(!isIe7()){
				var titleEl = nodeEl.find('.x-chart-axis-title'),
					text = axis.findByNode(titleEl[0]);
				expect(text).not.toBe(null);
				expect(text.attr('y')).toBe(20);
			}
		});
	});

	describe('测试左侧坐标轴',function(){

		var axis = canvas.addGroup(Axis,{
			plotRange : {
				start : {x : 10,y : 480},
				end : {x : 480, y : 10}
			},
			position : 'left',
			ticks : [0,1,2,3,4,5,6,7,8,9],
			title : {
				text : 'axis left',
				x : -5,
				rotate : -90
			},
			grid : {
				line : {
					stroke : '#c0c0c0'
				},
				even : {
					fill: '#44aad5',
					'fill-opacity': 0.1,
					stroke : 'none'
				}
			},
			labels : {
				label : {
					x : -5,
					rotate : 45
				}
			}
		});
		
		
		canvas.sort();

		var node = axis.get('node'),
			nodeEl = $(node),
			children = axis.get('children');

		it('测试线生成',function(){
			var 
				line = axis.get('lineShape'),
				path = line.getPath();

			expect(path[1][1]).toBe(10);
			expect(path[1][2]).toBe(10);
		});
		it('测试点生成位置',function(){
			var line = axis.get('lineShape'),
				path = line.getPath();
			expect(path[0][1]).toBe(10);
			expect(path[1][1]).toBe(10);
		});
		it('测试label生成位置',function(){

		});

		it('测试栅格',function(){
			var gridGroup = axis.get('gridGroup'),
				gridEl = $(gridGroup.get('node'));
			expect(gridGroup).not.toBe(null);
			if(!isIe7()){
				expect(gridEl.find('.x-chart-grid-line').length).toBe(1);
				expect(gridEl.find('.x-chart-grid-even').length).toBe(4);
			}
		});
		it('测试tite位置',function(){
			if(!isIe7()){
				var titleEl = nodeEl.find('.x-chart-axis-title'),
					text = axis.findByNode(titleEl[0]);
				expect(text).not.toBe(null);
				expect(text.attr('x')).toBe(5);
				var matrix = text.attr('transform');
				expect(matrix[0][0]).toBe('r');
				expect(matrix[0][1]).toBe(-90);
			}
		});
	});

	describe('测试右侧坐标轴',function(){

		var axis = canvas.addGroup(Axis,{
			end : {x : 480,y : 10},
			start : {x : 480, y : 480},

			position : 'right',
			ticks : [0,1,2,3,4,5,6,7,8,9],
			title : {
				text : 'axis right',
				x : 10,
				rotate : 90
			},
			labels : {
        label : {
          x : 12
        }
      }
		});


		var node = axis.get('node'),
			nodeEl = $(node),
			children = axis.get('children');

		it('测试线生成',function(){
			var 
				line = axis.get('lineShape'),
				path = line.getPath();

			expect(path[1][1]).toBe(480);
			expect(path[1][2]).toBe(10);
		});

		it('测试点生成位置',function(){
			var line = axis.get('lineShape'),
				path = line.getPath();
			expect(path[0][1]).toBe(480);
			expect(path[1][1]).toBe(480);
		});
		it('测试label生成位置',function(){

		});
		it('测试tite位置',function(){
			if(!isIe7()){
				var titleEl = nodeEl.find('.x-chart-axis-title'),
					text = axis.findByNode(titleEl[0]);
				expect(text).not.toBe(null);
				expect(text.attr('x')).toBe(490);
			}
		});
	});
	/**/


});