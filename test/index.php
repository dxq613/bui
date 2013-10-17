<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>控件单元测试</title>
    <link href="../assets/css/dpl.css" rel="stylesheet">
    <link href="assets/docs.css" rel="stylesheet">
    
  </head>
  <body>
  
    <div class="row-fluid">
      <div id="menu" class="span4 span-first">

      </div>
      <div class="span20">
        <iframe id="J_Frame" width="100%"  height="1000px" src="" frameborder="0">
      
        </iframe>
      </div>
    </div>
    
  <script type="text/javascript" src="../src/jquery-1.8.1.min.js"></script>
  <script type="text/javascript" src="../build/loader-min.js"></script>
  <script type="text/javascript">
  BUI.use('bui/menu',function(Menu){
    var frameEl = $('#J_Frame');
    var files = ['seajs','array','bar','calendar','common','dialog','depend','editor','form','form-field','form-group','form-panel','form-remote','form-rules','grid','grid-plugin',
      'grid-editor','header','keynav','list','loader','mask','menu','message','mixins','progressbar','picker','select','simple-grid',
      'store','tab','treestore','tips','uploader'],
      curIndex = 0,
      items;

    function executeFile(index){
      var file = files[index];
      if(file){
        frameEl.attr('src',file);
        curIndex = index;
      }
    }

    function initItmes(files){
      var items = [];
      $.each(files,function(index,file){
        items.push({id:index,href:file+'.php'});
      });
      return items;
    }

    var menu = new Menu.Menu({
      items : initItmes(files),
      render : '#menu',
      elCls : 'demo-menu',
      autoRender : true,
      itemTpl : '<a href="{href}?t=' + new Date().getTime() + '">{href}</a>'
    });

    menu.get('el').delegate('a','click',function(ev){
      ev.preventDefault();
    });
    menu.on('selectedchange',function(ev){
      var item = ev.item;
      if(item){
        frameEl.attr('src',item.get('href'));
      }
    });
    menu.setSelected(menu.getItemAt(0));
  });
    
  
  </script>
  </body>
</html>