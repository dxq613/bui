<?php  $title='加载测试' ?>
<?php include("./templates/header.php"); ?>
  
      <script type="text/javascript" src="../src/jquery-1.8.1.min.js"></script>
      <script src="../build/loader.js"></script>

      <script type="text/javascript" src="specs/sea-spec.js"></script>

      <script type="text/javascript">
      seajs.use(['bui/common','bui/data','bui/list',
        'bui/menu','bui/toolbar','bui/progressbar','bui/cookie',
        'bui/form','bui/mask','bui/select','bui/tab',
        'bui/calendar','bui/overlay','bui/grid'
      ],function(){
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.getEnv().execute();
      });
    </script>
  </body>
</html
