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

    this.client = {};

    console.log("Starting node helper for: " + this.name);
  },

  createClient: function(space, accessToken, preview) {
    console.log("Creating Contentful Client for: " + space);
    this.client = contentful.createClient({
      space: space,
      accessToken: accessToken,
      preview: preview,
      resolveLinks: false
    });
  },

  getEntries: function(query) {
    var self = this;

    this.client.getEntries(query)
    .then(function(entries) {
      self.sendSocketNotification("CONTENTFUL_ENTRIES_FETCHED", {entries: entries});
    })
    .catch(function(e) {
      console.log(e);
    });
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "CREATE_CLIENT") {
      this.createClient(payload.space, payload.accessToken);
      this.sendSocketNotification("CLIENT_CREATED");
    } else if (notification === "GET_ENTRIES") {
      this.getEntries(payload.query);
    }
  },
});
