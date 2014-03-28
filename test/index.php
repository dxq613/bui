<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>控件单元测试</title>
    <link href="../assets/css/dpl.css" rel="stylesheet">
    <link href="../assets/css/bui.css" rel="stylesheet">
    <link href="../assets/css/layout.css" rel="stylesheet">
    <link href="assets/docs.css" rel="stylesheet">
    <style>
      html{
        overflow: hidden;
      }

      .doc-title{
        background-color: #3892d3;
        color: white;
      }

      .doc-title h2{
        line-height: 30px;
        padding-left: 10px;
      }
    </style>
  </head>
  <body>
    
  <script type="text/javascript" src="../src/jquery-1.8.1.min.js"></script>
  <script type="text/javascript" data-debug="true" src="../build/loader.js"></script>
  <script type="text/javascript">
  BUI.setDebug(true);
  BUI.use(['bui/tree','bui/layout'],function(Tree,Layout){
    
    var files = [
      ],
      nodes = [{
        text : 'util类及基础类',
        expanded : true,
        children : [
          {text : 'seajs'},
          {text : 'array'},
          {text : 'common'},
          {text : 'mixins'},
          {text : 'depend'},
          {text : 'keynav'},
          {text : 'loader'}
        ]
      },
      {
        text : '简单控件',
        children : [
          'bar','calendar','dialog','editor','list','mask','menu',
          'message','progressbar','tips','picker','select','slider','tab',
          'uploader'
        ]
      },{
        text : '数据',
        children : [
          'store','treestore','module'
        ]
      },{
        text : 'Grid',
        children : [
          'grid','grid-plugin','grid-editor','header','simple-grid'
        ]
      },{
        text : 'form',
        children : [
          'form','form-field','form-group','form-panel','form-remote','form-rules','form-submit'
        ]
      },{
        text : 'Tree',
        children : [
          'treestore','tree','treemenu','treegrid','treepicker'
        ]
      },{
        text : 'layout',
        children : ['layout-absolute','layout-border','layout-flow','layout-table','layout-anchor','layout-columns','layout-accordion','viewport']
      },{
        text : 'chart',
        children : [
          {text : '基础图形',href: 'chart/graphic.php'},
          {text : '坐标轴',href: 'chart/axis.php'},
          {text : '雷达图坐标轴',href: 'chart/radar-axis.php'},
          {text : '文本集合',href: 'chart/labels.php'},
          {text : '自动计算坐标轴',href : 'chart/auto-axis.php'},
          {text : '折线序列',href : 'chart/line-series.php'},
          {text : '提示框',href : 'chart/tooltip.php'},
          {text : '序列组',href : 'chart/series-group.php'},
          {text : '集成图表',href : 'chart/chart.php'},
          {text : '区域图',href : 'chart/area-series.php'},
          {text : '柱状图',href : 'chart/column-series.php'},
          {text : '饼图',href : 'chart/pie.php'},
          {text : '散列图',href : 'chart/scatter.php'},
          {text : '气泡图',href : 'chart/bubble.php'},
          {text : '雷达图',href : 'chart/radar.php'},
          {text : '动态图',href : 'chart/dynamic.php'},
          {text : '使用store',href : 'chart/data-chart.php'}
        ]
      },
      {
        text : 'issue',
        children : [
          'issue'
        ]
      }],
      curIndex = 0,
      items;

    function initItmes(nodes){
      
      $.each(nodes,function(index,node){
        var children = node.children;
        $.each(children,function(index,subNode){
          if(BUI.isString(subNode)){
            children[index] = {text : subNode};
          }
          if(!children[index].href){
            children[index].href = children[index].text + '.php'
          }
          
        });
      });
      return nodes;
    }
    initItmes(nodes);

    var viewport = new Layout.Viewport({
      elCls : 'ext-border-layout',
      children : [{
        xclass : 'controller',
        layout : {
          region : 'north'
        },
        elCls : 'doc-title',
        content : '<h2>BUI 单元测试</h2>'
      },{
        xclass : 'controller',
        layout : {
          region : 'west',
          title : '测试文件列表',
          collapsable : true,
          fit : 'both',
          width : 200
        },
        xclass : 'tree-menu',
        accordion:true,
        //dirSelectable : false,
        expandAnimate : true,
        nodes : nodes,
        id : 'menu',
        elCls : 'bui-tree-list'
      },{
        xclass : 'controller',
        layout : {
          title : '测试内容',
          region : 'center',
          fit : 'both'
        },
        content : '<iframe id="J_Frame" width="100%"  height="100%" src="" frameborder="0"></iframe>'
      }],
      plugins : [Layout.Border]
    });
    viewport.render();
    var menu  = viewport.getChild('menu'),
      frameEl = $('#J_Frame');;

    menu.get('el').delegate('a','click',function(ev){
      ev.preventDefault();
    });
    menu.on('selectedchange',function(ev){
      var item = ev.item;
      if(item){
        frameEl.attr('src',item.href);
      }
    });
    menu.setSelected(menu.getItemAt(1));
    
  });
    
  
  </script>
  </body>
</html>