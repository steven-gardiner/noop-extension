
"use strict";

(function() {

  component.urlbariconComponent = function(spec, doc, env) {
    spec = spec || {};
    spec.localid = spec.localid || "urlbaricon";

    var self = new component(spec, doc, env);    

    self.insertUI = function(spec) {

      self.icon = self.document.createElement("image");
 
      jQuery(self.icon).attr('id', self.auid);
      jQuery(self.icon).attr('tooltiptext', self.getString([self.auid,"tooltip"].join(".")));
      if (self.spec && self.spec.css) {
        jQuery(self.icon).css(self.spec.css);
      }
      if (self.spec && self.spec.classes) {
        self.spec.classes.forEach(function(className) {
          jQuery(self.icon).addClass(className);
        });
      }

      jQuery('#urlbar-icons').append(self.icon);
      self.cleanup.push(function() { jQuery(self.icon).detach(); });

      jQuery(self.icon).on('click', function(event) {
        self.icon.dispatchEvent(new CustomEvent(self.getEventName('click'),
                                                {bubbles:true,detail:{originalEvent:event}}));
      });

      var out = {"stylesheet": "firefox-urlbaricon.css",extname: self.env.extname};
      self.document.dispatchEvent(new CustomEvent('register-stylesheet', {detail:out}));                 
      
    };

    self.toggleClass = function(classes, onoff) {
      jQuery(self.icon).toggleClass(classes, onoff);
    };

    self.init();

    return self;
  };

}());
