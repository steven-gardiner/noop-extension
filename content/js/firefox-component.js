
"use strict";

var component = function(spec, doc, env) {
  spec = spec || {};
  doc = doc || window.document;
  env = env || window.env;

  var self = {};

  self.spec = spec;

  self.localid = spec.localid || "component";
  self.document = doc;
  self.env = env;

  env = env || {};
  env.widget_prefix = env.widget_prefix || (env.extname + "-") || "";
  env.event_prefix = env.event_prefix || (env.extname + "-") || "";
  env.event_ns = env.event_ns || ("." + env.extname) || "";

  self.cleanup = [];

  self.toggleClass = function() {
    // noop by default;
  };
  self.on = function(eventName, handler, spec) {
    spec = spec || {};
    spec.eventName = eventName;
    spec.handler = handler;
    self.listeners.push(spec);
  };
  self.listeners = [];
  self.addListener = function(spec) {
    // noop by default;
  };

  self.getString = function(key) {
    // return a localized string within the extension

    if (window.strings && window.strings[key]) {
      return window.strings[key];
    }

    return [env.extname, key].join("_");
  };

  self.getAUID = function(suffix, infix) {
    infix = infix || "-";
    return [env.extname, suffix].join(infix);
  };

  self.getEventName = function(suffix,infix) {
    infix = infix || "-";
    var name = [self.auid, suffix].join(infix);
    console.log("EVENTNAME: " + name);
    return name;
  };

  self.resolveURL = function(suffix) {
    return ["chrome://",env.extname,suffix].join("");
  };

  self.cleanupUI = function(spec) {
    self.cleanup.forEach(function(cleaner) {
      cleaner.call(null);
    });
  };

  self.insertHandler = function(event,detail) {
    var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

    console.log("INSERT: " + JSON.stringify(env));

    if (detail.extname && (detail.extname !== env.extname)) {
      console.log("NOTIT");
      return true;
    }

    self.insertUI();
    self.listeners.forEach(function(listener) {
        self.addListener(listener);
    });
  };

  self.cleanupHandler = function(event,detail) {
    var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);
    console.log("CLEANUP: " + JSON.stringify({env:env,todo:self.cleanup.length}));
    if (detail.extname && (detail.extname !== env.extname)) {
      console.log("NOTIT");
      return true;
    }

    self.cleanupUI();
  };

  self.init = function(spec) {
    self.auid = self.getAUID(self.localid || "component");

    document.addEventListener("insert-mozilla-ui", self.insertHandler, false);
    document.addEventListener("cleanup-mozilla-ui", self.cleanupHandler, false);

    self.cleanup.push(function() {
      document.removeEventListener("insert-mozilla-ui", self.insertHandler, false);
      document.removeEventListener("cleanup-mozilla-ui", self.cleanupHandler, false);
    });
  };

  return self;
};
