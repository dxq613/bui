<?php  $title='BUG 修复' ?>
<?php include("./templates/header.php"); ?>
 <style>
  .issue{
    margin : 10px 0;
  }
 </style>
  <div class="container">
    
    <form id="J_issue_117" action="">
      <input name="date" type="text" class="calendar" data-cfg="{datePicker : {minDate : '2014-04-01'}}">
      <input name="date-time" type="text" class="calendar calendar-time" data-cfg="{datePicker : {maxDate : '2014-04-01'}}">
    </form>
    <div>
      <input type="text" id="s1" value="123">
    </div>
    
  </div>
    <?php $url = 'bui/common,bui/form,bui/picker,bui/select'?>
    <?php include("./templates/script.php"); ?>


    <!---->
    <script type="text/javascript" src="specs/issue/issue-62-spec.js"></script>
    <script type="text/javascript" src="specs/issue/issue-67-spec.js"></script>
    <script type="text/javascript" src="specs/issue/issue-109-spec.js"></script>
    <script type="text/javascript" src="specs/issue/issue-117-spec.js"></script>
    <script type="text/javascript" src="specs/issue/issue-102-spec.js"></script>
        <script type="text/javascript" src="specs/issue/issue-100-spec.js"></script>
    <script type="text/javascript" src="specs/issue/issue-127-spec.js"></script><!---->
    
    
<?php include("./templates/footer.php"); ?>