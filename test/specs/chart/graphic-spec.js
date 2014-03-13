
BUI.use(['bui/graphic/canvas','bui/graphic/util'],function (Canvas,Util) {

	var canvas = new Canvas({
		render : '#s1',
		width : 500,
		height : 500
	});

	var el = canvas.get('el'),
		node = canvas.get('node'),
		nodeEl = $(node);

	
/*
	describe('测试画板生成',function(){

		it('测试生成dom',function(){
			expect(el).not.toBe(undefined);
			expect(node).not.toBe(undefined);
		});
		it('测试默认属性',function(){
			expect(nodeEl.width()).toBe(canvas.get('width'));
			expect(nodeEl.height()).toBe(canvas.get('height'));
		});

	});

	describe('测试画板操作',function(){

		it('更改宽度,高度',function(){
			expect(nodeEl.width()).toBe(500);
			canvas.setSize(300,300);
			expect(nodeEl.width()).toBe(300);
		});
		
		it('更改viewbox',function(){
			canvas.setViewBox(0,0,600,600);
			canvas.setViewBox(0,0,300,300);
		});
	});
*/
	describe('测试生成图形',function(){

		it('画圆',function(){
			var circle = canvas.addShape('circle',{
				cx : 100,
				cy : 100,
				r : 20,
				fill : 'red'
			});
			var nEl = $(circle.get('node'));
			expect(circle.get('el')).not.toBe(undefined);
			expect(circle.get('node')).not.toBe(undefined);
			if(Util.svg){
				expect(nEl.attr('cx')).toBe(circle.attr('cx').toString());
			}
			
		});
		it('画线',function(){
			var line = canvas.addShape('line',{
				x1 : 10,
				y1 : 10,
				x2 : 50,
				y2 : 50,
				stroke : 'red',
				'arrow-end' : 'classic'
			});

			var nEl = $(line.get('node'));
			expect(line.get('el')).not.toBe(undefined);
			expect(line.get('node')).not.toBe(undefined);
			if(Raphael.svg){
				expect(line.attr('x1')).toBe(10);
				expect(line.attr('x2')).toBe(50);
			}
			
			expect(line.attr('stroke')).toBe('red');
		});

		it('矩形',function(){
			var rect = canvas.addShape('rect',{
				x : 20,
				y : 20,
				width : 30,
				height : 20
			});
			var nEl = $(rect.get('node'));
			expect(rect.get('el')).not.toBe(undefined);
			expect(rect.get('node')).not.toBe(undefined);
			expect(rect.getPath().length).toBe(5);
		});
		it('多边形',function(){

			var polygon = canvas.addShape('polygon',{
				points : ['0,0','60,0','0,60']
			});

			var nEl = $(polygon.get('node'));
			expect(polygon.get('el')).not.toBe(undefined);
			expect(polygon.get('node')).not.toBe(undefined);

		});
		it('椭圆',function(){
			var ellipse = canvas.addShape('ellipse',{
				cx : 100,
				cy : 100,
				rx : 20,
				ry : 50
			});

			var nEl = $(ellipse.get('node'));
			expect(ellipse.get('el')).not.toBe(undefined);
			expect(ellipse.get('node')).not.toBe(undefined);
			expect(ellipse.attr('ry')).toBe(50);
			ellipse.attr('ry',60);
			expect(ellipse.attr('ry')).toBe(60);
		});
		it('path',function(){
			var str = 'M0 120 L0 50';
			var path = canvas.addShape('path',{
				path : 'M0 120 L0 50'
			});

			var nEl = $(path.get('node'));
			expect(path.get('el')).not.toBe(undefined);
			expect(path.get('node')).not.toBe(undefined);
			if(Raphael.svg){
				expect(path.getTotalLength()).toBe(70);
			}
			
			expect(Util.parsePathArray(path.getPath())).toBe(str);
		});

		it('文本',function(){
			var text = canvas.addShape('text',{
				x : 100,
				y : 10,
				text : '你好么\n我很好'
			});
			var nEl = $(text.get('node'));
			expect(text.get('el')).not.toBe(undefined);
			expect(text.get('node')).not.toBe(undefined);

			if(Raphael.svg){
				expect(nEl.children().length).toBe(2);
			}else{

			}
		});

		it('label',function(){
			var text = canvas.addShape('label',{
				x : 100,
				y : 30,
				rotate : -45,
				text : '你好么\n我很好'
			});

			var nEl = $(text.get('node'));
			expect(text.get('el')).not.toBe(undefined);
			expect(text.get('node')).not.toBe(undefined);

			
				var ts = text.attr('transform');
				expect(ts[0][0]).toBe('r');
				expect(ts[0][1]).toBe(-45);
				expect(ts[0][2]).toBe(100);
			

		});

		it('图片',function(){
			var image = canvas.addShape('image',{
				x : 100,
				y : 100,
				width: 200,
				height: 100,
				src : 'http://gtms01.alicdn.com/tps/i1/T1oM_QFb8iXXcKT9UI-120-160.jpg_120x160q90.jpg'
			});
			var nEl = $(image.get('node'));
			expect(image.get('el')).not.toBe(undefined);
			expect(image.get('node')).not.toBe(undefined);

		});



		it('查找',function(){
      var path = canvas.addShape({
      	id : 'p1',
	      type:'path',
	      attrs :{
	      	path : 'M 50 0 L50,50 0,50 z',
	      	fill : 'blue'
	      }
	    });
      //path.attr('id','p1');
      expect(path.get('id')).toBe('p1');
     	expect(canvas.find('p1')).toBe(path);

		});

		it('path动画',function(){
			var path = canvas.addShape({
	      type:'path',
	      attrs :{
	      	path : 'M 25 208.31428571428572 L 35 208.31428571428572 L 105 209.22 L 175 185.67142857142858 L 245 140.3857142857143 L 315 106.87428571428572 L 385 76.9857142857143 L 455 43.47428571428571 L 525 31.69999999999999 L 595 60.68285714285713 L 665 105.96857142857144 L 735 145.82000000000002 L 805 184.7657142857143 L 815 184.7657142857143',
	      	stroke : 'blue'
	      }
	    });

	    path.animate({path : 'M 25 279.86571428571426 L 35 279.86571428571426 L 105 266.28 L 175 240.01428571428573 L 245 195.6342857142857 L 315 149.44285714285715 L 385 117.74285714285713 L 455 103.25142857142856 L 525 109.5914285714286 L 595 142.19714285714286 L 665 190.2 L 735 236.39142857142858 L 805 262.65714285714284 L 815 262.65714285714284'},2000);
		});

		it('测试平移',function(){

			var path = canvas.find('p1');
			expect(path).not.toBe(null);

			expect(Util.isPointInsidePath(path.getPath(),25,30)).toBe(true);
			path.translate(50,50);

			waits(100);
			runs(function(){
				expect(Util.isPointInsidePath(path.getTransformPath(),25,30)).toBe(false);
				expect(Util.isPointInsidePath(path.getTransformPath(),75,80)).toBe(true);
			})
			
		});

		it('旋转',function(){
			var path = canvas.find('p1');
			expect(Util.isPointInsidePath(path.getTransformPath(),60,75)).toBe(false);
			path.rotate(90);
			expect(Util.isPointInsidePath(path.getPath(),25,30)).toBe(true);
			expect(Util.isPointInsidePath(path.getTransformPath(),25,30)).toBe(false);
			expect(Util.isPointInsidePath(path.getTransformPath(),75,80)).toBe(true);
			expect(Util.isPointInsidePath(path.getTransformPath(),60,75)).toBe(true);
		});

		it('放大',function(){
			var path = canvas.find('p1');
			var length = path.getTotalLength();
			path.scale(2,2);
		});

		it('翻转',function(){

		});

		it('删除图形',function(){
			var path = canvas.find('p1');
			path.remove();
			expect(canvas.find('p1')).toBe(null);
		});
		
		it('清除所有',function(){
			waits(500);
			runs(function(){
				canvas.clear();
			//expect(nodeEl.children().length).toBe(2);
				expect(canvas.get('children').length).toBe(0);
			})
			
		});
		/**/

	});


	describe('测试maker',function(){

		it('测试circle',function(){
			var circle = canvas.addShape('marker',{
				x : 400,
				y : 100,
				fill: 'blue',
				radius : 10,
				symbol : 'circle'
			});

			circle.set('id','mc');
			var path = circle.getPath();
			expect(circle.get('el')).not.toBe(null);
			expect(path[0][1]).toBe(400);
			expect(path[0][2]).toBe(90);
		});

		it('测试三角',function(){
			var triangle = canvas.addShape('marker',{
				x : 350,
				y : 100,
				fill: 'blue',
				radius : 10,
				symbol : 'triangle'
			});

			var path = triangle.getPath();
			expect(triangle.get('el')).not.toBe(null);
			expect(path[0][1]).toBe(350);
			expect(path[0][2]).toBe(90);
		});

		it('测试正方形',function(){
			var rect = canvas.addShape('marker',{
				x : 400,
				y : 200,
				fill: '#ffcc00',
				radius : 10,
				symbol : 'square'
			});
			var path = rect.getPath();
			expect(rect.get('el')).not.toBe(null);
			expect(path[0][1]).toBe(390);
			expect(path[0][2]).toBe(190);
		});

		it('测试倒三角',function(){
			var triangle = canvas.addShape('marker',{
				x : 350,
				y : 200,
				fill: 'yellow',
				radius : 10,
				symbol : 'triangle-down'
			});

			var path = triangle.getPath();
			expect(triangle.get('el')).not.toBe(null);
			expect(path[0][1]).toBe(350);
			expect(path[0][2]).toBe(210);
		});

		it('测试菱形',function(){
		  var	diamond = canvas.addShape('marker',{
				x : 350,
				y : 150,
				fill: 'red',
				radius : 10,
				symbol : 'diamond'
			});

		  var path = diamond.getPath();
			expect(diamond.get('el')).not.toBe(null);
			expect(path[0][1]).toBe(340);
			expect(path[0][2]).toBe(150);

		});

		it('测试图片',function(){
			var image = canvas.addShape('marker',{
				x : 400,
				y : 150,
				radius : 10,
				symbol : 'url(http://mat1.gtimg.com/www/images/qq2012/weather/20120906/sun.png)'
			});

			expect(image.get('el').type).toBe('image');

		});
		it('测试自定义path',function(){
			var cpath = canvas.addShape('marker',{
				x : 400,
				y : 250,
				path : 'M {x} {y} l 10 0 l0 10 z',
				fill : 'red'
			});

			var path = cpath.getPath();
			expect(cpath.get('el')).not.toBe(null);
			expect(path[0][1]).toBe(400);
			expect(path[0][2]).toBe(250);
		});

		it('更改半径',function(){
			var mc = canvas.find('mc'),
				radius = mc.attr('radius');
			expect(mc).not.toBe(null);
			expect(radius).not.toBe(undefined);
			mc.attr('radius',radius * 2);
			expect(mc.attr('radius')).toBe(radius * 2);

			var path = mc.getPath();
			
			expect(path[0][1]).toBe(400);
			expect(path[0][2]).toBe(80);
		});

		it('移动',function(){
			var mc = canvas.find('mc'),
				x = mc.attr('x'),
				y = mc.attr('y');
			mc.attr({
				 x : x + 10,
				 y : y + 10
			});

			var path = mc.getPath();
			
			expect(path[0][1]).toBe(410);
			expect(path[0][2]).toBe(90);

		});
	});

		
	function drawGrid(width,height){
		var xLength = width/10,
			yLength = height/10;
		var sgroup = canvas.addGroup(),
			ygroup = canvas.addGroup();

		for (var i = 0; i < xLength; i++) {
			sgroup.addShape('line',{
				x1 : i * 10,
				y1 : 0,
				x2 : i * 10,
				y2 : height,
				stroke : '#ccc'
			});
		};

		for (var j = 0; j < yLength; j++) {
			ygroup.addShape('line',{
				x1 : 0,
				y1 : j * 10,
				x2 : width,
				y2 : j * 10,
				stroke : '#ccc'
			});
		};
	}
	
	describe('测试分组',function(){
		var group;
		
		it('测试生成分组',function(){
			drawGrid(canvas.get('width'),canvas.get('height'));
 	 		group  = canvas.addGroup();
 	 		expect(group.isGroup).toBe(true);
 	 		expect(group.get('el')).not.toBe(undefined);
 	 		expect(group.get('node')).not.toBe(undefined);
 	 		expect($.contains(node,group.get('node'))).toBe(true);
		});

		it('添加图形',function(){
			var circle = group.addShape({
				type : 'circle',
				id : 'c1',
				attrs : {
					cx : 100,
					cy : 100,
					r : 20,
					fill : 'red'
				}
			});
			expect(circle.get('el')).not.toBe(undefined);
			expect(circle.get('node')).not.toBe(undefined);
			expect($.contains(group.get('node'),circle.get('node'))).toBe(true);
		});

		it('查找图形',function(){
			var circle = group.find('c1');
			expect(circle).not.toBe(null);
			expect(circle.get('id')).toBe('c1');
		});

		it('删除图形',function(){
			var circle = group.find('c1'),
				cNode = circle.get('node');
			var length = group.get('children').length;
			expect(circle).not.toBe(null);

			expect($.contains(group.get('node'),cNode)).toBe(true);
			circle.remove();
			expect(group.find('c1')).toBe(null);
			expect(group.get('children').length).toBe(length - 1);

			expect($.contains(group.get('node'),cNode)).toBe(false);
		});

		it('清理图形',function(){
			group.addShape({
	      type:'path',
	      attrs :{
	      	path : 'M 50 0 L50,50 0,50 z',
	      	fill : 'blue'
	      }
	    });

	    group.addShape({
      	id : 'p1',
	      type:'path',
	      attrs :{
	      	path : 'M 150 0 L50,50 0,150 z',
	      	fill : 'blue'
	      }
	    });

	    expect(group.get('children').length).toBe(2);
	    group.clear();
	    expect(group.get('children').length).toBe(0);
	    expect($(group.get('node')).children().length).toBe(0);
		});

		it('测试平移',function(){
			var circle = group.addShape({
				type : 'circle',
				id : 'c1',
				attrs : {
					cx : 100,
					cy : 100,
					r : 20,
					fill : 'red'
				}
			});

			group.addShape('rect',{
				x : 50,
				y : 50,
				width : 50,
				height : 50,
				fill : 'yellow'
			});
			//var 
				//path = group.getPath();
			group.translate(50,50);
			
		});

		it('动画移动',function(){
			var d = $('<div style="position:absolute;width:100px;height:100px;border:1px solid red"></div>').appendTo('body');

			group.animate({
				x : 100,
				y : 100
			},1000);
			waits(500);
			runs(function(){
				group.animate({
					x : 200,
					y : 200
				},1000);
			});
			

			d.animate({
				top: 100,
				left : 100
			},1000);


		});

	it('清除transform',function(){
			waits(500);
			runs(function(){
				group.attr('transform','');
			});
		
		});

		it('清除分组内容',function(){
			waits(500);
			runs(function(){
				var length = group.get('children').length;
				expect(length).not.toBe(0);
				group.clear();

				expect(group.get('children').length).toBe(0);

				expect($(group.get('node')).children().length).toBe(0);
			});
		});
	
		it('测试分组嵌套',function(){
			var g2 = group.addGroup({
				id : 'g2'
			});
			g2.addShape({
				type : 'circle',
				id : 'c1',
				attrs : {
					cx : 100,
					cy : 100,
					r : 20,
					fill : 'red'
				}
			});

			expect(g2.get('el')).not.toBe(null);
			expect(g2.get('node')).not.toBe(null);

		});

		it('查找分组',function(){
			expect(canvas.find('g2')).not.toBe(null);
			expect(group.find('g2')).not.toBe(null);
			
		});

		it('查找图形',function(){
			expect(canvas.find('c1')).not.toBe(null);
			expect(group.find('c1')).not.toBe(null);
		});

		it('移除分组',function(){
			waits(500);
			runs(function(){
				var gNode = group.get('node');
				group.remove();
				expect(canvas.find('g2')).toBe(null);
				expect(canvas.find('c1')).toBe(null);
				expect($.contains(node,gNode)).not.toBe(true);
			});
		});
		

	});
/**/


	describe('测试事件',function(){
		var group ;
		describe('测试图形事件',function(){
			
			it('测试绑定事件',function(){
			group = canvas.addGroup();
			 var circle =	group.addShape({
					type : 'circle',
					id : 'c3',
					attrs : {r : 50,
						'class' : 'myclass',
						cx : 100,
						cy : 100,
						fill : 'blue'
					}
				});
			  var callback = jasmine.createSpy();
			  circle.on('click',callback);
			  circle.on('mouseover',function(ev){
			  	circle.attr('stroke','red');
			  });

			  circle.on('mouseout',function(ev){
			  	circle.attr('stroke','black');
			  });
			  jasmine.simulate(circle.get('node'),'click');
			  waits(100);
			  runs(function(){
			  	expect(callback).toHaveBeenCalled();
			  	circle.off('click',callback);
			  });
			});
			it('测试移除绑定事件',function(){
				var circle = group.find('c3');

				var callback = jasmine.createSpy();

			  circle.on('click',function(){
			  	callback();
			  	console && console.log('click');
			  });
			  circle.off();
			  jasmine.simulate(circle.get('node'),'click');
			 
			  waits(100);
			  runs(function(){
			  	expect(callback).not.toHaveBeenCalled();
			  });

			});

		});
		describe('测试分组事件',function(){

			it('测试绑定事件',function(){
				var rect = group.addShape('rect',{
					x : 0,
					y : 0,
					width :40,
					height : 40,
					fill : 'red'
				});

				var callback = jasmine.createSpy();

				group.on('click',function(ev){
					callback();
					var shape = ev.target.shape;
					expect(shape).toBe(rect);
				  console &&	console.log('group click');
				});
				jasmine.simulate(rect.get('node'),'click');

				waits(100);
			  runs(function(){
			  	expect(callback).toHaveBeenCalled();
			  	group.off();
			  });

			});
			it('测试移除绑定事件',function(){
				var circle = group.find('c3');
				var callback = jasmine.createSpy();
				group.on('mouseover',callback);
				group.off('mouseover',callback);
				jasmine.simulate(circle.get('node'),'click');

				waits(100);
			  runs(function(){
			  	expect(callback).not.toHaveBeenCalled();
			  });
			});
			
		});
		describe('测试画板事件',function(){

			it('测试绑定事件',function(){
				var circle = canvas.find('c3'),
					callback = jasmine.createSpy();
				canvas.on('click',function(){
					callback();
				});	

				jasmine.simulate(circle.get('node'),'click');
				waits(100);
			  runs(function(){
			  	expect(callback).toHaveBeenCalled();
			  	canvas.off();
			  });
			});
			
		});
	});
/**/
	/**/


});