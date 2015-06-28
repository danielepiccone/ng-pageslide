# AngularJS Pageslide directive

An [AngularJS](http://angularjs.org/) directive which slides another panel over your browser to reveal an additional interaction pane.

It does all the css manipulation needed to position your content off canvas with html attibutes and it does not depend on jQuery

See it in action [HERE](http://dpiccone.github.io/ng-pageslide/examples/)

Examples in the repository.

[![Build Status](https://travis-ci.org/dpiccone/ng-pageslide.svg?branch=master)](https://travis-ci.org/dpiccone/ng-pageslide)

## Usage

Add this in your head

```
<script src="dist/angular-pageslide-directive.min.js"></script>
```

Use within your Angular app 

```
var app = angular.module("app", ["pageslide-directive"]);
```

Just use the ```<pageslide>``` element or attribute inside a controller scope like this:

please note that you need an outer controller to define the scope of your **checked** model

also you need an inner ```<div>``` to wrap your content in

```
<div ... ng-controller="yourCtrl">
    ...
    <pageslide ps-open="checked">
        <div>            
            <p>some random content...</p>
        </div>
    </pageslide>
    ...
</div>

```

### Options:

```
pageslide (required) 

ps-side (optional) = Where the panel should appear (right,left,top,bottom), if empty defaults to "right"
ps-open (optional) = Boolean true/false used to open and close the panel (optional)
ps-speed (optional) = The speed of the transition (optional)
ps-class (optional) = The class for the pageslide (default: "ng-pageslide")
ps-auto-close (optional) = true if you want the panel to close on location change
ps-size (optional) = desired height/width of panel (defaults to 300px)
ps-cloak (optional) = hides the content until the panel is open (defaults to true)

ps-push (optional) = push the main body to show the panel (defaults to false)*
ps-squeeze (optional) = squeeze body to fit the panel (defaults to false)*

ps-custom-height (optional) = custom CSS for panel height (only applicable in 'right' or 'left' panels)
ps-custom-top (optional) = custom CSS for panel top (only applicable in 'right', 'left' or 'top' panels)
ps-custom-bottom (optional) = custom CSS for panel bottom (only applicable in 'right', 'left' or 'bottom' panels)
ps-custom-left (optional) = custom CSS for panel left (only applicable in 'left', 'top' or 'bottom' panels)
ps-custom-right (optional) = custom CSS for panel right (only applicable in 'right', 'top' or 'bottom' panels)
ps-container (optional) = custom CSS ID selector to which the slider div appends (e.g: <div id='myDiv'/> -> ps-container="myDiv")
```

* these options make assumptions about the layout, will set body positioning to absolute

### Changelog

Version 1.0.0

- The directive is AEC and it works only for block elements
- Removed ps-target and href= for opening the pageslide
- Added ps-cloak and ps-squeeze

## Licensing

Licensed under [MIT](http://opensource.org/licenses/MIT)

## Author

2013, Daniele Piccone [www.danielepiccone.com](http://www.danielepiccone.com)
