define('bui/graphic/raphael/group',['bui/common'],function(require){

	var BUI = require('bui/common');

	window.Raphael && function  (R) {
	
		/*
		 * 创建分组
		 */
		R.fn.group = function(){
			var out = R._engine.group(this);
	      this.__set__ && this.__set__.push(out);
	    return out;
		};



		//添加group的默认path
		R._getPath.group = function(el){
        var bbox = el._getBBox();
        return  R._rectPath(0,0, bbox.width, bbox.height);
    }

    /*
     * 分组构造函数
     */
    var Group = function(node,svg){
        Group.superclass.constructor.call(this,node,svg);
    },
    groupproto;



    BUI.extend(Group,R.el.constructor);

    groupproto = Group.prototype;

    //级联添加分组
    groupproto.group = function(){
      var canvas = this.paper,
        out = canvas.group();
      this.node.appendChild(out.node);
      return out;
    };

    //use svg
    if(window.Raphael.svg){
      function createNode(tagName){
        return R._g.doc.createElementNS("http://www.w3.org/2000/svg", tagName)
      }
    	R._engine.group = function(svg){
	        var el = createNode("g");
	        svg.canvas && svg.canvas.appendChild(el);
	        var res = new Group(el, svg);
	        res.type = "group";
	        return res;
	    };

     


      groupproto.add = function(json){
        var rest = this.paper.add(json),
            el = this.node;
        rest.forEach(function(element){
            el.appendChild(element.node);
        });
        return rest;
      };
    }
    
    //use vml
    if(window.Raphael.vml){
    	var createNode = function (tagName) {
        return R._g.doc.createElement('div');
      };
      //获取path
      R._getPath.group = function(el){
        var node = el.node,
          set = el.__set,
          width = 0,
          height = 0;
        if(set){
          set.forEach(function(element){
            var bbox = element.getBBox();
            if(width < bbox.width){
              width =  width;
            }
            if(height <  bbox.height){
              height = bbox.height;
            }
          });
        }/**/
        return  R._rectPath(0,0, width, height);
      }
      //添加子节点
      groupproto.add = function(json){
          var rest = this.paper.add(json),
              el = this.node,
              set = this.__set;
          rest.forEach(function(element){
              el.appendChild(element.node);
              if(set){
                  set.push(element);
              }
          });
          if(!this.__set){
              this.__set = rest;
          }
          return rest;
      };

      groupproto.translate = function(dx,dy){
        var el = $(this.node),
          top = parseFloat(el.css('top'),10) || 0,
          left = parseFloat(el.css('left'),10) || 0;
        el.css({
          top : top + dy,
          left : left + dx
        });
      };

      groupproto.move = function(x,y){
        var el = $(this.node);
        el.css({
          top : y,
          left : x
        });
      };

      groupproto.animate = function(params,ms,easing,callback){

        var el = $(this.node);
        el.animate({
          top : params.y,
          left : params.x
        },ms,easing,callback);
        
      };
      /**/
      
      //翻转
      groupproto.transform = function(tstr){
          var set = this.__set;
          if(set){
              set.forEach(function(element){
                  element.transform(tstr);
              }); 
          }
          Group.superclass.transform.call(this,tstr);
      };
      /**/
      //创建分组
      R._engine.group = function(vml){
          var el = createNode();
          vml.canvas.appendChild(el);
          var res = new Group(el,vml);
          res.type = "group";
          el.style.position = "relative";

          return res;
      }
      
    }

	}(window.Raphael);
   
});
