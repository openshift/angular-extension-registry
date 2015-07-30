# angular-extension-registry
An angular module allowing arbitrary data to be injected &amp; rendered in UI.  There is a
data input component, and a data output component.  The `extensionInputProvider` handles input,
allowing you to name registries and assign configuration data to these registries.  The `extensionOutput`
directive (`<extension-output>`) handles the output by generating HTML representation.
It is an HTML element (or attribute) you can place in your view files to
compose a rendering of data.  It has two additional attributes for configuring the output.
The `extension-name="name name2"` will reference one or more named registries, and
the `extension-types="text link select html"` attribute lets you filter the types of outputs
rendered for that particular instance.  See the usage section below for an simple example.

## Usage

Include the minified script in your html file.  If you want to use the pre-compiled default
templates, include the additional template script.

```html
<script src="/path/to/angular-extension-registry/dist/angular-extension-registry.min.js"></script>
<script src="/path/to/angular-extension-registry/dist/compiled-templates.js"></script>
```

Then require the module in your app.  This is done in the typical Angular fashion:

```javascript

// require 'extension-registry'
angular.module('myapp', [
  'extension-registry'
])
```

Provide data during the initialization phase via the provider:

```javascript
// then configure via the extensionInputProvider
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {
    // create some data to register
    var fooExtensions = [
      {
        type: 'text',
        output: 'This is text only.',
        className: 'typography'
      },
      {
        type: 'link',
        link: 'http://google.com',
        target: '_blank',
        displayName: 'Google',
        className: 'external my-link'
      },
    ];
    // then register it to a named endpoint
    extensionInputProvider.register('foo', fooExtensions);
  }
]);
```

Or during the run phase via the service:

```javascript
angular.module('myapp')
  .factory('fooExtensionFactory', function() {
    return [
      {
        type: 'text',
        output: 'This is text only.',
        className: 'extension extension-pod'
      },
      {
        type: 'link',
        link: 'http://openshift.com',
        className: 'external my-link',
        displayName: 'Red Hat OpenShift'
      }
    ];
  })
  .run([
    '$timeout',
    'fooExtensionFactory',
    'extensionInput',
    function($timeout, fooExtensionFactory, extensionInput) {

      extensionInput.register('main', fooExtensionFactory);

      // simulate time passing, as if API call, then add additional data
      // directives will be notified of new data & will update if necessary
      $timeout(function() {
        extensionInput.register('main', fooExtensionFactory);
      }, 1000);

    }
  ]);


```


```html
<!--
  then drop an instance of the output directive into your html file,
  key it to the 'foo' name (multipe names can be referenced),
  and filter it to the extension type you will allow in this
  particular instance (built in: text, link, html, select box)
-->
<div
  extension-output
  extension-name="foo"
  extension-types="text link select html"></div>

```

### Registering multiple named inputs

Register an extension name like this:

```javascript
angular.module('myapp', [
  'extension-registry'
])
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {
    extensionInputProvider.register('sidebar-left');
  }
]);
```

Multiple can be registered like this:

```javascript
extensionInputProvider.register('sidebar-left');
extensionInputProvider.register('main');
extensionInputProvider.register('footer');
extensionInputProvider.register('foo');
extensionInputProvider.register('bar');
extensionInputProvider.register('shizzle');
```

### Providing data to a named registry

Each time you call `.register()` you can provide a data list (array)
like this:

```javascript
var dataArr = [ /* data, see formats below */ ];
extensionInputProvider.register('name', dataArr);
```

You can provide the data on the first call, or break it up into numerous calls,
depending on organization preference.  The point is that string keys are matched.

```javascript
extensionInputProvider.register('main');

var data = [{},{},{}],
    data2 = [ /* more stuff to register */ ];

// these can be independently deregistered, see next section
extensionInputProvider.register('main', data);
extensionInputProvider.register('main', data2);

```

### Keeping the config block clean and orderly

Angular allows multiple `.config` blocks to be defined for a module.  This can be done in
one file or in many.  It may be beneficial to break each named registry into a separate
block or file if there is a lot of extension data to register:

```javascript
angular.module('myapp', [
  'extension-registry'
])
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {
    // some configuration here...
  }
])
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {
    // some configuration here...
  }
])
.config([
  'extensionInputProvider',
  function(extensionInputProvider) {
    // some configuration here...
  }
]);
```


### Deregistering data for a registry

Each time you register data to a registry, the `.register()` function will return an object that
has a `.deregister()` function bound to that particular data set, allowing you to unregister that
block of data.  Calling `.deregister()` does not clear an entire registry, ONLY the data that was
registered in that data set.

```javascript
// a single registration, immediately deregistered
var someDataRegister = extensionInputProvider.register('sidebar-left', someData);
someDataRegister.deregister();

// or, if you collected the registries in an array:
var registries = [
  extensionInputProvider.register('foo', fooData),
  extensionInputProvider.register('bar', barData),
  extensionInputProvider.register('baz', bazData)
];
// this second registry to foo is not bound to the first
var fooData2Registry = extensionInputProvider.register('foo', fooData2);

// each item in the array will now be deregistered,
// BUT the 'foo' registry will still have the second instance of data
registries.forEach(function(registry) {
  registry.deregister();
});

// This will derigister the second group of data added to 'foo'
fooData2Registry.deregister();
```

### Using other services

One example of using other services in your extension is this:

```javascript
.run(function($timeout, fooService, extensionInput) {

  // registering a link that makes use of an external service
  extensionInput.register('sidebar-left', [
    {
      type: 'link',
      link: 'http://example.com',
      displayName: 'some link that does fancy stuff',
      fn: function() {
        fooService.doAsyncThing()
                    .then(function() {
                      // do other stuff....
                    });
      }
    }
  ]);
});

```


### Directive for output

The output directive can be configured in numerous ways.  The simplest is to
simply a single name & type:

```html
<!--
  only data from foo, all registries to foo will be
-->
<div
  extension-output
  extension-name="foo"
  extension-types="link"></div>
```

But the directive can pull data from multiple named endpoints and filter via any
of the provided types:

```html
<div
  extension-output
  extension-name="foo bar"
  extension-types="link text html select"></div>

```


### Template usage / overrides

The `/src/views/` directory houses the source html files used to generate templates.  These
are compiled into `/dist/compiled-templates.js`.  The script can be included to use the default
templates, **or** you can create your own overrides by making templates that match the template
path name.  Example: `__extension-link.html`.

These templates will need to be registered via Angular's templateCache.  The best way to do this
is with a build tool, such as gulp's `gulp-angular-templatecache` plugin.


### See the demo

Clone the project and run `npm install` and `bower install`.  Spin up a simple server in the root
directory however you see fit, such as `python -m SimpleHTTPServer` and navigate to the `/demo`
directory.  Experiment with the simple app registry setup.

