jQuery(document).on('noop-button-click.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NOOP BUTTON ' + detail.foo);
});
jQuery(document).on('noop-context-click.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NOOP CONTEXT ' + detail.foo);
});
jQuery(document).on('noop-document-loaded.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NEW PAGE ' + detail.foo);
});

jQuery(document).on('cleanup-mozilla-ui.noop', function(event) {
  jQuery(document).off('.noop');
});
