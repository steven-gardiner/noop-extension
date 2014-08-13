
"use strict";

(function() {

  component.pagewatcherComponent = function(spec, doc, env) {
    spec = spec || {};
    spec.localid = spec.localid || "pagewatcher";
   
    var self = new component(spec, doc, env);
   
    self.loadevents = ["DOMContentLoaded", "load"];    
    
    self.emitLoad = function(event) {
      event.target.dispatchEvent(new CustomEvent(self.getEventName("load"), {bubbles:true,detail:{originalEvent:event}}));
    };

    self.insertUI = function(spec) {
      self.appcontent = self.document.querySelector("#appcontent");
      self.loadevents.forEach(function(loadevent) {
        self.appcontent.addEventListener(loadevent, self.emitLoad, false);
        self.cleanup.push(function() { self.appcontent.removeEventListener(loadevent, self.emitLoad, false); });
      });
    };

    self.init();

    return self;
  };

    return;

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
    cleanup = [];

    if (env.event_ns !== '') {
      jQuery(document).find("#appcontent").off(env.event_ns);
      jQuery(document).off(env.event_ns);
    }
  });
}());
