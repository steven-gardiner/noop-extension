

(function() {
  "use strict";

  component.buttonComponent = function(spec, doc, env) {
    spec = spec || {};
    spec.localid = spec.localid || "button";

    var self = new component(spec, doc, env);

    self.insertUI = function(spec) {
      self.button = self.document.createElement("toolbarbutton");
      
      //jQuery(button).text('foo');
      jQuery(self.button).attr('id', self.auid);
      jQuery(self.button).attr('tooltiptext', self.getString([self.auid,"tooltip"].join(".")));
      jQuery(self.button).addClass('extension-button');
      
      jQuery("#nav-bar-customization-target").append(self.button);
      self.cleanup.push(function() { jQuery(self.button).detach(); });
      
      jQuery(self.button).on('click', function(event) {
        self.button.dispatchEvent(new CustomEvent(self.getEventName("click"), {bubbles:true,detail:{originalEvent:event}}));      
      });

      self.document.dispatchEvent(new CustomEvent('register-stylesheet', {detail:{"stylesheet": "firefox-button.css",extname: self.env.extname}}));           
    };

    self.init();

    return self;
  };

}());
