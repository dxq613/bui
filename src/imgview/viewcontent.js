/**
 * @fileOverview 图片预览
 * @ignore
 */
define('bui/imgview/viewcontent',['bui/common','bui/graphic'],function (r) {

  var BUI = r('bui/common'),
    Graphic = r('bui/graphic');

  // 获取图片居中信息
  function _getFixSize(w,h,w1,h1){
    var obj = {};

    if((w/h)>(w1/h1)){
      obj.height = w1/w*h;
      obj.width = w1;
    }else{
      obj.width = h1/h*w;
      obj.height = h1;
    }
    obj.x = (w1-obj.width)/2;
    obj.y = (h1-obj.height)/2;
    return obj;
  }


  /**
   * @class BUI.ImgView.ViewContent
   * 单纯的图片展示控件,兼容IE6,支持旋转、拖动、缩放
   * @extends BUI.Component.Controller
   */
  var ViewContent = BUI.Component.Controller.extend({
    initializer: function(){
      var _self = this,
        targetImg = new Image();

      _self.set('targetImg', targetImg);

      // 绑定paint事件，必须在paint之前绑定；
      targetImg.onload = function(){
        var imgWidth = targetImg.width,
          imgHeight = targetImg.height,
          width = _self.get('width'),
          height = _self.get('height');

        // 初始化一定是以fitSize的模式渲染，记录放大状态会比较麻烦。
        var fitSize = _getFixSize(imgWidth,imgHeight,width,height);
        _self.get('imgObj').attr(BUI.mix(fitSize, {
          src: targetImg.src,
          transform: "r0" // 旋转置0
        }));
        _self.set('isPaint', true); // 标记paint完成
        _self.set('imgWidth', imgWidth); // 记录图片宽度
        _self.set('imgHeight', imgHeight); // 记录图片高度
        _self.set('imgNowWidth', fitSize.width); // 记录图片缩放宽度
        _self.set('imgNowHeight', fitSize.height); // 记录图片缩放高度
        _self.set('angle', 0); // 旋转置0
        _self.set('imgSrc', targetImg.src); // 记录当前src
        _self.set('isFit', true) // 强制置为fit模式
      }
    },
    renderUI: function(){
      var _self = this,
        imgSrc = _self.get('imgSrc'),
        el = _self.get('el');

      // 建立canvas和图片对象
      var canvas = new Graphic.Canvas({render: el});
      var imgObj = canvas.addShape('image',{})
      _self.set('canvas', canvas);
      _self.set('imgObj', imgObj);
    },
    bindUI: function(){
      this._bindDrag();      //绑定拖动事件
    },
    /**
     * 清除图形
     */
    clear: function(){
      var _self = this,
        canvas = _self.get('canvas');
      canvas.destroy();
      _self.set('isPaint', false);
    },
    /**
     * 重置位置
     */
    reset: function(){
      // 旋转置0，缩放置0，fit置true。
      this.set('angle', 0);
      this.rotate(0, 0);
      this.scale('fit', 0);
    },
    /**
     * 左旋
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.leftHand(function(){
     *    //TODO
     *  })
     *  viewContent.leftHand("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    leftHand: function(easeing, callback){
      var _self = this,
        rotateTime = _self.get('rotateTime'),
        easeing = easeing || "<>";

      _self.rotate(-90, rotateTime, easeing, callback);
    },
    /**
     * 右旋
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.rightHand(function(){
     *    //TODO
     *  })
     *  viewContent.rightHand("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    rightHand: function(easeing, callback){
      var _self = this,
        rotateTime = _self.get('rotateTime'),
        easeing = easeing || "<>";

      _self.rotate(90, rotateTime, easeing, callback);
    },
    // 动态旋转方法
    rotate: function(rotateAngle, rotateTime, easeing, callback){
      var _self = this,
        isPaint = _self.get('isPaint'),
        angle = _self.get('angle'),
        imgObj = _self.get('imgObj'),
        easeing = easeing || "<>";

      if(isPaint){
        angle += rotateAngle;
        imgObj.attr({
          x: (_self.get('width') - _self.get('imgNowWidth'))/2,
          y: (_self.get('height') - _self.get('imgNowHeight'))/2
        }).stopAnimate().animate({transform: "r" + angle}, rotateTime, easeing, callback);
        _self.set('angle',angle);
      }
      _self.set('isFit',false);
    },
    /**
     * 放大
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.zoom(function(){
     *    //TODO
     *  })
     *  viewContent.zoom("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    zoom: function(easeing,callback){
      var _self = this,
        zoomRate = _self.get('zoomRate'),
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale(zoomRate,scaleTime,easeing,callback);
    },
    /**
     * 缩小
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.micrify(function(){
     *    //TODO
     *  })
     *  viewContent.micrify("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    micrify: function(easeing,callback){
      var _self = this,
        micrifyRate = _self.get('micrifyRate'),
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale(micrifyRate,scaleTime,easeing,callback);
    },
    /**
     * 原始大小
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.resume(function(){
     *    //TODO
     *  })
     *  viewContent.resume("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    resume: function(easeing,callback){
      var _self = this,
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale("resume",scaleTime,easeing,callback);
    },
    /**
     * 适合窗口大小
     * @param {String} easeing 可选参数,如果是function的话就是callback
     * @param {Function} callback [description]
     * <pre><code>
     *  viewContent.fit(function(){
     *    //TODO
     *  })
     *  viewContent.fit("<>", function(){
     *    //TODO
     *  })
     * </code></pre>
     */
    fit: function(easeing,callback){
      var _self = this,
        scaleTime = _self.get('scaleTime'),
        easeing = easeing || "<>";

      _self.scale("fit",scaleTime,easeing,callback);
    },
    /**
     * 自动决定是fit还resume
     * <pre><code>
     *  viewContent.fitToggle()
     * </code></pre>
     */
    fitToggle: function(){
      var _self = this,
        isFit = _self.get('isFit');

      isFit?_self.resume():_self.fit();
    },
    // 缩放的统一方法。
    scale: function(rate,scaleTime,easeing,callback){
      var _self = this,
        imgObj = _self.get('imgObj'),
        width = _self.get('width'),
        height = _self.get('height'),
        imgWidth = _self.get('imgWidth'),
        imgHeight = _self.get('imgHeight'),
        imgNowWidth = _self.get('imgNowWidth'),
        imgNowHeight = _self.get('imgNowHeight'),
        isPaint = _self.get('isPaint'),
        angle = _self.get('angle');

      if(isPaint){
        var isFit = false;
        if(rate == "resume"){
          imgNowWidth = imgWidth;
          imgNowHeight = imgHeight;
        }else if(rate == "fit"){
          if(Math.abs(angle%180)==90){
            var fitSize = _getFixSize(imgHeight,imgWidth,width,height);
            imgNowWidth = fitSize.height;
            imgNowHeight = fitSize.width;
          }else{
            var fitSize = _getFixSize(imgWidth,imgHeight,width,height);
            imgNowWidth = fitSize.width;
            imgNowHeight = fitSize.height;
          }
          isFit = true;
        }else{
          imgNowWidth *= rate;
          imgNowHeight *= rate;
        }
        imgObj.stopAnimate().animate({
          x: (width-imgNowWidth)/2,
          y: (height-imgNowHeight)/2,
          width: imgNowWidth,
          height: imgNowHeight,
          transform: "r"+angle
        },scaleTime,easeing,callback);
        _self.set('imgNowWidth',imgNowWidth);
        _self.set('imgNowHeight',imgNowHeight);
        _self.set('isFit',isFit);
      }
    },
    /**
     * 获取当前图片的src
     * @return {String} 当前图片的src
     * <pre><code>
     *  var imgSrc = viewContent.getSrc()
     * </code></pre>
     */
    getSrc: function(){
      return this.get('imgSrc');
    },
    // 边界overflowSize回弹。
    _getOverflowSize: function(bbox,dragStartX,dragStartY,dx,dy,width,height,overflowSize){
      var _self = this;

      // 边界overflowSize回弹，默认100px。
      if(bbox.x + dx < overflowSize - bbox.width){
        dx = overflowSize - bbox.width - bbox.x;
      }else if(bbox.x + dx > width - overflowSize){
        dx = width - overflowSize - bbox.x;
      }
      if(bbox.y + dy < overflowSize - bbox.height){
        dy = overflowSize - bbox.height - bbox.y;
      }else if(bbox.y + dy > height - overflowSize){
        dy = height - overflowSize - bbox.y;
      }

      return {
        x: dragStartX+dx,
        y: dragStartY+dy
      };
    },
    // 拖动事件，包含旋转之后的拖动。
    _bindDrag: function(){
      var _self = this,
        imgObj = _self.get('imgObj'),
        width,height,
        imgNowWidth,imgNowHeight,
        dragStartX,dragStartY,
        overflowSize,bbox;

      imgObj.drag(function(dx,dy){
        if(_self.get('drag')){
          // move
          var dragEnd = _self._getOverflowSize(bbox,dragStartX,dragStartY,dx,dy,width,height,overflowSize);

          imgObj.attr(BUI.mix(dragEnd,{
            transform:imgObj.attr('transform') //在vml下，必须把transform之后的值重置回来，不然图片会丢失。
          }));
        }
      },function(){
        // start
        bbox = imgObj.getBBox();
        dragStartX = imgObj.attr("x");
        dragStartY = imgObj.attr("y");
        width = _self.get('width');
        height = _self.get('height');
        imgNowWidth = _self.get('imgNowWidth');
        imgNowHeight = _self.get('imgNowHeight');
        overflowSize = Math.min(imgNowWidth,imgNowHeight,_self.get('overflowSize'));
      })
    },
    /**
     * 决定是否可以拖动
     * <pre><code>
     *  viewContent.dragToggle()
     * </code></pre>
     */
    dragToggle: function(){
      if (this.get('drag')) {
        this.set('drag', false);
      } else {
        this.set('drag', true);
      }
    },
    // width修改触发的方法
    _uiSetWidth: function(width){
      // 把canvas的size同步修改掉。
      this.get('canvas').setSize(width, this.get('height') || 800);
      this.scale('fit', 0); // 第二个参数为0表示没有动画。
    },
    // height修改触发的方法
    _uiSetHeight: function(height){
      // 把canvas的size同步修改掉。
      this.get('canvas').setSize(this.get('width') || 600, height);
      this.scale('fit', 0); // 第二个参数为0表示没有动画。
    },
    // setImgSrc触发onload重绘方法。
    _uiSetImgSrc: function(imgSrc){
      this.get('targetImg').src = imgSrc;
      this.get('afterChanged')(imgSrc);
    },
    // setDrag决定是否可以拖放，顺便改变鼠标图标。
    _uiSetDrag: function(drag){
      if (drag) {
        this.get('imgObj').attr("cursor","move");
      } else {
        this.get('imgObj').attr("cursor","default");
      }
    },
    // 析构函数
    destructor: function(){
      this.clear();
    }
  },{
    ATTRS: {
      /**
       * 图片的url
       * @type {String}
       */
      imgSrc: {

      },
      /**
       * @private
       */
      isPaint: {
        value: false
      },
      /**
       * @private
       */
      angle: {
        value: 0
      },
      /**
       * 旋转速度
       * @type {Number}
       */
      rotateTime: {
        value: 300
      },
      /**
       * 放大缩小速度
       * @type {Number}
       */
      scaleTime: {
        value: 300
      },
      /**
       * 放大比率
       * @type {Number}
       */
      zoomRate: {
        value: 3/2
      },
      /**
       * 缩小比率
       * @type {Number}
       */
      micrifyRate: {
        value: 2/3
      },
      /**
       * drag边界回弹,超过多少像素无法拖动.
       * @type {Number}
       */
      overflowSize: {
        value: 100
      },
      elCls: {
        value: "ui-view-content"
      },
      /**
       * 是否可以拖动,默认为true
       * @type {Boolean}
       */
      drag: {
        value: true
      },
      /**
       * 图片变换后出发的事件
       * @type {Function}
       */
      afterChanged: {
        value: function(src){

        }
      }
    }
  })



  return ViewContent;
});
