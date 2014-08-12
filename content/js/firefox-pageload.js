
"use strict";

(function() {
  var env = window.env || {};
  env.widget_prefix = env.widget_prefix || (env.extname + "-") || "";
  env.event_prefix = env.event_prefix || (env.extname + "-") || "";
  env.event_ns = env.event_ns || ("." + env.extname) || "";

  var cleanup = [];

  var loadevents = ["DOMContentLoaded","load"].map(function(loadevent) { return loadevent + env.event_ns; });
  jQuery(document).find("#appcontent").on(loadevents.join(" "), function(event) {
    var doc = (!! event.target.ownerDocument) ? event.target.ownerDocument : event.target;
  
    document.dispatchEvent(new CustomEvent(env.event_prefix + "document-loaded", {detail:{doc:doc}}));
  });

  jQuery(document).on('cleanup-mozilla-ui' + env.event_ns, function(event) {
    cleanup.forEach(function(cleaner) {
      cleaner.call(null);
    });

    if (env.event_ns !== '') {
      jQuery(document).find("#appcontent").off(env.event_ns);
      jQuery(document).off(env.event_ns);
    }
  });
}());
