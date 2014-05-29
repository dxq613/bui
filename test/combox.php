<?php  $title='选择框测试';$css='select'; ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
    <div class="row">
      <div class="span8">
        <h3>show tag</h3>
        <div id="ct1"><input type="text" id="txt1" value="1;2;123"></div>

      </div>
      <div class="span16">
        <h3>src tag</h3>
        <div id="ct2"><label for="">单行内</label></div>
        <input type="text" id="txt2">
      </div>
    </div>
  </div>
  
    <?php $url = 'bui/select'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/select/select.js"></script>
    <script type="text/javascript" src="../src/select/tag.js"></script>
    <script type="text/javascript" src="../src/select/combox.js"></script>
    <script type="text/javascript" src="../src/select/suggest.js"></script>
    <script type="text/javascript" src="../src/select/base.js"></script>
    <script type="text/javascript" src="specs/combox-spec.js"></script>
    
<?php include("./templates/footer.php"); ?>