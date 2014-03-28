/**
 * @fileOverview 自动计算坐标轴的坐标点、起始点，间距等信息
 * @ignore
 */

define('bui/chart/axis/auto',['bui/graphic'],function  (require) {
  
  var BUI = require('bui/common'),
    Util = require('bui/graphic').Util,
    snapArray = [0,1,1.5,2,2.5,3,4,5,6,8,10],
    intervalArray = [0,1,2.5,5,10],
    MIN_COUNT = 5, //最小6个坐标点
    MAX_COUNT = 7; //最多8个坐标点

  //是否为null
  function isNull(v){
    return v == null;
  }

  //获取系数
  function getFactor(v){
    var factor = 1;
    if(v < 1E-6){
      return factor;
    }
    while(v > 10){
      factor = factor * 10;
      v = v / 10;
    }

    while(v < 1){
      factor = factor / 10;
      v = v * 10;
    }
    return factor;
  }

  //获取逼近的数值
  function snapTo(v,isFloor,arr){ //假设 v = -512,isFloor = true

    arr =  arr || snapArray;
    var isMiddle = arr == snapArray ? false : true;

    var factor = 1; //计算系数
    if(v < 0){
      factor = -1;
    }
    v = v * factor;   //v = 512
    var tmpFactor = getFactor(v);
    factor = factor * tmpFactor;  // factor = -100

    v = v / tmpFactor; //v = 5.12

    if(isMiddle){
      v = snapMiddle(arr,v);
    }else if(isFloor && factor > 0){
      //小于
      v = Util.snapFloor(arr,v); //v = 5
    }else{
      v = Util.snapCeiling(arr,v); //v = 6
    }

    return v * factor;
  }

  function snapMiddle(arr,v){
    var big = v,
      little = v,
      rst = v;
    for (var i = 1; i < arr.length; i++) {
      var value = arr[i];
      if(value > v){
        big = value;
        break;
      }else{
        little = value;
      }
    };
    if(Math.abs(little - v) < Math.abs(big - v)){
      rst = little;
    }else{
      rst = big;
    }
    return rst;
  }

  function snapMultiple(v,base,ceil){
    //if(v > 0){
    if(ceil){
      var div = Math.ceil(v / base,10);
    }else{
      var div = Math.floor(v / base,10);
    }

    return div * base;
    
  }

  function tryFixed(v,base){
    var str = base.toString(),
      index = str.indexOf('.');
    if(index == -1){
      return v;
    }
    var length = str.substr(index + 1).length;
    return parseFloat(v.toFixed(length));
  }

  //分析数组
  function analyze(arr){
  
    var max = arr[0],
      min = arr[0],
      avg,
      total = arr[0],
      length = arr.length,
      deviation = 0,//偏差
      avg; 

    for (var i = 1; i < length; i ++) {
      var val = arr[i];
      if(max < val){
        max = val;
      }
      if(min > val){
        min = val;
      }
      total += val;

    };

    avg = total / length;

    for (var i = 0; i < length; i ++) {
      deviation += Math.abs(arr[i] - avg);
    };

    deviation = deviation / length;

    if(min == max){
      if(min > 0){
        min = 0;
      }else{
        max = 0;
      }
    }
    return {
      max : max,
      min : min,
      avg : avg,
      deviation : deviation
    };
  }

  //分析数据
  function analyzeData(data,parser,stacked){
    var arr = [];
    if(BUI.isArray(data[0])){
      if(stacked){
        BUI.each(data[0],function(value,index){
          var temp = value;
          for(var i = 1 ; i< data.length; i++){
            temp += data[i][index];
          }
          arr.push(temp);
        });
      }else{
        BUI.each(data,function(sub){
          arr = arr.concat(sub);
        });
      }
      
    }else{
      arr = data;
    }


    
    if(parser){
      arr = $.map(arr,parser);
    }

    return analyze(arr);

  }  

  /**
   * @class BUI.Chart.Axis.Auto
   * @private
   * 计算坐标轴的工具类
   */
  var Auto = {};

  /**
   * 计算坐标轴的信息
   * ** 初始信息 **
   * - data ： 多维数组， 需要渲染的数据
   * - min ： 坐标轴的最小值（可选）
   * - max : 坐标轴的最大值（可选）
   * - interval : 间距(可选)
   * @param  {Object} info 初始信息
   * @memberOf BUI.Chart.Axis.Auto
   * @return {Object} 计算后的信息
   */
  Auto.caculate = function(info,stackType){

    var 
      min = info.min,
      max = info.max,
      data = info.data,
      interval = info.interval,
      ticks = [],
      minCount = info.minCount || MIN_COUNT,
      maxCount = info.maxCount || MAX_COUNT,
      avgCount = (minCount + maxCount)/2,
      count,
      stacked = false;

    if(stackType) {
      if(stackType != 'none'){
        stacked = true;
      }
      if(stackType == 'percent'){
        min = 0;
        max = 100;
        interval = 25;
      }
    }


    if(isNull(min) || isNull(max) || isNull(interval)){

      var rst = analyzeData(data,null,stacked);

      //计算max
      if(isNull(max)){ 
        max = rst.max + 0.05 * (rst.max - rst.min);
      }

      //计算min
      if(isNull(min)){
        min = rst.min;
      }

      //计算间距
      if(isNull(interval)){
        var temp = (max - min) / avgCount ;// ( minCount -1); //防止方差过大
        if(rst.deviation > temp){
          interval = snapTo(temp,true,intervalArray);
        }else{
          if(rst.deviation){
            interval = snapTo(rst.deviation,true,intervalArray);
          }else{
            interval = snapTo(temp,true,intervalArray);
          }
          
        }
        
        count = parseInt((max - min) / interval,10);
        if(count > maxCount){
          count = maxCount;
        }
        if(count <  minCount){
          count = minCount;
        }

        interval = snapTo((max - min) / count,true,intervalArray) ;
        max = snapMultiple(max,interval,true);
        min = snapMultiple(min,interval);

        count = (max - min) / interval;
      }

    }

    //计算ticks
    if(isNull(count)){
      count = (max - min) / interval;
    }
    min = tryFixed(min,interval);
    if(!isNull(min)){
      ticks.push(min);
    }
    for(var i = 1 ; i <= count ;i++){
      ticks.push(tryFixed(interval * i + min,interval));
    }

    return {
      min : min,
      max : tryFixed(max,interval),
      interval : interval,
      count : count,
      ticks : ticks,
      info : rst
    }
  };

  /**
   * @memberOf BUI.Chart.Axis.Auto
   * 时间计算
   * @type {Object}
   */
  Auto.Time = {};

  var MINUTE_MS = 60 * 1000,
    HOUR_MS = 3600 * 1000,
    DAY_MS = 24 * 3600 * 1000;

  //将时间转换成天
  function floorDate(date){
    date = new Date(date);
    return BUI.Date.getDate(date).getTime();
  }

  function ceilDate(date){
    date = new Date(date);
    var temp = BUI.Date.getDate(date);
    if(!BUI.Date.isDateEquals(date,temp)){ //如果不是整天，则取整，添加一天
      temp = BUI.Date.addDay(1,temp);
    }
    return temp.getTime();;
  }

  function getYear(date){
    return new Date(date).getFullYear();
  }

  function createYear(year){
    return new Date(year,0,01).getTime();
  }

  function getMonth(date){
    return new Date(date).getMonth();
  }

  function diffMonth(min,max){
    var minYear = getYear(min),
      maxYear = getYear(max),
      minMonth = getMonth(min),
      maxMonth = getMonth(max);

    return (maxYear - minYear) * 12 + (maxMonth - minMonth)%12;
  }

  function creatMonth(year,month){
    return new Date(year,month,01).getTime();
  }

  function diffDay(min,max){
    return Math.ceil((max - min) / DAY_MS);
  }

  function diffHour(min,max){
    return Math.ceil((max - min) / HOUR_MS);
  }

  function diffMinus(min,max){
    return Math.ceil((max - min) / 60 * 1000);
  }

  //时间坐标轴自动计算
  Auto.Time.caculate = function(info){
    var min = info.min,
      max = info.max,
      data = info.data,
      interval = info.interval,
      ticks = [],
      count;
      


    if(isNull(min) || isNull(max) || isNull(interval)){
      var rst = analyzeData(data,function(date){
        if(BUI.isDate(date)){
          date = date.getTime();
        }
        if(BUI.isString(date)){
          date = date.replace(/-/ig,'/');
          date = new Date(date);
        }
        return date;
      });

      if(isNull(max)){
        max = rst.max;
      }

      if(isNull(min)){
        min = rst.min;
      }

      //如果间距大于一天
      if((max - min) > DAY_MS){ 
        min = floorDate(min);
        max = ceilDate(max);
      }
      if(max == min){
        throw 'max not  equal to min';
      }

      //计算间距
      if(isNull(interval)){
        var innerTime = max - min,
          dms = DAY_MS, //天代表的秒
          yms = 365 * dms, //年代表的秒
          yfactor,
          year; //占一年的多少

        interval = parseInt(innerTime / (info.maxCount || 8));
        yfactor = interval / yms;
        var minYear = getYear(min);
        //大于半年
        if(yfactor > 0.51){
          year = Math.ceil(yfactor);
          interval = year * yms;
          var maxYear = getYear(max);
            
          for(var i = minYear; i < maxYear + year; i = i + year){
            ticks.push(createYear(i));
          }
          interval = null;
        }else if(yfactor > 0.0834){//大于一个月
          var year = getYear(min),
            month = Math.floor(yfactor/0.0834),
            mmMoth = getMonth(min),
            dMonths = diffMonth(min,max);

          for(var i = 0; i <= dMonths + month; i = i + month){
            ticks.push(creatMonth(minYear, i+mmMoth));
          }
          interval = null;

        }else if(interval > dms){ //大于一天
          var date = new Date(min),
            year = date.getFullYear(),
            month = date.getMonth(min),
            mday = date.getDate(),
            day = Math.ceil(interval / dms),
            ddays = diffDay(min,max);
          interval = day * dms;
          for(var i = 0 ; i <= ddays + day; i = i + day){
            ticks.push(new Date(year,month,mday + i).getTime());
          }

        }else if(interval > HOUR_MS){ //大于一个小时
          var date = new Date(min),
            year = date.getFullYear(),
            month = date.getMonth(min),
            day = date.getDate(),
            hour = date.getHours(),
            hours = Math.ceil(interval / HOUR_MS),
            dHours = diffHour(min,max);
          interval = hours * HOUR_MS;

          for(var i = 0 ; i <= dHours + hours; i = i + hours){
            ticks.push(new Date(year,month,day,hour + i).getTime());
          }

        }else if(interval > MINUTE_MS) { //最小单位是分钟
          var dMinus = diffMinus(min,max),
            minutes = Math.ceil(interval / MINUTE_MS);
          interval = minutes * MINUTE_MS;

          for(var i = 0 ; i<= dMinus + minutes ; i = i + minutes){
            ticks.push(min + i * MINUTE_MS);
          }
        }else {
          if(interval < 1000){
            interval == 1000;
          }
          min = Math.floor(min / 1000) * 1000;
          var 
            dSeconds = Math.ceil((max - min) / 1000),
            seconds = Math.ceil(interval / 1000);
          interval = seconds * 1000;

          for(var i = 0; i< dSeconds + seconds; i = i + seconds){
            ticks.push(min + i * 1000);
          }
        }

      }

    }

    if(!ticks.length){
      min = Math.floor(min / 1000) * 1000;
      max = Math.ceil(max/1000) * 1000;
      var count = (max - min)/interval;
      for(var i = 0 ; i <= count ;i++){
        ticks.push(tryFixed(interval * i + min,interval));
      }
    }

    return {
      max : max,
      min : min,
      interval : interval,
      ticks : ticks,
      count : ticks.length
    }
  }

  return Auto;
});