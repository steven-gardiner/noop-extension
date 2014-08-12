
"use strict";

(function() {
  var env = window.env || {};
  env.widget_prefix = env.widget_prefix || (env.extname + "-") || "";
  env.event_prefix = env.event_prefix || (env.extname + "-") || "";
  env.event_ns = env.event_ns || ("." + env.extname) || "";

  var cleanup = [];

  jQuery(document).on('insert-mozilla-ui' + env.event_ns, function(event) {
    var button = document.createElement("toolbarbutton");

    //jQuery(button).text('foo');
    jQuery(button).attr('id', env.widget_prefix + 'button');
    jQuery(button).addClass('extension-button');

    jQuery("#nav-bar-customization-target").append(button);
    cleanup.push(function() { jQuery(button).detach(); });

    jQuery(button).on('click', function(event) {
      var outgoing = env.event_prefix + 'button-click';
      button.dispatchEvent(new CustomEvent(outgoing, {bubbles:true,detail:{originalEvent:event}}));      
    });

    var detail = {"stylesheet": "firefox-button.css"};
    document.dispatchEvent(new CustomEvent('register-stylesheet', {detail:detail}));           
  });

  jQuery(document).on('cleanup-mozilla-ui' + env.event_ns, function(event) {
    cleanup.forEach(function(cleaner) {
      cleaner.call(null);
    });

    if (env.event_ns !== '') {
      jQuery(document).off(env.event_ns);
    }
  });
}());
