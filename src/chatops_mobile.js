;(function() {
  "use strict";

  var mobileRoot = this;

  var _mobile = new Object();

  mobileRoot._mobile =  _mobile;
  _mobile.dialog = {
    close: function() {
      window.Android ? window.Android.close() :
      location.href = 'uyun-close://'
    }
  }
}.call(window));
