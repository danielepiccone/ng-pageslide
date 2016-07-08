angular
.module('pageslide-directive', [])
.directive('pageslide', ['$document', '$timeout',
    function ($document, $timeout) {
        var defaults = {};

        return {
            restrict: 'EAC',
            transclude: false,
            scope: {
                psOpen: '=?',
                psAutoClose: '@',
                psSide: '@',
                psSpeed: '@',
                psClass: '@',
                psSize: '@',
                psZindex: '@',
                psSqueeze: '@',
                psCloak: '@',
                psPush: '@',
                psMove: '@',
                psContainer: '@',
                psKeyListener: '@',
                psBodyClass: '@',
                psClickOutside: '@',
                onopen: '=',
                onclose: '='
            },
            link: function ($scope, el, attrs) {

                var param = {};

                param.side = $scope.psSide || 'right';
                param.speed = $scope.psSpeed || '0.5';
                param.size = $scope.psSize || '300px';
                param.zindex = $scope.psZindex || 1000;
                param.className = $scope.psClass || 'ng-pageslide';
                param.squeeze = $scope.psSqueeze === 'true';
                param.push = $scope.psPush === 'true';
                param.move = $scope.psMove === 'true';
                param.container = $scope.psContainer || false;
                param.keyListener = $scope.psKeyListener === 'true';
                param.bodyClass = $scope.psBodyClass || false;
                param.clickOutside = $scope.psClickOutside !== 'false';

                el.addClass(param.className);

                /* DOM manipulation */

                var content, slider, body, isOpen = false;

                body = param.container ? document.getElementById(param.container) : document.body;

                if (param.squeeze || param.push) {
                    body.style.position = 'absolute';
                    body.style.transitionDuration = param.speed + 's';
                    body.style.webkitTransitionDuration = param.speed + 's';
                    body.style.transitionProperty = 'top, bottom, left, right';
                }

                function onBodyClick(e) {
                    if(isOpen && !slider.contains(e.target)) {
                        isOpen = false;
                        $scope.psOpen = false;
                        $scope.$apply();
                    }

                    if($scope.psOpen) {
                        isOpen = true;
                    }
                }

                function setBodyClass(value){
                    if (param.bodyClass) {
                        var bodyClass = param.className + '-body';
                        var bodyClassRe = new RegExp(' ' + bodyClass + '-closed| ' + bodyClass + '-open');
                        body.className = body.className.replace(bodyClassRe, '');
                        body.className += ' ' + bodyClass + '-' + value;
                    }
                }

                setBodyClass('closed');

                slider = el[0];

                if (slider.tagName.toLowerCase() !== 'div' &&
                    slider.tagName.toLowerCase() !== 'pageslide')
                    throw new Error('Pageslide can only be applied to <div> or <pageslide> elements');

                if (slider.children.length === 0)
                    throw new Error('You need to have content inside the <pageslide>');

                content = angular.element(slider.children);

                /* Append */
                body.appendChild(slider);

                /* Style setup */
                slider.style.zIndex = param.zindex;
                slider.style.position = param.container !== false ? 'absolute' : 'fixed';
                slider.style.width = 0;
                slider.style.height = 0;
                slider.style.transitionDuration = param.speed + 's';
                slider.style.webkitTransitionDuration = param.speed + 's';
                slider.style.transitionProperty = 'width, height';

                if(param.move){
                    slider.style.width = param.size;
                    slider.style.height = param.size;
                    slider.style.transitionProperty = 'top, bottom, left, right';
                }

                function onTransitionEnd() {
                    if ($scope.psOpen) {
                        if (typeof $scope.onopen === 'function') {
                            $scope.onopen();
                        }
                    } else {
                        if (typeof $scope.onclose === 'function') {
                            $scope.onclose();
                        }
                    }
                }

                slider.addEventListener('transitionend', onTransitionEnd);

                switch (param.side) {
                    case 'right':
                        slider.style.height = attrs.psCustomHeight || '100%';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                    case 'left':
                        slider.style.height = attrs.psCustomHeight || '100%';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        break;
                    case 'top':
                        slider.style.width = attrs.psCustomWidth || '100%';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.top = attrs.psCustomTop || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                    case 'bottom':
                        slider.style.width = attrs.psCustomWidth || '100%';
                        slider.style.bottom = attrs.psCustomBottom || '0px';
                        slider.style.left = attrs.psCustomLeft || '0px';
                        slider.style.right = attrs.psCustomRight || '0px';
                        break;
                }


                /* Closed */
                function psClose(slider, param) {
                    if (slider && slider.style.width !== 0) {
                        if (!param.move) {
                            content.css('display', 'none');
                        }
                        switch (param.side) {
                            case 'right':
                                if (!param.move) {
                                    slider.style.width = '0px';
                                    if (param.squeeze) body.style.right = '0px';
                                    if (param.push) {
                                        body.style.right = '0px';
                                        body.style.left = '0px';
                                    }
                                }
                                else { 
                                    slider.style.right = "-" + slider.style.width;
                                }
                                break;
                            case 'left':
                                if (!param.move) {
                                    slider.style.width = '0px';
                                    if (param.squeeze) body.style.left = '0px';
                                    if (param.push) {
                                        body.style.left = '0px';
                                        body.style.right = '0px';
                                    }
                                }
                                else {
                                    slider.style.left = "-" + slider.style.width;
                                }
                                break;
                            case 'top':
                                if (!param.move) {
                                    slider.style.height = '0px';
                                    if (param.squeeze) body.style.top = '0px';
                                    if (param.push) {
                                        body.style.top = '0px';
                                        body.style.bottom = '0px';
                                    }
                                }
                                else {
                                    slider.style.top = "-" + slider.style.height;
                                }
                                break;
                            case 'bottom':
                                if (!param.move) {
                                    slider.style.height = '0px';
                                    if (param.squeeze) body.style.bottom = '0px';
                                    if (param.push) {
                                        body.style.bottom = '0px';
                                        body.style.top = '0px';
                                    }
                                }
                                else {
                                    slider.style.bottom = "-" + slider.style.height;
                                }
                                break;
                        }
                    }
                    if (param.keyListener) {
                        $document.off('keydown', handleKeyDown);
                    }

                    if (param.clickOutside) {
                        $document.off('click', onBodyClick);
                    }
                    isOpen = false;
                    setBodyClass('closed');
                    $scope.psOpen = false;
                }

                /* Open */
                function psOpen(slider, param) {
                    if (slider.style.width !== 0) {
                        switch (param.side) {
                            case 'right':
                                if (!param.move) {
                                    slider.style.width = param.size;
                                    if (param.squeeze) body.style.right = param.size;
                                    if (param.push) {
                                        body.style.right = param.size;
                                        body.style.left = '-' + param.size;
                                    }
                                }
                                else {
                                    slider.style.right = "0px";
                                }
                                break;
                            case 'left':
                                if (!param.move) {
                                    slider.style.width = param.size;
                                    if (param.squeeze) body.style.left = param.size;
                                    if (param.push) {
                                        body.style.left = param.size;
                                        body.style.right = '-' + param.size;
                                    }
                                }
                                else {
                                    slider.style.left = "0px";
                                }
                                break;
                            case 'top':
                                if (!param.move) {
                                    slider.style.height = param.size;
                                    if (param.squeeze) body.style.top = param.size;
                                    if (param.push) {
                                        body.style.top = param.size;
                                        body.style.bottom = '-' + param.size;
                                    }
                                }
                                else {
                                    slider.style.top = "0px";
                                }
                                break;
                            case 'bottom':
                                if (!param.move) {
                                    slider.style.height = param.size;
                                    if (param.squeeze) body.style.bottom = param.size;
                                    if (param.push) {
                                        body.style.bottom = param.size;
                                        body.style.top = '-' + param.size;
                                    }
                                }
                                else {
                                    slider.style.bottom = "0px";
                                }
                                break;
                        }

                        $timeout(function() {
                            content.css('display', 'block');
                        }, (param.speed * 1000));

                        $scope.psOpen = true;

                        if (param.keyListener) {
                            $document.on('keydown', handleKeyDown);
                        }

                        if (param.clickOutside) {
                            $document.on('click', onBodyClick);
                        }
                        setBodyClass('open');
                    }
                }

                function handleKeyDown(e) {
                    var ESC_KEY = 27;
                    var key = e.keyCode || e.which;

                    if (key === ESC_KEY) {
                        psClose(slider, param);

                        // FIXME check with tests
                        // http://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply

                        $timeout(function () {
                            $scope.$apply();
                        });
                    }
                }

                /*
                * Watchers
                * */

                $scope.$watch('psOpen', function(value) {
                    if (!!value) {
                        psOpen(slider, param);
                    } else {
                        psClose(slider, param);
                    }
                });

                $scope.$watch('psSize', function(newValue, oldValue) {
                    if (oldValue !== newValue) {
                        param.size = newValue;
                        if ($scope.psOpen) {
                            psOpen(slider, param);
                        }
                    }
                });

                /*
                * Events
                * */

                $scope.$on('$destroy', function () {
                    if (slider.parentNode === body) {
                        if (param.clickOutside) {
                            $document.off('click', onBodyClick);
                        }
                        body.removeChild(slider);
                    }

                    slider.removeEventListener('transitionend', onTransitionEnd);
                });

                if ($scope.psAutoClose) {
                    $scope.$on('$locationChangeStart', function() {
                        psClose(slider, param);
                    });
                    $scope.$on('$stateChangeStart', function() {
                        psClose(slider, param);
                    });
                }

            }
        };
    }
]);
