# AngularJS Pageslide directive

An [AngularJS](http://angularjs.org/) directive which slides another panel over your browser to reveal an additional interaction pane.

It does all the css manipulation needed to position your content off canvas with html attibutes and it does not depend on jQuery

See it in action [HERE](http://dpiccone.github.io/ng-pageslide/examples/)

Examples in the repository.

## Usage

Add this in your head

```
<script src="src/angular-pageslide-directive.js"></script>
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

or you can use on you anchors referencing a ```<div>``` in your document like:

and yes, it can be used like an html element referencing a ```<div>``` also.

```
<pageslide="right" ps-speed="0.5" ps-target="#target" ps-open="checked"></pageslide>

<div id="target">            
    <p>some random content...</p>
</div>
```

or you can open close without a controller, just using a **target**:

```
<a pageslide href="#target">Link text</a>

<div id="target">            
    <p>some random content...</p>
    <a id="target-close" href="#">Click to close</a>
</div>
```

### Options:

```
pageslide (required) = Where the panel should appear (right,left,top,bottom), if empty defaults to "right"
ps-target (optional) = "#target" used when using pageslide as an element
ps-open (optional) = Boolean true/false used to open and close the panel (optional)
ps-speed (optional) = The speed of the transition (optional)
ps-class (optional) = The class for the pageslide (default: "ng-pageslide")
ps-auto-close (optional) = true if you want the panel to close on location change
ps-size (optional) = desired height/width of panel (defaults to 300px)
ps-custom-height (optional) = custom CSS for panel height (only applicable in 'right' or 'left' panels)
ps-custom-top (optional) = custom CSS for panel top (only applicable in 'right', 'left' or 'top' panels)
ps-custom-bottom (optional) = custom CSS for panel bottom (only applicable in 'right', 'left' or 'bottom' panels)
ps-custom-left (optional) = custom CSS for panel left (only applicable in 'left', 'top' or 'bottom' panels)
ps-custom-right (optional) = custom CSS for panel right (only applicable in 'right', 'top' or 'bottom' panels)
```

## Licensing

Licensed under [MIT](http://opensource.org/licenses/MIT)

## Author

2013, Daniele Piccone [www.danielepiccone.com](http://www.danielepiccone.com)
