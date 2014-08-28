
(function() {
  "use strict";

  component.keystrokeComponent = function(spec, doc, env) {
    spec = spec || {};
    spec.localid = spec.localid || "keystroke";    

    var self = new component(spec, doc, env);
    self.spec = spec;

    self.insertUI = function(spec) {
      self.key = self.document.createElement("key");

      jQuery(self.key).attr('id', self.auid);
      jQuery(self.key).attr('key', self.spec.key);
      jQuery(self.key).attr('modifiers', (self.spec.modifiers || 'shift accel'));

      jQuery(self.key).attr('oncommand', 'return true');

      jQuery(self.key).on('command', function(event) {
        self.key.dispatchEvent(new CustomEvent(self.getEventName("command"), {bubbles:true, detail:{originalEvent:event}}));;
      });

      jQuery("#mainKeyset").append(self.key);
      self.cleanup.push(function() { jQuery(self.key).detach(); });      
    };

    self.init();

    return self;
  };

}());
