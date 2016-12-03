describe('ng-pageslide: ', function() {
  'use strict';

  var $compile;
  var $timeout;
  var $document = jasmine.createSpyObj('$document', ['on', 'off']);
  var scope;
  var isolateScope;
  var element;
  var compilePageslide;

  beforeEach(function (done) {
    module('pageslide-directive', [
      '$provide',
      function ($provide) {
        $provide.value('$document', $document);
      }
    ]);
    compilePageslide = function (html) {
      inject([
        '$compile',
        '$rootScope',
        '$document',
        '$timeout',
        function(_$compile_, $rootScope, $document, _$timeout_){
          $compile = _$compile_;
          $timeout = _$timeout_;
          scope = $rootScope.$new();
          element = angular.element(html);
          $compile(element)(scope);
          scope.$digest();
          isolateScope = element.isolateScope();
        }
      ]);
    };
    done();
  });


  afterEach(function(){
    // try to clean Dom
    var slider = document.querySelector('.ng-pageslide');
    var pageslide = document.querySelector('#test-pageslide');
    document.body.innerHTML = '';
  });

  describe('initialization', function () {
    describe('when the element is invalid', function () {
      describe('because there is no content inside of the root element', function () {
        it('should throw an exception for no content', function (done) {
          expect(function () {compilePageslide('<pageslide></pageslide>');}).toThrow();
          done();
        });
      });
      describe('because the root element is not a div', function () {
        it('should throw an exception for no content', function (done) {
          expect(function () {compilePageslide('<p pageslide></p>');}).toThrow();
          done();
        });
      });
    });

    describe('when the element is valid', function () {
      describe('and has defined the container', function () {
        beforeEach(function (done) {
          angular.element(document.body).append('<div id="customContainer">custom container text</div>');
          compilePageslide([
            '<div pageslide ps-container="customContainer" ps-open="is_open">',
            '<div>test</div>',
            '</div>'
          ].join(''));
          done();
        });

        afterEach(function (done) {
          var customContainer = document.querySelector('#customContainer');
          document.body.removeChild(customContainer);
          done();
        });

        it('should contain the pageslide with the custom defined container', function (done) {
            expect(angular.element(document.querySelector('#customContainer')).html())
                .toContain('pageslide');
            done();
        });

        it('should set the position to relative', function (done) {
            var slider = document.querySelector('#customContainer');
            expect(angular.element(slider).css('position')).toEqual('relative');
            done();
        });
      });

      describe('and has defined the body class', function () {
        beforeEach(function (done) {
          document.body.className = 'foobar';
          compilePageslide([
            '<div pageslide ps-body-class="customBodyClass" ps-class="customBodyClass" ps-open="is_open">',
            '<div>test</div>',
            '</div>'
          ].join(''));
          done();
        });

        afterEach(function (done) {
          document.body.className = '';
          done();
        });

        it('should add the class to the pageslide element', function (done) {
          expect(angular.element(document.querySelector('.customBodyClass')).html()).toBeDefined();
          done();
        });

        it('should add the class to the body, defaulting to closed', function (done) {
          expect(document.body.className).toBe('foobar customBodyClass-body-closed');
          done();
        });
      });

      describe('and has set push to true', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<div pageslide ps-push="true" ps-open="is_open">',
            '<div>test</div>',
            '</div>'
          ].join(''));
          done();
        });

        it('should set the width ', function (done) {
          var body = angular.element(document.body);
          scope.is_open = true;
          scope.$digest();
          scope.is_open = false;
          scope.$digest();
          expect(body.css('right')).toEqual('0px');
          expect(body.css('left')).toEqual('0px');
          done();
        });
      });

      /*
      describe('when the psSize is set', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<pageslide ps-size="{{size}}" ps-open="is_open">',
            '<div>test</div>',
            '</pageslide>'
          ].join(''));
          done();
        });
        it('should set the size accordingly without opening the pageslide', function (done) {
          scope.is_open = false;
          scope.$digest();
          expect(isolateScope.psOpen).toEqual(false);
          scope.size = '150px';
          scope.$digest();
          expect(isolateScope.psOpen).toEqual(false);
          scope.is_open = true;
          scope.$digest();
          var body = angular.element(document.body);
          expect(body.html()).toContain('width: 150px;');
          done();
        });
        });
        */

      describe('when psAutoClose is set', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<pageslide ps-auto-close="true" ps-open="is_open">',
            '<div>test</div>',
            '</pageslide>'
          ].join(''));
          done();
        });
        it('should open on $locationChangeStart', function (done) {
          isolateScope.psOpen = true;
          scope.$broadcast('$locationChangeStart');
          expect(isolateScope.psOpen).toEqual(false);
          isolateScope.$digest();
          isolateScope.psOpen = true;
          scope.$broadcast('$stateChangeStart');
          expect(isolateScope.psOpen).toEqual(false);
          done();
        });
      });

      describe('when onopen is set', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<pageslide onopen="callback" ps-open="is_open">',
            '<div>test</div>',
            '</pageslide>'
          ].join(''));
          done();
        });
        it('should call onopen callback after transition', function (done) {
          scope.is_open = true;
          scope.callback = jasmine.createSpy('callback');
          scope.$digest();
          element[0].dispatchEvent(new Event('transitionend'));
          expect(scope.callback).toHaveBeenCalled();
          done();
        });
      });

      describe('when onclose is set', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<pageslide onclose="callback" ps-open="is_open">',
            '<div>test</div>',
            '</pageslide>'
          ].join(''));
          done();
        });
        it('should call onOpen callback after transition', function (done) {
          scope.is_open = false;
          scope.callback = jasmine.createSpy('callback');
          scope.$digest();
          element[0].dispatchEvent(new Event('transitionend'));
          expect(scope.callback).toHaveBeenCalled();
          done();
        });
      });

    });
  });

  describe('functionality', function () {
    describe('default/right pageslide', function () {
      it('Should attach the pageslide panel to <body>', function(done) {
        // Create template DOM for directive
        compilePageslide([
          '<div>',
          '<div pageslide ps-open="is_open" ps-speed="-1.5">',
          '<div id="target">',
          '<p>some random content...</p>',
          '<a id="target-close" href="#">Click to close</a>',
          '</div>',
          '</div>',
          '</div>'
        ].join(''));

        // Check for DOM Manipulation
        var el = document.querySelector('.ng-pageslide');
        var attached_to = el.parentElement.tagName;
        expect(attached_to).toBe('BODY');
        done();
      });

      it('Should open and close watching for ps-open', function (done) {
        // Create template DOM for directive
        compilePageslide([
          '<div>',
          '<div pageslide ps-open="is_open" ps-speed="0.5" href="#target">',
          '<div id="target">',
          '<p>some random content...</p>',
          '<a id="target-close" href="#">Click to close</a>',
          '</div>',
          '</div>',
          '</div>'
        ].join(''));

        var right;

        scope.is_open = true;
        scope.$digest();
        right = document.querySelector('.ng-pageslide').style.right;
        expect(right).toBe('0px');

        scope.is_open = false;
        scope.$digest();
        right = document.querySelector('.ng-pageslide').style.right;
        expect(right).toBe('-300px');
        done();
      });

      it('Should attach the pageslide inner content to <body>', function (done) {
        // Create template DOM for directive
        compilePageslide([
          '<pageslide ps-open="is_open">',
          '<div>',
          '<p>some random content...</p>',
          '</div>',
          '</pageslide>'
        ].join(''));

        // Check for DOM Manipulation
        var el = document.querySelector('.ng-pageslide');
        var attached_to = el.parentNode.localName;
        expect(attached_to).toBe('body');
        done();
      });

      it('Should remove slider when pageslide\'s scope be destroyed', function (done) {
        // Create template DOM for directive
        compilePageslide([
          '<div>',
          '<div pageslide ps-open="is_open" ps-speed="0.5" href="#target">',
          '<div id="target">',
          '<p>some random content...</p>',
          '<a id="target-close" href="#">Click to close</a>',
          '</div>',
          '</div>',
          '</div>'
        ].join(''));
        scope.is_open = true;
        scope.$digest();
        scope.$destroy();
        expect(isolateScope).toBeUndefined();
        done();
      });

      describe('when binding the key listener', function () {
        beforeEach(function (done) {
          // Create template DOM for directive
          compilePageslide([
            '<div>',
            '<div pageslide ps-open="is_open" ps-key-listener="true">',
            '<div id="target">',
            '<p>some random content...</p>',
            '<a id="target-close" href="#">Click to close</a>',
            '</div>',
            '</div>',
            '</div>'
          ].join(''));
          done();
        });
        describe('and the user presses the escape key', function () {
          describe('and the keyCode is populated', function () {
            it('should close the slider', function (done) {
              $document.on.and.callFake(function (actionType, callback) {
                callback({
                  keyCode: 27 //same as ESC_KEY
                });
              });
              scope.is_open = true;
              scope.$digest();
              expect($document.on).toHaveBeenCalled();
              expect(scope.is_open).toEqual(false);
              done();
            });
          });

          describe('and the "which" property is populated', function () {
            it('should close the slider', function (done) {
              $document.on.and.callFake(function (actionType, callback) {
                callback({
                  which: 27 //same as ESC_KEY
                });
              });
              scope.is_open = true;
              scope.$digest();
              expect($document.on).toHaveBeenCalled();
              expect(scope.is_open).toEqual(false);
              done();
            });
          });
        });

        describe('and the user presses a key thats not the escape key', function () {
          describe('and the keyCode is populated', function () {
            it('should close the slider', function (done) {
              $document.on.and.callFake(function (actionType, callback) {
                callback({
                  keyCode: 99 //random key
                });
              });
              scope.is_open = true;
              scope.$digest();
              expect($document.on).toHaveBeenCalled();
              expect(scope.is_open).toEqual(true);
              done();
            });
          });

          describe('and the "which" property is populated', function () {
            it('should close the slider', function (done) {
              $document.on.and.callFake(function (actionType, callback) {
                callback({
                  which: 99 //random key
                });
              });
              scope.is_open = true;
              scope.$digest();
              expect($document.on).toHaveBeenCalled();
              expect(scope.is_open).toEqual(true);
              done();
            });
          });
        });
      });
    });

    describe('left pageslide', function () {
      describe('by default', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<div>',
            '<div pageslide ps-open="is_open" ps-side="left">',
            '<div id="target">',
            '<p>some random content...</p>',
            '<a id="target-close" href="#">Click to close</a>',
            '</div>',
            '</div>',
            '</div>'
          ].join(''));
          done();
        });

        it('should set the appropriate styles', function (done) {
          // Check for DOM Manipulation
          var slider = angular.element(document.body);
          expect(slider.html()).toContain('height: 100%;');
          expect(slider.html()).toContain('top: 0px;');
          expect(slider.html()).toContain('bottom: 0px;');
          //when opening the slider
          scope.is_open = true;
          scope.$digest();
          expect(slider.html()).toContain('left: 0px;');
          //when closing the slider
          scope.is_open = false;
          scope.$digest();
          expect(slider.html()).toContain('left: -300px;');
          done();
        });
      });

      describe('when push is set', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<div>',
            '<div pageslide ps-open="is_open" ps-side="left" ps-push="true">',
            '<div id="target">',
            '<p>some random content...</p>',
            '<a id="target-close" href="#">Click to close</a>',
            '</div>',
            '</div>',
            '</div>'
          ].join(''));
          done();
        });

        // TODO this should check the body as well
        it('should set the appropriate styles', function (done) {
          // Check for DOM Manipulation
          var slider = angular.element(document.body);
          expect(slider.html()).toContain('height: 100%;');
          expect(slider.html()).toContain('top: 0px;');
          expect(slider.html()).toContain('bottom: 0px;');
          //when opening the slider
          scope.is_open = true;
          scope.$digest();
          expect(slider.html()).toContain('left: 0px;');
          //TODO: find out why these are not being set in the test
          // expect(slider.html()).toContain('left: 300px;');
          // expect(slider.html()).toContain('right: -300px;');
          //when closing the slider
          scope.is_open = false;
          scope.$digest();
          expect(slider.html()).toContain('left: -300px;');
          done();
        });
      });
    });

    describe('top pageslide', function () {
      describe('by default', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<div>',
            '<div pageslide ps-open="is_open" ps-side="top">',
            '<div id="target">',
            '<p>some random content...</p>',
            '<a id="target-close" href="#">Click to close</a>',
            '</div>',
            '</div>',
            '</div>'
          ].join(''));
          done();
        });

        it('should set the appropriate styles', function (done) {
          // Check for DOM Manipulation
          var slider = angular.element(document.body);
          expect(slider.html()).toContain('width: 100%;');
          expect(slider.html()).toContain('left: 0px;');
          expect(slider.html()).toContain('right: 0px;');
          //when opening the slider
          scope.is_open = true;
          scope.$digest();
          expect(slider.html()).toContain('top: 0px;');
          //when closing the slider
          scope.is_open = false;
          scope.$digest();
          expect(slider.html()).toContain('top: -300px;');
          done();
        });
      });

      describe('when push is set', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<div>',
            '<div pageslide ps-open="is_open" ps-side="top" ps-push="true">',
            '<div id="target">',
            '<p>some random content...</p>',
            '<a id="target-close" href="#">Click to close</a>',
            '</div>',
            '</div>',
            '</div>'
          ].join(''));
          done();
        });

        // TODO this should check the body as well
        it('should set the appropriate styles', function (done) {
          // Check for DOM Manipulation
          var slider = angular.element(document.body);
          expect(slider.html()).toContain('width: 100%;');
          expect(slider.html()).toContain('left: 0px;');
          expect(slider.html()).toContain('right: 0px;');
          //when opening the slider
          scope.is_open = true;
          scope.$digest();
          expect(slider.html()).toContain('top: 0px;');
          //TODO: find out why these are not being set in the test
          // expect(slider.html()).toContain('top: 300px;');
          // expect(slider.html()).toContain('bottom: -300px;');
          //when closing the slider
          scope.is_open = false;
          scope.$digest();
          expect(slider.html()).toContain('top: -300px;');
          done();
        });
      });
    });

    describe('bottom pageslide', function () {
      describe('by default', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<div>',
            '<div pageslide ps-open="is_open" ps-side="bottom">',
            '<div id="target">',
            '<p>some random content...</p>',
            '<a id="target-close" href="#">Click to close</a>',
            '</div>',
            '</div>',
            '</div>'
          ].join(''));
          done();
        });

        it('should set the appropriate styles', function (done) {
          // Check for DOM Manipulation
          var slider = angular.element(document.body);
          expect(slider.html()).toContain('width: 100%;');
          expect(slider.html()).toContain('left: 0px;');
          expect(slider.html()).toContain('right: 0px;');
          //when opening the slider
          scope.is_open = true;
          scope.$digest();
          expect(slider.html()).toContain('bottom: 0px;');
          //when closing the slider
          scope.is_open = false;
          scope.$digest();
          expect(slider.html()).toContain('bottom: -300px;');
          done();
        });
      });

      // TODO this hsould check the body as well
      describe('when push is set', function () {
        beforeEach(function (done) {
          compilePageslide([
            '<div>',
            '<div pageslide ps-open="is_open" ps-side="bottom" ps-push="true">',
            '<div id="target">',
            '<p>some random content...</p>',
            '<a id="target-close" href="#">Click to close</a>',
            '</div>',
            '</div>',
            '</div>'
          ].join(''));
          done();
        });

        it('should set the appropriate styles', function (done) {
          // Check for DOM Manipulation
          var slider = angular.element(document.body);
          expect(slider.html()).toContain('width: 100%;');
          expect(slider.html()).toContain('left: 0px;');
          expect(slider.html()).toContain('right: 0px;');
          //when opening the slider
          scope.is_open = true;
          scope.$digest();
          expect(slider.html()).toContain('bottom: 0px;');
          //TODO: find out why these are not being set in the test
          // expect(slider.html()).toContain('bottom: 300px;');
          // expect(slider.html()).toContain('top: -300px;');
          //when closing the slider
          scope.is_open = false;
          scope.$digest();
          expect(slider.html()).toContain('bottom: -300px;');
          done();
        });
      });
    });

    xit('Should sync ps-open state between pageslide\'s scope and parent scope', function () {
      //TODO: refactor code to properly assign isolateScope
      // Create template DOM for directive
      compilePageslide([
        '<div>',
        '<div pageslide="right" ps-open="is_open" ps-speed="0.5" href="#target">',
        '<div id="target">',
        '<p>some random content...</p>',
        '<a id="target-close" href="#">Click to close</a>',
        '</div>',
        '</div>',
        '</div>'
      ].join(''));

      scope.is_open = true;
      scope.$digest();

      expect(isolateScope.psOpen).toBe(true);

      scope.is_open = false;
      scope.$digest();

      expect(isolateScope.psOpen).toBe(false);
    });
  });
});
