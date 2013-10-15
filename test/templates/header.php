<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title><?php echo $title?></title>
     <?php 
     if(!isset($base)){
       $base = '';
     } 
    ?>
    <link rel="stylesheet" href="<?php echo $base;?>../tools/jasmine/jasmine.css">
    <link href="<?php echo $base;?>../assets/css/dpl-min.css" rel="stylesheet">
    <link href="<?php echo $base;?>../assets/css/bui.css" rel="stylesheet">
    <script src="<?php echo $base;?>../tools/jasmine/jasmine.js"></script>
    <script src="<?php echo $base;?>../tools/jasmine/jasmine-html.js"></script>
    <script src="<?php echo $base;?>../tools/jasmine/event-simulate.js"></script>
  </head>
  <body>
  