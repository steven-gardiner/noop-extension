

(function() {
  "use strict";

  component.sidebarComponent = function(spec, doc, env) {
    spec = spec || {};
    spec.localid = spec.localid || "sidebar";

    var self = new component(spec, doc, env);
    self.sidebarurl = self.resolveURL(spec.sidebarurl || "/content/html/sidebar.html");
    self.shortcut = spec.shortcut;

    self.insertUI = function(spec) {
      self.broadcaster = self.document.createElement("broadcaster");
      
      jQuery(self.broadcaster).attr('id', self.auid);
      jQuery(self.broadcaster).attr('autoCheck', false);
      jQuery(self.broadcaster).attr('type', 'checkbox');
      jQuery(self.broadcaster).attr('group', 'sidebar');

      jQuery(self.broadcaster).attr('label', self.getString([self.auid,"label"].join(".")));
      jQuery(self.broadcaster).attr('sidebartitle', self.getString([self.auid,"sidebartitle"].join(".")));
      jQuery(self.broadcaster).attr('sidebarurl', self.sidebarurl);

      self.menuitem = self.document.createElement("menuitem");

      jQuery(self.menuitem).attr('id', [self.auid,'sidebarmenuitem'].join("."));
      jQuery(self.menuitem).attr('key', [self.auid,'sidebarkey'].join("."));
      jQuery(self.menuitem).attr('observes', self.auid);

      if (self.shortcut && self.shortcut.key) {
        self.shortcut.modifiers = self.shortcut.modifiers || 'shift accel';

        self.key = self.document.createElement("key");
        jQuery(self.key).attr('id', [self.auid,'sidebarkey'].join("."));
        jQuery(self.key).attr('key', self.shortcut.key);
        jQuery(self.key).attr('modifiers', self.shortcut.modifiers);

        jQuery(self.key).attr('oncommand', 'return true');

        jQuery(self.key).on('command', function() {
          jQuery(self.menuitem).trigger('command');
        });

        jQuery("#mainKeyset").append(self.key);
        self.cleanup.push(function() { jQuery(self.key).detach(); });      
      }

      jQuery(self.menuitem).on('command', function(event, detail) {
        var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail) || {};  
        var showing = (jQuery(self.broadcaster).attr("checked") === 'true');

        console.log("DOIT: " + JSON.stringify(detail));

        if (detail.show && (detail.show === showing)) {
          return;
        }

        window.toggleSidebar(self.auid);
      });

      self.sidebar = jQuery('browser#sidebar').get(0);
      self.observeChange = function(mutations) {
        //console.log("NOW: " + jQuery(self.sidebar).attr("src"));

        var src = jQuery(self.sidebar).attr("src");
        self.showing = (src === self.sidebarurl);
        
        var eventName = self.getEventName(self.showing ? "show" : "hide");
        var detail = {};
        self.document.dispatchEvent(new CustomEvent(eventName, {bubbles:true, detail:detail}));
      };
      self.watcher = new MutationObserver(self.observeChange);
      self.watcher.observe(self.sidebar, {attributes: true});
      
      jQuery("#mainBroadcasterSet").append(self.broadcaster);
      jQuery("#viewSidebarMenu").append(self.menuitem);

      self.cleanup.push(function() { jQuery(self.broadcaster).detach(); });
      self.cleanup.push(function() { jQuery(self.menuitem).detach(); });      

      self.document.dispatchEvent(new CustomEvent('register-stylesheet', {detail:{"stylesheet": "firefox-sidebar.css",extname: self.env.extname}}));           

      self.observeChange();

      return;
    };

    self.show = function(spec) {
      jQuery(self.menuitem).trigger("command", {show:true});
    };

    self.addListener = function(spec) {
      var prehandler = function(event, detail) {
        console.log("PREHANDLE: " + JSON.stringify({foo:12,showing: self.showing}));
        if (! self.showing) { 
          return;
        }
        prehandler.post.call(null, event, detail);
      };
      prehandler.post = spec.handler;
        
      jQuery(self.sidebar).on(spec.eventName, spec.selector, spec.data, prehandler);
    };

    self.init();

    return self;
  };

}());
