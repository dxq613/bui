/**
 * @fileOverview 由于jQuery只有 parseJSON ，没有stringify所以使用过程不方便
 * @ignore
 */
define('bui/json',['bui/ua'],function (require) {

  var win = window,
    UA = require('bui/ua'),
    JSON = win.JSON;

  // ie 8.0.7600.16315@win7 json 有问题
  if (!JSON || UA['ie'] < 9) {
      JSON = win.JSON = {};
  }

  function f(n) {
      // Format integers to have at least two digits.
      return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {

      Date.prototype.toJSON = function (key) {

          return isFinite(this.valueOf()) ?
              this.getUTCFullYear() + '-' +
                  f(this.getUTCMonth() + 1) + '-' +
                  f(this.getUTCDate()) + 'T' +
                  f(this.getUTCHours()) + ':' +
                  f(this.getUTCMinutes()) + ':' +
                  f(this.getUTCSeconds()) + 'Z' : null;
      };

      String.prototype.toJSON =
          Number.prototype.toJSON =
              Boolean.prototype.toJSON = function (key) {
                  return this.valueOf();
              };
  }


  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {    // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"' : '\\"',
        '\\': '\\\\'
    },
    rep;

    function quote(string) {

      // If the string contains no control characters, no quote characters, and no
      // backslash characters, then we can safely slap some quotes around it.
      // Otherwise we must also replace the offending characters with safe escape
      // sequences.

      escapable['lastIndex'] = 0;
      return escapable.test(string) ?
          '"' + string.replace(escapable, function (a) {
              var c = meta[a];
              return typeof c === 'string' ? c :
                  '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
          }) + '"' :
          '"' + string + '"';
    }

    function str(key, holder) {

      // Produce a string from holder[key].

      var i,          // The loop counter.
          k,          // The member key.
          v,          // The member value.
          length,
          mind = gap,
          partial,
          value = holder[key];

      // If the value has a toJSON method, call it to obtain a replacement value.

      if (value && typeof value === 'object' &&
          typeof value.toJSON === 'function') {
          value = value.toJSON(key);
      }

      // If we were called with a replacer function, then call the replacer to
      // obtain a replacement value.

      if (typeof rep === 'function') {
          value = rep.call(holder, key, value);
      }

      // What happens next depends on the value's type.

      switch (typeof value) {
          case 'string':
              return quote(value);

          case 'number':

      // JSON numbers must be finite. Encode non-finite numbers as null.

              return isFinite(value) ? String(value) : 'null';

          case 'boolean':
          case 'null':

      // If the value is a boolean or null, convert it to a string. Note:
      // typeof null does not produce 'null'. The case is included here in
      // the remote chance that this gets fixed someday.

              return String(value);

      // If the type is 'object', we might be dealing with an object or an array or
      // null.

          case 'object':

      // Due to a specification blunder in ECMAScript, typeof null is 'object',
      // so watch out for that case.

              if (!value) {
                  return 'null';
              }

      // Make an array to hold the partial results of stringifying this object value.

              gap += indent;
              partial = [];

      // Is the value an array?

              if (Object.prototype.toString.apply(value) === '[object Array]') {

      // The value is an array. Stringify every element. Use null as a placeholder
      // for non-JSON values.

                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                      partial[i] = str(i, value) || 'null';
                  }

      // Join all of the elements together, separated with commas, and wrap them in
      // brackets.

                  v = partial.length === 0 ? '[]' :
                      gap ? '[\n' + gap +
                          partial.join(',\n' + gap) + '\n' +
                          mind + ']' :
                          '[' + partial.join(',') + ']';
                  gap = mind;
                  return v;
              }

      // If the replacer is an array, use it to select the members to be stringified.

              if (rep && typeof rep === 'object') {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                      k = rep[i];
                      if (typeof k === 'string') {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              } else {

      // Otherwise, iterate through all of the keys in the object.

                  for (k in value) {
                      if (Object.hasOwnProperty.call(value, k)) {
                          v = str(k, value);
                          if (v) {
                              partial.push(quote(k) + (gap ? ': ' : ':') + v);
                          }
                      }
                  }
              }

      // Join all of the member texts together, separated with commas,
      // and wrap them in braces.

              v = partial.length === 0 ? '{}' :
                  gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                      mind + '}' : '{' + partial.join(',') + '}';
              gap = mind;
              return v;
      }
  }

  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function (value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
          for (i = 0; i < space; i += 1) {
              indent += ' ';
          }

      // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
          indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
          (typeof replacer !== 'object' ||
              typeof replacer.length !== 'number')) {
          throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.

      return str('', {'': value});
      };
    }

  function looseParse(data){
    try{
      return new Function('return ' + data + ';')();
    }catch(e){
      throw 'Json parse error!';
    }
  }
 /**
	* JSON 格式化
  * @class BUI.JSON
	* @singleton
  */
  var JSON = {
    /**
     * 转成json 等同于$.parseJSON
     * @method
     * @param {String} jsonstring 合法的json 字符串
     */
    parse : $.parseJSON,
    /**
     * 业务中有些字符串组成的json数据不是严格的json数据，如使用单引号，或者属性名不是字符串
     * 如 ： {a:'abc'}
     * @method 
     * @param {String} jsonstring
     */
    looseParse : looseParse,
    /**
     * 将Json转成字符串
     * @method 
     * @param {Object} json json 对象
     */
    stringify : JSON.stringify
  }

  return JSON;
});