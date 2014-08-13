var button1 = new component.buttonComponent({localid:"button"});
var button2 = new component.buttonComponent({localid:"button2"});
var contextitem1 = new component.contextitemComponent({localid:"contextitem"});
var pagewatcher = new component.pagewatcherComponent({localid:"pagewatcher"});

jQuery(document).on('noop-button-click.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NOOP BUTTON ' + detail.foo);
});
jQuery(document).on('noop-button2-click.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NOOP BUTTON2 ' + detail.foo);
});
jQuery(document).on('noop-context-click.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NOOP CONTEXT ' + detail.foo);
});
jQuery(document).on('noop-pagewatcher-load.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NEW PAGE ' + detail.foo);
});

jQuery(document).on('cleanup-mozilla-ui.noop', function(event) {
  jQuery(document).off('.noop');
});
