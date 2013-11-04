<?php  $title='日历测试';$css='calendar'; ?>
<?php include("./templates/header.php"); ?>

  <div class="container">
   
    <div class="row"> 
      <div class="span8">
        <h2>Panel</h2>
        <div id="c1" style="width:200px;height:200px">

        </div>
        <h2>Header</h2>
        <div id="c2" style="width:200px;height:200px">
          
        </div>
        <h2>整体 Calendar</h2>
        <div id="c3">
          
        </div>
        
          
       </div>
       <div class="span8">
        <h2>datepicker</h2>
        <p>多输入框共用一个日期选择器</p>
        <div class="well">
          <input type="text" id="d1" class="calendar"/><br>
        </div>
        <div class="well">
          <input type="text" id="d2" class="calendar"/><br>
        </div>
        <div class="well">
          <input type="text" id="d3" class="calendar"/><br>
        </div>
        <h2>monthpicker</h2>
        <div id="m1" style="position:relative;height:200px"></div>
      </div>
      <div class="span8">
        <h2>时间 Calendar</h2>
        <div id="c4"></div>
        <h2>时间选择</h2>
        <div class="well">
          <input type="text" id="dt1" class="calendar-time"/><br>
        </div>
        <h2>时间锁定</h2>
        <div class="well">
          <input type="text" id="lt1" class="calendar-time"/><br>
        </div>
      </div>
<div class="bui-bar bui-clear x-monthpicker-footer bui-bar-hover" role="toolbar" id="bar6" style="" aria-pressed="false"><button type="button" class="button button-small button-primary">确定</button></div>
</div>
    
    </div>
    <div id="c6"></div>
 </div>    
    
    <?php $url = 'bui/calendar'?>
    <?php include("./templates/script.php"); ?>
    <script type="text/javascript" src="../src/calendar/header.js"></script>
    <script type="text/javascript" src="../src/calendar/panel.js"></script>
    <script type="text/javascript" src="../src/calendar/calendar.js"></script>
    <script type="text/javascript" src="../src/calendar/datepicker.js"></script>
    <script type="text/javascript" src="../src/calendar/monthpicker.js"></script>
    <script type="text/javascript" src="../src/calendar/base.js"></script>
    <script type="text/javascript" src="specs/calendar-spec.js"></script>

<?php include("./templates/footer.php"); ?>