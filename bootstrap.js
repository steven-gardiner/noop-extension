const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/AddonManager.jsm");

var boot = {};
boot.onOpenWindow = function(aWindow) {
  let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);  
  boot.onLoad = function listener() {
    domWindow.removeEventListener("load", boot.onLoad, false);

      // If this is a browser window then setup its UI
    if (domWindow.document.documentElement.getAttribute("windowtype") == "navigator:browser") {
      var callback = function() {
        if (boot.modules) {
          boot.injectModules(domWindow);
          boot.emit(domWindow.document, "insert-mozilla-ui");    
          boot.prefWatch.observeAll();
        } else {
          domWindow.setTimeout(callback, 100);
        }
      };
      callback.call();
    }
        
  };
  domWindow.addEventListener("load", boot.onLoad, false);
};
boot.onCloseWindow = function(aWindow) { };
boot.onWindowTitleChange = function() { };

function startup(data,reason) {
  let windows = Services.wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    var callback = function() {
      if (boot.modules) {
        boot.injectModules(domWindow);
        boot.emit(domWindow.document, "insert-mozilla-ui");
        boot.prefWatch.observeAll();
      } else {
        domWindow.setTimeout(callback, 100);
      }
    };
    callback.call();
  }

  Services.wm.addListener(boot);

  AddonManager.getAddonByID(data.id, function(addon) {
      
    var urlparts = addon.optionsURL.split(/\//);

    var extname = urlparts[2];

    var extprefix = urlparts.slice(0,3);
    var jsurl = extprefix.concat(["content",
                                  "js",
                                  "main.js"]).join('/');

    var ioService = Components.classes["@mozilla.org/network/io-service;1"]
      .getService(Components.interfaces.nsIIOService);
    var styleService = Components.classes["@mozilla.org/content/style-sheet-service;1"]
      .getService(Components.interfaces.nsIStyleSheetService);
    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
      .getService(Components.interfaces.nsIPrefService);

    boot.prefBranch = prefService.getBranch(["extensions", extname, ""].join("."));
    boot.prefWatch = {
      getPref: function(branch, key) {
        var prefType = branch.getPrefType(key);
        if (prefType == branch.PREF_STRING) { return branch.getCharPref(key); }
        if (prefType == branch.PREF_BOOL) { return branch.getBoolPref(key); }
        if (prefType == branch.PREF_INT) { return branch.getIntPref(key); }        
      },
      setPref: function(branch, key, val) {
        var prefType = branch.getPrefType(key);
        if (prefType == branch.PREF_STRING) { return branch.setCharPref(key, val); }
        if (prefType == branch.PREF_BOOL) { return branch.setBoolPref(key, val); }
        if (prefType == branch.PREF_INT) { return branch.setIntPref(key, val); }        
      },
      cache: {},
      observe: function(aSubject,aTopic,aData) { 
        //Services.console.logStringMessage("PREFCHANGE: " + aData);
        var detail = {};
        detail.key = aData;
        detail.oldval = this.cache[aData];
        detail.newval = this.getPref(aSubject, aData);
        this.cache[aData] = detail.newval;

        detail.prefs = this.cache;

        boot.windows.forEach(function(window) {
          boot.emit(window.document, 'mozilla-pref-change', detail);
        });
      },
      getPrefNames: function() {
        return boot.prefBranch.getChildList("",{});
      },
      observeAll: function() {
        boot.prefWatch.getPrefNames().forEach(function(name) {
          boot.prefWatch.observe(boot.prefBranch, null, name);
        });
      },
      handleSet: function(event, detail) {
        detail = detail || event.detail;
        boot.prefWatch.setPref(boot.prefBranch, detail.key, detail.val);
      },
      handleGet: function(event, detail) {
        detail = detail || event.detail;
        detail.val = boot.prefWatch.getPref(boot.prefBranch, detail.key);        
        if (detail.callback) {
          detail.callback.call(null, detail);
        } else {
          boot.prefWatch.observe(boot.prefBranch, null, detail.key);
        } 
      },
    };

    boot.prefBranch.addObserver("", boot.prefWatch, false);

 
    boot.modules = [];
    boot.windows = [];
    boot.stylesheets = [];
    boot.emit = function(doc, eventType, detail) {
      detail = detail || {};
      detail.extname = extname;
      var evt = doc.createEvent("CustomEvent");
      evt.initCustomEvent(eventType, true, false, detail);
      doc.dispatchEvent(evt);    
    };
    boot.require = function(module) {
      boot.modules.push(module);
    };
    boot.injectStylesheet = function(loc, handler) {
      if (! handler) { 
        handler = function(err) { 
          Services.console.logStringMessage(err);           
        }; 
      }
      try {
        var uristr = extprefix.concat(["skin",loc]).join("/");
        var uri = ioService.newURI(uristr, null, null);        
        if (! styleService.sheetRegistered(uri, styleService.AGENT_SHEET)) {
          boot.stylesheets.push(uri);
          styleService.loadAndRegisterSheet(uri, styleService.AGENT_SHEET);
        }      
      } catch (err) {
        handler(err);
      }
    };
    boot.handleStylesheet = function(event,detail) {
      detail = detail || event.detail || (event.originalEvent && event.originalEvent.detail);
      if (detail.extname && (detail.extname !== extname)) {
        return true;
      }
      boot.injectStylesheet(detail.stylesheet);
    };
    boot.injectModules = function(window) {
      window.document.addEventListener('register-stylesheet', boot.handleStylesheet, false);
      window.document.addEventListener('mozilla-get-pref', boot.prefWatch.handleGet, false);
      window.document.addEventListener('mozilla-set-pref', boot.prefWatch.handleSet, false);
      window.env = boot.env;
      boot.modules.forEach(function(module) {
        boot.inject(module, window);
      });
      boot.windows.push(window);                                                                
    };
    boot.inject = function(module, window, handler) {
      var modurl = addon.optionsURL.split(/\//).slice(0,3).join("/") + module;
      if (! handler) { 
        handler = function(err) { 
          Services.console.logStringMessage(err);           
        }; 
      }
      try {
        Services.scriptloader.loadSubScript(modurl, window, "UTF-8");
      } catch (err) {
        handler(err);
      }
    };
    boot.cleanup = function() {
      boot.windows.forEach(function(window) {
        boot.emit(window.document, "cleanup-mozilla-ui");          
        window.document.removeEventListener('register-stylesheet', boot.handleStylesheet, false);
      });
      boot.windows = [];
      delete boot.modules;
      boot.stylesheets.forEach(function(uri) {
        if (styleService.sheetRegistered(uri, styleService.AGENT_SHEET)) {
          styleService.unregisterSheet(uri, styleService.AGENT_SHEET);
        }
      });      
    };
    boot.env = {};
    boot.env.extname = extname;

    try {
      Services.scriptloader.loadSubScript(jsurl, boot, "UTF-8");
    } catch (ee) {
      Services.console.logStringMessage(ee); 
    }

  });

}

function shutdown(data, reason) {
  boot.cleanup();

  Services.wm.removeListener(boot);
  boot = null;
}

function install(data, reason) {
}

function uninstall(data, reason) {
}

