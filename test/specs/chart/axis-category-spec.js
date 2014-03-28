BUI.use(['bui/graphic','bui/chart/categoryaxis','bui/chart/numberaxis'],function (Graphic,Axis,NumberAxis) {

	var canvas = new Graphic.Canvas({
		render : '#s3',
		width : 500,
		height : 500
	});



	describe('测试坐标轴生成',function(){

		var plotRange = {
				start : {x : 20,y : 480},
				end : {x : 480, y : 20}
			},
			axis = canvas.addGroup(Axis,{
				plotRange : plotRange,
				categories : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
				labels : {
					label : {
						y : 12
					}
				}
			});

		var yAxis = canvas.addGroup(NumberAxis,{
				plotRange : plotRange,
				line : null,
				tickLine : null,
				grid : {
					line : {
						stroke : '#c0c0c0'
					},
					minorLine : {
						stroke : '#e0e0e0'
					},
					minorCount : 4
				},
				min : 50,
				max : 100,
				position:'left',
				tickInterval : 10,
				labels : {
					label : {
						x : -12
					}
				}
			});

		var node = axis.get('node');

		it('测试坐标系生成',function(){
			expect(node).not.toBe(undefined);

		});
		it('测试生成的坐标点',function(){
			expect(axis.get('ticks').length).toBe(13);
		});

		it('测试label',function(){
			var labelsGroup = axis.get('labelsGroup');
			expect(labelsGroup.get('children').length).toBe(13);
		});

		it('获取点的x坐标',function(){
			
			var value = '三月',
				offset = axis.getOffset(value);
			expect(isNaN(offset)).not.toBe(true);
			expect(parseInt(offset)).toBe(115);
		});

		describe('测试数字坐标轴变化',function(){
			var labelsGroup = axis.get('labelsGroup');
			it('更改坐标轴',function(){
				var categories =  ['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
				axis.change({
					categories : categories.slice(0,6)
				});

				
				waits(500);
				runs(function(){
					var value = 'two',
					offset = axis.getOffset(value);
					expect(isNaN(offset)).not.toBe(true);
					expect(parseInt(offset)).toBe(135);
				});


			});
			
			it('测试新的label',function(){
				expect(labelsGroup.get('children').length).toBe(7);
			});
		});
	});



});