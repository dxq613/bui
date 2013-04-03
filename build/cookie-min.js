/**
 * @ignore
 * @fileOverview cookie
 * @author lifesinger@gmail.com
 */define("bui/cookie",function(){function i(e){return typeof e=="string"&&e!==""}var e=document,t=864e5,n=encodeURIComponent,r=decodeURIComponent,s={get:function(t){var n,s;return i(t)&&(s=String(e.cookie).match(new RegExp("(?:^| )"+t+"(?:(?:=([^;]*))|;|$)")))&&(n=s[1]?r(s[1]):""),n},set:function(r,s,o,u,a,f){var l=String(n(s)),c=o;typeof c=="number"&&(c=new Date,c.setTime(c.getTime()+o*t)),c instanceof Date&&(l+="; expires="+c.toUTCString()),i(u)&&(l+="; domain="+u),i(a)&&(l+="; path="+a),f&&(l+="; secure"),e.cookie=r+"="+l},remove:function(e,t,n,r){this.set(e,"",-1,t,n,r)}};return BUI.Cookie=s,s});
