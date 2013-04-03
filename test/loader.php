<?php  $title='加载测试' ?>
<?php include("./templates/header.php"); ?>
  
      <script type="text/javascript" src="../src/jquery-1.8.1.min.js"></script>
      <script type="text/javascript" src="../build/bui.js"></script>
      <script type="text/javascript" src="specs/sea-spec.js"></script>

      <script type="text/javascript">
      $(function(){
        jasmine.getEnv().addReporter(new jasmine.TrivialReporter());
            jasmine.getEnv().execute();
      });
    </script>
  </body>
</html
