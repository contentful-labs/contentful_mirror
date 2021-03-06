/* Magic Mirror
 * Node Helper: Contentful Mirror
 *
 * By David Litvak Bruno (Contentful GmbH) https://contentful.com
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var contentful = require("contentful");

module.exports = NodeHelper.create({
  start: function() {
    var self = this;

    this.clients = {};

    console.log("Starting node helper for: " + this.name);
  },

  createClient: function(indexKey, space, accessToken, preview) {
    console.log("Creating Contentful Client for: " + space);
    this.clients[indexKey] = contentful.createClient({
      space: space,
      accessToken: accessToken,
      preview: preview,
      resolveLinks: false
    });
  },

  getEntries: function(indexKey, space, query) {
    var self = this;

    this.clients[indexKey].getEntries(query)
    .then(function(entries) {
      self.sendSocketNotification("CONTENTFUL_ENTRIES_FETCHED", {indexKey: indexKey, space: space, entries: entries});
    })
    .catch(function(e) {
      console.log(e);
    });
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "CREATE_CLIENT") {
      this.createClient(payload.indexKey, payload.space, payload.accessToken);
      this.sendSocketNotification("CLIENT_CREATED");
    } else if (notification === "GET_ENTRIES") {
      this.getEntries(payload.indexKey, payload.space, payload.query);
    }
  },
});
