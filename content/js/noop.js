var button1 = new component.buttonComponent({localid:"button"});
var button2 = new component.buttonComponent({localid:"button2"});
var contextitem1 = new component.contextitemComponent({localid:"contextitem"});
var pagewatcher = new component.pagewatcherComponent({localid:"pagewatcher"});

var urlbaricon = new component.urlbariconComponent({localid:"urlbaricon"});

var sidebar = new component.sidebarComponent({shortcut:{key:'k'}});

button1.on('click', function(event, detail) {
  console.log('NOOP BUTTON1!!');
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NOOP BUTTON1 ' + detail.foo);
});
jQuery(document).on('noop-button-click.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('NOOP BUTTON ' + detail.foo);

  sidebar.show();
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
jQuery(document).on('noop-urlbaricon-click.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('URLBAR ' + detail.foo);
});

jQuery(document).on('noop-sidebar-show.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);
  
  console.log("SHOWING!");
  jQuery(document.documentElement).toggleClass("noop-sidebar-showing", true);

  //console.log("SHOWN: " + document.documentElement.outerHTML.slice(0,600));
});
jQuery(document).on('noop-sidebar-hide.noop', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);
  
  console.log("HIDING!");
  jQuery(document.documentElement).toggleClass("noop-sidebar-showing", false);
});

sidebar.on('click', function(event, detail) {
  var detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);

  console.log('SIDEBAR ' + jQuery(event.target).text());
  
}, {selector: "#noop-sidebar i"});

jQuery(document).on('cleanup-mozilla-ui.noop', function(event) {
  jQuery(document).off('.noop');
});

