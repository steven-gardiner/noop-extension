
"use strict";

(function() {

  component.contextitemComponent = function(spec, doc, env) {
    spec = spec || {};
    spec.localid = spec.localid || "contextitem";

    var self = new component(spec, doc, env);

    self.insertUI = function(spec) {      

      self.menuitem = self.document.createElement("menuitem");

      //jQuery(button).text('foo');
      jQuery(self.menuitem).attr('label', self.getString([self.auid,"label"].join(".")));
      jQuery(self.menuitem).attr('id', self.auid);
      jQuery(self.menuitem).addClass('extension-contextitem');

      jQuery("#contentAreaContextMenu").append(self.menuitem);
      self.cleanup.push(function() { jQuery(self.menuitem).detach(); });

      jQuery(self.menuitem).on('click', function(event) {
        var gcm = gContextMenu;
        self.document.dispatchEvent(new CustomEvent(self.getEventName('context-click'), 
                                                    {bubbles:true,detail:{originalEvent:event,context:gcm}}));            
      });

      var out = {"stylesheet": "firefox-contextitem.css",extname: self.env.extname};
      self.document.dispatchEvent(new CustomEvent('register-stylesheet', {detail:out}));           
    };

    self.init();

    return self;
  };

}());
