    
    <script type="text/javascript">
      var url = '<?php echo $url ?>',
        arrs = url.split(',');
      BUI.use(arrs,function(){
        setTimeout(function(){
          var reporter = new jasmine.TrivialReporter()
          jasmine.getEnv().addReporter(reporter);
          jasmine.getEnv().execute();
        },200);
      });

      </script> 
    </script>
  </body>
</html>