
"use strict";

(function() {
  var env = window.env || {};
  env.widget_prefix = env.widget_prefix || (env.extname + "-") || "";
  env.event_prefix = env.event_prefix || (env.extname + "-") || "";
  env.event_ns = env.event_ns || ("." + env.extname) || "";

  var cleanup = [];

  jQuery(document).on('insert-mozilla-ui' + env.event_ns, function(event) {
    var menuitem = document.createElement("menuitem");

    //jQuery(button).text('foo');
    jQuery(menuitem).attr('label', 'foobar2');
    jQuery(menuitem).attr('id', env.widget_prefix + 'contextitem');
    jQuery(menuitem).addClass('extension-contextitem');

    jQuery("#contentAreaContextMenu").append(menuitem);
    cleanup.push(function() { jQuery(menuitem).detach(); });

    jQuery(menuitem).on('click', function(event) {
      var gcm = gContextMenu;
      var outgoing = env.event_prefix + 'context-click';
      document.dispatchEvent(new CustomEvent(outgoing, {bubbles:true,detail:{originalEvent:event,context:gcm}}));            
    });

    var detail = {"stylesheet": "firefox-contextitem.css"};
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
