
BUI.use(['bui/graphic','bui/chart/lineseries','bui/chart/numberaxis','bui/chart/categoryaxis'],function (Graphic,Series,NAxis,CAxis) {
	
	

	describe('测试序列生成',function(){
		var canvas = new Graphic.Canvas({
			render : '#s1',
			width : 900,
			height : 500
		});

		var plotRange = {
				start : {x : 50,y : 400},
				end : {x : 850, y : 50}
			},
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

		canvas.sort();

		var series = canvas.addGroup(Series,{
			xAxis : xAxis,
			yAxis : yAxis,
			labels : {
				label : {
					y : -15
				}
			},
			line : {
				stroke: '#2f7ed8',
				'stroke-width': 2,
				'stroke-linejoin': 'round',
				'stroke-linecap': 'round',
			},
			lineActived : {
				'stroke-width': 3
			},
			markers : {
				marker : {
					fill : '#2f7ed8',
					stroke: '#2f7ed8',
					symbol : 'circle',
					radius : 4
				},
				actived : {
					radius : 6,
					stroke: '#fff'
				}
			},
			data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
		});

		var series1 = canvas.addGroup(Series,{
			xAxis : xAxis,
			yAxis : yAxis,
			line : {
				stroke: '#910000',
				'stroke-width': 2,
				'stroke-linejoin': 'round',
				'stroke-linecap': 'round',
			},
			smooth : true,
			markers : {
				marker : {
					fill : '#910000',
					stroke: '#910000',
					symbol : 'diamond',
					radius : 4
				}
			},
			data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
		});

		describe('测试一般折线的生成',function(){
			var node = series.get('node');

			it('测试线的生成',function(){
				expect(series.get('node')).not.toBe(undefined);
				expect(series.get('children').length).not.toBe(0);
			});

			it('测试线上的点',function(){
				var line = series.getChildAt(0),
					path = line.getPath();
				expect(path.length).toBe(series.get('data').length);

			});

			it('测试tracker',function(){
				var tracker = series.getChildAt(1),
					path = tracker.getPath();
				expect(path.length).toBe(series.get('data').length + 1);
				expect(tracker.attr('stroke-width')).toBe(22);
			});

			it('测试labels',function(){
				var labelsGroup = series.get('labelsGroup');
				expect(labelsGroup).not.toBe(undefined);
				expect(labelsGroup.get('children').length).toBe(series.get('data').length);
			});

			function getOffsetX(pageX){
				var cnode = $(canvas.get('node')),
					offset = cnode.offset();
				return pageX - offset.left;
			}

			it('测试鼠标事件',function(){
				var markers = series.get('markersGroup');

				series.on('mousemove',function(ev){
					var offset = getOffsetX(ev.pageX);
					//
					var marker = markers.getSnapMarker(offset);
					//console.log(marker);
					markers.setActived(marker);
					series.setActived();
				}).on('mouseout',function(){
					series.clearActived();
					markers.clearActived();
				});

			});

			it('测试markers',function(){
				var markersGroup = series.get('markersGroup');
				expect(markersGroup).not.toBe(undefined);
				expect(markersGroup.get('children').length).toBe(series.get('data').length);
			});

		});

		describe('测试平滑曲线',function(){

		});

		describe('测试操作',function(){

			it('隐藏',function(){

			});
			it('显示',function(){

			});
			it('移除',function(){

			});
		})

	});

	describe('测试事件',function(){

	});

	
	describe('测试连续序列',function(){

		/*var canvas = new Graphic.Canvas({
			render : '#s1',
			width : 500,
			height : 500
		});
		*/
		describe('测试数字x轴',function(){

		});


	});
	
	
});

