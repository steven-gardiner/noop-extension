
"use strict";

(function() {

  component.urlbariconComponent = function(spec, doc, env) {
    spec = spec || {};
    spec.localid = spec.localid || "contextitem";

    var self = new component(spec, doc, env);

    self.insertUI = function(spec) {

      self.icon = self.document.createElement("image");
 
      jQuery(self.icon).attr('id', self.auid);
      jQuery(self.icon).attr('tooltiptext', self.getString([self.auid,"tooltip"].join(".")));

      jQuery('#urlbar-icons').append(self.icon);
      self.cleanup.push(function() { jQuery(self.icon).detach(); });

      jQuery(self.icon).on('click', function(event) {
        self.icon.dispatchEvent(new CustomEvent(self.getEventName('click'),
                                                {bubbles:true,detail:{originalEvent:event}}));
      });

      var out = {"stylesheet": "firefox-urlbaricon.css",extname: self.env.extname};
      self.document.dispatchEvent(new CustomEvent('register-stylesheet', {detail:out}));                 
      
    };

    self.init();

    return self;
  };

}());
