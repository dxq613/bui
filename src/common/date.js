/*
 * @fileOverview Date Format 1.2.3
 * @ignore
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 *
 * Last modified by jayli 拔赤 2010-09-09
 * - 增加中文的支持
 * - 简单的本地化，对w（星期x）的支持
 * 
 */
define('bui/date',function () {

    var dateRegex = /^(?:(?!0000)[0-9]{4}([-/.]+)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-/.]?)0?2\2(?:29))(\s+([01]|([01][0-9]|2[0-3])):([0-9]|[0-5][0-9]):([0-9]|[0-5][0-9]))?$/;
    function dateParse(val,format) {
        val=val+"";
        format=format==null||format===""?"yyyy-MM-dd":format;
        var i_val=0;
        var i_format=0;
        var c="";
        var token="";
        var token2="";
        var x,y;
        var now=new Date();
        var year=now.getYear();
        var month=now.getMonth()+1;
        var date=1;
        var hh=now.getHours();
        var mm=now.getMinutes();
        var ss=now.getSeconds();
        var ampm="";
        var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
        var _getInt = function (str, i, minlength, maxlength) {
                for (var x = maxlength; x >= minlength; x--) {
                    var token = str.substring(i, i + x);
                    if (token.length < minlength) {
                        return null;
                    }
                    if (_isInteger(token)) {
                        return token;
                    }
                }
                return null;
            },
            _isInteger = function (val) {
                var digits = "1234567890";
                for (var i = 0; i < val.length; i++) {
                    if (digits.indexOf(val.charAt(i)) == -1) {
                        return false;
                    }
                }
                return true;
            };

        while (i_format < format.length) {
            // Get next token from format string
            c=format.charAt(i_format);
            token="";
            while ((format.charAt(i_format)==c) && (i_format < format.length)) {
                token += format.charAt(i_format++);
            }
            // Extract contents of value based on format token
            if (token=="yyyy" || token=="yy" || token=="y") {
                if (token=="yyyy") { x=4;y=4; }
                if (token=="yy")   { x=2;y=2; }
                if (token=="y")    { x=2;y=4; }
                year=_getInt(val,i_val,x,y);
                if (year==null) { return 0; }
                i_val += year.length;
                if (year.length==2) {
                    if (year > 70) { year=1900+(year-0); }
                    else { year=2000+(year-0); }
                }
            }
            else if (token=="MMM"||token=="NNN"){
                month=0;
                for (var i=0; i<MONTH_NAMES.length; i++) {
                    var month_name=MONTH_NAMES[i];
                    if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
                        if (token=="MMM"||(token=="NNN"&&i>11)) {
                            month=i+1;
                            if (month>12) { month -= 12; }
                            i_val += month_name.length;
                            break;
                        }
                    }
                }
                if ((month < 1)||(month>12)){return 0;}
            }
            else if (token=="EE"||token=="E"){
                for (var i=0; i<DAY_NAMES.length; i++) {
                    var day_name=DAY_NAMES[i];
                    if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
                        i_val += day_name.length;
                        break;
                    }
                }
            }
            else if (token=="MM"||token=="M") {
                month=_getInt(val,i_val,token.length,2);
                if(month==null||(month<1)||(month>12)){return 0;}
                i_val+=month.length;}
            else if (token=="dd"||token=="d") {
                date=_getInt(val,i_val,token.length,2);
                if(date==null||(date<1)||(date>31)){return 0;}
                i_val+=date.length;}
            else if (token=="hh"||token=="h") {
                hh=_getInt(val,i_val,token.length,2);
                if(hh==null||(hh<1)||(hh>12)){return 0;}
                i_val+=hh.length;}
            else if (token=="HH"||token=="H") {
                hh=_getInt(val,i_val,token.length,2);
                if(hh==null||(hh<0)||(hh>23)){return 0;}
                i_val+=hh.length;}
            else if (token=="KK"||token=="K") {
                hh=_getInt(val,i_val,token.length,2);
                if(hh==null||(hh<0)||(hh>11)){return 0;}
                i_val+=hh.length;}
            else if (token=="kk"||token=="k") {
                hh=_getInt(val,i_val,token.length,2);
                if(hh==null||(hh<1)||(hh>24)){return 0;}
                i_val+=hh.length;hh--;}
            else if (token=="mm"||token=="m") {
                mm=_getInt(val,i_val,token.length,2);
                if(mm==null||(mm<0)||(mm>59)){return 0;}
                i_val+=mm.length;}
            else if (token=="ss"||token=="s") {
                ss=_getInt(val,i_val,token.length,2);
                if(ss==null||(ss<0)||(ss>59)){return 0;}
                i_val+=ss.length;}
            else if (token=="a") {
                if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
                else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
                else {return 0;}
                i_val+=2;}
            else {
                if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
                else {i_val+=token.length;}
            }
        }
        // If there are any trailing characters left in the value, it doesn't match
        if (i_val != val.length) { return 0; }
        // Is date valid for month?
        if (month==2) {
            // Check for leap year
            if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
                if (date > 29){ return 0; }
            }
            else { if (date > 28) { return 0; } }
        }
        if ((month==4)||(month==6)||(month==9)||(month==11)) {
            if (date > 30) { return 0; }
        }
        // Correct hours value
        if (hh<12 && ampm=="PM") { hh=hh-0+12; }
        else if (hh>11 && ampm=="AM") { hh-=12; }
        var newdate=new Date(year,month-1,date,hh,mm,ss);
        return newdate;
    }

    function   DateAdd(strInterval,   NumDay,   dtDate)   {   
        var   dtTmp   =   new   Date(dtDate);   
        if   (isNaN(dtTmp)){
            dtTmp   =   new   Date(); 
        }     
        switch   (strInterval)   {   
           case   's':
             dtTmp =   new   Date(dtTmp.getTime()   +   (1000   *   parseInt(NumDay))); 
             break; 
           case   'n':
             dtTmp =   new   Date(dtTmp.getTime()   +   (60000   *   parseInt(NumDay))); 
             break; 
           case   'h':
             dtTmp =   new   Date(dtTmp.getTime()   +   (3600000   *   parseInt(NumDay)));
             break;
           case   'd':
             dtTmp =   new   Date(dtTmp.getTime()   +   (86400000   *   parseInt(NumDay)));
             break;
           case   'w':
             dtTmp =   new   Date(dtTmp.getTime()   +   ((86400000   *   7)   *   parseInt(NumDay))); 
             break;
           case   'm':
             dtTmp =   new   Date(dtTmp.getFullYear(),   (dtTmp.getMonth())+parseInt(NumDay),   dtTmp.getDate(),   dtTmp.getHours(),   dtTmp.getMinutes(),   dtTmp.getSeconds());
             break;   
           case   'y':
             //alert(dtTmp.getFullYear());
             dtTmp =   new   Date(dtTmp.getFullYear()+parseInt(NumDay),   dtTmp.getMonth(),   dtTmp.getDate(),   dtTmp.getHours(),   dtTmp.getMinutes(),   dtTmp.getSeconds());
             //alert(dtTmp);
             break;
        }
        return dtTmp;
    }

    var dateFormat = function () {
        var token = /w{1}|d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) {
                    val = '0' + val;
                }
                return val;
            },
        // Some common format strings
            masks = {
                'default':'ddd MMM dd yyyy HH:mm:ss',
                shortDate:'m/d/yy',
                //mediumDate:     'mmm d, yyyy',
                longDate:'MMMM d, yyyy',
                fullDate:'dddd, MMMM d, yyyy',
                shortTime:'h:mm TT',
                //mediumTime:     'h:MM:ss TT',
                longTime:'h:mm:ss TT Z',
                isoDate:'yyyy-MM-dd',
                isoTime:'HH:mm:ss',
                isoDateTime:"yyyy-MM-dd'T'HH:mm:ss",
                isoUTCDateTime:"UTC:yyyy-MM-dd'T'HH:mm:ss'Z'",

                //added by jayli
                localShortDate:'yy年MM月dd日',
                localShortDateTime:'yy年MM月dd日 hh:mm:ss TT',
                localLongDate:'yyyy年MM月dd日',
                localLongDateTime:'yyyy年MM月dd日 hh:mm:ss TT',
                localFullDate:'yyyy年MM月dd日 w',
                localFullDateTime:'yyyy年MM月dd日 w hh:mm:ss TT'

            },

        // Internationalization strings
            i18n = {
                dayNames:[
                    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
                    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
                    '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'
                ],
                monthNames:[
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
                ]
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length === 1 && Object.prototype.toString.call(date) === '[object String]' && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date)) {
                throw SyntaxError('invalid date');
            }

            mask = String(masks[mask] || mask || masks['default']);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) === 'UTC:') {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? 'getUTC' : 'get',
                d = date[_ + 'Date'](),
                D = date[_ + 'Day'](),
                M = date[_ + 'Month'](),
                y = date[_ + 'FullYear'](),
                H = date[_ + 'Hours'](),
                m = date[_ + 'Minutes'](),
                s = date[_ + 'Seconds'](),
                L = date[_ + 'Milliseconds'](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:d,
                    dd:pad(d, undefined),
                    ddd:i18n.dayNames[D],
                    dddd:i18n.dayNames[D + 7],
                    w:i18n.dayNames[D + 14],
                    m:m,
                    mm:pad(m, undefined),
                    yy:String(y).slice(2),
                    yyyy:y,
                    h:H % 12 || 12,
                    hh:pad(H % 12 || 12, undefined),
                    H:H,
                    HH:pad(H, undefined),
                    M:M + 1,
                    MM:pad(M + 1, undefined),
                    MMM:i18n.monthNames[M],
                    MMMM:i18n.monthNames[M + 12],
                    s:s,
                    ss:pad(s, undefined),
                    l:pad(L, 3),
                    L:pad(L > 99 ? Math.round(L / 10) : L, undefined),
                    t:H < 12 ? 'a' : 'p',
                    tt:H < 12 ? 'am' : 'pm',
                    T:H < 12 ? 'A' : 'P',
                    TT:H < 12 ? 'AM' : 'PM',
                    Z:utc ? 'UTC' : (String(date).match(timezone) || ['']).pop().replace(timezoneClip, ''),
                    o:(o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:['th', 'st', 'nd', 'rd'][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

	/**
	* 日期的工具方法
	* @class BUI.Date
	*/
    var DateUtil = {
        /**
         * 日期加法
         * @param {String} strInterval 加法的类型，s(秒),n(分),h(时),d(天),w(周),m(月),y(年)
         * @param {Number} Num         数量，如果为负数，则为减法
         * @param {Date} dtDate      起始日期，默认为此时
         */
        add : function(strInterval,Num,dtDate){
            return DateAdd(strInterval,Num,dtDate);
        },
        /**
         * 小时的加法
         * @param {Number} hours 小时
         * @param {Date} date 起始日期
         */
        addHour : function(hours,date){
            return DateAdd('h',hours,date);
        },
         /**
         * 分的加法
         * @param {Number} minutes 分
         * @param {Date} date 起始日期
         */
        addMinute : function(minutes,date){
            return DateAdd('n',minutes,date);
        },
         /**
         * 秒的加法
         * @param {Number} seconds 秒
         * @param {Date} date 起始日期
         */
        addSecond : function(seconds,date){
            return DateAdd('s',seconds,date);
        },
        /**
         * 天的加法
         * @param {Number} days 天数
         * @param {Date} date 起始日期
         */
        addDay : function(days,date){ 
            return DateAdd('d',days,date);
        },
        /**
         * 增加周
         * @param {Number} weeks 周数
         * @param {Date} date  起始日期
         */
        addWeek : function(weeks,date){
            return DateAdd('w',weeks,date);
        },
        /**
         * 增加月
         * @param {Number} months 月数
         * @param {Date} date  起始日期
         */
        addMonths : function(months,date){
            return DateAdd('m',months,date);
        },
        /**
         * 增加年
         * @param {Number} years 年数
         * @param {Date} date  起始日期
         */
        addYear : function(years,date){
            return DateAdd('y',years,date);
        },
        /**
         * 日期是否相等，忽略时间
         * @param  {Date}  d1 日期对象
         * @param  {Date}  d2 日期对象
         * @return {Boolean}    是否相等
         */
        isDateEquals : function(d1,d2){

            return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
        },
        /**
         * 日期时间是否相等，包含时间
         * @param  {Date}  d1 日期对象
         * @param  {Date}  d2 日期对象
         * @return {Boolean}    是否相等
         */
        isEquals : function (d1,d2) {
            if(d1 == d2){
                return true;
            }
            if(!d1 || !d2){
                return false;
            }
            if(!d1.getTime || !d2.getTime){
                return false;
            }
            return d1.getTime() == d2.getTime();
        },
        /**
         * 字符串是否是有效的日期类型
         * @param {String} str 字符串
         * @return 字符串是否能转换成日期
         */
        isDateString : function(str){
            return dateRegex.test(str);
        },
        /**
         * 将日期格式化成字符串
         * @param  {Date} date 日期
         * @param  {String} mask 格式化方式
         * @param  {Date} utc  是否utc时间
         * @return {String}      日期的字符串
         */
        format:function (date, mask, utc) {
            return dateFormat(date, mask, utc);
        },
        /**
         * 转换成日期
         * @param  {String|Date} date 字符串或者日期
         * @param  {String} dateMask  日期的格式,如:yyyy-MM-dd
         * @return {Date}      日期对象
         */
        parse:function (date, s) {
            return dateParse(date, s);
        },
        /**
         * 当前天
         * @return {Date} 当前天 00:00:00
         */
        today : function(){
            var now = new Date();
            return new Date(now.getFullYear(),now.getMonth(),now.getDate());
        },
        /**
         * 返回当前日期
         * @return {Date} 日期的 00:00:00
         */
        getDate : function(date){
            return new Date(date.getFullYear(),date.getMonth(),date.getDate());
        }
    };

    return DateUtil;
});