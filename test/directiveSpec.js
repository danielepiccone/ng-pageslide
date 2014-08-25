'use strict';

describe('ng-pageslide: ', function(){

    var $compile;
    var $rootScope;

    beforeEach(module('pageslide-directive'));

    beforeEach(inject(function(_$compile_,_$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    afterEach(function(){
        // try to clean Dom
        var slider = document.querySelector('.ng-pageslide');
        var pageslide = document.querySelector('[pageslide=right]');
        slider && document.body.removeChild(slider);
        pageslide && pageslide.parentNode.removeChild(pageslide);

    });

    it('Should attach the pageslide panel to <body>', inject(function(_$rootScope_){
        $rootScope = _$rootScope_;
        $rootScope.is_open = false;

        // Create template DOM for directive
        var html = (
            '<div>'
            + '<a pageslide="right" ps-open="is_open" ps-speed="0.5" href="#target">Link text</a>'
            + '<div id="target">'
            + '<p>some random content...</p>'
            + '<a id="target-close" href="#">Click to close</a>'
            + '</div>'
            + '</div>'
        );

        var elm = document.createElement('div');
        elm.innerHTML = html;
        document.body.appendChild(elm);

        // Compile DOM        
        var template = angular.element(elm);
        $compile(template)($rootScope);
        $rootScope.$apply();

        // Check for DOM Manipulation
        var el = document.querySelector('.ng-pageslide'); 
        var attached_to = el.parentNode.localName;
        expect(attached_to).toBe('body'); 

    }));

    
    it('Should open and close watching for ps-open', inject(function(_$rootScope_){
        $rootScope = _$rootScope_;
        $rootScope.is_open = true;
        $rootScope.$digest();

        // Create template DOM for directive
        var html = (
            '<div>'
            + '<a pageslide="right" ps-open="is_open" ps-speed="0.5" href="#target">Link text</a>'
            + '<div id="target">'
            + '<p>some random content...</p>'
            + '<a id="target-close" href="#">Click to close</a>'
            + '</div>'
            + '</div>'
        );

        var elm = document.createElement('div');
        elm.innerHTML = html;
        document.body.appendChild(elm);

        // Compile DOM        
        var template = angular.element(elm);
        $compile(template)($rootScope);
        $rootScope.$apply();

        var w = document.querySelector('.ng-pageslide').style.width;
        console.log(w);
        expect(w).toBe('300px');
        
        $rootScope.is_open = false;
        $rootScope.$apply();
        var w = document.querySelector('.ng-pageslide').style.width;
        console.log(w);
        expect(w).toBe('0px');

    }));

    it('Should sync ps-open state between pageslide\' scope and parent scope', inject(function(_$rootScope_){
        $rootScope = _$rootScope_;
        $rootScope.is_open = true;
        $rootScope.$digest();

        // Create template DOM for directive
        var html = (
            '<div>'
            + '<a pageslide="right" ps-open="is_open" ps-speed="0.5" href="#target">Link text</a>'
            + '<div id="target">'
            + '<p>some random content...</p>'
            + '<a id="target-close" href="#">Click to close</a>'
            + '</div>'
            + '</div>'
        );

        var elm = document.createElement('div');
        elm.innerHTML = html;
        document.body.appendChild(elm);

        // Compile DOM        
        var template = angular.element(elm);
        $compile(template)($rootScope);
        $rootScope.$apply();

        var pageslideScope = angular.element(document.querySelector('[pageslide]')).isolateScope();

        expect(pageslideScope.psOpen).toBe(true);
        
        $rootScope.is_open = false;
        $rootScope.$apply();

        expect(pageslideScope.psOpen).toBe(false);

        pageslideScope.psOpen = true;
        pageslideScope.$apply();
        expect($rootScope.is_open).toBe(true);

        pageslideScope.psOpen = false;
        pageslideScope.$apply();
        expect($rootScope.is_open).toBe(false);

    }));

    it('Should attach the pageslide inner content to <body>', inject(function(_$rootScope_){
        $rootScope = _$rootScope_;
        $rootScope.is_open = false;

        // Create template DOM for directive
        var html = (
            '<pageslide ps-open="is_open">'
            + '<div>'
            + '<p>some random content...</p>'
            + '</div>'
            + '</pageslide>'
        );

        var elm = document.createElement('div');
        elm.innerHTML = html;
        document.body.appendChild(elm);

        // Compile DOM        
        var template = angular.element(elm);
        $compile(template)($rootScope);
        $rootScope.$apply();

        // Check for DOM Manipulation
        var el = document.querySelector('.ng-pageslide'); 
        var attached_to = el.parentNode.localName;
        expect(attached_to).toBe('body'); 

    }));

    it('Should remove slider when pageslide\' scope be destroyed', inject(function(_$rootScope_){
        $rootScope = _$rootScope_;
        $rootScope.is_open = true;
        $rootScope.$digest();

        // Create template DOM for directive
        var html = (
            '<div>'
            + '<a pageslide="right" ps-open="is_open" ps-speed="0.5" href="#target">Link text</a>'
            + '<div id="target">'
            + '<p>some random content...</p>'
            + '<a id="target-close" href="#">Click to close</a>'
            + '</div>'
            + '</div>'
        );

        var elm = document.createElement('div');
        elm.innerHTML = html;
        document.body.appendChild(elm);

        // Compile DOM        
        var template = angular.element(elm);
        $compile(template)($rootScope);
        $rootScope.$apply();

        var pageslideScope = angular.element(document.querySelector('[pageslide]')).isolateScope();

        pageslideScope.$destroy();

    }));


});
