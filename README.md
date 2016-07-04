# Contentful Mirror

Contentful Module for the [Magic Mirror](https://github.com/MichMich/MagicMirror). It provides a view environment for Contentful entries.

## Contentful
[Contentful](http://www.contentful.com) is a content management platform for web applications,
mobile apps and connected devices. It allows you to create, edit & manage content in the cloud
and publish it anywhere via powerful API. Contentful offers tools for managing editorial
teams and enabling cooperation between organizations.

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute: `git clone https://github.com/contentful/contentful_mirror`. A new folder will appear, navigate into it.
2. Execute `npm install` to install the dependencies.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
  {
    module: 'contentful_mirror',
    position: 'top_center',  // This can be any of the regions. Best results in top_center.
    config: {
      // See 'Configuration options' for more information.
    }
  }
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
  <!-- why, markdown... -->
  <thead>
    <tr>
      <th>Option</th>
      <th width="100%">Description</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td><code>maximumContentLength</code></td>
      <td>Maximum Length for a field. Truncates after this point.<br>
        <br><b>Possible values:</b> any <code>int</code></code>
        <br><b>Default value:</b> <code>1000</code>
      </td>
    </tr>
    <tr>
      <td><code>updateInterval</code></td>
      <td>Speed of change between entries.<br>
        <br><b>Possible values:</b> any <code>int</code> (in miliseconds)
        <br><b>Default value:</b> <code>10000</code>
      </td>
    </tr>
    <tr>
      <td><code>fadeSpeed</code></td>
      <td>Speed of animation.<br>
        <br><b>Possible values:</b> any <code>int</code> (in miliseconds)
        <br><b>Default value:</b> <code>4000</code>
      </td>
    </tr>
    <tr>
      <td><code>displayText</code></td>
      <td>Text displayed while loading.<br>
        <br><b>Possible values:</b> any <code>string</code>
        <br><b>Default value:</b> <code>Loading...</code>
      </td>
    </tr>
    <tr>
      <td><code>contentful</code></td>
      <td>Contentful configuration<br>
        <br><b>Possible values:</b> <code>object</code>
        <br><b>Default value:</b> <code>Described below</code>
      </td>
    </tr>
  </tbody>
</table>

### Contentful Configuration Section

* Defaults:

```js
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
  }
```

<table width="100%">
  <!-- why, markdown... -->
  <thead>
    <tr>
      <th>Option</th>
      <th width="100%">Description</th>
    </tr>
  <thead>
  <tbody>
    <tr>
      <td><code>space</code></td>
      <td>Contentful Space ID.<br>
        <br><b>Possible values:</b> any <code>string</code></code>
        <br><b>Default value:</b> <code>cfexampleapi</code>
      </td>
    </tr>
    <tr>
      <td><code>accessToken</code></td>
      <td>Production (or Preview) Access Token. Use Preview Token if <code>preview</code> is enabled<br>
        <br><b>Possible values:</b> any <code>string</code>
        <br><b>Default value:</b> <code>b4c0n73n7fu1</code>
      </td>
    </tr>
    <tr>
      <td><code>preview</code></td>
      <td>Enables Preview API.<br>
        <br><b>Possible values:</b> <code>boolean</code>
        <br><b>Default value:</b> <code>false</code>
      </td>
    </tr>
    <tr>
      <td><code>query</code></td>
      <td>Contentful CDA Query for Entries endpoint. Content Type is advised to be always sent for templates to work.<br>
        <br><b>Possible values:</b> any <code>object</code>
        <br><b>Default value:</b> <code>{'content_type': 'cat'}</code>
      </td>
    </tr>
    <tr>
      <td><code>template</code></td>
      <td>HTML Template to display content in the mirror.<br>
        <br><b>Possible values:</b> any <code>string</code>
        <br><b>Default value:</b> <code>Described below</code>
      </td>
    </tr>
  </tbody>
</table>

### Templates

This module uses a very simple template engine. It basically fetches anything between a pair of braces e.g. `{{foo}}`, and sends it as a message to the `entry.fields` object.
You can chain as many messages as you want, and the engine will send them to the result.

For example:

If I have the following entry

```json
{
  "fields": {
    "foo": "bar",
    "baz": {
      "fields": {
        "nyan": "cat"
      }
    },
    "bar": [1, 2, 3]
  }
}
```

I could use inside my template `{{baz.fields.nyan}}` and it will render `cat`. Notice that past the first level of the entry, if there is a nested entry, you are required
to explicitly send the `fields` message.

The tool already does 1 level of link resolution, so if you have linked content, you can display it with this tool.

The templates can also handle array indexes, so if you could do `{{bar[1]}}` and will render `2`.

Link resolution does not work for arrays.

## Dependencies
- [contentful](https://www.npmjs.com/package/contentful) (installed by `npm install`)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/contentful/contentful_mirror. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
