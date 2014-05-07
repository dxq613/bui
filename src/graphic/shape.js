define('bui/graphic/shape',['bui/common','bui/graphic/base','bui/graphic/canvasitem','bui/graphic/raphael','bui/graphic/util'],function(require){

  var BUI = require('bui/common'),
    Base = require('bui/graphic/base'),
    Item = require('bui/graphic/canvasitem'),
    Util = require('bui/graphic/util'),
    Raphael = require('bui/graphic/raphael');

  /**
   * @class BUI.Graphic.Shape
   * 图形的基类
   * @extends BUI.Graphic.Base
   */
  var Shape = function(cfg){
    Shape.superclass.constructor.call(this,cfg);
  };

  Shape.ATTRS = {
    attrs : {}
  }

  BUI.extend(Shape,Base);

  //获取画布内元素的一些共性方法
  BUI.mixin(Shape,[Item]);

  BUI.augment(Shape,{
    /**
     * 是否图形
     * @type {Boolean}
     */
    isShape : true,
    
    //渲染shape
    renderUI : function(){

      var _self = this,
        el = _self.get('el'),
        node,
        cfg,
        attrs;
      if(!el){
        cfg = _self.cfg;
        attrs = _self.parseElCfg(cfg.attrs);
        el = _self.createElement(attrs);
        _self.set('el',el);
      }
      node = el.node;
      node.shape = this;
      _self.set('node',node);
    },
    /**
     * @private
     */
    createElement : function(attrs){
      var _self = this,
        parent = _self.get('parent'),
        set = parent.get('el').add([attrs]),
        element;
      element = set[0];
      return element;
    },
    /**
     * @protected
     * 格式化初始化配置项
     */
    parseElCfg : function(attrs){
      attrs.type = this.get('type');
      return attrs;
    },
    /**
     * 获取图形的整体长度
     * @return {Number} 长度
     */
    getTotalLength : function(){
      return this.get('el').getTotalLength();
    },
    /**
     * 旋转
     * @param  {Number} a 旋转的角度
     * @param  {Number} x 旋转的中心点 x
     * @param  {Number} y 旋转的中心点 y
     */
    rotate : function(a, x, y){
      var _self = this;
      if(_self.isGroup){
        if(x == null && y == null){
          var tpoint = _self._getTranslatePoint();
          x = tpoint.x;
          y = tpoint.y;
        }
      }
      this.get('el').rotate(a,x,y);
    },
    /**
     * 放大
     * @param  {Number} sx x轴方向的倍数 
     * @param  {Number} sy y轴方向的倍数
     * @param  {Number} cx x轴方向扩展的中心
     * @param  {Number} cy y轴方向扩展的中心
     */
    scale : function(sx, sy, cx,cy){
      var _self = this,
        el = _self.get('el');
      
      el.scale(sx, sy, cx,cy);
    },
    /**
     * 直接使用transform方法 <br>
     *  "t100,100r30,100,100s2,2,100,100r45s1.5"
     *   - 
     * @param  {String} tstr 几何转换的字符串
     */
    transform : function(tstr){
      var _self = this,
        el = _self.get('el');
      el.transform(tstr);
    },
    getBBox : function(){
      return this.get('el').getBBox();
    },
    /**
     * 获取路径
     * @return {Array} 路径的数组
     */
    getPath : function(){
      var _self = this,
        el = _self.get('el'),
        path = el.getPath();
      if(BUI.isString(path)){
        path = Util.parsePathString(path);
      }
      return path;
    },
    /**
     * 获取路径字符串
     * @return {String} 路径的字符串
     */
    getPathString : function(){
      var _self = this,
        path = _self.getPath();
      return Util.parsePathArray(path);
    },
    /**
     * 获取使用平移后的path
     * @return {Array} 路径的数组
     */
    getTransformPath : function(){
      var _self = this,
        path = _self.getPath(),
        matrix = _self.get('el').matrix;
      return Util.transformPath(path,matrix.toTransformString());
    },
    //获取到移动的位置
    _getTranslatePoint : function(){
      var _self = this,
        tPath = _self.getTransformPath(),
        rst = {x : 0,y : 0};
      BUI.each(tPath,function(item){
        if(item[0] == 'M'){
          rst.x = item[1];
          rst.y = item[2];
        }
      });
      return rst;
    },
    //获取转换的信息，返回一个数组，处理非数组的场景
    __getTransform : function(value){
      if(BUI.isString(value)){
        value = value.replace(/([t,s,r])/,';$1 ').split(';');
        var temp = [];
        BUI.each(value,function(str){
          if(str){
            var sub = str.split(' ');
            sub = $.map(sub,function(subStr){
              if(BUI.isNumeric(subStr)){
                return parseFloat(subStr);
              }
              return subStr;
            });
            temp.push(sub);
          }
        });
        value = temp;
      }
      return value;
    }
  });

  /**
   * 圆
   * @class BUI.Graphic.Shape.Circle
   * @extends BUI.Graphic.Shape
   */
  var Circle = function(cfg){
    Circle.superclass.constructor.call(this,cfg);
  };

  Circle.ATTRS = {
    /**
     * 圆心的x坐标
     * @type {Number}
     */
    cx : {},
    /**
     * 圆心的y坐标
     * @type {Number}
     */
    cy : {},
    /**
     * 圆的半径
     * @type {Number}
     */
    r : {}
  };

  BUI.extend(Circle,Shape);

  Shape.Circle = Circle;

  /**
   * 矩形
   * @class BUI.Graphic.Shape.Rect
   * @extends BUI.Graphic.Shape
   */
  var Rect = function(cfg){
    Rect.superclass.constructor.call(this,cfg);
  };

  Rect.ATTRS = {
    /**
     * 矩形的左定点x坐标
     * @type {Number}
     */
    x : {},
    /**
     * 矩形的左定点y坐标
     * @type {Number}
     */
    y : {},
    /**
     * 矩形的宽度
     * @type {Number}
     */
    width : {},
    /**
     * 矩形的高度
     * @type {Number}
     */
    height : {},
    /**
     * 圆角
     * @type {Number}
     */
    r: {
      value : 0
    }
  };

  BUI.extend(Rect,Shape);
  Shape.Rect = Rect;

  /**
   * 矩形
   * @class BUI.Graphic.Shape.Ellipse
   * @extends BUI.Graphic.Shape
   */
  var Ellipse = function(cfg){
    Ellipse.superclass.constructor.call(this,cfg);
  };

  Ellipse.ATTRS = {
    /**
     * 矩形的左定点x坐标
     * @type {Number}
     */
    cx : {},
    /**
     * 矩形的左定点y坐标
     * @type {Number}
     */
    cy : {},
    /**
     * 矩形的宽度
     * @type {Number}
     */
    rx : {},
    /**
     * 矩形的高度
     * @type {Number}
     */
    ry : {}
  };

  BUI.extend(Ellipse,Shape);
  Shape.Ellipse = Ellipse;

  /**
   * 路径
   * @class BUI.Graphic.Shape.Path
   * @extends BUI.Graphic.Shape
   */
  var Path = function(cfg){
    Path.superclass.constructor.call(this,cfg);
  };

  Path.ATTRS = {
    /**
     * 路径
     * @type {String}
     */
    path : {}
  };


  BUI.extend(Path,Shape);

  Shape.Path = Path;

  /**
   * 直线
   * @class BUI.Graphic.Shape.Line
   * @extends BUI.Graphic.Shape.Path
   */
  var Line = function(cfg){
    Line.superclass.constructor.call(this,cfg);
  };

  Line.ATTRS = {
    /**
     * 起始x坐标
     * @type {Number}
     */
    x1 : {},
    /**
     * 起始y坐标
     * @type {Number}
     */
    y1 : {},
    /**
     * 终止x坐标
     * @type {Number}
     */
    x2 : {},
    /**
     * 终止y坐标
     * @type {Number}
     */
    y2 : {}
  };

  BUI.extend(Line,Path);

  BUI.augment(Line,{
    /**
     * @protected
     * 格式化初始化配置项
     */
    parseElCfg : function(attrs){
      attrs.type = 'path'; //将线转换成path
      attrs.path = BUI.substitute('M {x1},{y1}L{x2},{y2}',attrs);
      return attrs;
    },
    //获取线的坐标点
    _getLinePoint : function(pointIndex,coordIndex){
      var path = this.getPath();
      return path[pointIndex][coordIndex];
    },
    //设置线的坐标点
    _setLinePoint : function(pointIndex,coordIndex,value){
      var _self = this,
        path = this.getPath();
      path[pointIndex][coordIndex] = value;
      _self.attr('path',path);
    },
    //设置坐标x1
    __setX1 : function(value){
      this._setLinePoint(0,1,value);
    },
    __getX1 : function(){
      return this._getLinePoint(0,1);
    },
    //设置坐标x2
    __setX2 : function(value){
      this._setLinePoint(1,1,value);
    },
    __getX2 : function(){
      return this._getLinePoint(1,1);
    },
    //设置坐标y1
    __setY1 : function(value){
      this._setLinePoint(0,2,value);
    },
    __getY1 : function(){
      return this._getLinePoint(0,2);
    },
    //设置坐标y2
    __setY2 : function(value){
      this._setLinePoint(1,2,value);
    },
    __getY2 : function(){
      return this._getLinePoint(1,2);
    }
  });

  Shape.Line = Line;


  function points2path(points,z){
    if(BUI.isArray(points)){
      points = points.join(' ');
    }
    return 'M' + points + z;
  }

  /**
   * 折线，polyLine
   * @class BUI.Graphic.Shape.PolyLine
   * @extends BUI.Graphic.Shape.Path
   */
  var PolyLine = function(cfg){
    PolyLine.superclass.constructor.call(this,cfg);
  };

  PolyLine.ATTRS = {
    /**
     * 定点集合，可以是字符串、或者数组
     *
     *  - 字符串： '0,0 25,25 31,50'
     *  - 数组 ： ['0,0','25,25','31,50']
     *  
     * @type {Array|String}
     */
    points : {}
  };

  BUI.extend(PolyLine,Path);

  BUI.augment(PolyLine,{
    //设置顶点
    __setPoints : function(value){
      var _self = this,
        el = _self.get('el'),
        path = points2path(value,'');
      _self.attr('path',path);
    },
    /**
     * @protected
     * 格式化初始化配置项
     */
    parseElCfg : function(attrs){
      attrs.type = 'path'; //将线转换成path
      attrs.path = points2path(attrs.points,'');
      return attrs;
    }

  });

  Shape.PolyLine = PolyLine;

  /**
   * 多边形
   * @class BUI.Graphic.Shape.Polygon
   * @extends BUI.Graphic.Shape.Path
   */
  var Polygon = function(cfg){
    PolyLine.superclass.constructor.call(this,cfg);
  };

  Polygon.ATTRS = {
    /**
     * 定点集合，可以是字符串、或者数组
     *
     *  - 字符串： '0,0 25,25 31,50'
     *  - 数组 ： ['0,0','25,25','31,50']
     *  
     * @type {Array|String}
     */
    points : {}
  };

  BUI.extend(Polygon,Path);

  BUI.augment(Polygon,{
    //设置顶点
    __setPoints : function(value){
      var _self = this,
        el = _self.get('el'),
        path = points2path(value,'z');
      _self.attr('path',path);
    },
    /**
     * @protected
     * 格式化初始化配置项
     */
    parseElCfg : function(attrs){
      attrs.type = 'path'; //将线转换成path
      attrs.path = points2path(attrs.points,'z');
      return attrs;
    }

  });

  Shape.Polygon = Polygon;

  /**
   * 文本
   * @class BUI.Graphic.Shape.Text
   * @extends BUI.Graphic.Shape
   */
  var Text = function(cfg){
    Text.superclass.constructor.call(this,cfg);
  };

  Text.ATTRS = {
    /**
     * x轴坐标
     * @type {Number}
     */
    x : {},
    /**
     * y轴坐标
     * @type {Number}
     */
    y : {},
    /**
     * 显示的文本
     * @type {String}
     */
    text : {},
    /**
     * 字体相关的属性，也可以单独设置其中的属性: font-family,font-weight....
     * @type {String}
     */
    'font' : {},
    /**
     * 文本的对齐方式：默认对齐方式: 'middle'
     * @type {String}
     */
    'text-anchor' : {}
  };

  BUI.extend(Text,Shape);

  Shape.Text = Text;

  /**
   * @class BUI.Graphic.Shape.Label
   * 文本标签，继承自文本，但是提供了rotate属性
   * @extends BUI.Graphic.Shape.Text
   */
  var Label = function(cfg){
    Label.superclass.constructor.call(this,cfg);
  };

  BUI.extend(Label,Text);

  Label.ATTRS = {
    /**
     * 旋转角度
     * @type {Number}
     */
    rotate : {}
  };

  BUI.augment(Label,{
    /**
     * @protected
     * 格式化初始化配置项
     */
    parseElCfg : function(attrs){
      attrs.type = 'text';
      if(attrs.rotate){
        attrs.transform = BUI.substitute('r{rotate} {x} {y}',attrs);
      }
      
      return attrs;
    }
  });

  Shape.Label = Label;

  /**
   * @class BUI.Graphic.Shape.Marker
   * 用于标示节点的图形
   * @extends BUI.Graphic.Shape
   */
  var Marker = function(cfg){
    Marker.superclass.constructor.call(this,cfg);
  };

  Marker.ATTRS = {
    /**
     * 类型 "circle", "square", "diamond", "triangle" and "triangle-down"；如果是 "url(xxx)"则是图片；custom则需要指定路径
     * @type {String}
     */
    symbol :{
      value : 'custom'
    },
    /**
     * 半径
     * @type {Number}
     */
    radius : {
      value : 5
    },
    /**
     * 如果类型为"custom"时指定路径
     * @type {Object}
     */
    path : {

    },
    /**
     * 起始x轴位置
     * @type {Number}
     */
    x : {

    },
    /**
     * 起始y轴位置
     * @type {Number}
     */
    y : {

    }
  };

  Marker.Symbols = {
    //圆
    circle : function(x,y,r){
      return [['M',x,y - r],['a',r,r,0,1,1,0,2*r],['a',r,r,0,1,1,0,-2*r],['z']];
    },
    //正方形
    square : function(x,y,r){
      return [['M',x-r,y-r],['L',x + r,y-r],['L',x + r,y + r],['L',x - r,y + r],['z']];
    },
    //菱形
    diamond : function(x,y,r){
      return [['M',x - r,y],['L',x,y - r],['L',x + r, y],['L',x,y + r],['z']];
    },
    //三角形
    triangle : function(x,y,r){
      var diffX = r / 0.866,
        diffY =  r;
      return [['M',x,y-r],['L',x + diffX,y + diffY],['L',x - diffX, y + diffY],['z']];
    },
    //倒三角形
    'triangle-down' : function(x,y,r){
      var diffX = r / 0.866,
        diffY =  r;
      return [['M',x,y + r],['L',x + diffX, y - diffY],['L',x - diffX,y - diffY],['z']];
    }
  };



  BUI.extend(Marker,Shape);

  BUI.augment(Marker,{
    //设置半径
    __setRadius : function(v){
      var _self = this,
        attrs = _self.get('attrs');

      _self._setSize(attrs.x,attrs.y,v);

    },
    __getRadius : function(){
      return this.get('attrs').radius;
    },
    //设置x
    __setX : function(x){
      var _self = this,
        attrs = _self.get('attrs');

      _self._setSize(x,attrs.y,attrs.radius);

    },
    __getX : function(){
      return this.get('attrs').x;
    },
    //设置y
    __setY : function(y){
      var _self = this,
        attrs = _self.get('attrs');

      _self._setSize(attrs.x,y,attrs.radius);

    },
    __getY : function(){
      return this.get('attrs').y;
    },
    __getSymbol : function(){
      return this.get('attrs').symbol;
    },
    //设置大小，位置
    _setSize : function(x,y,radius){
      var _self = this,
        attrs = _self.get('attrs'),
        el = _self.get('el');
      if(el.type !== 'image'){
        var cfg = {
          x : x,
          y : y,
          radius : radius
        };
        BUI.mix(attrs,cfg);
        var path = _self._getPath(attrs);
        el.attr('path',path);
      }else{
        BUI.mix(attrs,{
          width : radius * 2,
          height : radius * 2,
          x : x - (radius - attrs.radius),
          y : y - (radius - attrs.radius),
          radius : radius
        });
        el.attr(attrs);
      }
    },
    animate : function(params,ms,easing,callback){
      var _self = this,
        attrs = _self.get('attrs'),
        path;
          
      if(_self.get('el').type == 'image'){
        var radius = params.radius || _self.attr('radius');
        params.x = params.x - radius;
        params.y = params.y - radius;
        BUI.mix(attrs,{
          x : params.x,
          y : params.y
        });
        _self.get('el').animate(params,ms,easing,callback);
      }else{
        BUI.mix(attrs,{
          x : params.x,
          y : params.y
        });
        path = _self._getPath(attrs);
        _self.get('el').animate({path : path},ms,easing,callback);
      }
    },

    /**
     * @protected
     * 格式化初始化配置项
     */
    parseElCfg : function(attrs){
      var _self = this,
        symbol = attrs.symbol,
        radius = attrs.radius || 5;
      if(symbol && symbol.indexOf('url') != -1){ //图片
        attrs.type = 'image';
        attrs.src = symbol.replace(/url\((.*)\)/,'$1');
        attrs.width = attrs.radius * 2;
        attrs.height = attrs.radius * 2;
        if (Util.vml) {
          attrs.x -= radius-1,
          attrs.y -= radius-1;
        } else {
          attrs.x -= radius,
          attrs.y -= radius;
        }
      }else{
        attrs.type = 'path';
        attrs.path = _self._getPath(attrs);
      }
      return attrs;
    },
    //获取path
    _getPath : function(attrs){
      if(!attrs.symbol && attrs.path){
        return  BUI.substitute(attrs.path,attrs);
      }
      var method = Marker.Symbols[attrs.symbol];
      if(method){
        return method(attrs.x,attrs.y,attrs.radius)
      }else{
        throw 'not support this type ' + attrs.symbol;
      }
    }

  });

  Shape.Marker = Marker;



  /**
   * @class BUI.Graphic.Shape.Image
   * 图片
   * @extends BUI.Graphic.Shape
   */
  var Image = function(cfg){
    Image.superclass.constructor.call(this,cfg);
  };

  Image.ATTRS = {
    /**
     * 路径
     * @type {String}
     */
    src : {}, 
    /**
     * x轴位置
     * @type {Number}
     */
    x : {}, 
    /**
     * y轴位置
     * @type {Number}
     */
    y : {}, 
    /**
     * 宽度
     * @type {Number}
     */
    width : {}, 
    /**
     * 高度
     * @type {Number}
     */
    height : {}
  }

  BUI.extend(Image,Shape);

  Shape.Image = Image;

  
  return Shape;
});
