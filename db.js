// Generated by CoffeeScript 1.10.0
(function() {
  var ExpressPouchDB, Find, GeoPouch, QuickSearch, Validation, cors, path, pouchdb;

  path = require('path');

  pouchdb = require('pouchdb');

  Validation = require('pouchdb-validation');

  QuickSearch = require('pouchdb-quick-search');

  GeoPouch = require('geopouch');

  Find = require('pouchdb-find');


  /*
  lunr = require 'lunr'
  (require 'lunr-languages/lunr.stemmer.support') lunr
  (require 'lunr-languages/lunr.fr') lunr
   */

  cors = require('pouchdb-server/lib/cors');

  ExpressPouchDB = require('express-pouchdb');

  this.include = function() {
    var PouchDB, databases_dir, pouchDBApp, ref;
    databases_dir = (ref = this.cfg.databases_dir) != null ? ref : 'db/';
    PouchDB = pouchdb.defaults({
      prefix: path.join(__dirname, databases_dir)
    });
    PouchDB.plugin(Validation);
    PouchDB.plugin(QuickSearch);
    PouchDB.plugin(GeoPouch);
    PouchDB.plugin(Find);
    if (this.cfg.databases_path != null) {
      pouchDBApp = ExpressPouchDB(PouchDB, {
        mode: 'minimumForPouchDB',
        overrideMode: {
          include: ['config-infrastructure', 'logging-infrastructure', 'routes/authentication', 'routes/authorization', 'validation']
        }
      });
      this.app.use(this.cfg.databases_path, cors(pouchDBApp.couchConfig));
      this.app.use(this.cfg.databases_path, pouchDBApp);
    }
    return this.db = function(name) {
      var db;
      db = new PouchDB(name);
      db.installValidationMethods();
      return db;
    };
  };

}).call(this);