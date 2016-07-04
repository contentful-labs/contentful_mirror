/* Magic Mirror
 * Module: Contentful Mirror
 *
 * By David Litvak Bruno (Contentful GmbH) https://contentful.com
 * MIT Licensed.
 */

Module.register("contentful_mirror", {
  defaults: {
    contentful: {
      space: "cfexampleapi",
      accessToken: "b4c0n73n7fu1",
      preview: false,
      query: {
        'content_type': 'cat'
      },
      template: "<h4>{{name}}</h4>\n" +
                "<img src='{{image.fields.file.url}}' />\n" +
                "<p class='xsmall normal'>Has {{lives}} lives.</p>\n"
    },
    maximumContentLength: 1000,
    updateInterval: 10000,
    fadeSpeed: 4000,
    displayText: "Loading..."
  },

  start: function() {
    Log.info("Starting module: " + this.name);

    this.displayText = this.config.displayText;

    this.sendSocketNotification("CREATE_CLIENT", {
      space: this.config.contentful.space,
      accessToken: this.config.contentful.accessToken,
      preview: this.config.contentful.preview
    });

    var self = this;
    setInterval(function() {
      self.updateDom(self.config.fadeSpeed);
    }, this.config.updateInterval);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "CLIENT_CREATED") {
      this.sendSocketNotification("GET_ENTRIES", {query: this.config.contentful.query});
    } else if (notification === "CONTENTFUL_ENTRIES_FETCHED") {
      if (payload.entries.items.length > 0) {
        this.entries = payload.entries;
        this.resolveIncludes();
      }
    } else if (notification === "FETCH_ERROR") {
      this.displayText = "Error fetching data";
      Log.error("Contentful Error. Could not fetch data.");
    } else {
      Log.log("Contentful Mirror received an unknown socket notification: " + notification);
    }

    this.updateDom(this.config.fadeSpeed);
  },

  resolveIncludes: function() {
    var includes = this.entries.includes;
    includes.Entry = includes.Entry || [];
    includes.Entry = includes.Entry.concat(this.entries.items).filter(function(value, index, self) {
      return self.indexOf(value) === index;
    });

    this.entries.items.forEach(function(entry) {
      Object.keys(entry.fields).forEach(function(key) {
        if (typeof entry.fields[key] === "object" &&
              entry.fields[key] !== null &&
              entry.fields[key].sys !== undefined) {
          var included = includes[entry.fields[key].sys.linkType].find(function(include) {
            return include.sys.id === entry.fields[key].sys.id;
          });
          entry.fields[key] = included;
        }
      });
    });
  },

  getRandomEntry: function() {
    return this.entries.items[Math.floor(Math.random() * this.entries.items.length)];
  },

  getField: function(entry, field_accessor) {
    var accessors = field_accessor.split(".");
    var field = null;
    var index_regex = /\[(\d+)\]/g;

    accessors.forEach(function (e) {
      var index = e.match(index_regex);
      if (index !== null) {
        index = index[1];
      }
      e = e.replace(index_regex, "");

      if (field === null) {
        field = entry.fields[e];
      } else if (field === undefined) {
        return field;
      } else {
        field = field[e];
      }

      if (typeof field === "array" && index !== null) {
        field[index];
      }
    }, this);

    return field;
  },

  getContentfulRepresentation: function() {
    if (this.entries !== undefined) {
      // We fetch a random entry
      var selected_entry = this.getRandomEntry();
      var template_regex = /\{\{\s*(?:\w+(?:\[\d+\])?\.?)+\s*\}\}/gm;

      var self = this;
      return this.config.contentful.template.replace(template_regex, function(match) {
        var field = self.getField(selected_entry, match.replace("{{", "").replace("}}", ""));

        if (typeof field === "string") {
          if (field.length > self.config.maximumContentLength) {
            field = field.substring(0, self.config.maximumContentLength) + "...";
          }

          if (field.search("\n")) {
            field = field.replace(/\n/g, "<br>");
          }
        }

        if (field === null || field === undefined) {
          field = "";
        }

        return field;
      });
    } else {
      return this.displayText;
    }
  },

  getDom: function() {
    var content =this.getContentfulRepresentation();
    var wrapper = document.createElement("div");
    wrapper.className = "contentful thin medium bright";
    wrapper.innerHTML = content;

    return wrapper;
  }
});
